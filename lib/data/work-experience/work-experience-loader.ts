import { certificateMappingIndex } from "../work-experience-data"
import { getCertificatesForWorkType, type CertificateItem } from "./certificates-loader"

export interface WorkExperienceEntry {
  profession: string
  workType: string
  yearsOfExperience: string
  certificates: CertificateItem[]
}

/**
 * Get certificates for a given profession and work type
 */
export function getWorkExperienceCertificates(profession: string, workType: string): CertificateItem[] {
  return getCertificatesForWorkType(profession, workType, certificateMappingIndex)
}

/**
 * Create a work experience entry with certificates
 */
export function createWorkExperienceEntry(
  profession: string,
  workType: string,
  yearsOfExperience: string,
): WorkExperienceEntry {
  const certificates = getWorkExperienceCertificates(profession, workType)

  return {
    profession,
    workType,
    yearsOfExperience,
    certificates,
  }
}
