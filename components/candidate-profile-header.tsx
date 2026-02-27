"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { User, Mail, CheckCircle, AlertCircle, Edit, Save, X, Key } from "lucide-react"
import { useState } from "react"
import { useI18n } from "@/lib/i18n/context"
import { staticTranslations } from "@/lib/i18n/translations"

interface CandidateProfileHeaderProps {
  user: {
    id: string
    email: string
    email_verified: boolean
    first_name?: string
    last_name?: string
    anonymous_id?: string
  }
}

export function CandidateProfileHeader({ user }: CandidateProfileHeaderProps) {
  const { language } = useI18n()
  const currentLang = (language && language in staticTranslations ? language : "sk") as keyof typeof staticTranslations
  const t = staticTranslations[currentLang].candidateDashboard.settings

  const [isEditing, setIsEditing] = useState(false)
  const [firstName, setFirstName] = useState(user.first_name || "")
  const [lastName, setLastName] = useState(user.last_name || "")
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  // Email change state
  const [showEmailDialog, setShowEmailDialog] = useState(false)
  const [newEmail, setNewEmail] = useState("")
  const [emailError, setEmailError] = useState<string | null>(null)
  const [emailSuccess, setEmailSuccess] = useState<string | null>(null)
  const [isChangingEmail, setIsChangingEmail] = useState(false)

  // Password change state
  const [showPasswordDialog, setShowPasswordDialog] = useState(false)
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [passwordError, setPasswordError] = useState<string | null>(null)
  const [passwordSuccess, setPasswordSuccess] = useState<string | null>(null)
  const [isChangingPassword, setIsChangingPassword] = useState(false)

  const handleSave = async () => {
    setIsSaving(true)
    setError(null)
    setSuccess(null)

    try {
      const response = await fetch("/api/candidate/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          first_name: firstName,
          last_name: lastName,
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || t.errors.updateProfile)
      }

      setSuccess(t.personalInfo.successDescription)
      setIsEditing(false)
      setTimeout(() => setSuccess(null), 3000)
    } catch (err) {
      setError(err instanceof Error ? err.message : t.errors.updateProfile)
    } finally {
      setIsSaving(false)
    }
  }

  const handleEmailChange = async () => {
    setIsChangingEmail(true)
    setEmailError(null)
    setEmailSuccess(null)

    if (!newEmail || !newEmail.includes("@")) {
      setEmailError(t.email.newEmailPlaceholder)
      setIsChangingEmail(false)
      return
    }

    try {
      const response = await fetch("/api/candidate/change-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ new_email: newEmail }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || t.errors.updateEmail)
      }

      setEmailSuccess(t.email.successDescription)
      setNewEmail("")
      setTimeout(() => {
        setShowEmailDialog(false)
        setEmailSuccess(null)
      }, 3000)
    } catch (err) {
      setEmailError(err instanceof Error ? err.message : t.errors.updateEmail)
    } finally {
      setIsChangingEmail(false)
    }
  }

  const handlePasswordChange = async () => {
    setIsChangingPassword(true)
    setPasswordError(null)
    setPasswordSuccess(null)

    if (!currentPassword || !newPassword || !confirmPassword) {
      setPasswordError(t.password.currentPasswordPlaceholder)
      setIsChangingPassword(false)
      return
    }

    if (newPassword !== confirmPassword) {
      setPasswordError(t.password.mismatch)
      setIsChangingPassword(false)
      return
    }

    if (newPassword.length < 6) {
      setPasswordError(t.password.tooShort)
      setIsChangingPassword(false)
      return
    }

    try {
      const response = await fetch("/api/candidate/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          current_password: currentPassword,
          new_password: newPassword,
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || t.errors.updatePassword)
      }

      setPasswordSuccess(t.password.successDescription)
      setCurrentPassword("")
      setNewPassword("")
      setConfirmPassword("")
      setTimeout(() => {
        setShowPasswordDialog(false)
        setPasswordSuccess(null)
      }, 2000)
    } catch (err) {
      setPasswordError(err instanceof Error ? err.message : t.errors.updatePassword)
    } finally {
      setIsChangingPassword(false)
    }
  }

  const getInitials = () => {
    if (firstName && lastName) {
      return `${firstName[0]}${lastName[0]}`.toUpperCase()
    }
    return user.email[0].toUpperCase()
  }

  return (
    <Card className="mb-6 bg-gradient-to-r from-teal-50 to-blue-50 dark:from-teal-950/20 dark:to-blue-950/20 border-teal-200 dark:border-teal-800">
      <CardContent className="pt-6">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
          {/* Avatar */}
          <Avatar className="h-20 w-20 border-4 border-white dark:border-gray-800 shadow-lg">
            <AvatarFallback className="bg-gradient-to-br from-teal-500 to-blue-500 text-white text-2xl font-bold">
              {getInitials()}
            </AvatarFallback>
          </Avatar>

          {/* Profile Info */}
          <div className="flex-1 space-y-4 w-full">
            {isEditing ? (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName">{t.personalInfo.firstName}</Label>
                    <Input
                      id="firstName"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      placeholder={t.personalInfo.firstNamePlaceholder}
                    />
                  </div>
                  <div>
                    <Label htmlFor="lastName">{t.personalInfo.lastName}</Label>
                    <Input
                      id="lastName"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      placeholder={t.personalInfo.lastNamePlaceholder}
                    />
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button onClick={handleSave} disabled={isSaving} size="sm">
                    <Save className="w-4 h-4 mr-2" />
                    {isSaving ? t.personalInfo.saving : t.personalInfo.save}
                  </Button>
                  <Button
                    onClick={() => {
                      setIsEditing(false)
                      setFirstName(user.first_name || "")
                      setLastName(user.last_name || "")
                      setError(null)
                    }}
                    variant="outline"
                    size="sm"
                  >
                    <X className="w-4 h-4 mr-2" />
                    {staticTranslations[currentLang].auth.register.cancel || "Zrušiť"}
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="flex items-center gap-3 flex-wrap">
                  <h2 className="text-2xl font-bold text-foreground">
                    {firstName && lastName
                      ? `${firstName} ${lastName}`
                      : staticTranslations[currentLang].ui.nav.candidate}
                  </h2>
                  <Badge variant="secondary" className="bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-200">
                    <User className="w-3 h-3 mr-1" />
                    {staticTranslations[currentLang].ui.nav.candidate}
                  </Badge>
                  {user.email_verified ? (
                    <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      {staticTranslations[currentLang].auth.login.verified?.title || "Overený email"}
                    </Badge>
                  ) : (
                    <Badge variant="destructive">
                      <AlertCircle className="w-3 h-3 mr-1" />
                      {staticTranslations[currentLang].auth.login.errors?.emailNotVerified || "Email neoverený"}
                    </Badge>
                  )}
                </div>

                <div className="flex items-center gap-2 text-muted-foreground">
                  <Mail className="w-4 h-4" />
                  <span>{user.email}</span>
                </div>

                {user.anonymous_id && (
                  <div className="text-sm text-muted-foreground">
                    <span className="font-medium">Anonymné ID:</span> {user.anonymous_id}
                  </div>
                )}
              </div>
            )}

            {error && <div className="text-sm text-red-600 bg-red-50 dark:bg-red-900/20 p-2 rounded">{error}</div>}
            {success && (
              <div className="text-sm text-green-600 bg-green-50 dark:bg-green-900/20 p-2 rounded">{success}</div>
            )}
          </div>

          {/* Action Buttons */}
          {!isEditing && (
            <div className="flex flex-col gap-2 w-full md:w-auto">
              <Button onClick={() => setIsEditing(true)} variant="outline" size="sm" className="w-full md:w-auto">
                <Edit className="w-4 h-4 mr-2" />
                {t.personalInfo.description}
              </Button>

              <Dialog open={showEmailDialog} onOpenChange={setShowEmailDialog}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm" className="w-full md:w-auto bg-transparent">
                    <Mail className="w-4 h-4 mr-2" />
                    {t.email.change}
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>{t.email.title}</DialogTitle>
                    <DialogDescription>{t.email.description}</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="newEmail">{t.email.newEmail}</Label>
                      <Input
                        id="newEmail"
                        type="email"
                        value={newEmail}
                        onChange={(e) => setNewEmail(e.target.value)}
                        placeholder={t.email.newEmailPlaceholder}
                      />
                    </div>
                    {emailError && <div className="text-sm text-red-600">{emailError}</div>}
                    {emailSuccess && <div className="text-sm text-green-600">{emailSuccess}</div>}
                    <Button onClick={handleEmailChange} disabled={isChangingEmail} className="w-full">
                      {isChangingEmail ? t.email.changing : t.email.change}
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>

              <Dialog open={showPasswordDialog} onOpenChange={setShowPasswordDialog}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm" className="w-full md:w-auto bg-transparent">
                    <Key className="w-4 h-4 mr-2" />
                    {t.password.change}
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>{t.password.title}</DialogTitle>
                    <DialogDescription>{t.password.description}</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="currentPassword">{t.password.currentPassword}</Label>
                      <Input
                        id="currentPassword"
                        type="password"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        placeholder={t.password.currentPasswordPlaceholder}
                      />
                    </div>
                    <div>
                      <Label htmlFor="newPassword">{t.password.newPassword}</Label>
                      <Input
                        id="newPassword"
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder={t.password.newPasswordPlaceholder}
                      />
                    </div>
                    <div>
                      <Label htmlFor="confirmPassword">{t.password.confirmPassword}</Label>
                      <Input
                        id="confirmPassword"
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder={t.password.confirmPasswordPlaceholder}
                      />
                    </div>
                    {passwordError && <div className="text-sm text-red-600">{passwordError}</div>}
                    {passwordSuccess && <div className="text-sm text-green-600">{passwordSuccess}</div>}
                    <Button onClick={handlePasswordChange} disabled={isChangingPassword} className="w-full">
                      {isChangingPassword ? t.password.changing : t.password.change}
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
