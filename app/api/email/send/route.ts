import { type NextRequest, NextResponse } from "next/server"
import { emailService } from "@/lib/email/resend-service"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { to, subject, html, text, from, replyTo, attachments } = body

    // Validate input
    if (!to || !subject || !html) {
      return NextResponse.json({ error: "Missing required fields: to, subject, html" }, { status: 400 })
    }

    const result = await emailService.sendEmail({
      to,
      subject,
      html,
      text,
      from,
      replyTo,
      attachments,
    })

    if (!result.success) {
      return NextResponse.json(
        {
          error: "Failed to send email",
          details: result.error,
        },
        { status: 500 },
      )
    }

    return NextResponse.json({
      success: true,
      message: "Email sent successfully",
      id: result.id,
    })
  } catch (error) {
    console.error("Error in email send API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
