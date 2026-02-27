"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { AlertCircle, Eye, EyeOff, Loader2 } from "lucide-react"
import Link from "next/link"

type UserType = "worker" | "company"

export default function RegisterPage() {
  const [userType, setUserType] = useState<UserType>("worker")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [fullName, setFullName] = useState("")
  const [companyName, setCompanyName] = useState("")
  const [gdprConsent, setGdprConsent] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { signUp } = useAuth()

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (password !== confirmPassword) {
      setError("Heslá sa nezhodujú.")
      return
    }
    if (password.length < 6) {
      setError("Heslo musí mať aspoň 6 znakov.")
      return
    }
    if (!gdprConsent) {
      setError("Musíte súhlasiť so spracovaním osobných údajov.")
      return
    }

    setIsLoading(true)
    try {
      const profileData = {
        email,
        user_type: userType,
        full_name: userType === "worker" ? fullName : companyName,
      }
      const { error } = await signUp(email, password, userType, profileData)
      if (error) throw error
      router.push(`/auth/register-success?userType=${userType}`)
    } catch (err: any) {
      console.error("Registration catch block:", err)
      const message = err?.message || (typeof err === "string" ? err : "Nastala chyba pri registrácii.")
      setError(message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-md">
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Registrácia</CardTitle>
            <CardDescription>Vytvorte si účet na SkillScore</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleRegister} className="flex flex-col gap-5">

              {/* Typ účtu */}
              <div className="grid gap-3">
                <Label className="text-base font-medium">Typ účtu</Label>
                <RadioGroup value={userType} onValueChange={(v) => setUserType(v as UserType)} className="grid gap-2">
                  <div className="flex items-center space-x-2 border rounded-lg p-3 hover:bg-muted/50 cursor-pointer">
                    <RadioGroupItem value="worker" id="worker" />
                    <Label htmlFor="worker" className="flex-1 cursor-pointer">
                      <div className="font-medium">Remeselník / Pracovník</div>
                      <div className="text-sm text-muted-foreground">Vytvorím si profil a absolvujem test zručností</div>
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2 border rounded-lg p-3 hover:bg-muted/50 cursor-pointer">
                    <RadioGroupItem value="company" id="company" />
                    <Label htmlFor="company" className="flex-1 cursor-pointer">
                      <div className="font-medium">Firma / Zamestnávateľ</div>
                      <div className="text-sm text-muted-foreground">Hľadám overených remeselníkov</div>
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              {/* Meno / Firma */}
              <div className="grid gap-2">
                <Label htmlFor="name">{userType === "worker" ? "Celé meno" : "Názov firmy"} <span className="text-red-500">*</span></Label>
                <Input
                  id="name"
                  type="text"
                  placeholder={userType === "worker" ? "Ján Novák" : "ABC s.r.o."}
                  required
                  value={userType === "worker" ? fullName : companyName}
                  onChange={(e) => userType === "worker" ? setFullName(e.target.value) : setCompanyName(e.target.value)}
                />
              </div>

              {/* Email */}
              <div className="grid gap-2">
                <Label htmlFor="email">E-mail <span className="text-red-500">*</span></Label>
                <Input id="email" type="email" placeholder="vas@email.sk" required value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>

              {/* Heslo */}
              <div className="grid gap-2">
                <Label htmlFor="password">Heslo <span className="text-red-500">*</span></Label>
                <div className="relative">
                  <Input id="password" type={showPassword ? "text" : "password"} placeholder="min. 6 znakov" required value={password} onChange={(e) => setPassword(e.target.value)} className="pr-10" />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {/* Potvrdiť heslo */}
              <div className="grid gap-2">
                <Label htmlFor="confirmPassword">Potvrdiť heslo <span className="text-red-500">*</span></Label>
                <div className="relative">
                  <Input id="confirmPassword" type={showConfirmPassword ? "text" : "password"} placeholder="Zopakujte heslo" required value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="pr-10" />
                  <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {/* GDPR */}
              <div className="flex items-start gap-2">
                <Checkbox id="gdpr" checked={gdprConsent} onCheckedChange={(c) => setGdprConsent(c as boolean)} className="mt-0.5" />
                <Label htmlFor="gdpr" className="text-sm leading-5 cursor-pointer font-normal">
                  Súhlasím so{" "}
                  <Link href="/legal/gdpr" className="text-primary hover:underline">spracovaním osobných údajov</Link>{" "}
                  a{" "}
                  <Link href="/legal/terms" className="text-primary hover:underline">obchodnými podmienkami</Link>.{" "}
                  <span className="text-red-500">*</span>
                </Label>
              </div>

              {/* Error */}
              {error && (
                <div className="rounded-lg bg-red-50 border border-red-200 p-3 flex gap-2 items-start">
                  <AlertCircle className="h-4 w-4 text-red-600 mt-0.5 shrink-0" />
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              )}

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                {isLoading ? "Registrujem..." : "Vytvoriť účet"}
              </Button>

              <p className="text-center text-sm">
                Máte účet?{" "}
                <Link href="/auth/login" className="underline text-primary">Prihlásiť sa</Link>
              </p>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
