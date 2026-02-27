import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

interface TestResult {
  id: string
  assessment_test_id: string
  percentage: number | null
  level_achieved: string | null
  strong_topics: string[] | null
  weak_topics: string[] | null
  recommendations: string[] | null
  completed_at: string
}

interface AssessmentTest {
  id: string
  name: string
  name_en: string | null
  name_de: string | null
  category: string
  description: string | null
  strong_text: string | null
  strong_text_en: string | null
  strong_text_de: string | null
  weak_text: string | null
  weak_text_en: string | null
  weak_text_de: string | null
}

interface ProfileSummary {
  generated_at: string
  tests_count: number
  strengths: string[]
  weaknesses: string[]
  swot: {
    strengths: string[]
    weaknesses: string[]
    opportunities: string[]
    threats: string[]
  }
  level_summary: Record<string, string>
  recommendations: string[]
}

const STRONG_LEVELS = [
  "expert",
  "pokročilý",
  "advanced",
  "dobrá znalosť",
  "výborný",
  "výborná",
  "c2",
  "c1",
  "b2",
  "native",
  "fluent",
  "profesionál",
  "skúsený",
]

const WEAK_LEVELS = [
  "začiatočník",
  "na štarte",
  "potrebuje rozvoj",
  "zvýšené riziko",
  "beginner",
  "basic",
  "a1",
  "a2",
  "nedostatočný",
  "slabý",
]

function getLocalizedText(
  test: AssessmentTest,
  field: "name" | "strong_text" | "weak_text",
  lang: string,
): string | null {
  if (lang === "en") {
    if (field === "name") return test.name_en || test.name
    if (field === "strong_text") return test.strong_text_en || test.strong_text
    if (field === "weak_text") return test.weak_text_en || test.weak_text
  }
  if (lang === "de") {
    if (field === "name") return test.name_de || test.name
    if (field === "strong_text") return test.strong_text_de || test.strong_text
    if (field === "weak_text") return test.weak_text_de || test.weak_text
  }
  // SK default
  if (field === "name") return test.name
  if (field === "strong_text") return test.strong_text
  if (field === "weak_text") return test.weak_text
  return null
}

function generateSWOT(
  testResults: TestResult[],
  assessmentTests: AssessmentTest[],
  lang = "sk",
): {
  strengths: string[]
  weaknesses: string[]
  opportunities: string[]
  threats: string[]
} {
  const strengths: string[] = []
  const weaknesses: string[] = []
  const opportunities: string[] = []
  const threats: string[] = []

  const testMap = new Map<string, AssessmentTest>()
  assessmentTests.forEach((test) => {
    testMap.set(test.id, test)
  })

  const opportunityTexts = {
    sk: {
      langOpportunity: (name: string) => `${name} otvára možnosti práce v zahraničí alebo medzinárodných firmách`,
      itOpportunity: (name: string) => `${name} zvyšuje vašu hodnotu na trhu práce`,
      jobOpportunity: (name: string) => `${name} – môžete zastávať náročnejšie pozície`,
      improvementOpportunity: "Cielený rozvoj slabších oblastí môže výrazne zlepšiť váš profil",
      lowDigitalThreat: "Nízke digitálne zručnosti môžu obmedziť pracovné možnosti v moderných firmách",
    },
    en: {
      langOpportunity: (name: string) => `${name} opens opportunities for work abroad or in international companies`,
      itOpportunity: (name: string) => `${name} increases your market value`,
      jobOpportunity: (name: string) => `${name} – you can take on more demanding positions`,
      improvementOpportunity: "Targeted development of weaker areas can significantly improve your profile",
      lowDigitalThreat: "Low digital skills may limit job opportunities in modern companies",
    },
    de: {
      langOpportunity: (name: string) =>
        `${name} eröffnet Möglichkeiten für Arbeit im Ausland oder in internationalen Unternehmen`,
      itOpportunity: (name: string) => `${name} erhöht Ihren Marktwert`,
      jobOpportunity: (name: string) => `${name} – Sie können anspruchsvollere Positionen übernehmen`,
      improvementOpportunity: "Gezielte Entwicklung schwächerer Bereiche kann Ihr Profil deutlich verbessern",
      lowDigitalThreat: "Geringe digitale Fähigkeiten können Jobmöglichkeiten in modernen Unternehmen einschränken",
    },
  }

  const texts = opportunityTexts[lang as keyof typeof opportunityTexts] || opportunityTexts.sk

  // Silné a slabé stránky - priamo z DB textov
  testResults.forEach((result) => {
    const testInfo = testMap.get(result.assessment_test_id)
    if (!testInfo) return

    const level = result.level_achieved
    const percentage = result.percentage

    let isStrong = false
    let isWeak = false

    if (level && level.trim() !== "") {
      const normalizedLevel = level.toLowerCase().trim()
      isStrong = STRONG_LEVELS.some((s) => normalizedLevel.includes(s))
      isWeak = WEAK_LEVELS.some((s) => normalizedLevel.includes(s))
    } else if (percentage !== null && percentage > 0) {
      isStrong = percentage >= 70
      isWeak = percentage < 50
    }

    const strongText = getLocalizedText(testInfo, "strong_text", lang)
    const weakText = getLocalizedText(testInfo, "weak_text", lang)

    if (isStrong && strongText) {
      strengths.push(strongText)
    } else if (isWeak && weakText) {
      weaknesses.push(weakText)
    }
  })

  // Jazykové príležitosti
  const languageStrong = testResults.filter((t) => {
    const testInfo = testMap.get(t.assessment_test_id)
    if (!testInfo?.id.includes("LANGUAGE")) return false
    if (t.level_achieved) {
      const normalized = t.level_achieved.toLowerCase()
      return STRONG_LEVELS.some((s) => normalized.includes(s))
    }
    return false
  })

  languageStrong.forEach((lang_result) => {
    const testInfo = testMap.get(lang_result.assessment_test_id)
    if (testInfo) {
      const localizedName = getLocalizedText(testInfo, "name", lang) || testInfo.name
      const langName = localizedName.split(" – ")[0] || localizedName
      opportunities.push(texts.langOpportunity(langName))
    }
  })

  // IT príležitosti
  const itStrong = testResults.filter((t) => {
    const testInfo = testMap.get(t.assessment_test_id)
    if (!testInfo?.id.includes("IT_USER") && !testInfo?.id.includes("DIGITAL")) return false
    if (t.level_achieved) {
      const normalized = t.level_achieved.toLowerCase()
      return STRONG_LEVELS.some((s) => normalized.includes(s))
    }
    return false
  })

  itStrong.forEach((it) => {
    const testInfo = testMap.get(it.assessment_test_id)
    if (testInfo) {
      const localizedName = getLocalizedText(testInfo, "name", lang) || testInfo.name
      opportunities.push(texts.itOpportunity(localizedName))
    }
  })

  // Pracovné zručnosti príležitosti
  const jobSkillsStrong = testResults.filter((t) => {
    const testInfo = testMap.get(t.assessment_test_id)
    if (!testInfo?.id.includes("JOB_SKILLS")) return false
    if (t.level_achieved) {
      const normalized = t.level_achieved.toLowerCase()
      return STRONG_LEVELS.some((s) => normalized.includes(s))
    }
    return false
  })

  jobSkillsStrong.forEach((js) => {
    const testInfo = testMap.get(js.assessment_test_id)
    if (testInfo) {
      const localizedName = getLocalizedText(testInfo, "name", lang) || testInfo.name
      opportunities.push(texts.jobOpportunity(localizedName))
    }
  })

  if (weaknesses.length > 0 && weaknesses.length <= 5) {
    opportunities.push(texts.improvementOpportunity)
  }

  // Hrozby
  testResults.forEach((result) => {
    const testInfo = testMap.get(result.assessment_test_id)
    if (!testInfo) return

    const level = result.level_achieved
    if (!level) return

    const normalizedLevel = level.toLowerCase().trim()

    if (
      testInfo.id.includes("RET_") &&
      (normalizedLevel.includes("zvýšené riziko") || normalizedLevel.includes("vysoké riziko"))
    ) {
      const weakText = getLocalizedText(testInfo, "weak_text", lang)
      if (weakText) {
        threats.push(weakText)
      }
    }
  })

  // Slabé digitálne zručnosti ako hrozba
  const itWeak = testResults.filter((t) => {
    const testInfo = testMap.get(t.assessment_test_id)
    if (!testInfo?.id.includes("IT_USER") && !testInfo?.id.includes("DIGITAL")) return false
    if (t.level_achieved) {
      const normalized = t.level_achieved.toLowerCase()
      return WEAK_LEVELS.some((s) => normalized.includes(s))
    }
    return false
  })

  if (itWeak.length >= 2) {
    threats.push(texts.lowDigitalThreat)
  }

  // Slabé jazykové zručnosti ako hrozba
  const langWeak = testResults.filter((t) => {
    const testInfo = testMap.get(t.assessment_test_id)
    if (!testInfo?.id.includes("LANGUAGE")) return false
    if (t.level_achieved) {
      const normalized = t.level_achieved.toLowerCase()
      return WEAK_LEVELS.some((s) => normalized.includes(s))
    }
    return false
  })

  langWeak.forEach((lang_result) => {
    const testInfo = testMap.get(lang_result.assessment_test_id)
    if (testInfo) {
      const weakText = getLocalizedText(testInfo, "weak_text", lang)
      if (weakText) {
        threats.push(weakText)
      }
    }
  })

  return {
    strengths: [...new Set(strengths)],
    weaknesses: [...new Set(weaknesses)],
    opportunities: [...new Set(opportunities)],
    threats: [...new Set(threats)],
  }
}

export async function GET() {
  try {
    const supabase = await createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { data: profile } = await supabase
      .from("candidate_profiles")
      .select("profile_summary")
      .eq("id", user.id)
      .single()

    const { data: testResults, error } = await supabase
      .from("candidate_test_results")
      .select(
        "id, assessment_test_id, percentage, level_achieved, strong_topics, weak_topics, recommendations, completed_at",
      )
      .eq("candidate_id", user.id)
      .order("completed_at", { ascending: false })

    if (error) {
      return NextResponse.json({ error: "Failed to load test results" }, { status: 500 })
    }

    return NextResponse.json({
      profile_summary: profile?.profile_summary || null,
      test_results: testResults || [],
      tests_count: testResults?.length || 0,
    })
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const lang = "sk"

    const { data: assessmentTests, error: testsError } = await supabase
      .from("assessment_tests")
      .select(
        "id, name, name_en, name_de, category, description, strong_text, strong_text_en, strong_text_de, weak_text, weak_text_en, weak_text_de",
      )

    if (testsError) {
      return NextResponse.json({ error: "Failed to load assessment tests" }, { status: 500 })
    }

    const { data: testResults, error } = await supabase
      .from("candidate_test_results")
      .select(
        "id, assessment_test_id, percentage, level_achieved, strong_topics, weak_topics, recommendations, completed_at",
      )
      .eq("candidate_id", user.id)

    if (error) {
      return NextResponse.json({ error: "Failed to load test results" }, { status: 500 })
    }

    if (!testResults || testResults.length === 0) {
      return NextResponse.json(
        {
          error: "No test results found",
          message: "Potrebujete dokončiť aspoň jeden test pre vygenerovanie profilu",
        },
        { status: 400 },
      )
    }

    const swot = generateSWOT(testResults, assessmentTests || [], lang)

    const testMap = new Map<string, AssessmentTest>()
    assessmentTests?.forEach((test) => {
      testMap.set(test.id, test)
    })

    const levelSummary: Record<string, string> = {}
    testResults.forEach((result: TestResult) => {
      if (result.assessment_test_id && result.level_achieved) {
        const testInfo = testMap.get(result.assessment_test_id)
        const displayName = testInfo
          ? getLocalizedText(testInfo, "name", lang) || testInfo.name
          : result.assessment_test_id
        levelSummary[displayName] = result.level_achieved
      }
    })

    const recommendPrefix =
      lang === "en" ? "Recommended improvement:" : lang === "de" ? "Empfohlene Verbesserung:" : "Odporúčame zlepšiť:"
    const recommendations: string[] = []
    swot.weaknesses.slice(0, 3).forEach((w) => {
      recommendations.push(`${recommendPrefix} ${w}`)
    })

    const profileSummary: ProfileSummary = {
      generated_at: new Date().toISOString(),
      tests_count: testResults.length,
      strengths: swot.strengths,
      weaknesses: swot.weaknesses,
      swot,
      level_summary: levelSummary,
      recommendations,
    }

    const { error: updateError } = await supabase
      .from("candidate_profiles")
      .update({ profile_summary: profileSummary })
      .eq("id", user.id)

    if (updateError) {
      return NextResponse.json({ error: "Failed to save profile summary" }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      profile_summary: profileSummary,
    })
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
