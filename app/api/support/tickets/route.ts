import { type NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase/server"

export async function POST(request: NextRequest) {
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
    const { subject, message, category, priority, user_type, attachments } = body

    // Create support ticket
    const { data: ticket, error: ticketError } = await supabase
      .from("support_tickets")
      .insert({
        user_id: user.id,
        user_type,
        subject,
        message,
        category,
        priority: priority || "normal",
        status: "open",
      })
      .select()
      .single()

    if (ticketError) {
      console.error("Error creating ticket:", ticketError)
      return NextResponse.json({ error: "Failed to create ticket" }, { status: 500 })
    }

    // Add attachments if any
    if (attachments && attachments.length > 0) {
      const attachmentRecords = attachments.map((att: any) => ({
        ticket_id: ticket.id,
        file_name: att.file_name,
        file_url: att.file_url,
        file_type: att.file_type,
        file_size: att.file_size,
      }))

      const { error: attachmentError } = await supabase.from("support_ticket_attachments").insert(attachmentRecords)

      if (attachmentError) {
        console.error("Error adding attachments:", attachmentError)
      }
    }

    // TODO: Send notification to admin
    // This can be implemented with email service or in-app notifications

    return NextResponse.json({ ticket }, { status: 201 })
  } catch (error) {
    console.error("Error in support tickets API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
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

    // Get user profile to check if admin
    const { data: profile } = await supabase.from("profiles").select("user_type").eq("id", user.id).single()

    let query = supabase
      .from("support_tickets")
      .select(`
        *,
        support_ticket_attachments (*),
        support_ticket_responses (*)
      `)
      .order("created_at", { ascending: false })

    // If not admin, only show user's own tickets
    if (profile?.user_type !== "admin") {
      query = query.eq("user_id", user.id)
    }

    const { data: tickets, error: ticketsError } = await query

    if (ticketsError) {
      console.error("Error fetching tickets:", ticketsError)
      return NextResponse.json({ error: "Failed to fetch tickets" }, { status: 500 })
    }

    return NextResponse.json({ tickets }, { status: 200 })
  } catch (error) {
    console.error("Error in support tickets API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
