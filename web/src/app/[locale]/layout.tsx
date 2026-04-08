import type { Metadata } from "next";
import { Inter, Space_Grotesk, Noto_Sans_Arabic, JetBrains_Mono } from "next/font/google";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { getMessages } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing, rtlLocales, type Locale } from "@/i18n/routing";
import JsonLd from "@/components/SEO/JsonLd";
import "../globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin", "cyrillic"],
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const notoSansArabic = Noto_Sans_Arabic({
  variable: "--font-noto-arabic",
  subsets: ["arabic"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const BASE_URL = "https://sovereign.de";

const titles: Record<string, string> = {
  de: "SOVEREIGN 2030 | Das autonome Life-OS für Datensouveränität",
  en: "SOVEREIGN 2030 | The Autonomous Life-OS for Data Sovereignty",
  fr: "SOVEREIGN 2030 | Le Life-OS Autonome pour la Souveraineté des Données",
  es: "SOVEREIGN 2030 | El Life-OS Autónomo para la Soberanía de Datos",
  it: "SOVEREIGN 2030 | Il Life-OS Autonomo per la Sovranità dei Dati",
  pt: "SOVEREIGN 2030 | O Life-OS Autônomo para a Soberania de Dados",
  ru: "SOVEREIGN 2030 | Автономная Life-OS для суверенитета данных",
  ar: "SOVEREIGN 2030 | نظام الحياة المستقل لسيادة البيانات",
  zh: "SOVEREIGN 2030 | 数据主权自主生活操作系统",
  ja: "SOVEREIGN 2030 | データ主権のための自律Life-OS",
};

const descriptions: Record<string, string> = {
  de: "SOVEREIGN 2030 — Das autonome Life-OS für persönliche Datensouveränität. KI-gestützte Vertragsanalyse, Privacy Guardian, HITL Execution Center, vollständiger Audit-Trail. EU AI Act konform. Built in Germany.",
  en: "SOVEREIGN 2030 — The autonomous Life-OS for personal data sovereignty. AI-powered contract analysis, Privacy Guardian, HITL Execution Center, full Audit Trail. EU AI Act compliant. Built in Germany.",
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const description = descriptions[locale] ?? descriptions.en;
  const title = titles[locale] ?? titles.en;
  const url = `${BASE_URL}/${locale}`;

  // hreflang alternates for all locales
  const languages: Record<string, string> = {};
  for (const l of routing.locales) {
    languages[l] = `${BASE_URL}/${l}`;
  }
  languages["x-default"] = `${BASE_URL}/de`;

  return {
    title: {
      default: title,
      template: `%s | SOVEREIGN 2030`,
    },
    description,
    keywords: [
      "Datensouveränität", "Life-OS", "KI Vertragsanalyse", "Privacy Guardian",
      "HITL", "Audit Trail", "EU AI Act", "DSGVO", "Autonomous AI",
      "Vertragsmanagement", "Digital Twin", "Personal Data Sovereignty",
      "Boundary-First Design", "Sovereign 2030",
    ],
    authors: [{ name: "SOVEREIGN 2030 GmbH", url: BASE_URL }],
    creator: "SOVEREIGN 2030 GmbH",
    publisher: "SOVEREIGN 2030 GmbH",
    metadataBase: new URL(BASE_URL),
    alternates: {
      canonical: url,
      languages,
    },
    openGraph: {
      type: "website",
      url,
      title,
      description,
      siteName: "SOVEREIGN 2030",
      locale: locale === "de" ? "de_DE" : "en_US",
      images: [
        {
          url: `${BASE_URL}/og-image.png`,
          width: 1200,
          height: 630,
          alt: "SOVEREIGN 2030 — Das autonome Life-OS",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [`${BASE_URL}/og-image.png`],
      creator: "@sovereign2030",
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    verification: {
      google: "sovereign-2030-gsv",
    },
    category: "technology",
  };
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

// Structured data: Organization + WebSite + SoftwareApplication
function buildRootJsonLd(locale: string) {
  const url = `${BASE_URL}/${locale}`;
  return [
    {
      "@context": "https://schema.org",
      "@type": "Organization",
      "@id": `${BASE_URL}/#organization`,
      name: "SOVEREIGN 2030",
      url: BASE_URL,
      logo: {
        "@type": "ImageObject",
        url: `${BASE_URL}/logo.svg`,
        width: 200,
        height: 60,
      },
      foundingDate: "2024",
      foundingLocation: {
        "@type": "Place",
        addressLocality: "Berlin",
        addressCountry: "DE",
      },
      description: "Das autonome Life-OS für persönliche Datensouveränität. KI-gestützte Vertragsanalyse, Privacy Guardian, HITL Execution Center.",
      sameAs: [
        "https://twitter.com/sovereign2030",
        "https://linkedin.com/company/sovereign2030",
        "https://github.com/sovereign2030",
      ],
    },
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "@id": `${BASE_URL}/#website`,
      url: BASE_URL,
      name: "SOVEREIGN 2030",
      description: "Das autonome Life-OS für persönliche Datensouveränität",
      publisher: { "@id": `${BASE_URL}/#organization` },
      inLanguage: locale,
      potentialAction: {
        "@type": "SearchAction",
        target: { "@type": "EntryPoint", urlTemplate: `${BASE_URL}/${locale}/blog?q={search_term_string}` },
        "query-input": "required name=search_term_string",
      },
    },
    {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      "@id": `${BASE_URL}/#app`,
      name: "SOVEREIGN 2030 — Autonomous Life-OS",
      applicationCategory: "FinanceApplication",
      operatingSystem: "Web, Android",
      url,
      description: "Das autonome Life-OS für persönliche Datensouveränität. KI-gestützte Vertragsanalyse, Privacy Guardian, HITL Execution Center, vollständiger Audit-Trail.",
      publisher: { "@id": `${BASE_URL}/#organization` },
      offers: [
        {
          "@type": "Offer",
          name: "FREE",
          price: "0",
          priceCurrency: "EUR",
          description: "Kostenlos starten mit grundlegenden Vertrags- und Finanzfunktionen",
        },
        {
          "@type": "Offer",
          name: "PRO",
          price: "6.99",
          priceCurrency: "EUR",
          priceSpecification: {
            "@type": "UnitPriceSpecification",
            price: 6.99,
            priceCurrency: "EUR",
            unitCode: "MON",
          },
          description: "Vollständige Vertragsautomatisierung, Finance Guardian, Brainstormer AI",
        },
        {
          "@type": "Offer",
          name: "SHIELD",
          price: "14.99",
          priceCurrency: "EUR",
          priceSpecification: {
            "@type": "UnitPriceSpecification",
            price: 14.99,
            priceCurrency: "EUR",
            unitCode: "MON",
          },
          description: "Maximaler autonomer Schutz für Familie & Business",
        },
      ],
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: "4.8",
        reviewCount: "247",
        bestRating: "5",
      },
      featureList: [
        "KI-gestützte Vertragsanalyse",
        "Privacy Guardian & Consent Layer",
        "Human-in-the-Loop Execution Center",
        "100% Audit Trail",
        "PSD2-Banking-Integration",
        "EU AI Act konform",
        "DSGVO-konform",
        "Vollständige Datensouveränität",
      ],
    },
  ];
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  const messages = await getMessages();
  const isRTL = rtlLocales.includes(locale as Locale);

  return (
    <html
      lang={locale}
      dir={isRTL ? "rtl" : "ltr"}
      suppressHydrationWarning
    >
      <head>
        <JsonLd data={buildRootJsonLd(locale)} />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <meta name="theme-color" content="#080E1A" />
        <meta name="color-scheme" content="dark" />
      </head>
      <body
        className={`${inter.variable} ${spaceGrotesk.variable} ${notoSansArabic.variable} ${jetbrainsMono.variable} antialiased selection:bg-cyan selection:text-black`}
      >
        <NextIntlClientProvider locale={locale} messages={messages}>
          <a href="#main-content" className="skip-link">
            Zum Hauptinhalt springen
          </a>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
