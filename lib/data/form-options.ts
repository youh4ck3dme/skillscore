import { professionsData as importedProfessionsData } from "./professions"
import { studyFieldsData, getStudyFieldsData } from "./study-fields"
import { staticTranslations } from "@/lib/i18n/translations"

export function getTranslatedFormOptions(language: "sk" | "en" | "de" = "sk") {
  const translations = staticTranslations[language]
  if (!translations) {
    const t = staticTranslations.sk.formOptions
    return {
      countries: Object.values(t.countries).sort((a, b) => a.localeCompare(b, "sk")),
      employmentTypes: Object.values(t.employmentTypes).sort((a, b) => a.localeCompare(b, "sk")),
      skillLevels: Object.values(t.skillLevels),
      languages: Object.values(t.languages).sort((a, b) => a.localeCompare(b, "sk")),
      languageLevels: Object.values(t.languageLevels),
      educationLevels: Object.values(t.educationLevels),
      academicTitles: Object.values(t.academicTitles).sort((a, b) => a.localeCompare(b, "sk")),
    }
  }

  if (!translations.formOptions) {
    const t = staticTranslations.sk.formOptions
    return {
      countries: Object.values(t.countries).sort((a, b) => a.localeCompare(b, "sk")),
      employmentTypes: Object.values(t.employmentTypes).sort((a, b) => a.localeCompare(b, "sk")),
      skillLevels: Object.values(t.skillLevels),
      languages: Object.values(t.languages).sort((a, b) => a.localeCompare(b, "sk")),
      languageLevels: Object.values(t.languageLevels),
      educationLevels: Object.values(t.educationLevels),
      academicTitles: Object.values(t.academicTitles).sort((a, b) => a.localeCompare(b, "sk")),
    }
  }

  const t = translations.formOptions

  return {
    countries: Object.values(t.countries).sort((a, b) => a.localeCompare(b, language)),
    employmentTypes: Object.values(t.employmentTypes).sort((a, b) => a.localeCompare(b, language)),
    skillLevels: Object.values(t.skillLevels),
    languages: Object.values(t.languages).sort((a, b) => a.localeCompare(b, language)),
    languageLevels: Object.values(t.languageLevels),
    educationLevels: Object.values(t.educationLevels),
    academicTitles: Object.values(t.academicTitles).sort((a, b) => a.localeCompare(b, language)),
  }
}

export function getTranslatedStudyFields(language: "sk" | "en" | "de" = "sk") {
  const fields = getStudyFieldsData(language)
  return fields.map((category) => ({
    ...category,
    fields: [...category.fields].sort((a, b) => a.localeCompare(b, language)),
  }))
}

// Driver's license types
export const licenseTypes = [
  "AM",
  "A1",
  "A2",
  "A",
  "B1",
  "B",
  "C1",
  "C",
  "D1",
  "D",
  "BE",
  "C1E",
  "CE",
  "D1E",
  "DE",
  "T",
]

// Computer skills categories and options
export const computerSkillsData: Record<string, string[]> = {
  user: [
    "Microsoft Word",
    "Microsoft Excel",
    "Microsoft PowerPoint",
    "Microsoft Outlook",
    "Google Docs",
    "Google Sheets",
    "Adobe Acrobat",
    "Internet prehliadače",
    "E-mail",
    "Sociálne siete",
  ],
  tools: [
    "JavaScript",
    "TypeScript",
    "Python",
    "Java",
    "C++",
    "C#",
    "PHP",
    "Ruby",
    "Go",
    "Rust",
    "React",
    "Angular",
    "Vue.js",
    "Node.js",
    "Django",
    "Flask",
    "Spring",
    ".NET",
    "SQL",
    "MongoDB",
    "PostgreSQL",
    "MySQL",
    "Git",
    "Docker",
    "Kubernetes",
    "AWS",
    "Azure",
    "Google Cloud",
    "HTML/CSS",
    "Sass/SCSS",
    "Webpack",
    "Redux",
    "GraphQL",
    "REST API",
    "Jenkins",
    "GitLab CI",
    "Terraform",
    "Ansible",
    "Linux",
    "Windows Server",
    "Nginx",
    "Apache",
  ],
  none: [],
}

// Skill levels
export const skillLevels = ["Začiatočník", "Mierne pokročilý", "Pokročilý", "Expert"]

// Languages list
export const languagesList = [
  "Angličtina",
  "Arabčina",
  "Čeština",
  "Čínština",
  "Dánčina",
  "Fínčina",
  "Francúzština",
  "Gréčtina",
  "Hindčina",
  "Holandčina",
  "Japončina",
  "Kórejčina",
  "Maďarčina",
  "Nemčina",
  "Nórčina",
  "Poľština",
  "Portugalčina",
  "Ruština",
  "Slovenčina",
  "Španielčina",
  "Švédčina",
  "Taliančina",
  "Turečtina",
  "Ukrajinčina",
].sort()

// Language proficiency levels
export const languageLevels = [
  "Materinský jazyk",
  "A1 - Začiatočník",
  "A2 - Elementárna úroveň",
  "B1 - Stredne pokročilý",
  "B2 - Pokročilý",
  "C1 - Veľmi pokročilý",
  "C2 - Rodený hovorca",
]

// Education levels
export const educationLevels = [
  "Základné vzdelanie",
  "Stredoškolské vzdelanie bez maturity",
  "Stredoškolské vzdelanie s maturitou",
  "Vyššie odborné vzdelanie",
  "Vysokoškolské vzdelanie I. stupňa (Bc.)",
  "Vysokoškolské vzdelanie II. stupňa (Mgr., Ing.)",
  "Vysokoškolské vzdelanie III. stupňa (PhD.)",
]

export const studyFields = studyFieldsData.sk.map((category) => ({
  category: category.category,
  fields: category.fields,
}))

// Academic titles
export const academicTitles = [
  "Bez titulu",
  "Bc. (Bakalár)",
  "Mgr. (Magister)",
  "Ing. (Inžinier)",
  "MUDr. (Doktor medicíny)",
  "MVDr. (Doktor veterinárnej medicíny)",
  "JUDr. (Doktor práv)",
  "PhDr. (Doktor filozofie)",
  "RNDr. (Doktor prírodných vied)",
  "PaedDr. (Doktor pedagogiky)",
  "ThDr. (Doktor teológie)",
  "PhD. (Doktor)",
  "CSc. (Kandidát vied)",
  "DrSc. (Doktor vied)",
  "prof. (Profesor)",
  "doc. (Docent)",
]

export const professionsData: Record<string, string[]> = importedProfessionsData.sk

// Years of experience options
export const yearsOfExperienceOptions = [
  "Menej ako 1 rok",
  "1-2 roky",
  "2-3 roky",
  "3-5 rokov",
  "5-7 rokov",
  "7-10 rokov",
  "10-15 rokov",
  "Viac ako 15 rokov",
]

// Countries
export const countries = [
  "Belgicko",
  "Bulharsko",
  "Chorvátsko",
  "Cyprus",
  "Česko",
  "Dánsko",
  "Estónsko",
  "Fínsko",
  "Francúzsko",
  "Grécko",
  "Holandsko",
  "Írsko",
  "Island",
  "Litva",
  "Lotyšsko",
  "Luxembursko",
  "Maďarsko",
  "Malta",
  "Nemecko",
  "Nórsko",
  "Poľsko",
  "Portugalsko",
  "Rakúsko",
  "Rumunsko",
  "Slovensko",
  "Slovinsko",
  "Španielsko",
  "Švajčiarsko",
  "Švédsko",
  "Taliansko",
  "Veľká Británia",
]

// Employment types
export const employmentTypes = [
  "Plný úväzok",
  "Čiastočný úväzok",
  "Dohoda o vykonaní práce",
  "Dohoda o pracovnej činnosti",
  "Živnosť / SZČO",
  "Brigáda",
]

export function translateFormValue(
  value: string,
  category:
    | "countries"
    | "languages"
    | "languageLevels"
    | "employmentTypes"
    | "educationLevels"
    | "academicTitles"
    | "skillLevels",
  targetLanguage: "sk" | "en" | "de" = "sk",
): string {
  if (!value) return value

  const skOptions = staticTranslations.sk.formOptions[category]
  const targetOptions = staticTranslations[targetLanguage]?.formOptions?.[category] || skOptions

  // Find the key by matching Slovak value
  const key = Object.keys(skOptions).find((k) => skOptions[k as keyof typeof skOptions] === value)

  // Return translated value or original if not found
  return key ? (targetOptions[key as keyof typeof targetOptions] as string) : value
}

export function translateStudyField(value: string, targetLanguage: "sk" | "en" | "de" = "sk"): string {
  if (!value) return value
  if (targetLanguage === "sk") return value

  // Get all study fields from Slovak version
  const skFields = studyFieldsData.sk
  const targetFields = studyFieldsData[targetLanguage]

  // Search through all categories in Slovak to find the field
  for (let i = 0; i < skFields.length; i++) {
    const fieldIndex = skFields[i].fields.indexOf(value)
    if (fieldIndex !== -1) {
      // Found the field, return the corresponding field from target language
      return targetFields[i]?.fields[fieldIndex] || value
    }
  }

  // If not found, return original value
  return value
}
