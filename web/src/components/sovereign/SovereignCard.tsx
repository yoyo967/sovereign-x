// src/components/sovereign/SovereignCard.tsx
// ═══════════════════════════════════════════════════════════════
// Basis-Card — Glass-Morphism + 1px Border
// Verwendung: ALLE Cards auf Landing, Pillar- und Cluster-Seiten
// ═══════════════════════════════════════════════════════════════
import React from "react";

interface SovereignCardProps {
  children:   React.ReactNode;
  className?: string;
  glow?:      "cyan" | "purple" | "gold" | "none";
  onClick?:   () => void;
  as?:        "div" | "article" | "section";
}

export function SovereignCard({
  children,
  className = "",
  glow      = "none",
  onClick,
  as: Tag   = "div",
}: SovereignCardProps) {
  const glowMap = {
    cyan:   "0 0 40px rgba(0, 229, 255, 0.10)",
    purple: "0 0 40px rgba(187, 134, 252, 0.10)",
    gold:   "0 0 40px rgba(255, 214, 0, 0.08)",
    none:   "0 1px 3px rgba(0,0,0,0.5), 0 8px 24px rgba(0,0,0,0.35)",
  };

  return (
    <Tag
      onClick={onClick}
      className={className}
      style={{
        background:           "rgba(15, 32, 53, 0.85)",
        backdropFilter:       "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        border:               "1px solid rgba(255, 255, 255, 0.12)",
        borderRadius:         "var(--s-radius-md, 16px)",
        boxShadow:            glowMap[glow],
        transition:           "border-color 200ms ease, box-shadow 200ms ease",
        cursor:               onClick ? "pointer" : "default",
      }}
      onMouseEnter={onClick ? (e) => {
        (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.22)";
      } : undefined}
      onMouseLeave={onClick ? (e) => {
        (e.currentTarget as HTMLElement).style.borderColor = "rgba(255, 255, 255, 0.12)";
      } : undefined}
    >
      {children}
    </Tag>
  );
}
