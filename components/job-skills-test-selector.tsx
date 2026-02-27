"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Briefcase, Check, Clock, FileText, Award } from "lucide-react"
import { useI18n } from "@/lib/i18n/context"

const TRANSLATIONS = {
  sk: {
    selectCategoryAndLevel: "Vyberte kategóriu a úroveň testu pracovných zručností",
    category: "Kategória",
    testLevel: "Úroveň testu",
    questions: "otázok",
    minutes: "minút",
    cancel: "Zrušiť",
    startTest: "Začať test",
    categories: {
      general: { name: "Všeobecný", description: "Základné pracovné zručnosti pre všetky pozície" },
      admin: { name: "Administratíva", description: "Kancelárska práca, organizácia, dokumenty" },
      it: { name: "IT pozície", description: "Technické pozície, práca s technológiami" },
      trades: { name: "Remeslá", description: "Manuálna práca, technické profesie" },
    },
    levels: {
      screen: { difficulty: "Ľahká" },
      standard: { difficulty: "Stredná" },
      expert: { difficulty: "Náročná" },
    },
  },
  en: {
    selectCategoryAndLevel: "Select category and level for the job skills test",
    category: "Category",
    testLevel: "Test level",
    questions: "questions",
    minutes: "minutes",
    cancel: "Cancel",
    startTest: "Start test",
    categories: {
      general: { name: "General", description: "Basic job skills for all positions" },
      admin: { name: "Administration", description: "Office work, organization, documents" },
      it: { name: "IT positions", description: "Technical positions, work with technology" },
      trades: { name: "Trades", description: "Manual work, technical professions" },
    },
    levels: {
      screen: { difficulty: "Easy" },
      standard: { difficulty: "Medium" },
      expert: { difficulty: "Difficult" },
    },
  },
  de: {
    selectCategoryAndLevel: "Wählen Sie Kategorie und Stufe für den Arbeitskompetenzentest",
    category: "Kategorie",
    testLevel: "Teststufe",
    questions: "Fragen",
    minutes: "Minuten",
    cancel: "Abbrechen",
    startTest: "Test starten",
    categories: {
      general: { name: "Allgemein", description: "Grundlegende Arbeitsfähigkeiten für alle Positionen" },
      admin: { name: "Verwaltung", description: "Büroarbeit, Organisation, Dokumente" },
      it: { name: "IT-Positionen", description: "Technische Positionen, Arbeit mit Technologie" },
      trades: { name: "Handwerk", description: "Manuelle Arbeit, technische Berufe" },
    },
    levels: {
      screen: { difficulty: "Leicht" },
      standard: { difficulty: "Mittel" },
      expert: { difficulty: "Schwer" },
    },
  },
}

interface JobSkillsTestSelectorProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  testCode: string
  testName: string
  onSelect: (category: string, level: string) => void
}

export function JobSkillsTestSelector({
  open,
  onOpenChange,
  testCode,
  testName,
  onSelect,
}: JobSkillsTestSelectorProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("")
  const [selectedLevel, setSelectedLevel] = useState<string>("")
  const [recommendedCategory, setRecommendedCategory] = useState<string>("")

  const { language } = useI18n()
  const lang = (language && ["sk", "en", "de"].includes(language) ? language : "sk") as "sk" | "en" | "de"
  const t = TRANSLATIONS[lang]

  const JOB_CATEGORIES = [
    { id: "", name: t.categories.general.name, description: t.categories.general.description },
    { id: "ADMIN", name: t.categories.admin.name, description: t.categories.admin.description },
    { id: "IT", name: t.categories.it.name, description: t.categories.it.description },
    { id: "TRADES", name: t.categories.trades.name, description: t.categories.trades.description },
  ]

  const TEST_LEVELS = [
    {
      level: "screen",
      name: "Screen",
      questions: 8,
      duration: 8,
      difficulty: t.levels.screen.difficulty,
      color: "bg-green-500",
    },
    {
      level: "standard",
      name: "Standard",
      questions: 15,
      duration: 15,
      difficulty: t.levels.standard.difficulty,
      color: "bg-yellow-500",
    },
    {
      level: "expert",
      name: "Expert",
      questions: 20,
      duration: 20,
      difficulty: t.levels.expert.difficulty,
      color: "bg-red-500",
    },
  ]

  useEffect(() => {
    if (open) {
      fetchCVData()
    }
  }, [open])

  const fetchCVData = async () => {
    try {
      const response = await fetch("/api/candidate/profile")
      if (response.ok) {
        const data = await response.json()
        const experience = data.profile?.work_experience || []
        if (experience.some((e: any) => e.title?.toLowerCase().includes("admin"))) {
          setRecommendedCategory("ADMIN")
        } else if (
          experience.some(
            (e: any) => e.title?.toLowerCase().includes("it") || e.title?.toLowerCase().includes("developer"),
          )
        ) {
          setRecommendedCategory("IT")
        }
      }
    } catch (error) {
      console.error("[v0] Error fetching CV:", error)
    }
  }

  const handleStartTest = () => {
    if (selectedLevel) {
      onSelect(selectedCategory, selectedLevel)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle className="text-2xl flex items-center gap-2">
            <Briefcase className="w-6 h-6" />
            {testName}
          </DialogTitle>
          <DialogDescription>{t.selectCategoryAndLevel}</DialogDescription>
        </DialogHeader>

        {/* Kategórie */}
        <div className="space-y-3">
          <label className="text-sm font-medium">{t.category}</label>
          <div className="grid gap-3 md:grid-cols-4">
            {JOB_CATEGORIES.map((cat) => (
              <Card
                key={cat.id}
                className={`p-3 cursor-pointer transition-all hover:shadow-md ${
                  selectedCategory === cat.id ? "ring-2 ring-primary" : ""
                } ${recommendedCategory === cat.id ? "border-blue-300" : ""}`}
                onClick={() => setSelectedCategory(cat.id)}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-medium text-sm">{cat.name}</h4>
                    <p className="text-xs text-muted-foreground mt-1">{cat.description}</p>
                  </div>
                  {selectedCategory === cat.id && <Check className="w-4 h-4 text-primary" />}
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Úrovne */}
        <div className="space-y-3 mt-4">
          <label className="text-sm font-medium">{t.testLevel}</label>
          <div className="grid gap-4 md:grid-cols-3">
            {TEST_LEVELS.map((level) => (
              <Card
                key={level.level}
                className={`p-4 cursor-pointer transition-all hover:shadow-md ${
                  selectedLevel === level.level ? "ring-2 ring-primary" : ""
                }`}
                onClick={() => setSelectedLevel(level.level)}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold">{level.name}</h3>
                    <div className={`w-3 h-3 rounded-full ${level.color}`} />
                  </div>
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2 text-sm">
                      <FileText className="w-4 h-4" />
                      <span>
                        {level.questions} {t.questions}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Clock className="w-4 h-4" />
                      <span>
                        {level.duration} {t.minutes}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Award className="w-4 h-4" />
                      <span>{level.difficulty}</span>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            {t.cancel}
          </Button>
          <Button onClick={handleStartTest} disabled={!selectedLevel}>
            {t.startTest}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
