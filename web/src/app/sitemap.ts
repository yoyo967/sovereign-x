import { MetadataRoute } from "next";

const BASE_URL = "https://sovereign.de";
const locales = ["de", "en", "fr", "es", "it", "pt", "ru", "ar", "zh", "ja"];

type Frequency = "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never";

function makeUrl(path: string, locale: string, priority: number, freq: Frequency) {
  return {
    url: `${BASE_URL}/${locale}${path}`,
    lastModified: new Date(),
    changeFrequency: freq,
    priority,
  };
}

export default function sitemap(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = [];

  for (const locale of locales) {
    // Landing page — highest priority
    entries.push(makeUrl("", locale, 1.0, "weekly"));

    // Pillar pages — authority content
    entries.push(makeUrl("/souveraenitaet", locale, 0.95, "monthly"));
    entries.push(makeUrl("/architektur", locale, 0.95, "monthly"));
    entries.push(makeUrl("/sicherheit", locale, 0.9, "monthly"));
    entries.push(makeUrl("/business", locale, 0.85, "monthly"));

    // Blog index
    entries.push(makeUrl("/blog", locale, 0.9, "weekly"));

    // Cluster articles
    entries.push(makeUrl("/blog/vertrag-kuendigen", locale, 0.85, "monthly"));
    entries.push(makeUrl("/blog/preiserhoehung-widersprechen", locale, 0.85, "monthly"));
    entries.push(makeUrl("/blog/mietminderung-berechnen", locale, 0.8, "monthly"));
    entries.push(makeUrl("/blog/abofalle-was-tun", locale, 0.8, "monthly"));
    entries.push(makeUrl("/blog/flugverspaetung-entschaedigung", locale, 0.8, "monthly"));
    entries.push(makeUrl("/blog/vertragsmanagement-ki", locale, 0.8, "monthly"));

    // Legal
    entries.push(makeUrl("/impressum", locale, 0.3, "yearly"));
    entries.push(makeUrl("/datenschutz", locale, 0.5, "yearly"));
    entries.push(makeUrl("/agb", locale, 0.3, "yearly"));
    entries.push(makeUrl("/compliance", locale, 0.6, "monthly"));
  }

  return entries;
}
