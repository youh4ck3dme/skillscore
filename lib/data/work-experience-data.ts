import skupinyPodskupinyData from "./skupiny-podskupiny.json"
import povolanieTypToBundlesIndexData from "./work-experience/povolanie-typ-to-bundles-index.json"
import professionsENData from "./translations/professions-en.json"
import professionsDEData from "./translations/professions-de.json"

export interface ProfessionWorkType {
  povolanie: string
  typ_prace: string
}

const professionsEN = (professionsENData as any).roles_and_tasks_en || []
const professionsDE = (professionsDEData as any).roles_and_tasks_de || []

// Extract unique professions and create profession -> work types mapping
export const professionsWithWorkTypes: Record<string, string[]> = {}

const skupinyArray = skupinyPodskupinyData?.Skupiny_a_podskupiny || []
if (Array.isArray(skupinyArray)) {
  skupinyArray.forEach((item: ProfessionWorkType) => {
    if (!professionsWithWorkTypes[item.povolanie]) {
      professionsWithWorkTypes[item.povolanie] = []
    }
    if (!professionsWithWorkTypes[item.povolanie].includes(item.typ_prace)) {
      professionsWithWorkTypes[item.povolanie].push(item.typ_prace)
    }
  })
}

Object.keys(professionsWithWorkTypes).forEach((profession) => {
  professionsWithWorkTypes[profession].sort((a, b) => a.localeCompare(b, "sk"))
})

// Get unique professions list
export const professionsList = Object.keys(professionsWithWorkTypes).sort((a, b) => a.localeCompare(b, "sk"))

// Years of experience options (1-30 years)
export const yearsOfExperienceOptions = Array.from({ length: 30 }, (_, i) => {
  const years = i + 1
  if (years === 1) return "1 rok"
  if (years >= 2 && years <= 4) return `${years} roky`
  return `${years} rokov`
})

// Certificate mapping index - the JSON has structure { version, generated, index }
// The JSON has structure: { version, generated, index: { profession: { workType: { bundle: "filename" } } } }
export const certificateMappingIndex: Record<
  string,
  Record<string, { bundle: string }>
> = povolanieTypToBundlesIndexData?.index && typeof povolanieTypToBundlesIndexData.index === "object"
  ? povolanieTypToBundlesIndexData.index
  : {}

/**
 * Get all work types for a given profession
 */
export function getWorkTypesForProfession(profession: string): string[] {
  return professionsWithWorkTypes[profession] || []
}

/**
 * Check if a profession and work type combination is valid
 */
export function isValidProfessionWorkType(profession: string, workType: string): boolean {
  const workTypes = professionsWithWorkTypes[profession]
  return workTypes ? workTypes.includes(workType) : false
}

const createTranslationMap = (data: any[], occupationKey: string, workTypeKey: string) => {
  const map = new Map<string, { occupation: string; workType: string }>()

  if (Array.isArray(data)) {
    data.forEach((item: any) => {
      const key = `${item.povolanie_sk}|||${item.typ_prace_sk}`
      map.set(key, {
        occupation: item[occupationKey] || item.povolanie_sk,
        workType: item[workTypeKey] || item.typ_prace_sk,
      })
    })
  }

  return map
}

const translationMapEN = createTranslationMap(professionsEN, "occupation", "work_type")
const translationMapDE = createTranslationMap(professionsDE, "occupation_de", "work_type_de")

export const translateProfession = (text: string, locale: string): string => {
  if (locale === "sk") {
    return text
  }

  // Try to find translation in the maps
  const map = locale === "en" ? translationMapEN : locale === "de" ? translationMapDE : null

  if (map) {
    // Search for exact match in work types
    for (const [key, value] of map.entries()) {
      const [_, workTypeSK] = key.split("|||")
      if (workTypeSK === text) {
        return value.workType
      }
    }
  }

  // Fallback: return original text
  return text
}

export const translateProfessionName = (professionName: string, locale: string): string => {
  if (locale === "sk") {
    return professionName
  }

  // Try to find translation in the maps
  const map = locale === "en" ? translationMapEN : locale === "de" ? translationMapDE : null

  if (map) {
    // Search for exact match in professions
    for (const [key, value] of map.entries()) {
      const [occupationSK, _] = key.split("|||")
      if (occupationSK === professionName) {
        return value.occupation
      }
    }
  }

  // Fallback: return original text
  return professionName
}

export const getTranslatedProfessionsList = (locale: string): string[] => {
  return professionsList.map((profession) => translateProfession(profession, locale))
}

export const getTranslatedWorkTypes = (profession: string, locale: string): string[] => {
  const workTypes = professionsWithWorkTypes[profession] || []
  return workTypes.map((workType) => translateProfession(workType, locale))
}

export function getTranslatedYearsOptions(language: "sk" | "en" | "de"): string[] {
  if (language === "sk") {
    return yearsOfExperienceOptions
  }

  return Array.from({ length: 30 }, (_, i) => {
    const years = i + 1
    if (language === "en") {
      return years === 1 ? "1 year" : `${years} years`
    }
    if (language === "de") {
      return years === 1 ? "1 Jahr" : `${years} Jahre`
    }
    return `${years} rokov` // fallback
  })
}
