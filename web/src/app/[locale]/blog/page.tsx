import type { Metadata } from "next";
import Link from "next/link";
import JsonLd from "@/components/SEO/JsonLd";
import { articles } from "@/lib/content/articles";
import { ArrowRight, Clock } from "lucide-react";

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
      ? "Blog & Wissens-Hub: Vertragsrecht, Datenschutz & KI | SOVEREIGN 2030"
      : "Blog & Knowledge Hub: Contract Law, Privacy & AI | SOVEREIGN 2030",
    description: isDE
      ? "Umfassende Guides zu Vertragsrecht, DSGVO, EU AI Act und autonomer KI — von Juristen geprüft. Vertrag kündigen, Preiserhöhung widersprechen, Datensouveränität durchsetzen."
      : "Comprehensive guides on contract law, GDPR, EU AI Act and autonomous AI — reviewed by lawyers. Cancel contracts, object to price increases, enforce data sovereignty.",
    keywords: [
      "vertrag kündigen", "datenschutz guide", "eu ai act erklärt", "dsgvo rechte",
      "preiserhöhung widersprechen", "abofalle erkennen", "sovereign blog",
    ],
    alternates: {
      canonical: `${BASE_URL}/${locale}/blog`,
    },
    openGraph: {
      title: "SOVEREIGN Blog & Wissens-Hub",
      description: "Guides zu Vertragsrecht, DSGVO, EU AI Act und KI-Souveränität.",
      url: `${BASE_URL}/${locale}/blog`,
    },
  };
}

const TAG_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  VERTRAGSRECHT: { bg: "rgba(0,212,255,0.06)", text: "rgba(0,212,255,0.8)", border: "rgba(0,212,255,0.2)" },
  VERBRAUCHERRECHT: { bg: "rgba(100,200,255,0.06)", text: "rgba(100,200,255,0.8)", border: "rgba(100,200,255,0.2)" },
  FINANZEN: { bg: "rgba(0,255,160,0.05)", text: "rgba(0,255,160,0.7)", border: "rgba(0,255,160,0.2)" },
  REISERECHT: { bg: "rgba(180,130,255,0.06)", text: "rgba(180,130,255,0.8)", border: "rgba(180,130,255,0.2)" },
  TECHNOLOGIE: { bg: "rgba(0,212,255,0.06)", text: "rgba(0,212,255,0.8)", border: "rgba(0,212,255,0.2)" },
  DEFAULT: { bg: "rgba(255,255,255,0.04)", text: "rgba(255,255,255,0.4)", border: "rgba(255,255,255,0.1)" },
};

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
    name: "SOVEREIGN 2030 Blog & Wissens-Hub",
    description: "Umfassende Guides zu Vertragsrecht, DSGVO, EU AI Act und autonomer KI.",
    url: `${BASE_URL}/${locale}/blog`,
    publisher: {
      "@type": "Organization",
      name: "SOVEREIGN 2030",
      url: BASE_URL,
      logo: { "@type": "ImageObject", url: `${BASE_URL}/logo.svg` },
    },
    blogPost: articles.map((a) => ({
      "@type": "BlogPosting",
      headline: locale === "de" ? a.title : a.titleEn,
      description: locale === "de" ? a.description : a.descriptionEn,
      datePublished: a.publishedAt,
      dateModified: a.updatedAt,
      url: `${BASE_URL}/${locale}/blog/${a.slug}`,
      author: { "@type": "Organization", name: "SOVEREIGN 2030" },
      keywords: a.keywords.join(", "),
    })),
  };

  const pillarLinks = [
    { href: `/${locale}/souveraenitaet`, label: "Datensouveränität", tag: "DATENSCHUTZ" },
    { href: `/${locale}/architektur`, label: "APEX Architektur", tag: "TECHNOLOGIE" },
    { href: `/${locale}/sicherheit`, label: "EU AI Act & DSGVO", tag: "EU AI ACT" },
  ];

  return (
    <div
      style={{
        background: "#080E1A",
        minHeight: "100vh",
        fontFamily: "var(--font-space-grotesk, sans-serif)",
        color: "rgba(255,255,255,0.85)",
      }}
    >
      <JsonLd data={jsonLd} />

      {/* Background grid */}
      <div
        className="fixed inset-0 pointer-events-none z-0"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />

      <div className="relative z-10 max-w-6xl mx-auto px-6 py-32">

        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" style={{ marginBottom: "3rem" }}>
          <ol style={{ display: "flex", alignItems: "center", gap: 8, listStyle: "none", padding: 0 }}>
            <li>
              <Link href={`/${locale}`} style={{ fontFamily: "var(--font-jetbrains, monospace)", fontSize: "0.65rem", letterSpacing: "0.1em", color: "rgba(0,212,255,0.5)", textDecoration: "none" }}>
                SOVEREIGN
              </Link>
            </li>
            <li style={{ color: "rgba(255,255,255,0.2)", fontSize: "0.65rem" }}>›</li>
            <li style={{ fontFamily: "var(--font-jetbrains, monospace)", fontSize: "0.65rem", letterSpacing: "0.1em", color: "rgba(255,255,255,0.3)" }}>
              BLOG
            </li>
          </ol>
        </nav>

        {/* Header */}
        <div style={{ marginBottom: "4rem" }}>
          <div className="lp-badge" style={{ marginBottom: "1.5rem", display: "inline-block" }}>
            WISSENS-HUB // SOVEREIGN 2030
          </div>
          <h1
            style={{
              fontFamily: "var(--font-space-grotesk, sans-serif)",
              fontWeight: 800,
              fontSize: "clamp(2rem, 5vw, 3.5rem)",
              lineHeight: 1.1,
              letterSpacing: "-0.03em",
              color: "rgba(255,255,255,0.95)",
              marginBottom: "1.25rem",
            }}
          >
            Alles Wissen.
            <br />
            <span style={{ color: "rgba(0,212,255,0.9)" }}>Sofort verfügbar.</span>
          </h1>
          <p
            style={{
              fontSize: "1.05rem",
              lineHeight: 1.7,
              color: "rgba(255,255,255,0.45)",
              maxWidth: 580,
            }}
          >
            Umfassende Guides zu Vertragsrecht, Datenschutz und autonomer KI —
            von Juristen geprüft, regelmäßig aktualisiert, immer auf dem Stand der Gesetzgebung 2026.
          </p>
        </div>

        {/* Pillar Pages Banner */}
        <div style={{ marginBottom: "4rem" }}>
          <p
            style={{
              fontFamily: "var(--font-jetbrains, monospace)",
              fontSize: "0.6rem",
              letterSpacing: "0.14em",
              color: "rgba(255,255,255,0.25)",
              textTransform: "uppercase",
              marginBottom: "1rem",
            }}
          >
            Pillar Guides — Autoritätswissen
          </p>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: "1px",
              background: "rgba(255,255,255,0.06)",
              border: "1px solid rgba(255,255,255,0.06)",
            }}
          >
            {pillarLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.5rem",
                  padding: "1.5rem",
                  background: "rgba(0,212,255,0.02)",
                  textDecoration: "none",
                  transition: "background 0.2s",
                  borderRight: "1px solid rgba(255,255,255,0.04)",
                }}
              >
                <span
                  style={{
                    fontFamily: "var(--font-jetbrains, monospace)",
                    fontSize: "0.55rem",
                    letterSpacing: "0.1em",
                    color: "rgba(0,212,255,0.5)",
                  }}
                >
                  {link.tag}
                </span>
                <span
                  style={{
                    fontFamily: "var(--font-space-grotesk, sans-serif)",
                    fontWeight: 700,
                    fontSize: "1rem",
                    color: "rgba(255,255,255,0.85)",
                    lineHeight: 1.3,
                  }}
                >
                  {link.label}
                </span>
                <span
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.4rem",
                    fontFamily: "var(--font-jetbrains, monospace)",
                    fontSize: "0.62rem",
                    color: "rgba(0,212,255,0.5)",
                    marginTop: "0.25rem",
                  }}
                >
                  Vollständigen Guide lesen
                  <ArrowRight size={10} />
                </span>
              </Link>
            ))}
          </div>
        </div>

        {/* Article Grid */}
        <div>
          <p
            style={{
              fontFamily: "var(--font-jetbrains, monospace)",
              fontSize: "0.6rem",
              letterSpacing: "0.14em",
              color: "rgba(255,255,255,0.25)",
              textTransform: "uppercase",
              marginBottom: "1.5rem",
            }}
          >
            Cluster Artikel — Deep-Dive Guides
          </p>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(1, 1fr)",
              border: "1px solid rgba(255,255,255,0.07)",
            }}
          >
            {articles.map((article, i) => {
              const tagStyle = TAG_COLORS[article.tag] ?? TAG_COLORS.DEFAULT;
              const title = locale === "de" ? article.title : article.titleEn;
              const description = locale === "de" ? article.description : article.descriptionEn;

              return (
                <article
                  key={article.slug}
                  style={{
                    borderBottom: i < articles.length - 1 ? "1px solid rgba(255,255,255,0.07)" : "none",
                  }}
                >
                  <Link
                    href={`/${locale}/blog/${article.slug}`}
                    style={{ textDecoration: "none", display: "block", padding: "2rem", transition: "background 0.2s" }}
                  >
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "1rem",
                      }}
                    >
                      {/* Top row */}
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "1rem" }}>
                        <span
                          style={{
                            fontFamily: "var(--font-jetbrains, monospace)",
                            fontSize: "0.55rem",
                            letterSpacing: "0.1em",
                            color: tagStyle.text,
                            border: `1px solid ${tagStyle.border}`,
                            background: tagStyle.bg,
                            padding: "2px 8px",
                          }}
                        >
                          {article.tag}
                        </span>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "0.35rem",
                            fontFamily: "var(--font-jetbrains, monospace)",
                            fontSize: "0.58rem",
                            color: "rgba(255,255,255,0.25)",
                          }}
                        >
                          <Clock size={10} />
                          {article.mins} Min. Lesezeit
                        </div>
                      </div>

                      {/* Title + Desc */}
                      <div>
                        <h2
                          style={{
                            fontFamily: "var(--font-space-grotesk, sans-serif)",
                            fontWeight: 700,
                            fontSize: "1.15rem",
                            color: "rgba(255,255,255,0.9)",
                            lineHeight: 1.35,
                            marginBottom: "0.6rem",
                            letterSpacing: "-0.01em",
                          }}
                        >
                          {title}
                        </h2>
                        <p
                          style={{
                            fontSize: "0.88rem",
                            lineHeight: 1.65,
                            color: "rgba(255,255,255,0.4)",
                          }}
                        >
                          {description}
                        </p>
                      </div>

                      {/* Bottom row */}
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                        <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
                          {article.keywords.slice(0, 3).map((kw) => (
                            <span
                              key={kw}
                              style={{
                                fontFamily: "var(--font-jetbrains, monospace)",
                                fontSize: "0.52rem",
                                letterSpacing: "0.06em",
                                color: "rgba(255,255,255,0.2)",
                                border: "1px solid rgba(255,255,255,0.06)",
                                padding: "1px 6px",
                              }}
                            >
                              {kw}
                            </span>
                          ))}
                        </div>
                        <span
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "0.4rem",
                            fontFamily: "var(--font-space-grotesk, sans-serif)",
                            fontSize: "0.72rem",
                            fontWeight: 600,
                            letterSpacing: "0.06em",
                            textTransform: "uppercase",
                            color: "rgba(0,212,255,0.6)",
                          }}
                        >
                          Lesen
                          <ArrowRight size={12} />
                        </span>
                      </div>
                    </div>
                  </Link>
                </article>
              );
            })}
          </div>
        </div>

        {/* Bottom CTA */}
        <div
          style={{
            marginTop: "5rem",
            padding: "3rem",
            border: "1px solid rgba(0,212,255,0.15)",
            background: "rgba(0,212,255,0.02)",
            textAlign: "center",
          }}
        >
          <p
            style={{
              fontFamily: "var(--font-jetbrains, monospace)",
              fontSize: "0.62rem",
              letterSpacing: "0.14em",
              color: "rgba(0,212,255,0.5)",
              marginBottom: "1rem",
              textTransform: "uppercase",
            }}
          >
            Wissen in Aktion
          </p>
          <h2
            style={{
              fontFamily: "var(--font-space-grotesk, sans-serif)",
              fontWeight: 800,
              fontSize: "1.8rem",
              color: "rgba(255,255,255,0.95)",
              lineHeight: 1.2,
              marginBottom: "1rem",
            }}
          >
            Wissen ist der erste Schritt.
            <br />
            <span style={{ color: "rgba(0,212,255,0.9)" }}>Aktion ist der zweite.</span>
          </h2>
          <p style={{ fontSize: "0.9rem", color: "rgba(255,255,255,0.4)", maxWidth: 480, margin: "0 auto 2rem", lineHeight: 1.65 }}>
            SOVEREIGN automatisiert, was du hier lernst. Verträge kündigen, Preiserhöhungen widersprechen,
            Daten schützen — vollständig autonom, vollständig in deinem Interesse.
          </p>
          <Link href="/dashboard" className="lp-btn-primary">
            Jetzt Sovereign werden
          </Link>
        </div>

      </div>
    </div>
  );
}
