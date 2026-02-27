"use client"

import { Card } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"

interface TestQuestionProps {
  question: {
    id: string
    stem: string
    asset_ref?: string
    options: Array<{ key: string; text: string }>
    type: "MCQ" | "IMAGE_MCQ"
    allow_multiple?: boolean
  }
  selectedAnswers: string[]
  onAnswerChange: (answers: string[]) => void
}

export function TestQuestion({ question, selectedAnswers, onAnswerChange }: TestQuestionProps) {
  const handleSingleSelect = (value: string) => {
    onAnswerChange([value])
  }

  const handleMultiSelect = (key: string, checked: boolean) => {
    if (checked) {
      onAnswerChange([...selectedAnswers, key])
    } else {
      onAnswerChange(selectedAnswers.filter((a) => a !== key))
    }
  }

  return (
    <Card className="p-6 space-y-6">
      {/* Question text */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold leading-relaxed">{question.stem}</h2>

        {/* Image if present */}
        {question.asset_ref && (
          <div className="relative w-full max-w-2xl mx-auto rounded-lg overflow-hidden border">
            <img
              src={question.asset_ref || "/placeholder.svg"}
              alt="Question image"
              className="w-full h-auto"
              style={{ maxHeight: "400px", objectFit: "contain" }}
            />
          </div>
        )}
      </div>

      {/* Answer options */}
      <div className="space-y-3">
        {question.allow_multiple ? (
          // Multiple choice
          <div className="space-y-3">
            {question.options.map((option) => (
              <div
                key={option.key}
                className="flex items-start space-x-3 p-3 rounded-lg border hover:bg-accent transition-colors"
              >
                <Checkbox
                  id={`option-${option.key}`}
                  checked={selectedAnswers.includes(option.key)}
                  onCheckedChange={(checked) => handleMultiSelect(option.key, checked as boolean)}
                />
                <Label htmlFor={`option-${option.key}`} className="flex-1 cursor-pointer text-base leading-relaxed">
                  <span className="font-semibold mr-2">{option.key}.</span>
                  {option.text}
                </Label>
              </div>
            ))}
          </div>
        ) : (
          // Single choice
          <RadioGroup value={selectedAnswers[0] || ""} onValueChange={handleSingleSelect}>
            <div className="space-y-3">
              {question.options.map((option) => (
                <div
                  key={option.key}
                  className={cn(
                    "flex items-start space-x-3 p-3 rounded-lg border hover:bg-accent transition-colors cursor-pointer",
                    selectedAnswers[0] === option.key && "bg-accent border-primary",
                  )}
                >
                  <RadioGroupItem value={option.key} id={`option-${option.key}`} />
                  <Label htmlFor={`option-${option.key}`} className="flex-1 cursor-pointer text-base leading-relaxed">
                    <span className="font-semibold mr-2">{option.key}.</span>
                    {option.text}
                  </Label>
                </div>
              ))}
            </div>
          </RadioGroup>
        )}
      </div>
    </Card>
  )
}
