"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"

export default function CompleteOAuthProfile() {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const createProfile = async () => {
      try {
        const supabase = createClient()

        const {
          data: { user },
        } = await supabase.auth.getUser()

        if (!user) {
          console.error("Complete OAuth: No user found")
          setError("No user found")
          setTimeout(() => router.push("/auth/login"), 3000)
          return
        }

        const pendingUserType = (localStorage.getItem("pending_user_type") as "candidate" | "recruiter") || "candidate"
        localStorage.removeItem("pending_user_type")

        const firstName = user.user_metadata?.given_name || ""
        const lastName = user.user_metadata?.family_name || ""

        const { error: profileError } = await supabase.from("profiles").insert({
          id: user.id,
          email: user.email,
          user_type: pendingUserType,
          first_name: firstName,
          last_name: lastName,
          email_verified: true,
        })

        if (profileError) {
          console.error("Complete OAuth: Profile creation error:", profileError)
          setError(profileError.message)
          setTimeout(() => router.push("/auth/login"), 3000)
          return
        }

        router.push(`/dashboard/${pendingUserType}`)
      } catch (err) {
        console.error("Complete OAuth: Unexpected error", err)
        setError(err instanceof Error ? err.message : "Unknown error occurred")
        setTimeout(() => router.push("/auth/login"), 3000)
      }
    }

    createProfile()
  }, [router])

  return (
    <div className="flex min-h-svh w-full items-center justify-center">
      <div className="text-center max-w-md px-4">
        {error ? (
          <>
            <div className="text-red-600 mb-4">
              <svg className="h-12 w-12 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <p className="font-semibold">Chyba pri vytváraní profilu</p>
            </div>
            <p className="text-gray-600 text-sm mb-4">{error}</p>
            <p className="text-gray-500 text-xs">Presmerovanie na prihlasovaciu stránku...</p>
          </>
        ) : (
          <>
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Dokončujem registráciu...</p>
          </>
        )}
      </div>
    </div>
  )
}
