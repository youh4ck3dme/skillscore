import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const { new_email } = await request.json()

    if (!new_email) {
      return NextResponse.json({ error: "Nový email je povinný" }, { status: 400 })
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

    // Update email - Supabase will send verification email automatically
    const { error: updateError } = await supabase.auth.updateUser({
      email: new_email,
    })

    if (updateError) {
      return NextResponse.json({ error: updateError.message }, { status: 400 })
    }

    return NextResponse.json({
      message: "Overovací email bol odoslaný. Potvrďte zmenu emailu.",
    })
  } catch (error) {
    console.error("Error changing email:", error)
    return NextResponse.json({ error: "Nastala chyba pri zmene emailu" }, { status: 500 })
  }
}
