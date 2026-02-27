import { type NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"

export const dynamic = "force-dynamic"

export async function GET(request: NextRequest) {
  try {
    const cookieStore = cookies()
    const supabase = createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
      },
    })

    const { searchParams } = new URL(request.url)
    const recruiterId = searchParams.get("recruiterId")

    if (!recruiterId) {
      return NextResponse.json({ error: "Recruiter ID required" }, { status: 400 })
    }

    // Check if recruiter has signed the cooperation contract
    const { data: contract, error } = await supabase
      .from("recruiter_contracts")
      .select("id, signed_at, contract_version")
      .eq("recruiter_id", recruiterId)
      .eq("contract_type", "cooperation")
      .order("signed_at", { ascending: false })
      .limit(1)
      .single()

    if (error && error.code !== "PGRST116") {
      // PGRST116 = no rows returned
      console.error("Error checking contract status:", error)
      return NextResponse.json({ error: "Database error" }, { status: 500 })
    }

    return NextResponse.json({
      contractSigned: !!contract,
      contractVersion: contract?.contract_version || null,
      signedAt: contract?.signed_at || null,
    })
  } catch (error) {
    console.error("Error in recruiter-contract-status:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
