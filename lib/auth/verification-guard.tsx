"use client"

import type React from "react"

import { useAuth } from "@/lib/auth/auth-context"
import { EmailVerificationBanner } from "@/components/email-verification-banner"
import { useEffect, useState } from "react"

interface VerificationGuardProps {
  children: React.ReactNode
  requireVerification?: boolean
}

export function VerificationGuard({ children, requireVerification = true }: VerificationGuardProps) {
  const { user, loading } = useAuth()
  const [verificationStatus, setVerificationStatus] = useState<{
    emailVerified: boolean
    email: string
  } | null>(null)
  const [statusLoading, setStatusLoading] = useState(true)

  useEffect(() => {
    const checkVerificationStatus = async () => {
      if (loading) return

      if (!user) {
        setStatusLoading(false)
        return
      }

      try {
        const response = await fetch("/api/auth/verification-status")
        if (response.ok) {
          const data = await response.json()
          setVerificationStatus({
            emailVerified: data.emailVerified,
            email: data.email,
          })
        }
      } catch (error) {
        console.error("Failed to check verification status:", error)
        setVerificationStatus({
          emailVerified: true,
          email: user?.email || "dev@somviac.sk",
        })
      } finally {
        setStatusLoading(false)
      }
    }

    checkVerificationStatus()
  }, [user, loading])

  if (loading || statusLoading) {
    return <div>Loading...</div>
  }

  if (!user) {
    return <>{children}</>
  }

  // Show verification banner if email is not verified
  const showBanner = requireVerification && verificationStatus && !verificationStatus.emailVerified

  return (
    <>
      {showBanner && (
        <EmailVerificationBanner
          userEmail={verificationStatus.email}
          onResendClick={() => {
            // Optionally refresh verification status after resend
            setTimeout(() => {
              window.location.reload()
            }, 2000)
          }}
        />
      )}
      {children}
    </>
  )
}
