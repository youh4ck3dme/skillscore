import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get("code")
  const error = requestUrl.searchParams.get("error")
  const errorDescription = requestUrl.searchParams.get("error_description")

  if (error) {
    console.error("OAuth error:", error, errorDescription)
    return NextResponse.redirect(
      `${requestUrl.origin}/auth/login?error=${encodeURIComponent(errorDescription || error)}`,
    )
  }

  if (code) {
    try {
      const supabase = await createClient()

      const { data, error: exchangeError } = await supabase.auth.exchangeCodeForSession(code)

      if (exchangeError) {
        console.error("Code exchange error:", exchangeError)
        return NextResponse.redirect(
          `${requestUrl.origin}/auth/login?error=${encodeURIComponent(exchangeError.message)}`,
        )
      }

      if (!data.user) {
        console.error("No user data after exchange")
        return NextResponse.redirect(`${requestUrl.origin}/auth/login?error=no_user_data`)
      }

      const { data: existingProfile, error: profileError } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", data.user.id)
        .maybeSingle()

      if (profileError) {
        console.error("Error checking profile:", profileError)
      }

      if (existingProfile) {
        const dashboardUrl = `${requestUrl.origin}/dashboard/${existingProfile.user_type}`
        return NextResponse.redirect(dashboardUrl)
      }

      const completeUrl = `${requestUrl.origin}/auth/callback/complete`
      return NextResponse.redirect(completeUrl)
    } catch (err) {
      console.error("Unexpected error:", err)
      return NextResponse.redirect(
        `${requestUrl.origin}/auth/login?error=${encodeURIComponent("Unexpected error occurred")}`,
      )
    }
  }

  console.error("No code provided")
  return NextResponse.redirect(`${requestUrl.origin}/auth/login?error=no_code_provided`)
}
