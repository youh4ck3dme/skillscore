"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Clock, FileText, Award, Languages } from "lucide-react"
import { useRouter } from "next/navigation"
import { useI18n } from "@/lib/i18n/context"
import { staticTranslations } from "@/lib/i18n/translations"
import { en } from "@/lib/i18n/translations-en"
import { de } from "@/lib/i18n/translations-de"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const allTranslations = {
  sk: staticTranslations,
  en: en,
  de: de,
}

const LANGUAGE_LEVELS = ["A1", "A2", "B1", "B2", "C1", "C2"]

const LEVEL_HIERARCHY: Record<string, string[]> = {
  C2: ["C2", "C1", "B2", "B1", "A2", "A1"],
  C1: ["C1", "B2", "B1", "A2", "A1"],
  B2: ["B2", "B1", "A2", "A1"],
  B1: ["B1", "A2", "A1"],
  A2: ["A2", "A1"],
  A1: ["A1"],
}

interface TestLevel {
  level: "screen" | "standard" | "expert"
  name: string
  description: Record<string, string>
  questions: number
  duration: number
  difficulty: Record<string, string>
  color: string
}

interface TestLevelSelectorProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  testCode: string
  testName: string
  lastResult?: {
    level: string
    band: string
    completedAt: string
  }
  startTestCallback?: (level: string) => void
}

const TEST_LEVELS: TestLevel[] = [
  {
    level: "screen",
    name: "Screen",
    description: {
      sk: "Základná úroveň - rýchle overenie základných znalostí",
      en: "Basic level - quick verification of basic knowledge",
      de: "Grundstufe - schnelle Überprüfung der Grundkenntnisse",
    },
    questions: 8,
    duration: 8,
    difficulty: {
      sk: "Ľahká",
      en: "Easy",
      de: "Leicht",
    },
    color: "bg-green-500",
  },
  {
    level: "standard",
    name: "Standard",
    description: {
      sk: "Stredná úroveň - komplexné overenie znalostí a zručností",
      en: "Medium level - comprehensive verification of knowledge and skills",
      de: "Mittelstufe - umfassende Überprüfung von Wissen und Fähigkeiten",
    },
    questions: 15,
    duration: 15,
    difficulty: {
      sk: "Stredná",
      en: "Medium",
      de: "Mittel",
    },
    color: "bg-yellow-500",
  },
  {
    level: "expert",
    name: "Expert",
    description: {
      sk: "Pokročilá úroveň - detailné overenie expertných znalostí",
      en: "Advanced level - detailed verification of expert knowledge",
      de: "Fortgeschrittene Stufe - detaillierte Überprüfung von Expertenwissen",
    },
    questions: 20,
    duration: 20,
    difficulty: {
      sk: "Náročná",
      en: "Difficult",
      de: "Anspruchsvoll",
    },
    color: "bg-red-500",
  },
]

export function TestLevelSelector({
  open,
  onOpenChange,
  testCode,
  testName,
  lastResult,
  startTestCallback,
}: TestLevelSelectorProps) {
  const router = useRouter()
  const { language } = useI18n()
  const currentLang = (language && ["sk", "en", "de"].includes(language) ? language : "sk") as "sk" | "en" | "de"

  const translations = allTranslations[currentLang]
  const t = translations?.testLevelSelector || {
    selectLevel:
      currentLang === "de"
        ? "Wählen Sie die Teststufe"
        : currentLang === "en"
          ? "Select test level"
          : "Vyberte úroveň testu",
    questions: currentLang === "de" ? "Fragen" : currentLang === "en" ? "questions" : "otázok",
    minutes: currentLang === "de" ? "Minuten" : currentLang === "en" ? "minutes" : "minút",
    startTest: currentLang === "de" ? "Test starten" : currentLang === "en" ? "Start test" : "Začať test",
    lastResult: currentLang === "de" ? "Letztes Ergebnis" : currentLang === "en" ? "Last result" : "Posledný výsledok",
    useThisResult:
      currentLang === "de"
        ? "Dieses Ergebnis verwenden"
        : currentLang === "en"
          ? "Use this result"
          : "Použiť tento výsledok",
    selectLanguage:
      currentLang === "de" ? "Sprache auswählen" : currentLang === "en" ? "Select language" : "Vyberte jazyk",
    selectMaxLevel:
      currentLang === "de" ? "Maximale Stufe" : currentLang === "en" ? "Maximum level" : "Maximálna úroveň",
    availableLevels:
      currentLang === "de"
        ? "Verfügbare Teststufen:"
        : currentLang === "en"
          ? "Available test levels:"
          : "Dostupné úrovne testov:",
    languageTestInfo:
      currentLang === "de"
        ? "Sie haben die Stufe ausgewählt, sodass Sie Zugang zu allen Tests auf dieser und niedrigeren Stufen haben."
        : currentLang === "en"
          ? "You selected this level, so you have access to all tests at this and lower levels."
          : "Vybrali ste úroveň, takže máte prístup ku všetkým testom na tejto a nižších úrovniach.",
  }

  const languageNames: Record<string, Record<string, string>> = {
    en: { sk: "Angličtina", en: "English", de: "Englisch" },
    de: { sk: "Nemčina", en: "German", de: "Deutsch" },
    fr: { sk: "Francúzština", en: "French", de: "Französisch" },
    es: { sk: "Španielčina", en: "Spanish", de: "Spanisch" },
    it: { sk: "Taliančina", en: "Italian", de: "Italienisch" },
  }

  const [selectedLevel, setSelectedLevel] = useState<string | null>(null)
  const [availableLevels, setAvailableLevels] = useState<TestLevel[]>(TEST_LEVELS)

  const [selectedLanguage, setSelectedLanguage] = useState<string>("")
  const [selectedLanguageLevel, setSelectedLanguageLevel] = useState<string>("")
  const [availableLanguages, setAvailableLanguages] = useState<string[]>([])
  const [isLanguageTest, setIsLanguageTest] = useState(false)

  useEffect(() => {
    if (open && testCode) {
      if (testCode === "language" || testName.toLowerCase().includes("jazykový")) {
        setIsLanguageTest(true)
        fetchAvailableLanguages()
      } else {
        setIsLanguageTest(false)
        fetchAvailableLevels()
      }
    }
  }, [open, testCode])

  const fetchAvailableLanguages = async () => {
    try {
      const response = await fetch("/api/language-tests/available")
      if (response.ok) {
        const data = await response.json()
        setAvailableLanguages(data.languages || ["en", "de", "fr", "es", "it"])
      }
    } catch (error) {
      console.error("Error fetching available languages:", error)
      setAvailableLanguages(["en", "de", "fr", "es", "it"])
    }
  }

  const fetchAvailableLevels = async () => {
    try {
      const response = await fetch(`/api/candidate/tests/levels?testCode=${testCode}`)
      if (response.ok) {
        const data = await response.json()
        if (data.levels && data.levels.length > 0) {
          setAvailableLevels(TEST_LEVELS.filter((level) => data.levels.includes(level.level)))
        }
      }
    } catch (error) {
      console.error("Error fetching test levels:", error)
    }
  }

  const onLevelButtonClick = (level: string) => {
    if (startTestCallback) {
      startTestCallback(level)
    } else {
      const url = `/tests/${testCode.toLowerCase()}?level=${level}`
      router.push(url)
      onOpenChange(false)
    }
  }

  const handleStartLanguageTest = (language: string, level: string) => {
    router.push(`/dashboard/candidate/tests/language/${language}/${level}`)
    onOpenChange(false)
  }

  const handleUseLastResult = () => {
    onOpenChange(false)
  }

  const getAvailableLevelsForLanguage = (selectedLevel: string): string[] => {
    return LEVEL_HIERARCHY[selectedLevel] || [selectedLevel]
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle className="text-2xl">{testName}</DialogTitle>
          <DialogDescription>{isLanguageTest ? t.selectLanguage : t.selectLevel}</DialogDescription>
        </DialogHeader>

        {lastResult && (
          <Card className="p-4 bg-muted">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">
                  {t.lastResult} ({lastResult.level})
                </p>
                <p className="text-lg font-semibold">{lastResult.band}</p>
                <p className="text-xs text-muted-foreground">
                  {new Date(lastResult.completedAt).toLocaleDateString(
                    currentLang === "de" ? "de-DE" : currentLang === "en" ? "en-US" : "sk-SK",
                  )}
                </p>
              </div>
              <Button onClick={handleUseLastResult} variant="outline">
                {t.useThisResult}
              </Button>
            </div>
          </Card>
        )}

        {isLanguageTest ? (
          <div className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-medium">{t.selectLanguage}</label>
                <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
                  <SelectTrigger>
                    <SelectValue placeholder={t.selectLanguage} />
                  </SelectTrigger>
                  <SelectContent>
                    {availableLanguages.map((lang) => (
                      <SelectItem key={lang} value={lang}>
                        {languageNames[lang]?.[currentLang] || lang}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">{t.selectMaxLevel}</label>
                <Select value={selectedLanguageLevel} onValueChange={setSelectedLanguageLevel}>
                  <SelectTrigger>
                    <SelectValue placeholder={t.selectMaxLevel} />
                  </SelectTrigger>
                  <SelectContent>
                    {LANGUAGE_LEVELS.map((level) => (
                      <SelectItem key={level} value={level}>
                        {level}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {selectedLanguage && selectedLanguageLevel && (
              <Card className="p-4 bg-muted">
                <div className="flex items-start gap-3">
                  <Languages className="w-5 h-5 text-primary mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm font-medium mb-2">{t.availableLevels}</p>
                    <div className="flex flex-wrap gap-2">
                      {getAvailableLevelsForLanguage(selectedLanguageLevel).map((level) => (
                        <Button
                          key={level}
                          variant="outline"
                          size="sm"
                          onClick={() => handleStartLanguageTest(selectedLanguage, level)}
                        >
                          {level}
                        </Button>
                      ))}
                    </div>
                    <p className="text-xs text-muted-foreground mt-3">{t.languageTestInfo}</p>
                  </div>
                </div>
              </Card>
            )}
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-3">
            {availableLevels.map((level) => (
              <Card
                key={level.level}
                className={`p-6 cursor-pointer transition-all hover:shadow-lg ${
                  selectedLevel === level.level ? "ring-2 ring-primary" : ""
                }`}
                onClick={() => setSelectedLevel(level.level)}
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold">{level.name}</h3>
                    <div className={`w-3 h-3 rounded-full ${level.color}`} />
                  </div>

                  <p className="text-sm text-muted-foreground">{level.description[currentLang]}</p>

                  <div className="space-y-2">
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
                      <span>{level.difficulty[currentLang]}</span>
                    </div>
                  </div>

                  <Button
                    className="w-full"
                    onClick={(e) => {
                      e.stopPropagation()
                      onLevelButtonClick(level.level)
                    }}
                  >
                    {t.startTest}
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
