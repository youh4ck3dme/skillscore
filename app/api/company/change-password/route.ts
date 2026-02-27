import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const { current_password, new_password } = await request.json()

    if (!current_password || !new_password) {
      return NextResponse.json({ error: "Všetky polia sú povinné" }, { status: 400 })
    }

    if (new_password.length < 6) {
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

    // Verify user is a company
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("user_type")
      .eq("id", user.id)
      .single()

    if (profileError || profile?.user_type !== "company") {
      return NextResponse.json({ error: "Company access required" }, { status: 403 })
    }

    // Verify current password by attempting to sign in
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: user.email!,
      password: current_password,
    })

    if (signInError) {
      return NextResponse.json({ error: "Aktuálne heslo je nesprávne" }, { status: 400 })
    }

    // Update password
    const { error: updateError } = await supabase.auth.updateUser({
      password: new_password,
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
