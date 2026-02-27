"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CheckCircle2, Globe, AlertCircle } from "lucide-react"

interface LanguageTest {
  language: string
  languageName: string
  level: string
  completed: boolean
  score?: number
}

interface LanguageSelectorModalProps {
  isOpen: boolean
  onClose: () => void
  availableTests: LanguageTest[]
  onSelectTest: (language: string, level: string) => void
}

const LANGUAGE_NAMES: Record<string, string> = {
  en: "Angličtina",
  de: "Nemčina",
  es: "Španielčina",
  nl: "Holandčina",
  fr: "Francúzština",
  it: "Taliančina",
}

export function LanguageSelectorModal({ isOpen, onClose, availableTests, onSelectTest }: LanguageSelectorModalProps) {
  if (availableTests.length === 0) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5 text-indigo-500" />
              Jazykové testy
            </DialogTitle>
          </DialogHeader>

          <div className="py-8 text-center space-y-4">
            <AlertCircle className="h-16 w-16 text-muted-foreground mx-auto" />
            <div className="space-y-2">
              <p className="font-medium text-muted-foreground">Žiadny jazykový test pre teba nie je dostupný</p>
              <p className="text-sm text-muted-foreground">V tvojom CV nie sú uvedené žiadne cudzie jazyky</p>
            </div>
          </div>

          <Button onClick={onClose} variant="outline" className="w-full bg-transparent">
            Zavrieť
          </Button>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5 text-indigo-500" />
            Vyber jazykový test
          </DialogTitle>
          <DialogDescription>Dostupné testy na základe jazykov uvedených v tvojom CV</DialogDescription>
        </DialogHeader>

        <div className="space-y-3 py-4">
          {availableTests.map((test) => (
            <div
              key={`${test.language}-${test.level}`}
              className="flex items-center justify-between p-4 rounded-lg border-2 hover:border-indigo-500/50 transition-all"
            >
              <div className="flex items-center gap-4">
                {test.completed ? (
                  <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0" />
                ) : (
                  <div className="h-5 w-5 rounded-full border-2 border-muted-foreground/30 flex-shrink-0" />
                )}

                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{LANGUAGE_NAMES[test.language] || test.language}</span>
                    <Badge variant="outline" className="text-xs">
                      {test.level}
                    </Badge>
                  </div>
                  {test.completed && test.score !== undefined && (
                    <p className="text-sm text-muted-foreground">Skóre: {test.score}%</p>
                  )}
                </div>
              </div>

              <Button
                onClick={() => onSelectTest(test.language, test.level)}
                disabled={test.completed}
                className="bg-indigo-500 hover:bg-indigo-600"
              >
                {test.completed ? "Dokončené" : "Spustiť test"}
              </Button>
            </div>
          ))}
        </div>

        <div className="pt-4 border-t">
          <Button onClick={onClose} variant="outline" className="w-full bg-transparent">
            Zavrieť
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
