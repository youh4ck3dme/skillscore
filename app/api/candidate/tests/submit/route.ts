import { createClient } from "@/utils/supabase/server"
import { NextResponse } from "next/server"
import { getLevelBand } from "@/lib/tests/results-generator"
import {
  getLanguageTestCandidateText,
  getLanguageTestCompanyText,
  getITTestCandidateText,
  getITTestCompanyText,
  determineResultLanguage,
  type SupportedResultLanguage,
  getRetentionCandidateText,
  getRetentionCompanyText,
} from "@/lib/tests/result-texts-i18n"
import { getBandForPercentage, generateCandidateMessage, generateCompanyMessage } from "@/lib/tests/results-generator"

const ASSESSMENT_TO_TEST_CODE: Record<string, string> = {
  DIGITAL_SKILLS: "test-digi",
  SJT_BASIC: "sjt-general",
  JOB_SKILLS: "work-skills-assembler",
  JOB_SKILLS_ADMIN: "work-skills-admin",
  JOB_SKILLS_IT: "work-skills-it",
  JOB_SKILLS_TRADES: "work-skills-welder",
  ATTENTION_DETAIL: "test-detail",
  LOGICAL_NUMERICAL: "test-lognum",
  SJT_COGNITIVE: "test-sjt-advanced",
  VERBAL_SKILLS: "verbal-comprehension",
  WORK_SAMPLE: "test-worksample",
  DATA_ENTRY: "attention-detail",
  PLANNING: "attention-detail",
  SAFETY_BOZP: "bozp-sklad-logistika",
  LANGUAGE_EN_A1: "lang-english-a1",
  LANGUAGE_EN_A2: "lang-english-a2",
  LANGUAGE_EN_B1: "lang-english-b1",
  LANGUAGE_EN_B2: "lang-english-b2",
  LANGUAGE_EN_C1: "lang-english-c1",
  LANGUAGE_DE_A1: "lang-german-a1",
  LANGUAGE_DE_A2: "lang-german-a2",
  LANGUAGE_DE_B1: "lang-german-b1",
  LANGUAGE_DE_B2: "lang-german-b2",
  LANGUAGE_DE_C1: "lang-german-c1",
  IT_USER: "test-it-user",
  IT_USER_L1: "test-it-user",
  IT_USER_L2: "test-it-user",
  IT_USER_L3: "test-it-user",
  IT_USER_L4: "test-it-user",
  IT_SKILLS: "test-it-user",
  IT_USER_SKILLS: "test-it-user",
  // End IT mappings
  RET_ENGAGEMENT: "ret-engagement",
  RET_MOTIVATORS: "ret-motivators",
  RET_RISK: "ret-risk",
  RET_STRESS_BURNOUT: "ret-stress",
  RET_CAREER_GROWTH: "ret-career",
  RET_MANAGER_RELATIONSHIP: "ret-manager",
  RET_COMMUNICATION_CLIMATE: "ret-communication",
  RET_WORK_ENVIRONMENT: "ret-environment",
}

const BAND_LABELS: Record<string, Record<string, string>> = {
  strong_retention: { sk: "Silná retencia", en: "Strong Retention", de: "Starke Bindung" },
  stable_state: { sk: "Stabilný stav", en: "Stable State", de: "Stabiler Zustand" },
  mild_risk: { sk: "Mierne riziko", en: "Mild Risk", de: "Leichtes Risiko" },
  increased_risk: { sk: "Zvýšené riziko", en: "Increased Risk", de: "Erhöhtes Risiko" },
  excellent_knowledge: { sk: "Výborná znalosť", en: "Excellent Knowledge", de: "Ausgezeichnete Kenntnisse" },
  good_knowledge: { sk: "Dobrá znalosť", en: "Good Knowledge", de: "Gute Kenntnisse" },
  basic_knowledge: { sk: "Základná znalosť", en: "Basic Knowledge", de: "Grundkenntnisse" },
  beginner: { sk: "Začiatočník", en: "Beginner", de: "Anfänger" },
  expert: { sk: "Expert", en: "Expert", de: "Experte" },
  experienced: { sk: "Skúsený", en: "Experienced", de: "Erfahren" },
  starter: { sk: "Začiatočník", en: "Beginner", de: "Anfänger" },
  at_start: { sk: "Na štarte", en: "Starting Out", de: "Am Anfang" },
  digital_expert: { sk: "Digitálny expert", en: "Digital Expert", de: "Digitaler Experte" },
  stable_foundation: { sk: "Stabilný základ", en: "Stable Foundation", de: "Stabile Grundlage" },
  needs_development: { sk: "Potrebuje rozvoj", en: "Needs Development", de: "Entwicklung nötig" },
}

const RETENTION_TEST_NAMES: Record<string, Record<string, string>> = {
  RET_ENGAGEMENT: { sk: "Angažovanosť", en: "Engagement", de: "Engagement" },
  RET_MOTIVATORS: { sk: "Motivátory", en: "Motivators", de: "Motivatoren" },
  RET_RISK: { sk: "Retenčné riziko", en: "Retention Risk", de: "Bindungsrisiko" },
  RET_STRESS_BURNOUT: { sk: "Stres a vyhorenie", en: "Stress & Burnout", de: "Stress & Burnout" },
  RET_CAREER_GROWTH: { sk: "Kariérny rast", en: "Career Growth", de: "Karrierewachstum" },
  RET_MANAGER_RELATIONSHIP: { sk: "Vzťah s manažérom", en: "Manager Relationship", de: "Vorgesetztenbeziehung" },
  RET_COMMUNICATION_CLIMATE: { sk: "Komunikačná klíma", en: "Communication Climate", de: "Kommunikationsklima" },
  RET_WORK_ENVIRONMENT: { sk: "Pracovná štruktúra", en: "Work Structure", de: "Arbeitsstruktur" },
}

function getRetentionBandLabel(percentage: number, lang = "sk"): string {
  if (percentage >= 80) return BAND_LABELS.strong_retention[lang] || BAND_LABELS.strong_retention.sk
  if (percentage >= 60) return BAND_LABELS.stable_state[lang] || BAND_LABELS.stable_state.sk
  if (percentage >= 40) return BAND_LABELS.mild_risk[lang] || BAND_LABELS.mild_risk.sk
  return BAND_LABELS.increased_risk[lang] || BAND_LABELS.increased_risk.sk
}

function getBandLabel(percentage: number, testId?: string, lang = "sk"): string {
  if (testId?.startsWith("RET_")) {
    return getRetentionBandLabel(percentage, lang)
  }

  if (testId?.startsWith("LANGUAGE_")) {
    if (percentage >= 85) return BAND_LABELS.excellent_knowledge[lang] || BAND_LABELS.excellent_knowledge.sk
    if (percentage >= 70) return BAND_LABELS.good_knowledge[lang] || BAND_LABELS.good_knowledge.sk
    if (percentage >= 50) return BAND_LABELS.basic_knowledge[lang] || BAND_LABELS.basic_knowledge.sk
    return BAND_LABELS.beginner[lang] || BAND_LABELS.beginner.sk
  }

  if (testId?.startsWith("JOB_SKILLS") || testId?.startsWith("WORK_")) {
    if (percentage >= 80) return BAND_LABELS.expert[lang] || BAND_LABELS.expert.sk
    if (percentage >= 60) return BAND_LABELS.experienced[lang] || BAND_LABELS.experienced.sk
    if (percentage >= 40) return BAND_LABELS.starter[lang] || BAND_LABELS.starter.sk
    return BAND_LABELS.at_start[lang] || BAND_LABELS.at_start.sk
  }

  if (percentage >= 80) return BAND_LABELS.digital_expert[lang] || BAND_LABELS.digital_expert.sk
  if (percentage >= 60) return BAND_LABELS.stable_foundation[lang] || BAND_LABELS.stable_foundation.sk
  if (percentage >= 40) return BAND_LABELS.needs_development[lang] || BAND_LABELS.needs_development.sk
  return BAND_LABELS.at_start[lang] || BAND_LABELS.at_start.sk
}

function getDefaultCandidateText(bandLabel: string, score: number, lang = "sk"): string {
  const templates: Record<string, string> = {
    sk: `Dosiahol si úroveň "${bandLabel}" so skóre ${score}%. Tvoj výsledok bol zaznamenaný.`,
    en: `You achieved the level "${bandLabel}" with a score of ${score}%. Your result has been recorded.`,
    de: `Sie haben das Niveau "${bandLabel}" mit einer Punktzahl von ${score}% erreicht. Ihr Ergebnis wurde aufgezeichnet.`,
  }
  return templates[lang] || templates.sk
}

export async function POST(request: Request) {
  try {
    const { sessionId, answers } = await request.json()

    const acceptLanguage = request.headers.get("accept-language") || "sk"
    const lang = acceptLanguage.startsWith("de") ? "de" : acceptLanguage.startsWith("en") ? "en" : "sk"

    if (!sessionId || !answers) {
      return NextResponse.json({ error: "Missing sessionId or answers" }, { status: 400 })
    }

    const supabase = await createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { data: session, error: sessionError } = await supabase
      .from("candidate_test_sessions")
      .select("*")
      .eq("id", sessionId)
      .eq("candidate_id", user.id)
      .single()

    if (sessionError || !session) {
      console.error("Session fetch error:", sessionError)
      return NextResponse.json({ error: "Session not found" }, { status: 404 })
    }

    const assignmentId = session.assignment_id

    const questions = session.questions || []

    const isSJTTest = session.assessment_test_id === "SJT_BASIC"
    const isRetentionTest = session.assessment_test_id?.startsWith("RET_")
    const isDigitalSkillsTest = session.assessment_test_id === "DIGITAL_SKILLS"
    const isJobSkillsTest =
      session.assessment_test_id?.startsWith("JOB_SKILLS") || session.assessment_test_id?.startsWith("WORK_")

    let correctAnswers = 0
    let retentionTotalScore = 0

    if (!isSJTTest && !isJobSkillsTest) {
      const answerInserts = answers
        .map((answer: any) => {
          const question = questions.find((q: any) => q.id.toString() === answer.questionId.toString())
          if (!question) return null

          if (isRetentionTest) {
            const likertValue =
              typeof answer.answer === "number" ? answer.answer : Number.parseInt(answer.answer, 10) || 1
            retentionTotalScore += likertValue

            return {
              session_id: sessionId,
              question_id: Number.parseInt(question.id, 10),
              selected_option: answer.answer,
              is_correct: false,
              answered_at: new Date().toISOString(),
            }
          }

          const isCorrect = answer.answer === question.correctAnswer
          if (isCorrect) correctAnswers++

          return {
            session_id: sessionId,
            question_id: Number.parseInt(question.id, 10),
            selected_option: answer.answer,
            is_correct: isCorrect,
            answered_at: new Date().toISOString(),
          }
        })
        .filter(Boolean)

      const { error: answersError } = await supabase.from("candidate_test_answers").insert(answerInserts)

      if (answersError) {
        console.error("Error saving answers:", answersError)
        return NextResponse.json({ error: "Failed to save answers" }, { status: 500 })
      }
    } else {
      answers.forEach((answer: any) => {
        const question = questions.find((q: any) => q.id.toString() === answer.questionId.toString())
        if (question && answer.answer === question.correctAnswer) {
          correctAnswers++
        }
      })
    }

    const totalQuestions = answers.length

    let score: number
    if (isRetentionTest) {
      const averageLikert = retentionTotalScore / totalQuestions
      score = Math.round(((averageLikert - 1) / 4) * 100)
    } else {
      score = Math.round((correctAnswers / totalQuestions) * 100)
    }

    const { error: updateError } = await supabase
      .from("candidate_test_sessions")
      .update({
        status: "completed",
        completed_at: new Date().toISOString(),
      })
      .eq("id", sessionId)

    if (updateError) {
      console.error("Error updating session:", updateError)
    }

    let testCode = ASSESSMENT_TO_TEST_CODE[session.assessment_test_id]
    const isLanguageTest = session.assessment_test_id?.startsWith("LANGUAGE_")
    const isITTest = session.assessment_test_id?.startsWith("IT_USER") || session.assessment_test_id === "IT_SKILLS"
    const isLevelBased = isLanguageTest || isITTest

    let testUuid = null
    let testData = null

    if (!isRetentionTest && !isITTest) {
      if (!testCode) {
        const { data: directTest } = await supabase
          .from("tests")
          .select("id, code, name")
          .ilike("code", `%${session.assessment_test_id.toLowerCase().replace(/_/g, "-")}%`)
          .limit(1)
          .maybeSingle()

        if (directTest) {
          testCode = directTest.code
        }
      }

      if (testCode) {
        const { data } = await supabase.from("tests").select("id, name").eq("code", testCode).maybeSingle()
        testData = data
        testUuid = testData?.id
      }
    }

    const bandLabel = getBandLabel(score, session.assessment_test_id, lang)

    let levelBand: string | null = null
    let levelConfirmed = false

    if (isLevelBased) {
      levelBand = getLevelBand(score)
      levelConfirmed = levelBand === "stay"
    }

    let candidateResultText = null
    let companyResultText = null

    if (isJobSkillsTest) {
      const band = getBandForPercentage(score)
      candidateResultText = generateCandidateMessage(band, "test-job-skills", score, lang)
      companyResultText = generateCompanyMessage(band, "test-job-skills", score, {}, lang)
    } else if (isDigitalSkillsTest) {
      const band = getBandForPercentage(score)
      candidateResultText = generateCandidateMessage(band, "test-digi", score, lang)
      companyResultText = generateCompanyMessage(band, "test-digi", score, {}, lang)
    } else if (isLanguageTest || isITTest || isRetentionTest) {
      const band = getLevelBand(score)

      const { data: candidateTemplate } = await supabase
        .from("assessment_templates")
        .select("content")
        .eq("test_id", session.assessment_test_id)
        .eq("template_type", "RESULT_CANDIDATE")
        .eq("variant_key", isRetentionTest ? bandLabel : band)
        .eq("language", lang)
        .maybeSingle()

      const { data: companyTemplate } = await supabase
        .from("assessment_templates")
        .select("content")
        .eq("test_id", session.assessment_test_id)
        .eq("template_type", "RESULT_COMPANY")
        .eq("variant_key", isRetentionTest ? bandLabel : band)
        .eq("language", lang)
        .maybeSingle()

      if (candidateTemplate) {
        candidateResultText = candidateTemplate.content
      } else {
        if (isLanguageTest) {
          const parts = session.assessment_test_id.split("_")
          const langCode = parts[1]?.toLowerCase() as "en" | "de" | undefined
          const resultLanguage = determineResultLanguage(langCode) as SupportedResultLanguage
          candidateResultText = getLanguageTestCandidateText(band, resultLanguage)
        } else if (isITTest) {
          candidateResultText = getITTestCandidateText(band, lang)
        } else if (isRetentionTest) {
          candidateResultText = getRetentionCandidateText(session.assessment_test_id, bandLabel, score, lang)
        }
      }

      if (companyTemplate) {
        companyResultText = companyTemplate.content
      } else {
        if (isLanguageTest) {
          const parts = session.assessment_test_id.split("_")
          const langCode = parts[1]?.toLowerCase() as "en" | "de" | undefined
          const resultLanguage = determineResultLanguage(langCode) as SupportedResultLanguage
          companyResultText = getLanguageTestCompanyText(band, resultLanguage)
        } else if (isITTest) {
          companyResultText = getITTestCompanyText(band, lang)
        } else if (isRetentionTest) {
          companyResultText = getRetentionCompanyText(session.assessment_test_id, bandLabel, score, lang)
        }
      }
    } else {
      const { data: candidateTemplate } = await supabase
        .from("assessment_templates")
        .select("content")
        .eq("test_id", session.assessment_test_id)
        .eq("template_type", "RESULT_CANDIDATE")
        .eq("variant_key", bandLabel)
        .eq("language", lang)
        .maybeSingle()

      if (candidateTemplate) {
        candidateResultText = candidateTemplate.content
      } else {
        const { data: fallbackCandidate } = await supabase
          .from("assessment_templates")
          .select("content")
          .eq("test_id", session.assessment_test_id)
          .eq("template_type", "RESULT_CANDIDATE")
          .eq("language", lang)
          .limit(1)

        if (fallbackCandidate && fallbackCandidate.length > 0) {
          candidateResultText = fallbackCandidate[0].content
        }
      }

      const { data: companyTemplate } = await supabase
        .from("assessment_templates")
        .select("content")
        .eq("test_id", session.assessment_test_id)
        .eq("template_type", "RESULT_COMPANY")
        .eq("variant_key", bandLabel)
        .eq("language", lang)
        .maybeSingle()

      if (companyTemplate) {
        companyResultText = companyTemplate.content
      } else {
        const { data: fallbackCompany } = await supabase
          .from("assessment_templates")
          .select("content")
          .eq("test_id", session.assessment_test_id)
          .eq("template_type", "RESULT_COMPANY")
          .eq("variant_key", bandLabel)
          .eq("language", lang)
          .limit(1)

        if (fallbackCompany && fallbackCompany.length > 0) {
          companyResultText = fallbackCompany[0].content
        }
      }
    }

    if (!candidateResultText) {
      candidateResultText = getDefaultCandidateText(bandLabel, score, lang)
    }

    const { error: resultError } = await supabase.from("candidate_test_results").insert({
      session_id: sessionId,
      candidate_id: user.id,
      test_id: testUuid,
      assessment_test_id: session.assessment_test_id,
      total_score: correctAnswers,
      max_score: totalQuestions,
      percentage: score,
      level_achieved: bandLabel,
      level_band: levelBand,
      level_confirmed: levelConfirmed,
      candidate_result_text: candidateResultText,
      company_result_text: companyResultText,
      completed_at: new Date().toISOString(),
    })

    if (resultError) {
      console.error("Error saving result:", resultError)
    }

    if (assignmentId) {
      // Fetch assignment details
      const { data: assignment } = await supabase
        .from("company_test_assignments")
        .select("company_id, coins_charged")
        .eq("id", assignmentId)
        .single()

      if (assignment) {
        // Update assignment status to completed
        await supabase
          .from("company_test_assignments")
          .update({
            status: "completed",
            completed_at: new Date().toISOString(),
            result_id: session.id, // Link to result
          })
          .eq("id", assignmentId)

        // Deduct coins from company wallet
        if (assignment.coins_charged && assignment.coins_charged > 0) {
          const { data: wallet } = await supabase
            .from("coin_wallets")
            .select("id, balance")
            .eq("company_id", assignment.company_id)
            .single()

          if (wallet && wallet.balance >= assignment.coins_charged) {
            // Update wallet balance
            await supabase
              .from("coin_wallets")
              .update({
                balance: wallet.balance - assignment.coins_charged,
              })
              .eq("id", wallet.id)

            // Create transaction record
            await supabase.from("coin_transactions").insert({
              wallet_id: wallet.id,
              amount: -assignment.coins_charged,
              transaction_type: "test_completion",
              description: `Test completed by candidate - ${session.assessment_test_id}`,
              related_entity_type: "test_assignment",
              related_entity_id: assignmentId,
              created_at: new Date().toISOString(),
            })
          }
        }

        // Create notification for company
        await supabase.from("notifications").insert({
          user_id: assignment.company_id,
          notification_type: "test_completed",
          title: "Test dokončený",
          message: `Kandidát dokončil test ${session.assessment_test_id}`,
          related_entity_type: "test_assignment",
          related_entity_id: assignmentId,
          created_at: new Date().toISOString(),
        })
      }
    }

    if (isLevelBased && levelConfirmed) {
      if (isLanguageTest) {
        const parts = session.assessment_test_id.split("_")
        const lang = parts[1]?.toLowerCase()
        const level = parts[2]

        const languageField = lang === "en" ? "english_level" : lang === "de" ? "german_level" : null

        if (languageField && level) {
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
      // IT test results are stored in candidate_test_results table only
    }

    return NextResponse.json({
      results: {
        score,
        percentage: score,
        correctAnswers,
        totalQuestions,
        bandLabel,
        candidateResultText,
        levelBand,
        levelConfirmed,
      },
    })
  } catch (error) {
    console.error("Error in submit test API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
