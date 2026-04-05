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
    title: "SOVEREIGN APEX Architektur: Die 4 Schichten absoluter Datensouveränität",
    description:
      "Privacy Guardian, AgentMemory, Execution Center, Audit Trail — wie die vier APEX-Layer von SOVEREIGN 2030 zusammenwirken.",
    alternates: { canonical: `${BASE_URL}/${locale}/architektur` },
  };
}

export default async function ArchitekturPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    headline: "SOVEREIGN APEX Architektur: Die 4 Schichten absoluter Datensouveränität",
    description: "Deep-Dive in die technische Architektur von SOVEREIGN 2030.",
    author: { "@type": "Organization", name: "SOVEREIGN 2030" },
  };

  const layers = [
    {
      id: "agentmemory",
      index: "01",
      title: "AgentMemory",
      subtitle: "Personal Data Warehouse",
      tag: "DATA LAYER",
      type: "memory" as const,
      desc: "Das AgentMemory ist das Fundament deiner digitalen Souveränität — ein vollständig isoliertes Personal Data Warehouse.",
      technical: [
        "Composable Customer Data Platform (CDP)",
        "Zero Third-Party Access: Keine externe KI ohne Freigabe",
        "EU-Hosting: Region europe-west3 (Frankfurt)",
        "Verschlüsselung: AES-256 at rest, TLS 1.3 in transit",
      ],
    },
    {
      id: "privacy-guardian",
      index: "02",
      title: "Privacy Guardian",
      subtitle: "Consent & Boundary Layer",
      tag: "PROTECTION LAYER",
      type: "guardian" as const,
      desc: "Der Privacy Guardian ist der physische Gatekeeper deiner Datensouveränität.",
      technical: [
        "Policy Engine: Attribute-Based Access Control",
        "Real-time Validation: Jeder API-Call wird vor Ausführung geprüft",
        "LLM Firewall: Anonymisierte Kontexte für Sprachmodelle",
      ],
    },
    {
      id: "execution-center",
      index: "03",
      title: "Execution Center",
      subtitle: "HITL / HOTL Engine",
      tag: "CONTROL LAYER",
      type: "execution" as const,
      desc: "Das Execution Center ist das Gehirn des Sovereign Twin — die Engine für autonome KI-Aktionen.",
      technical: [
        "Human-in-the-Loop (HITL): KI bereitet vor, du genehmigst",
        "Reasoning Trace: Erklärung der Logik hinter jeder Aktion",
        "Eskalationslogik bei niedriger Konfidenz",
      ],
    },
    {
      id: "audit-trail",
      index: "04",
      title: "Audit Trail",
      subtitle: "100% Transparency Engine",
      tag: "TRUST LAYER",
      type: "audit" as const,
      desc: "Der Audit Trail materialisiert vollständige Transparenz als unveränderliches Protokoll.",
      technical: [
        "Immutable Log: Kryptographisch signierte Einträge",
        "EU AI Act Compliance: Erfüllung der Pflichten nach Art. 12",
        "Export: Vollständiger Trail als JSON oder PDF",
      ],
    },
  ];

  return (
    <div style={{ background: "#080E1A", minHeight: "100vh", color: "rgba(255,255,255,0.85)" }}>
      <JsonLd data={jsonLd} />

      <PremiumBanner
        type="architecture"
        imagePath="/assets/nexus/architecture.png"
        tag="Technology · OS Hub · Blueprint"
        title="APEX Architektur"
        subtitle="Vier Schichten. Absolute Kontrolle. Eine technologische Neudefinition von digitaler Freiheit."
      />

      <article className="max-w-4xl mx-auto px-6 py-20">
        <section style={{ marginBottom: "5rem" }}>
          <h2 style={{ fontFamily: "var(--font-space-grotesk, sans-serif)", fontWeight: 800, fontSize: "1.8rem", color: "rgba(255,255,255,0.95)", marginBottom: "1.5rem" }}>
            Das System der Souveränität
          </h2>
          <p style={{ fontSize: "1.05rem", lineHeight: 1.75, color: "rgba(255,255,255,0.5)", maxWidth: 640 }}>
            SOVEREIGN 2030 basiert nicht auf dem Versprechen von Sicherheit, sondern auf einer Architektur, die Unabhängigkeit technisch erzwingt. 
            Jede Komponente des APEX-Stacks ist isoliert und doch nahtlos integriert.
          </p>
        </section>

        <div style={{ display: "flex", flexDirection: "column", gap: "3rem" }}>
          {layers.map((layer) => (
            <div key={layer.id} className="nexus-card" style={{ padding: "2.5rem", background: "rgba(255,255,255,0.01)", border: "1px solid rgba(255,255,255,0.05)" }}>
              <div style={{ display: "flex", alignItems: "flex-start", gap: "1.5rem", marginBottom: "2rem" }}>
                <NexusIcon type={layer.type} size={48} />
                <div>
                  <div style={{ fontFamily: "var(--font-jetbrains, monospace)", fontSize: "0.55rem", color: "rgba(0,212,255,0.5)", letterSpacing: "0.1em", marginBottom: "0.25rem" }}>{layer.tag}</div>
                  <h3 style={{ fontFamily: "var(--font-space-grotesk, sans-serif)", fontWeight: 800, fontSize: "1.5rem", color: "rgba(255,255,255,0.95)", margin: 0 }}>{layer.title}</h3>
                  <div style={{ fontSize: "0.85rem", color: "rgba(255,255,255,0.4)" }}>{layer.subtitle}</div>
                </div>
              </div>
              <p style={{ fontSize: "0.95rem", lineHeight: 1.8, color: "rgba(255,255,255,0.6)", marginBottom: "2rem" }}>{layer.desc}</p>
              
              <div style={{ padding: "1.5rem", background: "rgba(0,212,255,0.02)", border: "1px solid rgba(0,212,255,0.05)" }}>
                <div style={{ fontFamily: "var(--font-jetbrains, monospace)", fontSize: "0.6rem", color: "rgba(0,212,255,0.4)", textTransform: "uppercase", marginBottom: "1rem", letterSpacing: "0.1em" }}>Technische Spezifikation</div>
                <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "0.6rem" }}>
                  {layer.technical.map((tech, i) => (
                    <li key={i} style={{ display: "flex", alignItems: "center", gap: "0.75rem", fontSize: "0.85rem", color: "rgba(255,255,255,0.55)" }}>
                      <span style={{ color: "var(--sovereign-cyan, #00E5FF)", fontSize: "0.7rem" }}>›</span>
                      {tech}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>

        {/* Footer CTA */}
        <div style={{ marginTop: "6rem", textAlign: "center", borderTop: "1px solid rgba(255,255,255,0.05)", paddingTop: "4rem" }}>
          <h2 style={{ fontFamily: "var(--font-space-grotesk, sans-serif)", fontWeight: 800, fontSize: "2rem", color: "rgba(255,255,255,0.9)", marginBottom: "1rem" }}>
            Erlebe die Architektur.
          </h2>
          <p style={{ fontSize: "1rem", color: "rgba(255,255,255,0.45)", marginBottom: "2.5rem" }}>
            Starte deinen Sovereign Twin und sieh die APEX-Schichten in Aktion. 100% DSGVO-konform.
          </p>
          <div style={{ display: "flex", gap: "1rem", justifyContent: "center" }}>
            <Link href="/dashboard" className="lp-btn-primary">Jetzt starten</Link>
            <Link href={`/${locale}/sicherheit`} className="lp-btn-secondary">Sicherheits-Guide</Link>
          </div>
        </div>
      </article>
    </div>
  );
}
