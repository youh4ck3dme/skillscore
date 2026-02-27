import ClientPage from "./client-page"

const SITE_URL = "https://somviac.com"

export const metadata = {
  title: "Overené zručnosti – testy schopností a objektívne hodnotenie | Somviac",
  description:
    "Somviac nie je pracovná agentúra ani job board. Kandidáti si overujú zručnosti testami, firmy vidia výsledky anonymne a kontaktujú kandidátov po dohode.",
  alternates: { canonical: `${SITE_URL}/overene-zrucnosti` },
  openGraph: {
    title: "Overené zručnosti: testy a objektívne hodnotenie kandidátov",
    description: "Profil doplnený o overené zručnosti a testy. Anonymita, GDPR, žiadne pracovné ponuky.",
    url: `${SITE_URL}/overene-zrucnosti`,
    type: "website",
  },
}

export default function Page() {
  return <ClientPage />
}
