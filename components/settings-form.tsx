"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { Loader2, User, Mail, Lock, Save, Shield, Trash2 } from "lucide-react"
import { useT } from "@/lib/i18n/hooks"

interface SettingsFormProps {
  user: {
    id: string
    email: string
    firstName: string
    lastName: string
    hasPassword: boolean // Added hasPassword flag
  }
}

export function SettingsForm({ user }: SettingsFormProps) {
  const t = useT()
  const { toast } = useToast()

  // Personal info state
  const [firstName, setFirstName] = useState(user.firstName)
  const [lastName, setLastName] = useState(user.lastName)
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false)

  // Email state
  const [newEmail, setNewEmail] = useState("")
  const [isUpdatingEmail, setIsUpdatingEmail] = useState(false)

  // Password state
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false)

  // GDPR state
  const [isDeletingAccount, setIsDeletingAccount] = useState(false)

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsUpdatingProfile(true)

    try {
      const response = await fetch("/api/candidate/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ firstName, lastName }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || t("candidateDashboard.settings.errors.updateProfile"))
      }

      toast({
        title: t("candidateDashboard.settings.personalInfo.success"),
        description: t("candidateDashboard.settings.personalInfo.successDescription"),
      })
    } catch (error) {
      toast({
        title: t("errors.generic"),
        description: error instanceof Error ? error.message : t("candidateDashboard.settings.errors.updateProfile"),
        variant: "destructive",
      })
    } finally {
      setIsUpdatingProfile(false)
    }
  }

  const handleUpdateEmail = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsUpdatingEmail(true)

    try {
      const response = await fetch("/api/candidate/email", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ newEmail }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || t("candidateDashboard.settings.errors.updateEmail"))
      }

      toast({
        title: t("candidateDashboard.settings.email.success"),
        description: t("candidateDashboard.settings.email.successDescription"),
      })
      setNewEmail("")
    } catch (error) {
      toast({
        title: t("errors.generic"),
        description: error instanceof Error ? error.message : t("candidateDashboard.settings.errors.updateEmail"),
        variant: "destructive",
      })
    } finally {
      setIsUpdatingEmail(false)
    }
  }

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault()

    if (newPassword !== confirmPassword) {
      toast({
        title: t("errors.generic"),
        description: t("candidateDashboard.settings.password.mismatch"),
        variant: "destructive",
      })
      return
    }

    if (newPassword.length < 6) {
      toast({
        title: t("errors.generic"),
        description: t("candidateDashboard.settings.password.tooShort"),
        variant: "destructive",
      })
      return
    }

    setIsUpdatingPassword(true)

    try {
      const response = await fetch("/api/candidate/password", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentPassword: user.hasPassword ? currentPassword : undefined,
          newPassword,
          isSettingPassword: !user.hasPassword,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || t("candidateDashboard.settings.errors.updatePassword"))
      }

      toast({
        title: t("candidateDashboard.settings.password.success"),
        description: user.hasPassword
          ? t("candidateDashboard.settings.password.successDescription")
          : t("candidateDashboard.settings.password.setSuccessDescription"),
      })
      setCurrentPassword("")
      setNewPassword("")
      setConfirmPassword("")
    } catch (error) {
      toast({
        title: t("errors.generic"),
        description: error instanceof Error ? error.message : t("candidateDashboard.settings.errors.updatePassword"),
        variant: "destructive",
      })
    } finally {
      setIsUpdatingPassword(false)
    }
  }

  const handleDeleteAccount = async () => {
    const confirmed = window.confirm(t("candidateDashboard.settings.gdpr.deleteConfirm"))
    if (!confirmed) return

    const doubleConfirmed = window.confirm(t("candidateDashboard.settings.gdpr.deleteDoubleConfirm"))
    if (!doubleConfirmed) return

    setIsDeletingAccount(true)
    try {
      const response = await fetch("/api/candidate/gdpr/delete", {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Failed to delete account")
      }

      toast({
        title: t("candidateDashboard.settings.gdpr.deleteSuccess"),
        description: t("candidateDashboard.settings.gdpr.deleteSuccessDescription"),
      })

      setTimeout(() => {
        window.location.href = "/"
      }, 2000)
    } catch (error) {
      toast({
        title: t("errors.generic"),
        description: error instanceof Error ? error.message : t("candidateDashboard.settings.errors.deleteAccount"),
        variant: "destructive",
      })
    } finally {
      setIsDeletingAccount(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Personal Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="w-5 h-5" />
            {t("candidateDashboard.settings.personalInfo.title")}
          </CardTitle>
          <CardDescription>{t("candidateDashboard.settings.personalInfo.description")}</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleUpdateProfile} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">{t("candidateDashboard.settings.personalInfo.firstName")}</Label>
                <Input
                  id="firstName"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder={t("candidateDashboard.settings.personalInfo.firstNamePlaceholder")}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">{t("candidateDashboard.settings.personalInfo.lastName")}</Label>
                <Input
                  id="lastName"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder={t("candidateDashboard.settings.personalInfo.lastNamePlaceholder")}
                  required
                />
              </div>
            </div>
            <Button type="submit" disabled={isUpdatingProfile}>
              {isUpdatingProfile ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  {t("candidateDashboard.settings.personalInfo.saving")}
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  {t("candidateDashboard.settings.personalInfo.save")}
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Email */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="w-5 h-5" />
            {t("candidateDashboard.settings.email.title")}
          </CardTitle>
          <CardDescription>
            {t("candidateDashboard.settings.email.currentEmail")}: {user.email}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleUpdateEmail} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="newEmail">{t("candidateDashboard.settings.email.newEmail")}</Label>
              <Input
                id="newEmail"
                type="email"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                placeholder={t("candidateDashboard.settings.email.newEmailPlaceholder")}
                required
              />
              <p className="text-sm text-muted-foreground">{t("candidateDashboard.settings.email.description")}</p>
            </div>
            <Button type="submit" disabled={isUpdatingEmail || !newEmail}>
              {isUpdatingEmail ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  {t("candidateDashboard.settings.email.changing")}
                </>
              ) : (
                <>
                  <Mail className="w-4 h-4 mr-2" />
                  {t("candidateDashboard.settings.email.change")}
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Password */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lock className="w-5 h-5" />
            {user.hasPassword
              ? t("candidateDashboard.settings.password.title")
              : t("candidateDashboard.settings.password.setTitle")}
          </CardTitle>
          <CardDescription>
            {user.hasPassword
              ? t("candidateDashboard.settings.password.description")
              : t("candidateDashboard.settings.password.setDescription")}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleUpdatePassword} className="space-y-4">
            {user.hasPassword && (
              <div className="space-y-2">
                <Label htmlFor="currentPassword">{t("candidateDashboard.settings.password.currentPassword")}</Label>
                <Input
                  id="currentPassword"
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder={t("candidateDashboard.settings.password.currentPasswordPlaceholder")}
                  required
                />
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="newPassword">{t("candidateDashboard.settings.password.newPassword")}</Label>
              <Input
                id="newPassword"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder={t("candidateDashboard.settings.password.newPasswordPlaceholder")}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">{t("candidateDashboard.settings.password.confirmPassword")}</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder={t("candidateDashboard.settings.password.confirmPasswordPlaceholder")}
                required
              />
            </div>
            <Button type="submit" disabled={isUpdatingPassword}>
              {isUpdatingPassword ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  {user.hasPassword
                    ? t("candidateDashboard.settings.password.changing")
                    : t("candidateDashboard.settings.password.setting")}
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4 mr-2" />
                  {user.hasPassword
                    ? t("candidateDashboard.settings.password.change")
                    : t("candidateDashboard.settings.password.set")}
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* GDPR Data Management */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5" />
            {t("candidateDashboard.settings.gdpr.title")}
          </CardTitle>
          <CardDescription>{t("candidateDashboard.settings.gdpr.description")}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-4">
            {/* Delete Account */}
            <div className="p-4 border border-destructive/50 rounded-lg space-y-3 bg-destructive/5">
              <div>
                <h4 className="font-medium mb-1 text-destructive">
                  {t("candidateDashboard.settings.gdpr.deleteTitle")}
                </h4>
                <p className="text-sm text-muted-foreground">
                  {t("candidateDashboard.settings.gdpr.deleteDescription")}
                </p>
              </div>
              <Button
                onClick={handleDeleteAccount}
                disabled={isDeletingAccount}
                variant="destructive"
                className="gap-2"
              >
                {isDeletingAccount ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    {t("candidateDashboard.settings.gdpr.deleting")}
                  </>
                ) : (
                  <>
                    <Trash2 className="w-4 h-4" />
                    {t("candidateDashboard.settings.gdpr.delete")}
                  </>
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
