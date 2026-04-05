import type { Metadata } from "next";
import Link from "next/link";
import JsonLd from "@/components/SEO/JsonLd";
import PremiumBanner from "@/components/landing/PremiumBanner";
import NexusIcon from "@/components/landing/NexusIcon";

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
      ? "Datensouveränität 2030: Grundlagen, Rechte & SOVEREIGN Strategie"
      : "Data Sovereignty 2030: Fundamentals, Rights & SOVEREIGN Strategy",
    description: isDE
      ? "Was Datensouveränität bedeutet, welche Rechte du hast und wie SOVEREIGN 2030 als autonomes Life-OS deine persönliche Datensouveränität technisch und rechtlich absichert."
      : "What data sovereignty means, what rights you have and how SOVEREIGN 2030 as an autonomous Life-OS technically and legally secures your personal data sovereignty.",
    alternates: {
      canonical: `${BASE_URL}/${locale}/souveraenitaet`,
    },
    openGraph: {
      title: "Datensouveränität 2030 | SOVEREIGN",
      description: "Vollständiger Guide: Datensouveränität verstehen, durchsetzen und mit SOVEREIGN automatisieren.",
      url: `${BASE_URL}/${locale}/souveraenitaet`,
    },
  };
}

export default async function SoveraenitaetPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "Article",
      "@id": `${BASE_URL}/${locale}/souveraenitaet#article`,
      headline: "Datensouveränität 2030: Grundlagen, Rechte & SOVEREIGN Strategie",
      description: "Was Datensouveränität bedeutet, welche Rechte du hast und wie SOVEREIGN 2030 als autonomes Life-OS deine persönliche Datensouveränität technisch und rechtlich absichert.",
      author: { "@type": "Organization", name: "SOVEREIGN 2030", url: BASE_URL },
      publisher: {
        "@type": "Organization",
        name: "SOVEREIGN 2030",
        logo: { "@type": "ImageObject", url: `${BASE_URL}/logo.svg` },
      },
      datePublished: "2026-03-01",
      dateModified: "2026-04-04",
      inLanguage: locale,
      url: `${BASE_URL}/${locale}/souveraenitaet`,
      mainEntityOfPage: `${BASE_URL}/${locale}/souveraenitaet`,
      about: [
        { "@type": "Thing", name: "Datensouveränität" },
        { "@type": "Thing", name: "DSGVO" },
        { "@type": "Thing", name: "EU AI Act" },
        { "@type": "Thing", name: "Digitale Autonomie" },
      ],
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "SOVEREIGN 2030", item: `${BASE_URL}/${locale}` },
        { "@type": "ListItem", position: 2, name: "Datensouveränität", item: `${BASE_URL}/${locale}/souveraenitaet` },
      ],
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "Was ist Datensouveränität?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Datensouveränität bezeichnet das Recht und die Fähigkeit von Individuen, vollständige Kontrolle über ihre persönlichen Daten zu haben — einschließlich Erhebung, Verarbeitung, Weitergabe und Löschung. In der EU ist dieses Recht durch die DSGVO (Datenschutz-Grundverordnung) und den EU AI Act kodifiziert.",
          },
        },
        {
          "@type": "Question",
          name: "Welche Rechte habe ich bezüglich meiner Daten?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Laut DSGVO hast du das Recht auf Auskunft (Art. 15), Berichtigung (Art. 16), Löschung ('Recht auf Vergessenwerden', Art. 17), Einschränkung der Verarbeitung (Art. 18), Datenübertragbarkeit (Art. 20) und Widerspruch (Art. 21). SOVEREIGN automatisiert die Durchsetzung dieser Rechte.",
          },
        },
      ],
    },
  ];

  return (
    <>
      <JsonLd data={jsonLd} />
      <div style={{ background: "#080E1A", minHeight: "100vh" }}>
        
        <PremiumBanner
          type="sovereignty"
          imagePath="/assets/nexus/sovereignty.png"
          tag="Core Pillar · Personal Independence · Life-OS"
          title="Souveränität"
          subtitle="Datensouveränität ist kein technisches Konzept — es ist eine Machtfrage. Werde zum Herr deiner eigenen digitalen Zukunft."
        />

        <article className="max-w-4xl mx-auto px-6 py-20">

          {/* Table of Contents */}
          <nav
            aria-label="Inhaltsverzeichnis"
            style={{
              border: "1px solid rgba(255,255,255,0.07)",
              padding: "1.5rem 2rem",
              marginBottom: "3rem",
              background: "rgba(255,255,255,0.02)",
            }}
          >
            <div
              style={{
                fontFamily: "var(--font-jetbrains, monospace)",
                fontSize: "0.6rem",
                letterSpacing: "0.15em",
                color: "rgba(255,255,255,0.25)",
                marginBottom: "1rem",
                textTransform: "uppercase",
              }}
            >
              Inhaltsverzeichnis
            </div>
            <ol style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 8 }}>
              {[
                "Was ist Datensouveränität?",
                "Warum ist Datensouveränität 2026 entscheidend?",
                "Deine DSGVO-Rechte — vollständig erklärt",
                "Der EU AI Act und was er für dich bedeutet",
                "Die 3 Ebenen digitaler Souveränität",
                "Wie SOVEREIGN Datensouveränität technisch umsetzt",
                "Praktische Schritte: So wirst du sovereign",
                "Häufige Fragen zur Datensouveränität",
              ].map((item, i) => (
                <li key={i}>
                  <a
                    href={`#section-${i + 1}`}
                    className="nexus-hover-cyan"
                    style={{
                      display: "flex",
                      gap: "0.75rem",
                      fontFamily: "var(--font-space-grotesk, sans-serif)",
                      fontSize: "0.88rem",
                      color: "rgba(255,255,255,0.5)",
                      textDecoration: "none",
                      transition: "color 0.2s",
                    }}
                  >
                    <span style={{ fontFamily: "var(--font-jetbrains, monospace)", fontSize: "0.62rem", color: "rgba(0,212,255,0.4)", marginTop: 3 }}>
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    {item}
                  </a>
                </li>
              ))}
            </ol>
          </nav>

          {/* Article body */}
          <div
            style={{
              fontFamily: "var(--font-inter, sans-serif)",
              fontSize: "1rem",
              lineHeight: 1.85,
              color: "rgba(255,255,255,0.65)",
            }}
          >
            <Section id="section-1" title="Was ist Datensouveränität?">
              <p>
                <strong style={{ color: "rgba(255,255,255,0.85)", fontFamily: "var(--font-space-grotesk, sans-serif)" }}>
                  Datensouveränität
                </strong>{" "}
                bezeichnet die vollständige Kontrolle eines Individuums über die eigenen personenbezogenen Daten —
                von der Erhebung über die Verarbeitung bis zur Weitergabe und Löschung. Es geht um mehr als
                Datenschutz: Datensouveränität bedeutet, dass du nicht nur das Recht hast, &quot;Nein&quot; zu sagen,
                sondern auch die technischen Werkzeuge besitzt, dieses Nein durchzusetzen.
              </p>
              <p>
                Im Jahr 2026 ist Datensouveränität keine abstrakte philosophische Idee mehr. Die Europäische Union
                hat mit der DSGVO (2018) und dem EU AI Act (vollständige Anwendung ab 2026) einen rechtlichen Rahmen
                geschaffen, der jedem EU-Bürger konkrete, einklagbare Rechte gibt. Gleichzeitig sind die wirtschaftlichen
                Interessen der Gegenseite — Versicherungen, Telekommunikationsanbieter, Plattformen, Finanzdienstleister
                — massiver als je zuvor.
              </p>
              <KeyInsight>
                Datensouveränität ist keine Frage des Datenschutzbewusstseins. Es ist eine Machtfrage: Wer hat
                Zugang zu deinen Daten, und wer profitiert davon?
              </KeyInsight>
              <p>
                Drei Dimensionen bilden das Fundament der Datensouveränität:
              </p>
              <ul style={{ paddingLeft: "1.5rem", display: "flex", flexDirection: "column", gap: "0.75rem", marginTop: "1rem" }}>
                <li><strong style={{ color: "rgba(255,255,255,0.85)" }}>Informationelle Selbstbestimmung:</strong> Das Grundrecht (Art. 2 Abs. 1 GG), selbst über die Preisgabe und Verwendung eigener Daten zu bestimmen — durch das Bundesverfassungsgericht 1983 im Volkszählungsurteil begründet.</li>
                <li><strong style={{ color: "rgba(255,255,255,0.85)" }}>Technologische Souveränität:</strong> Der Zugang zu den technischen Werkzeugen, die Kontrolle praktisch umsetzbar machen — nicht nur theoretisch.</li>
                <li><strong style={{ color: "rgba(255,255,255,0.85)" }}>Ökonomische Souveränität:</strong> Das Recht und die Fähigkeit, vom Wert der eigenen Daten zu profitieren — anstatt Rohstofflieferant für Plattformkonzerne zu sein.</li>
              </ul>
            </Section>

            <Section id="section-2" title="Warum ist Datensouveränität 2026 entscheidend?">
              <p>
                Die Digitalisierung aller Lebensbereiche hat die Datenmacht auf ein beispielloses Niveau getrieben.
                2026 werden täglich mehr als 2,5 Exabyte an Daten erzeugt — ein Großteil davon von Privatpersonen,
                die für ihre Datenerzeugung nicht entschädigt werden, während Unternehmen mit diesen Daten Milliarden erwirtschaften.
              </p>
              <p>
                Konkret: Wenn dein Stromversorger eine Preiserhöhung ankündigt, hat er durch historische Nutzungsdaten
                und Machine-Learning-Modelle präzise berechnet, wie wahrscheinlich du wechselst, bei welchem Preis du
                bleibst, und welche Kundensegmente profitable sind. Du hast dagegen: Einen 4-seitigen Brief in Klein
                gedruckt und sechs Wochen Zeit.
              </p>
              <StatBlock items={[
                { stat: "94%", desc: "der deutschen Verbraucher kennen die genauen Bedingungen ihrer laufenden Verträge nicht" },
                { stat: "€2.400", desc: "beträgt der durchschnittliche Verlust pro Person pro Jahr durch unbemerkte Klauseln, Preiserhöhungen und optimierbare Verträge" },
                { stat: "73%", desc: "der KI-basierten Entscheidungen, die Konsumenten betreffen, sind für diese nicht transparent oder nachvollziehbar" },
              ]} />
              <p>
                Der EU AI Act adressiert dieses Machtgefälle explizit: Systeme, die Individuen in ihren Rechten oder
                wirtschaftlichen Möglichkeiten signifikant beeinflussen können, unterliegen ab 2026 strengen
                Transparenz- und Erklärungspflichten. Das betrifft Kreditscoring, Versicherungseinstufungen,
                Preisoptimierungsalgorithmen — also genau die Systeme, die täglich Entscheidungen über dein Leben treffen.
              </p>
            </Section>

            <Section id="section-3" title="Deine DSGVO-Rechte — vollständig erklärt">
              <p>
                Die DSGVO gibt dir acht konkrete Rechte gegenüber jedem Unternehmen, das deine personenbezogenen
                Daten verarbeitet. Diese Rechte existieren nicht nur auf dem Papier — sie sind einklagbar und bei
                Verletzung mit Bußgeldern bis zu 4% des weltweiten Jahresumsatzes sanktioniert.
              </p>
              <RightsTable rights={[
                { art: "Art. 15", right: "Auskunftsrecht", desc: "Du hast das Recht zu erfahren, welche Daten ein Unternehmen über dich gespeichert hat, woher sie stammen, zu welchem Zweck sie verarbeitet werden und an wen sie weitergegeben wurden." },
                { art: "Art. 16", right: "Recht auf Berichtigung", desc: "Unrichtige personenbezogene Daten müssen auf Antrag unverzüglich berichtigt werden. Unvollständige Daten sind zu vervollständigen." },
                { art: "Art. 17", right: "Recht auf Löschung", desc: "Das 'Recht auf Vergessenwerden' — du kannst die Löschung deiner Daten verlangen, wenn sie für den ursprünglichen Zweck nicht mehr benötigt werden oder du deine Einwilligung widerrufst." },
                { art: "Art. 18", right: "Recht auf Einschränkung", desc: "Verarbeitung kann auf Speicherung beschränkt werden, während Streitigkeiten über Richtigkeit oder Rechtmäßigkeit der Verarbeitung geklärt werden." },
                { art: "Art. 20", right: "Recht auf Datenübertragbarkeit", desc: "Du hast das Recht, deine Daten in einem strukturierten, maschinenlesbaren Format zu erhalten und an einen anderen Anbieter zu übertragen." },
                { art: "Art. 21", right: "Widerspruchsrecht", desc: "Du kannst der Verarbeitung deiner Daten für Direktwerbung, Profiling und in bestimmten anderen Fällen jederzeit widersprechen." },
              ]} />
              <p>
                <strong style={{ color: "rgba(255,255,255,0.85)" }}>Das Problem in der Praxis:</strong> Die meisten
                Verbraucher wissen theoretisch, dass diese Rechte existieren. Sie nutzen sie nicht, weil der Prozess
                mühsam ist — richtiger Ansprechpartner, korrekte Formulierung, Fristen, Nachverfolgung. Hier setzt
                SOVEREIGN an: Der Privacy Guardian automatisiert die Durchsetzung dieser Rechte vollständig.
              </p>
            </Section>

            <Section id="section-4" title="Der EU AI Act und was er für dich bedeutet">
              <p>
                Der EU AI Act (Verordnung (EU) 2024/1689) ist seit August 2024 in Kraft und wird schrittweise bis
                2026 vollständig angewendet. Er ist das weltweit erste umfassende KI-Regulierungswerk und hat
                weitreichende Auswirkungen auf alle KI-Systeme, die EU-Bürger betreffen — unabhängig davon, wo das
                Unternehmen sitzt.
              </p>
              <p>
                Für Verbraucher besonders relevant sind die <strong style={{ color: "rgba(255,255,255,0.85)" }}>Transparenzpflichten</strong> gegenüber
                sogenannten hochrisikoreichen KI-Systemen. Dazu gehören:
              </p>
              <ul style={{ paddingLeft: "1.5rem", display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                <li>KI-Systeme für Kreditscoring und Bonitätsbewertung (z.B. Schufa-Score)</li>
                <li>KI-gestützte Versicherungstarife und Risikoklassifikation</li>
                <li>Algorithmenbasierte Preisgestaltung für Verbraucher</li>
                <li>Automatisierte Entscheidungen über Beschäftigung und Kreditvergabe</li>
              </ul>
              <p>
                Ab 2026 haben EU-Bürger das Recht auf <strong style={{ color: "rgba(255,255,255,0.85)" }}>Erklärungen zu algorithmischen Entscheidungen</strong>,
                die sie wesentlich betreffen. Unternehmen müssen KI-Systeme registrieren, Risikobewertungen
                durchführen und auf Anfrage erklären können, wie eine Entscheidung zustande kam.
              </p>
              <KeyInsight>
                SOVEREIGN ist als Low-Risk KI-System mit vollständiger Transparency-Compliance klassifiziert. Jede
                KI-Aktion des Sovereign Twin ist im Audit Trail dokumentiert, erklärbar und nachvollziehbar — by design.
              </KeyInsight>
            </Section>

            <Section id="section-5" title="Die 3 Ebenen digitaler Souveränität">
              <p>
                Echte digitale Souveränität existiert auf drei aufeinander aufbauenden Ebenen. Wer nur auf einer
                Ebene agiert, bleibt angreifbar.
              </p>
              {[
                {
                  level: "Ebene 1: Datensouveränität",
                  desc: "Die Kontrolle über deine persönlichen Daten — was erhoben wird, wie lange gespeichert wird, wer Zugriff hat und wofür sie verwendet werden. Fundament: DSGVO-Rechte, Privacy-Einstellungen, Auskunftsersuchen. SOVEREIGN implementiert: AgentMemory (isolierte Datenhaltung) + Privacy Guardian (Consent Layer).",
                },
                {
                  level: "Ebene 2: Entscheidungssouveränität",
                  desc: "Die Kontrolle darüber, welche Algorithmen und KI-Systeme Entscheidungen über dich treffen und wie diese Entscheidungen zustande kommen. Fundament: EU AI Act Transparenzrechte, DSGVO Art. 22 (keine vollautomatisierten Entscheidungen). SOVEREIGN implementiert: Execution Center (HITL/HOTL) + Audit Trail.",
                },
                {
                  level: "Ebene 3: Ökonomische Souveränität",
                  desc: "Die Fähigkeit, deine eigenen Daten und Rechte aktiv für deine wirtschaftlichen Interessen einzusetzen — anstatt passiv als Datenproduzent zu fungieren. Fundament: PSD2-Banking-Rechte, Vertragskündigungsrechte, aktive Marktpositionierung. SOVEREIGN implementiert: Finance Guardian + automatische Vertragsoptimierung.",
                },
              ].map((l, i) => (
                <div
                  key={i}
                  style={{
                    border: "1px solid rgba(255,255,255,0.07)",
                    padding: "1.5rem",
                    marginBottom: "1rem",
                    background: "rgba(255,255,255,0.01)",
                  }}
                >
                  <div style={{ fontFamily: "var(--font-space-grotesk, sans-serif)", fontWeight: 700, fontSize: "1rem", color: "rgba(0,212,255,0.85)", marginBottom: "0.75rem" }}>
                    {l.level}
                  </div>
                  <p style={{ margin: 0, fontSize: "0.9rem", lineHeight: 1.75, color: "rgba(255,255,255,0.55)" }}>{l.desc}</p>
                </div>
              ))}
            </Section>

            <Section id="section-6" title="Wie SOVEREIGN Datensouveränität technisch umsetzt">
              <p>
                SOVEREIGN 2030 ist nicht nur ein Datenschutz-Tool — es ist eine vollständige Architektur für
                persönliche Datensouveränität. Die vier Schichten des APEX-Systems arbeiten zusammen, um alle
                drei Ebenen der Souveränität technisch abzusichern:
              </p>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1rem", margin: "1.5rem 0" }}>
                {[
                  { layer: "01 — AgentMemory", desc: "Dein persönliches Data Warehouse. Alle Vertrags-, Finanz- und Identitätsdaten in einer EU-gehosteten, isolierten Kapsel. Zero Third-Party-Sharing ohne explizite Freigabe.", href: "/architektur#agentmemory" },
                  { layer: "02 — Privacy Guardian", desc: "Der physische Consent-Layer. Jeder API-Call wird gegen deine Boundary Conditions geprüft. KI-Aktionen ohne Genehmigung sind architektonisch unmöglich.", href: "/architektur#privacy-guardian" },
                  { layer: "03 — Execution Center", desc: "HITL/HOTL Engine. Du definierst für jede Aktionskategorie, ob der Twin dich fragt oder autonom handelt. Volle Kontrolle, maximale Effizienz.", href: "/architektur#execution-center" },
                  { layer: "04 — Audit Trail", desc: "100% Transparenz-Layer. Jede Aktion des Twins — dokumentiert, zeitgestempelt, unveränderlich. Compliance als Architektur, nicht als Nachgedanke.", href: "/architektur#audit-trail" },
                ].map((l, i) => (
                  <Link key={i} href={`/${locale}${l.href}`} style={{ textDecoration: "none" }}>
                    <div
                      className="nexus-card"
                      style={{
                        padding: "1.25rem",
                        transition: "border-color 0.2s, background 0.2s",
                        cursor: "pointer",
                      }}
                    >
                      <div style={{ fontFamily: "var(--font-space-grotesk, sans-serif)", fontWeight: 700, fontSize: "0.9rem", color: "rgba(0,212,255,0.8)", marginBottom: "0.5rem" }}>{l.layer}</div>
                      <p style={{ margin: 0, fontSize: "0.85rem", lineHeight: 1.65, color: "rgba(255,255,255,0.45)" }}>{l.desc}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </Section>

            <Section id="section-7" title="Praktische Schritte: So wirst du sovereign">
              <p>
                Datensouveränität ist kein Endzustand — es ist ein kontinuierlicher Prozess. Mit SOVEREIGN 2030
                automatisierst du diesen Prozess. Ohne SOVEREIGN sind es manuelle Schritte:
              </p>
              <ol style={{ paddingLeft: "1.5rem", display: "flex", flexDirection: "column", gap: "1rem" }}>
                {[
                  { step: "DSGVO-Auskunft stellen", desc: "Fordere von allen Unternehmen, die deine Daten verarbeiten, eine Auskunft nach Art. 15 DSGVO an. Starte mit deinen Hauptvertragspartnern (Telekommunikation, Versicherung, Bank)." },
                  { step: "Einwilligungen prüfen und widerrufen", desc: "Überprüfe alle erteilten Einwilligungen zur Datenweitergabe. Widerrufe alle nicht notwendigen Einwilligungen — insbesondere Marketing-Cookies und Datenweitergabe an Dritte." },
                  { step: "Vertragsportfolio auflisten", desc: "Erstelle eine vollständige Liste aller laufenden Verträge, Abonnements und Dauerschuldverhältnisse. Prüfe Fristen und Preiserhöhungsklauseln." },
                  { step: "Banking-Analyse aktivieren", desc: "Nutze PSD2-Banking (z.B. via SOVEREIGN Finance Guardian), um alle laufenden Zahlungen zu analysieren und versteckte Kosten zu identifizieren." },
                  { step: "Automatisierung einrichten", desc: "Mit SOVEREIGN: Boundary Conditions definieren, HITL/HOTL-Modus pro Kategorie einstellen, Privacy Guardian konfigurieren. Der Twin erledigt den Rest." },
                ].map((s, i) => (
                  <li key={i}>
                    <strong style={{ color: "rgba(255,255,255,0.85)", fontFamily: "var(--font-space-grotesk, sans-serif)" }}>
                      Schritt {i + 1}: {s.step}
                    </strong>
                    <br />
                    {s.desc}
                  </li>
                ))}
              </ol>
            </Section>

            <Section id="section-8" title="Häufige Fragen zur Datensouveränität">
              {[
                {
                  q: "Kann ich Datensouveränität vollständig ohne technische Werkzeuge erreichen?",
                  a: "Theoretisch ja — die DSGVO-Rechte stehen jedem zu. Praktisch nein: Der manuelle Aufwand für vollständige Datenkontrolle übersteigt die zeitlichen Kapazitäten fast aller Privatpersonen. SOVEREIGN automatisiert diesen Aufwand auf nahezu null.",
                },
                {
                  q: "Was ist der Unterschied zwischen Datenschutz und Datensouveränität?",
                  a: "Datenschutz ist reaktiv: Er verhindert unbefugte Datenverarbeitung. Datensouveränität ist aktiv: Sie gibt dir die Werkzeuge, deine Datenrechte proaktiv durchzusetzen, deine Daten zu nutzen und von ihrem Wert zu profitieren.",
                },
                {
                  q: "Ist Datensouveränität nur für technisch versierte Menschen?",
                  a: "Mit SOVEREIGN 2030 nicht mehr. Die gesamte Komplexität — Auskunftsersuchen, Widersprüche, Vertragsanalyse, Datenlöschungsanfragen — wird durch den Sovereign Twin automatisiert. Du definierst die Regeln in verständlicher Sprache, der Twin führt sie aus.",
                },
              ].map((faq, i) => (
                <div key={i} style={{ marginBottom: "2rem" }}>
                  <h3
                    style={{
                      fontFamily: "var(--font-space-grotesk, sans-serif)",
                      fontWeight: 700,
                      fontSize: "1.05rem",
                      color: "rgba(255,255,255,0.85)",
                      marginBottom: "0.75rem",
                    }}
                  >
                    {faq.q}
                  </h3>
                  <p style={{ margin: 0 }}>{faq.a}</p>
                </div>
              ))}
            </Section>
          </div>

          {/* Internal links — Pillar navigation */}
          <nav
            aria-label="Weiterführende Themen"
            style={{
              borderTop: "1px solid rgba(255,255,255,0.07)",
              paddingTop: "3rem",
              marginTop: "4rem",
            }}
          >
            <div
              style={{
                fontFamily: "var(--font-jetbrains, monospace)",
                fontSize: "0.6rem",
                letterSpacing: "0.15em",
                color: "rgba(255,255,255,0.2)",
                textTransform: "uppercase",
                marginBottom: "1.5rem",
              }}
            >
              Verwandte Themen
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-0" style={{ border: "1px solid rgba(255,255,255,0.07)" }}>
              {[
                { title: "APEX Architektur", desc: "Wie die 4 Schichten zusammenwirken", href: `/${locale}/architektur`, tag: "TECHNOLOGIE" },
                { title: "Datenschutz & EU AI Act", desc: "Was der EU AI Act für dich bedeutet", href: `/${locale}/sicherheit`, tag: "RECHT" },
                { title: "Vertrag kündigen", desc: "Der ultimative Guide 2026", href: `/${locale}/blog/vertrag-kuendigen`, tag: "VERTRAGSRECHT" },
              ].map((link, i) => (
                <Link
                  key={i}
                  href={link.href}
                  style={{ textDecoration: "none" }}
                >
                  <div
                    className="flex flex-col p-6 transition-all duration-200 nexus-footer-card"
                    style={{
                      borderRight: i < 2 ? "1px solid rgba(255,255,255,0.07)" : "none",
                    }}
                  >
                    <span
                      style={{
                        fontFamily: "var(--font-jetbrains, monospace)",
                        fontSize: "0.55rem",
                        color: "rgba(0,212,255,0.5)",
                        letterSpacing: "0.1em",
                        marginBottom: "0.5rem",
                        display: "block",
                      }}
                    >
                      {link.tag}
                    </span>
                    <span
                      style={{
                        fontFamily: "var(--font-space-grotesk, sans-serif)",
                        fontWeight: 700,
                        fontSize: "0.95rem",
                        color: "rgba(255,255,255,0.85)",
                        display: "block",
                        marginBottom: "0.25rem",
                      }}
                    >
                      {link.title}
                    </span>
                    <span
                      style={{
                        fontSize: "0.82rem",
                        color: "rgba(255,255,255,0.35)",
                      }}
                    >
                      {link.desc}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </nav>

          {/* CTA */}
          <div
            style={{
              marginTop: "4rem",
              border: "1px solid rgba(0,212,255,0.25)",
              padding: "2.5rem",
              background: "rgba(0,212,255,0.03)",
              textAlign: "center",
            }}
          >
            <p
              style={{
                fontFamily: "var(--font-jetbrains, monospace)",
                fontSize: "0.62rem",
                letterSpacing: "0.15em",
                color: "rgba(0,212,255,0.6)",
                textTransform: "uppercase",
                marginBottom: "1rem",
              }}
            >
              Jetzt sovereign werden
            </p>
            <h2
              style={{
                fontFamily: "var(--font-space-grotesk, sans-serif)",
                fontWeight: 800,
                fontSize: "1.8rem",
                color: "rgba(255,255,255,0.95)",
                marginBottom: "1rem",
                letterSpacing: "-0.02em",
              }}
            >
              SOVEREIGN 2030 automatisiert<br />deine Datensouveränität.
            </h2>
            <p
              style={{
                fontSize: "0.95rem",
                color: "rgba(255,255,255,0.45)",
                marginBottom: "2rem",
                maxWidth: 480,
                margin: "0 auto 2rem",
              }}
            >
              Privacy Guardian, Execution Center, Audit Trail — alles was du in diesem Guide gelesen hast,
              vollständig automatisiert. Starte kostenlos.
            </p>
            <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
              <Link href="/dashboard" className="lp-btn-primary">
                Kostenlos starten →
              </Link>
              <Link href={`/${locale}/architektur`} className="lp-btn-secondary">
                Architektur verstehen
              </Link>
            </div>
          </div>
        </article>
      </div>
    </>
  );
}

// ── Sub-components (server-side, no "use client" needed) ──────────────────

function Section({ id, title, children }: { id: string; title: string; children: React.ReactNode }) {
  return (
    <section id={id} style={{ marginBottom: "3.5rem" }}>
      <h2
        style={{
          fontFamily: "var(--font-space-grotesk, sans-serif)",
          fontWeight: 800,
          fontSize: "1.5rem",
          color: "rgba(255,255,255,0.92)",
          letterSpacing: "-0.02em",
          marginBottom: "1.25rem",
          borderLeft: "3px solid rgba(0,212,255,0.6)",
          paddingLeft: "1rem",
        }}
      >
        {title}
      </h2>
      {children}
    </section>
  );
}

function KeyInsight({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="nexus-card"
      style={{
        padding: "1.25rem 1.5rem",
        margin: "1.5rem 0",
        fontSize: "0.95rem",
        lineHeight: 1.75,
        color: "rgba(255,255,255,0.7)",
        fontStyle: "italic",
        display: "flex",
        gap: "1rem",
        alignItems: "flex-start",
      }}
    >
      <NexusIcon type="sovereignty" size={24} />
      {children}
    </div>
  );
}

function StatBlock({ items }: { items: { stat: string; desc: string }[] }) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
        gap: "1px",
        background: "rgba(255,255,255,0.07)",
        border: "1px solid rgba(255,255,255,0.07)",
        margin: "1.5rem 0",
      }}
    >
      {items.map((item, i) => (
        <div
          key={i}
          style={{ background: "#080E1A", padding: "1.5rem", textAlign: "center" }}
        >
          <div
            style={{
              fontFamily: "var(--font-space-grotesk, sans-serif)",
              fontWeight: 800,
              fontSize: "2.2rem",
              color: "rgba(0,212,255,0.9)",
              marginBottom: "0.5rem",
            }}
          >
            {item.stat}
          </div>
          <p style={{ margin: 0, fontSize: "0.82rem", lineHeight: 1.5, color: "rgba(255,255,255,0.4)" }}>
            {item.desc}
          </p>
        </div>
      ))}
    </div>
  );
}

function RightsTable({ rights }: { rights: { art: string; right: string; desc: string }[] }) {
  return (
    <div style={{ border: "1px solid rgba(255,255,255,0.07)", margin: "1.5rem 0", overflow: "hidden" }}>
      {rights.map((r, i) => (
        <div
          key={i}
          style={{
            display: "grid",
            gridTemplateColumns: "80px 160px 1fr",
            gap: 0,
            borderBottom: i < rights.length - 1 ? "1px solid rgba(255,255,255,0.05)" : "none",
          }}
        >
          <div style={{ padding: "1rem", borderRight: "1px solid rgba(255,255,255,0.05)", fontFamily: "var(--font-jetbrains, monospace)", fontSize: "0.65rem", color: "rgba(0,212,255,0.5)", display: "flex", alignItems: "center" }}>
            {r.art}
          </div>
          <div style={{ padding: "1rem", borderRight: "1px solid rgba(255,255,255,0.05)", fontFamily: "var(--font-space-grotesk, sans-serif)", fontWeight: 700, fontSize: "0.85rem", color: "rgba(255,255,255,0.8)", display: "flex", alignItems: "center" }}>
            {r.right}
          </div>
          <div style={{ padding: "1rem", fontSize: "0.82rem", lineHeight: 1.6, color: "rgba(255,255,255,0.45)", display: "flex", alignItems: "center" }}>
            {r.desc}
          </div>
        </div>
      ))}
    </div>
  );
}
