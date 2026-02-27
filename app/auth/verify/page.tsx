"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, XCircle, Loader2, Mail } from "lucide-react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { useState, useEffect } from "react"

export default function VerifyEmailPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const token = searchParams.get("token")

  const [status, setStatus] = useState<"loading" | "success" | "error" | "invalid">("loading")
  const [message, setMessage] = useState("")
  const [email, setEmail] = useState("")

  useEffect(() => {
    if (!token) {
      setStatus("invalid")
      setMessage("Chýba verifikačný token")
      return
    }

    const verifyEmail = async () => {
      try {
        const response = await fetch("/api/auth/verify-email", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ token }),
        })

        const data = await response.json()

        if (response.ok) {
          setStatus("success")
          setMessage(data.message)
          setEmail(data.email)

          // Redirect to login after 3 seconds
          setTimeout(() => {
            router.push("/auth/login?verified=true")
          }, 3000)
        } else {
          setStatus("error")
          setMessage(data.error || "Nastala chyba pri verifikácii")
        }
      } catch (error) {
        setStatus("error")
        setMessage("Nastala chyba pri verifikácii emailu")
      }
    }

    verifyEmail()
  }, [token, router])

  const renderContent = () => {
    switch (status) {
      case "loading":
        return (
          <>
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100">
              <Loader2 className="h-8 w-8 text-blue-600 animate-spin" />
            </div>
            <CardTitle className="text-2xl text-center">Overujeme váš email</CardTitle>
            <CardDescription className="text-center">Prosím počkajte...</CardDescription>
          </>
        )

      case "success":
        return (
          <>
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <CardTitle className="text-2xl text-green-700 text-center">Email úspešne overený!</CardTitle>
            <CardDescription className="text-center">{email && `Email ${email} bol úspešne overený`}</CardDescription>
          </>
        )

      case "error":
        return (
          <>
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
              <XCircle className="h-8 w-8 text-red-600" />
            </div>
            <CardTitle className="text-2xl text-red-700 text-center">Chyba pri overení</CardTitle>
            <CardDescription className="text-center">{message}</CardDescription>
          </>
        )

      case "invalid":
        return (
          <>
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-yellow-100">
              <Mail className="h-8 w-8 text-yellow-600" />
            </div>
            <CardTitle className="text-2xl text-yellow-700 text-center">Neplatný odkaz</CardTitle>
            <CardDescription className="text-center">{message}</CardDescription>
          </>
        )
    }
  }

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-md">
        <Card>
          <CardHeader className="text-center">{renderContent()}</CardHeader>
          <CardContent className="space-y-4">
            {status === "success" && (
              <div className="rounded-lg bg-green-50 p-4">
                <p className="text-sm text-green-700 text-center">
                  Váš účet je teraz aktívny. Budete presmerovaní na prihlásenie za 3 sekundy...
                </p>
              </div>
            )}

            {status === "error" && (
              <div className="space-y-3">
                <div className="rounded-lg bg-red-50 p-4">
                  <p className="text-sm text-red-700">{message}</p>
                </div>
                <div className="text-center">
                  <Link
                    href="/auth/resend-verification"
                    className="text-sm text-teal-600 hover:text-teal-700 underline"
                  >
                    Poslať nový verifikačný email
                  </Link>
                </div>
              </div>
            )}

            {status === "invalid" && (
              <div className="text-center">
                <Link href="/auth/resend-verification" className="text-sm text-teal-600 hover:text-teal-700 underline">
                  Poslať nový verifikačný email
                </Link>
              </div>
            )}

            <div className="pt-4 space-y-3">
              <Button asChild className="w-full" variant={status === "success" ? "default" : "outline"}>
                <Link href="/auth/login">
                  {status === "success" ? "Pokračovať na prihlásenie" : "Späť na prihlásenie"}
                </Link>
              </Button>

              <div className="text-center">
                <Link href="/" className="text-sm text-gray-500 hover:text-gray-700 underline underline-offset-4">
                  Späť na hlavnú stránku
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
