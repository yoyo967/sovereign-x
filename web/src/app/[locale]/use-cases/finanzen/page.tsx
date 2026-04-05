import type { Metadata } from "next";
import Link from "next/link";
import JsonLd from "@/components/SEO/JsonLd";
import PremiumBanner from "@/components/landing/PremiumBanner";
import NexusIcon from "@/components/landing/NexusIcon";

const BASE_URL = "https://sovereign.de";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return {
    title: "Finanz-Optimierung | Wealth-Twin & PSD2 | Sovereign 2030",
    description:
      "Nutze deinen Sovereign Twin für die automatisierte Analyse und Optimierung deiner Finanzen. PSD2-Integration via finAPI und autonomes Sparen.",
    alternates: { canonical: `${BASE_URL}/${locale}/use-cases/finanzen` },
  };
}

export default async function FinanzenPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    "name": "Finanzen optimieren mit dem Sovereign Twin",
    "step": [
      { "name": "Secure Connect", "text": "Bankkonten sicher über PSD2 (finAPI) verbinden." },
      { "name": "Cashflow Analysis", "text": "Analyse von Einnahmen/Ausgaben durch Gemma 4." },
      { "name": "Anomaly Detection", "text": "Erkennung von Doppelbuchungen und Gebühren." },
      { "name": "Auto-Savings", "text": "Automatisierte Rücklagen-Bildung basierend auf Liquidität." }
    ]
  };

  return (
    <div style={{ background: "#080E1A", minHeight: "100vh", color: "rgba(255,255,255,0.85)" }}>
      <JsonLd data={jsonLd} />

      <PremiumBanner
        type="wealth"
        imagePath="/assets/nexus/agentmemory.png"
        tag="Use Case · Finance · PSD2"
        title="Wealth Twin"
        subtitle="Finanzen auf Autopilot. Dein Wealth-Twin scannt deine Finanzströme, um versteckte Kosten zu eliminieren und deine Liquidität proaktiv zu schützen."
      />

      <article className="max-w-4xl mx-auto px-6 py-20">
        <div className="nexus-card" style={{ padding: "1.5rem", marginBottom: "4rem", borderLeft: "3px solid var(--sovereign-cyan, #00E5FF)", background: "rgba(0,229,255,0.02)" }}>
           <p style={{ fontFamily: "var(--font-jetbrains, monospace)", fontSize: "0.65rem", color: "rgba(255,255,255,0.6)", margin: 0 }}>
             <span style={{ color: "var(--sovereign-cyan, #00E5FF)", fontWeight: 700 }}>PSD2 FINANCE LAYER:</span> Verschlüsselte Datenverarbeitung via finAPI. Analyse-Inferenz durch Gemma 4 auf isolierten EU-Servern.
           </p>
        </div>

        <section style={{ marginBottom: "5rem" }}>
          <h2 style={{ fontFamily: "var(--font-space-grotesk, sans-serif)", fontWeight: 800, fontSize: "1.8rem", color: "rgba(255,255,255,0.95)", marginBottom: "2.5rem" }}>Schritte zur Optimierung</h2>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2rem" }}>
            {jsonLd.step.map((step, i) => (
              <div key={i} className="nexus-card" style={{ padding: "2rem", border: "1px solid rgba(255,255,255,0.05)" }}>
                <div style={{ fontFamily: "var(--font-jetbrains, monospace)", fontSize: "0.65rem", color: "var(--sovereign-cyan, #00E5FF)", marginBottom: "0.75rem" }}>PHASE 0{i + 1}</div>
                <h3 style={{ fontFamily: "var(--font-space-grotesk, sans-serif)", fontWeight: 700, fontSize: "1.2rem", color: "rgba(255,255,255,0.9)", marginBottom: "0.5rem" }}>{step.name}</h3>
                <p style={{ fontSize: "0.9rem", lineHeight: 1.6, color: "rgba(255,255,255,0.45)", margin: 0 }}>{step.text}</p>
              </div>
            ))}
          </div>
        </section>

        <section style={{ border: "1px solid rgba(0,229,255,0.1)", padding: "3rem", background: "rgba(0,229,255,0.02)", marginBottom: "4rem" }}>
          <div style={{ display: "flex", gap: "2rem", alignItems: "center" }}>
            <NexusIcon type="guardian" size={40} />
            <div>
              <h2 style={{ fontFamily: "var(--font-space-grotesk, sans-serif)", fontWeight: 800, fontSize: "1.5rem", color: "rgba(255,255,255,0.95)", marginBottom: "0.5rem" }}>Sicherheit an erster Stelle</h2>
              <p style={{ fontSize: "0.95rem", lineHeight: 1.7, color: "rgba(255,255,255,0.5)", margin: 0 }}>
                Keine Drittanbieter-Werbung, keine Profilbildung, kein Verkauf deiner Daten. Nur reine Optimierung in deinem Interesse, geschützt durch den Privacy Guardian.
              </p>
            </div>
          </div>
        </section>

        <footer style={{ marginTop: "6rem", textAlign: "center", paddingTop: "4rem", borderTop: "1px solid rgba(255,255,255,0.05)" }}>
          <h2 style={{ fontFamily: "var(--font-space-grotesk, sans-serif)", fontWeight: 800, fontSize: "2rem", color: "rgba(255,255,255,0.9)", marginBottom: "1rem" }}>Deine Finanzen. Deine Hoheit.</h2>
          <p style={{ fontSize: "1rem", color: "rgba(255,255,255,0.45)", marginBottom: "2.5rem" }}>Aktiviere jetzt deinen Wealth Twin und übernimm die volle Kontrolle über deine Liquidität.</p>
          <Link href="/dashboard" className="lp-btn-primary">Wealth Twin aktivieren</Link>
        </footer>
      </article>
    </div>
  );
}
