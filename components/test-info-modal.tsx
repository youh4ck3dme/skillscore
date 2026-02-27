"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { CheckCircle2 } from "lucide-react"
import { useT } from "@/lib/i18n/hooks"

interface TestInfoModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  testName: string
  testCode: string
  explanation: {
    why_take: string
    what_it_checks: string[]
  } | null
}

export function TestInfoModal({ open, onOpenChange, testName, testCode, explanation }: TestInfoModalProps) {
  const t = useT()

  if (!explanation) {
    return null
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">{testName}</DialogTitle>
          <Badge variant="outline" className="w-fit mt-2">
            {testCode}
          </Badge>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          {/* Why Take Section */}
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-2">{t("ui.modals.testInfo.whyTake")}</h3>
            <p className="text-muted-foreground leading-relaxed">{explanation.why_take}</p>
          </div>

          {/* What It Checks Section */}
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-3">{t("ui.modals.testInfo.whatItChecks")}:</h3>
            <ul className="space-y-2">
              {explanation.what_it_checks.map((item, index) => (
                <li key={index} className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-teal-600 flex-shrink-0 mt-0.5" />
                  <span className="text-muted-foreground">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
