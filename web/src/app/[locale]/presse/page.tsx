// src/app/[locale]/presse/page.tsx
// Press Kit — Fact Sheet, Downloads, Quotes, Brand Assets
import type { Metadata } from "next";
import Link from "next/link";
import Navigation from "@/components/landing/Navigation";
import Footer from "@/components/landing/Footer";
import Breadcrumb from "@/components/ui/Breadcrumb";

const BASE_URL = "https://sovereign.de";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return {
    title: "Presse & Medien | SOVEREIGN 2030",
    description:
      "Press Kit, Fact Sheet, Zitate und Medien-Assets für Journalisten und Blogger. SOVEREIGN 2030 — das autonome Life-OS für digitale Souveränität.",
    alternates: { canonical: `${BASE_URL}/${locale}/presse` },
    openGraph: {
      title: "Presse & Medien | SOVEREIGN 2030",
      description: "Press Kit, Fact Sheet, Zitate und Medien-Assets für Journalisten und Blogger.",
      url: `${BASE_URL}/${locale}/presse`,
      siteName: "SOVEREIGN 2030",
      images: [{ url: `${BASE_URL}/og/presse.png`, width: 1200, height: 630, alt: "SOVEREIGN 2030 Press Kit" }],
      locale: locale === "de" ? "de_DE" : "en_US",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: "Presse & Medien | SOVEREIGN 2030",
      description: "Das autonome Life-OS für digitale Souveränität — Medien-Assets & Fact Sheet.",
      images: [`${BASE_URL}/og/presse.png`],
    },
  };
}

const FACTS = [
  { label: "Gegründet", value: "2024, Berlin" },
  { label: "Kategorie", value: "AI / LegalTech / Privacy" },
  { label: "Technologie", value: "Gemini 2.5 Flash · Next.js · Firebase · GCP" },
  { label: "Regulierung", value: "EU AI Act · DSGVO · DSA-konform" },
  { label: "Nutzer (Early Access)", value: "3.200+ Sovereign Citizens" },
  { label: "Verträge analysiert", value: "12.400+" },
  { label: "Eingespartes Volumen", value: "€2,8M+ (Early Access)" },
  { label: "Module", value: "8 (CORE · INTELLIGENCE · GOVERNANCE)" },
  { label: "Serverstandort", value: "Frankfurt, Deutschland (EU-only)" },
  { label: "Sprachen", value: "Deutsch, Englisch + 8 weitere" },
];

const QUOTES = [
  {
    quote:
      "SOVEREIGN 2030 löst ein fundamentales Problem: Menschen haben keine Werkzeuge um sich gegen Systeme zu behaupten, die professionell für ihre Ausbeutung optimiert wurden.",
    source: "Gründungsteam, Berlin 2024",
  },
  {
    quote:
      "Datensouveränität ist kein technisches Feature. Es ist ein politischer Akt — und wir bauen die Infrastruktur dafür.",
    source: "Produktvision, Q1 2025",
  },
  {
    quote:
      "Wir konkurrieren nicht mit ChatGPT oder Notion AI. Wir bauen das Gegenteil: KI die für dich arbeitet, nicht über dich entscheidet.",
    source: "Pressemitteilung, April 2025",
  },
];

const KEY_FEATURES = [
  { icon: "🧬", title: "Sovereign Twin", desc: "Digitaler Zwilling — On-Device, vollständige Datenkontrolle" },
  { icon: "🛡️", title: "Privacy Guardian", desc: "DSGVO-Automatisierung, PII-Schutz in Echtzeit" },
  { icon: "⚡", title: "Execution Center", desc: "Autonome Vertragsanalyse und Task-Ausführung (HITL/HOTL)" },
  { icon: "🔍", title: "Audit Trail", desc: "100% Transparenz — jede KI-Aktion dokumentiert" },
  { icon: "🏛️", title: "Security Senate", desc: "EU AI Act Compliance und Zero-Trust Architektur" },
  { icon: "💶", title: "Finanzautonomie", desc: "Wealth Twin, Preiserhöhungs-Widerspruch, Wealth-Intelligence" },
];

export default async function PressePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  return (
    <div style={{ background: "#080E1A", minHeight: "100vh" }}>
      <Navigation />
      <Breadcrumb locale={locale} items={[{ label: "Presse & Medien" }]} />

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
          {/* Breadcrumb */}
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
            <span style={{ color: "rgba(0,212,255,0.6)" }}>PRESSE</span>
          </div>

          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              border: "1px solid rgba(0,212,255,0.2)",
              background: "rgba(0,212,255,0.04)",
              padding: "6px 14px",
              marginBottom: 24,
              fontFamily: "var(--font-jetbrains, monospace)",
              fontSize: "0.58rem",
              letterSpacing: "0.18em",
              color: "rgba(0,212,255,0.7)",
              textTransform: "uppercase",
            }}
          >
            Press Kit · April 2025
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
            Medien &{" "}
            <span style={{ color: "#00D4FF" }}>Pressematerial</span>
          </h1>

          <p
            style={{
              fontSize: "1.05rem",
              lineHeight: 1.7,
              color: "rgba(255,255,255,0.45)",
              maxWidth: 600,
              marginBottom: 40,
            }}
          >
            Alle Ressourcen für Journalisten, Blogger und Content Creator. Fact Sheet, Zitate, Brand Assets und Pressekontakt.
          </p>

          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            <a
              href="mailto:presse@sovereign2030.de"
              style={{
                fontFamily: "var(--font-space-grotesk, sans-serif)",
                fontWeight: 700,
                fontSize: "0.82rem",
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                color: "#080E1A",
                background: "#00D4FF",
                padding: "12px 28px",
                textDecoration: "none",
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
              }}
            >
              Presseanfrage senden →
            </a>
            <span
              style={{
                fontFamily: "var(--font-space-grotesk, sans-serif)",
                fontWeight: 600,
                fontSize: "0.82rem",
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                color: "rgba(255,255,255,0.4)",
                border: "1px solid rgba(255,255,255,0.1)",
                padding: "12px 28px",
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                cursor: "default",
              }}
            >
              📦 Press Kit Download (demnächst)
            </span>
          </div>
        </div>
      </section>

      <div style={{ maxWidth: 960, margin: "0 auto", padding: "80px 24px 120px" }}>

        {/* ── FACT SHEET ───────────────────────────────────── */}
        <section style={{ marginBottom: 80 }}>
          <h2
            style={{
              fontFamily: "var(--font-jetbrains, monospace)",
              fontSize: "0.6rem",
              letterSpacing: "0.18em",
              color: "rgba(0,212,255,0.5)",
              textTransform: "uppercase",
              marginBottom: 28,
            }}
          >
            Fact Sheet
          </h2>
          <div style={{ border: "1px solid rgba(255,255,255,0.07)" }}>
            {FACTS.map((fact, i) => (
              <div
                key={fact.label}
                style={{
                  display: "grid",
                  gridTemplateColumns: "200px 1fr",
                  borderBottom: i < FACTS.length - 1 ? "1px solid rgba(255,255,255,0.05)" : "none",
                }}
              >
                <div
                  style={{
                    padding: "16px 24px",
                    fontFamily: "var(--font-jetbrains, monospace)",
                    fontSize: "0.62rem",
                    letterSpacing: "0.08em",
                    color: "rgba(255,255,255,0.25)",
                    textTransform: "uppercase",
                    borderRight: "1px solid rgba(255,255,255,0.05)",
                    background: "rgba(255,255,255,0.01)",
                  }}
                >
                  {fact.label}
                </div>
                <div
                  style={{
                    padding: "16px 24px",
                    fontSize: "0.9rem",
                    color: "rgba(255,255,255,0.75)",
                  }}
                >
                  {fact.value}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── KEY FEATURES ─────────────────────────────────── */}
        <section style={{ marginBottom: 80 }}>
          <h2
            style={{
              fontFamily: "var(--font-jetbrains, monospace)",
              fontSize: "0.6rem",
              letterSpacing: "0.18em",
              color: "rgba(255,255,255,0.2)",
              textTransform: "uppercase",
              marginBottom: 28,
            }}
          >
            Kern-Module (Übersicht)
          </h2>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
              gap: 16,
            }}
          >
            {KEY_FEATURES.map((f) => (
              <div
                key={f.title}
                style={{
                  border: "1px solid rgba(255,255,255,0.07)",
                  background: "rgba(255,255,255,0.015)",
                  padding: "20px 24px",
                }}
              >
                <div style={{ fontSize: "1.4rem", marginBottom: 10 }}>{f.icon}</div>
                <div
                  style={{
                    fontFamily: "var(--font-space-grotesk, sans-serif)",
                    fontWeight: 700,
                    fontSize: "0.95rem",
                    color: "rgba(255,255,255,0.85)",
                    marginBottom: 6,
                  }}
                >
                  {f.title}
                </div>
                <div style={{ fontSize: "0.82rem", color: "rgba(255,255,255,0.4)", lineHeight: 1.5 }}>
                  {f.desc}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── QUOTES ───────────────────────────────────────── */}
        <section style={{ marginBottom: 80 }}>
          <h2
            style={{
              fontFamily: "var(--font-jetbrains, monospace)",
              fontSize: "0.6rem",
              letterSpacing: "0.18em",
              color: "rgba(255,255,255,0.2)",
              textTransform: "uppercase",
              marginBottom: 28,
            }}
          >
            Zitate (zur freien Verwendung)
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            {QUOTES.map((q, i) => (
              <div
                key={i}
                style={{
                  border: "1px solid rgba(255,255,255,0.07)",
                  background: "rgba(255,255,255,0.01)",
                  padding: "28px 32px",
                }}
              >
                <blockquote
                  style={{
                    fontSize: "1rem",
                    lineHeight: 1.75,
                    color: "rgba(255,255,255,0.7)",
                    fontStyle: "italic",
                    borderLeft: "2px solid rgba(0,212,255,0.3)",
                    paddingLeft: 20,
                    marginBottom: 16,
                  }}
                >
                  "{q.quote}"
                </blockquote>
                <div
                  style={{
                    fontFamily: "var(--font-jetbrains, monospace)",
                    fontSize: "0.58rem",
                    letterSpacing: "0.08em",
                    color: "rgba(255,255,255,0.25)",
                  }}
                >
                  — {q.source}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── BRAND ASSETS ─────────────────────────────────── */}
        <section style={{ marginBottom: 80 }}>
          <h2
            style={{
              fontFamily: "var(--font-jetbrains, monospace)",
              fontSize: "0.6rem",
              letterSpacing: "0.18em",
              color: "rgba(255,255,255,0.2)",
              textTransform: "uppercase",
              marginBottom: 28,
            }}
          >
            Brand Assets & Guidelines
          </h2>
          <div
            style={{
              border: "1px solid rgba(255,255,255,0.07)",
              background: "rgba(255,255,255,0.01)",
              padding: "28px 32px",
            }}
          >
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 24,
                marginBottom: 24,
              }}
            >
              {[
                { label: "Primärfarbe", value: "#00D4FF", hex: true, preview: "#00D4FF" },
                { label: "Hintergrund", value: "#080E1A", hex: true, preview: "#080E1A" },
                { label: "Text Primär", value: "#F0F4FF", hex: true, preview: "#F0F4FF" },
                { label: "Akzent 2", value: "#BB86FC", hex: true, preview: "#BB86FC" },
              ].map((c) => (
                <div key={c.label} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div
                    style={{
                      width: 32,
                      height: 32,
                      background: c.preview,
                      border: "1px solid rgba(255,255,255,0.1)",
                      flexShrink: 0,
                    }}
                  />
                  <div>
                    <div style={{ fontSize: "0.82rem", color: "rgba(255,255,255,0.7)" }}>{c.label}</div>
                    <div style={{ fontFamily: "var(--font-jetbrains, monospace)", fontSize: "0.7rem", color: "rgba(255,255,255,0.35)" }}>{c.value}</div>
                  </div>
                </div>
              ))}
            </div>
            <div
              style={{
                fontSize: "0.85rem",
                color: "rgba(255,255,255,0.35)",
                lineHeight: 1.6,
                borderTop: "1px solid rgba(255,255,255,0.05)",
                paddingTop: 16,
              }}
            >
              <strong style={{ color: "rgba(255,255,255,0.55)" }}>Logo-Verwendung:</strong> Der Name "SOVEREIGN 2030" darf in Berichterstattung frei verwendet werden. Das Logo-SVG ist auf Anfrage erhältlich. Bitte keine Veränderungen am Markennamen oder Logo ohne schriftliche Genehmigung.
            </div>
          </div>
        </section>

        {/* ── PRESS CONTACT ────────────────────────────────── */}
        <section>
          <h2
            style={{
              fontFamily: "var(--font-jetbrains, monospace)",
              fontSize: "0.6rem",
              letterSpacing: "0.18em",
              color: "rgba(255,255,255,0.2)",
              textTransform: "uppercase",
              marginBottom: 28,
            }}
          >
            Pressekontakt
          </h2>
          <div
            style={{
              border: "1px solid rgba(0,212,255,0.15)",
              background: "rgba(0,212,255,0.03)",
              padding: "28px 32px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: 20,
            }}
          >
            <div>
              <div
                style={{
                  fontFamily: "var(--font-space-grotesk, sans-serif)",
                  fontWeight: 700,
                  fontSize: "1rem",
                  color: "rgba(255,255,255,0.85)",
                  marginBottom: 8,
                }}
              >
                SOVEREIGN 2030 — Pressestelle
              </div>
              <div style={{ fontSize: "0.88rem", color: "rgba(255,255,255,0.4)", lineHeight: 1.6 }}>
                Presseanfragen: <a href="mailto:presse@sovereign2030.de" style={{ color: "#00D4FF", textDecoration: "none" }}>presse@sovereign2030.de</a><br />
                Reaktionszeit: innerhalb von 24 Stunden an Werktagen<br />
                Interviews, Demos und Hintergrundgespräche auf Anfrage
              </div>
            </div>
            <a
              href="mailto:presse@sovereign2030.de"
              style={{
                fontFamily: "var(--font-space-grotesk, sans-serif)",
                fontWeight: 700,
                fontSize: "0.8rem",
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                color: "#00D4FF",
                border: "1px solid rgba(0,212,255,0.3)",
                padding: "12px 24px",
                textDecoration: "none",
                background: "rgba(0,212,255,0.06)",
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
              }}
            >
              Kontakt aufnehmen →
            </a>
          </div>
        </section>
      </div>

      <Footer />
    </div>
  );
}
