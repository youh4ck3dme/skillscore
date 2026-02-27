"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { AlertCircle, Clock, Maximize2 } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { cn } from "@/lib/utils"

interface TestContainerProps {
  testName: string
  totalQuestions: number
  currentQuestion: number
  timeLimit: number // in seconds
  onTimeUp: () => void
  onViolation: (type: string) => void
  children: React.ReactNode
}

export function TestContainer({
  testName,
  totalQuestions,
  currentQuestion,
  timeLimit,
  onTimeUp,
  onViolation,
  children,
}: TestContainerProps) {
  const [timeRemaining, setTimeRemaining] = useState(timeLimit)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [focusViolations, setFocusViolations] = useState(0)
  const [showWarning, setShowWarning] = useState(false)

  // Timer
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          onTimeUp()
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [onTimeUp])

  // Fullscreen enforcement
  useEffect(() => {
    const enterFullscreen = async () => {
      try {
        await document.documentElement.requestFullscreen()
        setIsFullscreen(true)
      } catch (err) {
        console.error("[v0] Fullscreen error:", err)
      }
    }

    enterFullscreen()

    const handleFullscreenChange = () => {
      if (!document.fullscreenElement) {
        setIsFullscreen(false)
        if (document.querySelector('[data-test-active="true"]')) {
          setFocusViolations((prev) => prev + 1)
          onViolation("fullscreen_exit")
          setShowWarning(true)
          setTimeout(() => setShowWarning(false), 3000)
        }
      } else {
        setIsFullscreen(true)
      }
    }

    document.addEventListener("fullscreenchange", handleFullscreenChange)
    return () => document.removeEventListener("fullscreenchange", handleFullscreenChange)
  }, [onViolation])

  // Focus guard
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        setFocusViolations((prev) => prev + 1)
        onViolation("focus_loss")
        setShowWarning(true)
        setTimeout(() => setShowWarning(false), 3000)
      }
    }

    document.addEventListener("visibilitychange", handleVisibilityChange)
    return () => document.removeEventListener("visibilitychange", handleVisibilityChange)
  }, [onViolation])

  // Copy/paste block
  useEffect(() => {
    const preventCopy = (e: ClipboardEvent) => {
      e.preventDefault()
      onViolation("copy_attempt")
    }

    const preventContextMenu = (e: MouseEvent) => {
      e.preventDefault()
    }

    document.addEventListener("copy", preventCopy)
    document.addEventListener("cut", preventCopy)
    document.addEventListener("contextmenu", preventContextMenu)

    return () => {
      document.removeEventListener("copy", preventCopy)
      document.removeEventListener("cut", preventCopy)
      document.removeEventListener("contextmenu", preventContextMenu)
    }
  }, [onViolation])

  // Auto-fail after 2 violations
  useEffect(() => {
    if (focusViolations >= 2) {
      onTimeUp() // Trigger test end
    }
  }, [focusViolations, onTimeUp])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  const progress = ((currentQuestion + 1) / totalQuestions) * 100

  return (
    <div className="min-h-screen bg-background p-4" data-test-active="true">
      {showWarning && (
        <Alert
          variant="destructive"
          className="fixed top-4 left-1/2 -translate-x-1/2 w-96 z-50 animate-in slide-in-from-top"
        >
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Varovanie! Opustili ste test. {2 - focusViolations} porušení zostáva pred automatickým ukončením.
          </AlertDescription>
        </Alert>
      )}

      <div className="max-w-4xl mx-auto space-y-4">
        {/* Header */}
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold">{testName}</h1>
              <p className="text-sm text-muted-foreground">
                Otázka {currentQuestion} z {totalQuestions}
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Clock className={cn("w-5 h-5", timeRemaining < 60 && "text-red-500")} />
                <span className={cn("text-lg font-mono", timeRemaining < 60 && "text-red-500")}>
                  {formatTime(timeRemaining)}
                </span>
              </div>
              {!isFullscreen && (
                <Button size="sm" variant="outline" onClick={() => document.documentElement.requestFullscreen()}>
                  <Maximize2 className="w-4 h-4 mr-2" />
                  Fullscreen
                </Button>
              )}
            </div>
          </div>
          <Progress value={progress} className="mt-4" />
        </Card>

        {/* Question content */}
        {children}
      </div>
    </div>
  )
}
