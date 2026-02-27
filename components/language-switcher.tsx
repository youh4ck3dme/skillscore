"use client"

import { useI18n, type Language } from "@/lib/i18n/context"
import { Button } from "@/components/ui/button"
import { ChevronDown } from "lucide-react"
import { useState, useRef, useEffect } from "react"

const languages: { code: Language; name: string; flag: string }[] = [
  { code: "sk", name: "Slovenčina", flag: "SK" },
  { code: "en", name: "English", flag: "EN" },
  { code: "de", name: "Deutsch", flag: "DE" },
]

export function LanguageSwitcher() {
  const { language, setLanguage } = useI18n()
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const currentLanguage = languages.find((lang) => lang.code === language)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside)
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isOpen])

  const handleLanguageChange = (langCode: Language) => {
    setLanguage(langCode)
    setIsOpen(false)
  }

  const handleToggle = () => {
    setIsOpen(!isOpen)
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <Button variant="outline" size="sm" className="gap-2 bg-transparent" onClick={handleToggle}>
        <span className="font-medium">{currentLanguage?.flag}</span>
        <span className="hidden sm:inline">{currentLanguage?.name}</span>
        <ChevronDown className="h-4 w-4 opacity-50" />
      </Button>

      {isOpen && (
        <div className="absolute right-0 mt-2 min-w-[180px] bg-popover border rounded-md shadow-md z-50">
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => handleLanguageChange(lang.code)}
              className={`w-full text-left px-3 py-2 text-sm hover:bg-accent flex items-center ${
                language === lang.code ? "bg-accent font-medium" : ""
              }`}
            >
              <span className="mr-3 font-medium text-lg">{lang.flag}</span>
              <span>{lang.name}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
