import { createServerClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const supabase = await createServerClient()
    const { currentPassword, newPassword } = await request.json()

    if (!currentPassword || !newPassword) {
      return NextResponse.json({ error: "Všetky polia sú povinné" }, { status: 400 })
    }

    if (newPassword.length < 6) {
      return NextResponse.json({ error: "Nové heslo musí mať aspoň 6 znakov" }, { status: 400 })
    }

    // Get current user
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()

    if (userError || !user) {
      return NextResponse.json({ error: "Neautorizovaný prístup" }, { status: 401 })
    }

    // Verify current password by attempting to sign in
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: user.email!,
      password: currentPassword,
    })

    if (signInError) {
      return NextResponse.json({ error: "Aktuálne heslo je nesprávne" }, { status: 400 })
    }

    // Update password
    const { error: updateError } = await supabase.auth.updateUser({
      password: newPassword,
    })

    if (updateError) {
      return NextResponse.json({ error: updateError.message }, { status: 400 })
    }

    return NextResponse.json({
      message: "Heslo bolo úspešne zmenené",
    })
  } catch (error) {
    console.error("Error changing password:", error)
    return NextResponse.json({ error: "Nastala chyba pri zmene hesla" }, { status: 500 })
  }
}
