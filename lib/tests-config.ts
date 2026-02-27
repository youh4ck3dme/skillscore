// Shared tests configuration

export const LANGUAGES = [
  { code: "en", name: "English" },
  { code: "de", name: "Deutsch" },
  { code: "sk", name: "Slovenčina" },
  { code: "hu", name: "Magyar" },
  { code: "cz", name: "Čeština" },
  { code: "pl", name: "Polski" },
  { code: "ua", name: "Українська" },
  { code: "ro", name: "Română" },
  { code: "hr", name: "Hrvatski" },
  { code: "sr", name: "Srpski" },
  { code: "bg", name: "Български" },
  { code: "ru", name: "Русский" },
  { code: "tr", name: "Türkçe" },
  { code: "ar", name: "العربية" },
]

export const LANGUAGE_LEVELS = ["A1", "A2", "B1", "B2", "C1", "C2"]

const JOB_SKILL_FAMILIES = [
  { code: "production", name: "Výroba" },
  { code: "logistics", name: "Logistika" },
  { code: "construction", name: "Stavebníctvo" },
  { code: "automotive", name: "Automotive" },
  { code: "food", name: "Potravinárstvo" },
  { code: "electronics", name: "Elektrotechnika" },
]

const JOB_SKILL_LEVELS = [
  { code: "entry", name: "Entry" },
  { code: "skilled", name: "Skilled" },
]

const IT_LEVELS = [
  { code: "basic", name: "Základná" },
  { code: "advanced", name: "Pokročilá" },
]

const TEST_LEVELS_GENERAL = [
  { code: "standard", name: "Standard" },
  { code: "expert", name: "Expert" },
]

// Generate all language test variants
const LANGUAGE_TESTS = LANGUAGES.flatMap((lang) =>
  LANGUAGE_LEVELS.map((level) => ({
    id: `LANGUAGE_${lang.code.toUpperCase()}_${level}`,
    name: `${lang.name} - ${level}`,
    category: "basic" as const,
    coinCost: 12,
    description: `Overuje úroveň ${level} jazyka ${lang.name} v pracovnom kontexte.`,
  })),
)

// Generate all job skills test variants
const JOB_SKILLS_TESTS = JOB_SKILL_FAMILIES.flatMap((family) =>
  JOB_SKILL_LEVELS.map((level) => ({
    id: `JOB_SKILLS_${family.code.toUpperCase()}_${level.code.toUpperCase()}`,
    name: `Pracovné zručnosti: ${family.name} (${level.name})`,
    category: "basic" as const,
    coinCost: 10,
    description: `Overuje ${level.name} úroveň zručností v oblasti ${family.name}.`,
  })),
)

// Generate IT test variants
const IT_TESTS = IT_LEVELS.map((level) => ({
  id: `IT_USER_${level.code.toUpperCase()}`,
  name: `IT schopnosti - ${level.name}`,
  category: "basic" as const,
  coinCost: 14,
  description: `Overuje IT zručnosti na úrovni ${level.name}.`,
}))

// Tests with levels
const LEVELED_TESTS = [
  {
    baseId: "LOGICAL_NUMERICAL",
    baseName: "Logicko-numerický",
    coinCost: 14,
    shortDesc: "Logické myslenie a práca s číslami",
  },
  {
    baseId: "VERBAL_SKILLS",
    baseName: "Verbálne schopnosti",
    coinCost: 14,
    shortDesc: "Porozumenie textu a logické usudzovanie",
  },
  { baseId: "DATA_ENTRY", baseName: "Zadávanie dát", coinCost: 8, shortDesc: "Rýchlosť a presnosť pri zadávaní dát" },
].flatMap((test) =>
  TEST_LEVELS_GENERAL.map((level) => ({
    id: `${test.baseId}_${level.code.toUpperCase()}`,
    name: `${test.baseName} - ${level.name}`,
    category: "advanced" as const,
    coinCost: test.coinCost,
    description: `${test.shortDesc} na úrovni ${level.name}.`,
  })),
)

export const ALL_TESTS = [
  ...LANGUAGE_TESTS,
  ...JOB_SKILLS_TESTS,
  ...IT_TESTS,
  ...LEVELED_TESTS,
  {
    id: "DIGITAL_SKILLS",
    name: "Digitálne zručnosti",
    category: "basic" as const,
    coinCost: 8,
    description: "Meria orientáciu v kancelárskych nástrojoch, e-mailoch, dokumentoch a online bezpečnosti.",
  },
  {
    id: "SJT_BASIC",
    name: "SJT základný",
    category: "basic" as const,
    coinCost: 10,
    description: "Situačný úsudkový test - hodnotí rozhodovanie v pracovných situáciách.",
  },
  {
    id: "SAFETY_GENERAL",
    name: "BOZP všeobecný",
    category: "basic" as const,
    coinCost: 6,
    description: "Bezpečnosť a ochrana zdravia pri práci - základné znalosti.",
  },
]

export type Test = (typeof ALL_TESTS)[0]
