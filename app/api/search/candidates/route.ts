import { type NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@supabase/ssr"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)

    const language = searchParams.get("language")
    const languageLevel = searchParams.get("languageLevel")
    const itSkill = searchParams.get("itSkill")
    const itLevel = searchParams.get("itLevel")
    const profession = searchParams.get("profession")
    const experienceYears = searchParams.get("experienceYears")
    const location = searchParams.get("location")

    console.log("[v0] Candidate search request:", {
      language,
      languageLevel,
      itSkill,
      itLevel,
      profession,
      experienceYears,
      location,
    })

    const supabase = createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          // No-op for server-side
        },
      },
    })

    const { data: candidates, error } = await supabase
      .from("candidate_profiles")
      .select(
        `
        id,
        anonymous_id,
        languages,
        computer_skills,
        work_experience,
        work_experience_years,
        work_country_preferences,
        education_level,
        salary_expectation,
        availability_date,
        residence_country_id,
        is_hired,
        cv_summary
      `,
      )
      .eq("is_hired", false)

    if (error) {
      console.error("[v0] Supabase query error:", error.message)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    const candidateIds = (candidates || []).map((c) => c.id)

    const { data: testResults } = await supabase
      .from("candidate_test_results")
      .select("candidate_id, assessment_test_id, test_id, total_score, completed_at")
      .in("candidate_id", candidateIds)
      .not("completed_at", "is", null)

    const { data: assessmentTests } = await supabase
      .from("assessment_tests")
      .select("id, name, name_en, name_de, category")

    const assessmentMap = new Map((assessmentTests || []).map((t) => [t.id, t]))

    const testsMap = new Map<string, { completed: any[]; available: any[] }>()

    candidateIds.forEach((candidateId) => {
      testsMap.set(candidateId, { completed: [], available: [] })
    })

    testResults?.forEach((result) => {
      const candidate = testsMap.get(result.candidate_id)
      if (!candidate) return

      let testId = result.test_id

      if (result.assessment_test_id && assessmentMap.has(result.assessment_test_id)) {
        const assessment = assessmentMap.get(result.assessment_test_id)!

        console.log("[v0] Processing test:", {
          assessmentId: result.assessment_test_id,
          assessmentName: assessment.name_en || assessment.name,
          category: assessment.category,
        })

        // Language tests: "English A1" -> LANGUAGE_EN_A1
        if (assessment.category === "language") {
          const name = assessment.name_en || assessment.name
          // Extract level from name (e.g., "English - A1" or "German A2")
          const levelMatch = name.match(/([ABCEFC][12])/i)
          const level = levelMatch ? levelMatch[1].toUpperCase() : null

          if (!level) {
            console.log("[v0] Skipping language test without level:", name)
            return // Skip this test if no level found
          }

          if (name.includes("English")) testId = `LANGUAGE_EN_${level}`
          else if (name.includes("Deutsch") || name.includes("German")) testId = `LANGUAGE_DE_${level}`
          else if (name.includes("Français") || name.includes("French")) testId = `LANGUAGE_FR_${level}`
          else if (name.includes("Español") || name.includes("Spanish")) testId = `LANGUAGE_ES_${level}`
          else if (name.includes("Italiano") || name.includes("Italian")) testId = `LANGUAGE_IT_${level}`
          else {
            console.log("[v0] Skipping unknown language test:", name)
            return // Skip unknown language tests
          }
        }
        // Job skills - removed mapping as they don't exist in TEST_COLUMNS anymore
        else if (assessment.category === "job_skills") {
          console.log("[v0] Skipping job_skills test (not in TEST_COLUMNS):", assessment.name_en || assessment.name)
          return // Skip job skills tests
        }
        // IT tests
        else if (assessment.category === "it") {
          const name = assessment.name_en || assessment.name
          if (name.includes("Beginner") || name.includes("Začiatočník")) testId = "IT_USER_BEGINNER"
          else if (name.includes("Intermediate") || name.includes("Stredný")) testId = "IT_USER_INTERMEDIATE"
          else if (name.includes("Advanced") || name.includes("Pokročilý")) testId = "IT_USER_ADVANCED"
          else if (name.includes("Expert")) testId = "IT_USER_EXPERT"
          else {
            console.log("[v0] Skipping unknown IT test level:", name)
            return
          }
        }
        // Cognitive tests with levels
        else if (assessment.name_en?.includes("Logical") || assessment.name?.includes("Logicko")) {
          const name = assessment.name_en || assessment.name
          if (name.includes("Screen")) testId = "LOGICAL_NUMERICAL_SCREEN"
          else if (name.includes("Standard")) testId = "LOGICAL_NUMERICAL_STANDARD"
          else if (name.includes("Expert")) testId = "LOGICAL_NUMERICAL_EXPERT"
          else {
            console.log("[v0] Skipping unknown Logical test level:", name)
            return
          }
        } else if (assessment.name_en?.includes("Verbal") || assessment.name?.includes("Verbálne")) {
          const name = assessment.name_en || assessment.name
          if (name.includes("Screen")) testId = "VERBAL_SKILLS_SCREEN"
          else if (name.includes("Standard")) testId = "VERBAL_SKILLS_STANDARD"
          else if (name.includes("Expert")) testId = "VERBAL_SKILLS_EXPERT"
          else {
            console.log("[v0] Skipping unknown Verbal test level:", name)
            return
          }
        } else if (assessment.name_en?.includes("Data Entry") || assessment.name?.includes("Zadávanie")) {
          const name = assessment.name_en || assessment.name
          if (name.includes("Screen")) testId = "DATA_ENTRY_SCREEN"
          else if (name.includes("Standard")) testId = "DATA_ENTRY_STANDARD"
          else if (name.includes("Expert")) testId = "DATA_ENTRY_EXPERT"
          else {
            console.log("[v0] Skipping unknown Data Entry test level:", name)
            return
          }
        }
        // Basic tests
        else if (assessment.name_en?.includes("Digital") || assessment.name?.includes("Digitálne")) {
          testId = "DIGITAL_SKILLS"
        } else if (assessment.name_en?.includes("SJT") && assessment.name_en?.includes("Basic")) {
          testId = "SJT_BASIC"
        }
        // Advanced tests
        else if (assessment.name_en?.includes("SJT") && assessment.name_en?.includes("Cognitive")) {
          testId = "SJT_COGNITIVE"
        } else if (assessment.name_en?.includes("Planning") || assessment.name?.includes("Plánovanie")) {
          testId = "PLANNING"
        } else if (assessment.name_en?.includes("Safety") || assessment.name?.includes("BOZP")) {
          testId = "SAFETY_BOZP"
        } else if (assessment.name_en?.includes("Work Sample")) {
          testId = "WORK_SAMPLE"
        } else if (assessment.name_en?.includes("Attention") || assessment.name?.includes("Pozornosť")) {
          testId = "ATTENTION_DETAIL"
        }
        // Retention tests
        else if (assessment.name_en?.includes("Engagement") || assessment.name?.includes("Angažovanosť")) {
          testId = "RET_ENGAGEMENT"
        } else if (assessment.name_en?.includes("Motivators") || assessment.name?.includes("Motivátory")) {
          testId = "RET_MOTIVATORS"
        } else if (assessment.name_en?.includes("Retention Risk") || assessment.name?.includes("Retenčné riziko")) {
          testId = "RET_RISK"
        } else if (assessment.name_en?.includes("Stress") || assessment.name?.includes("Stres")) {
          testId = "RET_STRESS_BURNOUT"
        } else if (assessment.name_en?.includes("Career") || assessment.name?.includes("Kariérny")) {
          testId = "RET_CAREER_GROWTH"
        } else if (assessment.name_en?.includes("Manager") || assessment.name?.includes("manažérom")) {
          testId = "RET_MANAGER_RELATIONSHIP"
        } else if (assessment.name_en?.includes("Culture") || assessment.name?.includes("Kultúrny")) {
          testId = "RET_CULTURE_FIT"
        } else if (assessment.name_en?.includes("Communication") || assessment.name?.includes("Komunikačná")) {
          testId = "RET_COMMUNICATION_CLIMATE"
        } else {
          console.log("[v0] Skipping unmapped test:", assessment.name_en || assessment.name, "- ID:", result.test_id)
          return
        }

        console.log("[v0] Mapped test ID:", testId)
      } else {
        console.log("[v0] Skipping test without assessment mapping:", result.test_id)
        return
      }

      candidate.completed.push({
        testId,
        score: result.total_score,
        completedAt: result.completed_at,
      })
    })

    let filteredCandidates = candidates || []

    if (language || languageLevel) {
      filteredCandidates = filteredCandidates.filter((candidate) => {
        const languages = candidate.languages as any
        if (!languages || !Array.isArray(languages)) return false

        return languages.some((lang: any) => {
          const matchLanguage = !language || lang.language === language
          const matchLevel = !languageLevel || lang.level === languageLevel
          return matchLanguage && matchLevel
        })
      })
      console.log("[v0] After language filter:", filteredCandidates.length)
    }

    if (itSkill || itLevel) {
      filteredCandidates = filteredCandidates.filter((candidate) => {
        const computerSkills = candidate.computer_skills as any
        if (!computerSkills || !Array.isArray(computerSkills)) return false

        return computerSkills.some((skill: any) => {
          const matchSkill = !itSkill || skill.skill === itSkill
          const matchLevel = !itLevel || skill.level === itLevel
          return matchSkill && matchLevel
        })
      })
      console.log("[v0] After IT skill filter:", filteredCandidates.length)
    }

    if (profession) {
      filteredCandidates = filteredCandidates.filter((candidate) => {
        const workExperience = candidate.work_experience as any
        if (!workExperience || !Array.isArray(workExperience)) return false

        return workExperience.some((exp: any) => exp.profession === profession || exp.workType === profession)
      })
      console.log("[v0] After profession filter:", filteredCandidates.length)
    }

    if (experienceYears) {
      const yearsMatch = experienceYears.match(/(\d+)/)
      const yearsNum = yearsMatch ? Number.parseInt(yearsMatch[1], 10) : null

      if (yearsNum !== null && !isNaN(yearsNum)) {
        filteredCandidates = filteredCandidates.filter((candidate) => {
          return candidate.work_experience_years && candidate.work_experience_years >= yearsNum
        })
        console.log("[v0] After experience years filter:", filteredCandidates.length)
      }
    }

    if (location) {
      filteredCandidates = filteredCandidates.filter((candidate) => {
        const workPreferences = candidate.work_country_preferences as any
        if (workPreferences && Array.isArray(workPreferences)) {
          return workPreferences.includes(location)
        }
        return false
      })
      console.log("[v0] After location filter:", filteredCandidates.length)
    }

    const formattedCandidates = filteredCandidates.map((candidate: any) => {
      const candidateTests = testsMap.get(candidate.id) || { completed: [], available: [] }

      return {
        id: candidate.id,
        anonymous_id: candidate.anonymous_id || "N/A",
        languages: candidate.languages,
        computerSkills: candidate.computer_skills,
        computer_skills: candidate.computer_skills,
        workExperience: candidate.work_experience,
        work_experience: candidate.work_experience,
        experienceYears: candidate.work_experience_years,
        work_experience_years: candidate.work_experience_years,
        educationLevel: candidate.education_level,
        education_level: candidate.education_level,
        salaryExpectation: candidate.salary_expectation,
        availabilityDate: candidate.availability_date,
        work_country_preferences: candidate.work_country_preferences,
        completedTests: candidateTests.completed,
        availableTests: candidateTests.available,
        cv_summary: candidate.cv_summary,
      }
    })

    console.log("[v0] Final formatted candidates:", formattedCandidates.length)

    return NextResponse.json({
      candidates: formattedCandidates,
      total: formattedCandidates.length,
    })
  } catch (error) {
    console.error("[v0] Search candidates error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
