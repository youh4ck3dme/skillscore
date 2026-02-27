import { type NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase/server"

export const dynamic = "force-dynamic"

export async function GET(request: NextRequest) {
  try {
    const supabase = await createServerClient()

    // Get current user
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()

    if (userError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Fetch all test results for this candidate
    const { data: results, error } = await supabase
      .from("language_test_results")
      .select("*")
      .eq("candidate_id", user.id)
      .eq("passed", true)
      .order("completed_at", { ascending: false })

    if (error) {
      console.error("[v0] Error fetching test results:", error)
      return NextResponse.json({ error: "Failed to fetch test results" }, { status: 500 })
    }

    // Group by language and get the highest level passed for each
    const languageResults: Record<string, any> = {}

    results?.forEach((result) => {
      const lang = result.target_lang
      if (!languageResults[lang] || result.level > languageResults[lang].level) {
        languageResults[lang] = result
      }
    })

    return NextResponse.json({ results: Object.values(languageResults) })
  } catch (error) {
    console.error("[v0] Error in language-tests/results:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
