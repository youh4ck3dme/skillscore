"use client"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { useState } from "react"
import { toast } from "sonner"
import { Loader2 } from "lucide-react"

interface SendTestDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  candidateId: string
  testId: string
  testName: string
  onSuccess?: () => void
}

export function SendTestDialog({ open, onOpenChange, candidateId, testId, testName, onSuccess }: SendTestDialogProps) {
  const [sending, setSending] = useState(false)

  const handleSendTest = async () => {
    try {
      setSending(true)

      const response = await fetch("/api/company/test-assignments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          candidate_id: candidateId,
          test_id: testId,
          test_name: testName,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Chyba pri posielaní testu")
      }

      toast.success(`Test "${testName}" bol odoslaný kandidátovi`)
      onSuccess?.()
      onOpenChange(false)
    } catch (error) {
      console.error("[v0] Error sending test:", error)
      toast.error(error instanceof Error ? error.message : "Chyba pri posielaní testu")
    } finally {
      setSending(false)
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Poslať test kandidátovi?</AlertDialogTitle>
          <AlertDialogDescription>
            Chcete poslať test <span className="font-semibold text-foreground">{testName}</span> tomuto kandidátovi?
            Test bude odoslaný zadarmo, ale zobrazenie výsledkov bude spoplatnené.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={sending}>Nie</AlertDialogCancel>
          <AlertDialogAction onClick={handleSendTest} disabled={sending}>
            {sending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Posielam...
              </>
            ) : (
              "Áno, poslať"
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
