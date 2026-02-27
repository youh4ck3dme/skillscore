import RetenčnéTestyPageClient from "./client"

export const metadata = {
  title: "Retenčné testy zamestnancov – interné testovanie zručností a rozvoj | Somviac",
  description:
    "Somviac umožňuje firmám robiť retenčné a interné testy zamestnancov. Overenie zručností, porovnanie výsledkov a rozvoj tímov. Somviac nie je pracovná agentúra ani job board.",
  alternates: { canonical: `https://somviac.com/retencne-testy-zamestnancov` },
  openGraph: {
    title: "Retenčné testy zamestnancov: interné testovanie a rozvoj tímov",
    description:
      "Interné a retenčné testovanie zručností pre firmy. Dáta, porovnanie, rozvoj. Somviac nie je agentúra.",
    url: `https://somviac.com/retencne-testy-zamestnancov`,
    type: "website",
  },
}

export default function RetenčnéTestyPage() {
  return <RetenčnéTestyPageClient />
}
