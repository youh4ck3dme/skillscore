"use client"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { useT } from "@/lib/i18n/hooks"

export default function InfoPage() {
  const t = useT()

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 container mx-auto px-4 py-8 max-w-4xl">
        <div className="space-y-8">
          {/* Page Header */}
          <div className="text-center">
            <h1 className="text-4xl font-bold text-foreground mb-4">{t("O platforme SOMVIAC")}</h1>
            <p className="text-xl text-muted-foreground">{t("Všetko, čo potrebujete vedieť o našej platforme")}</p>
          </div>

          {/* Mission Section */}
          <section className="bg-card rounded-2xl p-8 border border-primary/10">
            <h2 className="text-2xl font-bold text-primary mb-4">{t("Naša misia")}</h2>
            <p className="text-muted-foreground leading-relaxed">
              {t(
                "SOMVIAC je slovenská platforma, ktorá spája talentovaných kandidátov s firmami na základe reálnych schopností, nie len slov. Veríme vo férové hodnotenie, transparentnosť a kontinuálny rast všetkých účastníkov.",
              )}
            </p>
          </section>

          {/* How It Works */}
          <section className="bg-card rounded-2xl p-8 border border-primary/10">
            <h2 className="text-2xl font-bold text-primary mb-6">{t("Ako to funguje")}</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="bg-primary/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-primary">1</span>
                </div>
                <h3 className="font-semibold mb-2">{t("Registrácia")}</h3>
                <p className="text-sm text-muted-foreground">
                  {t("Vytvorte si profil ako kandidát, firma alebo rekrúter")}
                </p>
              </div>
              <div className="text-center">
                <div className="bg-primary/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-primary">2</span>
                </div>
                <h3 className="font-semibold mb-2">{t("Testovanie")}</h3>
                <p className="text-sm text-muted-foreground">
                  {t("Kandidáti absolvujú testy schopností relevantné pre pozície")}
                </p>
              </div>
              <div className="text-center">
                <div className="bg-primary/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-primary">3</span>
                </div>
                <h3 className="font-semibold mb-2">{t("Spojenie")}</h3>
                <p className="text-sm text-muted-foreground">
                  {t("Firmy vidia výsledky a môžu kontaktovať vhodných kandidátov")}
                </p>
              </div>
            </div>
          </section>

          {/* Key Features */}
          <section className="bg-card rounded-2xl p-8 border border-primary/10">
            <h2 className="text-2xl font-bold text-primary mb-6">{t("Kľúčové vlastnosti")}</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="bg-green-100 rounded-full p-1 mt-1">
                    <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                  </div>
                  <div>
                    <h3 className="font-semibold">{t("Férové hodnotenie")}</h3>
                    <p className="text-sm text-muted-foreground">
                      {t("Rozhodujú schopnosti, nie sympatie alebo predsudky")}
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="bg-green-100 rounded-full p-1 mt-1">
                    <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                  </div>
                  <div>
                    <h3 className="font-semibold">{t("Transparentnosť")}</h3>
                    <p className="text-sm text-muted-foreground">
                      {t("Jasné pravidlá, viditeľné odmeny, žiadne skryté podmienky")}
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="bg-green-100 rounded-full p-1 mt-1">
                    <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                  </div>
                  <div>
                    <h3 className="font-semibold">{t("Kontinuálny rast")}</h3>
                    <p className="text-sm text-muted-foreground">
                      {t("10% zisku investujeme späť do vzdelávania kandidátov")}
                    </p>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="bg-green-100 rounded-full p-1 mt-1">
                    <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                  </div>
                  <div>
                    <h3 className="font-semibold">{t("Ochrana dát")}</h3>
                    <p className="text-sm text-muted-foreground">
                      {t("Kontakty sa sprístupňujú až po vzájomnej dohode")}
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="bg-green-100 rounded-full p-1 mt-1">
                    <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                  </div>
                  <div>
                    <h3 className="font-semibold">{t("Komunita")}</h3>
                    <p className="text-sm text-muted-foreground">
                      {t("Rekrúteri budujú sieť a získavajú odmeny za odporúčania")}
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="bg-green-100 rounded-full p-1 mt-1">
                    <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                  </div>
                  <div>
                    <h3 className="font-semibold">{t("Kvalita")}</h3>
                    <p className="text-sm text-muted-foreground">
                      {t("Platí sa len za testy, ktoré reálne pomáhajú rozhodnúť")}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Contact Section */}
          <section className="bg-card rounded-2xl p-8 border border-primary/10 text-center">
            <h2 className="text-2xl font-bold text-primary mb-4">{t("Kontakt")}</h2>
            <p className="text-muted-foreground mb-6">{t("Máte otázky? Radi vám pomôžeme!")}</p>
            <div className="space-y-2">
              <p className="text-sm">
                <strong>Email:</strong> info@somviac.sk
              </p>
              <p className="text-sm">
                <strong>Telefón:</strong> +421 XXX XXX XXX
              </p>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  )
}
