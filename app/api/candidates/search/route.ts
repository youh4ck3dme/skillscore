import { createClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"
import { generateAnonymousId } from "@/lib/auth/anonymity"

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { filters } = await request.json()

    // Start with base query
    let query = supabase.from("candidate_profiles").select(`
        *,
        profiles!inner(
          id,
          first_name,
          last_name,
          email,
          phone
        ),
        countries!residence_country_id(
          name,
          code
        )
      `)

    // Apply filters based on type
    for (const filter of filters) {
      switch (filter.type) {
        case "language":
          // Filter by language and level in JSONB languages field
          const [language, level] = filter.value.split("-")
          query = query.contains("languages", [{ language, level }])
          break

        case "it":
          // Filter by IT skill and level in JSONB computer_skills field
          const [skill, skillLevel] = filter.value.split("-")
          query = query.contains("computer_skills", [{ skill, level: skillLevel }])
          break

        case "location":
          // Filter by work country preferences
          query = query.contains("work_country_preferences", [filter.value])
          break

        case "experience":
          // Filter by work experience years (this is simplified - in real app you'd have separate work_experience table)
          const [profession, workType, years] = filter.value.split("-")
          // For now, we'll filter by work_experience_years field
          const yearsNum = Number.parseInt(years.replace(/\D/g, "")) || 0
          query = query.gte("work_experience_years", yearsNum)
          break

        case "certificate":
          // Filter by certifications (stored in JSONB or separate table)
          // For now, we'll search in cv_summary text field
          query = query.ilike("cv_summary", `%${filter.value}%`)
          break

        case "availability":
          // Filter by availability date
          const now = new Date()
          let availabilityDate = new Date()

          switch (filter.value) {
            case "immediately":
              availabilityDate = now
              break
            case "1-week":
              availabilityDate.setDate(now.getDate() + 7)
              break
            case "2-weeks":
              availabilityDate.setDate(now.getDate() + 14)
              break
            case "1-month":
              availabilityDate.setMonth(now.getMonth() + 1)
              break
            case "2-months":
              availabilityDate.setMonth(now.getMonth() + 2)
              break
            case "3-months":
              availabilityDate.setMonth(now.getMonth() + 3)
              break
          }

          query = query.lte("availability_date", availabilityDate.toISOString().split("T")[0])
          break
      }
    }

    const { data, error } = await query.limit(50)

    if (error) {
      console.error("Database error:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    const anonymizedCandidates =
      data?.map((candidate) => ({
        ...candidate,
        // Keep CV data but hide personal info
        profiles: {
          id: candidate.profiles.id,
          // Hide personal information
          first_name: null,
          last_name: null,
          email: null,
          phone: null,
        },
        // Add anonymous ID
        anonymous_id: candidate.anonymous_id || generateAnonymousId(),
        // Keep all CV-related fields visible
        languages: candidate.languages,
        computer_skills: candidate.computer_skills,
        work_experience_years: candidate.work_experience_years,
        cv_summary: candidate.cv_summary,
        availability_date: candidate.availability_date,
        work_country_preferences: candidate.work_country_preferences,
        countries: candidate.countries,
      })) || []

    return NextResponse.json({ candidates: anonymizedCandidates })
  } catch (error) {
    console.error("API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
