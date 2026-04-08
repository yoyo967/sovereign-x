// src/app/[locale]/eu-regulierung/page.tsx
// ═══════════════════════════════════════════════════════════════
// EU REGULATIONS HUB — DSGVO · DSA · DMA · EU AI Act · Data Act
// Blueprint Dark / Server Component / Schema.org FAQPage
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
    title: "EU-Regulierung 2024–2030 | DSGVO · DSA · DMA · EU AI Act | SOVEREIGN 2030",
    description:
      "Die 5 EU-Gesetze, die dein digitales Leben und Unternehmen verändern. DSGVO, DSA, DMA, EU AI Act und Data Act — verständlich erklärt mit Compliance-Checklisten.",
    alternates: { canonical: `${BASE_URL}/${locale}/eu-regulierung` },
    openGraph: {
      title: "EU-Regulierung 2024–2030 | SOVEREIGN 2030",
      description: "DSGVO, DSA, DMA, EU AI Act und Data Act — verständlich erklärt mit Compliance-Checklisten.",
      url: `${BASE_URL}/${locale}/eu-regulierung`,
      siteName: "SOVEREIGN 2030",
      images: [{ url: `${BASE_URL}/og/eu-regulierung.png`, width: 1200, height: 630, alt: "EU-Regulierung Hub" }],
      locale: locale === "de" ? "de_DE" : "en_US",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: "EU-Regulierung 2024–2030 | SOVEREIGN 2030",
      description: "Die 5 EU-Gesetze, die dein digitales Leben verändern.",
      images: [`${BASE_URL}/og/eu-regulierung.png`],
    },
  };
}

// ─── Regulation data ──────────────────────────────────────────
const REGULATIONS = [
  {
    id: "dsgvo",
    code: "REG-001",
    short: "DSGVO",
    full: "Datenschutz-Grundverordnung",
    year: "2018",
    status: "IN FORCE",
    statusColor: "#00E676",
    layer: "PRIVACY",
    emoji: "🛡️",
    penalty: "4% Jahresumsatz",
    description:
      "Die DSGVO schützt personenbezogene Daten aller EU-Bürger und gilt für jedes Unternehmen weltweit, das EU-Bürger verarbeitet. Auskunftsrechte, Löschpflichten und Einwilligungsmanagement sind Pflicht.",
    keyRights: [
      "Recht auf Auskunft (Art. 15)",
      "Recht auf Löschung / Vergessenwerden (Art. 17)",
      "Recht auf Datenübertragbarkeit (Art. 20)",
      "Einwilligung muss freiwillig, informiert, spezifisch sein",
      "Privacy by Design & Default (Art. 25)",
    ],
    businessImpact: [
      "Datenschutzerklärung auf jeder Website Pflicht",
      "Cookie-Consent-Banner korrekt implementieren",
      "Auftragsverarbeitungsvertrag mit allen Dienstleistern",
      "Datenschutzbeauftragter ab 20+ Mitarbeiter mit Datenzugang",
    ],
    sovereignSolution: "Privacy Guardian",
    sovereignSlug: "privacy-guardian",
    faq: [
      { q: "Gilt die DSGVO auch für kleine Unternehmen?", a: "Ja, die DSGVO gilt grundsätzlich für alle Unternehmen, die personenbezogene Daten von EU-Bürgern verarbeiten — unabhängig von Größe oder Standort." },
      { q: "Was kostet ein DSGVO-Verstoß?", a: "Bis zu 20 Millionen Euro oder 4% des weltweiten Jahresumsatzes, je nachdem was höher ist." },
    ],
  },
  {
    id: "dsa",
    code: "REG-002",
    short: "DSA",
    full: "Digital Services Act",
    year: "2023",
    status: "IN FORCE",
    statusColor: "#00E676",
    layer: "PLATFORM",
    emoji: "🌐",
    penalty: "6% Jahresumsatz",
    description:
      "Der DSA reguliert digitale Plattformen und schafft ein sichereres Online-Umfeld. Große Plattformen müssen Risiken durch illegale Inhalte, Desinformation und Algorithmus-Transparenz aktiv managen.",
    keyRights: [
      "Recht auf transparente algorithmische Empfehlungen",
      "Opt-out von Profilbildung für Werbezwecke",
      "Keine Werbung für Minderjährige auf Basis sensibler Daten",
      "Erklärung warum bestimmte Inhalte angezeigt werden",
      "Effektive Beschwerde- und Abhilfemechanismen",
    ],
    businessImpact: [
      "Sehr große Plattformen (>45M EU-Nutzer): erweiterte Pflichten",
      "Jahresberichte über Content-Moderation-Maßnahmen",
      "Unabhängige Audits für systemische Risiken",
      "API-Zugang für Forscher",
    ],
    sovereignSolution: "Audit Trail",
    sovereignSlug: "audit-trail",
    faq: [
      { q: "Betrifft der DSA nur große Plattformen?", a: "Nein, aber kleinere Plattformen haben weniger strenge Pflichten. Sehr große Online-Plattformen (VLOPs) und Suchmaschinen (VLOSEs) tragen die schwersten Compliance-Lasten." },
      { q: "Wann gilt der DSA vollständig?", a: "Der DSA gilt seit Februar 2024 für alle Dienste. Sehr große Plattformen mussten bereits ab August 2023 comply sein." },
    ],
  },
  {
    id: "dma",
    code: "REG-003",
    short: "DMA",
    full: "Digital Markets Act",
    year: "2023",
    status: "IN FORCE",
    statusColor: "#00E676",
    layer: "MARKETS",
    emoji: "⚖️",
    penalty: "10–20% Jahresumsatz",
    description:
      "Der DMA zielt auf sogenannte Gatekeeper — Apple, Google, Meta, Amazon — und soll faire digitale Märkte schaffen. Interoperabilität, Datenportabilität und das Verbot von Self-Preferencing stehen im Fokus.",
    keyRights: [
      "Datenportabilität zu konkurrierenden Diensten",
      "Interoperabilität von Messaging-Diensten",
      "Keine Bevorzugung eigener Dienste durch Gatekeeper",
      "Transparenz über Preisgestaltung und Ranking",
      "Vorabgenehmigungspflicht für Übernahmen",
    ],
    businessImpact: [
      "Gatekeeper: Apple, Alphabet, Meta, Amazon, Microsoft, ByteDance",
      "App-Store-Pflicht zur Sideloading-Erlaubnis (iOS)",
      "Browser-Auswahlbildschirm muss angeboten werden",
      "Nutzerdaten dürfen nicht plattformübergreifend ohne Einwilligung kombiniert werden",
    ],
    sovereignSolution: "Sovereign Twin",
    sovereignSlug: "sovereign-twin",
    faq: [
      { q: "Was ist ein Gatekeeper im Sinne des DMA?", a: "Plattformen mit >45M monatlichen Nutzern in der EU, >10.000 jährlichen Geschäftsnutzern und einem Marktwert von >75 Mrd. Euro werden als Gatekeeper klassifiziert." },
      { q: "Was ändert sich konkret für mich als Nutzer?", a: "Du kannst App-Stores wechseln, Messaging-Apps interoperabel nutzen und siehst keine manipulierten Suchergebnisse mehr zugunsten eigener Google/Apple-Produkte." },
    ],
  },
  {
    id: "eu-ai-act",
    code: "REG-004",
    short: "EU AI Act",
    full: "Artificial Intelligence Act",
    year: "2024–2026",
    status: "ROLLOUT",
    statusColor: "#FFA726",
    layer: "AI GOVERNANCE",
    emoji: "🤖",
    penalty: "7% Jahresumsatz",
    description:
      "Das weltweit erste umfassende KI-Gesetz. Hochrisiko-KI-Systeme benötigen menschliche Aufsicht, Transparenz und Dokumentation. Verbotene KI-Praktiken wie Social Scoring sind sofort unzulässig.",
    keyRights: [
      "Recht auf Erklärung bei KI-Entscheidungen (Hochrisiko)",
      "Kein biometrisches Real-Time-Surveillance in der Öffentlichkeit",
      "Kein Social Scoring durch staatliche Stellen",
      "Watermarking von KI-generierten Inhalten",
      "Registrierungspflicht für Hochrisiko-KI in EU-Datenbank",
    ],
    businessImpact: [
      "Verbotene Praktiken: seit 2.2.2025 wirksam",
      "GPAI-Modellpflichten: ab August 2025",
      "Hochrisiko-Systeme: vollständig ab August 2026",
      "KI-Kompetenznachweis für Mitarbeiter erforderlich",
    ],
    sovereignSolution: "Security Senate",
    sovereignSlug: "sicherheit",
    faq: [
      { q: "Welche KI-Systeme gelten als Hochrisiko?", a: "KI in kritischer Infrastruktur, Bildung, Beschäftigung, Kreditvergabe, Strafverfolgung, Migrations- und Asylentscheidungen sowie KI-gestützte Medizinprodukte." },
      { q: "Gilt der EU AI Act für Open-Source-KI?", a: "Eingeschränkt. Open-Source-Modelle sind weitgehend ausgenommen, außer sie werden als Hochrisiko-System eingesetzt." },
    ],
  },
  {
    id: "data-act",
    code: "REG-005",
    short: "Data Act",
    full: "Europäischer Datengesetz",
    year: "2025",
    status: "COMING SOON",
    statusColor: "#BB86FC",
    layer: "DATA RIGHTS",
    emoji: "📊",
    penalty: "bis 20M €",
    description:
      "Der Data Act regelt den Zugang zu und die Nutzung von Daten aus vernetzten Produkten (IoT) und Diensten. Nutzer haben Anspruch auf ihre eigenen Gerätedaten — auch gegenüber Herstellern.",
    keyRights: [
      "Zugang zu Daten aus vernetzten Produkten (Autos, Smart Home, Wearables)",
      "Recht auf Datenübertragung an Drittanbieter",
      "Fairere Datenteilungspflichten für Unternehmen",
      "Schutz von Geschäftsgeheimnissen bei Datenweitergabe",
      "Öffentlicher Sektor kann in Notlagen auf private Daten zugreifen",
    ],
    businessImpact: [
      "IoT-Hersteller müssen Datenportierbarkeit einbauen",
      "Cloudanbieter: erleichterte Anbieterwechsel (Switching)",
      "Standardvertragsklauseln für B2B-Datenweitergabe",
      "Gültig ab: September 2025",
    ],
    sovereignSolution: "Finanzautonomie",
    sovereignSlug: "finanzautonomie",
    faq: [
      { q: "Was genau sind Daten aus vernetzten Produkten?", a: "Alle Daten, die während der Nutzung vernetzter Geräte entstehen: Fahrzeugdaten, Smarthome-Sensordaten, Fitnesstracker-Daten, Maschinendaten in der Produktion." },
      { q: "Ab wann gilt der Data Act?", a: "Der Data Act trat am 11. Januar 2024 in Kraft und gilt vollständig ab September 2025." },
    ],
  },
];

// ─── Timeline events ───────────────────────────────────────────
const TIMELINE = [
  { year: "2018", label: "DSGVO in Kraft", color: "#00E676" },
  { year: "2023", label: "DSA & DMA in Kraft", color: "#00D4FF" },
  { year: "Feb 2025", label: "EU AI Act: Verbote wirksam", color: "#FFA726" },
  { year: "Aug 2025", label: "EU AI Act: GPAI-Pflichten", color: "#FFA726" },
  { year: "Sep 2025", label: "Data Act vollständig", color: "#BB86FC" },
  { year: "Aug 2026", label: "EU AI Act: Hochrisiko", color: "#FF5252" },
];

// ─── FAQ for Schema.org ────────────────────────────────────────
const ALL_FAQ = REGULATIONS.flatMap((r) => r.faq);

export default async function EuRegulierungPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: ALL_FAQ.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  };

  return (
    <>
      <JsonLd data={faqSchema} />
      <div style={{ background: "#080E1A", minHeight: "100vh" }}>
        <Navigation />
        <Breadcrumb locale={locale} items={[{ label: "EU-Regulierung" }]} />

        {/* ── HERO ─────────────────────────────────────────── */}
        <section
          style={{
            position: "relative",
            paddingTop: "140px",
            paddingBottom: "100px",
            overflow: "hidden",
            borderBottom: "1px solid rgba(255,255,255,0.06)",
          }}
        >
          {/* Blueprint grid */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              backgroundImage:
                "linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)",
              backgroundSize: "48px 48px",
            }}
          />
          {/* Cyan glow */}
          <div
            style={{
              position: "absolute",
              top: "20%",
              left: "50%",
              transform: "translateX(-50%)",
              width: 800,
              height: 400,
              background: "radial-gradient(ellipse, rgba(0,212,255,0.06) 0%, transparent 70%)",
              pointerEvents: "none",
            }}
          />

          <div
            style={{
              position: "relative",
              zIndex: 1,
              maxWidth: 960,
              margin: "0 auto",
              padding: "0 24px",
            }}
          >
            {/* Breadcrumb */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                marginBottom: 32,
                fontFamily: "var(--font-jetbrains, monospace)",
                fontSize: "0.65rem",
                letterSpacing: "0.1em",
                color: "rgba(255,255,255,0.25)",
              }}
            >
              <Link href={`/${locale}`} style={{ color: "rgba(255,255,255,0.25)", textDecoration: "none" }}>SOVEREIGN 2030</Link>
              <span>/</span>
              <span style={{ color: "rgba(0,212,255,0.7)" }}>EU-REGULIERUNG</span>
            </div>

            {/* Tag */}
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                border: "1px solid rgba(0,212,255,0.2)",
                background: "rgba(0,212,255,0.05)",
                padding: "6px 14px",
                marginBottom: 24,
                fontFamily: "var(--font-jetbrains, monospace)",
                fontSize: "0.58rem",
                letterSpacing: "0.18em",
                color: "rgba(0,212,255,0.8)",
                textTransform: "uppercase",
              }}
            >
              <span
                style={{
                  width: 5,
                  height: 5,
                  borderRadius: "50%",
                  background: "#00E676",
                  display: "inline-block",
                  boxShadow: "0 0 6px rgba(0,230,118,0.8)",
                }}
              />
              Compliance Intelligence · 2025
            </div>

            <h1
              style={{
                fontFamily: "var(--font-space-grotesk, sans-serif)",
                fontWeight: 900,
                fontSize: "clamp(2.4rem, 6vw, 4.5rem)",
                lineHeight: 1.08,
                letterSpacing: "-0.025em",
                color: "#F0F4FF",
                marginBottom: 24,
              }}
            >
              5 EU-Gesetze die dein{" "}
              <span style={{ color: "#00D4FF" }}>digitales Leben</span>{" "}
              verändern
            </h1>

            <p
              style={{
                fontSize: "1.1rem",
                lineHeight: 1.7,
                color: "rgba(255,255,255,0.5)",
                maxWidth: 640,
                marginBottom: 48,
              }}
            >
              DSGVO, DSA, DMA, EU AI Act und Data Act — die vollständige Compliance-Landschaft der EU, verständlich erklärt. Wissen was Recht ist, bevor es dich trifft.
            </p>

            {/* Stats row */}
            <div style={{ display: "flex", gap: 40, flexWrap: "wrap" }}>
              {[
                { value: "5", label: "EU-Gesetze" },
                { value: "2018–2026", label: "Rollout-Zeitraum" },
                { value: "bis 20%", label: "Max. Bußgeld (Umsatz)" },
                { value: "447M", label: "EU-Bürger geschützt" },
              ].map((s) => (
                <div key={s.label}>
                  <div
                    style={{
                      fontFamily: "var(--font-space-grotesk, sans-serif)",
                      fontWeight: 800,
                      fontSize: "1.8rem",
                      color: "#00D4FF",
                      lineHeight: 1,
                    }}
                  >
                    {s.value}
                  </div>
                  <div
                    style={{
                      fontFamily: "var(--font-jetbrains, monospace)",
                      fontSize: "0.58rem",
                      letterSpacing: "0.12em",
                      color: "rgba(255,255,255,0.3)",
                      textTransform: "uppercase",
                      marginTop: 4,
                    }}
                  >
                    {s.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── TIMELINE ─────────────────────────────────────── */}
        <section
          style={{
            background: "#0A1220",
            borderBottom: "1px solid rgba(255,255,255,0.05)",
            padding: "40px 24px",
            overflowX: "auto",
          }}
        >
          <div style={{ maxWidth: 960, margin: "0 auto" }}>
            <p
              style={{
                fontFamily: "var(--font-jetbrains, monospace)",
                fontSize: "0.58rem",
                letterSpacing: "0.18em",
                color: "rgba(255,255,255,0.2)",
                textTransform: "uppercase",
                marginBottom: 24,
              }}
            >
              Compliance Timeline
            </p>
            <div style={{ display: "flex", gap: 0, position: "relative" }}>
              {/* Connecting line */}
              <div
                style={{
                  position: "absolute",
                  top: 10,
                  left: 10,
                  right: 10,
                  height: 1,
                  background: "rgba(255,255,255,0.06)",
                }}
              />
              {TIMELINE.map((t, i) => (
                <div
                  key={i}
                  style={{
                    flex: 1,
                    minWidth: 120,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 12,
                  }}
                >
                  <div
                    style={{
                      width: 20,
                      height: 20,
                      borderRadius: "50%",
                      border: `2px solid ${t.color}`,
                      background: "#080E1A",
                      boxShadow: `0 0 8px ${t.color}60`,
                      position: "relative",
                      zIndex: 1,
                    }}
                  />
                  <div
                    style={{
                      fontFamily: "var(--font-jetbrains, monospace)",
                      fontSize: "0.58rem",
                      letterSpacing: "0.08em",
                      color: t.color,
                      textAlign: "center",
                    }}
                  >
                    {t.year}
                  </div>
                  <div
                    style={{
                      fontSize: "0.72rem",
                      color: "rgba(255,255,255,0.45)",
                      textAlign: "center",
                      lineHeight: 1.4,
                      maxWidth: 100,
                    }}
                  >
                    {t.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── OVERVIEW CARDS ───────────────────────────────── */}
        <section style={{ padding: "80px 24px 40px", maxWidth: 960, margin: "0 auto" }}>
          <p
            style={{
              fontFamily: "var(--font-jetbrains, monospace)",
              fontSize: "0.58rem",
              letterSpacing: "0.18em",
              color: "rgba(255,255,255,0.2)",
              textTransform: "uppercase",
              marginBottom: 32,
            }}
          >
            Regulation Overview
          </p>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
              gap: 16,
            }}
          >
            {REGULATIONS.map((reg) => (
              <a
                key={reg.id}
                href={`#${reg.id}`}
                style={{
                  display: "block",
                  border: "1px solid rgba(255,255,255,0.07)",
                  background: "rgba(255,255,255,0.02)",
                  padding: "24px",
                  textDecoration: "none",
                  transition: "border-color 0.2s, background 0.2s",
                }}
              >
                <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 16 }}>
                  <div>
                    <span style={{ fontSize: "1.6rem" }}>{reg.emoji}</span>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 6 }}>
                    <span
                      style={{
                        fontFamily: "var(--font-jetbrains, monospace)",
                        fontSize: "0.52rem",
                        letterSpacing: "0.12em",
                        color: reg.statusColor,
                        border: `1px solid ${reg.statusColor}40`,
                        padding: "2px 8px",
                      }}
                    >
                      {reg.status}
                    </span>
                    <span
                      style={{
                        fontFamily: "var(--font-jetbrains, monospace)",
                        fontSize: "0.5rem",
                        letterSpacing: "0.1em",
                        color: "rgba(255,255,255,0.2)",
                      }}
                    >
                      {reg.code}
                    </span>
                  </div>
                </div>
                <div
                  style={{
                    fontFamily: "var(--font-space-grotesk, sans-serif)",
                    fontWeight: 800,
                    fontSize: "1.3rem",
                    color: "#F0F4FF",
                    marginBottom: 4,
                  }}
                >
                  {reg.short}
                </div>
                <div
                  style={{
                    fontFamily: "var(--font-jetbrains, monospace)",
                    fontSize: "0.6rem",
                    letterSpacing: "0.08em",
                    color: "rgba(255,255,255,0.3)",
                    textTransform: "uppercase",
                    marginBottom: 12,
                  }}
                >
                  {reg.layer}
                </div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    background: "rgba(255,80,80,0.07)",
                    border: "1px solid rgba(255,80,80,0.15)",
                    padding: "6px 10px",
                  }}
                >
                  <span style={{ fontSize: "0.65rem", color: "rgba(255,120,120,0.8)" }}>⚠</span>
                  <span
                    style={{
                      fontFamily: "var(--font-jetbrains, monospace)",
                      fontSize: "0.58rem",
                      letterSpacing: "0.06em",
                      color: "rgba(255,120,120,0.7)",
                    }}
                  >
                    Bußgeld: {reg.penalty}
                  </span>
                </div>
              </a>
            ))}
          </div>
        </section>

        {/* ── DEEP DIVES ───────────────────────────────────── */}
        <div style={{ maxWidth: 960, margin: "0 auto", padding: "0 24px 120px" }}>
          {REGULATIONS.map((reg) => (
            <section
              key={reg.id}
              id={reg.id}
              style={{
                marginTop: 64,
                border: "1px solid rgba(255,255,255,0.07)",
                background: "#0A1220",
                overflow: "hidden",
              }}
            >
              {/* Section header */}
              <div
                style={{
                  padding: "40px 40px 32px",
                  borderBottom: "1px solid rgba(255,255,255,0.06)",
                  background: "rgba(255,255,255,0.01)",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 16,
                    marginBottom: 20,
                    flexWrap: "wrap",
                  }}
                >
                  <span style={{ fontSize: "2rem" }}>{reg.emoji}</span>
                  <div>
                    <div
                      style={{
                        fontFamily: "var(--font-jetbrains, monospace)",
                        fontSize: "0.55rem",
                        letterSpacing: "0.18em",
                        color: "rgba(255,255,255,0.2)",
                        textTransform: "uppercase",
                        marginBottom: 4,
                      }}
                    >
                      {reg.code} · {reg.layer} · seit {reg.year}
                    </div>
                    <h2
                      style={{
                        fontFamily: "var(--font-space-grotesk, sans-serif)",
                        fontWeight: 900,
                        fontSize: "clamp(1.6rem, 4vw, 2.6rem)",
                        color: "#F0F4FF",
                        letterSpacing: "-0.02em",
                        lineHeight: 1.1,
                      }}
                    >
                      {reg.short}{" "}
                      <span style={{ color: "rgba(255,255,255,0.3)", fontWeight: 400 }}>
                        — {reg.full}
                      </span>
                    </h2>
                  </div>
                  <div
                    style={{
                      marginLeft: "auto",
                      fontFamily: "var(--font-jetbrains, monospace)",
                      fontSize: "0.55rem",
                      letterSpacing: "0.12em",
                      color: reg.statusColor,
                      border: `1px solid ${reg.statusColor}40`,
                      padding: "5px 12px",
                    }}
                  >
                    {reg.status}
                  </div>
                </div>
                <p
                  style={{
                    fontSize: "1rem",
                    lineHeight: 1.7,
                    color: "rgba(255,255,255,0.55)",
                    maxWidth: 720,
                  }}
                >
                  {reg.description}
                </p>
              </div>

              {/* 2-col content */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 0,
                }}
              >
                {/* Rights */}
                <div style={{ padding: "32px 40px", borderRight: "1px solid rgba(255,255,255,0.05)" }}>
                  <h3
                    style={{
                      fontFamily: "var(--font-jetbrains, monospace)",
                      fontSize: "0.6rem",
                      letterSpacing: "0.15em",
                      color: "#00D4FF",
                      textTransform: "uppercase",
                      marginBottom: 20,
                    }}
                  >
                    Deine Rechte
                  </h3>
                  <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 12 }}>
                    {reg.keyRights.map((r, i) => (
                      <li key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                        <span style={{ color: "#00D4FF", fontSize: "0.7rem", marginTop: 2, flexShrink: 0 }}>✓</span>
                        <span style={{ fontSize: "0.88rem", color: "rgba(255,255,255,0.65)", lineHeight: 1.5 }}>{r}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Business impact */}
                <div style={{ padding: "32px 40px" }}>
                  <h3
                    style={{
                      fontFamily: "var(--font-jetbrains, monospace)",
                      fontSize: "0.6rem",
                      letterSpacing: "0.15em",
                      color: "rgba(255,166,0,0.8)",
                      textTransform: "uppercase",
                      marginBottom: 20,
                    }}
                  >
                    Business Impact
                  </h3>
                  <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 12 }}>
                    {reg.businessImpact.map((b, i) => (
                      <li key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                        <span style={{ color: "rgba(255,166,0,0.7)", fontSize: "0.7rem", marginTop: 2, flexShrink: 0 }}>→</span>
                        <span style={{ fontSize: "0.88rem", color: "rgba(255,255,255,0.55)", lineHeight: 1.5 }}>{b}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* FAQ */}
              <div
                style={{
                  borderTop: "1px solid rgba(255,255,255,0.05)",
                  padding: "28px 40px",
                  background: "rgba(255,255,255,0.01)",
                }}
              >
                <h3
                  style={{
                    fontFamily: "var(--font-jetbrains, monospace)",
                    fontSize: "0.6rem",
                    letterSpacing: "0.15em",
                    color: "rgba(255,255,255,0.2)",
                    textTransform: "uppercase",
                    marginBottom: 20,
                  }}
                >
                  FAQ
                </h3>
                <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                  {reg.faq.map((f, i) => (
                    <div key={i}>
                      <p
                        style={{
                          fontSize: "0.92rem",
                          fontWeight: 600,
                          color: "rgba(255,255,255,0.8)",
                          marginBottom: 6,
                        }}
                      >
                        {f.q}
                      </p>
                      <p style={{ fontSize: "0.88rem", color: "rgba(255,255,255,0.45)", lineHeight: 1.6 }}>
                        {f.a}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Sovereign CTA */}
              <div
                style={{
                  borderTop: "1px solid rgba(0,212,255,0.12)",
                  background: "rgba(0,212,255,0.03)",
                  padding: "24px 40px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  flexWrap: "wrap",
                  gap: 16,
                }}
              >
                <div>
                  <div
                    style={{
                      fontFamily: "var(--font-jetbrains, monospace)",
                      fontSize: "0.55rem",
                      letterSpacing: "0.12em",
                      color: "rgba(0,212,255,0.5)",
                      textTransform: "uppercase",
                      marginBottom: 4,
                    }}
                  >
                    Sovereign Modul
                  </div>
                  <div
                    style={{
                      fontFamily: "var(--font-space-grotesk, sans-serif)",
                      fontWeight: 700,
                      fontSize: "1rem",
                      color: "rgba(255,255,255,0.8)",
                    }}
                  >
                    {reg.sovereignSolution} hilft dir bei {reg.short}-Compliance
                  </div>
                </div>
                <Link
                  href={`/${locale}/module/${reg.sovereignSlug}`}
                  style={{
                    fontFamily: "var(--font-space-grotesk, sans-serif)",
                    fontWeight: 700,
                    fontSize: "0.8rem",
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                    color: "#00D4FF",
                    border: "1px solid rgba(0,212,255,0.3)",
                    padding: "10px 24px",
                    textDecoration: "none",
                    background: "rgba(0,212,255,0.06)",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 8,
                  }}
                >
                  {reg.sovereignSolution} →
                </Link>
              </div>
            </section>
          ))}
        </div>

        {/* ── SOVEREIGN CTA BANNER ─────────────────────────── */}
        <section
          style={{
            background: "#0A1220",
            borderTop: "1px solid rgba(255,255,255,0.06)",
            padding: "80px 24px",
            textAlign: "center",
          }}
        >
          <div style={{ maxWidth: 640, margin: "0 auto" }}>
            <div
              style={{
                fontFamily: "var(--font-jetbrains, monospace)",
                fontSize: "0.58rem",
                letterSpacing: "0.18em",
                color: "rgba(0,212,255,0.5)",
                textTransform: "uppercase",
                marginBottom: 16,
              }}
            >
              Compliance · Automated
            </div>
            <h2
              style={{
                fontFamily: "var(--font-space-grotesk, sans-serif)",
                fontWeight: 900,
                fontSize: "clamp(1.8rem, 5vw, 3rem)",
                color: "#F0F4FF",
                letterSpacing: "-0.02em",
                lineHeight: 1.15,
                marginBottom: 16,
              }}
            >
              Kenne deine Rechte.<br />
              <span style={{ color: "#00D4FF" }}>Lass SOVEREIGN sie durchsetzen.</span>
            </h2>
            <p
              style={{
                fontSize: "1rem",
                color: "rgba(255,255,255,0.4)",
                lineHeight: 1.7,
                marginBottom: 40,
              }}
            >
              Das SOVEREIGN 2030 OS überwacht alle 5 EU-Regulierungen für dich — automatisch, proaktiv, vollständig dokumentiert.
            </p>
            <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
              <Link
                href={`/${locale}/module`}
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
                Module entdecken →
              </Link>
              <Link
                href={`/${locale}`}
                style={{
                  fontFamily: "var(--font-space-grotesk, sans-serif)",
                  fontWeight: 700,
                  fontSize: "0.85rem",
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  color: "rgba(255,255,255,0.6)",
                  border: "1px solid rgba(255,255,255,0.12)",
                  padding: "14px 32px",
                  textDecoration: "none",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                }}
              >
                Zur Startseite
              </Link>
            </div>
          </div>
        </section>

        <Footer />
      </div>
    </>
  );
}
