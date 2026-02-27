import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export const dynamic = "force-dynamic"

const LANGUAGE_CODE_MAP: Record<string, string> = {
  // English
  english: "en",
  angličtina: "en",
  anglictina: "en",
  en: "en",

  // German
  german: "de",
  nemčina: "de",
  nemcina: "de",
  de: "de",
  deutsch: "de",

  // French
  french: "fr",
  francúzština: "fr",
  francuzstina: "fr",
  fr: "fr",
  français: "fr",

  // Spanish
  spanish: "es",
  španielčina: "es",
  spanielcina: "es",
  es: "es",
  español: "es",

  // Italian
  italian: "it",
  taliančina: "it",
  taliancina: "it",
  it: "it",
  italiano: "it",
}

const AVAILABLE_LANGUAGES = ["en", "de", "fr", "es", "it"]

const LEVEL_ORDER = ["a1", "a2", "b1", "b2", "c1", "c2"]

const LEVEL_HIERARCHY: Record<string, string[]> = {
  c2: ["c2", "c1", "b2", "b1", "a2", "a1"],
  c1: ["c1", "b2", "b1", "a2", "a1"],
  b2: ["b2", "b1", "a2", "a1"],
  b1: ["b1", "a2", "a1"],
  a2: ["a2", "a1"],
  a1: ["a1"],
}

function getLevelIndex(level: string): number {
  return LEVEL_ORDER.indexOf(level.toLowerCase())
}

function getAdjacentLevel(currentLevel: string, direction: "up" | "down"): string | null {
  const currentIndex = getLevelIndex(currentLevel)
  if (currentIndex === -1) return null

  if (direction === "down") {
    return currentIndex > 0 ? LEVEL_ORDER[currentIndex - 1] : null
  } else {
    return currentIndex < LEVEL_ORDER.length - 1 ? LEVEL_ORDER[currentIndex + 1] : null
  }
}

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { data: profile, error: profileError } = await supabase
      .from("candidate_profiles")
      .select("cv_summary")
      .eq("id", user.id)
      .single()

    if (profileError || !profile) {
      return NextResponse.json({ tests: [] })
    }

    const languages = profile?.cv_summary?.skills?.languages || []

    const { data: completedTests } = await supabase
      .from("candidate_test_results")
      .select("test_id, percentage, level_achieved, recommendations")
      .eq("candidate_id", user.id)

    const completedMap = new Map()
    const recommendations: Array<{ language: string; level: string }> = []

    completedTests?.forEach((test) => {
      if (test.test_id && typeof test.test_id === "string" && test.test_id.startsWith("test-lang-")) {
        completedMap.set(test.test_id, {
          score: test.percentage,
          level: test.level_achieved,
        })

        const parts = test.test_id.split("-")
        if (parts.length >= 3) {
          const langCode = parts[2]
          const currentLevel = test.level_achieved?.toLowerCase()

          if (test.recommendations && typeof test.recommendations === "object") {
            const recs = test.recommendations as any
            let recommendedLevel: string | null = null

            if (recs.levelRecommendation === "downgrade") {
              recommendedLevel = getAdjacentLevel(currentLevel, "down")
            } else if (recs.levelRecommendation === "upgrade") {
              recommendedLevel = getAdjacentLevel(currentLevel, "up")
            }

            if (recommendedLevel && AVAILABLE_LANGUAGES.includes(langCode)) {
              recommendations.push({
                language: langCode,
                level: recommendedLevel,
              })
            }
          }
        }
      }
    })

    const tests: Array<{
      language: string
      level: string
      testId: string
      completed: boolean
      score?: number
    }> = []

    languages.forEach((lang: any) => {
      const langName = lang.language?.toLowerCase() || ""
      const level = lang.level?.toLowerCase() || ""

      if (!langName || !level) return

      const langCode = LANGUAGE_CODE_MAP[langName]

      if (!langCode || !AVAILABLE_LANGUAGES.includes(langCode)) {
        return
      }

      const normalizedLevel = level.split(/[\s-]/)[0].toLowerCase()

      // Get all available levels for this language based on the CV level
      const availableLevels = LEVEL_HIERARCHY[normalizedLevel] || [normalizedLevel]

      // Create a test entry for each available level
      availableLevels.forEach((availableLevel) => {
        const testId = `test-lang-${langCode}-${availableLevel}`
        const completed = completedMap.get(testId)

        tests.push({
          language: langCode,
          level: availableLevel,
          testId,
          completed: !!completed,
          score: completed?.score,
        })
      })
    })

    recommendations.forEach((rec) => {
      const exists = tests.some((test) => test.language === rec.language && test.level === rec.level)

      if (!exists) {
        const testId = `test-lang-${rec.language}-${rec.level}`
        tests.push({
          language: rec.language,
          level: rec.level,
          testId,
          completed: false,
          score: undefined,
        })
      }
    })

    return NextResponse.json({ tests })
  } catch (error) {
    console.error("Error fetching language tests:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
