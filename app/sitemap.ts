import type { MetadataRoute } from "next";

const SITE = "https://somviac.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  return [
    { url: `${SITE}/`, lastModified: now },
    { url: `${SITE}/praca-v-zahranici`, lastModified: now },
    { url: `${SITE}/zivotopis-a-cv`, lastModified: now },
    { url: `${SITE}/testovanie-kandidatov`, lastModified: now },
    { url: `${SITE}/pre-firmy`, lastModified: now },
    { url: `${SITE}/kontakt`, lastModified: now },
    { url: `${SITE}/info`, lastModified: now },
    { url: `${SITE}/legal/gdpr`, lastModified: now },
    { url: `${SITE}/legal/terms`, lastModified: now },
  ];
}
