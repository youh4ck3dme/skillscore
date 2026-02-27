import ClientPage from "./client"
import { SITE_URL } from "@/lib/constants"

export const metadata = {
  title: "Kontakt na kandidátov – anonymné profily a kontakt po dohode | Somviac",
  description:
    "Somviac nie je pracovná agentúra ani job board. Firmy vidia anonymné profily a výsledky testov. Kontakt na kandidáta sa zdieľa až po dohode a podľa nastavení súkromia.",
  alternates: { canonical: `${SITE_URL}/kontakt-na-kandidatov` },
  openGraph: {
    title: "Kontakt na kandidátov: anonymné profily a kontakt po dohode",
    description:
      "Firmy získajú prístup k anonymným profilom a výsledkom testov. Kandidát zdieľa kontakt až po dohode. Somviac nie je agentúra.",
    url: `${SITE_URL}/kontakt-na-kandidatov`,
    type: "website",
  },
}

export default function Page() {
  return <ClientPage />
}
