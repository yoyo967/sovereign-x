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
    title: "Privacy Guardian | Der Zero-Trust Gatekeeper von Sovereign 2030",
    description:
      "Die zweite Schicht der APEX-Architektur. Zweckbindung, Boundary Conditions und LLM-Firewall für maximale Datensicherheit und Kontrolle.",
    alternates: { canonical: `${BASE_URL}/${locale}/features/privacy-guardian` },
    openGraph: {
      title: "Privacy Guardian | Datensicherheit durch Architektur",
      description: "Erfahre wie der Privacy Guardian jeden API-Call validiert und deine Privatsphäre technisch erzwingt.",
      url: `${BASE_URL}/${locale}/features/privacy-guardian`,
    },
  };
}

export default async function PrivacyGuardianPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    "headline": "Privacy Guardian: Zero-Trust & Boundary-First Design",
    "description": "Technischer Deep-Dive in den Protection Layer von Sovereign 2030.",
    "author": { "@type": "Organization", "name": "Sovereign 2030" },
    "inLanguage": locale
  };

  const layers = [
    { title: "Zweckbindung", desc: "Daten werden nur für den spezifischen Zweck verarbeitet, den du definiert hast (z.B. nur Kündigungsanalyse, keine Werbe-Profilierung)." },
    { title: "LLM Firewall", desc: "Vor jedem API-Call an externe Modelle filtert der Guardian PII (personenbezogene Daten) heraus. Nur anonymisierter Kontext wird übertragen." },
    { title: "Real-time Auditing", desc: "Jeder Datenzugriff hinterlässt einen fälschungssicheren Fingerprint im Audit-Trail — bevor die Inferenz startet." }
  ];

  return (
    <>
      <JsonLd data={jsonLd} />
      <div style={{ background: "#080E1A", minHeight: "100vh" }}>
        
        <PremiumBanner
          type="guardian"
          imagePath="/assets/nexus/privacy-guardian.png"
          tag="APEX Architecture · Protection Layer · Zero-Trust"
          title="Privacy Guardian"
          subtitle="Der physische Gatekeeper deines digitalen Lebens. Sovereign OS validiert jeden Datenzugriff gegen deine Boundary Conditions."
        />

        <article className="max-w-4xl mx-auto px-6 py-20">
          {/* EU AI Act Disclaimer */}
          <div className="nexus-card" style={{ padding: "1.5rem", marginBottom: "5rem", display: "flex", gap: "1.5rem", alignItems: "center" }}>
            <NexusIcon type="guardian" size={40} />
            <p style={{ fontFamily: "var(--font-jetbrains, monospace)", fontSize: "0.65rem", color: "rgba(255,255,255,0.6)", lineHeight: 1.5, margin: 0 }}>
              <span style={{ color: "var(--sovereign-cyan, #00E5FF)", fontWeight: 700 }}>EU AI ACT ART. 13 COMPLIANCE:</span><br />
              Dieses System erzwingt die Transparenz jeder KI-Interaktion. Alle externen API-Aufrufe (Gemini/Gemma Cloud) unterliegen der LLM-Firewall und werden im Audit-Trail dokumentiert.
            </p>
          </div>


          <section style={{ marginBottom: "5rem" }}>
            <h2 style={{ fontFamily: "var(--font-space-grotesk, sans-serif)", fontWeight: 800, fontSize: "1.8rem", color: "#E0E0E0", marginBottom: "2rem" }}>Boundary-First Design</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {layers.map((layer, i) => (
                <div key={i} style={{ border: "1px solid rgba(255,255,255,0.06)", padding: "2rem", background: "rgba(255,255,255,0.01)" }}>
                  <h3 style={{ fontFamily: "var(--font-space-grotesk, sans-serif)", fontWeight: 700, fontSize: "1.1rem", color: "var(--sovereign-cyan, #00E5FF)", marginBottom: "1rem" }}>{layer.title}</h3>
                  <p style={{ fontSize: "0.85rem", lineHeight: 1.6, color: "rgba(224,224,224,0.4)" }}>{layer.desc}</p>
                </div>
              ))}
            </div>
          </section>

          <section style={{ border: "1px solid rgba(255,255,255,0.06)", padding: "3rem", background: "rgba(255,255,255,0.01)", marginBottom: "4rem" }}>
            <h2 style={{ fontFamily: "var(--font-space-grotesk, sans-serif)", fontWeight: 800, fontSize: "1.8rem", color: "#E0E0E0", marginBottom: "1.5rem" }}>Die LLM-Firewall</h2>
            <p style={{ fontSize: "1rem", lineHeight: 1.8, color: "rgba(224,224,224,0.5)", marginBottom: "2rem" }}>
              Während herkömmliche KI-Assistenten deine Daten ungefiltert an die Cloud senden, schaltet sich der Privacy Guardian aktiv dazwischen. Er erkennt und maskiert PII (Personally Identifiable Information) wie Namen, Adressen und Kontodaten durch anonymisierte Token. Das Resultat: Die KI versteht den Kontext, kennt aber nie deine wahre Identität.
            </p>
            <div style={{ padding: "1.5rem", background: "rgba(0,0,0,0.2)", border: "1px solid rgba(0,229,255,0.1)", fontFamily: "var(--font-jetbrains, monospace)", fontSize: "0.75rem", color: "rgba(255,255,255,0.4)" }}>
              <div style={{ color: "var(--sovereign-cyan, #00E5FF)", marginBottom: "0.5rem" }}>{"// FILTERING PROCESS:"}</div>
              Input: &quot;Kündige Netflix für [NAME]...&quot;<br />
              Guardian: &quot;Kündige Netflix für [USER_UUID_0815]...&quot;<br />
              <span style={{ color: "#00E676" }}>Status: PROTECTED · Compliance: Art. 25 DSGVO</span>
            </div>
          </section>

          <footer style={{ marginTop: "6rem", textAlign: "center", borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: "4rem" }}>
            <p style={{ fontSize: "0.9rem", color: "rgba(224,224,224,0.35)", marginBottom: "2rem" }}>Wie Sovereign Entscheidungen proaktiv vorbereitet.</p>
            <Link href={`/${locale}/features/execution-center`} className="lp-btn-secondary" style={{ padding: "0.75rem 2rem", fontSize: "0.85rem" }}>Das Execution Center →</Link>
          </footer>
        </article>
      </div>
    </>
  );
}
