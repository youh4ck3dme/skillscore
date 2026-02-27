"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Mail, CheckCircle, AlertCircle } from "lucide-react"
import Link from "next/link"
import { useState } from "react"

export default function ResendVerificationPage() {
  const [email, setEmail] = useState("")
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle")
  const [message, setMessage] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleResend = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setStatus("loading")

    try {
      const response = await fetch("/api/auth/resend-verification", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()

      if (response.ok) {
        setStatus("success")
        setMessage(data.message)
      } else {
        setStatus("error")
        setMessage(data.error || "Nastala chyba pri posielaní emailu")
      }
    } catch (error) {
      setStatus("error")
      setMessage("Nastala chyba pri posielaní verifikačného emailu")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-md">
        <Card>
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100">
              <Mail className="h-8 w-8 text-blue-600" />
            </div>
            <CardTitle className="text-2xl">Poslať verifikačný email</CardTitle>
            <CardDescription>Zadajte váš email a pošleme vám nový odkaz na overenie</CardDescription>
          </CardHeader>
          <CardContent>
            {status === "success" ? (
              <div className="space-y-4">
                <div className="rounded-lg bg-green-50 p-4 flex items-start space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                  <div>
                    <h3 className="font-medium text-green-900">Email odoslaný</h3>
                    <p className="text-sm text-green-700 mt-1">{message}</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="font-medium">Ďalšie kroky:</h4>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li className="flex items-center space-x-2">
                      <div className="h-1.5 w-1.5 rounded-full bg-teal-500" />
                      <span>Skontrolujte si email (aj spam priečinok)</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <div className="h-1.5 w-1.5 rounded-full bg-teal-500" />
                      <span>Kliknite na verifikačný odkaz</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <div className="h-1.5 w-1.5 rounded-full bg-teal-500" />
                      <span>Prihláste sa do svojho účtu</span>
                    </li>
                  </ul>
                </div>

                <div className="pt-4 space-y-3">
                  <Button asChild className="w-full">
                    <Link href="/auth/login">Prejsť na prihlásenie</Link>
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full bg-transparent"
                    onClick={() => {
                      setStatus("idle")
                      setEmail("")
                      setMessage("")
                    }}
                  >
                    Poslať na iný email
                  </Button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleResend}>
                <div className="space-y-4">
                  <div className="grid gap-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="vas@email.com"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      disabled={isLoading}
                    />
                  </div>

                  {status === "error" && (
                    <div className="rounded-lg bg-red-50 p-4 flex items-start space-x-3">
                      <AlertCircle className="h-5 w-5 text-red-600 mt-0.5" />
                      <div>
                        <h3 className="font-medium text-red-900">Chyba</h3>
                        <p className="text-sm text-red-700 mt-1">{message}</p>
                      </div>
                    </div>
                  )}

                  <div className="rounded-lg bg-blue-50 p-4">
                    <p className="text-sm text-blue-700">
                      <strong>Poznámka:</strong> Ak email existuje v našom systéme a nie je ešte overený, pošleme nový
                      verifikačný odkaz. Odkaz je platný 24 hodín.
                    </p>
                  </div>

                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? "Posiela sa..." : "Poslať verifikačný email"}
                  </Button>
                </div>

                <div className="mt-4 text-center text-sm space-y-2">
                  <div>
                    Už máte overený účet?{" "}
                    <Link href="/auth/login" className="underline underline-offset-4 text-teal-600 hover:text-teal-700">
                      Prihláste sa
                    </Link>
                  </div>
                  <div>
                    <Link href="/" className="text-gray-500 hover:text-gray-700 underline underline-offset-4">
                      Späť na hlavnú stránku
                    </Link>
                  </div>
                </div>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
