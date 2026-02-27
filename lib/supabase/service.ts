import { createClient } from "@supabase/supabase-js"

export function createServiceClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  // Use SUPABASE_SECRET_KEY which matches the Integration Status, not SUPABASE_SERVICE_ROLE_KEY
  const supabaseServiceKey = process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !supabaseServiceKey) {
    console.error("[v0] Missing Supabase service client env vars:", {
      hasUrl: !!supabaseUrl,
      hasKey: !!supabaseServiceKey,
    })
    throw new Error("Supabase service client environment variables not configured")
  }

  return createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  })
}
