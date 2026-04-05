import type { Metadata } from "next";
import Link from "next/link";
import JsonLd from "@/components/SEO/JsonLd";

const BASE_URL = "https://sovereign.de";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return {
    title: "Sovereign Marketing | Das Handbuch für die KI-Ökonomie",
    description:
      "18 Kapitel. 4 Teile. Das vollständige Handbuch für Online Marketing Manager in einer KI-definierten Welt. EU-First. Maximum Excellence Edition.",
    alternates: { canonical: `${BASE_URL}/${locale}/buch` },
    openGraph: {
      title: "SOVEREIGN MARKETING — Das Handbuch",
      description: "Lerne wie du in der KI-Ära souverän führst und skalierst.",
      url: `${BASE_URL}/${locale}/buch`,
    },
  };
}

export default async function BuchPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Book",
    "name": "Sovereign Marketing",
    "author": { "@type": "Person", "name": "SOVEREIGN 2030" },
    "numberOfPages": "320",
    "inLanguage": "de",
    "offers": [
      { "@type": "Offer", "name": "E-Book", "price": "19.90", "priceCurrency": "EUR" },
      { "@type": "Offer", "name": "Paperback", "price": "34.90", "priceCurrency": "EUR" }
    ]
  };

  const parts = [
    {
      index: "TEIL I",
      title: "Fundament & Souveränität",
      chapters: "Kap. 01–04",
      hook: "Warum das alte Marketing tot ist — und was es ersetzen wird.",
      content: ["Die Daten-Asymmetrie überwinden", "Gemma 4 & Gemini im Marketing-Stack", "EU AI Act Compliance als USP", "Agent-First Strategien"]
    },
    {
      index: "TEIL II",
      title: "Strategie-Architektur",
      chapters: "Kap. 05–08",
      hook: "Wie du eine Marketing-Architektur baust, die in 5 Jahren noch gilt.",
      content: ["Composable CDP Architekturen", "Boundary-First Design", "Der Sovereign Marketing Funnel", "Attribution ohne Privacy-Verlust"]
    },
    {
      index: "TEIL III",
      title: "Kanal-Exzellenz",
      chapters: "Kap. 09–12",
      hook: "SEO, AEO, GEO, Paid, Social — die Kanäle der Souveränität.",
      content: ["Answer Engine Optimization (AEO)", "Generative Engine Optimization (GEO)", "Sovereign Paid Ads", "Trust-as-a-Service"]
    },
    {
      index: "TEIL IV",
      title: "KI-Operationalisierung",
      chapters: "Kap. 13–15",
      hook: "Wie KI nicht dein Feind sondern dein Execution Layer wird.",
      content: ["Automation vs. Autonomie", "HITL-Workflows skalieren", "Audit-Trails für Marketing-KPIs", "Die Zukunft der Agenten-Ökonomie"]
    }
  ];

  return (
    <>
      <JsonLd data={jsonLd} />
      <div style={{ background: "#0A1628", minHeight: "100vh", backgroundImage: "linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)", backgroundSize: "42px 42px" }}>
        
        {/* Breadcrumb */}
        <nav style={{ borderBottom: "1px solid rgba(255,255,255,0.06)", padding: "1.25rem 2rem", display: "flex", gap: "0.75rem", alignItems: "center" }}>
          <Link href={`/${locale}`} style={{ fontFamily: "var(--font-jetbrains, monospace)", fontSize: "0.6rem", color: "rgba(255,255,255,0.3)", textDecoration: "none", letterSpacing: "0.1em" }}>SOVEREIGN 2030</Link>
          <span style={{ color: "rgba(255,255,255,0.1)", fontSize: "0.6rem" }}>/</span>
          <span style={{ fontFamily: "var(--font-jetbrains, monospace)", fontSize: "0.6rem", color: "var(--sovereign-cyan, #00E5FF)", letterSpacing: "0.1em" }}>DAS HANDBUCH</span>
        </nav>

        <article className="max-w-5xl mx-auto px-6 py-20">
          <header className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center mb-24">
            <div>
              <div style={{ display: "inline-block", padding: "4px 12px", border: "1px solid rgba(255,214,0,0.3)", background: "rgba(255,214,0,0.04)", fontFamily: "var(--font-jetbrains, monospace)", fontSize: "0.6rem", letterSpacing: "0.15em", color: "#FFD600", marginBottom: "1.5rem", textTransform: "uppercase" }}>
                Neuerscheinung 2026 · Maximum Excellence Edition
              </div>
              <h1 style={{ fontFamily: "var(--font-space-grotesk, sans-serif)", fontWeight: 800, fontSize: "clamp(2.5rem, 6vw, 3.5rem)", color: "#E0E0E0", lineHeight: 1.1, letterSpacing: "-0.03em", marginBottom: "1.5rem" }}>
                SOVEREIGN<br />
                <span style={{ color: "#FFD600" }}>MARKETING.</span>
              </h1>
              <p style={{ fontSize: "1.1rem", lineHeight: 1.75, color: "rgba(224,224,224,0.5)", marginBottom: "2.5rem" }}>
                Das Standardwerk für Online Marketing Manager, die in einer KI-definierten Welt souverän führen wollen. 
                18 Kapitel pure Strategie-Architektur — jenseits von Buzzwords und kurzlebigen Hacks.
              </p>
              
              <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
                <button className="lp-btn-primary" style={{ background: "#FFD600", color: "#000", border: "none" }}>E-Book (€19,90) kaufen</button>
                <button className="lp-btn-secondary" style={{ border: "1px solid rgba(255,214,0,0.4)", color: "#FFD600" }}>Paperback (€34,90)</button>
              </div>
              <p style={{ marginTop: "1rem", fontSize: "0.7rem", color: "rgba(255,255,255,0.2)", display: "flex", gap: "1rem" }}>
                <span>✅ Google Pay Ready</span>
                <span>✅ Sofort-Download (E-Book)</span>
              </p>
            </div>

            {/* Book Visual Placeholder */}
            <div style={{ aspectRatio: "4/5", background: "linear-gradient(135deg, #0F2035, #050D18)", border: "1px solid rgba(255,214,0,0.15)", position: "relative", padding: "3rem", display: "flex", flexDirection: "column", justifyContent: "space-between", boxShadow: "0 24px 48px rgba(0,0,0,0.4)" }}>
              <div style={{ border: "1px solid #FFD600", padding: "1rem", alignSelf: "flex-start" }}>
                <div style={{ fontFamily: "var(--font-jetbrains, monospace)", fontSize: "0.6rem", color: "#FFD600" }}>2030.AI</div>
              </div>
              <div>
                <div style={{ fontFamily: "var(--font-space-grotesk, sans-serif)", fontSize: "1.5rem", fontWeight: 800, color: "#FFD600", marginBottom: "0.5rem" }}>SOVEREIGN</div>
                <div style={{ fontFamily: "var(--font-space-grotesk, sans-serif)", fontSize: "1.5rem", fontWeight: 800, color: "#E0E0E0" }}>MARKETING.</div>
                <div style={{ marginTop: "1rem", width: "40px", height: "1px", background: "#FFD600" }}></div>
              </div>
              <div style={{ fontFamily: "var(--font-jetbrains, monospace)", fontSize: "0.55rem", color: "rgba(255,214,0,0.4)", letterSpacing: "0.2em", textTransform: "uppercase" }}>
                The Handbook for AI-Sovereignty
              </div>
              {/* Corner accent */}
              <div style={{ position: "absolute", bottom: 0, right: 0, width: "30%", height: "20%", background: "linear-gradient(45deg, transparent, rgba(255,214,0,0.05))" }}></div>
            </div>
          </header>

          <section style={{ borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: "5rem" }}>
            <div style={{ textAlign: "center", marginBottom: "4rem" }}>
              <h2 style={{ fontFamily: "var(--font-space-grotesk, sans-serif)", fontWeight: 800, fontSize: "2rem", color: "#E0E0E0", marginBottom: "1rem" }}>Inhaltliche Architektur</h2>
              <p style={{ color: "rgba(224,224,224,0.4)", maxWidth: 540, margin: "0 auto" }}>Das Buch ist in vier logische Cluster unterteilt, die dich von den ethischen Grundlagen bis zur Agenten-Skalierung führen.</p>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2px", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.06)" }}>
              {parts.map((part, i) => (
                <div key={i} style={{ background: "#0A1628", padding: "3rem" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "1.5rem" }}>
                    <div style={{ fontFamily: "var(--font-jetbrains, monospace)", fontSize: "0.6rem", color: "#FFD600", letterSpacing: "0.15em" }}>{part.index}</div>
                    <div style={{ fontFamily: "var(--font-jetbrains, monospace)", fontSize: "0.6rem", color: "rgba(255,255,255,0.2)" }}>{part.chapters}</div>
                  </div>
                  <h3 style={{ fontFamily: "var(--font-space-grotesk, sans-serif)", fontWeight: 700, fontSize: "1.4rem", color: "#E0E0E0", marginBottom: "0.75rem" }}>{part.title}</h3>
                  <p style={{ fontSize: "0.95rem", color: "rgba(255,214,0,0.5)", marginBottom: "1.5rem", fontStyle: "italic" }}>&quot;{part.hook}&quot;</p>
                  <ul style={{ listStyle: "none", padding: 0, display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                    {part.content.map((item, j) => (
                      <li key={j} style={{ display: "flex", gap: "0.75rem", fontSize: "0.85rem", color: "rgba(255,255,255,0.4)" }}>
                        <span style={{ color: "rgba(255,214,0,0.4)" }}>•</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>

          <footer style={{ marginTop: "6rem", border: "1px solid rgba(255,255,255,0.06)", padding: "4rem", textAlign: "center", background: "rgba(255,214,0,0.02)" }}>
            <h2 style={{ fontFamily: "var(--font-space-grotesk, sans-serif)", fontWeight: 800, fontSize: "1.8rem", color: "#E0E0E0", marginBottom: "1.5rem" }}>Souveränität beginnt mit Wissen.</h2>
            <p style={{ fontSize: "1rem", color: "rgba(224,224,224,0.5)", marginBottom: "2.5rem", maxWidth: 500, margin: "0 auto 2.5rem" }}>
              Bestelle jetzt dein Exemplar und erhalte exklusiven Zugang zum Sovereign Marketing Beta-Netzwerk.
            </p>
            <div style={{ display: "flex", gap: "1rem", justifyContent: "center" }}>
              <button className="lp-btn-primary" style={{ background: "#FFD600", color: "#000" }}>E-Book Sichern</button>
              <Link href={`/${locale}#pricing`} className="lp-btn-secondary">SHIELD Plan entdecken</Link>
            </div>
          </footer>
        </article>
      </div>
    </>
  );
}
