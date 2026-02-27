import { type NextRequest, NextResponse } from "next/server"
import { emailService } from "@/lib/email/resend-service"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { emails } = body

    // Validate input
    if (!Array.isArray(emails) || emails.length === 0) {
      return NextResponse.json({ error: "emails must be a non-empty array" }, { status: 400 })
    }

    // Validate each email
    for (const email of emails) {
      if (!email.to || !email.subject || !email.html) {
        return NextResponse.json(
          {
            error: "Each email must have: to, subject, html",
          },
          { status: 400 },
        )
      }
    }

    const results = await emailService.sendBulkEmails(emails)

    const successCount = results.filter((r) => r.success).length
    const failureCount = results.length - successCount

    return NextResponse.json({
      success: true,
      message: `Sent ${successCount} emails, ${failureCount} failed`,
      results,
      summary: {
        total: results.length,
        successful: successCount,
        failed: failureCount,
      },
    })
  } catch (error) {
    console.error("Error in bulk email send API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
