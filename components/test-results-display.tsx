"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ClipboardCheck, ChevronDown, ChevronUp, TrendingUp } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { useI18n } from "@/lib/i18n/context"
import { staticTranslations } from "@/lib/i18n/translations"
import { translateLevelAchieved } from "@/lib/i18n/level-labels"

export function TestResultsDisplay() {
  const [testResults, setTestResults] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [expandedResultId, setExpandedResultId] = useState<string | null>(null)

  const { language } = useI18n()

  const currentLang = language && staticTranslations[language as keyof typeof staticTranslations] ? language : "sk"
  const currentTranslations = staticTranslations[currentLang as keyof typeof staticTranslations]
  const t = currentTranslations?.candidateDashboard?.testResults ?? staticTranslations.sk.candidateDashboard.testResults

  const supabase = createClient()

  useEffect(() => {
    loadTestResults()
  }, [language])

  const loadTestResults = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        setLoading(false)
        return
      }

      const [resultsResponse, assessmentTestsResponse, testsResponse] = await Promise.all([
        supabase
          .from("candidate_test_results")
          .select("*")
          .eq("candidate_id", user.id)
          .order("created_at", { ascending: false }),
        supabase.from("assessment_tests").select("id, name, name_en, name_de, description, category"),
        supabase.from("tests").select("id, name, code"),
      ])

      if (resultsResponse.error) {
        console.error("[v0] Error loading test results:", resultsResponse.error)
        setLoading(false)
        return
      }

      const assessmentTestsMap = new Map<string, string>()
      if (assessmentTestsResponse.data) {
        assessmentTestsResponse.data.forEach((test: any) => {
          let displayName = test.name // SK default
          if (language === "en" && test.name_en) {
            displayName = test.name_en
          } else if (language === "de" && test.name_de) {
            displayName = test.name_de
          }
          assessmentTestsMap.set(test.id, displayName)
        })
      }

      const testsMap = new Map<string, string>()
      if (testsResponse.data) {
        testsResponse.data.forEach((test: any) => {
          testsMap.set(test.id, test.name)
        })
      }

      const mappedResults = (resultsResponse.data || []).map((result: any) => {
        const testName =
          assessmentTestsMap.get(result.assessment_test_id) ||
          testsMap.get(result.test_id) ||
          t.tests?.[result.assessment_test_id] ||
          t.tests?.[result.test_id] ||
          "Unknown test"

        return {
          id: result.id,
          test_id: result.test_id,
          assessment_test_id: result.assessment_test_id,
          test_name: testName,
          completed_at: result.completed_at,
          percentage: result.percentage,
          level_achieved: result.level_achieved,
          candidate_result_text: result.candidate_result_text,
        }
      })

      setTestResults(mappedResults)
      setLoading(false)
    } catch (error) {
      console.error("[v0] Error in loadTestResults:", error)
      setLoading(false)
    }
  }

  const toggleExpanded = (resultId: string) => {
    if (expandedResultId === resultId) {
      setExpandedResultId(null)
    } else {
      setExpandedResultId(resultId)
    }
  }

  if (loading) {
    return null
  }

  if (testResults.length === 0) {
    return (
      <Card className="p-6">
        <div className="flex items-start gap-3">
          <ClipboardCheck className="w-5 h-5 text-muted-foreground mt-0.5" />
          <div>
            <h3 className="font-semibold text-foreground mb-1">{t.title}</h3>
            <p className="text-sm text-muted-foreground">{t.empty}</p>
          </div>
        </div>
      </Card>
    )
  }

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
          <ClipboardCheck className="w-5 h-5" />
          {t.title}
        </h3>
        <Button variant="ghost" size="sm" onClick={() => setIsCollapsed(!isCollapsed)} className="h-8 w-8 p-0">
          {isCollapsed ? <ChevronDown className="h-4 w-4" /> : <ChevronUp className="h-4 w-4" />}
        </Button>
      </div>

      {!isCollapsed && (
        <div className="space-y-3">
          {testResults.map((result) => {
            const isExpanded = expandedResultId === result.id

            return (
              <Card key={result.id} className="overflow-hidden">
                <button
                  onClick={() => toggleExpanded(result.id)}
                  className="w-full p-4 flex items-center justify-between hover:bg-accent/50 transition-colors text-left"
                >
                  <div className="flex items-center gap-3">
                    <TrendingUp className="w-5 h-5 text-teal-600" />
                    <div>
                      <h4 className="font-semibold text-foreground">{result.test_name || "Test"}</h4>
                      <p className="text-sm text-muted-foreground">
                        {t.completedLabel}{" "}
                        {new Date(result.completed_at).toLocaleDateString(
                          language === "en" ? "en-US" : language === "de" ? "de-DE" : "sk-SK",
                        )}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-2xl font-bold text-teal-600">{result.percentage}%</span>
                    {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                  </div>
                </button>

                {isExpanded && (
                  <div className="p-6 pt-0 border-t">
                    <div className="mb-4 p-3 bg-teal-50 dark:bg-teal-950/20 rounded-lg">
                      <span className="text-sm text-muted-foreground">{t.levelAchieved}</span>
                      <p className="font-semibold text-teal-700 dark:text-teal-300">
                        {translateLevelAchieved(result.level_achieved, language)}
                      </p>
                    </div>

                    {result.candidate_result_text ? (
                      <div className="space-y-4">
                        <h4 className="font-semibold text-lg">{t.yourResult}</h4>
                        <div className="prose prose-sm dark:prose-invert max-w-none">
                          <p className="text-muted-foreground whitespace-pre-line">{result.candidate_result_text}</p>
                        </div>
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground italic">{t.noDetails}</p>
                    )}
                  </div>
                )}
              </Card>
            )
          })}
        </div>
      )}
    </Card>
  )
}
