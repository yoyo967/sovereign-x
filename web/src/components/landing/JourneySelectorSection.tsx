"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslations, useLocale } from "next-intl";
import Link from "next/link";
import { ArrowRight, User, Shield, Cpu, Building2 } from "lucide-react";

const ARCHETYPE_KEYS = [0, 1, 2, 3] as const;

const ICONS = [User, Shield, Cpu, Building2];

const ARCHETYPE_COLORS = [
  { accent: "rgba(0,212,255,0.9)", border: "rgba(0,212,255,0.25)", bg: "rgba(0,212,255,0.04)", glow: "rgba(0,212,255,0.15)" },
  { accent: "rgba(100,200,255,0.9)", border: "rgba(100,200,255,0.25)", bg: "rgba(100,200,255,0.04)", glow: "rgba(100,200,255,0.12)" },
  { accent: "rgba(180,130,255,0.9)", border: "rgba(180,130,255,0.25)", bg: "rgba(180,130,255,0.04)", glow: "rgba(180,130,255,0.12)" },
  { accent: "rgba(0,255,160,0.85)", border: "rgba(0,255,160,0.22)", bg: "rgba(0,255,160,0.03)", glow: "rgba(0,255,160,0.1)" },
];

// Blueprint circuit path for each archetype
function ArchetypeCircuit({ index, active }: { index: number; active: boolean }) {
  const paths = [
    // Consumer: document + flow
    <svg key={0} width="48" height="48" viewBox="0 0 48 48" fill="none">
      <rect x="8" y="6" width="22" height="28" rx="1" stroke={active ? "rgba(0,212,255,0.7)" : "rgba(0,212,255,0.25)"} strokeWidth="1" />
      <line x1="12" y1="14" x2="26" y2="14" stroke={active ? "rgba(0,212,255,0.5)" : "rgba(0,212,255,0.15)"} strokeWidth="0.8" />
      <line x1="12" y1="19" x2="26" y2="19" stroke={active ? "rgba(0,212,255,0.4)" : "rgba(0,212,255,0.1)"} strokeWidth="0.8" />
      <line x1="12" y1="24" x2="20" y2="24" stroke={active ? "rgba(0,212,255,0.3)" : "rgba(0,212,255,0.08)"} strokeWidth="0.8" />
      <circle cx="36" cy="36" r="8" stroke={active ? "rgba(0,212,255,0.6)" : "rgba(0,212,255,0.2)"} strokeWidth="1" />
      <path d="M33 36L35.5 38.5L39 33" stroke={active ? "rgba(0,212,255,0.9)" : "rgba(0,212,255,0.3)"} strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>,
    // Privacy: shield + lock
    <svg key={1} width="48" height="48" viewBox="0 0 48 48" fill="none">
      <path d="M24 6L38 12V24C38 32 24 42 24 42C24 42 10 32 10 24V12L24 6Z" stroke={active ? "rgba(100,200,255,0.7)" : "rgba(100,200,255,0.25)"} strokeWidth="1" fill={active ? "rgba(100,200,255,0.05)" : "none"} />
      <rect x="19" y="21" width="10" height="8" rx="1" stroke={active ? "rgba(100,200,255,0.6)" : "rgba(100,200,255,0.2)"} strokeWidth="0.8" />
      <path d="M21 21V18C21 16.3 22.3 15 24 15C25.7 15 27 16.3 27 18V21" stroke={active ? "rgba(100,200,255,0.5)" : "rgba(100,200,255,0.18)"} strokeWidth="0.8" />
      <circle cx="24" cy="25" r="1.5" fill={active ? "rgba(100,200,255,0.8)" : "rgba(100,200,255,0.3)"} />
    </svg>,
    // Tech: circuit board
    <svg key={2} width="48" height="48" viewBox="0 0 48 48" fill="none">
      <rect x="14" y="14" width="20" height="20" rx="1" stroke={active ? "rgba(180,130,255,0.6)" : "rgba(180,130,255,0.22)"} strokeWidth="1" fill={active ? "rgba(180,130,255,0.04)" : "none"} />
      <line x1="24" y1="8" x2="24" y2="14" stroke={active ? "rgba(180,130,255,0.5)" : "rgba(180,130,255,0.15)"} strokeWidth="1" />
      <line x1="24" y1="34" x2="24" y2="40" stroke={active ? "rgba(180,130,255,0.5)" : "rgba(180,130,255,0.15)"} strokeWidth="1" />
      <line x1="8" y1="24" x2="14" y2="24" stroke={active ? "rgba(180,130,255,0.5)" : "rgba(180,130,255,0.15)"} strokeWidth="1" />
      <line x1="34" y1="24" x2="40" y2="24" stroke={active ? "rgba(180,130,255,0.5)" : "rgba(180,130,255,0.15)"} strokeWidth="1" />
      <circle cx="24" cy="24" r="4" fill={active ? "rgba(180,130,255,0.15)" : "none"} stroke={active ? "rgba(180,130,255,0.7)" : "rgba(180,130,255,0.25)"} strokeWidth="1" />
      <circle cx="24" cy="24" r="1.5" fill={active ? "rgba(180,130,255,0.9)" : "rgba(180,130,255,0.35)"} />
    </svg>,
    // Business: grid/building
    <svg key={3} width="48" height="48" viewBox="0 0 48 48" fill="none">
      <rect x="8" y="16" width="12" height="26" rx="1" stroke={active ? "rgba(0,255,160,0.6)" : "rgba(0,255,160,0.2)"} strokeWidth="1" fill={active ? "rgba(0,255,160,0.04)" : "none"} />
      <rect x="22" y="8" width="18" height="34" rx="1" stroke={active ? "rgba(0,255,160,0.7)" : "rgba(0,255,160,0.22)"} strokeWidth="1" fill={active ? "rgba(0,255,160,0.05)" : "none"} />
      <line x1="26" y1="14" x2="36" y2="14" stroke={active ? "rgba(0,255,160,0.4)" : "rgba(0,255,160,0.12)"} strokeWidth="0.8" />
      <line x1="26" y1="20" x2="36" y2="20" stroke={active ? "rgba(0,255,160,0.4)" : "rgba(0,255,160,0.12)"} strokeWidth="0.8" />
      <line x1="26" y1="26" x2="36" y2="26" stroke={active ? "rgba(0,255,160,0.4)" : "rgba(0,255,160,0.12)"} strokeWidth="0.8" />
      <line x1="12" y1="22" x2="16" y2="22" stroke={active ? "rgba(0,255,160,0.4)" : "rgba(0,255,160,0.12)"} strokeWidth="0.8" />
      <line x1="12" y1="28" x2="16" y2="28" stroke={active ? "rgba(0,255,160,0.4)" : "rgba(0,255,160,0.12)"} strokeWidth="0.8" />
      <line x1="8" y1="42" x2="40" y2="42" stroke={active ? "rgba(0,255,160,0.5)" : "rgba(0,255,160,0.18)"} strokeWidth="1" />
    </svg>,
  ];
  return paths[index] ?? null;
}

export default function JourneySelectorSection() {
  const t = useTranslations("journey");
  const locale = useLocale();
  const [active, setActive] = useState<number | null>(null);

  return (
    <section
      className="relative py-32 px-6"
      id="pfad"
      style={{
        background: "#080E1A",
        borderTop: "1px solid rgba(255,255,255,0.05)",
      }}
    >
      {/* Blueprint grid */}
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.018) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.018) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />

      {/* Diagonal accent line */}
      <div
        className="absolute inset-0 z-0 pointer-events-none overflow-hidden"
        aria-hidden
      >
        <svg width="100%" height="100%" style={{ position: "absolute", top: 0, left: 0 }}>
          <line x1="0" y1="100%" x2="100%" y2="0" stroke="rgba(0,212,255,0.04)" strokeWidth="1" />
        </svg>
      </div>

      <div className="relative z-10 max-w-6xl mx-auto">

        {/* Header */}
        <div className="mb-16 text-center">
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="lp-section-tag mb-6"
          >
            {t("tag")}
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="lp-headline"
            style={{ fontSize: "clamp(2.2rem, 5vw, 3.8rem)" }}
          >
            {t("headline1")}<br />
            <span style={{ color: "rgba(0,212,255,0.9)" }}>{t("headline2")}</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            style={{ marginTop: "1rem", fontSize: "1rem", color: "rgba(255,255,255,0.4)", maxWidth: 560, margin: "1rem auto 0" }}
          >
            {t("sub")}
          </motion.p>
        </div>

        {/* Archetype Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-0" style={{ border: "1px solid rgba(255,255,255,0.07)" }}>
          {ARCHETYPE_KEYS.map((i) => {
            const col = ARCHETYPE_COLORS[i];
            const isActive = active === i;
            const href = `/${locale}${t(`archetypes.${i}.href`)}`;

            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.08 * i }}
                className="relative flex flex-col cursor-pointer"
                style={{
                  borderRight: i < 3 ? "1px solid rgba(255,255,255,0.07)" : "none",
                  background: isActive ? col.bg : "transparent",
                  transition: "background 0.3s",
                }}
                onMouseEnter={() => setActive(i)}
                onMouseLeave={() => setActive(null)}
              >
                {/* Active top border */}
                <div
                  style={{
                    height: 2,
                    background: isActive ? col.accent : "transparent",
                    transition: "background 0.3s",
                  }}
                />

                <div className="flex flex-col p-8" style={{ flex: 1 }}>
                  {/* Tag */}
                  <div
                    className="lp-badge mb-6"
                    style={{
                      fontSize: "0.52rem",
                      color: isActive ? col.accent : "rgba(255,255,255,0.3)",
                      borderColor: isActive ? col.border : "rgba(255,255,255,0.1)",
                      transition: "color 0.3s, border-color 0.3s",
                      alignSelf: "flex-start",
                    }}
                  >
                    {t(`archetypes.${i}.tag`)}
                  </div>

                  {/* Circuit SVG */}
                  <div className="mb-6">
                    <ArchetypeCircuit index={i} active={isActive} />
                  </div>

                  {/* Title */}
                  <h3
                    style={{
                      fontFamily: "var(--font-space-grotesk, sans-serif)",
                      fontWeight: 800,
                      fontSize: "1.15rem",
                      color: isActive ? "rgba(255,255,255,0.98)" : "rgba(255,255,255,0.75)",
                      lineHeight: 1.25,
                      marginBottom: "0.4rem",
                      letterSpacing: "-0.02em",
                      transition: "color 0.3s",
                    }}
                  >
                    {t(`archetypes.${i}.title`)}
                  </h3>
                  <p
                    style={{
                      fontSize: "0.8rem",
                      color: "rgba(255,255,255,0.35)",
                      marginBottom: "1.5rem",
                      fontStyle: "italic",
                    }}
                  >
                    {t(`archetypes.${i}.sub`)}
                  </p>

                  {/* Pain points */}
                  <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "0.6rem", marginBottom: "1.75rem" }}>
                    {([0, 1, 2] as const).map((p) => (
                      <div
                        key={p}
                        style={{
                          display: "flex",
                          alignItems: "flex-start",
                          gap: "0.6rem",
                        }}
                      >
                        <span
                          style={{
                            fontFamily: "var(--font-jetbrains, monospace)",
                            fontSize: "0.6rem",
                            color: isActive ? col.accent : "rgba(255,255,255,0.2)",
                            transition: "color 0.3s",
                            paddingTop: 2,
                            minWidth: 12,
                          }}
                        >
                          ▸
                        </span>
                        <span
                          style={{
                            fontSize: "0.78rem",
                            color: isActive ? "rgba(255,255,255,0.6)" : "rgba(255,255,255,0.3)",
                            lineHeight: 1.5,
                            transition: "color 0.3s",
                          }}
                        >
                          {t(`archetypes.${i}.pain${p}`)}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* CTA */}
                  <Link
                    href={href}
                    className="flex items-center gap-2"
                    style={{
                      fontFamily: "var(--font-space-grotesk, sans-serif)",
                      fontSize: "0.72rem",
                      fontWeight: 700,
                      letterSpacing: "0.06em",
                      textTransform: "uppercase",
                      color: isActive ? col.accent : "rgba(255,255,255,0.25)",
                      textDecoration: "none",
                      transition: "color 0.3s",
                      paddingTop: "1.25rem",
                      borderTop: `1px solid ${isActive ? col.border : "rgba(255,255,255,0.05)"}`,
                    }}
                  >
                    {t(`archetypes.${i}.cta`)}
                    <ArrowRight
                      size={13}
                      style={{
                        transition: "transform 0.3s",
                        transform: isActive ? "translateX(4px)" : "translateX(0)",
                      }}
                    />
                  </Link>
                </div>

                {/* Glow effect on active */}
                <AnimatePresence>
                  {isActive && (
                    <motion.div
                      key="glow"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      style={{
                        position: "absolute",
                        inset: 0,
                        background: `radial-gradient(ellipse at 50% 0%, ${col.glow} 0%, transparent 70%)`,
                        pointerEvents: "none",
                      }}
                    />
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>

        {/* Bottom hint */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          style={{
            marginTop: "1.5rem",
            textAlign: "center",
            fontFamily: "var(--font-jetbrains, monospace)",
            fontSize: "0.58rem",
            letterSpacing: "0.12em",
            color: "rgba(255,255,255,0.18)",
            textTransform: "uppercase",
          }}
        >
          Hover zum Erkunden · Klick zum Start
        </motion.p>
      </div>
    </section>
  );
}
