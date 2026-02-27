import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { getWorkSkillsTestsForCandidate } from "@/lib/work-skills/work-skills-matcher"

export async function GET() {
  try {
    const supabase = await createClient()

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { data: profile, error: profileError } = await supabase
      .from("candidate_profiles")
      .select("cv_summary")
      .eq("id", user.id)
      .single()

    if (profileError) {
      return NextResponse.json({ error: "Failed to fetch profile" }, { status: 500 })
    }

    const workExperience = profile?.cv_summary?.work_experience || []

    const matches = getWorkSkillsTestsForCandidate(workExperience)

    const tests = matches.map((match) => ({
      family: match.family,
      role: match.role,
      level: match.level,
      confidence: match.confidence,
      test_code: `test-job-skills-${match.family}`,
      display_name: `Pracovné zručnosti: ${match.family}`,
      duration_minutes: 20,
      description: `Test pracovných zručností pre oblasť ${match.family} na úrovni ${match.level}`,
    }))

    return NextResponse.json({
      success: true,
      tests,
      total: tests.length,
    })
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
