"use client"

import { useState, useEffect } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/lib/auth/auth-context"
import { CandidateQuickNav } from "@/components/candidate-quick-nav"
import { CVModal } from "@/components/cv-modal"
import { SupportTicketModal } from "@/components/support-ticket-modal"
import { ContactSettingsInfo } from "@/components/contact-settings-info"
import { toast } from "@/hooks/use-toast"
import { CandidateInfoBanner } from "@/components/candidate-info-banner"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useI18n } from "@/lib/i18n/context"
import { staticTranslations } from "@/lib/i18n/translations"
import { CVSummaryDisplay } from "@/components/cv-summary-display"
import { TestResultsDisplay } from "@/components/test-results-display"
import { Check, Award } from "lucide-react"
import useSWR from "swr"
import { TestFlowModals } from "@/components/test-flow-modals"
import { CandidatePendingTests } from "@/components/candidate-pending-tests"

const TEST_NAMES: Record<string, { sk: string; en: string; de: string }> = {
  "test-digi": { sk: "Digitálne zručnosti", en: "Digital Skills", de: "Digitale Fähigkeiten" },
  "test-job-skills": { sk: "Pracovné zručnosti", en: "Job Skills", de: "Berufliche Fähigkeiten" },
  "test-lang": { sk: "Jazykové testy", en: "Language Tests", de: "Sprachtests" },
  "test-sjt": { sk: "Situačný test", en: "Situational Judgment", de: "Situationsbeurteilung" },
  "test-it": { sk: "IT schopnosti", en: "IT Skills", de: "IT-Fähigkeiten" },
  "test-it-user": { sk: "IT schopnosti", en: "IT Skills", de: "IT-Fähigkeiten" },
  "test-lognum": { sk: "Logicko-numerický", en: "Logical-Numerical", de: "Logisch-numerisch" },
  "test-verbal": { sk: "Verbálne schopnosti", en: "Verbal Skills", de: "Verbale Fähigkeiten" },
  "test-detail": { sk: "Pozornosť k detailom", en: "Attention to Detail", de: "Aufmerksamkeit für Details" },
  "test-plan": { sk: "Plánovanie", en: "Planning", de: "Planung" },
  "test-dataentry": { sk: "Zadávanie dát", en: "Data Entry", de: "Dateneingabe" },
  "test-co-sjt": { sk: "Kognitívny SJT", en: "Cognitive SJT", de: "Kognitiver SJT" },
  "test-sjt-advanced": { sk: "Kognitívny SJT", en: "Cognitive SJT", de: "Kognitiver SJT" },
  "test-ohs": { sk: "BOZP", en: "Health & Safety", de: "Arbeitssicherheit" },
  "test-worksample": { sk: "Pracovná vzorka", en: "Work Sample", de: "Arbeitsprobe" },
  "ret-engagement": { sk: "Angažovanosť", en: "Engagement", de: "Engagement" },
  "ret-motivators": { sk: "Motivátory", en: "Motivators", de: "Motivatoren" },
  "ret-risk": { sk: "Retenčné riziko", en: "Retention Risk", de: "Retentionsrisiko" },
  "ret-stress": { sk: "Stres a vyhorenie", en: "Stress & Burnout", de: "Stress und Burnout" },
  "ret-career": { sk: "Kariérny rast", en: "Career Growth", de: "Karrierewachstum" },
  "ret-manager": { sk: "Vzťah s manažérom", en: "Manager Relationship", de: "Manager-Beziehung" },
  "ret-communication": { sk: "Komunikačná klíma", en: "Communication Climate", de: "Kommunikationsklima" },
  "ret-environment": { sk: "Pracovné prostredie", en: "Work Environment", de: "Arbeitsumgebung" },
}

const ASSESSMENT_TO_TEST_CODE: Record<string, string> = {
  DIGITAL_SKILLS: "test-digi",
  IT_SKILLS: "test-it-user",
  LANGUAGE_SKILLS: "test-lang",
  JOB_SKILLS: "test-job-skills",
  SJT_BASIC: "test-sjt",
  SJT_COGNITIVE: "test-co-sjt",
  VERBAL_SKILLS: "test-verbal",
  PLANNING: "test-plan",
  DATA_ENTRY: "test-dataentry",
  SAFETY_BOZP: "test-ohs",
  WORK_SAMPLE: "test-worksample",
  LOGICAL_NUMERICAL: "test-lognum",
  ATTENTION_DETAIL: "test-detail",
  RET_ENGAGEMENT: "ret-engagement",
  RET_MOTIVATORS: "ret-motivators",
  RET_RISK: "ret-risk",
  RET_STRESS_BURNOUT: "ret-stress",
  RET_CAREER_GROWTH: "ret-career",
  RET_MANAGER_RELATIONSHIP: "ret-manager",
  RET_COMMUNICATION_CLIMATE: "ret-communication",
  RET_WORK_ENVIRONMENT: "ret-environment",
}

interface DashboardData {
  profile: {
    first_name: string | null
    last_name: string | null
    email: string
  }
  cv: {
    completed: boolean
    progress: number
    work_experience: any[]
    languages: any[]
    computer_skills: any[]
    cv_summary: any
  }
  contact_settings: {
    auto_contact_enabled: boolean
  }
  test_descriptions?: Record<string, string>
}

const fetcher = async (url: string) => {
  const res = await fetch(url)
  if (!res.ok) {
    if (res.status === 429) {
      throw new Error("Too many requests. Please wait a moment.")
    }
    throw new Error("Failed to fetch data")
  }
  return res.json()
}

export default function CandidateDashboard() {
  const { user } = useAuth()
  const router = useRouter()
  const i18nContext = useI18n()
  const language = i18nContext?.language || "sk"

  const currentLang = (language && ["sk", "en", "de"].includes(language) ? language : "sk") as "sk" | "en" | "de"
  const t = staticTranslations[currentLang]?.candidateDashboard || staticTranslations.sk.candidateDashboard
  const ui = staticTranslations[currentLang]?.ui || staticTranslations.sk.ui

  const [cvModalOpen, setCvModalOpen] = useState(false)
  const [cvEditMode, setCvEditMode] = useState(false)
  const [testFlowModal, setTestFlowModal] = useState<{ code: string; name: string } | null>(null)

  const {
    data: dashboardData,
    error,
    mutate,
  } = useSWR<DashboardData>("/api/candidate/dashboard", fetcher, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    dedupingInterval: 30000,
    refreshInterval: 0,
  })

  const handleCVCompleted = () => {
    mutate()
  }

  const handleTestClick = (testCode: string, isCompleted: boolean) => {
    if (isCompleted) {
      toast({
        title: t.testResults?.completedStatus || "Detail výsledku",
        description: t.testResults?.noDetails || `Zobrazenie detailu testu ${testCode} bude čoskoro k dispozícii`,
      })
    } else {
      toast({
        title: t.testResults?.title || "Spustenie testu",
        description: `${t.testResults?.title || "Test"} ${testCode}`,
      })
    }
  }

  const getTestName = (testCode: string): string => {
    const names = TEST_NAMES[testCode]
    if (names) {
      return names[currentLang] || names.sk
    }
    return testCode
  }

  const handleNavigate = (action: string) => {
    if (TEST_NAMES[action]) {
      setTestFlowModal({
        code: action,
        name: getTestName(action),
      })
      return
    }

    switch (action) {
      case "cv":
        setCvEditMode(false)
        setCvModalOpen(true)
        break
      case "edit-cv":
        setCvEditMode(true)
        setCvModalOpen(true)
        break
      case "view-cv":
        toast({ title: ui.toast.cvPreview.title, description: ui.toast.cvPreview.description })
        break
      case "download-cv":
        toast({ title: ui.toast.cvDownload.title, description: ui.toast.cvDownload.description })
        break
      case "core-tests":
        toast({ title: ui.toast.testsCore.title, description: ui.toast.testsCore.description })
        break
      case "advanced-tests":
        toast({ title: ui.toast.testsAdvanced.title, description: ui.toast.testsAdvanced.description })
        break
      case "edit-profile":
      case "settings":
        router.push("/dashboard/candidate/settings")
        break
      default:
        break
    }
  }

  const handleCVComplete = () => {
    mutate()
  }

  const handleStartPendingTest = (testId: string, assignmentId: string) => {
    const testCode = ASSESSMENT_TO_TEST_CODE[testId]
    if (testCode) {
      router.push(`/tests/${testCode}?assignmentId=${assignmentId}`)
    } else {
      toast({
        title: ui.toast.testLaunch.title,
        description: `Test ${testId} nie je dostupný`,
        variant: "destructive",
      })
    }
  }

  useEffect(() => {
    window.addEventListener("cv-completed", handleCVCompleted)
    window.addEventListener("cv-updated", handleCVCompleted)

    return () => {
      window.removeEventListener("cv-completed", handleCVCompleted)
      window.removeEventListener("cv-updated", handleCVCompleted)
    }
  }, [])

  if (error) {
    return (
      <DashboardLayout requireVerification={false}>
        <div className="container mx-auto py-6 sm:py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <p className="text-muted-foreground mb-4">{error.message}</p>
              <button onClick={() => mutate()} className="text-primary hover:underline">
                {t.profileSummary?.regenerate || "Skúsiť znova"}
              </button>
            </div>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  if (!dashboardData) {
    return (
      <DashboardLayout requireVerification={false}>
        <div className="container mx-auto py-6 sm:py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">{t.profileSummary?.loading || "Načítavam dashboard..."}</p>
            </div>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  const { profile, cv, contact_settings, test_descriptions } = dashboardData

  const transformedCVData = cv.cv_summary
    ? {
      work_experience: cv.work_experience || cv.cv_summary.work_experience || [],
      desired_positions: cv.cv_summary.desired_positions || [],
      languages: cv.languages || cv.cv_summary.skills?.languages || [],
      computer_skills: cv.computer_skills || cv.cv_summary.skills?.computer_skills || [],
      country: cv.cv_summary.basic_info?.country || null,
      work_locations: cv.cv_summary.basic_info?.work_locations || [],
      expected_salary: cv.cv_summary.expected_salary || null,
      drivers_license: cv.cv_summary.work_conditions?.driving_license || false,
      license_types: cv.cv_summary.work_conditions?.license_types || [],
      employment_type: cv.cv_summary.work_conditions?.employment_types
        ? Array.isArray(cv.cv_summary.work_conditions.employment_types)
          ? cv.cv_summary.work_conditions.employment_types.join(", ")
          : cv.cv_summary.work_conditions.employment_types
        : null,
      start_date: cv.cv_summary.work_conditions?.start_date || null,
      eu_citizenship: cv.cv_summary.basic_info?.eu_citizenship || false,
      education_level: cv.cv_summary.education?.level || null,
      study_field: cv.cv_summary.education?.fieldOfStudy || null,
      academic_title: cv.cv_summary.education?.academic_title || null,
      anonymous_id: cv.cv_summary.anonymous_id || null,
      recruiter_id: cv.cv_summary.recruiter_id || null,
    }
    : {
      work_experience: cv.work_experience || [],
      languages: cv.languages || [],
      computer_skills: cv.computer_skills || [],
    }

  return (
    <DashboardLayout requireVerification={false}>
      <header className="border-b border-border bg-card -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto py-4 flex items-center justify-between">
          <h1 className="text-xl font-semibold">{t.title}</h1>
          <div className="flex items-center gap-4">
            <Link href="/dashboard/worker/tests">
              <Button variant="outline" size="sm" className="gap-2">
                <Award className="h-4 w-4 text-primary" />
                Všetky testy
              </Button>
            </Link>
            <SupportTicketModal userType="candidate" />
          </div>
        </div>
      </header>

      <div className="container mx-auto py-6 sm:py-8">
        <div className="mb-6">
          {profile.first_name ? (
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">
              {t.greeting} <Check className="inline-block w-7 h-7 text-green-500" strokeWidth={3} />
              {t.greetingSuffix}, {profile.first_name}!
            </h2>
          ) : (
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">
              {t.greeting} <Check className="inline-block w-7 h-7 text-green-500" strokeWidth={3} />
              {t.greetingSuffix}!{" "}
              <Link href="/dashboard/candidate/settings" className="text-primary hover:underline text-lg">
                {t.settings?.personalInfo?.title || "Osobné údaje"}
              </Link>
            </h2>
          )}
          <p className="text-muted-foreground">{t.settings?.description || "Spravujte svoj profil a nastavenia"}</p>
        </div>

        <CandidateInfoBanner />

        <ContactSettingsInfo autoContactEnabled={contact_settings.auto_contact_enabled} />

        {user?.id && (
          <div className="mb-6">
            <CandidatePendingTests candidateId={user.id} onStartTest={handleStartPendingTest} />
          </div>
        )}

        <CandidateQuickNav
          onNavigate={handleNavigate}
          cvProgress={cv.progress}
          testsProgress={0}
          cvCompleted={cv.completed}
          cvData={{
            work_experience: cv.work_experience,
            languages: cv.languages,
            computer_skills: cv.computer_skills,
            cv_summary: cv.cv_summary,
          }}
          testDescriptions={test_descriptions || {}}
        />

        <div className="mt-6">
          <CVSummaryDisplay cvData={transformedCVData} loading={!dashboardData} />
        </div>

        <div className="mt-6">
          <TestResultsDisplay />
        </div>
      </div>

      {testFlowModal && (
        <TestFlowModals
          testCode={testFlowModal.code}
          testName={testFlowModal.name}
          onClose={() => setTestFlowModal(null)}
        />
      )}

      <CVModal open={cvModalOpen} onOpenChange={setCvModalOpen} onComplete={handleCVComplete} editMode={cvEditMode} />
    </DashboardLayout>
  )
}
