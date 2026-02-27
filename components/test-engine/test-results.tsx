"use client"

import { useI18n } from "@/lib/i18n/context"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export interface TestResultsProps {
  testId: string
  score: number
  percentile: number
  interpretation: string
  onClose: () => void
}

export function TestResults({ testId, score, percentile, interpretation, onClose }: TestResultsProps) {
  const { t } = useI18n()

  return (
    <div className="max-w-2xl mx-auto p-6">
      <Card className="p-8 text-center">
        <div className="mb-6">
          <div className="text-6xl font-bold text-primary mb-2">{score}%</div>
          <p className="text-muted-foreground">{t("testEngineResults.yourScore")}</p>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="p-4 bg-secondary rounded-lg">
            <div className="text-2xl font-semibold">{percentile}.</div>
            <div className="text-sm text-muted-foreground">{t("testEngineResults.percentile")}</div>
          </div>
          <div className="p-4 bg-secondary rounded-lg">
            <div className="text-2xl font-semibold">{interpretation}</div>
            <div className="text-sm text-muted-foreground">{t("testEngineResults.rating")}</div>
          </div>
        </div>

        <p className="text-muted-foreground mb-6">{t("testEngineResults.resultsSaved")}</p>

        <Button onClick={onClose} className="w-full">
          {t("testEngineResults.continue")}
        </Button>
      </Card>
    </div>
  )
}
