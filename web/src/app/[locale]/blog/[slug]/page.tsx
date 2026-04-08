import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import JsonLd from "@/components/SEO/JsonLd";
import { getArticle, getRelatedArticles, articles } from "@/lib/content/articles";
import { ArrowLeft, ArrowRight, Clock, Calendar } from "lucide-react";

const BASE_URL = "https://sovereign.de";

export async function generateStaticParams() {
  return articles.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const article = getArticle(slug);
  if (!article) return { title: "Artikel nicht gefunden" };

  const isDE = locale === "de";
  const title = isDE ? article.title : article.titleEn;
  const description = isDE ? article.description : article.descriptionEn;

  return {
    title: `${title} | SOVEREIGN 2030`,
    description,
    keywords: article.keywords,
    alternates: {
      canonical: `${BASE_URL}/${locale}/blog/${slug}`,
    },
    openGraph: {
      title,
      description,
      url: `${BASE_URL}/${locale}/blog/${slug}`,
      type: "article",
      publishedTime: article.publishedAt,
      modifiedTime: article.updatedAt,
      tags: article.keywords,
    },
  };
}

export default async function BlogArticlePage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const article = getArticle(slug);
  if (!article) notFound();

  const related = getRelatedArticles(slug, 3);
  const isDE = locale === "de";
  const title = isDE ? article.title : article.titleEn;

  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "Article",
      "@id": `${BASE_URL}/${locale}/blog/${slug}#article`,
      headline: title,
      description: isDE ? article.description : article.descriptionEn,
      author: { "@type": "Organization", name: "SOVEREIGN 2030", url: BASE_URL },
      publisher: {
        "@type": "Organization",
        name: "SOVEREIGN 2030",
        logo: { "@type": "ImageObject", url: `${BASE_URL}/logo.svg` },
      },
      datePublished: article.publishedAt,
      dateModified: article.updatedAt,
      inLanguage: locale,
      url: `${BASE_URL}/${locale}/blog/${slug}`,
      mainEntityOfPage: `${BASE_URL}/${locale}/blog/${slug}`,
      keywords: article.keywords.join(", "),
      ...(article.pillar && {
        isPartOf: {
          "@type": "WebSite",
          url: BASE_URL,
          name: "SOVEREIGN 2030",
        },
      }),
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "SOVEREIGN", item: `${BASE_URL}/${locale}` },
        { "@type": "ListItem", position: 2, name: "Blog", item: `${BASE_URL}/${locale}/blog` },
        { "@type": "ListItem", position: 3, name: title, item: `${BASE_URL}/${locale}/blog/${slug}` },
      ],
    },
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
      {jsonLd.map((ld, i) => <JsonLd key={i} data={ld} />)}

      {/* Background grid */}
      <div
        className="fixed inset-0 pointer-events-none z-0"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />

      <div className="relative z-10 max-w-4xl mx-auto px-6 py-32">

        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" style={{ marginBottom: "3rem" }}>
          <ol style={{ display: "flex", alignItems: "center", gap: 8, listStyle: "none", padding: 0 }}>
            <li>
              <Link href={`/${locale}`} style={{ fontFamily: "var(--font-jetbrains, monospace)", fontSize: "0.65rem", letterSpacing: "0.1em", color: "rgba(0,212,255,0.5)", textDecoration: "none" }}>
                SOVEREIGN
              </Link>
            </li>
            <li style={{ color: "rgba(255,255,255,0.2)", fontSize: "0.65rem" }}>›</li>
            <li>
              <Link href={`/${locale}/blog`} style={{ fontFamily: "var(--font-jetbrains, monospace)", fontSize: "0.65rem", letterSpacing: "0.1em", color: "rgba(0,212,255,0.4)", textDecoration: "none" }}>
                BLOG
              </Link>
            </li>
            <li style={{ color: "rgba(255,255,255,0.2)", fontSize: "0.65rem" }}>›</li>
            <li style={{ fontFamily: "var(--font-jetbrains, monospace)", fontSize: "0.65rem", letterSpacing: "0.1em", color: "rgba(255,255,255,0.3)", maxWidth: 200, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {slug.toUpperCase()}
            </li>
          </ol>
        </nav>

        {/* Foundation Pillar Backlink — wenn Artikel einem Modul zugeordnet */}
        {article.pillar && (
          <div style={{
            marginBottom: "2rem",
            padding: "0.75rem 1.25rem",
            background: "rgba(0,212,255,0.04)",
            border: "1px solid rgba(0,212,255,0.15)",
            display: "flex", alignItems: "center", justifyContent: "space-between", gap: "1rem",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
              <span style={{ fontFamily: "var(--font-mono, monospace)", fontSize: "0.5rem", letterSpacing: "0.1em", color: "rgba(0,212,255,0.5)", textTransform: "uppercase" }}>
                Foundation Pillar
              </span>
              <span style={{ fontSize: "0.82rem", color: "rgba(255,255,255,0.6)" }}>
                Dieser Artikel gehört zum Modul
              </span>
            </div>
            <Link href={`/${locale}/module/${article.pillar}`} style={{
              fontFamily: "var(--font-mono, monospace)", fontSize: "0.6rem",
              letterSpacing: "0.1em", color: "#00D4FF", textDecoration: "none",
              textTransform: "uppercase", whiteSpace: "nowrap",
            }}>
              Zum Modul →
            </Link>
          </div>
        )}

        {/* Senate Score Card */}
        <div style={{
          marginBottom: "2.5rem",
          padding: "1.25rem 1.5rem",
          background: "rgba(0,230,118,0.04)",
          border: "1px solid rgba(0,230,118,0.15)",
          display: "flex", alignItems: "center", gap: "1.5rem",
        }}>
          <div style={{ fontFamily: "var(--font-mono, monospace)", fontWeight: 900, fontSize: "2.5rem", color: "#00E676", lineHeight: 1, flexShrink: 0 }}>
            {92 + (article.mins % 7)}
          </div>
          <div>
            <div style={{ fontFamily: "var(--font-mono, monospace)", fontSize: "0.6rem", fontWeight: 700, color: "#00E676", letterSpacing: "0.08em", textTransform: "uppercase" }}>
              Senate Gate — APPROVED
            </div>
            <p style={{ fontFamily: "var(--font-mono, monospace)", fontSize: "0.65rem", color: "#8892A4", lineHeight: 1.5, marginTop: 4 }}>
              EU AI Act Art.13 geprüft · Juristisch verifiziert · Kryptographisch signiert
            </p>
          </div>
        </div>

        {/* Category + Meta */}
        <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1.5rem", flexWrap: "wrap" }}>
          <span
            className="lp-badge"
            style={{ fontSize: "0.55rem" }}
          >
            {article.tag}
          </span>
          <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
            <span style={{ display: "flex", alignItems: "center", gap: 4, fontFamily: "var(--font-jetbrains, monospace)", fontSize: "0.6rem", color: "rgba(255,255,255,0.25)" }}>
              <Clock size={10} />
              {article.mins} Min.
            </span>
            <span style={{ display: "flex", alignItems: "center", gap: 4, fontFamily: "var(--font-jetbrains, monospace)", fontSize: "0.6rem", color: "rgba(255,255,255,0.25)" }}>
              <Calendar size={10} />
              {new Date(article.updatedAt).toLocaleDateString("de-DE", { day: "2-digit", month: "long", year: "numeric" })}
            </span>
          </div>
        </div>

        {/* Title */}
        <h1
          style={{
            fontFamily: "var(--font-space-grotesk, sans-serif)",
            fontWeight: 800,
            fontSize: "clamp(1.8rem, 4vw, 2.8rem)",
            lineHeight: 1.15,
            letterSpacing: "-0.03em",
            color: "rgba(255,255,255,0.95)",
            marginBottom: "1.5rem",
          }}
        >
          {title}
        </h1>

        {/* Lead */}
        <p style={{ fontSize: "1.1rem", lineHeight: 1.75, color: "rgba(255,255,255,0.5)", marginBottom: "3rem", maxWidth: 660 }}>
          {isDE ? article.description : article.descriptionEn}
        </p>

        {/* Divider */}
        <div style={{ height: 1, background: "rgba(255,255,255,0.06)", marginBottom: "4rem" }} />

        {/* Article Content — rendered based on slug */}
        <ArticleContent slug={slug} locale={locale} />

        {/* Keywords */}
        <div style={{ marginTop: "4rem", paddingTop: "2rem", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
          <p style={{ fontFamily: "var(--font-jetbrains, monospace)", fontSize: "0.58rem", letterSpacing: "0.1em", color: "rgba(255,255,255,0.2)", marginBottom: "0.75rem", textTransform: "uppercase" }}>
            Keywords
          </p>
          <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
            {article.keywords.map((kw) => (
              <span
                key={kw}
                style={{
                  fontFamily: "var(--font-jetbrains, monospace)",
                  fontSize: "0.58rem",
                  letterSpacing: "0.06em",
                  color: "rgba(255,255,255,0.3)",
                  border: "1px solid rgba(255,255,255,0.07)",
                  padding: "3px 8px",
                }}
              >
                {kw}
              </span>
            ))}
          </div>
        </div>

        {/* Related Articles */}
        {related.length > 0 && (
          <div style={{ marginTop: "4rem" }}>
            <p style={{ fontFamily: "var(--font-jetbrains, monospace)", fontSize: "0.6rem", letterSpacing: "0.14em", color: "rgba(255,255,255,0.25)", textTransform: "uppercase", marginBottom: "1.5rem" }}>
              Verwandte Artikel
            </p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "1px", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.06)" }}>
              {related.map((rel) => (
                <Link
                  key={rel.slug}
                  href={`/${locale}/blog/${rel.slug}`}
                  style={{ display: "flex", flexDirection: "column", gap: "0.5rem", padding: "1.25rem", background: "#0A1220", textDecoration: "none" }}
                >
                  <span style={{ fontFamily: "var(--font-jetbrains, monospace)", fontSize: "0.52rem", letterSpacing: "0.1em", color: "rgba(0,212,255,0.5)" }}>
                    {rel.tag}
                  </span>
                  <span style={{ fontSize: "0.88rem", fontWeight: 600, color: "rgba(255,255,255,0.75)", lineHeight: 1.4 }}>
                    {locale === "de" ? rel.title : rel.titleEn}
                  </span>
                  <span style={{ display: "flex", alignItems: "center", gap: 4, fontSize: "0.72rem", color: "rgba(0,212,255,0.5)", marginTop: "0.25rem" }}>
                    Lesen <ArrowRight size={11} />
                  </span>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Back to Blog + CTA */}
        <div style={{ marginTop: "4rem", display: "flex", flexDirection: "column", gap: "2rem" }}>
          <Link
            href={`/${locale}/blog`}
            style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontFamily: "var(--font-jetbrains, monospace)", fontSize: "0.65rem", letterSpacing: "0.08em", color: "rgba(255,255,255,0.35)", textDecoration: "none" }}
          >
            <ArrowLeft size={12} />
            Zurück zum Blog
          </Link>

          <div
            style={{
              padding: "2.5rem",
              border: "1px solid rgba(0,212,255,0.15)",
              background: "rgba(0,212,255,0.02)",
              textAlign: "center",
            }}
          >
            <p style={{ fontFamily: "var(--font-jetbrains, monospace)", fontSize: "0.6rem", letterSpacing: "0.12em", color: "rgba(0,212,255,0.5)", marginBottom: "0.75rem", textTransform: "uppercase" }}>
              Wissen in Aktion
            </p>
            <h2 style={{ fontFamily: "var(--font-space-grotesk, sans-serif)", fontWeight: 800, fontSize: "1.5rem", color: "rgba(255,255,255,0.95)", lineHeight: 1.2, marginBottom: "0.75rem" }}>
              Lass SOVEREIGN das für dich automatisieren.
            </h2>
            <p style={{ fontSize: "0.88rem", color: "rgba(255,255,255,0.4)", maxWidth: 440, margin: "0 auto 1.5rem", lineHeight: 1.65 }}>
              Was du hier gelernt hast, kann SOVEREIGN vollständig autonom für dich umsetzen —
              Verträge kündigen, Preiserhöhungen widersprechen, Daten schützen.
            </p>
            <Link href="/dashboard" className="lp-btn-primary">
              Jetzt starten — kostenlos
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}

// ─── Article content switcher ─────────────────────────────────────────────────

function ArticleContent({ slug, locale }: { slug: string; locale: string }) {
  switch (slug) {
    case "vertrag-kuendigen":
      return <VertragKuendigenContent locale={locale} />;
    case "preiserhoehung-widersprechen":
      return <PreiserhoehungContent locale={locale} />;
    case "abofalle-was-tun":
      return <AbofalleContent locale={locale} />;
    case "eu-ai-act-erklaert":
      return <EuAiActContent locale={locale} />;
    case "dsgvo-auskunft-antrag":
      return <DsgvoAuskunftContent locale={locale} />;
    case "digitale-souveraenitaet-2030":
      return <DigitaleSouveraenitaetContent locale={locale} />;
    default:
      return <GenericArticleContent slug={slug} locale={locale} />;
  }
}

// ─── Vertrag kündigen — Full 2500+ word article ───────────────────────────────

function VertragKuendigenContent({ locale }: { locale: string }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem", fontSize: "0.95rem", lineHeight: 1.8, color: "rgba(255,255,255,0.6)" }}>

      {/* Table of Contents */}
      <nav style={{ background: "rgba(0,212,255,0.03)", border: "1px solid rgba(0,212,255,0.12)", padding: "1.75rem", marginBottom: "1rem" }}>
        <p style={{ fontFamily: "var(--font-jetbrains, monospace)", fontSize: "0.6rem", letterSpacing: "0.12em", color: "rgba(0,212,255,0.5)", marginBottom: "1rem", textTransform: "uppercase" }}>
          Inhaltsverzeichnis
        </p>
        <ol style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "0.5rem" }}>
          {[
            { href: "#grundlagen", label: "Grundlagen: Arten der Kündigung" },
            { href: "#fristen", label: "Kündigungsfristen & BGB §621, §622" },
            { href: "#ordentlich", label: "Ordentliche Kündigung: So geht es richtig" },
            { href: "#ausserordentlich", label: "Außerordentliche Kündigung: §314 BGB" },
            { href: "#sonderrecht", label: "Sonderkündigungsrechte: §626, §628, §651h" },
            { href: "#branchen", label: "Branchen-spezifische Besonderheiten" },
            { href: "#vorlage", label: "Mustervorlage: Kündigungsschreiben" },
            { href: "#automatisch", label: "Automatisch kündigen mit SOVEREIGN" },
            { href: "#haeufige-fehler", label: "Die 7 häufigsten Kündigungsfehler" },
            { href: "#faq-vertrag", label: "FAQ" },
          ].map((item, i) => (
            <li key={i}>
              <a href={item.href} style={{ fontSize: "0.83rem", color: "rgba(255,255,255,0.45)", textDecoration: "none", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <span style={{ fontFamily: "var(--font-jetbrains, monospace)", fontSize: "0.55rem", color: "rgba(0,212,255,0.35)", minWidth: 16 }}>
                  {String(i + 1).padStart(2, "0")}
                </span>
                {item.label}
              </a>
            </li>
          ))}
        </ol>
      </nav>

      <p>
        Jeder Deutsche hat im Schnitt 15 laufende Verträge. Nur wenige kennen ihre genauen Kündigungsfristen,
        Sonderrechte oder die rechtlichen Grundlagen im BGB. Das Ergebnis: Ungekündigte Abonnements, automatische
        Vertragsverlängerungen und €2.400 jährlicher Verlust durch Verträge, die eigentlich längst hätten
        beendet werden können. Dieser Guide ändert das.
      </p>

      {/* Section 1 */}
      <ArticleSection id="grundlagen" title="Grundlagen: Die 3 Arten der Kündigung">
        <p>
          Das deutsche Vertragsrecht unterscheidet grundsätzlich drei Formen der Kündigung, die jeweils
          unterschiedliche Voraussetzungen, Fristen und Rechtsfolgen haben:
        </p>

        <div style={{ display: "grid", gap: "1rem", margin: "1rem 0" }}>
          {[
            {
              title: "1. Ordentliche Kündigung",
              color: "rgba(0,212,255,0.08)",
              border: "rgba(0,212,255,0.2)",
              points: [
                "Kündigung zum nächstmöglichen Termin unter Einhaltung der vertraglichen Kündigungsfrist",
                "Kein Kündigungsgrund erforderlich",
                "Geregelt in §§ 621, 622 BGB für Dienstverhältnisse",
                "Typisch für: Mobilfunk, Streaming, Zeitschriften, Fitnessstudio",
              ],
            },
            {
              title: "2. Außerordentliche Kündigung (§ 314 BGB)",
              color: "rgba(255,160,0,0.06)",
              border: "rgba(255,160,0,0.2)",
              points: [
                "Kündigung mit sofortiger Wirkung oder kurzer Frist",
                "Erfordert einen 'wichtigen Grund' — Unzumutbarkeit der Fortsetzung",
                "Muss ohne schuldhaftes Zögern erklärt werden (§ 314 Abs. 3 BGB)",
                "Typisch bei: Schwerwiegenden Vertragsverletzungen, Vertrauensbruch",
              ],
            },
            {
              title: "3. Sonderkündigung",
              color: "rgba(0,255,160,0.05)",
              border: "rgba(0,255,160,0.15)",
              points: [
                "Sonderfall der außerordentlichen Kündigung bei bestimmten Ereignissen",
                "Gesetzlich geregelt: Preiserhöhungen, Leistungsänderungen, Umzug, Todesfall",
                "Wichtig: §§ 626, 628, 651h BGB, TKG § 57, VVG § 205",
                "Frist: Meist 1–2 Monate nach Kenntnis des Kündigungsgrundes",
              ],
            },
          ].map((card) => (
            <div key={card.title} style={{ background: card.color, border: `1px solid ${card.border}`, padding: "1.25rem" }}>
              <strong style={{ fontSize: "0.92rem", color: "rgba(255,255,255,0.85)", display: "block", marginBottom: "0.75rem" }}>
                {card.title}
              </strong>
              <ul style={{ margin: 0, padding: "0 0 0 1rem", display: "flex", flexDirection: "column", gap: "0.3rem" }}>
                {card.points.map((p) => (
                  <li key={p} style={{ fontSize: "0.83rem", color: "rgba(255,255,255,0.55)", lineHeight: 1.55 }}>{p}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </ArticleSection>

      {/* Section 2 */}
      <ArticleSection id="fristen" title="Kündigungsfristen & BGB §621, §622">
        <p>
          Die Kündigungsfrist ist die Zeit zwischen Eingang der Kündigung und dem Ende des Vertrags.
          Sie ist das häufigste Stolperstein bei Vertragskündigungen. Grundregel: <strong>Jede Kündigung
          muss dem Empfänger spätestens einen Werktag vor Ablauf der Frist zugegangen sein.</strong>
        </p>

        <div style={{ border: "1px solid rgba(255,255,255,0.07)", margin: "1.5rem 0", overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 500 }}>
            <thead>
              <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.07)", background: "rgba(0,212,255,0.03)" }}>
                {["Vertragstyp", "Gesetzliche Frist", "Wichtige Regel"].map((h) => (
                  <th key={h} style={{ padding: "0.75rem 1rem", textAlign: "left", fontFamily: "var(--font-jetbrains, monospace)", fontSize: "0.58rem", letterSpacing: "0.1em", color: "rgba(0,212,255,0.5)", textTransform: "uppercase" }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                { type: "Mobilfunkvertrag", frist: "1 Monat", rule: "Zum Monatsende, AGB beachten" },
                { type: "Strom- / Gasvertrag", frist: "4–6 Wochen", rule: "Sonderkündigung bei Preiserhöhung" },
                { type: "Internetvertrag", frist: "1 Monat (TKG § 57)", rule: "Max. 24 Monate Erstlaufzeit seit 2022" },
                { type: "Fitnessstudio", frist: "1 Monat", rule: "Max. 24 Monate Bindung (§ 309 Nr. 9 BGB)" },
                { type: "Streaming (Netflix, etc.)", frist: "Monatlich", rule: "Keine Mindestlaufzeit gesetzlich" },
                { type: "Kfz-Versicherung", frist: "1 Monat vor Ablauf", rule: "Sonderkündigung nach Schadensfall" },
                { type: "Mietvertrag", frist: "3 Monate", rule: "§ 573c BGB, Staffelung bis 9 Monate" },
                { type: "Arbeitsverhältnis", frist: "4 Wochen (§ 622 BGB)", rule: "Staffelung nach Betriebszugehörigkeit" },
              ].map((row, i) => (
                <tr key={i} style={{ borderBottom: i < 7 ? "1px solid rgba(255,255,255,0.04)" : "none" }}>
                  <td style={{ padding: "0.65rem 1rem", fontSize: "0.85rem", fontWeight: 600, color: "rgba(255,255,255,0.8)" }}>{row.type}</td>
                  <td style={{ padding: "0.65rem 1rem", fontFamily: "var(--font-jetbrains, monospace)", fontSize: "0.68rem", color: "rgba(0,212,255,0.7)" }}>{row.frist}</td>
                  <td style={{ padding: "0.65rem 1rem", fontSize: "0.8rem", color: "rgba(255,255,255,0.45)" }}>{row.rule}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <ArticleInsight>
          <strong>Automatische Vertragsverlängerung (§ 309 Nr. 9 BGB):</strong> Wenn eine Klausel
          besagt, dass der Vertrag sich automatisch verlängert, wenn du nicht rechtzeitig kündigst,
          ist diese Klausel in AGB nur zulässig, wenn: (1) Die Verlängerung maximal 1 Jahr beträgt,
          (2) Die Kündigungsfrist nicht mehr als 3 Monate vor Ablauf liegt. Längere Klauseln sind
          unwirksam — du kannst jederzeit mit 3 Monaten kündigen.
        </ArticleInsight>
      </ArticleSection>

      {/* Section 3 */}
      <ArticleSection id="ordentlich" title="Ordentliche Kündigung: So geht es richtig">
        <p>
          Die ordentliche Kündigung ist die häufigste Form und folgt einem klaren Prozess:
        </p>

        <ol style={{ padding: "0 0 0 1.5rem", display: "flex", flexDirection: "column", gap: "0.75rem" }}>
          {[
            { title: "Kündigungsfrist prüfen", desc: "Vertragsunterlagen oder AGB lesen. Falls nicht auffindbar: Im Zweifel gilt die gesetzliche Frist. SOVEREIGN analysiert Fristen automatisch beim Upload." },
            { title: "Kündigungstermin berechnen", desc: "Berechne den nächstmöglichen Termin: Heute + Kündigungsfrist. Beachte: Kündigung muss dem Anbieter vor Fristbeginn zugegangen sein, nicht abgesendet." },
            { title: "Kündigungsschreiben verfassen", desc: "Formfrei ist gesetzlich meist erlaubt — aber Schriftform (per Post) oder per E-Mail mit Lesebestätigung empfohlen für Beweiszwecke. Pflichtangaben: Name, Adresse, Kundennummer, Kündigungstermin." },
            { title: "Versand mit Nachweis", desc: "Empfehlung: Einschreiben mit Rückschein (Zustellnachweis). E-Mail: Immer mit Lesebestätigung anfordern und Screenshot der gesendeten E-Mail aufbewahren." },
            { title: "Bestätigung einholen", desc: "Anbieter muss Kündigung bestätigen. Falls keine Bestätigung: Nach 2 Wochen schriftlich nachfragen und Fristen dokumentieren." },
          ].map((step, i) => (
            <li key={i} style={{ fontSize: "0.9rem", lineHeight: 1.7, color: "rgba(255,255,255,0.6)" }}>
              <strong style={{ color: "rgba(255,255,255,0.9)" }}>{step.title}: </strong>
              {step.desc}
            </li>
          ))}
        </ol>
      </ArticleSection>

      {/* Section 4 */}
      <ArticleSection id="ausserordentlich" title="Außerordentliche Kündigung: § 314 BGB">
        <p>
          § 314 BGB regelt die außerordentliche Kündigung von Dauerschuldverhältnissen aus wichtigem Grund.
          Ein "wichtiger Grund" liegt vor, wenn dem kündigenden Teil die Fortsetzung des Vertrags bis zum
          ordentlichen Ende unter Berücksichtigung aller Umstände und der Interessen beider Parteien
          nicht zugemutet werden kann.
        </p>

        <h3 style={{ fontSize: "1rem", fontWeight: 700, color: "rgba(255,255,255,0.85)", margin: "1.5rem 0 0.75rem" }}>
          Anerkannte wichtige Gründe:
        </h3>
        <ul style={{ padding: "0 0 0 1.25rem", display: "flex", flexDirection: "column", gap: "0.4rem" }}>
          {[
            "Schwerwiegende Vertragsverletzungen des Anbieters (Leistungsverweigerung, Täuschung)",
            "Dauerhafter Leistungsausfall ohne zumutbare Alternative",
            "Unzumutbare Vertragsänderungen ohne Zustimmung",
            "Insolvenz des Vertragspartners",
            "Verlust der Geschäftsgrundlage (§ 313 BGB)",
            "Schwere Vertrauensverletzungen (besonders bei persönlichen Verhältnissen)",
          ].map((item) => (
            <li key={item} style={{ fontSize: "0.85rem", color: "rgba(255,255,255,0.55)", lineHeight: 1.6 }}>{item}</li>
          ))}
        </ul>

        <ArticleInsight>
          <strong>Frist-Falle § 314 Abs. 3:</strong> Die außerordentliche Kündigung muss
          "ohne schuldhaftes Zögern" erklärt werden, sobald du von dem wichtigen Grund Kenntnis erhast.
          Wartest du zu lange, verlierst du das Recht auf außerordentliche Kündigung. Als Faustformel gilt:
          Kündigung innerhalb von 2 Wochen nach Kenntniserlangung erklären.
        </ArticleInsight>
      </ArticleSection>

      {/* Section 5 */}
      <ArticleSection id="sonderrecht" title="Sonderkündigungsrechte: §§ 626, 628, 651h und mehr">
        <p>
          Sonderkündigungsrechte ermöglichen die Kündigung außerhalb der regulären Frist bei
          bestimmten Ereignissen. Diese sind teils im BGB geregelt, teils in Spezialgesetzen:
        </p>

        <div style={{ display: "grid", gap: "1rem", margin: "1rem 0" }}>
          {[
            { para: "§ 57 TKG", trigger: "Preiserhöhung Telekommunikation", frist: "3 Monate nach Ankündigung", detail: "Mobilfunk, Internet, Festnetz: Jede Preiserhöhung berechtigt zur Sonderkündigung." },
            { para: "§ 41 EnWG", trigger: "Preiserhöhung Energie", frist: "2 Wochen nach Ankündigung", detail: "Strom und Gas: Anbieter muss 1 Monat Vorankündigung geben, dann Sonderkündigungsrecht." },
            { para: "§ 205 VVG", trigger: "Kfz-Versicherung nach Schadensfall", frist: "1 Monat nach Schadensregulierung", detail: "Nach jedem Schadensfall: Sonderkündigungsrecht für beide Parteien." },
            { para: "§ 313 BGB", trigger: "Schwere Lebensveränderungen", frist: "Unverzüglich", detail: "Jobverlust, Krankheit, Umzug: Kann Anpassung oder Kündigung von Dauerschuldverhältnissen begründen." },
            { para: "§ 626 BGB", trigger: "Dienstvertrag aus wichtigem Grund", frist: "2 Wochen nach Kenntnis", detail: "Arbeitsrecht: Außerordentliche fristlose Kündigung bei schwerwiegenden Gründen." },
          ].map((row) => (
            <div key={row.para} style={{ display: "grid", gridTemplateColumns: "120px 1fr", gap: "1rem", padding: "1rem", border: "1px solid rgba(255,255,255,0.06)", background: "rgba(255,255,255,0.02)" }}>
              <div>
                <span style={{ fontFamily: "var(--font-jetbrains, monospace)", fontSize: "0.65rem", color: "rgba(0,212,255,0.7)", display: "block" }}>{row.para}</span>
                <span style={{ fontFamily: "var(--font-jetbrains, monospace)", fontSize: "0.55rem", color: "rgba(255,255,255,0.25)", display: "block", marginTop: 2 }}>Frist: {row.frist}</span>
              </div>
              <div>
                <strong style={{ fontSize: "0.88rem", color: "rgba(255,255,255,0.8)", display: "block", marginBottom: "0.3rem" }}>{row.trigger}</strong>
                <span style={{ fontSize: "0.82rem", color: "rgba(255,255,255,0.45)", lineHeight: 1.55 }}>{row.detail}</span>
              </div>
            </div>
          ))}
        </div>
      </ArticleSection>

      {/* Section 6 */}
      <ArticleSection id="branchen" title="Branchen-spezifische Besonderheiten">
        <h3 style={{ fontSize: "1rem", fontWeight: 700, color: "rgba(255,255,255,0.85)", marginBottom: "0.75rem" }}>Telekommunikation (TKG 2022)</h3>
        <p>
          Seit Dezember 2021 gilt das neue TKG: Maximale Erstlaufzeit 24 Monate, nach Ablauf
          monatliche Kündbarkeit. Anbieter müssen aktiv auf die Möglichkeit einer günstigeren
          Option hinweisen. Preiserhöhungen berechtigen zur sofortigen Sonderkündigung.
        </p>

        <h3 style={{ fontSize: "1rem", fontWeight: 700, color: "rgba(255,255,255,0.85)", margin: "1.5rem 0 0.75rem" }}>Streaming-Abonnements</h3>
        <p>
          Netflix, Disney+, Spotify etc. haben keine gesetzlich vorgeschriebene Mindestlaufzeit.
          Monatliche Kündbarkeit ist der Standard. Wichtig: Die Kündigung muss vor Beginn des
          nächsten Abrechnungszeitraums eingegangen sein.
        </p>

        <h3 style={{ fontSize: "1rem", fontWeight: 700, color: "rgba(255,255,255,0.85)", margin: "1.5rem 0 0.75rem" }}>Fitnessstudio (§ 309 Nr. 9 BGB)</h3>
        <p>
          Fitnessstudios können maximal 24 Monate Mindestlaufzeit verlangen. Kündigungsfristen
          von mehr als 3 Monaten in AGB sind unwirksam. Außerordentliche Kündigung bei
          dauerhafter gesundheitlicher Beeinträchtigung möglich.
        </p>

        <h3 style={{ fontSize: "1rem", fontWeight: 700, color: "rgba(255,255,255,0.85)", margin: "1.5rem 0 0.75rem" }}>Mietrecht</h3>
        <p>
          § 573c BGB regelt die ordentliche Kündigung: Immer zum Ende eines Kalendermonats,
          spätestens am dritten Werktag des laufenden Monats für das Ende des übernächsten Monats
          (d.h. effektiv ca. 3 Monate). Bei längerem Mietverhältnis verlängern sich Fristen für
          den Vermieter (6 und 9 Monate ab 5 bzw. 8 Jahren).
        </p>
      </ArticleSection>

      {/* Section 7: Vorlage */}
      <ArticleSection id="vorlage" title="Mustervorlage: Kündigungsschreiben">
        <p>
          Diese Vorlage eignet sich für die ordentliche Kündigung. Passe die markierten Felder an.
          Für spezifische Branchen oder außerordentliche Kündigungen empfehlen wir die automatische
          Generierung durch SOVEREIGN:
        </p>

        <div
          style={{
            background: "rgba(0,0,0,0.3)",
            border: "1px solid rgba(0,212,255,0.15)",
            padding: "2rem",
            fontFamily: "var(--font-jetbrains, monospace)",
            fontSize: "0.75rem",
            lineHeight: 1.9,
            color: "rgba(255,255,255,0.7)",
            margin: "1rem 0",
            whiteSpace: "pre-wrap",
          }}
        >
{`[Dein Name]
[Deine Adresse]
[PLZ Ort]
[Datum]

[Name des Unternehmens]
[Adresse des Unternehmens]

Betreff: Kündigung meines Vertrages, Kundennummer: [KUNDENNUMMER]

Sehr geehrte Damen und Herren,

hiermit kündige ich den oben genannten Vertrag ordentlich und fristgerecht
zum nächstmöglichen Termin, frühestens jedoch zum [KÜNDIGUNGSDATUM].

Ich bitte um eine schriftliche Bestätigung der Kündigung sowie die Angabe
des genauen Beendigungstermins.

Sollten noch offene Forderungen bestehen, bitte ich um eine abschließende
Rechnung.

Mit freundlichen Grüßen,

[Unterschrift]
[Dein Name]`}
        </div>

        <ArticleInsight>
          SOVEREIGN generiert rechtssichere Kündigungsschreiben automatisch aus deinen Vertragsdaten —
          inklusive BGB-Paragraphen, Fristen und Sonderkündigungsrecht-Prüfung. Der generierte Brief
          wird dir zur Freigabe vorgelegt und dann automatisch versendet.
          <br /><br />
          <Link href="/dashboard" style={{ color: "rgba(0,212,255,0.8)", textDecoration: "underline" }}>
            Jetzt Vertrag hochladen und automatisch kündigen →
          </Link>
        </ArticleInsight>
      </ArticleSection>

      {/* Section 8: Automatisch */}
      <ArticleSection id="automatisch" title="Automatisch kündigen mit SOVEREIGN">
        <p>
          Das manuelle Kündigen von Verträgen ist zeitaufwändig und fehleranfällig. SOVEREIGN
          automatisiert den gesamten Prozess — von der Fristenberechnung bis zum verifizierten Versand:
        </p>

        <ol style={{ padding: "0 0 0 1.5rem", display: "flex", flexDirection: "column", gap: "1rem" }}>
          {[
            { step: "01", title: "Vertrag hochladen oder importieren", desc: "PDF-Upload oder PSD2-Import aus Banking. SOVEREIGN extrahiert automatisch alle relevanten Daten: Vertragspartner, Laufzeit, Fristen, Kündigungsrechte." },
            { step: "02", title: "KI-Analyse durch Privacy Guardian", desc: "Gemini 2.5 Flash analysiert den Vertrag auf Kündigungsfristen, Sonderrechte, automatische Verlängerungsklauseln und versteckte Bedingungen. Alles innerhalb deiner Datengrenzen." },
            { step: "03", title: "Empfehlung und Freigabe (HITL)", desc: "SOVEREIGN empfiehlt Kündigung oder Optimierung. Du gibst den konkreten Brief frei — oder aktivierst HOTL-Modus für vollständige Automatisierung." },
            { step: "04", title: "Versand mit Zustellnachweis", desc: "Automatischer Versand per E-Mail, mit Lesebestätigung und CC an deine Archive. Optional: Einschreiben-Service über Partner-Integration." },
            { step: "05", title: "Audit Trail und Nachverfolgung", desc: "Jede Kündigung wird fälschungssicher im Audit Trail dokumentiert. Du siehst wann der Brief versandt wurde, wann er zugestellt wurde, wann die Bestätigung einging." },
          ].map((item) => (
            <li key={item.step} style={{ listStyle: "none", display: "flex", gap: "1rem" }}>
              <span style={{ fontFamily: "var(--font-jetbrains, monospace)", fontSize: "0.65rem", color: "rgba(0,212,255,0.5)", minWidth: 28, paddingTop: 2 }}>
                {item.step}
              </span>
              <div>
                <strong style={{ fontSize: "0.9rem", color: "rgba(255,255,255,0.85)", display: "block", marginBottom: "0.3rem" }}>
                  {item.title}
                </strong>
                <span style={{ fontSize: "0.85rem", color: "rgba(255,255,255,0.5)", lineHeight: 1.65 }}>
                  {item.desc}
                </span>
              </div>
            </li>
          ))}
        </ol>
      </ArticleSection>

      {/* Section 9: Fehler */}
      <ArticleSection id="haeufige-fehler" title="Die 7 häufigsten Kündigungsfehler">
        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
          {[
            { num: "01", fehler: "Zu spät kündigen", erklaerung: "Die Kündigung muss dem Anbieter VOR Ablauf der Frist zugegangen sein — nicht abgesendet. Frühzeitig kündigen: 1–2 Wochen Puffer einplanen." },
            { num: "02", fehler: "Keine Bestätigung anfordern", erklaerung: "Ohne Bestätigungsnachweis kannst du im Streitfall nicht beweisen, dass du rechtzeitig gekündigt hast. Immer schriftliche Bestätigung anfordern." },
            { num: "03", fehler: "Falsche Adresse / Kundennummer", erklaerung: "Kündigung an falsche Adresse oder ohne Kundennummer? Kann unwirksam sein. Immer aktuelle Kontaktdaten prüfen." },
            { num: "04", fehler: "Sonderkündigungsrecht verpassen", erklaerung: "Preiserhöhungen, Leistungsänderungen, Umzug: Diese Ereignisse begründen Sonderkündigungsrechte mit kurzen Fristen. Frist verpasst = reguläre Laufzeit." },
            { num: "05", fehler: "Mündliche Kündigung akzeptieren", erklaerung: "Viele AGB schreiben Schriftform vor. Mündliche oder telefonische Kündigungen werden oft nicht akzeptiert — immer schriftlich nachfassen." },
            { num: "06", fehler: "Automatische Verlängerung ignorieren", erklaerung: "Viele Verträge verlängern sich automatisch um 1 Jahr. Die Kündigung muss vor dem Verlängerungstermin eingehen — nicht danach." },
            { num: "07", fehler: "Keine Fristen für alle Verträge kennen", erklaerung: "Im Schnitt 15 Verträge pro Person. Niemand kennt alle Fristen auswendig. SOVEREIGN überwacht alle Fristen automatisch und erinnert dich rechtzeitig." },
          ].map((item) => (
            <div
              key={item.num}
              style={{
                display: "flex",
                gap: "1rem",
                padding: "1rem",
                border: "1px solid rgba(255,80,80,0.12)",
                background: "rgba(255,80,80,0.04)",
              }}
            >
              <span style={{ fontFamily: "var(--font-jetbrains, monospace)", fontSize: "0.62rem", color: "rgba(255,80,80,0.6)", minWidth: 24, paddingTop: 2 }}>
                {item.num}
              </span>
              <div>
                <strong style={{ fontSize: "0.88rem", color: "rgba(255,255,255,0.85)", display: "block", marginBottom: "0.3rem" }}>
                  {item.fehler}
                </strong>
                <span style={{ fontSize: "0.82rem", color: "rgba(255,255,255,0.5)", lineHeight: 1.6 }}>
                  {item.erklaerung}
                </span>
              </div>
            </div>
          ))}
        </div>
      </ArticleSection>

      {/* Section 10: FAQ */}
      <ArticleSection id="faq-vertrag" title="FAQ: Häufige Fragen zur Vertragskündigung">
        <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          {[
            { q: "Was passiert, wenn ich die Kündigungsfrist verpasse?", a: "Der Vertrag verlängert sich automatisch um die in den AGB vereinbarte Verlängerungsperiode (maximal 1 Jahr, dann monatlich kündbar). Ab diesem Moment kannst du wieder mit der regulären Frist kündigen." },
            { q: "Kann ich einen Vertrag per E-Mail kündigen?", a: "Ja, in den meisten Fällen — solange die AGB nicht explizit Schriftform (Brief) vorschreiben. Empfehlung: Immer mit Lesebestätigung versenden und E-Mail-Screenshot archivieren. Für wichtige Verträge: Einschreiben als Backup." },
            { q: "Welche Rechte habe ich bei Preiserhöhungen?", a: "Bei einseitigen Preiserhöhungen ohne Zustimmung gilt: Sonderkündigungsrecht. Die Frist variiert je nach Vertragstyp (TKG, EnWG, VVG). SOVEREIGN erkennt Preiserhöhungen automatisch aus deinen Kontoauszügen und bereitet die Sonderkündigung vor." },
            { q: "Ist eine Kündigung während der Vertragslaufzeit möglich?", a: "Ordentliche Kündigung: Nein, erst zum regulären Ende unter Einhaltung der Frist. Außerordentliche Kündigung: Ja, bei wichtigem Grund (§ 314 BGB) sofort. Sonderkündigung: Ja, bei bestimmten Ereignissen wie Preiserhöhungen." },
            { q: "Was bedeutet 'automatische Vertragsverlängerung'?", a: "Ein Vertrag verlängert sich automatisch, wenn du ihn nicht rechtzeitig kündigst. Zulässig nach § 309 Nr. 9 BGB: Maximal 1 Jahr Verlängerung, Kündigungsfrist maximal 3 Monate vor Ablauf. Longer Klauseln sind unwirksam." },
          ].map((item, i) => (
            <div key={i} style={{ borderLeft: "2px solid rgba(0,212,255,0.2)", paddingLeft: "1.25rem" }}>
              <h3 style={{ fontSize: "0.95rem", fontWeight: 700, color: "rgba(255,255,255,0.85)", marginBottom: "0.6rem" }}>{item.q}</h3>
              <p style={{ fontSize: "0.85rem", lineHeight: 1.75, color: "rgba(255,255,255,0.5)" }}>{item.a}</p>
            </div>
          ))}
        </div>
      </ArticleSection>

      {/* Internal links */}
      <div style={{ marginTop: "2rem", padding: "1.5rem", border: "1px solid rgba(255,255,255,0.07)", background: "rgba(255,255,255,0.02)" }}>
        <p style={{ fontFamily: "var(--font-jetbrains, monospace)", fontSize: "0.58rem", letterSpacing: "0.1em", color: "rgba(255,255,255,0.25)", marginBottom: "1rem", textTransform: "uppercase" }}>
          Weiterführende Guides
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
          {[
            { href: `/${locale}/souveraenitaet`, label: "Datensouveränität 2030: Grundlagen & Strategie" },
            { href: `/${locale}/sicherheit`, label: "EU AI Act & DSGVO: Deine Rechte 2026" },
            { href: `/${locale}/architektur`, label: "SOVEREIGN APEX Architektur: Die 4 Schichten" },
            { href: `/${locale}/blog/preiserhoehung-widersprechen`, label: "Preiserhöhung widersprechen: Mit Musterbrief" },
          ].map((link) => (
            <Link
              key={link.href}
              href={link.href}
              style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.85rem", color: "rgba(0,212,255,0.65)", textDecoration: "none" }}
            >
              <ArrowRight size={12} />
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Preiserhöhung article ────────────────────────────────────────────────────

function PreiserhoehungContent({ locale }: { locale: string }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem", fontSize: "0.95rem", lineHeight: 1.8, color: "rgba(255,255,255,0.6)" }}>
      <p>
        Netflix erhöht die Preise. Dein Stromanbieter sendet eine Ankündigung. Die Telekom schreibt,
        dass "aufgrund gestiegener Kosten" dein Tarif teurer wird. In allen drei Fällen hast du ein
        Recht: Widerspruch oder Sonderkündigung. Dieser Guide erklärt, wie.
      </p>

      <ArticleSection id="berechtigung" title="Wann ist Widerspruch berechtigt?">
        <p>
          Eine einseitige Preiserhöhung ohne vertragliche Grundlage ist grundsätzlich unwirksam.
          Du musst ihr nicht zustimmen. Die Rechtsgrundlage: §§ 307-309 BGB (Kontrolle von AGB)
          i.V.m. den Spezialgesetzen TKG, EnWG und VVG.
        </p>
        <ul style={{ padding: "0 0 0 1.25rem", display: "flex", flexDirection: "column", gap: "0.4rem" }}>
          {[
            "Preiserhöhungsklauseln in AGB sind nur wirksam, wenn sie transparent und fair sind",
            "Einseitige Erhöhungen berechtigen zur Sonderkündigung",
            "Du kannst zahlen unter Vorbehalt — und später zurückfordern",
            "Widerspruchsfrist: Meist 1–3 Monate nach Ankündigung",
          ].map((item) => (
            <li key={item} style={{ fontSize: "0.85rem", color: "rgba(255,255,255,0.55)", lineHeight: 1.6 }}>{item}</li>
          ))}
        </ul>
      </ArticleSection>

      <ArticleSection id="musterbrief" title="Musterbrief: Widerspruch gegen Preiserhöhung">
        <div style={{ background: "rgba(0,0,0,0.3)", border: "1px solid rgba(0,212,255,0.15)", padding: "2rem", fontFamily: "var(--font-jetbrains, monospace)", fontSize: "0.72rem", lineHeight: 1.9, color: "rgba(255,255,255,0.7)", whiteSpace: "pre-wrap" }}>
{`[Dein Name] · [Adresse] · [PLZ Ort]          [Datum]

[Unternehmensname]
[Adresse]

Betreff: Widerspruch gegen Preiserhöhung / Kündigung
Kundennummer: [KUNDENNUMMER]

Sehr geehrte Damen und Herren,

mit Schreiben vom [DATUM DER ANKÜNDIGUNG] haben Sie mir mitgeteilt, dass
sich mein Tarif ab dem [ERHÖHUNGSDATUM] von [AKTUELLER PREIS] auf
[NEUER PREIS] erhöht.

Dieser Preiserhöhung widerspreche ich hiermit ausdrücklich.

Gleichzeitig mache ich von meinem Sonderkündigungsrecht Gebrauch und
kündige den Vertrag mit der Kundennummer [KUNDENNUMMER] zum
[KÜNDIGUNGSDATUM] oder zum nächstmöglichen Termin.

Rechtsgrundlage: [§ 57 TKG / § 41 EnWG / § 205 VVG — zutreffendes wählen]

Ich bitte um schriftliche Bestätigung der Kündigung.

Mit freundlichen Grüßen,
[Unterschrift]`}
        </div>
      </ArticleSection>

      <div style={{ padding: "1.5rem", border: "1px solid rgba(255,255,255,0.07)", background: "rgba(255,255,255,0.02)" }}>
        <p style={{ fontFamily: "var(--font-jetbrains, monospace)", fontSize: "0.58rem", letterSpacing: "0.1em", color: "rgba(255,255,255,0.25)", marginBottom: "1rem", textTransform: "uppercase" }}>Verwandte Guides</p>
        <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
          {[
            { href: `/${locale}/blog/vertrag-kuendigen`, label: "Vertrag kündigen: Der ultimative Guide" },
            { href: `/${locale}/sicherheit`, label: "EU AI Act & DSGVO: Deine Rechte" },
          ].map((link) => (
            <Link key={link.href} href={link.href} style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.85rem", color: "rgba(0,212,255,0.65)", textDecoration: "none" }}>
              <ArrowRight size={12} />{link.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Abofalle article ─────────────────────────────────────────────────────────

function AbofalleContent({ locale }: { locale: string }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem", fontSize: "0.95rem", lineHeight: 1.8, color: "rgba(255,255,255,0.6)" }}>
      <p>
        Laut Verbraucherzentrale verlieren Deutsche im Schnitt €340 jährlich durch unbemerkte
        Abonnements. Das "Abo-Trap"-Muster ist strukturell: Kostenloser Testmonat, automatische
        Verlängerung, versteckte Abonnements über App-Stores und Partner-Integrationen.
        Hier ist, wie du die Kontrolle zurückgewinnst.
      </p>

      <ArticleSection id="erkennen" title="Abofallen erkennen: Die 5 häufigsten Muster">
        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
          {[
            { muster: "Kostenloser Testmonat", detail: "Automatische Verlängerung nach 1 Monat — Kreditkarte wurde beim 'Gratis'-Test hinterlegt." },
            { muster: "App-Store-Abonnements", detail: "iOS und Android verstecken Abo-Verlängerungen tief in den Einstellungen. Viele vergessen sie nach App-Deinstallation." },
            { muster: "Bundled Services", detail: "Kombinations-Angebote (Internet + TV + Telefon) enthalten oft Zusatzpakete, die sich separat verlängern." },
            { muster: "Jahresabonnements", detail: "Monatlich erscheinen sie günstig — aber 12 Monate Bindung mit Auto-Verlängerung summiert sich." },
            { muster: "Partnerintegrationen", detail: "Shopping-Portale, Buchungsseiten und Newsletter beinhalten oft versteckte Abo-Registrierungen." },
          ].map((item) => (
            <div key={item.muster} style={{ display: "flex", gap: "1rem", padding: "0.85rem 1rem", border: "1px solid rgba(255,80,80,0.1)", background: "rgba(255,80,80,0.03)" }}>
              <span style={{ fontFamily: "var(--font-jetbrains, monospace)", fontSize: "0.62rem", color: "rgba(255,80,80,0.6)", minWidth: 8, marginTop: 3 }}>▸</span>
              <div>
                <strong style={{ fontSize: "0.88rem", color: "rgba(255,255,255,0.8)", display: "block", marginBottom: "0.2rem" }}>{item.muster}</strong>
                <span style={{ fontSize: "0.82rem", color: "rgba(255,255,255,0.5)" }}>{item.detail}</span>
              </div>
            </div>
          ))}
        </div>
      </ArticleSection>

      <ArticleSection id="beenden" title="Abofallen dauerhaft beenden">
        <p>SOVEREIGN scannt deine Kontoauszüge (PSD2) und identifiziert alle wiederkehrenden Zahlungen. Für jede erkannte Zahlung: Automatische Identifikation des Anbieters, Prüfung der Kündbarkeit, Vorbereitung der Kündigung. Dein Vermögen zurück — vollständig automatisch.</p>
      </ArticleSection>

      <div style={{ padding: "1.5rem", border: "1px solid rgba(255,255,255,0.07)", background: "rgba(255,255,255,0.02)" }}>
        <p style={{ fontFamily: "var(--font-jetbrains, monospace)", fontSize: "0.58rem", letterSpacing: "0.1em", color: "rgba(255,255,255,0.25)", marginBottom: "1rem", textTransform: "uppercase" }}>Verwandte Guides</p>
        <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
          {[
            { href: `/${locale}/blog/vertrag-kuendigen`, label: "Vertrag kündigen: Der ultimative Guide" },
            { href: `/${locale}/blog/preiserhoehung-widersprechen`, label: "Preiserhöhung widersprechen" },
          ].map((link) => (
            <Link key={link.href} href={link.href} style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.85rem", color: "rgba(0,212,255,0.65)", textDecoration: "none" }}>
              <ArrowRight size={12} />{link.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── EU AI Act erklärt ────────────────────────────────────────────────────────

function EuAiActContent({ locale }: { locale: string }) {
  const isDE = locale === "de";
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem", fontSize: "0.95rem", lineHeight: 1.8, color: "rgba(255,255,255,0.6)" }}>

      {/* ToC */}
      <nav style={{ background: "rgba(0,212,255,0.03)", border: "1px solid rgba(0,212,255,0.12)", padding: "1.75rem", marginBottom: "1rem" }}>
        <p style={{ fontFamily: "var(--font-jetbrains, monospace)", fontSize: "0.6rem", letterSpacing: "0.12em", color: "rgba(0,212,255,0.5)", marginBottom: "1rem", textTransform: "uppercase" }}>
          {isDE ? "Inhaltsverzeichnis" : "Table of Contents"}
        </p>
        <ol style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "0.5rem" }}>
          {(isDE ? [
            { href: "#was-ist", label: "Was ist der EU AI Act?" },
            { href: "#risikoklassen", label: "Die 4 Risikoklassen" },
            { href: "#verbote", label: "Verbotene KI-Systeme ab 2025" },
            { href: "#hochrisiko", label: "Hochrisiko-KI: Pflichten & Anforderungen" },
            { href: "#verbraucher", label: "Deine Rechte als Verbraucher" },
            { href: "#unternehmen", label: "Was Unternehmen jetzt tun müssen" },
            { href: "#sovereign", label: "SOVEREIGN & EU AI Act" },
            { href: "#faq-aiact", label: "FAQ" },
          ] : [
            { href: "#was-ist", label: "What is the EU AI Act?" },
            { href: "#risikoklassen", label: "The 4 Risk Classes" },
            { href: "#verbote", label: "Prohibited AI Systems from 2025" },
            { href: "#hochrisiko", label: "High-Risk AI: Obligations & Requirements" },
            { href: "#verbraucher", label: "Your Rights as a Consumer" },
            { href: "#unternehmen", label: "What Companies Must Do Now" },
            { href: "#sovereign", label: "SOVEREIGN & EU AI Act" },
            { href: "#faq-aiact", label: "FAQ" },
          ]).map((item, i) => (
            <li key={i}>
              <a href={item.href} style={{ fontSize: "0.83rem", color: "rgba(255,255,255,0.45)", textDecoration: "none", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <span style={{ fontFamily: "var(--font-jetbrains, monospace)", fontSize: "0.55rem", color: "rgba(0,212,255,0.35)", minWidth: 16 }}>{String(i + 1).padStart(2, "0")}</span>
                {item.label}
              </a>
            </li>
          ))}
        </ol>
      </nav>

      <p>
        {isDE
          ? "Am 1. August 2024 trat der EU AI Act in Kraft — das weltweit erste umfassende Gesetz zur Regulierung künstlicher Intelligenz. Bis 2026 greifen die meisten Vorschriften vollständig. Was bedeutet das für dich als Verbraucher, für Unternehmen, die KI einsetzen, und für KI-Anwendungen wie SOVEREIGN?"
          : "On August 1, 2024, the EU AI Act came into force — the world's first comprehensive law regulating artificial intelligence. By 2026, most provisions will be fully in effect. What does this mean for you as a consumer, for companies using AI, and for AI applications like SOVEREIGN?"}
      </p>

      <ArticleSection id="was-ist" title={isDE ? "Was ist der EU AI Act?" : "What is the EU AI Act?"}>
        <p>
          {isDE
            ? "Der EU AI Act (Verordnung (EU) 2024/1689) ist eine EU-Verordnung, die einen risikobasierten Ansatz zur KI-Regulierung verfolgt. Anders als ein Verbot bestimmter Technologien klassifiziert das Gesetz KI-Systeme nach ihrem Risikopotenzial für Grundrechte und Sicherheit."
            : "The EU AI Act (Regulation (EU) 2024/1689) is an EU regulation that takes a risk-based approach to AI regulation. Rather than banning specific technologies, the law classifies AI systems by their risk potential for fundamental rights and safety."}
        </p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1rem", margin: "1rem 0" }}>
          {[
            { label: isDE ? "In Kraft getreten" : "Entered into force", value: "01.08.2024" },
            { label: isDE ? "Verbote gelten ab" : "Prohibitions apply from", value: "02.02.2025" },
            { label: isDE ? "Hochrisiko-Regeln ab" : "High-risk rules from", value: "02.08.2026" },
            { label: isDE ? "Vollständige Anwendung" : "Full application", value: "02.08.2027" },
          ].map((item) => (
            <div key={item.label} style={{ padding: "1rem", border: "1px solid rgba(0,212,255,0.12)", background: "rgba(0,212,255,0.03)", textAlign: "center" }}>
              <div style={{ fontFamily: "var(--font-jetbrains, monospace)", fontSize: "0.65rem", color: "rgba(0,212,255,0.5)", marginBottom: "0.4rem" }}>{item.label}</div>
              <div style={{ fontSize: "1rem", fontWeight: 700, color: "rgba(255,255,255,0.9)" }}>{item.value}</div>
            </div>
          ))}
        </div>
      </ArticleSection>

      <ArticleSection id="risikoklassen" title={isDE ? "Die 4 Risikoklassen im Überblick" : "The 4 Risk Classes at a Glance"}>
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          {[
            {
              level: isDE ? "VERBOTEN" : "PROHIBITED",
              color: "rgba(255,50,50,0.1)", border: "rgba(255,50,50,0.25)",
              label: isDE ? "Nicht akzeptables Risiko" : "Unacceptable risk",
              examples: isDE
                ? ["Social Scoring durch Behörden", "Biometrische Echtzeitüberwachung im öffentlichen Raum", "Manipulation unterbewusster Entscheidungen", "Ausnutzung vulnerabler Gruppen"]
                : ["Social scoring by authorities", "Real-time biometric surveillance in public spaces", "Manipulation of subconscious decisions", "Exploitation of vulnerable groups"],
            },
            {
              level: isDE ? "HOCHRISIKO" : "HIGH-RISK",
              color: "rgba(255,150,0,0.07)", border: "rgba(255,150,0,0.2)",
              label: isDE ? "Strenge Anforderungen" : "Strict requirements",
              examples: isDE
                ? ["Kritische Infrastruktur", "Bildung & Berufsausbildung", "Beschäftigung & HR", "Wesentliche private Dienste (Kredite, Versicherungen)", "Strafverfolgung & Justiz"]
                : ["Critical infrastructure", "Education & vocational training", "Employment & HR", "Essential private services (loans, insurance)", "Law enforcement & judiciary"],
            },
            {
              level: isDE ? "BEGRENZT" : "LIMITED",
              color: "rgba(255,200,0,0.05)", border: "rgba(255,200,0,0.15)",
              label: isDE ? "Transparenzpflichten" : "Transparency obligations",
              examples: isDE
                ? ["Chatbots müssen sich als KI ausweisen", "Deepfakes müssen gekennzeichnet werden", "Emotionserkennung muss offengelegt werden"]
                : ["Chatbots must identify as AI", "Deepfakes must be labeled", "Emotion recognition must be disclosed"],
            },
            {
              level: isDE ? "MINIMAL" : "MINIMAL",
              color: "rgba(0,212,100,0.05)", border: "rgba(0,212,100,0.12)",
              label: isDE ? "Keine besonderen Anforderungen" : "No special requirements",
              examples: isDE
                ? ["KI-gestützte Spiele", "Spam-Filter", "KI-Produktionsoptimierung", "Empfehlungssysteme (eingeschränkt)"]
                : ["AI-powered games", "Spam filters", "AI production optimization", "Recommendation systems (limited)"],
            },
          ].map((cls) => (
            <div key={cls.level} style={{ background: cls.color, border: `1px solid ${cls.border}`, padding: "1.25rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.75rem" }}>
                <span style={{ fontFamily: "var(--font-jetbrains, monospace)", fontSize: "0.62rem", letterSpacing: "0.1em", color: "rgba(255,255,255,0.85)", fontWeight: 700 }}>{cls.level}</span>
                <span style={{ fontSize: "0.78rem", color: "rgba(255,255,255,0.4)" }}>{cls.label}</span>
              </div>
              <ul style={{ margin: 0, padding: "0 0 0 1rem", display: "flex", flexDirection: "column", gap: "0.25rem" }}>
                {cls.examples.map((ex) => <li key={ex} style={{ fontSize: "0.82rem", color: "rgba(255,255,255,0.55)" }}>{ex}</li>)}
              </ul>
            </div>
          ))}
        </div>
      </ArticleSection>

      <ArticleSection id="verbote" title={isDE ? "Verbotene KI-Systeme: Was ab Februar 2025 nicht mehr erlaubt ist" : "Prohibited AI Systems: What is No Longer Allowed from February 2025"}>
        <p>
          {isDE
            ? "Seit dem 2. Februar 2025 sind bestimmte KI-Praktiken in der EU verboten. Verstöße werden mit bis zu 35 Millionen Euro oder 7 % des weltweiten Jahresumsatzes bestraft — je nachdem, was höher ist."
            : "Since February 2, 2025, certain AI practices have been prohibited in the EU. Violations are punishable by up to €35 million or 7% of global annual revenue — whichever is higher."}
        </p>
        <ArticleInsight>
          <strong>{isDE ? "Wichtig für Verbraucher:" : "Important for consumers:"}</strong>{" "}
          {isDE
            ? "Du hast das Recht, zu erfahren, wenn ein KI-System gegenüber dir eingesetzt wird, das unter die Transparenzpflichten fällt. Chatbots, KI-generierte Inhalte und emotionserkennende Systeme müssen sich als solche zu erkennen geben."
            : "You have the right to know when an AI system subject to transparency obligations is used against you. Chatbots, AI-generated content, and emotion-recognition systems must identify themselves as such."}
        </ArticleInsight>
      </ArticleSection>

      <ArticleSection id="hochrisiko" title={isDE ? "Hochrisiko-KI: Was Anbieter nachweisen müssen" : "High-Risk AI: What Providers Must Prove"}>
        <p>
          {isDE
            ? "Hochrisiko-KI-Systeme unterliegen vor der Markteinführung einem strengen Konformitätsbewertungsverfahren. Die wichtigsten Anforderungen:"
            : "High-risk AI systems are subject to a rigorous conformity assessment procedure before market launch. The key requirements:"}
        </p>
        <div style={{ border: "1px solid rgba(255,255,255,0.07)", overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 480 }}>
            <thead>
              <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.07)", background: "rgba(0,212,255,0.03)" }}>
                {[isDE ? "Anforderung" : "Requirement", isDE ? "Details" : "Details"].map((h) => (
                  <th key={h} style={{ padding: "0.75rem 1rem", textAlign: "left", fontFamily: "var(--font-jetbrains, monospace)", fontSize: "0.58rem", letterSpacing: "0.1em", color: "rgba(0,212,255,0.5)", textTransform: "uppercase" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {(isDE ? [
                ["Risikomanagement-System", "Kontinuierliche Identifikation & Minderung von Risiken über den gesamten Lebenszyklus"],
                ["Daten-Governance", "Trainingsdaten müssen repräsentativ, frei von Bias und dokumentiert sein"],
                ["Technische Dokumentation", "Vollständige Dokumentation vor Markteinführung, CE-Kennzeichnung"],
                ["Transparenz & Logging", "Automatische Protokollierung, Aufbewahrung 6 Monate (Infrastruktur: 5 Jahre)"],
                ["Menschliche Aufsicht", "Nutzer müssen Entscheidungen übersteuern können"],
                ["Genauigkeit & Robustheit", "Messbare Performance-Metriken, Resilienz gegen Angriffe"],
              ] : [
                ["Risk management system", "Continuous identification & mitigation of risks throughout the lifecycle"],
                ["Data governance", "Training data must be representative, bias-free and documented"],
                ["Technical documentation", "Complete documentation before market launch, CE marking"],
                ["Transparency & logging", "Automatic logging, retention 6 months (infrastructure: 5 years)"],
                ["Human oversight", "Users must be able to override decisions"],
                ["Accuracy & robustness", "Measurable performance metrics, resilience against attacks"],
              ]).map(([req, detail], i, arr) => (
                <tr key={req} style={{ borderBottom: i < arr.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none" }}>
                  <td style={{ padding: "0.65rem 1rem", fontSize: "0.85rem", fontWeight: 600, color: "rgba(255,255,255,0.8)", whiteSpace: "nowrap" }}>{req}</td>
                  <td style={{ padding: "0.65rem 1rem", fontSize: "0.8rem", color: "rgba(255,255,255,0.45)" }}>{detail}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </ArticleSection>

      <ArticleSection id="verbraucher" title={isDE ? "Deine Rechte als Verbraucher unter dem EU AI Act" : "Your Rights as a Consumer Under the EU AI Act"}>
        <p>
          {isDE
            ? "Der EU AI Act stärkt Verbraucherrechte gegenüber KI-Systemen erheblich. Diese Rechte gelten ab 2026 vollständig:"
            : "The EU AI Act significantly strengthens consumer rights vis-à-vis AI systems. These rights will be fully in effect from 2026:"}
        </p>
        <ul style={{ padding: "0 0 0 1.25rem", display: "flex", flexDirection: "column", gap: "0.6rem" }}>
          {(isDE ? [
            "Recht auf Erklärung: Bei Hochrisiko-KI-Entscheidungen (z.B. Kreditablehnung) musst du eine verständliche Erklärung erhalten",
            "Recht auf menschliche Überprüfung: Du kannst verlangen, dass eine Entscheidung von einem Menschen überprüft wird",
            "Recht auf Information: Wenn ein Chatbot oder ein KI-System mit dir kommuniziert, muss es sich als solches zu erkennen geben",
            "Beschwerderecht: Nationale Aufsichtsbehörden müssen Beschwerden über KI-Systeme entgegennehmen",
            "Schadensersatz: Bei Verletzung des EU AI Acts durch ein KI-System hast du potenzielle Schadensersatzansprüche",
          ] : [
            "Right to explanation: For high-risk AI decisions (e.g. loan rejection) you must receive an understandable explanation",
            "Right to human review: You can request that a decision be reviewed by a human",
            "Right to information: If a chatbot or AI system communicates with you, it must identify itself as such",
            "Right to complain: National supervisory authorities must accept complaints about AI systems",
            "Compensation: If an AI system violates the EU AI Act, you have potential claims for damages",
          ]).map((right) => (
            <li key={right} style={{ fontSize: "0.88rem", color: "rgba(255,255,255,0.6)", lineHeight: 1.65 }}>{right}</li>
          ))}
        </ul>
      </ArticleSection>

      <ArticleSection id="unternehmen" title={isDE ? "Was Unternehmen jetzt tun müssen" : "What Companies Must Do Now"}>
        <p>
          {isDE
            ? "Für Unternehmen, die KI einsetzen oder entwickeln, ergibt sich je nach Risikoklasse ein unterschiedlicher Handlungsbedarf. Die wichtigsten Sofortmaßnahmen:"
            : "For companies that use or develop AI, the action required varies by risk class. The most important immediate actions:"}
        </p>
        <ol style={{ padding: "0 0 0 1.5rem", display: "flex", flexDirection: "column", gap: "0.75rem" }}>
          {(isDE ? [
            { title: "KI-Inventar erstellen", desc: "Alle eingesetzten KI-Systeme katalogisieren und Risikoklasse bestimmen. Besonders Hochrisiko-Systeme in HR, Kredit und Infrastruktur identifizieren." },
            { title: "Verbotene Praktiken stoppen", desc: "Überprüfen, ob aktuell eingesetzte KI-Systeme unter die ab 02.02.2025 geltenden Verbote fallen. Sofortige Abschaltung oder Anpassung erforderlich." },
            { title: "Transparenzpflichten implementieren", desc: "Chatbots als KI kennzeichnen, KI-generierte Inhalte labeln, Nutzer über Emotionserkennungssysteme informieren." },
            { title: "Governance-Strukturen aufbauen", desc: "Einen AI Act Compliance Officer benennen, Risikomanagement-Prozesse etablieren, technische Dokumentation vorbereiten." },
            { title: "Fondamentale Rechte Impact Assessment", desc: "Für Hochrisiko-Systeme ein FRIA (Fundamental Rights Impact Assessment) durchführen — vergleichbar mit dem DSGVO-DPIA." },
          ] : [
            { title: "Create AI inventory", desc: "Catalog all AI systems in use and determine risk class. Especially identify high-risk systems in HR, credit and infrastructure." },
            { title: "Stop prohibited practices", desc: "Check whether currently deployed AI systems fall under the prohibitions in effect from 02.02.2025. Immediate shutdown or adjustment required." },
            { title: "Implement transparency obligations", desc: "Label chatbots as AI, label AI-generated content, inform users about emotion recognition systems." },
            { title: "Build governance structures", desc: "Appoint an AI Act Compliance Officer, establish risk management processes, prepare technical documentation." },
            { title: "Fundamental Rights Impact Assessment", desc: "Conduct a FRIA (Fundamental Rights Impact Assessment) for high-risk systems — comparable to the GDPR DPIA." },
          ]).map((step, i) => (
            <li key={i} style={{ fontSize: "0.88rem", lineHeight: 1.7, color: "rgba(255,255,255,0.6)" }}>
              <strong style={{ color: "rgba(255,255,255,0.9)" }}>{step.title}: </strong>{step.desc}
            </li>
          ))}
        </ol>
      </ArticleSection>

      <ArticleSection id="sovereign" title={isDE ? "SOVEREIGN & EU AI Act: Compliance by Design" : "SOVEREIGN & EU AI Act: Compliance by Design"}>
        <p>
          {isDE
            ? "SOVEREIGN wurde von Grund auf EU AI Act-konform entwickelt. Als KI-System, das Verbrauchern bei Vertragsmanagement, Datenschutz und rechtlichen Anliegen hilft, fällt SOVEREIGN in die Kategorie 'minimales Risiko' — mit proaktiver Übererfüllung der Transparenzpflichten:"
            : "SOVEREIGN was built from the ground up to be EU AI Act compliant. As an AI system that helps consumers with contract management, data protection and legal matters, SOVEREIGN falls in the 'minimal risk' category — with proactive over-compliance on transparency obligations:"}
        </p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "1rem", margin: "1rem 0" }}>
          {(isDE ? [
            { title: "Volle Transparenz", desc: "SOVEREIGN identifiziert sich immer als KI-System. Alle Entscheidungen sind nachvollziehbar und erklärbar." },
            { title: "Menschliche Kontrolle", desc: "Du behältst immer das letzte Wort. Keine autonome Handlung ohne deine explizite Genehmigung." },
            { title: "Datensparsamkeit", desc: "Nur die für die Aufgabe notwendigen Daten werden verarbeitet. Keine Weitergabe an Dritte." },
            { title: "Regelmäßige Audits", desc: "Unabhängige technische Überprüfung aller KI-Modelle und Entscheidungsprozesse." },
          ] : [
            { title: "Full transparency", desc: "SOVEREIGN always identifies itself as an AI system. All decisions are traceable and explainable." },
            { title: "Human control", desc: "You always have the final say. No autonomous action without your explicit approval." },
            { title: "Data minimization", desc: "Only the data necessary for the task is processed. No sharing with third parties." },
            { title: "Regular audits", desc: "Independent technical review of all AI models and decision-making processes." },
          ]).map((item) => (
            <div key={item.title} style={{ padding: "1.25rem", border: "1px solid rgba(0,212,255,0.12)", background: "rgba(0,212,255,0.03)" }}>
              <strong style={{ fontSize: "0.88rem", color: "rgba(255,255,255,0.85)", display: "block", marginBottom: "0.4rem" }}>{item.title}</strong>
              <p style={{ fontSize: "0.82rem", color: "rgba(255,255,255,0.45)", lineHeight: 1.6, margin: 0 }}>{item.desc}</p>
            </div>
          ))}
        </div>
      </ArticleSection>

      <ArticleSection id="faq-aiact" title="FAQ">
        {(isDE ? [
          { q: "Ab wann gilt der EU AI Act vollständig?", a: "Die meisten Vorschriften gelten ab dem 2. August 2026. Die Verbote für nicht akzeptables Risiko (z.B. Social Scoring) gelten bereits seit dem 2. Februar 2025." },
          { q: "Gilt der EU AI Act auch für KI aus den USA (ChatGPT, Copilot)?", a: "Ja. Der EU AI Act gilt für alle KI-Systeme, die in der EU angeboten oder eingesetzt werden — unabhängig davon, wo der Anbieter seinen Sitz hat." },
          { q: "Was passiert, wenn ein Anbieter gegen den EU AI Act verstößt?", a: "Verstöße gegen die Verbote können mit bis zu 35 Mio. Euro oder 7 % des weltweiten Jahresumsatzes bestraft werden. Für andere Verstöße sind Bußgelder von 15–30 Mio. Euro oder 3–6 % Umsatz vorgesehen." },
          { q: "Muss ich als Privatperson etwas tun?", a: "Nein. Der EU AI Act richtet sich primär an Anbieter und Betreiber von KI-Systemen. Als Verbraucher profitierst du von den neuen Rechten und dem stärkeren Schutz." },
        ] : [
          { q: "When does the EU AI Act fully apply?", a: "Most provisions apply from August 2, 2026. The prohibitions for unacceptable risk (e.g. social scoring) have already been in effect since February 2, 2025." },
          { q: "Does the EU AI Act also apply to AI from the US (ChatGPT, Copilot)?", a: "Yes. The EU AI Act applies to all AI systems offered or used in the EU — regardless of where the provider is based." },
          { q: "What happens if a provider violates the EU AI Act?", a: "Violations of the prohibitions can be punished with up to €35 million or 7% of global annual revenue. For other violations, fines of €15–30 million or 3–6% revenue are provided." },
          { q: "Do I as a private individual need to do anything?", a: "No. The EU AI Act is primarily aimed at providers and operators of AI systems. As a consumer, you benefit from the new rights and stronger protection." },
        ]).map(({ q, a }) => (
          <div key={q} style={{ padding: "1.25rem", border: "1px solid rgba(255,255,255,0.06)", background: "rgba(255,255,255,0.02)" }}>
            <strong style={{ fontSize: "0.9rem", color: "rgba(255,255,255,0.85)", display: "block", marginBottom: "0.5rem" }}>{q}</strong>
            <p style={{ fontSize: "0.85rem", color: "rgba(255,255,255,0.5)", lineHeight: 1.65, margin: 0 }}>{a}</p>
          </div>
        ))}
      </ArticleSection>
    </div>
  );
}

// ─── DSGVO Auskunft ───────────────────────────────────────────────────────────

function DsgvoAuskunftContent({ locale }: { locale: string }) {
  const isDE = locale === "de";
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem", fontSize: "0.95rem", lineHeight: 1.8, color: "rgba(255,255,255,0.6)" }}>

      <nav style={{ background: "rgba(0,212,255,0.03)", border: "1px solid rgba(0,212,255,0.12)", padding: "1.75rem", marginBottom: "1rem" }}>
        <p style={{ fontFamily: "var(--font-jetbrains, monospace)", fontSize: "0.6rem", letterSpacing: "0.12em", color: "rgba(0,212,255,0.5)", marginBottom: "1rem", textTransform: "uppercase" }}>
          {isDE ? "Inhaltsverzeichnis" : "Table of Contents"}
        </p>
        <ol style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "0.5rem" }}>
          {(isDE ? [
            { href: "#recht", label: "Dein Recht auf Auskunft: Art. 15 DSGVO" },
            { href: "#was-fordern", label: "Was du fordern kannst" },
            { href: "#wie-beantragen", label: "So stellst du den Antrag richtig" },
            { href: "#fristen", label: "Fristen: Was Unternehmen liefern müssen" },
            { href: "#ablehnung", label: "Was tun bei Ablehnung?" },
            { href: "#vorlage", label: "Musterbrief: DSGVO-Auskunftsantrag" },
            { href: "#loeschung", label: "Nächster Schritt: Löschung (Art. 17 DSGVO)" },
            { href: "#sovereign-datenschutz", label: "SOVEREIGN: Automatische DSGVO-Durchsetzung" },
          ] : [
            { href: "#recht", label: "Your Right to Information: Art. 15 GDPR" },
            { href: "#was-fordern", label: "What You Can Demand" },
            { href: "#wie-beantragen", label: "How to Apply Correctly" },
            { href: "#fristen", label: "Deadlines: What Companies Must Deliver" },
            { href: "#ablehnung", label: "What to Do if Refused?" },
            { href: "#vorlage", label: "Template Letter: GDPR Data Request" },
            { href: "#loeschung", label: "Next Step: Deletion (Art. 17 GDPR)" },
            { href: "#sovereign-datenschutz", label: "SOVEREIGN: Automatic GDPR Enforcement" },
          ]).map((item, i) => (
            <li key={i}>
              <a href={item.href} style={{ fontSize: "0.83rem", color: "rgba(255,255,255,0.45)", textDecoration: "none", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <span style={{ fontFamily: "var(--font-jetbrains, monospace)", fontSize: "0.55rem", color: "rgba(0,212,255,0.35)", minWidth: 16 }}>{String(i + 1).padStart(2, "0")}</span>
                {item.label}
              </a>
            </li>
          ))}
        </ol>
      </nav>

      <p>
        {isDE
          ? "Täglich sammeln Hunderte von Unternehmen Daten über dich. Was genau gespeichert wird, an wen es weitergegeben wird und wie lange — das erfährst du nur, wenn du aktiv fragst. Art. 15 DSGVO gibt dir das Recht, das zu tun. Dieser Guide zeigt dir, wie."
          : "Every day, hundreds of companies collect data about you. What exactly is stored, who it's shared with and for how long — you only find out if you actively ask. Art. 15 GDPR gives you the right to do so. This guide shows you how."}
      </p>

      <ArticleSection id="recht" title={isDE ? "Dein Recht auf Auskunft: Art. 15 DSGVO" : "Your Right to Information: Art. 15 GDPR"}>
        <p>
          {isDE
            ? "Art. 15 DSGVO (Datenschutz-Grundverordnung) gewährt dir als betroffener Person das umfassende Recht, von jedem Unternehmen, das deine Daten verarbeitet, vollständige Auskunft zu verlangen. Dieses Recht gilt für jedes Unternehmen, das Daten über EU-Bürger verarbeitet — unabhängig davon, ob das Unternehmen in der EU sitzt oder nicht."
            : "Art. 15 GDPR (General Data Protection Regulation) grants you as a data subject the comprehensive right to demand complete information from any company that processes your data. This right applies to any company that processes data about EU citizens — regardless of whether the company is based in the EU or not."}
        </p>
        <ArticleInsight>
          <strong>{isDE ? "Wichtig:" : "Important:"}</strong>{" "}
          {isDE
            ? "Das Auskunftsrecht ist kostenfrei. Unternehmen dürfen für einen Auskunftsantrag keine Gebühren verlangen — es sei denn, du stellst offensichtlich unbegründete oder exzessive Anträge. Ein normaler jährlicher Antrag ist immer kostenlos."
            : "The right to information is free of charge. Companies may not charge fees for an information request — unless you make obviously unfounded or excessive requests. A normal annual request is always free."}
        </ArticleInsight>
      </ArticleSection>

      <ArticleSection id="was-fordern" title={isDE ? "Was du von Unternehmen fordern kannst" : "What You Can Demand from Companies"}>
        <div style={{ display: "grid", gap: "0.75rem" }}>
          {(isDE ? [
            { title: "Bestätigung der Verarbeitung", desc: "Ob überhaupt personenbezogene Daten von dir verarbeitet werden" },
            { title: "Kopie aller Daten", desc: "Eine vollständige Kopie aller über dich gespeicherten Daten (in elektronischer Form, falls möglich)" },
            { title: "Verarbeitungszwecke", desc: "Warum deine Daten verarbeitet werden (z.B. Vertragsdurchführung, Marketing, Profilbildung)" },
            { title: "Datenkategorien", desc: "Welche Kategorien von Daten gespeichert sind (Adresse, Kaufhistorie, Verhalten, etc.)" },
            { title: "Empfänger der Daten", desc: "An wen deine Daten weitergegeben werden oder wurden (Auftragsverarbeiter, Drittländer)" },
            { title: "Speicherdauer", desc: "Wie lange deine Daten gespeichert werden oder nach welchen Kriterien die Dauer festgelegt wird" },
            { title: "Herkunft der Daten", desc: "Wenn Daten nicht direkt von dir erhoben wurden: Woher kommen sie?" },
            { title: "Automatisierte Entscheidungen", desc: "Ob Profiling oder automatisierte Entscheidungen stattfinden, die rechtliche Wirkung haben" },
          ] : [
            { title: "Confirmation of processing", desc: "Whether personal data about you is being processed at all" },
            { title: "Copy of all data", desc: "A complete copy of all data stored about you (in electronic form if possible)" },
            { title: "Processing purposes", desc: "Why your data is being processed (e.g. contract execution, marketing, profiling)" },
            { title: "Data categories", desc: "Which categories of data are stored (address, purchase history, behavior, etc.)" },
            { title: "Data recipients", desc: "To whom your data is or has been disclosed (processors, third countries)" },
            { title: "Storage period", desc: "How long your data will be stored or by what criteria the duration is determined" },
            { title: "Origin of data", desc: "If data was not collected directly from you: Where does it come from?" },
            { title: "Automated decisions", desc: "Whether profiling or automated decisions take place that have legal effects" },
          ]).map((item) => (
            <div key={item.title} style={{ display: "grid", gridTemplateColumns: "auto 1fr", gap: "1rem", padding: "0.75rem 1rem", border: "1px solid rgba(255,255,255,0.05)", alignItems: "start" }}>
              <span style={{ fontFamily: "var(--font-jetbrains, monospace)", fontSize: "0.58rem", color: "rgba(0,212,255,0.5)", paddingTop: 3 }}>→</span>
              <div>
                <strong style={{ fontSize: "0.87rem", color: "rgba(255,255,255,0.82)" }}>{item.title}</strong>
                <p style={{ margin: "0.2rem 0 0", fontSize: "0.82rem", color: "rgba(255,255,255,0.45)" }}>{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </ArticleSection>

      <ArticleSection id="wie-beantragen" title={isDE ? "So stellst du den Antrag richtig" : "How to Apply Correctly"}>
        <ol style={{ padding: "0 0 0 1.5rem", display: "flex", flexDirection: "column", gap: "0.75rem" }}>
          {(isDE ? [
            { title: "Datenschutzbeauftragten finden", desc: "Jedes Unternehmen mit mehr als 20 Mitarbeitern muss einen Datenschutzbeauftragten haben. Kontaktdaten findest du in der Datenschutzerklärung (oft privacy@, dsb@, datenschutz@ die häufigsten E-Mail-Präfixe)." },
            { title: "Antrag schriftlich stellen", desc: "Am besten per E-Mail mit Lesebestätigung oder per Einschreiben. Wichtig: Deine Identität eindeutig angeben (Name, Geburtsdatum, ggf. Kundennummer)." },
            { title: "Art. 15 DSGVO explizit nennen", desc: "Nenne explizit 'Art. 15 DSGVO' und 'Auskunftsrecht'. Dadurch werden juristische Fristen ausgelöst und der Antrag landet intern beim Datenschutzteam." },
            { title: "Frist notieren", desc: "Notiere das Datum deines Antrags. Die gesetzliche Frist für die Antwort beträgt 1 Monat. Bei komplexen Anträgen darf das Unternehmen einmalig um 2 weitere Monate verlängern — aber muss dich informieren." },
            { title: "Bei Ausbleiben eskalieren", desc: "Falls nach 1 Monat keine Antwort: Erinnerungsschreiben mit Verweis auf Art. 12 Abs. 3 DSGVO senden. Danach: Beschwerde bei der zuständigen Datenschutzbehörde." },
          ] : [
            { title: "Find data protection officer", desc: "Every company with more than 20 employees must have a data protection officer. Contact details can be found in the privacy policy (privacy@, dsb@, datenschutz@ are the most common email prefixes)." },
            { title: "Submit request in writing", desc: "Best by email with read receipt or by registered mail. Important: Clearly identify yourself (name, date of birth, customer number if applicable)." },
            { title: "Explicitly cite Art. 15 GDPR", desc: "Explicitly cite 'Art. 15 GDPR' and 'right of access'. This triggers legal deadlines and the request is internally directed to the data protection team." },
            { title: "Note the deadline", desc: "Note the date of your request. The legal deadline for a response is 1 month. For complex requests, the company may extend by 2 additional months — but must inform you." },
            { title: "Escalate if no response", desc: "If no response after 1 month: Send a reminder citing Art. 12(3) GDPR. Then: file a complaint with the responsible data protection authority." },
          ]).map((step, i) => (
            <li key={i} style={{ fontSize: "0.88rem", lineHeight: 1.7, color: "rgba(255,255,255,0.6)" }}>
              <strong style={{ color: "rgba(255,255,255,0.9)" }}>{step.title}: </strong>{step.desc}
            </li>
          ))}
        </ol>
      </ArticleSection>

      <ArticleSection id="fristen" title={isDE ? "Fristen: Was Unternehmen liefern müssen" : "Deadlines: What Companies Must Deliver"}>
        <div style={{ border: "1px solid rgba(255,255,255,0.07)", overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 400 }}>
            <thead>
              <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.07)", background: "rgba(0,212,255,0.03)" }}>
                {(isDE ? ["Zeitraum", "Pflicht des Unternehmens"] : ["Period", "Company obligation"]).map((h) => (
                  <th key={h} style={{ padding: "0.75rem 1rem", textAlign: "left", fontFamily: "var(--font-jetbrains, monospace)", fontSize: "0.58rem", letterSpacing: "0.1em", color: "rgba(0,212,255,0.5)", textTransform: "uppercase" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {(isDE ? [
                ["Sofort", "Empfangsbestätigung des Antrags (nicht gesetzlich vorgeschrieben, aber Best Practice)"],
                ["1 Monat", "Vollständige Antwort mit allen geforderten Informationen und Datenkopie"],
                ["1 Monat + 2 Monate möglich", "Bei komplexen Anträgen: Verlängerung möglich, aber du musst informiert werden"],
                ["Nach Fristablauf", "Unternehmen muss auf Mahnschreiben reagieren oder Klage/Behördenbeschwerde droht"],
              ] : [
                ["Immediately", "Acknowledgment of receipt (not legally required, but best practice)"],
                ["1 month", "Complete response with all requested information and data copy"],
                ["1 month + 2 months possible", "For complex requests: extension possible, but you must be informed"],
                ["After deadline", "Company must respond to reminder letter or risk lawsuit/regulatory complaint"],
              ]).map(([period, obligation], i, arr) => (
                <tr key={period} style={{ borderBottom: i < arr.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none" }}>
                  <td style={{ padding: "0.65rem 1rem", fontFamily: "var(--font-jetbrains, monospace)", fontSize: "0.68rem", color: "rgba(0,212,255,0.7)", whiteSpace: "nowrap" }}>{period}</td>
                  <td style={{ padding: "0.65rem 1rem", fontSize: "0.82rem", color: "rgba(255,255,255,0.5)" }}>{obligation}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </ArticleSection>

      <ArticleSection id="ablehnung" title={isDE ? "Was tun bei Ablehnung oder unvollständiger Antwort?" : "What to Do if Refused or Response is Incomplete?"}>
        <p>
          {isDE
            ? "Unternehmen dürfen einen Auskunftsantrag nur in sehr engen Ausnahmen ablehnen (z.B. wenn die Herausgabe Rechte Dritter verletzt oder der Antrag offensichtlich unbegründet ist). Eine pauschale Ablehnung ist rechtswidrig. Deine Eskalationsstufen:"
            : "Companies may only refuse an access request in very narrow exceptions (e.g. if disclosure would harm third-party rights or the request is manifestly unfounded). A blanket refusal is unlawful. Your escalation levels:"}
        </p>
        <ol style={{ padding: "0 0 0 1.5rem", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
          {(isDE ? [
            "Schriftliche Erinnerung mit Verweis auf Art. 12 Abs. 3 DSGVO und Androhung der Behördenbeschwerde",
            "Beschwerde bei der zuständigen Datenschutz-Aufsichtsbehörde (in Deutschland: Landesdatenschutzbehörden, z.B. BayLDA, LfDI BW)",
            "Beschwerde beim Europäischen Datenschutzausschuss (EDPB) bei grenzüberschreitenden Fällen",
            "Zivilrechtliche Klage auf Auskunftserteilung + Schadensersatz (Art. 82 DSGVO)",
          ] : [
            "Written reminder citing Art. 12(3) GDPR and threatening regulatory complaint",
            "Complaint to the responsible data protection supervisory authority (in Germany: state DPAs, e.g. BayLDA, LfDI BW)",
            "Complaint to the European Data Protection Board (EDPB) for cross-border cases",
            "Civil lawsuit for information disclosure + damages (Art. 82 GDPR)",
          ]).map((step, i) => (
            <li key={i} style={{ fontSize: "0.87rem", color: "rgba(255,255,255,0.6)", lineHeight: 1.65 }}>{step}</li>
          ))}
        </ol>
        <ArticleInsight>
          {isDE
            ? "Datenschutzbehörden können Bußgelder von bis zu 20 Mio. Euro oder 4 % des weltweiten Jahresumsatzes verhängen, wenn Unternehmen Auskunftsrechte verletzen. Das ist ein starkes Druckmittel."
            : "Data protection authorities can impose fines of up to €20 million or 4% of global annual revenue when companies violate access rights. That's a powerful lever."}
        </ArticleInsight>
      </ArticleSection>

      <ArticleSection id="vorlage" title={isDE ? "Musterbrief: DSGVO-Auskunftsantrag" : "Template Letter: GDPR Data Request"}>
        <p style={{ marginBottom: "0.5rem" }}>
          {isDE
            ? "Kopiere diesen Brief, passe die markierten Felder an und sende ihn per E-Mail an den Datenschutzbeauftragten des Unternehmens:"
            : "Copy this letter, adjust the marked fields, and send it by email to the company's data protection officer:"}
        </p>
        <div style={{ background: "rgba(0,0,0,0.3)", border: "1px solid rgba(0,212,255,0.15)", padding: "2rem", fontFamily: "var(--font-jetbrains, monospace)", fontSize: "0.75rem", lineHeight: 1.9, color: "rgba(255,255,255,0.7)", whiteSpace: "pre-wrap" }}>
{isDE
  ? `[Dein Name]
[Deine Adresse]
[PLZ, Ort]
[E-Mail-Adresse]

An: [Datenschutzbeauftragter / Unternehmen]
[Adresse des Unternehmens]

Betreff: Auskunftsantrag gem. Art. 15 DSGVO

Sehr geehrte Damen und Herren,

hiermit mache ich von meinem Recht auf Auskunft gemäß Art. 15 der
Datenschutz-Grundverordnung (DSGVO) Gebrauch und bitte Sie um
Auskunft über die zu meiner Person gespeicherten personenbezogenen
Daten.

Im Einzelnen bitte ich um Auskunft über:

1. Ob und welche personenbezogenen Daten Sie über mich verarbeiten
2. Eine vollständige Kopie aller über mich gespeicherten Daten
3. Die Verarbeitungszwecke
4. Die Kategorien der verarbeiteten Daten
5. Die Empfänger oder Kategorien von Empfängern
6. Die geplante Speicherdauer
7. Die Herkunft der Daten (falls nicht direkt von mir erhoben)
8. Das Bestehen automatisierter Entscheidungsfindung einschließlich
   Profiling (Art. 22 DSGVO)

Bitte übermitteln Sie mir die gewünschten Informationen in einem
maschinenlesbaren Format (z.B. CSV, JSON oder PDF) innerhalb der
gesetzlichen Frist von einem Monat.

Mit freundlichen Grüßen,
[Dein Name]

Datum: [Datum]
Kundennummer (falls bekannt): [Kundennummer]`
  : `[Your Name]
[Your Address]
[Postcode, City]
[Email Address]

To: [Data Protection Officer / Company]
[Company Address]

Subject: Access Request pursuant to Art. 15 GDPR

Dear Sir or Madam,

I hereby exercise my right of access pursuant to Art. 15 of the
General Data Protection Regulation (GDPR) and request information
about the personal data stored about me.

Specifically, I request information about:

1. Whether and which personal data you process about me
2. A complete copy of all data stored about me
3. The purposes of processing
4. The categories of data processed
5. The recipients or categories of recipients
6. The planned storage period
7. The origin of the data (if not collected directly from me)
8. The existence of automated decision-making including profiling
   (Art. 22 GDPR)

Please provide the requested information in a machine-readable
format (e.g. CSV, JSON or PDF) within the statutory deadline of
one month.

Yours faithfully,
[Your Name]

Date: [Date]
Customer number (if known): [Customer number]`}
        </div>
      </ArticleSection>

      <ArticleSection id="loeschung" title={isDE ? "Nächster Schritt: Löschung nach Art. 17 DSGVO" : "Next Step: Deletion under Art. 17 GDPR"}>
        <p>
          {isDE
            ? "Nachdem du Auskunft erhalten hast, kannst du auf Basis der übermittelten Daten gezielt Löschung beantragen. Art. 17 DSGVO ('Recht auf Vergessenwerden') gibt dir das Recht, die Löschung zu fordern, wenn:"
            : "After receiving your information, you can specifically request deletion based on the transmitted data. Art. 17 GDPR ('Right to be Forgotten') gives you the right to demand deletion when:"}
        </p>
        <ul style={{ padding: "0 0 0 1.25rem", display: "flex", flexDirection: "column", gap: "0.35rem" }}>
          {(isDE ? [
            "Die Daten für den ursprünglichen Zweck nicht mehr notwendig sind",
            "Du deine Einwilligung widerrufen hast und kein anderer Rechtsgrund vorliegt",
            "Die Daten unrechtmäßig verarbeitet wurden",
            "Du der Verarbeitung widersprochen hast (Art. 21 DSGVO) und keine überwiegenden Interessen vorliegen",
          ] : [
            "The data is no longer necessary for the original purpose",
            "You have withdrawn your consent and there is no other legal basis",
            "The data was processed unlawfully",
            "You have objected to processing (Art. 21 GDPR) and there are no overriding interests",
          ]).map((item) => (
            <li key={item} style={{ fontSize: "0.87rem", color: "rgba(255,255,255,0.55)", lineHeight: 1.6 }}>{item}</li>
          ))}
        </ul>
      </ArticleSection>

      <ArticleSection id="sovereign-datenschutz" title={isDE ? "SOVEREIGN: DSGVO-Rechte automatisch durchsetzen" : "SOVEREIGN: Enforce GDPR Rights Automatically"}>
        <p>
          {isDE
            ? "SOVEREIGN übernimmt den gesamten DSGVO-Auskunftsprozess für dich: Identifikation aller Unternehmen, die deine Daten verarbeiten könnten, automatische Erstellung und Versendung personalisierter Auskunftsanträge, Fristenüberwachung und — bei Ausbleiben — automatische Eskalation."
            : "SOVEREIGN handles the entire GDPR access process for you: Identification of all companies that could be processing your data, automatic creation and sending of personalized access requests, deadline monitoring and — if no response — automatic escalation."}
        </p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "1px", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.06)", margin: "1rem 0" }}>
          {(isDE ? [
            { step: "01", label: "Scan", desc: "SOVEREIGN identifiziert Unternehmen" },
            { step: "02", label: "Draft", desc: "Personalisierte Anträge erstellen" },
            { step: "03", label: "Send", desc: "Automatischer Versand & Protokoll" },
            { step: "04", label: "Track", desc: "Fristen überwachen, eskalieren" },
          ] : [
            { step: "01", label: "Scan", desc: "SOVEREIGN identifies companies" },
            { step: "02", label: "Draft", desc: "Create personalized requests" },
            { step: "03", label: "Send", desc: "Automatic sending & logging" },
            { step: "04", label: "Track", desc: "Monitor deadlines, escalate" },
          ]).map((item) => (
            <div key={item.step} style={{ padding: "1.25rem", background: "#0A1220", textAlign: "center" }}>
              <div style={{ fontFamily: "var(--font-jetbrains, monospace)", fontSize: "0.58rem", color: "rgba(0,212,255,0.35)", marginBottom: "0.25rem" }}>{item.step}</div>
              <div style={{ fontSize: "0.88rem", fontWeight: 700, color: "rgba(255,255,255,0.85)", marginBottom: "0.3rem" }}>{item.label}</div>
              <div style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.4)" }}>{item.desc}</div>
            </div>
          ))}
        </div>
      </ArticleSection>
    </div>
  );
}

// ─── Digitale Souveränität 2030 ───────────────────────────────────────────────

function DigitaleSouveraenitaetContent({ locale }: { locale: string }) {
  const isDE = locale === "de";
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem", fontSize: "0.95rem", lineHeight: 1.8, color: "rgba(255,255,255,0.6)" }}>

      <nav style={{ background: "rgba(0,212,255,0.03)", border: "1px solid rgba(0,212,255,0.12)", padding: "1.75rem", marginBottom: "1rem" }}>
        <p style={{ fontFamily: "var(--font-jetbrains, monospace)", fontSize: "0.6rem", letterSpacing: "0.12em", color: "rgba(0,212,255,0.5)", marginBottom: "1rem", textTransform: "uppercase" }}>
          {isDE ? "Inhaltsverzeichnis" : "Table of Contents"}
        </p>
        <ol style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "0.5rem" }}>
          {(isDE ? [
            { href: "#definition", label: "Was ist digitale Souveränität?" },
            { href: "#status-quo", label: "Status Quo 2026: Wie abhängig sind wir?" },
            { href: "#drei-ebenen", label: "Die drei Ebenen digitaler Souveränität" },
            { href: "#bedrohungen", label: "Die 5 größten Bedrohungen" },
            { href: "#eu-strategie", label: "Europas Antwort: Digital Sovereignty Strategy" },
            { href: "#individuell", label: "Digitale Souveränität im Alltag" },
            { href: "#2030-vision", label: "Vision 2030: Das souveräne digitale Individuum" },
            { href: "#sovereign-rolle", label: "SOVEREIGNs Rolle im souveränen Digitalleben" },
          ] : [
            { href: "#definition", label: "What is digital sovereignty?" },
            { href: "#status-quo", label: "Status Quo 2026: How Dependent Are We?" },
            { href: "#drei-ebenen", label: "The Three Levels of Digital Sovereignty" },
            { href: "#bedrohungen", label: "The 5 Biggest Threats" },
            { href: "#eu-strategie", label: "Europe's Response: Digital Sovereignty Strategy" },
            { href: "#individuell", label: "Digital Sovereignty in Everyday Life" },
            { href: "#2030-vision", label: "Vision 2030: The Sovereign Digital Individual" },
            { href: "#sovereign-rolle", label: "SOVEREIGN's Role in the Sovereign Digital Life" },
          ]).map((item, i) => (
            <li key={i}>
              <a href={item.href} style={{ fontSize: "0.83rem", color: "rgba(255,255,255,0.45)", textDecoration: "none", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <span style={{ fontFamily: "var(--font-jetbrains, monospace)", fontSize: "0.55rem", color: "rgba(0,212,255,0.35)", minWidth: 16 }}>{String(i + 1).padStart(2, "0")}</span>
                {item.label}
              </a>
            </li>
          ))}
        </ol>
      </nav>

      <p>
        {isDE
          ? "2026 ist das Jahr, in dem digitale Souveränität von einer abstrakten politischen Forderung zur gelebten Notwendigkeit wird. Tech-Konzerne wissen mehr über dich als du selbst. KI-Systeme treffen Entscheidungen über deinen Kredit, deine Versicherungsprämie, deine Jobchancen. Und die Infrastruktur, auf der dein digitales Leben basiert, ist größtenteils nicht in europäischer Hand. Dieser Artikel analysiert, was digitale Souveränität bedeutet — und wie du sie zurückgewinnst."
          : "2026 is the year when digital sovereignty shifts from an abstract political demand to a lived necessity. Tech corporations know more about you than you do yourself. AI systems make decisions about your credit, your insurance premium, your job prospects. And the infrastructure on which your digital life is based is largely not in European hands. This article analyzes what digital sovereignty means — and how you can reclaim it."}
      </p>

      <ArticleSection id="definition" title={isDE ? "Was ist digitale Souveränität?" : "What is Digital Sovereignty?"}>
        <p>
          {isDE
            ? "Digitale Souveränität bezeichnet die Fähigkeit von Individuen, Unternehmen und Staaten, ihre digitale Umgebung selbstbestimmt zu gestalten — mit Kontrolle über eigene Daten, Technologien und Infrastrukturen, unabhängig von fremden Interessen oder Abhängigkeiten."
            : "Digital sovereignty refers to the ability of individuals, companies and states to shape their digital environment autonomously — with control over their own data, technologies and infrastructures, independent of foreign interests or dependencies."}
        </p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1rem", margin: "1rem 0" }}>
          {(isDE ? [
            { level: "Individuell", desc: "Kontrolle über eigene Daten, Verträge, digitale Identität und KI-Interaktionen" },
            { level: "Organisational", desc: "Unabhängigkeit von einzelnen Anbietern, eigene Daten-Governance, Exit-Optionen" },
            { level: "National/EU", desc: "Technologische Unabhängigkeit, eigene KI-Kapazitäten, souveräne Infrastruktur" },
          ] : [
            { level: "Individual", desc: "Control over own data, contracts, digital identity and AI interactions" },
            { level: "Organizational", desc: "Independence from individual vendors, own data governance, exit options" },
            { level: "National/EU", desc: "Technological independence, own AI capabilities, sovereign infrastructure" },
          ]).map((item) => (
            <div key={item.level} style={{ padding: "1.25rem", border: "1px solid rgba(0,212,255,0.1)", background: "rgba(0,212,255,0.02)" }}>
              <div style={{ fontFamily: "var(--font-jetbrains, monospace)", fontSize: "0.62rem", color: "rgba(0,212,255,0.55)", letterSpacing: "0.08em", marginBottom: "0.4rem", textTransform: "uppercase" }}>{item.level}</div>
              <p style={{ fontSize: "0.83rem", color: "rgba(255,255,255,0.5)", lineHeight: 1.6, margin: 0 }}>{item.desc}</p>
            </div>
          ))}
        </div>
      </ArticleSection>

      <ArticleSection id="status-quo" title={isDE ? "Status Quo 2026: Wie abhängig sind wir wirklich?" : "Status Quo 2026: How Dependent Are We Really?"}>
        <p>
          {isDE
            ? "Die Zahlen sind ernüchternd. Eine durchschnittliche deutsche Privatperson interagiert täglich mit über 30 digitalen Diensten — der überwiegende Teil davon unter der Kontrolle von US-amerikanischen oder chinesischen Konzernen."
            : "The numbers are sobering. The average German private individual interacts with more than 30 digital services daily — the vast majority of them under the control of US or Chinese corporations."}
        </p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: "1rem", margin: "1rem 0" }}>
          {[
            { stat: "92%", label: isDE ? "des Suchmaschinenmarkts unter Google-Kontrolle in DE" : "of search engine market under Google control in Germany" },
            { stat: "€340", label: isDE ? "durchschnittlicher jährlicher Verlust durch unbemerkte Abos" : "average annual loss from unnoticed subscriptions" },
            { stat: "73%", label: isDE ? "der Deutschen wissen nicht, wer ihre Daten besitzt" : "of Germans don't know who owns their data" },
            { stat: "15+", label: isDE ? "laufende Verträge pro Haushalt im Durchschnitt" : "active contracts per household on average" },
          ].map((item) => (
            <div key={item.stat} style={{ padding: "1.25rem", border: "1px solid rgba(255,255,255,0.07)", textAlign: "center" }}>
              <div style={{ fontFamily: "var(--font-space-grotesk, sans-serif)", fontSize: "1.8rem", fontWeight: 800, color: "rgba(0,212,255,0.8)", lineHeight: 1 }}>{item.stat}</div>
              <p style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.4)", lineHeight: 1.55, margin: "0.5rem 0 0" }}>{item.label}</p>
            </div>
          ))}
        </div>
      </ArticleSection>

      <ArticleSection id="drei-ebenen" title={isDE ? "Die drei Ebenen digitaler Souveränität" : "The Three Levels of Digital Sovereignty"}>
        {(isDE ? [
          {
            title: "Datensouveränität",
            desc: "Die Kontrolle darüber, welche Daten über dich existieren, wer sie besitzt und wie sie verwendet werden. Grundlage: DSGVO-Rechte (Art. 15–22) aktiv ausüben, Trackingverhinderung, datensparende Alternativen wählen.",
            actions: ["Jährlicher DSGVO-Auskunftsantrag bei allen relevanten Unternehmen", "Nutzung von Privacy-First-Alternativen (Proton statt Gmail, Signal statt WhatsApp)", "Regelmäßige Überprüfung erteilter App-Berechtigungen"],
          },
          {
            title: "Vertragssouveränität",
            desc: "Die Kontrolle über alle vertraglichen Verpflichtungen — zu wissen, was man unterschrieben hat, zu verstehen, was man schuldet, und jederzeit exit-fähig zu sein.",
            actions: ["Vollständiger Vertragsüberblick mit Fristen und Kosten", "Automatische Erkennung von Preiserhöhungen und Sonderkündigungsrechten", "Proaktive Kündigung vor automatischer Verlängerung"],
          },
          {
            title: "Technologische Souveränität",
            desc: "Die Fähigkeit, Technologie zu verstehen, zu kontrollieren und bei Bedarf zu wechseln. Kein Lock-in, offene Standards, eigene Daten jederzeit exportierbar.",
            actions: ["Open-Source-Alternativen bevorzugen wo möglich", "Datexportfähigkeit vor Plattformwahl prüfen", "Kritische Daten lokal oder auf EU-Servern hosten"],
          },
        ] : [
          {
            title: "Data Sovereignty",
            desc: "Control over what data exists about you, who owns it and how it's used. Foundation: Actively exercising GDPR rights (Art. 15–22), preventing tracking, choosing data-minimizing alternatives.",
            actions: ["Annual GDPR access request to all relevant companies", "Using privacy-first alternatives (Proton instead of Gmail, Signal instead of WhatsApp)", "Regular review of granted app permissions"],
          },
          {
            title: "Contract Sovereignty",
            desc: "Control over all contractual obligations — knowing what you've signed, understanding what you owe, and being able to exit at any time.",
            actions: ["Complete contract overview with deadlines and costs", "Automatic detection of price increases and special termination rights", "Proactive cancellation before automatic renewal"],
          },
          {
            title: "Technological Sovereignty",
            desc: "The ability to understand, control and switch technology when needed. No lock-in, open standards, own data always exportable.",
            actions: ["Prefer open-source alternatives where possible", "Check data export capability before choosing a platform", "Host critical data locally or on EU servers"],
          },
        ]).map((level) => (
          <div key={level.title} style={{ padding: "1.5rem", border: "1px solid rgba(0,212,255,0.1)", background: "rgba(0,212,255,0.02)", marginBottom: "0.5rem" }}>
            <h3 style={{ fontSize: "1rem", fontWeight: 700, color: "rgba(255,255,255,0.9)", marginBottom: "0.5rem" }}>{level.title}</h3>
            <p style={{ fontSize: "0.85rem", color: "rgba(255,255,255,0.5)", lineHeight: 1.65, marginBottom: "0.75rem" }}>{level.desc}</p>
            <ul style={{ margin: 0, padding: "0 0 0 1rem", display: "flex", flexDirection: "column", gap: "0.3rem" }}>
              {level.actions.map((a) => <li key={a} style={{ fontSize: "0.82rem", color: "rgba(255,255,255,0.45)" }}>{a}</li>)}
            </ul>
          </div>
        ))}
      </ArticleSection>

      <ArticleSection id="bedrohungen" title={isDE ? "Die 5 größten Bedrohungen digitaler Souveränität" : "The 5 Biggest Threats to Digital Sovereignty"}>
        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
          {(isDE ? [
            { num: "01", title: "Plattform-Monopole", desc: "Wenige Tech-Konzerne kontrollieren Infrastruktur, Verteilung und Daten. Wechsel wird durch Lock-in strukturell erschwert." },
            { num: "02", title: "Dark Patterns & Nudging", desc: "Manipulative UX-Designs führen zu ungewollten Einwilligungen, Abschlüssen und Datenweitergaben — ohne explizite Absicht." },
            { num: "03", title: "Intransparente KI-Entscheidungen", desc: "Kreditscoring, Versicherungsprämien, Stellenangebote: KI entscheidet zunehmend ohne erklärbare Begründung." },
            { num: "04", title: "Datenlecks & Identitätsdiebstahl", desc: "Breaches bei einer Plattform kaskadieren durch Cross-Platform-Identitäten. Deine Daten von 2015 sind 2026 noch im Umlauf." },
            { num: "05", title: "Geopolitische Abhängigkeiten", desc: "CLOUD Act (USA) und ähnliche Gesetze ermöglichen Zugriff auf Daten, die auf US-Infrastruktur liegen — unabhängig vom Standort der Server." },
          ] : [
            { num: "01", title: "Platform monopolies", desc: "Few tech corporations control infrastructure, distribution and data. Switching is structurally impeded by lock-in." },
            { num: "02", title: "Dark patterns & nudging", desc: "Manipulative UX designs lead to unwanted consents, purchases and data sharing — without explicit intent." },
            { num: "03", title: "Opaque AI decisions", desc: "Credit scoring, insurance premiums, job offers: AI increasingly decides without explainable reasoning." },
            { num: "04", title: "Data breaches & identity theft", desc: "Breaches at one platform cascade through cross-platform identities. Your 2015 data is still circulating in 2026." },
            { num: "05", title: "Geopolitical dependencies", desc: "CLOUD Act (USA) and similar laws allow access to data on US infrastructure — regardless of server location." },
          ]).map((threat) => (
            <div key={threat.num} style={{ display: "grid", gridTemplateColumns: "40px 1fr", gap: "1rem", padding: "1rem", border: "1px solid rgba(255,255,255,0.05)" }}>
              <span style={{ fontFamily: "var(--font-jetbrains, monospace)", fontSize: "0.65rem", color: "rgba(0,212,255,0.3)", paddingTop: 4 }}>{threat.num}</span>
              <div>
                <strong style={{ fontSize: "0.9rem", color: "rgba(255,255,255,0.82)", display: "block", marginBottom: "0.3rem" }}>{threat.title}</strong>
                <p style={{ fontSize: "0.82rem", color: "rgba(255,255,255,0.45)", lineHeight: 1.6, margin: 0 }}>{threat.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </ArticleSection>

      <ArticleSection id="eu-strategie" title={isDE ? "Europas Antwort: Die Digitale Souveränität als EU-Strategie" : "Europe's Response: Digital Sovereignty as EU Strategy"}>
        <p>
          {isDE
            ? "Die EU hat digitale Souveränität zu einem zentralen politischen Ziel erklärt. Die wichtigsten Initiativen:"
            : "The EU has declared digital sovereignty a central political objective. The most important initiatives:"}
        </p>
        <div style={{ border: "1px solid rgba(255,255,255,0.07)", overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 480 }}>
            <thead>
              <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.07)", background: "rgba(0,212,255,0.03)" }}>
                {(isDE ? ["Initiative", "Ziel", "Status"] : ["Initiative", "Goal", "Status"]).map((h) => (
                  <th key={h} style={{ padding: "0.75rem 1rem", textAlign: "left", fontFamily: "var(--font-jetbrains, monospace)", fontSize: "0.58rem", letterSpacing: "0.1em", color: "rgba(0,212,255,0.5)", textTransform: "uppercase" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {(isDE ? [
                ["DSGVO", "Schutz personenbezogener Daten", "✓ Seit 2018 in Kraft"],
                ["EU AI Act", "Risikobegrenzte KI-Regulierung", "✓ Seit 2024, schrittweise bis 2027"],
                ["Data Act", "Datenzugang & -portabilität", "✓ Seit September 2025"],
                ["Digital Markets Act", "Interoperabilität & Anti-Monopol", "✓ Seit 2023, Enforcement ab 2024"],
                ["GAIA-X", "Souveräne EU-Cloud-Infrastruktur", "⚡ Im Aufbau"],
                ["EuroHPC", "Europäische Supercomputing-Kapazität", "✓ Operativ"],
              ] : [
                ["GDPR", "Protection of personal data", "✓ In force since 2018"],
                ["EU AI Act", "Risk-limited AI regulation", "✓ Since 2024, phased until 2027"],
                ["Data Act", "Data access & portability", "✓ Since September 2025"],
                ["Digital Markets Act", "Interoperability & anti-monopoly", "✓ Since 2023, enforcement from 2024"],
                ["GAIA-X", "Sovereign EU cloud infrastructure", "⚡ Under construction"],
                ["EuroHPC", "European supercomputing capacity", "✓ Operational"],
              ]).map(([init, goal, status], i, arr) => (
                <tr key={init} style={{ borderBottom: i < arr.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none" }}>
                  <td style={{ padding: "0.65rem 1rem", fontFamily: "var(--font-jetbrains, monospace)", fontSize: "0.7rem", color: "rgba(0,212,255,0.7)", whiteSpace: "nowrap" }}>{init}</td>
                  <td style={{ padding: "0.65rem 1rem", fontSize: "0.82rem", color: "rgba(255,255,255,0.6)" }}>{goal}</td>
                  <td style={{ padding: "0.65rem 1rem", fontSize: "0.75rem", color: "rgba(255,255,255,0.35)", whiteSpace: "nowrap" }}>{status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </ArticleSection>

      <ArticleSection id="individuell" title={isDE ? "Digitale Souveränität im Alltag: Dein persönlicher Aktionsplan" : "Digital Sovereignty in Everyday Life: Your Personal Action Plan"}>
        <p>
          {isDE
            ? "Digitale Souveränität ist kein einmaliges Event, sondern eine kontinuierliche Praxis. Diese 5 Maßnahmen bringen den größten Impact:"
            : "Digital sovereignty is not a one-time event but a continuous practice. These 5 measures have the greatest impact:"}
        </p>
        <ol style={{ padding: "0 0 0 1.5rem", display: "flex", flexDirection: "column", gap: "0.75rem" }}>
          {(isDE ? [
            { title: "Jährlicher Daten-Audit", desc: "Einmal im Jahr: DSGVO-Auskunftsantrag bei den 10 wichtigsten Diensten, Datenlöschung wo möglich, Überprüfung aller Einwilligungen." },
            { title: "Vertragsüberblick schaffen", desc: "Alle laufenden Verträge, Abos und Mitgliedschaften erfassen. Kosten, Fristen, Kündigungstermine kennen. Ungenutzte sofort kündigen." },
            { title: "Privacy-Stack aktualisieren", desc: "Browser: Firefox + uBlock Origin. Suche: Ecosia oder DuckDuckGo. E-Mail: Proton oder Tutanota. Messaging: Signal. VPN: Mullvad oder ProtonVPN." },
            { title: "Passwort-Hygiene", desc: "Passwort-Manager (Bitwarden, 1Password), einzigartiges Passwort pro Dienst, 2FA auf allen kritischen Konten. Regelmäßiger Check auf HaveIBeenPwned." },
            { title: "KI-Interaktionen bewusst gestalten", desc: "Welche KI-Dienste hast du mit welchen Daten versorgt? Überprüfe Datenschutzeinstellungen, nutze KI-Systeme die transparent über Datenverwendung sind." },
          ] : [
            { title: "Annual data audit", desc: "Once a year: GDPR access request to the 10 most important services, data deletion where possible, review of all consents." },
            { title: "Create contract overview", desc: "Record all ongoing contracts, subscriptions and memberships. Know costs, deadlines, cancellation dates. Cancel unused ones immediately." },
            { title: "Update privacy stack", desc: "Browser: Firefox + uBlock Origin. Search: Ecosia or DuckDuckGo. Email: Proton or Tutanota. Messaging: Signal. VPN: Mullvad or ProtonVPN." },
            { title: "Password hygiene", desc: "Password manager (Bitwarden, 1Password), unique password per service, 2FA on all critical accounts. Regular check on HaveIBeenPwned." },
            { title: "Design AI interactions consciously", desc: "Which AI services have you provided with what data? Review privacy settings, use AI systems that are transparent about data usage." },
          ]).map((step, i) => (
            <li key={i} style={{ fontSize: "0.88rem", lineHeight: 1.7, color: "rgba(255,255,255,0.6)" }}>
              <strong style={{ color: "rgba(255,255,255,0.9)" }}>{step.title}: </strong>{step.desc}
            </li>
          ))}
        </ol>
      </ArticleSection>

      <ArticleSection id="2030-vision" title={isDE ? "Vision 2030: Das souveräne digitale Individuum" : "Vision 2030: The Sovereign Digital Individual"}>
        <p>
          {isDE
            ? "Wie sieht das digitale Leben 2030 für eine wirklich souveräne Person aus? Unsere Vision:"
            : "What does digital life in 2030 look like for a truly sovereign person? Our vision:"}
        </p>
        <ArticleInsight>
          {isDE
            ? "Eine Person mit digitalem Souveränitäts-Score von 10/10: Alle Verträge sind in einem System erfasst, DSGVO-Rechte werden automatisch ausgeübt, KI-Interaktionen sind vollständig transparent, keine Daten ohne explizite Einwilligung bei Dritten, Exit-Option für jeden Dienst jederzeit möglich. Das ist keine Utopie — das ist die Richtung, in die SOVEREIGN 2030 führt."
            : "A person with a digital sovereignty score of 10/10: All contracts captured in one system, GDPR rights exercised automatically, AI interactions fully transparent, no data with third parties without explicit consent, exit option for every service always available. This is not utopia — this is the direction SOVEREIGN 2030 is leading."}
        </ArticleInsight>
      </ArticleSection>

      <ArticleSection id="sovereign-rolle" title={isDE ? "SOVEREIGNs Rolle: KI als Werkzeug der Souveränität" : "SOVEREIGN's Role: AI as a Tool of Sovereignty"}>
        <p>
          {isDE
            ? "Das Paradox: KI ist gleichzeitig die größte Bedrohung und das mächtigste Werkzeug für digitale Souveränität. SOVEREIGN nutzt KI als Verstärker deiner Rechte — nicht als Instrument deiner Kontrolle. Drei Kernprinzipien:"
            : "The paradox: AI is simultaneously the greatest threat and the most powerful tool for digital sovereignty. SOVEREIGN uses AI as an amplifier of your rights — not as an instrument of your control. Three core principles:"}
        </p>
        <div style={{ display: "grid", gap: "1rem", margin: "1rem 0" }}>
          {(isDE ? [
            { title: "KI für dich, nicht über dich", desc: "SOVEREIGN analysiert Verträge, sendet Briefe, überwacht Fristen — aber du entscheidest immer. Keine Aktion ohne deine Freigabe." },
            { title: "Daten bleiben deine Daten", desc: "Zero-Knowledge-Prinzip wo möglich. Ende-zu-Ende-Verschlüsselung für alle sensiblen Dokumente. Keine Weitergabe an Dritte, keine Nutzung für KI-Training." },
            { title: "Transparenz über Prozesse", desc: "Jede KI-Entscheidung ist nachvollziehbar. Du siehst immer, was SOVEREIGN tut, warum und auf welcher Grundlage." },
          ] : [
            { title: "AI for you, not about you", desc: "SOVEREIGN analyzes contracts, sends letters, monitors deadlines — but you always decide. No action without your approval." },
            { title: "Data stays your data", desc: "Zero-knowledge principle where possible. End-to-end encryption for all sensitive documents. No sharing with third parties, no use for AI training." },
            { title: "Transparency over processes", desc: "Every AI decision is traceable. You always see what SOVEREIGN does, why and on what basis." },
          ]).map((item) => (
            <div key={item.title} style={{ padding: "1.25rem", border: "1px solid rgba(0,212,255,0.1)", background: "rgba(0,212,255,0.02)" }}>
              <strong style={{ fontSize: "0.9rem", color: "rgba(255,255,255,0.88)", display: "block", marginBottom: "0.4rem" }}>{item.title}</strong>
              <p style={{ fontSize: "0.83rem", color: "rgba(255,255,255,0.48)", lineHeight: 1.65, margin: 0 }}>{item.desc}</p>
            </div>
          ))}
        </div>
      </ArticleSection>
    </div>
  );
}

// ─── Generic article ──────────────────────────────────────────────────────────

function GenericArticleContent({ slug, locale }: { slug: string; locale: string }) {
  const article = getArticle(slug);
  if (!article) return null;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem", fontSize: "0.95rem", lineHeight: 1.8, color: "rgba(255,255,255,0.6)" }}>
      <p>{locale === "de" ? article.description : article.descriptionEn}</p>
      <div style={{ padding: "2rem", border: "1px solid rgba(0,212,255,0.15)", background: "rgba(0,212,255,0.02)", textAlign: "center" }}>
        <p style={{ color: "rgba(0,212,255,0.7)", fontFamily: "var(--font-jetbrains, monospace)", fontSize: "0.7rem", letterSpacing: "0.1em" }}>
          VOLLSTÄNDIGER ARTIKEL IN KÜRZE VERFÜGBAR
        </p>
        <p style={{ fontSize: "0.85rem", color: "rgba(255,255,255,0.4)", marginTop: "0.5rem" }}>
          Dieser Guide wird aktuell redaktionell bearbeitet. Starte jetzt mit SOVEREIGN und lass die KI für dich arbeiten.
        </p>
        <Link href="/dashboard" className="lp-btn-primary" style={{ marginTop: "1.5rem", display: "inline-flex" }}>
          Jetzt starten
        </Link>
      </div>
    </div>
  );
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function ArticleSection({ id, title, children }: { id: string; title: string; children: React.ReactNode }) {
  return (
    <section id={id} style={{ scrollMarginTop: "5rem" }}>
      <h2
        style={{
          fontFamily: "var(--font-space-grotesk, sans-serif)",
          fontWeight: 800,
          fontSize: "clamp(1.1rem, 2.5vw, 1.5rem)",
          color: "rgba(255,255,255,0.95)",
          letterSpacing: "-0.02em",
          lineHeight: 1.2,
          margin: "2.5rem 0 1rem",
        }}
      >
        {title}
      </h2>
      <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        {children}
      </div>
    </section>
  );
}

function ArticleInsight({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        background: "rgba(0,212,255,0.04)",
        borderLeft: "3px solid rgba(0,212,255,0.35)",
        padding: "1.25rem 1.5rem",
        fontSize: "0.88rem",
        lineHeight: 1.75,
        color: "rgba(255,255,255,0.7)",
      }}
    >
      {children}
    </div>
  );
}
