"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { HelpCircle, ChevronDown, ChevronUp, Hand, Rocket, CheckCircle2, Info, Loader2 } from "lucide-react"
import { useI18n } from "@/lib/i18n/context"
import { useToast } from "@/hooks/use-toast"

interface ContactSettingsInfoProps {
  autoContactEnabled?: boolean
}

export function ContactSettingsInfo({ autoContactEnabled = false }: ContactSettingsInfoProps) {
  const { language } = useI18n()
  const { toast } = useToast()
  const [isOpen, setIsOpen] = useState(false)
  const [hasSeenBefore, setHasSeenBefore] = useState(false)
  const [currentMode, setCurrentMode] = useState<"manual" | "auto">(autoContactEnabled ? "auto" : "manual")
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)

  const translations = {
    sk: {
      section_title: "Nastavenie kontaktovania firmami",
      minimized_button_auto: "Nastavenie kontaktovania firmami - 🚀 Automatické (aktuálne)",
      minimized_button_manual: "Nastavenie kontaktovania firmami - ✋ Manuálne (aktuálne)",
      current: {
        label: "Aktuálne nastavenie:",
        mode_manual: "✋ Manuálne schvaľovanie",
        mode_auto: "🚀 Automatické kontaktovanie",
        note_manual: "Musíte schváliť každú žiadosť o kontakt",
        note_auto: "Firmy vás môžu kontaktovať okamžite",
      },
      explain: {
        title: "Ako to funguje a prečo je to užitočné?",
        subtitle:
          "Máte plnú kontrolu nad tým, kto vás môže kontaktovať. Vyberte si režim, ktorý vám vyhovuje – môžete ho kedykoľvek zmeniť.",
      },
      modes: {
        manual: {
          icon: "✋",
          title: "Manuálne schvaľovanie",
          bullets: [
            "Vyberiete si, ktoré firmy vás môžu kontaktovať",
            "Žiadny spam od nerelevantných firiem",
            "Vidíte, kto má o vás záujem ešte pred kontaktom",
            "Ideálne ak máte prácu a hľadáte selektívne",
          ],
          button: "Prepnúť na manuálne",
        },
        auto: {
          icon: "🚀",
          title: "Automatické kontaktovanie",
          bullets: [
            "Rýchlejšie príležitosti bez čakania",
            "Firmy vás môžu kontaktovať okamžite",
            "Žiadne premeškané ponuky",
            "Ideálne ak aktívne hľadáte prácu",
          ],
          button: "Prepnúť na automatické",
        },
      },
      success: "Nastavenie úspešne zmenené",
      error: "Nepodarilo sa zmeniť nastavenie",
    },
    en: {
      section_title: "Contact settings for companies",
      minimized_button_auto: "Contact settings for companies - 🚀 Automatic (current)",
      minimized_button_manual: "Contact settings for companies - ✋ Manual (current)",
      current: {
        label: "Current setting:",
        mode_manual: "✋ Manual approval",
        mode_auto: "🚀 Automatic contact",
        note_manual: "You must approve each contact request",
        note_auto: "Companies can contact you instantly",
      },
      explain: {
        title: "How it works & why it's useful",
        subtitle:
          "You have full control over who can contact you. Pick the mode that suits you — you can change it anytime.",
      },
      modes: {
        manual: {
          icon: "✋",
          title: "Manual approval",
          bullets: [
            "You choose which companies can contact you",
            "No spam from irrelevant companies",
            "See who's interested before they reach out",
            "Ideal if you're employed and searching selectively",
          ],
          button: "Switch to manual",
        },
        auto: {
          icon: "🚀",
          title: "Automatic contact",
          bullets: [
            "Faster opportunities with no waiting",
            "Companies can contact you instantly",
            "No missed offers",
            "Ideal if you're actively job searching",
          ],
          button: "Switch to automatic",
        },
      },
      success: "Settings updated successfully",
      error: "Failed to update settings",
    },
    de: {
      section_title: "Kontakt­einstellungen für Unternehmen",
      minimized_button_auto: "Kontakteinstellungen für Unternehmen - 🚀 Automatisch (aktuell)",
      minimized_button_manual: "Kontakteinstellungen für Unternehmen - ✋ Manuell (aktuell)",
      current: {
        label: "Aktuelle Einstellung:",
        mode_manual: "✋ Manuelle Freigabe",
        mode_auto: "🚀 Automatischer Kontakt",
        note_manual: "Sie müssen jede Kontaktanfrage freigeben",
        note_auto: "Unternehmen können Sie sofort kontaktieren",
      },
      explain: {
        title: "So funktioniert's & warum es hilft",
        subtitle:
          "Sie haben volle Kontrolle darüber, wer Sie kontaktieren darf. Wählen Sie den passenden Modus — jederzeit änderbar.",
      },
      modes: {
        manual: {
          icon: "✋",
          title: "Manuelle Freigabe",
          bullets: [
            "Sie wählen, welche Unternehmen Sie kontaktieren dürfen",
            "Kein Spam von irrelevanten Unternehmen",
            "Sie sehen das Interesse, bevor Kontakt aufgenommen wird",
            "Ideal, wenn Sie angestellt sind und selektiv suchen",
          ],
          button: "Zum manuellen Wechseln",
        },
        auto: {
          icon: "🚀",
          title: "Automatischer Kontakt",
          bullets: [
            "Schnellere Chancen ohne Warten",
            "Unternehmen können Sie sofort kontaktieren",
            "Keine verpassten Angebote",
            "Ideal, wenn Sie aktiv auf Jobsuche sind",
          ],
          button: "Zum automatischen Wechseln",
        },
      },
      success: "Einstellungen erfolgreich aktualisiert",
      error: "Fehler beim Aktualisieren der Einstellungen",
    },
    cs: {
      section_title: "Nastavení kontaktování firmami",
      minimized_button_auto: "Nastavení kontaktování firmami - 🚀 Automatické (aktuální)",
      minimized_button_manual: "Nastavení kontaktování firmami - ✋ Ruční (aktuální)",
      current: {
        label: "Aktuální nastavení:",
        mode_manual: "✋ Ruční schvalování",
        mode_auto: "🚀 Automatické kontaktování",
        note_manual: "Musíte schválit každou žádost o kontakt",
        note_auto: "Firmy vás mohou kontaktovat okamžitě",
      },
      explain: {
        title: "Jak to funguje a proč je to užitečné?",
        subtitle:
          "Máte plnou kontrolu nad tím, kdo vás může kontaktovat. Zvolte si režim, který vám vyhovuje – lze jej kdykoli změnit.",
      },
      modes: {
        manual: {
          icon: "✋",
          title: "Ruční schvalování",
          bullets: [
            "Vyberete si, které firmy vás mohou kontaktovat",
            "Žádný spam od nerelevantních firem",
            "Vidíte zájem firem ještě před kontaktem",
            "Ideální, pokud práci máte a hledáte selektivně",
          ],
          button: "Přepnout na ruční",
        },
        auto: {
          icon: "🚀",
          title: "Automatické kontaktování",
          bullets: [
            "Rychlejší příležitosti bez čekání",
            "Firmy vás mohou kontaktovat okamžitě",
            "Žádné zmeškané nabídky",
            "Ideální, pokud aktivně hledáte práci",
          ],
          button: "Přepnout na automatické",
        },
      },
      success: "Nastavení úspěšně změněno",
      error: "Nepodarilo se změnit nastavení",
    },
    pl: {
      section_title: "Ustawienia kontaktu ze strony firm",
      minimized_button_auto: "Ustawienia kontaktu firm - 🚀 Automatyczne (bieżące)",
      minimized_button_manual: "Ustawienia kontaktu firm - ✋ Ręczne (bieżące)",
      current: {
        label: "Bieżące ustawienie:",
        mode_manual: "✋ Ręczna akceptacja",
        mode_auto: "🚀 Automatyczny kontakt",
        note_manual: "Musisz zatwierdzać każde zgłoszenie kontaktowe",
        note_auto: "Firmy mogą kontaktować się od razu",
      },
      explain: {
        title: "Jak to działa i dlaczego to przydatne?",
        subtitle:
          "Masz pełną kontrolę nad tym, kto może się z Tobą kontaktować. Wybierz tryb, który Ci odpowiada — możesz go zmienić w każdej chwili.",
      },
      modes: {
        manual: {
          icon: "✋",
          title: "Ręczna akceptacja",
          bullets: [
            "Wybierasz, które firmy mogą się z Tobą kontaktować",
            "Brak spamu od nieistotnych firm",
            "Widzisz zainteresowanie zanim firma napisze",
            "Idealne, gdy pracujesz i szukasz selektywnie",
          ],
          button: "Przełącz na ręczne",
        },
        auto: {
          icon: "🚀",
          title: "Automatyczny kontakt",
          bullets: [
            "Szybsze okazje bez czekania",
            "Firmy mogą kontaktować się od razu",
            "Brak przegapionych ofert",
            "Idealne, gdy aktywnie szukasz pracy",
          ],
          button: "Przełącz na automatyczne",
        },
      },
      success: "Ustawienia zaktualizowane pomyślnie",
      error: "Nie udało się zaktualizować ustawień",
    },
    hu: {
      section_title: "Kapcsolatbeállítások cégek felé",
      minimized_button_auto: "Kapcsolatbeállítások cégek felé - 🚀 Automatikus (jelenlegi)",
      minimized_button_manual: "Kapcsolatbeállítások cégek felé - ✋ Kézi (jelenlegi)",
      current: {
        label: "Jelenlegi beállítás:",
        mode_manual: "✋ Kézi jóváhagyás",
        mode_auto: "🚀 Automatikus megkeresés",
        note_manual: "Minden kapcsolatkérést jóvá kell hagynod",
        note_auto: "A cégek azonnal felvehetik a kapcsolatot",
      },
      explain: {
        title: "Hogyan működik és miért hasznos?",
        subtitle:
          "Teljes kontrollod van afelett, ki léphet veled kapcsolatba. Válaszd a neked megfelelő módot — bármikor módosítható.",
      },
      modes: {
        manual: {
          icon: "✋",
          title: "Kézi jóváhagyás",
          bullets: [
            "Te döntöd el, mely cégek kereshetnek",
            "Nincs spam irreleváns cégektől",
            "Látod az érdeklődést még a megkeresés előtt",
            "Ideális, ha dolgozol és szelektíven keresel",
          ],
          button: "Kézi módra váltás",
        },
        auto: {
          icon: "🚀",
          title: "Automatikus megkeresés",
          bullets: [
            "Gyorsabb lehetőségek várakozás nélkül",
            "A cégek azonnal felvehetik a kapcsolatot",
            "Nincs több elszalasztott ajánlat",
            "Ideális, ha aktívan állást keresel",
          ],
          button: "Automatikus módra váltás",
        },
      },
      success: "Beállítások sikeresen frissítve",
      error: "Nem sikerült frissíteni a beállításokat",
    },
    it: {
      section_title: "Impostazioni di contatto per le aziende",
      minimized_button_auto: "Impostazioni di contatto aziende - 🚀 Automatico (attuale)",
      minimized_button_manual: "Impostazioni di contatto aziende - ✋ Manuale (attuale)",
      current: {
        label: "Impostazione attuale:",
        mode_manual: "✋ Approvazione manuale",
        mode_auto: "🚀 Contatto automatico",
        note_manual: "Devi approvare ogni richiesta di contatto",
        note_auto: "Le aziende possono contattarti subito",
      },
      explain: {
        title: "Come funziona e perché è utile",
        subtitle:
          "Hai il pieno controllo su chi può contattarti. Scegli la modalità che preferisci — modificabile in qualsiasi momento.",
      },
      modes: {
        manual: {
          icon: "✋",
          title: "Approvazione manuale",
          bullets: [
            "Decidi quali aziende possono contattarti",
            "Niente spam da aziende irrilevanti",
            "Vedi chi è interessato prima del contatto",
            "Ideale se lavori e cerchi in modo selettivo",
          ],
          button: "Passa alla modalità manuale",
        },
        auto: {
          icon: "🚀",
          title: "Contatto automatico",
          bullets: [
            "Opportunità più rapide senza attese",
            "Le aziende possono contattarti subito",
            "Nessuna offerta persa",
            "Ideale se stai cercando lavoro attivamente",
          ],
          button: "Passa alla modalità automatica",
        },
      },
      success: "Impostazioni aggiornate con successo",
      error: "Impossibile aggiornare le impostazioni",
    },
    es: {
      section_title: "Ajustes de contacto por parte de empresas",
      minimized_button_auto: "Ajustes de contacto empresas - 🚀 Automático (actual)",
      minimized_button_manual: "Ajustes de contacto empresas - ✋ Manual (actual)",
      current: {
        label: "Ajuste actual:",
        mode_manual: "✋ Aprobación manual",
        mode_auto: "🚀 Contacto automático",
        note_manual: "Debes aprobar cada solicitud de contacto",
        note_auto: "Las empresas pueden contactarte al instante",
      },
      explain: {
        title: "Cómo funciona y por qué es útil",
        subtitle:
          "Tienes control total sobre quién te puede contactar. Elige el modo que te convenga — puedes cambiarlo en cualquier momento.",
      },
      modes: {
        manual: {
          icon: "✋",
          title: "Aprobación manual",
          bullets: [
            "Tú eliges qué empresas te pueden contactar",
            "Sin spam de empresas irrelevantes",
            "Ves quién está interesado antes del contacto",
            "Ideal si trabajas y buscas de forma selectiva",
          ],
          button: "Cambiar a manual",
        },
        auto: {
          icon: "🚀",
          title: "Contacto automático",
          bullets: [
            "Oportunidades más rápidas sin esperas",
            "Las empresas pueden contactarte al instante",
            "Sin ofertas perdidas",
            "Ideal si buscas empleo activamente",
          ],
          button: "Cambiar a automático",
        },
      },
      success: "Ajustes actualizados correctamente",
      error: "No se pudieron actualizar los ajustes",
    },
    fr: {
      section_title: "Paramètres de contact par les entreprises",
      minimized_button_auto: "Paramètres de contact entreprises - 🚀 Automatique (actuel)",
      minimized_button_manual: "Paramètres de contact entreprises - ✋ Manuel (actuel)",
      current: {
        label: "Paramètre actuel :",
        mode_manual: "✋ Approbation manuelle",
        mode_auto: "🚀 Contact automatique",
        note_manual: "Vous devez approuver chaque demande de contact",
        note_auto: "Les entreprises peuvent vous contacter immédiatement",
      },
      explain: {
        title: "Comment ça marche et pourquoi c'est utile",
        subtitle:
          "Vous gardez le contrôle total sur qui peut vous contacter. Choisissez le mode qui vous convient — modifiable à tout moment.",
      },
      modes: {
        manual: {
          icon: "✋",
          title: "Approbation manuelle",
          bullets: [
            "Vous choisissez quelles entreprises peuvent vous contacter",
            "Pas de spam d'entreprises non pertinentes",
            "Vous voyez l'intérêt avant la prise de contact",
            "Idéal si vous travaillez et cherchez de façon sélective",
          ],
          button: "Passer en manuel",
        },
        auto: {
          icon: "🚀",
          title: "Contact automatique",
          bullets: [
            "Des opportunités plus rapides sans attente",
            "Les entreprises peuvent vous contacter immédiatement",
            "Aucune offre manquée",
            "Idéal si vous recherchez activement un emploi",
          ],
          button: "Passer en automatique",
        },
      },
      success: "Paramètres mis à jour avec succès",
      error: "Échec de la mise à jour des paramètres",
    },
    pt: {
      section_title: "Definições de contacto por parte das empresas",
      minimized_button_auto: "Definições de contacto empresas - 🚀 Automático (atual)",
      minimized_button_manual: "Definições de contacto empresas - ✋ Manual (atual)",
      current: {
        label: "Definição atual:",
        mode_manual: "✋ Aprovação manual",
        mode_auto: "🚀 Contacto automático",
        note_manual: "Tens de aprovar cada pedido de contacto",
        note_auto: "As empresas podem contactar-te de imediato",
      },
      explain: {
        title: "Como funciona e porque é útil",
        subtitle:
          "Tens controlo total sobre quem te pode contactar. Escolhe o modo que te convém — podes alterá-lo a qualquer momento.",
      },
      modes: {
        manual: {
          icon: "✋",
          title: "Aprovação manual",
          bullets: [
            "Escolhes que empresas te podem contactar",
            "Sem spam de empresas irrelevantes",
            "Vês o interesse antes do contacto",
            "Ideal se estás empregado/a e procuras de forma seletiva",
          ],
          button: "Mudar para manual",
        },
        auto: {
          icon: "🚀",
          title: "Contacto automático",
          bullets: [
            "Oportunidades mais rápidas sem espera",
            "As empresas podem contactar-te de imediato",
            "Sem ofertas perdidas",
            "Ideal se procuras trabalho ativamente",
          ],
          button: "Mudar para automático",
        },
      },
      success: "Definições atualizadas com sucesso",
      error: "Não foi possível atualizar as definições",
    },
  }

  const t = translations[language as keyof typeof translations] || translations.sk

  useEffect(() => {
    setCurrentMode(autoContactEnabled ? "auto" : "manual")

    const seen = localStorage.getItem("contact_settings_info_seen")
    if (seen === "true") {
      setHasSeenBefore(true)
      setIsOpen(false)
    } else {
      setIsOpen(true)
    }
  }, [autoContactEnabled])

  const handleToggle = (open: boolean) => {
    setIsOpen(open)
    if (!open && !hasSeenBefore) {
      localStorage.setItem("contact_settings_info_seen", "true")
      setHasSeenBefore(true)
    }
  }

  const handleModeChange = async (newMode: "manual" | "auto") => {
    if (newMode === currentMode || isSaving) return

    setIsSaving(true)
    try {
      const response = await fetch("/api/candidate/contact-settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mode: newMode }),
      })

      if (response.ok) {
        setCurrentMode(newMode)
        localStorage.setItem("contact_mode", newMode)
        toast({
          title: t.success,
          description: newMode === "auto" ? t.modes.auto.title : t.modes.manual.title,
        })
      } else {
        toast({
          title: t.error,
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: t.error,
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  if (!isOpen && hasSeenBefore) {
    return (
      <div className="mb-4">
        <Button
          onClick={() => setIsOpen(true)}
          variant="outline"
          size="sm"
          className="text-teal-700 border-teal-300 hover:bg-teal-50 dark:text-teal-300 dark:border-teal-700 dark:hover:bg-teal-950/20"
        >
          <Info className="h-4 w-4 mr-2" />
          {currentMode === "auto" ? t.minimized_button_auto : t.minimized_button_manual}
        </Button>
      </div>
    )
  }

  return (
    <Collapsible open={isOpen} onOpenChange={handleToggle} className="mb-6">
      <Card className="border-teal-200 bg-gradient-to-br from-teal-50 to-cyan-50 dark:from-teal-950/20 dark:to-cyan-950/20">
        <CollapsibleTrigger asChild>
          <CardHeader className="cursor-pointer hover:bg-teal-100/50 dark:hover:bg-teal-900/20 transition-colors rounded-t-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-teal-500 rounded-full">
                  <Info className="h-5 w-5 text-white" />
                </div>
                <div>
                  <CardTitle className="text-teal-900 dark:text-teal-100">{t.section_title}</CardTitle>
                  <CardDescription className="text-teal-700 dark:text-teal-300">
                    {t.current.label}{" "}
                    <span className="font-semibold">
                      {currentMode === "auto" ? t.current.mode_auto : t.current.mode_manual}
                    </span>
                  </CardDescription>
                </div>
              </div>
              <Button variant="ghost" size="sm" className="text-teal-700 dark:text-teal-300">
                {isOpen ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
              </Button>
            </div>
          </CardHeader>
        </CollapsibleTrigger>

        <CollapsibleContent>
          <CardContent className="pt-0 space-y-6">
            {/* Explanation */}
            <div className="bg-white/60 dark:bg-gray-900/40 rounded-lg p-4 border border-teal-200 dark:border-teal-800">
              <h3 className="font-semibold text-teal-900 dark:text-teal-100 mb-2 flex items-center gap-2">
                <HelpCircle className="h-5 w-5" />
                {t.explain.title}
              </h3>
              <p className="text-sm text-teal-800 dark:text-teal-200">{t.explain.subtitle}</p>
            </div>

            {/* Mode Selection Cards */}
            <div className="grid md:grid-cols-2 gap-4">
              {/* Manual Mode */}
              <div
                className={`rounded-lg p-4 border-2 transition-all ${
                  currentMode === "manual"
                    ? "border-teal-500 bg-teal-100/50 dark:bg-teal-900/30 shadow-lg"
                    : "border-gray-200 dark:border-gray-700 bg-white/40 dark:bg-gray-900/20"
                }`}
              >
                <div className="flex items-center gap-2 mb-3">
                  <Hand className="h-6 w-6 text-teal-600 dark:text-teal-400" />
                  <h4 className="font-semibold text-teal-900 dark:text-teal-100">{t.modes.manual.title}</h4>
                  {currentMode === "manual" && <CheckCircle2 className="h-5 w-5 text-green-600 ml-auto" />}
                </div>
                <ul className="space-y-2 text-sm text-teal-800 dark:text-teal-200 mb-4">
                  {t.modes.manual.bullets.map((bullet, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-teal-500 mt-0.5">•</span>
                      <span>{bullet}</span>
                    </li>
                  ))}
                </ul>
                {currentMode !== "manual" && (
                  <Button
                    onClick={() => handleModeChange("manual")}
                    disabled={isSaving}
                    className="w-full bg-teal-600 hover:bg-teal-700"
                    size="sm"
                  >
                    {isSaving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                    {t.modes.manual.button}
                  </Button>
                )}
              </div>

              {/* Auto Mode */}
              <div
                className={`rounded-lg p-4 border-2 transition-all ${
                  currentMode === "auto"
                    ? "border-green-500 bg-green-100/50 dark:bg-green-900/30 shadow-lg"
                    : "border-gray-200 dark:border-gray-700 bg-white/40 dark:bg-gray-900/20"
                }`}
              >
                <div className="flex items-center gap-2 mb-3">
                  <Rocket className="h-6 w-6 text-green-600 dark:text-green-400" />
                  <h4 className="font-semibold text-teal-900 dark:text-teal-100">{t.modes.auto.title}</h4>
                  {currentMode === "auto" && <CheckCircle2 className="h-5 w-5 text-green-600 ml-auto" />}
                </div>
                <ul className="space-y-2 text-sm text-teal-800 dark:text-teal-200 mb-4">
                  {t.modes.auto.bullets.map((bullet, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-green-500 mt-0.5">•</span>
                      <span>{bullet}</span>
                    </li>
                  ))}
                </ul>
                {currentMode !== "auto" && (
                  <Button
                    onClick={() => handleModeChange("auto")}
                    disabled={isSaving}
                    className="w-full bg-green-600 hover:bg-green-700"
                    size="sm"
                  >
                    {isSaving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                    {t.modes.auto.button}
                  </Button>
                )}
              </div>
            </div>

            {/* Note */}
            <div className="text-xs text-teal-700 dark:text-teal-300 bg-teal-100/50 dark:bg-teal-900/20 rounded p-3 border border-teal-200 dark:border-teal-800">
              <strong>Poznámka:</strong> {currentMode === "auto" ? t.current.note_auto : t.current.note_manual}
            </div>
          </CardContent>
        </CollapsibleContent>
      </Card>
    </Collapsible>
  )
}
