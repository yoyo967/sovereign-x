// src/components/sovereign/SovereignDisclaimer.tsx
// ═══════════════════════════════════════════════════════════════
// EU AI Act Art. 13 Disclaimer — auf allen Demo-Sektionen
// Exakte Texte aus SOVEREIGN-NEXUS-SEED.md Block 3
// NIEMALS den Text paraphrasieren oder abkürzen
// ═══════════════════════════════════════════════════════════════
import { SovereignBadge } from "./SovereignBadge";

type DisclaimerVariant = "standard" | "terminal" | "agent";

interface SovereignDisclaimerProps {
  variant?:   DisclaimerVariant;
  modelName?: string;
}

const TEXTS = {
  standard: {
    badge: "EU AI ACT · ART. 13",
    text:  "Dieses System interagiert mit einem KI-Modell (Gemma 4 On-Device / Gemini 2.5 Flash · EU-Server europe-west4). Ergebnisse dienen der Demonstration. Keine PII-Speicherung.",
  },
  terminal: {
    badge: "SYSTEM STATUS",
    text:  "System: Gemini 2.5 Flash · Processing: Cloud (EU-Region europe-west4) · No PII storage",
  },
  agent: {
    badge: "KI-SYSTEM AKTIV",
    text:  "Betrieben nach EU AI Act Art. 13. Alle Aktionen erfordern menschliche Freigabe (Human-in-the-Loop).",
  },
} as const;

export function SovereignDisclaimer({
  variant   = "standard",
  modelName,
}: SovereignDisclaimerProps) {
  const content = TEXTS[variant];
  const text    = modelName
    ? content.text.replace("Gemma 4 On-Device / Gemini 2.5 Flash", modelName)
    : content.text;

  return (
    <div
      style={{
        display:      "flex",
        alignItems:   "flex-start",
        gap:          "12px",
        padding:      "12px 16px",
        background:   "rgba(0, 229, 255, 0.04)",
        border:       "1px solid rgba(0, 229, 255, 0.15)",
        borderRadius: "var(--s-radius-sm, 8px)",
      }}
    >
      <svg
        width="16" height="16" viewBox="0 0 24 24"
        fill="none" strokeWidth="2"
        style={{ flexShrink: 0, marginTop: "1px", stroke: "var(--s-cyan)" }}
        aria-hidden="true"
      >
        <circle cx="12" cy="12" r="10"/>
        <line x1="12" y1="8" x2="12" y2="12"/>
        <line x1="12" y1="16" x2="12.01" y2="16"/>
      </svg>

      <div>
        <SovereignBadge label={content.badge} variant="ACTIVE" size="sm" />
        <p style={{
          marginTop:  "6px",
          fontSize:   "11px",
          fontFamily: "var(--font-mono, monospace)",
          color:      "var(--s-text-muted)",
          lineHeight: 1.6,
        }}>
          {text}
        </p>
      </div>
    </div>
  );
}
