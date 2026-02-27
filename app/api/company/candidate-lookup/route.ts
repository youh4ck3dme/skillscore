import { type NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@supabase/ssr"

// API to lookup candidate UUID and email by anonymous_id
// Uses service role to bypass RLS
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const anonymousId = searchParams.get("anonymous_id")

    if (!anonymousId) {
      return NextResponse.json({ error: "anonymous_id is required" }, { status: 400 })
    }

    const supabase = createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll() {},
      },
    })

    // Get candidate UUID from candidate_profiles
    const { data: candidateProfile } = await supabase
      .from("candidate_profiles")
      .select("id")
      .eq("anonymous_id", anonymousId)
      .single()

    if (!candidateProfile) {
      return NextResponse.json({ error: "Candidate not found" }, { status: 404 })
    }

    // Get email from profiles
    const { data: profile } = await supabase.from("profiles").select("email").eq("id", candidateProfile.id).single()

    return NextResponse.json({
      candidate_uuid: candidateProfile.id,
      candidate_email: profile?.email || null,
    })
  } catch (error) {
    console.error("[v0] Candidate lookup error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
