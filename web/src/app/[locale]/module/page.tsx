// src/app/[locale]/module/page.tsx
// ═══════════════════════════════════════════════════════════════
// PILLAR REGISTRY — /[locale]/module
// APEX → PILLAR → CLUSTER Architecture Overview
// ═══════════════════════════════════════════════════════════════
import type { Metadata } from "next";
import Link from "next/link";
import { MODULES, MODULE_LAYERS } from "@/lib/content/modules";
import JsonLd from "@/components/SEO/JsonLd";

const BASE_URL = "https://sovereign.de";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const isDE = locale === "de";
  return {
    title: isDE
      ? "Module Registry — 8 Sovereign Module | SOVEREIGN 2030"
      : "Module Registry — 8 Sovereign Modules | SOVEREIGN 2030",
    description: isDE
      ? "Das vollständige APEX/PILLAR/CLUSTER System von SOVEREIGN 2030: 8 autonome Module für Datensouveränität, KI-Recht, Finanzautonomie und Zero-Trust-Security."
      : "The complete APEX/PILLAR/CLUSTER system of SOVEREIGN 2030: 8 autonomous modules for data sovereignty, AI law, financial autonomy and zero-trust security.",
    alternates: { canonical: `${BASE_URL}/${locale}/module` },
  };
}

const LAYER_COLORS: Record<string, { border: string; text: string; bg: string }> = {
  CORE:         { border: "rgba(0,212,255,0.3)",   text: "#00D4FF",  bg: "rgba(0,212,255,0.06)" },
  INTELLIGENCE: { border: "rgba(187,134,252,0.3)", text: "#BB86FC",  bg: "rgba(187,134,252,0.06)" },
  GOVERNANCE:   { border: "rgba(0,230,118,0.3)",   text: "#00E676",  bg: "rgba(0,230,118,0.05)" },
};

export default async function ModuleRegistryPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": ["WebPage", "FAQPage"],
    name: "SOVEREIGN 2030 Module Registry",
    description: "8 autonome Module für digitale Souveränität.",
    url: `${BASE_URL}/${locale}/module`,
    mainEntity: [
      {
        "@type": "Question",
        name: "Was ist das APEX/PILLAR/CLUSTER System?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "APEX ist die Gesamtplattform (Landing Page). PILLARs sind die 8 funktionalen Module. CLUSTERs sind tiefe Analyse-Artikel im Blog. Zusammen bilden sie eine Content-Pyramide für maximale Wissensdichte.",
        },
      },
      {
        "@type": "Question",
        name: "Wie viele Module hat SOVEREIGN 2030?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "8 Module in 3 Layern: Core (Sovereign Twin, Execution Center, Datensouveränität), Intelligence (Finanzautonomie, KI & Recht) und Governance (Privacy Guardian, Security Senate, Audit Trail).",
        },
      },
    ],
  };

  return (
    <div style={{ background: "#080E1A", minHeight: "100vh", color: "#F0F4FF" }}>
      <JsonLd data={jsonLd} />

      {/* Background grid */}
      <div
        className="fixed inset-0 pointer-events-none z-0"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.015) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.015) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      <div className="relative z-10 max-w-screen-xl mx-auto px-6 sm:px-12 lg:px-16 pt-32 pb-24">

        {/* Breadcrumb */}
        <nav style={{ marginBottom: "3rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <Link href={`/${locale}`} style={{ fontFamily: "var(--font-mono, monospace)", fontSize: "0.6rem", letterSpacing: "0.12em", color: "rgba(0,212,255,0.5)", textDecoration: "none" }}>
              APEX
            </Link>
            <span style={{ color: "rgba(255,255,255,0.2)", fontSize: "0.6rem" }}>›</span>
            <span style={{ fontFamily: "var(--font-mono, monospace)", fontSize: "0.6rem", letterSpacing: "0.12em", color: "rgba(255,255,255,0.3)" }}>
              MODULE REGISTRY
            </span>
          </div>
        </nav>

        {/* Header */}
        <div style={{ marginBottom: "5rem" }}>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            fontFamily: "var(--font-mono, monospace)", fontSize: "0.55rem",
            letterSpacing: "0.14em", color: "rgba(0,212,255,0.6)",
            border: "1px solid rgba(0,212,255,0.2)", padding: "3px 10px",
            marginBottom: "2rem",
          }}>
            MODULE REGISTRY // 8 ACTIVE
          </div>

          <h1 style={{
            fontFamily: "var(--font-space-grotesk, sans-serif)",
            fontWeight: 900, fontSize: "clamp(2.5rem, 6vw, 4.5rem)",
            letterSpacing: "-0.03em", lineHeight: 1.05,
            color: "#F0F4FF", marginBottom: "1.5rem",
          }}>
            Das Betriebssystem<br />
            <span style={{ color: "#00D4FF" }}>deiner Souveränität.</span>
          </h1>

          <p style={{ fontSize: "1.1rem", lineHeight: 1.7, color: "#8892A4", maxWidth: 600, marginBottom: "3rem" }}>
            8 autonome Module. 3 Layer. Eine Mission: vollständige digitale Souveränität — über deine Daten,
            dein Recht und deine Finanzen.
          </p>

          {/* Stats Row */}
          <div style={{ display: "flex", gap: "2rem", flexWrap: "wrap" }}>
            {[
              { value: "8", label: "Module" },
              { value: "3", label: "Layer" },
              { value: "EU AI Act", label: "Compliant" },
              { value: "100%", label: "EU-Hosting" },
            ].map((stat) => (
              <div key={stat.label} style={{
                padding: "0.75rem 1.5rem",
                background: "rgba(255,255,255,0.02)",
                border: "1px solid rgba(255,255,255,0.06)",
              }}>
                <div style={{ fontFamily: "var(--font-mono, monospace)", fontWeight: 700, fontSize: "1.1rem", color: "#00D4FF" }}>
                  {stat.value}
                </div>
                <div style={{ fontFamily: "var(--font-mono, monospace)", fontSize: "0.58rem", letterSpacing: "0.1em", color: "rgba(255,255,255,0.3)", textTransform: "uppercase" }}>
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Architecture Explanation */}
        <div style={{ marginBottom: "5rem", padding: "2.5rem", background: "rgba(0,212,255,0.02)", border: "1px solid rgba(0,212,255,0.08)" }}>
          <div style={{ fontFamily: "var(--font-mono, monospace)", fontSize: "0.55rem", letterSpacing: "0.14em", color: "rgba(0,212,255,0.5)", marginBottom: "1.5rem", textTransform: "uppercase" }}>
            01 — Architektur-Überblick
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "1.5rem" }}>
            {[
              { symbol: "◈", label: "APEX", color: "#00D4FF", desc: "Die gesamte Plattform — Homepage und Kommando-Zentrale. Verlinkt zu allen Pillars." },
              { symbol: "⬡", label: "PILLAR", color: "#BB86FC", desc: "8 funktionale Module — eigenständige, produktionsreife Systeme mit eigenen Agents." },
              { symbol: "◇", label: "CLUSTER", color: "#00E676", desc: "Tiefe Analyse-Artikel und Guides — atomare Deliverables im Blog." },
            ].map((tier) => (
              <div key={tier.label} style={{ display: "flex", gap: "1rem" }}>
                <span style={{ fontFamily: "var(--font-mono, monospace)", fontSize: "1.4rem", color: tier.color, flexShrink: 0 }}>
                  {tier.symbol}
                </span>
                <div>
                  <div style={{ fontFamily: "var(--font-mono, monospace)", fontWeight: 700, fontSize: "0.75rem", letterSpacing: "0.1em", color: tier.color, marginBottom: "0.4rem" }}>
                    {tier.label}
                  </div>
                  <div style={{ fontSize: "0.82rem", color: "#8892A4", lineHeight: 1.6 }}>
                    {tier.desc}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Module Grid */}
        <div style={{ marginBottom: "2rem" }}>
          <div style={{ fontFamily: "var(--font-mono, monospace)", fontSize: "0.55rem", letterSpacing: "0.14em", color: "rgba(255,255,255,0.25)", textTransform: "uppercase", marginBottom: "2rem" }}>
            02 — Module Registry
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", gap: "1px", background: "rgba(255,255,255,0.04)" }}>
            {MODULES.map((mod) => {
              const lc = LAYER_COLORS[mod.layer] ?? LAYER_COLORS.CORE;
              return (
                <div
                  key={mod.slug}
                  style={{
                    background: "#080E1A",
                    padding: "2rem",
                    transition: "background 0.2s",
                    display: "flex",
                    flexDirection: "column",
                    gap: "1rem",
                  }}
                >
                  {/* Header */}
                  <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "1rem" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                      <span style={{ fontSize: "1.5rem" }}>{mod.emoji}</span>
                      <div>
                        <div style={{
                          fontFamily: "var(--font-mono, monospace)", fontSize: "0.5rem",
                          letterSpacing: "0.12em", color: lc.text, textTransform: "uppercase",
                          marginBottom: "3px",
                        }}>
                          [{mod.layer}] {mod.layerCode}
                        </div>
                        <h3 style={{ fontWeight: 700, fontSize: "1rem", color: "#F0F4FF", lineHeight: 1.2 }}>
                          {mod.name}
                        </h3>
                      </div>
                    </div>
                    <div style={{
                      fontFamily: "var(--font-mono, monospace)", fontSize: "0.65rem",
                      fontWeight: 700, color: "#00E676",
                      background: "rgba(0,230,118,0.08)", border: "1px solid rgba(0,230,118,0.2)",
                      padding: "2px 8px", whiteSpace: "nowrap",
                    }}>
                      {mod.score}/100
                    </div>
                  </div>

                  {/* Subtitle */}
                  <p style={{ fontSize: "0.82rem", color: "#8892A4", lineHeight: 1.6 }}>
                    {mod.subtitle}
                  </p>

                  {/* Output Format */}
                  <div style={{ fontFamily: "var(--font-mono, monospace)", fontSize: "0.55rem", letterSpacing: "0.06em", color: "rgba(255,255,255,0.2)", textTransform: "uppercase" }}>
                    Output: {mod.outputFormat}
                  </div>

                  {/* Use Cases */}
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem" }}>
                    {mod.useCases.map((uc) => (
                      <span key={uc} style={{
                        fontFamily: "var(--font-mono, monospace)", fontSize: "0.5rem",
                        letterSpacing: "0.06em", padding: "2px 8px",
                        background: lc.bg, border: `1px solid ${lc.border}`,
                        color: lc.text, textTransform: "uppercase",
                      }}>
                        {uc}
                      </span>
                    ))}
                  </div>

                  {/* Actions */}
                  <div style={{ display: "flex", gap: "0.75rem", marginTop: "0.5rem", paddingTop: "1rem", borderTop: "1px solid rgba(255,255,255,0.04)" }}>
                    <Link
                      href={`/${locale}/module/${mod.slug}`}
                      style={{
                        flex: 1, textAlign: "center",
                        padding: "0.6rem 1rem",
                        background: "rgba(0,212,255,0.08)", border: "1px solid rgba(0,212,255,0.2)",
                        color: "#00D4FF", textDecoration: "none",
                        fontFamily: "var(--font-mono, monospace)", fontSize: "0.6rem",
                        letterSpacing: "0.1em", fontWeight: 700, textTransform: "uppercase",
                        transition: "background 0.2s",
                      }}
                    >
                      Full Specification →
                    </Link>
                    <Link
                      href="/dashboard"
                      style={{
                        padding: "0.6rem 1rem",
                        background: "#00D4FF", color: "#080E1A",
                        textDecoration: "none",
                        fontFamily: "var(--font-mono, monospace)", fontSize: "0.6rem",
                        letterSpacing: "0.1em", fontWeight: 700, textTransform: "uppercase",
                      }}
                    >
                      Boot
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer CTA */}
        <div style={{
          marginTop: "6rem", padding: "4rem",
          border: "1px solid rgba(0,212,255,0.12)",
          background: "rgba(0,212,255,0.02)",
          textAlign: "center",
        }}>
          <div style={{ fontFamily: "var(--font-mono, monospace)", fontSize: "0.55rem", letterSpacing: "0.14em", color: "rgba(0,212,255,0.5)", marginBottom: "1.5rem", textTransform: "uppercase" }}>
            System Ready
          </div>
          <h2 style={{
            fontFamily: "var(--font-space-grotesk, sans-serif)",
            fontWeight: 900, fontSize: "clamp(2rem, 4vw, 3rem)",
            letterSpacing: "-0.03em", color: "#F0F4FF",
            marginBottom: "1rem",
          }}>
            Boot das OS.
          </h2>
          <p style={{ fontSize: "1rem", color: "#8892A4", maxWidth: 440, margin: "0 auto 2.5rem", lineHeight: 1.65 }}>
            Alle 8 Module. Ein System. Vollständige Souveränität ab dem ersten Tag.
          </p>
          <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
            <Link href="/dashboard" className="lp-btn-primary" style={{ fontSize: "0.8rem" }}>
              Sovereign werden
            </Link>
            <Link href={`/${locale}`} style={{
              padding: "0.75rem 1.5rem",
              border: "1px solid rgba(255,255,255,0.12)",
              color: "rgba(255,255,255,0.5)", textDecoration: "none",
              fontFamily: "var(--font-mono, monospace)", fontSize: "0.65rem",
              letterSpacing: "0.1em", textTransform: "uppercase", transition: "border-color 0.2s",
            }}>
              ← APEX
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
