"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import Link from "next/link"
import { useState, useEffect, useRef } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { useAuth } from "@/lib/auth/auth-context"
import { ReadOnlyBanner } from "@/components/ui/read-only-banner"
import { RegistrationRequiredModal } from "@/components/modals/registration-required-modal"
import { useAuthGuard } from "@/lib/hooks/use-auth-guard"
import { useRouter } from "next/navigation"
import { useDynamicData } from "@/lib/hooks/use-dynamic-data"
import { SupportTicketModal } from "@/components/support-ticket-modal"
import { useI18n } from "@/lib/i18n/context"
import { staticTranslations } from "@/lib/i18n/translations"
import {
  Coins,
  ChevronDown,
  Search,
  ClipboardList,
  Users,
  Info,
  ShoppingCart,
  BarChart3,
  Settings,
  FileText,
} from "lucide-react"

import { CompanyInfoSection, type CompanyInfoSectionHandle } from "@/components/company/company-info-section"
import { CompanyTestAssignment } from "@/components/company/company-test-assignment"
import { CompanyShortlist } from "@/components/company/company-shortlist"
import { CompanyInfoSections } from "@/components/company/company-info-sections"
import { CompanyPricingSection } from "@/components/company/company-pricing-section"
import { CompanyStatistics } from "@/components/company/company-statistics"
import { CompanyMyTests } from "@/components/company/company-my-tests"
import { CompanySettings } from "@/components/company/company-settings"
import { CompanyContractBanner } from "@/components/company/company-contract-banner"
import useSWR from "swr"
import { languagesList, languageLevels, computerSkillsData, skillLevels, countries } from "@/lib/data/form-options"
import { professionsWithWorkTypes, yearsOfExperienceOptions } from "@/lib/data/work-experience-data"
import { CandidateSearchTable } from "@/components/company/candidate-search-table"

type UserType = "company" | "candidate" | "admin"
type Filters = {
  language: string
  languageLevel: string
  itSkill: string
  itLevel: string
  profession: string
  experienceYears: string
  location: string
}

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export default function CompanyDashboard() {
  const i18nContext = useI18n()
  const language = i18nContext?.language || "sk"
  const currentLang = language as "sk" | "en" | "de"

  const translations = staticTranslations[currentLang] || staticTranslations.sk
  const t = translations.companyDashboard

  const [openSections, setOpenSections] = useState({
    search: true,
    testAssignment: false,
    shortlist: false,
    info: false,
    pricing: false,
    statistics: false,
    myTests: false,
    settings: false,
  })

  const toggleSection = (section: string) => {
    setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }))
  }

  const [showFilters, setShowFilters] = useState(false)
  const [filters, setFilters] = useState<Filters>({
    language: "",
    languageLevel: "",
    itSkill: "",
    itLevel: "",
    profession: "",
    experienceYears: "",
    location: "",
  })
  const [candidates, setCandidates] = useState([])
  const [isSearching, setIsSearching] = useState(false)
  const [searchPerformed, setSearchPerformed] = useState(false)

  const { user } = useAuth()
  const { professionsData, certificationsData } = useDynamicData()

  const { showRegistrationModal, suggestedUserType, closeRegistrationModal } = useAuthGuard()
  const router = useRouter()

  const [companyUser, setCompanyUser] = useState<any>(null)
  const [isLoadingUser, setIsLoadingUser] = useState(true)
  const [isFetchingUser, setIsFetchingUser] = useState(false)
  const [headerCoinBalance, setHeaderCoinBalance] = useState<number>(0)
  const [coinDialogOpen, setCoinDialogOpen] = useState(false)

  const [shortlistKey, setShortlistKey] = useState(0)

  const { data: contractData, mutate: mutateContract } = useSWR(user ? "/api/company/contract" : null, fetcher, {
    revalidateOnFocus: false,
  })

  const companyInfoRef = useRef<CompanyInfoSectionHandle>(null)

  const handleRegister = (userType: UserType) => {
    router.push(`/auth/register?type=${userType}`)
  }

  const handleRegistrationClick = () => {
    router.push("/auth/register?type=company")
  }

  const handleOpenCompanyInfo = () => {
    companyInfoRef.current?.openEdit()
    setTimeout(() => {
      const infoSection = document.querySelector("[data-company-info-section]")
      if (infoSection) {
        infoSection.scrollIntoView({ behavior: "smooth", block: "start" })
      }
    }, 100)
  }

  const handleCoinsClick = () => {
    setOpenSections((prev) => ({ ...prev, pricing: true }))
    setTimeout(() => {
      const shopSection = document.getElementById("cennik-shop-section")
      if (shopSection) {
        shopSection.scrollIntoView({ behavior: "smooth" })
      }
    }, 100)
  }

  const fetchCoinBalance = async () => {
    if (!user?.id) return
    try {
      const response = await fetch(`/api/company/coins?companyId=${user.id}`)
      if (response.ok) {
        const data = await response.json()
        setHeaderCoinBalance(data.balance || 0)
      }
    } catch (error) {
      console.error("Error fetching coin balance:", error)
    }
  }

  useEffect(() => {
    const fetchUserData = async () => {
      if (!user) {
        setIsLoadingUser(false)
        return
      }

      if (isFetchingUser) return

      setIsFetchingUser(true)
      try {
        const response = await fetch("/api/auth/me")
        if (response.ok) {
          const data = await response.json()
          setCompanyUser(data)
        }
      } catch (error) {
      } finally {
        setIsLoadingUser(false)
        setIsFetchingUser(false)
      }
    }

    fetchUserData()
  }, [user])

  useEffect(() => {
    if (user?.id) {
      fetchCoinBalance()
    }
  }, [user?.id])

  const searchCandidates = async () => {
    setIsSearching(true)
    setSearchPerformed(true)

    try {
      const params = new URLSearchParams()

      if (filters.language) params.append("language", filters.language)
      if (filters.languageLevel) params.append("languageLevel", filters.languageLevel)
      if (filters.itSkill) params.append("itSkill", filters.itSkill)
      if (filters.itLevel) params.append("itLevel", filters.itLevel)
      if (filters.profession) params.append("profession", filters.profession)
      if (filters.experienceYears) params.append("experienceYears", filters.experienceYears)
      if (filters.location) params.append("location", filters.location)

      console.log("[v0] Searching with params:", params.toString())

      const response = await fetch(`/api/search/candidates?${params.toString()}`)
      const data = await response.json()

      console.log("[v0] Search results:", data)

      if (data.error) {
        console.error("[v0] Search error:", data.error)
        setCandidates([])
      } else {
        setCandidates(data.candidates || [])
      }
    } catch (error) {
      console.error("[v0] Search failed:", error)
      setCandidates([])
    } finally {
      setIsSearching(false)
    }
  }

  const clearFilters = () => {
    setFilters({
      language: "",
      languageLevel: "",
      itSkill: "",
      itLevel: "",
      profession: "",
      experienceYears: "",
      location: "",
    })
  }

  const handleContractSigned = () => {
    mutateContract()
  }

  const companyDataForContract = companyUser?.user
    ? {
        company_name: companyUser.user.company_name,
        contact_person: companyUser.user.contact_person,
        email: companyUser.user.email,
        phone: companyUser.user.phone,
        address: companyUser.user.address,
        ico: companyUser.user.ico,
        dic: companyUser.user.dic,
      }
    : undefined

  const isContractSigned = contractData?.is_signed || false

  return (
    <DashboardLayout userType="company" coinBalance={headerCoinBalance}>
      <div className="min-h-screen flex flex-col bg-background">
        <header className="border-b border-border bg-card">
          <div className="container mx-auto px-4 py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <nav className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4">
              <button
                onClick={() => setCoinDialogOpen(true)}
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors cursor-pointer bg-muted/50 px-3 py-1.5 rounded-full"
              >
                <Coins className="h-4 w-4 text-amber-500" />
                <span className="font-medium">{headerCoinBalance.toLocaleString()} coinov</span>
              </button>
              <Link href="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                ← Späť na hlavnú stránku
              </Link>
            </nav>
            <SupportTicketModal userType="company" />
          </div>
        </header>

        <ReadOnlyBanner
          onRegisterClick={handleRegistrationClick}
          message="Prehliadaš firemný dashboard ako neregistrovaný používateľ - registruj sa pre vyhľadávanie kandidátov a nákup coinov"
        />

        {/* Main Content */}
        <main className="flex-1 container mx-auto px-4 py-6 sm:py-8 space-y-6">
          <CompanyContractBanner
            isContractSigned={isContractSigned}
            companyData={companyDataForContract}
            onContractSigned={handleContractSigned}
            onOpenCompanyInfo={handleOpenCompanyInfo}
          />

          <Card>
            <CardHeader className="pb-4">
              <div className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-teal-600" />
                <CardTitle>Štatistiky</CardTitle>
              </div>
              <CardDescription>Prehľad vašej aktivity na platforme</CardDescription>
            </CardHeader>
            <CardContent>
              <CompanyStatistics companyId={user?.id || ""} />
            </CardContent>
          </Card>

          <div data-company-info-section>
            <CompanyInfoSection
              ref={companyInfoRef}
              companyUser={companyUser}
              coinBalance={headerCoinBalance}
              onCoinsClick={() => setCoinDialogOpen(true)}
              isLoading={isLoadingUser}
            />
          </div>

          <Collapsible open={openSections.search} onOpenChange={() => toggleSection("search")}>
            <Card>
              <CollapsibleTrigger asChild>
                <CardHeader className="cursor-pointer hover:bg-accent/50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Search className="h-5 w-5 text-teal-600" />
                      <div>
                        <CardTitle>{t?.searchCandidates?.title || "Vyhľadávanie kandidátov"}</CardTitle>
                        <CardDescription>
                          {t?.searchCandidates?.subtitle || "Použite filtre na nájdenie vhodných kandidátov"}
                        </CardDescription>
                      </div>
                    </div>
                    <ChevronDown
                      className={`h-5 w-5 transition-transform ${openSections.search ? "rotate-180" : ""}`}
                    />
                  </div>
                </CardHeader>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Button
                        variant="outline"
                        onClick={() => setShowFilters(!showFilters)}
                        className="flex items-center gap-2"
                      >
                        Zobraziť filtre
                        <ChevronDown className={`h-4 w-4 transition-transform ${showFilters ? "rotate-180" : ""}`} />
                      </Button>
                      {(filters.language ||
                        filters.languageLevel ||
                        filters.itSkill ||
                        filters.itLevel ||
                        filters.profession ||
                        filters.experienceYears ||
                        filters.location) && (
                        <Button variant="ghost" size="sm" onClick={clearFilters}>
                          Vymazať filtre
                        </Button>
                      )}
                    </div>

                    {showFilters && (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-4 bg-muted/30 rounded-lg">
                        <div className="space-y-2">
                          <Label>Jazyk</Label>
                          <Select
                            value={filters.language}
                            onValueChange={(value) => setFilters((prev) => ({ ...prev, language: value }))}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Vyberte jazyk" />
                            </SelectTrigger>
                            <SelectContent className="max-h-[300px]">
                              {languagesList.map((lang) => (
                                <SelectItem key={lang} value={lang}>
                                  {lang}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <Label>Úroveň jazyka</Label>
                          <Select
                            value={filters.languageLevel}
                            onValueChange={(value) => setFilters((prev) => ({ ...prev, languageLevel: value }))}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Vyberte úroveň" />
                            </SelectTrigger>
                            <SelectContent>
                              {languageLevels.map((level) => (
                                <SelectItem key={level} value={level}>
                                  {level}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <Label>IT zručnosť</Label>
                          <Select
                            value={filters.itSkill}
                            onValueChange={(value) => setFilters((prev) => ({ ...prev, itSkill: value }))}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Vyberte zručnosť" />
                            </SelectTrigger>
                            <SelectContent className="max-h-[300px]">
                              <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground">
                                Používateľské
                              </div>
                              {computerSkillsData.user.map((skill) => (
                                <SelectItem key={skill} value={skill}>
                                  {skill}
                                </SelectItem>
                              ))}
                              <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground mt-2">
                                Programátorské
                              </div>
                              {computerSkillsData.tools.map((skill) => (
                                <SelectItem key={skill} value={skill}>
                                  {skill}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <Label>Úroveň IT</Label>
                          <Select
                            value={filters.itLevel}
                            onValueChange={(value) => setFilters((prev) => ({ ...prev, itLevel: value }))}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Vyberte úroveň" />
                            </SelectTrigger>
                            <SelectContent>
                              {skillLevels.map((level) => (
                                <SelectItem key={level} value={level}>
                                  {level}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <Label>Povolanie</Label>
                          <Select
                            value={filters.profession}
                            onValueChange={(value) => setFilters((prev) => ({ ...prev, profession: value }))}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Vyberte povolanie" />
                            </SelectTrigger>
                            <SelectContent className="max-h-[300px]">
                              {Object.keys(professionsWithWorkTypes).map((profession) => (
                                <SelectItem key={profession} value={profession}>
                                  {profession}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <Label>Roky praxe</Label>
                          <Select
                            value={filters.experienceYears}
                            onValueChange={(value) => setFilters((prev) => ({ ...prev, experienceYears: value }))}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Vyberte roky" />
                            </SelectTrigger>
                            <SelectContent className="max-h-[300px]">
                              {yearsOfExperienceOptions.map((year) => (
                                <SelectItem key={year} value={year}>
                                  {year}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <Label>Lokalita</Label>
                          <Select
                            value={filters.location}
                            onValueChange={(value) => setFilters((prev) => ({ ...prev, location: value }))}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Vyberte lokalitu" />
                            </SelectTrigger>
                            <SelectContent className="max-h-[300px]">
                              {countries.map((country) => (
                                <SelectItem key={country} value={country}>
                                  {country}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    )}

                    <div className="flex justify-center">
                      <Button onClick={searchCandidates} disabled={isSearching} size="lg" className="min-w-[200px]">
                        {isSearching ? "Vyhľadávam..." : "Vyhľadať kandidátov"}
                      </Button>
                    </div>

                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">Výsledky vyhľadávania</h3>
                      {isSearching ? (
                        <div className="flex justify-center py-12">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
                        </div>
                      ) : searchPerformed && candidates.length === 0 ? (
                        <div className="text-center py-12 text-muted-foreground">Žiadni kandidáti nenájdení</div>
                      ) : candidates.length > 0 ? (
                        <CandidateSearchTable candidates={candidates} onRefresh={searchCandidates} />
                      ) : (
                        <div className="text-center py-12 text-muted-foreground">
                          Použite filtre a kliknite na "Vyhľadať kandidátov"
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </CollapsibleContent>
            </Card>
          </Collapsible>

          <Collapsible open={openSections.testAssignment} onOpenChange={() => toggleSection("testAssignment")}>
            <Card>
              <CollapsibleTrigger asChild>
                <CardHeader className="cursor-pointer hover:bg-accent/50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <ClipboardList className="h-5 w-5 text-teal-600" />
                      <div>
                        <CardTitle>Chcem testovať</CardTitle>
                        <CardDescription>Prideľte testy kandidátom alebo zamestnancom</CardDescription>
                      </div>
                    </div>
                    <ChevronDown
                      className={`h-5 w-5 transition-transform ${openSections.testAssignment ? "rotate-180" : ""}`}
                    />
                  </div>
                </CardHeader>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <CardContent>
                  <CompanyTestAssignment companyId={user?.id || ""} />
                </CardContent>
              </CollapsibleContent>
            </Card>
          </Collapsible>

          <Collapsible open={openSections.shortlist} onOpenChange={() => toggleSection("shortlist")}>
            <Card>
              <CollapsibleTrigger asChild>
                <CardHeader className="cursor-pointer hover:bg-accent/50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Users className="h-5 w-5 text-teal-600" />
                      <div>
                        <CardTitle>Shortlist</CardTitle>
                        <CardDescription>Vaši uložení kandidáti</CardDescription>
                      </div>
                    </div>
                    <ChevronDown
                      className={`h-5 w-5 transition-transform ${openSections.shortlist ? "rotate-180" : ""}`}
                    />
                  </div>
                </CardHeader>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <CardContent>
                  <CompanyShortlist
                    key={shortlistKey}
                    companyId={user?.id || ""}
                    contractSigned={true}
                    coinBalance={headerCoinBalance}
                    onViewContact={(id) => console.log("View contact:", id)}
                    onAssignTest={(id) => console.log("Assign test:", id)}
                    onRefresh={() => {
                      fetch(`/api/company/coins?companyId=${user?.id}`)
                        .then((res) => res.json())
                        .then((data) => setHeaderCoinBalance(data.balance || 0))
                        .catch(console.error)
                      setShortlistKey((prev) => prev + 1)
                    }}
                  />
                </CardContent>
              </CollapsibleContent>
            </Card>
          </Collapsible>

          <Collapsible open={openSections.info} onOpenChange={() => toggleSection("info")}>
            <Card>
              <CollapsibleTrigger asChild>
                <CardHeader className="cursor-pointer hover:bg-accent/50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Info className="h-5 w-5 text-teal-600" />
                      <div>
                        <CardTitle>Info</CardTitle>
                        <CardDescription>Zmluva, testy a informácie o aplikácii</CardDescription>
                      </div>
                    </div>
                    <ChevronDown className={`h-5 w-5 transition-transform ${openSections.info ? "rotate-180" : ""}`} />
                  </div>
                </CardHeader>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <CardContent>
                  <CompanyInfoSections contractSigned={isContractSigned} contractData={contractData?.contract_data} />
                </CardContent>
              </CollapsibleContent>
            </Card>
          </Collapsible>

          <Collapsible open={openSections.pricing} onOpenChange={() => toggleSection("pricing")}>
            <Card id="cennik-shop-section">
              <CollapsibleTrigger asChild>
                <CardHeader className="cursor-pointer hover:bg-accent/50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <ShoppingCart className="h-5 w-5 text-teal-600" />
                      <div>
                        <CardTitle>Cenník</CardTitle>
                        <CardDescription>Prehľad cien a balíkov</CardDescription>
                      </div>
                    </div>
                    <ChevronDown
                      className={`h-5 w-5 transition-transform ${openSections.pricing ? "rotate-180" : ""}`}
                    />
                  </div>
                </CardHeader>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <CardContent>
                  <CompanyPricingSection coinBalance={headerCoinBalance} onBuyCoins={handleCoinsClick} />
                </CardContent>
              </CollapsibleContent>
            </Card>
          </Collapsible>

          <Collapsible open={openSections.myTests} onOpenChange={() => toggleSection("myTests")}>
            <Card>
              <CollapsibleTrigger asChild>
                <CardHeader className="cursor-pointer hover:bg-accent/50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <FileText className="h-5 w-5 text-teal-600" />
                      <div>
                        <CardTitle>Moje testy</CardTitle>
                        <CardDescription>Pridelené a dokončené testy</CardDescription>
                      </div>
                    </div>
                    <ChevronDown
                      className={`h-5 w-5 transition-transform ${openSections.myTests ? "rotate-180" : ""}`}
                    />
                  </div>
                </CardHeader>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <CardContent>
                  <CompanyMyTests companyId={user?.id || ""} />
                </CardContent>
              </CollapsibleContent>
            </Card>
          </Collapsible>

          <Collapsible open={openSections.settings} onOpenChange={() => toggleSection("settings")}>
            <Card>
              <CollapsibleTrigger asChild>
                <CardHeader className="cursor-pointer hover:bg-accent/50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Settings className="h-5 w-5 text-teal-600" />
                      <div>
                        <CardTitle>Nastavenia</CardTitle>
                        <CardDescription>Nastavenia účtu a preferencie</CardDescription>
                      </div>
                    </div>
                    <ChevronDown
                      className={`h-5 w-5 transition-transform ${openSections.settings ? "rotate-180" : ""}`}
                    />
                  </div>
                </CardHeader>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <CardContent>
                  <CompanySettings />
                </CardContent>
              </CollapsibleContent>
            </Card>
          </Collapsible>
        </main>

        {/* Registration Modal */}
        <RegistrationRequiredModal
          isOpen={showRegistrationModal}
          onClose={closeRegistrationModal}
          suggestedUserType={suggestedUserType as UserType | null}
          onRegister={handleRegister}
        />
      </div>
    </DashboardLayout>
  )
}
