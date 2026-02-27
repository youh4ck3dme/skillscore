import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

const isSupabaseConfigured = () => {
  return !!(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
}

export async function GET() {
  try {
    if (!isSupabaseConfigured()) {
      return NextResponse.json({ mode: "manual" })
    }

    const supabase = await createClient()

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ mode: "manual" })
    }

    const { data, error } = await supabase
      .from("candidate_profiles")
      .select("auto_contact_enabled")
      .eq("id", user.id)
      .single()

    if (error) {
      return NextResponse.json({ mode: "manual" })
    }

    return NextResponse.json({
      mode: data?.auto_contact_enabled ? "auto" : "manual",
    })
  } catch (error) {
    return NextResponse.json({ mode: "manual" })
  }
}

export async function PUT(request: NextRequest) {
  try {
    if (!isSupabaseConfigured()) {
      return NextResponse.json({ error: "Service unavailable in dev mode" }, { status: 503 })
    }

    const supabase = await createClient()

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { mode } = body

    if (!mode || !["manual", "auto"].includes(mode)) {
      return NextResponse.json({ error: "Invalid mode" }, { status: 400 })
    }

    const { error } = await supabase
      .from("candidate_profiles")
      .update({
        auto_contact_enabled: mode === "auto",
        updated_at: new Date().toISOString(),
      })
      .eq("id", user.id)

    if (error) {
      return NextResponse.json({ error: "Failed to update settings" }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      mode,
    })
  } catch (error) {
    return NextResponse.json({ error: "Service unavailable" }, { status: 503 })
  }
}
