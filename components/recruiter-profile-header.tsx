"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { User, Mail, Edit, Save, X, Key, CheckCircle, AlertCircle } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { useT } from "@/lib/i18n/hooks"

interface RecruiterProfileHeaderProps {
  user: {
    id: string
    email: string
    email_verified: boolean
    first_name?: string
    last_name?: string
    anonymous_id?: string
  }
}

export function RecruiterProfileHeader({ user }: RecruiterProfileHeaderProps) {
  const t = useT()

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
      const response = await fetch("/api/recruiter/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          first_name: firstName,
          last_name: lastName,
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || t("recruiterProfileHeader.errors.updateFailed"))
      }

      setSuccess(t("recruiterProfileHeader.success.profileUpdated"))
      setIsEditing(false)
      setTimeout(() => setSuccess(null), 3000)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Nastala chyba")
    } finally {
      setIsSaving(false)
    }
  }

  const handleEmailChange = async () => {
    setIsChangingEmail(true)
    setEmailError(null)
    setEmailSuccess(null)

    if (!newEmail || !newEmail.includes("@")) {
      setEmailError(t("recruiterProfileHeader.errors.emailInvalid"))
      setIsChangingEmail(false)
      return
    }

    try {
      const response = await fetch("/api/recruiter/change-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ new_email: newEmail }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Nepodarilo sa zmeniť email")
      }

      setEmailSuccess(t("recruiterProfileHeader.success.emailLinkSent"))
      setNewEmail("")
      setTimeout(() => {
        setShowEmailDialog(false)
        setEmailSuccess(null)
      }, 3000)
    } catch (err) {
      setEmailError(err instanceof Error ? err.message : "Nastala chyba")
    } finally {
      setIsChangingEmail(false)
    }
  }

  const handlePasswordChange = async () => {
    setIsChangingPassword(true)
    setPasswordError(null)
    setPasswordSuccess(null)

    if (!currentPassword || !newPassword || !confirmPassword) {
      setPasswordError(t("recruiterProfileHeader.errors.allFieldsRequired"))
      setIsChangingPassword(false)
      return
    }

    if (newPassword !== confirmPassword) {
      setPasswordError(t("recruiterProfileHeader.errors.passwordMismatch"))
      setIsChangingPassword(false)
      return
    }

    if (newPassword.length < 6) {
      setPasswordError(t("recruiterProfileHeader.errors.passwordTooShort"))
      setIsChangingPassword(false)
      return
    }

    try {
      const response = await fetch("/api/recruiter/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          current_password: currentPassword,
          new_password: newPassword,
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Nepodarilo sa zmeniť heslo")
      }

      setPasswordSuccess(t("recruiterProfileHeader.success.passwordChanged"))
      setCurrentPassword("")
      setNewPassword("")
      setConfirmPassword("")
      setTimeout(() => {
        setShowPasswordDialog(false)
        setPasswordSuccess(null)
      }, 2000)
    } catch (err) {
      setPasswordError(err instanceof Error ? err.message : "Nastala chyba")
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
    <Card className="mb-6 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-950/20 dark:to-blue-950/20 border-purple-200 dark:border-purple-800">
      <CardContent className="pt-6">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
          {/* Avatar */}
          <Avatar className="h-20 w-20 border-4 border-white dark:border-gray-800 shadow-lg">
            <AvatarFallback className="bg-gradient-to-br from-purple-500 to-blue-500 text-white text-2xl font-bold">
              {getInitials()}
            </AvatarFallback>
          </Avatar>

          {/* Profile Info */}
          <div className="flex-1 space-y-4 w-full">
            {isEditing ? (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName">{t("recruiterProfileHeader.fields.firstName.label")}</Label>
                    <Input
                      id="firstName"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      placeholder={t("recruiterProfileHeader.fields.firstName.placeholder")}
                    />
                  </div>
                  <div>
                    <Label htmlFor="lastName">{t("recruiterProfileHeader.fields.lastName.label")}</Label>
                    <Input
                      id="lastName"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      placeholder={t("recruiterProfileHeader.fields.lastName.placeholder")}
                    />
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button onClick={handleSave} disabled={isSaving} size="sm">
                    <Save className="w-4 h-4 mr-2" />
                    {isSaving ? t("recruiterProfileHeader.actions.saving") : t("recruiterProfileHeader.actions.save")}
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
                    {t("recruiterProfileHeader.actions.cancel")}
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="flex items-center gap-3 flex-wrap">
                  <h2 className="text-2xl font-bold text-foreground">
                    {firstName && lastName ? `${firstName} ${lastName}` : t("recruiterProfileHeader.role")}
                  </h2>
                  <Badge
                    variant="secondary"
                    className="bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200"
                  >
                    <User className="w-3 h-3 mr-1" />
                    {t("recruiterProfileHeader.role")}
                  </Badge>
                  {user.email_verified ? (
                    <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      {t("recruiterProfileHeader.emailVerified")}
                    </Badge>
                  ) : (
                    <Badge variant="destructive">
                      <AlertCircle className="w-3 h-3 mr-1" />
                      {t("recruiterProfileHeader.emailNotVerified")}
                    </Badge>
                  )}
                </div>

                <div className="flex items-center gap-2 text-muted-foreground">
                  <Mail className="w-4 h-4" />
                  <span>{user.email}</span>
                </div>

                {user.anonymous_id && (
                  <div className="text-sm text-muted-foreground">
                    <span className="font-medium">{t("recruiterProfileHeader.anonymousId")}</span> {user.anonymous_id}
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
                {t("recruiterProfileHeader.actions.edit")}
              </Button>

              <Dialog open={showEmailDialog} onOpenChange={setShowEmailDialog}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm" className="w-full md:w-auto bg-transparent">
                    <Mail className="w-4 h-4 mr-2" />
                    {t("recruiterProfileHeader.actions.changeEmail")}
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>{t("recruiterProfileHeader.emailDialog.title")}</DialogTitle>
                    <DialogDescription>{t("recruiterProfileHeader.emailDialog.description")}</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="newEmail">{t("recruiterProfileHeader.emailDialog.newEmail.label")}</Label>
                      <Input
                        id="newEmail"
                        type="email"
                        value={newEmail}
                        onChange={(e) => setNewEmail(e.target.value)}
                        placeholder={t("recruiterProfileHeader.emailDialog.newEmail.placeholder")}
                      />
                    </div>
                    {emailError && <div className="text-sm text-red-600">{emailError}</div>}
                    {emailSuccess && <div className="text-sm text-green-600">{emailSuccess}</div>}
                    <Button onClick={handleEmailChange} disabled={isChangingEmail} className="w-full">
                      {isChangingEmail
                        ? t("recruiterProfileHeader.emailDialog.buttonSending")
                        : t("recruiterProfileHeader.emailDialog.button")}
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>

              <Dialog open={showPasswordDialog} onOpenChange={setShowPasswordDialog}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm" className="w-full md:w-auto bg-transparent">
                    <Key className="w-4 h-4 mr-2" />
                    {t("recruiterProfileHeader.actions.changePassword")}
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>{t("recruiterProfileHeader.passwordDialog.title")}</DialogTitle>
                    <DialogDescription>{t("recruiterProfileHeader.passwordDialog.description")}</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="currentPassword">
                        {t("recruiterProfileHeader.passwordDialog.currentPassword.label")}
                      </Label>
                      <Input
                        id="currentPassword"
                        type="password"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        placeholder={t("recruiterProfileHeader.passwordDialog.currentPassword.placeholder")}
                      />
                    </div>
                    <div>
                      <Label htmlFor="newPassword">
                        {t("recruiterProfileHeader.passwordDialog.newPassword.label")}
                      </Label>
                      <Input
                        id="newPassword"
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder={t("recruiterProfileHeader.passwordDialog.newPassword.placeholder")}
                      />
                    </div>
                    <div>
                      <Label htmlFor="confirmPassword">
                        {t("recruiterProfileHeader.passwordDialog.confirmPassword.label")}
                      </Label>
                      <Input
                        id="confirmPassword"
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder={t("recruiterProfileHeader.passwordDialog.confirmPassword.placeholder")}
                      />
                    </div>
                    {passwordError && <div className="text-sm text-red-600">{passwordError}</div>}
                    {passwordSuccess && <div className="text-sm text-green-600">{passwordSuccess}</div>}
                    <Button onClick={handlePasswordChange} disabled={isChangingPassword} className="w-full">
                      {isChangingPassword
                        ? t("recruiterProfileHeader.passwordDialog.buttonChanging")
                        : t("recruiterProfileHeader.passwordDialog.button")}
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
