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
    title: "Execution Center | Die Schaltzentrale des Sovereign Twin",
    description:
      "Die dritte Schicht der APEX-Architektur. Human-in-the-Loop (HITL) Steuerung, Task Queue und Reasoning Trace für autonome Aktionen.",
    alternates: { canonical: `${BASE_URL}/${locale}/features/execution-center` },
    openGraph: {
      title: "Execution Center | Autonomie trifft Kontrolle",
      description: "Erfahre wie das Execution Center deine Befehle präzise umsetzt — mit dir im Zentrum jeder Entscheidung.",
      url: `${BASE_URL}/${locale}/features/execution-center`,
    },
  };
}

export default async function ExecutionCenterPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    "headline": "Execution Center: HITL/HOTL Engine & Reasoning Trace",
    "description": "Technischer Deep-Dive in den Control Layer von Sovereign 2030.",
    "author": { "@type": "Organization", "name": "Sovereign 2030" },
    "inLanguage": locale
  };

  const modes = [
    { title: "HITL (Human-in-the-Loop)", desc: "Kritische Aktionen (z.B. Vertragsunterzeichnung) erfordern deine explizite Freigabe. Die KI bereitet vor, du sagst 'GO'." },
    { title: "HOTL (Human-on-the-Loop)", desc: "Routine-Aufgaben (z.B. Fristenprüfung) laufen autonom. Du überwachst den Prozess und kannst jederzeit einschreiten." },
    { title: "Boundary-Check", desc: "Jede Aktion wird gegen deine vordefinierten Regeln (Boundary Conditions) validiert. Verstöße führen zum sofortigen Stopp." }
  ];

  return (
    <>
      <JsonLd data={jsonLd} />
      <div style={{ background: "#080E1A", minHeight: "100vh" }}>
        
        <PremiumBanner
          type="execution"
          imagePath="/assets/nexus/execution-center.png"
          tag="APEX Architecture · Control Layer · HITL / HOTL"
          title="Execution Center"
          subtitle="Die Schaltzentrale deines Sovereign Twins. Verwandle Analysen in Resultate durch sichere, begründbare Aktionen."
        />

        <article className="max-w-4xl mx-auto px-6 py-20">
          {/* EU AI Act Disclaimer */}
          <div className="nexus-card" style={{ padding: "1.5rem", marginBottom: "5rem", display: "flex", gap: "1.5rem", alignItems: "center" }}>
            <NexusIcon type="execution" size={40} />
            <p style={{ fontFamily: "var(--font-jetbrains, monospace)", fontSize: "0.65rem", color: "rgba(255,255,255,0.6)", lineHeight: 1.5, margin: 0 }}>
              <span style={{ color: "var(--sovereign-cyan, #00E5FF)", fontWeight: 700 }}>EU AI ACT ART. 13 COMPLIANCE:</span><br />
              Dieses Modul ermöglicht die Steuerung autonomer KI-Aktionen. Jede Aktion im Execution Center ist rückverfolgbar und erfordert je nach Konfiguration eine menschliche Freigabe.
            </p>
          </div>


          <section style={{ marginBottom: "5rem" }}>
            <h2 style={{ fontFamily: "var(--font-space-grotesk, sans-serif)", fontWeight: 800, fontSize: "1.8rem", color: "#E0E0E0", marginBottom: "2rem" }}>Der Algorithmic Senate</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {modes.map((mode, i) => (
                <div key={i} style={{ border: "1px solid rgba(255,255,255,0.06)", padding: "2rem", background: "rgba(255,255,255,0.01)" }}>
                  <h3 style={{ fontFamily: "var(--font-space-grotesk, sans-serif)", fontWeight: 700, fontSize: "1.1rem", color: "var(--sovereign-cyan, #00E5FF)", marginBottom: "1rem" }}>{mode.title}</h3>
                  <p style={{ fontSize: "0.85rem", lineHeight: 1.6, color: "rgba(224,224,224,0.4)" }}>{mode.desc}</p>
                </div>
              ))}
            </div>
          </section>

          <section style={{ border: "1px solid rgba(255,255,255,0.06)", padding: "3rem", background: "rgba(255,255,255,0.01)", marginBottom: "4rem" }}>
            <h2 style={{ fontFamily: "var(--font-space-grotesk, sans-serif)", fontWeight: 800, fontSize: "1.8rem", color: "#E0E0E0", marginBottom: "1.5rem" }}>Reasoning Trace & Audit</h2>
            <p style={{ fontSize: "1rem", lineHeight: 1.8, color: "rgba(224,224,224,0.5)", marginBottom: "2rem" }}>
              Transparenz bedeutet verstehen, warum eine Entscheidung getroffen wurde. Jede Aktion im Execution Center enthält einen <span style={{ color: "var(--sovereign-cyan, #00E5FF)" }}>Reasoning Trace</span> — eine Schritt-für-Schritt Erklärung der Logik des Zwillings. Kombiniert mit einem fälschungssicheren Audit-Log schafft dies Vertrauen durch Beweisbarkeit.
            </p>
            <div className="nexus-card" style={{ display: "flex", flexDirection: "column", gap: "1rem", padding: "2rem", background: "rgba(0,0,0,0.2)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontFamily: "var(--font-jetbrains, monospace)", fontSize: "0.6rem" }}>
                <span style={{ color: "rgba(255,255,255,0.3)" }}>ACTION_ID: #74B-92</span>
                <span style={{ color: "var(--sovereign-cyan, #00E5FF)" }}>[PENDING APPROVAL]</span>
              </div>
              <div style={{ fontFamily: "var(--font-jetbrains, monospace)", fontSize: "0.75rem", color: "rgba(255,255,255,0.8)" }}>
                &quot;Sonderkündigung Stromvertrag aufgrund Preiserhöhung &gt; 15%&quot;
              </div>
              <div style={{ padding: "10px", background: "rgba(255,255,255,0.03)", fontSize: "0.65rem", color: "rgba(255,255,255,0.3)", fontFamily: "var(--font-jetbrains, monospace)" }}>
                {"TRACE: [01] Scan_PDF -> [02] Extract_Klausel_§4.2 -> [03] Compare_Marktwert -> [04] Logic_Check: SUCCESS"}
              </div>
            </div>
          </section>

          <footer style={{ marginTop: "6rem", textAlign: "center", borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: "4rem" }}>
            <p style={{ fontSize: "0.9rem", color: "rgba(224,224,224,0.35)", marginBottom: "2rem" }}>Souveränität bedeutet Beweisbarkeit.</p>
            <Link href={`/${locale}/features/audit-trail`} className="lp-btn-secondary" style={{ padding: "0.75rem 2rem", fontSize: "0.85rem" }}>Der Audit Trail →</Link>
          </footer>
        </article>
      </div>
    </>
  );
}
