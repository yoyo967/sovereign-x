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
    title: "Audit Trail | 100% Transparenz & Beweisbarkeit | Sovereign 2030",
    description:
      "Die vierte Schicht der APEX-Architektur. Unveränderliche Logs, RFC 3161 Timestamping und EU AI Act Art. 12 Compliance für deinen Sovereign Twin.",
    alternates: { canonical: `${BASE_URL}/${locale}/features/audit-trail` },
    openGraph: {
      title: "Audit Trail | Vertrauen durch Beweisbarkeit",
      description: "Erfahre wie jede KI-Aktion fälschungssicher dokumentiert wird — Transparenz als Standard.",
      url: `${BASE_URL}/${locale}/features/audit-trail`,
    },
  };
}

export default async function AuditTrailPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    "headline": "Audit Trail: Immutable Log & EU AI Act Compliance",
    "description": "Technischer Deep-Dive in den Trust Layer von Sovereign 2030.",
    "author": { "@type": "Organization", "name": "Sovereign 2030" },
    "inLanguage": locale
  };

  const steps = [
    { title: "Immutable Logging", desc: "Jeder Eintrag ist kryptographisch signiert. Eine nachträgliche Änderung ist mathematisch ausgeschlossen." },
    { title: "RFC 3161 Timestamping", desc: "Verwendung von Trusted Timestamping Authorities (TSA), um den exakten Zeitpunkt jeder Aktion rechtssicher zu beweisen." },
    { title: "Audit Trail Export", desc: "Lade deine gesamte Historie als signiertes PDF oder JSON herunter — bereit für Behörden oder Rechtsstreitigkeiten." }
  ];

  return (
    <>
      <JsonLd data={jsonLd} />
      <div style={{ background: "#080E1A", minHeight: "100vh" }}>
        
        <PremiumBanner
          type="audit"
          imagePath="/assets/nexus/audit-trail.png"
          tag="APEX Architecture · Trust Layer · RFC 3161"
          title="Audit Trail"
          subtitle="Souveränität bedeutet Beweisbarkeit. Jede autonome Handlung deines Twins wird fälschungssicher dokumentiert."
        />

        <article className="max-w-4xl mx-auto px-6 py-20">
          {/* EU AI Act Disclaimer */}
          <div className="nexus-card" style={{ padding: "1.5rem", marginBottom: "5rem", display: "flex", gap: "1.5rem", alignItems: "center" }}>
            <NexusIcon type="audit" size={40} />
            <p style={{ fontFamily: "var(--font-jetbrains, monospace)", fontSize: "0.65rem", color: "rgba(255,255,255,0.6)", lineHeight: 1.5, margin: 0 }}>
              <span style={{ color: "var(--sovereign-cyan, #00E5FF)", fontWeight: 700 }}>EU AI ACT ART. 12 COMPLIANCE:</span><br />
              Dieses System erfüllt vollständig die Dokumentationspflichten für KI-Systeme. Jeder Eingriff und jede Datenfreigabe wird fälschungssicher protokolliert.
            </p>
          </div>


          <section style={{ marginBottom: "5rem" }}>
            <h2 style={{ fontFamily: "var(--font-space-grotesk, sans-serif)", fontWeight: 800, fontSize: "1.8rem", color: "#E0E0E0", marginBottom: "2rem" }}>Trust by Evidence</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {steps.map((step, i) => (
                <div key={i} style={{ border: "1px solid rgba(255,255,255,0.06)", padding: "2rem", background: "rgba(255,255,255,0.01)" }}>
                  <h3 style={{ fontFamily: "var(--font-space-grotesk, sans-serif)", fontWeight: 700, fontSize: "1.1rem", color: "var(--sovereign-cyan, #00E5FF)", marginBottom: "1rem" }}>{step.title}</h3>
                  <p style={{ fontSize: "0.85rem", lineHeight: 1.6, color: "rgba(224,224,224,0.4)" }}>{step.desc}</p>
                </div>
              ))}
            </div>
          </section>

          <section style={{ border: "1px solid rgba(255,255,255,0.06)", padding: "3rem", background: "rgba(255,255,255,0.01)", marginBottom: "4rem" }}>
            <h2 style={{ fontFamily: "var(--font-space-grotesk, sans-serif)", fontWeight: 800, fontSize: "1.8rem", color: "#E0E0E0", marginBottom: "1.5rem" }}>Rechtssicherheit als Standard</h2>
            <p style={{ fontSize: "1rem", lineHeight: 1.8, color: "rgba(224,224,224,0.5)", marginBottom: "2rem" }}>
              In juristischen Auseinandersetzungen zählt nur, was bewiesen werden kann. Der Sovereign Audit Trail nutzt kryptographisches <span style={{ color: "var(--sovereign-cyan, #00E5FF)" }}>RFC 3161 Timestamping</span>, um den Nachweis zu erbringen, dass eine bestimmte Aktion zu einem bestimmten Zeitpunkt stattgefunden hat. Dies macht deinen Twin zu einem digitalen Zeugen, auf den du dich verlassen kannst.
            </p>
            <div className="nexus-card" style={{ padding: "2rem", background: "rgba(0,0,0,0.2)" }}>
              <div style={{ color: "var(--sovereign-cyan, #00E5FF)", marginBottom: "1rem" }}>KRYPTOGRAPHISCHER FINGERPRINT:</div>
              HASH: 8e3f9a...3c1d2e<br />
              TSA_SIGNATURE: VERIFIED<br />
              COMPLIANCE: EU_AI_ACT_ART_12
            </div>
          </section>

          <footer style={{ marginTop: "6rem", textAlign: "center", borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: "4rem" }}>
            <p style={{ fontSize: "0.9rem", color: "rgba(224,224,224,0.35)", marginBottom: "2rem" }}>Bereit für die praktische Anwendung?</p>
            <Link href={`/${locale}/use-cases`} className="lp-btn-primary" style={{ padding: "1rem 2.5rem", fontSize: "0.9rem" }}>Souveränität Erleben →</Link>
          </footer>
        </article>
      </div>
    </>
  );
}
