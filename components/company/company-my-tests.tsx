"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Clock, CheckCircle, XCircle, Eye, Coins, FileText } from "lucide-react"
import { createClient } from "@/lib/supabase/client"

interface TestAssignment {
  id: string
  candidate_id: string
  test_id: string
  test_name: string
  status: "pending" | "completed" | "expired" | "cancelled"
  assigned_at: string
  completed_at?: string
  result_viewed: boolean
  coins_charged: number
}

interface CompanyMyTestsProps {
  companyId: string
  onViewResult?: (assignmentId: string) => void
}

export function CompanyMyTests({ companyId, onViewResult }: CompanyMyTestsProps) {
  const [assignments, setAssignments] = useState<TestAssignment[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    if (companyId) {
      loadAssignments()
    }
  }, [companyId])

  const loadAssignments = async () => {
    setLoading(true)
    try {
      const threeMonthsAgo = new Date()
      threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3)

      const { data, error } = await supabase
        .from("company_test_assignments")
        .select("*")
        .eq("company_id", companyId)
        .gte("assigned_at", threeMonthsAgo.toISOString())
        .order("assigned_at", { ascending: false })

      if (data) {
        setAssignments(data)
      }
    } catch (error) {
      console.error("Error loading test assignments:", error)
    } finally {
      setLoading(false)
    }
  }

  const hiringTests = assignments.filter((a) => !a.test_name.startsWith("RET_"))
  const internalTests = assignments.filter((a) => a.test_name.startsWith("RET_"))

  const StatusBadge = ({ status }: { status: TestAssignment["status"] }) => {
    const config = {
      pending: { label: "Čaká", icon: Clock, className: "bg-yellow-50 text-yellow-700 border-yellow-200" },
      completed: { label: "Dokončený", icon: CheckCircle, className: "bg-green-50 text-green-700 border-green-200" },
      expired: { label: "Expirovaný", icon: XCircle, className: "bg-gray-50 text-gray-700 border-gray-200" },
      cancelled: { label: "Zrušený", icon: XCircle, className: "bg-red-50 text-red-700 border-red-200" },
    }[status]

    return (
      <Badge variant="outline" className={config.className}>
        <config.icon className="h-3 w-3 mr-1" />
        {config.label}
      </Badge>
    )
  }

  const TestRow = ({ test }: { test: TestAssignment }) => (
    <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/30 transition-colors">
      <div className="flex items-center gap-4">
        <div>
          <p className="font-medium">{test.test_name}</p>
          <p className="text-sm text-muted-foreground">
            Pridelený: {new Date(test.assigned_at).toLocaleDateString("sk-SK")}
          </p>
        </div>
        <StatusBadge status={test.status} />
      </div>
      <div className="flex items-center gap-2">
        {test.status === "completed" && !test.result_viewed && onViewResult && (
          <Button size="sm" onClick={() => onViewResult(test.id)}>
            <Eye className="h-4 w-4 mr-2" />
            <Coins className="h-4 w-4 mr-1" />
            Zobraziť výsledok
          </Button>
        )}
        {test.status === "completed" && test.result_viewed && onViewResult && (
          <Button size="sm" variant="outline" onClick={() => onViewResult(test.id)}>
            <Eye className="h-4 w-4 mr-2" />
            Zobraziť výsledok
          </Button>
        )}
      </div>
    </div>
  )

  if (loading) {
    return <div className="text-center py-8 text-muted-foreground">Načítavam...</div>
  }

  if (assignments.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <FileText className="h-12 w-12 mx-auto mb-3 opacity-30" />
        <p>Zatiaľ ste nepridelili žiadne testy</p>
      </div>
    )
  }

  return (
    <Tabs defaultValue="hiring">
      <TabsList className="grid w-full grid-cols-2 mb-4">
        <TabsTrigger value="hiring">Nábor ({hiringTests.length})</TabsTrigger>
        <TabsTrigger value="internal">Testovanie ({internalTests.length})</TabsTrigger>
      </TabsList>

      <TabsContent value="hiring" className="space-y-3">
        {hiringTests.length === 0 ? (
          <p className="text-center py-4 text-muted-foreground">Žiadne náborové testy</p>
        ) : (
          hiringTests.map((test) => <TestRow key={test.id} test={test} />)
        )}
      </TabsContent>

      <TabsContent value="internal" className="space-y-3">
        {internalTests.length === 0 ? (
          <p className="text-center py-4 text-muted-foreground">Žiadne interné testy</p>
        ) : (
          internalTests.map((test) => <TestRow key={test.id} test={test} />)
        )}
      </TabsContent>
    </Tabs>
  )
}
