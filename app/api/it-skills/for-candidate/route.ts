import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { getITSkillsTestsForCandidate } from "@/lib/it-skills/it-skills-matcher"

export async function GET() {
  try {
    const supabase = await createClient()

    // Get authenticated user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get candidate profile with computer skills
    const { data: profile, error: profileError } = await supabase
      .from("candidate_profiles")
      .select("computer_skills, has_no_computer_skills")
      .eq("id", user.id)
      .single()

    if (profileError) {
      console.error("[v0] Error fetching candidate profile:", profileError)
      return NextResponse.json({ error: "Failed to fetch profile" }, { status: 500 })
    }

    // Check if candidate has no computer skills
    if (profile?.has_no_computer_skills === true) {
      return NextResponse.json({
        success: true,
        tests: [],
        total: 0,
        message: "Candidate has no computer skills",
      })
    }

    // Parse computer skills
    const computerSkills = profile?.computer_skills
      ? typeof profile.computer_skills === "string"
        ? JSON.parse(profile.computer_skills)
        : profile.computer_skills
      : []

    // Get matched IT skills tests
    const matches = getITSkillsTestsForCandidate(computerSkills)

    // Format response
    const tests = matches.map((match) => ({
      subcategory: match.subcategory,
      subcategory_name: match.subcategory_name,
      level: match.level,
      tools: match.tools,
      test_code: `test-it-skills-${match.subcategory}`,
      display_name: `IT Zručnosti: ${match.subcategory_name}`,
      duration_minutes: 20,
      description: `Test IT zručností pre oblasť ${match.subcategory_name} na úrovni ${match.level}`,
    }))

    return NextResponse.json({
      success: true,
      tests,
      total: tests.length,
    })
  } catch (error) {
    console.error("[v0] Error in it-skills/for-candidate:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
