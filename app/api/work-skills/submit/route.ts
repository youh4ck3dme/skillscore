import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { getLanguageFromHeader } from "@/lib/i18n/get-localized-field"

const resultTexts = {
  sk: {
    excellent: "Vynikajúci výsledok! Máte silné pracovné zručnosti v tejto oblasti.",
    good: "Dobrý výsledok. Máte solídne pracovné zručnosti s priestorom na zlepšenie.",
    average: "Priemerný výsledok. Odporúčame ďalší rozvoj v tejto oblasti.",
    needsWork: "Výsledok naznačuje potrebu zlepšenia pracovných zručností v tejto oblasti.",
  },
  en: {
    excellent: "Excellent result! You have strong work skills in this area.",
    good: "Good result. You have solid work skills with room for improvement.",
    average: "Average result. We recommend further development in this area.",
    needsWork: "Result indicates a need for improvement of work skills in this area.",
  },
  de: {
    excellent: "Ausgezeichnetes Ergebnis! Sie haben starke Arbeitsfähigkeiten in diesem Bereich.",
    good: "Gutes Ergebnis. Sie haben solide Arbeitsfähigkeiten mit Verbesserungspotenzial.",
    average: "Durchschnittliches Ergebnis. Wir empfehlen eine Weiterentwicklung in diesem Bereich.",
    needsWork: "Das Ergebnis zeigt einen Verbesserungsbedarf der Arbeitsfähigkeiten in diesem Bereich.",
  },
}

const levelLabels = {
  sk: {
    excellent: "Výborný",
    good: "Dobrý",
    average: "Priemerný",
    needsWork: "Potrebuje zlepšenie",
  },
  en: {
    excellent: "Excellent",
    good: "Good",
    average: "Average",
    needsWork: "Needs improvement",
  },
  de: {
    excellent: "Ausgezeichnet",
    good: "Gut",
    average: "Durchschnittlich",
    needsWork: "Verbesserungsbedarf",
  },
}

function getResultLevel(percentage: number): "excellent" | "good" | "average" | "needsWork" {
  if (percentage >= 85) return "excellent"
  if (percentage >= 70) return "good"
  if (percentage >= 50) return "average"
  return "needsWork"
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const acceptLanguage = request.headers.get("accept-language")
    const lang = getLanguageFromHeader(acceptLanguage) as "sk" | "en" | "de"

    const body = await request.json()
    const { family, role, level, score, total_questions, percentage, passed, answers, started_at, completed_at } = body

    const resultLevel = getResultLevel(percentage)
    const levelAchieved = levelLabels[lang][resultLevel]
    const candidateResultText = resultTexts[lang][resultLevel]

    // Create test session
    const { data: session, error: sessionError } = await supabase
      .from("candidate_test_sessions")
      .insert({
        candidate_id: user.id,
        test_type: "work-skills",
        test_subtype: family,
        status: "completed",
        started_at,
        completed_at,
      })
      .select("id")
      .single()

    if (sessionError) {
      console.error("[v0] Error creating test session:", sessionError)
      return NextResponse.json({ error: "Failed to create test session" }, { status: 500 })
    }

    // Save answers
    const answerRecords = answers.map((answer: any) => ({
      session_id: session.id,
      question_id: answer.question_id,
      selected_answer: answer.selected_answer,
      is_correct: answer.is_correct,
    }))

    const { error: answersError } = await supabase.from("candidate_test_answers").insert(answerRecords)

    if (answersError) {
      console.error("[v0] Error saving answers:", answersError)
      return NextResponse.json({ error: "Failed to save answers" }, { status: 500 })
    }

    const { data: result, error: resultError } = await supabase
      .from("candidate_test_results")
      .insert({
        session_id: session.id,
        candidate_id: user.id,
        test_type: "work-skills",
        test_subtype: family,
        score,
        total_questions,
        percentage,
        passed,
        level_achieved: levelAchieved,
        candidate_result_text: candidateResultText,
        metadata: JSON.stringify({ role, level }),
      })
      .select("id")
      .single()

    if (resultError) {
      console.error("[v0] Error saving test result:", resultError)
      return NextResponse.json({ error: "Failed to save test result" }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      resultId: result.id,
      sessionId: session.id,
      levelAchieved,
      candidateResultText,
    })
  } catch (error) {
    console.error("[v0] Error submitting work skills test:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
