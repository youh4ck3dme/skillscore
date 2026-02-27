"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Save, Trash2, AlertTriangle } from "lucide-react"
import { createClient } from "@/lib/supabase/client"

interface CompanySettingsProps {
  companyId: string
  email: string
  onLogout: () => void
}

export function CompanySettings({ companyId, email, onLogout }: CompanySettingsProps) {
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [saving, setSaving] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [deleteConfirm, setDeleteConfirm] = useState("")
  const supabase = createClient()

  const handleChangePassword = async () => {
    if (newPassword !== confirmPassword) {
      alert("Heslá sa nezhodujú")
      return
    }
    if (newPassword.length < 6) {
      alert("Heslo musí mať aspoň 6 znakov")
      return
    }

    setSaving(true)
    try {
      const { error } = await supabase.auth.updateUser({ password: newPassword })
      if (error) throw error
      alert("Heslo bolo úspešne zmenené")
      setCurrentPassword("")
      setNewPassword("")
      setConfirmPassword("")
    } catch (error: any) {
      alert(error.message || "Chyba pri zmene hesla")
    } finally {
      setSaving(false)
    }
  }

  const handleDeleteAccount = async () => {
    if (deleteConfirm !== "VYMAZAŤ") {
      alert("Pre potvrdenie napíšte VYMAZAŤ")
      return
    }

    try {
      await supabase.from("company_profiles").delete().eq("id", companyId)
      await supabase.auth.signOut()
      onLogout()
    } catch (error: any) {
      alert(error.message || "Chyba pri mazaní účtu")
    }
  }

  return (
    <>
      <div className="space-y-6">
        {/* Email info */}
        <div>
          <Label>Prihlasovací email</Label>
          <Input value={email} disabled className="mt-1 bg-muted" />
        </div>

        {/* Change password */}
        <div className="space-y-4 p-4 border rounded-lg">
          <h3 className="font-semibold">Zmena hesla</h3>
          <div className="space-y-3">
            <div>
              <Label>Aktuálne heslo</Label>
              <Input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="mt-1"
              />
            </div>
            <div>
              <Label>Nové heslo</Label>
              <Input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="mt-1"
              />
            </div>
            <div>
              <Label>Potvrdiť nové heslo</Label>
              <Input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="mt-1"
              />
            </div>
            <Button onClick={handleChangePassword} disabled={saving || !newPassword}>
              <Save className="h-4 w-4 mr-2" />
              {saving ? "Ukladám..." : "Zmeniť heslo"}
            </Button>
          </div>
        </div>

        {/* Delete account */}
        <div className="p-4 border border-destructive/30 rounded-lg bg-destructive/5">
          <h3 className="font-semibold text-destructive flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            Zrušenie účtu
          </h3>
          <p className="text-sm text-muted-foreground mt-2">Táto akcia je nezvratná. Všetky vaše dáta budú vymazané.</p>
          <Button variant="destructive" className="mt-4" onClick={() => setShowDeleteModal(true)}>
            <Trash2 className="h-4 w-4 mr-2" />
            Zrušiť účet
          </Button>
        </div>
      </div>

      {/* Delete confirmation modal */}
      <Dialog open={showDeleteModal} onOpenChange={setShowDeleteModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-destructive">Zrušiť účet</DialogTitle>
            <DialogDescription>Táto akcia je nezvratná. Pre potvrdenie napíšte VYMAZAŤ.</DialogDescription>
          </DialogHeader>
          <Input
            placeholder="Napíšte VYMAZAŤ"
            value={deleteConfirm}
            onChange={(e) => setDeleteConfirm(e.target.value)}
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteModal(false)}>
              Zrušiť
            </Button>
            <Button variant="destructive" onClick={handleDeleteAccount}>
              Vymazať účet
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
