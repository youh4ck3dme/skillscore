"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Briefcase, Award, Calendar } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { getCertificatesForWorkType } from "@/lib/data/work-experience/certificates-loader"
import { certificateMappingIndex } from "@/lib/data/work-experience-data"

interface WorkExperience {
  profession: string
  workType: string
  years: string
  certificate?: string
}

export function WorkExperienceDisplay() {
  const [workExperiences, setWorkExperiences] = useState<WorkExperience[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchWorkExperience()
  }, [])

  const fetchWorkExperience = async () => {
    try {
      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        setLoading(false)
        return
      }

      const { data, error } = await supabase
        .from("candidate_profiles")
        .select("work_experience")
        .eq("user_id", user.id)
        .single()

      if (data && data.work_experience) {
        setWorkExperiences(data.work_experience)
      }
      setLoading(false)
    } catch (error) {
      console.error("Error fetching work experience:", error)
      setLoading(false)
    }
  }

  const getCertificateTitle = (profession: string, workType: string, certificateId: string): string => {
    const certificates = getCertificatesForWorkType(profession, workType, certificateMappingIndex)
    const certificate = certificates.find((cert) => cert.id === certificateId)
    return certificate?.title || certificateId
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Briefcase className="h-5 w-5" />
            Pracovné skúsenosti
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Načítavam...</p>
        </CardContent>
      </Card>
    )
  }

  if (workExperiences.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Briefcase className="h-5 w-5" />
            Pracovné skúsenosti
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Zatiaľ nemáte pridané žiadne pracovné skúsenosti.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Briefcase className="h-5 w-5" />
          Pracovné skúsenosti
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {workExperiences.map((exp, index) => {
          const availableCertificates = getCertificatesForWorkType(
            exp.profession,
            exp.workType,
            certificateMappingIndex,
          )

          return (
            <div key={index} className="border rounded-lg p-4 space-y-3">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <h3 className="font-semibold text-lg">{exp.workType}</h3>
                  <p className="text-sm text-muted-foreground">{exp.profession}</p>
                </div>
                <Badge variant="secondary" className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  {exp.years}
                </Badge>
              </div>

              {exp.certificate && exp.certificate !== "none" && (
                <div className="pt-2 border-t">
                  <div className="flex items-start gap-2">
                    <Award className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                    <div className="space-y-1">
                      <p className="text-sm font-medium">Certifikát</p>
                      <p className="text-sm text-muted-foreground">
                        {getCertificateTitle(exp.profession, exp.workType, exp.certificate)}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {availableCertificates.length > 0 && (!exp.certificate || exp.certificate === "none") && (
                <div className="pt-2 border-t">
                  <p className="text-xs text-muted-foreground">
                    Pre túto pozíciu je dostupných {availableCertificates.length} certifikátov
                  </p>
                </div>
              )}
            </div>
          )
        })}
      </CardContent>
    </Card>
  )
}
