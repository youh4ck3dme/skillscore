"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Languages, Info } from "lucide-react"

const LANGUAGES = [
  { code: "EN", name: "Angličtina" },
  { code: "DE", name: "Nemčina" },
  { code: "ES", name: "Španielčina" },
  { code: "FR", name: "Francúzština" },
  { code: "IT", name: "Taliančina" },
]

const LEVELS = ["A1", "A2", "B1", "B2", "C1", "C2"]

const LEVEL_DESCRIPTIONS: Record<string, string> = {
  A1: "Začiatočník - základné frázy a výrazy",
  A2: "Mierne pokročilý - jednoduché situácie",
  B1: "Stredne pokročilý - bežné témy",
  B2: "Pokročilý - komplexnejšie témy",
  C1: "Expert - akademický a profesionálny jazyk",
  C2: "Native - plynulé ovládanie jazyka",
}

interface LanguageTestSelectorProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  testCode: string
  testName: string
  onSelect: (lang: string, langLevel: string) => void
}

export function LanguageTestSelector({ open, onOpenChange, testCode, testName, onSelect }: LanguageTestSelectorProps) {
  const [selectedLanguage, setSelectedLanguage] = useState<string>("")
  const [selectedLevel, setSelectedLevel] = useState<string>("")
  const [cvLanguages, setCvLanguages] = useState<{ language: string; level: string }[]>([])

  useEffect(() => {
    if (open) {
      fetchCVLanguages()
    }
  }, [open])

  const fetchCVLanguages = async () => {
    try {
      const response = await fetch("/api/candidate/profile")
      if (response.ok) {
        const data = await response.json()
        if (data.profile?.languages) {
          setCvLanguages(data.profile.languages)
        }
      }
    } catch (error) {
      console.error("[v0] Error fetching CV languages:", error)
    }
  }

  const handleStartTest = () => {
    if (selectedLanguage && selectedLevel) {
      onSelect(selectedLanguage, selectedLevel)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl flex items-center gap-2">
            <Languages className="w-6 h-6" />
            {testName}
          </DialogTitle>
          <DialogDescription>Vyberte jazyk a úroveň testu, ktorú chcete absolvovať</DialogDescription>
        </DialogHeader>

        {cvLanguages.length > 0 && (
          <Card className="p-4 bg-blue-50 border-blue-200">
            <div className="flex items-start gap-2">
              <Info className="w-5 h-5 text-blue-500 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-blue-900">Jazyky z vášho CV:</p>
                <div className="flex flex-wrap gap-2 mt-2">
                  {cvLanguages.map((lang, i) => (
                    <Button
                      key={i}
                      variant="outline"
                      size="sm"
                      className="bg-white"
                      onClick={() => {
                        const langCode = lang.language.toUpperCase().slice(0, 2)
                        setSelectedLanguage(langCode)
                        setSelectedLevel(lang.level || "B1")
                      }}
                    >
                      {lang.language} ({lang.level || "?"})
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </Card>
        )}

        <div className="grid gap-4 md:grid-cols-2 mt-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Jazyk</label>
            <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
              <SelectTrigger>
                <SelectValue placeholder="Vyberte jazyk" />
              </SelectTrigger>
              <SelectContent>
                {LANGUAGES.map((lang) => (
                  <SelectItem key={lang.code} value={lang.code}>
                    {lang.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Úroveň</label>
            <Select value={selectedLevel} onValueChange={setSelectedLevel}>
              <SelectTrigger>
                <SelectValue placeholder="Vyberte úroveň" />
              </SelectTrigger>
              <SelectContent>
                {LEVELS.map((level) => (
                  <SelectItem key={level} value={level}>
                    {level} - {LEVEL_DESCRIPTIONS[level].split(" - ")[0]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {selectedLevel && (
          <Card className="p-4 bg-muted mt-2">
            <p className="text-sm text-muted-foreground">{LEVEL_DESCRIPTIONS[selectedLevel]}</p>
          </Card>
        )}

        <div className="flex justify-end gap-3 mt-6">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Zrušiť
          </Button>
          <Button onClick={handleStartTest} disabled={!selectedLanguage || !selectedLevel}>
            Začať test
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
