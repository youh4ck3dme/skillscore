import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET(request: NextRequest, { params }: { params: { code: string } }) {
  try {
    const supabase = await createClient()
    const { code } = params

    if (!code) {
      return NextResponse.json({ error: "Invitation code is required" }, { status: 400 })
    }

    // Get invitation details
    const { data: invitation, error } = await supabase
      .from("recruiter_invitations")
      .select(`
        id,
        invited_email,
        invited_type,
        invited_by_name,
        personal_message,
        status,
        expires_at
      `)
      .eq("invitation_code", code)
      .single()

    if (error || !invitation) {
      return NextResponse.json({ error: "Invitation not found" }, { status: 404 })
    }

    // Check if invitation is expired
    if (new Date(invitation.expires_at) < new Date()) {
      // Update status to expired
      await supabase.from("recruiter_invitations").update({ status: "expired" }).eq("invitation_code", code)

      return NextResponse.json({ error: "Invitation has expired" }, { status: 400 })
    }

    return NextResponse.json({ invitation })
  } catch (error) {
    console.error("Error validating invitation:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
