// Environment configuration with fallbacks

export const config = {
  // App URL - falls back to localhost in development
  appUrl: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",

  // Email service - optional, logs if not configured
  resendApiKey: process.env.RESEND_API_KEY,
  isEmailEnabled: !!process.env.RESEND_API_KEY,

  // Cron secret - optional, for scheduled tasks
  cronSecret: process.env.CRON_SECRET,
  isCronEnabled: !!process.env.CRON_SECRET,

  // Stripe webhook - optional, for payment webhooks
  stripeWebhookSecret: process.env.STRIPE_WEBHOOK_SECRET,
  isStripeWebhookEnabled: !!process.env.STRIPE_WEBHOOK_SECRET,

  // Slack notifications - optional
  slackWebhookUrl: process.env.SLACK_WEBHOOK_URL,
  isSlackEnabled: !!process.env.SLACK_WEBHOOK_URL,

  // Dev mode - disable auth for testing
  isAuthDisabled: process.env.NEXT_PUBLIC_DISABLE_AUTH === "true",

  // Supabase redirect URL for development
  devSupabaseRedirectUrl: process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL,
} as const

// Helper to check if all optional features are configured
export function getConfigStatus() {
  return {
    email: config.isEmailEnabled,
    cron: config.isCronEnabled,
    stripeWebhook: config.isStripeWebhookEnabled,
    slack: config.isSlackEnabled,
  }
}
