import { createServerClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const supabase = await createServerClient()
    const { newEmail } = await request.json()

    if (!newEmail) {
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

    // Update email - Supabase will send verification email automatically
    const { error: updateError } = await supabase.auth.updateUser({
      email: newEmail,
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
