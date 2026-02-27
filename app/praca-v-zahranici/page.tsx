import PageClient from "./client"

const SITE_URL = "https://somviac.com"

export const metadata = {
  title: "Práca v zahraničí (EÚ) – kandidátsky profil, testy zručností a kontakt s firmami | Somviac",
  description:
    "Somviac nie je pracovná agentúra ani pracovný portál. Vytvor si kandidátsky profil (aj anonymný), over si zručnosti testami a nechaj firmy, aby ťa kontaktovali.",
  alternates: { canonical: `${SITE_URL}/praca-v-zahranici` },
  openGraph: {
    title: "Práca v zahraničí: kandidátsky profil, testy zručností a kontakt s firmami",
    description:
      "Somviac nie je agentúra. Profil môže byť anonymný, zručnosti si overíš testami a firmy ťa môžu osloviť priamo.",
    url: `${SITE_URL}/praca-v-zahranici`,
    type: "website",
  },
}

export default function Page() {
  return <PageClient />
}
