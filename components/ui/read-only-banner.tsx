"use client"

import { useAuth } from "@/lib/auth/auth-context"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Eye, UserPlus } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ReadOnlyBannerProps {
  message?: string
  showRegisterButton?: boolean
  onRegisterClick?: () => void
}

export function ReadOnlyBanner({
  message = "Prehliadaš ako neregistrovaný používateľ - registruj sa pre plnú funkcionalnost",
  showRegisterButton = true,
  onRegisterClick,
}: ReadOnlyBannerProps) {
  const { isAuthenticated } = useAuth()

  if (isAuthenticated) {
    return null
  }

  return (
    <Alert className="mb-6 border-blue-200 bg-blue-50">
      <Eye className="h-4 w-4" />
      <AlertDescription className="flex items-center justify-between">
        <span>{message}</span>
        {showRegisterButton && (
          <Button variant="outline" size="sm" onClick={onRegisterClick} className="ml-4 bg-transparent">
            <UserPlus className="h-4 w-4 mr-2" />
            Registrovať sa
          </Button>
        )}
      </AlertDescription>
    </Alert>
  )
}
