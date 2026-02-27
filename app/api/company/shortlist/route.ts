import { type NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@supabase/ssr"

export async function GET(request: NextRequest) {
  try {
    const supabase = createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll() {},
      },
    })

    // Get current user
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get saved candidates with candidate_uuid
    const { data: savedCandidates, error } = await supabase
      .from("saved_candidates")
      .select("id, candidate_id, candidate_uuid, saved_at, notes, cv_summary")
      .eq("company_id", user.id)
      .order("saved_at", { ascending: false })

    if (error) {
      console.error("[v0] Error loading shortlist:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // For candidates without candidate_uuid, try to look it up
    const candidatesNeedingUuid = savedCandidates?.filter((c) => !c.candidate_uuid) || []

    if (candidatesNeedingUuid.length > 0) {
      const anonymousIds = candidatesNeedingUuid.map((c) => c.candidate_id)

      const { data: profiles } = await supabase
        .from("candidate_profiles")
        .select("id, anonymous_id")
        .in("anonymous_id", anonymousIds)

      // Update saved_candidates with the UUIDs
      for (const profile of profiles || []) {
        const savedCandidate = savedCandidates?.find((c) => c.candidate_id === profile.anonymous_id)
        if (savedCandidate) {
          savedCandidate.candidate_uuid = profile.id

          // Also update in database for future
          await supabase.from("saved_candidates").update({ candidate_uuid: profile.id }).eq("id", savedCandidate.id)
        }
      }
    }

    // Get candidate emails from profiles table for candidates with UUID
    const candidateUuids = savedCandidates?.map((c) => c.candidate_uuid).filter(Boolean) || []

    const emailMap = new Map<string, string>()
    if (candidateUuids.length > 0) {
      const { data: profilesWithEmail } = await supabase.from("profiles").select("id, email").in("id", candidateUuids)

      profilesWithEmail?.forEach((p) => {
        emailMap.set(p.id, p.email)
      })
    }

    // Format response
    const formattedCandidates = savedCandidates?.map((c) => ({
      ...c,
      candidate_email: c.candidate_uuid ? emailMap.get(c.candidate_uuid) : null,
    }))

    return NextResponse.json({ candidates: formattedCandidates })
  } catch (error) {
    console.error("[v0] Shortlist API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
