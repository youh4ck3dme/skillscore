"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { getDisplayName } from "@/lib/utils/display-name"
import { ContactRevealModal } from "./contact-reveal-modal"
import { EmploymentConfirmationModal } from "./employment-confirmation-modal"
import { Eye, Mail, UserCheck, Bookmark } from "lucide-react"
import { translateYears } from "@/lib/i18n/translations"
import { useI18n } from "@/lib/i18n/context"

interface AnonymousProfileCardProps {
  profile: any
  isOwn: boolean
  viewerType: "candidate" | "company" | "recruiter"
  onContact?: () => void
  companyCoins?: number
  onSaveToggle?: () => void
}

export function AnonymousProfileCard({
  profile,
  isOwn,
  viewerType,
  onContact,
  companyCoins = 0,
  onSaveToggle,
}: AnonymousProfileCardProps) {
  const { language } = useI18n() // Added language context for translations
  const displayName = getDisplayName(profile, isOwn)
  const [showRevealModal, setShowRevealModal] = useState(false)
  const [showEmploymentModal, setShowEmploymentModal] = useState(false)
  const [revealedEmail, setRevealedEmail] = useState<string | null>(null)
  const [revealData, setRevealData] = useState<any>(null)
  const [isEmployed, setIsEmployed] = useState(false)
  const [isSaved, setIsSaved] = useState(false)
  const [isSaving, setIsSaving] = useState(false) // Declared isSaving variable
  const viewTracked = useRef(false)
  const { t } = useI18n()

  useEffect(() => {
    if (!isOwn && (viewerType === "company" || viewerType === "recruiter") && profile.id && !viewTracked.current) {
      viewTracked.current = true
      trackProfileView()
    }
  }, [profile.id, isOwn, viewerType])

  const trackProfileView = async () => {
    try {
      await fetch("/api/profile-views", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ candidateId: profile.id }),
      })
    } catch (error) {
      // Tiché zlyhanie - nechceme rušiť UX
      console.error("[v0] Error tracking profile view:", error)
    }
  }

  useEffect(() => {
    if (!isOwn && viewerType === "company" && profile.id) {
      checkSavedStatus()
    }
  }, [profile.id, isOwn, viewerType])

  const checkSavedStatus = async () => {
    try {
      const response = await fetch(`/api/candidates/check-saved?candidateId=${profile.id}`)
      if (response.ok) {
        const data = await response.json()
        setIsSaved(data.isSaved)
      }
    } catch (error) {
      console.error("[v0] Error checking saved status:", error)
    }
  }

  const handleSaveToggle = async () => {
    setIsSaving(true)
    try {
      if (isSaved) {
        const response = await fetch(`/api/candidates/save?candidateId=${profile.id}`, {
          method: "DELETE",
        })
        if (response.ok) {
          setIsSaved(false)
          onSaveToggle?.()
        } else {
          alert("Nepodarilo sa odstrániť kandidáta z uložených")
        }
      } else {
        const response = await fetch("/api/candidates/save", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ candidateId: profile.id }),
        })
        if (response.ok) {
          setIsSaved(true)
          onSaveToggle?.()
        } else {
          const data = await response.json()
          if (data.error === "Candidate already saved") {
            setIsSaved(true)
          } else {
            alert("Nepodarilo sa uložiť kandidáta")
          }
        }
      }
    } catch (error) {
      console.error("[v0] Error toggling save:", error)
      alert("Nastala chyba pri ukladaní")
    } finally {
      setIsSaving(false)
    }
  }

  const handleRevealSuccess = (email: string, data: any) => {
    setRevealedEmail(email)
    setRevealData(data)
    setShowRevealModal(false)
  }

  const handleEmploymentSuccess = () => {
    setIsEmployed(true)
    setShowEmploymentModal(false)
  }

  return (
    <>
      <Card className="w-full">
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-lg font-semibold">{displayName}</h3>
              {!isOwn && <p className="text-sm text-muted-foreground">ID: {profile.anonymous_id}</p>}
            </div>
            {!isOwn && viewerType === "company" && profile.user_type === "candidate" && (
              <div className="flex gap-2">
                <Button
                  onClick={handleSaveToggle}
                  disabled={isSaving}
                  size="sm"
                  variant={isSaved ? "default" : "outline"}
                  className={isSaved ? "bg-primary text-primary-foreground" : ""}
                >
                  <Bookmark className={`h-4 w-4 mr-2 ${isSaved ? "fill-current" : ""}`} />
                  {isSaved ? t("saved") : t("save")}
                </Button>

                {!revealedEmail ? (
                  <Button onClick={() => setShowRevealModal(true)} size="sm" variant="outline">
                    <Eye className="h-4 w-4 mr-2" />
                    {t("revealContact")}
                  </Button>
                ) : (
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="flex items-center gap-1">
                      <Mail className="h-3 w-3" />
                      {revealedEmail}
                    </Badge>
                    {!isEmployed ? (
                      <Button
                        size="sm"
                        onClick={() => setShowEmploymentModal(true)}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        <UserCheck className="h-4 w-4 mr-2" />
                        {t("hire")}
                      </Button>
                    ) : (
                      <Badge variant="default" className="bg-green-600">
                        <UserCheck className="h-3 w-3 mr-1" />
                        {t("employed")}
                      </Badge>
                    )}
                  </div>
                )}
                {onContact && (
                  <Button onClick={onContact} size="sm">
                    {t("contact")}
                  </Button>
                )}
              </div>
            )}
            {!isOwn && onContact && viewerType !== "company" && (
              <Button onClick={onContact} size="sm">
                {t("contact")}
              </Button>
            )}
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {profile.user_type === "candidate" && (viewerType === "company" || viewerType === "recruiter") && (
            <div className="space-y-3">
              {profile.languages && (
                <div>
                  <h4 className="font-medium mb-2">{t("languages")}</h4>
                  <div className="flex flex-wrap gap-2">
                    {Object.entries(profile.languages).map(([lang, level]) => (
                      <Badge key={lang} variant="secondary">
                        {lang}: {level as string}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {profile.computer_skills && (
                <div>
                  <h4 className="font-medium mb-2">{t("computerSkills")}</h4>
                  <div className="flex flex-wrap gap-2">
                    {Array.isArray(profile.computer_skills)
                      ? profile.computer_skills.map((skill: { tool: string; level: string }, index: number) => (
                          <Badge key={index} variant="outline">
                            {skill.tool}: {skill.level}
                          </Badge>
                        ))
                      : Object.entries(profile.computer_skills).map(([skill, level]) => (
                          <Badge key={skill} variant="outline">
                            {skill}: {level as string}
                          </Badge>
                        ))}
                  </div>
                </div>
              )}

              {profile.work_experience_years && (
                <div>
                  <h4 className="font-medium mb-2">{t("workExperienceYears")}</h4>
                  <p>{translateYears(profile.work_experience_years, language as "sk" | "en" | "de")}</p>
                </div>
              )}

              {profile.education_level && (
                <div>
                  <h4 className="font-medium mb-2">{t("educationLevel")}</h4>
                  <p>{profile.education_level}</p>
                </div>
              )}

              {profile.work_country_preferences && (
                <div>
                  <h4 className="font-medium mb-2">{t("workCountryPreferences")}</h4>
                  <div className="flex flex-wrap gap-2">
                    {profile.work_country_preferences.map((country: string) => (
                      <Badge key={country} variant="secondary">
                        {country}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {profile.experience_years && (
                <div>
                  <h4 className="font-medium mb-2">{t("experienceYears")}</h4>
                  <p>{translateYears(profile.experience_years, language as "sk" | "en" | "de")}</p>
                </div>
              )}
            </div>
          )}

          {profile.user_type === "company" && (viewerType === "candidate" || viewerType === "recruiter") && (
            <div className="space-y-3">
              {profile.industry && (
                <div>
                  <h4 className="font-medium mb-2">{t("industry")}</h4>
                  <p>{profile.industry}</p>
                </div>
              )}

              {profile.company_size && (
                <div>
                  <h4 className="font-medium mb-2">{t("companySize")}</h4>
                  <p>{profile.company_size}</p>
                </div>
              )}

              {profile.country && (
                <div>
                  <h4 className="font-medium mb-2">{t("country")}</h4>
                  <p>{profile.country.name}</p>
                </div>
              )}
            </div>
          )}

          {profile.user_type === "recruiter" && (viewerType === "candidate" || viewerType === "company") && (
            <div className="space-y-3">
              {profile.specialization && (
                <div>
                  <h4 className="font-medium mb-2">{t("specialization")}</h4>
                  <p>{profile.specialization}</p>
                </div>
              )}

              {profile.experience_years && (
                <div>
                  <h4 className="font-medium mb-2">{t("experienceYears")}</h4>
                  <p>{translateYears(profile.experience_years)}</p>
                </div>
              )}
            </div>
          )}

          {isOwn && (
            <div className="space-y-3 border-t pt-4">
              <h4 className="font-medium">{t("myContactDetails")}</h4>
              {profile.email && <p>Email: {profile.email}</p>}
              {profile.phone && <p>Telefón: {profile.phone}</p>}
            </div>
          )}
        </CardContent>
      </Card>

      <ContactRevealModal
        isOpen={showRevealModal}
        onClose={() => setShowRevealModal(false)}
        candidate={profile}
        companyCoins={companyCoins}
        onRevealSuccess={handleRevealSuccess}
      />

      {revealData && (
        <EmploymentConfirmationModal
          isOpen={showEmploymentModal}
          onClose={() => setShowEmploymentModal(false)}
          candidate={profile}
          revealData={revealData}
          onConfirmSuccess={handleEmploymentSuccess}
        />
      )}
    </>
  )
}
