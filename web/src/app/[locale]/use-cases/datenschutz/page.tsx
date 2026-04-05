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
    title: "DSGVO Durchsetzung | Art. 15 Auskunft | Sovereign 2030",
    description:
      "Nutze deinen Sovereign Twin für die automatisierte Durchsetzung deiner DSGVO-Rechte. Fordere deine Daten von Konzernen zurück.",
    alternates: { canonical: `${BASE_URL}/${locale}/use-cases/datenschutz` },
  };
}

export default async function DatenschutzPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    "name": "DSGVO Auskunft anfordern mit Sovereign 2030",
    "step": [
      { "name": "Company Search", "text": "Suche nach Unternehmen, die deine Daten speichern." },
      { "name": "Generation", "text": "Rechtssicheres Auskunftsbegehren nach Art. 15 erstellen." },
      { "name": "Mailing", "text": "Versand via Twin mit Fristenüberwachung." },
      { "name": "Audit", "text": "Speicherung der Antworten im AgentMemory." }
    ]
  };

  return (
    <div style={{ background: "#080E1A", minHeight: "100vh", color: "rgba(255,255,255,0.85)" }}>
      <JsonLd data={jsonLd} />

      <PremiumBanner
        type="gdpr"
        imagePath="/assets/nexus/privacy-guardian.png"
        tag="Use Case · Privacy · Law"
        title="DSGVO Control"
        subtitle="Datenhoheit zurückgewinnen. Dein Sovereign Twin automatisiert Auskunftsbegehren nach Art. 15 DSGVO. Keine Formulare, keine Barrieren."
      />

      <article className="max-w-4xl mx-auto px-6 py-20">
        <div className="nexus-card" style={{ padding: "1.5rem", marginBottom: "4rem", borderLeft: "3px solid var(--sovereign-cyan, #00E5FF)", background: "rgba(0,229,255,0.02)" }}>
           <p style={{ fontFamily: "var(--font-jetbrains, monospace)", fontSize: "0.65rem", color: "rgba(255,255,255,0.6)", margin: 0 }}>
             <span style={{ color: "var(--sovereign-cyan, #00E5FF)", fontWeight: 700 }}>GDPR LAYER:</span> Aktive Durchsetzung von Nutzerrechten. Automatische Fristenkontrolle (30 Tage) nach EU-DSGVO.
           </p>
        </div>

        <section style={{ marginBottom: "5rem" }}>
          <h2 style={{ fontFamily: "var(--font-space-grotesk, sans-serif)", fontWeight: 800, fontSize: "1.8rem", color: "rgba(255,255,255,0.95)", marginBottom: "2.5rem" }}>Schritte zur Hoheit</h2>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2rem" }}>
            {jsonLd.step.map((step, i) => (
              <div key={i} className="nexus-card" style={{ padding: "2rem", border: "1px solid rgba(255,255,255,0.05)" }}>
                <div style={{ fontFamily: "var(--font-jetbrains, monospace)", fontSize: "0.65rem", color: "var(--sovereign-cyan, #00E5FF)", marginBottom: "0.75rem" }}>TASK 0{i + 1}</div>
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
              <h2 style={{ fontFamily: "var(--font-space-grotesk, sans-serif)", fontWeight: 800, fontSize: "1.5rem", color: "rgba(255,255,255,0.95)", marginBottom: "0.5rem" }}>Transparenz erzwingen</h2>
              <p style={{ fontSize: "0.95rem", lineHeight: 1.7, color: "rgba(255,255,255,0.5)", margin: 0 }}>
                Konzerne erschweren oft den Zugang zu deinen Daten. Sovereign nutzt standardisierte Protokolle, um Auskünfte fälschungssicher und fristgerecht zu erhalten.
              </p>
            </div>
          </div>
        </section>

        <footer style={{ marginTop: "6rem", textAlign: "center", paddingTop: "4rem", borderTop: "1px solid rgba(255,255,255,0.05)" }}>
          <h2 style={{ fontFamily: "var(--font-space-grotesk, sans-serif)", fontWeight: 800, fontSize: "2rem", color: "rgba(255,255,255,0.9)", marginBottom: "1rem" }}>Deine Daten. Dein Recht.</h2>
          <p style={{ fontSize: "1rem", color: "rgba(255,255,255,0.45)", marginBottom: "2.5rem" }}>Überlass das Formular-Chaos deinem Twin. Fordere jetzt volle Transparenz.</p>
          <Link href="/dashboard" className="lp-btn-primary">Auskunft anfordern</Link>
        </footer>
      </article>
    </div>
  );
}
