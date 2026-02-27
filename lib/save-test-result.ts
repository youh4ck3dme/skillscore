export interface TestResultData {
  test_id: string
  test_version: string
  score: number
  max_score: number
  percentage: number
  time_spent_seconds: number
  answers: any[]
  started_at: string
  completed_at: string
}

export async function saveTestResult(data: TestResultData): Promise<{ success: boolean; error?: string }> {
  try {
    const response = await fetch("/api/test-results", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      const errorData = await response.json()
      return { success: false, error: errorData.error || "Failed to save test result" }
    }

    return { success: true }
  } catch (error) {
    console.error("[v0] Error saving test result:", error)
    return { success: false, error: "Failed to save test result" }
  }
}
