import { createClient } from "@/lib/supabase/client"

export interface WorkflowTransition {
  from: string
  to: string
  condition?: (data: any) => boolean
  action?: (userId: string, data: any) => Promise<void>
}

export interface WorkflowDefinition {
  userType: "candidate" | "company" | "recruiter"
  states: string[]
  transitions: WorkflowTransition[]
  initialState: string
}

// Candidate workflow definition
export const CANDIDATE_WORKFLOW: WorkflowDefinition = {
  userType: "candidate",
  initialState: "registered",
  states: ["registered", "profile_completed", "basic_tests_completed", "ready_for_matching", "in_process", "employed"],
  transitions: [
    {
      from: "registered",
      to: "profile_completed",
      condition: (data) => data.profile_complete === true,
    },
    {
      from: "profile_completed",
      to: "basic_tests_completed",
      condition: (data) => data.basic_tests_count >= 2,
    },
    {
      from: "basic_tests_completed",
      to: "ready_for_matching",
      condition: (data) => data.profile_complete && data.basic_tests_count >= 2,
    },
    {
      from: "ready_for_matching",
      to: "in_process",
      condition: (data) => data.company_interest === true,
    },
    {
      from: "in_process",
      to: "employed",
      condition: (data) => data.employment_confirmed === true,
    },
  ],
}

// Company workflow definition
export const COMPANY_WORKFLOW: WorkflowDefinition = {
  userType: "company",
  initialState: "registered",
  states: [
    "registered",
    "contract_signed",
    "credits_purchased",
    "active_searching",
    "testing_candidates",
    "hiring_process",
  ],
  transitions: [
    {
      from: "registered",
      to: "contract_signed",
      condition: (data) => data.contract_signed === true,
    },
    {
      from: "contract_signed",
      to: "credits_purchased",
      condition: (data) => data.coin_balance >= 50,
    },
    {
      from: "credits_purchased",
      to: "active_searching",
      condition: (data) => data.searches_performed > 0,
    },
    {
      from: "active_searching",
      to: "testing_candidates",
      condition: (data) => data.tests_ordered > 0,
    },
    {
      from: "testing_candidates",
      to: "hiring_process",
      condition: (data) => data.contacts_revealed > 0,
    },
  ],
}

// Recruiter workflow definition
export const RECRUITER_WORKFLOW: WorkflowDefinition = {
  userType: "recruiter",
  initialState: "registered",
  states: ["registered", "contract_signed", "inviting_candidates", "inviting_companies", "active_recruiting"],
  transitions: [
    {
      from: "registered",
      to: "contract_signed",
      condition: (data) => data.contract_signed === true,
    },
    {
      from: "contract_signed",
      to: "inviting_candidates",
      condition: (data) => data.candidate_invitations > 0,
    },
    {
      from: "contract_signed",
      to: "inviting_companies",
      condition: (data) => data.company_invitations > 0,
    },
    {
      from: "inviting_candidates",
      to: "active_recruiting",
      condition: (data) => data.candidate_invitations > 0 && data.company_invitations > 0,
    },
    {
      from: "inviting_companies",
      to: "active_recruiting",
      condition: (data) => data.candidate_invitations > 0 && data.company_invitations > 0,
    },
  ],
}

export class WorkflowManager {
  private supabase

  constructor() {
    this.supabase = createClient()
  }

  private getWorkflowDefinition(userType: string): WorkflowDefinition {
    switch (userType) {
      case "candidate":
        return CANDIDATE_WORKFLOW
      case "company":
        return COMPANY_WORKFLOW
      case "recruiter":
        return RECRUITER_WORKFLOW
      default:
        throw new Error(`Unknown user type: ${userType}`)
    }
  }

  async initializeWorkflow(userId: string, userType: string) {
    const workflow = this.getWorkflowDefinition(userType)

    const { error } = await this.supabase.from("workflow_states").upsert({
      user_id: userId,
      user_type: userType,
      current_state: workflow.initialState,
      state_data: {},
      updated_at: new Date().toISOString(),
    })

    if (error) {
      console.error("Error initializing workflow:", error)
      throw error
    }
  }

  async updateWorkflowState(userId: string, userType: string, data: any) {
    const workflow = this.getWorkflowDefinition(userType)

    // Get current state
    const { data: currentWorkflow } = await this.supabase
      .from("workflow_states")
      .select("*")
      .eq("user_id", userId)
      .eq("user_type", userType)
      .single()

    if (!currentWorkflow) {
      await this.initializeWorkflow(userId, userType)
      return
    }

    const currentState = currentWorkflow.current_state

    // Check for possible transitions
    const possibleTransitions = workflow.transitions.filter((t) => t.from === currentState)

    for (const transition of possibleTransitions) {
      if (!transition.condition || transition.condition(data)) {
        // Execute transition
        const newStateData = { ...currentWorkflow.state_data, ...data }

        const { error } = await this.supabase
          .from("workflow_states")
          .update({
            current_state: transition.to,
            state_data: newStateData,
            updated_at: new Date().toISOString(),
          })
          .eq("user_id", userId)
          .eq("user_type", userType)

        if (error) {
          console.error("Error updating workflow state:", error)
          throw error
        }

        // Execute transition action if defined
        if (transition.action) {
          await transition.action(userId, newStateData)
        }

        break // Only execute first matching transition
      }
    }
  }

  async getWorkflowProgress(userId: string, userType: string) {
    const workflow = this.getWorkflowDefinition(userType)

    const { data: currentWorkflow } = await this.supabase
      .from("workflow_states")
      .select("*")
      .eq("user_id", userId)
      .eq("user_type", userType)
      .single()

    if (!currentWorkflow) {
      return {
        currentState: workflow.initialState,
        progress: 0,
        nextSteps: [],
      }
    }

    const currentStateIndex = workflow.states.indexOf(currentWorkflow.current_state)
    const progress = currentStateIndex >= 0 ? ((currentStateIndex + 1) / workflow.states.length) * 100 : 0

    const possibleTransitions = workflow.transitions.filter((t) => t.from === currentWorkflow.current_state)
    const nextSteps = possibleTransitions.map((t) => t.to)

    return {
      currentState: currentWorkflow.current_state,
      progress,
      nextSteps,
      stateData: currentWorkflow.state_data,
    }
  }
}

export async function updateCandidateWorkflow(userId: string, updates: any) {
  const manager = new WorkflowManager()
  await manager.updateWorkflowState(userId, "candidate", updates)
}

export async function updateCompanyWorkflow(userId: string, updates: any) {
  const manager = new WorkflowManager()
  await manager.updateWorkflowState(userId, "company", updates)
}

export async function updateRecruiterWorkflow(userId: string, updates: any) {
  const manager = new WorkflowManager()
  await manager.updateWorkflowState(userId, "recruiter", updates)
}
