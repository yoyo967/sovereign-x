// src/app/[locale]/datenschutz/page.tsx
// Datenschutzerklärung gemäß DSGVO
import type { Metadata } from "next";
import Link from "next/link";
import Navigation from "@/components/landing/Navigation";
import Footer from "@/components/landing/Footer";

export const metadata: Metadata = {
  title: "Datenschutzerklärung | SOVEREIGN 2030",
  description: "Datenschutzerklärung gemäß DSGVO — wie SOVEREIGN 2030 deine Daten schützt.",
  robots: { index: false, follow: false },
};

const SECTIONS = [
  {
    title: "1. Datenschutz auf einen Blick",
    content: `Die folgenden Hinweise geben einen einfachen Überblick darüber, was mit deinen personenbezogenen Daten passiert, wenn du unsere Website besuchst. Personenbezogene Daten sind alle Daten, mit denen du persönlich identifiziert werden kannst.`,
  },
  {
    title: "2. Verantwortliche Stelle",
    content: `Verantwortlich für die Datenverarbeitung auf dieser Website ist:\n\nSOVEREIGN 2030 GmbH\nMusterstraße 1\n10115 Berlin\n\nE-Mail: datenschutz@sovereign2030.de`,
  },
  {
    title: "3. Welche Daten wir erheben",
    content: `Wenn du unsere Website besuchst, erheben wir automatisch technische Informationen: IP-Adresse (anonymisiert), Browser-Typ und -Version, Betriebssystem, Referrer-URL, Uhrzeit des Zugriffs.\n\nBei der Registrierung erheben wir: E-Mail-Adresse, gewähltes Passwort (verschlüsselt gespeichert), optional: Name.\n\nBei der Nutzung des Dashboards: Vertragsbestandteile, die du hochlädst (verschlüsselt gespeichert, kein Zugriff durch uns), Anfragen an den Sovereign Twin (anonymisiert verarbeitet).`,
  },
  {
    title: "4. Zweck der Datenverarbeitung",
    content: `Wir verarbeiten deine Daten ausschließlich für folgende Zwecke:\n\n• Bereitstellung und Optimierung unserer Dienste\n• Sicherstellung des technischen Betriebs\n• Erfüllung gesetzlicher Pflichten\n• Kommunikation mit dir auf deine Anfrage hin\n\nWir verkaufen keine personenbezogenen Daten an Dritte. Niemals.`,
  },
  {
    title: "5. Rechtsgrundlage der Verarbeitung",
    content: `Die Verarbeitung erfolgt auf Basis von Art. 6 DSGVO:\n\n• Art. 6 Abs. 1 lit. a: Einwilligung\n• Art. 6 Abs. 1 lit. b: Vertragserfüllung\n• Art. 6 Abs. 1 lit. c: Gesetzliche Verpflichtung\n• Art. 6 Abs. 1 lit. f: Berechtigte Interessen`,
  },
  {
    title: "6. Deine Rechte (Art. 15–22 DSGVO)",
    content: `Du hast jederzeit das Recht auf:\n\n• Auskunft über deine gespeicherten Daten (Art. 15)\n• Berichtigung unrichtiger Daten (Art. 16)\n• Löschung deiner Daten (Art. 17)\n• Einschränkung der Verarbeitung (Art. 18)\n• Datenübertragbarkeit (Art. 20)\n• Widerspruch gegen die Verarbeitung (Art. 21)\n\nUm diese Rechte auszuüben, wende dich an: datenschutz@sovereign2030.de\n\nDu hast außerdem das Recht, dich bei der zuständigen Datenschutzbehörde zu beschweren. Zuständige Behörde für Berlin ist der Berliner Beauftragte für Datenschutz und Informationsfreiheit.`,
  },
  {
    title: "7. Datenspeicherung und -sicherheit",
    content: `Alle Daten werden ausschließlich auf Servern in der Europäischen Union gespeichert (Region: Frankfurt, Deutschland). Wir verwenden End-to-End-Verschlüsselung für alle sensiblen Inhalte. Zugangsdaten werden mit bcrypt gehasht und niemals im Klartext gespeichert.\n\nWir halten uns an den Stand der Technik gemäß Art. 32 DSGVO.`,
  },
  {
    title: "8. Cookies und Tracking",
    content: `Wir setzen ausschließlich technisch notwendige Cookies ein (Session-Token für das Dashboard). Wir nutzen kein Google Analytics, keine Facebook Pixel, keine Third-Party-Tracker.\n\nDer einzige externe Dienst ist Firebase Authentication (Google LLC) für die Anmeldung — mit EU-Serverstandort konfiguriert.`,
  },
  {
    title: "9. Drittdienste",
    content: `Firebase Authentication (Google LLC) — für sichere Anmeldung. Google verarbeitet dabei ausschließlich die E-Mail-Adresse zum Zweck der Authentifizierung. Datenschutzerklärung: policies.google.com/privacy\n\nKeine weiteren Drittdienste mit Zugang zu deinen Daten.`,
  },
  {
    title: "10. Änderungen dieser Erklärung",
    content: `Wir behalten uns vor, diese Datenschutzerklärung anzupassen, wenn sich die Rechtslage oder unser Dienst wesentlich ändert. Die aktuelle Version ist immer unter sovereign2030.de/datenschutz abrufbar.`,
  },
];

export default async function DatenschutzPage({
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
          <span style={{ color: "rgba(0,212,255,0.6)" }}>DATENSCHUTZ</span>
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
          Datenschutzerklärung
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
          Gemäß DSGVO · Stand: April 2025
        </p>

        {/* Sovereign promise banner */}
        <div
          style={{
            border: "1px solid rgba(0,212,255,0.15)",
            background: "rgba(0,212,255,0.03)",
            padding: "20px 24px",
            marginBottom: 56,
            display: "flex",
            gap: 16,
            alignItems: "flex-start",
          }}
        >
          <span style={{ fontSize: "1.2rem", flexShrink: 0 }}>🛡️</span>
          <div>
            <div
              style={{
                fontFamily: "var(--font-space-grotesk, sans-serif)",
                fontWeight: 700,
                fontSize: "0.9rem",
                color: "rgba(0,212,255,0.9)",
                marginBottom: 6,
              }}
            >
              Das Sovereign-Versprechen
            </div>
            <p style={{ fontSize: "0.85rem", color: "rgba(255,255,255,0.5)", lineHeight: 1.6 }}>
              Wir bauen eine Plattform für digitale Souveränität — und das beginnt bei uns selbst. Kein Tracking, kein Datenverkauf, kein Dark-Pattern-Consent. Privacy by Design ist keine Compliance-Checkbox für uns, sondern Architekturprinzip.
            </p>
          </div>
        </div>

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
          <Link href={`/${locale}/agb`} style={{ color: "rgba(0,212,255,0.6)", fontSize: "0.85rem", textDecoration: "none" }}>
            AGB →
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}
