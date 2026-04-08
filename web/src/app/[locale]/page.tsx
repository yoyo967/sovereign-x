import JsonLd from "@/components/SEO/JsonLd";
import Navigation from "@/components/landing/Navigation";
import Hero from "@/components/landing/Hero";
import TrustBanner from "@/components/landing/TrustBanner";
import JourneySelectorSection from "@/components/landing/JourneySelectorSection";
import FeatureGrid from "@/components/landing/FeatureGrid";
import ArchitectureSection from "@/components/landing/ArchitectureSection";
import NexusMapSection from "@/components/landing/NexusMapSection";
import ComparisonSection from "@/components/landing/ComparisonSection";
import BookShowcaseSection from "@/components/landing/BookShowcaseSection";
import ManifestoTeaserSection from "@/components/landing/ManifestoTeaserSection";
import BrainstormerSection from "@/components/landing/BrainstormerSection";
import Pricing from "@/components/landing/Pricing";
import RoadmapSection from "@/components/landing/RoadmapSection";
import SocialProofSection from "@/components/landing/SocialProofSection";
import KnowledgeHubSection from "@/components/landing/KnowledgeHubSection";
import FAQSection from "@/components/landing/FAQSection";
import CtaSection from "@/components/landing/CtaSection";
import Footer from "@/components/landing/Footer";

const BASE_URL = "https://sovereign.de";

const FAQ_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Was ist SOVEREIGN 2030?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "SOVEREIGN 2030 ist ein autonomes Life-OS für persönliche Datensouveränität. Es kombiniert KI-gestützte Vertragsanalyse, Privacy Guardian, HITL Execution Center und vollständigen Audit-Trail in einer EU AI Act konformen Plattform.",
      },
    },
    {
      "@type": "Question",
      name: "Wie schützt SOVEREIGN 2030 meine Daten?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Deine Daten werden ausschließlich auf EU-Servern gespeichert (Frankfurt, Deutschland). Der Privacy Guardian blockiert jeden unautorisierten Datenzugriff. Kein Tracking, kein Datenverkauf, vollständige DSGVO-Konformität.",
      },
    },
    {
      "@type": "Question",
      name: "Ist SOVEREIGN 2030 mit dem EU AI Act konform?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Ja. SOVEREIGN 2030 wurde von Grund auf für EU AI Act Compliance gebaut. Der Security Senate überwacht alle KI-Aktionen, jede Entscheidung ist im Audit Trail dokumentiert, Human-in-the-Loop ist für alle kritischen Aktionen aktiviert.",
      },
    },
    {
      "@type": "Question",
      name: "Was kostet SOVEREIGN 2030?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "SOVEREIGN 2030 bietet drei Tarifstufen: FREE (kostenlos), PRO (19€/Monat) und APEX (49€/Monat). Alle Preise verstehen sich inklusive aller im jeweiligen Tarif enthaltenen Module ohne versteckte Gebühren.",
      },
    },
    {
      "@type": "Question",
      name: "Kann ich SOVEREIGN 2030 kündigen?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Ja, jederzeit zum Ende des aktuellen Abrechnungszeitraums — direkt im Dashboard ohne Kontaktaufnahme. Nach Kündigung erhältst du einen vollständigen Export deiner Daten.",
      },
    },
    {
      "@type": "Question",
      name: "Welche Module enthält SOVEREIGN 2030?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "SOVEREIGN 2030 umfasst 8 Module: Sovereign Twin (digitaler Zwilling), Privacy Guardian (DSGVO-Schutz), Execution Center (Vertragsautomatisierung), Audit Trail (Transparenz), Security Senate (EU AI Act), Finanzautonomie (Wealth Twin), KI & Recht (Legal Intelligence) und Datensouveränität.",
      },
    },
  ],
};

// Server Component — each child client component reads translations via useTranslations()
export default async function LandingPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: "SOVEREIGN 2030 — Autonomous Life-OS",
    url: `${BASE_URL}/${locale}`,
    description:
      "Das autonome Life-OS für persönliche Datensouveränität. KI-gestützte Vertragsanalyse, Privacy Guardian, HITL Execution Center.",
    brand: { "@type": "Brand", name: "SOVEREIGN 2030" },
    offers: [
      { "@type": "Offer", name: "FREE", price: "0", priceCurrency: "EUR", availability: "https://schema.org/InStock" },
      { "@type": "Offer", name: "PRO", price: "19", priceCurrency: "EUR", availability: "https://schema.org/InStock" },
      { "@type": "Offer", name: "APEX", price: "49", priceCurrency: "EUR", availability: "https://schema.org/InStock" },
    ],
    aggregateRating: { "@type": "AggregateRating", ratingValue: "4.8", reviewCount: "247", bestRating: "5" },
  };

  return (
    <>
      <JsonLd data={FAQ_SCHEMA} />
      <JsonLd data={productSchema} />
      <main
        id="main-content"
        className="min-h-screen scroll-smooth"
        style={{ background: "#080E1A" }}
      >
        <Navigation />
        <Hero />
        {/* 01 — Die Asymmetrie / The Problem */}
        <TrustBanner />
        {/* 02 — User Journey Archetypes */}
        <JourneySelectorSection />
        {/* 03 — APEX Architecture */}
        <section id="features">
          <FeatureGrid />
        </section>
        {/* 04 — Sovereign Twin */}
        <ArchitectureSection />
        {/* 05 — Nexus System Map */}
        <NexusMapSection />
        {/* 06 — Comparison */}
        <ComparisonSection />
        {/* 07 — The Handbook Showcase */}
        <BookShowcaseSection />
        {/* 08 — Manifesto Teaser */}
        <ManifestoTeaserSection />
        {/* 09 — Live Demo */}
        <BrainstormerSection />
        {/* 10 — Pricing */}
        <section id="pricing">
          <Pricing />
        </section>
        {/* 11 — Roadmap */}
        <RoadmapSection />
        {/* 12 — Social Proof */}
        <SocialProofSection />
        {/* 13 — Knowledge Hub */}
        <KnowledgeHubSection />
        {/* 14 — FAQ */}
        <FAQSection />
        {/* 15 — The 2030 Declaration */}
        <CtaSection />
        <Footer />
      </main>
    </>
  );
}
