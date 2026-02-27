"use client"

import { useState, useEffect, useRef, Suspense } from "react"
import { useRouter, useSearchParams, useParams } from "next/navigation"
import { TestInterface, type TestQuestion } from "@/components/test-engine/test-interface"
import { TestLevelSelector } from "@/components/test-level-selector"
import { LanguageTestSelector } from "@/components/language-test-selector"
import { ITTestSelector } from "@/components/it-test-selector"
import { JobSkillsTestSelector } from "@/components/job-skills-test-selector"
import { TestInfoModal } from "@/components/test-info-modal"
import { ProctoringModal } from "@/components/proctoring-modal"
import testsInfoData from "@/lib/data/tests-info-sk.json"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Loader2, CheckCircle2, AlertCircle } from "lucide-react"
import { useI18n } from "@/lib/i18n/context"

type TestFlowType = "SIMPLE_LEVEL" | "CV_IT_LEVEL" | "CV_LANG_LEVEL" | "CV_JOB_LEVEL" | "DIRECT"

interface TestConfig {
  dbId: string
  name: { sk: string; en: string; de: string }
  description: { sk: string; en: string; de: string }
  flowType: TestFlowType
}

const TEST_CONFIG: Record<string, TestConfig> = {
  // === ZÁKLADNÉ (5) ===
  "test-digi": {
    dbId: "DIGITAL_SKILLS",
    name: { sk: "Digitálne zručnosti", en: "Digital Skills", de: "Digitale Fähigkeiten" },
    description: {
      sk: "Testuje vaše znalosti v oblasti digitálnej gramotnosti",
      en: "Tests your knowledge in digital literacy",
      de: "Testet Ihre Kenntnisse im Bereich der digitalen Kompetenz",
    },
    flowType: "SIMPLE_LEVEL",
  },
  "test-it": {
    dbId: "IT_USER",
    name: { sk: "IT schopnosti", en: "IT Skills", de: "IT-Fähigkeiten" },
    description: {
      sk: "Overenie IT zručností používateľa",
      en: "Verification of user IT skills",
      de: "Überprüfung der IT-Fähigkeiten des Benutzers",
    },
    flowType: "CV_IT_LEVEL",
  },
  "test-it-user": {
    dbId: "IT_USER",
    name: { sk: "IT schopnosti", en: "IT Skills", de: "IT-Fähigkeiten" },
    description: {
      sk: "Overenie IT zručností používateľa",
      en: "Verification of user IT skills",
      de: "Überprüfung der IT-Fähigkeiten des Benutzers",
    },
    flowType: "CV_IT_LEVEL",
  },
  "test-lang": {
    dbId: "LANGUAGE",
    name: { sk: "Jazykové zručnosti", en: "Language Skills", de: "Sprachkenntnisse" },
    description: {
      sk: "Overenie jazykových znalostí",
      en: "Verification of language skills",
      de: "Überprüfung der Sprachkenntnisse",
    },
    flowType: "CV_LANG_LEVEL",
  },
  "test-job-skills": {
    dbId: "JOB_SKILLS",
    name: { sk: "Pracovné zručnosti", en: "Job Skills", de: "Berufliche Fähigkeiten" },
    description: {
      sk: "Test pracovných zručností pre vašu pozíciu",
      en: "Job skills test for your position",
      de: "Berufliche Fähigkeiten Test für Ihre Position",
    },
    flowType: "CV_JOB_LEVEL",
  },
  "test-sjt": {
    dbId: "SJT_BASIC",
    name: { sk: "Situačný test", en: "Situational Test", de: "Situationstest" },
    description: {
      sk: "Hodnotenie rozhodovania v pracovných situáciách",
      en: "Assessment of decision-making in work situations",
      de: "Bewertung der Entscheidungsfindung in Arbeitssituationen",
    },
    flowType: "SIMPLE_LEVEL",
  },

  // === POKROČILÉ (8) ===
  "test-sjt-advanced": {
    dbId: "SJT_COGNITIVE",
    name: { sk: "Kognitívny SJT", en: "Cognitive SJT", de: "Kognitiver SJT" },
    description: {
      sk: "Pokročilé situačné rozhodovanie",
      en: "Advanced situational decision-making",
      de: "Fortgeschrittene situative Entscheidungsfindung",
    },
    flowType: "SIMPLE_LEVEL",
  },
  "test-co-sjt": {
    dbId: "SJT_COGNITIVE",
    name: { sk: "Kognitívny SJT", en: "Cognitive SJT", de: "Kognitiver SJT" },
    description: {
      sk: "Pokročilé situačné rozhodovanie",
      en: "Advanced situational decision-making",
      de: "Fortgeschrittene situative Entscheidungsfindung",
    },
    flowType: "SIMPLE_LEVEL",
  },
  "test-verbal": {
    dbId: "VERBAL_SKILLS",
    name: { sk: "Verbálne schopnosti", en: "Verbal Skills", de: "Verbale Fähigkeiten" },
    description: {
      sk: "Porozumenie textu a verbálne myslenie",
      en: "Text comprehension and verbal reasoning",
      de: "Textverständnis und verbales Denken",
    },
    flowType: "SIMPLE_LEVEL",
  },
  "test-plan": {
    dbId: "PLANNING",
    name: { sk: "Plánovanie", en: "Planning", de: "Planung" },
    description: {
      sk: "Schopnosť plánovať a organizovať prácu",
      en: "Ability to plan and organize work",
      de: "Fähigkeit zur Planung und Organisation der Arbeit",
    },
    flowType: "SIMPLE_LEVEL",
  },
  "test-dataentry": {
    dbId: "DATA_ENTRY",
    name: { sk: "Zadávanie dát", en: "Data Entry", de: "Dateneingabe" },
    description: {
      sk: "Rýchlosť a presnosť pri zadávaní údajov",
      en: "Speed and accuracy in data entry",
      de: "Geschwindigkeit und Genauigkeit bei der Dateneingabe",
    },
    flowType: "SIMPLE_LEVEL",
  },
  "test-ohs": {
    dbId: "SAFETY_BOZP",
    name: { sk: "BOZP", en: "Occupational Safety", de: "Arbeitssicherheit" },
    description: {
      sk: "Bezpečnosť a ochrana zdravia pri práci",
      en: "Occupational health and safety",
      de: "Arbeitssicherheit und Gesundheitsschutz",
    },
    flowType: "SIMPLE_LEVEL",
  },
  "test-worksample": {
    dbId: "WORK_SAMPLE",
    name: { sk: "Pracovná vzorka", en: "Work Sample", de: "Arbeitsprobe" },
    description: {
      sk: "Simulácia reálnej pracovnej úlohy",
      en: "Simulation of a real work task",
      de: "Simulation einer realen Arbeitsaufgabe",
    },
    flowType: "SIMPLE_LEVEL",
  },
  "test-lognum": {
    dbId: "LOGICAL_NUMERICAL",
    name: { sk: "Logicko-numerický", en: "Logical-Numerical", de: "Logisch-Numerisch" },
    description: {
      sk: "Logické a numerické myslenie",
      en: "Logical and numerical thinking",
      de: "Logisches und numerisches Denken",
    },
    flowType: "SIMPLE_LEVEL",
  },
  "test-detail": {
    dbId: "ATTENTION_DETAIL",
    name: { sk: "Pozornosť k detailom", en: "Attention to Detail", de: "Aufmerksamkeit für Details" },
    description: {
      sk: "Presnosť a pozornosť pri práci",
      en: "Accuracy and attention at work",
      de: "Genauigkeit und Aufmerksamkeit bei der Arbeit",
    },
    flowType: "SIMPLE_LEVEL",
  },

  // === RETENČNÉ (9) - DIRECT flow bez selectora ===
  "ret-engagement": {
    dbId: "RET_ENGAGEMENT",
    name: { sk: "Angažovanosť", en: "Engagement", de: "Engagement" },
    description: {
      sk: "Miera zapojenia a angažovanosti v práci",
      en: "Level of involvement and engagement at work",
      de: "Grad der Beteiligung und des Engagements bei der Arbeit",
    },
    flowType: "DIRECT",
  },
  "ret-motivators": {
    dbId: "RET_MOTIVATORS",
    name: { sk: "Motivátory", en: "Motivators", de: "Motivatoren" },
    description: {
      sk: "Čo vás motivuje v práci",
      en: "What motivates you at work",
      de: "Was motiviert Sie bei der Arbeit",
    },
    flowType: "DIRECT",
  },
  "ret-risk": {
    dbId: "RET_RISK",
    name: { sk: "Retenčné riziko", en: "Retention Risk", de: "Retentionsrisiko" },
    description: {
      sk: "Identifikácia rizika odchodu",
      en: "Identification of departure risk",
      de: "Identifizierung des Abgangsrisikos",
    },
    flowType: "DIRECT",
  },
  "ret-stress": {
    dbId: "RET_STRESS_BURNOUT",
    name: { sk: "Stres a vyhorenie", en: "Stress and Burnout", de: "Stress und Burnout" },
    description: {
      sk: "Miera stresu a riziko vyhorenia",
      en: "Stress level and burnout risk",
      de: "Stressniveau und Burnout-Risiko",
    },
    flowType: "DIRECT",
  },
  "ret-career": {
    dbId: "RET_CAREER_GROWTH",
    name: { sk: "Kariérny rast", en: "Career Growth", de: "Karrierewachstum" },
    description: {
      sk: "Ambície a očakávania kariérneho rastu",
      en: "Ambitions and career growth expectations",
      de: "Ambitionen und Erwartungen an das Karrierewachstum",
    },
    flowType: "DIRECT",
  },
  "ret-manager": {
    dbId: "RET_MANAGER_RELATIONSHIP",
    name: { sk: "Vzťah s manažérom", en: "Manager Relationship", de: "Beziehung zum Manager" },
    description: {
      sk: "Kvalita vzťahu s priamym nadriadeným",
      en: "Quality of relationship with direct supervisor",
      de: "Qualität der Beziehung zum direkten Vorgesetzten",
    },
    flowType: "DIRECT",
  },
  "ret-communication": {
    dbId: "RET_COMMUNICATION_CLIMATE",
    name: { sk: "Komunikačná klíma", en: "Communication Climate", de: "Kommunikationsklima" },
    description: {
      sk: "Kvalita komunikácie v tíme a firme",
      en: "Quality of communication in team and company",
      de: "Qualität der Kommunikation im Team und Unternehmen",
    },
    flowType: "DIRECT",
  },
  "ret-environment": {
    dbId: "RET_WORK_ENVIRONMENT",
    name: {
      sk: "Pracovné prostredie a spokojnosť",
      en: "Work Environment and Satisfaction",
      de: "Arbeitsumfeld und Zufriedenheit",
    },
    description: {
      sk: "Spokojnosť s pracovným prostredím",
      en: "Satisfaction with work environment",
      de: "Zufriedenheit mit dem Arbeitsumfeld",
    },
    flowType: "DIRECT",
  },
}

function UniversalTestContent({ testCode }: { testCode: string }) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const params = useParams()
  const { t, language } = useI18n()

  const currentLang = (language || "sk") as "sk" | "en" | "de"

  const [testConfig, setTestConfig] = useState<TestConfig | null>(null)
  const [showSelector, setShowSelector] = useState(false)
  const [testSession, setTestSession] = useState<any>(null)
  const [questions, setQuestions] = useState<TestQuestion[]>([])
  const [loading, setLoading] = useState(true)
  const [testComplete, setTestComplete] = useState(false)
  const [results, setResults] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)
  const [selectedLevel, setSelectedLevel] = useState<string | null>(null)

  const [showInfoModal, setShowInfoModal] = useState(false)
  const [showProctoringModal, setShowProctoringModal] = useState(false)
  const [infoModalShown, setInfoModalShown] = useState(searchParams.get("skip_modals") === "true")

  const testStartedRef = useRef(false)
  const errorOccurredRef = useRef(false)

  // Get test info from JSON for info modal
  const testInfoRaw = (testsInfoData as Record<string, any>)[testCode] || null
  // Transform to expected format for TestInfoModal
  const testExplanation = testInfoRaw
    ? {
        why_take: testInfoRaw.why_text || "",
        what_it_checks: testInfoRaw.what_points || [],
      }
    : null

  const getLocalizedName = (config: TestConfig) => config.name[currentLang] || config.name.sk
  const getLocalizedDescription = (config: TestConfig) => config.description[currentLang] || config.description.sk

  useEffect(() => {
    const config = TEST_CONFIG[testCode]
    if (!config) {
      setError(t("testPage.testNotFound").replace("{code}", testCode))
      setLoading(false)
      return
    }
    setTestConfig(config)

    if (searchParams.get("level")) {
      setSelectedLevel(searchParams.get("level"))
    }
  }, [testCode, searchParams, t])

  useEffect(() => {
    if (!testConfig) return
    if (testStartedRef.current) return
    if (errorOccurredRef.current) return

    const effectiveLevel = selectedLevel

    switch (testConfig.flowType) {
      case "DIRECT":
        if (searchParams.get("skip_modals") === "true") {
          testStartedRef.current = true
          startTest({ dbTestId: testConfig.dbId, level: "standard" })
        } else if (!infoModalShown && testExplanation) {
          setShowInfoModal(true)
          setLoading(false)
        } else if (infoModalShown) {
          testStartedRef.current = true
          startTest({ dbTestId: testConfig.dbId, level: "standard" })
        } else {
          // No info available, go straight to proctoring
          setShowProctoringModal(true)
          setLoading(false)
        }
        break

      case "SIMPLE_LEVEL":
        if (effectiveLevel) {
          testStartedRef.current = true
          startTest({ dbTestId: testConfig.dbId, level: effectiveLevel })
        } else {
          setShowSelector(true)
          setLoading(false)
        }
        break

      case "CV_LANG_LEVEL":
        if (searchParams.get("lang") && searchParams.get("langLevel")) {
          testStartedRef.current = true
          const dbTestId = `LANGUAGE_${searchParams.get("lang")!.toUpperCase()}_${searchParams.get("langLevel")!.toUpperCase()}`
          startTest({ dbTestId, level: "standard" })
        } else {
          setShowSelector(true)
          setLoading(false)
        }
        break

      case "CV_IT_LEVEL":
        if (effectiveLevel && ["L1", "L2", "L3", "L4"].includes(effectiveLevel.toUpperCase())) {
          testStartedRef.current = true
          const dbTestId = `IT_USER_${effectiveLevel.toUpperCase()}`
          startTest({ dbTestId, level: "standard" })
        } else {
          setShowSelector(true)
          setLoading(false)
        }
        break

      case "CV_JOB_LEVEL":
        if (effectiveLevel) {
          testStartedRef.current = true
          let dbTestId = "JOB_SKILLS"
          if (searchParams.get("category")) {
            dbTestId = `JOB_SKILLS_${searchParams.get("category")!.toUpperCase()}`
          }
          startTest({ dbTestId, level: effectiveLevel })
        } else {
          setShowSelector(true)
          setLoading(false)
        }
        break

      default:
        setShowSelector(true)
        setLoading(false)
    }
  }, [testConfig, selectedLevel, searchParams])

  const handleProctoringAccept = () => {
    setShowProctoringModal(false)
    setInfoModalShown(true)
  }

  const handleInfoModalClose = () => {
    setShowInfoModal(false)
    setShowProctoringModal(true)
  }

  const startTest = async ({ dbTestId, level }: { dbTestId: string; level: string }) => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch("/api/candidate/tests/start", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept-Language": language || "sk",
        },
        body: JSON.stringify({ dbTestId, level }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || t("testPage.errorStartFailed"))
      }

      const data = await response.json()

      setTestSession(data.session)
      setQuestions(data.questions || [])
      setShowSelector(false)
      setLoading(false)
    } catch (err: any) {
      console.error("Error starting test:", err)
      setError(err.message || `${t("testPage.errorStartFailed")}. ${t("testPage.tryAgain")}`)
      setLoading(false)
      errorOccurredRef.current = true
    }
  }

  const handleTestComplete = async (answers: any[]) => {
    try {
      setLoading(true)
      const response = await fetch("/api/candidate/tests/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept-Language": language || "sk",
        },
        body: JSON.stringify({
          sessionId: testSession.id,
          answers,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || t("testPage.errorSubmitFailed"))
      }

      const data = await response.json()
      setResults(data.results)
      setTestComplete(true)
    } catch (err: any) {
      console.error("[v0] Error submitting test:", err)
      setError(err.message || `${t("testPage.errorSubmitFailed")}. ${t("testPage.tryAgain")}`)
    } finally {
      setLoading(false)
    }
  }

  const handleSelectorSubmit = (params: { level?: string; lang?: string; langLevel?: string; category?: string }) => {
    const url = new URL(window.location.href)
    if (params.level) url.searchParams.set("level", params.level)
    if (params.lang) url.searchParams.set("lang", params.lang)
    if (params.langLevel) url.searchParams.set("langLevel", params.langLevel)
    if (params.category) url.searchParams.set("category", params.category)
    router.push(url.pathname + url.search)
  }

  const handleLevelSelected = (level: string) => {
    if (!testConfig) return
    setSelectedLevel(level)
    setShowSelector(false)
    testStartedRef.current = true
    startTest({ dbTestId: testConfig.dbId, level })
  }

  if (showInfoModal && testConfig && testExplanation) {
    return (
      <TestInfoModal
        open={showInfoModal}
        onOpenChange={(open) => {
          if (!open) {
            handleInfoModalClose()
          }
        }}
        testName={getLocalizedName(testConfig)}
        testCode={testCode}
        explanation={testExplanation}
      />
    )
  }

  if (showProctoringModal && testConfig) {
    return (
      <ProctoringModal
        open={showProctoringModal}
        onOpenChange={(open) => {
          if (!open) router.push("/dashboard/candidate")
        }}
        onAccept={handleProctoringAccept}
        testName={getLocalizedName(testConfig)}
      />
    )
  }

  // Error state
  if (error) {
    return (
      <div className="max-w-3xl mx-auto p-6 mt-12">
        <Card className="p-8">
          <div className="text-center space-y-6">
            <AlertCircle className="w-20 h-20 text-red-500 mx-auto" />
            <div>
              <h1 className="text-2xl font-bold mb-2">{t("testPage.error")}</h1>
              <p className="text-muted-foreground">{error}</p>
            </div>
            <Button onClick={() => router.push("/dashboard/candidate")} size="lg">
              {t("testPage.backToProfile")}
            </Button>
          </div>
        </Card>
      </div>
    )
  }

  if (showSelector && testConfig) {
    switch (testConfig.flowType) {
      case "SIMPLE_LEVEL":
        return (
          <TestLevelSelector
            open={true}
            onOpenChange={(open) => {
              if (!open) router.push("/dashboard/candidate")
            }}
            testCode={testCode}
            testName={getLocalizedName(testConfig)}
            startTestCallback={handleLevelSelected}
          />
        )

      case "CV_LANG_LEVEL":
        return (
          <LanguageTestSelector
            open={true}
            onOpenChange={(open) => {
              if (!open) router.push("/dashboard/candidate")
            }}
            testCode={testCode}
            testName={getLocalizedName(testConfig)}
            onSelect={(lang, langLevel) => handleSelectorSubmit({ lang, langLevel })}
          />
        )

      case "CV_IT_LEVEL":
        return (
          <ITTestSelector
            open={true}
            onOpenChange={(open) => {
              if (!open) router.push("/dashboard/candidate")
            }}
            testCode={testCode}
            testName={getLocalizedName(testConfig)}
            onSelect={(level) => handleSelectorSubmit({ level })}
          />
        )

      case "CV_JOB_LEVEL":
        return (
          <JobSkillsTestSelector
            open={true}
            onOpenChange={(open) => {
              if (!open) router.push("/dashboard/candidate")
            }}
            testCode={testCode}
            testName={getLocalizedName(testConfig)}
            onSelect={(category, level) => handleSelectorSubmit({ category, level })}
          />
        )

      default:
        return null
    }
  }

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-lg text-muted-foreground">{t("testPage.loading")}</p>
        </div>
      </div>
    )
  }

  // Test complete state
  if (testComplete && results) {
    return (
      <div className="max-w-3xl mx-auto p-6 mt-12">
        <Card className="p-8">
          <div className="text-center space-y-6">
            <CheckCircle2 className="w-20 h-20 text-green-500 mx-auto" />
            <div>
              <h1 className="text-3xl font-bold mb-2">{t("testPage.complete")}</h1>
              <p className="text-xl text-muted-foreground">
                {t("testPage.levelAchieved")}{" "}
                <span className="font-semibold text-primary">{results.bandLabel || results.level_achieved || "—"}</span>
              </p>
            </div>
            {results.candidateResultText && (
              <div className="bg-muted p-6 rounded-lg text-left">
                <h3 className="font-semibold mb-3">{t("testPage.yourResult")}</h3>
                <p className="text-muted-foreground whitespace-pre-line">{results.candidateResultText}</p>
              </div>
            )}
            <Button onClick={() => router.push("/dashboard/candidate")} size="lg">
              {t("testPage.backToProfile")}
            </Button>
          </div>
        </Card>
      </div>
    )
  }

  // Test interface
  if (questions.length > 0 && testConfig) {
    return (
      <div className="container mx-auto py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6">
            <h1 className="text-3xl font-bold mb-2">{getLocalizedName(testConfig)}</h1>
            <p className="text-muted-foreground">{getLocalizedDescription(testConfig)}</p>
          </div>
          <TestInterface testId={testSession.id} questions={questions} onComplete={handleTestComplete} />
        </div>
      </div>
    )
  }

  return (
    <div className="flex items-center justify-center min-h-screen">
      <Loader2 className="w-12 h-12 animate-spin text-primary" />
    </div>
  )
}

export default function UniversalTestPage() {
  const params = useParams<{ testCode: string }>()

  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-screen">
          <Loader2 className="w-12 h-12 animate-spin text-primary" />
        </div>
      }
    >
      <UniversalTestContent testCode={params.testCode} />
    </Suspense>
  )
}
