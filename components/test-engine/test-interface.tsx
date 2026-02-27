"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { useI18n } from "@/lib/i18n/context"
import { staticTranslations } from "@/lib/i18n/translations"

export interface TestQuestion {
  id: string
  question: string
  options: string[]
  correctAnswer: number
  questionType?: string // 'single_choice', 'mcq', etc.
}

export interface TestInterfaceProps {
  testId: string
  questions: TestQuestion[]
  onComplete: (answers: any[]) => void
  isRetentionTest?: boolean // Flag for retention test styling
}

export function TestInterface({ testId, questions, onComplete, isRetentionTest = false }: TestInterfaceProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<Record<number, number>>({})
  const [startTime] = useState(Date.now())

  const { language } = useI18n()
  const currentLang = (
    language && staticTranslations[language as keyof typeof staticTranslations] ? language : "sk"
  ) as keyof typeof staticTranslations
  const t = staticTranslations[currentLang]?.testInterface || {
    questionOf: "Otázka",
    of: "z",
    back: "Späť",
    nextQuestion: "Ďalšia otázka",
    finishTest: "Dokončiť test",
    answered: "zodpovedaných",
    question: "Otázka",
  }

  const handleAnswer = (answerIndex: number) => {
    setAnswers((prev) => ({ ...prev, [currentQuestion]: answerIndex }))
  }

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion((prev) => prev + 1)
    } else {
      handleComplete()
    }
  }

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion((prev) => prev - 1)
    }
  }

  const handleComplete = () => {
    const timeSpent = Math.floor((Date.now() - startTime) / 1000)
    const formattedAnswers = questions.map((q, idx) => ({
      questionId: q.id,
      answer: answers[idx] ?? -1,
      correct: answers[idx] === q.correctAnswer,
      timeSpent,
    }))

    onComplete(formattedAnswers)
  }

  const question = questions[currentQuestion]
  const progress = ((currentQuestion + 1) / questions.length) * 100
  const isAnswered = answers[currentQuestion] !== undefined

  // Namiesto hľadania slovenských slov ako "často", "nikdy" sa spoliehame na isRetentionTest flag
  // alebo na štruktúru otázky (4 možnosti s dlhším textom)
  const isLikertStyle =
    isRetentionTest || (question.options.length === 4 && question.options.every((opt) => opt.length > 10)) // Likert odpovede sú typicky dlhšie ako 10 znakov

  return (
    <div className="max-w-3xl mx-auto p-6">
      {/* Progress bar */}
      <div className="mb-6">
        <div className="flex justify-between text-sm text-muted-foreground mb-2">
          <span>
            {t.questionOf} {currentQuestion + 1} {t.of} {questions.length}
          </span>
          <span>{Math.round(progress)}%</span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      <Card className="p-8">
        {/* Question */}
        <h2 className="text-xl md:text-2xl font-semibold mb-8 leading-relaxed">{question.question}</h2>

        {/* Options */}
        <div className={isLikertStyle ? "space-y-3" : "space-y-3"}>
          {question.options.map((option, idx) => (
            <button
              key={idx}
              onClick={() => handleAnswer(idx)}
              className={`w-full text-left p-4 rounded-lg border-2 transition-all duration-200 ${
                answers[currentQuestion] === idx
                  ? "border-primary bg-primary/10 shadow-sm"
                  : "border-border hover:border-primary/50 hover:bg-muted/50"
              } ${isLikertStyle ? "min-h-[60px]" : ""}`}
            >
              {isLikertStyle ? (
                // Likert style - just text, no letter prefix
                <span className="text-base">{option}</span>
              ) : (
                // Standard MCQ style with letter prefix
                <>
                  <span className="font-medium mr-3 text-primary">{String.fromCharCode(65 + idx)}.</span>
                  <span>{option}</span>
                </>
              )}
            </button>
          ))}
        </div>

        {/* Navigation */}
        <div className="mt-8 flex justify-between items-center">
          <Button variant="outline" onClick={handlePrevious} disabled={currentQuestion === 0}>
            {t.back}
          </Button>

          <div className="text-sm text-muted-foreground">
            {Object.keys(answers).length} / {questions.length} {t.answered}
          </div>

          <Button onClick={handleNext} disabled={!isAnswered}>
            {currentQuestion === questions.length - 1 ? t.finishTest : t.nextQuestion}
          </Button>
        </div>
      </Card>

      {/* Quick navigation dots */}
      <div className="mt-6 flex justify-center gap-1 flex-wrap max-w-xl mx-auto">
        {questions.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentQuestion(idx)}
            className={`w-3 h-3 rounded-full transition-all ${
              idx === currentQuestion
                ? "bg-primary scale-125"
                : answers[idx] !== undefined
                  ? "bg-primary/50"
                  : "bg-muted-foreground/30"
            }`}
            title={`${t.question} ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  )
}
