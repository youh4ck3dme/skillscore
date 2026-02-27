import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { shouldBypassAuth, getDevUser } from "@/lib/auth/dev-helpers"

export const dynamic = "force-dynamic"

export async function GET(request: Request) {
  try {
    if (shouldBypassAuth()) {
      const referer = request.headers.get("referer") || ""

      let userType: "recruiter" | "candidate" | "company" = "candidate"
      if (referer.includes("/dashboard/recruiter")) {
        userType = "recruiter"
      } else if (referer.includes("/dashboard/company")) {
        userType = "company"
      }

      const devUser = getDevUser(userType)
      if (devUser) {
        const userData: any = {
          id: devUser.id,
          email: devUser.email,
          email_verified: true,
          user_type: devUser.user_type,
        }

        if (userType === "company") {
          userData.company_name = devUser.profile.company_name
          userData.phone = devUser.profile.phone
          userData.anonymous_id = `COM-${devUser.id.slice(0, 8)}`
        } else if (userType === "recruiter") {
          userData.first_name = devUser.profile.first_name
          userData.last_name = devUser.profile.last_name
          userData.anonymous_id = `REC-${devUser.id.slice(0, 8)}`
        } else {
          userData.first_name = devUser.profile.first_name
          userData.last_name = devUser.profile.last_name
          userData.anonymous_id = `CAN-${devUser.id.slice(0, 8)}`
        }

        return NextResponse.json({ user: userData })
      }
    }

    const supabase = await createClient()

    // Get current user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get user profile
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single()

    if (profileError) {
      console.error("Error fetching profile:", profileError)
      return NextResponse.json({ error: "Failed to fetch profile" }, { status: 500 })
    }

    const userData: any = {
      id: user.id,
      email: user.email,
      email_verified: user.email_confirmed_at ? true : false,
      anonymous_id: profile.anonymous_id,
      user_type: profile.user_type,
    }

    // Add user-type specific fields
    if (profile.user_type === "company") {
      userData.company_name = profile.company_name
      userData.phone = profile.phone

      const { data: companyProfile, error: companyError } = await supabase
        .from("company_profiles")
        .select("ico, dic, address, contact_person, website, industry, company_size")
        .eq("id", user.id)
        .maybeSingle()

      if (!companyProfile && !companyError) {
        // Check if there's company_id stored somewhere (from registration)
        const { data: newProfile, error: insertError } = await supabase
          .from("company_profiles")
          .insert({
            id: user.id,
            ico: profile.company_id, // IČO might have been stored during registration - we'll sync it later if needed
          })
          .select("ico, dic, address, contact_person, website, industry, company_size")
          .single()

        if (!insertError && newProfile) {
          userData.ico = newProfile.ico || ""
          userData.dic = newProfile.dic || ""
          userData.address = newProfile.address || ""
          userData.contact_person = newProfile.contact_person || ""
          userData.website = newProfile.website || ""
          userData.industry = newProfile.industry || ""
          userData.company_size = newProfile.company_size || ""
        }
      } else if (companyProfile) {
        userData.ico = companyProfile.ico || ""
        userData.dic = companyProfile.dic || ""
        userData.address = companyProfile.address || ""
        userData.contact_person = companyProfile.contact_person || ""
        userData.website = companyProfile.website || ""
        userData.industry = companyProfile.industry || ""
        userData.company_size = companyProfile.company_size || ""
      }
    } else {
      userData.first_name = profile.first_name
      userData.last_name = profile.last_name
    }

    return NextResponse.json({ user: userData })
  } catch (error) {
    console.error("Error in /api/auth/me:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
