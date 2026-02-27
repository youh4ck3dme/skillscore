import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"
import { validateName, normalizeName } from "@/lib/validation/name-validator"

export async function POST() {
  try {
    const supabase = await createClient()

    // Get all profiles that might need fixing
    const { data: profiles, error: fetchError } = await supabase
      .from("profiles")
      .select("id, first_name, last_name, email, user_type, company_name")

    if (fetchError) {
      console.error("Failed to fetch profiles:", fetchError)
      return NextResponse.json({ error: "Failed to fetch profiles" }, { status: 500 })
    }

    const fixed: string[] = []

    // Process each profile
    for (const profile of profiles || []) {
      let needsUpdate = false
      const updates: any = {}

      // Check and fix first_name
      if (profile.first_name) {
        const validation = validateName(profile.first_name, "First Name")
        if (!validation.valid) {
          // Invalid name - replace with default
          if (profile.user_type === "candidate") {
            updates.first_name = "Kandidát"
          } else if (profile.user_type === "recruiter") {
            updates.first_name = "Rekrúter"
          } else if (profile.user_type === "company" && profile.company_name) {
            updates.first_name = profile.company_name
          } else {
            updates.first_name = "Používateľ"
          }
          needsUpdate = true
        } else {
          // Valid but might need normalization
          const normalized = normalizeName(profile.first_name)
          if (normalized !== profile.first_name) {
            updates.first_name = normalized
            needsUpdate = true
          }
        }
      } else {
        // Empty first_name
        updates.first_name =
          profile.user_type === "candidate" ? "Kandidát" : profile.user_type === "recruiter" ? "Rekrúter" : "Používateľ"
        needsUpdate = true
      }

      // Check and fix last_name for candidates/recruiters
      if (profile.user_type === "candidate" || profile.user_type === "recruiter") {
        if (profile.last_name) {
          const validation = validateName(profile.last_name, "Last Name")
          if (!validation.valid) {
            updates.last_name = "Nové Meno"
            needsUpdate = true
          } else {
            const normalized = normalizeName(profile.last_name)
            if (normalized !== profile.last_name) {
              updates.last_name = normalized
              needsUpdate = true
            }
          }
        } else {
          updates.last_name = "Nové Meno"
          needsUpdate = true
        }
      }

      // Update if needed
      if (needsUpdate) {
        const { error: updateError } = await supabase.from("profiles").update(updates).eq("id", profile.id)

        if (!updateError) {
          fixed.push(`${profile.email} (${profile.first_name} → ${updates.first_name || profile.first_name})`)
        } else {
          console.error(`Failed to update profile ${profile.email}:`, updateError)
        }
      }
    }

    return NextResponse.json({
      success: true,
      message: `Fixed ${fixed.length} profile(s)`,
      fixed,
    })
  } catch (error) {
    console.error("Profile fix error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
