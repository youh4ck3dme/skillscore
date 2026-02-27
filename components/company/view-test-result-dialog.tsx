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
import { Loader2, Coins } from "lucide-react"

interface ViewTestResultDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  candidateId: string
  testId: string
  testName: string
  onSuccess?: () => void
}

const TEST_PRICING: Record<string, number> = {
  // Language tests - 12 coins
  LANGUAGE: 12,

  // Job skills - 10 coins
  JOB_SKILLS: 10,

  // IT tests - 14 coins
  IT_USER: 14,

  // Cognitive tests
  LOGICAL_NUMERICAL: 14,
  VERBAL_SKILLS: 14,
  DATA_ENTRY: 8,

  // Basic tests
  DIGITAL_SKILLS: 8,
  SJT_BASIC: 10,

  // Advanced tests
  SJT_COGNITIVE: 16,
  PLANNING: 12,
  SAFETY_BOZP: 8,
  WORK_SAMPLE: 25,
  ATTENTION_DETAIL: 10,

  // Retention tests - 15 coins
  RET: 15,
}

function getTestPrice(testId: string): number {
  if (testId.startsWith("LANGUAGE_")) return TEST_PRICING.LANGUAGE
  if (testId.startsWith("JOB_SKILLS_")) return TEST_PRICING.JOB_SKILLS
  if (testId.startsWith("IT_USER")) return TEST_PRICING.IT_USER
  if (testId.startsWith("LOGICAL_NUMERICAL")) return TEST_PRICING.LOGICAL_NUMERICAL
  if (testId.startsWith("VERBAL_SKILLS")) return TEST_PRICING.VERBAL_SKILLS
  if (testId.startsWith("DATA_ENTRY")) return TEST_PRICING.DATA_ENTRY
  if (testId.startsWith("RET_")) return TEST_PRICING.RET
  if (testId === "DIGITAL_SKILLS") return TEST_PRICING.DIGITAL_SKILLS
  if (testId === "SJT_BASIC") return TEST_PRICING.SJT_BASIC
  if (testId === "SJT_COGNITIVE") return TEST_PRICING.SJT_COGNITIVE
  if (testId === "PLANNING") return TEST_PRICING.PLANNING
  if (testId === "SAFETY_BOZP") return TEST_PRICING.SAFETY_BOZP
  if (testId === "WORK_SAMPLE") return TEST_PRICING.WORK_SAMPLE
  if (testId === "ATTENTION_DETAIL") return TEST_PRICING.ATTENTION_DETAIL

  return 10 // Default
}

export function ViewTestResultDialog({
  open,
  onOpenChange,
  candidateId,
  testId,
  testName,
  onSuccess,
}: ViewTestResultDialogProps) {
  const [loading, setLoading] = useState(false)
  const price = getTestPrice(testId)

  const handleViewResult = async () => {
    try {
      setLoading(true)

      const response = await fetch("/api/company/test-results/view", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          candidate_id: candidateId,
          test_id: testId,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Chyba pri zobrazení výsledku")
      }

      toast.success(`Výsledok testu "${testName}" bol odblokovaný`)
      onSuccess?.()
      onOpenChange(false)

      // TODO: Open result modal with data.result
    } catch (error) {
      console.error("[v0] Error viewing test result:", error)
      toast.error(error instanceof Error ? error.message : "Chyba pri zobrazení výsledku")
    } finally {
      setLoading(false)
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Zobraziť výsledok testu</AlertDialogTitle>
          <AlertDialogDescription>
            Chcete zobraziť výsledok testu <span className="font-semibold text-foreground">{testName}</span>?
            <div className="mt-4 p-3 bg-muted rounded-lg flex items-center gap-2">
              <Coins className="h-5 w-5 text-amber-500" />
              <span className="font-semibold">Cena: {price} coins</span>
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={loading}>Zrušiť</AlertDialogCancel>
          <AlertDialogAction onClick={handleViewResult} disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Načítavam...
              </>
            ) : (
              <>
                <Coins className="mr-2 h-4 w-4" />
                Zobraziť za {price} coins
              </>
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
