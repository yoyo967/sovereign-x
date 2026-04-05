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
