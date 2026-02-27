import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

const TEST_CODE_MAP: Record<string, string> = {
  "test-digi": "DIGITAL_SKILLS",
  "test-job-skills": "JOB_SKILLS",
  "test-lang": "LANGUAGE",
  "test-sjt": "SJT_BASIC",
  "test-it-user": "IT_USER_L1",
  "test-lognum": "LOGICAL_NUMERICAL",
  "test-verbal": "VERBAL_SKILLS",
  "test-detail": "ATTENTION_DETAIL",
  "test-plan": "PLANNING",
  "test-dataentry": "DATA_ENTRY",
  "test-co-sjt": "SJT_COGNITIVE",
  "test-sjt-advanced": "SJT_COGNITIVE",
  "test-ohs": "SAFETY_BOZP",
  "test-worksample": "WORK_SAMPLE",
  "test-ret-risk": "RET_RISK",
  "test-ret-engagement": "RET_ENGAGEMENT",
  "test-ret-motivators": "RET_MOTIVATORS",
  "test-ret-stress": "RET_STRESS_BURNOUT",
  "test-ret-manager": "RET_MANAGER_RELATIONSHIP",
  "test-ret-career": "RET_CAREER_GROWTH",
  "test-ret-communication": "RET_COMMUNICATION_CLIMATE",
  "test-ret-environment": "RET_WORK_ENVIRONMENT",
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const testCode = searchParams.get("testCode")

    if (!testCode) {
      return NextResponse.json({ error: "Missing testCode" }, { status: 400 })
    }

    const dbTestCode = TEST_CODE_MAP[testCode.toLowerCase()] || testCode.toUpperCase()

    const supabase = await createClient()

    const { data: test, error: testError } = await supabase
      .from("assessment_tests")
      .select("*")
      .eq("id", dbTestCode)
      .single()

    if (testError || !test) {
      return NextResponse.json({ error: "Test not found" }, { status: 404 })
    }

    let levels: string[] = []

    if (dbTestCode === "DIGITAL_SKILLS") {
      levels = ["screen", "standard", "expert"]
    } else if (dbTestCode === "LANGUAGE") {
      levels = ["A1", "A2", "B1", "B2", "C1"]
    } else if (dbTestCode.includes("IT_")) {
      levels = ["junior", "medior", "senior"]
    } else {
      levels = ["standard"]
    }

    return NextResponse.json({
      testCode,
      testName: test.name,
      levels,
    })
  } catch (error) {
    console.error("Error in test levels API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
