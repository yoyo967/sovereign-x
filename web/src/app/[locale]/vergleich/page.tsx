// src/app/[locale]/vergleich/page.tsx
// Vergleichsseite: SOVEREIGN 2030 vs. Alternativen
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
    title: "SOVEREIGN 2030 vs. ChatGPT, Notion AI, LexisNexis | Vergleich",
    description:
      "Detaillierter Vergleich: SOVEREIGN 2030 vs. ChatGPT, Notion AI, LexisNexis, MyRight und Standard-Rechtsberatung. Was macht ein souveränes Life-OS anders?",
    alternates: { canonical: `${BASE_URL}/${locale}/vergleich` },
    openGraph: {
      title: "SOVEREIGN vs. ChatGPT, Notion AI, LexisNexis | Vergleich",
      description: "Was macht ein souveränes Life-OS anders? 10 Kriterien, 4 Alternativen, ein klares Ergebnis.",
      url: `${BASE_URL}/${locale}/vergleich`,
      siteName: "SOVEREIGN 2030",
      images: [{ url: `${BASE_URL}/og/vergleich.png`, width: 1200, height: 630, alt: "SOVEREIGN 2030 Vergleich" }],
      locale: locale === "de" ? "de_DE" : "en_US",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: "SOVEREIGN vs. ChatGPT, Notion AI, MyRight | Vergleich",
      description: "8 von 8 Kriterien — kein Konkurrent kommt auch nur nah.",
      images: [`${BASE_URL}/og/vergleich.png`],
    },
  };
}

// ─── Comparison data ───────────────────────────────────
const CRITERIA = [
  { key: "ownership", label: "Dateneigentum", desc: "Wer besitzt und kontrolliert deine Daten?" },
  { key: "privacy", label: "Datenschutz", desc: "DSGVO-Konformität und EU-Server" },
  { key: "eu_ai", label: "EU AI Act", desc: "Konformität mit EU-KI-Regulierung" },
  { key: "audit", label: "Audit Trail", desc: "Transparenz über KI-Entscheidungen" },
  { key: "automation", label: "Autonome Aktionen", desc: "KI handelt proaktiv ohne manuelle Trigger" },
  { key: "legal", label: "Rechtsdomänen", desc: "Abgedeckte Rechtsbereiche" },
  { key: "finance", label: "Finanzanalyse", desc: "Proaktive Finanzkontrolle und Wealth Intelligence" },
  { key: "contracts", label: "Vertragsanalyse", desc: "Automatisierte Vertragsprüfung und -kündigung" },
  { key: "price", label: "Preismodell", desc: "Transparenz und Vorhersehbarkeit der Kosten" },
  { key: "exit", label: "Exit-Freiheit", desc: "Keine Abhängigkeiten, volle Datenportabilität" },
];

type Score = "full" | "partial" | "none" | "na";

interface Competitor {
  name: string;
  tagline: string;
  category: string;
  color: string;
  scores: Record<string, Score>;
  notes: Record<string, string>;
}

const COMPETITORS: Competitor[] = [
  {
    name: "SOVEREIGN 2030",
    tagline: "Autonomes Life-OS",
    category: "SOVEREIGN",
    color: "#00D4FF",
    scores: {
      ownership: "full", privacy: "full", eu_ai: "full", audit: "full",
      automation: "full", legal: "full", finance: "full", contracts: "full",
      price: "full", exit: "full",
    },
    notes: {
      ownership: "On-Device, EU-Server, vollständige Kontrolle",
      privacy: "DSGVO by Design, Frankfurt Server, kein Tracking",
      eu_ai: "Security Senate — vollständige Art.13-Konformität",
      audit: "100% kryptographisch dokumentiert",
      automation: "HITL/HOTL — du entscheidest den Grad",
      legal: "Vertragsrecht, Datenschutz, Verbraucherrecht, Finanzrecht",
      finance: "Wealth Twin, PSD2, Preiserhöhungs-Widerspruch",
      contracts: "Vollautomatisch mit menschlicher Kontrolle",
      price: "Festpreis, keine versteckten Gebühren",
      exit: "Daten-Export jederzeit, kein Lock-in",
    },
  },
  {
    name: "ChatGPT",
    tagline: "Allgemein-KI von OpenAI",
    category: "AI ASSISTANT",
    color: "#10A37F",
    scores: {
      ownership: "none", privacy: "none", eu_ai: "partial", audit: "none",
      automation: "partial", legal: "partial", finance: "partial", contracts: "partial",
      price: "partial", exit: "partial",
    },
    notes: {
      ownership: "OpenAI-Server (USA), Daten für Training verwendet",
      privacy: "Kein EU-Server-Standard, kein DSGVO by Design",
      eu_ai: "Gaia-X Initiative, aber keine vollständige Art.13-Konformität",
      audit: "Keine Erklärbarkeit der Entscheidungen",
      automation: "Nur auf explizite Anfrage, kein autonomes Handeln",
      legal: "Allgemeine Auskunft, keine Rechtsberatung",
      finance: "Auf Anfrage, keine PSD2-Integration",
      contracts: "Text-Analyse, keine automatische Aktion",
      price: "Usage-basiert, bei intensiver Nutzung unvorhersehbar",
      exit: "Kein strukturierter Daten-Export",
    },
  },
  {
    name: "Notion AI",
    tagline: "KI-Workspace-Tool",
    category: "PRODUCTIVITY",
    color: "#000000",
    scores: {
      ownership: "none", privacy: "partial", eu_ai: "none", audit: "none",
      automation: "partial", legal: "none", finance: "none", contracts: "partial",
      price: "partial", exit: "partial",
    },
    notes: {
      ownership: "Notion-Server (AWS USA), deine Daten gehören Notion",
      privacy: "EU-Daten-Residenz optional, aber nicht Standard",
      eu_ai: "Keine EU AI Act Compliance-Features",
      audit: "Keine KI-Audit-Funktion",
      automation: "Nur Workspace-Aufgaben, kein Lebens-OS",
      legal: "Kein Rechts-Feature",
      finance: "Kein Finanz-Feature",
      contracts: "Nur Text-Templates, keine Analyse",
      price: "Per-User SaaS, steigt mit Team-Größe",
      exit: "Export möglich, aber proprietäres Format",
    },
  },
  {
    name: "MyRight",
    tagline: "Legal-Tech für Verbraucher",
    category: "LEGAL TECH",
    color: "#E53E3E",
    scores: {
      ownership: "partial", privacy: "partial", eu_ai: "none", audit: "none",
      automation: "partial", legal: "partial", finance: "none", contracts: "partial",
      price: "none", exit: "partial",
    },
    notes: {
      ownership: "EU-basiert, aber Daten auf Anbieter-Server",
      privacy: "DSGVO-konform, aber kein Privacy by Design",
      eu_ai: "Keine EU AI Act Features",
      audit: "Keine KI-Audit-Funktion",
      automation: "Nur für spezifische Rechtsfälle",
      legal: "Fokus Flug- und Verbraucherrecht",
      finance: "Kein Finanz-Feature",
      contracts: "Nur für bestimmte Vertragstypen",
      price: "Erfolgsbasiert (oft 25-35% Provision)",
      exit: "Case-basiert, kein ganzheitliches Profil",
    },
  },
];

function ScoreIcon({ score }: { score: Score }) {
  if (score === "full") return <span style={{ color: "#00E676", fontSize: "1rem" }}>✓</span>;
  if (score === "partial") return <span style={{ color: "#FFA726", fontSize: "0.9rem" }}>◐</span>;
  if (score === "none") return <span style={{ color: "rgba(255,80,80,0.6)", fontSize: "0.9rem" }}>✗</span>;
  return <span style={{ color: "rgba(255,255,255,0.2)", fontSize: "0.8rem" }}>—</span>;
}

export default async function VergleichPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "Was unterscheidet SOVEREIGN 2030 von ChatGPT?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "ChatGPT ist ein allgemeiner KI-Assistent ohne DSGVO-Datenschutz, ohne EU AI Act Compliance und ohne autonome Lebens-OS-Funktionen. SOVEREIGN 2030 ist speziell für rechtliche, finanzielle und datenschutzrechtliche Autonomie gebaut — mit EU-Servern, vollständigem Audit Trail und proaktiven automatisierten Aktionen.",
        },
      },
      {
        "@type": "Question",
        name: "Ist SOVEREIGN 2030 ein Anwalt-Ersatz?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Nein. SOVEREIGN 2030 ist keine Rechtsberatung und kein Anwalt-Ersatz. Es ist ein autonomes System, das Informationen bereitstellt, Dokumente analysiert und Standardprozesse automatisiert — für komplexe individuelle Rechtsfragen empfehlen wir einen Fachanwalt.",
        },
      },
    ],
  };

  return (
    <>
      <JsonLd data={faqSchema} />
      <div style={{ background: "#080E1A", minHeight: "100vh" }}>
        <Navigation />
        <Breadcrumb locale={locale} items={[{ label: "Vergleich" }]} />

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
              <span style={{ color: "rgba(0,212,255,0.6)" }}>VERGLEICH</span>
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
              SOVEREIGN 2030{" "}
              <span style={{ color: "rgba(255,255,255,0.25)", fontWeight: 300 }}>vs.</span>{" "}
              <span style={{ color: "#00D4FF" }}>Alternativen</span>
            </h1>

            <p
              style={{
                fontSize: "1.05rem",
                lineHeight: 1.7,
                color: "rgba(255,255,255,0.45)",
                maxWidth: 620,
              }}
            >
              Was macht ein autonomes Life-OS anders als ChatGPT, Notion AI, Legal-Tech-Apps oder klassische Rechtsberatung? Ein ehrlicher Vergleich.
            </p>
          </div>
        </section>

        {/* ── LEGEND ───────────────────────────────────────── */}
        <div
          style={{
            background: "#0A1220",
            borderBottom: "1px solid rgba(255,255,255,0.05)",
            padding: "16px 24px",
          }}
        >
          <div
            style={{
              maxWidth: 960,
              margin: "0 auto",
              display: "flex",
              gap: 24,
              flexWrap: "wrap",
              alignItems: "center",
            }}
          >
            <span style={{ fontFamily: "var(--font-jetbrains, monospace)", fontSize: "0.55rem", letterSpacing: "0.12em", color: "rgba(255,255,255,0.2)", textTransform: "uppercase" }}>
              Legende:
            </span>
            {[
              { icon: "✓", label: "Vollständig", color: "#00E676" },
              { icon: "◐", label: "Eingeschränkt", color: "#FFA726" },
              { icon: "✗", label: "Nicht vorhanden", color: "rgba(255,80,80,0.7)" },
            ].map((l) => (
              <span key={l.label} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <span style={{ color: l.color, fontSize: "0.9rem" }}>{l.icon}</span>
                <span style={{ fontFamily: "var(--font-jetbrains, monospace)", fontSize: "0.6rem", color: "rgba(255,255,255,0.35)" }}>{l.label}</span>
              </span>
            ))}
          </div>
        </div>

        {/* ── COMPARISON TABLE ─────────────────────────────── */}
        <div style={{ maxWidth: 960, margin: "0 auto", padding: "60px 24px 120px", overflowX: "auto" }}>
          <div style={{ minWidth: 700 }}>
            {/* Header row */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: `200px repeat(${COMPETITORS.length}, 1fr)`,
                border: "1px solid rgba(255,255,255,0.07)",
                borderBottom: "none",
              }}
            >
              <div style={{ padding: "16px 20px", background: "rgba(255,255,255,0.01)" }} />
              {COMPETITORS.map((c, i) => (
                <div
                  key={c.name}
                  style={{
                    padding: "16px 20px",
                    borderLeft: "1px solid rgba(255,255,255,0.07)",
                    background: i === 0 ? "rgba(0,212,255,0.04)" : "rgba(255,255,255,0.01)",
                  }}
                >
                  <div
                    style={{
                      fontFamily: "var(--font-space-grotesk, sans-serif)",
                      fontWeight: 800,
                      fontSize: "0.88rem",
                      color: i === 0 ? "#00D4FF" : "rgba(255,255,255,0.65)",
                      marginBottom: 2,
                    }}
                  >
                    {c.name}
                  </div>
                  <div
                    style={{
                      fontFamily: "var(--font-jetbrains, monospace)",
                      fontSize: "0.5rem",
                      letterSpacing: "0.1em",
                      color: i === 0 ? "rgba(0,212,255,0.5)" : "rgba(255,255,255,0.2)",
                      textTransform: "uppercase",
                    }}
                  >
                    {c.category}
                  </div>
                </div>
              ))}
            </div>

            {/* Criteria rows */}
            {CRITERIA.map((criterion, ci) => (
              <div
                key={criterion.key}
                style={{
                  display: "grid",
                  gridTemplateColumns: `200px repeat(${COMPETITORS.length}, 1fr)`,
                  border: "1px solid rgba(255,255,255,0.07)",
                  borderBottom: ci < CRITERIA.length - 1 ? "none" : "1px solid rgba(255,255,255,0.07)",
                }}
              >
                {/* Criterion label */}
                <div
                  style={{
                    padding: "14px 20px",
                    background: "rgba(255,255,255,0.01)",
                  }}
                >
                  <div
                    style={{
                      fontFamily: "var(--font-space-grotesk, sans-serif)",
                      fontWeight: 600,
                      fontSize: "0.82rem",
                      color: "rgba(255,255,255,0.65)",
                      marginBottom: 2,
                    }}
                  >
                    {criterion.label}
                  </div>
                  <div style={{ fontSize: "0.68rem", color: "rgba(255,255,255,0.25)", lineHeight: 1.4 }}>
                    {criterion.desc}
                  </div>
                </div>

                {/* Scores */}
                {COMPETITORS.map((c, ci2) => (
                  <div
                    key={c.name}
                    style={{
                      padding: "14px 20px",
                      borderLeft: "1px solid rgba(255,255,255,0.06)",
                      background: ci2 === 0 ? "rgba(0,212,255,0.02)" : "transparent",
                    }}
                    title={c.notes[criterion.key]}
                  >
                    <div style={{ marginBottom: 4 }}>
                      <ScoreIcon score={c.scores[criterion.key]} />
                    </div>
                    <div
                      style={{
                        fontSize: "0.7rem",
                        color: ci2 === 0 ? "rgba(0,212,255,0.6)" : "rgba(255,255,255,0.25)",
                        lineHeight: 1.4,
                      }}
                    >
                      {c.notes[criterion.key]}
                    </div>
                  </div>
                ))}
              </div>
            ))}

            {/* Score summary row */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: `200px repeat(${COMPETITORS.length}, 1fr)`,
                border: "1px solid rgba(255,255,255,0.1)",
                borderTop: "2px solid rgba(255,255,255,0.08)",
                marginTop: -1,
              }}
            >
              <div
                style={{
                  padding: "16px 20px",
                  fontFamily: "var(--font-jetbrains, monospace)",
                  fontSize: "0.58rem",
                  letterSpacing: "0.12em",
                  color: "rgba(255,255,255,0.2)",
                  textTransform: "uppercase",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                Gesamt-Score
              </div>
              {COMPETITORS.map((c, ci2) => {
                const fullCount = CRITERIA.filter((cr) => c.scores[cr.key] === "full").length;
                const partialCount = CRITERIA.filter((cr) => c.scores[cr.key] === "partial").length;
                const score = fullCount + partialCount * 0.5;
                return (
                  <div
                    key={c.name}
                    style={{
                      padding: "16px 20px",
                      borderLeft: "1px solid rgba(255,255,255,0.07)",
                      background: ci2 === 0 ? "rgba(0,212,255,0.06)" : "transparent",
                    }}
                  >
                    <div
                      style={{
                        fontFamily: "var(--font-space-grotesk, sans-serif)",
                        fontWeight: 900,
                        fontSize: "1.4rem",
                        color: ci2 === 0 ? "#00D4FF" : "rgba(255,255,255,0.25)",
                        lineHeight: 1,
                      }}
                    >
                      {score}/{CRITERIA.length}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Disclaimer */}
          <p
            style={{
              marginTop: 24,
              fontSize: "0.75rem",
              color: "rgba(255,255,255,0.2)",
              lineHeight: 1.6,
            }}
          >
            * Dieser Vergleich basiert auf öffentlich verfügbaren Informationen (Stand: April 2025) und der eigenen Einschätzung des SOVEREIGN-Teams. Keine Rechtsberatung. SOVEREIGN 2030 ist kein Anwalt-Ersatz.
          </p>

          {/* CTA */}
          <div
            style={{
              marginTop: 60,
              textAlign: "center",
              padding: "60px 0",
              borderTop: "1px solid rgba(255,255,255,0.05)",
            }}
          >
            <h2
              style={{
                fontFamily: "var(--font-space-grotesk, sans-serif)",
                fontWeight: 900,
                fontSize: "clamp(1.8rem, 4vw, 2.8rem)",
                color: "#F0F4FF",
                letterSpacing: "-0.02em",
                marginBottom: 16,
              }}
            >
              Bereit für das{" "}
              <span style={{ color: "#00D4FF" }}>echte OS</span>?
            </h2>
            <p
              style={{
                fontSize: "0.95rem",
                color: "rgba(255,255,255,0.4)",
                marginBottom: 32,
              }}
            >
              10/10 Kriterien erfüllt. Starte kostenlos.
            </p>
            <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
              <Link
                href="/dashboard"
                style={{
                  fontFamily: "var(--font-space-grotesk, sans-serif)",
                  fontWeight: 700,
                  fontSize: "0.85rem",
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  color: "#080E1A",
                  background: "#00D4FF",
                  padding: "14px 32px",
                  textDecoration: "none",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                }}
              >
                Kostenlos starten →
              </Link>
              <Link
                href={`/${locale}/module`}
                style={{
                  fontFamily: "var(--font-space-grotesk, sans-serif)",
                  fontWeight: 700,
                  fontSize: "0.85rem",
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  color: "rgba(255,255,255,0.5)",
                  border: "1px solid rgba(255,255,255,0.12)",
                  padding: "14px 32px",
                  textDecoration: "none",
                }}
              >
                Module entdecken
              </Link>
            </div>
          </div>
        </div>

        <Footer />
      </div>
    </>
  );
}
