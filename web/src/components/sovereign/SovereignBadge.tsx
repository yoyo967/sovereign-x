// src/components/sovereign/SovereignBadge.tsx
// ═══════════════════════════════════════════════════════════════
// Status-Badge — [VERBOTEN] [LOW RISK] [ACTIVE] etc.
// Alle Farben aus BADGE_COLORS — niemals hardcoden
// ═══════════════════════════════════════════════════════════════
import { BADGE_COLORS, BadgeVariant } from "@/lib/sovereign-design-contract";

interface SovereignBadgeProps {
  label:     string;
  variant?:  BadgeVariant;
  size?:     "sm" | "md";
}

export function SovereignBadge({
  label,
  variant = "NEUTRAL",
  size    = "sm",
}: SovereignBadgeProps) {
  const colors  = BADGE_COLORS[variant];
  const padding = size === "sm" ? "2px 10px" : "4px 14px";
  const fontSize = size === "sm" ? "10px" : "12px";

  return (
    <span
      style={{
        display:       "inline-block",
        padding,
        fontSize,
        fontFamily:    "var(--font-mono, monospace)",
        fontWeight:    600,
        letterSpacing: "0.08em",
        textTransform: "uppercase",
        color:         colors.text,
        background:    colors.bg,
        border:        `1px solid ${colors.border}`,
        borderRadius:  "var(--s-radius-full, 9999px)",
        whiteSpace:    "nowrap",
      }}
    >
      {label}
    </span>
  );
}
