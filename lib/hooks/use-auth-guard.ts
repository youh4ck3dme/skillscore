"use client"

import { useAuth } from "@/lib/auth/auth-context"
import { useState } from "react"
import { isAuthDisabled } from "@/lib/auth/dev-helpers"

type UserType = "candidate" | "company" | "recruiter" | "admin"

export function useAuthGuard() {
  const { isAuthenticated, user } = useAuth()
  const [showRegistrationModal, setShowRegistrationModal] = useState(false)
  const [suggestedUserType, setSuggestedUserType] = useState<UserType | null>(null)

  const requireAuth = (action: () => void, requiredUserType?: UserType) => {
    if (isAuthDisabled()) {
      action()
      return
    }

    if (isAuthenticated && (!requiredUserType || user?.user_type === requiredUserType)) {
      action()
    } else {
      setSuggestedUserType(requiredUserType || "candidate")
      setShowRegistrationModal(true)
    }
  }

  const closeRegistrationModal = () => {
    setShowRegistrationModal(false)
    setSuggestedUserType(null)
  }

  return {
    isAuthenticated,
    user,
    showRegistrationModal,
    suggestedUserType,
    requireAuth,
    closeRegistrationModal,
  }
}
