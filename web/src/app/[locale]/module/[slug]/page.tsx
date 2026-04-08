// src/app/[locale]/module/[slug]/page.tsx
// ═══════════════════════════════════════════════════════════════
// PILLAR PAGE TEMPLATE — /[locale]/module/[slug]
// Blueprint: AGENTICUM G5 Pillar-Template (70vh Hero, 8+4 Grid)
// ═══════════════════════════════════════════════════════════════
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Navigation from "@/components/landing/Navigation";
import Footer from "@/components/landing/Footer";
import Breadcrumb from "@/components/ui/Breadcrumb";
import { MODULES } from "@/lib/content/modules";
import { articles } from "@/lib/content/articles";
import { getCaseStudy } from "@/lib/content/case-studies";
import JsonLd from "@/components/SEO/JsonLd";

const BASE_URL = "https://sovereign.de";

export async function generateStaticParams() {
  return MODULES.map((m) => ({ slug: m.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const mod = MODULES.find((m) => m.slug === slug);
  if (!mod) return {};
  return {
    title: `${mod.name} — ${mod.subtitle} | SOVEREIGN 2030`,
    description: mod.description.slice(0, 160),
    alternates: { canonical: `${BASE_URL}/${locale}/module/${slug}` },
  };
}

const LAYER_COLORS: Record<string, { border: string; text: string; bg: string; glow: string }> = {
  CORE:         { border: "rgba(0,212,255,0.25)",   text: "#00D4FF",  bg: "rgba(0,212,255,0.05)",  glow: "0 0 40px rgba(0,212,255,0.06)" },
  INTELLIGENCE: { border: "rgba(187,134,252,0.25)", text: "#BB86FC",  bg: "rgba(187,134,252,0.05)", glow: "0 0 40px rgba(187,134,252,0.06)" },
  GOVERNANCE:   { border: "rgba(0,230,118,0.25)",   text: "#00E676",  bg: "rgba(0,230,118,0.04)",  glow: "0 0 40px rgba(0,230,118,0.05)" },
};

export default async function PillarPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const mod = MODULES.find((m) => m.slug === slug);
  if (!mod) notFound();

  const lc = LAYER_COLORS[mod.layer] ?? LAYER_COLORS.CORE;
  const otherModules = MODULES.filter((m) => m.slug !== slug).slice(0, 4);
  const caseStudy = getCaseStudy(slug);
  // Related cluster articles — match by tag or pillar reference
  const relatedArticles = articles
    .filter((a) => a.pillar === slug || a.tag === "VERTRAGSRECHT" || a.tag === "DATENSCHUTZ" || a.tag === "FINANZEN")
    .slice(0, 3);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: mod.name,
    description: mod.description.slice(0, 200),
    brand: { "@type": "Brand", name: "SOVEREIGN 2030" },
    url: `${BASE_URL}/${locale}/module/${slug}`,
  };

  return (
    <div style={{ background: "#080E1A", minHeight: "100vh", color: "#F0F4FF" }}>
      <JsonLd data={jsonLd} />
      <Navigation />
      <Breadcrumb
        locale={locale}
        items={[
          { label: "Module", href: `/${locale}/module` },
          { label: mod.name },
        ]}
      />

      {/* ── HERO BANNER 70vh ── */}
      <div style={{
        width: "100%", height: "70vh", position: "relative",
        paddingTop: "64px", overflow: "hidden",
        borderBottom: "1px solid rgba(255,255,255,0.05)",
      }}>
        {/* Overlay layers */}
        <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.65)", zIndex: 10 }} />
        <div style={{
          position: "absolute", inset: 0, zIndex: 20,
          background: "linear-gradient(to top, #080E1A 0%, rgba(8,14,26,0.75) 50%, transparent 100%)",
        }} />

        {/* Generative background — tech grid + accent glow */}
        <div style={{
          position: "absolute", inset: 0, zIndex: 5,
          background: `radial-gradient(ellipse 60% 50% at 60% 50%, ${lc.bg.replace("0.05)", "0.15)")} 0%, transparent 70%)`,
        }} />
        <div style={{
          position: "absolute", inset: 0, zIndex: 5,
          backgroundImage: "linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)",
          backgroundSize: "50px 50px",
        }} />

        {/* Content — Bottom Left */}
        <div style={{
          position: "absolute", bottom: 0, left: 0, width: "100%",
          zIndex: 30, padding: "0 4rem 3rem",
        }}>
          <div style={{ marginBottom: "0.75rem" }}>
            <span style={{ fontFamily: "var(--font-mono, monospace)", fontSize: "1.8rem" }}>
              {mod.emoji}
            </span>
          </div>
          <div style={{
            fontFamily: "var(--font-mono, monospace)", fontSize: "0.55rem",
            letterSpacing: "0.16em", color: lc.text, textTransform: "uppercase",
            marginBottom: "1rem",
          }}>
            {mod.layer} / MODULE LAYER · {mod.layerCode}
          </div>
          <h1 style={{
            fontFamily: "var(--font-space-grotesk, sans-serif)",
            fontWeight: 900, fontSize: "clamp(2.5rem, 5vw, 4rem)",
            letterSpacing: "-0.03em", lineHeight: 1.05,
            color: "#F0F4FF", marginBottom: "0.75rem",
            maxWidth: 700,
          }}>
            {mod.name}
          </h1>
          <p style={{ fontSize: "1.05rem", color: "#8892A4", maxWidth: 600, lineHeight: 1.5 }}>
            {mod.subtitle}
          </p>
        </div>
      </div>

      {/* ── CONTENT BODY ── */}
      <div style={{ maxWidth: "1400px", margin: "0 auto", padding: "5rem 4rem" }}>
        <div style={{
          display: "grid",
          gridTemplateColumns: "1fr 340px",
          gap: "5rem",
          alignItems: "start",
        }}>

          {/* ── LEFT: Main Content (col 8) ── */}
          <div style={{ display: "flex", flexDirection: "column", gap: "4rem" }}>

            {/* Section 01 — Overview */}
            <section>
              <SectionLabel index="01" label="Overview" />
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "1rem", marginBottom: "1.5rem", flexWrap: "wrap" }}>
                <div style={{ display: "flex", gap: "0.75rem" }}>
                  <span style={{
                    fontFamily: "var(--font-mono, monospace)", fontSize: "0.5rem",
                    letterSpacing: "0.1em", padding: "3px 10px",
                    background: lc.bg, border: `1px solid ${lc.border}`, color: lc.text,
                    textTransform: "uppercase",
                  }}>
                    Foundation Pillar
                  </span>
                  <span style={{
                    fontFamily: "var(--font-mono, monospace)", fontSize: "0.5rem",
                    letterSpacing: "0.1em", padding: "3px 10px",
                    background: "rgba(0,230,118,0.06)", border: "1px solid rgba(0,230,118,0.2)", color: "#00E676",
                    textTransform: "uppercase",
                  }}>
                    {mod.score}/100 VERIFIED
                  </span>
                </div>
                <Link href="/dashboard" style={{
                  padding: "0.6rem 1.25rem",
                  background: "#00D4FF", color: "#080E1A",
                  textDecoration: "none",
                  fontFamily: "var(--font-mono, monospace)", fontSize: "0.6rem",
                  letterSpacing: "0.1em", fontWeight: 700, textTransform: "uppercase",
                }}>
                  Launch App
                </Link>
              </div>

              <p style={{ fontSize: "1rem", lineHeight: 1.8, color: "#8892A4", marginBottom: "1.5rem" }}>
                {mod.description}
              </p>

              <blockquote style={{
                borderLeft: `2px solid ${lc.text}`,
                paddingLeft: "1.5rem",
                margin: "2rem 0",
                fontSize: "1.15rem", fontStyle: "normal",
                fontWeight: 500, lineHeight: 1.6,
                color: "rgba(255,255,255,0.75)",
              }}>
                "{mod.businessValue}"
              </blockquote>
            </section>

            {/* Section 02 — Use Cases & Directives */}
            <section>
              <SectionLabel index="02" label="Use Cases & Standard Delivery" />

              <div style={{
                padding: "1.5rem",
                background: "rgba(255,255,255,0.02)",
                border: "1px solid rgba(255,255,255,0.05)",
                marginBottom: "1.5rem",
              }}>
                <div style={{ fontFamily: "var(--font-mono, monospace)", fontSize: "0.55rem", letterSpacing: "0.1em", color: "rgba(255,255,255,0.3)", textTransform: "uppercase", marginBottom: "0.75rem" }}>
                  Output Format
                </div>
                <div style={{ fontFamily: "var(--font-mono, monospace)", fontSize: "0.85rem", color: lc.text }}>
                  {mod.outputFormat}
                </div>
              </div>

              <div style={{ marginBottom: "1.5rem" }}>
                <div style={{ fontFamily: "var(--font-mono, monospace)", fontSize: "0.55rem", letterSpacing: "0.1em", color: "rgba(255,255,255,0.3)", textTransform: "uppercase", marginBottom: "1rem" }}>
                  Primary Directives
                </div>
                <ol style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                  {mod.primaryDirectives.map((d) => (
                    <li key={d} style={{
                      fontFamily: "var(--font-mono, monospace)", fontSize: "0.82rem",
                      color: "#8892A4", lineHeight: 1.6,
                      paddingLeft: "1rem", borderLeft: `1px solid ${lc.border}`,
                    }}>
                      {d}
                    </li>
                  ))}
                </ol>
              </div>

              <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
                {mod.useCases.map((uc) => (
                  <span key={uc} style={{
                    fontFamily: "var(--font-mono, monospace)", fontSize: "0.6rem",
                    letterSpacing: "0.08em", padding: "5px 12px",
                    background: lc.bg, border: `1px solid ${lc.border}`, color: lc.text,
                    textTransform: "uppercase",
                  }}>
                    {uc}
                  </span>
                ))}
              </div>
            </section>

            {/* Section 03 — Module In Action */}
            <section>
              <SectionLabel index="03" label="Module In Action" />

              <div style={{
                background: "rgba(255,255,255,0.015)",
                border: `1px solid ${lc.border}`,
                overflow: "hidden",
              }}>
                {/* Simulated terminal / dashboard preview */}
                <div style={{
                  height: 220,
                  background: `linear-gradient(135deg, rgba(8,14,26,0.95) 0%, ${lc.bg.replace("0.05)", "0.12)")} 100%)`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  borderBottom: "1px solid rgba(255,255,255,0.05)",
                  position: "relative", overflow: "hidden",
                }}>
                  <div style={{
                    position: "absolute", inset: 0,
                    backgroundImage: "linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)",
                    backgroundSize: "30px 30px",
                  }} />
                  <div style={{ textAlign: "center", position: "relative", zIndex: 1 }}>
                    <div style={{ fontSize: "3rem", marginBottom: "0.75rem" }}>{mod.emoji}</div>
                    <div style={{ fontFamily: "var(--font-mono, monospace)", fontSize: "0.6rem", letterSpacing: "0.14em", color: lc.text, textTransform: "uppercase" }}>
                      {mod.layerCode} · {mod.layer} · ACTIVE
                    </div>
                  </div>
                </div>
                <div style={{ padding: "1.5rem" }}>
                  <div style={{ fontFamily: "var(--font-mono, monospace)", fontSize: "0.55rem", letterSpacing: "0.1em", color: "rgba(255,255,255,0.3)", textTransform: "uppercase", marginBottom: "0.5rem" }}>
                    {mod.layer} · {mod.name}
                  </div>
                  <p style={{ fontSize: "0.88rem", color: "#8892A4", lineHeight: 1.6, marginBottom: "0.75rem" }}>
                    {mod.description.slice(0, 180)}...
                  </p>
                  <div style={{ fontFamily: "var(--font-mono, monospace)", fontSize: "0.7rem", color: lc.text }}>
                    Business Value: {mod.businessValue}
                  </div>
                </div>
              </div>
            </section>

            {/* Section 04 — Case Study */}
            {caseStudy && (
              <section>
                <SectionLabel index="04" label="Case Study" />

                {/* Persona + Problem */}
                <div style={{
                  padding: "1.5rem",
                  background: "rgba(255,255,255,0.02)",
                  border: `1px solid ${lc.border}`,
                  marginBottom: "1.5rem",
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1rem" }}>
                    <div style={{
                      width: 40, height: 40, borderRadius: "50%",
                      background: lc.bg, border: `1px solid ${lc.border}`,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontFamily: "var(--font-mono, monospace)", fontSize: "0.9rem",
                      color: lc.text, fontWeight: 700, flexShrink: 0,
                    }}>
                      {caseStudy.persona.charAt(0)}
                    </div>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: "0.95rem", color: "#F0F4FF" }}>
                        {caseStudy.persona}
                      </div>
                      <div style={{ fontFamily: "var(--font-mono, monospace)", fontSize: "0.6rem", letterSpacing: "0.06em", color: "rgba(255,255,255,0.3)", marginTop: 2 }}>
                        {caseStudy.personaRole}
                      </div>
                    </div>
                    <div style={{ marginLeft: "auto", fontFamily: "var(--font-mono, monospace)", fontSize: "0.55rem", letterSpacing: "0.1em", color: lc.text, border: `1px solid ${lc.border}`, padding: "3px 10px", whiteSpace: "nowrap" }}>
                      ⏱ {caseStudy.timeToResult}
                    </div>
                  </div>
                  <p style={{ fontSize: "0.88rem", color: "#8892A4", lineHeight: 1.7, margin: 0 }}>
                    {caseStudy.problem}
                  </p>
                </div>

                {/* Process steps */}
                <div style={{ marginBottom: "1.5rem" }}>
                  <div style={{ fontFamily: "var(--font-mono, monospace)", fontSize: "0.55rem", letterSpacing: "0.1em", color: "rgba(255,255,255,0.25)", textTransform: "uppercase", marginBottom: "1rem" }}>
                    SOVEREIGN Process
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: "1px" }}>
                    {caseStudy.steps.map((step, i) => (
                      <div key={i} style={{
                        display: "grid", gridTemplateColumns: "24px 1fr auto",
                        gap: "1rem", padding: "0.85rem 1rem",
                        background: "rgba(255,255,255,0.015)",
                        border: "1px solid rgba(255,255,255,0.04)",
                        alignItems: "start",
                      }}>
                        <span style={{ fontFamily: "var(--font-mono, monospace)", fontSize: "0.55rem", color: lc.text, paddingTop: 3 }}>
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        <div>
                          <div style={{ fontSize: "0.85rem", fontWeight: 700, color: "#F0F4FF", marginBottom: "0.2rem" }}>
                            {step.label}
                          </div>
                          <div style={{ fontSize: "0.78rem", color: "#8892A4", lineHeight: 1.55 }}>
                            {step.action}
                          </div>
                        </div>
                        <span style={{ fontFamily: "var(--font-mono, monospace)", fontSize: "0.5rem", letterSpacing: "0.08em", color: "rgba(255,255,255,0.2)", border: "1px solid rgba(255,255,255,0.06)", padding: "2px 7px", whiteSpace: "nowrap", alignSelf: "start" }}>
                          {step.agent}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Results grid */}
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: "1px", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.06)", marginBottom: "1.5rem" }}>
                  {caseStudy.results.map((r) => (
                    <div key={r.metric} style={{ padding: "1.25rem", background: "#080E1A" }}>
                      <div style={{ fontFamily: "var(--font-space-grotesk, sans-serif)", fontWeight: 900, fontSize: "1.5rem", color: lc.text, letterSpacing: "-0.02em", lineHeight: 1 }}>
                        {r.value}
                      </div>
                      <div style={{ fontFamily: "var(--font-mono, monospace)", fontSize: "0.55rem", letterSpacing: "0.06em", color: "rgba(255,255,255,0.4)", margin: "0.4rem 0 0.2rem", textTransform: "uppercase" }}>
                        {r.metric}
                      </div>
                      <div style={{ fontSize: "0.72rem", color: "rgba(255,255,255,0.3)", lineHeight: 1.4 }}>
                        {r.context}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Pull quote */}
                <blockquote style={{
                  borderLeft: `2px solid ${lc.text}`,
                  paddingLeft: "1.5rem",
                  margin: 0,
                  fontSize: "1rem", fontStyle: "italic",
                  fontWeight: 500, lineHeight: 1.65,
                  color: "rgba(255,255,255,0.65)",
                }}>
                  &ldquo;{caseStudy.quote}&rdquo;
                  <footer style={{ fontStyle: "normal", fontFamily: "var(--font-mono, monospace)", fontSize: "0.6rem", color: "rgba(255,255,255,0.3)", marginTop: "0.75rem", letterSpacing: "0.06em" }}>
                    — {caseStudy.persona}, {caseStudy.personaRole}
                  </footer>
                </blockquote>
              </section>
            )}

            {/* Section 05 — Intelligence Matrix (FAQ) */}
            <section>
              <SectionLabel index="05" label="Intelligence Matrix" />
              <div style={{ display: "flex", flexDirection: "column", gap: "0" }}>
                {mod.faq.map((item, i) => (
                  <div key={i} style={{
                    padding: "1.5rem",
                    borderBottom: i < mod.faq.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none",
                    background: "rgba(255,255,255,0.01)",
                    border: "1px solid rgba(255,255,255,0.04)",
                    marginBottom: i < mod.faq.length - 1 ? "1px" : 0,
                  }}>
                    <p style={{ fontWeight: 600, fontSize: "0.95rem", color: "#F0F4FF", marginBottom: "0.6rem", lineHeight: 1.4 }}>
                      {item.q}
                    </p>
                    <p style={{ fontSize: "0.88rem", color: "#8892A4", lineHeight: 1.65 }}>
                      {item.a}
                    </p>
                  </div>
                ))}
              </div>
            </section>

            {/* Section 05 — Related Cluster Articles */}
            {relatedArticles.length > 0 && (
              <section>
                <SectionLabel index="06" label="Intelligence Cluster" />
                <div style={{ display: "flex", flexDirection: "column", gap: "1px", background: "rgba(255,255,255,0.04)" }}>
                  {relatedArticles.map((a) => (
                    <Link key={a.slug} href={`/${locale}/blog/${a.slug}`} style={{ textDecoration: "none", display: "block" }}>
                      <div style={{
                        padding: "1.25rem",
                        background: "rgba(255,255,255,0.015)",
                        display: "flex", alignItems: "center", justifyContent: "space-between", gap: "1rem",
                      }}>
                        <div>
                          <div style={{ fontFamily: "var(--font-mono, monospace)", fontSize: "0.5rem", letterSpacing: "0.1em", color: "rgba(0,212,255,0.5)", textTransform: "uppercase", marginBottom: "0.4rem" }}>
                            INTELLIGENCE CLUSTER · {a.mins} MIN
                          </div>
                          <div style={{ fontWeight: 600, fontSize: "0.9rem", color: "#F0F4FF", lineHeight: 1.35 }}>
                            {locale === "de" ? a.title : a.titleEn}
                          </div>
                        </div>
                        <div style={{ fontFamily: "var(--font-mono, monospace)", fontSize: "0.6rem", color: lc.text, flexShrink: 0 }}>→</div>
                      </div>
                    </Link>
                  ))}
                </div>
                <div style={{ marginTop: "1rem" }}>
                  <Link href={`/${locale}/blog`} style={{
                    fontFamily: "var(--font-mono, monospace)", fontSize: "0.58rem",
                    letterSpacing: "0.1em", color: "rgba(255,255,255,0.3)",
                    textDecoration: "none", textTransform: "uppercase",
                    transition: "color 0.2s",
                  }}>
                    Alle Intelligence Cluster →
                  </Link>
                </div>
              </section>
            )}

          </div>

          {/* ── RIGHT: Sidebar (col 4) ── */}
          <aside style={{ display: "flex", flexDirection: "column", gap: "1.5rem", position: "sticky", top: "6rem" }}>

            {/* System Architecture */}
            <div style={{
              padding: "1.5rem",
              background: "rgba(255,255,255,0.02)",
              border: "1px solid rgba(255,255,255,0.06)",
            }}>
              <div style={{ fontFamily: "var(--font-mono, monospace)", fontSize: "0.55rem", letterSpacing: "0.14em", color: "rgba(255,255,255,0.3)", textTransform: "uppercase", marginBottom: "1.25rem" }}>
                System Architecture
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                {mod.architecture.map((spec) => (
                  <div key={spec.label} style={{ paddingBottom: "0.75rem", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                    <div style={{ fontFamily: "var(--font-mono, monospace)", fontSize: "0.55rem", color: "rgba(255,255,255,0.3)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "3px" }}>
                      {spec.label}
                    </div>
                    <div style={{ fontFamily: "var(--font-mono, monospace)", fontSize: "0.8rem", fontWeight: 600, color: "#F0F4FF" }}>
                      {spec.value}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Powered by Agent */}
            <div style={{
              padding: "1.5rem",
              background: lc.bg,
              border: `1px solid ${lc.border}`,
            }}>
              <div style={{ fontFamily: "var(--font-mono, monospace)", fontSize: "0.55rem", letterSpacing: "0.14em", color: lc.text, textTransform: "uppercase", marginBottom: "1rem" }}>
                Powered by Agent
              </div>
              <div style={{
                display: "flex", alignItems: "center", justifyContent: "space-between",
                padding: "0.75rem",
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.06)",
              }}>
                <div>
                  <div style={{ fontFamily: "var(--font-mono, monospace)", fontSize: "0.65rem", fontWeight: 700, color: lc.text }}>
                    {mod.agentCode}
                  </div>
                  <div style={{ fontFamily: "var(--font-mono, monospace)", fontSize: "0.7rem", color: "#F0F4FF", marginTop: 2 }}>
                    {mod.name}
                  </div>
                </div>
                <div style={{ fontFamily: "var(--font-mono, monospace)", fontSize: "0.55rem", color: "rgba(0,230,118,0.7)" }}>
                  ACTIVE
                </div>
              </div>
            </div>

            {/* Senate Score */}
            <div style={{
              padding: "1.5rem",
              background: "rgba(0,230,118,0.04)",
              border: "1px solid rgba(0,230,118,0.15)",
              display: "flex", alignItems: "center", gap: "1rem",
            }}>
              <div style={{
                fontFamily: "var(--font-mono, monospace)", fontWeight: 900,
                fontSize: "2.5rem", color: "#00E676", lineHeight: 1, flexShrink: 0,
              }}>
                {mod.score}
              </div>
              <div>
                <div style={{ fontFamily: "var(--font-mono, monospace)", fontSize: "0.6rem", fontWeight: 700, color: "#00E676", letterSpacing: "0.08em", textTransform: "uppercase" }}>
                  Senate Gate — VERIFIED
                </div>
                <p style={{ fontFamily: "var(--font-mono, monospace)", fontSize: "0.65rem", color: "#8892A4", lineHeight: 1.5, marginTop: 4 }}>
                  EU AI Act & DSGVO Compliance geprüft und kryptographisch signiert.
                </p>
              </div>
            </div>

            {/* Other modules */}
            <div style={{
              padding: "1.25rem",
              border: "1px solid rgba(255,255,255,0.04)",
            }}>
              <div style={{ fontFamily: "var(--font-mono, monospace)", fontSize: "0.55rem", letterSpacing: "0.14em", color: "rgba(255,255,255,0.25)", textTransform: "uppercase", marginBottom: "0.75rem" }}>
                Other Modules
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                {otherModules.map((m) => (
                  <Link key={m.slug} href={`/${locale}/module/${m.slug}`} style={{
                    display: "flex", alignItems: "center", gap: "0.5rem",
                    padding: "0.5rem", textDecoration: "none",
                    transition: "background 0.15s",
                  }}>
                    <span style={{ fontSize: "0.9rem" }}>{m.emoji}</span>
                    <span style={{ fontSize: "0.8rem", color: "rgba(255,255,255,0.5)" }}>{m.name}</span>
                  </Link>
                ))}
              </div>
            </div>

          </aside>
        </div>

        {/* Boot CTA */}
        <div style={{
          marginTop: "6rem", paddingTop: "4rem",
          borderTop: "1px solid rgba(255,255,255,0.05)",
          textAlign: "center",
        }}>
          <div style={{ fontFamily: "var(--font-mono, monospace)", fontSize: "0.55rem", letterSpacing: "0.14em", color: lc.text, marginBottom: "1rem", textTransform: "uppercase" }}>
            Module {mod.name} Live
          </div>
          <h2 style={{
            fontFamily: "var(--font-space-grotesk, sans-serif)",
            fontWeight: 900, fontSize: "clamp(2rem, 4vw, 3rem)",
            letterSpacing: "-0.03em", color: "#F0F4FF", marginBottom: "1rem",
          }}>
            Boot Application.
          </h2>
          <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
            <Link href="/dashboard" className="lp-btn-primary" style={{ fontSize: "0.8rem" }}>
              Launch Interface
            </Link>
            <Link href={`/${locale}/module`} style={{
              padding: "0.75rem 1.5rem",
              border: "1px solid rgba(255,255,255,0.12)",
              color: "rgba(255,255,255,0.5)", textDecoration: "none",
              fontFamily: "var(--font-mono, monospace)", fontSize: "0.65rem",
              letterSpacing: "0.1em", textTransform: "uppercase",
            }}>
              Module Registry
            </Link>
          </div>
        </div>

      </div>
      <Footer />
    </div>
  );
}

function SectionLabel({ index, label }: { index: string; label: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1.5rem" }}>
      <div style={{
        fontFamily: "var(--font-mono, monospace)", fontSize: "0.6rem",
        letterSpacing: "0.14em", color: "rgba(0,212,255,0.6)",
        border: "1px solid rgba(0,212,255,0.15)",
        padding: "4px 10px", flexShrink: 0,
      }}>
        {index}
      </div>
      <h2 style={{
        fontFamily: "var(--font-space-grotesk, sans-serif)",
        fontWeight: 700, fontSize: "1.3rem",
        color: "#F0F4FF", letterSpacing: "-0.01em",
      }}>
        {label}
      </h2>
    </div>
  );
}
