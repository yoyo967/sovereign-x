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
    title: "AgentMemory | Das Personal Data Warehouse von Sovereign 2030",
    description:
      "Die erste Schicht der APEX-Architektur. Composable CDP, Local-First Sync (ADR-009) und Gemma 4 Integration für absolute Datensouveränität.",
    alternates: { canonical: `${BASE_URL}/${locale}/features/agentmemory` },
    openGraph: {
      title: "AgentMemory | Dein Daten-Tresor in der KI-Ära",
      description: "Lerne wie AgentMemory deine Lebensdaten schützt und strukturiert — ohne Cloud-Abhängigkeit.",
      url: `${BASE_URL}/${locale}/features/agentmemory`,
    },
  };
}

export default async function AgentMemoryPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    "headline": "AgentMemory: Personal Data Warehouse & ADR-009 Sync",
    "description": "Technischer Deep-Dive in den Data Layer von Sovereign 2030.",
    "author": { "@type": "Organization", "name": "Sovereign 2030" },
    "inLanguage": locale
  };

  const technicalSpecs = [
    { label: "Sync Protokoll", value: "ADR-009 Local-First" },
    { label: "Verschlüsselung", value: "AES-256-GCM (End-to-End)" },
    { label: "Data Residency", value: "EU-Region (europe-west4)" },
    { label: "AI Core", value: "Gemma 4 E2B (On-Device Indexing)" }
  ];

  return (
    <>
      <JsonLd data={jsonLd} />
      <div style={{ background: "#080E1A", minHeight: "100vh" }}>
        <PremiumBanner
          type="memory"
          imagePath="/assets/nexus/agentmemory.png"
          tag="APEX Architecture · Data Layer · ADR-009"
          title="AgentMemory"
          subtitle="Dein Personal Data Warehouse. Ein isolierter, verschlüsselter Tresor für deine gesamte digitale Existenz."
        />

        <article className="max-w-5xl mx-auto px-6 py-20">
          {/* EU AI Act Disclaimer */}
          <div className="nexus-card" style={{ padding: "1.5rem", marginBottom: "5rem", display: "flex", gap: "1.5rem", alignItems: "center" }}>
            <NexusIcon type="memory" size={40} />
            <p style={{ fontFamily: "var(--font-jetbrains, monospace)", fontSize: "0.65rem", color: "rgba(255,255,255,0.6)", lineHeight: 1.5, margin: 0 }}>
              <span style={{ color: "var(--sovereign-cyan, #00E5FF)", fontWeight: 700 }}>EU AI ACT ART. 13 COMPLIANCE:</span><br />
              Dieses System interagiert mit einem KI-Modell (Gemma 4 On-Device).
              Ergebnisse dienen der Demonstration. Keine persönlichen Daten werden ohne explizite Freigabe (Consent) in Dritt-Systeme übertragen.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-24">
            {technicalSpecs.map((spec, i) => (
              <div key={i} className="nexus-card" style={{ padding: "1.5rem" }}>
                <div style={{ fontFamily: "var(--font-jetbrains, monospace)", fontSize: "0.55rem", color: "rgba(255,255,255,0.3)", marginBottom: "0.5rem", textTransform: "uppercase" }}>{spec.label}</div>
                <div style={{ fontFamily: "var(--font-jetbrains, monospace)", fontSize: "0.75rem", color: "#E0E0E0", fontWeight: 600 }}>{spec.value}</div>
              </div>
            ))}
          </div>

          <section style={{ marginBottom: "5rem" }}>
            <h2 style={{ fontFamily: "var(--font-space-grotesk, sans-serif)", fontWeight: 800, fontSize: "1.8rem", color: "#E0E0E0", marginBottom: "2rem" }}>Das Composable CDP Prinzip</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div>
                <p style={{ fontSize: "1rem", lineHeight: 1.8, color: "rgba(224,224,224,0.5)", marginBottom: "1.5rem" }}>
                  Im Gegensatz zu zentralisierten Cloud-Speichern basiert AgentMemory auf einer <span style={{ color: "var(--sovereign-cyan, #00E5FF)" }}>Composable-Architektur</span>. Das bedeutet: Alle Verträge, Finanzdaten und Interaktionsverläufe werden als modulare Datenpunkte gespeichert, die nur durch deinen Sovereign Twin orchestriert werden können.
                </p>
                <div style={{ padding: "2rem", borderLeft: "3px solid var(--sovereign-cyan, #00E5FF)", background: "rgba(255,255,255,0.02)" }}>
                  <p style={{ fontSize: "0.9rem", color: "#E0E0E0", margin: 0, fontStyle: "italic" }}>
                    &quot;Datenhoheit ist nicht das Recht, Daten zu besitzen — es ist die technische Unmöglichkeit, dass andere ohne Erlaubnis darauf zugreifen.&quot;
                  </p>
                </div>
              </div>
              <div style={{ border: "1px solid rgba(255,255,255,0.06)", padding: "2rem", background: "rgba(0,229,255,0.02)" }}>
                <h4 style={{ fontFamily: "var(--font-jetbrains, monospace)", fontSize: "0.7rem", color: "var(--sovereign-cyan, #00E5FF)", textTransform: "uppercase", marginBottom: "1.5rem", letterSpacing: "0.1em" }}>Daten-Struktur (Vorschau)</h4>
                <pre style={{ margin: 0, fontFamily: "var(--font-jetbrains, monospace)", fontSize: "0.65rem", color: "rgba(255,255,255,0.4)", lineHeight: 1.6 }}>
{`{
  "vault": "ENCRYPTED_AES256",
  "sync": "ADR-009_ACTIVE",
  "nodes": {
    "contracts": 14,
    "finance": "BAFIN_PSD2",
    "audit_log": "RFC_3161"
  },
  "privacy": "BOUNDARY_ENFORCED"
}`}
                </pre>
              </div>
            </div>
          </section>

          <section style={{ borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: "5rem" }}>
            <h2 style={{ fontFamily: "var(--font-space-grotesk, sans-serif)", fontWeight: 800, fontSize: "1.8rem", color: "#E0E0E0", marginBottom: "2rem" }}>Sicherheit durch Architektur</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { title: "Zero Lock-in", desc: "Deine Daten gehören dir. Exportiere deine gesamte Historie jederzeit in standardisierten Formaten (JSON, PDF)." },
                { title: "EU Data Residency", desc: "Kein Transfer in Drittländer. Alle Server stehen in der EU (Frankfurt/Amsterdam) unter strengster DSGVO-Aufsicht." },
                { title: "Quantum-Ready", desc: "Wir bereiten die AgentMemory-Verschlüsselung auf post-quanten-sichere Algorithmen vor." }
              ].map((item, i) => (
                <div key={i}>
                  <h4 style={{ fontFamily: "var(--font-space-grotesk, sans-serif)", fontWeight: 700, fontSize: "1.1rem", color: "#E0E0E0", marginBottom: "1rem" }}>{item.title}</h4>
                  <p style={{ fontSize: "0.85rem", lineHeight: 1.6, color: "rgba(224,224,224,0.4)" }}>{item.desc}</p>
                </div>
              ))}
            </div>
          </section>

          <footer style={{ marginTop: "6rem", textAlign: "center", borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: "4rem" }}>
            <p style={{ fontSize: "0.9rem", color: "rgba(224,224,224,0.35)", marginBottom: "2rem" }}>Verstehe die nächste Schicht der APEX-Architektur.</p>
            <Link href={`/${locale}/features/privacy-guardian`} className="lp-btn-secondary" style={{ padding: "0.75rem 2rem", fontSize: "0.85rem" }}>Der Privacy Guardian →</Link>
          </footer>
        </article>
      </div>
    </>
  );
}
