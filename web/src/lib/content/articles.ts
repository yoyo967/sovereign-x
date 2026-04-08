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
    updatedAt: "2026-04-08",
    keywords: ["vertragsmanagement ki", "ki vertrag", "vertragsmanagement app", "digitaler vertragsassistent"],
  },
  {
    slug: "eu-ai-act-erklaert",
    title: "EU AI Act erklärt: Was du 2026 wissen musst",
    titleEn: "EU AI Act Explained: What You Need to Know in 2026",
    description: "Der EU AI Act ist das weltweit erste KI-Gesetz. Was bedeutet das für dich als Verbraucher, für Unternehmen und für KI-Anwendungen die du täglich nutzt?",
    descriptionEn: "The EU AI Act is the world's first AI law. What does it mean for you as a consumer, for businesses, and for AI applications you use daily?",
    tag: "EU AI ACT",
    mins: 13,
    publishedAt: "2026-04-01",
    updatedAt: "2026-04-08",
    keywords: ["eu ai act", "eu ki gesetz", "eu ai act erklärung", "ki regulierung", "eu ai act 2026"],
    pillar: "sicherheit",
  },
  {
    slug: "dsgvo-auskunft-antrag",
    title: "DSGVO-Auskunft: So forderst du deine Daten zurück",
    titleEn: "GDPR Data Request: How to Get Your Data Back",
    description: "Art. 15 DSGVO gibt dir das Recht auf vollständige Auskunft über gespeicherte Daten. Musterbrief, Fristen, was Unternehmen liefern müssen — und wie SOVEREIGN es automatisiert.",
    descriptionEn: "Art. 15 GDPR gives you the right to full information about stored data. Template letter, deadlines, what companies must provide — and how SOVEREIGN automates it.",
    tag: "DATENSCHUTZ",
    mins: 9,
    publishedAt: "2026-04-05",
    updatedAt: "2026-04-08",
    keywords: ["dsgvo auskunft", "dsgvo anfrage", "art 15 dsgvo", "datenschutz anfrage", "daten herausgabe"],
    pillar: "privacy-guardian",
  },
  {
    slug: "digitale-souveraenitaet-2030",
    title: "Digitale Souveränität 2030: Warum es jetzt entscheidet",
    titleEn: "Digital Sovereignty 2030: Why It Matters Now",
    description: "Was digitale Souveränität bedeutet, warum sie 2026 zum entscheidenden Thema wird, und wie du als Einzelperson die Kontrolle über dein digitales Leben zurückgewinnst.",
    descriptionEn: "What digital sovereignty means, why it becomes the defining topic in 2026, and how you as an individual can regain control of your digital life.",
    tag: "DATENSOUVERÄNITÄT",
    mins: 11,
    publishedAt: "2026-04-08",
    updatedAt: "2026-04-08",
    keywords: ["digitale souveränität", "datensouveränität", "digitale selbstbestimmung", "sovereign 2030"],
    pillar: "sovereign-twin",
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
