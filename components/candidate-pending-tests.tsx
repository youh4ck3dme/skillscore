"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ClipboardList, Clock, Building2, Play, AlertCircle } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { useI18n } from "@/lib/i18n/context"

interface PendingTest {
  id: string
  company_id: string
  test_id: string
  test_name: string
  assigned_at: string
  company_name?: string
}

interface CandidatePendingTestsProps {
  candidateId: string
  onStartTest: (testId: string, assignmentId: string) => void
}

function getLocaleFromLanguage(lang: string): string {
  const localeMap: Record<string, string> = {
    sk: "sk-SK",
    en: "en-US",
    de: "de-DE",
    cs: "cs-CZ",
    pl: "pl-PL",
    hu: "hu-HU",
    fr: "fr-FR",
    es: "es-ES",
    it: "it-IT",
    pt: "pt-PT",
  }
  return localeMap[lang] || "sk-SK"
}

export function CandidatePendingTests({ candidateId, onStartTest }: CandidatePendingTestsProps) {
  const [pendingTests, setPendingTests] = useState<PendingTest[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()
  const { t, language } = useI18n()

  useEffect(() => {
    loadPendingTests()
  }, [candidateId])

  const loadPendingTests = async () => {
    try {
      const { data: profile } = await supabase.from("profiles").select("email").eq("id", candidateId).single()

      const userEmail = profile?.email

      let query = supabase
        .from("company_test_assignments")
        .select("id, company_id, test_id, test_name, assigned_at")
        .eq("status", "pending")
        .order("assigned_at", { ascending: false })

      // Build OR condition for candidate_id or candidate_email
      if (userEmail) {
        query = query.or(`candidate_id.eq.${candidateId},candidate_email.eq.${userEmail}`)
      } else {
        query = query.eq("candidate_id", candidateId)
      }

      const { data: assignments, error: assignmentsError } = await query

      if (assignmentsError) {
        console.error("Error loading test assignments:", assignmentsError)
        return
      }

      if (!assignments || assignments.length === 0) {
        setPendingTests([])
        return
      }

      // Fetch company names for all unique company IDs
      const companyIds = [...new Set(assignments.map((a) => a.company_id))]
      const { data: companies } = await supabase
        .from("company_profiles")
        .select("id, anonymous_id")
        .in("id", companyIds)

      // Fetch profiles to get company names
      const { data: profiles } = await supabase.from("profiles").select("id, company_name").in("id", companyIds)

      // Map company names to assignments
      const testsWithCompanyNames = assignments.map((assignment) => ({
        ...assignment,
        company_name:
          profiles?.find((p) => p.id === assignment.company_id)?.company_name ||
          companies?.find((c) => c.id === assignment.company_id)?.anonymous_id ||
          t("candidatePendingTests.company"),
      }))

      setPendingTests(testsWithCompanyNames)
    } catch (error) {
      console.error("Error loading pending tests:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ClipboardList className="h-5 w-5 text-primary" />
            {t("candidatePendingTests.title")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-4 text-muted-foreground">{t("candidatePendingTests.loading")}</div>
        </CardContent>
      </Card>
    )
  }

  if (pendingTests.length === 0) {
    return null // Don't show section if no pending tests
  }

  return (
    <Card className="border-orange-200 bg-orange-50/30">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ClipboardList className="h-5 w-5 text-orange-500" />
          {t("candidatePendingTests.title")}
          <Badge variant="outline" className="bg-orange-100 text-orange-700 border-orange-300">
            {t("candidatePendingTests.newCount").replace("{count}", String(pendingTests.length))}
          </Badge>
        </CardTitle>
        <CardDescription>{t("candidatePendingTests.description")}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {pendingTests.map((test) => (
            <div
              key={test.id}
              className="flex items-center justify-between p-4 bg-background border rounded-lg hover:shadow-sm transition-shadow"
            >
              <div className="flex items-center gap-4">
                <div className="h-10 w-10 rounded-full bg-orange-100 flex items-center justify-center">
                  <ClipboardList className="h-5 w-5 text-orange-600" />
                </div>
                <div>
                  <p className="font-medium">{test.test_name}</p>
                  <div className="flex items-center gap-3 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Building2 className="h-3 w-3" />
                      {test.company_name}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {new Date(test.assigned_at).toLocaleDateString(getLocaleFromLanguage(language))}
                    </span>
                  </div>
                </div>
              </div>
              <Button onClick={() => onStartTest(test.test_id, test.id)} className="bg-orange-500 hover:bg-orange-600">
                <Play className="h-4 w-4 mr-2" />
                {t("candidatePendingTests.startTest")}
              </Button>
            </div>
          ))}
        </div>

        <div className="mt-4 p-3 bg-orange-100/50 rounded-lg flex items-start gap-2">
          <AlertCircle className="h-5 w-5 text-orange-600 mt-0.5 flex-shrink-0" />
          <p className="text-sm text-orange-800">{t("candidatePendingTests.alertMessage")}</p>
        </div>
      </CardContent>
    </Card>
  )
}
