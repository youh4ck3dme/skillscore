"use client"

import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { CheckCircle2 } from "lucide-react"
import { useI18n } from "@/lib/i18n/context"
import { staticTranslations } from "@/lib/i18n/translations"

interface CVSuccessModalProps {
  open: boolean
  onClose: () => void
}

export function CVSuccessModal({ open, onClose }: CVSuccessModalProps) {
  const { language } = useI18n()
  const currentLang = (language && staticTranslations[language] ? language : "sk") as keyof typeof staticTranslations
  const t = staticTranslations[currentLang]?.modals?.cvSuccessModal || staticTranslations.sk.modals.cvSuccessModal

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <div className="flex flex-col items-center text-center space-y-6 py-6">
          {/* SI ✓IAC heading with green checkmark */}
          <div className="flex items-center justify-center">
            <h2 className="text-4xl font-bold text-foreground">
              {t.headingBefore} <CheckCircle2 className="inline-block h-10 w-10 text-green-600 -mt-1" strokeWidth={3} />
              {t.headingAfter}
            </h2>
          </div>

          {/* Success message */}
          <div className="space-y-4">
            <p className="text-base text-foreground leading-relaxed">{t.message}</p>

            {/* Tests encouragement */}
            <p className="text-sm text-muted-foreground leading-relaxed">{t.testsMessage}</p>
          </div>

          {/* Close button */}
          <Button onClick={onClose} className="w-full" size="lg">
            {t.closeButton}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
