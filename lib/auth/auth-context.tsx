"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState, useMemo, useCallback } from "react"
import type { User } from "@supabase/supabase-js"
import { DEV_TEST_USERS, shouldBypassAuth, shouldAllowActions } from "./dev-helpers"
import { createClient } from "@/lib/supabase/client"
import { suppressAbortError } from "@/lib/supabase/error-handler"

type UserType = "worker" | "company" | "admin"

interface AuthUser extends User {
  user_type?: UserType
  profile?: any
}

interface AuthContextType {
  user: AuthUser | null
  loading: boolean
  isAuthenticated: boolean
  signIn: (email: string, password: string) => Promise<{ error: any }>
  signInWithGoogle: (userType?: UserType) => Promise<{ error: any }>
  signUp: (email: string, password: string, userType: UserType, profileData: any) => Promise<{ error: any }>
  signOut: () => Promise<void>
  switchDevUser: (userType: UserType) => void
  requireAuth: (action: () => void, requiredUserType?: UserType) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [loading, setLoading] = useState(true)

  const isAuthenticated = user !== null && !shouldBypassAuth()

  useEffect(() => {
    if (shouldBypassAuth()) {
      if (!shouldAllowActions()) {
        setUser(DEV_TEST_USERS.worker as unknown as AuthUser)
      }
      setLoading(false)
      return
    }

    let subscription: any = null
    const supabase = createClient()
    const abortController = new AbortController()

    const initAuth = async () => {
      try {
        const sessionResult = await suppressAbortError(supabase.auth.getSession())

        if (abortController.signal.aborted || !sessionResult) return

        const session = (sessionResult as any)?.data?.session

        if (session?.user) {
          const userResult = await suppressAbortError(supabase.auth.getUser())

          if (abortController.signal.aborted || !userResult) return

          const authUser = (userResult as any)?.data?.user

          if (authUser) {
            const profileResult = await suppressAbortError(
              supabase.from("profiles").select("user_type").eq("id", authUser.id).single(),
            )

            if (abortController.signal.aborted) return

            const profile = (profileResult as any)?.data

            if (profile) {
              const userWithType: AuthUser = {
                ...authUser,
                user_type: profile.user_type,
                profile,
              }

              if (!abortController.signal.aborted) {
                setUser(userWithType)
              }
            }
          }
        }

        const { data: authListener } = supabase.auth.onAuthStateChange(async (event: any, session: any) => {
          if (abortController.signal.aborted) return

          if (session?.user) {
            const profileResult = await suppressAbortError(
              supabase.from("profiles").select("user_type").eq("id", (session.user as any).id).single(),
            )

            if (abortController.signal.aborted) return

            const profile = (profileResult as any)?.data

            if (profile) {
              const userWithType: AuthUser = {
                ...session.user,
                user_type: profile.user_type,
                profile,
              }

              if (!abortController.signal.aborted) {
                setUser(userWithType)
              }
            }
          } else {
            if (!abortController.signal.aborted) {
              setUser(null)
            }
          }
        })

        subscription = authListener.subscription

        if (!abortController.signal.aborted) {
          setLoading(false)
        }
      } catch (error) {
        if (!abortController.signal.aborted) {
          console.error("[v0] Auth initialization error:", error)
          setLoading(false)
        }
      }
    }

    suppressAbortError(initAuth())

    return () => {
      abortController.abort()
      if (subscription) {
        subscription.unsubscribe()
      }
    }
  }, [])

  const signIn = useCallback(async (email: string, password: string) => {
    if (shouldBypassAuth() && shouldAllowActions()) {
      return { error: null }
    }

    try {
      const supabase = createClient()
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      return { error }
    } catch (error) {
      return { error }
    }
  }, [])

  const signInWithGoogle = useCallback(async (userType?: UserType) => {
    if (shouldBypassAuth() && shouldAllowActions()) {
      return { error: null }
    }

    try {
      const supabase = createClient()

      if (userType) {
        localStorage.setItem("pending_user_type", userType)
      }

      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
          queryParams: {
            access_type: "offline",
            prompt: "consent",
          },
        },
      })

      return { error }
    } catch (error) {
      return { error }
    }
  }, [])

  const signUp = useCallback(async (email: string, password: string, userType: UserType, profileData: any) => {
    if (shouldBypassAuth()) {
      return { error: null }
    }

    try {
      const supabase = createClient()
      const { invitation_code, ...profileDataWithoutInvitation } = profileData

      let displayName = email
      if (userType === "company") {
        displayName = profileDataWithoutInvitation.company_name || email
      } else if (profileDataWithoutInvitation.first_name && profileDataWithoutInvitation.last_name) {
        displayName = `${profileDataWithoutInvitation.first_name} ${profileDataWithoutInvitation.last_name}`
      }

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/verify`,
          data: {
            user_type: userType,
            full_name: profileData.full_name || displayName,
            phone: profileData.phone || "",
            company_name: profileData.company_name || "",
            trade: profileData.trade || "other",
          },
        },
      })

      if (error) {
        console.error("[v0] Supabase signUp error:", error)
        return { error: { message: error.message } }
      }

      if (invitation_code && data.user) {
        await supabase
          .from("recruiter_invitations")
          .update({
            status: "accepted",
            accepted_at: new Date().toISOString(),
            accepted_user_id: data.user.id,
          })
          .eq("invitation_code", invitation_code)
      }

      return { error: null }
    } catch (error) {
      return { error }
    }
  }, [])

  const signOut = useCallback(async () => {
    if (shouldBypassAuth()) {
      setUser(null)
      return
    }

    try {
      const supabase = createClient()
      await supabase.auth.signOut()
      setUser(null)
      localStorage.removeItem("pending_user_type")
    } catch (error) {
      console.error("Failed to sign out:", error)
      setUser(null)
      localStorage.removeItem("pending_user_type")
    }
  }, [])

  const switchDevUser = useCallback((userType: UserType) => {
    if (shouldBypassAuth()) {
      setUser(DEV_TEST_USERS[userType as keyof typeof DEV_TEST_USERS] as unknown as AuthUser)
    }
  }, [])

  const requireAuth = useCallback(
    (action: () => void, requiredUserType?: UserType) => {
      if (isAuthenticated && (!requiredUserType || user?.user_type === requiredUserType)) {
        action()
      }
    },
    [isAuthenticated, user?.user_type],
  )

  const contextValue = useMemo(
    () => ({
      user,
      loading,
      isAuthenticated,
      signIn,
      signInWithGoogle,
      signUp,
      signOut,
      switchDevUser,
      requireAuth,
    }),
    [user, loading, isAuthenticated, signIn, signInWithGoogle, signUp, signOut, switchDevUser, requireAuth],
  )

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
