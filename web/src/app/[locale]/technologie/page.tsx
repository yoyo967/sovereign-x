// src/app/[locale]/technologie/page.tsx
// Technologie-Deep-Dive: Stack, Architektur, Sicherheit
// Server Component / Blueprint Dark
import type { Metadata } from "next";
import Link from "next/link";
import Navigation from "@/components/landing/Navigation";
import Footer from "@/components/landing/Footer";
import JsonLd from "@/components/SEO/JsonLd";
import Breadcrumb from "@/components/ui/Breadcrumb";

const BASE_URL = "https://sovereign.de";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return {
    title: "Technologie & Architektur | SOVEREIGN 2030",
    description:
      "Der vollständige Tech Stack von SOVEREIGN 2030: Next.js, Google Cloud, Vertex AI, Gemini 2.5 Flash, Firebase, finAPI PSD2. Offen, erklärbar, EU-konform.",
    alternates: { canonical: `${BASE_URL}/${locale}/technologie` },
    openGraph: {
      title: "Technologie & Architektur | SOVEREIGN 2030",
      description: "Next.js, Google Cloud, Vertex AI, Gemini 2.5 Flash, Firebase — offen, erklärbar, EU-konform.",
      url: `${BASE_URL}/${locale}/technologie`,
      siteName: "SOVEREIGN 2030",
      images: [{ url: `${BASE_URL}/og/technologie.png`, width: 1200, height: 630, alt: "SOVEREIGN 2030 Tech Stack" }],
      locale: locale === "de" ? "de_DE" : "en_US",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: "Technologie & Architektur | SOVEREIGN 2030",
      description: "Der vollständige Tech Stack — transparent und EU-konform.",
      images: [`${BASE_URL}/og/technologie.png`],
    },
  };
}

// ─── Stack layers ──────────────────────────────────────
const STACK_LAYERS = [
  {
    layer: "FRONTEND",
    color: "#00D4FF",
    items: [
      { name: "Next.js 16 (App Router)", desc: "Server Components, Static Generation, Edge Runtime" },
      { name: "React 19", desc: "Concurrent features, Suspense, Server Actions" },
      { name: "Tailwind CSS v4", desc: "Utility-first, custom design system tokens" },
      { name: "Framer Motion", desc: "Declarative animations, layout transitions" },
      { name: "next-intl", desc: "10 Sprachen, SSR-safe, locale routing" },
    ],
  },
  {
    layer: "AI & INTELLIGENCE",
    color: "#BB86FC",
    items: [
      { name: "Gemini 2.5 Flash (Vertex AI)", desc: "Primäres LLM — Vertragsanalyse, NLU, Generation" },
      { name: "Vertex AI Agent Builder", desc: "Multi-Agent Orchestration, Tool Use, Grounding" },
      { name: "Google Cloud Natural Language API", desc: "Entity Extraction, Sentiment, Classification" },
      { name: "Sovereign Boundary Engine", desc: "Privacy-first AI gating — kein LLM-Call ohne Consent-Check" },
      { name: "HITL/HOTL Controller", desc: "Human-in/on-the-Loop Entscheidungslogik" },
    ],
  },
  {
    layer: "BACKEND & DATA",
    color: "#00E676",
    items: [
      { name: "Google Cloud Run", desc: "Serverless Container, europe-west4 (Frankfurt)" },
      { name: "Firebase Firestore", desc: "NoSQL Realtime DB, EU-Datenresidenz" },
      { name: "Firebase Auth", desc: "E-Mail, Google OAuth — BaFin-konform" },
      { name: "Cloud Pub/Sub", desc: "Event-driven Agent-Kommunikation" },
      { name: "Cloud Storage", desc: "Verschlüsselte Dokument-Ablage (AES-256)" },
    ],
  },
  {
    layer: "FINANCIAL DATA",
    color: "#FFA726",
    items: [
      { name: "finAPI PSD2", desc: "BaFin-regulierte Banking-Integration, ISO 27001-zertifiziert" },
      { name: "Open Banking API", desc: "Read-only Kontozugriff, keine Speicherung von Bankdaten" },
      { name: "Transaction Intelligence", desc: "Abo-Erkennung, Preiserhöhungs-Detection, Anomalie-Scan" },
    ],
  },
  {
    layer: "SECURITY & COMPLIANCE",
    color: "#FF5252",
    items: [
      { name: "Privacy Guardian", desc: "PII-Boundary Layer — validiert jeden externen API-Call" },
      { name: "Audit Trail Engine", desc: "Kryptographisch signierter, unveränderlicher Log aller KI-Aktionen" },
      { name: "EU AI Act Compliance Layer", desc: "Art.13 Transparenz, Art.14 Human Oversight, Risikoklassifikation" },
      { name: "DSGVO-Automatisierung", desc: "Auskunft, Löschung, Widerspruch — vollständig automatisiert" },
      { name: "TLS 1.3 + E2E-Verschlüsselung", desc: "Alle Daten in Transit und at Rest verschlüsselt" },
    ],
  },
];

const PRINCIPLES = [
  { icon: "🇪🇺", title: "EU-First", desc: "Alle Daten bleiben in der EU. Kein Transfer in Drittländer ohne explizite Einwilligung. Serverstandort: Frankfurt (europe-west4)." },
  { icon: "🔍", title: "Erklärbare KI", desc: "Jede KI-Entscheidung ist im Audit Trail dokumentiert. Kein Black-Box-Verhalten. EU AI Act Art.13 vollständig implementiert." },
  { icon: "🛡️", title: "Boundary-First", desc: "Der Privacy Guardian prüft jeden API-Call bevor er ausgeführt wird. PII verlässt niemals das System ohne expliziten Consent." },
  { icon: "⚡", title: "Zero Lock-in", desc: "Vollständiger Daten-Export jederzeit. Keine proprietären Formate. Kein Vendor Lock-in auf KI-Ebene." },
  { icon: "👤", title: "Human Control", desc: "HITL/HOTL — du bestimmst für jede Kategorie ob du Aktionen genehmigen willst oder autonom laufen lässt." },
  { icon: "🔐", title: "Open Architecture", desc: "Kein proprietäres Black-Box-System. Technologie-Stack öffentlich dokumentiert. Audit durch Dritte möglich." },
];

const COMPLIANCE = [
  { standard: "DSGVO / GDPR", status: "VOLLSTÄNDIG", color: "#00E676", note: "Art.5 Datensparsamkeit · Art.17 Löschrecht · Art.20 Portabilität · Art.25 Privacy by Design" },
  { standard: "EU AI Act", status: "VOLLSTÄNDIG", color: "#00E676", note: "Low-Risk Klassifikation · Art.13 Transparenz · Art.14 Human Oversight · Art.9 Risikomanagement" },
  { standard: "DSA (Digital Services Act)", status: "KONFORM", color: "#00D4FF", note: "Keine illegalen Inhalte, Transparenz über algorithmische Systeme" },
  { standard: "PSD2 / Open Banking", status: "KONFORM", color: "#00D4FF", note: "Über finAPI (BaFin-reguliert) · Read-only · ISO 27001" },
  { standard: "ISO 27001", status: "IN VORBEREITUNG", color: "#FFA726", note: "Zertifizierung geplant Q3 2025" },
  { standard: "SOC 2 Type II", status: "IN VORBEREITUNG", color: "#FFA726", note: "Audit geplant Q4 2025" },
];

export default async function TechnologiePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  const techSchema = {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    headline: "SOVEREIGN 2030 Technologie & Architektur",
    description: "Vollständige Beschreibung des Tech Stacks: Next.js, Google Cloud, Gemini AI, Firebase, finAPI",
    author: { "@type": "Organization", name: "SOVEREIGN 2030" },
    url: `${BASE_URL}/${locale}/technologie`,
  };

  return (
    <>
      <JsonLd data={techSchema} />
      <div style={{ background: "#080E1A", minHeight: "100vh" }}>
        <Navigation />
        <Breadcrumb locale={locale} items={[{ label: "Technologie" }]} />

        {/* ── HERO ─────────────────────────────────────────── */}
        <section
          style={{
            position: "relative",
            paddingTop: "140px",
            paddingBottom: "80px",
            borderBottom: "1px solid rgba(255,255,255,0.06)",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              position: "absolute",
              inset: 0,
              backgroundImage:
                "linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)",
              backgroundSize: "48px 48px",
            }}
          />
          <div
            style={{
              position: "absolute",
              top: "30%",
              right: "-5%",
              width: 500,
              height: 500,
              background: "radial-gradient(ellipse, rgba(187,134,252,0.05) 0%, transparent 70%)",
              pointerEvents: "none",
            }}
          />

          <div style={{ position: "relative", zIndex: 1, maxWidth: 960, margin: "0 auto", padding: "0 24px" }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                marginBottom: 32,
                fontFamily: "var(--font-jetbrains, monospace)",
                fontSize: "0.62rem",
                letterSpacing: "0.1em",
                color: "rgba(255,255,255,0.2)",
              }}
            >
              <Link href={`/${locale}`} style={{ color: "rgba(255,255,255,0.2)", textDecoration: "none" }}>SOVEREIGN 2030</Link>
              <span>/</span>
              <span style={{ color: "rgba(0,212,255,0.6)" }}>TECHNOLOGIE</span>
            </div>

            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                border: "1px solid rgba(187,134,252,0.2)",
                background: "rgba(187,134,252,0.04)",
                padding: "6px 14px",
                marginBottom: 24,
                fontFamily: "var(--font-jetbrains, monospace)",
                fontSize: "0.58rem",
                letterSpacing: "0.18em",
                color: "rgba(187,134,252,0.7)",
                textTransform: "uppercase",
              }}
            >
              Tech Stack · Open Architecture
            </div>

            <h1
              style={{
                fontFamily: "var(--font-space-grotesk, sans-serif)",
                fontWeight: 900,
                fontSize: "clamp(2.4rem, 6vw, 4.5rem)",
                lineHeight: 1.05,
                letterSpacing: "-0.03em",
                color: "#F0F4FF",
                marginBottom: 20,
              }}
            >
              Technologie &{" "}
              <span style={{ color: "#BB86FC" }}>Architektur</span>
            </h1>

            <p
              style={{
                fontSize: "1.05rem",
                lineHeight: 1.7,
                color: "rgba(255,255,255,0.45)",
                maxWidth: 640,
                marginBottom: 48,
              }}
            >
              Kein Black-Box-System. Vollständig dokumentierter Tech Stack — offen, erklärbar, EU-konform. So funktioniert SOVEREIGN 2030 unter der Haube.
            </p>

            {/* Quick stats */}
            <div style={{ display: "flex", gap: 32, flexWrap: "wrap" }}>
              {[
                { value: "5", label: "Stack-Schichten" },
                { value: "20+", label: "Technologien" },
                { value: "EU-only", label: "Serverstandort" },
                { value: "100%", label: "Audit Trail" },
              ].map((s) => (
                <div key={s.label}>
                  <div style={{ fontFamily: "var(--font-space-grotesk, sans-serif)", fontWeight: 900, fontSize: "1.8rem", color: "#BB86FC", lineHeight: 1 }}>{s.value}</div>
                  <div style={{ fontFamily: "var(--font-jetbrains, monospace)", fontSize: "0.55rem", letterSpacing: "0.12em", color: "rgba(255,255,255,0.25)", textTransform: "uppercase", marginTop: 4 }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── STACK LAYERS ─────────────────────────────────── */}
        <section style={{ maxWidth: 960, margin: "0 auto", padding: "80px 24px 0" }}>
          <p
            style={{
              fontFamily: "var(--font-jetbrains, monospace)",
              fontSize: "0.58rem",
              letterSpacing: "0.18em",
              color: "rgba(255,255,255,0.2)",
              textTransform: "uppercase",
              marginBottom: 40,
            }}
          >
            Stack-Schichten
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {STACK_LAYERS.map((layer, li) => (
              <div
                key={layer.layer}
                style={{
                  border: "1px solid rgba(255,255,255,0.07)",
                  overflow: "hidden",
                }}
              >
                {/* Layer header */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 16,
                    padding: "14px 24px",
                    background: "rgba(255,255,255,0.01)",
                    borderBottom: "1px solid rgba(255,255,255,0.05)",
                  }}
                >
                  <div
                    style={{
                      width: 3,
                      height: 20,
                      background: layer.color,
                      boxShadow: `0 0 8px ${layer.color}60`,
                      flexShrink: 0,
                    }}
                  />
                  <span
                    style={{
                      fontFamily: "var(--font-jetbrains, monospace)",
                      fontSize: "0.62rem",
                      letterSpacing: "0.18em",
                      color: layer.color,
                      textTransform: "uppercase",
                    }}
                  >
                    {String(li + 1).padStart(2, "0")} — {layer.layer}
                  </span>
                </div>

                {/* Items */}
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
                    gap: 0,
                  }}
                >
                  {layer.items.map((item, ii) => (
                    <div
                      key={item.name}
                      style={{
                        padding: "18px 24px",
                        borderRight: "1px solid rgba(255,255,255,0.04)",
                        borderBottom: "1px solid rgba(255,255,255,0.04)",
                      }}
                    >
                      <div
                        style={{
                          fontFamily: "var(--font-space-grotesk, sans-serif)",
                          fontWeight: 700,
                          fontSize: "0.88rem",
                          color: "rgba(255,255,255,0.8)",
                          marginBottom: 4,
                        }}
                      >
                        {item.name}
                      </div>
                      <div style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.35)", lineHeight: 1.5 }}>
                        {item.desc}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── ARCHITECTURE PRINCIPLES ──────────────────────── */}
        <section style={{ maxWidth: 960, margin: "0 auto", padding: "80px 24px 0" }}>
          <p
            style={{
              fontFamily: "var(--font-jetbrains, monospace)",
              fontSize: "0.58rem",
              letterSpacing: "0.18em",
              color: "rgba(255,255,255,0.2)",
              textTransform: "uppercase",
              marginBottom: 40,
            }}
          >
            Architektur-Prinzipien
          </p>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
              gap: 16,
            }}
          >
            {PRINCIPLES.map((p) => (
              <div
                key={p.title}
                style={{
                  border: "1px solid rgba(255,255,255,0.07)",
                  background: "rgba(255,255,255,0.015)",
                  padding: "24px",
                }}
              >
                <div style={{ fontSize: "1.5rem", marginBottom: 12 }}>{p.icon}</div>
                <div
                  style={{
                    fontFamily: "var(--font-space-grotesk, sans-serif)",
                    fontWeight: 700,
                    fontSize: "1rem",
                    color: "rgba(255,255,255,0.85)",
                    marginBottom: 8,
                  }}
                >
                  {p.title}
                </div>
                <div style={{ fontSize: "0.85rem", color: "rgba(255,255,255,0.4)", lineHeight: 1.6 }}>
                  {p.desc}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── COMPLIANCE TABLE ─────────────────────────────── */}
        <section style={{ maxWidth: 960, margin: "0 auto", padding: "80px 24px 120px" }}>
          <p
            style={{
              fontFamily: "var(--font-jetbrains, monospace)",
              fontSize: "0.58rem",
              letterSpacing: "0.18em",
              color: "rgba(255,255,255,0.2)",
              textTransform: "uppercase",
              marginBottom: 40,
            }}
          >
            Compliance-Status
          </p>
          <div style={{ border: "1px solid rgba(255,255,255,0.07)" }}>
            {COMPLIANCE.map((c, i) => (
              <div
                key={c.standard}
                style={{
                  display: "grid",
                  gridTemplateColumns: "200px 130px 1fr",
                  borderBottom: i < COMPLIANCE.length - 1 ? "1px solid rgba(255,255,255,0.05)" : "none",
                }}
              >
                <div
                  style={{
                    padding: "16px 24px",
                    fontFamily: "var(--font-space-grotesk, sans-serif)",
                    fontWeight: 700,
                    fontSize: "0.85rem",
                    color: "rgba(255,255,255,0.75)",
                    borderRight: "1px solid rgba(255,255,255,0.05)",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  {c.standard}
                </div>
                <div
                  style={{
                    padding: "16px 20px",
                    borderRight: "1px solid rgba(255,255,255,0.05)",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <span
                    style={{
                      fontFamily: "var(--font-jetbrains, monospace)",
                      fontSize: "0.52rem",
                      letterSpacing: "0.1em",
                      color: c.color,
                      border: `1px solid ${c.color}40`,
                      padding: "3px 8px",
                    }}
                  >
                    {c.status}
                  </span>
                </div>
                <div
                  style={{
                    padding: "16px 24px",
                    fontSize: "0.82rem",
                    color: "rgba(255,255,255,0.35)",
                    lineHeight: 1.5,
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  {c.note}
                </div>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div style={{ marginTop: 60, display: "flex", gap: 16, flexWrap: "wrap" }}>
            <Link
              href={`/${locale}/module/sicherheit`}
              style={{
                fontFamily: "var(--font-space-grotesk, sans-serif)",
                fontWeight: 700,
                fontSize: "0.82rem",
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                color: "#080E1A",
                background: "#00D4FF",
                padding: "13px 28px",
                textDecoration: "none",
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
              }}
            >
              Security Senate →
            </Link>
            <Link
              href={`/${locale}/eu-regulierung`}
              style={{
                fontFamily: "var(--font-space-grotesk, sans-serif)",
                fontWeight: 600,
                fontSize: "0.82rem",
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                color: "rgba(255,255,255,0.5)",
                border: "1px solid rgba(255,255,255,0.1)",
                padding: "13px 28px",
                textDecoration: "none",
              }}
            >
              EU-Regulierung
            </Link>
          </div>
        </section>

        <Footer />
      </div>
    </>
  );
}
