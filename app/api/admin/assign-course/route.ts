import { type NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@supabase/ssr"

export async function POST(request: NextRequest) {
  try {
    const { candidate_id, course_id } = await request.json()

    const supabase = createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value
        },
        set() {},
        remove() {},
      },
    })

    // Log the course assignment
    const { error: logError } = await supabase.from("admin_activity_log").insert({
      admin_id: "admin-system",
      target_user_id: candidate_id,
      action: "course_assignment",
      details: {
        course_id: course_id,
        assigned_by: "Admin System",
      },
    })

    if (logError) {
      console.error("Error logging course assignment:", logError)
      return NextResponse.json({ error: "Failed to log course assignment" }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      message: "Course assigned successfully",
    })
  } catch (error) {
    console.error("Error assigning course:", error)
    return NextResponse.json({ error: "Failed to assign course" }, { status: 500 })
  }
}
