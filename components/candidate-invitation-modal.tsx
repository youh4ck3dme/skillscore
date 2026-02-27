"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { QrCode, Download, Gift, Users, TrendingUp } from "lucide-react"
import { QRCodeSVG } from "qrcode.react"
import { useT } from "@/lib/i18n/hooks"

interface CandidateInvitationModalProps {
  onInvitationSent?: () => void
}

export function CandidateInvitationModal({ onInvitationSent }: CandidateInvitationModalProps) {
  const t = useT()
  const [isOpen, setIsOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [invitationCode, setInvitationCode] = useState<string | null>(null)
  const [invitationUrl, setInvitationUrl] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    invited_email: "",
    invited_type: "candidate",
    personal_message: "",
  })

  useEffect(() => {
    if (invitationCode) {
      const baseUrl = process.env.NEXT_PUBLIC_APP_URL || window.location.origin
      setInvitationUrl(`${baseUrl}/invite/${invitationCode}?type=candidate`)
    }
  }, [invitationCode])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const response = await fetch("/api/recruiter/invitations/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to send invitation")
      }

      if (data.invitation_code) {
        setInvitationCode(data.invitation_code)
      }

      setFormData({
        invited_email: "",
        invited_type: "candidate",
        personal_message: "",
      })

      onInvitationSent?.()
    } catch (error) {
      console.error("Error sending invitation:", error)
      alert(error instanceof Error ? error.message : "Failed to send invitation")
    } finally {
      setIsSubmitting(false)
    }
  }

  const downloadQRCode = () => {
    const svg = document.getElementById("candidate-qr-code-svg")
    if (!svg) return

    const svgData = new XMLSerializer().serializeToString(svg)
    const canvas = document.createElement("canvas")
    const ctx = canvas.getContext("2d")
    const img = new Image()

    img.onload = () => {
      canvas.width = img.width
      canvas.height = img.height
      ctx?.drawImage(img, 0, 0)
      const pngFile = canvas.toDataURL("image/png")

      const downloadLink = document.createElement("a")
      downloadLink.download = `somviac-candidate-invite.png`
      downloadLink.href = pngFile
      downloadLink.click()
    }

    img.src = "data:image/svg+xml;base64," + btoa(svgData)
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          className="h-auto py-4 flex flex-col items-start gap-2 bg-transparent hover:bg-accent"
          variant="outline"
        >
          <div className="flex items-center gap-2 w-full">
            <Users className="h-5 w-5" />
            <span className="font-semibold">{t("ui.modals.candidateInvitation.trigger.title")}</span>
          </div>
          <p className="text-xs text-muted-foreground text-left">
            {t("ui.modals.candidateInvitation.trigger.description")}
          </p>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-[95vw] sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Gift className="w-5 h-5 text-teal-600" />
            {t("ui.modals.candidateInvitation.title")}
          </DialogTitle>
        </DialogHeader>

        {/* Motivational section for candidates */}
        <Card className="bg-gradient-to-br from-teal-50 to-blue-50 border-teal-200">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-teal-600" />
              {t("ui.modals.candidateInvitation.howItWorks.title")}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="flex items-start gap-2">
              <div className="w-6 h-6 rounded-full bg-teal-600 text-white flex items-center justify-center text-xs font-bold flex-shrink-0">
                1
              </div>
              <p dangerouslySetInnerHTML={{ __html: t("ui.modals.candidateInvitation.howItWorks.step1") }} />
            </div>
            <div className="flex items-start gap-2">
              <div className="w-6 h-6 rounded-full bg-teal-600 text-white flex items-center justify-center text-xs font-bold flex-shrink-0">
                2
              </div>
              <p dangerouslySetInnerHTML={{ __html: t("ui.modals.candidateInvitation.howItWorks.step2") }} />
            </div>
            <div className="flex items-start gap-2">
              <div className="w-6 h-6 rounded-full bg-teal-600 text-white flex items-center justify-center text-xs font-bold flex-shrink-0">
                3
              </div>
              <p dangerouslySetInnerHTML={{ __html: t("ui.modals.candidateInvitation.howItWorks.step3") }} />
            </div>
            <div className="mt-4 p-3 bg-white/80 rounded-lg border border-teal-300">
              <p className="text-center font-semibold text-teal-700">
                {t("ui.modals.candidateInvitation.howItWorks.bonus")}
              </p>
            </div>
          </CardContent>
        </Card>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* QR Code Section */}
          <Card className="bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200">
            <CardHeader>
              <CardTitle className="text-sm flex items-center gap-2">
                <QrCode className="w-4 h-4 text-purple-600" />
                {t("ui.modals.candidateInvitation.qrCode.title")}
              </CardTitle>
              <CardDescription className="text-xs">
                {t("ui.modals.candidateInvitation.qrCode.description")}
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center gap-4">
              <div className="bg-white p-2 sm:p-4 rounded-lg shadow-lg">
                <QRCodeSVG
                  id="candidate-qr-code-svg"
                  value={invitationUrl || `https://somviac.com/auth/register?type=candidate`}
                  size={160}
                  level="H"
                  includeMargin={true}
                  imageSettings={{
                    src: "/logo.svg",
                    height: 32,
                    width: 32,
                    excavate: true,
                  }}
                  className="w-full h-auto max-w-[160px] sm:max-w-[200px]"
                />
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={downloadQRCode}
                className="w-full bg-transparent"
              >
                <Download className="w-4 h-4 mr-2" />
                {t("ui.modals.candidateInvitation.qrCode.download")}
              </Button>
            </CardContent>
          </Card>

          {/* Email Input */}
          <div className="space-y-2">
            <Label htmlFor="email">{t("ui.modals.candidateInvitation.fields.email.label")}</Label>
            <Input
              id="email"
              type="email"
              placeholder={t("ui.modals.candidateInvitation.fields.email.placeholder")}
              value={formData.invited_email}
              onChange={(e) => setFormData((prev) => ({ ...prev, invited_email: e.target.value }))}
            />
            <p className="text-xs text-muted-foreground">{t("ui.modals.candidateInvitation.fields.email.hint")}</p>
          </div>

          {/* Personal Message */}
          {formData.invited_email && (
            <div className="space-y-2">
              <Label htmlFor="message">{t("ui.modals.candidateInvitation.fields.message.label")}</Label>
              <Textarea
                id="message"
                placeholder={t("ui.modals.candidateInvitation.fields.message.placeholder")}
                value={formData.personal_message}
                onChange={(e) => setFormData((prev) => ({ ...prev, personal_message: e.target.value }))}
                rows={3}
              />
            </div>
          )}

          {/* Submit Button */}
          <div className="flex flex-col sm:flex-row justify-end gap-3">
            <Button type="button" variant="outline" onClick={() => setIsOpen(false)} disabled={isSubmitting}>
              {t("ui.modals.candidateInvitation.buttons.cancel")}
            </Button>
            {formData.invited_email && (
              <Button type="submit" disabled={isSubmitting} className="bg-teal-600 hover:bg-teal-700">
                {isSubmitting
                  ? t("ui.modals.candidateInvitation.buttons.sending")
                  : t("ui.modals.candidateInvitation.buttons.send")}
              </Button>
            )}
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
