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

    // Get contacted count (contact_reveal transactions)
    const { count: contactedCount, error: contactedError } = await serviceSupabase
      .from("coin_transactions")
      .select("*", { count: "exact", head: true })
      .eq("company_id", companyId)
      .eq("transaction_type", "contact_reveal")

    if (contactedError) {
      console.error("Error fetching contacted count:", contactedError.message)
    }

    // Get hired count (hire transactions)
    const { count: hiredCount, error: hiredError } = await serviceSupabase
      .from("coin_transactions")
      .select("*", { count: "exact", head: true })
      .eq("company_id", companyId)
      .eq("transaction_type", "hire")

    if (hiredError) {
      console.error("Error fetching hired count:", hiredError.message)
    }

    return NextResponse.json({
      contactedCount: contactedCount || 0,
      hiredCount: hiredCount || 0,
    })
  } catch (error) {
    console.error("Error in company stats API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
