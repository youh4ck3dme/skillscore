import { NextResponse } from "next/server"
import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"

export async function GET() {
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
          cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options))
        },
      },
    },
  )

  let allData: any[] = []
  let page = 0
  const pageSize = 1000
  let hasMore = true

  while (hasMore) {
    const { data, error } = await supabase
      .from("pricing_items")
      .select("country, role, work_type, price_junior, price_standard, price_senior")
      .range(page * pageSize, (page + 1) * pageSize - 1)

    if (error) {
      console.error("Error fetching pricing data:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    if (data && data.length > 0) {
      allData = [...allData, ...data]
      page++
      hasMore = data.length === pageSize
    } else {
      hasMore = false
    }
  }

  console.log("[v0] Total pricing records fetched:", allData.length)
  return NextResponse.json(allData)
}
