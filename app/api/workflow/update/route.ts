import { type NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import { WorkflowManager } from "@/lib/workflow/workflow-manager"

export async function POST(request: NextRequest) {
  try {
    const cookieStore = cookies()
    const supabase = createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
      },
    })

    // Get current user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get user profile to determine user type
    const { data: profile } = await supabase.from("profiles").select("user_type").eq("user_id", user.id).single()

    if (!profile) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 })
    }

    const body = await request.json()
    const { updates } = body

    if (!updates) {
      return NextResponse.json({ error: "Updates required" }, { status: 400 })
    }

    const manager = new WorkflowManager()
    await manager.updateWorkflowState(user.id, profile.user_type, updates)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error in workflow update API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
