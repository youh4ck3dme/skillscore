"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle2, AlertCircle } from "lucide-react"
import { useI18n } from "@/lib/i18n/context"
import { staticTranslations } from "@/lib/i18n/translations"

interface ProctoringModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onAccept: () => void
  testName: string
}

export function ProctoringModal({ open, onOpenChange, onAccept, testName }: ProctoringModalProps) {
  const { language } = useI18n()
  const currentLang = (
    language && staticTranslations[language as keyof typeof staticTranslations] ? language : "sk"
  ) as keyof typeof staticTranslations
  const t = staticTranslations[currentLang]?.proctoring || {
    title: "Pravidlá testovania",
    alertText: "Pre čo najrelevantnejší výsledok Vás prosíme dodržať nasledujúce zásady.",
    quietEnvironment: "Pokojné prostredie:",
    quietEnvironmentDesc: "Nájdite si tichý priestor bez rušenia, kde sa môžete plne sústrediť na test.",
    stableConnection: "Stabilné pripojenie:",
    stableConnectionDesc:
      "Uistite sa, že máte stabilné internetové pripojenie, aby ste mohli test dokončiť bez prerušenia.",
    independentWork: "Samostatné riešenie:",
    independentWorkDesc: "Test vyplňujte sami, bez pomoci iných osôb alebo vyhľadávania odpovedí na internete.",
    naturalStyle: "Prirodzený štyl:",
    naturalStyleDesc: "Cieľom nie je dosiahnuť dokonalosť, ale zachytiť Váš prirodzený štyl fungovania a myslenia.",
    honesty: "Úprimnosť:",
    honestyDesc: "Odpovedajte úprimne - výsledky slúžia ako spätná väzba pre Vás aj firmu, nie ako rozsudok.",
    footerText:
      "Dodržiavaním týchto zásad pomáhate získať relevantné výsledky, ktoré prospejú Vám aj zamestnávateľovi pri výbere vhodnej pozície a rozvoji Vašich zručností.",
    cancel: "Zrušiť",
    agreeStart: "Súhlasím, začať test",
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">{t.title}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{t.alertText}</AlertDescription>
          </Alert>

          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-teal-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-muted-foreground">
                <strong>{t.quietEnvironment}</strong> {t.quietEnvironmentDesc}
              </p>
            </div>

            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-teal-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-muted-foreground">
                <strong>{t.stableConnection}</strong> {t.stableConnectionDesc}
              </p>
            </div>

            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-teal-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-muted-foreground">
                <strong>{t.independentWork}</strong> {t.independentWorkDesc}
              </p>
            </div>

            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-teal-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-muted-foreground">
                <strong>{t.naturalStyle}</strong> {t.naturalStyleDesc}
              </p>
            </div>

            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-teal-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-muted-foreground">
                <strong>{t.honesty}</strong> {t.honestyDesc}
              </p>
            </div>
          </div>

          <Alert className="bg-blue-50 border-blue-200 dark:bg-blue-950/20 dark:border-blue-900">
            <AlertDescription className="text-sm">{t.footerText}</AlertDescription>
          </Alert>
        </div>

        <DialogFooter className="mt-6">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            {t.cancel}
          </Button>
          <Button onClick={onAccept}>{t.agreeStart}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
