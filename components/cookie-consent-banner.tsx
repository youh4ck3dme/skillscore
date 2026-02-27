"use client"

import { useState, useEffect } from "react"
import { X, Cookie, Settings } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import {
  getCookieConsent,
  setCookieConsent,
  shouldShowConsentBanner,
  DEFAULT_CONSENT,
  type CookieConsent,
} from "@/lib/cookies/consent"
import Link from "next/link"

export function CookieConsentBanner() {
  const [showBanner, setShowBanner] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [preferences, setPreferences] = useState<CookieConsent>(DEFAULT_CONSENT)

  useEffect(() => {
    // Check if banner should be shown
    const shouldShow = shouldShowConsentBanner()
    setShowBanner(shouldShow)

    // Load existing preferences if any
    const existing = getCookieConsent()
    if (existing) {
      setPreferences(existing)
    }

    // Listen for event from footer "Manage cookies" button
    const handleShowSettingsEvent = () => {
      console.log("[v0] Received showCookieSettings event from footer")
      setShowBanner(true)
      setShowSettings(true)
    }

    window.addEventListener('showCookieSettings', handleShowSettingsEvent)

    return () => {
      window.removeEventListener('showCookieSettings', handleShowSettingsEvent)
    }
  }, [])

  const handleAcceptAll = () => {
    const consent: CookieConsent = {
      necessary: true,
      functional: true,
      analytics: true,
      marketing: true,
      timestamp: Date.now(),
    }
    setCookieConsent(consent)
    setShowBanner(false)
  }

  const handleRejectAll = () => {
    setCookieConsent(DEFAULT_CONSENT)
    setShowBanner(false)
  }

  const handleSavePreferences = () => {
    console.log("[v0] Saving cookie preferences:", preferences)
    setCookieConsent(preferences)
    setShowBanner(false)
    setShowSettings(false)
  }

  const handleShowSettings = () => {
    console.log("[v0] Opening cookie settings")
    setShowSettings(true)
  }

  const handleToggle = (key: keyof CookieConsent) => {
    if (key === "necessary" || key === "timestamp") return // Cannot toggle necessary or timestamp

    setPreferences((prev) => ({
      ...prev,
      [key]: !prev[key],
    }))
  }

  console.log("[v0] CookieBanner render:", { showBanner, showSettings })

  if (!showBanner) return null

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 p-4 sm:p-6">
      <Card className="mx-auto max-w-4xl border-2 bg-background/95 shadow-2xl backdrop-blur supports-[backdrop-filter]:bg-background/80">
        <div className="p-6">
          {!showSettings ? (
            // Simple banner
            <div className="flex flex-col gap-4">
              <div className="flex items-start gap-4">
                <Cookie className="h-6 w-6 flex-shrink-0 text-primary" />
                <div className="flex-1 space-y-2">
                  <h3 className="text-lg font-semibold">Používame cookies</h3>
                  <p className="text-sm text-muted-foreground">
                    Používame cookies na zlepšenie vášho zážitku, analýzu návštevnosti a personalizáciu obsahu.
                    Nevyhnutné cookies sú vždy aktívne. Podrobnosti nájdete v našej{" "}
                    <Link href="/legal/cookies" className="underline hover:text-primary">
                      Cookie Policy
                    </Link>{" "}
                    a{" "}
                    <Link href="/legal/gdpr" className="underline hover:text-primary">
                      Ochrane osobných údajov
                    </Link>
                    .
                  </p>
                </div>
              </div>

              <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
                <Button variant="outline" onClick={handleRejectAll} className="w-full sm:w-auto bg-transparent">
                  Odmietnuť všetky
                </Button>
                <Button variant="outline" onClick={handleShowSettings} className="w-full sm:w-auto bg-transparent">
                  <Settings className="mr-2 h-4 w-4" />
                  Nastaviť
                </Button>
                <Button onClick={handleAcceptAll} className="w-full sm:w-auto">
                  Prijať všetky
                </Button>
              </div>
            </div>
          ) : (
            // Detailed settings
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Cookie className="h-5 w-5 text-primary" />
                  <h3 className="text-lg font-semibold">Nastavenia cookies</h3>
                </div>
                <Button variant="ghost" size="icon" onClick={() => setShowSettings(false)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>

              <p className="text-sm text-muted-foreground">
                Vyberte, ktoré typy cookies môžeme používať. Nevyhnutné cookies nemožno vypnúť.
              </p>

              <div className="space-y-4">
                {/* Necessary cookies */}
                <div className="flex items-start justify-between gap-4 rounded-lg border p-4">
                  <div className="flex-1 space-y-1">
                    <div className="font-medium">Nevyhnutné cookies</div>
                    <p className="text-sm text-muted-foreground">
                      Potrebné pre základnú funkcionalitu webu (prihlásenie, bezpečnosť). Nemožno vypnúť.
                    </p>
                  </div>
                  <Switch checked={true} disabled />
                </div>

                {/* Functional cookies */}
                <div className="flex items-start justify-between gap-4 rounded-lg border p-4">
                  <div className="flex-1 space-y-1">
                    <div className="font-medium">Funkčné cookies</div>
                    <p className="text-sm text-muted-foreground">
                      Umožňujú rozšírené funkcie ako jazykové preferencie a používateľské nastavenia.
                    </p>
                  </div>
                  <Switch checked={preferences.functional} onCheckedChange={() => handleToggle("functional")} />
                </div>

                {/* Analytics cookies */}
                <div className="flex items-start justify-between gap-4 rounded-lg border p-4">
                  <div className="flex-1 space-y-1">
                    <div className="font-medium">Analytické cookies</div>
                    <p className="text-sm text-muted-foreground">
                      Pomáhajú nám pochopiť ako používatelia interagujú s webom a zlepšovať naše služby.
                    </p>
                  </div>
                  <Switch checked={preferences.analytics} onCheckedChange={() => handleToggle("analytics")} />
                </div>

                {/* Marketing cookies */}
                <div className="flex items-start justify-between gap-4 rounded-lg border p-4">
                  <div className="flex-1 space-y-1">
                    <div className="font-medium">Marketingové cookies</div>
                    <p className="text-sm text-muted-foreground">
                      Používajú sa na zobrazenie relevantných reklám a sledovanie efektivity kampaní.
                    </p>
                  </div>
                  <Switch checked={preferences.marketing} onCheckedChange={() => handleToggle("marketing")} />
                </div>
              </div>

              <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
                <Button variant="outline" onClick={handleRejectAll} className="w-full sm:w-auto bg-transparent">
                  Odmietnuť všetky
                </Button>
                <Button onClick={handleSavePreferences} className="w-full sm:w-auto">
                  Uložiť nastavenia
                </Button>
              </div>
            </div>
          )}
        </div>
      </Card>
    </div>
  )
}
