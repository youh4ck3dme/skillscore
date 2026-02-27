"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Building2, Mail, Edit, Save, X, Key, CheckCircle, AlertCircle } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { useI18n } from "@/lib/i18n/context"
import { staticTranslations } from "@/lib/i18n/translations"

interface CompanyProfileHeaderProps {
  user: {
    id: string
    email: string
    email_verified: boolean
    company_name?: string
    phone?: string
    anonymous_id?: string
  }
}

export function CompanyProfileHeader({ user }: CompanyProfileHeaderProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [companyName, setCompanyName] = useState(user.company_name || "")
  const [phone, setPhone] = useState(user.phone || "")
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

  const { language } = useI18n()
  const currentLang = (language && staticTranslations[language] ? language : "sk") as keyof typeof staticTranslations
  const t = staticTranslations[currentLang].companyDashboard.profile

  const handleSave = async () => {
    setIsSaving(true)
    setError(null)
    setSuccess(null)

    try {
      const response = await fetch("/api/company/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          company_name: companyName,
          phone: phone,
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || t.saveError)
      }

      setSuccess(t.saveSuccess)
      setIsEditing(false)
      setTimeout(() => setSuccess(null), 3000)
    } catch (err) {
      setError(err instanceof Error ? err.message : t.genericError)
    } finally {
      setIsSaving(false)
    }
  }

  const handleEmailChange = async () => {
    setIsChangingEmail(true)
    setEmailError(null)
    setEmailSuccess(null)

    if (!newEmail || !newEmail.includes("@")) {
      setEmailError(t.invalidEmail)
      setIsChangingEmail(false)
      return
    }

    try {
      const response = await fetch("/api/company/change-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ new_email: newEmail }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || t.emailChangeError)
      }

      setEmailSuccess(t.emailChangeSuccess)
      setNewEmail("")
      setTimeout(() => {
        setShowEmailDialog(false)
        setEmailSuccess(null)
      }, 3000)
    } catch (err) {
      setEmailError(err instanceof Error ? err.message : t.genericError)
    } finally {
      setIsChangingEmail(false)
    }
  }

  const handlePasswordChange = async () => {
    setIsChangingPassword(true)
    setPasswordError(null)
    setPasswordSuccess(null)

    if (!currentPassword || !newPassword || !confirmPassword) {
      setPasswordError(t.requiredFields)
      setIsChangingPassword(false)
      return
    }

    if (newPassword !== confirmPassword) {
      setPasswordError(t.passwordMismatch)
      setIsChangingPassword(false)
      return
    }

    if (newPassword.length < 6) {
      setPasswordError(t.passwordLength)
      setIsChangingPassword(false)
      return
    }

    try {
      const response = await fetch("/api/company/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          current_password: currentPassword,
          new_password: newPassword,
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || t.passwordChangeError)
      }

      setPasswordSuccess(t.passwordChangeSuccess)
      setCurrentPassword("")
      setNewPassword("")
      setConfirmPassword("")
      setTimeout(() => {
        setShowPasswordDialog(false)
        setPasswordSuccess(null)
      }, 2000)
    } catch (err) {
      setPasswordError(err instanceof Error ? err.message : t.genericError)
    } finally {
      setIsChangingPassword(false)
    }
  }

  const getInitials = () => {
    if (companyName && companyName.trim().length > 0) {
      return companyName.substring(0, 2).toUpperCase()
    }
    if (user.company_name && user.company_name.trim().length > 0) {
      return user.company_name.substring(0, 2).toUpperCase()
    }
    if (user.email && user.email.length > 0) {
      return user.email[0].toUpperCase()
    }
    return "??"
  }

  return (
    <Card className="mb-6 bg-gradient-to-r from-orange-50 to-amber-50 dark:from-orange-950/20 dark:to-amber-950/20 border-orange-200 dark:border-orange-800">
      <CardContent className="pt-6">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
          {/* Avatar */}
          <Avatar className="h-20 w-20 border-4 border-white dark:border-gray-800 shadow-lg">
            <AvatarFallback className="bg-gradient-to-br from-orange-500 to-amber-500 text-white text-2xl font-bold">
              {getInitials()}
            </AvatarFallback>
          </Avatar>

          {/* Profile Info */}
          <div className="flex-1 space-y-4 w-full">
            {isEditing ? (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="companyName">{t.companyNameLabel}</Label>
                    <Input
                      id="companyName"
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      placeholder={t.companyNamePlaceholder}
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">{t.phoneLabel}</Label>
                    <Input
                      id="phone"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+421 xxx xxx xxx"
                    />
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button onClick={handleSave} disabled={isSaving} size="sm">
                    <Save className="w-4 h-4 mr-2" />
                    {isSaving ? t.saving : t.save}
                  </Button>
                  <Button
                    onClick={() => {
                      setIsEditing(false)
                      setCompanyName(user.company_name || "")
                      setPhone(user.phone || "")
                      setError(null)
                    }}
                    variant="outline"
                    size="sm"
                  >
                    <X className="w-4 h-4 mr-2" />
                    {t.cancel}
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="flex items-center gap-3 flex-wrap">
                  <h2 className="text-2xl font-bold text-foreground">{companyName || t.defaultCompanyName}</h2>
                  <Badge
                    variant="secondary"
                    className="bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200"
                  >
                    <Building2 className="w-3 h-3 mr-1" />
                    {t.companyBadge}
                  </Badge>
                  {user.email_verified ? (
                    <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      {t.verifiedEmailBadge}
                    </Badge>
                  ) : (
                    <Badge variant="destructive">
                      <AlertCircle className="w-3 h-3 mr-1" />
                      {t.unverifiedEmailBadge}
                    </Badge>
                  )}
                </div>

                <div className="flex items-center gap-2 text-muted-foreground">
                  <Mail className="w-4 h-4" />
                  <span>{user.email}</span>
                </div>

                {user.anonymous_id && (
                  <div className="text-sm text-muted-foreground">
                    <span className="font-medium">{t.anonymousIdLabel}:</span> {user.anonymous_id}
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
                {t.editProfile}
              </Button>

              <Dialog open={showEmailDialog} onOpenChange={setShowEmailDialog}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm" className="w-full md:w-auto bg-transparent">
                    <Mail className="w-4 h-4 mr-2" />
                    {t.changeEmail}
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>{t.changeEmailTitle}</DialogTitle>
                    <DialogDescription>{t.emailChangeDescription}</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="newEmail">{t.newEmailLabel}</Label>
                      <Input
                        id="newEmail"
                        type="email"
                        value={newEmail}
                        onChange={(e) => setNewEmail(e.target.value)}
                        placeholder="novy@email.com"
                      />
                    </div>
                    {emailError && <div className="text-sm text-red-600">{emailError}</div>}
                    {emailSuccess && <div className="text-sm text-green-600">{emailSuccess}</div>}
                    <Button onClick={handleEmailChange} disabled={isChangingEmail} className="w-full">
                      {isChangingEmail ? t.sendingVerificationLink : t.sendVerificationLink}
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>

              <Dialog open={showPasswordDialog} onOpenChange={setShowPasswordDialog}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm" className="w-full md:w-auto bg-transparent">
                    <Key className="w-4 h-4 mr-2" />
                    {t.changePassword}
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>{t.changePasswordTitle}</DialogTitle>
                    <DialogDescription>{t.passwordChangeDescription}</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="currentPassword">{t.currentPasswordLabel}</Label>
                      <Input
                        id="currentPassword"
                        type="password"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        placeholder={t.currentPasswordPlaceholder}
                      />
                    </div>
                    <div>
                      <Label htmlFor="newPassword">{t.newPasswordLabel}</Label>
                      <Input
                        id="newPassword"
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder={t.newPasswordPlaceholder}
                      />
                    </div>
                    <div>
                      <Label htmlFor="confirmPassword">{t.confirmPasswordLabel}</Label>
                      <Input
                        id="confirmPassword"
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder={t.confirmPasswordPlaceholder}
                      />
                    </div>
                    {passwordError && <div className="text-sm text-red-600">{passwordError}</div>}
                    {passwordSuccess && <div className="text-sm text-green-600">{passwordSuccess}</div>}
                    <Button onClick={handlePasswordChange} disabled={isChangingPassword} className="w-full">
                      {isChangingPassword ? t.changingPassword : t.changePasswordButton}
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
