import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function DELETE(request: NextRequest) {
  try {
    const supabase = await createClient()

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Delete candidate profile data
    const { error: candidateError } = await supabase.from("candidate_profiles").delete().eq("id", user.id)

    if (candidateError) {
      console.error("[v0] Error deleting candidate profile:", candidateError)
    }

    // Delete profile data
    const { error: profileError } = await supabase.from("profiles").delete().eq("id", user.id)

    if (profileError) {
      console.error("[v0] Error deleting profile:", profileError)
    }

    // Delete auth user (this will cascade delete related data)
    const { error: deleteError } = await supabase.auth.admin.deleteUser(user.id)

    if (deleteError) {
      console.error("[v0] Error deleting user:", deleteError)
      return NextResponse.json({ error: "Failed to delete account" }, { status: 500 })
    }

    // Sign out the user
    await supabase.auth.signOut()

    return NextResponse.json({ success: true }, { status: 200 })
  } catch (error) {
    console.error("[v0] Error deleting account:", error)
    return NextResponse.json({ error: "Failed to delete account" }, { status: 500 })
  }
}
