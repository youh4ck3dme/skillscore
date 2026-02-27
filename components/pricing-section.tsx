"use client"

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Card } from "@/components/ui/card"
import { FileText, Calculator } from "lucide-react"
import { useT } from "@/lib/i18n/hooks"

export function PricingSection() {
  const t = useT()

  return (
    <section className="w-full py-16 bg-gradient-to-b from-background to-muted/20">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-3">{t("Transparentný cenník")}</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            {t(
              "Sme transparentní vo všetkých cenách. Pozrite si naše cenníky pre testy aj sprostredkovanie kontaktov.",
            )}
          </p>
        </div>

        <Accordion type="single" collapsible className="space-y-4">
          {/* Cenník testov */}
          <AccordionItem value="tests" className="border rounded-lg bg-card">
            <AccordionTrigger className="px-6 hover:no-underline">
              <div className="flex items-center gap-4 text-left">
                <div className="p-3 bg-teal-50 rounded-lg">
                  <FileText className="h-6 w-6 text-teal-600" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold">{t("Cenník testov")}</h3>
                  <p className="text-sm text-muted-foreground">
                    {t("Ceny za pracovné testy, jazykové testy, SJT a ďalšie hodnotenia")}
                  </p>
                </div>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-6 pb-6">
              <Card className="p-6 bg-muted/30">
                <p className="text-sm text-muted-foreground mb-4">
                  {t(
                    "Cenník testov nájdete v komplexnej zmluve o sprostredkovaní kontaktu. Kliknite na tlačidlo nižšie pre zobrazenie celého dokumentu.",
                  )}
                </p>
                <a
                  href="/cennik-testov.html"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
                >
                  <FileText className="h-4 w-4" />
                  {t("Otvoriť cenník testov")}
                </a>
              </Card>
            </AccordionContent>
          </AccordionItem>

          {/* Cenník sprostredkovania */}
          <AccordionItem value="recruitment" className="border rounded-lg bg-card">
            <AccordionTrigger className="px-6 hover:no-underline">
              <div className="flex items-center gap-4 text-left">
                <div className="p-3 bg-blue-50 rounded-lg">
                  <Calculator className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold">{t("Cenník sprostredkovania (Index systém)")}</h3>
                  <p className="text-sm text-muted-foreground">
                    {t("Interaktívny cenník podľa krajiny, povolania a typu práce")}
                  </p>
                </div>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-6 pb-6">
              <Card className="p-6 bg-muted/30">
                <p className="text-sm text-muted-foreground mb-4">
                  {t(
                    "Náš cenník sprostredkovania funguje na indexovom systéme. Cena závisí od krajiny, povolania a typu práce. Použite interaktívny nástroj na zistenie presnej ceny.",
                  )}
                </p>
                <a
                  href="/cennik-pozicie.html"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Calculator className="h-4 w-4" />
                  {t("Otvoriť interaktívny cenník")}
                </a>
              </Card>
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        <div className="text-center mt-8">
          <p className="text-sm text-muted-foreground">
            {t("Všetky ceny sú uvedené v EUR (1 coin = 1 EUR). Cenníky sú súčasťou zmlúv a VOP.")}
          </p>
        </div>
      </div>
    </section>
  )
}
