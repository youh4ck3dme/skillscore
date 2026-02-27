import skupinyPodskupiny from "./skupiny-podskupiny.json"

type ProfessionData = {
  [profession: string]: string[]
}

function processProfessionsData(): ProfessionData {
  const result: ProfessionData = {}

  const skupinyArray = skupinyPodskupiny?.Skupiny_a_podskupiny
  if (!Array.isArray(skupinyArray)) {
    console.warn("[v0] skupinyPodskupiny.Skupiny_a_podskupiny is not an array during build")
    return result
  }

  for (const item of skupinyArray) {
    if (!result[item.povolanie]) {
      result[item.povolanie] = []
    }
    if (!result[item.povolanie].includes(item.typ_prace)) {
      result[item.povolanie].push(item.typ_prace)
    }
  }

  // Sort professions alphabetically
  const sortedResult: ProfessionData = {}
  Object.keys(result)
    .sort()
    .forEach((key) => {
      sortedResult[key] = result[key].sort()
    })

  return sortedResult
}

export const professionsData = processProfessionsData()

export const getProfessions = (): string[] => {
  return Object.keys(professionsData)
}

export const getWorkTypes = (profession: string): string[] => {
  return professionsData[profession] || []
}

export const translateProfession = (profession: string, locale: string): string => {
  // Check if profession has bilingual format: "English / Slovak"
  if (profession.includes(" / ")) {
    const [english, slovak] = profession.split(" / ").map((s) => s.trim())

    switch (locale) {
      case "en":
        return english
      case "de":
        // For German, use English as fallback since we don't have German translations
        return english
      case "sk":
      default:
        return slovak
    }
  }

  // If no bilingual format, return as is
  return profession
}

export const getTranslatedProfessions = (locale: string): string[] => {
  return getProfessions().map((profession) => translateProfession(profession, locale))
}

export const getTranslatedWorkTypes = (profession: string, locale: string): string[] => {
  return getWorkTypes(profession).map((workType) => translateProfession(workType, locale))
}

export const getProfessionsData = (locale: string) => {
  // Return the same data regardless of locale for now
  // Can be extended later for translations
  return professionsData
}
