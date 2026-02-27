import { type NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase/server"
import { cookies } from "next/headers"

export const dynamic = "force-dynamic"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const companyId = searchParams.get("companyId")
    const limit = Number.parseInt(searchParams.get("limit") || "20")
    const offset = Number.parseInt(searchParams.get("offset") || "0")

    if (!companyId) {
      return NextResponse.json({ error: "Company ID is required" }, { status: 400 })
    }

    // Create Supabase client
    const cookieStore = cookies()
    const supabase = createServerClient(cookieStore)

    // Get transactions with pagination
    const {
      data: transactionsData,
      error: transactionsError,
      count,
    } = await supabase
      .from("coin_transactions")
      .select("*", { count: "exact" })
      .eq("company_id", companyId)
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1)

    if (transactionsError) {
      console.error("Error fetching transactions:", transactionsError)
      return NextResponse.json(
        { error: "Failed to fetch transactions", details: transactionsError.message },
        { status: 500 },
      )
    }

    return NextResponse.json({
      success: true,
      transactions: transactionsData || [],
      total: count || 0,
      limit,
      offset,
      message: "Transactions fetched successfully",
    })
  } catch (error) {
    console.error("Error in coins transactions API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
