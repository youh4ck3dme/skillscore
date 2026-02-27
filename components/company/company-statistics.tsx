"use client"

import { useState, useEffect } from "react"
import { Coins, Users, Eye, UserCheck, ClipboardList } from "lucide-react"
import { createClient } from "@/lib/supabase/client"

interface CompanyStatisticsProps {
  companyId: string
  coinBalance: number
}

export function CompanyStatistics({ companyId, coinBalance }: CompanyStatisticsProps) {
  const [stats, setStats] = useState({
    savedCandidates: 0,
    contactedCandidates: 0,
    hiredCandidates: 0,
    assignedTests: 0,
    completedTests: 0,
  })
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    if (companyId) {
      loadStats()
    }
  }, [companyId])

  const loadStats = async () => {
    setLoading(true)
    try {
      const { count: savedCount } = await supabase
        .from("saved_candidates")
        .select("*", { count: "exact", head: true })
        .eq("company_id", companyId)

      let contactedCount = 0
      let hiredCount = 0
      try {
        const response = await fetch(`/api/company/stats?companyId=${companyId}`)
        if (response.ok) {
          const data = await response.json()
          contactedCount = data.contactedCount || 0
          hiredCount = data.hiredCount || 0
        }
      } catch (error) {
        console.error("Error fetching transaction stats:", error)
      }

      const { count: assignedCount } = await supabase
        .from("company_test_assignments")
        .select("*", { count: "exact", head: true })
        .eq("company_id", companyId)

      const { count: completedCount } = await supabase
        .from("company_test_assignments")
        .select("*", { count: "exact", head: true })
        .eq("company_id", companyId)
        .eq("status", "completed")

      setStats({
        savedCandidates: savedCount || 0,
        contactedCandidates: contactedCount,
        hiredCandidates: hiredCount,
        assignedTests: assignedCount || 0,
        completedTests: completedCount || 0,
      })
    } catch (error) {
      console.error("Error loading stats:", error)
    } finally {
      setLoading(false)
    }
  }

  const statCards = [
    { label: "Zostatok coinov", value: coinBalance, icon: Coins, color: "text-yellow-500" },
    { label: "Uložení kandidáti", value: stats.savedCandidates, icon: Users, color: "text-blue-500" },
    { label: "Kontaktovaní", value: stats.contactedCandidates, icon: Eye, color: "text-purple-500" },
    { label: "Úspešne zamestnaní", value: stats.hiredCandidates, icon: UserCheck, color: "text-green-500" },
    { label: "Pridelené testy", value: stats.assignedTests, icon: ClipboardList, color: "text-orange-500" },
    { label: "Dokončené testy", value: stats.completedTests, icon: ClipboardList, color: "text-teal-500" },
  ]

  if (loading) {
    return <div className="text-center py-8 text-muted-foreground">Načítavam...</div>
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
      {statCards.map((stat) => (
        <div key={stat.label} className="p-4 bg-muted/30 rounded-lg text-center">
          <stat.icon className={`h-6 w-6 mx-auto mb-2 ${stat.color}`} />
          <p className="text-2xl font-bold">{stat.value}</p>
          <p className="text-sm text-muted-foreground">{stat.label}</p>
        </div>
      ))}
    </div>
  )
}
