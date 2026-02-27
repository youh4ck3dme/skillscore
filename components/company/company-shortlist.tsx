"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Users,
  ChevronDown,
  ChevronUp,
  Eye,
  FileText,
  Trash2,
  Loader2,
  Search,
  Coins,
  CheckCircle,
  Mail,
  Copy,
  Check,
} from "lucide-react"
import { CVSummaryDisplay } from "@/components/cv-summary-display"
import { HireCandidateDialog } from "@/components/company/hire-candidate-dialog"
import { ALL_TESTS } from "@/lib/tests-config"

interface SavedCandidate {
  id: string
  candidate_id: string
  candidate_uuid?: string
  candidate_email?: string
  saved_at: string
  notes?: string
  cv_summary?: any
  candidate_profile?: {
    anonymous_id: string
    experience_years: number
    id: string
    cv_summary?: any
  }
}

interface CompanyShortlistProps {
  companyId: string
  contractSigned: boolean
  coinBalance: number
  onViewContact: (candidateId: string) => void
  onAssignTest: (candidateId: string) => void
  onRefresh?: () => void
}

export function CompanyShortlist({
  companyId,
  contractSigned,
  coinBalance,
  onViewContact,
  onAssignTest,
  onRefresh,
}: CompanyShortlistProps) {
  const [savedCandidates, setSavedCandidates] = useState<SavedCandidate[]>([])
  const [loading, setLoading] = useState(false)
  const [selectedCandidate, setSelectedCandidate] = useState<SavedCandidate | null>(null)
  const [showContactModal, setShowContactModal] = useState(false)
  const [showHireModal, setShowHireModal] = useState(false)
  const [showNotesModal, setShowNotesModal] = useState(false)
  const [showTestModal, setShowTestModal] = useState(false)
  const [selectedTest, setSelectedTest] = useState<(typeof ALL_TESTS)[0] | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [assigningTest, setAssigningTest] = useState(false)
  const [editingNotes, setEditingNotes] = useState("")
  const [savingNotes, setSavingNotes] = useState(false)
  const [expandedCandidates, setExpandedCandidates] = useState<Set<string>>(new Set())
  const [revealedContacts, setRevealedContacts] = useState<Record<string, string>>({})
  const [loadingContact, setLoadingContact] = useState(false)
  const [copiedEmail, setCopiedEmail] = useState(false)
  const supabase = createClient()

  useEffect(() => {
    if (companyId) {
      loadSavedCandidates()
    }
  }, [companyId])

  const loadSavedCandidates = async () => {
    setLoading(true)
    try {
      console.log("[v0] Loading shortlist for company:", companyId)

      // Try API route first for better data with UUIDs and emails
      const response = await fetch(`/api/company/shortlist?companyId=${companyId}`)
      if (response.ok) {
        const apiData = await response.json()
        if (apiData.candidates && apiData.candidates.length > 0) {
          const formattedCandidates = apiData.candidates.map((c: any) => ({
            id: c.id,
            candidate_id: c.candidate_id,
            candidate_uuid: c.candidate_uuid,
            candidate_email: c.candidate_email,
            saved_at: c.saved_at,
            notes: c.notes,
            cv_summary: c.cv_summary,
            candidate_profile: {
              anonymous_id: c.candidate_id,
              experience_years: c.cv_summary?.work_experience?.length || 0,
              id: c.candidate_id,
              cv_summary: c.cv_summary,
            },
          }))
          console.log("[v0] Final formatted shortlist:", formattedCandidates)
          setSavedCandidates(formattedCandidates)
          setLoading(false)
          return
        }
      }

      // Fallback to direct query
      const { data, error } = await supabase
        .from("saved_candidates")
        .select("*")
        .eq("company_id", companyId)
        .order("saved_at", { ascending: false })

      if (error) throw error

      console.log("[v0] Saved candidates data:", data)

      const formattedCandidates =
        data?.map((c) => ({
          id: c.id,
          candidate_id: c.candidate_id,
          candidate_uuid: c.candidate_uuid,
          candidate_email: c.candidate_email,
          saved_at: c.saved_at,
          notes: c.notes,
          cv_summary: c.cv_summary,
          candidate_profile: {
            anonymous_id: c.candidate_id,
            experience_years: c.cv_summary?.work_experience?.length || 0,
            id: c.candidate_id,
            cv_summary: c.cv_summary,
          },
        })) || []

      console.log("[v0] Final formatted shortlist:", formattedCandidates)
      setSavedCandidates(formattedCandidates)
    } catch (error) {
      console.error("Error loading saved candidates:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleRemoveCandidate = async (candidateId: string) => {
    try {
      const { error } = await supabase
        .from("saved_candidates")
        .delete()
        .eq("company_id", companyId)
        .eq("candidate_id", candidateId)

      if (error) throw error

      setSavedCandidates((prev) => prev.filter((c) => c.candidate_id !== candidateId))
    } catch (error) {
      console.error("Error removing candidate:", error)
    }
  }

  const handleContact = (candidate: SavedCandidate) => {
    if (!contractSigned) {
      alert("Pred touto akciou musíte podpísať zmluvu v sekcii INFO.")
      return
    }

    setSelectedCandidate(candidate)
    setShowContactModal(true)
  }

  const handleHire = (candidate: SavedCandidate) => {
    if (!contractSigned) {
      alert("Pred touto akciou musíte podpísať zmluvu v sekcii INFO.")
      return
    }
    setSelectedCandidate(candidate)
    setShowHireModal(true)
  }

  const confirmContact = async () => {
    if (!selectedCandidate) return

    const candidateId = selectedCandidate.candidate_profile?.anonymous_id || selectedCandidate.candidate_id

    // Check if already revealed
    if (revealedContacts[candidateId]) {
      return
    }

    setLoadingContact(true)

    try {
      // First check if we have email directly from shortlist data
      if (selectedCandidate.candidate_email) {
        setRevealedContacts((prev) => ({
          ...prev,
          [candidateId]: selectedCandidate.candidate_email!,
        }))
        setLoadingContact(false)
        return
      }

      // Try to get email via candidate_uuid
      const candidateUuid = selectedCandidate.candidate_uuid

      if (candidateUuid) {
        const { data: profileData } = await supabase.from("profiles").select("email").eq("id", candidateUuid).single()

        if (profileData?.email) {
          setRevealedContacts((prev) => ({
            ...prev,
            [candidateId]: profileData.email,
          }))
          setLoadingContact(false)
          return
        }
      }

      // Fallback - use API route with service role
      const response = await fetch(`/api/company/candidate-lookup?anonymousId=${candidateId}`)
      if (response.ok) {
        const data = await response.json()
        if (data.email) {
          setRevealedContacts((prev) => ({
            ...prev,
            [candidateId]: data.email,
          }))
          setLoadingContact(false)
          return
        }
      }

      // If all fails, show error
      alert("Nepodarilo sa načítať kontakt kandidáta. Skúste to prosím neskôr.")
    } catch (error) {
      console.error("Error fetching contact:", error)
      alert("Nastala chyba pri načítavaní kontaktu.")
    } finally {
      setLoadingContact(false)
    }
  }

  const copyEmail = (email: string) => {
    navigator.clipboard.writeText(email)
    setCopiedEmail(true)
    setTimeout(() => setCopiedEmail(false), 2000)
  }

  const openNotesModal = (candidate: SavedCandidate) => {
    setSelectedCandidate(candidate)
    setEditingNotes(candidate.notes || "")
    setShowNotesModal(true)
  }

  const saveNotes = async () => {
    if (!selectedCandidate) return
    setSavingNotes(true)
    try {
      const { error } = await supabase
        .from("saved_candidates")
        .update({ notes: editingNotes })
        .eq("id", selectedCandidate.id)

      if (error) throw error

      setSavedCandidates((prev) => prev.map((c) => (c.id === selectedCandidate.id ? { ...c, notes: editingNotes } : c)))
      setShowNotesModal(false)
    } catch (error) {
      console.error("Error saving notes:", error)
    } finally {
      setSavingNotes(false)
    }
  }

  const openTestModal = (candidate: SavedCandidate) => {
    if (!contractSigned) {
      alert("Pred touto akciou musíte podpísať zmluvu v sekcii INFO.")
      return
    }
    setSelectedCandidate(candidate)
    setShowTestModal(true)
  }

  const confirmTestAssignment = async () => {
    if (!selectedCandidate || !selectedTest) return

    setAssigningTest(true)

    try {
      // Get candidate UUID and email
      let candidateUuid = selectedCandidate.candidate_uuid
      let candidateEmail = selectedCandidate.candidate_email

      // If we don't have UUID, try API lookup
      if (!candidateUuid) {
        const lookupResponse = await fetch(
          `/api/company/candidate-lookup?anonymousId=${selectedCandidate.candidate_profile?.anonymous_id || selectedCandidate.candidate_id}`,
        )
        if (lookupResponse.ok) {
          const lookupData = await lookupResponse.json()
          candidateUuid = lookupData.uuid
          candidateEmail = lookupData.email
        }
      }

      const requestBody = {
        candidate_id: candidateUuid,
        candidate_email: candidateEmail,
        test_id: selectedTest.id,
        test_name: selectedTest.name,
        company_id: companyId,
      }

      console.log("[v0] Test assignment request:", requestBody)

      const response = await fetch("/api/company/test-assignments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Failed to assign test")
      }

      alert(`Test "${selectedTest.name}" bol úspešne pridelený kandidátovi.`)
      setShowTestModal(false)
      setSelectedTest(null)
      onRefresh?.()
    } catch (error: any) {
      console.error("Error assigning test:", error)
      alert(`Chyba pri prideľovaní testu: ${error.message}`)
    } finally {
      setAssigningTest(false)
    }
  }

  const toggleCandidateExpanded = (candidateId: string) => {
    setExpandedCandidates((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(candidateId)) {
        newSet.delete(candidateId)
      } else {
        newSet.add(candidateId)
      }
      return newSet
    })
  }

  const transformCVData = (cvSummary: any) => {
    if (!cvSummary) return null

    return {
      work_experience: cvSummary.work_experience || [],
      desired_positions: cvSummary.desired_positions || cvSummary.basic_info?.desired_positions || [],
      languages: cvSummary.skills?.languages || cvSummary.languages || [],
      computer_skills: cvSummary.skills?.computer_skills || cvSummary.computer_skills || [],
      country: cvSummary.basic_info?.country || cvSummary.residence_country || "",
      work_locations: cvSummary.basic_info?.work_locations || cvSummary.work_locations || [],
      expected_salary: cvSummary.work_conditions?.expected_salary || cvSummary.expected_salary || "",
      drivers_license:
        cvSummary.work_conditions?.driving_license?.has_license ?? cvSummary.drivers_license?.has_license ?? false,
      license_types:
        cvSummary.work_conditions?.driving_license?.categories || cvSummary.drivers_license?.categories || [],
      employment_type: cvSummary.work_conditions?.employment_types || cvSummary.employment_type || [],
      start_date: cvSummary.work_conditions?.availability || cvSummary.start_date || "",
      eu_citizenship: cvSummary.basic_info?.eu_citizenship ?? cvSummary.eu_citizenship ?? false,
      education_level: cvSummary.education?.level || cvSummary.education_level || "",
      study_field: cvSummary.education?.field || cvSummary.study_field || "",
      academic_title: cvSummary.education?.academic_title || cvSummary.academic_title || "",
    }
  }

  const filteredCandidates = savedCandidates.filter((candidate) => {
    if (!searchTerm) return true
    const id = candidate.candidate_profile?.anonymous_id || candidate.candidate_id
    return id.toLowerCase().includes(searchTerm.toLowerCase())
  })

  // Get recommended tests based on candidate CV
  const getRecommendedTests = (candidate: SavedCandidate) => {
    const cvSummary = candidate.cv_summary || candidate.candidate_profile?.cv_summary
    if (!cvSummary) return []

    const languages = cvSummary.skills?.languages || cvSummary.languages || []
    const recommendedTests: typeof ALL_TESTS = []

    languages.forEach((lang: any) => {
      const langName = lang.language?.toLowerCase()
      const level = lang.level?.match(/[ABC][12]/)?.[0]

      if (langName && level) {
        const matchingTest = ALL_TESTS.find(
          (t) => t.id.toLowerCase().includes(langName.substring(0, 2)) && t.id.includes(level),
        )
        if (matchingTest) {
          recommendedTests.push(matchingTest)
        }
      }
    })

    return recommendedTests
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Hľadať podľa ID..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Candidates List */}
      {filteredCandidates.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          {searchTerm ? "Žiadni kandidáti nevyhovujú vyhľadávaniu" : "Zatiaľ nemáte uložených kandidátov"}
        </div>
      ) : (
        <div className="space-y-3">
          {filteredCandidates.map((candidate) => {
            const isExpanded = expandedCandidates.has(candidate.id)
            const cvData = transformCVData(candidate.cv_summary || candidate.candidate_profile?.cv_summary)

            return (
              <Card key={candidate.id} className="overflow-hidden">
                <div className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-sm font-medium">
                        {(candidate.candidate_profile?.anonymous_id || candidate.candidate_id).slice(0, 4)}
                      </div>
                      <div>
                        <p className="font-medium">
                          ID: {candidate.candidate_profile?.anonymous_id || candidate.candidate_id}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {candidate.candidate_profile?.experience_years || 0} rokov skúseností
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button size="sm" variant="outline" onClick={() => toggleCandidateExpanded(candidate.id)}>
                        {isExpanded ? <ChevronUp className="h-4 w-4 mr-1" /> : <ChevronDown className="h-4 w-4 mr-1" />}
                        CV
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => openNotesModal(candidate)}>
                        <FileText className="h-4 w-4 mr-2" />
                        Poznámka
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => openTestModal(candidate)}>
                        <FileText className="h-4 w-4 mr-2" />
                        Test
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => handleContact(candidate)}>
                        <Eye className="h-4 w-4 mr-2" />
                        Kontakt
                      </Button>
                      <Button
                        size="sm"
                        className="bg-teal-600 hover:bg-teal-700 text-white"
                        onClick={() => handleHire(candidate)}
                      >
                        <Users className="h-4 w-4 mr-2" />
                        Hire
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-red-500 hover:text-red-700 hover:bg-red-50"
                        onClick={() => handleRemoveCandidate(candidate.candidate_id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Notes display */}
                  {candidate.notes && (
                    <div className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
                      <FileText className="h-4 w-4" />
                      {candidate.notes}
                    </div>
                  )}

                  {/* Expanded CV */}
                  {isExpanded && cvData && (
                    <div className="mt-4 pt-4 border-t">
                      <CVSummaryDisplay
                        cvData={cvData}
                        anonymousId={candidate.candidate_profile?.anonymous_id || candidate.candidate_id}
                        isCompanyView={true}
                      />
                    </div>
                  )}
                </div>
              </Card>
            )
          })}
        </div>
      )}

      {/* Hire Modal */}
      {selectedCandidate && (
        <HireCandidateDialog
          candidate={{
            id: selectedCandidate.candidate_uuid || selectedCandidate.candidate_profile?.id,
            anonymous_id: selectedCandidate.candidate_profile?.anonymous_id || selectedCandidate.candidate_id,
            work_experience_years: selectedCandidate.candidate_profile?.experience_years,
          }}
          open={showHireModal}
          onOpenChange={(open) => {
            setShowHireModal(open)
            if (!open) setSelectedCandidate(null)
          }}
          onHireComplete={() => {
            setShowHireModal(false)
            setSelectedCandidate(null)
            onRefresh?.()
          }}
        />
      )}

      {/* Notes Modal */}
      {selectedCandidate && (
        <Dialog open={showNotesModal} onOpenChange={setShowNotesModal}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Poznámka ku kandidátovi</DialogTitle>
              <DialogDescription>
                ID: {selectedCandidate.candidate_profile?.anonymous_id || selectedCandidate.candidate_id}
              </DialogDescription>
            </DialogHeader>
            <Textarea
              placeholder="Vaša poznámka..."
              value={editingNotes}
              onChange={(e) => setEditingNotes(e.target.value)}
              rows={4}
            />
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowNotesModal(false)}>
                Zrušiť
              </Button>
              <Button onClick={saveNotes} disabled={savingNotes}>
                {savingNotes ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                Uložiť
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Contact Modal */}
      {selectedCandidate && (
        <Dialog open={showContactModal} onOpenChange={setShowContactModal}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Eye className="h-5 w-5 text-primary" />
                Zobraziť kontakt kandidáta
              </DialogTitle>
              <DialogDescription>
                ID kandidáta: {selectedCandidate?.candidate_profile?.anonymous_id || selectedCandidate?.candidate_id}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              {/* Show revealed contact */}
              {revealedContacts[
                selectedCandidate?.candidate_profile?.anonymous_id || selectedCandidate?.candidate_id
              ] ? (
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Mail className="h-5 w-5 text-green-600 flex-shrink-0" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-green-800">Email kandidáta:</p>
                      <a
                        href={`mailto:${revealedContacts[selectedCandidate?.candidate_profile?.anonymous_id || selectedCandidate?.candidate_id]}`}
                        className="text-green-700 hover:underline font-medium"
                      >
                        {
                          revealedContacts[
                            selectedCandidate?.candidate_profile?.anonymous_id || selectedCandidate?.candidate_id
                          ]
                        }
                      </a>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() =>
                        copyEmail(
                          revealedContacts[
                            selectedCandidate?.candidate_profile?.anonymous_id || selectedCandidate?.candidate_id
                          ],
                        )
                      }
                    >
                      {copiedEmail ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
              ) : (
                <>
                  {/* Info o bonite */}
                  <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
                    <div className="flex items-start gap-3">
                      <Coins className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
                      <div className="space-y-1">
                        <p className="font-medium text-amber-800">Požiadavka na bonitu</p>
                        <p className="text-sm text-amber-700">
                          Pre zobrazenie kontaktu potrebujete mať na účte minimálne <strong>50 coinov</strong> ako
                          bonitu. Žiadne coiny sa pri zobrazení kontaktu nestrhávajú.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Info o zmluve */}
                  <div className="p-4 bg-muted/50 border rounded-lg">
                    <div className="flex items-start gap-3">
                      <FileText className="h-5 w-5 text-muted-foreground mt-0.5 flex-shrink-0" />
                      <div className="space-y-2">
                        <p className="font-medium">Zmluvné podmienky</p>
                        <p className="text-sm text-muted-foreground">
                          Ak sa rozhodnete kandidáta zamestnať, platia podmienky uvedené v podpísanej{" "}
                          <strong>Rámcovej zmluve o spolupráci</strong>. Odmena za úspešné sprostredkovanie sa vypočíta
                          podľa <strong>európskeho mzdového indexu</strong> pre danú pozíciu a krajinu.
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Odmena je splatná len v prípade úspešného zamestnania kandidáta.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Zostatok coinov */}
                  <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                    <span className="text-sm">Váš aktuálny zostatok:</span>
                    <div className="flex items-center gap-1.5">
                      <Coins className="h-4 w-4 text-yellow-600" />
                      <span className={`font-semibold ${coinBalance >= 50 ? "text-green-600" : "text-red-600"}`}>
                        {coinBalance} coinov
                      </span>
                      {coinBalance >= 50 ? (
                        <CheckCircle className="h-4 w-4 text-green-600 ml-1" />
                      ) : (
                        <span className="text-xs text-red-500 ml-1">(min. 50)</span>
                      )}
                    </div>
                  </div>

                  {coinBalance < 50 && (
                    <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                      <p className="text-sm text-red-700">
                        Nemáte dostatočnú bonitu. Prosím, dobite si účet minimálne na 50 coinov.
                      </p>
                    </div>
                  )}
                </>
              )}
            </div>

            <DialogFooter className="gap-2 sm:gap-0">
              <Button variant="outline" onClick={() => setShowContactModal(false)}>
                Zavrieť
              </Button>
              {!revealedContacts[
                selectedCandidate?.candidate_profile?.anonymous_id || selectedCandidate?.candidate_id
              ] && (
                <Button onClick={confirmContact} disabled={coinBalance < 50 || loadingContact} className="gap-2">
                  {loadingContact ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle className="h-4 w-4" />}
                  Súhlasím, zobraziť kontakt
                </Button>
              )}
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Test Assignment Modal */}
      {selectedCandidate && (
        <Dialog open={showTestModal} onOpenChange={setShowTestModal}>
          <DialogContent className="max-w-lg max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Prideliť test kandidátovi</DialogTitle>
              <DialogDescription>
                Kandidát: {selectedCandidate.candidate_profile?.anonymous_id || selectedCandidate.candidate_id} | Váš
                zostatok: {coinBalance} coinov
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Hľadať test..." className="pl-10" />
              </div>

              {/* Recommended Tests */}
              {getRecommendedTests(selectedCandidate).length > 0 && (
                <div>
                  <p className="text-sm font-medium mb-2">ODPORÚČANÉ TESTY</p>
                  <div className="space-y-2">
                    {getRecommendedTests(selectedCandidate).map((test) => (
                      <div
                        key={test.id}
                        className={`p-3 border rounded-lg cursor-pointer transition-colors ${selectedTest?.id === test.id ? "border-primary bg-primary/5" : "hover:bg-muted/50"}`}
                        onClick={() => setSelectedTest(test)}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">{test.name}</p>
                            <p className="text-sm text-muted-foreground">{test.description}</p>
                          </div>
                          <Badge variant="secondary">{test.coinCost} coinov</Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* All Tests */}
              <div>
                <p className="text-sm font-medium mb-2">ZÁKLADNÉ TESTY ({ALL_TESTS.length})</p>
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {ALL_TESTS.map((test) => (
                    <div
                      key={test.id}
                      className={`p-3 border rounded-lg cursor-pointer transition-colors ${selectedTest?.id === test.id ? "border-primary bg-primary/5" : "hover:bg-muted/50"}`}
                      onClick={() => setSelectedTest(test)}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">{test.name}</p>
                          <p className="text-sm text-muted-foreground">{test.description}</p>
                        </div>
                        <Badge variant="secondary">{test.coinCost} coinov</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setShowTestModal(false)}>
                Zrušiť
              </Button>
              <Button onClick={confirmTestAssignment} disabled={!selectedTest || assigningTest}>
                {assigningTest ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                Prideliť test
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
