import { type NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"

// GET - Get contract status and data
export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies()
    const supabase = createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
      },
    })

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get company profile with contract data
    const { data: companyProfile, error } = await supabase
      .from("company_profiles")
      .select("contract_signed, contract_signed_at, contract_data, contract_text")
      .eq("id", user.id)
      .maybeSingle()

    if (error) {
      console.error("Error fetching company contract:", error)
      return NextResponse.json({ error: "Failed to fetch contract" }, { status: 500 })
    }

    return NextResponse.json({
      is_signed: companyProfile?.contract_signed || false,
      signed_at: companyProfile?.contract_signed_at,
      contract_data: companyProfile?.contract_data,
      contract_text: companyProfile?.contract_text,
    })
  } catch (error) {
    console.error("Error in company contract GET:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// POST - Sign contract
export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies()
    const supabase = createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
      },
    })

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { contractData } = body

    // Update company profile with contract data
    const { error: updateError } = await supabase
      .from("company_profiles")
      .update({
        contract_signed: true,
        contract_signed_at: new Date().toISOString(),
        contract_data: contractData,
        contract_text: contractData.contract_text,
      })
      .eq("id", user.id)

    if (updateError) {
      console.error("Error saving contract:", updateError)
      return NextResponse.json({ error: "Failed to save contract" }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error in company contract POST:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
