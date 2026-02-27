export interface CertificateItem {
  id: string
  title: string
  renewal_years?: number
}

export interface CertificateBundle {
  bundle_id: string
  bundle_name: string
  type: string
  items: CertificateItem[]
}

export interface CertificateGroup {
  group_id: string
  group_name: string
  bundles: CertificateBundle[]
}

// Import all certificate bundles
import administrativa from "./certificates/administrativa_course_bundles_v0.json"
import audit_compliance from "./certificates/audit_compliance_course_bundles_v0.json"
import bezpecnost_sbs from "./certificates/bezpecnost_sbs_course_bundles_v0.json"
import cistenie_facility from "./certificates/cistenie_facility_course_bundles_v0.json"
import data_bi_analytics from "./certificates/data_bi_analytics_course_bundles_v0.json"
import doprava_vodici from "./certificates/doprava_vodici_course_bundles_v0.json"
import elektro_energetika from "./certificates/elektro_energetika_course_bundles_v0.json"
import finance_controlling from "./certificates/finance_controlling_course_bundles_v0.json"
import gastro_hotely from "./certificates/gastro_hotely_course_bundles_v0.json"
import hr_mzdy from "./certificates/hr_mzdy_course_bundles_v0.json"
import it_infra_security from "./certificates/it_infra_security_course_bundles_v0.json"
import it_vyvoj from "./certificates/it_vyvoj_course_bundles_v0.json"
import kreativa_dizajn from "./certificates/kreativa_dizajn_course_bundles_v0.json"
import kvalita_qaqc from "./certificates/kvalita_qaqc_course_bundles_v0.json"
import marketing_pr from "./certificates/marketing_pr_course_bundles_v0.json"
import nakup_procurement from "./certificates/nakup_procurement_course_bundles_v0.json"
import polnohospodarstvo from "./certificates/polnohospodarstvo_course_bundles_v0.json"
import pravne from "./certificates/pravne_course_bundles_v0.json"
import predaj_obchod from "./certificates/predaj_obchod_course_bundles_v0.json"
import sklad_logistika from "./certificates/sklad_logistika_course_bundles_v0.json"
import stavebnictvo_remesla from "./certificates/stavebnictvo_remesla_course_bundles_v0.json"
import strojarenstvo_udrzba from "./certificates/strojarenstvo_udrzba_course_bundles_v0.json"
import ucetnictvo_dane from "./certificates/ucetnictvo_dane_course_bundles_v0.json"
import vyroba_montaz from "./certificates/vyroba_montaz_course_bundles_v0.json"
import vzdelavanie from "./certificates/vzdelavanie_course_bundles_v0.json"
import zdravotnictvo_social from "./certificates/zdravotnictvo_social_course_bundles_v0.json"
import zakaznicka_podpora from "./certificates/zakaznicka_podpora_course_bundles_v0.json"

export const certificatesByGroup: Record<string, CertificateGroup> = {
  administrativa,
  audit_compliance,
  bezpecnost_sbs,
  cistenie_facility,
  data_bi_analytics,
  doprava_vodici,
  elektro_energetika,
  finance_controlling,
  gastro_hotely,
  hr_mzdy,
  it_infra_security,
  it_vyvoj,
  kreativa_dizajn,
  kvalita_qaqc,
  marketing_pr,
  nakup_procurement,
  polnohospodarstvo,
  pravne,
  predaj_obchod,
  sklad_logistika,
  stavebnictvo_remesla,
  strojarenstvo_udrzba,
  ucetnictvo_dane,
  vyroba_montaz,
  vzdelavanie,
  zdravotnictvo_social,
  zakaznicka_podpora,
}

/**
 * Get all certificates for a specific profession and work type combination
 * @param profession - The profession name
 * @param workType - The work type within the profession
 * @param mappingIndex - The mapping index from profession/work type to certificate groups
 * @returns Array of certificate items, or empty array if no match found
 */
export function getCertificatesForWorkType(
  profession: string,
  workType: string,
  mappingIndex: Record<string, Record<string, { bundle: string }>> | null | undefined,
): CertificateItem[] {
  if (!mappingIndex || typeof mappingIndex !== "object") {
    return []
  }

  try {
    const mappingKeys = Object.keys(mappingIndex)

    let professionKey = profession
    if (profession.includes(" / ")) {
      professionKey = profession.split(" / ")[0].trim()
    }

    const professionMapping = mappingIndex[professionKey]
    if (!professionMapping || typeof professionMapping !== "object") {
      return []
    }

    const workTypeMapping = professionMapping[workType]
    if (!workTypeMapping || typeof workTypeMapping !== "object") {
      return []
    }

    const bundleFile = workTypeMapping.bundle
    if (!bundleFile) {
      return []
    }

    const groupId = bundleFile.replace("_course_bundles_v0.json", "")

    const groupData = certificatesByGroup[groupId]
    if (!groupData) {
      return []
    }

    if (!groupData.bundles || !Array.isArray(groupData.bundles)) {
      return []
    }

    const allItems: CertificateItem[] = []
    groupData.bundles.forEach((bundle) => {
      if (bundle.items && Array.isArray(bundle.items)) {
        allItems.push(...bundle.items)
      }
    })

    return allItems
  } catch (error) {
    console.error("Error in getCertificatesForWorkType:", error)
    return []
  }
}

/**
 * Get the certificate group information for a profession and work type
 */
export function getCertificateGroupInfo(
  profession: string,
  workType: string,
  mappingIndex: Record<string, Record<string, { bundle: string }>> | null | undefined,
): CertificateGroup | null {
  if (!mappingIndex || typeof mappingIndex !== "object") {
    return null
  }

  try {
    let professionKey = profession
    if (profession.includes(" / ")) {
      professionKey = profession.split(" / ")[0].trim()
    }

    const professionMapping = mappingIndex[professionKey]
    if (!professionMapping) return null

    const workTypeMapping = professionMapping[workType]
    if (!workTypeMapping) return null

    const bundleFile = workTypeMapping.bundle
    if (!bundleFile) return null

    const groupId = bundleFile.replace("_course_bundles_v0.json", "")

    return certificatesByGroup[groupId] || null
  } catch (error) {
    console.error("Error in getCertificateGroupInfo:", error)
    return null
  }
}
