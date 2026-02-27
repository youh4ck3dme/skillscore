import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export const dynamic = "force-dynamic"

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const searchParams = request.nextUrl.searchParams
    const language = searchParams.get("language")?.toLowerCase()
    const level = searchParams.get("level")?.toLowerCase()

    if (!language || !level) {
      return NextResponse.json({ error: "Missing parameters" }, { status: 400 })
    }

    const testId = `LANGUAGE_${language.toUpperCase()}_${level.toUpperCase()}`

    const { data: questions, error: questionsError } = await supabase
      .from("assessment_questions")
      .select(
        `
        id,
        question_code,
        question_type,
        text,
        order_index,
        difficulty_level,
        assessment_answer_options (
          id,
          text,
          is_correct,
          order_index
        )
      `,
      )
      .eq("test_id", testId)
      .order("order_index", { ascending: true })

    if (questionsError) {
      return NextResponse.json({ error: "Failed to fetch questions" }, { status: 500 })
    }

    if (!questions || questions.length === 0) {
      return NextResponse.json({ error: "No questions found for this test" }, { status: 404 })
    }

    const shuffled = [...questions].sort(() => Math.random() - 0.5)
    const selectedQuestions = shuffled.slice(0, 20)

    const items = selectedQuestions.map((q: any) => {
      const correctOption = q.assessment_answer_options.find((opt: any) => opt.is_correct)
      const correctAnswer = correctOption ? String.fromCharCode(65 + correctOption.order_index) : "A"

      return {
        id: `${language}-${level}-${q.question_code}`,
        item_id: q.question_code,
        stem_text: q.text,
        option_text_1: q.assessment_answer_options[0]?.text || "",
        option_text_2: q.assessment_answer_options[1]?.text || "",
        option_text_3: q.assessment_answer_options[2]?.text || "",
        option_text_4: q.assessment_answer_options[3]?.text || "",
        correct_answer: correctAnswer,
        difficulty: q.difficulty_level || "medium",
        question_type: q.question_type,
      }
    })

    return NextResponse.json({
      items,
      passing_score_percent: 60,
      upgrade_threshold_percent: 85,
    })
  } catch (error) {
    console.error("Error fetching test items:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
