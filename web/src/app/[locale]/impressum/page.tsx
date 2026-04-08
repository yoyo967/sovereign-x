// src/app/[locale]/impressum/page.tsx
// German legal requirement — Impressum (Imprint)
import type { Metadata } from "next";
import Link from "next/link";
import Navigation from "@/components/landing/Navigation";
import Footer from "@/components/landing/Footer";

export const metadata: Metadata = {
  title: "Impressum | SOVEREIGN 2030",
  description: "Impressum und rechtliche Angaben gemäß § 5 TMG.",
  robots: { index: false, follow: false },
};

export default async function ImpressumPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  return (
    <div style={{ background: "#080E1A", minHeight: "100vh" }}>
      <Navigation />

      <main
        style={{
          maxWidth: 720,
          margin: "0 auto",
          padding: "140px 24px 120px",
        }}
      >
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
          <Link href={`/${locale}`} style={{ color: "rgba(255,255,255,0.2)", textDecoration: "none" }}>
            SOVEREIGN 2030
          </Link>
          <span>/</span>
          <span style={{ color: "rgba(0,212,255,0.6)" }}>IMPRESSUM</span>
        </div>

        <h1
          style={{
            fontFamily: "var(--font-space-grotesk, sans-serif)",
            fontWeight: 900,
            fontSize: "clamp(2rem, 5vw, 3.5rem)",
            color: "#F0F4FF",
            letterSpacing: "-0.025em",
            marginBottom: 48,
          }}
        >
          Impressum
        </h1>

        {/* Legal content */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 40,
            color: "rgba(255,255,255,0.6)",
            fontSize: "0.95rem",
            lineHeight: 1.8,
          }}
        >
          <section>
            <h2
              style={{
                fontFamily: "var(--font-jetbrains, monospace)",
                fontSize: "0.6rem",
                letterSpacing: "0.18em",
                color: "rgba(0,212,255,0.5)",
                textTransform: "uppercase",
                marginBottom: 16,
              }}
            >
              Angaben gemäß § 5 TMG
            </h2>
            <p>
              <strong style={{ color: "rgba(255,255,255,0.85)" }}>SOVEREIGN 2030 GmbH</strong><br />
              Musterstraße 1<br />
              10115 Berlin<br />
              Deutschland
            </p>
          </section>

          <section>
            <h2
              style={{
                fontFamily: "var(--font-jetbrains, monospace)",
                fontSize: "0.6rem",
                letterSpacing: "0.18em",
                color: "rgba(255,255,255,0.2)",
                textTransform: "uppercase",
                marginBottom: 16,
              }}
            >
              Kontakt
            </h2>
            <p>
              E-Mail: <a href="mailto:legal@sovereign2030.de" style={{ color: "#00D4FF", textDecoration: "none" }}>legal@sovereign2030.de</a><br />
              Web: sovereign2030.de
            </p>
          </section>

          <section>
            <h2
              style={{
                fontFamily: "var(--font-jetbrains, monospace)",
                fontSize: "0.6rem",
                letterSpacing: "0.18em",
                color: "rgba(255,255,255,0.2)",
                textTransform: "uppercase",
                marginBottom: 16,
              }}
            >
              Vertreten durch
            </h2>
            <p>Geschäftsführer: [Name des Geschäftsführers]</p>
          </section>

          <section>
            <h2
              style={{
                fontFamily: "var(--font-jetbrains, monospace)",
                fontSize: "0.6rem",
                letterSpacing: "0.18em",
                color: "rgba(255,255,255,0.2)",
                textTransform: "uppercase",
                marginBottom: 16,
              }}
            >
              Registereintrag
            </h2>
            <p>
              Eintragung im Handelsregister.<br />
              Registergericht: Amtsgericht Berlin-Charlottenburg<br />
              Registernummer: HRB [Nummer]
            </p>
          </section>

          <section>
            <h2
              style={{
                fontFamily: "var(--font-jetbrains, monospace)",
                fontSize: "0.6rem",
                letterSpacing: "0.18em",
                color: "rgba(255,255,255,0.2)",
                textTransform: "uppercase",
                marginBottom: 16,
              }}
            >
              Umsatzsteuer-ID
            </h2>
            <p>
              Umsatzsteuer-Identifikationsnummer gemäß § 27a UStG:<br />
              DE [USt-IdNr.]
            </p>
          </section>

          <section>
            <h2
              style={{
                fontFamily: "var(--font-jetbrains, monospace)",
                fontSize: "0.6rem",
                letterSpacing: "0.18em",
                color: "rgba(255,255,255,0.2)",
                textTransform: "uppercase",
                marginBottom: 16,
              }}
            >
              Haftung für Inhalte
            </h2>
            <p>
              Als Diensteanbieter sind wir gemäß § 7 Abs.1 TMG für eigene Inhalte auf diesen Seiten nach den allgemeinen Gesetzen verantwortlich. Nach §§ 8 bis 10 TMG sind wir als Diensteanbieter jedoch nicht verpflichtet, übermittelte oder gespeicherte fremde Informationen zu überwachen oder nach Umständen zu forschen, die auf eine rechtswidrige Tätigkeit hinweisen.
            </p>
            <p style={{ marginTop: 12 }}>
              Verpflichtungen zur Entfernung oder Sperrung der Nutzung von Informationen nach den allgemeinen Gesetzen bleiben hiervon unberührt. Eine diesbezügliche Haftung ist jedoch erst ab dem Zeitpunkt der Kenntnis einer konkreten Rechtsverletzung möglich. Bei Bekanntwerden von entsprechenden Rechtsverletzungen werden wir diese Inhalte umgehend entfernen.
            </p>
          </section>

          <section>
            <h2
              style={{
                fontFamily: "var(--font-jetbrains, monospace)",
                fontSize: "0.6rem",
                letterSpacing: "0.18em",
                color: "rgba(255,255,255,0.2)",
                textTransform: "uppercase",
                marginBottom: 16,
              }}
            >
              Haftung für Links
            </h2>
            <p>
              Unser Angebot enthält Links zu externen Websites Dritter, auf deren Inhalte wir keinen Einfluss haben. Deshalb können wir für diese fremden Inhalte auch keine Gewähr übernehmen. Für die Inhalte der verlinkten Seiten ist stets der jeweilige Anbieter oder Betreiber der Seiten verantwortlich.
            </p>
          </section>

          <section>
            <h2
              style={{
                fontFamily: "var(--font-jetbrains, monospace)",
                fontSize: "0.6rem",
                letterSpacing: "0.18em",
                color: "rgba(255,255,255,0.2)",
                textTransform: "uppercase",
                marginBottom: 16,
              }}
            >
              Urheberrecht
            </h2>
            <p>
              Die durch die Seitenbetreiber erstellten Inhalte und Werke auf diesen Seiten unterliegen dem deutschen Urheberrecht. Die Vervielfältigung, Bearbeitung, Verbreitung und jede Art der Verwertung außerhalb der Grenzen des Urheberrechtes bedürfen der schriftlichen Zustimmung des jeweiligen Autors bzw. Erstellers.
            </p>
          </section>

          <div
            style={{
              borderTop: "1px solid rgba(255,255,255,0.05)",
              paddingTop: 24,
              fontFamily: "var(--font-jetbrains, monospace)",
              fontSize: "0.6rem",
              letterSpacing: "0.08em",
              color: "rgba(255,255,255,0.15)",
            }}
          >
            Stand: April 2025 · SOVEREIGN 2030 GmbH · Berlin, Deutschland
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
