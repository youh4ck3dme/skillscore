"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Info, Send, Search, Loader2 } from "lucide-react"
import { toast } from "sonner"

const LANGUAGES = [
  { code: "en", name: "English" },
  { code: "de", name: "Deutsch" },
  { code: "fr", name: "Français" },
  { code: "es", name: "Español" },
  { code: "it", name: "Italiano" },
]

const LANGUAGE_LEVELS = ["A1", "A2", "B1", "B2", "C1", "C2"]

const JOB_SKILL_FAMILIES = [
  { code: "administrative", name: "Administratíva" },
  { code: "customer-service", name: "Zákaznícky servis" },
  { code: "logistics", name: "Logistika" },
  { code: "sales", name: "Predaj" },
]

const JOB_SKILL_LEVELS = [
  { code: "junior", name: "Junior" },
  { code: "mid", name: "Mid" },
  { code: "senior", name: "Senior" },
]

const IT_LEVELS = [
  { code: "beginner", name: "Beginner" },
  { code: "intermediate", name: "Intermediate" },
  { code: "advanced", name: "Advanced" },
  { code: "expert", name: "Expert" },
]

const TEST_LEVELS_GENERAL = [
  { code: "screen", name: "Screen" },
  { code: "standard", name: "Standard" },
  { code: "expert", name: "Expert" },
]

// Generate all language test variants
const LANGUAGE_TESTS = LANGUAGES.flatMap((lang) =>
  LANGUAGE_LEVELS.map((level) => ({
    id: `LANGUAGE_${lang.code.toUpperCase()}_${level}`,
    name: `${lang.name} - ${level}`,
    category: "basic",
    coins: 12,
    shortDesc: `Overuje úroveň ${level} jazyka ${lang.name} v pracovnom kontexte.`,
    fullDesc: `Test overuje jazykovú úroveň ${level} pre jazyk ${lang.name}. Meria porozumenie textu, gramatiku a schopnosť komunikovať v pracovnom prostredí.`,
  })),
)

// Generate all job skills test variants
const JOB_SKILLS_TESTS = JOB_SKILL_FAMILIES.flatMap((family) =>
  JOB_SKILL_LEVELS.map((level) => ({
    id: `JOB_SKILLS_${family.code.toUpperCase()}_${level.code.toUpperCase()}`,
    name: `Pracovné zručnosti: ${family.name} (${level.name})`,
    category: "basic",
    coins: 10,
    shortDesc: `Overuje ${level.name} úroveň zručností v oblasti ${family.name}.`,
    fullDesc: `Test meria praktické znalosti a zručnosti pre oblasť ${family.name} na ${level.name} úrovni. Simuluje reálne pracovné situácie.`,
  })),
)

// Generate IT test variants
const IT_TESTS = IT_LEVELS.map((level) => ({
  id: `IT_USER_${level.code.toUpperCase()}`,
  name: `IT schopnosti - ${level.name}`,
  category: "basic",
  coins: 14,
  shortDesc: `Overuje IT zručnosti na úrovni ${level.name}.`,
  fullDesc: `Test IT schopností pre úroveň ${level.name}. Meria orientáciu v systémoch, aplikáciách a riešenie technických problémov.`,
}))

// Tests with levels (lognum, verbal, dataentry)
const LEVELED_TESTS = [
  {
    baseId: "LOGICAL_NUMERICAL",
    baseName: "Logicko-numerický",
    coins: 14,
    shortDesc: "Logické myslenie a práca s číslami",
  },
  {
    baseId: "VERBAL_SKILLS",
    baseName: "Verbálne schopnosti",
    coins: 14,
    shortDesc: "Porozumenie textu a logické usudzovanie",
  },
  {
    baseId: "DATA_ENTRY",
    baseName: "Zadávanie dát",
    coins: 8,
    shortDesc: "Rýchlosť a presnosť pri zadávaní dát",
  },
].flatMap((test) =>
  TEST_LEVELS_GENERAL.map((level) => ({
    id: `${test.baseId}_${level.code.toUpperCase()}`,
    name: `${test.baseName} - ${level.name}`,
    category: "advanced",
    coins: test.coins,
    shortDesc: `${test.shortDesc} na úrovni ${level.name}.`,
    fullDesc: `Test ${test.baseName} na úrovni ${level.name}. Meria ${test.shortDesc.toLowerCase()}.`,
  })),
)

const ALL_TESTS = [
  // Language tests with all variants
  ...LANGUAGE_TESTS,

  // Job skills with all variants
  ...JOB_SKILLS_TESTS,

  // IT tests with all levels
  ...IT_TESTS,

  // Leveled tests (lognum, verbal, data entry)
  ...LEVELED_TESTS,

  // Basic tests without levels
  {
    id: "DIGITAL_SKILLS",
    name: "Digitálne zručnosti",
    category: "basic",
    coins: 8,
    shortDesc: "Meria orientáciu v kancelárskych nástrojoch, e-mailoch, dokumentoch a online bezpečnosti.",
    fullDesc: `Na čo test slúži:
Tento test meria, ako dobre sa kandidát orientuje v bežných kancelárskych nástrojoch – e-maily, dokumenty, tabuľky, online formuláre a jednoduché interné systémy.

Čo sa testom meria:
• schopnosť používať e-mail v pracovnom kontexte (prílohy, odpovede, kopie)
• práca s dokumentmi a tabuľkami (úpravy, jednoduché vzorce, formátovanie)
• bezpečné správanie v online prostredí (phishing, podozrivé linky, prístupové údaje)`,
  },
  {
    id: "SJT_BASIC",
    name: "SJT základný",
    category: "basic",
    coins: 10,
    shortDesc: "Simuluje bežné pracovné situácie - konflikty, spolupráca, tlak.",
    fullDesc: `Základný SJT (Situational Judgement Test) simuluje bežné pracovné situácie – nedorozumenia, konflikty, časový tlak, spoluprácu.`,
  },

  // Advanced tests without levels
  {
    id: "SJT_COGNITIVE",
    name: "SJT kognitívny",
    category: "advanced",
    coins: 16,
    shortDesc: "Praktické uvažovanie, vyhodnocovanie situácií a efektívne riešenia.",
    fullDesc: `Kognitívny SJT sa zameriava na praktické uvažovanie – ako kandidát vyhodnocuje situácie, kombinuje informácie a volí efektívne riešenia.`,
  },
  {
    id: "PLANNING",
    name: "Plánovanie a organizácia",
    category: "advanced",
    coins: 12,
    shortDesc: "Práca s časom, úlohami a neočakávanými zmenami.",
    fullDesc: `Test plánovania ukazuje, ako kandidát pracuje s časom, úlohami a neočakávanými zmenami.`,
  },
  {
    id: "SAFETY_BOZP",
    name: "BOZP",
    category: "advanced",
    coins: 8,
    shortDesc: "Bezpečnostné pravidlá a správanie v rizikových situáciách.",
    fullDesc: `BOZP test pomáha firmám znížiť riziko úrazov a incidentov. Ukazuje, ako kandidát chápe bezpečnostné pravidlá.`,
  },
  {
    id: "WORK_SAMPLE",
    name: "Work Sample",
    category: "advanced",
    coins: 25,
    shortDesc: "Simuluje reálne pracovné úlohy.",
    fullDesc: `Work sample test simuluje miniatúrne úlohy z reálnej práce – komunikáciu so zákazníkom, prácu s objednávkou, riešenie problému v procese.`,
  },
  {
    id: "ATTENTION_DETAIL",
    name: "Pozornosť k detailom",
    category: "advanced",
    coins: 10,
    shortDesc: "Schopnosť všimnúť si chyby a nezrovnalosti.",
    fullDesc: `Test pozornosti k detailom je kľúčový pre pozície, kde aj malá chyba môže mať veľký dopad – financie, administratíva, zákaznícky servis, logistika.`,
  },

  // Retention tests
  {
    id: "RET_ENGAGEMENT",
    name: "Angažovanosť",
    category: "retention",
    coins: 15,
    shortDesc: "Miera vnútornej motivácie a iniciatívy.",
    fullDesc: `Test meria, nakoľko je zamestnanec vnútorne motivovaný a či prejavuje iniciatívu vo svojej práci.`,
  },
  {
    id: "RET_MOTIVATORS",
    name: "Motivátory",
    category: "retention",
    coins: 15,
    shortDesc: "Čo človeka poháňa v práci.",
    fullDesc: `Test identifikuje hlavné motivačné faktory zamestnanca - či je to plat, uznanie, zaujímavá práca, tímová spolupráca alebo kariérny rast.`,
  },
  {
    id: "RET_RISK",
    name: "Retenčné riziko",
    category: "retention",
    coins: 15,
    shortDesc: "Pravdepodobnosť zmeny práce.",
    fullDesc: `Test odhaduje pravdepodobnosť, že zamestnanec v blízkej dobe zmení prácu.`,
  },
  {
    id: "RET_STRESS_BURNOUT",
    name: "Stres & vyhorenie",
    category: "retention",
    coins: 15,
    shortDesc: "Zvládanie tlaku a riziko vyhorenia.",
    fullDesc: `Test hodnotí, ako zamestnanec zvláda pracovný tlak a identifikuje príznaky možného vyhorenia.`,
  },
  {
    id: "RET_CAREER_GROWTH",
    name: "Kariérny rast",
    category: "retention",
    coins: 15,
    shortDesc: "Očakávania ohľadom rastu a rozvoja.",
    fullDesc: `Test mapuje očakávania zamestnanca ohľadom kariérneho postupu a profesionálneho rozvoja.`,
  },
  {
    id: "RET_MANAGER_RELATIONSHIP",
    name: "Vzťah s manažérom",
    category: "retention",
    coins: 15,
    shortDesc: "Typ vedenia ktorý kandidát potrebuje.",
    fullDesc: `Test identifikuje, aký typ vedenia a manažérskeho prístupu zamestnanec preferuje.`,
  },
  {
    id: "RET_CULTURE_FIT",
    name: "Kultúrny fit",
    category: "retention",
    coins: 15,
    shortDesc: "V akom type firemnej kultúry sa cíti prirodzene.",
    fullDesc: `Test hodnotí, do akého typu firemnej kultúry zamestnanec najlepšie zapadá.`,
  },
  {
    id: "RET_COMMUNICATION_CLIMATE",
    name: "Komunikačná klíma",
    category: "retention",
    coins: 15,
    shortDesc: "Potreba otvorenej komunikácie a bezpečného prostredia.",
    fullDesc: `Test meria potrebu otvorenej komunikácie a psychologicky bezpečného pracovného prostredia.`,
  },
]

interface CompanyTestAssignmentProps {
  companyId?: string
}

export function CompanyTestAssignment({ companyId }: CompanyTestAssignmentProps) {
  const [selectedTest, setSelectedTest] = useState<(typeof ALL_TESTS)[0] | null>(null)
  const [showAssignModal, setShowAssignModal] = useState(false)
  const [showInfoModal, setShowInfoModal] = useState(false)
  const [emails, setEmails] = useState("")
  const [sending, setSending] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")

  const filteredTests = ALL_TESTS.filter(
    (test) =>
      test.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      test.shortDesc.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const basicTests = filteredTests.filter((t) => t.category === "basic")
  const advancedTests = filteredTests.filter((t) => t.category === "advanced")
  const retentionTests = filteredTests.filter((t) => t.category === "retention")

  const handleAssign = async () => {
    if (!selectedTest || !emails.trim()) return
    setSending(true)

    try {
      const emailList = emails
        .split(/[,;\n]/)
        .map((e) => e.trim())
        .filter((e) => e)

      let successCount = 0
      let failCount = 0

      for (const email of emailList) {
        try {
          const response = await fetch("/api/company/test-assignments", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              candidate_email: email,
              test_id: selectedTest.id,
              test_name: selectedTest.name,
            }),
          })

          if (response.ok) {
            successCount++
          } else {
            failCount++
          }
        } catch {
          failCount++
        }
      }

      if (successCount > 0) {
        toast.success(`Úspešne odoslané: ${successCount} pozvánok`)
      }
      if (failCount > 0) {
        toast.error(`Nepodarilo sa odoslať: ${failCount} pozvánok`)
      }

      setShowAssignModal(false)
      setEmails("")
      setSelectedTest(null)
    } finally {
      setSending(false)
    }
  }

  const openInfoModal = (test: (typeof ALL_TESTS)[0]) => {
    setSelectedTest(test)
    setShowInfoModal(true)
  }

  const TestCard = ({ test }: { test: (typeof ALL_TESTS)[0] }) => (
    <div className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors">
      <div className="flex items-center gap-3 flex-1">
        <span className="font-medium">{test.name}</span>
        <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={() => openInfoModal(test)}>
          <Info className="h-4 w-4 text-muted-foreground hover:text-primary cursor-pointer" />
        </Button>
      </div>
      <div className="flex items-center gap-3">
        <Badge variant="outline">{test.coins} coinov</Badge>
        <Button
          size="sm"
          onClick={() => {
            setSelectedTest(test)
            setShowAssignModal(true)
          }}
        >
          <Send className="h-4 w-4 mr-2" />
          Prideliť
        </Button>
      </div>
    </div>
  )

  return (
    <>
      <div className="space-y-6">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Hľadať test..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Základné testy */}
        <div>
          <h3 className="font-semibold text-sm text-muted-foreground mb-3">ZÁKLADNÉ TESTY ({basicTests.length})</h3>
          <div className="space-y-2">
            {basicTests.map((test) => (
              <TestCard key={test.id} test={test} />
            ))}
          </div>
        </div>

        {/* Pokročilé testy */}
        <div>
          <h3 className="font-semibold text-sm text-muted-foreground mb-3">POKROČILÉ TESTY ({advancedTests.length})</h3>
          <div className="space-y-2">
            {advancedTests.map((test) => (
              <TestCard key={test.id} test={test} />
            ))}
          </div>
        </div>

        {/* Retenčné testy */}
        <div>
          <h3 className="font-semibold text-sm text-muted-foreground mb-3">RETENČNÉ TESTY ({retentionTests.length})</h3>
          <div className="space-y-2">
            {retentionTests.map((test) => (
              <TestCard key={test.id} test={test} />
            ))}
          </div>
        </div>
      </div>

      <Dialog open={showInfoModal} onOpenChange={setShowInfoModal}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Info className="h-5 w-5 text-primary" />
              {selectedTest?.name}
            </DialogTitle>
            <Badge variant="outline" className="w-fit">
              {selectedTest?.coins} coinov
            </Badge>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-muted-foreground">{selectedTest?.shortDesc}</p>
            <div className="p-4 bg-muted/50 rounded-lg whitespace-pre-line text-sm">{selectedTest?.fullDesc}</div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowInfoModal(false)}>
              Zavrieť
            </Button>
            <Button
              onClick={() => {
                setShowInfoModal(false)
                setShowAssignModal(true)
              }}
            >
              <Send className="h-4 w-4 mr-2" />
              Prideliť test
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Assign Modal */}
      <Dialog open={showAssignModal} onOpenChange={setShowAssignModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Prideliť test: {selectedTest?.name}</DialogTitle>
            <DialogDescription>
              Zadajte e-maily osôb, ktorým chcete prideliť test. Ak nie sú registrovaní, dostanú pozvánku.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">E-maily (oddelené čiarkou alebo novým riadkom)</label>
              <textarea
                className="w-full mt-2 p-3 border rounded-lg min-h-[100px] text-sm"
                placeholder="jan@firma.sk, maria@firma.sk..."
                value={emails}
                onChange={(e) => setEmails(e.target.value)}
              />
            </div>
            <div className="p-3 bg-muted/50 rounded-lg">
              <p className="text-sm">
                <strong>Cena:</strong> {selectedTest?.coins} coinov za osobu
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAssignModal(false)}>
              Zrušiť
            </Button>
            <Button onClick={handleAssign} disabled={sending || !emails.trim()}>
              {sending ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Odosielam...
                </>
              ) : (
                "Prideliť test"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
