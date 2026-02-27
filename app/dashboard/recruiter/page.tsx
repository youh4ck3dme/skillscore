"use client"
import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { DashboardLayout } from "@/components/dashboard-layout"
import { useAuth } from "@/lib/auth/auth-context"
import { ReadOnlyBanner } from "@/components/ui/read-only-banner"
import { RegistrationRequiredModal } from "@/components/modals/registration-required-modal"
import { useAuthGuard } from "@/lib/hooks/use-auth-guard"
import { useRouter } from "next/navigation"
import { SupportTicketModal } from "@/components/support-ticket-modal"
import { Users, TrendingUp, Euro, Award, Send } from "lucide-react"
import useSWR from "swr"
import { RecruiterInvitationModal } from "@/components/recruiter-invitation-modal"
import { RecruiterContractBanner } from "@/components/recruiter-contract-banner"
import { RecruiterInfoExpandable } from "@/components/recruiter-info-expandable"
import { RecruiterInvitationsList } from "@/components/recruiter-invitations-list"
import { RecruiterInviteRecruitersList } from "@/components/recruiter-invite-recruiters-list"
import { PricingCalculator } from "@/components/pricing-calculator"
import { useT } from "@/lib/i18n/hooks"

type UserType = "company" | "candidate" | "recruiter" | "admin"

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export default function RecruiterDashboard() {
  const t = useT()
  const { user } = useAuth()
  const { showRegistrationModal, suggestedUserType, closeRegistrationModal } = useAuthGuard()
  const router = useRouter()

  const [localContractSigned, setLocalContractSigned] = useState(false)

  const { data: statsData, error: statsError } = useSWR("/api/recruiter/stats", fetcher, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    dedupingInterval: 30000,
  })

  const { data: userData } = useSWR("/api/auth/me", fetcher, {
    revalidateOnFocus: false,
  })

  const { data: contractData, mutate: mutateContract } = useSWR("/api/recruiter/contract", fetcher, {
    revalidateOnFocus: false,
  })

  const statsLoading = !statsData && !statsError
  const isContractSigned = contractData?.contract_signed || localContractSigned
  const recruiterId = userData?.user?.id || user?.id

  const stats = {
    totalRecruits: statsData?.totalRecruits || 0,
    activeRecruits: statsData?.activeRecruits || 0,
    totalEarnings: statsData?.totalEarnings || 0,
    pendingEarnings: statsData?.pendingEarnings || 0,
  }

  const handleRegister = (userType: UserType) => {
    router.push(`/auth/register?type=${userType}`)
  }

  const handleRegistrationClick = () => {
    router.push("/auth/register?type=recruiter")
  }

  const handleContractSigned = () => {
    setLocalContractSigned(true)
    mutateContract({ contract_signed: true }, { revalidate: true })
  }

  const isBlocked = !isContractSigned

  return (
    <DashboardLayout requireVerification={false}>
      <div className="min-h-screen flex flex-col bg-background">
        {/* Header */}
        <header className="border-b border-border bg-card">
          <div className="container mx-auto px-4 py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-xl font-bold">Dashboard recruitera</h1>
              <p className="text-sm text-muted-foreground">Správa náboru a sledovanie provízií</p>
            </div>
            <div className="flex items-center gap-2">
              <SupportTicketModal userType="recruiter" />
              <Link href="/">
                <Button variant="outline" size="sm">
                  ← Späť na hlavnú
                </Button>
              </Link>
            </div>
          </div>
        </header>

        <ReadOnlyBanner onRegisterClick={handleRegistrationClick} message={t("recruiterDashboard.banner")} />

        {/* Main Content */}
        <main className="flex-1 container mx-auto px-4 py-6 sm:py-8 space-y-6">
          {/* OKIENKO 0: Zmluva Banner - na vrchu, blokuje ak nepodpísaná */}
          <RecruiterContractBanner
            isContractSigned={isContractSigned}
            recruiterName={userData?.user?.name}
            onContractSigned={handleContractSigned}
          />

          {/* Conditional message when contract not signed */}
          {isBlocked && (
            <Card className="border-amber-200 bg-amber-50/50">
              <CardContent className="p-4 text-center text-amber-800">
                <p className="font-medium">Podpíšte zmluvu pre sprístupnenie funkcií dashboardu</p>
              </CardContent>
            </Card>
          )}

          {/* OKIENKO 1: Štatistiky */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className={isBlocked ? "opacity-50 pointer-events-none" : ""}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-sm text-muted-foreground">Celkovo naverbovaných</p>
                    <p className="text-2xl font-bold">{statsLoading ? "..." : stats.totalRecruits}</p>
                    <p className="text-xs text-muted-foreground">Kandidátov</p>
                  </div>
                  <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center">
                    <Users className="w-6 h-6 text-blue-500" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className={isBlocked ? "opacity-50 pointer-events-none" : ""}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-sm text-muted-foreground">Aktívni kandidáti</p>
                    <p className="text-2xl font-bold">{statsLoading ? "..." : stats.activeRecruits}</p>
                    <p className="text-xs text-muted-foreground">V procese</p>
                  </div>
                  <div className="w-12 h-12 rounded-full bg-green-500/10 flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-green-500" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className={isBlocked ? "opacity-50 pointer-events-none" : ""}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-sm text-muted-foreground">Celkové výnosy</p>
                    <p className="text-2xl font-bold">€{statsLoading ? "..." : stats.totalEarnings.toFixed(2)}</p>
                    <p className="text-xs text-muted-foreground">Vyplatené</p>
                  </div>
                  <div className="w-12 h-12 rounded-full bg-purple-500/10 flex items-center justify-center">
                    <Euro className="w-6 h-6 text-purple-500" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className={isBlocked ? "opacity-50 pointer-events-none" : ""}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-sm text-muted-foreground">Čakajúce výnosy</p>
                    <p className="text-2xl font-bold">€{statsLoading ? "..." : stats.pendingEarnings.toFixed(2)}</p>
                    <p className="text-xs text-muted-foreground">Na vyplatenie</p>
                  </div>
                  <div className="w-12 h-12 rounded-full bg-orange-500/10 flex items-center justify-center">
                    <Award className="w-6 h-6 text-orange-500" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* OKIENKO 2: Info rozbaliteľné (dlhá verzia) */}
          <RecruiterInfoExpandable />

          {/* OKIENKO 3: Stav pozvánok kandidátov */}
          <div className={isBlocked ? "opacity-50 pointer-events-none" : ""}>
            {recruiterId && <RecruiterInvitationsList recruiterId={recruiterId} />}
          </div>

          {/* OKIENKO 4: Posielanie pozvánok */}
          <Card className={isBlocked ? "opacity-50 pointer-events-none" : ""}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Send className="h-5 w-5 text-teal-600" />
                Poslať pozvánku
              </CardTitle>
              <CardDescription>Pozvite kandidátov na registráciu do platformy SOMVIAC</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row gap-4">
                <RecruiterInvitationModal />
                <Button variant="outline" onClick={() => router.push("/dashboard/recruiter/invitations")}>
                  Zobraziť všetky pozvánky
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* OKIENKO 5: Pozvánky pre recruiterov */}
          <div className={isBlocked ? "opacity-50 pointer-events-none" : ""}>
            {recruiterId && <RecruiterInviteRecruitersList recruiterId={recruiterId} />}
          </div>

          {/* OKIENKO 6: Cenník kalkulačka */}
          <PricingCalculator />
        </main>

        <RegistrationRequiredModal
          isOpen={showRegistrationModal}
          onClose={closeRegistrationModal}
          suggestedUserType={suggestedUserType}
          onRegister={handleRegister}
        />
      </div>
    </DashboardLayout>
  )
}
