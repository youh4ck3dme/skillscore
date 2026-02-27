import { type NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase/server"
import { cookies } from "next/headers"

export const dynamic = "force-dynamic"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const companyId = searchParams.get("companyId")

    if (!companyId) {
      return NextResponse.json({ error: "Company ID is required" }, { status: 400 })
    }

    // Create Supabase client
    const cookieStore = cookies()
    const supabase = createServerClient(cookieStore)

    // Get current balance
    const { data: balanceData, error: balanceError } = await supabase
      .from("coin_wallets")
      .select("balance")
      .eq("company_id", companyId)
      .single()

    if (balanceError && balanceError.code !== "PGRST116") {
      console.error("Error fetching balance:", balanceError)
      return NextResponse.json({ error: "Failed to fetch balance", details: balanceError.message }, { status: 500 })
    }

    // Get recent transactions
    const { data: transactionsData, error: transactionsError } = await supabase
      .from("coin_transactions")
      .select("*")
      .eq("company_id", companyId)
      .order("created_at", { ascending: false })
      .limit(10)

    if (transactionsError) {
      console.error("Error fetching transactions:", transactionsError)
      return NextResponse.json(
        { error: "Failed to fetch transactions", details: transactionsError.message },
        { status: 500 },
      )
    }

    return NextResponse.json({
      success: true,
      balance: balanceData?.balance || 0,
      transactions: transactionsData || [],
      message: "Balance and transactions fetched successfully",
    })
  } catch (error) {
    console.error("Error in coins balance API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
