import type { Metadata } from "next";
import Link from "next/link";
import JsonLd from "@/components/SEO/JsonLd";
import Navigation from "@/components/landing/Navigation";
import Footer from "@/components/landing/Footer";
import Breadcrumb from "@/components/ui/Breadcrumb";
import DsgvoAuskunftGenerator from "@/components/use-cases/DsgvoAuskunftGenerator";

const BASE_URL = "https://sovereign.de";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return {
    title: "DSGVO Auskunft & Löschung | Art. 15, 17, 20 | Sovereign 2030",
    description:
      "Fordere kostenlos deine Daten von Meta, Google, Amazon, SCHUFA & Co. zurück. Rechtssicherer Generator nach Art. 15 DSGVO — in 60 Sekunden.",
    alternates: { canonical: `${BASE_URL}/${locale}/use-cases/datenschutz` },
    openGraph: {
      title: "DSGVO Auskunft-Generator | Sovereign 2030",
      description: "Deine Daten. Dein Recht. Antrag nach Art. 15 DSGVO in 60 Sekunden.",
      url: `${BASE_URL}/${locale}/use-cases/datenschutz`,
      siteName: "Sovereign 2030",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: "DSGVO Auskunft-Generator | Sovereign 2030",
      description: "Fordere deine Daten von Konzernen zurück — Art. 15, 17, 20 DSGVO.",
    },
  };
}

export default async function DatenschutzPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: "DSGVO Auskunft anfordern mit Sovereign 2030",
    description: "Rechtssicherer Antrag nach Art. 15, 17 und 20 DSGVO — automatisiert und fristenüberwacht.",
    step: [
      { "@type": "HowToStep", name: "Identität angeben", text: "Gib deinen Namen, Adresse und optionale Identifikationsmerkmale an." },
      { "@type": "HowToStep", name: "Unternehmen wählen", text: "Wähle aus 9 vordefinierten Konzernen oder gib ein beliebiges Unternehmen manuell ein." },
      { "@type": "HowToStep", name: "Antragstyp festlegen", text: "Auskunft (Art. 15), Löschung (Art. 17), Datenübertragbarkeit (Art. 20) oder Kombi-Antrag." },
      { "@type": "HowToStep", name: "Brief kopieren oder versenden", text: "Brief sofort kopieren oder automatisch über SOVEREIGN mit Fristenüberwachung versenden." },
    ],
  };

  const STATS = [
    { value: "30 Tage", label: "Antwortfrist (Art. 12 DSGVO)" },
    { value: "9+", label: "Vordefinierte Konzerne" },
    { value: "Art. 77", label: "Beschwerderecht bei Behörden" },
    { value: "100%", label: "Kostenlos & rechtssicher" },
  ];

  const RECHTE = [
    {
      art: "Art. 15",
      titel: "Auskunftsrecht",
      desc: "Erfahre, welche Daten ein Unternehmen über dich speichert, zu welchem Zweck und wie lange.",
      farbe: "#00D4FF",
    },
    {
      art: "Art. 17",
      titel: "Recht auf Löschung",
      desc: "Verlange die vollständige Löschung aller personenbezogenen Daten — auch bei Auftragsverarbeitern.",
      farbe: "#BB86FC",
    },
    {
      art: "Art. 20",
      titel: "Datenübertragbarkeit",
      desc: "Lass dir deine Daten in einem maschinenlesbaren Format aushändigen — für den Wechsel zu Alternativen.",
      farbe: "#00E676",
    },
    {
      art: "Art. 77",
      titel: "Beschwerderecht",
      desc: "Bei Nichteinhaltung kannst du Beschwerde bei der zuständigen Datenschutzbehörde einlegen.",
      farbe: "#FFD600",
    },
  ];

  return (
    <div style={{ background: "#080E1A", minHeight: "100vh", color: "#F0F4FF" }}>
      <JsonLd data={jsonLd} />
      <Navigation />

      <main>
        {/* Breadcrumb */}
        <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "0 1.5rem" }}>
          <Breadcrumb
            locale={locale}
            items={[
              { label: "Use Cases", href: `/${locale}/use-cases` },
              { label: "DSGVO Auskunft" },
            ]}
          />
        </div>

        {/* Hero */}
        <section style={{
          maxWidth: "1100px", margin: "0 auto",
          padding: "3rem 1.5rem 5rem",
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "4rem",
          alignItems: "center",
        }}>
          <div>
            <div style={{
              display: "inline-flex", alignItems: "center", gap: "0.5rem",
              padding: "4px 14px",
              border: "1px solid rgba(0,212,255,0.25)",
              background: "rgba(0,212,255,0.05)",
              marginBottom: "1.5rem",
            }}>
              <span style={{
                fontFamily: "var(--font-jetbrains, monospace)",
                fontSize: "0.58rem", letterSpacing: "0.12em",
                color: "rgba(0,212,255,0.8)", textTransform: "uppercase",
              }}>
                Use Case · Privacy Guardian · DSGVO
              </span>
            </div>

            <h1 style={{
              fontFamily: "var(--font-space-grotesk, sans-serif)",
              fontWeight: 900, fontSize: "clamp(2rem, 4vw, 3rem)",
              letterSpacing: "-0.03em", lineHeight: 1.1,
              marginBottom: "1.25rem",
            }}>
              Deine Daten.{" "}
              <span style={{ color: "#00D4FF" }}>Dein Recht.</span>
              <br />Jetzt durchsetzen.
            </h1>

            <p style={{
              fontSize: "1.05rem", lineHeight: 1.7,
              color: "rgba(255,255,255,0.55)", marginBottom: "2rem", maxWidth: "520px",
            }}>
              Konzerne sammeln deine Daten — SOVEREIGN holt sie zurück. Erstelle in 60 Sekunden einen
              rechtssicheren Antrag nach Art. 15, 17 oder 20 DSGVO.
              Keine Formulare, keine Barrieren, keine Ausreden.
            </p>

            {/* Stats */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
              {STATS.map((stat) => (
                <div key={stat.label} style={{
                  padding: "1rem",
                  border: "1px solid rgba(255,255,255,0.06)",
                  background: "rgba(255,255,255,0.02)",
                }}>
                  <div style={{
                    fontFamily: "var(--font-jetbrains, monospace)",
                    fontWeight: 700, fontSize: "1.3rem", color: "#00D4FF",
                    marginBottom: "0.25rem",
                  }}>
                    {stat.value}
                  </div>
                  <div style={{ fontSize: "0.78rem", color: "rgba(255,255,255,0.4)" }}>
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Rights cards */}
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            {RECHTE.map((r) => (
              <div key={r.art} style={{
                display: "flex", gap: "1rem", alignItems: "flex-start",
                padding: "1rem 1.25rem",
                border: "1px solid rgba(255,255,255,0.06)",
                background: "rgba(255,255,255,0.02)",
              }}>
                <div style={{
                  fontFamily: "var(--font-jetbrains, monospace)",
                  fontSize: "0.6rem", fontWeight: 700,
                  color: r.farbe,
                  padding: "3px 8px",
                  border: `1px solid ${r.farbe}40`,
                  background: `${r.farbe}08`,
                  whiteSpace: "nowrap",
                  flexShrink: 0,
                  marginTop: "2px",
                }}>
                  {r.art}
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: "0.92rem", marginBottom: "0.2rem" }}>
                    {r.titel}
                  </div>
                  <div style={{ fontSize: "0.82rem", color: "rgba(255,255,255,0.45)", lineHeight: 1.55 }}>
                    {r.desc}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Generator */}
        <section style={{
          background: "rgba(0,0,0,0.25)",
          borderTop: "1px solid rgba(255,255,255,0.04)",
          borderBottom: "1px solid rgba(255,255,255,0.04)",
          padding: "5rem 0",
        }}>
          <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "0 1.5rem" }}>
            <div style={{ textAlign: "center", marginBottom: "3rem" }}>
              <p style={{
                fontFamily: "var(--font-jetbrains, monospace)",
                fontSize: "0.6rem", letterSpacing: "0.15em",
                color: "rgba(0,212,255,0.6)", textTransform: "uppercase",
                marginBottom: "0.75rem",
              }}>
                Interaktiver Generator
              </p>
              <h2 style={{
                fontFamily: "var(--font-space-grotesk, sans-serif)",
                fontWeight: 800, fontSize: "2rem", letterSpacing: "-0.02em",
                marginBottom: "0.75rem",
              }}>
                Antrag in 60 Sekunden
              </h2>
              <p style={{ color: "rgba(255,255,255,0.45)", fontSize: "0.95rem", maxWidth: "520px", margin: "0 auto" }}>
                Fülle das Formular aus — der Brief wird in Echtzeit generiert. Danach kopieren oder direkt über SOVEREIGN versenden.
              </p>
            </div>
            <DsgvoAuskunftGenerator />
          </div>
        </section>

        {/* Process steps */}
        <section style={{ maxWidth: "1100px", margin: "0 auto", padding: "5rem 1.5rem" }}>
          <h2 style={{
            fontFamily: "var(--font-space-grotesk, sans-serif)",
            fontWeight: 800, fontSize: "1.8rem", letterSpacing: "-0.02em",
            marginBottom: "2.5rem", textAlign: "center",
          }}>
            Was danach passiert
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "1.5rem" }}>
            {[
              { nr: "01", titel: "Antrag versendet", desc: "SOVEREIGN sendet den Antrag per E-Mail oder Einschreiben an den Verantwortlichen." },
              { nr: "02", titel: "Frist läuft", desc: "30-Tage-Countdown startet. Du wirst automatisch erinnert, wenn die Frist droht zu überschreiten." },
              { nr: "03", titel: "Antwort empfangen", desc: "Die erhaltene Auskunft wird in deinem AgentMemory verschlüsselt archiviert." },
              { nr: "04", titel: "Folgeaktion", desc: "Bei unvollständiger Antwort: automatischer Nachfassantrag oder Beschwerde bei der Behörde." },
            ].map((step) => (
              <div key={step.nr} style={{
                padding: "1.5rem",
                border: "1px solid rgba(255,255,255,0.06)",
                background: "rgba(255,255,255,0.02)",
              }}>
                <div style={{
                  fontFamily: "var(--font-jetbrains, monospace)",
                  fontSize: "0.6rem", color: "rgba(0,212,255,0.5)",
                  letterSpacing: "0.1em", marginBottom: "0.75rem",
                }}>
                  SCHRITT {step.nr}
                </div>
                <h3 style={{
                  fontFamily: "var(--font-space-grotesk, sans-serif)",
                  fontWeight: 700, fontSize: "1rem",
                  marginBottom: "0.5rem",
                }}>
                  {step.titel}
                </h3>
                <p style={{ fontSize: "0.82rem", color: "rgba(255,255,255,0.4)", lineHeight: 1.6, margin: 0 }}>
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section style={{
          background: "rgba(0,212,255,0.04)",
          borderTop: "1px solid rgba(0,212,255,0.1)",
          padding: "5rem 1.5rem",
          textAlign: "center",
        }}>
          <h2 style={{
            fontFamily: "var(--font-space-grotesk, sans-serif)",
            fontWeight: 900, fontSize: "2.2rem", letterSpacing: "-0.03em",
            marginBottom: "1rem",
          }}>
            SOVEREIGN übernimmt den Rest.
          </h2>
          <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "1rem", marginBottom: "2rem", maxWidth: "500px", margin: "0 auto 2rem" }}>
            Vom Versand bis zur Fristenüberwachung — dein Privacy Guardian handelt vollautomatisch, du behältst die Kontrolle.
          </p>
          <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
            <Link href={`/${locale}/dashboard`} style={{
              display: "inline-flex", alignItems: "center", gap: "0.5rem",
              padding: "0.9rem 2rem",
              background: "#00D4FF", color: "#080E1A",
              textDecoration: "none",
              fontFamily: "var(--font-space-grotesk, sans-serif)",
              fontWeight: 700, fontSize: "0.95rem",
            }}>
              Privacy Guardian aktivieren
            </Link>
            <Link href={`/${locale}/use-cases`} style={{
              display: "inline-flex", alignItems: "center", gap: "0.5rem",
              padding: "0.9rem 2rem",
              border: "1px solid rgba(255,255,255,0.15)", color: "rgba(255,255,255,0.7)",
              textDecoration: "none",
              fontFamily: "var(--font-space-grotesk, sans-serif)",
              fontWeight: 600, fontSize: "0.95rem",
            }}>
              Alle Use Cases ansehen
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
