// src/components/sovereign/SovereignAuditPanel.tsx
// ═══════════════════════════════════════════════════════════════
// Technical Audit Panel — rechts auf Feature/Pillar-Seiten
// Fixpunkt-Werte aus AUDIT_DEFAULTS — NIEMALS erfinden
// ═══════════════════════════════════════════════════════════════
import { SovereignCard }                from "./SovereignCard";
import { AUDIT_DEFAULTS }               from "@/lib/sovereign-design-contract";

interface AuditRow {
  label: string;
  value: string;
}

interface SovereignAuditPanelProps {
  title?:     string;
  rows?:      AuditRow[];
  ctaLabel?:  string;
  ctaHref?:   string;
  guarantee?: string;
}

const DEFAULT_ROWS: AuditRow[] = [
  { label: "AI Engine",      value: AUDIT_DEFAULTS.aiEngine      },
  { label: "Data Residency", value: AUDIT_DEFAULTS.dataResidency },
  { label: "Sync Protocol",  value: AUDIT_DEFAULTS.syncProtocol  },
  { label: "Auth Layer",     value: AUDIT_DEFAULTS.authLayer      },
];

export function SovereignAuditPanel({
  title     = "Technical Audit",
  rows      = DEFAULT_ROWS,
  ctaLabel,
  ctaHref   = "/features/audit-trail",
  guarantee,
}: SovereignAuditPanelProps) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>

      {/* Main Panel */}
      <SovereignCard>
        <div style={{ padding: "24px" }}>
          <p style={{
            fontFamily:    "var(--font-mono, monospace)",
            fontSize:      "10px",
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            color:         "var(--s-text-muted)",
            marginBottom:  "16px",
          }}>
            {title}
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
            {rows.map((row) => (
              <div key={row.label}>
                <p style={{
                  fontSize:     "10px",
                  color:        "var(--s-text-faint)",
                  fontFamily:   "var(--font-mono, monospace)",
                  marginBottom: "2px",
                }}>
                  {row.label}
                </p>
                <p style={{
                  fontSize:   "13px",
                  fontWeight: 600,
                  color:      "var(--s-text)",
                  fontFamily: "var(--font-mono, monospace)",
                }}>
                  {row.value}
                </p>
              </div>
            ))}
          </div>
        </div>
      </SovereignCard>

      {/* Guarantee + CTA Panel */}
      {(guarantee || ctaLabel) && (
        <SovereignCard glow="cyan">
          <div style={{ padding: "20px" }}>
            {guarantee && (
              <>
                <p style={{
                  fontSize:      "11px",
                  fontWeight:    700,
                  color:         "var(--s-cyan)",
                  letterSpacing: "0.06em",
                  textTransform: "uppercase",
                  marginBottom:  "8px",
                }}>
                  Garantie & Vertrauen
                </p>
                <p style={{
                  fontSize:     "12px",
                  color:        "var(--s-text-muted)",
                  lineHeight:   1.6,
                  marginBottom: ctaLabel ? "16px" : "0",
                }}>
                  {guarantee}
                </p>
              </>
            )}

            {ctaLabel && ctaHref && (
              <a
                href={ctaHref}
                style={{
                  display:       "block",
                  textAlign:     "center",
                  padding:       "10px 20px",
                  background:    "transparent",
                  border:        "1px solid var(--s-cyan)",
                  borderRadius:  "var(--s-radius-sm, 8px)",
                  color:         "var(--s-cyan)",
                  fontSize:      "11px",
                  fontFamily:    "var(--font-mono, monospace)",
                  fontWeight:    700,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  textDecoration:"none",
                  transition:    "background 200ms ease",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLAnchorElement).style.background =
                    "rgba(0, 229, 255, 0.08)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLAnchorElement).style.background =
                    "transparent";
                }}
              >
                {ctaLabel}
              </a>
            )}
          </div>
        </SovereignCard>
      )}

    </div>
  );
}
