"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Monitor, Check } from "lucide-react"

const IT_LEVELS = [
  {
    level: "L1",
    name: "Level 1 - Základný",
    description: "Práca s počítačom, základy OS, e-mail, prehliadače",
    skills: ["E-mail", "Prehliadač", "Základy Windows"],
  },
  {
    level: "L2",
    name: "Level 2 - Stredný",
    description: "Kancelárske aplikácie, správa súborov, bezpečnosť",
    skills: ["Word", "Excel základy", "Správa súborov"],
  },
  {
    level: "L3",
    name: "Level 3 - Pokročilý",
    description: "Pokročilé aplikácie, analýza dát, riešenie problémov",
    skills: ["Excel pokročilý", "PowerPoint", "Základy databáz"],
  },
  {
    level: "L4",
    name: "Level 4 - Expert",
    description: "Expertné používanie, automatizácia, optimalizácia",
    skills: ["VBA/Makrá", "Databázy", "Automatizácia"],
  },
]

interface ITTestSelectorProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  testCode: string
  testName: string
  onSelect: (level: string) => void
}

export function ITTestSelector({ open, onOpenChange, testCode, testName, onSelect }: ITTestSelectorProps) {
  const [selectedLevel, setSelectedLevel] = useState<string>("")
  const [cvSkills, setCvSkills] = useState<string[]>([])
  const [recommendedLevel, setRecommendedLevel] = useState<string>("")

  useEffect(() => {
    if (open) {
      fetchCVSkills()
    }
  }, [open])

  const fetchCVSkills = async () => {
    try {
      const response = await fetch("/api/candidate/profile")
      if (response.ok) {
        const data = await response.json()
        if (data.profile?.computer_skills) {
          const rawSkills = data.profile.computer_skills
          let skills: string[] = []

          if (Array.isArray(rawSkills)) {
            // Check if it's array of objects with 'tool' property or array of strings
            skills = rawSkills.map((item: any) =>
              typeof item === "object" && item !== null && item.tool ? item.tool : String(item),
            )
          } else if (typeof rawSkills === "object" && rawSkills !== null) {
            skills = Object.keys(rawSkills)
          }

          setCvSkills(skills)

          // Odporuč level podľa počtu skills
          if (skills.length >= 8) setRecommendedLevel("L4")
          else if (skills.length >= 5) setRecommendedLevel("L3")
          else if (skills.length >= 3) setRecommendedLevel("L2")
          else setRecommendedLevel("L1")
        }
      }
    } catch (error) {
      console.error("[v0] Error fetching CV skills:", error)
    }
  }

  const handleStartTest = () => {
    if (selectedLevel) {
      onSelect(selectedLevel)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle className="text-2xl flex items-center gap-2">
            <Monitor className="w-6 h-6" />
            {testName}
          </DialogTitle>
          <DialogDescription>Vyberte úroveň IT testu podľa vašich zručností</DialogDescription>
        </DialogHeader>

        {cvSkills.length > 0 && (
          <Card className="p-4 bg-blue-50 border-blue-200">
            <p className="text-sm font-medium text-blue-900 mb-2">Vaše IT zručnosti z CV:</p>
            <div className="flex flex-wrap gap-2">
              {cvSkills.slice(0, 10).map((skill, i) => (
                <span key={i} className="px-2 py-1 bg-white rounded text-sm">
                  {skill}
                </span>
              ))}
            </div>
            {recommendedLevel && (
              <p className="text-sm text-blue-700 mt-3">
                Odporúčaná úroveň: <strong>{recommendedLevel}</strong>
              </p>
            )}
          </Card>
        )}

        <div className="grid gap-4 md:grid-cols-2 mt-4">
          {IT_LEVELS.map((level) => (
            <Card
              key={level.level}
              className={`p-4 cursor-pointer transition-all hover:shadow-md ${
                selectedLevel === level.level ? "ring-2 ring-primary" : ""
              } ${recommendedLevel === level.level ? "border-blue-300" : ""}`}
              onClick={() => setSelectedLevel(level.level)}
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold">{level.name}</h3>
                  <p className="text-sm text-muted-foreground mt-1">{level.description}</p>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {level.skills.map((skill, i) => (
                      <span key={i} className="text-xs bg-muted px-2 py-0.5 rounded">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
                {selectedLevel === level.level && <Check className="w-5 h-5 text-primary" />}
              </div>
            </Card>
          ))}
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Zrušiť
          </Button>
          <Button onClick={handleStartTest} disabled={!selectedLevel}>
            Začať test
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
