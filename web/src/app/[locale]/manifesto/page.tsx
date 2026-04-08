// src/app/[locale]/manifesto/page.tsx
// ═══════════════════════════════════════════════════════════════
// SOVEREIGN MANIFESTO — Philosophisch · Emotional · Visionär
// Blueprint Dark / Server Component / ~1500 Wörter
// ═══════════════════════════════════════════════════════════════
import type { Metadata } from "next";
import Link from "next/link";
import Navigation from "@/components/landing/Navigation";
import Footer from "@/components/landing/Footer";
import Breadcrumb from "@/components/ui/Breadcrumb";

const BASE_URL = "https://sovereign.de";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return {
    title: "Das Manifest | SOVEREIGN 2030 — Digitale Souveränität als Menschenrecht",
    description:
      "Wir glauben, dass jeder Mensch das Recht hat, sein digitales Leben zu kontrollieren. Das ist das Sovereign-Manifest — ein Aufruf zur digitalen Selbstbestimmung.",
    alternates: { canonical: `${BASE_URL}/${locale}/manifesto` },
    openGraph: {
      title: "Das Manifest | SOVEREIGN 2030",
      description: "Wir glauben, dass jeder Mensch das Recht hat, sein digitales Leben zu kontrollieren.",
      url: `${BASE_URL}/${locale}/manifesto`,
      siteName: "SOVEREIGN 2030",
      images: [{ url: `${BASE_URL}/og/manifesto.png`, width: 1200, height: 630, alt: "SOVEREIGN Manifest" }],
      locale: locale === "de" ? "de_DE" : "en_US",
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title: "Das Manifest | SOVEREIGN 2030",
      description: "Ein Aufruf zur digitalen Selbstbestimmung.",
      images: [`${BASE_URL}/og/manifesto.png`],
    },
  };
}

const CHAPTERS = [
  {
    number: "01",
    title: "Das Ende der digitalen Naivität",
    body: `Es begann mit dem Versprechen der Freiheit.

Das Internet sollte eine Agora sein — ein offener Marktplatz der Ideen, der Kommunikation, des Handels. Keine Gatekeeper. Keine Hierarchien. Nur Menschen, die miteinander sprechen.

Wir haben dieses Versprechen geglaubt. Wir haben unsere E-Mails auf fremde Server gelegt. Wir haben unsere Gesundheitsdaten Apps anvertraut. Wir haben unsere Gedanken in Plattformen gegossen, die wir nie besitzen werden. Wir haben ein Haus auf gemietetem Land gebaut — und erst jetzt begreifen wir: Der Vermieter entscheidet.

Das ist das Ende der digitalen Naivität. Und es ist gleichzeitig ihr Anfang.`,
  },
  {
    number: "02",
    title: "Was wir verloren haben — ohne es zu merken",
    body: `Du kennst das Gefühl, wenn du morgens dein Telefon aufnimmst und es bereits mehr über dich weiß als deine engsten Freunde.

Nicht weil du es so wolltest. Sondern weil Hunderte von Algorithmen Tausende deiner Entscheidungen beobachtet, gewichtet und katalogisiert haben — um dich besser steuern zu können. Nicht für dich. Für Werbekunden. Für Datenhändler. Für Systeme, deren Ziel es ist, deine Aufmerksamkeit zu monetarisieren.

Wir haben in den letzten zwanzig Jahren eine stille Transaktion akzeptiert: Unsere Daten gegen Bequemlichkeit. Unsere Privatsphäre gegen kostenlose Dienste. Unsere Autonomie gegen nahtlose Erfahrungen.

Niemand hat uns gefragt. Wir haben einfach auf "Akzeptieren" geklickt.

Was wir dabei verloren haben, ist schwer zu quantifizieren — weil es sich in tausend kleinen Momenten abgespielt hat. Eine Versicherungsprämie die steigt, weil eine App deinen Schlaf tracked. Ein Kredit der abgelehnt wird, weil ein Algorithmus dein Kaufverhalten falsch interpretiert. Eine Werbung die erscheint, bevor du noch gewusst hast, dass du etwas brauchst.

Das ist nicht Zufall. Das ist Design.`,
  },
  {
    number: "03",
    title: "Souveränität ist kein Luxus",
    body: `Es gibt eine gefährliche Erzählung: Wer sich um Datenschutz sorgt, hat etwas zu verbergen.

Diese Erzählung ist falsch. Und sie ist absichtlich falsch.

Privatsphäre ist nicht das Privileg derer, die etwas zu verstecken haben. Sie ist die Grundlage jeder freien Gesellschaft. Ohne Privatsphäre gibt es keine authentische Meinungsbildung. Ohne Kontrolle über die eigenen Daten gibt es keine echte Entscheidungsfreiheit. Ohne digitale Souveränität gibt es im 21. Jahrhundert keine Souveränität.

Die Infrastrukturen unseres digitalen Lebens werden von einigen wenigen Unternehmen kontrolliert — Unternehmen mit Sitzen in Ländern, die andere Rechtstraditionen, andere Werte, andere Interessen haben als Europa. Diese Abhängigkeit ist kein technisches Problem. Sie ist ein politisches. Ein kulturelles. Ein menschliches.

Souveränität ist kein Luxus für Techniker. Es ist ein Recht aller.`,
  },
  {
    number: "04",
    title: "Das KI-Zeitalter: Befreiung oder neue Kontrolle?",
    body: `Künstliche Intelligenz ist die größte Hebelkraft der Menschheitsgeschichte.

Sie kann Krankheiten diagnostizieren, die Ärzte übersehen. Sie kann Verträge prüfen, die Anwälte Stunden kosten würden. Sie kann Finanzentscheidungen analysieren, die das Leben verändern. Sie kann übersetzen, erklären, verbinden, schützen.

Aber diese Macht ist gerade in den Händen weniger konzentriert. Wer die KI-Infrastruktur kontrolliert, kontrolliert die Realität, in der wir uns bewegen. Die Frage ist nicht: Wird KI unser Leben verändern? Sie verändert es bereits. Die Frage ist: Wessen Interessen dient die KI, die dein Leben formt?

Eine KI die für dich arbeitet, ist Emanzipation. Eine KI die über dich entscheidet — ohne dein Wissen, ohne deine Kontrolle, ohne dein Einverständnis — ist die subtilste Form der Unterdrückung, die die Geschichte je gesehen hat.

Wir müssen diese Unterscheidung kennen. Wir müssen für sie kämpfen.`,
  },
  {
    number: "05",
    title: "Wer wir sind — und was wir wollen",
    body: `SOVEREIGN 2030 ist kein Unternehmen im herkömmlichen Sinne.

Wir sind eine Mission. Eine Antwort auf eine Frage, die sich für uns nie gestellt hat, ob sie gestellt werden muss — sondern nur, wann und wie.

Wir glauben, dass jeder Mensch das Recht hat:

Zu wissen, welche Daten über ihn existieren — und sie zu kontrollieren.

KI als Werkzeug zu nutzen — nicht als Black Box, die über ihn urteilt.

Verträge zu verstehen, bevor er sie unterschreibt. Preise anzufechten, wenn sie ungerecht sind. Behörden zu begegnen auf Augenhöhe. Steuern zu optimieren mit demselben Wissen wie Konzerne. Finanzentscheidungen zu treffen mit professioneller Analyse.

Das ist kein futuristisches Szenario. Das ist das Versprechen des digitalen Zeitalters — das bisher nur für wenige eingelöst wurde.

Wir wollen es für alle einlösen.`,
  },
  {
    number: "06",
    title: "Das Sovereign OS — eine andere Architektur",
    body: `Die meisten Softwareprodukte sind um das Unternehmen herum gebaut.

Ihre Architektur optimiert auf: Retention. Engagement. Monetarisierung. Datenwachstum. Nutzerabhängigkeit.

Das Sovereign OS ist um dich herum gebaut.

Jedes Modul — von Privacy Guardian zu Sovereign Twin, von Security Senate zu Finanzautonomie — folgt einem einzigen Prinzip: Wissen und Macht gehören dem Nutzer. Nicht der Plattform.

Das bedeutet: Keine Dark Patterns. Kein verstecktes Tracking. Keine Abhängigkeiten, die dich halten, wenn du gehen willst. Keine Algorithmen, die deine Schwächen ausnutzen. Vollständiger Audit Trail. Echte Datenkontrolle. Europäische Server. Europäisches Recht.

Das ist technisch möglich. Es war immer möglich. Es wurde nur nie priorisiert.

Wir priorisieren es.`,
  },
  {
    number: "07",
    title: "2030 — was wir aufbauen",
    body: `Bis 2030 wird sich entscheiden, in welche Richtung die digitale Zivilisation geht.

Entweder eine Welt, in der KI-Systeme opak, zentralisiert und unkontrollierbar sind. In der digitale Identitäten Konzernbesitz sind. In der Daten mehr Macht haben als Stimmen. In der die Kluft zwischen digital Versierten und allen anderen zur größten sozialen Bruchlinie wird.

Oder eine andere Welt. Eine, in der Technologie emanzipiert. In der jeder Mensch ein digitales Souveränitätsniveau hat, das früher nur Konzernen vorbehalten war. In der KI-Systeme transparent, erklärbar und kontrollierbar sind. In der Datenschutz der Standard ist, nicht die Ausnahme. In der digitale Kompetenz eine Grundvoraussetzung ist, auf die man Anspruch hat — nicht ein Privileg das man sich verdienen muss.

Das SOVEREIGN 2030 Projekt existiert, weil wir die zweite Welt wählen.

Nicht als Utopie. Als Architekturentscheidung.`,
  },
  {
    number: "08",
    title: "Der Aufruf",
    body: `Du liest das, weil etwas in dir widerklingt.

Vielleicht bist du Unternehmer, der gerade eine DSGVO-Anfrage ignoriert hat — nicht aus Böswilligkeit, sondern aus Unwissen. Vielleicht bist du Freiberufler, der einen Vertrag unterschrieben hat, den er nicht vollständig verstand. Vielleicht bist du Elternteil, das sich fragt, welche Spuren seine Kinder im digitalen Raum hinterlassen.

Vielleicht bist du einfach jemand, der müde ist.

Müde davon, das Spiel nach Regeln zu spielen, die andere aufgestellt haben. Müde davon, zu akzeptieren statt zu verstehen. Müde davon, Ressourcen — Zeit, Geld, Aufmerksamkeit — an Systeme abzugeben, die dir nichts zurückgeben.

Das ist der Moment. Nicht irgendwann. Jetzt.

Souveränität beginnt mit einer Entscheidung: Ich will wissen. Ich will verstehen. Ich will kontrollieren, was mein ist.

SOVEREIGN 2030 ist das Werkzeug. Aber die Entscheidung — die triffst nur du.

Willkommen in der Bewegung.`,
  },
];

export default async function ManifestoPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  return (
    <div style={{ background: "#080E1A", minHeight: "100vh" }}>
      <Navigation />
      <Breadcrumb locale={locale} items={[{ label: "Das Manifest" }]} />

      {/* ── HERO ─────────────────────────────────────────────── */}
      <section
        style={{
          position: "relative",
          paddingTop: "160px",
          paddingBottom: "120px",
          textAlign: "center",
          overflow: "hidden",
          borderBottom: "1px solid rgba(255,255,255,0.05)",
        }}
      >
        {/* Blueprint grid */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />
        {/* Radial glow */}
        <div
          style={{
            position: "absolute",
            top: "30%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 700,
            height: 700,
            background: "radial-gradient(ellipse, rgba(0,212,255,0.05) 0%, transparent 65%)",
            pointerEvents: "none",
          }}
        />

        <div style={{ position: "relative", zIndex: 1, padding: "0 24px" }}>
          {/* Label */}
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              border: "1px solid rgba(0,212,255,0.15)",
              padding: "6px 18px",
              marginBottom: 32,
              fontFamily: "var(--font-jetbrains, monospace)",
              fontSize: "0.58rem",
              letterSpacing: "0.2em",
              color: "rgba(0,212,255,0.6)",
              textTransform: "uppercase",
            }}
          >
            Das Manifest · SOVEREIGN 2030
          </div>

          <h1
            style={{
              fontFamily: "var(--font-space-grotesk, sans-serif)",
              fontWeight: 900,
              fontSize: "clamp(3rem, 8vw, 7rem)",
              lineHeight: 0.95,
              letterSpacing: "-0.035em",
              color: "#F0F4FF",
              marginBottom: 32,
            }}
          >
            Digitale{" "}
            <span
              style={{
                color: "#00D4FF",
                display: "block",
              }}
            >
              Souveränität
            </span>
            <span
              style={{
                color: "rgba(255,255,255,0.2)",
                fontSize: "0.65em",
                fontWeight: 300,
                letterSpacing: "-0.01em",
              }}
            >
              als Menschenrecht
            </span>
          </h1>

          <p
            style={{
              fontSize: "1.15rem",
              lineHeight: 1.7,
              color: "rgba(255,255,255,0.4)",
              maxWidth: 560,
              margin: "0 auto 48px",
            }}
          >
            Ein Aufruf zur digitalen Selbstbestimmung. Acht Kapitel. Eine Überzeugung.
          </p>

          {/* Publication meta */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 24,
              flexWrap: "wrap",
            }}
          >
            {[
              { label: "Version", value: "2.0" },
              { label: "Erschienen", value: "April 2025" },
              { label: "Kapitel", value: "8" },
              { label: "Lesezeit", value: "~8 Min" },
            ].map((m) => (
              <div
                key={m.label}
                style={{
                  fontFamily: "var(--font-jetbrains, monospace)",
                  fontSize: "0.62rem",
                  letterSpacing: "0.1em",
                  color: "rgba(255,255,255,0.25)",
                  textTransform: "uppercase",
                }}
              >
                <span style={{ color: "rgba(0,212,255,0.6)" }}>{m.value}</span>{" "}
                {m.label}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CHAPTER INDEX ────────────────────────────────────── */}
      <div
        style={{
          maxWidth: 720,
          margin: "0 auto",
          padding: "64px 24px 0",
        }}
      >
        <div
          style={{
            border: "1px solid rgba(255,255,255,0.06)",
            background: "rgba(255,255,255,0.01)",
            padding: "28px 32px",
            marginBottom: 80,
          }}
        >
          <p
            style={{
              fontFamily: "var(--font-jetbrains, monospace)",
              fontSize: "0.55rem",
              letterSpacing: "0.18em",
              color: "rgba(255,255,255,0.2)",
              textTransform: "uppercase",
              marginBottom: 20,
            }}
          >
            Inhalt
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {CHAPTERS.map((ch) => (
              <a
                key={ch.number}
                href={`#chapter-${ch.number}`}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 16,
                  textDecoration: "none",
                  padding: "8px 0",
                  borderBottom: "1px solid rgba(255,255,255,0.04)",
                }}
              >
                <span
                  style={{
                    fontFamily: "var(--font-jetbrains, monospace)",
                    fontSize: "0.6rem",
                    letterSpacing: "0.08em",
                    color: "rgba(0,212,255,0.4)",
                    minWidth: 28,
                  }}
                >
                  {ch.number}
                </span>
                <span
                  style={{
                    fontFamily: "var(--font-space-grotesk, sans-serif)",
                    fontSize: "0.9rem",
                    color: "rgba(255,255,255,0.55)",
                  }}
                >
                  {ch.title}
                </span>
              </a>
            ))}
          </div>
        </div>

        {/* ── CHAPTERS ─────────────────────────────────────── */}
        {CHAPTERS.map((ch, idx) => (
          <article
            key={ch.number}
            id={`chapter-${ch.number}`}
            style={{
              marginBottom: 80,
              paddingBottom: 80,
              borderBottom: idx < CHAPTERS.length - 1 ? "1px solid rgba(255,255,255,0.05)" : "none",
            }}
          >
            {/* Chapter header */}
            <div style={{ marginBottom: 32 }}>
              <div
                style={{
                  fontFamily: "var(--font-jetbrains, monospace)",
                  fontSize: "0.55rem",
                  letterSpacing: "0.2em",
                  color: "rgba(0,212,255,0.35)",
                  textTransform: "uppercase",
                  marginBottom: 12,
                }}
              >
                Kapitel {ch.number}
              </div>
              <h2
                style={{
                  fontFamily: "var(--font-space-grotesk, sans-serif)",
                  fontWeight: 800,
                  fontSize: "clamp(1.6rem, 4vw, 2.4rem)",
                  color: "#F0F4FF",
                  letterSpacing: "-0.02em",
                  lineHeight: 1.15,
                }}
              >
                {ch.title}
              </h2>
            </div>

            {/* Chapter body */}
            <div
              style={{
                fontSize: "1.05rem",
                lineHeight: 1.85,
                color: "rgba(255,255,255,0.6)",
                fontFamily: "var(--font-space-grotesk, sans-serif)",
              }}
            >
              {ch.body.split("\n\n").map((paragraph, pIdx) => {
                // Check if it's a highlighted list item (starts with specific text)
                if (
                  paragraph.startsWith("Zu wissen") ||
                  paragraph.startsWith("KI als Werkzeug") ||
                  paragraph.startsWith("Verträge zu verstehen") ||
                  paragraph.startsWith("Preise anzufechten") ||
                  paragraph.startsWith("Behörden zu begegnen") ||
                  paragraph.startsWith("Steuern zu optimieren") ||
                  paragraph.startsWith("Finanzentscheidungen zu treffen")
                ) {
                  return (
                    <div
                      key={pIdx}
                      style={{
                        padding: "12px 20px",
                        borderLeft: "2px solid rgba(0,212,255,0.3)",
                        background: "rgba(0,212,255,0.03)",
                        marginBottom: 8,
                        color: "rgba(255,255,255,0.75)",
                      }}
                    >
                      {paragraph}
                    </div>
                  );
                }
                return (
                  <p key={pIdx} style={{ marginBottom: "1.6rem" }}>
                    {paragraph}
                  </p>
                );
              })}
            </div>
          </article>
        ))}

        {/* ── FINAL SIGNATURE ──────────────────────────────── */}
        <div
          style={{
            textAlign: "center",
            padding: "60px 0 100px",
          }}
        >
          <div
            style={{
              display: "inline-flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 16,
            }}
          >
            {/* Sovereign logo mark */}
            <div
              style={{
                width: 48,
                height: 48,
                border: "1.5px solid rgba(0,212,255,0.3)",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <div
                style={{
                  width: 14,
                  height: 14,
                  background: "#00D4FF",
                  borderRadius: "50%",
                  boxShadow: "0 0 14px rgba(0,212,255,0.7)",
                }}
              />
            </div>

            <div
              style={{
                fontFamily: "var(--font-space-grotesk, sans-serif)",
                fontWeight: 800,
                fontSize: "1rem",
                letterSpacing: "0.1em",
                color: "rgba(255,255,255,0.7)",
                textTransform: "uppercase",
              }}
            >
              SOVEREIGN 2030
            </div>

            <div
              style={{
                fontFamily: "var(--font-jetbrains, monospace)",
                fontSize: "0.62rem",
                letterSpacing: "0.12em",
                color: "rgba(255,255,255,0.25)",
                textTransform: "uppercase",
              }}
            >
              Digitale Souveränität · Europa · 2025–2030
            </div>

            {/* Divider */}
            <div
              style={{
                width: 80,
                height: 1,
                background: "rgba(0,212,255,0.2)",
                margin: "8px 0",
              }}
            />

            <p
              style={{
                fontSize: "0.9rem",
                color: "rgba(255,255,255,0.3)",
                fontStyle: "italic",
                maxWidth: 360,
                lineHeight: 1.6,
              }}
            >
              "Kontrolle ist keine Eigenschaft von Systemen. Sie ist eine Entscheidung von Menschen."
            </p>
          </div>
        </div>
      </div>

      {/* ── CTA ──────────────────────────────────────────────── */}
      <section
        style={{
          background: "#0A1220",
          borderTop: "1px solid rgba(255,255,255,0.05)",
          padding: "80px 24px",
          textAlign: "center",
        }}
      >
        <div style={{ maxWidth: 600, margin: "0 auto" }}>
          <h2
            style={{
              fontFamily: "var(--font-space-grotesk, sans-serif)",
              fontWeight: 900,
              fontSize: "clamp(1.8rem, 4vw, 2.8rem)",
              color: "#F0F4FF",
              letterSpacing: "-0.02em",
              marginBottom: 16,
            }}
          >
            Bereit für{" "}
            <span style={{ color: "#00D4FF" }}>Souveränität</span>?
          </h2>
          <p
            style={{
              fontSize: "1rem",
              color: "rgba(255,255,255,0.4)",
              lineHeight: 1.7,
              marginBottom: 40,
            }}
          >
            Das OS das deine digitale Autonomie zurückgibt. Entdecke die Module.
          </p>
          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            <Link
              href={`/${locale}/module`}
              style={{
                fontFamily: "var(--font-space-grotesk, sans-serif)",
                fontWeight: 700,
                fontSize: "0.85rem",
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                color: "#080E1A",
                background: "#00D4FF",
                padding: "14px 32px",
                textDecoration: "none",
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
              }}
            >
              Module entdecken →
            </Link>
            <Link
              href={`/${locale}/eu-regulierung`}
              style={{
                fontFamily: "var(--font-space-grotesk, sans-serif)",
                fontWeight: 700,
                fontSize: "0.85rem",
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                color: "rgba(255,255,255,0.5)",
                border: "1px solid rgba(255,255,255,0.12)",
                padding: "14px 32px",
                textDecoration: "none",
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
              }}
            >
              EU-Regulierung verstehen
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
