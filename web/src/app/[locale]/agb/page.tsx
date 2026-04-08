// src/app/[locale]/agb/page.tsx
// Allgemeine Geschäftsbedingungen (Terms of Service)
import type { Metadata } from "next";
import Link from "next/link";
import Navigation from "@/components/landing/Navigation";
import Footer from "@/components/landing/Footer";

export const metadata: Metadata = {
  title: "AGB | Allgemeine Geschäftsbedingungen | SOVEREIGN 2030",
  description: "Allgemeine Geschäftsbedingungen der SOVEREIGN 2030 GmbH.",
  robots: { index: false, follow: false },
};

const SECTIONS = [
  {
    title: "§ 1 Geltungsbereich",
    content: `Diese Allgemeinen Geschäftsbedingungen (AGB) gelten für alle Verträge zwischen der SOVEREIGN 2030 GmbH (nachfolgend „Anbieter") und den Nutzern (nachfolgend „Nutzer") der Plattform sovereign2030.de.\n\nAbweichende Bedingungen des Nutzers werden nicht anerkannt, es sei denn, der Anbieter stimmt ihrer Geltung ausdrücklich schriftlich zu.`,
  },
  {
    title: "§ 2 Leistungsbeschreibung",
    content: `Der Anbieter stellt eine Software-as-a-Service-Plattform zur Verfügung, die folgende Kernfunktionen umfasst:\n\n• Sovereign Twin: Digitales Profil- und Datenmanagement\n• Privacy Guardian: DSGVO-Compliance-Automatisierung\n• Execution Center: Vertragsanalyse und -management\n• Security Senate: EU AI Act Compliance\n• Weitere Module gemäß aktuellem Leistungsangebot\n\nDer Anbieter ist berechtigt, das Leistungsangebot jederzeit zu erweitern, einzuschränken oder zu ändern, sofern dies dem Nutzer zumutbar ist.`,
  },
  {
    title: "§ 3 Registrierung und Nutzerkonto",
    content: `Die Nutzung der Plattform setzt eine Registrierung voraus. Der Nutzer versichert, dass die bei der Registrierung angegebenen Daten vollständig und korrekt sind.\n\nDer Nutzer ist verpflichtet, sein Passwort geheim zu halten und den Anbieter unverzüglich zu informieren, wenn ein Missbrauch seines Kontos festgestellt wird.\n\nDer Anbieter behält sich das Recht vor, Nutzerkonten zu sperren oder zu löschen, wenn ein Verstoß gegen diese AGB vorliegt.`,
  },
  {
    title: "§ 4 Nutzungsrechte",
    content: `Der Anbieter räumt dem Nutzer für die Dauer des Vertrags ein nicht-exklusives, nicht-übertragbares Recht zur Nutzung der Plattform für eigene Zwecke ein.\n\nDer Nutzer ist nicht berechtigt, die Software zu vervielfältigen, zu modifizieren, zu dekompilieren oder für Dritte zugänglich zu machen.`,
  },
  {
    title: "§ 5 Preise und Zahlung",
    content: `Die jeweils aktuellen Preise sind auf der Preisseite der Plattform (sovereign2030.de/de#pricing) einsehbar. Alle Preise verstehen sich zzgl. der gesetzlichen Mehrwertsteuer.\n\nKostenpflichtige Abonnements werden im Voraus für den jeweiligen Abrechnungszeitraum (monatlich oder jährlich) berechnet. Die Zahlung erfolgt per Kreditkarte oder SEPA-Lastschrift.\n\nIm FREE-Tarif entstehen keine Kosten, solange die angegebenen Nutzungslimits nicht überschritten werden.`,
  },
  {
    title: "§ 6 Kündigung",
    content: `Kostenpflichtige Abonnements können jederzeit zum Ende des aktuellen Abrechnungszeitraums gekündigt werden. Eine Kündigung kann direkt im Dashboard unter Einstellungen > Abonnement vorgenommen werden.\n\nDer Anbieter ist berechtigt, das Vertragsverhältnis aus wichtigem Grund fristlos zu kündigen, insbesondere bei schwerwiegenden Verstößen gegen diese AGB.\n\nBei Kündigung durch den Nutzer werden alle gespeicherten Daten nach einer Übergangsfrist von 30 Tagen unwiderruflich gelöscht.`,
  },
  {
    title: "§ 7 Datenschutz",
    content: `Die Verarbeitung personenbezogener Daten erfolgt gemäß unserer Datenschutzerklärung (sovereign2030.de/datenschutz) und den Bestimmungen der DSGVO.\n\nDer Nutzer ist alleiniger Eigentümer seiner Daten. Der Anbieter verarbeitet diese ausschließlich zur Erbringung der vertraglich vereinbarten Leistungen.`,
  },
  {
    title: "§ 8 Haftungsbeschränkung",
    content: `Der Anbieter haftet unbeschränkt für Schäden aus der Verletzung des Lebens, des Körpers oder der Gesundheit sowie für vorsätzlich oder grob fahrlässig verursachte Schäden.\n\nFür leicht fahrlässig verursachte Schäden haftet der Anbieter nur, wenn eine wesentliche Vertragspflicht verletzt wurde. In diesem Fall ist die Haftung auf den typischerweise vorhersehbaren Schaden begrenzt.\n\nEine weitergehende Haftung des Anbieters ist ausgeschlossen.`,
  },
  {
    title: "§ 9 Verfügbarkeit",
    content: `Der Anbieter strebt eine Verfügbarkeit der Plattform von 99,5% im Jahresdurchschnitt an. Ausgenommen sind geplante Wartungsarbeiten, die rechtzeitig angekündigt werden.\n\nEin Anspruch auf ständige Verfügbarkeit besteht nicht.`,
  },
  {
    title: "§ 10 Anwendbares Recht und Gerichtsstand",
    content: `Es gilt deutsches Recht unter Ausschluss des UN-Kaufrechts.\n\nGerichtsstand für alle Streitigkeiten aus diesem Vertrag ist Berlin, sofern der Nutzer Kaufmann, juristische Person des öffentlichen Rechts oder öffentlich-rechtliches Sondervermögen ist.\n\nVerbraucher können auch an ihrem allgemeinen Gerichtsstand klagen.`,
  },
  {
    title: "§ 11 Salvatorische Klausel",
    content: `Sollten einzelne Bestimmungen dieser AGB unwirksam sein oder werden, bleibt die Wirksamkeit der übrigen Bestimmungen unberührt. An die Stelle der unwirksamen Bestimmung tritt eine wirksame Regelung, die dem wirtschaftlichen Zweck der unwirksamen Bestimmung am nächsten kommt.`,
  },
];

export default async function AgbPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  return (
    <div style={{ background: "#080E1A", minHeight: "100vh" }}>
      <Navigation />

      <main style={{ maxWidth: 720, margin: "0 auto", padding: "140px 24px 120px" }}>
        {/* Breadcrumb */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            marginBottom: 48,
            fontFamily: "var(--font-jetbrains, monospace)",
            fontSize: "0.62rem",
            letterSpacing: "0.1em",
            color: "rgba(255,255,255,0.2)",
          }}
        >
          <Link href={`/${locale}`} style={{ color: "rgba(255,255,255,0.2)", textDecoration: "none" }}>SOVEREIGN 2030</Link>
          <span>/</span>
          <span style={{ color: "rgba(0,212,255,0.6)" }}>AGB</span>
        </div>

        <h1
          style={{
            fontFamily: "var(--font-space-grotesk, sans-serif)",
            fontWeight: 900,
            fontSize: "clamp(2rem, 5vw, 3.5rem)",
            color: "#F0F4FF",
            letterSpacing: "-0.025em",
            marginBottom: 16,
          }}
        >
          Allgemeine Geschäftsbedingungen
        </h1>

        <p
          style={{
            fontFamily: "var(--font-jetbrains, monospace)",
            fontSize: "0.62rem",
            letterSpacing: "0.08em",
            color: "rgba(255,255,255,0.2)",
            marginBottom: 56,
          }}
        >
          Stand: April 2025 · SOVEREIGN 2030 GmbH · Berlin
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: 48 }}>
          {SECTIONS.map((section) => (
            <section key={section.title}>
              <h2
                style={{
                  fontFamily: "var(--font-space-grotesk, sans-serif)",
                  fontWeight: 700,
                  fontSize: "1.05rem",
                  color: "rgba(255,255,255,0.85)",
                  marginBottom: 16,
                  letterSpacing: "-0.01em",
                }}
              >
                {section.title}
              </h2>
              <div
                style={{
                  fontSize: "0.92rem",
                  lineHeight: 1.8,
                  color: "rgba(255,255,255,0.5)",
                  whiteSpace: "pre-line",
                }}
              >
                {section.content}
              </div>
            </section>
          ))}
        </div>

        <div
          style={{
            borderTop: "1px solid rgba(255,255,255,0.05)",
            marginTop: 56,
            paddingTop: 24,
            display: "flex",
            gap: 24,
            flexWrap: "wrap",
          }}
        >
          <Link href={`/${locale}/impressum`} style={{ color: "rgba(0,212,255,0.6)", fontSize: "0.85rem", textDecoration: "none" }}>
            Impressum →
          </Link>
          <Link href={`/${locale}/datenschutz`} style={{ color: "rgba(0,212,255,0.6)", fontSize: "0.85rem", textDecoration: "none" }}>
            Datenschutz →
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}
