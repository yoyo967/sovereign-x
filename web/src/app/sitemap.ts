import { MetadataRoute } from "next";
import { MODULES } from "@/lib/content/modules";
import { articles } from "@/lib/content/articles";

const BASE_URL = "https://sovereign.de";
const locales = ["de", "en"];

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
    // ── APEX — Landing (1.0) ──────────────────────────────
    entries.push(makeUrl("", locale, 1.0, "weekly"));

    // ── PILLAR — Module Registry + 8 Module Pages ─────────
    entries.push(makeUrl("/module", locale, 0.95, "weekly"));
    for (const mod of MODULES) {
      entries.push(makeUrl(`/module/${mod.slug}`, locale, 0.9, "monthly"));
    }

    // ── CLUSTER — Blog Index + Articles ───────────────────
    entries.push(makeUrl("/blog", locale, 0.9, "weekly"));
    for (const article of articles) {
      entries.push(makeUrl(`/blog/${article.slug}`, locale, 0.8, "monthly"));
    }

    // ── Content Pages ──────────────────────────────────────
    entries.push(makeUrl("/manifesto",      locale, 0.85, "monthly"));
    entries.push(makeUrl("/eu-regulierung", locale, 0.85, "weekly"));
    entries.push(makeUrl("/buch",           locale, 0.8,  "monthly"));

    // ── Use Cases ─────────────────────────────────────────
    entries.push(makeUrl("/use-cases",                  locale, 0.8, "monthly"));
    entries.push(makeUrl("/use-cases/kuendigung",       locale, 0.8, "monthly"));
    entries.push(makeUrl("/use-cases/preiserhoehung",   locale, 0.8, "monthly"));
    entries.push(makeUrl("/use-cases/datenschutz",      locale, 0.8, "monthly"));
    entries.push(makeUrl("/use-cases/finanzen",         locale, 0.8, "monthly"));

    // ── Legacy Pillar Pages (still live) ──────────────────
    entries.push(makeUrl("/souveraenitaet", locale, 0.6, "monthly"));
    entries.push(makeUrl("/sicherheit",     locale, 0.6, "monthly"));
    entries.push(makeUrl("/architektur",    locale, 0.6, "monthly"));

    // ── Legal (low priority, noindex via meta) ────────────
    entries.push(makeUrl("/impressum",  locale, 0.2, "yearly"));
    entries.push(makeUrl("/datenschutz", locale, 0.3, "yearly"));
    entries.push(makeUrl("/agb",        locale, 0.2, "yearly"));

    // ── Press / Compare / Tech / Roadmap ─────────────────
    entries.push(makeUrl("/presse",      locale, 0.6,  "monthly"));
    entries.push(makeUrl("/vergleich",   locale, 0.75, "monthly"));
    entries.push(makeUrl("/technologie", locale, 0.7,  "monthly"));
    entries.push(makeUrl("/roadmap",     locale, 0.8,  "monthly"));
  }

  return entries;
}
