import AnonymnyProfilClient from "./AnonymnyProfilClient"
import { SITE_URL } from "@/lib/constants"

export const metadata = {
  title: "Anonymný profil kandidáta – GDPR, kontrola údajov a testy zručností | Somviac",
  description:
    "Somviac nie je pracovná agentúra ani job board. Kandidát môže mať anonymný profil, overiť zručnosti testami a zdieľať kontakt až po dohode. Firmy vidia anonymné profily a výsledky testov.",
  alternates: { canonical: `${SITE_URL}/anonymny-profil` },
  openGraph: {
    title: "Anonymný profil: kontrola údajov, GDPR a overenie zručností",
    description:
      "Profil môže byť anonymný až do dohody. Firmy vidia anonymné profily a výsledky testov. Somviac nie je agentúra.",
    url: `${SITE_URL}/anonymny-profil`,
    type: "website",
  },
}

export default function AnonymnyProfilPage() {
  return <AnonymnyProfilClient />
}
