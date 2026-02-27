"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Checkbox } from "@/components/ui/checkbox"
import { WorkflowStatus } from "@/components/notifications/workflow-status"
import { SupportTicketModal } from "@/components/support-ticket-modal"
import {
  Users,
  Building2,
  UserCheck,
  Euro,
  BarChart3,
  Search,
  Shield,
  Eye,
  Ban,
  CheckCircle,
  BookOpen,
  Award,
  Filter,
  Send,
  Settings,
  Target,
  TrendingUp,
  MessageCircle,
  Upload,
  ImageIcon,
  FileText,
} from "lucide-react"
import { DashboardLayout } from "@/components/dashboard-layout"

interface PlatformStats {
  total_users: number
  total_candidates: number
  total_companies: number
  total_recruiters: number
  new_users_this_month: number
  active_jobs: number
  total_applications: number
  successful_matches: number
  total_coins_in_system: number
  total_commissions_paid: number
  monthly_revenue: number
}

interface UserData {
  id: string
  email: string
  user_type: "candidate" | "company" | "recruiter"
  first_name?: string
  last_name?: string
  company_name?: string
  anonymous_id?: string
  created_at: string
  last_login?: string
  status: "active" | "blocked" | "pending"
  coin_balance?: number
}

interface CommissionData {
  id: string
  recruiter_id: string
  recruiter_name: string
  commission_type: "direct" | "override"
  monthly_amount: number
  month_number: number
  status: "pending" | "paid" | "cancelled"
  created_at: string
  candidate_name: string
  company_name: string
}

interface MonthlyFinancials {
  month: string
  year: number
  total_revenue: number
  total_commissions: number
  recruiter_commissions: number
  platform_profit: number
  candidate_investment: number
}

interface CandidateSkillsData {
  id: string
  anonymous_id: string
  first_name?: string
  last_name?: string
  computer_skills: any
  languages: any
  education_level: string
  work_experience_years: number
  test_results: any
  overall_score: number
  recommended_tests: string[]
}

interface TestAssignmentData {
  candidate_id: string
  test_types: string[]
  reason: string
  assigned_by: string
  created_at: string
}

interface CourseData {
  id: string
  title: string
  description: string
  category: string
  duration_hours: number
  skill_level: string
  is_active: boolean
}

interface CandidateAssignment {
  candidate_id: string
  course_id: string
  assigned_at: string
  completion_status: string
  progress_percentage: number
}

interface SupportTicket {
  id: string
  user_id: string
  user_type: string
  subject: string
  message: string
  status: "open" | "in_progress" | "resolved" | "closed"
  priority: "low" | "normal" | "high" | "urgent"
  category: string
  created_at: string
  updated_at: string
  resolved_at?: string
  support_ticket_attachments: any[]
  support_ticket_responses: any[]
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<PlatformStats | null>(null)
  const [users, setUsers] = useState<UserData[]>([])
  const [commissions, setCommissions] = useState<CommissionData[]>([])
  const [financials, setFinancials] = useState<MonthlyFinancials[]>([])
  const [loading, setLoading] = useState(true)
  const [isFetching, setIsFetching] = useState(false)
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear().toString())
  const [selectedMonth, setSelectedMonth] = useState((new Date().getMonth() + 1).toString())
  const [userFilter, setUserFilter] = useState<"all" | "candidate" | "company" | "recruiter">("all")
  const [searchTerm, setSearchTerm] = useState("")

  const [candidatesSkills, setCandidatesSkills] = useState<CandidateSkillsData[]>([])
  const [courses, setCourses] = useState<CourseData[]>([])
  const [testAssignments, setTestAssignments] = useState<TestAssignmentData[]>([])
  const [candidateAssignments, setCandidateAssignments] = useState<CandidateAssignment[]>([])
  const [skillsFilter, setSkillsFilter] = useState("")
  const [educationFilter, setEducationFilter] = useState("all")
  const [experienceFilter, setExperienceFilter] = useState("all")
  const [selectedCandidates, setSelectedCandidates] = useState<string[]>([])
  const [bulkTestType, setBulkTestType] = useState("")
  const [bulkTestReason, setBulkTestReason] = useState("")

  const [supportTickets, setSupportTickets] = useState<SupportTicket[]>([])
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null)
  const [ticketResponse, setTicketResponse] = useState("")

  const fetchAdminData = async () => {
    if (isFetching) {
      return
    }

    try {
      setLoading(true)
      setIsFetching(true)

      // Fetch platform statistics
      const statsResponse = await fetch("/api/admin/stats")
      if (statsResponse.ok) {
        const statsData = await statsResponse.json()
        setStats(statsData)
      }

      // Fetch users data
      const usersResponse = await fetch("/api/admin/users")
      if (usersResponse.ok) {
        const usersData = await usersResponse.json()
        setUsers(usersData.users || [])
      }

      // Fetch commissions data
      const commissionsResponse = await fetch(`/api/admin/commissions?year=${selectedYear}&month=${selectedMonth}`)
      if (commissionsResponse.ok) {
        const commissionsData = await commissionsResponse.json()
        setCommissions(commissionsData.commissions || [])
      }

      // Fetch financial data
      const financialsResponse = await fetch(`/api/admin/financials?year=${selectedYear}`)
      if (financialsResponse.ok) {
        const financialsData = await financialsResponse.json()
        setFinancials(financialsData.financials || [])
      }

      // Fetch candidates with skills analysis
      const skillsResponse = await fetch("/api/admin/candidates-skills")
      if (skillsResponse.ok) {
        const skillsData = await skillsResponse.json()
        setCandidatesSkills(skillsData.candidates || [])
      }

      // Fetch available courses
      const coursesResponse = await fetch("/api/admin/courses")
      if (coursesResponse.ok) {
        const coursesData = await coursesResponse.json()
        setCourses(coursesData.courses || [])
      }

      // Fetch test assignments
      const assignmentsResponse = await fetch("/api/admin/test-assignments")
      if (assignmentsResponse.ok) {
        const assignmentsData = await assignmentsResponse.json()
        setTestAssignments(assignmentsData.assignments || [])
      }

      // Fetch candidate course assignments
      const candidateAssignmentsResponse = await fetch("/api/admin/candidate-assignments")
      if (candidateAssignmentsResponse.ok) {
        const candidateAssignmentsData = await candidateAssignmentsResponse.json()
        setCandidateAssignments(candidateAssignmentsData.assignments || [])
      }

      // Fetch support tickets
      const ticketsResponse = await fetch("/api/support/tickets")
      if (ticketsResponse.ok) {
        const ticketsData = await ticketsResponse.json()
        setSupportTickets(ticketsData.tickets || [])
      }
    } catch (error) {
      console.error("Error fetching admin data:", error)
    } finally {
      setLoading(false)
      setIsFetching(false)
    }
  }

  useEffect(() => {
    fetchAdminData()
  }, [selectedYear, selectedMonth])

  const handleUserAction = async (userId: string, action: "block" | "unblock" | "delete") => {
    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action }),
      })

      if (response.ok) {
        fetchAdminData() // Refresh data
      }
    } catch (error) {
      console.error("Error performing user action:", error)
    }
  }

  const filteredUsers = users.filter((user) => {
    const matchesFilter = userFilter === "all" || user.user_type === userFilter
    const matchesSearch =
      searchTerm === "" ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.last_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.company_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.anonymous_id?.toLowerCase().includes(searchTerm.toLowerCase())

    return matchesFilter && matchesSearch
  })

  const getStatusBadge = (status: string) => {
    const variants = {
      active: "bg-green-100 text-green-800",
      blocked: "bg-red-100 text-red-800",
      pending: "bg-yellow-100 text-yellow-800",
    }

    const labels = {
      active: "Aktívny",
      blocked: "Blokovaný",
      pending: "Čaká",
    }

    return (
      <Badge className={variants[status as keyof typeof variants] || variants.pending}>
        {labels[status as keyof typeof labels] || status}
      </Badge>
    )
  }

  const getUserTypeLabel = (type: string) => {
    const labels = {
      candidate: "Kandidát",
      company: "Firma",
      recruiter: "Recruiter",
    }
    return labels[type as keyof typeof labels] || type
  }

  const handleBulkTestAssignment = async () => {
    if (selectedCandidates.length === 0 || !bulkTestType) return

    try {
      const response = await fetch("/api/admin/assign-tests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          candidate_ids: selectedCandidates,
          test_type: bulkTestType,
          reason: bulkTestReason,
        }),
      })

      if (response.ok) {
        setSelectedCandidates([])
        setBulkTestType("")
        setBulkTestReason("")
        fetchAdminData()
      }
    } catch (error) {
      console.error("Error assigning tests:", error)
    }
  }

  const handleCourseAssignment = async (candidateId: string, courseId: string) => {
    try {
      const response = await fetch("/api/admin/assign-course", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          candidate_id: candidateId,
          course_id: courseId,
        }),
      })

      if (response.ok) {
        fetchAdminData()
      }
    } catch (error) {
      console.error("Error assigning course:", error)
    }
  }

  const filteredCandidatesSkills = candidatesSkills.filter((candidate) => {
    const matchesSkills =
      skillsFilter === "" ||
      JSON.stringify(candidate.computer_skills).toLowerCase().includes(skillsFilter.toLowerCase()) ||
      JSON.stringify(candidate.languages).toLowerCase().includes(skillsFilter.toLowerCase())

    const matchesEducation = educationFilter === "all" || candidate.education_level === educationFilter

    const matchesExperience =
      experienceFilter === "all" ||
      (experienceFilter === "junior" && candidate.work_experience_years <= 2) ||
      (experienceFilter === "mid" && candidate.work_experience_years > 2 && candidate.work_experience_years <= 5) ||
      (experienceFilter === "senior" && candidate.work_experience_years > 5)

    return matchesSkills && matchesEducation && matchesExperience
  })

  const getSkillLevel = (score: number) => {
    if (score >= 80) return { label: "Pokročilý", color: "bg-green-100 text-green-800" }
    if (score >= 60) return { label: "Stredný", color: "bg-yellow-100 text-yellow-800" }
    return { label: "Začiatočník", color: "bg-red-100 text-red-800" }
  }

  const handleTicketStatusChange = async (ticketId: string, newStatus: string) => {
    try {
      const response = await fetch(`/api/support/tickets/${ticketId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      })

      if (response.ok) {
        fetchAdminData()
      }
    } catch (error) {
      console.error("Error updating ticket status:", error)
    }
  }

  const handleTicketResponse = async (ticketId: string) => {
    if (!ticketResponse.trim()) return

    try {
      const response = await fetch(`/api/support/tickets/${ticketId}/responses`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: ticketResponse,
          is_admin_response: true,
        }),
      })

      if (response.ok) {
        setTicketResponse("")
        fetchAdminData()
      }
    } catch (error) {
      console.error("Error sending response:", error)
    }
  }

  const getPriorityBadge = (priority: string) => {
    const variants = {
      low: "bg-gray-100 text-gray-800",
      normal: "bg-blue-100 text-blue-800",
      high: "bg-orange-100 text-orange-800",
      urgent: "bg-red-100 text-red-800",
    }

    const labels = {
      low: "Nízka",
      normal: "Normálna",
      high: "Vysoká",
      urgent: "Urgentná",
    }

    return (
      <Badge className={variants[priority as keyof typeof variants] || variants.normal}>
        {labels[priority as keyof typeof labels] || priority}
      </Badge>
    )
  }

  const getTicketStatusBadge = (status: string) => {
    const variants = {
      open: "bg-yellow-100 text-yellow-800",
      in_progress: "bg-blue-100 text-blue-800",
      resolved: "bg-green-100 text-green-800",
      closed: "bg-gray-100 text-gray-800",
    }

    const labels = {
      open: "Otvorený",
      in_progress: "V riešení",
      resolved: "Vyriešený",
      closed: "Zatvorený",
    }

    return (
      <Badge className={variants[status as keyof typeof variants] || variants.open}>
        {labels[status as keyof typeof labels] || status}
      </Badge>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Načítavam admin dashboard...</p>
          <p className="text-sm text-muted-foreground mt-2">Admin dashboard je dočasne vypnutý kvôli optimalizácii</p>
        </div>
      </div>
    )
  }

  return (
    <DashboardLayout requireVerification={true}>
      <div className="min-h-screen flex flex-col bg-background">
        {/* Header */}
        <header className="border-b border-border bg-card">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <span className="text-foreground">Admin Dashboard</span>
              <Badge className="bg-red-100 text-red-800">
                <Shield className="w-3 h-3 mr-1" />
                Admin
              </Badge>
            </div>
            <div className="flex gap-2">
              <SupportTicketModal userType="admin" />
              <Link href="/" className="text-primary hover:text-primary/80 transition-colors">
                ← Späť na hlavnú stránku
              </Link>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 container mx-auto px-4 py-8">
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">Admin Dashboard</h1>
            <p className="text-muted-foreground text-lg">Kompletný prehľad platformy SOMVIAC</p>
          </div>

          <WorkflowStatus userType="admin" />

          {/* Platform Overview Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Celkom používateľov</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats?.total_users || 0}</div>
                <p className="text-xs text-muted-foreground">+{stats?.new_users_this_month || 0} tento mesiac</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Aktívne pozície</CardTitle>
                <Building2 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats?.active_jobs || 0}</div>
                <p className="text-xs text-muted-foreground">{stats?.total_applications || 0} aplikácií</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Úspešné párovanie</CardTitle>
                <UserCheck className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats?.successful_matches || 0}</div>
                <p className="text-xs text-muted-foreground">
                  {stats?.total_applications
                    ? ((stats.successful_matches / stats.total_applications) * 100).toFixed(1)
                    : 0}
                  % úspešnosť
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Mesačný príjem</CardTitle>
                <Euro className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats?.monthly_revenue?.toFixed(2) || "0.00"}€</div>
                <p className="text-xs text-muted-foreground">{stats?.total_coins_in_system || 0} coinov v systéme</p>
              </CardContent>
            </Card>
          </div>

          {/* User Type Breakdown */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-blue-500" />
                  Kandidáti
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-blue-600">{stats?.total_candidates || 0}</div>
                <p className="text-sm text-muted-foreground">Registrovaní kandidáti</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-green-500" />
                  Firmy
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-600">{stats?.total_companies || 0}</div>
                <p className="text-sm text-muted-foreground">Registrované firmy</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <UserCheck className="w-5 h-5 text-purple-500" />
                  Recruiteri
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-purple-600">{stats?.total_recruiters || 0}</div>
                <p className="text-sm text-muted-foreground">Aktívni recruiteri</p>
              </CardContent>
            </Card>
          </div>

          {/* Month/Year Filter */}
          <div className="flex gap-4 mb-6">
            <Select value={selectedYear} onValueChange={setSelectedYear}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Rok" />
              </SelectTrigger>
              <SelectContent>
                {[2024, 2025, 2026].map((year) => (
                  <SelectItem key={year} value={year.toString()}>
                    {year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedMonth} onValueChange={setSelectedMonth}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Mesiac" />
              </SelectTrigger>
              <SelectContent>
                {[
                  { value: "1", label: "Január" },
                  { value: "2", label: "Február" },
                  { value: "3", label: "Marec" },
                  { value: "4", label: "Apríl" },
                  { value: "5", label: "Máj" },
                  { value: "6", label: "Jún" },
                  { value: "7", label: "Júl" },
                  { value: "8", label: "August" },
                  { value: "9", label: "September" },
                  { value: "10", label: "Október" },
                  { value: "11", label: "November" },
                  { value: "12", label: "December" },
                ].map((month) => (
                  <SelectItem key={month.value} value={month.value}>
                    {month.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Tabs */}
          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList>
              <TabsTrigger value="overview">Prehľad</TabsTrigger>
              <TabsTrigger value="users">Používatelia</TabsTrigger>
              <TabsTrigger value="commissions">Provízie (20%)</TabsTrigger>
              <TabsTrigger value="financials">Financie</TabsTrigger>
              <TabsTrigger value="analytics">Analytika</TabsTrigger>
              <TabsTrigger value="skills-analysis">Analýza schopností</TabsTrigger>
              <TabsTrigger value="test-management">Správa testov</TabsTrigger>
              <TabsTrigger value="course-management">Správa kurzov</TabsTrigger>
              <TabsTrigger value="global-stats">Globálne štatistiky</TabsTrigger>
              <TabsTrigger value="support-tickets">Support tickety</TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview">
              <div className="grid gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Prehľad platformy</CardTitle>
                    <CardDescription>Kľúčové metriky a štatistiky</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-600">{stats?.total_users || 0}</div>
                        <div className="text-sm text-muted-foreground">Celkom používateľov</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-600">{stats?.active_jobs || 0}</div>
                        <div className="text-sm text-muted-foreground">Aktívne pozície</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-purple-600">{stats?.successful_matches || 0}</div>
                        <div className="text-sm text-muted-foreground">Úspešné párovanie</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-orange-600">
                          {stats?.total_commissions_paid?.toFixed(2) || "0.00"}€
                        </div>
                        <div className="text-sm text-muted-foreground">Vyplatené provízie</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Recruiter provízie (20% systém)</CardTitle>
                    <CardDescription>Prehľad 20% provízneho systému pre recruiterov</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center p-4 bg-green-50 rounded-lg">
                        <div>
                          <div className="font-medium">Priame provízie (20%)</div>
                          <div className="text-sm text-muted-foreground">
                            Recruiteri dostávajú 20% z mesačnej mzdy kandidáta
                          </div>
                        </div>
                        <div className="text-2xl font-bold text-green-600">20%</div>
                      </div>
                      <div className="flex justify-between items-center p-4 bg-blue-50 rounded-lg">
                        <div>
                          <div className="font-medium">Override provízie (2%)</div>
                          <div className="text-sm text-muted-foreground">
                            Nadradení recruiteri dostávajú 2% za úroveň
                          </div>
                        </div>
                        <div className="text-2xl font-bold text-blue-600">2%</div>
                      </div>
                      <div className="flex justify-between items-center p-4 bg-purple-50 rounded-lg">
                        <div>
                          <div className="font-medium">Celkovo vyplatené provízie</div>
                          <div className="text-sm text-muted-foreground">Tento mesiac</div>
                        </div>
                        <div className="text-2xl font-bold text-purple-600">
                          {commissions.reduce((sum, c) => sum + c.monthly_amount, 0).toFixed(2)}€
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Users Tab */}
            <TabsContent value="users">
              <Card>
                <CardHeader>
                  <CardTitle>Správa používateľov</CardTitle>
                  <CardDescription>Prehľad a správa všetkých používateľov platformy</CardDescription>
                </CardHeader>
                <CardContent>
                  {/* Filters */}
                  <div className="flex gap-4 mb-6">
                    <Select value={userFilter} onValueChange={(value: any) => setUserFilter(value)}>
                      <SelectTrigger className="w-48">
                        <SelectValue placeholder="Typ používateľa" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Všetci používatelia</SelectItem>
                        <SelectItem value="candidate">Kandidáti</SelectItem>
                        <SelectItem value="company">Firmy</SelectItem>
                        <SelectItem value="recruiter">Recruiteri</SelectItem>
                      </SelectContent>
                    </Select>

                    <div className="relative flex-1">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Hľadať používateľov..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>

                  {/* Users List */}
                  <div className="space-y-4">
                    {filteredUsers.map((user) => (
                      <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-muted rounded-full flex items-center justify-center">
                            {user.user_type === "candidate" && <Users className="w-5 h-5" />}
                            {user.user_type === "company" && <Building2 className="w-5 h-5" />}
                            {user.user_type === "recruiter" && <UserCheck className="w-5 h-5" />}
                          </div>
                          <div>
                            <div className="font-medium">
                              {user.company_name ||
                                (user.first_name && user.last_name
                                  ? `${user.first_name} ${user.last_name}`
                                  : user.anonymous_id) ||
                                user.email}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {getUserTypeLabel(user.user_type)} • {user.email}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              Registrovaný: {new Date(user.created_at).toLocaleDateString("sk-SK")}
                              {user.last_login &&
                                ` • Posledné prihlásenie: ${new Date(user.last_login).toLocaleDateString("sk-SK")}`}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          {user.coin_balance !== undefined && (
                            <div className="text-right">
                              <div className="text-sm font-medium">{user.coin_balance} coinov</div>
                            </div>
                          )}
                          {getStatusBadge(user.status)}
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline">
                              <Eye className="w-4 h-4" />
                            </Button>
                            {user.status === "active" ? (
                              <Button size="sm" variant="outline" onClick={() => handleUserAction(user.id, "block")}>
                                <Ban className="w-4 h-4" />
                              </Button>
                            ) : (
                              <Button size="sm" variant="outline" onClick={() => handleUserAction(user.id, "unblock")}>
                                <CheckCircle className="w-4 h-4" />
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Commissions Tab */}
            <TabsContent value="commissions">
              <Card>
                <CardHeader>
                  <CardTitle>Recruiter provízie (20% systém)</CardTitle>
                  <CardDescription>Prehľad všetkých provízií v 20% systéme</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {commissions.length === 0 ? (
                      <div className="text-center py-8 text-muted-foreground">Žiadne provízie pre vybraný mesiac</div>
                    ) : (
                      commissions.map((commission) => (
                        <div key={commission.id} className="flex items-center justify-between p-4 border rounded-lg">
                          <div>
                            <div className="font-medium">{commission.recruiter_name}</div>
                            <div className="text-sm text-muted-foreground">
                              {commission.candidate_name} → {commission.company_name}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {commission.commission_type === "direct"
                                ? "Priama provízia (20%)"
                                : "Override provízia (2%)"}{" "}
                              • Mesiac {commission.month_number}/6
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-bold text-lg">{commission.monthly_amount.toFixed(2)}€</div>
                            <Badge
                              className={
                                commission.status === "paid"
                                  ? "bg-green-100 text-green-800"
                                  : commission.status === "pending"
                                    ? "bg-yellow-100 text-yellow-800"
                                    : "bg-red-100 text-red-800"
                              }
                            >
                              {commission.status === "paid"
                                ? "Vyplatené"
                                : commission.status === "pending"
                                  ? "Čaká"
                                  : "Zrušené"}
                            </Badge>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Financials Tab */}
            <TabsContent value="financials">
              <Card>
                <CardHeader>
                  <CardTitle>Finančný prehľad</CardTitle>
                  <CardDescription>Mesačné finančné štatistiky a rozdelenie príjmov</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {financials.map((financial) => (
                      <div key={`${financial.year}-${financial.month}`} className="border rounded-lg p-4">
                        <div className="flex justify-between items-center mb-4">
                          <h4 className="font-semibold text-lg">
                            {financial.month}/{financial.year}
                          </h4>
                          <div className="text-right">
                            <div className="font-bold text-xl text-green-600">
                              {financial.total_revenue.toFixed(2)}€
                            </div>
                            <div className="text-sm text-muted-foreground">Celkový príjem</div>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          <div className="text-center p-3 bg-blue-50 rounded">
                            <div className="font-bold text-blue-600">{financial.recruiter_commissions.toFixed(2)}€</div>
                            <div className="text-xs text-muted-foreground">Recruiter provízie (20%)</div>
                          </div>
                          <div className="text-center p-3 bg-purple-50 rounded">
                            <div className="font-bold text-purple-600">
                              {financial.candidate_investment.toFixed(2)}€
                            </div>
                            <div className="text-xs text-muted-foreground">Investícia do kandidátov (10%)</div>
                          </div>
                          <div className="text-center p-3 bg-green-50 rounded">
                            <div className="font-bold text-green-600">{financial.platform_profit.toFixed(2)}€</div>
                            <div className="text-xs text-muted-foreground">Zisk platformy</div>
                          </div>
                          <div className="text-center p-3 bg-orange-50 rounded">
                            <div className="font-bold text-orange-600">{financial.total_commissions.toFixed(2)}€</div>
                            <div className="text-xs text-muted-foreground">Celkové provízie</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Analytics Tab */}
            <TabsContent value="analytics">
              <div className="grid gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BarChart3 className="w-5 h-5" />
                      Analytika platformy
                    </CardTitle>
                    <CardDescription>Detailné štatistiky a trendy</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-medium mb-3">Úspešnosť párovania</h4>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-sm">Celkové aplikácie</span>
                            <span className="font-medium">{stats?.total_applications || 0}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm">Úspešné párovanie</span>
                            <span className="font-medium">{stats?.successful_matches || 0}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm">Úspešnosť</span>
                            <span className="font-medium text-green-600">
                              {stats?.total_applications
                                ? ((stats.successful_matches / stats.total_applications) * 100).toFixed(1)
                                : 0}
                              %
                            </span>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h4 className="font-medium mb-3">Finančné metriky</h4>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-sm">Coiny v systéme</span>
                            <span className="font-medium">{stats?.total_coins_in_system || 0}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm">Vyplatené provízie</span>
                            <span className="font-medium">{stats?.total_commissions_paid?.toFixed(2) || "0.00"}€</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm">Mesačný príjem</span>
                            <span className="font-medium text-green-600">
                              {stats?.monthly_revenue?.toFixed(2) || "0.00"}€
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Globálne štatistiky</CardTitle>
                    <CardDescription>Štatistiky viditeľné pre všetkých používateľov</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-600">{stats?.total_users || 0}</div>
                        <div className="text-sm text-muted-foreground">Používateľov v databáze</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-600">{stats?.new_users_this_month || 0}</div>
                        <div className="text-sm text-muted-foreground">Nových za posledný mesiac</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-purple-600">{stats?.successful_matches || 0}</div>
                        <div className="text-sm text-muted-foreground">Úspešných párovanie za mesiac</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-orange-600">{stats?.total_recruiters || 0}</div>
                        <div className="text-sm text-muted-foreground">Aktívnych recruiterov</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="skills-analysis">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="w-5 h-5" />
                    Analýza schopností kandidátov
                  </CardTitle>
                  <CardDescription>
                    Filtrovanie a analýza kandidátov podľa ich schopností, vzdelania a skúseností
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {/* Advanced Filters */}
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Hľadať schopnosti..."
                        value={skillsFilter}
                        onChange={(e) => setSkillsFilter(e.target.value)}
                        className="pl-10"
                      />
                    </div>

                    <Select value={educationFilter} onValueChange={setEducationFilter}>
                      <SelectTrigger>
                        <SelectValue placeholder="Vzdelanie" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Všetky úrovne</SelectItem>
                        <SelectItem value="základné">Základné</SelectItem>
                        <SelectItem value="stredné">Stredné</SelectItem>
                        <SelectItem value="vysokoškolské">Vysokoškolské</SelectItem>
                        <SelectItem value="doktorandské">Doktorandské</SelectItem>
                      </SelectContent>
                    </Select>

                    <Select value={experienceFilter} onValueChange={setExperienceFilter}>
                      <SelectTrigger>
                        <SelectValue placeholder="Skúsenosti" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Všetky úrovne</SelectItem>
                        <SelectItem value="junior">Junior (0-2 roky)</SelectItem>
                        <SelectItem value="mid">Mid (3-5 rokov)</SelectItem>
                        <SelectItem value="senior">Senior (5+ rokov)</SelectItem>
                      </SelectContent>
                    </Select>

                    <Button
                      onClick={() => {
                        setSkillsFilter("")
                        setEducationFilter("all")
                        setExperienceFilter("all")
                      }}
                      variant="outline"
                    >
                      <Filter className="w-4 h-4 mr-2" />
                      Resetovať
                    </Button>
                  </div>

                  {/* Bulk Actions */}
                  {selectedCandidates.length > 0 && (
                    <div className="bg-blue-50 p-4 rounded-lg mb-6">
                      <div className="flex items-center justify-between mb-3">
                        <span className="font-medium">Vybraných kandidátov: {selectedCandidates.length}</span>
                        <Button variant="outline" size="sm" onClick={() => setSelectedCandidates([])}>
                          Zrušiť výber
                        </Button>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <Select value={bulkTestType} onValueChange={setBulkTestType}>
                          <SelectTrigger>
                            <SelectValue placeholder="Vybrať test" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="verbal-comprehension">Verbálne porozumenie</SelectItem>
                            <SelectItem value="data-entry">Zadávanie dát</SelectItem>
                            <SelectItem value="customer-orientation">Orientácia na zákazníka</SelectItem>
                            <SelectItem value="safety">Bezpečnosť</SelectItem>
                            <SelectItem value="language">Jazykový test</SelectItem>
                            <SelectItem value="job-skills">Pracovné zručnosti</SelectItem>
                          </SelectContent>
                        </Select>
                        <Input
                          placeholder="Dôvod pridelenia testu..."
                          value={bulkTestReason}
                          onChange={(e) => setBulkTestReason(e.target.value)}
                        />
                        <Button onClick={handleBulkTestAssignment} disabled={!bulkTestType}>
                          <Send className="w-4 h-4 mr-2" />
                          Prideliť test
                        </Button>
                      </div>
                    </div>
                  )}

                  {/* Candidates List */}
                  <div className="space-y-4">
                    {filteredCandidatesSkills.map((candidate) => {
                      const skillLevel = getSkillLevel(candidate.overall_score)
                      const isSelected = selectedCandidates.includes(candidate.id)

                      return (
                        <div
                          key={candidate.id}
                          className={`border rounded-lg p-4 ${isSelected ? "bg-blue-50 border-blue-200" : ""}`}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex items-start gap-4">
                              <Checkbox
                                checked={isSelected}
                                onCheckedChange={(checked) => {
                                  if (checked) {
                                    setSelectedCandidates([...selectedCandidates, candidate.id])
                                  } else {
                                    setSelectedCandidates(selectedCandidates.filter((id) => id !== candidate.id))
                                  }
                                }}
                              />
                              <div className="flex-1">
                                <div className="flex items-center gap-3 mb-2">
                                  <h4 className="font-medium">
                                    {candidate.first_name && candidate.last_name
                                      ? `${candidate.first_name} ${candidate.last_name}`
                                      : candidate.anonymous_id}
                                  </h4>
                                  <Badge className={skillLevel.color}>{skillLevel.label}</Badge>
                                  <Badge variant="outline">Skóre: {candidate.overall_score}/100</Badge>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                                  <div>
                                    <span className="font-medium">Vzdelanie:</span> {candidate.education_level}
                                  </div>
                                  <div>
                                    <span className="font-medium">Skúsenosti:</span> {candidate.work_experience_years}{" "}
                                    rokov
                                  </div>
                                  <div>
                                    <span className="font-medium">Jazyky:</span>{" "}
                                    {candidate.languages ? Object.keys(candidate.languages).join(", ") : "Neuvedené"}
                                  </div>
                                </div>

                                {candidate.recommended_tests.length > 0 && (
                                  <div className="mt-3">
                                    <span className="text-sm font-medium">Odporúčané testy:</span>
                                    <div className="flex flex-wrap gap-2 mt-1">
                                      {candidate.recommended_tests.map((test) => (
                                        <Badge key={test} variant="secondary" className="text-xs">
                                          {test}
                                        </Badge>
                                      ))}
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>

                            <div className="flex gap-2">
                              <Dialog>
                                <DialogTrigger asChild>
                                  <Button size="sm" variant="outline">
                                    <BookOpen className="w-4 h-4" />
                                  </Button>
                                </DialogTrigger>
                                <DialogContent className="max-w-2xl">
                                  <DialogHeader>
                                    <DialogTitle>Prideliť kurz</DialogTitle>
                                    <DialogDescription>
                                      Vyberte kurz pre kandidáta {candidate.anonymous_id}
                                    </DialogDescription>
                                  </DialogHeader>
                                  <div className="grid gap-4 py-4">
                                    {courses.map((course) => (
                                      <div
                                        key={course.id}
                                        className="flex items-center justify-between p-3 border rounded"
                                      >
                                        <div>
                                          <div className="font-medium">{course.title}</div>
                                          <div className="text-sm text-muted-foreground">{course.description}</div>
                                          <div className="text-xs text-muted-foreground mt-1">
                                            {course.duration_hours}h • {course.skill_level} • {course.category}
                                          </div>
                                        </div>
                                        <Button
                                          size="sm"
                                          onClick={() => handleCourseAssignment(candidate.id, course.id)}
                                        >
                                          Prideliť
                                        </Button>
                                      </div>
                                    ))}
                                  </div>
                                </DialogContent>
                              </Dialog>

                              <Button size="sm" variant="outline">
                                <Eye className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="test-management">
              <div className="grid gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Award className="w-5 h-5" />
                      Správa testov a rozhodovanie o prerozdelení
                    </CardTitle>
                    <CardDescription>
                      Prehľad pridelených testov a rozhodovanie o prerozdelení kandidátov do testov
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {testAssignments.map((assignment) => (
                        <div
                          key={`${assignment.candidate_id}-${assignment.created_at}`}
                          className="border rounded-lg p-4"
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="font-medium">Kandidát ID: {assignment.candidate_id}</div>
                              <div className="text-sm text-muted-foreground">
                                Testy: {assignment.test_types.join(", ")}
                              </div>
                              <div className="text-sm text-muted-foreground">Dôvod: {assignment.reason}</div>
                              <div className="text-xs text-muted-foreground">
                                Pridelené: {new Date(assignment.created_at).toLocaleDateString("sk-SK")}• Administrátor:{" "}
                                {assignment.assigned_by}
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <Button size="sm" variant="outline">
                                Upraviť
                              </Button>
                              <Button size="sm" variant="outline">
                                Zrušiť
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Štatistiky testov</CardTitle>
                    <CardDescription>Prehľad úspešnosti a využitia testov</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="text-center p-4 bg-blue-50 rounded">
                        <div className="text-2xl font-bold text-blue-600">{testAssignments.length}</div>
                        <div className="text-sm text-muted-foreground">Celkom pridelených</div>
                      </div>
                      <div className="text-center p-4 bg-purple-50 rounded">
                        <div className="text-2xl font-bold text-purple-600">
                          {testAssignments.filter((t) => t.test_types.includes("verbal-comprehension")).length}
                        </div>
                        <div className="text-sm text-muted-foreground">Verbálne porozumenie</div>
                      </div>
                      <div className="text-center p-4 bg-orange-50 rounded">
                        <div className="text-2xl font-bold text-orange-600">
                          {testAssignments.filter((t) => t.test_types.includes("job-skills")).length}
                        </div>
                        <div className="text-sm text-muted-foreground">Pracovné zručnosti</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="course-management">
              <div className="grid gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BookOpen className="w-5 h-5" />
                      Správa kurzov
                    </CardTitle>
                    <CardDescription>
                      Manuálne prideľovanie kurzov kandidátom a správa vzdelávacieho obsahu
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-4">
                      {courses.map((course) => (
                        <div key={course.id} className="border rounded-lg p-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="font-medium">{course.title}</div>
                              <div className="text-sm text-muted-foreground">{course.description}</div>
                              <div className="flex gap-4 mt-2 text-xs text-muted-foreground">
                                <span>Trvanie: {course.duration_hours}h</span>
                                <span>Úroveň: {course.skill_level}</span>
                                <span>Kategória: {course.category}</span>
                              </div>
                            </div>
                            <div className="flex items-center gap-3">
                              <Badge
                                className={course.is_active ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}
                              >
                                {course.is_active ? "Aktívny" : "Neaktívny"}
                              </Badge>
                              <Button size="sm" variant="outline">
                                <Settings className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Pridelené kurzy</CardTitle>
                    <CardDescription>Prehľad kurzov pridelených kandidátom</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {candidateAssignments.map((assignment) => (
                        <div
                          key={`${assignment.candidate_id}-${assignment.course_id}`}
                          className="flex items-center justify-between p-3 border rounded"
                        >
                          <div>
                            <div className="font-medium">Kandidát: {assignment.candidate_id}</div>
                            <div className="text-sm text-muted-foreground">
                              Kurz: {courses.find((c) => c.id === assignment.course_id)?.title || "Neznámy kurz"}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              Pridelené: {new Date(assignment.assigned_at).toLocaleDateString("sk-SK")}
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-medium">{assignment.progress_percentage}%</div>
                            <Badge
                              className={
                                assignment.completion_status === "completed"
                                  ? "bg-green-100 text-green-800"
                                  : assignment.completion_status === "in_progress"
                                    ? "bg-yellow-100 text-yellow-800"
                                    : "bg-gray-100 text-gray-800"
                              }
                            >
                              {assignment.completion_status === "completed"
                                ? "Dokončené"
                                : assignment.completion_status === "in_progress"
                                  ? "Prebieha"
                                  : "Nezačaté"}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="global-stats">
              <div className="grid gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="w-5 h-5" />
                      Globálne štatistiky platformy
                    </CardTitle>
                    <CardDescription>
                      Kompletné štatistiky viditeľné pre všetkých používateľov platformy
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                      <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg">
                        <div className="text-3xl font-bold text-blue-600 mb-2">{stats?.total_users || 0}</div>
                        <div className="text-sm font-medium text-blue-800">Používateľov v databáze</div>
                        <div className="text-xs text-blue-600 mt-1">
                          +{stats?.new_users_this_month || 0} za posledný mesiac
                        </div>
                      </div>

                      <div className="text-center p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-lg">
                        <div className="text-3xl font-bold text-green-600 mb-2">{stats?.successful_matches || 0}</div>
                        <div className="text-sm font-medium text-green-800">Úspešných párovanie za mesiac</div>
                        <div className="text-xs text-green-600 mt-1">
                          {stats?.total_applications
                            ? ((stats.successful_matches / stats.total_applications) * 100).toFixed(1)
                            : 0}
                          % úspešnosť
                        </div>
                      </div>

                      <div className="text-center p-6 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg">
                        <div className="text-3xl font-bold text-purple-600 mb-2">{stats?.total_recruiters || 0}</div>
                        <div className="text-sm font-medium text-purple-800">Aktívnych recruiterov</div>
                        <div className="text-xs text-purple-600 mt-1">20% provízie systém</div>
                      </div>

                      <div className="text-center p-6 bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg">
                        <div className="text-3xl font-bold text-orange-600 mb-2">{stats?.active_jobs || 0}</div>
                        <div className="text-sm font-medium text-orange-800">Aktívnych pozícií</div>
                        <div className="text-xs text-orange-600 mt-1">
                          {stats?.total_applications || 0} aplikácií celkom
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Mesačné trendy</CardTitle>
                    <CardDescription>Vývoj kľúčových metrík v čase</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <h4 className="font-medium">Rast používateľov</h4>
                        <div className="space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="text-sm">Kandidáti</span>
                            <div className="flex items-center gap-2">
                              <div className="w-24 bg-gray-200 rounded-full h-2">
                                <div className="bg-blue-600 h-2 rounded-full" style={{ width: "75%" }}></div>
                              </div>
                              <span className="text-sm font-medium">{stats?.total_candidates || 0}</span>
                            </div>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm">Firmy</span>
                            <div className="flex items-center gap-2">
                              <div className="w-24 bg-gray-200 rounded-full h-2">
                                <div className="bg-green-600 h-2 rounded-full" style={{ width: "60%" }}></div>
                              </div>
                              <span className="text-sm font-medium">{stats?.total_companies || 0}</span>
                            </div>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm">Recruiteri</span>
                            <div className="flex items-center gap-2">
                              <div className="w-24 bg-gray-200 rounded-full h-2">
                                <div className="bg-purple-600 h-2 rounded-full" style={{ width: "45%" }}></div>
                              </div>
                              <span className="text-sm font-medium">{stats?.total_recruiters || 0}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <h4 className="font-medium">Finančné metriky</h4>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-sm">Mesačný príjem</span>
                            <span className="font-medium text-green-600">
                              {stats?.monthly_revenue?.toFixed(2) || "0.00"}€
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm">Vyplatené provízie</span>
                            <span className="font-medium text-blue-600">
                              {stats?.total_commissions_paid?.toFixed(2) || "0.00"}€
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm">Coiny v systéme</span>
                            <span className="font-medium text-purple-600">{stats?.total_coins_in_system || 0}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Kvalita platformy</CardTitle>
                    <CardDescription>Metriky kvality a spokojnosti používateľov</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="text-center p-4 border rounded-lg">
                        <div className="text-2xl font-bold text-green-600 mb-2">
                          {stats?.total_applications
                            ? ((stats.successful_matches / stats.total_applications) * 100).toFixed(1)
                            : 0}
                          %
                        </div>
                        <div className="text-sm font-medium">Úspešnosť párovania</div>
                        <div className="text-xs text-muted-foreground mt-1">
                          {stats?.successful_matches || 0} z {stats?.total_applications || 0} aplikácií
                        </div>
                      </div>

                      <div className="text-center p-4 border rounded-lg">
                        <div className="text-2xl font-bold text-blue-600 mb-2">
                          {stats?.total_users ? ((stats.new_users_this_month / stats.total_users) * 100).toFixed(1) : 0}
                          %
                        </div>
                        <div className="text-sm font-medium">Mesačný rast</div>
                        <div className="text-xs text-muted-foreground mt-1">Nových používateľov</div>
                      </div>

                      <div className="text-center p-4 border rounded-lg">
                        <div className="text-2xl font-bold text-purple-600 mb-2">
                          {stats?.total_recruiters
                            ? (stats.total_recruiters / (stats.total_companies || 1)).toFixed(1)
                            : 0}
                        </div>
                        <div className="text-sm font-medium">Recruiteri na firmu</div>
                        <div className="text-xs text-muted-foreground mt-1">Priemerný pomer</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="support-tickets">
              <div className="grid gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <MessageCircle className="w-5 h-5" />
                      Support tickety
                    </CardTitle>
                    <CardDescription>Správa všetkých support टिकटov od používateľov</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {/* Filters */}
                    <div className="flex gap-4 mb-6">
                      <Select defaultValue="all">
                        <SelectTrigger className="w-48">
                          <SelectValue placeholder="Status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Všetky statusy</SelectItem>
                          <SelectItem value="open">Otvorené</SelectItem>
                          <SelectItem value="in_progress">V riešení</SelectItem>
                          <SelectItem value="resolved">Vyriešené</SelectItem>
                          <SelectItem value="closed">Zatvorený</SelectItem>
                        </SelectContent>
                      </Select>

                      <Select defaultValue="all">
                        <SelectTrigger className="w-48">
                          <SelectValue placeholder="Priorita" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Všetky priority</SelectItem>
                          <SelectItem value="urgent">Urgentné</SelectItem>
                          <SelectItem value="high">Vysoké</SelectItem>
                          <SelectItem value="normal">Normálne</SelectItem>
                          <SelectItem value="low">Nízke</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Tickets List */}
                    <div className="space-y-4">
                      {supportTickets.length === 0 ? (
                        <div className="text-center py-8 text-muted-foreground">Žiadne support tickety</div>
                      ) : (
                        supportTickets.map((ticket) => (
                          <div
                            key={ticket.id}
                            className="border rounded-lg p-4 hover:bg-muted/50 cursor-pointer"
                            onClick={() => setSelectedTicket(ticket)}
                          >
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <div className="flex items-center gap-3 mb-2">
                                  <h4 className="font-medium">{ticket.subject}</h4>
                                  {getTicketStatusBadge(ticket.status)}
                                  {getPriorityBadge(ticket.priority)}
                                  {ticket.category && <Badge variant="outline">{ticket.category}</Badge>}
                                </div>
                                <p className="text-sm text-muted-foreground line-clamp-2 mb-2">{ticket.message}</p>
                                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                  <span>Typ: {getUserTypeLabel(ticket.user_type)}</span>
                                  <span>Vytvorené: {new Date(ticket.created_at).toLocaleDateString("sk-SK")}</span>
                                  {ticket.support_ticket_attachments.length > 0 && (
                                    <span className="flex items-center gap-1">
                                      <Upload className="w-3 h-3" />
                                      {ticket.support_ticket_attachments.length} príloh
                                    </span>
                                  )}
                                  {ticket.support_ticket_responses.length > 0 && (
                                    <span className="flex items-center gap-1">
                                      <MessageCircle className="w-3 h-3" />
                                      {ticket.support_ticket_responses.length} odpovedí
                                    </span>
                                  )}
                                </div>
                              </div>
                              <div className="flex gap-2">
                                <Select
                                  value={ticket.status}
                                  onValueChange={(value) => handleTicketStatusChange(ticket.id, value)}
                                >
                                  <SelectTrigger className="w-32">
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="open">Otvorený</SelectItem>
                                    <SelectItem value="in_progress">V riešení</SelectItem>
                                    <SelectItem value="resolved">Vyriešený</SelectItem>
                                    <SelectItem value="closed">Zatvorený</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Ticket Detail Modal */}
                {selectedTicket && (
                  <Dialog open={!!selectedTicket} onOpenChange={() => setSelectedTicket(null)}>
                    <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle className="flex items-center gap-3">
                          {selectedTicket.subject}
                          {getTicketStatusBadge(selectedTicket.status)}
                          {getPriorityBadge(selectedTicket.priority)}
                        </DialogTitle>
                        <DialogDescription>
                          Ticket ID: {selectedTicket.id} • Vytvorené:{" "}
                          {new Date(selectedTicket.created_at).toLocaleString("sk-SK")}
                        </DialogDescription>
                      </DialogHeader>

                      <div className="space-y-6">
                        {/* Original Message */}
                        <div className="border rounded-lg p-4 bg-muted/50">
                          <div className="flex items-center gap-2 mb-2">
                            <Badge variant="outline">{getUserTypeLabel(selectedTicket.user_type)}</Badge>
                            {selectedTicket.category && <Badge variant="outline">{selectedTicket.category}</Badge>}
                          </div>
                          <p className="text-sm whitespace-pre-wrap">{selectedTicket.message}</p>
                        </div>

                        {/* Attachments */}
                        {selectedTicket.support_ticket_attachments.length > 0 && (
                          <div>
                            <h4 className="font-medium mb-3">Prílohy</h4>
                            <div className="grid grid-cols-2 gap-3">
                              {selectedTicket.support_ticket_attachments.map((attachment: any) => (
                                <a
                                  key={attachment.id}
                                  href={attachment.file_url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex items-center gap-2 p-3 border rounded-lg hover:bg-muted/50"
                                >
                                  {attachment.file_type.startsWith("image/") ? (
                                    <ImageIcon className="w-4 h-4" />
                                  ) : (
                                    <FileText className="w-4 h-4" />
                                  )}
                                  <span className="text-sm truncate">{attachment.file_name}</span>
                                  <Badge variant="secondary" className="text-xs ml-auto">
                                    {(attachment.file_size / 1024).toFixed(1)} KB
                                  </Badge>
                                </a>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Responses */}
                        {selectedTicket.support_ticket_responses.length > 0 && (
                          <div>
                            <h4 className="font-medium mb-3">Odpovede</h4>
                            <div className="space-y-3">
                              {selectedTicket.support_ticket_responses.map((response: any) => (
                                <div
                                  key={response.id}
                                  className={`p-3 rounded-lg ${
                                    response.is_admin_response ? "bg-blue-50 border-blue-200 border" : "bg-muted/50"
                                  }`}
                                >
                                  <div className="flex items-center gap-2 mb-2">
                                    {response.is_admin_response && (
                                      <Badge className="bg-blue-100 text-blue-800">Admin</Badge>
                                    )}
                                    <span className="text-xs text-muted-foreground">
                                      {new Date(response.created_at).toLocaleString("sk-SK")}
                                    </span>
                                  </div>
                                  <p className="text-sm whitespace-pre-wrap">{response.message}</p>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Response Form */}
                        <div>
                          <h4 className="font-medium mb-3">Odpovedať</h4>
                          <div className="space-y-3">
                            <Textarea
                              placeholder="Napíšte odpoveď..."
                              value={ticketResponse}
                              onChange={(e) => setTicketResponse(e.target.value)}
                              rows={4}
                            />
                            <div className="flex justify-end gap-2">
                              <Button variant="outline" onClick={() => setSelectedTicket(null)}>
                                Zavrieť
                              </Button>
                              <Button
                                onClick={() => handleTicketResponse(selectedTicket.id)}
                                disabled={!ticketResponse.trim()}
                              >
                                <Send className="w-4 h-4 mr-2" />
                                Odoslať odpoveď
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </DashboardLayout>
  )
}
