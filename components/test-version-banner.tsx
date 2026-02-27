"use client"

import { AlertCircle } from "lucide-react"
import { useI18n } from "@/lib/i18n/context"
import { staticTranslations } from "@/lib/i18n/translations"

export function TestVersionBanner() {
  const { language } = useI18n()
  const currentLang = (language && language in staticTranslations ? language : "sk") as keyof typeof staticTranslations
  const t = staticTranslations[currentLang]

  return (
    <div className="w-full bg-yellow-50 dark:bg-yellow-950/30 border-b border-yellow-200 dark:border-yellow-800">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-center gap-2 text-sm">
          <AlertCircle className="h-4 w-4 text-yellow-600 dark:text-yellow-400 flex-shrink-0" />
          <p className="text-yellow-900 dark:text-yellow-100 font-medium text-center">
            {t.testVersionBanner?.message || "⚠️ Testovacia verzia - CV funkčné, testy vo fáze testovania"}
          </p>
        </div>
      </div>
    </div>
  )
}
