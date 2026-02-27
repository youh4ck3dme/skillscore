import { createClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 })
    }

    const supabase = await createClient()

    // Find user by email
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("id, email, email_verified, user_type, first_name, last_name, company_name")
      .eq("email", email)
      .single()

    if (profileError || !profile) {
      // Don't reveal if email exists or not for security
      return NextResponse.json({
        message: "If the email exists, a verification email has been sent",
      })
    }

    // Check if already verified
    if (profile.email_verified) {
      return NextResponse.json({ error: "Email is already verified" }, { status: 400 })
    }

    // Generate new verification token
    const verificationToken = crypto.randomUUID().replace(/-/g, "")
    const expiresAt = new Date()
    expiresAt.setHours(expiresAt.getHours() + 24) // 24 hours expiry

    // Update profile with new token
    const { error: updateError } = await supabase
      .from("profiles")
      .update({
        verification_token: verificationToken,
        verification_token_expires_at: expiresAt.toISOString(),
      })
      .eq("id", profile.id)

    if (updateError) {
      console.error("Error updating verification token:", updateError)
      return NextResponse.json({ error: "Failed to generate verification token" }, { status: 500 })
    }

    // Log the verification attempt
    await supabase.from("email_verification_logs").insert({
      user_id: profile.id,
      email: profile.email,
      verification_type: "resend",
      token: verificationToken,
      expires_at: expiresAt.toISOString(),
      status: "pending",
    })

    // Send verification email
    const verificationUrl = `${process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL || "http://localhost:3000"}/auth/verify?token=${verificationToken}`

    // Determine user display name based on type
    let displayName = profile.email
    if (profile.user_type === "company") {
      displayName = profile.company_name || profile.email
    } else if (profile.first_name && profile.last_name) {
      displayName = `${profile.first_name} ${profile.last_name}`
    }

    // Send email using existing email service
    const emailResponse = await fetch(`${request.nextUrl.origin}/api/email/send`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        to: profile.email,
        subject: "Potvrďte svoj email - SOMVIAC",
        template: "email-verification",
        data: {
          displayName,
          verificationUrl,
          userType: profile.user_type,
        },
      }),
    })

    if (!emailResponse.ok) {
      console.error("Failed to send verification email")
      // Don't fail the request, just log the error
    }

    return NextResponse.json({
      message: "Verification email has been sent",
    })
  } catch (error) {
    console.error("Resend verification error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
