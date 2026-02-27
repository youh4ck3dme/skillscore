import { type NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@supabase/ssr"

export const dynamic = "force-dynamic"

export async function GET(request: NextRequest) {
  try {
    const supabase = createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value
        },
        set() {},
        remove() {},
      },
    })

    // Fetch candidates with their skills and test results
    const { data: candidates, error } = await supabase.from("candidate_profiles").select(`
        id,
        anonymous_id,
        computer_skills,
        languages,
        education_level,
        work_experience_years,
        profiles!fk_candidate_profiles_id(first_name, last_name),
        test_orders(test_type, results, status)
      `)

    if (error) {
      console.error("Error fetching candidates skills:", error)
      return NextResponse.json({ error: "Failed to fetch candidates skills" }, { status: 500 })
    }

    // Process candidates data and calculate scores
    const processedCandidates = candidates.map((candidate: any) => {
      // Calculate overall score based on skills, education, experience
      let score = 0

      // Computer skills scoring (0-30 points)
      if (candidate.computer_skills) {
        const skillsCount = Object.keys(candidate.computer_skills).length
        score += Math.min(skillsCount * 5, 30)
      }

      // Education scoring (0-25 points)
      const educationScores: { [key: string]: number } = {
        základné: 5,
        stredné: 15,
        vysokoškolské: 25,
        doktorandské: 25,
      }
      score += educationScores[candidate.education_level] || 0

      // Experience scoring (0-25 points)
      score += Math.min(candidate.work_experience_years * 3, 25)

      // Language skills scoring (0-20 points)
      if (candidate.languages) {
        const languageCount = Object.keys(candidate.languages).length
        score += Math.min(languageCount * 5, 20)
      }

      // Recommend tests based on profile
      const recommendedTests = []
      if (candidate.work_experience_years < 2) {
        recommendedTests.push("Základné zručnosti")
      }
      if (candidate.computer_skills && Object.keys(candidate.computer_skills).length > 3) {
        recommendedTests.push("Technické zručnosti")
      }

      return {
        id: candidate.id,
        anonymous_id: candidate.anonymous_id,
        first_name: candidate.profiles?.first_name,
        last_name: candidate.profiles?.last_name,
        computer_skills: candidate.computer_skills,
        languages: candidate.languages,
        education_level: candidate.education_level,
        work_experience_years: candidate.work_experience_years,
        test_results: candidate.test_orders,
        overall_score: Math.min(score, 100),
        recommended_tests: recommendedTests,
      }
    })

    return NextResponse.json({ candidates: processedCandidates })
  } catch (error) {
    console.error("Error in candidates-skills API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
