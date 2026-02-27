import { type NextRequest, NextResponse } from "next/server"
import { createServiceClient } from "@/lib/supabase/service"

export const dynamic = "force-dynamic"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const companyId = searchParams.get("companyId")

    if (!companyId) {
      return NextResponse.json({ error: "Company ID is required" }, { status: 400 })
    }

    const serviceSupabase = createServiceClient()

    const { data: balanceData, error: balanceError } = await serviceSupabase
      .from("user_balances")
      .select("coin_balance")
      .eq("id", companyId)
      .maybeSingle()

    if (balanceError) {
      console.error("Error fetching balance:", balanceError.message)
    }

    let balance = balanceData?.coin_balance || 0

    if (!balanceData && !balanceError) {
      balance = 0
    }

    // Get recent transactions
    const { data: transactionsData, error: transactionsError } = await serviceSupabase
      .from("coin_transactions")
      .select("*")
      .eq("user_id", companyId)
      .order("created_at", { ascending: false })
      .limit(5)

    if (transactionsError) {
      console.error("Error fetching transactions:", transactionsError.message)
    }

    const transactions = transactionsData || []

    return NextResponse.json({
      balance,
      transactions,
    })
  } catch (error) {
    console.error("Error in coins API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
