import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export const dynamic = "force-dynamic"
export const maxDuration = 10

async function getCandidateIdFromAuth() {
  const supabase = await createClient()
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (error || !user) {
    throw new Error("Unauthorized")
  }

  return user.id
}

export async function GET(request: NextRequest) {
  try {
    const candidateId = await getCandidateIdFromAuth()
    const supabase = await createClient()

    const { data: assessmentTests, error: testsError } = await supabase
      .from("assessment_tests")
      .select("*")
      .eq("status", "published")
      .order("created_at", { ascending: true })

    if (testsError) {
      console.error("[v0] Error fetching assessment tests:", testsError)
      return NextResponse.json({ error: "Failed to fetch tests" }, { status: 500 })
    }

    const basic: any[] = []
    const advanced: any[] = []

    // TODO: Map assessment_tests to basic/advanced categories based on test metadata
    // TODO: Check candidate eligibility based on CV completion
    // TODO: Check attempt limits and cooldowns

    return NextResponse.json({
      basicTestsCard: {
        title: "Základné testy",
        description: "Testy na overenie základných zručností",
        items: basic,
      },
      advancedTestsCard: {
        title: "Pokročilé testy",
        description: "Pokročilé testy pre náskok",
        items: advanced,
      },
      message: "Tests will be available after configuration in Supabase",
    })
  } catch (error) {
    console.error("[v0] Error in /api/tests/available:", error)
    return NextResponse.json({ error: "Internal server error", details: String(error) }, { status: 500 })
  }
}
