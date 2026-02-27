"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Briefcase,
  MapPin,
  DollarSign,
  Languages,
  Monitor,
  Target,
  User,
  Calendar,
  ChevronDown,
  ChevronUp,
  Globe,
  Car,
  Clock,
  GraduationCap,
  Award,
  Flag,
} from "lucide-react"
import { useI18n } from "@/lib/i18n/context"
import { staticTranslations } from "@/lib/i18n/translations"
import { TestStatusGrid } from "@/components/test-status-grid"
import { CandidateProfileSummary } from "@/components/candidate-profile-summary"
import { getTranslatedFormOptions, translateFormValue, translateStudyField } from "@/lib/data/form-options"

interface CVData {
  work_experience?: Array<{
    profession: string
    workType: string
    years: string
    certificate?: string | null
  }>
  desired_positions?: Array<{
    profession: string
    workType: string
  }>
  languages?: Array<{
    language: string
    level: string
  }>
  computer_skills?: Array<{
    tool: string
    level: string
  }>
  country?: string
  work_locations?: string[]
  expected_salary?: string
  recruiter_id?: string
  anonymous_id?: string
  drivers_license?: boolean | string
  license_types?: string[]
  employment_type?: string
  start_date?: string
  eu_citizenship?: boolean
  education_level?: string
  study_field?: string
  academic_title?: string
  completed?: boolean
  progress?: number
}

interface CVSummaryDisplayProps {
  cvData: CVData | null
  loading?: boolean
  isCompanyView?: boolean // Add prop to disable profile summary for company view
}

export function CVSummaryDisplay({ cvData, loading = false, isCompanyView = false }: CVSummaryDisplayProps) {
  const { language } = useI18n()
  const currentLang = (language && staticTranslations[language] ? language : "sk") as keyof typeof staticTranslations
  const t =
    staticTranslations[currentLang]?.candidateDashboard?.cvSummary || staticTranslations.sk.candidateDashboard.cvSummary

  const formOptions = getTranslatedFormOptions(currentLang)

  const [isCollapsed, setIsCollapsed] = useState(false)

  if (loading) {
    return (
      <Card className="bg-card border-border shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-foreground">
            <div className="p-2 rounded-lg bg-primary/10">
              <User className="h-5 w-5 text-primary" />
            </div>
            {t.title}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">{t.loading}</p>
        </CardContent>
      </Card>
    )
  }

  const hasContent =
    cvData &&
    ((cvData.work_experience && cvData.work_experience.length > 0) ||
      (cvData.desired_positions && cvData.desired_positions.length > 0) ||
      (cvData.languages && cvData.languages.length > 0) ||
      (cvData.computer_skills && cvData.computer_skills.length > 0) ||
      cvData.country ||
      (cvData.work_locations && cvData.work_locations.length > 0) ||
      cvData.expected_salary ||
      cvData.drivers_license ||
      cvData.employment_type ||
      cvData.start_date ||
      cvData.eu_citizenship !== undefined ||
      cvData.education_level ||
      cvData.study_field ||
      cvData.academic_title ||
      cvData.anonymous_id)

  if (!hasContent) {
    return (
      <Card className="bg-card border-border shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-foreground">
            <div className="p-2 rounded-lg bg-primary/10">
              <User className="h-5 w-5 text-primary" />
            </div>
            {t.title}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {!isCompanyView && (
            <>
              <TestStatusGrid />
              <CandidateProfileSummary className="mt-4" />
            </>
          )}
          <p className="text-muted-foreground mt-4">{t.empty}</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="bg-card border-border shadow-sm hover:shadow-md transition-shadow">
      <CardHeader className="border-b border-border bg-muted/30">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-3 text-foreground">
            <div className="p-2 rounded-lg bg-primary/10">
              <User className="h-5 w-5 text-primary" />
            </div>
            <span className="text-xl font-semibold">{t.title}</span>
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="h-9 w-9 p-0 hover:bg-primary/10 hover:text-primary"
          >
            {isCollapsed ? <ChevronDown className="h-4 w-4" /> : <ChevronUp className="h-4 w-4" />}
          </Button>
        </div>
      </CardHeader>
      {!isCollapsed && (
        <CardContent className="p-6 space-y-6">
          {!isCompanyView && (
            <>
              <TestStatusGrid />
              <CandidateProfileSummary className="mt-2" />
            </>
          )}
          {cvData.anonymous_id && (
            <div className="p-5 bg-gradient-to-br from-primary/10 via-primary/5 to-accent/5 rounded-lg border border-primary/20">
              <p className="text-sm font-medium text-muted-foreground">{t.anonymousIdLabel}</p>
              <p className="text-2xl font-bold text-primary mt-1 tracking-wide">{cvData.anonymous_id}</p>
            </div>
          )}
          {cvData.work_experience && cvData.work_experience.length > 0 && (
            <div className="space-y-4">
              <h3 className="font-semibold text-base flex items-center gap-2 text-foreground">
                <div className="p-1.5 rounded-md bg-primary/10">
                  <Briefcase className="h-4 w-4 text-primary" />
                </div>
                {t.workExperience}
              </h3>
              <div className="grid gap-3">
                {cvData.work_experience.map((exp, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 border border-border rounded-lg bg-muted/20 hover:bg-muted/40 hover:border-primary/30 transition-all"
                  >
                    <div className="flex-1">
                      <p className="font-medium text-foreground">{exp.profession}</p>
                      <p className="text-sm text-muted-foreground mt-0.5">{exp.workType}</p>
                      {exp.certificate && exp.certificate !== "none" && (
                        <Badge variant="outline" className="mt-2 text-xs bg-accent/10 text-accent border-accent/30">
                          <Award className="h-3 w-3 mr-1" />
                          {exp.certificate}
                        </Badge>
                      )}
                    </div>
                    <Badge
                      variant="secondary"
                      className="flex items-center gap-1.5 bg-primary/10 text-primary border-primary/20 font-medium"
                    >
                      <Calendar className="h-3 w-3" />
                      {exp.years}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          )}
          {cvData.desired_positions && cvData.desired_positions.length > 0 && (
            <div className="space-y-4">
              <h3 className="font-semibold text-base flex items-center gap-2 text-foreground">
                <div className="p-1.5 rounded-md bg-accent/10">
                  <Target className="h-4 w-4 text-accent" />
                </div>
                {t.desiredPositions}
              </h3>
              <div className="grid gap-3">
                {cvData.desired_positions.map((pos, index) => (
                  <div
                    key={index}
                    className="p-4 border border-border rounded-lg bg-muted/20 hover:bg-muted/40 hover:border-accent/30 transition-all"
                  >
                    <p className="font-medium text-foreground">{pos.profession}</p>
                    <p className="text-sm text-muted-foreground mt-0.5">{pos.workType}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
          {cvData.eu_citizenship !== undefined && (
            <div className="space-y-3">
              <h3 className="font-semibold text-base flex items-center gap-2 text-foreground">
                <div className="p-1.5 rounded-md bg-primary/10">
                  <Flag className="h-4 w-4 text-primary" />
                </div>
                {t.euCitizenship}
              </h3>
              <Badge
                variant="secondary"
                className={
                  cvData.eu_citizenship
                    ? "bg-green-500/10 text-green-600 border-green-500/20"
                    : "bg-muted text-muted-foreground"
                }
              >
                {cvData.eu_citizenship ? t.yes : t.no}
              </Badge>
            </div>
          )}
          {cvData.country && (
            <div className="space-y-3">
              <h3 className="font-semibold text-base flex items-center gap-2 text-foreground">
                <div className="p-1.5 rounded-md bg-accent/10">
                  <Globe className="h-4 w-4 text-accent" />
                </div>
                {t.currentLocation}
              </h3>
              <Badge variant="secondary" className="bg-secondary/80 hover:bg-secondary font-medium">
                {translateFormValue(cvData.country, "countries", currentLang)}
              </Badge>
            </div>
          )}
          {cvData.work_locations && cvData.work_locations.length > 0 && (
            <div className="space-y-3">
              <h3 className="font-semibold text-base flex items-center gap-2 text-foreground">
                <div className="p-1.5 rounded-md bg-primary/10">
                  <MapPin className="h-4 w-4 text-primary" />
                </div>
                {t.desiredLocation}
              </h3>
              <div className="flex flex-wrap gap-2">
                {cvData.work_locations.map((location, index) => (
                  <Badge
                    key={index}
                    variant="secondary"
                    className="bg-primary/10 text-primary border-primary/20 font-medium"
                  >
                    {translateFormValue(location, "countries", currentLang)}
                  </Badge>
                ))}
              </div>
            </div>
          )}
          {cvData.languages && cvData.languages.length > 0 && (
            <div className="space-y-3">
              <h3 className="font-semibold text-base flex items-center gap-2 text-foreground">
                <div className="p-1.5 rounded-md bg-accent/10">
                  <Languages className="h-4 w-4 text-accent" />
                </div>
                {t.languages}
              </h3>
              <div className="flex flex-wrap gap-2">
                {cvData.languages.map((lang, index) => (
                  <Badge
                    key={index}
                    variant="outline"
                    className="border-primary/40 bg-primary/10 text-foreground hover:bg-primary/20 font-medium px-3 py-1.5"
                  >
                    {translateFormValue(lang.language, "languages", currentLang)} -{" "}
                    {translateFormValue(lang.level, "languageLevels", currentLang)}
                  </Badge>
                ))}
              </div>
            </div>
          )}
          {cvData.computer_skills && cvData.computer_skills.length > 0 && (
            <div className="space-y-3">
              <h3 className="font-semibold text-base flex items-center gap-2 text-foreground">
                <div className="p-1.5 rounded-md bg-primary/10">
                  <Monitor className="h-4 w-4 text-primary" />
                </div>
                {t.computerSkills}
              </h3>
              <div className="flex flex-wrap gap-2">
                {cvData.computer_skills.map((skill, index) => (
                  <Badge
                    key={index}
                    variant="outline"
                    className="border-primary/40 bg-primary/10 text-foreground hover:bg-primary/20 font-medium px-3 py-1.5"
                  >
                    {skill.tool} - {translateFormValue(skill.level, "skillLevels", currentLang)}
                  </Badge>
                ))}
              </div>
            </div>
          )}
          {cvData.expected_salary && (
            <div className="space-y-3">
              <h3 className="font-semibold text-base flex items-center gap-2 text-foreground">
                <div className="p-1.5 rounded-md bg-accent/10">
                  <DollarSign className="h-4 w-4 text-accent" />
                </div>
                {t.expectedSalary}
              </h3>
              <p className="text-lg font-semibold text-primary pl-8">{cvData.expected_salary} EUR</p>
            </div>
          )}
          {cvData.recruiter_id && (
            <div className="space-y-3">
              <h3 className="font-semibold text-base flex items-center gap-2 text-foreground">
                <div className="p-1.5 rounded-md bg-accent/10">
                  <User className="h-4 w-4 text-accent" />
                </div>
                {t.recruiterId}
              </h3>
              <p className="text-sm text-muted-foreground pl-8">{cvData.recruiter_id}</p>
            </div>
          )}
          {cvData.employment_type && (
            <div className="space-y-3">
              <h3 className="font-semibold text-base flex items-center gap-2 text-foreground">
                <div className="p-1.5 rounded-md bg-primary/10">
                  <Briefcase className="h-4 w-4 text-primary" />
                </div>
                {t.employmentTypes}
              </h3>
              <div className="flex flex-wrap gap-2">
                {cvData.employment_type.split(", ").map((type, index) => (
                  <Badge
                    key={index}
                    variant="secondary"
                    className="bg-primary/10 text-primary border-primary/20 font-medium"
                  >
                    {translateFormValue(type.trim(), "employmentTypes", currentLang)}
                  </Badge>
                ))}
              </div>
            </div>
          )}
          {cvData.start_date && (
            <div className="space-y-3">
              <h3 className="font-semibold text-base flex items-center gap-2 text-foreground">
                <div className="p-1.5 rounded-md bg-accent/10">
                  <Clock className="h-4 w-4 text-accent" />
                </div>
                {t.availableStart}
              </h3>
              <Badge variant="secondary" className="bg-secondary/80 hover:bg-secondary font-medium">
                {cvData.start_date}
              </Badge>
            </div>
          )}
          {(cvData.drivers_license || (cvData.license_types && cvData.license_types.length > 0)) && (
            <div className="space-y-3">
              <h3 className="font-semibold text-base flex items-center gap-2 text-foreground">
                <div className="p-1.5 rounded-md bg-primary/10">
                  <Car className="h-4 w-4 text-primary" />
                </div>
                {t.driversLicense}
              </h3>
              <div className="flex flex-wrap gap-2">
                {cvData.license_types && cvData.license_types.length > 0 ? (
                  cvData.license_types.map((type, index) => (
                    <Badge
                      key={index}
                      variant="secondary"
                      className="bg-primary/10 text-primary border-primary/20 font-medium"
                    >
                      {type}
                    </Badge>
                  ))
                ) : (
                  <Badge variant="secondary" className="bg-green-500/10 text-green-600 border-green-500/20">
                    {t.yes}
                  </Badge>
                )}
              </div>
            </div>
          )}
          {(cvData.education_level || cvData.study_field || cvData.academic_title) && (
            <div className="space-y-3">
              <h3 className="font-semibold text-base flex items-center gap-2 text-foreground">
                <div className="p-1.5 rounded-md bg-accent/10">
                  <GraduationCap className="h-4 w-4 text-accent" />
                </div>
                {t.education}
              </h3>
              <div className="p-4 border border-border rounded-lg bg-muted/20">
                {cvData.education_level && (
                  <p className="font-medium text-foreground">
                    {translateFormValue(cvData.education_level, "educationLevels", currentLang)}
                  </p>
                )}
                {cvData.study_field && (
                  <p className="text-sm text-muted-foreground mt-1">
                    {translateStudyField(cvData.study_field, currentLang)}
                  </p>
                )}
                {cvData.academic_title && (
                  <Badge variant="outline" className="mt-2 bg-accent/10 text-accent border-accent/30">
                    {translateFormValue(cvData.academic_title, "academicTitles", currentLang)}
                  </Badge>
                )}
              </div>
            </div>
          )}
        </CardContent>
      )}
    </Card>
  )
}
