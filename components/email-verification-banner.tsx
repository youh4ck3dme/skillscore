"use client"

import { Button } from "@/components/ui/button"
import { AlertCircle, Mail, X } from "lucide-react"
import { useState } from "react"

interface EmailVerificationBannerProps {
  userEmail?: string
  onResendClick?: () => void
  onDismiss?: () => void
}

export function EmailVerificationBanner({ userEmail, onResendClick, onDismiss }: EmailVerificationBannerProps) {
  const [isVisible, setIsVisible] = useState(true)
  const [isResending, setIsResending] = useState(false)
  const [resendMessage, setResendMessage] = useState("")

  const handleResend = async () => {
    if (!userEmail) return

    setIsResending(true)
    setResendMessage("")

    try {
      const response = await fetch("/api/auth/resend-verification", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: userEmail }),
      })

      const data = await response.json()

      if (response.ok) {
        setResendMessage("Verifikačný email bol odoslaný")
        onResendClick?.()
      } else {
        setResendMessage(data.error || "Nastala chyba")
      }
    } catch (error) {
      setResendMessage("Nastala chyba pri posielaní emailu")
    } finally {
      setIsResending(false)
    }
  }

  const handleDismiss = () => {
    setIsVisible(false)
    onDismiss?.()
  }

  if (!isVisible) return null

  return (
    <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
      <div className="flex items-start">
        <div className="flex-shrink-0">
          <AlertCircle className="h-5 w-5 text-yellow-400" />
        </div>
        <div className="ml-3 flex-1">
          <h3 className="text-sm font-medium text-yellow-800">Email nie je overený</h3>
          <div className="mt-2 text-sm text-yellow-700">
            <p>
              Váš email {userEmail && <strong>{userEmail}</strong>} ešte nie je overený. Pre plnú funkcionalnost účtu je
              potrebné potvrdiť emailovú adresu.
            </p>
            {resendMessage && <p className="mt-2 font-medium">{resendMessage}</p>}
          </div>
          <div className="mt-3 flex items-center space-x-3">
            <Button
              size="sm"
              variant="outline"
              onClick={handleResend}
              disabled={isResending}
              className="bg-white hover:bg-yellow-50 border-yellow-300 text-yellow-800"
            >
              <Mail className="h-4 w-4 mr-2" />
              {isResending ? "Posiela sa..." : "Poslať znovu"}
            </Button>
          </div>
        </div>
        <div className="ml-auto pl-3">
          <div className="-mx-1.5 -my-1.5">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDismiss}
              className="text-yellow-500 hover:text-yellow-600 hover:bg-yellow-100"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
