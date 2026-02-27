"use client"

import { useState, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { CheckCircle2 } from "lucide-react"
import { useI18n } from "@/lib/i18n/context"
import { staticTranslations } from "@/lib/i18n/translations"
import { en } from "@/lib/i18n/translations-en"
import { de } from "@/lib/i18n/translations-de"

const allTranslations = {
  sk: staticTranslations,
  en: en,
  de: de,
}

interface TestFlowModalsProps {
  testCode: string
  testName: string
  onClose: () => void
}

export function TestFlowModals({ testCode, testName, onClose }: TestFlowModalsProps) {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState<"info" | "proctoring" | "closed">("info")
  const [infoContent, setInfoContent] = useState<string>("")
  const [proctoringContent, setProctoringContent] = useState<string>("")
  const [loading, setLoading] = useState(true)

  const { language } = useI18n()
  const currentLang = (language && ["sk", "en", "de"].includes(language) ? language : "sk") as "sk" | "en" | "de"
  const translations = allTranslations[currentLang]
  const t = translations?.modals?.testFlow || {
    cancel: currentLang === "de" ? "Abbrechen" : currentLang === "en" ? "Cancel" : "Zrušiť",
    continue: currentLang === "de" ? "Fortfahren" : currentLang === "en" ? "Continue" : "Pokračovať",
    fairPlayTitle:
      currentLang === "de" ? "Fair-Play-Regeln" : currentLang === "en" ? "Fair-play rules" : "Fair-play pravidlá",
    agreeAndContinue:
      currentLang === "de"
        ? "Ich stimme zu und fahre fort"
        : currentLang === "en"
          ? "I agree and continue"
          : "Súhlasím a pokračujem",
    loading: currentLang === "de" ? "Laden..." : currentLang === "en" ? "Loading..." : "Načítavam...",
  }

  useEffect(() => {
    loadModalContent()
  }, [testCode, language])

  async function loadModalContent() {
    try {
      setLoading(true)
      const response = await fetch(`/api/candidate/tests/modals?testCode=${testCode}&lang=${currentLang}`)
      const data = await response.json()

      if (data.success) {
        setInfoContent(data.infoContent || "")
        setProctoringContent(data.proctoringContent || "")
      }
    } catch (error) {
      console.error("[v0] Error loading modal content:", error)
    } finally {
      setLoading(false)
    }
  }

  function handleInfoContinue() {
    setCurrentStep("proctoring")
  }

  function handleProctoringAccept() {
    setCurrentStep("closed")
    router.push(`/tests/${testCode}?skip_modals=true`)
    onClose()
  }

  function handleClose() {
    setCurrentStep("closed")
    onClose()
  }

  return (
    <>
      {/* INFO MODAL */}
      <Dialog open={currentStep === "info"} onOpenChange={handleClose}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-primary">{testName}</DialogTitle>
            <DialogDescription>
              <div className="text-base mt-4 leading-relaxed">
                {loading ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                  </div>
                ) : (
                  <span className="whitespace-pre-wrap text-foreground block">{infoContent}</span>
                )}
              </div>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button onClick={handleClose} variant="outline">
              {t.cancel}
            </Button>
            <Button onClick={handleInfoContinue} disabled={loading}>
              {t.continue}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* PROCTORING MODAL */}
      <Dialog open={currentStep === "proctoring"} onOpenChange={handleClose}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-primary flex items-center gap-2">
              <CheckCircle2 className="w-6 h-6" />
              {t.fairPlayTitle}
            </DialogTitle>
            <DialogDescription>
              <div className="text-base mt-4 leading-relaxed">
                {loading ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                  </div>
                ) : (
                  <span className="whitespace-pre-wrap text-foreground block">{proctoringContent}</span>
                )}
              </div>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button onClick={handleClose} variant="outline">
              {t.cancel}
            </Button>
            <Button onClick={handleProctoringAccept} disabled={loading} className="bg-primary">
              {t.agreeAndContinue}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
