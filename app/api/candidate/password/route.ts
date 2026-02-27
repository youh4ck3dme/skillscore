import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function PUT(request: NextRequest) {
  try {
    const supabase = await createClient()

    // Get authenticated user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { currentPassword, newPassword, isSettingPassword } = await request.json()

    // Validate password length
    if (newPassword.length < 6) {
      return NextResponse.json({ error: "Heslo musí mať aspoň 6 znakov" }, { status: 400 })
    }

    if (!isSettingPassword) {
      // Verify current password by attempting to sign in
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: user.email!,
        password: currentPassword,
      })

      if (signInError) {
        return NextResponse.json({ error: "Nesprávne aktuálne heslo" }, { status: 400 })
      }
    }

    // Update password
    const { error: updateError } = await supabase.auth.updateUser({
      password: newPassword,
    })

    if (updateError) {
      console.error("[v0] Error updating password:", updateError)
      return NextResponse.json({ error: updateError.message || "Nepodarilo sa zmeniť heslo" }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0] Error in password update:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
