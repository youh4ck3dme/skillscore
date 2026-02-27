import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { evaluateProgression } from "@/lib/tests/adaptive-progression"
import {
  getLanguageTestCandidateText,
  getLanguageTestCompanyText,
  determineResultLanguage,
  type SupportedResultLanguage,
} from "@/lib/tests/result-texts-i18n"

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const {
      test_id,
      session_id,
      language,
      level,
      total_score,
      max_score,
      percentage,
      level_achieved,
      recommendations,
      answers,
      started_at,
      completed_at,
    } = body

    // Evaluate progression using threshold-based logic from database
    const progression = await evaluateProgression("language", level, percentage, language)
    
    console.log("[v0] Language test progression result:", progression)

    const resultLanguage = determineResultLanguage(language) as SupportedResultLanguage
    const candidateResultText = getLanguageTestCandidateText(progression.levelBand, resultLanguage)
    const companyResultText = getLanguageTestCompanyText(progression.levelBand, resultLanguage)

    const levelBand = progression.levelBand
    const levelConfirmed = progression.levelConfirmed

    // Use progression message
    const recommendationText = progression.message

    const { data: result, error } = await supabase
      .from("candidate_test_results")
      .insert({
        candidate_id: user.id,
        test_id: test_id || `language-${language}-${level}`,
        session_id,
        total_score,
        max_score,
        percentage,
        level_achieved,
        level_confirmed: progression.levelConfirmed,
        level_band: progression.levelBand,
        candidate_result_text: candidateResultText,
        company_result_text: companyResultText,
        recommendations: {
          ...recommendations,
          levelBand: progression.levelBand,
          levelConfirmed: progression.levelConfirmed,
          nextLevel: progression.nextLevel,
          shouldContinue: progression.shouldContinue,
          text: recommendationText,
        },
        completed_at: completed_at || new Date().toISOString(),
        created_at: new Date().toISOString(),
      })
      .select("id")
      .single()

    if (error) {
      console.error("Error submitting language test result:", error)
      return NextResponse.json({ error: "Failed to submit test result" }, { status: 500 })
    }

    // Only save to profile if level is confirmed (threshold matched)
    if (progression.levelConfirmed) {
      const languageField = language === "en" ? "english_level" : language === "de" ? "german_level" : null

      if (languageField) {
        await supabase
          .from("candidate_profiles")
          .update({
            [languageField]: level,
            [`${languageField}_confirmed`]: true,
            [`${languageField}_confirmed_at`]: new Date().toISOString(),
          })
          .eq("id", user.id)
      }
    }

    return NextResponse.json({
      success: true,
      resultId: result.id,
      levelBand: progression.levelBand,
      levelConfirmed: progression.levelConfirmed,
      nextLevel: progression.nextLevel,
      shouldContinue: progression.shouldContinue,
      recommendation: recommendationText,
      candidateResultText,
      message: progression.message,
    })
  } catch (error) {
    console.error("Error submitting language test result:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
