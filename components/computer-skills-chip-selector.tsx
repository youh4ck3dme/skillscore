"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Check, X } from "lucide-react"
import { computerSkillsData } from "@/lib/data/form-options"
import { useI18n } from "@/lib/i18n/context"
import { staticTranslations } from "@/lib/i18n/translations"

interface ComputerSkill {
  category: string
  tool: string
  level: string
}

interface ComputerSkillsChipSelectorProps {
  selectedSkills: ComputerSkill[]
  onChange: (skills: ComputerSkill[]) => void
  disabled?: boolean
}

export function ComputerSkillsChipSelector({ selectedSkills, onChange, disabled }: ComputerSkillsChipSelectorProps) {
  const { language } = useI18n()
  const currentLang = (language && staticTranslations[language] ? language : "sk") as keyof typeof staticTranslations
  const t = staticTranslations[currentLang].modals.cvModal.steps.skills
  const skillLevelsTranslations = staticTranslations[currentLang].formOptions.skillLevels

  const [activeCategory, setActiveCategory] = useState<"user" | "tools">("user")

  const skillLevels = [
    { value: "Začiatočník", label: skillLevelsTranslations.beginner },
    { value: "Mierne pokročilý", label: skillLevelsTranslations.intermediate },
    { value: "Pokročilý", label: skillLevelsTranslations.advanced },
    { value: "Expert", label: skillLevelsTranslations.expert },
  ]

  const getLevelLabel = (level: string) => {
    const levelObj = skillLevels.find((l) => l.value === level)
    return levelObj ? levelObj.label : level
  }

  const isToolSelected = (tool: string) => {
    return selectedSkills.some((skill) => skill.tool === tool && skill.category === activeCategory)
  }

  const getToolLevel = (tool: string) => {
    const skill = selectedSkills.find((s) => s.tool === tool && s.category === activeCategory)
    return skill?.level || ""
  }

  const toggleTool = (tool: string) => {
    if (disabled) return

    const isSelected = isToolSelected(tool)
    if (isSelected) {
      // Remove tool
      onChange(selectedSkills.filter((s) => !(s.tool === tool && s.category === activeCategory)))
    } else {
      // Add tool with default level
      onChange([...selectedSkills, { category: activeCategory, tool, level: "Začiatočník" }])
    }
  }

  const setToolLevel = (tool: string, level: string) => {
    if (disabled) return

    const newSkills = selectedSkills.map((skill) => {
      if (skill.tool === tool && skill.category === activeCategory) {
        return { ...skill, level }
      }
      return skill
    })
    onChange(newSkills)
  }

  const currentTools = computerSkillsData[activeCategory] || []

  const userSkillsCount = selectedSkills.filter((s) => s.category === "user").length
  const toolsSkillsCount = selectedSkills.filter((s) => s.category === "tools").length
  const totalSkillsCount = selectedSkills.length

  return (
    <div className="space-y-4">
      {totalSkillsCount > 0 && (
        <div className="flex items-center gap-2 p-3 bg-primary/10 border border-primary/20 rounded-lg">
          <Check className="h-4 w-4 text-primary" />
          <p className="text-sm font-medium">
            {t.computerSkillsTotal}: {totalSkillsCount}
            {userSkillsCount > 0 && ` (${t.computerSkillsUser}: ${userSkillsCount})`}
            {toolsSkillsCount > 0 && ` (${t.computerSkillsTools}: ${toolsSkillsCount})`}
          </p>
        </div>
      )}

      {/* Category selector */}
      <div className="flex gap-2">
        <Button
          type="button"
          variant={activeCategory === "user" ? "default" : "outline"}
          onClick={() => setActiveCategory("user")}
          disabled={disabled}
          className="relative"
        >
          {t.computerSkillsUser}
          {userSkillsCount > 0 && (
            <span className="ml-2 px-1.5 py-0.5 text-xs rounded-full bg-background/20">{userSkillsCount}</span>
          )}
        </Button>
        <Button
          type="button"
          variant={activeCategory === "tools" ? "default" : "outline"}
          onClick={() => setActiveCategory("tools")}
          disabled={disabled}
          className="relative"
        >
          {t.computerSkillsTools}
          {toolsSkillsCount > 0 && (
            <span className="ml-2 px-1.5 py-0.5 text-xs rounded-full bg-background/20">{toolsSkillsCount}</span>
          )}
        </Button>
      </div>

      {/* Tools grid */}
      <div className="space-y-3">
        <p className="text-sm text-muted-foreground">
          {activeCategory === "user" ? t.computerSkillsInstructionUser : t.computerSkillsInstructionTools}
        </p>
        <div className="flex flex-wrap gap-2">
          {currentTools.map((tool) => {
            const isSelected = isToolSelected(tool)
            return (
              <Badge
                key={tool}
                variant={isSelected ? "default" : "outline"}
                className="cursor-pointer hover:bg-primary/80 transition-colors px-3 py-1.5"
                onClick={() => toggleTool(tool)}
              >
                {tool}
                {isSelected && <Check className="h-3 w-3 ml-1" />}
              </Badge>
            )
          })}
        </div>
      </div>

      {/* Selected tools with level selection */}
      {selectedSkills.filter((s) => s.category === activeCategory).length > 0 && (
        <div className="space-y-3 pt-4 border-t">
          <p className="text-sm font-medium">{t.computerSkillsSelectedTitle}</p>
          <div className="space-y-3">
            {selectedSkills
              .filter((s) => s.category === activeCategory)
              .map((skill) => (
                <div key={skill.tool} className="flex items-center gap-3 p-3 border rounded-lg bg-muted/30">
                  <div className="flex-1">
                    <p className="text-sm font-medium">{skill.tool}</p>
                  </div>
                  <div className="flex gap-1.5">
                    {skillLevels.map((level) => (
                      <Badge
                        key={level.value}
                        variant={skill.level === level.value ? "default" : "outline"}
                        className="cursor-pointer hover:bg-primary/80 transition-colors text-xs px-2 py-1"
                        onClick={() => setToolLevel(skill.tool, level.value)}
                      >
                        {level.label}
                      </Badge>
                    ))}
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleTool(skill.tool)}
                    disabled={disabled}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  )
}
