import { type NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase/server"
import { cookies } from "next/headers"

export async function POST(request: NextRequest) {
  try {
    const cookieStore = cookies()
    const supabase = createServerClient(cookieStore)

    // Get current user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const {
      candidateId,
      candidateEmail,
      country,
      occupation,
      workType,
      monthlyPayment,
      startDate,
      contractType,
      notes,
    } = body

    // Validate required fields
    if (!candidateId || !candidateEmail || !country || !occupation || !monthlyPayment || !startDate || !contractType) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Get company profile
    const { data: companyProfile, error: profileError } = await supabase
      .from("profiles")
      .select("id")
      .eq("user_id", user.id)
      .eq("user_type", "company")
      .single()

    if (profileError || !companyProfile) {
      return NextResponse.json({ error: "Company profile not found" }, { status: 404 })
    }

    // Create employment confirmation record
    const { data: employment, error: employmentError } = await supabase
      .from("employment_confirmations")
      .insert({
        company_id: companyProfile.id,
        candidate_id: candidateId,
        candidate_email: candidateEmail,
        country,
        occupation,
        work_type: workType,
        monthly_payment_coins: monthlyPayment,
        start_date: startDate,
        contract_type: contractType,
        notes,
        status: "active",
      })
      .select()
      .single()

    if (employmentError) {
      console.error("Employment confirmation error:", employmentError)
      return NextResponse.json({ error: "Failed to confirm employment" }, { status: 500 })
    }

    // Create first monthly payment record (due next month)
    const nextMonth = new Date()
    nextMonth.setMonth(nextMonth.getMonth() + 1)
    nextMonth.setDate(1) // First day of next month

    const { error: paymentError } = await supabase.from("monthly_payments").insert({
      employment_id: employment.id,
      company_id: companyProfile.id,
      candidate_id: candidateId,
      amount_coins: monthlyPayment,
      due_date: nextMonth.toISOString().split("T")[0],
      status: "pending",
    })

    if (paymentError) {
      console.error("Monthly payment creation error:", paymentError)
      // Don't fail the whole operation, just log the error
    }

    return NextResponse.json({
      success: true,
      employment,
      message: "Employment confirmed successfully",
    })
  } catch (error) {
    console.error("Employment confirmation error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
