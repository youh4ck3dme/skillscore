"use client"

import { useState, useEffect } from "react"
import { X, Target, CheckCircle2, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useI18n } from "@/lib/i18n/context"
import { staticTranslations } from "@/lib/i18n/translations"

export function CandidateInfoBanner() {
  const { language } = useI18n()

  const currentLang = (language && language in staticTranslations ? language : "sk") as keyof typeof staticTranslations
  const translations = staticTranslations[currentLang]

  const welcome = translations?.candidateDashboard?.welcome ||
    staticTranslations.sk?.candidateDashboard?.welcome || {
      headline: "Spravujte svoj profil a nastavenia 🚀",
      intro: "Predstavte si, že firma hľadá kandidátov...",
      hook: "🎯 Práve tu si môžete vybudovať náskok.",
      steps: {
        cv: { title: "Vyplniť CV", text: "Zadajte základné údaje..." },
        basic_tests: {
          title: "Absolvovať základné testy",
          text: "Potvrdíte to, čo je v CV...",
          benefit: "➡️ Benefit...",
        },
        advanced_tests: {
          title: "Pokročilé testy",
          text: "Firmy často zužujú shortlist...",
          benefit: "➡️ Ak ich máte...",
        },
      },
      note: "✨ Čím viac testov dokončíte...",
      closing: "Firmy oceňujú kandidátov...",
      minimized: "Info",
    }

  const [isExpanded, setIsExpanded] = useState(true)
  const [hasSeenBanner, setHasSeenBanner] = useState(false)

  useEffect(() => {
    const seen = localStorage.getItem("candidate_info_banner_seen")
    if (seen === "true") {
      setIsExpanded(false)
      setHasSeenBanner(true)
    }
  }, [])

  const handleClose = () => {
    setIsExpanded(false)
    setHasSeenBanner(true)
    localStorage.setItem("candidate_info_banner_seen", "true")
  }

  const handleExpand = () => {
    setIsExpanded(true)
  }

  if (!isExpanded && hasSeenBanner) {
    return (
      <div className="mb-6">
        <Button
          variant="outline"
          onClick={handleExpand}
          className="w-full sm:w-auto bg-gradient-to-r from-teal-50 to-cyan-50 dark:from-teal-950/20 dark:to-cyan-950/20 border-teal-200 dark:border-teal-800 hover:from-teal-100 hover:to-cyan-100"
        >
          <span className="font-medium">Info</span>
        </Button>
      </div>
    )
  }

  if (!isExpanded) return null

  return (
    <div className="mb-6 bg-gradient-to-br from-teal-50 to-cyan-50 dark:from-teal-950/20 dark:to-cyan-950/20 border border-teal-200 dark:border-teal-800 rounded-lg p-6 relative">
      <Button variant="ghost" size="icon" onClick={handleClose} className="absolute top-4 right-4 h-8 w-8">
        <X className="h-4 w-4" />
      </Button>

      <div className="max-w-4xl">
        {/* Intro */}
        <div className="bg-teal-100 dark:bg-teal-900/30 rounded-lg p-4 mb-4">
          <div className="flex items-start gap-3">
            <Target className="h-6 w-6 text-teal-600 dark:text-teal-400 flex-shrink-0 mt-1" />
            <div>
              <p className="text-foreground mb-2">{welcome.intro}</p>
              <p className="text-foreground font-semibold">{welcome.hook}</p>
            </div>
          </div>
        </div>

        {/* Steps */}
        <div className="space-y-3 mb-4">
          {/* Step 1: CV */}
          <div className="bg-white dark:bg-gray-900 rounded-lg p-4 border border-teal-200 dark:border-teal-800">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-teal-600 text-white flex items-center justify-center font-bold">
                1
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-foreground mb-1">{welcome.steps.cv.title}</h3>
                <p className="text-sm text-muted-foreground">{welcome.steps.cv.text}</p>
              </div>
            </div>
          </div>

          {/* Step 2: Basic Tests - ponechávam zelenú */}
          <div className="bg-white dark:bg-gray-900 rounded-lg p-4 border border-green-200 dark:border-green-800">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-green-600 text-white flex items-center justify-center font-bold">
                2
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-foreground mb-1 flex items-center gap-2">
                  {welcome.steps.basic_tests.title}
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                </h3>
                <p className="text-sm text-muted-foreground mb-2">{welcome.steps.basic_tests.text}</p>
                <p className="text-sm text-green-700 dark:text-green-400 font-medium">
                  {welcome.steps.basic_tests.benefit}
                </p>
              </div>
            </div>
          </div>

          {/* Step 3: Advanced Tests - zmena z purple na teal */}
          <div className="bg-white dark:bg-gray-900 rounded-lg p-4 border border-teal-200 dark:border-teal-800">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-teal-600 text-white flex items-center justify-center font-bold">
                3
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-foreground mb-1 flex items-center gap-2">
                  {welcome.steps.advanced_tests.title}
                  <CheckCircle2 className="h-4 w-4 text-teal-600" />
                </h3>
                <p className="text-sm text-muted-foreground mb-2">{welcome.steps.advanced_tests.text}</p>
                <p className="text-sm text-teal-700 dark:text-teal-400 font-medium">
                  {welcome.steps.advanced_tests.benefit}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Note - ponechávam žltú */}
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 mb-4">
          <div className="flex items-start gap-3">
            <Sparkles className="h-5 w-5 text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-foreground font-medium">{welcome.note}</p>
          </div>
        </div>

        {/* Closing */}
        <p className="text-sm text-muted-foreground">{welcome.closing}</p>
      </div>
    </div>
  )
}
