import { type NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@supabase/ssr"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { fullName, birthDate, address, bankAccount, emailPhone, signedAt } = body

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

    // Save referral contract signing
    const { error: insertError } = await supabase.from("referral_contracts").insert({
      user_id: user.id,
      full_name: fullName,
      birth_date: birthDate,
      address: address,
      bank_account: bankAccount,
      email_phone: emailPhone,
      signed_at: signedAt,
      contract_version: "v3",
    })

    if (insertError) {
      console.error("Error saving referral contract:", insertError)
      return NextResponse.json({ error: "Failed to save contract" }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error in sign-referral-contract:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
