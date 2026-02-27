import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { getLocalizedField, getLanguageFromHeader } from "@/lib/i18n/get-localized-field"

export async function GET(request: Request) {
  try {
    const supabase = await createClient()

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const acceptLang = request.headers.get("accept-language") || "sk"
    const lang = getLanguageFromHeader(acceptLang)

    const { searchParams } = new URL(request.url)
    const subcategory = searchParams.get("subcategory")
    const level = searchParams.get("level")

    if (!subcategory || !level) {
      return NextResponse.json({ error: "Missing subcategory or level parameter" }, { status: 400 })
    }

    const levelMap: Record<string, string> = {
      L1: "IT_USER_L1",
      L2: "IT_USER_L2",
      L3: "IT_USER_L3",
      L4: "IT_USER_L4",
    }

    const testId = levelMap[level.toUpperCase()]

    if (!testId) {
      return NextResponse.json({ error: "Invalid level" }, { status: 400 })
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
      .eq("test_id", testId)
      .order("order_index", { ascending: true })

    if (questionsError) {
      console.error("[v0] Error fetching questions:", questionsError)
      return NextResponse.json({ error: "Failed to fetch questions" }, { status: 500 })
    }

    if (!questions || questions.length === 0) {
      return NextResponse.json({ error: "No questions found for this test" }, { status: 404 })
    }

    const formattedQuestions = questions.map((q: any) => ({
      question_number: q.question_code,
      question_text: getLocalizedField<string>(q, "text", lang),
      question_type: q.question_type,
      options: q.assessment_answer_options
        .sort((a: any, b: any) => a.order_index - b.order_index)
        .map((opt: any) => ({
          text: getLocalizedField<string>(opt, "text", lang),
          is_correct: opt.is_correct,
        })),
    }))

    return NextResponse.json({
      success: true,
      subcategory: subcategory,
      subcategory_name: subcategory.replace(/_/g, " ").toUpperCase(),
      level: level,
      level_name: `Level ${level}`,
      questions: formattedQuestions,
      total_questions: formattedQuestions.length,
    })
  } catch (error) {
    console.error("[v0] Error in it-skills/questions:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
