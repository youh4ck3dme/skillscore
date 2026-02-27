"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Heart, Send, UserCheck, Loader2, Lock } from "lucide-react"
import { toast } from "sonner"
import { CandidateProfileSummaryReadOnly } from "./candidate-profile-summary-read-only"
import { CVSummaryDisplay } from "@/components/cv-summary-display"
import { HireCandidateDialog } from "./hire-candidate-dialog"

interface CandidateProfileModalProps {
  candidate: any
  open: boolean
  onOpenChange: (open: boolean) => void
  onRefresh?: () => void
}

export function CandidateProfileModal({ candidate, open, onOpenChange, onRefresh }: CandidateProfileModalProps) {
  const [cvData, setCvData] = useState<any>(null)
  const [profileSummary, setProfileSummary] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [isSaved, setIsSaved] = useState(false)
  const [processingPayment, setProcessingPayment] = useState(false)
  const [swotUnlocked, setSwotUnlocked] = useState(false)
  const [hireDialogOpen, setHireDialogOpen] = useState(false)
  const supabase = createClient()

  useEffect(() => {
    if (open && candidate) {
      loadCandidateCV()
      checkSwotUnlockStatus()
      checkIfSaved()
    }
  }, [open, candidate])

  const checkSwotUnlockStatus = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) return

      const { data } = await supabase
        .from("unlocked_profiles")
        .select("id")
        .eq("company_id", user.id)
        .eq("candidate_id", candidate.id)
        .maybeSingle()

      if (data) {
        setSwotUnlocked(true)
        loadSwotAnalysis()
      }
    } catch (error) {
      console.error("[v0] Error checking SWOT unlock status:", error)
    }
  }

  const loadCandidateCV = async () => {
    try {
      setLoading(true)

      console.log("[v0] Loading CV for candidate:", {
        candidateId: candidate.id,
        anonymous_id: candidate.anonymous_id,
        has_cv_summary: !!candidate.cv_summary,
      })

      let cvDataObject: any

      const cvSummary = candidate.cv_summary
        ? typeof candidate.cv_summary === "string"
          ? JSON.parse(candidate.cv_summary)
          : candidate.cv_summary
        : null

      cvDataObject = cvSummary
        ? {
            anonymous_id: cvSummary.anonymous_id || candidate.anonymous_id || null,
            work_experience: candidate.work_experience || cvSummary.work_experience || [],
            desired_positions: cvSummary.desired_positions || [],
            languages: candidate.languages || cvSummary.skills?.languages || [],
            computer_skills: candidate.computer_skills || cvSummary.skills?.computer_skills || [],
            country: cvSummary.basic_info?.country || null,
            work_locations: cvSummary.basic_info?.work_locations || [],
            expected_salary: cvSummary.expected_salary || null,
            drivers_license: cvSummary.work_conditions?.driving_license || false,
            license_types: cvSummary.work_conditions?.license_types || [],
            employment_type: cvSummary.work_conditions?.employment_types
              ? Array.isArray(cvSummary.work_conditions.employment_types)
                ? cvSummary.work_conditions.employment_types.join(", ")
                : cvSummary.work_conditions.employment_types
              : null,
            start_date: cvSummary.work_conditions?.start_date || null,
            eu_citizenship: cvSummary.basic_info?.eu_citizenship || false,
            education_level: cvSummary.education?.level || null,
            study_field: cvSummary.education?.fieldOfStudy || null,
            academic_title: cvSummary.education?.academic_title || null,
            recruiter_id: null, // Hide recruiter_id from company view
          }
        : {
            anonymous_id: candidate.anonymous_id || null,
            work_experience: candidate.work_experience || [],
            languages: candidate.languages || [],
            computer_skills: candidate.computer_skills || [],
          }

      console.log("[v0] Final CV data object:", cvDataObject)

      setCvData(cvDataObject)
    } catch (error) {
      console.error("[v0] Error loading CV:", error)
      toast.error("Chyba pri načítaní CV kandidáta")

      setCvData({
        anonymous_id: candidate.anonymous_id || "N/A",
      })
    } finally {
      setLoading(false)
    }
  }

  const loadSwotAnalysis = async () => {
    try {
      const { data, error } = await supabase
        .from("candidate_profiles")
        .select("profile_summary")
        .eq("anonymous_id", candidate.anonymous_id)
        .single()

      if (error) throw error

      setProfileSummary(data.profile_summary)
    } catch (error) {
      console.error("[v0] Error loading SWOT:", error)
      toast.error("Chyba pri načítaní SWOT analýzy")
    }
  }

  const unlockSwot = async () => {
    try {
      setProcessingPayment(true)

      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) {
        toast.error("Musíte byť prihlásený")
        return
      }

      const { data: balanceData } = await supabase
        .from("user_balances")
        .select("coin_balance")
        .eq("id", user.id)
        .single()

      if (!balanceData || balanceData.coin_balance < 20) {
        toast.error("Nedostatočný počet coins (potrebných 20)")
        return
      }

      const { error: deductError } = await supabase.rpc("deduct_coins", {
        user_id: user.id,
        amount: 20,
        description: `Odomknutie SWOT analýzy kandidáta ${candidate.anonymous_id}`,
      })

      if (deductError) {
        console.error("[v0] Error deducting coins:", deductError)
        toast.error("Chyba pri strhnutí coins")
        return
      }

      await supabase.from("unlocked_profiles").insert({
        company_id: user.id,
        candidate_id: candidate.id,
        unlocked_at: new Date().toISOString(),
        coins_paid: 20,
      })

      setSwotUnlocked(true)
      toast.success("SWOT analýza odomknutá (-20 coins)")
      loadSwotAnalysis()
    } catch (error) {
      console.error("[v0] Error unlocking SWOT:", error)
      toast.error("Chyba pri odomykaní SWOT analýzy")
    } finally {
      setProcessingPayment(false)
    }
  }

  const checkIfSaved = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) return

      const { data } = await supabase
        .from("saved_candidates")
        .select("id")
        .eq("company_id", user.id)
        .eq("candidate_id", candidate.anonymous_id)
        .maybeSingle()

      setIsSaved(!!data)
    } catch (error) {
      console.error("[v0] Error checking if saved:", error)
    }
  }

  const handleShortlist = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) {
        toast.error("Musíte byť prihlásený")
        return
      }

      if (isSaved) {
        await supabase
          .from("saved_candidates")
          .delete()
          .eq("company_id", user.id)
          .eq("candidate_id", candidate.anonymous_id)

        toast.success("Kandidát odstránený zo shortlistu")
        setIsSaved(false)
      } else {
        const { error: insertError } = await supabase.from("saved_candidates").insert({
          company_id: user.id,
          candidate_id: candidate.anonymous_id,
          candidate_uuid: candidate.id, // Store real UUID for test assignments
          cv_summary: candidate.cv_summary,
          saved_at: new Date().toISOString(),
        })

        if (insertError) {
          console.error("[v0] Error saving to shortlist:", insertError)
          toast.error("Chyba pri ukladaní do shortlistu")
          return
        }

        toast.success("Kandidát pridaný do shortlistu")
        setIsSaved(true)
      }

      onRefresh?.()
    } catch (error) {
      console.error("[v0] Error toggling shortlist:", error)
      toast.error("Chyba pri práci so shortlistom")
    }
  }

  const handleContact = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) {
        toast.error("Musíte byť prihlásený")
        return
      }

      const { data: balanceData } = await supabase
        .from("user_balances")
        .select("coin_balance")
        .eq("id", user.id)
        .single()

      if (!balanceData || balanceData.coin_balance < 50) {
        toast.error("Nedostatočný počet coins (potrebných minimálne 50)")
        return
      }

      toast.info("Otváram kontaktný formulár...")
    } catch (error) {
      console.error("[v0] Error initiating contact:", error)
      toast.error("Chyba pri kontaktovaní kandidáta")
    }
  }

  const handleHire = () => {
    setHireDialogOpen(true)
  }

  const handleHireComplete = () => {
    onRefresh?.()
    onOpenChange(false)
    toast.success("Kandidát bol úspešne najatý a vyradený z databázy")
  }

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-4xl max-h-[90vh]">
          <DialogHeader>
            <DialogTitle>Profil kandidáta: {candidate.anonymous_id || "N/A"}</DialogTitle>
          </DialogHeader>

          <ScrollArea className="h-[calc(90vh-8rem)] pr-4">
            {!swotUnlocked ? (
              <div className="mb-6 p-6 border-2 border-dashed border-primary/30 rounded-lg bg-muted/30">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Lock className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <h3 className="font-semibold">SWOT Analýza kandidáta</h3>
                      <p className="text-sm text-muted-foreground">
                        Odomknite komplexnú SWOT analýzu zo všetkých testov kandidáta
                      </p>
                    </div>
                  </div>
                  <Button onClick={unlockSwot} disabled={processingPayment} className="shrink-0">
                    {processingPayment ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Odomykám...
                      </>
                    ) : (
                      <>Odomknúť (20 coins)</>
                    )}
                  </Button>
                </div>
              </div>
            ) : (
              <div className="mb-4">
                <CandidateProfileSummaryReadOnly profileSummary={profileSummary} />
              </div>
            )}

            {loading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : (
              <CVSummaryDisplay cvData={cvData} loading={false} />
            )}
          </ScrollArea>

          <div className="flex items-center gap-3 pt-4 border-t border-border">
            <Button
              onClick={handleShortlist}
              variant={isSaved ? "secondary" : "outline"}
              className="flex items-center gap-2"
            >
              <Heart className={`h-4 w-4 ${isSaved ? "fill-current" : ""}`} />
              {isSaved ? "V shortliste" : "Shortlist"}
            </Button>

            <Button onClick={handleContact} variant="outline" className="flex items-center gap-2 bg-transparent">
              <Send className="h-4 w-4" />
              Kontaktovať
            </Button>

            <Button onClick={handleHire} variant="default" className="flex items-center gap-2">
              <UserCheck className="h-4 w-4" />
              Hire
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <HireCandidateDialog
        candidate={candidate}
        open={hireDialogOpen}
        onOpenChange={setHireDialogOpen}
        onHireComplete={handleHireComplete}
      />
    </>
  )
}
