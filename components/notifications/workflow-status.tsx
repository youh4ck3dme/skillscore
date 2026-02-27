"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, Circle, Clock, AlertTriangle } from "lucide-react"
import { useAuth } from "@/lib/auth/auth-context"

interface WorkflowState {
  current_state: string
  state_data: any
  updated_at: string
}

const CANDIDATE_WORKFLOW_STEPS = [
  { key: "registered", label: "Registrovaný", description: "Účet vytvorený" },
  { key: "profile_completed", label: "Profil dokončený", description: "CV a základné údaje vyplnené" },
  { key: "basic_tests_completed", label: "Základné testy", description: "Dokončené základné testy" },
  { key: "ready_for_matching", label: "Pripravený", description: "Pripravený na zaradenie do databázy" },
  { key: "in_process", label: "V procese", description: "Firma prejavila záujem" },
  { key: "employed", label: "Zamestnaný", description: "Úspešne zamestnaný" },
]

const COMPANY_WORKFLOW_STEPS = [
  { key: "registered", label: "Registrovaná", description: "Účet vytvorený" },
  { key: "contract_signed", label: "Zmluva podpísaná", description: "Zmluva o sprostredkovaní podpísaná" },
  { key: "credits_purchased", label: "Kredity zakúpené", description: "Minimálne 50% kreditov" },
  { key: "active_searching", label: "Aktívne vyhľadávanie", description: "Vyhľadávanie kandidátov" },
  { key: "testing_candidates", label: "Testovanie", description: "Prideľovanie testov kandidátom" },
  { key: "hiring_process", label: "Náborový proces", description: "Aktívny náborový proces" },
]

const RECRUITER_WORKFLOW_STEPS = [
  { key: "registered", label: "Registrovaný", description: "Účet vytvorený" },
  { key: "contract_signed", label: "Zmluva podpísaná", description: "Zmluva o sprostredkovaní podpísaná" },
  { key: "inviting_candidates", label: "Pozývanie kandidátov", description: "Aktívne pozývanie kandidátov" },
  { key: "inviting_companies", label: "Pozývanie firiem", description: "Aktívne pozývanie firiem" },
  { key: "active_recruiting", label: "Aktívny recruiting", description: "Spájanie kandidátov s firmami" },
]

export function WorkflowStatus() {
  const { user, userType } = useAuth()
  const [workflowState, setWorkflowState] = useState<WorkflowState | null>(null)
  const [loading, setLoading] = useState(true)

  const getWorkflowSteps = () => {
    switch (userType) {
      case "candidate":
        return CANDIDATE_WORKFLOW_STEPS
      case "company":
        return COMPANY_WORKFLOW_STEPS
      case "recruiter":
        return RECRUITER_WORKFLOW_STEPS
      default:
        return []
    }
  }

  const fetchWorkflowState = async () => {
    if (!user) return

    try {
      const response = await fetch("/api/workflow/status")
      if (response.ok) {
        const data = await response.json()
        setWorkflowState(data.workflowState)
      }
    } catch (error) {
      console.error("Error fetching workflow state:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchWorkflowState()
  }, [user])

  if (!user || loading) return null

  const steps = getWorkflowSteps()
  const currentStateIndex = steps.findIndex((step) => step.key === workflowState?.current_state)
  const progress = currentStateIndex >= 0 ? ((currentStateIndex + 1) / steps.length) * 100 : 0

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5" />
          Stav procesu
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Pokrok</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        <div className="space-y-3">
          {steps.map((step, index) => {
            const isCompleted = index <= currentStateIndex
            const isCurrent = index === currentStateIndex
            const isPending = index > currentStateIndex

            return (
              <div key={step.key} className="flex items-center gap-3">
                <div className="flex-shrink-0">
                  {isCompleted ? (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  ) : isCurrent ? (
                    <Clock className="h-5 w-5 text-blue-500" />
                  ) : (
                    <Circle className="h-5 w-5 text-muted-foreground" />
                  )}
                </div>

                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span
                      className={`font-medium ${
                        isCompleted ? "text-green-700" : isCurrent ? "text-blue-700" : "text-muted-foreground"
                      }`}
                    >
                      {step.label}
                    </span>
                    {isCurrent && (
                      <Badge variant="secondary" className="text-xs">
                        Aktuálne
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">{step.description}</p>
                </div>
              </div>
            )
          })}
        </div>

        {workflowState?.state_data?.next_action && (
          <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex items-start gap-2">
              <AlertTriangle className="h-4 w-4 text-blue-600 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-blue-900">Ďalší krok</p>
                <p className="text-xs text-blue-700">{workflowState.state_data.next_action}</p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
