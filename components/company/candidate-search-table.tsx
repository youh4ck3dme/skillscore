"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { FileText, Send, CheckCircle2 } from "lucide-react"
import { CandidateProfileModal } from "@/components/company/candidate-profile-modal"
import { SendTestDialog } from "@/components/company/send-test-dialog"
import { ViewTestResultDialog } from "@/components/company/view-test-result-dialog"

interface CandidateWithTests {
  id: string
  anonymous_id: string
  completedTests?: any[]
  availableTests?: any[]
}

interface CandidateSearchTableProps {
  candidates: any[]
  onRefresh?: () => void
}

const TEST_COLUMNS = [
  // Language tests - English
  { id: "LANGUAGE_EN_A1", label: "English - A1" },
  { id: "LANGUAGE_EN_A2", label: "English - A2" },
  { id: "LANGUAGE_EN_B1", label: "English - B1" },
  { id: "LANGUAGE_EN_B2", label: "English - B2" },
  { id: "LANGUAGE_EN_C1", label: "English - C1" },
  { id: "LANGUAGE_EN_C2", label: "English - C2" },

  // Language tests - German
  { id: "LANGUAGE_DE_A1", label: "Deutsch - A1" },
  { id: "LANGUAGE_DE_A2", label: "Deutsch - A2" },
  { id: "LANGUAGE_DE_B1", label: "Deutsch - B1" },
  { id: "LANGUAGE_DE_B2", label: "Deutsch - B2" },
  { id: "LANGUAGE_DE_C1", label: "Deutsch - C1" },
  { id: "LANGUAGE_DE_C2", label: "Deutsch - C2" },

  // Language tests - French
  { id: "LANGUAGE_FR_A1", label: "Français - A1" },
  { id: "LANGUAGE_FR_A2", label: "Français - A2" },
  { id: "LANGUAGE_FR_B1", label: "Français - B1" },
  { id: "LANGUAGE_FR_B2", label: "Français - B2" },
  { id: "LANGUAGE_FR_C1", label: "Français - C1" },
  { id: "LANGUAGE_FR_C2", label: "Français - C2" },

  // Language tests - Spanish
  { id: "LANGUAGE_ES_A1", label: "Español - A1" },
  { id: "LANGUAGE_ES_A2", label: "Español - A2" },
  { id: "LANGUAGE_ES_B1", label: "Español - B1" },
  { id: "LANGUAGE_ES_B2", label: "Español - B2" },
  { id: "LANGUAGE_ES_C1", label: "Español - C1" },
  { id: "LANGUAGE_ES_C2", label: "Español - C2" },

  // Language tests - Italian
  { id: "LANGUAGE_IT_A1", label: "Italiano - A1" },
  { id: "LANGUAGE_IT_A2", label: "Italiano - A2" },
  { id: "LANGUAGE_IT_B1", label: "Italiano - B1" },
  { id: "LANGUAGE_IT_B2", label: "Italiano - B2" },
  { id: "LANGUAGE_IT_C1", label: "Italiano - C1" },
  { id: "LANGUAGE_IT_C2", label: "Italiano - C2" },

  // Job skills
  { id: "JOB_SKILLS_ADMINISTRATIVE_JUNIOR", label: "Admin - Junior" },
  { id: "JOB_SKILLS_ADMINISTRATIVE_MID", label: "Admin - Mid" },
  { id: "JOB_SKILLS_ADMINISTRATIVE_SENIOR", label: "Admin - Senior" },
  { id: "JOB_SKILLS_CUSTOMER-SERVICE_JUNIOR", label: "Customer Service - Junior" },
  { id: "JOB_SKILLS_CUSTOMER-SERVICE_MID", label: "Customer Service - Mid" },
  { id: "JOB_SKILLS_CUSTOMER-SERVICE_SENIOR", label: "Customer Service - Senior" },
  { id: "JOB_SKILLS_LOGISTICS_JUNIOR", label: "Logistics - Junior" },
  { id: "JOB_SKILLS_LOGISTICS_MID", label: "Logistics - Mid" },
  { id: "JOB_SKILLS_LOGISTICS_SENIOR", label: "Logistics - Senior" },
  { id: "JOB_SKILLS_SALES_JUNIOR", label: "Sales - Junior" },
  { id: "JOB_SKILLS_SALES_MID", label: "Sales - Mid" },
  { id: "JOB_SKILLS_SALES_SENIOR", label: "Sales - Senior" },

  // IT tests
  { id: "IT_USER_BEGINNER", label: "IT - Začiatočník" },
  { id: "IT_USER_INTERMEDIATE", label: "IT - Stredný" },
  { id: "IT_USER_ADVANCED", label: "IT - Pokročilý" },
  { id: "IT_USER_EXPERT", label: "IT - Expert" },

  // Cognitive tests
  { id: "LOGICAL_NUMERICAL_SCREEN", label: "Logicko-numerický - Screen" },
  { id: "LOGICAL_NUMERICAL_STANDARD", label: "Logicko-numerický - Standard" },
  { id: "LOGICAL_NUMERICAL_EXPERT", label: "Logicko-numerický - Expert" },
  { id: "VERBAL_SKILLS_SCREEN", label: "Verbálne - Screen" },
  { id: "VERBAL_SKILLS_STANDARD", label: "Verbálne - Standard" },
  { id: "VERBAL_SKILLS_EXPERT", label: "Verbálne - Expert" },
  { id: "DATA_ENTRY_SCREEN", label: "Zadávanie dát - Screen" },
  { id: "DATA_ENTRY_STANDARD", label: "Zadávanie dát - Standard" },
  { id: "DATA_ENTRY_EXPERT", label: "Zadávanie dát - Expert" },

  // Basic tests
  { id: "DIGITAL_SKILLS", label: "Digitálne zručnosti" },
  { id: "SJT_BASIC", label: "SJT - Základný" },

  // Advanced tests
  { id: "SJT_COGNITIVE", label: "SJT - Kognitívny" },
  { id: "PLANNING", label: "Plánovanie" },
  { id: "SAFETY_BOZP", label: "BOZP" },
  { id: "WORK_SAMPLE", label: "Work Sample" },
  { id: "ATTENTION_DETAIL", label: "Pozornosť k detailom" },

  // Retention tests
  { id: "RET_ENGAGEMENT", label: "Angažovanosť" },
  { id: "RET_MOTIVATORS", label: "Motivátory" },
  { id: "RET_RISK", label: "Retenčné riziko" },
  { id: "RET_STRESS_BURNOUT", label: "Stres & vyhorenie" },
  { id: "RET_CAREER_GROWTH", label: "Kariérny rast" },
  { id: "RET_MANAGER_RELATIONSHIP", label: "Vzťah s manažérom" },
  { id: "RET_CULTURE_FIT", label: "Kultúrny fit" },
  { id: "RET_COMMUNICATION_CLIMATE", label: "Komunikačná klíma" },
]

export function CandidateSearchTable({ candidates, onRefresh }: CandidateSearchTableProps) {
  const [selectedCandidate, setSelectedCandidate] = useState<any | null>(null)
  const [testDialogOpen, setTestDialogOpen] = useState(false)
  const [viewResultDialogOpen, setViewResultDialogOpen] = useState(false)
  const [selectedTest, setSelectedTest] = useState<{ testId: string; testName: string } | null>(null)
  const [currentCandidateId, setCurrentCandidateId] = useState<string | null>(null)

  const handleTestClick = (candidate: any, testId: string, testName: string, hasCompleted: boolean) => {
    setCurrentCandidateId(candidate.id)
    setSelectedTest({ testId, testName })

    if (hasCompleted) {
      setViewResultDialogOpen(true)
    } else {
      setTestDialogOpen(true)
    }
  }

  const handleProfileClick = (candidate: any) => {
    setSelectedCandidate(candidate)
  }

  const handleProfileClose = () => {
    setSelectedCandidate(null)
    onRefresh?.()
  }

  const getTableColumns = () => {
    const testsSet = new Set<string>()
    candidates.forEach((candidate) => {
      if (candidate.completedTests) {
        candidate.completedTests.forEach((test: any) => testsSet.add(test.testId))
      }
      if (candidate.availableTests) {
        candidate.availableTests.forEach((test: any) => testsSet.add(test.testId))
      }
    })

    const allTests = Array.from(testsSet).map((testId) => {
      const testColumn = TEST_COLUMNS.find((t) => t.id === testId)
      return testColumn || { id: testId, label: testId }
    })

    return allTests
  }

  const tableColumns = getTableColumns()

  return (
    <>
      <div className="rounded-lg border border-border overflow-hidden bg-card">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead className="sticky left-0 z-20 bg-muted/50 min-w-[120px] font-semibold border-r border-border">
                  ID
                </TableHead>
                {tableColumns.map((test) => (
                  <TableHead key={test.id} className="text-center min-w-[140px] font-semibold text-xs">
                    {test.label}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {candidates.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={tableColumns.length + 1} className="text-center py-8 text-muted-foreground">
                    Žiadni kandidáti nenájdení
                  </TableCell>
                </TableRow>
              ) : (
                candidates.map((candidate) => {
                  const completedTestsMap = new Map((candidate.completedTests || []).map((t: any) => [t.testId, true]))
                  const availableTestsMap = new Map((candidate.availableTests || []).map((t: any) => [t.testId, true]))

                  return (
                    <TableRow key={candidate.id} className="hover:bg-muted/30">
                      <TableCell className="sticky left-0 z-10 bg-card font-medium border-r border-border">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleProfileClick(candidate)}
                          className="flex items-center gap-2 hover:text-primary font-mono"
                        >
                          <FileText className="h-4 w-4" />
                          {candidate.anonymous_id || "N/A"}
                        </Button>
                      </TableCell>
                      {tableColumns.map((test) => {
                        const hasCompleted = completedTestsMap.has(test.id)
                        const isAvailable = availableTestsMap.has(test.id)

                        if (!hasCompleted && !isAvailable) {
                          return <TableCell key={test.id} className="text-center p-2" />
                        }

                        return (
                          <TableCell key={test.id} className="text-center p-2">
                            <button
                              onClick={() => handleTestClick(candidate, test.id, test.label, hasCompleted)}
                              className={`w-10 h-10 rounded-lg transition-all flex items-center justify-center ${
                                hasCompleted
                                  ? "bg-green-100 dark:bg-green-900/30 hover:bg-green-200 dark:hover:bg-green-900/50 cursor-pointer"
                                  : "bg-muted hover:bg-primary/10 cursor-pointer"
                              }`}
                              title={hasCompleted ? "Zobraziť výsledok testu" : `Poslať ${test.label} test`}
                            >
                              {hasCompleted ? (
                                <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
                              ) : (
                                <Send className="h-3 w-3 text-muted-foreground hover:text-primary transition-colors" />
                              )}
                            </button>
                          </TableCell>
                        )
                      })}
                    </TableRow>
                  )
                })
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {selectedCandidate && (
        <CandidateProfileModal
          candidate={selectedCandidate}
          open={!!selectedCandidate}
          onOpenChange={(open) => {
            if (!open) {
              handleProfileClose()
            }
          }}
          onRefresh={onRefresh}
        />
      )}

      {selectedTest && currentCandidateId && (
        <>
          <SendTestDialog
            open={testDialogOpen}
            onOpenChange={setTestDialogOpen}
            candidateId={currentCandidateId}
            testId={selectedTest.testId}
            testName={selectedTest.testName}
            onSuccess={() => {
              setTestDialogOpen(false)
              onRefresh?.()
            }}
          />

          <ViewTestResultDialog
            open={viewResultDialogOpen}
            onOpenChange={setViewResultDialogOpen}
            candidateId={currentCandidateId}
            testId={selectedTest.testId}
            testName={selectedTest.testName}
            onSuccess={() => {
              setViewResultDialogOpen(false)
              onRefresh?.()
            }}
          />
        </>
      )}
    </>
  )
}
