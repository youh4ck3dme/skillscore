import { createServerClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"
import { getLocalizedField, getLanguageFromHeader } from "@/lib/i18n/get-localized-field"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const testId = searchParams.get("test_id")
    const tier = searchParams.get("tier") || "L1"

    if (!testId) {
      return NextResponse.json({ error: "test_id parameter is required" }, { status: 400 })
    }

    const acceptLang = request.headers.get("accept-language") || "sk"
    const lang = getLanguageFromHeader(acceptLang)

    const supabase = await createServerClient()

    let actualTestId = testId
    if (testId === "IT_SKILLS") {
      actualTestId = `IT_USER_${tier}`
    }

    const { data: test, error: testError } = await supabase
      .from("assessment_tests")
      .select("*")
      .eq("id", actualTestId)
      .single()

    if (testError || !test) {
      console.error("[v0] Test not found:", testError)
      return NextResponse.json({ error: "Test not found" }, { status: 404 })
    }

    const { data: questions, error: questionsError } = await supabase
      .from("assessment_questions")
      .select(
        `
        id,
        question_code,
        question_type,
        text,
        text_en,
        text_de,
        order_index,
        difficulty_level,
        topic,
        assessment_answer_options (
          id,
          text,
          text_en,
          text_de,
          is_correct,
          order_index
        )
      `,
      )
      .eq("test_id", actualTestId)
      .order("order_index", { ascending: true })

    if (questionsError) {
      console.error("[v0] Error fetching questions:", questionsError)
      return NextResponse.json({ error: "Failed to fetch questions" }, { status: 500 })
    }

    const transformedQuestions = questions?.map((q) => ({
      id: q.question_code,
      text: getLocalizedField<string>(q, "text", lang),
      question_type: q.question_type,
      options: q.assessment_answer_options
        ?.sort((a, b) => a.order_index - b.order_index)
        .map((opt) => ({
          text: getLocalizedField<string>(opt, "text", lang),
          is_correct: opt.is_correct,
        })),
    }))

    return NextResponse.json({
      test_id: actualTestId,
      name: getLocalizedField<string>(test, "name", lang),
      category: test.category,
      tier,
      questions: transformedQuestions || [],
    })
  } catch (error) {
    console.error("[v0] Error in tiered assessment questions route:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
