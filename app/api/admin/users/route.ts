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

    // Get all users with their profiles and balances
    const { data: users, error: usersError } = await supabase
      .from("profiles")
      .select(`
        id,
        user_type,
        first_name,
        last_name,
        company_name,
        anonymous_id,
        created_at,
        last_login,
        status,
        user_balances(coin_balance)
      `)
      .order("created_at", { ascending: false })

    if (usersError) {
      console.error("Error fetching users:", usersError)
      return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 })
    }

    // Get user emails from auth.users (if accessible)
    const { data: authUsers } = await supabase.auth.admin.listUsers()

    const usersWithEmails =
      users?.map((user) => {
        const authUser = authUsers?.users.find((au) => au.id === user.id)
        return {
          ...user,
          email: authUser?.email || "N/A",
          coin_balance: user.user_balances?.[0]?.coin_balance || 0,
          status: user.status || "active",
        }
      }) || []

    return NextResponse.json({ users: usersWithEmails })
  } catch (error) {
    console.error("Error in admin users route:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
