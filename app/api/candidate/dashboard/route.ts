import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

const CACHE_TTL = 5000 // 5 seconds

export async function GET() {
  try {
    const supabase = await createClient()

    // Middleware already validated the user, no need to re-validate here
    const {
      data: { session },
      error: sessionError,
    } = await supabase.auth.getSession()

    if (sessionError || !session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const userId = session.user.id

    const [profileResult, candidateResult, testsResult] = await Promise.all([
      supabase.from("profiles").select("id, first_name, last_name, email").eq("id", userId).single(),
      supabase
        .from("candidate_profiles")
        .select(
          "work_experience, languages, computer_skills, cv_summary, auto_contact_enabled, work_experience_years, salary_expectation",
        )
        .eq("id", userId)
        .single(),
      supabase.from("tests").select("code, description"),
    ])

    const { data: profileData, error: profileError } = profileResult
    const { data: candidateProfile, error: candidateError } = candidateResult
    const { data: testsData, error: testsError } = testsResult

    if (profileError) {
      console.error("[v0] Profile query error:", profileError)
      if (profileError.code === "PGRST301" || profileError.message?.includes("rate limit")) {
        return NextResponse.json({ error: "Service temporarily unavailable" }, { status: 503 })
      }
      return NextResponse.json({ error: "Failed to fetch profile" }, { status: 500 })
    }

    // SECURITY: Validate that returned profile matches session user (case-insensitive email comparison)
    if (profileData.email && session.user.email && 
        profileData.email.toLowerCase() !== session.user.email.toLowerCase()) {
      console.error("[v0] SECURITY: Profile email mismatch!", {
        profileEmail: profileData.email,
        sessionEmail: session.user.email,
        profileId: profileData.id,
        sessionUserId: userId
      })
      // Use session data as fallback for safety
      profileData.email = session.user.email
      profileData.first_name = session.user.user_metadata?.first_name || "Používateľ"
      profileData.last_name = session.user.user_metadata?.last_name || ""
    }

    if (candidateError && candidateError.code !== "PGRST116") {
      console.error("[v0] Candidate profile query error:", candidateError)
      if (candidateError.message?.includes("rate limit")) {
        return NextResponse.json({ error: "Service temporarily unavailable" }, { status: 503 })
      }
    }

    const testDescriptions: Record<string, string> = {}
    if (testsData && !testsError) {
      testsData.forEach((test) => {
        testDescriptions[test.code] = test.description || ""
      })
    }

    const workExperience = candidateProfile?.work_experience
      ? typeof candidateProfile.work_experience === "string"
        ? JSON.parse(candidateProfile.work_experience)
        : candidateProfile.work_experience
      : []

    const cvSummary = candidateProfile?.cv_summary
      ? typeof candidateProfile.cv_summary === "string"
        ? JSON.parse(candidateProfile.cv_summary)
        : candidateProfile.cv_summary
      : null

    const isCVCompleted = cvSummary?.completed === true || (Array.isArray(workExperience) && workExperience.length > 0)

    const response = {
      profile: {
        first_name: profileData.first_name,
        last_name: profileData.last_name,
        email: profileData.email,
      },
      cv: {
        completed: isCVCompleted,
        progress: isCVCompleted ? 100 : 0,
        work_experience: workExperience,
        languages: candidateProfile?.languages || [],
        computer_skills: candidateProfile?.computer_skills || [],
        cv_summary: cvSummary,
      },
      contact_settings: {
        auto_contact_enabled: candidateProfile?.auto_contact_enabled || false,
      },
      stats: {
        tests_completed: 0,
        tests_available: 14,
        work_experience_years: candidateProfile?.work_experience_years || 0,
        salary_expectation: candidateProfile?.salary_expectation || null,
      },
      test_descriptions: testDescriptions,
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error("[v0] Dashboard API error:", error)
    if (error instanceof Error && error.message?.includes("rate limit")) {
      return NextResponse.json({ error: "Service temporarily unavailable" }, { status: 503 })
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
