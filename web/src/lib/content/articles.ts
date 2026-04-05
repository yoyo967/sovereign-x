export interface Article {
  slug: string;
  title: string;
  titleEn: string;
  description: string;
  descriptionEn: string;
  tag: string;
  mins: number;
  publishedAt: string;
  updatedAt: string;
  keywords: string[];
  pillar?: string; // parent pillar slug
}

export const articles: Article[] = [
  {
    slug: "vertrag-kuendigen",
    title: "Vertrag kündigen: Der ultimative Guide 2026",
    titleEn: "Cancel Contract: The Ultimate Guide 2026",
    description: "Alles zum Thema Vertragskündigung: BGB §314, §628, Sonderkündigungsrechte, Fristen, Mustervorlagen und wie KI den Prozess automatisiert.",
    descriptionEn: "Everything about contract cancellation: BGB §314, §628, special termination rights, deadlines, templates and how AI automates the process.",
    tag: "VERTRAGSRECHT",
    mins: 12,
    publishedAt: "2026-03-01",
    updatedAt: "2026-04-04",
    keywords: ["vertrag kündigen", "kündigungsvorlage", "kündigungsfrist", "sonderkündigungsrecht", "bGB 314", "vertrag kündigen vorlage"],
    pillar: "vertrag-kuendigen",
  },
  {
    slug: "preiserhoehung-widersprechen",
    title: "Preiserhöhung widersprechen: Deine Rechte 2026",
    titleEn: "Object to Price Increase: Your Rights 2026",
    description: "So widersprichst du Preiserhöhungen bei Netflix, Strom, Telekommunikation und mehr. Mit Musterbrief, BGB-Paragrafen und automatischer SOVEREIGN-Integration.",
    descriptionEn: "How to object to price increases at Netflix, electricity, telecom and more. With template letter, BGB paragraphs and automatic SOVEREIGN integration.",
    tag: "VERBRAUCHERRECHT",
    mins: 8,
    publishedAt: "2026-03-10",
    updatedAt: "2026-04-04",
    keywords: ["preiserhöhung widersprechen", "musterbrief preiserhöhung", "netflix preiserhöhung 2026", "strom preiserhöhung"],
    pillar: "vertrag-kuendigen",
  },
  {
    slug: "abofalle-was-tun",
    title: "Abofalle: Erkennen, widersprechen, entkommen",
    titleEn: "Subscription Trap: Recognize, Challenge, Escape",
    description: "Versteckte Abonnements erkennen und beenden. Deutsche verlieren durchschnittlich €340/Jahr durch unbemerkte Abos — so stoppt SOVEREIGN das automatisch.",
    descriptionEn: "Recognize and end hidden subscriptions. Germans lose an average of €340/year through unnoticed subscriptions — how SOVEREIGN stops this automatically.",
    tag: "FINANZEN",
    mins: 7,
    publishedAt: "2026-03-15",
    updatedAt: "2026-04-04",
    keywords: ["abofalle", "abo kündigen", "versteckte kosten", "abonnements kündigen", "abofalle was tun"],
    pillar: "vertrag-kuendigen",
  },
  {
    slug: "flugverspaetung-entschaedigung",
    title: "Flugverspätung: Entschädigung nach EU-Verordnung 261/2004",
    titleEn: "Flight Delay: Compensation under EU Regulation 261/2004",
    description: "Bis zu €600 Entschädigung bei Flugverspätung. So forderst du dein Geld zurück — automatisch mit SOVEREIGN oder manuell mit unserem Guide.",
    descriptionEn: "Up to €600 compensation for flight delays. How to get your money back — automatically with SOVEREIGN or manually with our guide.",
    tag: "REISERECHT",
    mins: 9,
    publishedAt: "2026-03-20",
    updatedAt: "2026-04-04",
    keywords: ["flugverspätung entschädigung", "eu verordnung 261", "flug verspätet geld zurück"],
  },
  {
    slug: "vertragsmanagement-ki",
    title: "Vertragsmanagement mit KI: Wie Sovereign dein Leben automatisiert",
    titleEn: "Contract Management with AI: How Sovereign Automates Your Life",
    description: "KI-gestütztes Vertragsmanagement erklärt: Von der automatischen Analyse über Fristenüberwachung bis zur autonomen Kündigung — alles was du wissen musst.",
    descriptionEn: "AI-powered contract management explained: From automatic analysis to deadline monitoring to autonomous cancellation — everything you need to know.",
    tag: "TECHNOLOGIE",
    mins: 10,
    publishedAt: "2026-03-25",
    updatedAt: "2026-04-04",
    keywords: ["vertragsmanagement ki", "ki vertrag", "vertragsmanagement app", "digitaler vertragsassistent"],
  },
];

export function getArticle(slug: string): Article | undefined {
  return articles.find((a) => a.slug === slug);
}

export function getRelatedArticles(slug: string, limit = 3): Article[] {
  const current = getArticle(slug);
  if (!current) return articles.slice(0, limit);
  return articles
    .filter((a) => a.slug !== slug && (a.pillar === current.pillar || a.tag === current.tag))
    .slice(0, limit);
}
