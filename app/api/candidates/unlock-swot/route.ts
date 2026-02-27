import { type NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@supabase/ssr"

export async function POST(request: NextRequest) {
  try {
    const { candidateId, companyId } = await request.json()

    const supabase = createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          // No-op for server-side
        },
      },
    })

    // Check if already unlocked
    const { data: existing } = await supabase
      .from("unlocked_profiles")
      .select("id")
      .eq("company_id", companyId)
      .eq("candidate_id", candidateId)
      .single()

    if (existing) {
      return NextResponse.json({ success: true, message: "Already unlocked" })
    }

    // Check coin balance
    const { data: wallet, error: walletError } = await supabase
      .from("coin_wallets")
      .select("balance")
      .eq("company_id", companyId)
      .single()

    if (walletError || !wallet) {
      return NextResponse.json({ error: "Wallet not found" }, { status: 404 })
    }

    if (wallet.balance < 20) {
      return NextResponse.json({ error: "Nedostatok coinov (potrebných 20)" }, { status: 400 })
    }

    // Deduct 20 coins
    const { error: deductError } = await supabase
      .from("coin_wallets")
      .update({ balance: wallet.balance - 20 })
      .eq("company_id", companyId)

    if (deductError) throw deductError

    // Record transaction
    await supabase.from("coin_transactions").insert({
      company_id: companyId,
      user_id: companyId,
      transaction_type: "swot_unlock",
      amount: -20,
      description: `Odomknutie SWOT analýzy kandidáta ${candidateId}`,
    })

    // Save unlocked profile
    await supabase.from("unlocked_profiles").insert({
      company_id: companyId,
      candidate_id: candidateId,
    })

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error("[v0] Error unlocking SWOT:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
