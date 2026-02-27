"use client"

import type React from "react"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { MessageCircle, Upload, X, FileText, ImageIcon, Loader2 } from "lucide-react"
import { useAuth } from "@/lib/auth/auth-context"
import { useI18n } from "@/lib/i18n/context"
import { getStaticTranslation } from "@/lib/i18n/translations"

interface SupportTicketModalProps {
  userType: "candidate" | "company" | "recruiter" | "admin"
}

export function SupportTicketModal({ userType }: SupportTicketModalProps) {
  const [open, setOpen] = useState(false)
  const [subject, setSubject] = useState("")
  const [message, setMessage] = useState("")
  const [category, setCategory] = useState("")
  const [priority, setPriority] = useState("normal")
  const [files, setFiles] = useState<File[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { user } = useAuth()
  const { language } = useI18n()

  const t = (key: string) => getStaticTranslation(`ui.support.${key}`, language) || key

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files)
      // Limit to 5 files max
      if (files.length + newFiles.length > 5) {
        alert(t("attachments.maxFiles"))
        return
      }
      // Limit file size to 10MB each
      const oversizedFiles = newFiles.filter((file) => file.size > 10 * 1024 * 1024)
      if (oversizedFiles.length > 0) {
        alert(t("attachments.maxSize"))
        return
      }
      setFiles([...files, ...newFiles])
    }
  }

  const removeFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!subject.trim() || !message.trim()) {
      alert(t("validation"))
      return
    }

    setIsSubmitting(true)

    try {
      // Upload files first if any
      const uploadedFiles: { file_name: string; file_url: string; file_type: string; file_size: number }[] = []

      for (const file of files) {
        const formData = new FormData()
        formData.append("file", file)

        const uploadResponse = await fetch("/api/support/upload", {
          method: "POST",
          body: formData,
        })

        if (uploadResponse.ok) {
          const uploadData = await uploadResponse.json()
          uploadedFiles.push({
            file_name: file.name,
            file_url: uploadData.url,
            file_type: file.type,
            file_size: file.size,
          })
        }
      }

      // Create support ticket
      const response = await fetch("/api/support/tickets", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          subject,
          message,
          category,
          priority,
          user_type: userType,
          attachments: uploadedFiles,
        }),
      })

      if (response.ok) {
        alert(t("success"))
        setOpen(false)
        // Reset form
        setSubject("")
        setMessage("")
        setCategory("")
        setPriority("normal")
        setFiles([])
      } else {
        throw new Error("Failed to create ticket")
      }
    } catch (error) {
      console.error("Error creating support ticket:", error)
      alert(t("error"))
    } finally {
      setIsSubmitting(false)
    }
  }

  const getFileIcon = (fileType: string) => {
    if (fileType.startsWith("image/")) {
      return <ImageIcon className="w-4 h-4" />
    }
    return <FileText className="w-4 h-4" />
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2 bg-transparent">
          <MessageCircle className="w-4 h-4" />
          {t("button")}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{t("title")}</DialogTitle>
          <DialogDescription>{t("description")}</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="category">{t("category.label")}</Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger id="category">
                <SelectValue placeholder={t("category.placeholder")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="technical">{t("category.technical")}</SelectItem>
                <SelectItem value="account">{t("category.account")}</SelectItem>
                <SelectItem value="payment">{t("category.payment")}</SelectItem>
                <SelectItem value="profile">{t("category.profile")}</SelectItem>
                <SelectItem value="search">{t("category.search")}</SelectItem>
                <SelectItem value="tests">{t("category.tests")}</SelectItem>
                <SelectItem value="commissions">{t("category.commissions")}</SelectItem>
                <SelectItem value="other">{t("category.other")}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="priority">{t("priority.label")}</Label>
            <Select value={priority} onValueChange={setPriority}>
              <SelectTrigger id="priority">
                <SelectValue placeholder={t("priority.placeholder")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">{t("priority.low")}</SelectItem>
                <SelectItem value="normal">{t("priority.normal")}</SelectItem>
                <SelectItem value="high">{t("priority.high")}</SelectItem>
                <SelectItem value="urgent">{t("priority.urgent")}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="subject">{t("subject.required")}</Label>
            <Input
              id="subject"
              placeholder={t("subject.placeholder")}
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="message">{t("message.required")}</Label>
            <Textarea
              id="message"
              placeholder={t("message.placeholder")}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={6}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="files">{t("attachments.label")}</Label>
            <div className="flex items-center gap-2">
              <Input
                id="files"
                type="file"
                multiple
                accept="image/*,.pdf,.doc,.docx,.txt"
                onChange={handleFileChange}
                className="hidden"
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => document.getElementById("files")?.click()}
                disabled={files.length >= 5}
              >
                <Upload className="w-4 h-4 mr-2" />
                {t("attachments.upload")}
              </Button>
              <span className="text-sm text-muted-foreground">
                {files.length}/5 {t("attachments.count")}
              </span>
            </div>

            {files.length > 0 && (
              <div className="space-y-2 mt-3">
                {files.map((file, index) => (
                  <div key={index} className="flex items-center justify-between p-2 border rounded-lg">
                    <div className="flex items-center gap-2">
                      {getFileIcon(file.type)}
                      <span className="text-sm">{file.name}</span>
                      <Badge variant="secondary" className="text-xs">
                        {(file.size / 1024).toFixed(1)} KB
                      </Badge>
                    </div>
                    <Button type="button" variant="ghost" size="sm" onClick={() => removeFile(index)}>
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)} disabled={isSubmitting}>
              {t("cancel")}
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  {t("submitting")}
                </>
              ) : (
                t("submit")
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
