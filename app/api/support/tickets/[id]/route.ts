import { type NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase/server"

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
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
    const { status, priority, resolved_by } = body

    // Update ticket
    const updateData: any = {}
    if (status) updateData.status = status
    if (priority) updateData.priority = priority
    if (status === "resolved" || status === "closed") {
      updateData.resolved_at = new Date().toISOString()
      updateData.resolved_by = resolved_by || user.id
    }

    const { data: ticket, error: updateError } = await supabase
      .from("support_tickets")
      .update(updateData)
      .eq("id", params.id)
      .select()
      .single()

    if (updateError) {
      console.error("Error updating ticket:", updateError)
      return NextResponse.json({ error: "Failed to update ticket" }, { status: 500 })
    }

    return NextResponse.json({ ticket }, { status: 200 })
  } catch (error) {
    console.error("Error in support ticket update API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
