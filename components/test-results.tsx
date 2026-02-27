"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Award, Home } from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { useRouter } from "next/navigation"
import { useT } from "@/lib/i18n/hooks"

interface TestResultsProps {
  testName: string
  band: string
  resultText: string
  scorePercent: number
  correctAnswers: number
  totalQuestions: number
  timeSpent: number
}

export function TestResults({
  testName,
  band,
  resultText,
  scorePercent,
  correctAnswers,
  totalQuestions,
  timeSpent,
}: TestResultsProps) {
  const router = useRouter()
  const t = useT()

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  return (
    <div className="min-h-screen bg-background p-4 flex items-center justify-center">
      <Card className="max-w-2xl w-full p-8 space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="flex justify-center mb-4">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center">
              <Award className="w-10 h-10 text-white" />
            </div>
          </div>
          <h1 className="text-2xl font-bold">{t.testResults?.title || "Test dokončený!"}</h1>
          <p className="text-muted-foreground">{testName}</p>
        </div>

        {/* Result band */}
        <div className="text-center p-6 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 rounded-lg border border-green-200 dark:border-green-800">
          <div className="text-3xl font-bold text-green-600 dark:text-green-400 mb-2">{band}</div>
          <p className="text-sm text-muted-foreground leading-relaxed">{resultText}</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4">
          <Card className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">
              {correctAnswers}/{totalQuestions}
            </div>
            <p className="text-sm text-muted-foreground">{t.testResults?.correctAnswers || "Správne odpovede"}</p>
          </Card>
          <Card className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">{formatTime(timeSpent)}</div>
            <p className="text-sm text-muted-foreground">{t.testResults?.time || "Čas"}</p>
          </Card>
        </div>

        {/* Progress */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>{t.testResults?.successRate || "Úspešnosť"}</span>
            <span className="font-semibold">{scorePercent.toFixed(1)}%</span>
          </div>
          <Progress value={scorePercent} className="h-3" />
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <Button
            variant="outline"
            className="flex-1 bg-transparent"
            onClick={() => router.push("/dashboard/candidate")}
          >
            <Home className="w-4 h-4 mr-2" />
            {t.candidateQuickNav?.page?.backToDashboard || "Späť na môj profil"}
          </Button>
        </div>
      </Card>
    </div>
  )
}
