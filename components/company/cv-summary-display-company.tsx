"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Briefcase,
  MapPin,
  DollarSign,
  Languages,
  Monitor,
  Target,
  User,
  Globe,
  Car,
  Clock,
  GraduationCap,
  Award,
  Flag,
  Calendar,
} from "lucide-react"

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
  anonymous_id?: string
  drivers_license?: boolean | string
  license_types?: string[]
  employment_type?: string
  start_date?: string
  eu_citizenship?: boolean
  education_level?: string
  study_field?: string
  academic_title?: string
}

interface CVSummaryDisplayCompanyProps {
  cvData: CVData | null
  loading?: boolean
}

export function CVSummaryDisplayCompany({ cvData, loading = false }: CVSummaryDisplayCompanyProps) {
  if (loading) {
    return (
      <Card className="bg-card border-border shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-foreground">
            <div className="p-2 rounded-lg bg-primary/10">
              <User className="h-5 w-5 text-primary" />
            </div>
            Tvoj profil
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Načítavam profil...</p>
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
            Tvoj profil
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Zatiaľ nemáte dokončený profil.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="bg-card border-border shadow-sm hover:shadow-md transition-shadow">
      <CardHeader className="border-b border-border bg-muted/30">
        <CardTitle className="flex items-center gap-3 text-foreground">
          <div className="p-2 rounded-lg bg-primary/10">
            <User className="h-5 w-5 text-primary" />
          </div>
          <span className="text-xl font-semibold">Tvoj profil</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        {cvData.anonymous_id && (
          <div className="p-5 bg-gradient-to-br from-primary/10 via-primary/5 to-accent/5 rounded-lg border border-primary/20">
            <p className="text-sm font-medium text-muted-foreground">ID číslo kandidáta</p>
            <p className="text-2xl font-bold text-primary mt-1 tracking-wide">{cvData.anonymous_id}</p>
          </div>
        )}

        {cvData.work_experience && cvData.work_experience.length > 0 && (
          <div className="space-y-4">
            <h3 className="font-semibold text-base flex items-center gap-2 text-foreground">
              <div className="p-1.5 rounded-md bg-primary/10">
                <Briefcase className="h-4 w-4 text-primary" />
              </div>
              Pracovné skúsenosti
            </h3>
            <div className="grid gap-3">
              {cvData.work_experience.map((exp, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 border border-border rounded-lg bg-muted/20 hover:bg-muted/40 transition-all"
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
              Hľadané pozície
            </h3>
            <div className="grid gap-3">
              {cvData.desired_positions.map((pos, index) => (
                <div
                  key={index}
                  className="p-4 border border-border rounded-lg bg-muted/20 hover:bg-muted/40 transition-all"
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
              Občianstvo EÚ
            </h3>
            <Badge
              variant="secondary"
              className={
                cvData.eu_citizenship
                  ? "bg-green-500/10 text-green-600 border-green-500/20"
                  : "bg-muted text-muted-foreground"
              }
            >
              {cvData.eu_citizenship ? "Áno" : "Nie"}
            </Badge>
          </div>
        )}

        {cvData.country && (
          <div className="space-y-3">
            <h3 className="font-semibold text-base flex items-center gap-2 text-foreground">
              <div className="p-1.5 rounded-md bg-accent/10">
                <Globe className="h-4 w-4 text-accent" />
              </div>
              Súčasná krajina bydliska
            </h3>
            <Badge variant="secondary" className="bg-secondary/80 hover:bg-secondary font-medium">
              {cvData.country}
            </Badge>
          </div>
        )}

        {cvData.work_locations && cvData.work_locations.length > 0 && (
          <div className="space-y-3">
            <h3 className="font-semibold text-base flex items-center gap-2 text-foreground">
              <div className="p-1.5 rounded-md bg-primary/10">
                <MapPin className="h-4 w-4 text-primary" />
              </div>
              Preferovaná lokalita práce
            </h3>
            <div className="flex flex-wrap gap-2">
              {cvData.work_locations.map((location, index) => (
                <Badge
                  key={index}
                  variant="secondary"
                  className="bg-primary/10 text-primary border-primary/20 font-medium"
                >
                  {location}
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
              Jazyky
            </h3>
            <div className="flex flex-wrap gap-2">
              {cvData.languages.map((lang, index) => (
                <Badge
                  key={index}
                  variant="outline"
                  className="border-primary/40 bg-primary/10 text-foreground hover:bg-primary/20 font-medium px-3 py-1.5"
                >
                  {lang.language} - {lang.level}
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
              Počítačové zručnosti
            </h3>
            <div className="flex flex-wrap gap-2">
              {cvData.computer_skills.map((skill, index) => (
                <Badge
                  key={index}
                  variant="outline"
                  className="border-primary/40 bg-primary/10 text-foreground hover:bg-primary/20 font-medium px-3 py-1.5"
                >
                  {skill.tool} - {skill.level}
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
              Očakávaný plat
            </h3>
            <p className="text-lg font-semibold text-primary pl-8">{cvData.expected_salary} EUR</p>
          </div>
        )}

        {cvData.employment_type && (
          <div className="space-y-3">
            <h3 className="font-semibold text-base flex items-center gap-2 text-foreground">
              <div className="p-1.5 rounded-md bg-primary/10">
                <Briefcase className="h-4 w-4 text-primary" />
              </div>
              Typ zamestnania
            </h3>
            <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20 font-medium">
              {cvData.employment_type}
            </Badge>
          </div>
        )}

        {cvData.start_date && (
          <div className="space-y-3">
            <h3 className="font-semibold text-base flex items-center gap-2 text-foreground">
              <div className="p-1.5 rounded-md bg-accent/10">
                <Clock className="h-4 w-4 text-accent" />
              </div>
              Možný nástup
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
              Vodičský preukaz
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
                  Áno
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
              Vzdelanie
            </h3>
            <div className="p-4 border border-border rounded-lg bg-muted/20">
              {cvData.education_level && <p className="font-medium text-foreground">{cvData.education_level}</p>}
              {cvData.study_field && <p className="text-sm text-muted-foreground mt-1">{cvData.study_field}</p>}
              {cvData.academic_title && (
                <Badge variant="outline" className="mt-2 bg-accent/10 text-accent border-accent/30">
                  {cvData.academic_title}
                </Badge>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
