import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    // Mock candidate assignments data - in real implementation, this would come from database
    const assignments = [
      {
        candidate_id: "candidate-1",
        course_id: "1",
        assigned_at: "2024-01-15T10:00:00Z",
        completion_status: "in_progress",
        progress_percentage: 65,
      },
      {
        candidate_id: "candidate-2",
        course_id: "2",
        assigned_at: "2024-01-10T14:30:00Z",
        completion_status: "completed",
        progress_percentage: 100,
      },
      {
        candidate_id: "candidate-3",
        course_id: "3",
        assigned_at: "2024-01-20T09:15:00Z",
        completion_status: "not_started",
        progress_percentage: 0,
      },
    ]

    return NextResponse.json({ assignments })
  } catch (error) {
    console.error("Error in candidate-assignments API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
