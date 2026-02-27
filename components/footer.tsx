"use client"

import Link from "next/link"

export function Footer() {
  return (
    <footer className="mt-8 w-full border-t border-border/50 bg-card/90 backdrop-blur-sm">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">

          <div className="flex flex-col gap-3">
            <Link href="/" className="flex items-center gap-1">
              <span className="text-xl font-black tracking-tight text-primary">
                Skill<span className="text-foreground">Score</span>
              </span>
            </Link>
            <p className="text-xs font-medium tracking-wide text-muted-foreground">
              Overenie zručností pre remeselníkov
            </p>
            <p className="text-xs text-muted-foreground/80">&copy; 2025 SkillScore. Všetky práva vyhradené.</p>
          </div>

          <div className="flex flex-col gap-2">
            <h3 className="mb-2 text-sm font-semibold">Právne informácie</h3>
            <Link href="/legal/terms" className="text-xs text-muted-foreground transition-colors hover:text-primary hover:underline">
              Podmienky používania
            </Link>
            <Link href="/legal/gdpr" className="text-xs text-muted-foreground transition-colors hover:text-primary hover:underline">
              Ochrana osobných údajov (GDPR)
            </Link>
          </div>

          <div className="flex flex-col gap-2">
            <h3 className="mb-2 text-sm font-semibold">Kontakt</h3>
            <p className="text-xs text-muted-foreground">
              <strong>E-mail:</strong> info@remeseltech.sk
            </p>
            <p className="text-xs text-muted-foreground">
              <strong>Tel:</strong> +421 900 123 456
            </p>
            <p className="text-xs text-muted-foreground">
              <strong>Web:</strong> www.skillscore.sk
            </p>
          </div>

        </div>

        <div className="mt-8 border-t border-border/30 pt-4 text-center">
          <p className="text-xs text-muted-foreground/60">
            SkillScore – RemeselTech s.r.o. | IČO: 12345678 | Technologická 42, 831 02 Bratislava
          </p>
        </div>
      </div>
    </footer>
  )
}
