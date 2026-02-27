"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, TrendingDown, Lightbulb, AlertTriangle, Target, Shield, BarChart3 } from "lucide-react"

interface ProfileSummary {
  generated_at: string
  tests_count: number
  overall_score?: number
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

interface CandidateProfileSummaryReadOnlyProps {
  profileSummary: ProfileSummary
}

export function CandidateProfileSummaryReadOnly({ profileSummary }: CandidateProfileSummaryReadOnlyProps) {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="border-b border-border bg-muted/30">
        <CardTitle className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/10">
            <BarChart3 className="h-5 w-5 text-primary" />
          </div>
          <div>
            <span className="text-xl font-semibold">Celkový profil kandidáta</span>
            <p className="text-sm font-normal text-muted-foreground mt-0.5">SWOT analýza zo všetkých testov</p>
          </div>
        </CardTitle>
      </CardHeader>

      <CardContent className="p-6 space-y-6">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span>
            Dokončených testov: <strong className="text-foreground">{profileSummary.tests_count}</strong>
          </span>
        </div>

        <div className="space-y-3">
          <h3 className="font-semibold flex items-center gap-2">
            <div className="p-1.5 rounded-md bg-primary/10">
              <Target className="h-4 w-4 text-primary" />
            </div>
            SWOT analýza
          </h3>
          <div className="grid grid-cols-2 gap-3">
            {/* Strengths */}
            <div className="p-4 bg-green-500/5 rounded-lg border border-green-500/20">
              <p className="text-xs font-medium text-green-700 dark:text-green-300 mb-3 uppercase tracking-wide flex items-center gap-2">
                <TrendingUp className="h-3.5 w-3.5" />
                Silné stránky
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
                <p className="text-sm text-muted-foreground">Dokončite viac testov s dobrým výsledkom</p>
              )}
            </div>

            {/* Weaknesses */}
            <div className="p-4 bg-red-500/5 rounded-lg border border-red-500/20">
              <p className="text-xs font-medium text-red-700 dark:text-red-300 mb-3 uppercase tracking-wide flex items-center gap-2">
                <TrendingDown className="h-3.5 w-3.5" />
                Slabé stránky
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
                <p className="text-sm text-muted-foreground">Žiadne významné slabiny identifikované</p>
              )}
            </div>

            {/* Opportunities */}
            <div className="p-4 bg-blue-500/5 rounded-lg border border-blue-500/20">
              <p className="text-xs font-medium text-blue-700 dark:text-blue-300 mb-3 uppercase tracking-wide flex items-center gap-2">
                <Lightbulb className="h-3.5 w-3.5" />
                Príležitosti
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
                <p className="text-sm text-muted-foreground">Dokončite viac testov pre identifikáciu príležitostí</p>
              )}
            </div>

            {/* Threats */}
            <div className="p-4 bg-yellow-500/5 rounded-lg border border-yellow-500/20">
              <p className="text-xs font-medium text-yellow-700 dark:text-yellow-300 mb-3 uppercase tracking-wide flex items-center gap-2">
                <AlertTriangle className="h-3.5 w-3.5" />
                Hrozby
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
                <p className="text-sm text-muted-foreground">Žiadne významné hrozby identifikované</p>
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
              Dosiahnuté úrovne
            </h3>
            <div className="flex flex-wrap gap-2">
              {Object.entries(profileSummary.level_summary).map(([testName, level]) => (
                <Badge key={testName} variant="outline" className="bg-primary/5 border-primary/20">
                  <span className="text-muted-foreground mr-1">{testName}:</span>
                  <span className="font-semibold text-primary">{level}</span>
                </Badge>
              ))}
            </div>
          </div>
        )}

        <div className="pt-4 border-t border-border">
          <p className="text-xs text-muted-foreground">
            Naposledy aktualizované: {new Date(profileSummary.generated_at).toLocaleString("sk-SK")}
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
