import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export const dynamic = "force-dynamic"

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()

    // Get current user and verify admin access
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Check if user is admin
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("user_type, is_admin")
      .eq("id", user.id)
      .single()

    if (profileError || !profile?.is_admin) {
      return NextResponse.json({ error: "Admin access required" }, { status: 403 })
    }

    // Get query parameters
    const { searchParams } = new URL(request.url)
    const year = searchParams.get("year") || new Date().getFullYear().toString()

    // Get monthly financial data for the year
    const financials = []

    for (let month = 1; month <= 12; month++) {
      const startDate = `${year}-${month.toString().padStart(2, "0")}-01`
      const endDate = new Date(Number.parseInt(year), month, 0).toISOString().split("T")[0]

      // Get commissions for this month
      const { data: monthlyCommissions } = await supabase
        .from("recruiter_commissions")
        .select("monthly_amount, commission_type")
        .gte("created_at", startDate)
        .lte("created_at", endDate)
        .eq("status", "paid")

      const recruiterCommissions = monthlyCommissions?.reduce((sum, c) => sum + c.monthly_amount, 0) || 0

      // Calculate based on 5% monthly payment system
      // If recruiters get 20% of the 5%, then total revenue is recruiterCommissions / 0.20 * 0.05
      const totalRevenue = recruiterCommissions > 0 ? recruiterCommissions / 0.2 : 0

      // 10% goes to candidate investment (from platform's share)
      const candidateInvestment = totalRevenue * 0.1

      // Platform profit is what's left after recruiter commissions and candidate investment
      const platformProfit = totalRevenue - recruiterCommissions - candidateInvestment

      const totalCommissions = recruiterCommissions

      if (totalRevenue > 0) {
        financials.push({
          month: month.toString(),
          year: Number.parseInt(year),
          total_revenue: totalRevenue,
          total_commissions: totalCommissions,
          recruiter_commissions: recruiterCommissions,
          platform_profit: platformProfit,
          candidate_investment: candidateInvestment,
        })
      }
    }

    return NextResponse.json({ financials })
  } catch (error) {
    console.error("Error in admin financials route:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
