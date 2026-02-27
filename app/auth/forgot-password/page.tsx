"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { CheckCircle, AlertCircle } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import { createClient } from "@/lib/supabase/client"

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    setSuccess(false)

    const supabase = createClient()

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`,
      })

      if (error) throw error

      setSuccess(true)
      setEmail("")
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "Nastala chyba pri odosielaní emailu")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <div className="flex flex-col gap-6">
          {success && (
            <div className="rounded-lg bg-green-50 border border-green-200 p-4">
              <div className="flex items-center space-x-3">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <div>
                  <h3 className="font-medium text-green-900">Email odoslaný</h3>
                  <p className="text-sm text-green-700 mt-1">
                    Skontrolujte svoju emailovú schránku a kliknite na odkaz na obnovenie hesla.
                  </p>
                </div>
              </div>
            </div>
          )}

          <Card>
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">Zabudnuté heslo</CardTitle>
              <CardDescription>Zadajte svoj email a pošleme vám odkaz na obnovenie hesla</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleResetPassword}>
                <div className="flex flex-col gap-6">
                  <div className="grid gap-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="vas@email.sk"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>

                  {error && (
                    <div className="rounded-lg bg-red-50 border border-red-200 p-4">
                      <div className="flex items-start space-x-3">
                        <AlertCircle className="h-5 w-5 text-red-600 mt-0.5" />
                        <p className="text-sm text-red-700">{error}</p>
                      </div>
                    </div>
                  )}

                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? "Odosielam..." : "Odoslať odkaz na obnovenie"}
                  </Button>
                </div>

                <div className="mt-4 text-center text-sm">
                  Spomínate si na heslo?{" "}
                  <Link href="/auth/login" className="underline underline-offset-4 text-teal-600 hover:text-teal-700">
                    Prihlásiť sa
                  </Link>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
