"use client";
// ═══════════════════════════════════════════════════════════════
// DSGVO Auskunft-Generator — Art. 15, 17, 20 DSGVO
// ═══════════════════════════════════════════════════════════════

import React, { useState, useMemo } from "react";
import { Copy, Check, FileText, ChevronRight, Shield } from "lucide-react";

const UNTERNEHMEN = [
  {
    value: "meta",
    label: "Meta (Facebook / Instagram / WhatsApp)",
    name: "Meta Platforms Ireland Limited",
    adresse: "4 Grand Canal Square, Grand Canal Harbour, Dublin 2, Irland",
    email: "datenschutz@support.facebook.com",
    frist: "30 Tage (Art. 12 Abs. 3 DSGVO)",
  },
  {
    value: "google",
    label: "Google / Alphabet",
    name: "Google Ireland Limited",
    adresse: "Gordon House, Barrow Street, Dublin 4, Irland",
    email: "privacy@google.com",
    frist: "30 Tage (Art. 12 Abs. 3 DSGVO)",
  },
  {
    value: "amazon",
    label: "Amazon",
    name: "Amazon Europe Core S.à r.l.",
    adresse: "38 avenue John F. Kennedy, L-1855 Luxemburg",
    email: "aws-privacy@amazon.com",
    frist: "30 Tage (Art. 12 Abs. 3 DSGVO)",
  },
  {
    value: "apple",
    label: "Apple",
    name: "Apple Distribution International Ltd.",
    adresse: "Hollyhill Industrial Estate, Hollyhill, Cork, Irland",
    email: "privacy@apple.com",
    frist: "30 Tage (Art. 12 Abs. 3 DSGVO)",
  },
  {
    value: "microsoft",
    label: "Microsoft",
    name: "Microsoft Ireland Operations Limited",
    adresse: "One Microsoft Place, South County Business Park, Leopardstown, Dublin 18, Irland",
    email: "msviape@microsoft.com",
    frist: "30 Tage (Art. 12 Abs. 3 DSGVO)",
  },
  {
    value: "linkedin",
    label: "LinkedIn",
    name: "LinkedIn Ireland Unlimited Company",
    adresse: "Wilton Place, Dublin 2, Irland",
    email: "legal@linkedin.com",
    frist: "30 Tage (Art. 12 Abs. 3 DSGVO)",
  },
  {
    value: "schufa",
    label: "SCHUFA Holding AG",
    name: "SCHUFA Holding AG",
    adresse: "Kormoranweg 5, 65201 Wiesbaden",
    email: "datenschutz@schufa.de",
    frist: "30 Tage (Art. 12 Abs. 3 DSGVO)",
  },
  {
    value: "zalando",
    label: "Zalando",
    name: "Zalando SE",
    adresse: "Valeska-Gert-Straße 5, 10243 Berlin",
    email: "privacy@zalando.de",
    frist: "30 Tage (Art. 12 Abs. 3 DSGVO)",
  },
  {
    value: "x",
    label: "X (Twitter)",
    name: "Twitter International Unlimited Company",
    adresse: "One Cumberland Place, Fenian Street, Dublin 2, Irland",
    email: "privacy@twitter.com",
    frist: "30 Tage (Art. 12 Abs. 3 DSGVO)",
  },
  {
    value: "custom",
    label: "Anderes Unternehmen (manuell eingeben)",
    name: "",
    adresse: "",
    email: "",
    frist: "30 Tage (Art. 12 Abs. 3 DSGVO)",
  },
];

const ANTRAGSTYPEN = [
  {
    value: "auskunft",
    label: "Art. 15 — Auskunft",
    desc: "Welche Daten speichern Sie über mich?",
  },
  {
    value: "loeschung",
    label: "Art. 17 — Löschung",
    desc: "Bitte löschen Sie alle meine Daten.",
  },
  {
    value: "uebertragbarkeit",
    label: "Art. 20 — Datenübertragbarkeit",
    desc: "Exportieren Sie meine Daten in einem maschinenlesbaren Format.",
  },
  {
    value: "kombi",
    label: "Kombi-Antrag (Art. 15 + 17)",
    desc: "Zuerst Auskunft, dann vollständige Löschung.",
  },
];

function generateLetter({
  name,
  adresse,
  email,
  geburtsdatum,
  unternehmen,
  antragstyp,
  customFirma,
  customAdresse,
}: {
  name: string;
  adresse: string;
  email: string;
  geburtsdatum: string;
  unternehmen: (typeof UNTERNEHMEN)[0];
  antragstyp: (typeof ANTRAGSTYPEN)[0];
  customFirma: string;
  customAdresse: string;
}) {
  const today = new Date().toLocaleDateString("de-DE");
  const deadline = new Date();
  deadline.setDate(deadline.getDate() + 30);
  const deadlineStr = deadline.toLocaleDateString("de-DE");

  const firma = unternehmen.value === "custom" ? (customFirma || "[Firmenname]") : unternehmen.name;
  const firmaAdresse = unternehmen.value === "custom" ? (customAdresse || "[Adresse des Unternehmens]") : unternehmen.adresse;

  const betreffMap: Record<string, string> = {
    auskunft: "Antrag auf Auskunft gemäß Art. 15 DSGVO",
    loeschung: "Antrag auf Löschung gemäß Art. 17 DSGVO",
    uebertragbarkeit: "Antrag auf Datenübertragbarkeit gemäß Art. 20 DSGVO",
    kombi: "Antrag auf Auskunft und Löschung gemäß Art. 15 und Art. 17 DSGVO",
  };

  const bodyMap: Record<string, string> = {
    auskunft: `Ich mache hiermit von meinem Auskunftsrecht gemäß Art. 15 DSGVO Gebrauch und bitte Sie um folgende Informationen:

1. ob und welche personenbezogenen Daten Sie über mich verarbeiten (Art. 15 Abs. 1 DSGVO)
2. zu welchen Zwecken die Verarbeitung erfolgt
3. die Empfänger oder Kategorien von Empfängern, gegenüber denen meine Daten offengelegt wurden
4. die geplante Speicherdauer oder die Kriterien für ihre Festlegung
5. ob eine automatisierte Entscheidungsfindung einschließlich Profiling stattfindet (Art. 22 DSGVO)
6. eine Kopie der Sie betreffenden personenbezogenen Daten (Art. 15 Abs. 3 DSGVO)

Ich bitte Sie, die Auskunft schriftlich und in einem allgemein gebräuchlichen Format zu erteilen.`,

    loeschung: `Ich mache hiermit von meinem Recht auf Löschung gemäß Art. 17 DSGVO Gebrauch und fordere Sie auf, alle über mich gespeicherten personenbezogenen Daten unverzüglich zu löschen.

Dies umfasst:
- Alle gespeicherten Profildaten, Nutzungshistorien und Verhaltensprofile
- Alle abgeleiteten und aggregierten Daten, die sich auf meine Person beziehen
- Alle bei Drittparteien und Auftragsverarbeitern gespeicherten Daten
- Sämtliche Backups und Archivkopien, soweit gesetzlich löschpflichtig

Bitte bestätigen Sie mir schriftlich, dass die Löschung vollständig erfolgt ist.`,

    uebertragbarkeit: `Ich mache hiermit von meinem Recht auf Datenübertragbarkeit gemäß Art. 20 DSGVO Gebrauch.

Ich bitte Sie, mir alle mich betreffenden personenbezogenen Daten in einem strukturierten, gängigen und maschinenlesbaren Format (z.B. JSON oder CSV) zu übermitteln.

Dies betrifft insbesondere:
- Alle Daten, die ich Ihnen aktiv bereitgestellt habe
- Alle Daten, die durch meine Nutzung Ihrer Dienste entstanden sind
- Daten aus verbundenen Diensten und Drittanbieter-Integrationen`,

    kombi: `Ich mache hiermit von meinem Auskunftsrecht gemäß Art. 15 DSGVO sowie meinem Recht auf Löschung gemäß Art. 17 DSGVO Gebrauch.

Schritt 1 — Auskunft (Art. 15 DSGVO):
Bitte teilen Sie mir zunächst mit, welche personenbezogenen Daten Sie über mich verarbeiten, einschließlich der Verarbeitungszwecke, Empfänger und Speicherdauer sowie einer Datenkopie (Art. 15 Abs. 3 DSGVO).

Schritt 2 — Löschung (Art. 17 DSGVO):
Im Anschluss an die Auskunftserteilung fordere ich Sie auf, alle über mich gespeicherten personenbezogenen Daten vollständig und unwiderruflich zu löschen. Bitte bestätigen Sie mir die erfolgte Löschung schriftlich.`,
  };

  return `${name}
${adresse}${email ? `\n${email}` : ""}${geburtsdatum ? `\nGeburtsdatum: ${geburtsdatum}` : ""}

An:
${firma}
${firmaAdresse}

Betreff: ${betreffMap[antragstyp.value]}

${today}

Sehr geehrte Damen und Herren,

${bodyMap[antragstyp.value]}

Bitte beachten Sie, dass Sie gemäß Art. 12 Abs. 3 DSGVO verpflichtet sind, meine Anfrage unverzüglich, spätestens jedoch innerhalb eines Monats nach Eingang zu beantworten. Die Frist endet am ${deadlineStr}.

Ich weise darauf hin, dass ich bei unzureichender oder ausbleibender Reaktion das Recht habe, Beschwerde bei der zuständigen Datenschutzaufsichtsbehörde einzulegen (Art. 77 DSGVO).

Mit freundlichen Grüßen,
${name || "[Ihr Name]"}

Datum: ${today}`;
}

export default function DsgvoAuskunftGenerator() {
  const [step, setStep] = useState<1 | 2>(1);
  const [name, setName] = useState("");
  const [adresse, setAdresse] = useState("");
  const [email, setEmail] = useState("");
  const [geburtsdatum, setGeburtsdatum] = useState("");
  const [unternehmenKey, setUnternehmenKey] = useState("meta");
  const [customFirma, setCustomFirma] = useState("");
  const [customAdresse, setCustomAdresse] = useState("");
  const [antragstyp, setAntragstyp] = useState("auskunft");
  const [copied, setCopied] = useState(false);

  const unternehmen = UNTERNEHMEN.find((u) => u.value === unternehmenKey)!;
  const antragsTypObj = ANTRAGSTYPEN.find((t) => t.value === antragstyp)!;

  const letter = useMemo(
    () =>
      generateLetter({
        name: name || "[Ihr Name]",
        adresse: adresse || "[Ihre Adresse]",
        email,
        geburtsdatum,
        unternehmen,
        antragstyp: antragsTypObj,
        customFirma,
        customAdresse,
      }),
    [name, adresse, email, geburtsdatum, unternehmen, antragsTypObj, customFirma, customAdresse]
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
    <div style={{ border: "1px solid rgba(0,212,255,0.15)", background: "rgba(0,212,255,0.02)" }}>
      {/* Header */}
      <div style={{
        padding: "1.25rem 1.5rem",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
        display: "flex",
        alignItems: "center",
        gap: "0.75rem",
      }}>
        <Shield size={16} style={{ color: "rgba(0,212,255,0.6)", flexShrink: 0 }} />
        <div>
          <p style={{
            fontFamily: "var(--font-jetbrains, monospace)",
            fontSize: "0.58rem",
            letterSpacing: "0.12em",
            color: "rgba(0,212,255,0.55)",
            textTransform: "uppercase",
            margin: 0,
          }}>
            SOVEREIGN GENERATOR
          </p>
          <p style={{
            fontFamily: "var(--font-space-grotesk, sans-serif)",
            fontWeight: 700,
            fontSize: "1rem",
            color: "#F0F4FF",
            margin: "0.1rem 0 0",
          }}>
            DSGVO-Antrag erstellen (Art. 15 / 17 / 20)
          </p>
        </div>
        <div style={{ marginLeft: "auto", display: "flex", gap: "0.4rem" }}>
          {[1, 2].map((s) => (
            <button
              key={s}
              onClick={() => setStep(s as 1 | 2)}
              style={{
                width: 28, height: 28, borderRadius: "50%",
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
              <p style={{
                fontFamily: "var(--font-jetbrains, monospace)",
                fontSize: "0.58rem", letterSpacing: "0.1em",
                color: "rgba(0,212,255,0.5)", textTransform: "uppercase", marginBottom: "0.25rem",
              }}>
                Schritt 1 — Ihre Identität
              </p>

              <div>
                <label style={labelStyle}>Ihr vollständiger Name</label>
                <input style={inputStyle} value={name} onChange={(e) => setName(e.target.value)} placeholder="Max Mustermann" />
              </div>
              <div>
                <label style={labelStyle}>Ihre Adresse</label>
                <input style={inputStyle} value={adresse} onChange={(e) => setAdresse(e.target.value)} placeholder="Musterstr. 1, 10115 Berlin" />
              </div>
              <div>
                <label style={labelStyle}>E-Mail-Adresse (optional)</label>
                <input style={inputStyle} type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="max@muster.de" />
              </div>
              <div>
                <label style={labelStyle}>Geburtsdatum (optional — zur Identifikation)</label>
                <input style={inputStyle} type="date" value={geburtsdatum} onChange={(e) => setGeburtsdatum(e.target.value)} />
              </div>

              <button
                onClick={() => setStep(2)}
                style={{
                  marginTop: "0.5rem",
                  display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem",
                  padding: "0.7rem 1.25rem",
                  background: "#00D4FF", color: "#080E1A", border: "none",
                  cursor: "pointer",
                  fontFamily: "var(--font-space-grotesk, sans-serif)",
                  fontWeight: 700, fontSize: "0.85rem",
                }}
              >
                Weiter <ChevronRight size={14} />
              </button>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <p style={{
                fontFamily: "var(--font-jetbrains, monospace)",
                fontSize: "0.58rem", letterSpacing: "0.1em",
                color: "rgba(0,212,255,0.5)", textTransform: "uppercase", marginBottom: "0.25rem",
              }}>
                Schritt 2 — Antrag konfigurieren
              </p>

              <div>
                <label style={labelStyle}>Unternehmen</label>
                <select
                  value={unternehmenKey}
                  onChange={(e) => setUnternehmenKey(e.target.value)}
                  style={{ ...inputStyle, appearance: "none" }}
                >
                  {UNTERNEHMEN.map((u) => (
                    <option key={u.value} value={u.value}>{u.label}</option>
                  ))}
                </select>
              </div>

              {unternehmenKey === "custom" && (
                <>
                  <div>
                    <label style={labelStyle}>Firmenname</label>
                    <input style={inputStyle} value={customFirma} onChange={(e) => setCustomFirma(e.target.value)} placeholder="Musterfirma GmbH" />
                  </div>
                  <div>
                    <label style={labelStyle}>Firmenadresse</label>
                    <input style={inputStyle} value={customAdresse} onChange={(e) => setCustomAdresse(e.target.value)} placeholder="Musterstr. 1, 10115 Berlin" />
                  </div>
                </>
              )}

              {unternehmenKey !== "custom" && (
                <div style={{
                  padding: "0.75rem 1rem",
                  background: "rgba(0,230,118,0.04)",
                  border: "1px solid rgba(0,230,118,0.15)",
                  fontSize: "0.75rem",
                  color: "rgba(255,255,255,0.45)",
                  lineHeight: 1.55,
                }}>
                  <strong style={{ color: "#00E676", display: "block", marginBottom: "0.25rem" }}>✓ Adresse bekannt</strong>
                  {unternehmen.name} · {unternehmen.frist}
                  {unternehmen.email && (
                    <span style={{ display: "block", marginTop: "0.2rem", color: "rgba(0,212,255,0.45)" }}>
                      {unternehmen.email}
                    </span>
                  )}
                </div>
              )}

              <div>
                <label style={labelStyle}>Art des Antrags</label>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                  {ANTRAGSTYPEN.map((t) => (
                    <button
                      key={t.value}
                      onClick={() => setAntragstyp(t.value)}
                      style={{
                        display: "flex", flexDirection: "column", alignItems: "flex-start",
                        padding: "0.6rem 0.875rem",
                        background: antragstyp === t.value ? "rgba(0,212,255,0.08)" : "rgba(255,255,255,0.02)",
                        border: `1px solid ${antragstyp === t.value ? "rgba(0,212,255,0.35)" : "rgba(255,255,255,0.07)"}`,
                        cursor: "pointer", textAlign: "left",
                      }}
                    >
                      <span style={{
                        fontFamily: "var(--font-jetbrains, monospace)", fontSize: "0.65rem",
                        color: antragstyp === t.value ? "#00D4FF" : "rgba(255,255,255,0.5)",
                        fontWeight: 700,
                      }}>
                        {t.label}
                      </span>
                      <span style={{ fontSize: "0.72rem", color: "rgba(255,255,255,0.3)", marginTop: "0.15rem" }}>
                        {t.desc}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right: Preview */}
        <div style={{ padding: "1.5rem", background: "rgba(0,0,0,0.2)" }}>
          <div style={{
            display: "flex", alignItems: "center", justifyContent: "space-between",
            marginBottom: "1rem",
          }}>
            <span style={{
              fontFamily: "var(--font-jetbrains, monospace)",
              fontSize: "0.55rem", letterSpacing: "0.1em",
              color: "rgba(255,255,255,0.3)", textTransform: "uppercase",
            }}>
              Vorschau
            </span>
            <button
              onClick={handleCopy}
              style={{
                display: "flex", alignItems: "center", gap: "0.4rem",
                padding: "0.4rem 0.85rem",
                background: copied ? "rgba(0,230,118,0.1)" : "rgba(0,212,255,0.08)",
                border: `1px solid ${copied ? "rgba(0,230,118,0.3)" : "rgba(0,212,255,0.2)"}`,
                color: copied ? "#00E676" : "#00D4FF",
                cursor: "pointer",
                fontFamily: "var(--font-jetbrains, monospace)",
                fontSize: "0.58rem", letterSpacing: "0.08em",
              }}
            >
              {copied ? <Check size={12} /> : <Copy size={12} />}
              {copied ? "Kopiert!" : "Kopieren"}
            </button>
          </div>

          <pre style={{
            fontFamily: "var(--font-jetbrains, monospace)",
            fontSize: "0.68rem", lineHeight: 1.75,
            color: "rgba(255,255,255,0.55)",
            whiteSpace: "pre-wrap", wordBreak: "break-word",
            margin: 0, maxHeight: 440, overflowY: "auto",
            padding: "0.5rem",
            background: "rgba(0,0,0,0.15)",
            border: "1px solid rgba(255,255,255,0.04)",
          }}>
            {letter}
          </pre>
        </div>
      </div>

      {/* Footer */}
      <div style={{
        padding: "0.75rem 1.5rem",
        borderTop: "1px solid rgba(255,255,255,0.04)",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        gap: "1rem", flexWrap: "wrap",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <FileText size={12} style={{ color: "rgba(0,212,255,0.4)", flexShrink: 0 }} />
          <p style={{ fontSize: "0.72rem", color: "rgba(255,255,255,0.25)", margin: 0, lineHeight: 1.5 }}>
            Rechtssicher nach DSGVO. Antwortfrist: 30 Tage (Art. 12 Abs. 3). SOVEREIGN übernimmt Versand und Fristenkontrolle automatisch.
          </p>
        </div>
        <a
          href="/dashboard"
          style={{
            display: "flex", alignItems: "center", gap: "0.4rem",
            padding: "0.5rem 1rem",
            background: "#00D4FF", color: "#080E1A",
            textDecoration: "none",
            fontFamily: "var(--font-space-grotesk, sans-serif)",
            fontWeight: 700, fontSize: "0.78rem",
            whiteSpace: "nowrap", flexShrink: 0,
          }}
        >
          Automatisch versenden <ChevronRight size={12} />
        </a>
      </div>
    </div>
  );
}
