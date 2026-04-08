// src/app/[locale]/roadmap/page.tsx
// ═══════════════════════════════════════════════════════════════
// SOVEREIGN ROADMAP 2025–2030 — Detaillierte Standalone-Seite
// Blueprint Dark / Server Component / Vollständige Phase-Details
// ═══════════════════════════════════════════════════════════════
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
    title: "Roadmap 2025–2030 | SOVEREIGN 2030 — Das Leben-OS",
    description:
      "Von Foundation OS bis European Sovereign Grid: Die vollständige SOVEREIGN-Roadmap — Phase I bis IV, 40+ Features, quartalsweise geplant.",
    alternates: { canonical: `${BASE_URL}/${locale}/roadmap` },
    openGraph: {
      title: "Roadmap 2025–2030 | SOVEREIGN 2030",
      description: "Phase I: Live. Phase IV: 2030. Der vollständige Plan zur digitalen Souveränität.",
      url: `${BASE_URL}/${locale}/roadmap`,
      siteName: "SOVEREIGN 2030",
      images: [{ url: `${BASE_URL}/og/roadmap.png`, width: 1200, height: 630, alt: "SOVEREIGN Roadmap 2030" }],
      locale: locale === "de" ? "de_DE" : "en_US",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: "Roadmap 2025–2030 | SOVEREIGN 2030",
      description: "Phase I: Live. Phase IV: 2030. Der vollständige Plan.",
      images: [`${BASE_URL}/og/roadmap.png`],
    },
  };
}

// ─── Timeline Quartale ────────────────────────────────────────
const PHASES = [
  {
    phase: "PHASE I",
    title: "Foundation OS",
    period: "Q1–Q2 2025",
    status: "LIVE" as const,
    statusColor: "#00E676",
    description:
      "Das Kern-OS ist live. Privacy Guardian, Sovereign Twin und Execution Center sind deployed. Erste Sovereign Citizens im Early Access mit vollständiger DSGVO- und EU AI Act-Compliance.",
    quarters: [
      {
        q: "Q1 2025",
        features: [
          { name: "Privacy Guardian v1.0", desc: "Vollautomatische DSGVO-Auskunftsanträge, Widerspruchsmanagement, Einwilligungsentzug", status: "live" },
          { name: "Execution Center", desc: "Vertragsanalyse, Fristen-Engine, automatische Kündigungsschreiben", status: "live" },
          { name: "Sovereign Twin (Beta)", desc: "Digitales Datenprofil, Auskunftszusammenführung, Soll-Ist-Analyse", status: "live" },
          { name: "Dashboard v1.0", desc: "Multi-Modul-Übersicht, Benachrichtigungen, Dokumenten-Upload", status: "live" },
        ],
      },
      {
        q: "Q2 2025",
        features: [
          { name: "EU AI Act Compliance Layer", desc: "Automatische Klassifizierung aller KI-Interaktionen, Transparenz-Reporting", status: "live" },
          { name: "Security Senate v1.0", desc: "Datenleck-Monitoring, Passwort-Audit, Breach-Alerts", status: "live" },
          { name: "Early Access Programm", desc: "3.200+ Sovereign Citizens, Community-Feedback-Schleife", status: "live" },
          { name: "Mobile Web (PWA)", desc: "Progressive Web App, Push-Notifications, Offline-Grundfunktionen", status: "live" },
        ],
      },
    ],
    modules: ["Privacy Guardian", "Execution Center", "Sovereign Twin", "Security Senate"],
  },
  {
    phase: "PHASE II",
    title: "Intelligence Layer",
    period: "Q3–Q4 2025",
    status: "IN DEV" as const,
    statusColor: "#00D4FF",
    description:
      "Der Intelligence Layer erweitert das OS um KI-gestützte Analyse, proaktive Alerts und autonome Agent-Workflows. SOVEREIGN handelt — ohne manuellen Trigger.",
    quarters: [
      {
        q: "Q3 2025",
        features: [
          { name: "Proaktive Regulierungs-Alerts", desc: "Echtzeit-Monitoring EU-Gesetzgebung, automatische Impact-Analyse für deinen Stack", status: "dev" },
          { name: "Wealth Twin Beta", desc: "Finanzautonomie-Modul: Budget-Analyse, Abo-Optimierung, Investitionsübersicht", status: "dev" },
          { name: "Legal Intelligence Engine", desc: "KI-gestützte Rechtsfragen, §-Recherche, Musterbrief-Generator 2.0", status: "dev" },
          { name: "Security Senate v2.0", desc: "EU AI Act Audit-Tool, Hochrisiko-KI-Erkennung, FRIA-Unterstützung", status: "dev" },
        ],
      },
      {
        q: "Q4 2025",
        features: [
          { name: "Autonome Agents", desc: "SOVEREIGN handelt selbstständig: Fristen-Kündigung, Widerspruch, Auskunft — nach einmaliger Genehmigung", status: "roadmap" },
          { name: "API-Zugang (Developer Preview)", desc: "REST-API für Entwickler, Webhook-Support, OAuth 2.0", status: "roadmap" },
          { name: "Integration Hub", desc: "Native Verbindung zu Bank-APIs (PSD2/finAPI), E-Mail-Parsing, PDF-Analyse", status: "roadmap" },
          { name: "Reporting Engine", desc: "Monatlicher Souveränitäts-Report, Zeitreihen, Export als PDF/CSV", status: "roadmap" },
        ],
      },
    ],
    modules: ["Wealth Twin", "Legal Intelligence", "Security Senate v2", "Autonomous Agents"],
  },
  {
    phase: "PHASE III",
    title: "Sovereign Network",
    period: "2026",
    status: "ROADMAP" as const,
    statusColor: "#BB86FC",
    description:
      "Das Netzwerk-Layer verbindet Sovereign Citizens. Geteilte Intelligence, kollektive Verhandlungsmacht und Gruppen-Compliance für Familien, Teams und Unternehmen.",
    quarters: [
      {
        q: "Q1–Q2 2026",
        features: [
          { name: "Family Intelligence", desc: "Mehrgenerationen-Profil: Eltern, Kinder, Großeltern in einem Souveränitäts-OS", status: "roadmap" },
          { name: "Business Module (KMU)", desc: "Vertrags-Management für Teams, Mitarbeiter-Datenschutz, B2B-Compliance", status: "roadmap" },
          { name: "Kollektive DSGVO-Anfragen", desc: "Eine Anfrage — 100 Sovereign Citizens. Maximaler Druck, minimaler Aufwand", status: "roadmap" },
          { name: "Sovereign Network (Beta)", desc: "P2P-Wissensaustausch, anonymisierte Datenmarktplatz-Opt-in, Community-Alerts", status: "roadmap" },
        ],
      },
      {
        q: "Q3–Q4 2026",
        features: [
          { name: "Enterprise White-Label", desc: "SOVEREIGN als Weißlabel für Versicherungen, Banken und HR-Systeme", status: "roadmap" },
          { name: "SOVEREIGN SDK", desc: "Open-Source-Komponenten für Entwickler — eigene Module bauen", status: "roadmap" },
          { name: "Bildungs-Modul", desc: "Interaktive Kurse: Datenschutz, Vertragsrecht, Finanzautonomie", status: "roadmap" },
          { name: "Multi-Language Full Support", desc: "10 EU-Sprachen vollständig — nicht nur DE/EN", status: "roadmap" },
        ],
      },
    ],
    modules: ["Family Intelligence", "Business Module", "Sovereign Network", "SOVEREIGN SDK"],
  },
  {
    phase: "PHASE IV",
    title: "2030 Standard",
    period: "2027–2030",
    status: "VISION" as const,
    statusColor: "rgba(255,255,255,0.3)",
    description:
      "Das vollständige SOVEREIGN 2030 OS — selbstständig lernend, vorausschauend handelnd, europäischer Standard für digitale Souveränität. 1 Million Sovereign Citizens.",
    quarters: [
      {
        q: "2027–2028",
        features: [
          { name: "Predictive Sovereignty", desc: "Proaktive Rechtsdurchsetzung: SOVEREIGN erkennt Probleme, bevor sie entstehen", status: "vision" },
          { name: "European Sovereign Grid", desc: "Föderierte EU-Infrastruktur — kein Single Point of Failure, volle Datensouveränität", status: "vision" },
          { name: "Open Sovereign Protocol", desc: "Offener Standard für souveräne digitale Identität — interoperabel mit EU-Wallet", status: "vision" },
          { name: "SOVEREIGN DAO", desc: "Dezentrale Governance — Sovereign Citizens entscheiden über Features und Prioritäten", status: "vision" },
        ],
      },
      {
        q: "2029–2030",
        features: [
          { name: "EU-Regulierung Real-time", desc: "Alle EU-Gesetze in Echtzeit übersetzt in persönliche Handlungsempfehlungen", status: "vision" },
          { name: "Sovereign Identity (Self-Sovereign)", desc: "Vollständige digitale Identität ohne zentrale Abhängigkeit — W3C DID kompatibel", status: "vision" },
          { name: "1M Sovereign Citizens", desc: "Kritische Masse für kollektive Verhandlungsmacht gegenüber Tech-Konzernen", status: "vision" },
          { name: "SOVEREIGN OS v10.0", desc: "Das vollständige Life-OS: Gesundheit, Finanzen, Recht, Datenschutz — integriert", status: "vision" },
        ],
      },
    ],
    modules: ["Predictive Sovereignty", "EU Grid", "Open Protocol", "SOVEREIGN OS v10"],
  },
];

const STATUS_LABELS: Record<string, string> = {
  live: "LIVE",
  dev: "IN DEV",
  roadmap: "ROADMAP",
  vision: "VISION",
};

const STATUS_COLORS: Record<string, string> = {
  live: "#00E676",
  dev: "#00D4FF",
  roadmap: "#BB86FC",
  vision: "rgba(255,255,255,0.3)",
};

// ─── Schema.org ───────────────────────────────────────────────
const ROADMAP_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: "SOVEREIGN 2030 Roadmap",
  description: "Die vollständige Entwicklungs-Roadmap von SOVEREIGN 2030 — Phase I bis IV, 2025 bis 2030",
  url: `${BASE_URL}/de/roadmap`,
  publisher: {
    "@type": "Organization",
    name: "SOVEREIGN 2030",
    url: BASE_URL,
  },
};

// ─── Page ─────────────────────────────────────────────────────
export default async function RoadmapPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  return (
    <>
      <JsonLd data={ROADMAP_SCHEMA} />
      <div style={{ minHeight: "100vh", background: "#080E1A", color: "#F0F4FF" }}>
        <Navigation />
        <Breadcrumb locale={locale} items={[{ label: "Roadmap 2030" }]} />

        {/* ── Hero ── */}
        <div
          style={{
            padding: "8rem 1.5rem 4rem",
            maxWidth: 900,
            margin: "0 auto",
            textAlign: "center",
          }}
        >
          <p
            style={{
              fontFamily: "var(--font-jetbrains, monospace)",
              fontSize: "0.6rem",
              letterSpacing: "0.18em",
              color: "rgba(0,212,255,0.55)",
              textTransform: "uppercase",
              marginBottom: "1.5rem",
            }}
          >
            SOVEREIGN 2030 — PRODUCT ROADMAP
          </p>
          <h1
            style={{
              fontFamily: "var(--font-space-grotesk, sans-serif)",
              fontWeight: 900,
              fontSize: "clamp(2.5rem, 6vw, 4.5rem)",
              letterSpacing: "-0.03em",
              lineHeight: 1.05,
              color: "#F0F4FF",
              marginBottom: "1.5rem",
            }}
          >
            Von Foundation OS
            <br />
            <span style={{ color: "rgba(0,212,255,0.85)" }}>zum 2030 Standard</span>
          </h1>
          <p
            style={{
              fontSize: "1.1rem",
              color: "rgba(255,255,255,0.5)",
              lineHeight: 1.7,
              maxWidth: 600,
              margin: "0 auto 2.5rem",
            }}
          >
            4 Phasen. 40+ Features. 1 Ziel: Das vollständige Life-OS für digitale Souveränität —
            europäischer Standard bis 2030.
          </p>

          {/* Phase status badges */}
          <div
            style={{
              display: "flex",
              gap: "1rem",
              justifyContent: "center",
              flexWrap: "wrap",
            }}
          >
            {PHASES.map((p) => (
              <a
                key={p.phase}
                href={`#${p.phase.toLowerCase().replace(" ", "-")}`}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  padding: "0.5rem 1rem",
                  border: `1px solid ${p.statusColor}30`,
                  background: `${p.statusColor}08`,
                  textDecoration: "none",
                  fontSize: "0.78rem",
                  fontFamily: "var(--font-jetbrains, monospace)",
                  letterSpacing: "0.06em",
                  color: p.statusColor,
                }}
              >
                <span
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: "50%",
                    background: p.statusColor,
                    flexShrink: 0,
                  }}
                />
                {p.phase} · {p.status}
              </a>
            ))}
          </div>
        </div>

        {/* ── Phase Sections ── */}
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 1.5rem 6rem" }}>
          {PHASES.map((phase, phaseIdx) => (
            <div
              key={phase.phase}
              id={phase.phase.toLowerCase().replace(" ", "-")}
              style={{
                marginBottom: "5rem",
                scrollMarginTop: "5rem",
              }}
            >
              {/* Phase header */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr auto",
                  gap: "1rem",
                  alignItems: "start",
                  padding: "2rem",
                  border: `1px solid ${phase.statusColor}20`,
                  background: `${phase.statusColor}04`,
                  marginBottom: "2rem",
                }}
              >
                <div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "1rem",
                      marginBottom: "0.75rem",
                      flexWrap: "wrap",
                    }}
                  >
                    <span
                      style={{
                        fontFamily: "var(--font-jetbrains, monospace)",
                        fontSize: "0.62rem",
                        letterSpacing: "0.12em",
                        color: phase.statusColor,
                        border: `1px solid ${phase.statusColor}40`,
                        padding: "3px 10px",
                      }}
                    >
                      {phase.phase}
                    </span>
                    <span
                      style={{
                        fontFamily: "var(--font-jetbrains, monospace)",
                        fontSize: "0.58rem",
                        letterSpacing: "0.1em",
                        color: "rgba(255,255,255,0.3)",
                      }}
                    >
                      {phase.period}
                    </span>
                    <span
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 5,
                        fontFamily: "var(--font-jetbrains, monospace)",
                        fontSize: "0.56rem",
                        letterSpacing: "0.1em",
                        color: phase.statusColor,
                      }}
                    >
                      <span
                        style={{
                          width: 5,
                          height: 5,
                          borderRadius: "50%",
                          background: phase.statusColor,
                          ...(phase.status === "LIVE"
                            ? { animation: "pulse 2s ease-in-out infinite" }
                            : {}),
                        }}
                      />
                      {phase.status}
                    </span>
                  </div>
                  <h2
                    style={{
                      fontFamily: "var(--font-space-grotesk, sans-serif)",
                      fontWeight: 800,
                      fontSize: "clamp(1.5rem, 3vw, 2.2rem)",
                      color: "#F0F4FF",
                      letterSpacing: "-0.02em",
                      marginBottom: "0.75rem",
                    }}
                  >
                    {phase.title}
                  </h2>
                  <p
                    style={{
                      fontSize: "0.92rem",
                      color: "rgba(255,255,255,0.5)",
                      lineHeight: 1.7,
                      maxWidth: 680,
                    }}
                  >
                    {phase.description}
                  </p>
                </div>
                {/* Module tags */}
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "0.4rem",
                    minWidth: 160,
                  }}
                >
                  {phase.modules.map((mod) => (
                    <span
                      key={mod}
                      style={{
                        fontFamily: "var(--font-jetbrains, monospace)",
                        fontSize: "0.58rem",
                        letterSpacing: "0.06em",
                        color: "rgba(255,255,255,0.3)",
                        border: "1px solid rgba(255,255,255,0.06)",
                        padding: "3px 8px",
                        textAlign: "center",
                      }}
                    >
                      {mod}
                    </span>
                  ))}
                </div>
              </div>

              {/* Quarters */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(420px, 1fr))",
                  gap: "1.5rem",
                }}
              >
                {phase.quarters.map((quarter) => (
                  <div
                    key={quarter.q}
                    style={{
                      border: "1px solid rgba(255,255,255,0.06)",
                      background: "rgba(255,255,255,0.015)",
                    }}
                  >
                    {/* Quarter header */}
                    <div
                      style={{
                        padding: "0.75rem 1.25rem",
                        borderBottom: "1px solid rgba(255,255,255,0.06)",
                        background: "rgba(255,255,255,0.02)",
                      }}
                    >
                      <span
                        style={{
                          fontFamily: "var(--font-jetbrains, monospace)",
                          fontSize: "0.62rem",
                          letterSpacing: "0.1em",
                          color: phase.statusColor,
                        }}
                      >
                        {quarter.q}
                      </span>
                    </div>

                    {/* Features */}
                    <div style={{ padding: "0.5rem 0" }}>
                      {quarter.features.map((feature, fi) => (
                        <div
                          key={fi}
                          style={{
                            display: "grid",
                            gridTemplateColumns: "auto 1fr auto",
                            gap: "0.75rem",
                            padding: "0.85rem 1.25rem",
                            borderBottom:
                              fi < quarter.features.length - 1
                                ? "1px solid rgba(255,255,255,0.04)"
                                : "none",
                            alignItems: "start",
                          }}
                        >
                          {/* Status dot */}
                          <span
                            style={{
                              width: 7,
                              height: 7,
                              borderRadius: "50%",
                              background: STATUS_COLORS[feature.status],
                              flexShrink: 0,
                              marginTop: 5,
                            }}
                          />
                          <div>
                            <div
                              style={{
                                fontSize: "0.88rem",
                                fontWeight: 700,
                                color: "rgba(255,255,255,0.85)",
                                marginBottom: "0.2rem",
                              }}
                            >
                              {feature.name}
                            </div>
                            <div
                              style={{
                                fontSize: "0.78rem",
                                color: "rgba(255,255,255,0.38)",
                                lineHeight: 1.55,
                              }}
                            >
                              {feature.desc}
                            </div>
                          </div>
                          <span
                            style={{
                              fontFamily: "var(--font-jetbrains, monospace)",
                              fontSize: "0.5rem",
                              letterSpacing: "0.08em",
                              color: STATUS_COLORS[feature.status],
                              border: `1px solid ${STATUS_COLORS[feature.status]}30`,
                              padding: "2px 6px",
                              whiteSpace: "nowrap",
                              alignSelf: "start",
                            }}
                          >
                            {STATUS_LABELS[feature.status]}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* Connector line (not for last) */}
              {phaseIdx < PHASES.length - 1 && (
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    padding: "2.5rem 0 0",
                  }}
                >
                  <div
                    style={{
                      width: 1,
                      height: 48,
                      background: `linear-gradient(to bottom, ${phase.statusColor}40, ${PHASES[phaseIdx + 1].statusColor}20)`,
                    }}
                  />
                </div>
              )}
            </div>
          ))}

          {/* ── Notify CTA ── */}
          <div
            style={{
              padding: "3rem 2.5rem",
              border: "1px solid rgba(0,212,255,0.15)",
              background: "rgba(0,212,255,0.02)",
              textAlign: "center",
              maxWidth: 680,
              margin: "2rem auto 0",
            }}
          >
            <p
              style={{
                fontFamily: "var(--font-jetbrains, monospace)",
                fontSize: "0.6rem",
                letterSpacing: "0.14em",
                color: "rgba(0,212,255,0.5)",
                marginBottom: "0.75rem",
                textTransform: "uppercase",
              }}
            >
              Sovereign Citizens Updates
            </p>
            <h2
              style={{
                fontFamily: "var(--font-space-grotesk, sans-serif)",
                fontWeight: 800,
                fontSize: "clamp(1.3rem, 3vw, 1.8rem)",
                color: "#F0F4FF",
                letterSpacing: "-0.02em",
                lineHeight: 1.2,
                marginBottom: "0.75rem",
              }}
            >
              Sei dabei, wenn Phase II startet.
            </h2>
            <p
              style={{
                fontSize: "0.9rem",
                color: "rgba(255,255,255,0.4)",
                maxWidth: 440,
                margin: "0 auto 2rem",
                lineHeight: 1.65,
              }}
            >
              Erhalte als Early Access Citizen sofortigen Zugang zu jedem neuen Feature —
              Phase II Intelligence Layer startet Q3 2025.
            </p>
            <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
              <Link href={`/${locale}/dashboard`} className="lp-btn-primary">
                Early Access starten
              </Link>
              <Link
                href={`/${locale}/manifesto`}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  padding: "0.75rem 1.5rem",
                  border: "1px solid rgba(255,255,255,0.12)",
                  color: "rgba(255,255,255,0.6)",
                  textDecoration: "none",
                  fontSize: "0.88rem",
                  fontFamily: "var(--font-space-grotesk, sans-serif)",
                  fontWeight: 600,
                }}
              >
                Das Manifest lesen
              </Link>
            </div>
          </div>

          {/* ── Stats ── */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
              gap: "1px",
              background: "rgba(255,255,255,0.06)",
              border: "1px solid rgba(255,255,255,0.06)",
              marginTop: "3rem",
            }}
          >
            {[
              { value: "4", label: "Entwicklungsphasen" },
              { value: "40+", label: "geplante Features" },
              { value: "2025", label: "Phase I live" },
              { value: "2030", label: "Vollständiges OS" },
            ].map((stat) => (
              <div
                key={stat.label}
                style={{
                  padding: "2rem 1.5rem",
                  background: "#080E1A",
                  textAlign: "center",
                }}
              >
                <div
                  style={{
                    fontFamily: "var(--font-space-grotesk, sans-serif)",
                    fontWeight: 900,
                    fontSize: "2rem",
                    color: "rgba(0,212,255,0.8)",
                    letterSpacing: "-0.02em",
                  }}
                >
                  {stat.value}
                </div>
                <div
                  style={{
                    fontFamily: "var(--font-jetbrains, monospace)",
                    fontSize: "0.58rem",
                    letterSpacing: "0.1em",
                    color: "rgba(255,255,255,0.3)",
                    marginTop: "0.3rem",
                    textTransform: "uppercase",
                  }}
                >
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        <Footer />
      </div>
    </>
  );
}
