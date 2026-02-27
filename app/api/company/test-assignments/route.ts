import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"
import { emailService } from "@/lib/email/resend-service"

export async function GET(request: Request) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const status = searchParams.get("status")

  let query = supabase
    .from("company_test_assignments")
    .select("*")
    .eq("company_id", user.id)
    .order("assigned_at", { ascending: false })

  if (status) {
    query = query.eq("status", status)
  }

  const { data, error } = await query

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ assignments: data })
}

export async function POST(request: Request) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const body = await request.json()
  const { candidate_id, candidate_email, test_id, test_name, notes } = body

  console.log("[v0] Test assignment request:", { candidate_email, test_id, test_name })

  if (!test_id || !test_name) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
  }

  let candidateUserId = candidate_id

  // If email is provided, try to find existing candidate
  if (!candidateUserId && candidate_email) {
    const { data: profileData } = await supabase
      .from("profiles")
      .select("id")
      .eq("email", candidate_email)
      .eq("user_type", "candidate")
      .maybeSingle()

    console.log("[v0] Profile search result:", profileData)

    if (profileData) {
      candidateUserId = profileData.id
      console.log("[v0] Found existing candidate:", candidateUserId)
    } else {
      console.log("[v0] No existing candidate found, will use email only")
    }
  }

  const { data: assignment, error: assignmentError } = await supabase
    .from("company_test_assignments")
    .insert({
      company_id: user.id,
      candidate_id: candidateUserId || null, // Can be null if candidate doesn't exist yet
      candidate_email: candidate_email || null, // Store email for later matching
      test_id,
      test_name,
      notes: notes || null,
      status: "pending",
      assigned_at: new Date().toISOString(),
    })
    .select()
    .single()

  if (assignmentError) {
    console.error("[v0] Assignment error:", assignmentError)
    return NextResponse.json({ error: assignmentError.message }, { status: 500 })
  }

  console.log("[v0] Test assignment created:", assignment.id)

  const { data: companyProfile } = await supabase.from("profiles").select("company_name").eq("id", user.id).single()

  // Send email notification
  if (candidate_email) {
    try {
      const testUrl = `${process.env.NEXT_PUBLIC_APP_URL}/auth/register?type=candidate&test=${assignment.id}&email=${encodeURIComponent(candidate_email)}`

      console.log("[v0] Attempting to send email to:", candidate_email)
      console.log("[v0] Test URL:", testUrl)

      const emailResult = await emailService.sendEmail({
        to: candidate_email,
        subject: `Pozvánka na test od ${companyProfile?.company_name || "firmy"}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #0d9488;">Pozvánka na test</h2>
            <p>Dobrý deň,</p>
            <p>Firma <strong>${companyProfile?.company_name || "SOMVIAC"}</strong> vám pridelila test:</p>
            <div style="background: #f0fdfa; padding: 15px; border-radius: 8px; margin: 20px 0;">
              <p style="margin: 0; font-size: 18px; font-weight: bold; color: #0d9488;">${test_name}</p>
            </div>
            ${notes ? `<p><strong>Poznámka:</strong> ${notes}</p>` : ""}
            <p>Kliknite na tlačidlo nižšie pre registráciu a vykonanie testu:</p>
            <a href="${testUrl}" style="display: inline-block; background: #0d9488; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 10px 0;">
              Registrovať sa a vykonať test
            </a>
            <p style="color: #666; font-size: 14px; margin-top: 30px;">
              Ak už máte účet, prihláste sa pomocou tohto emailu.
            </p>
          </div>
        `,
      })

      console.log("[v0] Email send result:", emailResult)

      if (!emailResult.success) {
        console.error("[v0] Email failed:", emailResult.error)
        return NextResponse.json(
          {
            error: `Test pridelený, ale email zlyhal: ${emailResult.error}`,
            assignment,
          },
          { status: 500 },
        )
      }
    } catch (emailError) {
      console.error("[v0] Failed to send test assignment email:", emailError)
      return NextResponse.json(
        {
          error: `Test pridelený, ale email zlyhal: ${emailError instanceof Error ? emailError.message : "Unknown error"}`,
          assignment,
        },
        { status: 500 },
      )
    }
  }

  return NextResponse.json({
    success: true,
    assignment,
    message: candidate_email ? "Test pridelený a email odoslaný" : "Test pridelený",
  })
}
