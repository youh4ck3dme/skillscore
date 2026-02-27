import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const { candidateId } = await request.json()

    if (!candidateId) {
      return NextResponse.json({ error: "Missing candidateId" }, { status: 400 })
    }

    const cookieStore = await cookies()
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll()
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options)
            })
          },
        },
      },
    )

    // Získaj aktuálneho používateľa
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Získaj typ používateľa (firma alebo recruiter)
    const { data: viewerProfile } = await supabase.from("profiles").select("user_type").eq("id", user.id).single()

    if (!viewerProfile || !["company", "recruiter"].includes(viewerProfile.user_type)) {
      return NextResponse.json({ error: "Only companies and recruiters can track views" }, { status: 403 })
    }

    // Zaznamenaj zobrazenie
    const { error } = await supabase.from("profile_views").insert({
      candidate_id: candidateId,
      viewer_id: user.id,
      viewer_type: viewerProfile.user_type,
    })

    if (error) {
      // Ak je to duplicate (ten istý viewer v ten istý deň), ignoruj
      if (error.code === "23505") {
        return NextResponse.json({ success: true, duplicate: true })
      }
      console.error("Error tracking profile view:", error)
      return NextResponse.json({ error: "Failed to track view" }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error in profile-views API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// GET endpoint pre získanie počtu zobrazení pre kandidáta
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const candidateId = searchParams.get("candidateId")

    if (!candidateId) {
      return NextResponse.json({ error: "Missing candidateId" }, { status: 400 })
    }

    const cookieStore = await cookies()
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll()
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options)
            })
          },
        },
      },
    )

    const { count, error } = await supabase
      .from("profile_views")
      .select("*", { count: "exact", head: true })
      .eq("candidate_id", candidateId)

    if (error) {
      console.error("Error fetching profile views:", error)
      return NextResponse.json({ error: "Failed to fetch views" }, { status: 500 })
    }

    return NextResponse.json({ count: count || 0 })
  } catch (error) {
    console.error("Error in profile-views GET API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
