// src/lib/sovereign-design-contract.ts
// ═══════════════════════════════════════════════════════════════
// SOVEREIGN 2030 — Design Contract v1.0
// Quelle: coreui/theme/Color.kt → Web-Mapping
// NIEMALS direkt editieren. Alle Komponenten importieren von hier.
// ═══════════════════════════════════════════════════════════════

export const S = {
  // ── HINTERGRÜNDE — System A: Blueprint Dark ───────────────────
  bgPrimary:     "#080E1A",
  bgDeep:        "#060B15",
  bgSurface:     "#0A1628",
  bgGlass:       "rgba(8, 14, 26, 0.92)",

  // ── AKZENTE ──────────────────────────────────────────────────
  cyan:          "#00D4FF",   // CTA only — nicht als Dekoration
  purple:        "#BB86FC",   // Strategie, Vision, Badges
  teal:          "#00BFA5",   // Erfolg, positive States
  gold:          "#FFD600",   // Attention, Savings
  pink:          "#FF4081",   // Warnung, Risiko
  riskRed:       "#FF1744",   // Kritisch
  success:       "#00E676",   // Abgeschlossene Aktionen

  // ── TEXT ─────────────────────────────────────────────────────
  textPrimary:   "#F0F4FF",
  textMuted:     "#8892A4",
  textFaint:     "#5A6478",

  // ── BORDERS ──────────────────────────────────────────────────
  border:        "rgba(255, 255, 255, 0.06)",
  borderStrong:  "rgba(255, 255, 255, 0.18)",
  divider:       "rgba(255, 255, 255, 0.04)",

  // ── SHADOWS ──────────────────────────────────────────────────
  shadowCard:       "0 1px 3px rgba(0,0,0,0.6), 0 8px 24px rgba(0,0,0,0.45)",
  shadowGlow:       "0 0 40px rgba(0, 212, 255, 0.10)",
  shadowGlowPurple: "0 0 40px rgba(187, 134, 252, 0.08)",

  // ── RADIUS ───────────────────────────────────────────────────
  radiusSm:      "8px",
  radiusMd:      "16px",
  radiusLg:      "24px",
  radiusFull:    "9999px",

  // ── TYPOGRAPHY ───────────────────────────────────────────────
  fontBody:      "'Inter', 'Helvetica Neue', sans-serif",
  fontMono:      "'JetBrains Mono', 'Fira Code', monospace",
} as const;

// CSS Custom Properties — in globals.css via :root eintragen
export const SOVEREIGN_CSS = `
  :root {
    --s-bg:            ${S.bgPrimary};
    --s-bg-deep:       ${S.bgDeep};
    --s-surface:       ${S.bgSurface};
    --s-glass:         ${S.bgGlass};
    --s-cyan:          ${S.cyan};
    --s-purple:        ${S.purple};
    --s-teal:          ${S.teal};
    --s-gold:          ${S.gold};
    --s-pink:          ${S.pink};
    --s-risk:          ${S.riskRed};
    --s-success:       ${S.success};
    --s-text:          ${S.textPrimary};
    --s-text-muted:    ${S.textMuted};
    --s-text-faint:    ${S.textFaint};
    --s-border:        ${S.border};
    --s-border-strong: ${S.borderStrong};
    --s-divider:       ${S.divider};
    --s-shadow:        ${S.shadowCard};
    --s-glow:          ${S.shadowGlow};
    --s-radius-sm:     ${S.radiusSm};
    --s-radius-md:     ${S.radiusMd};
    --s-radius-lg:     ${S.radiusLg};
    --font-body:       ${S.fontBody};
    --font-mono:       ${S.fontMono};
  }
`;

// Badge-Farben — zentralisiert für SovereignBadge
export const BADGE_COLORS = {
  VERBOTEN:    { bg: "rgba(255, 23, 68, 0.15)",   border: S.riskRed,  text: S.riskRed  },
  HIGH_RISK:   { bg: "rgba(255, 23, 68, 0.10)",   border: S.riskRed,  text: S.riskRed  },
  MEDIUM_RISK: { bg: "rgba(255, 214, 0, 0.12)",   border: S.gold,     text: S.gold     },
  LOW_RISK:    { bg: "rgba(0, 191, 165, 0.12)",   border: S.teal,     text: S.teal     },
  ACTIVE:      { bg: "rgba(0, 229, 255, 0.12)",   border: S.cyan,     text: S.cyan     },
  COMPLIANT:   { bg: "rgba(0, 230, 118, 0.12)",   border: S.success,  text: S.success  },
  STRATEGY:    { bg: "rgba(187, 134, 252, 0.12)", border: S.purple,   text: S.purple   },
  NEUTRAL:     { bg: "rgba(255,255,255,0.06)",    border: S.border,   text: S.textMuted},
} as const;

export type BadgeVariant = keyof typeof BADGE_COLORS;

// Audit Panel Fixpunkt-Werte — NIEMALS erfinden
export const AUDIT_DEFAULTS = {
  aiEngine:      "Gemma 4 · On-Device",
  dataResidency: "EU-Region (europe-west4)",
  syncProtocol:  "E2EE · Local-First (ADR-009)",
  authLayer:     "Zero-Trust v2.0",
} as const;
