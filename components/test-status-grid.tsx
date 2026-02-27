"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import {
  Monitor,
  Briefcase,
  Languages,
  Users,
  Cpu,
  Calculator,
  FileText,
  Search,
  Calendar,
  Keyboard,
  Brain,
  Shield,
  ClipboardList,
  Heart,
  Target,
  AlertTriangle,
  Flame,
  TrendingUp,
  UserCheck,
  Building,
  MessageCircle,
  Check,
  Globe,
  Laptop,
  TabletSmartphone,
  Server,
  Database,
  FileSpreadsheet,
  Presentation,
  FileType,
  Sheet,
} from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useI18n } from "@/lib/i18n/context"
import { staticTranslations } from "@/lib/i18n/translations"

const TEST_ICON_MAP: Record<string, any> = {
  // Core tests
  DIGITAL_SKILLS: Monitor,
  JOB_SKILLS: Briefcase,
  JOB_SKILLS_ADMIN: ClipboardList,
  JOB_SKILLS_IT: Cpu,
  JOB_SKILLS_TRADES: Shield,
  SJT_BASIC: Users,
  SJT_COGNITIVE: Brain,
  LOGICAL_NUMERICAL: Calculator,
  VERBAL_SKILLS: FileText,
  ATTENTION_DETAIL: Search,
  PLANNING: Calendar,
  DATA_ENTRY: Keyboard,
  SAFETY_BOZP: Shield,
  WORK_SAMPLE: ClipboardList,

  // IT User levels
  IT_USER: Cpu,
  IT_SKILLS: Cpu,
  IT_USER_SKILLS: Cpu,
  IT_USER_L1: Laptop,
  IT_USER_L2: TabletSmartphone,
  IT_USER_L3: Server,
  IT_USER_L4: Database,
  IT_USER_MS_EXCEL: FileSpreadsheet,
  IT_USER_MS_POWERPOINT: Presentation,
  IT_USER_MS_WORD: FileType,
  IT_USER_GOOGLE_SHEETS: Sheet,

  // English
  LANGUAGE_EN_A1: Globe,
  LANGUAGE_EN_A2: Globe,
  LANGUAGE_EN_B1: Globe,
  LANGUAGE_EN_B2: Globe,
  LANGUAGE_EN_C1: Globe,
  LANGUAGE_EN_C2: Globe,
  LANGUAGE_EN_BASIC: Globe,
  LANGUAGE_EN_INTERMEDIATE: Globe,
  LANGUAGE_EN_ADVANCED: Globe,

  // German
  LANGUAGE_DE_A1: Languages,
  LANGUAGE_DE_A2: Languages,
  LANGUAGE_DE_B1: Languages,
  LANGUAGE_DE_B2: Languages,
  LANGUAGE_DE_C1: Languages,
  LANGUAGE_DE_C2: Languages,
  LANGUAGE_DE_BASIC: Languages,
  LANGUAGE_DE_INTERMEDIATE: Languages,
  LANGUAGE_DE_ADVANCED: Languages,

  // Spanish
  LANGUAGE_ES_A1: Languages,
  LANGUAGE_ES_A2: Languages,
  LANGUAGE_ES_B1: Languages,
  LANGUAGE_ES_B2: Languages,
  LANGUAGE_ES_C1: Languages,
  LANGUAGE_ES_C2: Languages,
  LANGUAGE_ES_BASIC: Languages,
  LANGUAGE_ES_INTERMEDIATE: Languages,
  LANGUAGE_ES_ADVANCED: Languages,

  // French
  LANGUAGE_FR_A1: Languages,
  LANGUAGE_FR_A2: Languages,
  LANGUAGE_FR_B1: Languages,
  LANGUAGE_FR_B2: Languages,
  LANGUAGE_FR_C1: Languages,
  LANGUAGE_FR_C2: Languages,
  LANGUAGE_FR_BASIC: Languages,
  LANGUAGE_FR_INTERMEDIATE: Languages,
  LANGUAGE_FR_ADVANCED: Languages,

  // Italian
  LANGUAGE_IT_A1: Languages,
  LANGUAGE_IT_A2: Languages,
  LANGUAGE_IT_B1: Languages,
  LANGUAGE_IT_B2: Languages,
  LANGUAGE_IT_C1: Languages,
  LANGUAGE_IT_C2: Languages,
  LANGUAGE_IT_BASIC: Languages,
  LANGUAGE_IT_INTERMEDIATE: Languages,
  LANGUAGE_IT_ADVANCED: Languages,

  // Retention tests
  RET_ENGAGEMENT: Heart,
  RET_MOTIVATORS: Target,
  RET_RISK: AlertTriangle,
  RET_STRESS_BURNOUT: Flame,
  RET_CAREER_GROWTH: TrendingUp,
  RET_MANAGER_RELATIONSHIP: UserCheck,
  RET_COMMUNICATION_CLIMATE: MessageCircle,
  RET_WORK_ENVIRONMENT: Building,
}

interface CompletedTest {
  test_id: string
  assessment_test_id: string
}

interface AssessmentTestName {
  id: string
  name: string
  name_en: string | null
  name_de: string | null
}

export function TestStatusGrid() {
  const [completedTests, setCompletedTests] = useState<CompletedTest[]>([])
  const [testNames, setTestNames] = useState<Map<string, string>>(new Map())
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  const { language } = useI18n()
  const currentLang = (language && staticTranslations[language] ? language : "sk") as keyof typeof staticTranslations
  const t =
    staticTranslations[currentLang]?.candidateDashboard?.testResults ||
    staticTranslations.sk.candidateDashboard.testResults

  useEffect(() => {
    loadCompletedTests()
  }, [language])

  const loadCompletedTests = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        setLoading(false)
        return
      }

      const [resultsResponse, namesResponse] = await Promise.all([
        supabase.from("candidate_test_results").select("test_id, assessment_test_id").eq("candidate_id", user.id),
        supabase.from("assessment_tests").select("id, name, name_en, name_de"),
      ])

      if (resultsResponse.error) {
        console.error("[v0] Error loading completed tests:", resultsResponse.error)
      } else {
        setCompletedTests(resultsResponse.data || [])
      }

      if (namesResponse.data) {
        const nameMap = new Map<string, string>()
        namesResponse.data.forEach((test: AssessmentTestName) => {
          let displayName = test.name // SK default
          if (language === "en" && test.name_en) {
            displayName = test.name_en
          } else if (language === "de" && test.name_de) {
            displayName = test.name_de
          }
          nameMap.set(test.id, displayName)
        })
        setTestNames(nameMap)
      }

      setLoading(false)
    } catch (error) {
      console.error("[v0] Error in loadCompletedTests:", error)
      setLoading(false)
    }
  }

  const uniqueCompletedTests = Array.from(new Set(completedTests.map((t) => t.assessment_test_id).filter(Boolean)))

  if (loading) {
    return (
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-3">
          <div className="h-4 w-32 bg-muted animate-pulse rounded" />
        </div>
        <div className="flex flex-wrap gap-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="w-9 h-9 rounded-full bg-muted animate-pulse" />
          ))}
        </div>
      </div>
    )
  }

  if (uniqueCompletedTests.length === 0) {
    return null
  }

  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-sm font-medium text-muted-foreground">{t.overview}</h4>
      </div>

      <TooltipProvider delayDuration={100}>
        <div className="flex flex-wrap gap-2">
          {uniqueCompletedTests.map((assessmentId) => {
            const Icon = TEST_ICON_MAP[assessmentId] || Monitor
            const testName = testNames.get(assessmentId) || assessmentId

            return (
              <Tooltip key={assessmentId}>
                <TooltipTrigger asChild>
                  <div
                    className="relative w-9 h-9 rounded-full flex items-center justify-center
                      transition-all duration-200 cursor-default
                      bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 ring-2 ring-green-500/30"
                  >
                    <Icon className="w-4 h-4" />
                    <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full bg-green-500 flex items-center justify-center">
                      <Check className="w-2.5 h-2.5 text-white" strokeWidth={3} />
                    </div>
                  </div>
                </TooltipTrigger>
                <TooltipContent side="top" className="max-w-[200px]">
                  <div className="text-center">
                    <p className="font-medium">{testName}</p>
                    <p className="text-xs text-green-500">{t.completedStatus}</p>
                  </div>
                </TooltipContent>
              </Tooltip>
            )
          })}
        </div>
      </TooltipProvider>
    </div>
  )
}
