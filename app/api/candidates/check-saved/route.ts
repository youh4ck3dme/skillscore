import { createClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"

export const dynamic = "force-dynamic"

export async function GET(request: NextRequest) {
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
      return NextResponse.json({ isSaved: false })
    }

    // Check if candidate is saved
    const { data, error } = await supabase
      .from("saved_candidates")
      .select("id")
      .eq("company_id", user.id)
      .eq("candidate_id", candidateId)
      .maybeSingle()

    if (error) {
      console.error("[v0] Error checking saved status:", error)
      return NextResponse.json({ isSaved: false })
    }

    return NextResponse.json({ isSaved: !!data })
  } catch (error) {
    console.error("[v0] API error:", error)
    return NextResponse.json({ isSaved: false })
  }
}
