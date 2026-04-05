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
    title: "Sovereign Twin | Der autonome digitale Zwilling mit Gemma 4",
    description:
      "Dein persistenter digitaler Zwilling für 100% Datensouveränität. On-Device Intelligence mit Gemma 4, PSD2-Banking & Algorithmic Senate. Deine Regeln, deine Daten.",
    alternates: { canonical: `${BASE_URL}/${locale}/twin` },
    openGraph: {
      title: "Sovereign Twin | Deine Regeln. Deine Daten. Dein Zwilling.",
      description: "Erlebe den ersten autonomen digitalen Zwilling, der ausschließlich auf deinen Boundary Conditions basiert.",
      url: `${BASE_URL}/${locale}/twin`,
    },
  };
}

export default async function TwinPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": "Sovereign Twin",
    "description": "Der persistente digitale Zwilling. On-Device Intelligence mit Gemma 4.",
    "brand": { "@type": "Brand", "name": "Sovereign 2030" },
    "offers": {
      "@type": "Offer",
      "price": "6.99",
      "priceCurrency": "EUR",
      "availability": "https://schema.org/InStock"
    }
  };

  const capabilities = [
    {
      title: "Gemma 4 On-Device",
      desc: "Die Intelligenz deines Zwillings läuft direkt auf deinem Endgerät (E2B/E4B). Keine PII (personenbezogene Daten) verlassen jemals deine Kontrolle für die reine Inferenz.",
      tag: "PRIVACY FIRST",
    },
    {
      title: "AgentMemory Sync (ADR-009)",
      desc: "Local-First Synchronisation. Deine Daten werden verschlüsselt als 'Kapsel' gesichert — das Backend kann deine Daten nicht lesen.",
      tag: "DATA SOVEREIGNTY",
    },
    {
      title: "Algorithmic Senate",
      desc: "Du stimmst über jede autonome Aktion ab. Die KI bereitet vor, du gibst via SwipeToApprove die finale Exekution frei.",
      tag: "CONTROL LAYER",
    },
    {
      title: "PSD2 Finance Guardian",
      desc: "Vollständige Integration deiner Bankdaten zur proaktiven Erkennung von Preiserhöhungen und Sparpotenzialen.",
      tag: "FINANCIAL SHIELD",
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
          <span style={{ fontFamily: "var(--font-jetbrains, monospace)", fontSize: "0.6rem", color: "var(--sovereign-cyan, #00E5FF)", letterSpacing: "0.1em" }}>SOVEREIGN TWIN</span>
        </nav>

        <article className="max-w-4xl mx-auto px-6 py-20">
          {/* EU AI Act Disclaimer */}
          <div style={{ border: "1px solid rgba(0,229,255,0.2)", background: "rgba(0,229,255,0.03)", padding: "1rem 1.5rem", marginBottom: "3rem", borderRadius: "2px" }}>
            <p style={{ fontFamily: "var(--font-jetbrains, monospace)", fontSize: "0.65rem", color: "rgba(255,255,255,0.6)", lineHeight: 1.5, margin: 0 }}>
              <span style={{ color: "var(--sovereign-cyan, #00E5FF)", fontWeight: 700 }}>EU AI ACT ART. 13 DISCLOSURE:</span><br />
              Dieses System interagiert mit einem KI-Modell (Gemma 4 On-Device / Gemini 2.5 Flash · EU-Server europe-west4). 
              Ergebnisse dienen der Demonstration. Keine PII-Speicherung ohne expliziten Login.
            </p>
          </div>

          <header className="mb-20">
            <div style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "4px 12px", border: "1px solid rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.03)", fontFamily: "var(--font-jetbrains, monospace)", fontSize: "0.6rem", letterSpacing: "0.12em", color: "rgba(255,255,255,0.4)", marginBottom: "2rem", textTransform: "uppercase" }}>
              Product Pillar · Digital Twin · Gemma 4 Enabled
            </div>
            <h1 style={{ fontFamily: "var(--font-space-grotesk, sans-serif)", fontWeight: 800, fontSize: "clamp(2.5rem, 6vw, 4rem)", color: "#E0E0E0", lineHeight: 1, letterSpacing: "-0.03em", marginBottom: "1.5rem" }}>
              Der Sovereign<br />
              <span style={{ color: "var(--sovereign-cyan, #00E5FF)" }}>Twin.</span>
            </h1>
            <p style={{ fontSize: "1.2rem", lineHeight: 1.7, color: "rgba(224,224,224,0.5)", maxWidth: 600, marginBottom: "2.5rem" }}>
              Nicht nur ein Assistent. Eine autonome Instanz deiner selbst. Der Sovereign Twin agiert als dein exekutiver Stabschef — 
              immer loyal, immer präzise und vollständig unter deiner Kontrolle.
            </p>
          </header>

          <section style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2px", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.06)", marginBottom: "4rem" }}>
            {capabilities.map((cap, i) => (
              <div key={i} style={{ background: "#0A1628", padding: "2.5rem" }}>
                <div style={{ fontFamily: "var(--font-jetbrains, monospace)", fontSize: "0.55rem", color: "rgba(0,229,255,0.5)", letterSpacing: "0.15em", marginBottom: "0.75rem", textTransform: "uppercase" }}>{cap.tag}</div>
                <h3 style={{ fontFamily: "var(--font-space-grotesk, sans-serif)", fontWeight: 700, fontSize: "1.25rem", color: "#E0E0E0", marginBottom: "1rem" }}>{cap.title}</h3>
                <p style={{ fontSize: "0.9rem", lineHeight: 1.6, color: "rgba(224,224,224,0.45)" }}>{cap.desc}</p>
              </div>
            ))}
          </section>

          <section style={{ border: "1px solid rgba(255,255,255,0.06)", padding: "3rem", background: "rgba(255,255,255,0.01)" }}>
            <h2 style={{ fontFamily: "var(--font-space-grotesk, sans-serif)", fontWeight: 800, fontSize: "1.8rem", color: "#E0E0E0", marginBottom: "1.5rem" }}>Das On-Device Versprechen</h2>
            <p style={{ fontSize: "1rem", lineHeight: 1.8, color: "rgba(224,224,224,0.5)", marginBottom: "2rem" }}>
              In einer Welt, in der Daten das neue Öl sind, ist ihr Schutz die neue Freiheit. Der Sovereign Twin nutzt 
              <span style={{ color: "var(--sovereign-cyan, #00E5FF)" }}> Gemma 4</span>, um komplexe Analysen direkt dort durchzuführen, 
              wo sie hingehören: Auf deinem Gerät. Deine Verträge, Finanzströme und Boundary Conditions verlassen deine 
              Souveränität nur für verschlüsselte Backups — niemals für fremde Inferenz.
            </p>
            
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "1rem", padding: "1rem", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.04)" }}>
                <div style={{ fontFamily: "var(--font-jetbrains, monospace)", fontSize: "0.7rem", color: "var(--sovereign-cyan, #00E5FF)", minWidth: 100 }}>MODEL</div>
                <div style={{ fontFamily: "var(--font-jetbrains, monospace)", fontSize: "0.7rem", color: "rgba(255,255,255,0.7)" }}>Gemma 4 31B Dense // Vertex AI Sandbox</div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "1rem", padding: "1rem", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.04)" }}>
                <div style={{ fontFamily: "var(--font-jetbrains, monospace)", fontSize: "0.7rem", color: "var(--sovereign-cyan, #00E5FF)", minWidth: 100 }}>SYNC</div>
                <div style={{ fontFamily: "var(--font-jetbrains, monospace)", fontSize: "0.7rem", color: "rgba(255,255,255,0.7)" }}>ADR-009 Protocol // Local-First // E2E Encrypted</div>
              </div>
            </div>
          </section>

          <footer style={{ marginTop: "5rem", textAlign: "center" }}>
            <Link href="/dashboard" className="lp-btn-primary" style={{ padding: "1rem 2.5rem", fontSize: "0.9rem" }}>Souveränität Aktivieren →</Link>
            <p style={{ marginTop: "1.5rem", fontFamily: "var(--font-jetbrains, monospace)", fontSize: "0.6rem", color: "rgba(255,255,255,0.25)", letterSpacing: "0.1em" }}>
              ESTIMATED SETUP TIME: 120 SECONDS // NO PII STORAGE REQUIRED
            </p>
          </footer>
        </article>
      </div>
    </>
  );
}
