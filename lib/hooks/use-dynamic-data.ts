"use client"

import { useParams } from "next/navigation"
import { getProfessionsData } from "@/lib/data/professions"
import { getCertificationsData } from "@/lib/data/certifications"
import { getStudyFieldsData } from "@/lib/data/study-fields"

export function useDynamicData() {
  const params = useParams()
  const locale = (params?.locale as string) || "sk"

  const professionsData = getProfessionsData(locale)
  const certificationsData = getCertificationsData(locale)
  const studyFieldsData = getStudyFieldsData(locale)

  return {
    professionsData,
    certificationsData,
    studyFieldsData,
    locale,
  }
}
