"use client";
// ═══════════════════════════════════════════════════════════════
// Preiserhöhung Widerspruch-Generator — Interactive Client Component
// ═══════════════════════════════════════════════════════════════

import React, { useState, useMemo } from "react";
import { Copy, Check, FileText, ChevronRight } from "lucide-react";

const ANBIETER_TYPEN = [
  { value: "strom", label: "Strom", gesetz: "§ 41 Abs. 3 EnWG", frist: "2 Wochen nach Ankündigung", sonder: true },
  { value: "gas", label: "Gas", gesetz: "§ 41 Abs. 3 EnWG", frist: "2 Wochen nach Ankündigung", sonder: true },
  { value: "mobilfunk", label: "Mobilfunk / Internet", gesetz: "§ 57 Abs. 1 TKG", frist: "3 Monate nach Ankündigung", sonder: true },
  { value: "versicherung", label: "Kfz-Versicherung", gesetz: "§ 40 VVG", frist: "1 Monat nach Beitragsanpassung", sonder: true },
  { value: "streaming", label: "Streaming-Abo", gesetz: "§ 314 BGB / AGB-Klausel", frist: "Im nächsten Abrechnungszeitraum", sonder: false },
  { value: "fitness", label: "Fitnessstudio", gesetz: "§ 314 BGB", frist: "Unverzüglich nach Kenntnis", sonder: false },
  { value: "sonstiges", label: "Sonstiges", gesetz: "§ 314 BGB allgemein", frist: "Unverzüglich nach Kenntnis", sonder: false },
];

function generateLetter({
  name,
  adresse,
  kundennummer,
  anbieter,
  anbieterTyp,
  erhöhung,
  ankuendigung,
  kuendigung,
}: {
  name: string;
  adresse: string;
  kundennummer: string;
  anbieter: string;
  anbieterTyp: (typeof ANBIETER_TYPEN)[0];
  erhöhung: string;
  ankuendigung: string;
  kuendigung: boolean;
}) {
  const today = new Date().toLocaleDateString("de-DE");
  const betreffBase = kuendigung
    ? `Widerspruch gegen Preiserhöhung und außerordentliche Kündigung gem. ${anbieterTyp.gesetz}`
    : `Widerspruch gegen Preiserhöhung gem. ${anbieterTyp.gesetz}`;

  const kuendigungText = kuendigung
    ? `\nGleichzeitig kündige ich hiermit den Vertrag außerordentlich und fristlos zum nächstmöglichen Termin, frühestens jedoch zum Datum des Wirksamwerdens der Preiserhöhung. Dies ist mein Recht gemäß ${anbieterTyp.gesetz}.`
    : "";

  return `${name}
${adresse}

An:
${anbieter}
[Adresse des Anbieters]

Betreff: ${betreffBase}
Kundennummer: ${kundennummer || "[Ihre Kundennummer]"}

${today}

Sehr geehrte Damen und Herren,

ich habe Ihre Mitteilung vom ${ankuendigung || "[Datum der Ankündigung]"} über eine Preiserhöhung von ${erhöhung || "X"}% erhalten.

Hiermit widerspreche ich dieser Preiserhöhung ausdrücklich und schriftlich.

Die angekündigte Erhöhung um ${erhöhung || "X"}% ist aus meiner Sicht nicht gerechtfertigt und stellt eine erhebliche, einseitige Vertragsänderung dar. Ich weise darauf hin, dass mir gemäß ${anbieterTyp.gesetz} ein Sonderkündigungsrecht zusteht.${kuendigungText}

Ich bitte Sie um schriftliche Bestätigung des Eingangs dieses Widerspruchs innerhalb von 14 Tagen.

Sollte keine Einigung erzielt werden, behalte ich mir vor, die zuständige Verbraucherschutzbehörde sowie die Bundesnetzagentur zu informieren.

Mit freundlichen Grüßen,
${name}

Datum: ${today}
${kundennummer ? `Kundennummer: ${kundennummer}` : ""}`;
}

export default function PreiserhoehungGenerator() {
  const [name, setName] = useState("");
  const [adresse, setAdresse] = useState("");
  const [kundennummer, setKundennummer] = useState("");
  const [anbieter, setAnbieter] = useState("");
  const [anbieterTypKey, setAnbieterTypKey] = useState("strom");
  const [erhöhung, setErhöhung] = useState("");
  const [ankuendigung, setAnnkuendigung] = useState("");
  const [kuendigung, setKuendigung] = useState(true);
  const [copied, setCopied] = useState(false);
  const [step, setStep] = useState<1 | 2>(1);

  const anbieterTyp = ANBIETER_TYPEN.find((t) => t.value === anbieterTypKey)!;

  const letter = useMemo(
    () =>
      generateLetter({
        name: name || "[Ihr Name]",
        adresse: adresse || "[Ihre Adresse]",
        kundennummer,
        anbieter: anbieter || "[Anbieter]",
        anbieterTyp,
        erhöhung,
        ankuendigung,
        kuendigung,
      }),
    [name, adresse, kundennummer, anbieter, anbieterTyp, erhöhung, ankuendigung, kuendigung]
  );

  const handleCopy = () => {
    navigator.clipboard.writeText(letter);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const inputStyle: React.CSSProperties = {
    width: "100%",
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.1)",
    color: "#F0F4FF",
    padding: "0.65rem 0.875rem",
    fontSize: "0.88rem",
    fontFamily: "inherit",
    outline: "none",
    boxSizing: "border-box",
  };

  const labelStyle: React.CSSProperties = {
    display: "block",
    fontFamily: "var(--font-jetbrains, monospace)",
    fontSize: "0.58rem",
    letterSpacing: "0.1em",
    color: "rgba(255,255,255,0.4)",
    textTransform: "uppercase",
    marginBottom: "0.4rem",
  };

  return (
    <div
      style={{
        border: "1px solid rgba(0,212,255,0.15)",
        background: "rgba(0,212,255,0.02)",
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: "1.25rem 1.5rem",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
          display: "flex",
          alignItems: "center",
          gap: "0.75rem",
        }}
      >
        <FileText size={16} style={{ color: "rgba(0,212,255,0.6)", flexShrink: 0 }} />
        <div>
          <p
            style={{
              fontFamily: "var(--font-jetbrains, monospace)",
              fontSize: "0.58rem",
              letterSpacing: "0.12em",
              color: "rgba(0,212,255,0.55)",
              textTransform: "uppercase",
              margin: 0,
            }}
          >
            SOVEREIGN GENERATOR
          </p>
          <p
            style={{
              fontFamily: "var(--font-space-grotesk, sans-serif)",
              fontWeight: 700,
              fontSize: "1rem",
              color: "#F0F4FF",
              margin: "0.1rem 0 0",
            }}
          >
            Widerspruchsschreiben erstellen
          </p>
        </div>

        {/* Step indicator */}
        <div style={{ marginLeft: "auto", display: "flex", gap: "0.4rem" }}>
          {[1, 2].map((s) => (
            <button
              key={s}
              onClick={() => setStep(s as 1 | 2)}
              style={{
                width: 28,
                height: 28,
                borderRadius: "50%",
                border: `1px solid ${step === s ? "rgba(0,212,255,0.5)" : "rgba(255,255,255,0.1)"}`,
                background: step === s ? "rgba(0,212,255,0.1)" : "transparent",
                color: step === s ? "#00D4FF" : "rgba(255,255,255,0.3)",
                fontFamily: "var(--font-jetbrains, monospace)",
                fontSize: "0.6rem",
                cursor: "pointer",
              }}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 0 }}>
        {/* Left: Form */}
        <div style={{ padding: "1.5rem", borderRight: "1px solid rgba(255,255,255,0.06)" }}>
          {step === 1 ? (
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <p
                style={{
                  fontFamily: "var(--font-jetbrains, monospace)",
                  fontSize: "0.58rem",
                  letterSpacing: "0.1em",
                  color: "rgba(0,212,255,0.5)",
                  textTransform: "uppercase",
                  marginBottom: "0.25rem",
                }}
              >
                Schritt 1 — Ihre Daten
              </p>

              <div>
                <label style={labelStyle}>Ihr Name</label>
                <input style={inputStyle} value={name} onChange={(e) => setName(e.target.value)} placeholder="Max Mustermann" />
              </div>
              <div>
                <label style={labelStyle}>Ihre Adresse (Straße, PLZ, Ort)</label>
                <input style={inputStyle} value={adresse} onChange={(e) => setAdresse(e.target.value)} placeholder="Musterstr. 1, 10115 Berlin" />
              </div>
              <div>
                <label style={labelStyle}>Kundennummer (optional)</label>
                <input style={inputStyle} value={kundennummer} onChange={(e) => setKundennummer(e.target.value)} placeholder="DE-123456789" />
              </div>

              <button
                onClick={() => setStep(2)}
                style={{
                  marginTop: "0.5rem",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "0.5rem",
                  padding: "0.7rem 1.25rem",
                  background: "#00D4FF",
                  color: "#080E1A",
                  border: "none",
                  cursor: "pointer",
                  fontFamily: "var(--font-space-grotesk, sans-serif)",
                  fontWeight: 700,
                  fontSize: "0.85rem",
                }}
              >
                Weiter
                <ChevronRight size={14} />
              </button>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <p
                style={{
                  fontFamily: "var(--font-jetbrains, monospace)",
                  fontSize: "0.58rem",
                  letterSpacing: "0.1em",
                  color: "rgba(0,212,255,0.5)",
                  textTransform: "uppercase",
                  marginBottom: "0.25rem",
                }}
              >
                Schritt 2 — Preiserhöhung
              </p>

              <div>
                <label style={labelStyle}>Anbieter Name</label>
                <input style={inputStyle} value={anbieter} onChange={(e) => setAnbieter(e.target.value)} placeholder="z.B. Telekom, E.ON, Allianz" />
              </div>

              <div>
                <label style={labelStyle}>Art des Vertrags</label>
                <select
                  value={anbieterTypKey}
                  onChange={(e) => setAnbieterTypKey(e.target.value)}
                  style={{ ...inputStyle, appearance: "none" }}
                >
                  {ANBIETER_TYPEN.map((t) => (
                    <option key={t.value} value={t.value}>{t.label}</option>
                  ))}
                </select>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
                <div>
                  <label style={labelStyle}>Erhöhung in %</label>
                  <input
                    style={inputStyle}
                    type="number"
                    value={erhöhung}
                    onChange={(e) => setErhöhung(e.target.value)}
                    placeholder="z.B. 12"
                  />
                </div>
                <div>
                  <label style={labelStyle}>Datum Ankündigung</label>
                  <input
                    style={inputStyle}
                    type="date"
                    value={ankuendigung}
                    onChange={(e) => setAnnkuendigung(e.target.value)}
                  />
                </div>
              </div>

              {/* Sonderkündigungsrecht Hinweis */}
              <div
                style={{
                  padding: "0.75rem 1rem",
                  background: anbieterTyp.sonder ? "rgba(0,230,118,0.06)" : "rgba(255,255,255,0.03)",
                  border: `1px solid ${anbieterTyp.sonder ? "rgba(0,230,118,0.2)" : "rgba(255,255,255,0.07)"}`,
                  fontSize: "0.78rem",
                  color: "rgba(255,255,255,0.5)",
                  lineHeight: 1.5,
                }}
              >
                <strong style={{ color: anbieterTyp.sonder ? "#00E676" : "rgba(255,255,255,0.7)" }}>
                  {anbieterTyp.sonder ? "✓ Sonderkündigungsrecht aktiv" : "Ordentliche Kündigung"}
                </strong>
                <br />
                Rechtsgrundlage: {anbieterTyp.gesetz} · Frist: {anbieterTyp.frist}
              </div>

              {/* Kündigung toggle */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.75rem",
                  padding: "0.75rem 1rem",
                  background: "rgba(255,255,255,0.02)",
                  border: "1px solid rgba(255,255,255,0.06)",
                  cursor: "pointer",
                }}
                onClick={() => setKuendigung(!kuendigung)}
              >
                <div
                  style={{
                    width: 36,
                    height: 20,
                    borderRadius: 10,
                    background: kuendigung ? "rgba(0,212,255,0.3)" : "rgba(255,255,255,0.1)",
                    border: `1px solid ${kuendigung ? "rgba(0,212,255,0.5)" : "rgba(255,255,255,0.15)"}`,
                    position: "relative",
                    transition: "all 0.2s",
                    flexShrink: 0,
                  }}
                >
                  <div
                    style={{
                      position: "absolute",
                      top: 2,
                      left: kuendigung ? 16 : 2,
                      width: 14,
                      height: 14,
                      borderRadius: "50%",
                      background: kuendigung ? "#00D4FF" : "rgba(255,255,255,0.4)",
                      transition: "left 0.2s",
                    }}
                  />
                </div>
                <div>
                  <p style={{ fontSize: "0.83rem", fontWeight: 600, color: "rgba(255,255,255,0.8)", margin: 0 }}>
                    Gleichzeitig kündigen
                  </p>
                  <p style={{ fontSize: "0.72rem", color: "rgba(255,255,255,0.35)", margin: "0.15rem 0 0" }}>
                    Außerordentliche Kündigung in den Brief aufnehmen
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right: Preview */}
        <div style={{ padding: "1.5rem", background: "rgba(0,0,0,0.2)" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: "1rem",
            }}
          >
            <span
              style={{
                fontFamily: "var(--font-jetbrains, monospace)",
                fontSize: "0.55rem",
                letterSpacing: "0.1em",
                color: "rgba(255,255,255,0.3)",
                textTransform: "uppercase",
              }}
            >
              Vorschau
            </span>
            <button
              onClick={handleCopy}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.4rem",
                padding: "0.4rem 0.85rem",
                background: copied ? "rgba(0,230,118,0.1)" : "rgba(0,212,255,0.08)",
                border: `1px solid ${copied ? "rgba(0,230,118,0.3)" : "rgba(0,212,255,0.2)"}`,
                color: copied ? "#00E676" : "#00D4FF",
                cursor: "pointer",
                fontFamily: "var(--font-jetbrains, monospace)",
                fontSize: "0.58rem",
                letterSpacing: "0.08em",
              }}
            >
              {copied ? <Check size={12} /> : <Copy size={12} />}
              {copied ? "Kopiert!" : "Kopieren"}
            </button>
          </div>

          <pre
            style={{
              fontFamily: "var(--font-jetbrains, monospace)",
              fontSize: "0.68rem",
              lineHeight: 1.75,
              color: "rgba(255,255,255,0.55)",
              whiteSpace: "pre-wrap",
              wordBreak: "break-word",
              margin: 0,
              maxHeight: 400,
              overflowY: "auto",
              padding: "0.5rem",
              background: "rgba(0,0,0,0.15)",
              border: "1px solid rgba(255,255,255,0.04)",
            }}
          >
            {letter}
          </pre>
        </div>
      </div>

      {/* Footer note */}
      <div
        style={{
          padding: "0.75rem 1.5rem",
          borderTop: "1px solid rgba(255,255,255,0.04)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "1rem",
          flexWrap: "wrap",
        }}
      >
        <p
          style={{
            fontSize: "0.72rem",
            color: "rgba(255,255,255,0.25)",
            margin: 0,
            lineHeight: 1.5,
          }}
        >
          Diese Vorlage dient der Information und ersetzt keine Rechtsberatung. SOVEREIGN übernimmt den Versand und die Fristenüberwachung vollautomatisch.
        </p>
        <a
          href="/dashboard"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.4rem",
            padding: "0.5rem 1rem",
            background: "#00D4FF",
            color: "#080E1A",
            textDecoration: "none",
            fontFamily: "var(--font-space-grotesk, sans-serif)",
            fontWeight: 700,
            fontSize: "0.78rem",
            whiteSpace: "nowrap",
            flexShrink: 0,
          }}
        >
          Automatisch versenden
          <ChevronRight size={12} />
        </a>
      </div>
    </div>
  );
}
