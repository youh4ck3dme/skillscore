import { createBrowserClient } from "@supabase/ssr"

let client: ReturnType<typeof createBrowserClient> | null = null

function getSupabaseUrl(): string {
  if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
    return process.env.NEXT_PUBLIC_SUPABASE_URL
  }

  throw new Error(
    "Missing NEXT_PUBLIC_SUPABASE_URL environment variable. " +
      "Please add it to your project settings with your Supabase project URL (e.g., https://xxxxx.supabase.co)",
  )
}

function getSupabaseAnonKey(): string {
  return process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || ""
}

export function createClient() {
  if (client) {
    return client
  }

  const url = getSupabaseUrl()
  const key = getSupabaseAnonKey()

  if (!url || !key) {
    throw new Error(
      "Supabase configuration incomplete. Please check your environment variables: " +
        "NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY",
    )
  }

  client = createBrowserClient(url, key)
  return client
}
