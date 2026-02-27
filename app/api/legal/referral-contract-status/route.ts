import { type NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@supabase/ssr"

export const dynamic = "force-dynamic"

export async function GET(request: NextRequest) {
  try {
    const supabase = createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value
        },
        set() {},
        remove() {},
      },
    })

    // Get current user
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()
    if (userError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Check if user has signed referral contract
    const { data: contract, error: contractError } = await supabase
      .from("referral_contracts")
      .select("id, signed_at")
      .eq("user_id", user.id)
      .single()

    if (contractError && contractError.code !== "PGRST116") {
      console.error("Error checking referral contract:", contractError)
      return NextResponse.json({ error: "Failed to check contract status" }, { status: 500 })
    }

    return NextResponse.json({
      contractSigned: !!contract,
      signedAt: contract?.signed_at || null,
    })
  } catch (error) {
    console.error("Error in referral-contract-status:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
