import { ClientPage } from "./client"

const SITE_URL = "https://somviac.com"

export const metadata = {
  title: "Testovanie kandidátov – skill testy, screening a anonymné profily | Somviac",
  description:
    "Somviac nie je pracovná agentúra ani job board. Firmy si vedia otestovať kandidátov pomocou skill testov a pozrieť anonymné profily. Kandidátov priamo neponúkame – platforma slúži na overenie zručností a kontakt po dohode.",
  alternates: { canonical: `${SITE_URL}/testovanie-kandidatov` },
  openGraph: {
    title: "Testovanie kandidátov: skill testy a anonymné profily",
    description:
      "Online testovanie zručností a screening kandidátov. Anonymné profily, GDPR, kontakt po dohode. Somviac nie je agentúra.",
    url: `${SITE_URL}/testovanie-kandidatov`,
    type: "website",
  },
}

export default function Page() {
  return <ClientPage />
}
