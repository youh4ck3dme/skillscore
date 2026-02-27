import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { candidateId, country, profession, jobType, monthlyPayment, requiredCoins } = body

    // Check if company has enough coins
    const { data: coinBalance, error: balanceError } = await supabase.rpc("get_coin_balance", { company_id: user.id })

    const minimumRequired = 50 // Fixed 50 coins minimum

    if (balanceError || coinBalance < minimumRequired) {
      return NextResponse.json(
        {
          error: "Insufficient coins",
          required: minimumRequired,
          available: coinBalance || 0,
        },
        { status: 400 },
      )
    }

    // Get candidate email
    const { data: candidate, error: candidateError } = await supabase
      .from("profiles")
      .select("email, user_id")
      .eq("id", candidateId)
      .single()

    if (candidateError || !candidate) {
      return NextResponse.json({ error: "Candidate not found" }, { status: 404 })
    }

    // Record the contact reveal
    const { error: revealError } = await supabase.from("contact_reveals").insert({
      company_id: user.id,
      candidate_id: candidateId,
      country,
      profession,
      job_type: jobType,
      monthly_payment: monthlyPayment,
      required_coins: requiredCoins,
      status: "revealed",
    })

    if (revealError) {
      console.error("Error recording contact reveal:", revealError)
      return NextResponse.json({ error: "Failed to record reveal" }, { status: 500 })
    }

    // Deduct coins (this will be handled by database trigger)
    // Note: Coins will be deducted later based on payment date (5 days after candidate's salary payment)

    return NextResponse.json({
      email: candidate.email,
      monthlyPayment,
      maxMonths: 6,
      totalAmount: monthlyPayment * 6,
    })
  } catch (error) {
    console.error("Error in reveal-contact:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
