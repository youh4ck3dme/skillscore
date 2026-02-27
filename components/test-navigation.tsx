"use client"

import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, Send } from "lucide-react"

interface TestNavigationProps {
  currentQuestion: number
  totalQuestions: number
  canGoBack: boolean
  canGoNext: boolean
  isLastQuestion: boolean
  onBack: () => void
  onNext: () => void
  onSubmit: () => void
  hasAnswer: boolean
}

export function TestNavigation({
  currentQuestion,
  totalQuestions,
  canGoBack,
  canGoNext,
  isLastQuestion,
  onBack,
  onNext,
  onSubmit,
  hasAnswer,
}: TestNavigationProps) {
  return (
    <div className="flex items-center justify-between p-4 bg-card border-t">
      <Button variant="outline" onClick={onBack} disabled={!canGoBack}>
        <ChevronLeft className="w-4 h-4 mr-2" />
        Späť
      </Button>

      <div className="text-sm text-muted-foreground">
        {currentQuestion + 1} / {totalQuestions}
      </div>

      {isLastQuestion ? (
        <Button onClick={onSubmit} disabled={!hasAnswer} className="bg-gradient-to-r from-green-500 to-emerald-500">
          <Send className="w-4 h-4 mr-2" />
          Odoslať test
        </Button>
      ) : (
        <Button onClick={onNext} disabled={!canGoNext || !hasAnswer}>
          Ďalej
          <ChevronRight className="w-4 h-4 ml-2" />
        </Button>
      )}
    </div>
  )
}
