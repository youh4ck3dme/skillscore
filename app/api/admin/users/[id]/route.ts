import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export const dynamic = "force-dynamic"

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const supabase = await createClient()
    const { action } = await request.json()

    // Get current user and verify admin access
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Check if user is admin
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("user_type, is_admin")
      .eq("id", user.id)
      .single()

    if (profileError || !profile?.is_admin) {
      return NextResponse.json({ error: "Admin access required" }, { status: 403 })
    }

    const userId = params.id

    // Perform the requested action
    switch (action) {
      case "block":
        const { error: blockError } = await supabase.from("profiles").update({ status: "blocked" }).eq("id", userId)

        if (blockError) {
          return NextResponse.json({ error: "Failed to block user" }, { status: 500 })
        }
        break

      case "unblock":
        const { error: unblockError } = await supabase.from("profiles").update({ status: "active" }).eq("id", userId)

        if (unblockError) {
          return NextResponse.json({ error: "Failed to unblock user" }, { status: 500 })
        }
        break

      case "delete":
        // Note: This should be implemented carefully with GDPR compliance
        const { error: deleteError } = await supabase.from("profiles").delete().eq("id", userId)

        if (deleteError) {
          return NextResponse.json({ error: "Failed to delete user" }, { status: 500 })
        }
        break

      default:
        return NextResponse.json({ error: "Invalid action" }, { status: 400 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error in admin user action:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
