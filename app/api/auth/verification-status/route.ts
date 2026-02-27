import { createClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"

export const dynamic = "force-dynamic"

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()

    // Get current user
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()

    if (userError || !user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }

    // Get user profile with verification status
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("id, email, email_verified, email_verified_at, user_type")
      .eq("id", user.id)
      .single()

    if (profileError || !profile) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 })
    }

    // Get recent verification attempts
    const { data: recentLogs } = await supabase
      .from("email_verification_logs")
      .select("verification_type, sent_at, status, expires_at")
      .eq("user_id", profile.id)
      .order("sent_at", { ascending: false })
      .limit(5)

    return NextResponse.json({
      email: profile.email,
      emailVerified: profile.email_verified,
      emailVerifiedAt: profile.email_verified_at,
      userType: profile.user_type,
      recentVerificationAttempts: recentLogs || [],
    })
  } catch (error) {
    console.error("Verification status error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
