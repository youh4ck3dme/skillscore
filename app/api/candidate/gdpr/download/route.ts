import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Fetch user profile data
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single()

    // Fetch candidate profile data
    const { data: candidateProfile, error: candidateError } = await supabase
      .from("candidate_profiles")
      .select("*")
      .eq("user_id", user.id)
      .single()

    // Compile all user data
    const userData = {
      exportDate: new Date().toISOString(),
      user: {
        id: user.id,
        email: user.email,
        createdAt: user.created_at,
        lastSignIn: user.last_sign_in_at,
      },
      profile: profile || {},
      candidateProfile: candidateProfile || {},
    }

    // Return as JSON file
    return new NextResponse(JSON.stringify(userData, null, 2), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Content-Disposition": `attachment; filename="moje-udaje-${new Date().toISOString().split("T")[0]}.json"`,
      },
    })
  } catch (error) {
    console.error("[v0] Error downloading user data:", error)
    return NextResponse.json({ error: "Failed to download data" }, { status: 500 })
  }
}
