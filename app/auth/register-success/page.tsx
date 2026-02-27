"use client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, Loader2 } from "lucide-react"
import React, { useState, useEffect, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"

function RegisterSuccessContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const userType = searchParams.get("userType") || "candidate"
  const [isResending, setIsResending] = useState(false)
  const [resendMessage, setResendMessage] = useState("")

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push(`/dashboard/${userType}`)
    }, 2000)

    return () => clearTimeout(timer)
  }, [router, userType])

  const handleResendVerification = () => {
    // Redirect to resend verification page
    window.location.href = "/auth/resend-verification"
  }

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-md">
        <div className="flex flex-col gap-6">
          <Card>
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              <CardTitle className="text-2xl text-green-700">Registrácia úspešná!</CardTitle>
              <CardDescription>Váš účet bol úspešne vytvorený. Presmerovávame vás na dashboard...</CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <div className="animate-pulse text-sm text-gray-500">Počkajte prosím...</div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default function RegisterSuccessPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    }>
      <RegisterSuccessContent />
    </Suspense>
  )
}
