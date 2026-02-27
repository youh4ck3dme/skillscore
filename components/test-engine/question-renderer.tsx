"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import type { TestQuestion } from "@/lib/tests/types"
import Image from "next/image"
import { GripVertical } from "lucide-react"

interface QuestionRendererProps {
  question: TestQuestion
  questionNumber: number
  totalQuestions: number
  onAnswer: (answer: {
    selected_option?: number
    selected_order?: number[]
    selected_root_cause?: string
    answer_text?: string
  }) => void
  language?: "sk" | "en"
}

export function QuestionRenderer({
  question,
  questionNumber,
  totalQuestions,
  onAnswer,
  language = "sk",
}: QuestionRendererProps) {
  const [selectedOption, setSelectedOption] = useState<number | null>(null)
  const [selectedOrder, setSelectedOrder] = useState<number[]>([])
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null)
  const [orderedItems, setOrderedItems] = useState<string[]>([])

  const stem = language === "sk" ? question.stem_sk : question.stem_en || question.stem_sk
  const options = language === "sk" ? question.options_sk : question.options_en || question.options_sk

  useEffect(() => {
    if (question.question_type === "ORDER" && options) {
      setOrderedItems(options)
      setSelectedOrder(options.map((_, i) => i))
    }
  }, [question.question_type, options])

  const handleSubmit = () => {
    if (question.question_type === "MCQ" || question.question_type === "IMAGE_MCQ") {
      if (selectedOption !== null) {
        onAnswer({ selected_option: selectedOption })
      }
    } else if (question.question_type === "ORDER") {
      if (selectedOrder.length === options?.length) {
        onAnswer({ selected_order: selectedOrder })
      }
    }
  }

  const handleDragStart = (index: number) => {
    setDraggedIndex(index)
  }

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault()
    if (draggedIndex === null || draggedIndex === index) return

    const newItems = [...orderedItems]
    const newOrder = [...selectedOrder]

    const draggedItem = newItems[draggedIndex]
    const draggedOrderItem = newOrder[draggedIndex]

    newItems.splice(draggedIndex, 1)
    newItems.splice(index, 0, draggedItem)

    newOrder.splice(draggedIndex, 1)
    newOrder.splice(index, 0, draggedOrderItem)

    setOrderedItems(newItems)
    setSelectedOrder(newOrder)
    setDraggedIndex(index)
  }

  const handleDragEnd = () => {
    setDraggedIndex(null)
  }

  const isAnswerReady = () => {
    if (question.question_type === "MCQ" || question.question_type === "IMAGE_MCQ") {
      return selectedOption !== null
    } else if (question.question_type === "ORDER") {
      return selectedOrder.length === options?.length
    }
    return false
  }

  return (
    <div className="space-y-6">
      {/* Progress */}
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <span>
          Otázka {questionNumber} z {totalQuestions}
        </span>
        <span>{question.topic && `Téma: ${question.topic}`}</span>
      </div>

      {/* Question */}
      <Card className="p-6">
        <div className="space-y-4">
          {/* Question stem */}
          <div className="text-lg font-medium text-foreground">{stem}</div>

          {/* Image if present */}
          {question.image_filename && (
            <div className="relative w-full h-64 bg-muted rounded-lg overflow-hidden">
              <Image
                src={`/test-images/${question.image_filename}`}
                alt="Question image"
                fill
                className="object-contain"
              />
            </div>
          )}

          {/* MCQ Options */}
          {(question.question_type === "MCQ" || question.question_type === "IMAGE_MCQ") && options && (
            <RadioGroup
              value={selectedOption?.toString()}
              onValueChange={(value) => setSelectedOption(Number.parseInt(value))}
            >
              <div className="space-y-3">
                {options.map((option, index) => (
                  <div
                    key={index}
                    className="flex items-center space-x-3 p-3 rounded-lg border border-border hover:bg-accent transition-colors"
                  >
                    <RadioGroupItem value={index.toString()} id={`option-${index}`} />
                    <Label htmlFor={`option-${index}`} className="flex-1 cursor-pointer">
                      {option}
                    </Label>
                  </div>
                ))}
              </div>
            </RadioGroup>
          )}

          {question.question_type === "ORDER" && orderedItems.length > 0 && (
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground mb-4">
                {language === "sk"
                  ? "Zoraďte možnosti v správnom poradí (ťahajte a pusťte)"
                  : "Arrange options in the correct order (drag and drop)"}
              </p>
              {orderedItems.map((option, index) => (
                <div
                  key={index}
                  draggable
                  onDragStart={() => handleDragStart(index)}
                  onDragOver={(e) => handleDragOver(e, index)}
                  onDragEnd={handleDragEnd}
                  className={`flex items-center gap-3 p-3 border border-border rounded-lg cursor-move transition-all ${
                    draggedIndex === index ? "opacity-50 scale-95" : "hover:bg-accent"
                  }`}
                >
                  <GripVertical className="w-5 h-5 text-muted-foreground" />
                  <span className="flex-1">{option}</span>
                  <span className="text-sm font-medium text-muted-foreground">#{index + 1}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </Card>

      {/* Submit button */}
      <div className="flex justify-end">
        <Button onClick={handleSubmit} disabled={!isAnswerReady()} size="lg">
          Ďalej
        </Button>
      </div>
    </div>
  )
}
