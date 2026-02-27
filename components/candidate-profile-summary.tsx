"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  TrendingUp,
  TrendingDown,
  Target,
  AlertTriangle,
  Lightbulb,
  RefreshCw,
  ChevronDown,
  ChevronUp,
  Award,
  Zap,
  Shield,
  BarChart3,
} from "lucide-react"
import { useI18n } from "@/lib/i18n/context"
import { staticTranslations } from "@/lib/i18n/translations"
import { en as staticTranslationsEn } from "@/lib/i18n/translations-en"
import { de as staticTranslationsDe } from "@/lib/i18n/translations-de"
import { toast } from "@/hooks/use-toast"
import { translateLevelAchieved } from "@/lib/i18n/level-labels"

interface ProfileSummary {
  generated_at: string
  tests_count: number
  overall_score: number
  strengths: string[]
  weaknesses: string[]
  swot: {
    strengths: string[]
    weaknesses: string[]
    opportunities: string[]
    threats: string[]
  }
  level_summary: Record<string, string>
  recommendations: string[]
}

interface CandidateProfileSummaryProps {
  className?: string
}

export function CandidateProfileSummary({ className }: CandidateProfileSummaryProps) {
  const [profileSummary, setProfileSummary] = useState<ProfileSummary | null>(null)
  const [testsCount, setTestsCount] = useState(0)
  const [loading, setLoading] = useState(true)
  const [generating, setGenerating] = useState(false)
  const [isCollapsed, setIsCollapsed] = useState(false)

  const { language } = useI18n()

  const getTranslations = () => {
    if (language === "en") return staticTranslationsEn
    if (language === "de") return staticTranslationsDe
    return staticTranslations // SK default
  }

  const translations = getTranslations()
  const t = translations?.candidateDashboard?.profileSummary || {
    title: "Celkový profil kandidáta",
    subtitle: "Agregované výsledky zo všetkých testov",
    loading: "Načítavam profil...",
    empty: "Zatiaľ nemáte dokončené žiadne testy pre vygenerovanie profilu.",
    generate: "Vygenerovať profil",
    regenerate: "Aktualizovať profil",
    generating: "Generujem...",
    overallScore: "Celkové skóre",
    testsCompleted: "Dokončených testov",
    strengths: "Silné stránky",
    weaknesses: "Oblasti na zlepšenie",
    swot: {
      title: "SWOT analýza",
      strengths: "Silné stránky",
      weaknesses: "Slabé stránky",
      opportunities: "Príležitosti",
      threats: "Hrozby",
    },
    levels: "Dosiahnuté úrovne",
    recommendations: "Odporúčania",
    lastUpdated: "Naposledy aktualizované",
    noStrengths: "Žiadne silné stránky identifikované",
    noWeaknesses: "Žiadne slabé stránky identifikované",
  }

  const emptyTexts = {
    sk: {
      completeMore: "Dokončite viac testov s dobrým výsledkom",
      noWeaknesses: "Žiadne významné slabiny identifikované",
      completeForOpportunities: "Dokončite viac testov pre identifikáciu príležitostí",
      noThreats: "Žiadne významné hrozby identifikované",
      testsAvailable: "Máte dokončených",
      testsGenerate: "testov. Vygenerujte si celkový profil pre firmy.",
    },
    en: {
      completeMore: "Complete more tests with good results",
      noWeaknesses: "No significant weaknesses identified",
      completeForOpportunities: "Complete more tests to identify opportunities",
      noThreats: "No significant threats identified",
      testsAvailable: "You have completed",
      testsGenerate: "tests. Generate your overall profile for companies.",
    },
    de: {
      completeMore: "Absolvieren Sie mehr Tests mit guten Ergebnissen",
      noWeaknesses: "Keine wesentlichen Schwächen identifiziert",
      completeForOpportunities: "Absolvieren Sie mehr Tests, um Chancen zu identifizieren",
      noThreats: "Keine wesentlichen Bedrohungen identifiziert",
      testsAvailable: "Sie haben",
      testsGenerate: "Tests abgeschlossen. Generieren Sie Ihr Gesamtprofil für Unternehmen.",
    },
  }

  const et = emptyTexts[language as keyof typeof emptyTexts] || emptyTexts.sk

  useEffect(() => {
    loadProfileSummary()
  }, [])

  const loadProfileSummary = async () => {
    try {
      const res = await fetch("/api/candidate/profile-summary")
      if (res.ok) {
        const data = await res.json()
        setProfileSummary(data.profile_summary)
        setTestsCount(data.tests_count)
      }
    } catch (error) {
      console.error("[v0] Error loading profile summary:", error)
    } finally {
      setLoading(false)
    }
  }

  const generateProfile = async () => {
    setGenerating(true)
    try {
      const res = await fetch("/api/candidate/profile-summary", {
        method: "POST",
        headers: {
          "Accept-Language": language || "sk",
        },
      })

      if (res.ok) {
        const data = await res.json()
        setProfileSummary(data.profile_summary)
        toast({
          title:
            language === "en" ? "Profile generated" : language === "de" ? "Profil generiert" : "Profil vygenerovaný",
          description:
            language === "en"
              ? "Your overall profile has been successfully updated."
              : language === "de"
                ? "Ihr Gesamtprofil wurde erfolgreich aktualisiert."
                : "Váš celkový profil bol úspešne aktualizovaný.",
        })
      } else {
        const error = await res.json()
        toast({
          title: language === "en" ? "Error" : language === "de" ? "Fehler" : "Chyba",
          description:
            error.message ||
            (language === "en"
              ? "Failed to generate profile"
              : language === "de"
                ? "Profil konnte nicht generiert werden"
                : "Nepodarilo sa vygenerovať profil"),
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("[v0] Error generating profile:", error)
      toast({
        title: language === "en" ? "Error" : language === "de" ? "Fehler" : "Chyba",
        description:
          language === "en"
            ? "Failed to generate profile"
            : language === "de"
              ? "Profil konnte nicht generiert werden"
              : "Nepodarilo sa vygenerovať profil",
        variant: "destructive",
      })
    } finally {
      setGenerating(false)
    }
  }

  if (loading) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-primary/10">
              <BarChart3 className="h-5 w-5 text-primary" />
            </div>
            {t.title}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2">
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
            <p className="text-muted-foreground">{t.loading}</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (testsCount === 0) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-primary/10">
              <BarChart3 className="h-5 w-5 text-primary" />
            </div>
            {t.title}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">{t.empty}</p>
        </CardContent>
      </Card>
    )
  }

  if (!profileSummary && testsCount > 0) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-primary/10">
              <BarChart3 className="h-5 w-5 text-primary" />
            </div>
            {t.title}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            {et.testsAvailable} {testsCount} {et.testsGenerate}
          </p>
          <Button onClick={generateProfile} disabled={generating}>
            {generating ? (
              <>
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                {t.generating}
              </>
            ) : (
              <>
                <Zap className="mr-2 h-4 w-4" />
                {t.generate}
              </>
            )}
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className={`${className} hover:shadow-md transition-shadow`}>
      <CardHeader className="border-b border-border bg-muted/30">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <BarChart3 className="h-5 w-5 text-primary" />
            </div>
            <div>
              <span className="text-xl font-semibold">{t.title}</span>
              <p className="text-sm font-normal text-muted-foreground mt-0.5">{t.subtitle}</p>
            </div>
          </CardTitle>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={generateProfile}
              disabled={generating}
              className="h-8 bg-transparent"
            >
              {generating ? <RefreshCw className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
            </Button>
            <Button variant="ghost" size="sm" onClick={() => setIsCollapsed(!isCollapsed)} className="h-9 w-9 p-0">
              {isCollapsed ? <ChevronDown className="h-4 w-4" /> : <ChevronUp className="h-4 w-4" />}
            </Button>
          </div>
        </div>
      </CardHeader>

      {!isCollapsed && profileSummary && (
        <CardContent className="p-6 space-y-6">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Award className="h-4 w-4 text-primary" />
            <span>
              {t.testsCompleted}: <strong className="text-foreground">{profileSummary.tests_count}</strong>
            </span>
          </div>

          <div className="space-y-3">
            <h3 className="font-semibold flex items-center gap-2">
              <div className="p-1.5 rounded-md bg-primary/10">
                <Target className="h-4 w-4 text-primary" />
              </div>
              {t.swot.title}
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {/* Strengths */}
              <div className="p-4 bg-green-500/5 rounded-lg border border-green-500/20">
                <p className="text-xs font-medium text-green-700 dark:text-green-300 mb-3 uppercase tracking-wide flex items-center gap-2">
                  <TrendingUp className="h-3.5 w-3.5" />
                  {t.swot.strengths}
                </p>
                {profileSummary.swot.strengths.length > 0 ? (
                  <ul className="space-y-2">
                    {profileSummary.swot.strengths.map((s, i) => (
                      <li key={i} className="text-sm text-foreground flex items-start gap-2">
                        <span className="text-green-500 mt-0.5 font-bold">+</span>
                        <span>{s}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-muted-foreground">{et.completeMore}</p>
                )}
              </div>

              {/* Weaknesses */}
              <div className="p-4 bg-red-500/5 rounded-lg border border-red-500/20">
                <p className="text-xs font-medium text-red-700 dark:text-red-300 mb-3 uppercase tracking-wide flex items-center gap-2">
                  <TrendingDown className="h-3.5 w-3.5" />
                  {t.swot.weaknesses}
                </p>
                {profileSummary.swot.weaknesses.length > 0 ? (
                  <ul className="space-y-2">
                    {profileSummary.swot.weaknesses.map((w, i) => (
                      <li key={i} className="text-sm text-foreground flex items-start gap-2">
                        <span className="text-red-500 mt-0.5 font-bold">-</span>
                        <span>{w}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-muted-foreground">{et.noWeaknesses}</p>
                )}
              </div>

              {/* Opportunities */}
              <div className="p-4 bg-blue-500/5 rounded-lg border border-blue-500/20">
                <p className="text-xs font-medium text-blue-700 dark:text-blue-300 mb-3 uppercase tracking-wide flex items-center gap-2">
                  <Lightbulb className="h-3.5 w-3.5" />
                  {t.swot.opportunities}
                </p>
                {profileSummary.swot.opportunities.length > 0 ? (
                  <ul className="space-y-2">
                    {profileSummary.swot.opportunities.map((o, i) => (
                      <li key={i} className="text-sm text-foreground flex items-start gap-2">
                        <Lightbulb className="h-3.5 w-3.5 text-blue-500 mt-0.5 flex-shrink-0" />
                        <span>{o}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-muted-foreground">{et.completeForOpportunities}</p>
                )}
              </div>

              {/* Threats */}
              <div className="p-4 bg-yellow-500/5 rounded-lg border border-yellow-500/20">
                <p className="text-xs font-medium text-yellow-700 dark:text-yellow-300 mb-3 uppercase tracking-wide flex items-center gap-2">
                  <AlertTriangle className="h-3.5 w-3.5" />
                  {t.swot.threats}
                </p>
                {profileSummary.swot.threats.length > 0 ? (
                  <ul className="space-y-2">
                    {profileSummary.swot.threats.map((threat, i) => (
                      <li key={i} className="text-sm text-foreground flex items-start gap-2">
                        <AlertTriangle className="h-3.5 w-3.5 text-yellow-500 mt-0.5 flex-shrink-0" />
                        <span>{threat}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-muted-foreground">{et.noThreats}</p>
                )}
              </div>
            </div>
          </div>

          {Object.keys(profileSummary.level_summary).length > 0 && (
            <div className="space-y-3">
              <h3 className="font-semibold flex items-center gap-2">
                <div className="p-1.5 rounded-md bg-primary/10">
                  <Shield className="h-4 w-4 text-primary" />
                </div>
                {t.levels}
              </h3>
              <div className="flex flex-wrap gap-2">
                {Object.entries(profileSummary.level_summary).map(([testName, level]) => (
                  <Badge key={testName} variant="outline" className="bg-primary/5 border-primary/20">
                    <span className="text-muted-foreground mr-1">{testName}:</span>
                    <span className="font-semibold text-primary">{translateLevelAchieved(level, language)}</span>
                  </Badge>
                ))}
              </div>
            </div>
          )}

          <div className="pt-4 border-t border-border">
            <p className="text-xs text-muted-foreground">
              {t.lastUpdated}:{" "}
              {new Date(profileSummary.generated_at).toLocaleString(
                language === "en" ? "en-US" : language === "de" ? "de-DE" : "sk-SK",
              )}
            </p>
          </div>
        </CardContent>
      )}
    </Card>
  )
}
