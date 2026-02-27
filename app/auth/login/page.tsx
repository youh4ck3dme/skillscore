"use client"

import React, { useState, useEffect, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { CheckCircle, AlertCircle, Loader2 } from "lucide-react"
import Link from "next/link"

function LoginForm() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()
  const verified = searchParams.get("verified")
  const [showVerifiedMessage, setShowVerifiedMessage] = useState(verified === "true")

  useEffect(() => {
    if (verified === "true") {
      const timer = setTimeout(() => setShowVerifiedMessage(false), 5000)
      return () => clearTimeout(timer)
    }
  }, [verified])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    const supabase = createClient()

    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) throw error

      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const { data: profile } = await supabase.from("profiles").select("user_type").eq("id", user.id).single()
        router.push(profile?.user_type === "company" ? "/dashboard/company" : "/dashboard/worker")
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Nastala chyba pri prihlásení")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm flex flex-col gap-6">
        {showVerifiedMessage && (
          <div className="rounded-lg bg-green-50 border border-green-200 p-4 flex items-center gap-3">
            <CheckCircle className="h-5 w-5 text-green-600 shrink-0" />
            <div>
              <p className="font-medium text-green-900">E-mail overený!</p>
              <p className="text-sm text-green-700">Teraz sa môžete prihlásiť.</p>
            </div>
          </div>
        )}

        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Prihlásenie</CardTitle>
            <CardDescription>Zadajte e-mail a heslo</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="flex flex-col gap-4">
              <div className="grid gap-2">
                <Label htmlFor="email">E-mail</Label>
                <Input id="email" type="email" placeholder="vas@email.sk" required value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Heslo</Label>
                  <Link href="/auth/forgot-password" className="text-sm text-primary hover:underline">Zabudli ste heslo?</Link>
                </div>
                <Input id="password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} />
              </div>

              {error && (
                <div className="rounded-lg bg-red-50 border border-red-200 p-3 flex gap-2 items-start">
                  <AlertCircle className="h-4 w-4 text-red-600 mt-0.5 shrink-0" />
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              )}

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                {isLoading ? "Prihlasujem..." : "Prihlásiť sa"}
              </Button>

              <p className="text-center text-sm">
                Nemáte účet?{" "}
                <Link href="/auth/register" className="underline text-primary">Registrovať sa</Link>
              </p>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    }>
      <LoginForm />
    </Suspense>
  )
}
