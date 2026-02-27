import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { getLocalizedField, getLanguageFromHeader } from "@/lib/i18n/get-localized-field"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const family = searchParams.get("family")
    const role = searchParams.get("role")
    const level = searchParams.get("level") || "screen"

    const acceptLanguage = request.headers.get("accept-language")
    const lang = getLanguageFromHeader(acceptLanguage)

    if (!family) {
      return NextResponse.json({ error: "Family parameter is required" }, { status: 400 })
    }

    const supabase = await createClient()

    let query = supabase.from("work_skills_questions").select("*").eq("family", family)

    if (role) {
      query = query.eq("role", role)
    }

    if (level) {
      query = query.eq("level", level)
    }

    const { data: questions, error } = await query

    if (error) {
      console.error("Error fetching questions from Supabase:", error)
      return NextResponse.json({ error: "Failed to fetch questions" }, { status: 500 })
    }

    if (!questions || questions.length === 0) {
      return NextResponse.json({ error: "No questions found" }, { status: 404 })
    }

    const selectedQuestions = questions.sort(() => Math.random() - 0.5).slice(0, 20)

    const localizedQuestions = selectedQuestions.map((q) => {
      const localizedText = getLocalizedField(q, "text", lang)

      // Získaj options podľa jazyka
      let localizedOptions: string[]
      if (lang === "sk") {
        localizedOptions = q.options || []
      } else {
        // EN/DE options sú objekty [{id, text}, ...] - transformuj na plain stringy
        const langOptions = lang === "en" ? q.options_en : q.options_de
        if (langOptions && Array.isArray(langOptions)) {
          localizedOptions = langOptions.map((opt: any, index: number) => {
            if (typeof opt === "object" && opt.text) {
              // Format: "a) Text odpovede"
              const letter = String.fromCharCode(97 + index) // a, b, c, d...
              return `${letter}) ${opt.text}`
            }
            return typeof opt === "string" ? opt : String(opt)
          })
        } else {
          // Fallback na SK ak EN/DE nie je dostupné
          localizedOptions = q.options || []
        }
      }

      return {
        ...q,
        text: localizedText,
        options: localizedOptions,
      }
    })

    return NextResponse.json({
      success: true,
      family,
      family_name: family,
      role,
      level,
      questions: localizedQuestions,
      total_available: questions.length,
    })
  } catch (error) {
    console.error("Error in work-skills/questions:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
