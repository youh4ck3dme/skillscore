import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function PATCH(request: Request) {
  try {
    const supabase = await createClient()

    // Get current user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
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

    const body = await request.json()
    const { company_name, contact_person, phone, address, ico, dic } = body

    // Update profiles table (company_name, phone)
    const { error: updateError } = await supabase
      .from("profiles")
      .update({
        company_name,
        phone,
        updated_at: new Date().toISOString(),
      })
      .eq("id", user.id)

    if (updateError) {
      console.error("Error updating profiles:", updateError)
      return NextResponse.json({ error: "Failed to update profile" }, { status: 500 })
    }

    const { data: existingCompanyProfile, error: checkError } = await supabase
      .from("company_profiles")
      .select("id")
      .eq("id", user.id)
      .maybeSingle()

    if (checkError) {
      console.error("Error checking company_profiles:", checkError)
    }

    if (existingCompanyProfile) {
      // Update existing company_profiles record
      const { error: companyUpdateError } = await supabase
        .from("company_profiles")
        .update({
          contact_person,
          ico,
          dic,
          address,
          updated_at: new Date().toISOString(),
        })
        .eq("id", user.id)

      if (companyUpdateError) {
        console.error("Error updating company_profiles:", companyUpdateError)
        return NextResponse.json({ error: "Failed to update company profile" }, { status: 500 })
      }
    } else {
      // Insert new company_profiles record
      const { error: companyInsertError } = await supabase.from("company_profiles").insert({
        id: user.id,
        contact_person,
        ico,
        dic,
        address,
      })

      if (companyInsertError) {
        console.error("Error inserting company_profiles:", companyInsertError)
        return NextResponse.json({ error: "Failed to create company profile" }, { status: 500 })
      }
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error in company profile update:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
