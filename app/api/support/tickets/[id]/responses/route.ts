import { type NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase/server"

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const supabase = createServerClient()

    // Get current user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { message, is_admin_response } = body

    // Get user profile to check if admin
    const { data: profile } = await supabase.from("profiles").select("user_type").eq("id", user.id).single()

    // Create response
    const { data: response, error: responseError } = await supabase
      .from("support_ticket_responses")
      .insert({
        ticket_id: params.id,
        user_id: user.id,
        message,
        is_admin_response: profile?.user_type === "admin" && is_admin_response,
      })
      .select()
      .single()

    if (responseError) {
      console.error("Error creating response:", responseError)
      return NextResponse.json({ error: "Failed to create response" }, { status: 500 })
    }

    // Update ticket status to in_progress if it was open
    await supabase.from("support_tickets").update({ status: "in_progress" }).eq("id", params.id).eq("status", "open")

    return NextResponse.json({ response }, { status: 201 })
  } catch (error) {
    console.error("Error in support response API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
