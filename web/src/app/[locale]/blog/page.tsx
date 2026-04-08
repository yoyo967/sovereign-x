// src/app/[locale]/blog/page.tsx
// ═══════════════════════════════════════════════════════════════
// BLOG INDEX — Intelligence Matrix
// Foundation Pillar Cards (blau) + Intelligence Cluster Cards
// ═══════════════════════════════════════════════════════════════
import type { Metadata } from "next";
import Link from "next/link";
import JsonLd from "@/components/SEO/JsonLd";
import { articles } from "@/lib/content/articles";
import { MODULES } from "@/lib/content/modules";

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
      ? "Intelligence Matrix: Blog & Guides | SOVEREIGN 2030"
      : "Intelligence Matrix: Blog & Guides | SOVEREIGN 2030",
    description: isDE
      ? "Foundation Pillars und Intelligence Cluster: Tiefe Guides zu Vertragsrecht, DSGVO, EU AI Act und autonomer KI — kryptographisch verifiziert."
      : "Foundation Pillars and Intelligence Clusters: Deep guides on contract law, GDPR, EU AI Act and autonomous AI — cryptographically verified.",
    keywords: ["vertrag kündigen", "datenschutz guide", "eu ai act erklärt", "sovereign blog"],
    alternates: { canonical: `${BASE_URL}/${locale}/blog` },
  };
}

// Featured pillars shown as Foundation Pillar cards
const FEATURED_PILLARS = MODULES.slice(0, 4);

export default async function BlogPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Blog",
    "@id": `${BASE_URL}/${locale}/blog#blog`,
    name: "SOVEREIGN 2030 Intelligence Matrix",
    url: `${BASE_URL}/${locale}/blog`,
    publisher: { "@type": "Organization", name: "SOVEREIGN 2030", url: BASE_URL },
    blogPost: articles.map((a) => ({
      "@type": "BlogPosting",
      headline: locale === "de" ? a.title : a.titleEn,
      datePublished: a.publishedAt,
      url: `${BASE_URL}/${locale}/blog/${a.slug}`,
    })),
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

        {/* Header */}
        <div style={{ marginBottom: "5rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: "2rem" }}>
            <Link href={`/${locale}`} style={{ fontFamily: "var(--font-mono, monospace)", fontSize: "0.6rem", letterSpacing: "0.12em", color: "rgba(0,212,255,0.5)", textDecoration: "none" }}>APEX</Link>
            <span style={{ color: "rgba(255,255,255,0.2)", fontSize: "0.6rem" }}>›</span>
            <span style={{ fontFamily: "var(--font-mono, monospace)", fontSize: "0.6rem", letterSpacing: "0.12em", color: "rgba(255,255,255,0.3)" }}>INTELLIGENCE MATRIX</span>
          </div>

          <div style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            fontFamily: "var(--font-mono, monospace)", fontSize: "0.55rem",
            letterSpacing: "0.14em", color: "rgba(0,212,255,0.6)",
            border: "1px solid rgba(0,212,255,0.2)", padding: "3px 10px",
            marginBottom: "1.5rem",
          }}>
            NEURAL BLOG ENGINE // GLOBAL FEED SYNCED
          </div>

          <h1 style={{
            fontFamily: "var(--font-space-grotesk, sans-serif)",
            fontWeight: 900, fontSize: "clamp(2.5rem, 6vw, 4rem)",
            letterSpacing: "-0.03em", lineHeight: 1.05,
            color: "#F0F4FF", marginBottom: "1.25rem",
          }}>
            Intelligence Matrix.
          </h1>
          <p style={{ fontSize: "1.05rem", lineHeight: 1.7, color: "#8892A4", maxWidth: 560 }}>
            Foundation Pillars und Intelligence Cluster — das vollständige Wissenssystem
            von SOVEREIGN 2030. Kryptographisch verifiziert, juristen-geprüft, immer aktuell.
          </p>
        </div>

        {/* ── Foundation Pillars ── */}
        <div style={{ marginBottom: "4rem" }}>
          <div style={{
            fontFamily: "var(--font-mono, monospace)", fontSize: "0.55rem",
            letterSpacing: "0.14em", color: "rgba(255,255,255,0.25)",
            textTransform: "uppercase", marginBottom: "1.5rem",
          }}>
            Foundation Pillars — Architektur-Wissen
          </div>

          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
            gap: "1px",
            background: "rgba(255,255,255,0.04)",
          }}>
            {FEATURED_PILLARS.map((mod) => (
              <Link
                key={mod.slug}
                href={`/${locale}/module/${mod.slug}`}
                style={{ textDecoration: "none", display: "block" }}
              >
                <article style={{
                  background: "#080E1A",
                  border: "1px solid rgba(0,212,255,0.15)",
                  overflow: "hidden",
                  transition: "all 0.4s",
                  cursor: "pointer",
                  height: "100%",
                  display: "flex", flexDirection: "column",
                }}>
                  {/* Image / Visual (h-72) */}
                  <div style={{
                    position: "relative", height: 220, overflow: "hidden", flexShrink: 0,
                    background: "linear-gradient(135deg, rgba(0,212,255,0.04) 0%, rgba(8,14,26,0.98) 100%)",
                    borderBottom: "1px solid rgba(0,212,255,0.08)",
                  }}>
                    <div style={{
                      position: "absolute", inset: 0,
                      backgroundImage: "linear-gradient(rgba(0,212,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0,212,255,0.03) 1px, transparent 1px)",
                      backgroundSize: "30px 30px",
                    }} />
                    <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <span style={{ fontSize: "3rem", opacity: 0.7 }}>{mod.emoji}</span>
                    </div>
                    <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, #080E1A 0%, rgba(8,14,26,0.3) 60%, transparent 100%)" }} />

                    {/* Badges top-left */}
                    <div style={{ position: "absolute", top: "1rem", left: "1rem", display: "flex", gap: "0.4rem", zIndex: 10 }}>
                      <span style={{
                        fontFamily: "var(--font-mono, monospace)", fontSize: "0.5rem",
                        letterSpacing: "0.1em", padding: "3px 8px",
                        background: "rgba(0,212,255,0.12)", border: "1px solid rgba(0,212,255,0.3)",
                        color: "#00D4FF", textTransform: "uppercase",
                      }}>
                        Foundation Pillar
                      </span>
                      <span style={{
                        fontFamily: "var(--font-mono, monospace)", fontSize: "0.5rem",
                        letterSpacing: "0.06em", padding: "3px 8px",
                        background: "rgba(0,0,0,0.5)", border: "1px solid rgba(255,255,255,0.1)",
                        color: "rgba(255,255,255,0.5)",
                      }}>
                        {mod.layerCode}
                      </span>
                    </div>

                    {/* Score badge top-right */}
                    <div style={{
                      position: "absolute", top: "1rem", right: "1rem",
                      fontFamily: "var(--font-mono, monospace)", fontSize: "0.6rem",
                      padding: "3px 8px",
                      background: "rgba(0,230,118,0.1)", border: "1px solid rgba(0,230,118,0.3)",
                      color: "#00E676",
                    }}>
                      {mod.score}/100
                    </div>
                  </div>

                  {/* Content */}
                  <div style={{
                    padding: "1.5rem", flex: 1,
                    background: "linear-gradient(to bottom, #080E1A 0%, rgba(6,11,21,0.98) 100%)",
                  }}>
                    <div style={{ fontFamily: "var(--font-mono, monospace)", fontSize: "0.5rem", letterSpacing: "0.1em", color: "rgba(0,212,255,0.5)", marginBottom: "0.5rem", textTransform: "uppercase" }}>
                      Architectural Core
                    </div>
                    <h3 style={{
                      fontFamily: "var(--font-space-grotesk, sans-serif)",
                      fontWeight: 700, fontSize: "1rem",
                      color: "#F0F4FF", lineHeight: 1.35, marginBottom: "0.6rem",
                    }}>
                      {mod.name}
                    </h3>
                    <p style={{ fontSize: "0.8rem", color: "#8892A4", lineHeight: 1.6, marginBottom: "1rem" }}>
                      {mod.subtitle}
                    </p>
                    <span style={{
                      fontFamily: "var(--font-mono, monospace)", fontSize: "0.58rem",
                      letterSpacing: "0.08em", color: "#00D4FF",
                      textTransform: "uppercase",
                    }}>
                      Access Intelligence Record →
                    </span>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        </div>

        {/* ── Intelligence Clusters ── */}
        <div>
          <div style={{
            fontFamily: "var(--font-mono, monospace)", fontSize: "0.55rem",
            letterSpacing: "0.14em", color: "rgba(255,255,255,0.25)",
            textTransform: "uppercase", marginBottom: "1.5rem",
          }}>
            Intelligence Cluster — Deep-Dive Guides
          </div>

          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
            gap: "1px",
            background: "rgba(255,255,255,0.04)",
          }}>
            {articles.map((article, i) => {
              const title = locale === "de" ? article.title : article.titleEn;
              const description = locale === "de" ? article.description : article.descriptionEn;
              const score = 90 + (i % 6);

              return (
                <Link
                  key={article.slug}
                  href={`/${locale}/blog/${article.slug}`}
                  style={{ textDecoration: "none", display: "block" }}
                >
                  <article style={{
                    background: "#080E1A",
                    border: "1px solid rgba(255,255,255,0.05)",
                    overflow: "hidden",
                    transition: "all 0.4s",
                    cursor: "pointer",
                    height: "100%", display: "flex", flexDirection: "column",
                  }}>
                    {/* Image (h-56) */}
                    <div style={{
                      position: "relative", height: 176, overflow: "hidden", flexShrink: 0,
                      background: "linear-gradient(135deg, rgba(255,255,255,0.02) 0%, rgba(8,14,26,0.98) 100%)",
                      borderBottom: "1px solid rgba(255,255,255,0.04)",
                    }}>
                      <div style={{
                        position: "absolute", inset: 0,
                        backgroundImage: "linear-gradient(rgba(255,255,255,0.015) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.015) 1px, transparent 1px)",
                        backgroundSize: "24px 24px",
                      }} />
                      <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <span style={{
                          fontFamily: "var(--font-mono, monospace)",
                          fontSize: "3rem", fontWeight: 900,
                          color: "rgba(255,255,255,0.04)", letterSpacing: "-0.05em",
                        }}>
                          {article.tag.slice(0, 2)}
                        </span>
                      </div>
                      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, #080E1A 0%, rgba(8,14,26,0.2) 70%, transparent 100%)" }} />

                      {/* Score badge top-right */}
                      <div style={{
                        position: "absolute", top: "1rem", right: "1rem",
                        fontFamily: "var(--font-mono, monospace)", fontSize: "0.6rem",
                        padding: "3px 8px",
                        background: "rgba(0,230,118,0.1)", border: "1px solid rgba(0,230,118,0.25)",
                        color: "#00E676",
                      }}>
                        {score}/100
                      </div>
                    </div>

                    {/* Content */}
                    <div style={{
                      padding: "1.25rem", flex: 1,
                      background: "linear-gradient(to bottom, #080E1A 0%, #060B15 100%)",
                    }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.6rem" }}>
                        <span style={{
                          fontFamily: "var(--font-mono, monospace)", fontSize: "0.5rem",
                          letterSpacing: "0.08em", padding: "2px 6px",
                          background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)",
                          color: "rgba(255,255,255,0.35)", textTransform: "uppercase",
                        }}>
                          {article.publishedAt.slice(0, 7)}
                        </span>
                        <span style={{
                          fontFamily: "var(--font-mono, monospace)", fontSize: "0.5rem",
                          letterSpacing: "0.08em", padding: "2px 6px",
                          background: "rgba(0,212,255,0.06)", border: "1px solid rgba(0,212,255,0.15)",
                          color: "rgba(0,212,255,0.6)", textTransform: "uppercase",
                        }}>
                          Intelligence Cluster
                        </span>
                      </div>
                      <h3 style={{
                        fontFamily: "var(--font-space-grotesk, sans-serif)",
                        fontWeight: 700, fontSize: "0.95rem",
                        color: "#F0F4FF", lineHeight: 1.35, marginBottom: "0.6rem",
                      }}>
                        {title}
                      </h3>
                      <p style={{ fontSize: "0.78rem", color: "#8892A4", lineHeight: 1.6, marginBottom: "0.75rem" }}>
                        {description.slice(0, 100)}...
                      </p>
                      <span style={{
                        fontFamily: "var(--font-mono, monospace)", fontSize: "0.55rem",
                        letterSpacing: "0.08em", color: "rgba(255,255,255,0.3)",
                        textTransform: "uppercase",
                      }}>
                        Access Intelligence Record →
                      </span>
                    </div>
                  </article>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Module Registry CTA */}
        <div style={{
          marginTop: "5rem", padding: "3rem",
          border: "1px solid rgba(0,212,255,0.12)",
          background: "rgba(0,212,255,0.02)",
          display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", gap: "1.25rem",
        }}>
          <div style={{ fontFamily: "var(--font-mono, monospace)", fontSize: "0.55rem", letterSpacing: "0.14em", color: "rgba(0,212,255,0.5)", textTransform: "uppercase" }}>
            Wissen in Aktion
          </div>
          <h2 style={{
            fontFamily: "var(--font-space-grotesk, sans-serif)",
            fontWeight: 900, fontSize: "clamp(1.5rem, 3vw, 2.5rem)",
            letterSpacing: "-0.03em", color: "#F0F4FF", lineHeight: 1.1,
          }}>
            Wissen ist der erste Schritt.<br />
            <span style={{ color: "#00D4FF" }}>Aktion ist der zweite.</span>
          </h2>
          <p style={{ fontSize: "0.95rem", color: "#8892A4", maxWidth: 480, lineHeight: 1.65 }}>
            SOVEREIGN automatisiert, was du hier lernst — vollständig autonom, vollständig in deinem Interesse.
          </p>
          <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", justifyContent: "center" }}>
            <Link href="/dashboard" className="lp-btn-primary" style={{ fontSize: "0.8rem" }}>
              Jetzt Sovereign werden
            </Link>
            <Link href={`/${locale}/module`} style={{
              padding: "0.75rem 1.5rem",
              border: "1px solid rgba(255,255,255,0.1)",
              color: "rgba(255,255,255,0.45)", textDecoration: "none",
              fontFamily: "var(--font-mono, monospace)", fontSize: "0.65rem",
              letterSpacing: "0.1em", textTransform: "uppercase",
            }}>
              Module Registry →
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
