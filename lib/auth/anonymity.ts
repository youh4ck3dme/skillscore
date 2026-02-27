import { createClient } from "@/lib/supabase/server"
import { generateAnonymousId as generateId, type UserType } from "@/lib/utils/display-name"

export type { UserType }

export function generateAnonymousId(): string {
  return generateId()
}

export interface AnonymousProfile {
  anonymous_id: string
  user_type: UserType
  // Only show relevant data based on viewer type
  display_data?: any
}

const DEV_MODE_MOCK_DATA = {
  candidate: {
    anonymous_id: "12345678",
    user_type: "candidate" as UserType,
    first_name: "Test",
    last_name: "Kandidát",
    email: "test-candidate@somviac.sk",
    languages: [{ language: "English", level: "Advanced" }],
    it_skills: [{ skill: "JavaScript", level: "Expert" }],
    work_experience: [{ profession: "Developer", years: 5 }],
  },
  company: {
    anonymous_id: "87654321",
    user_type: "company" as UserType,
    company_name: "Test Firma",
    email: "test-company@somviac.sk",
    industry: "IT",
    company_size: "50-100",
  },
  recruiter: {
    anonymous_id: "11223344",
    user_type: "recruiter" as UserType,
    first_name: "Test",
    last_name: "Recruiter",
    email: "test-recruiter@somviac.sk",
    specialization: "IT Recruitment",
    experience_years: 3,
  },
}

function isDevMode(): boolean {
  return process.env.NEXT_PUBLIC_DISABLE_AUTH === "true"
}

export async function getCurrentUser() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return null

  // Get user profile with anonymous_id
  const { data: profile } = await supabase
    .from("profiles")
    .select("*, anonymous_id, user_type")
    .eq("id", user.id)
    .single()

  return profile
}

export async function isOwnProfile(profileId: string, currentUserId?: string): Promise<boolean> {
  if (!currentUserId) return false
  return profileId === currentUserId
}

export async function getAnonymizedProfile(profileId: string, viewerType: UserType, currentUserId?: string) {
  const supabase = await createClient()
  const isOwn = await isOwnProfile(profileId, currentUserId)

  // If viewing own profile, return full data
  if (isOwn) {
    const { data: profile } = await supabase.from("profiles").select("*").eq("id", profileId).single()
    return profile
  }

  // Otherwise return anonymized data based on viewer type
  const { data: profile } = await supabase
    .from("profiles")
    .select("anonymous_id, user_type")
    .eq("id", profileId)
    .single()

  if (!profile) return null

  // Get additional data based on profile type and viewer permissions
  let additionalData = {}

  if (profile.user_type === "candidate") {
    // Candidates visible to companies and recruiters
    if (viewerType === "company" || viewerType === "recruiter") {
      const { data: candidateData } = await supabase
        .from("candidate_profiles")
        .select(`
          *,
          residence_country:countries!residence_country_id(name)
        `)
        .eq("id", profileId)
        .single()

      additionalData = candidateData || {}
    }
  } else if (profile.user_type === "company") {
    // Companies visible to candidates and recruiters
    if (viewerType === "candidate" || viewerType === "recruiter") {
      const { data: companyData } = await supabase
        .from("company_profiles")
        .select(`
          industry,
          company_size,
          country:countries!country_id(name)
        `)
        .eq("id", profileId)
        .single()

      additionalData = companyData || {}
    }
  } else if (profile.user_type === "recruiter") {
    // Recruiters visible to candidates and companies
    if (viewerType === "candidate" || viewerType === "company") {
      const { data: recruiterData } = await supabase
        .from("recruiter_profiles")
        .select("specialization, experience_years")
        .eq("id", profileId)
        .single()

      additionalData = recruiterData || {}
    }
  }

  return {
    anonymous_id: profile.anonymous_id,
    user_type: profile.user_type,
    ...additionalData,
  }
}
