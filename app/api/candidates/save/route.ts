import { createClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { candidateId, notes } = await request.json()

    // Get current user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Verify user is a company
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("user_type")
      .eq("id", user.id)
      .single()

    if (profileError || profile?.user_type !== "company") {
      return NextResponse.json({ error: "Only companies can save candidates" }, { status: 403 })
    }

    // Check if candidate exists
    const { data: candidate, error: candidateError } = await supabase
      .from("candidate_profiles")
      .select("id")
      .eq("id", candidateId)
      .single()

    if (candidateError || !candidate) {
      return NextResponse.json({ error: "Candidate not found" }, { status: 404 })
    }

    // Save the candidate
    const { data, error } = await supabase
      .from("saved_candidates")
      .insert({
        company_id: user.id,
        candidate_id: candidateId,
        notes: notes || null,
      })
      .select()
      .single()

    if (error) {
      // Check if already saved
      if (error.code === "23505") {
        return NextResponse.json({ error: "Candidate already saved" }, { status: 409 })
      }
      console.error("[v0] Error saving candidate:", error)
      return NextResponse.json({ error: "Failed to save candidate" }, { status: 500 })
    }

    return NextResponse.json({ success: true, data })
  } catch (error) {
    console.error("[v0] API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { searchParams } = new URL(request.url)
    const candidateId = searchParams.get("candidateId")

    if (!candidateId) {
      return NextResponse.json({ error: "Candidate ID is required" }, { status: 400 })
    }

    // Get current user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Delete the saved candidate
    const { error } = await supabase
      .from("saved_candidates")
      .delete()
      .eq("company_id", user.id)
      .eq("candidate_id", candidateId)

    if (error) {
      console.error("[v0] Error unsaving candidate:", error)
      return NextResponse.json({ error: "Failed to unsave candidate" }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0] API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()

    // Get current user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Verify user is a company
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("user_type")
      .eq("id", user.id)
      .single()

    if (profileError || profile?.user_type !== "company") {
      return NextResponse.json({ error: "Only companies can view saved candidates" }, { status: 403 })
    }

    // Get saved candidates with full candidate profile data
    const { data, error } = await supabase
      .from("saved_candidates")
      .select(
        `
        id,
        notes,
        saved_at,
        candidate_profiles!inner(
          id,
          languages,
          computer_skills,
          work_experience_years,
          education_level,
          cv_summary,
          availability_date,
          salary_expectation,
          work_country_preferences,
          anonymous_id,
          countries!residence_country_id(
            name,
            code
          ),
          profiles!inner(
            id,
            user_type
          )
        )
      `,
      )
      .eq("company_id", user.id)
      .order("saved_at", { ascending: false })

    if (error) {
      console.error("[v0] Error fetching saved candidates:", error)
      return NextResponse.json({ error: "Failed to fetch saved candidates" }, { status: 500 })
    }

    // Transform the data to match the expected format
    const savedCandidates = data.map((item) => ({
      savedId: item.id,
      notes: item.notes,
      savedAt: item.saved_at,
      ...item.candidate_profiles,
      user_type: "candidate",
    }))

    return NextResponse.json({ candidates: savedCandidates })
  } catch (error) {
    console.error("[v0] API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
