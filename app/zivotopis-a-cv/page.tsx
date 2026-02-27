import { Metadata } from "next"
import WorkerCVForm from "@/components/cv/WorkerCVForm"

export const metadata: Metadata = {
  title: "Vytvoriť Profil | SkillScore",
  description: "Vyplňte svoje profesijné zameranie, skúsenosti a nástroje na získanie vašej SkillScore karty.",
}

export default function ZivotopisPage() {
  return (
    <div className="min-h-screen bg-muted/30 py-12">
      <div className="container px-4">
        <div className="max-w-2xl mx-auto mb-8 text-center space-y-2">
          <h1 className="text-4xl font-extrabold tracking-tight">Váš Profil Remeselníka</h1>
          <p className="text-muted-foreground text-lg pb-4">
            Tri rýchle kroky k vášmu profesionálnemu profilu. Zameriavame sa na to,
            čo naozaj viete robiť, nie na to, ako píšete životopisy.
          </p>
        </div>

        <WorkerCVForm />

      </div>
    </div>
  )
}
