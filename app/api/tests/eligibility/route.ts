import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { checkTestEligibility } from "@/lib/tests/eligibility"

export async function POST(request: Request) {
  try {
    const supabase = await createClient()

    // Get authenticated user
    const {
      data: { session },
      error: sessionError,
    } = await supabase.auth.getSession()

    if (sessionError || !session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const userId = session.user.id
    const body = await request.json()
    const { testId } = body

    if (!testId) {
      return NextResponse.json({ error: "Missing testId parameter" }, { status: 400 })
    }

    console.log("[v0] Checking test eligibility:", { userId, testId })

    // Check eligibility
    const eligibility = await checkTestEligibility(userId, testId)

    console.log("[v0] Test eligibility result:", eligibility)

    return NextResponse.json(eligibility)
  } catch (error) {
    console.error("[v0] Test eligibility check error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
