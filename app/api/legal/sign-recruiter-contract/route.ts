import { type NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"

export async function POST(request: NextRequest) {
  try {
    const cookieStore = cookies()
    const supabase = createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
      },
    })

    const body = await request.json()
    const { name, ico, address, iban, email, phone, place, date, signedAt } = body

    // Get current user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Save contract signing record
    const { error: insertError } = await supabase.from("recruiter_contracts").insert({
      recruiter_id: user.id,
      contract_type: "cooperation",
      contract_version: "v2",
      signer_name: name,
      signer_ico: ico || null,
      signer_address: address,
      signer_iban: iban,
      signer_email: email,
      signer_phone: phone,
      signing_place: place,
      signing_date: date,
      signed_at: signedAt,
      contract_data: {
        name,
        ico,
        address,
        iban,
        email,
        phone,
        place,
        date,
        signedAt,
      },
    })

    if (insertError) {
      console.error("Error saving contract:", insertError)
      return NextResponse.json({ error: "Failed to save contract" }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error in sign-recruiter-contract:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
