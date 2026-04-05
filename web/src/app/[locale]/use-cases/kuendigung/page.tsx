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
    title: "Verträge kündigen | Autonom & Rechtssicher | Sovereign 2030",
    description:
      "Nutze deinen Sovereign Twin für die automatisierte Kündigung von Abos und Verträgen. Analyse nach BGB und fälschungssichere Audit-Logs.",
    alternates: { canonical: `${BASE_URL}/${locale}/use-cases/kuendigung` },
  };
}

export default async function KuendigungPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    "name": "Verträge automatisch kündigen mit Sovereign 2030",
    "step": [
      { "name": "Trigger", "text": "Bank-Stream Analyse via PSD2 erkennt Abos." },
      { "name": "Analyse", "text": "Gemma 4 extrahiert Fristen und Sonderrechte." },
      { "name": "Freigabe", "text": "Du genehmigst die Kündigung via HITL." },
      { "name": "Execution", "text": "Versand und Dokumentation im Audit-Trail." }
    ]
  };

  return (
    <div style={{ background: "#080E1A", minHeight: "100vh", color: "rgba(255,255,255,0.85)" }}>
      <JsonLd data={jsonLd} />

      <PremiumBanner
        type="cancellation"
        imagePath="/assets/nexus/execution-center.png"
        tag="Use Case · Autonomy · Legal Tech"
        title="Befreiung"
        subtitle="Verträge kündigen in Sekunden. Dein Sovereign Twin bricht absichtliche Komplexität auf und exekutiert deine Interessen mit juristischer Präzision."
      />

      <article className="max-w-4xl mx-auto px-6 py-20">
        <div className="nexus-card" style={{ padding: "1.5rem", marginBottom: "4rem", borderLeft: "3px solid var(--sovereign-cyan, #00E5FF)", background: "rgba(0,229,255,0.02)" }}>
           <p style={{ fontFamily: "var(--font-jetbrains, monospace)", fontSize: "0.65rem", color: "rgba(255,255,255,0.6)", margin: 0 }}>
             <span style={{ color: "var(--sovereign-cyan, #00E5FF)", fontWeight: 700 }}>LEGAL LAYER ACTIVE:</span> BGB §312k Konformität (2026). Alle Handlungen werden durch das Execution Center abgesichert.
           </p>
        </div>

        <section style={{ marginBottom: "5rem" }}>
          <h2 style={{ fontFamily: "var(--font-space-grotesk, sans-serif)", fontWeight: 800, fontSize: "1.8rem", color: "rgba(255,255,255,0.95)", marginBottom: "2.5rem" }}>Der Autonome Prozess</h2>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2rem" }}>
            {jsonLd.step.map((step, i) => (
              <div key={i} className="nexus-card" style={{ padding: "2rem", border: "1px solid rgba(255,255,255,0.05)" }}>
                <div style={{ fontFamily: "var(--font-jetbrains, monospace)", fontSize: "0.65rem", color: "var(--sovereign-cyan, #00E5FF)", marginBottom: "0.75rem" }}>STEP 0{i + 1}</div>
                <h3 style={{ fontFamily: "var(--font-space-grotesk, sans-serif)", fontWeight: 700, fontSize: "1.2rem", color: "rgba(255,255,255,0.9)", marginBottom: "0.5rem" }}>{step.name}</h3>
                <p style={{ fontSize: "0.9rem", lineHeight: 1.6, color: "rgba(255,255,255,0.45)", margin: 0 }}>{step.text}</p>
              </div>
            ))}
          </div>
        </section>

        <section style={{ border: "1px solid rgba(0,229,255,0.1)", padding: "3rem", background: "rgba(0,229,255,0.02)", marginBottom: "4rem" }}>
          <div style={{ display: "flex", gap: "2rem", alignItems: "center" }}>
            <NexusIcon type="audit" size={40} />
            <div>
              <h2 style={{ fontFamily: "var(--font-space-grotesk, sans-serif)", fontWeight: 800, fontSize: "1.5rem", color: "rgba(255,255,255,0.95)", marginBottom: "0.5rem" }}>Fälschungssichere Dokumentation</h2>
              <p style={{ fontSize: "0.95rem", lineHeight: 1.7, color: "rgba(255,255,255,0.5)", margin: 0 }}>
                Dank des Audit Trails ist jede Kündigung rechtssicher dokumentiert. Wir nutzen RFC 3161 Zeitstempel, die vor jedem EU-Gericht als Beweismittel zulässig sind.
              </p>
            </div>
          </div>
        </section>

        <footer style={{ marginTop: "6rem", textAlign: "center", paddingTop: "4rem", borderTop: "1px solid rgba(255,255,255,0.05)" }}>
          <h2 style={{ fontFamily: "var(--font-space-grotesk, sans-serif)", fontWeight: 800, fontSize: "2rem", color: "rgba(255,255,255,0.9)", marginBottom: "1rem" }}>Befreie dich heute.</h2>
          <p style={{ fontSize: "1rem", color: "rgba(255,255,255,0.45)", marginBottom: "2.5rem" }}>Starte die Analyse deiner Verträge und überlass den Rest deinem Sovereign Twin.</p>
          <Link href="/dashboard" className="lp-btn-primary">Kündigungsprozess starten</Link>
        </footer>
      </article>
    </div>
  );
}
