import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"
import { getLocalizedField, getLanguageFromHeader } from "@/lib/i18n/get-localized-field"

const TEST_CODE_TO_ASSESSMENT_ID: Record<string, string> = {
  // Basic testy
  "test-digi": "DIGITAL_SKILLS",
  "test-sjt": "SJT_BASIC",
  "test-lang": "LANGUAGE",
  "test-it": "IT_USER",
  "test-job-skills": "JOB_SKILLS",

  // Extended testy
  "test-sjt-advanced": "SJT_COGNITIVE",
  "test-detail": "ATTENTION_DETAIL",
  "test-verbal": "VERBAL_SKILLS",
  "test-plan": "PLANNING",
  "test-dataentry": "DATA_ENTRY",
  "test-ohs": "SAFETY_BOZP",
  "test-worksample": "WORK_SAMPLE",
  "test-lognum": "LOGICAL_NUMERICAL",

  // Retenčné testy
  "ret-engagement": "RET_ENGAGEMENT",
  "ret-motivators": "RET_MOTIVATORS",
  "ret-risk": "RET_RISK",
  "ret-stress": "RET_STRESS_BURNOUT",
  "ret-career": "RET_CAREER_GROWTH",
  "ret-manager": "RET_MANAGER_RELATIONSHIP",
  "ret-communication": "RET_COMMUNICATION_CLIMATE",
  "ret-environment": "RET_WORK_ENVIRONMENT",
}

function getLocalizedText(item: any, lang: string): string {
  return getLocalizedField<string>(item, "text", lang)
}

export async function POST(request: Request) {
  try {
    const { dbTestId, testCode, level, family, role } = await request.json()

    const acceptLang = request.headers.get("accept-language") || "sk"
    const lang = getLanguageFromHeader(acceptLang)

    let finalTestId = dbTestId
    if (!finalTestId && testCode) {
      finalTestId = TEST_CODE_TO_ASSESSMENT_ID[testCode.toLowerCase()] || testCode.toUpperCase().replace(/-/g, "_")
    }

    if (!finalTestId || !level) {
      return NextResponse.json({ error: "Missing dbTestId/testCode or level" }, { status: 400 })
    }

    const supabase = await createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { data: profile } = await supabase.from("candidate_profiles").select("id").eq("id", user.id).single()

    if (!profile) {
      return NextResponse.json({ error: "Candidate profile not found" }, { status: 404 })
    }

    const { data: test, error: testError } = await supabase
      .from("assessment_tests")
      .select("id, name, name_en, name_de, category")
      .eq("id", finalTestId)
      .single()

    if (testError || !test) {
      return NextResponse.json({ error: `Test "${finalTestId}" not found` }, { status: 404 })
    }

    let questionCount: number
    if (test.category === "retention") {
      questionCount = 20
    } else {
      questionCount = level === "screen" ? 8 : level === "standard" ? 15 : 20
    }

    let formattedQuestions: any[] = []

    if (finalTestId === "DIGITAL_SKILLS") {
      const { data: digiQuestions, error: digiError } = await supabase
        .from("it_skills_questions")
        .select("*")
        .limit(questionCount * 2)

      if (digiError || !digiQuestions || digiQuestions.length === 0) {
        return NextResponse.json({ error: "Failed to fetch digital skills questions" }, { status: 500 })
      }

      const shuffled = digiQuestions.sort(() => Math.random() - 0.5).slice(0, questionCount)

      formattedQuestions = shuffled.map((q: any) => {
        const questionText = lang === "en" && q.text_en ? q.text_en : lang === "de" && q.text_de ? q.text_de : q.text

        let options: string[] = []
        if (lang === "en" && q.options_en && Array.isArray(q.options_en)) {
          options = q.options_en.map((opt: any) => {
            if (typeof opt === "object" && opt.text) {
              return opt.text
            }
            return typeof opt === "string" ? opt : String(opt)
          })
        } else if (lang === "de" && q.options_de && Array.isArray(q.options_de)) {
          options = q.options_de.map((opt: any) => {
            if (typeof opt === "object" && opt.text) {
              return opt.text
            }
            return typeof opt === "string" ? opt : String(opt)
          })
        } else if (q.options && Array.isArray(q.options)) {
          options = q.options.map((opt: any) => {
            if (typeof opt === "object" && opt.text) {
              return opt.text
            }
            return typeof opt === "string" ? opt : String(opt)
          })
        }

        return {
          id: q.id,
          question: questionText,
          options: options,
          correctAnswer: q.correct_index ?? 0,
        }
      })
    } else if (finalTestId.startsWith("JOB_SKILLS") || finalTestId.startsWith("WORK_")) {
      const workSkillsFamily = family || "general"

      let query = supabase.from("work_skills_questions").select("*").eq("level", level)

      if (workSkillsFamily && workSkillsFamily !== "general" && workSkillsFamily !== "") {
        query = query.eq("family", workSkillsFamily.toLowerCase())
      }

      if (role) {
        query = query.eq("role", role)
      }

      const { data: workQuestions, error: workError } = await query.limit(questionCount * 2)

      if (workError || !workQuestions || workQuestions.length === 0) {
        const { data: fallbackQuestions, error: fallbackError } = await supabase
          .from("work_skills_questions")
          .select("*")
          .eq("level", level)
          .limit(questionCount * 2)

        if (fallbackError || !fallbackQuestions || fallbackQuestions.length === 0) {
          return NextResponse.json({ error: "Failed to fetch work skills questions" }, { status: 500 })
        }

        const shuffled = fallbackQuestions.sort(() => Math.random() - 0.5).slice(0, questionCount)

        formattedQuestions = shuffled.map((q: any) => {
          const questionText = lang === "en" && q.text_en ? q.text_en : lang === "de" && q.text_de ? q.text_de : q.text

          let options: string[] = []
          if (lang === "en" && q.options_en && Array.isArray(q.options_en)) {
            options = q.options_en.map((opt: any) => {
              if (typeof opt === "object" && opt.text) {
                return opt.text
              }
              return typeof opt === "string" ? opt : String(opt)
            })
          } else if (lang === "de" && q.options_de && Array.isArray(q.options_de)) {
            options = q.options_de.map((opt: any) => {
              if (typeof opt === "object" && opt.text) {
                return opt.text
              }
              return typeof opt === "string" ? opt : String(opt)
            })
          } else if (q.options && Array.isArray(q.options)) {
            options = q.options.map((opt: any) => {
              if (typeof opt === "object" && opt.text) {
                return opt.text
              }
              return typeof opt === "string" ? opt : String(opt)
            })
          }

          return {
            id: q.id,
            question: questionText,
            options: options,
            correctAnswer: q.correct_index ?? 0,
          }
        })
      } else {
        const shuffled = workQuestions.sort(() => Math.random() - 0.5).slice(0, questionCount)

        formattedQuestions = shuffled.map((q: any) => {
          const questionText = lang === "en" && q.text_en ? q.text_en : lang === "de" && q.text_de ? q.text_de : q.text

          let options: string[] = []
          if (lang === "en" && q.options_en && Array.isArray(q.options_en)) {
            options = q.options_en.map((opt: any) => {
              if (typeof opt === "object" && opt.text) {
                return opt.text
              }
              return typeof opt === "string" ? opt : String(opt)
            })
          } else if (lang === "de" && q.options_de && Array.isArray(q.options_de)) {
            options = q.options_de.map((opt: any) => {
              if (typeof opt === "object" && opt.text) {
                return opt.text
              }
              return typeof opt === "string" ? opt : String(opt)
            })
          } else if (q.options && Array.isArray(q.options)) {
            options = q.options.map((opt: any) => {
              if (typeof opt === "object" && opt.text) {
                return opt.text
              }
              return typeof opt === "string" ? opt : String(opt)
            })
          }

          return {
            id: q.id,
            question: questionText,
            options: options,
            correctAnswer: q.correct_index ?? 0,
          }
        })
      }
    } else {
      if (finalTestId === "SJT_BASIC" || finalTestId === "SJT_COGNITIVE") {
        const { data: sjtQuestions, error: sjtError } = await supabase
          .from("test_questions")
          .select("*")
          .limit(questionCount)

        if (sjtError || !sjtQuestions || sjtQuestions.length === 0) {
          return NextResponse.json({ error: "Failed to fetch SJT questions" }, { status: 500 })
        }

        formattedQuestions = sjtQuestions.map((q: any) => {
          const stemText = lang === "en" && q.stem_en ? q.stem_en : lang === "de" && q.stem_de ? q.stem_de : q.stem_sk

          let options: string[] = []

          let rawOptions = null
          if (lang === "en" && q.options_en) {
            rawOptions = q.options_en
          } else if (lang === "de" && q.options_de) {
            rawOptions = q.options_de
          } else if (q.options_sk) {
            rawOptions = q.options_sk
          }

          if (rawOptions) {
            if (typeof rawOptions === "string") {
              try {
                rawOptions = JSON.parse(rawOptions)
              } catch (e) {}
            }

            if (typeof rawOptions === "object" && !Array.isArray(rawOptions)) {
              const sortedKeys = Object.keys(rawOptions).sort()
              options = sortedKeys.map((key) => `${key}) ${rawOptions[key]}`)
            } else if (Array.isArray(rawOptions)) {
              options = rawOptions.map((opt: any) => {
                if (typeof opt === "object" && opt.text) {
                  return opt.text
                }
                return typeof opt === "string" ? opt : String(opt)
              })
            }
          }

          return {
            id: q.id,
            question: stemText,
            options: options,
            correctAnswer: q.correct_index ?? 0,
          }
        })
      } else {
        const multilangResult = await supabase
          .from("assessment_questions")
          .select(`
            id,
            text,
            text_en,
            text_de,
            question_type,
            order_index,
            assessment_answer_options (
              id,
              text,
              text_en,
              text_de,
              is_correct,
              order_index
            )
          `)
          .eq("test_id", test.id)
          .order("order_index")
          .limit(questionCount)

        let questions: any[] | null = null
        let questionsError: any = null

        if (multilangResult.error?.code === "42703") {
          const basicResult = await supabase
            .from("assessment_questions")
            .select(`
              id,
              text,
              question_type,
              order_index,
              assessment_answer_options (
                id,
                text,
                is_correct,
                order_index
              )
            `)
            .eq("test_id", test.id)
            .order("order_index")
            .limit(questionCount)

          questions = basicResult.data
          questionsError = basicResult.error
        } else {
          questions = multilangResult.data
          questionsError = multilangResult.error
        }

        if (questionsError || !questions || questions.length === 0) {
          return NextResponse.json({ error: "Failed to fetch questions" }, { status: 500 })
        }

        formattedQuestions = questions.map((q: any) => ({
          id: q.id,
          question: getLocalizedText(q, lang),
          options: (q.assessment_answer_options || [])
            .sort((a: any, b: any) => a.order_index - b.order_index)
            .map((opt: any) => getLocalizedText(opt, lang)),
          correctAnswer: (q.assessment_answer_options || []).findIndex((opt: any) => opt.is_correct),
        }))
      }
    }

    const { data: session, error: sessionError } = await supabase
      .from("candidate_test_sessions")
      .insert({
        candidate_id: user.id,
        assessment_test_id: test.id,
        current_level: level,
        status: "in_progress",
        started_at: new Date().toISOString(),
        questions: formattedQuestions,
      })
      .select()
      .single()

    if (sessionError) {
      return NextResponse.json({ error: "Failed to create test session" }, { status: 500 })
    }

    return NextResponse.json({
      session: {
        id: session.id,
        assessment_test_id: test.id,
        current_level: level,
      },
      questions: formattedQuestions,
    })
  } catch (error) {
    console.error("Error in start test API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
