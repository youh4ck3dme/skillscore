"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, CheckCircle2, HardHat, Building2, Star } from "lucide-react"

export default function Page() {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1 flex flex-col items-center justify-center">

        {/* HERO */}
        <section className="w-full max-w-7xl mx-auto px-4 py-16 sm:py-24 text-center">
          <div className="max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/30 bg-primary/5 text-primary text-sm font-medium mb-6">
              <Star className="h-3.5 w-3.5" />
              Overenie zručností pre remeslo
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black mb-6 leading-tight tracking-tight">
              Nie životopis —{" "}
              <span className="text-primary">výsledky testu</span>
            </h1>
            <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
              SkillScore overí vaše odborné zručnosti v reálnych testoch.
              Získajte certifikát, ktorý hovorí za vás — bez zbytočných rozhovorov.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/auth/register">
                <Button size="lg" className="text-base px-8">
                  Vytvoriť profil zadarmo <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="/auth/login">
                <Button size="lg" variant="outline" className="text-base px-8">
                  Prihlásiť sa
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* HOW IT WORKS */}
        <section className="w-full max-w-5xl mx-auto px-4 py-12">
          <h2 className="text-3xl font-bold text-center mb-12">Ako to funguje</h2>
          <div className="space-y-6">
            {[
              {
                num: 1,
                title: "Vyplňte profil remeselníka",
                text: "Zadáte remeslo, roky praxe, certifikáty a nástroje. Celé to trvá 3 minúty.",
              },
              {
                num: 2,
                title: "Absolvujte odborný test",
                text: "25-minútový test zameraný na bezpečnosť, teóriu a praktické znalosti vášho remesla. Otázky vytvárajú experti z praxe.",
              },
              {
                num: 3,
                title: "Získajte SkillScore kartu",
                text: "Vaše výsledky sú viditeľné overenými firmám, ktoré vás môžu oslovi. Kontakt zdieľate iba vy.",
              },
            ].map((step) => (
              <div key={step.num} className="bg-card rounded-2xl p-6 sm:p-8 border border-primary/10 flex items-start gap-5">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-lg">
                  {step.num}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-primary mb-1">{step.title}</h3>
                  <p className="text-muted-foreground text-sm sm:text-base">{step.text}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* TWO AUDIENCES */}
        <section className="w-full max-w-5xl mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            {/* Worker card */}
            <div className="bg-card rounded-2xl p-8 border border-primary/15 flex flex-col h-full">
              <div className="mb-6">
                <HardHat className="h-10 w-10 text-primary mb-3" />
                <h2 className="text-2xl font-bold text-primary mb-1">Som remeselník</h2>
                <div className="w-16 h-1 bg-primary rounded-full" />
              </div>
              <ul className="space-y-3 mb-8 flex-1">
                {[
                  "Mám osvedčenie, no firmy mi neveria na slovo",
                  "Chcem sa odlíšiť od lacnej konkurencie",
                  "Hľadám kvalitnú spoluprácu bez sprostredkovateľov",
                ].map((point) => (
                  <li key={point} className="flex items-start gap-2 text-sm">
                    <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                    <span className="text-muted-foreground">{point}</span>
                  </li>
                ))}
              </ul>
              <Link href="/auth/register">
                <Button className="w-full">
                  Vytvoriť profil <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>

            {/* Company card */}
            <div className="bg-card rounded-2xl p-8 border border-primary/15 flex flex-col h-full">
              <div className="mb-6">
                <Building2 className="h-10 w-10 text-primary mb-3" />
                <h2 className="text-2xl font-bold text-primary mb-1">Som firma</h2>
                <div className="w-16 h-1 bg-primary rounded-full" />
              </div>
              <ul className="space-y-3 mb-8 flex-1">
                {[
                  "Strácam čas pohovormi s nekvalifikovanými uchádzačmi",
                  "Chcem overiť zručnosti pred nástupom",
                  "Potrebujem spoľahlivých remeselníkov s dokladateľnou praxou",
                ].map((point) => (
                  <li key={point} className="flex items-start gap-2 text-sm">
                    <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                    <span className="text-muted-foreground">{point}</span>
                  </li>
                ))}
              </ul>
              <Link href="/auth/register">
                <Button className="w-full" variant="outline">
                  Registrovať firmu <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>

          </div>
        </section>

        {/* Quick nav */}
        <section className="w-full max-w-5xl mx-auto px-4 py-8 sm:py-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { href: "/zivotopis-a-cv", title: "Profil remeselníka", desc: "Vyplňte zručnosti, certifikáty a dostupnosť" },
              { href: "/testovanie-kandidatov", title: "Odborné testy", desc: "Testy písané odborníkmi z praxe" },
              { href: "/auth/register", title: "Registrácia firmy", desc: "Vyhľadávajte overených remeselníkov" },
            ].map((x) => (
              <Link
                key={x.href}
                href={x.href}
                className="group block bg-card/90 rounded-xl p-5 border border-primary/10 hover:border-primary/30 transition-all hover:shadow-md"
              >
                <div className="flex items-center justify-between gap-3">
                  <h3 className="text-base font-bold text-primary">{x.title}</h3>
                  <ArrowRight className="h-4 w-4 text-primary/50 group-hover:translate-x-0.5 transition-transform" />
                </div>
                <p className="text-sm text-muted-foreground mt-1">{x.desc}</p>
              </Link>
            ))}
          </div>
        </section>

        {/* Legal disclaimer */}
        <section className="w-full max-w-5xl mx-auto px-4 pb-16">
          <div className="bg-muted/30 rounded-xl p-5 border border-border/50">
            <p className="text-xs text-muted-foreground leading-relaxed text-center">
              SkillScore nie je pracovná agentúra ani job portál. Platforma slúži výhradne na overenie
              a prezentáciu odborných zručností. Kontaktné údaje sú zdieľané len so súhlasom remeselníka.
            </p>
          </div>
        </section>

      </main>
    </div>
  )
}
