import { type NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase/server"
import { logError } from "@/lib/monitoring/error-handler"

export const dynamic = "force-dynamic"

export async function POST(request: NextRequest) {
  try {
    const supabase = createServerClient()
    const errorReport = await request.json()

    // Store error in database for persistence
    const { error: dbError } = await supabase.from("error_logs").insert({
      error_id: errorReport.id,
      message: errorReport.message,
      stack: errorReport.stack,
      context: errorReport.context,
      severity: errorReport.severity,
      timestamp: errorReport.timestamp,
      resolved: false,
    })

    if (dbError) {
      console.error("Failed to store error in database:", dbError)
    }

    // Send critical errors to external monitoring (in production)
    if (errorReport.severity === "critical" && process.env.NODE_ENV === "production") {
      // Here you would integrate with external services like:
      // - Sentry
      // - DataDog
      // - LogRocket
      // - Slack/Discord webhooks for alerts

      await sendCriticalAlert(errorReport)
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    logError(error as Error, {
      component: "monitoring-api",
      action: "store_error",
    })
    return NextResponse.json({ error: "Failed to process error report" }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const supabase = createServerClient()
    const { searchParams } = new URL(request.url)
    const severity = searchParams.get("severity")
    const limit = Number.parseInt(searchParams.get("limit") || "50")

    let query = supabase.from("error_logs").select("*").order("timestamp", { ascending: false }).limit(limit)

    if (severity) {
      query = query.eq("severity", severity)
    }

    const { data: errors, error } = await query

    if (error) {
      throw error
    }

    return NextResponse.json({ errors })
  } catch (error) {
    logError(error as Error, {
      component: "monitoring-api",
      action: "fetch_errors",
    })
    return NextResponse.json({ error: "Failed to fetch errors" }, { status: 500 })
  }
}

async function sendCriticalAlert(errorReport: any) {
  if (process.env.SLACK_WEBHOOK_URL) {
    try {
      await fetch(process.env.SLACK_WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: `🚨 Critical Error in SOMVIAC Job Portal`,
          blocks: [
            {
              type: "section",
              text: {
                type: "mrkdwn",
                text: `*Critical Error Detected*\n\n*Message:* ${errorReport.message}\n*Component:* ${errorReport.context.component || "Unknown"}\n*User:* ${errorReport.context.userId || "Anonymous"}\n*Time:* ${new Date(errorReport.timestamp).toLocaleString()}`,
              },
            },
          ],
        }),
      })
    } catch (slackError) {
      console.error("Failed to send Slack alert:", slackError)
    }
  } else {
    console.log(
      "[Monitoring] SLACK_WEBHOOK_URL not set - critical error logged but not sent to Slack:",
      errorReport.message,
    )
  }
}
