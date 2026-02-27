"use client"

import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Settings, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { SettingsForm } from "@/components/settings-form"
import { useI18n } from "@/lib/i18n/context"
import { staticTranslations } from "@/lib/i18n/translations"

interface SettingsPageClientProps {
  user: {
    id: string
    email: string
    firstName: string
    lastName: string
    hasPassword: boolean
  }
}

export function SettingsPageClient({ user }: SettingsPageClientProps) {
  const { language } = useI18n()
  const currentLang = (language && staticTranslations[language] ? language : "sk") as keyof typeof staticTranslations
  const t = staticTranslations[currentLang].candidateQuickNav.settings.page

  return (
    <div className="container max-w-4xl py-8 px-4">
      <div className="mb-6">
        <Link href="/dashboard/candidate">
          <Button variant="ghost" size="sm" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            {t.backToDashboard}
          </Button>
        </Link>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <div className="flex items-center gap-4">
            <div className="p-3 bg-primary/10 rounded-lg">
              <Settings className="w-6 h-6 text-primary" />
            </div>
            <div>
              <CardTitle>{t.title}</CardTitle>
              <CardDescription>{t.subtitle}</CardDescription>
            </div>
          </div>
        </CardHeader>
      </Card>

      <SettingsForm user={user} />
    </div>
  )
}
