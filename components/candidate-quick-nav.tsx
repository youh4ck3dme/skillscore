"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { TooltipProvider } from "@/components/ui/tooltip"
import { useRouter } from "next/navigation"
import {
  FileText,
  ClipboardCheck,
  Target,
  Settings,
  Edit3,
  Sparkles,
  CheckCircle,
  AlertCircle,
  Rocket,
  ArrowRight,
  Check,
  Heart,
  Eye,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useI18n } from "@/lib/i18n/context"
import { staticTranslations } from "@/lib/i18n/translations"
import { testIcons } from "@/lib/test-icons"
import testsInfoData from "@/lib/data/tests-info-sk.json"
import { createClient } from "@/lib/supabase/client"

interface QuickNavProps {
  cvProgress: number
  testsProgress: number
  cvCompleted?: boolean
  onNavigate?: (action: string) => void
  cvData?: {
    work_experience: any[]
    languages: any[]
    computer_skills: any[]
    cv_summary: any
  } | null
  testDescriptions?: Record<string, string>
}

interface QuickNavItem {
  id: string
  title: React.ReactNode | string
  description: React.ReactNode | string
  icon: any
  color?: string
  bgColor?: string
  borderColor?: string
  iconBg?: string
  statusIcon?: any
  statusColor?: string
  isEmpty?: boolean
  actions?: {
    label: string
    icon: any
    action: string
    count?: { total: number; completed: number }
    disabled?: boolean
  }[]
  showOnlyWhenCvComplete?: boolean
  disabled?: boolean
  isStatic?: boolean
  shouldBlink?: boolean
}

function TestCountBoxes({ count, completed = 0 }: { count: number; completed?: number }) {
  if (count === 0) return null

  return (
    <div className="flex items-center gap-0.5 ml-2 flex-shrink-0">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className={cn(
            "w-1.5 h-1.5 rounded-sm transition-colors",
            i < completed ? "bg-teal-600 dark:bg-teal-500" : "bg-gray-300 dark:bg-gray-600",
          )}
        />
      ))}
    </div>
  )
}

export function CandidateQuickNav({
  cvProgress,
  testsProgress,
  cvCompleted = false,
  onNavigate,
  cvData,
  testDescriptions: propTestDescriptions = {},
}: QuickNavProps) {
  const { language } = useI18n()
  const router = useRouter()

  const currentLang = (language && language in staticTranslations ? language : "sk") as keyof typeof staticTranslations
  const skFallback = staticTranslations.sk
  const currentTranslations = staticTranslations[currentLang] || skFallback
  const t = currentTranslations?.candidateQuickNav || skFallback.candidateQuickNav
  const testsTranslations = t?.tests ||
    skFallback.candidateQuickNav?.tests || {
      title: "Testy",
      description: "Overte svoje schopnosti",
      basic: {
        title: "Základné testy",
        description: "5 základných testov na overenie schopností",
        progress: "dokončených",
      },
      advanced: {
        title: "Rozšírené testy",
        description: "8 rozšírených testov pre výhodu",
        progress: "dokončených",
      },
      retention: {
        title: "Retenčné testy",
        description: "9 testov pre stabilitu a spokojnosť",
        progress: "dokončených",
      },
      actions: {
        core: "Základné testy",
        advanced: "Rozšírené testy",
        start: "Spustiť test",
        continue: "Pokračovať",
        view: "Zobraziť výsledok",
      },
      names: {
        jobSkills: "Pracovné zručnosti",
        langTests: "Jazykové testy",
        digiSkills: "Digitálne zručnosti",
        sjtTest: "Situačný test",
        itUser: "IT schopnosti",
        logNum: "Logicko-numerický",
        numLog: "Numerická logika",
        verbal: "Verbálne schopnosti",
        detail: "Pozornosť k detailom",
        planning: "Plánovanie",
        dataEntry: "Zadávanie dát",
        coSjt: "Kognitívny SJT",
        ohs: "BOZP",
        workSample: "Pracovná vzorka",
        retEngagement: "Angažovanosť",
        retMotivators: "Motivátory",
        retRisk: "Retenčné riziko",
        retStressBurnout: "Stres a vyhorenie",
        retCareerGrowth: "Kariérny rast",
        retManagerRelationship: "Vzťah s manažérom",
        retCommunicationClimate: "Komunikačná klíma",
        retWorkEnvironment: "Pracovné prostredie a spokojnosť",
      },
    }

  const [hoveredCard, setHoveredCard] = useState<string | null>(null)
  const [testLevelModalOpen, setTestLevelModalOpen] = useState(false)
  const [selectedTestForLevel, setSelectedTestForLevel] = useState<{ code: string; name: string } | null>(null)
  const [workSkillsCount, setWorkSkillsCount] = useState({ total: 0, completed: 0 })
  const [languageTestsCount, setLanguageTestsCount] = useState({ total: 0, completed: 0 })
  const [itUserSkillsCount, setItUserSkillsCount] = useState({ total: 0, completed: 0 })
  const [testDescriptions, setTestDescriptions] = useState<Record<string, string>>(propTestDescriptions)
  const [testDescription, setTestDescription] = useState<string | null>(null)
  const [localCvCompleted, setLocalCvCompleted] = useState(false)
  const [profileViewsCount, setProfileViewsCount] = useState<number>(0)

  useEffect(() => {
    loadTestCounts()
    checkLocalCvCompletion()
    loadProfileViewsCount()
    const shouldOpenLanguageTests = sessionStorage.getItem("openLanguageTests")
    if (shouldOpenLanguageTests === "true") {
      sessionStorage.removeItem("openLanguageTests")
    }
  }, [])

  const loadTestCounts = async () => {
    setWorkSkillsCount({ total: 0, completed: 0 })
    setLanguageTestsCount({ total: 0, completed: 0 })
    setItUserSkillsCount({ total: 0, completed: 0 })
  }

  const checkLocalCvCompletion = () => {
    if (typeof window !== "undefined") {
      const cvCompleted = localStorage.getItem("cv_completed")
      setLocalCvCompleted(cvCompleted === "true")
    }
  }

  const [testResults] = useState(() => {
    if (typeof window === "undefined") return {}
    try {
      const stored = localStorage.getItem("test_results")
      return stored ? JSON.parse(stored) : {}
    } catch {
      return {}
    }
  })

  const loadProfileViewsCount = async () => {
    try {
      const supabase = createClient()

      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) return

      const { count, error } = await supabase
        .from("profile_views")
        .select("*", { count: "exact", head: true })
        .eq("candidate_id", user.id)

      if (!error && count !== null) {
        setProfileViewsCount(count)
      }
    } catch (error) {
      console.error("Error loading profile views count:", error)
    }
  }

  const isCvCompleted =
    localCvCompleted ||
    cvProgress === 100 ||
    cvCompleted ||
    (cvData?.work_experience && cvData.work_experience.length > 0)

  const cvCardConfig = isCvCompleted
    ? {
        color: "from-blue-400 to-blue-500",
        bgColor: "bg-blue-50/80 dark:bg-blue-950/30",
        borderColor: "border-blue-300 dark:border-blue-700",
        iconBg: "bg-blue-500",
        statusIcon: CheckCircle,
        statusColor: "text-blue-600",
        shouldBlink: false,
      }
    : {
        color: "from-teal-500 to-teal-600",
        bgColor: "bg-teal-50 dark:bg-teal-950/20",
        borderColor: "border-teal-200 dark:border-teal-800",
        iconBg: "bg-gradient-to-br from-teal-500 to-teal-600",
        statusIcon: Rocket,
        statusColor: "text-teal-600",
        shouldBlink: true,
      }

  const getTestCount = (testCode: string): { total: number; completed: number } => {
    switch (testCode) {
      case "work-skills":
        return workSkillsCount
      case "language":
        return languageTestsCount
      case "digital-literacy":
        return { total: 1, completed: 0 }
      case "sjt":
        return { total: 3, completed: 0 }
      case "it-user":
        return itUserSkillsCount
      case "verbal":
      case "attention":
      case "planning":
        return { total: 3, completed: 0 }
      case "lognum":
      case "data-entry":
      case "cognitive-sjt":
      case "bozp":
      case "work-sample":
      case "co-sjt":
        return { total: 1, completed: 0 }
      case "ret-engagement":
      case "ret-motivators":
      case "ret-risk":
      case "ret-stress":
      case "ret-career":
      case "ret-manager":
      case "ret-communication":
      case "ret-environment":
        return { total: 1, completed: 0 }
      default:
        return { total: 0, completed: 0 }
    }
  }

  const allTests = [
    {
      id: "test-job-skills",
      name: testsTranslations.names.jobSkills,
      level: "basic",
      duration: "15 min",
      action: "test-job-skills",
      count: workSkillsCount,
      code: "work-skills",
    },
    {
      id: "test-lang",
      name: testsTranslations.names.langTests,
      level: "basic",
      duration: "20 min",
      action: "test-lang",
      code: "language",
    },
    {
      id: "test-digi",
      name: testsTranslations.names.digiSkills,
      level: "basic",
      duration: "10 min",
      action: "test-digi",
      code: "digital-literacy",
    },
    {
      id: "test-sjt",
      name: testsTranslations.names.sjtTest,
      level: "basic",
      duration: "25 min",
      action: "test-sjt",
      code: "sjt",
    },
    {
      id: "test-it",
      name: testsTranslations.names.itUser,
      level: "basic",
      duration: "20 min",
      action: "test-it",
      code: "it-user",
    },
    {
      id: "test-lognum",
      name: testsTranslations.names.logNum,
      level: "advanced",
      duration: "25 min",
      action: "test-lognum",
      code: "lognum",
    },
    {
      id: "test-verbal",
      name: testsTranslations.names.verbal,
      level: "advanced",
      duration: "25 min",
      action: "test-verbal",
      code: "verbal",
    },
    {
      id: "test-detail",
      name: testsTranslations.names.detail,
      level: "advanced",
      duration: "20 min",
      action: "test-detail",
      code: "attention",
    },
    {
      id: "test-plan",
      name: testsTranslations.names.planning,
      level: "advanced",
      duration: "30 min",
      action: "test-plan",
      code: "planning",
    },
    {
      id: "test-dataentry",
      name: testsTranslations.names.dataEntry,
      level: "advanced",
      duration: "15 min",
      action: "test-dataentry",
      code: "data-entry",
    },
    {
      id: "test-sjt-advanced",
      name: testsTranslations.names.coSjt,
      level: "advanced",
      duration: "25 min",
      action: "test-sjt-advanced",
      code: "cognitive-sjt",
    },
    {
      id: "test-ohs",
      name: testsTranslations.names.ohs,
      level: "advanced",
      duration: "20 min",
      action: "test-ohs",
      code: "bozp",
    },
    {
      id: "test-worksample",
      name: testsTranslations.names.workSample,
      level: "advanced",
      duration: "35 min",
      action: "test-worksample",
      code: "work-sample",
    },
    {
      id: "ret-engagement",
      name: testsTranslations.names.retEngagement,
      level: "retention",
      duration: "15 min",
      action: "ret-engagement",
      code: "ret-engagement",
    },
    {
      id: "ret-motivators",
      name: testsTranslations.names.retMotivators,
      level: "retention",
      duration: "15 min",
      action: "ret-motivators",
      code: "ret-motivators",
    },
    {
      id: "ret-risk",
      name: testsTranslations.names.retRisk,
      level: "retention",
      duration: "12 min",
      action: "ret-risk",
      code: "ret-risk",
    },
    {
      id: "ret-stress",
      name: testsTranslations.names.retStressBurnout,
      level: "retention",
      duration: "15 min",
      action: "ret-stress",
      code: "ret-stress",
    },
    {
      id: "ret-career",
      name: testsTranslations.names.retCareerGrowth,
      level: "retention",
      duration: "12 min",
      action: "ret-career",
      code: "ret-career",
    },
    {
      id: "ret-manager",
      name: testsTranslations.names.retManagerRelationship,
      level: "retention",
      duration: "12 min",
      action: "ret-manager",
      code: "ret-manager",
    },
    {
      id: "ret-communication",
      name: testsTranslations.names.retCommunicationClimate,
      level: "retention",
      duration: "15 min",
      action: "ret-communication",
      code: "ret-communication",
    },
    {
      id: "ret-environment",
      name: testsTranslations.names.retWorkEnvironment || "Pracovné prostredie a spokojnosť",
      level: "retention",
      duration: "15 min",
      action: "ret-environment",
      code: "ret-environment",
    },
  ]

  const basicTests = allTests.filter((t) => t.level === "basic")
  const advancedTests = allTests.filter((t) => t.level === "advanced")
  const retentionTests = allTests.filter((t) => t.level === "retention")
  const completedBasic = basicTests.filter((t) => testResults[t.id]).length
  const completedAdvanced = advancedTests.filter((t) => testResults[t.id]).length
  const completedRetention = retentionTests.filter((t) => testResults[t.id]).length
  const totalCompleted = completedBasic + completedAdvanced + completedRetention
  const totalTests = allTests.length

  const handleNavigate = (section: string) => {
    if (onNavigate) {
      onNavigate(section)
      return
    }

    const routeMap: Record<string, string> = {
      "test-job-skills": "/dashboard/candidate/tests/job-skills",
      "test-lang": "/dashboard/candidate/tests/language",
      "test-it-cv-skills": "/dashboard/candidate/tests/it-cv-skills",
      "test-work-skills": "/dashboard/candidate/tests/work-skills",
      "test-it": "/tests/test-it",
      "test-sjt": "/tests/test-sjt",
      "test-detail": "/tests/test-detail",
      "test-digi": "/tests/test-digi",
      "test-verbal": "/tests/test-verbal",
      "test-dataentry": "/tests/test-dataentry",
      "test-plan": "/tests/test-plan",
      "test-ohs": "/tests/test-ohs",
      "test-worksample": "/tests/test-worksample",
      "test-sjt-advanced": "/tests/test-sjt-advanced",
      "test-lognum": "/tests/test-lognum",
      "ret-engagement": "/tests/ret-engagement",
      "ret-motivators": "/tests/ret-motivators",
      "ret-risk": "/tests/ret-risk",
      "ret-stress": "/tests/ret-stress",
      "ret-career": "/tests/ret-career",
      "ret-manager": "/tests/ret-manager",
      "ret-communication": "/tests/ret-communication",
      "ret-environment": "/tests/ret-environment",
    }

    const route = routeMap[section] || `/dashboard/candidate/${section}`
    router.push(route)
  }

  const handleCardAction = (section: string) => {}

  const cvTranslations = t?.cv ??
    skFallback?.candidateQuickNav?.cv ?? {
      completedShort: "SI",
      completedSuffix: "VIAC",
      completed: "Dokončené",
      descriptionStart: "Vyplňte svoj profil",
      notCompletedShort: "BUĎ",
      actions: {
        edit: "Upraviť",
        fill: "Vyplniť",
      },
    }

  const quickNavItems: QuickNavItem[] = [
    {
      id: "cv",
      title: isCvCompleted ? (
        <span className="text-xl font-bold">
          {cvTranslations.completedShort} <Check className="inline w-5 h-5 text-blue-600" strokeWidth={3} />
          {cvTranslations.completedSuffix}
        </span>
      ) : (
        <span className="text-xl font-bold">
          {cvTranslations.notCompletedShort ?? "BUĎ"} <Check className="inline w-5 h-5 text-blue-600" strokeWidth={3} />
          {cvTranslations.completedSuffix}
        </span>
      ),
      description: isCvCompleted ? (
        <span className="flex items-center gap-1">
          <Check className="w-4 h-4 text-blue-600 inline" /> {cvTranslations.completed}
        </span>
      ) : (
        cvTranslations.descriptionStart
      ),
      icon: FileText,
      ...cvCardConfig,
      isEmpty: !isCvCompleted && cvProgress === 0,
      actions: isCvCompleted
        ? [{ label: cvTranslations.actions?.edit ?? "Upraviť", icon: Edit3, action: "edit-cv" }]
        : [{ label: cvTranslations.actions?.fill ?? "Vyplniť", icon: ArrowRight, action: "cv" }],
    },
    {
      id: "basic-tests",
      title: testsTranslations.basic.title,
      description: testsTranslations.basic.description,
      icon: ClipboardCheck,
      color: "from-teal-500 to-teal-600",
      bgColor: "bg-teal-50 dark:bg-teal-950/20",
      borderColor: "border-teal-200 dark:border-teal-800",
      iconBg: "bg-teal-500",
      statusIcon: AlertCircle,
      statusColor: "text-teal-600",
      actions: basicTests.map((test) => ({
        label: test.name,
        icon: testIcons[test.id] || Target,
        action: test.action,
        count: test.id === "test-job-skills" ? test.count : undefined,
      })),
    },
    {
      id: "advanced-tests",
      title: testsTranslations.advanced.title,
      description: testsTranslations.advanced.description,
      icon: Sparkles,
      color: "from-indigo-500 to-indigo-600",
      bgColor: "bg-indigo-50 dark:bg-indigo-950/20",
      borderColor: "border-indigo-200 dark:border-indigo-800",
      iconBg: "bg-indigo-500",
      statusIcon: AlertCircle,
      statusColor: "text-indigo-600",
      actions: advancedTests.map((test) => ({
        label: test.name,
        icon: testIcons[test.id] || Target,
        action: test.action,
      })),
    },
    {
      id: "retention-tests",
      title: testsTranslations.retention.title,
      description: testsTranslations.retention.description,
      icon: Heart,
      color: "from-rose-500 to-rose-600",
      bgColor: "bg-rose-50 dark:bg-rose-950/20",
      borderColor: "border-rose-200 dark:border-rose-800",
      iconBg: "bg-rose-500",
      statusIcon: AlertCircle,
      statusColor: "text-rose-600",
      actions: retentionTests.map((test) => ({
        label: test.name,
        icon: testIcons[test.id] || Heart,
        action: test.action,
      })),
    },
    {
      id: "settings",
      title: t?.settings?.title || "Nastavenia",
      description: t?.settings?.description || "",
      icon: Settings,
      color: "from-teal-500 to-teal-600",
      bgColor: "bg-teal-50 dark:bg-teal-950/20",
      borderColor: "border-teal-200 dark:border-teal-800",
      iconBg: "bg-teal-500",
      statusIcon: Settings,
      statusColor: "text-teal-600",
      actions: [
        {
          label: t?.settings?.action || "Nastavenia",
          icon: Edit3,
          action: "settings",
        },
      ],
    },
  ]

  const statsCard: QuickNavItem = {
    id: "statistics",
    title: t?.settings?.statistics?.title || "Štatistiky",
    description: `${profileViewsCount} ${t?.settings?.statistics?.description || "zobrazení profilu"}`,
    icon: Eye,
    color: "from-purple-500 to-purple-600",
    bgColor: "bg-purple-50 dark:bg-purple-950/20",
    borderColor: "border-purple-200 dark:border-purple-800",
    iconBg: "bg-purple-500",
    isStatic: true,
  }

  const visibleNavItems = quickNavItems.filter((item) => {
    if (item.showOnlyWhenCvComplete && !isCvCompleted) {
      return false
    }
    return true
  })

  const getTestInfo = (testId: string) => {
    return testsInfoData[testId as keyof typeof testsInfoData] || null
  }

  return (
    <TooltipProvider>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {visibleNavItems.map((item) => {
          const Icon = item.icon
          const isHovered = hoveredCard === item.id
          const isDisabled = item.disabled

          return (
            <Card
              key={item.id}
              className={cn(
                "relative overflow-hidden transition-all duration-300 group",
                item.borderColor,
                !isDisabled && "cursor-pointer",
                !isDisabled && isHovered && "shadow-lg scale-105",
                !isDisabled && "hover:shadow-md",
                isDisabled && "opacity-60 cursor-not-allowed",
              )}
              onMouseEnter={() => !isDisabled && setHoveredCard(item.id)}
              onMouseLeave={() => setHoveredCard(null)}
              onClick={() => !isDisabled && handleNavigate(item.id)}
            >
              <div
                className={cn(
                  "absolute inset-0 bg-gradient-to-br transition-opacity duration-300",
                  item.color,
                  item.isEmpty ? "opacity-10 animate-pulse" : "opacity-5",
                  item.shouldBlink && "animate-pulse",
                  !isDisabled && isHovered && "opacity-10",
                )}
              />

              <div className="relative p-3 sm:p-4 space-y-3 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                    <div
                      className={cn(
                        "w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center transition-transform duration-300 flex-shrink-0",
                        item.iconBg,
                        isHovered && "scale-110 rotate-3",
                      )}
                    >
                      <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="font-semibold text-sm sm:text-base text-foreground flex items-center gap-2 break-words">
                        {item.title}
                      </h3>
                      <p className="text-xs text-muted-foreground break-words">{item.description}</p>
                    </div>
                  </div>
                </div>

                {isDisabled && (
                  <div className="flex items-center justify-center py-2">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300 border border-yellow-200 dark:border-yellow-700">
                      Pripravujeme
                    </span>
                  </div>
                )}

                <div
                  className={cn(
                    "space-y-3 transition-all duration-300 overflow-y-auto",
                    isHovered ? "max-h-[400px] opacity-100" : "max-h-0 opacity-0",
                  )}
                >
                  {item.id === "cv" && (
                    <>
                      {item.actions && item.actions.length > 0 && (
                        <div className="space-y-1">
                          {item.actions.map((action, idx) => {
                            const ActionIcon = action.icon
                            return (
                              <Button
                                key={idx}
                                variant="ghost"
                                size="sm"
                                className="w-full justify-start text-xs h-8"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  handleNavigate(action.action)
                                }}
                                disabled={action.disabled}
                              >
                                <ActionIcon className="w-3 h-3 mr-2" />
                                {action.label}
                              </Button>
                            )
                          })}
                        </div>
                      )}
                    </>
                  )}

                  {item.id === "basic-tests" && (
                    <>
                      {item.actions && item.actions.length > 0 && (
                        <div className="space-y-1">
                          {item.actions.map((action, idx) => {
                            const ActionIcon = action.icon
                            return (
                              <Button
                                key={idx}
                                variant="ghost"
                                size="sm"
                                className="w-full justify-start text-xs h-8"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  handleNavigate(action.action)
                                }}
                                disabled={action.disabled}
                              >
                                <ActionIcon className="w-3 h-3 mr-2" />
                                {action.label}
                                {action.count && (
                                  <TestCountBoxes count={action.count.total} completed={action.count.completed} />
                                )}
                              </Button>
                            )
                          })}
                        </div>
                      )}
                    </>
                  )}

                  {item.id === "advanced-tests" && (
                    <>
                      {item.actions && item.actions.length > 0 && (
                        <div className="space-y-1">
                          {item.actions.map((action, idx) => {
                            const ActionIcon = action.icon
                            return (
                              <Button
                                key={idx}
                                variant="ghost"
                                size="sm"
                                className="w-full justify-start text-xs h-8"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  handleNavigate(action.action)
                                }}
                                disabled={action.disabled}
                              >
                                <ActionIcon className="w-3 h-3 mr-2" />
                                {action.label}
                              </Button>
                            )
                          })}
                        </div>
                      )}
                    </>
                  )}

                  {item.id === "retention-tests" && (
                    <>
                      {item.actions && item.actions.length > 0 && (
                        <div className="space-y-1">
                          {item.actions.map((action, idx) => {
                            const ActionIcon = action.icon
                            return (
                              <Button
                                key={idx}
                                variant="ghost"
                                size="sm"
                                className="w-full justify-start text-xs h-8"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  handleNavigate(action.action)
                                }}
                                disabled={action.disabled}
                              >
                                <ActionIcon className="w-3 h-3 mr-2" />
                                {action.label}
                              </Button>
                            )
                          })}
                        </div>
                      )}
                    </>
                  )}

                  {item.id === "settings" && (
                    <>
                      {item.actions && item.actions.length > 0 && (
                        <div className="space-y-1">
                          {item.actions.map((action, idx) => {
                            const ActionIcon = action.icon
                            return (
                              <Button
                                key={idx}
                                variant="ghost"
                                size="sm"
                                className="w-full justify-start text-xs h-8"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  handleNavigate(action.action)
                                }}
                                disabled={action.disabled}
                              >
                                <ActionIcon className="w-3 h-3 mr-2" />
                                {action.label}
                              </Button>
                            )
                          })}
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
            </Card>
          )
        })}
        <Card
          className={cn(
            "relative overflow-hidden transition-all duration-300",
            statsCard.bgColor,
            statsCard.borderColor,
            "border-2 cursor-default",
          )}
        >
          <div className="p-4">
            <div className="flex items-start gap-3">
              <div
                className={cn(
                  "flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center text-white",
                  statsCard.iconBg,
                )}
              >
                <Eye className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-gray-900 dark:text-white text-base">{statsCard.title}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-0.5">{statsCard.description}</p>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </TooltipProvider>
  )
}
