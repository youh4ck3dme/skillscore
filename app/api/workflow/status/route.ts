import { type NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"

export const dynamic = "force-dynamic"

export async function GET(request: NextRequest) {
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

    // Get workflow state
    const { data: workflowState } = await supabase
      .from("workflow_states")
      .select("*")
      .eq("user_id", user.id)
      .eq("user_type", profile.user_type)
      .single()

    return NextResponse.json({
      workflowState: workflowState || {
        current_state: "registered",
        state_data: {},
        updated_at: new Date().toISOString(),
      },
    })
  } catch (error) {
    console.error("Error in workflow status API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
