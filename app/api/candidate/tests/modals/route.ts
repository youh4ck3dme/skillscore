import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

const FALLBACK_INFO_TEXTS: Record<string, Record<string, string>> = {
  LANGUAGE: {
    sk: `Test jazykových zručností overuje tvoju úroveň cudzieho jazyka. 

Po výbere jazyka a úrovne budeš odpovedať na otázky zamerané na:
• Slovnú zásobu
• Gramatiku
• Porozumenie textu

Test je prispôsobený tvojej zvolenej úrovni od A1 (začiatočník) po C2 (expert).`,
    en: `The language skills test verifies your level of a foreign language.

After selecting a language and level, you will answer questions focused on:
• Vocabulary
• Grammar
• Reading comprehension

The test is adapted to your chosen level from A1 (beginner) to C2 (expert).`,
    de: `Der Sprachkenntnistest überprüft Ihr Niveau in einer Fremdsprache.

Nach Auswahl der Sprache und des Niveaus beantworten Sie Fragen zu:
• Wortschatz
• Grammatik
• Textverständnis

Der Test ist an Ihr gewähltes Niveau von A1 (Anfänger) bis C2 (Experte) angepasst.`,
  },

  IT_SKILLS: {
    sk: `Test IT zručností overuje tvoje znalosti v oblasti informačných technológií.

Test je rozdelený do 4 úrovní (L1-L4) podľa náročnosti. Otázky sú zamerané na:
• Prácu s počítačom
• Kancelárske aplikácie (Word, Excel, PowerPoint)
• Internet a e-mail
• Základné IT koncepty`,
    en: `The IT skills test verifies your knowledge in information technology.

The test is divided into 4 levels (L1-L4) by difficulty. Questions focus on:
• Computer operation
• Office applications (Word, Excel, PowerPoint)
• Internet and email
• Basic IT concepts`,
    de: `Der IT-Kenntnistest überprüft Ihr Wissen im Bereich Informationstechnologie.

Der Test ist in 4 Stufen (L1-L4) nach Schwierigkeit unterteilt. Fragen konzentrieren sich auf:
• Computerarbeit
• Büroanwendungen (Word, Excel, PowerPoint)
• Internet und E-Mail
• Grundlegende IT-Konzepte`,
  },

  JOB_SKILLS: {
    sk: `Test pracovných zručností je prispôsobený tvojmu CV a pracovným skúsenostiam.

Na základe tvojej pracovnej histórie ti automaticky priradíme správnu kategóriu testu:
• Všeobecné pracovné zručnosti
• Administratíva a kancelária
• IT pozície
• Remeslá a technické profesie

Úroveň testu (Screen/Standard/Expert) závisí od tvojich rokov praxe.`,
    en: `The job skills test is tailored to your CV and work experience.

Based on your work history, we automatically assign you the right test category:
• General job skills
• Administration and office
• IT positions
• Trades and technical professions

The test level (Screen/Standard/Expert) depends on your years of experience.`,
    de: `Der Arbeitskompetenzentest ist auf Ihren Lebenslauf und Ihre Berufserfahrung zugeschnitten.

Basierend auf Ihrer Arbeitshistorie ordnen wir Ihnen automatisch die richtige Testkategorie zu:
• Allgemeine Arbeitsfähigkeiten
• Verwaltung und Büro
• IT-Positionen
• Handwerk und technische Berufe

Die Teststufe (Screen/Standard/Expert) hängt von Ihren Erfahrungsjahren ab.`,
  },

  DIGITAL_SKILLS: {
    sk: `Test digitálnych zručností overuje tvoje základné znalosti práce s digitálnymi technológiami.`,
    en: `The digital skills test verifies your basic knowledge of working with digital technologies.`,
    de: `Der Test für digitale Kompetenzen überprüft Ihre Grundkenntnisse im Umgang mit digitalen Technologien.`,
  },

  SJT_BASIC: {
    sk: `Situačný test hodnotí tvoje rozhodovanie v bežných pracovných situáciách.`,
    en: `The situational judgment test evaluates your decision-making in common work situations.`,
    de: `Der Situationsbeurteilungstest bewertet Ihre Entscheidungsfindung in typischen Arbeitssituationen.`,
  },

  SJT_COGNITIVE: {
    sk: `Kognitívny situačný test hodnotí tvoje analytické myslenie a riešenie komplexných problémov.`,
    en: `The cognitive situational test evaluates your analytical thinking and complex problem solving.`,
    de: `Der kognitive Situationstest bewertet Ihr analytisches Denken und komplexes Problemlösen.`,
  },

  LOGICAL_NUMERICAL: {
    sk: `Test logicko-numerického myslenia overuje tvoje schopnosti pracovať s číslami a logikou.`,
    en: `The logical-numerical test verifies your ability to work with numbers and logic.`,
    de: `Der logisch-numerische Test überprüft Ihre Fähigkeit, mit Zahlen und Logik zu arbeiten.`,
  },

  SAFETY_BOZP: {
    sk: `Test BOZP overuje tvoje znalosti bezpečnosti a ochrany zdravia pri práci.`,
    en: `The OHS test verifies your knowledge of occupational health and safety.`,
    de: `Der Arbeitssicherheitstest überprüft Ihre Kenntnisse zu Gesundheit und Sicherheit am Arbeitsplatz.`,
  },

  WORK_SAMPLE: {
    sk: `Work sample test simuluje reálne pracovné úlohy a hodnotí tvoje praktické zručnosti.`,
    en: `The work sample test simulates real work tasks and evaluates your practical skills.`,
    de: `Der Arbeitsprobe-Test simuliert reale Arbeitsaufgaben und bewertet Ihre praktischen Fähigkeiten.`,
  },

  RET_ENGAGEMENT: {
    sk: `Angažovanosť v práci znamená, ako veľmi si zapojený do práce, či v nej nachádzaš zmysel, energiu a chuť rásť.
Odpovedaj podľa svojho bežného dňa – nie ideálu.`,
    en: `Work engagement means how involved you are in your work, whether you find meaning, energy and desire to grow in it.
Answer based on your typical day – not the ideal.`,
    de: `Arbeitsengagement bedeutet, wie sehr Sie in Ihre Arbeit eingebunden sind, ob Sie darin Sinn, Energie und Wachstumswillen finden.
Antworten Sie basierend auf Ihrem typischen Tag – nicht dem Ideal.`,
  },

  RET_MOTIVATORS: {
    sk: `Motivátory ukazujú, čo ťa najviac poháňa v práci – či je to uznanie, rozvoj, vzťahy alebo iné faktory.`,
    en: `Motivators show what drives you most at work – whether it's recognition, development, relationships or other factors.`,
    de: `Motivatoren zeigen, was Sie bei der Arbeit am meisten antreibt – sei es Anerkennung, Entwicklung, Beziehungen oder andere Faktoren.`,
  },

  RET_RISK: {
    sk: `Retenčné riziko ukazuje, ako veľmi je pravdepodobné, že budeš chcieť v najbližšom období firmu opustiť.
Nejde o sľub ani hrozbu – je to signál, ako veľmi ti aktuálne dáva zmysel to, kde a ako pracuješ.`,
    en: `Retention risk shows how likely you are to want to leave the company in the near future.
It's not a promise or threat – it's a signal of how much your current workplace makes sense to you.`,
    de: `Das Bindungsrisiko zeigt, wie wahrscheinlich es ist, dass Sie das Unternehmen in naher Zukunft verlassen möchten.
Es ist weder ein Versprechen noch eine Drohung – es ist ein Signal dafür, wie viel Sinn Ihr aktueller Arbeitsplatz für Sie macht.`,
  },

  RET_STRESS_BURNOUT: {
    sk: `Test stresu a vyhorenia hodnotí úroveň pracovného stresu a riziko syndrómu vyhorenia.`,
    en: `The stress and burnout test evaluates your level of work stress and risk of burnout syndrome.`,
    de: `Der Stress- und Burnout-Test bewertet Ihr Arbeitsstressniveau und das Risiko eines Burnout-Syndroms.`,
  },

  RET_CAREER_GROWTH: {
    sk: `Test kariérneho rastu hodnotí tvoje možnosti a ambície pre profesionálny rozvoj.`,
    en: `The career growth test evaluates your opportunities and ambitions for professional development.`,
    de: `Der Karrierewachstumstest bewertet Ihre Möglichkeiten und Ambitionen für die berufliche Entwicklung.`,
  },

  RET_MANAGER_RELATIONSHIP: {
    sk: `Test vzťahu s manažérom hodnotí kvalitu komunikácie a spolupráce s tvojím nadriadeným.`,
    en: `The manager relationship test evaluates the quality of communication and cooperation with your supervisor.`,
    de: `Der Vorgesetztenbeziehungstest bewertet die Qualität der Kommunikation und Zusammenarbeit mit Ihrem Vorgesetzten.`,
  },

  RET_COMMUNICATION_CLIMATE: {
    sk: `Test komunikačnej klímy hodnotí kvalitu komunikácie vo vašom tíme a organizácii.`,
    en: `The communication climate test evaluates the quality of communication in your team and organization.`,
    de: `Der Kommunikationsklimatest bewertet die Qualität der Kommunikation in Ihrem Team und Ihrer Organisation.`,
  },

  RET_WORK_ENVIRONMENT: {
    sk: `Test pracovného prostredia hodnotí tvoju spokojnosť s fyzickým a sociálnym pracovným prostredím.`,
    en: `The work environment test evaluates your satisfaction with the physical and social work environment.`,
    de: `Der Arbeitsumgebungstest bewertet Ihre Zufriedenheit mit der physischen und sozialen Arbeitsumgebung.`,
  },

  PLANNING: {
    sk: `Test plánovania a organizácie práce overuje tvoje schopnosti efektívne riadiť čas a priority.

Otázky sú zamerané na:
• Organizáciu pracovných úloh
• Stanovovanie priorít
• Time management
• Riešenie konfliktných termínov`,
    en: `The planning and work organization test verifies your ability to effectively manage time and priorities.

Questions focus on:
• Organizing work tasks
• Setting priorities
• Time management
• Resolving scheduling conflicts`,
    de: `Der Planungs- und Arbeitsorganisationstest überprüft Ihre Fähigkeit, Zeit und Prioritäten effektiv zu verwalten.

Fragen konzentrieren sich auf:
• Organisation von Arbeitsaufgaben
• Setzen von Prioritäten
• Zeitmanagement
• Lösung von Terminkonflikten`,
  },

  ATTENTION_DETAIL: {
    sk: `Test pozornosti k detailom overuje tvoju schopnosť všímať si drobnosti a pracovať presne.`,
    en: `The attention to detail test verifies your ability to notice small details and work accurately.`,
    de: `Der Aufmerksamkeitstest überprüft Ihre Fähigkeit, kleine Details zu bemerken und genau zu arbeiten.`,
  },

  VERBAL_SKILLS: {
    sk: `Test verbálnych schopností overuje tvoje jazykové a komunikačné zručnosti.`,
    en: `The verbal skills test verifies your language and communication abilities.`,
    de: `Der Test der verbalen Fähigkeiten überprüft Ihre Sprach- und Kommunikationsfähigkeiten.`,
  },

  DATA_ENTRY: {
    sk: `Test zadávania dát overuje tvoju presnosť a rýchlosť pri práci s údajmi.`,
    en: `The data entry test verifies your accuracy and speed when working with data.`,
    de: `Der Dateneingabetest überprüft Ihre Genauigkeit und Geschwindigkeit bei der Arbeit mit Daten.`,
  },
}

const DEFAULT_PROCTORING_TEXTS: Record<string, string> = {
  sk: `Pred začatím testu si prečítaj nasledujúce pravidlá:

• Test vypĺňaj samostatne bez pomoci iných osôb
• Nepoužívaj internet, knihy ani iné pomocné materiály
• Odpovedaj podľa svojho najlepšieho vedomia
• Každú otázku si pozorne prečítaj pred odpoveďou
• Po odoslaní testu už nie je možné odpovede meniť

Tvoje odpovede sú dôverné a slúžia na objektívne posúdenie tvojich zručností.`,
  en: `Please read the following rules before starting the test:

• Complete the test independently without help from others
• Do not use the internet, books or other auxiliary materials
• Answer to the best of your knowledge
• Read each question carefully before answering
• Once submitted, answers cannot be changed

Your answers are confidential and serve for objective assessment of your skills.`,
  de: `Bitte lesen Sie die folgenden Regeln vor Beginn des Tests:

• Führen Sie den Test selbstständig ohne Hilfe anderer durch
• Verwenden Sie kein Internet, Bücher oder andere Hilfsmaterialien
• Antworten Sie nach bestem Wissen
• Lesen Sie jede Frage sorgfältig vor der Beantwortung
• Nach dem Absenden können Antworten nicht mehr geändert werden

Ihre Antworten sind vertraulich und dienen der objektiven Bewertung Ihrer Fähigkeiten.`,
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const testCode = searchParams.get("testCode")
    const lang = searchParams.get("lang") || "sk"
    const validLang = ["sk", "en", "de"].includes(lang) ? lang : "sk"

    if (!testCode) {
      return NextResponse.json({ success: false, error: "Test code required" }, { status: 400 })
    }

    const supabase = await createClient()

    const testIdMap: Record<string, string> = {
      "test-digi": "DIGITAL_SKILLS",
      "test-job-skills": "JOB_SKILLS",
      "test-lang": "LANGUAGE",
      "test-sjt": "SJT_BASIC",
      "test-it-user": "IT_SKILLS",
      "test-it": "IT_SKILLS",
      "test-lognum": "LOGICAL_NUMERICAL",
      "test-verbal": "VERBAL_SKILLS",
      "test-detail": "ATTENTION_DETAIL",
      "test-plan": "PLANNING",
      "test-dataentry": "DATA_ENTRY",
      "test-co-sjt": "SJT_COGNITIVE",
      "test-sjt-advanced": "SJT_COGNITIVE",
      "test-ohs": "SAFETY_BOZP",
      "test-worksample": "WORK_SAMPLE",
      "ret-engagement": "RET_ENGAGEMENT",
      "ret-motivators": "RET_MOTIVATORS",
      "ret-risk": "RET_RISK",
      "ret-stress": "RET_STRESS_BURNOUT",
      "ret-career": "RET_CAREER_GROWTH",
      "ret-manager": "RET_MANAGER_RELATIONSHIP",
      "ret-communication": "RET_COMMUNICATION_CLIMATE",
      "ret-environment": "RET_WORK_ENVIRONMENT",
    }

    const assessmentTestId = testIdMap[testCode]

    if (!assessmentTestId) {
      return NextResponse.json(
        {
          success: false,
          error: `Unknown test code: ${testCode}`,
        },
        { status: 400 },
      )
    }

    const { data: infoData } = await supabase
      .from("assessment_templates")
      .select("content")
      .eq("test_id", assessmentTestId)
      .eq("template_type", "INFO")
      .eq("language", validLang)
      .maybeSingle()

    let infoContent = infoData?.content || ""
    if (!infoContent && FALLBACK_INFO_TEXTS[assessmentTestId]) {
      infoContent =
        FALLBACK_INFO_TEXTS[assessmentTestId][validLang] || FALLBACK_INFO_TEXTS[assessmentTestId]["sk"] || ""
    }

    const { data: proctoringData } = await supabase
      .from("assessment_templates")
      .select("content")
      .is("test_id", null)
      .eq("template_type", "PROKTORING")
      .eq("language", validLang)
      .maybeSingle()

    const proctoringContent =
      proctoringData?.content || DEFAULT_PROCTORING_TEXTS[validLang] || DEFAULT_PROCTORING_TEXTS["sk"]

    return NextResponse.json({
      success: true,
      infoContent,
      proctoringContent,
    })
  } catch (error) {
    console.error("Error loading test modals:", error)
    return NextResponse.json({ success: false, error: "Failed to load modals" }, { status: 500 })
  }
}
