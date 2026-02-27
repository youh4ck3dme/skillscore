import { createClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { token } = await request.json()

    if (!token) {
      return NextResponse.json({ error: "Verification token is required" }, { status: 400 })
    }

    const supabase = await createClient()

    // Find user by verification token
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("id, email, verification_token, verification_token_expires_at, email_verified")
      .eq("verification_token", token)
      .single()

    if (profileError || !profile) {
      return NextResponse.json({ error: "Invalid or expired verification token" }, { status: 400 })
    }

    // Check if token is expired
    if (new Date() > new Date(profile.verification_token_expires_at)) {
      return NextResponse.json({ error: "Verification token has expired" }, { status: 400 })
    }

    // Check if already verified
    if (profile.email_verified) {
      return NextResponse.json({ message: "Email is already verified" }, { status: 200 })
    }

    // Update profile to mark email as verified
    const { error: updateError } = await supabase
      .from("profiles")
      .update({
        email_verified: true,
        email_verified_at: new Date().toISOString(),
        verification_token: null,
        verification_token_expires_at: null,
      })
      .eq("id", profile.id)

    if (updateError) {
      console.error("Error updating profile:", updateError)
      return NextResponse.json({ error: "Failed to verify email" }, { status: 500 })
    }

    // Update verification log
    await supabase
      .from("email_verification_logs")
      .update({
        status: "verified",
        verified_at: new Date().toISOString(),
      })
      .eq("token", token)
      .eq("user_id", profile.id)

    return NextResponse.json({
      message: "Email verified successfully",
      email: profile.email,
    })
  } catch (error) {
    console.error("Email verification error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
