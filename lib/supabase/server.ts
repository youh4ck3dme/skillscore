import { createServerClient as createSupabaseServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import type { Database } from "@/types/supabase"

let serverClientInstance: any = null

export function createServerClient() {
  return createClient()
}

export async function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    console.error("Missing Supabase environment variables on server:", {
      hasUrl: !!supabaseUrl,
      hasKey: !!supabaseAnonKey,
      url: supabaseUrl ? "present" : "missing",
      key: supabaseAnonKey ? "present" : "missing",
    })

    return {
      from: () => ({
        insert: () =>
          Promise.reject(new Error("Supabase server client not configured - missing environment variables")),
        select: () =>
          Promise.reject(new Error("Supabase server client not configured - missing environment variables")),
        update: () =>
          Promise.reject(new Error("Supabase server client not configured - missing environment variables")),
        delete: () =>
          Promise.reject(new Error("Supabase server client not configured - missing environment variables")),
      }),
      rpc: () => Promise.reject(new Error("Supabase server client not configured - missing environment variables")),
      auth: {
        signInWithPassword: () =>
          Promise.reject(new Error("Supabase server client not configured - missing environment variables")),
        signUp: () =>
          Promise.reject(new Error("Supabase server client not configured - missing environment variables")),
        signOut: () =>
          Promise.reject(new Error("Supabase server client not configured - missing environment variables")),
        getUser: () =>
          Promise.resolve({
            data: { user: null },
            error: new Error("Supabase server client not configured - missing environment variables"),
          }),
      },
    } as any
  }

  if (serverClientInstance) {
    return serverClientInstance
  }

  const cookieStore = await cookies()

  serverClientInstance = createSupabaseServerClient<Database>(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll()
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options))
        } catch {
          // The "setAll" method was called from a Server Component.
          // This can be ignored if you have middleware refreshing
          // user sessions.
        }
      },
    },
  })

  return serverClientInstance
}
