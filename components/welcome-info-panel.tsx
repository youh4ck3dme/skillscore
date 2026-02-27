"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useI18n } from "@/lib/i18n/context"
import { X, Info, Rocket, CheckCircle2, Target, Sparkles } from "lucide-react"

export function WelcomeInfoPanel() {
  const { t, language } = useI18n()
  const [isExpanded, setIsExpanded] = useState(false)
  const [hasSeenBefore, setHasSeenBefore] = useState(false)

  useEffect(() => {
    const seen = localStorage.getItem("welcome_panel_seen")
    if (!seen) {
      setIsExpanded(true)
      setHasSeenBefore(false)
    } else {
      setHasSeenBefore(true)
    }
  }, [])

  const handleClose = () => {
    setIsExpanded(false)
    localStorage.setItem("welcome_panel_seen", "true")
    setHasSeenBefore(true)
  }

  const handleToggle = () => {
    setIsExpanded(!isExpanded)
  }

  const welcome = t("candidateDashboard.welcome") as any

  if (!isExpanded && hasSeenBefore) {
    return (
      <div className="mb-6">
        <Button
          variant="outline"
          size="sm"
          onClick={handleToggle}
          className="gap-2 border-teal-200 bg-teal-50 hover:bg-teal-100 dark:bg-teal-950/20 dark:border-teal-800 dark:hover:bg-teal-900/30"
        >
          <Info className="h-4 w-4 text-teal-600 dark:text-teal-400" />
          <span className="text-teal-700 dark:text-teal-300">{welcome?.minimized || "Ako to funguje?"}</span>
        </Button>
      </div>
    )
  }

  return (
    <Card className="mb-6 border-teal-200 bg-gradient-to-br from-teal-50 to-cyan-50 dark:from-teal-950/20 dark:to-cyan-950/20 dark:border-teal-800">
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-teal-100 dark:bg-teal-900/50">
              <Rocket className="h-6 w-6 text-teal-600 dark:text-teal-400" />
            </div>
            <h3 className="text-xl font-bold text-teal-900 dark:text-teal-100">{welcome?.headline}</h3>
          </div>
          <Button variant="ghost" size="icon" onClick={handleClose} className="h-8 w-8 -mt-1 -mr-1">
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="space-y-4">
          <p className="text-sm text-teal-800 dark:text-teal-200">{welcome?.intro}</p>

          <div className="flex items-center gap-2 p-3 rounded-lg bg-teal-100 dark:bg-teal-900/50">
            <Target className="h-5 w-5 text-teal-600 dark:text-teal-400 flex-shrink-0" />
            <p className="text-sm font-medium text-teal-900 dark:text-teal-100">{welcome?.hook}</p>
          </div>

          <div className="space-y-3">
            {/* Step 1: CV */}
            <div className="flex gap-3 p-3 rounded-lg bg-white/50 dark:bg-gray-900/50">
              <div className="flex-shrink-0 mt-0.5">
                <div className="h-6 w-6 rounded-full bg-teal-600 dark:bg-teal-500 flex items-center justify-center text-white text-xs font-bold">
                  1
                </div>
              </div>
              <div>
                <h4 className="font-semibold text-teal-900 dark:text-teal-100 mb-1">{welcome?.steps?.cv?.title}</h4>
                <p className="text-sm text-teal-800 dark:text-teal-200">{welcome?.steps?.cv?.text}</p>
              </div>
            </div>

            {/* Step 2: Basic Tests - ponechávam zelenú pre success */}
            <div className="flex gap-3 p-3 rounded-lg bg-white/50 dark:bg-gray-900/50">
              <div className="flex-shrink-0 mt-0.5">
                <div className="h-6 w-6 rounded-full bg-green-600 dark:bg-green-500 flex items-center justify-center text-white text-xs font-bold">
                  2
                </div>
              </div>
              <div>
                <h4 className="font-semibold text-teal-900 dark:text-teal-100 mb-1">
                  {welcome?.steps?.basic_tests?.title}
                </h4>
                <p className="text-sm text-teal-800 dark:text-teal-200 mb-2">{welcome?.steps?.basic_tests?.text}</p>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-green-700 dark:text-green-300 font-medium">
                    {welcome?.steps?.basic_tests?.benefit}
                  </p>
                </div>
              </div>
            </div>

            {/* Step 3: Advanced Tests - zmena z purple na teal */}
            <div className="flex gap-3 p-3 rounded-lg bg-white/50 dark:bg-gray-900/50">
              <div className="flex-shrink-0 mt-0.5">
                <div className="h-6 w-6 rounded-full bg-teal-600 dark:bg-teal-500 flex items-center justify-center text-white text-xs font-bold">
                  3
                </div>
              </div>
              <div>
                <h4 className="font-semibold text-teal-900 dark:text-teal-100 mb-1">
                  {welcome?.steps?.advanced_tests?.title}
                </h4>
                <p className="text-sm text-teal-800 dark:text-teal-200 mb-2">{welcome?.steps?.advanced_tests?.text}</p>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-teal-600 dark:text-teal-400 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-teal-700 dark:text-teal-300 font-medium">
                    {welcome?.steps?.advanced_tests?.benefit}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Ponechávam žltú pre upozornenie */}
          <div className="flex items-start gap-2 p-3 rounded-lg bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-950/20 dark:to-orange-950/20 border border-yellow-200 dark:border-yellow-800">
            <Sparkles className="h-5 w-5 text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-0.5" />
            <p className="text-sm font-medium text-yellow-900 dark:text-yellow-100">{welcome?.note}</p>
          </div>

          <p className="text-sm text-teal-800 dark:text-teal-200 italic">{welcome?.closing}</p>
        </div>
      </CardContent>
    </Card>
  )
}
