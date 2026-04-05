import Navigation from "@/components/landing/Navigation";
import Hero from "@/components/landing/Hero";
import TrustBanner from "@/components/landing/TrustBanner";
import JourneySelectorSection from "@/components/landing/JourneySelectorSection";
import FeatureGrid from "@/components/landing/FeatureGrid";
import ArchitectureSection from "@/components/landing/ArchitectureSection";
import NexusMapSection from "@/components/landing/NexusMapSection";
import ComparisonSection from "@/components/landing/ComparisonSection";
import BookShowcaseSection from "@/components/landing/BookShowcaseSection";
import BrainstormerSection from "@/components/landing/BrainstormerSection";
import Pricing from "@/components/landing/Pricing";
import SocialProofSection from "@/components/landing/SocialProofSection";
import KnowledgeHubSection from "@/components/landing/KnowledgeHubSection";
import FAQSection from "@/components/landing/FAQSection";
import CtaSection from "@/components/landing/CtaSection";
import Footer from "@/components/landing/Footer";

// Server Component — each client component reads translations via useTranslations()
export default function LandingPage() {
  return (
    <main
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
      {/* 08 — Live Demo */}
      <BrainstormerSection />
      {/* 09 — Pricing */}
      <section id="pricing">
        <Pricing />
      </section>
      {/* 10 — Social Proof */}
      <SocialProofSection />
      {/* 11 — Knowledge Hub */}
      <KnowledgeHubSection />
      {/* 12 — FAQ */}
      <FAQSection />
      {/* 13 — The 2030 Declaration */}
      <CtaSection />
      <Footer />
    </main>
  );
}
