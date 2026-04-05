"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useTranslations, useLocale } from "next-intl";
import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";

const MODULE_KEYS = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11] as const;

type CategoryKey = "DATENSCHUTZ" | "TECHNOLOGIE" | "EU AI ACT" | "PRODUKT" | "FEATURE" | "USE CASE";

const CATEGORY_STYLES: Record<string, { color: string; bg: string; border: string }> = {
  DATENSCHUTZ:  { color: "rgba(100,200,255,0.85)", bg: "rgba(100,200,255,0.06)", border: "rgba(100,200,255,0.2)" },
  TECHNOLOGIE:  { color: "rgba(180,130,255,0.85)", bg: "rgba(180,130,255,0.06)", border: "rgba(180,130,255,0.2)" },
  "EU AI ACT":  { color: "rgba(255,200,80,0.85)",  bg: "rgba(255,200,80,0.05)",  border: "rgba(255,200,80,0.18)" },
  PRODUKT:      { color: "rgba(0,212,255,0.9)",    bg: "rgba(0,212,255,0.06)",   border: "rgba(0,212,255,0.22)" },
  FEATURE:      { color: "rgba(0,255,160,0.8)",    bg: "rgba(0,255,160,0.05)",   border: "rgba(0,255,160,0.18)" },
  PRIVACY:      { color: "rgba(100,200,255,0.85)", bg: "rgba(100,200,255,0.06)", border: "rgba(100,200,255,0.2)" },
  TECHNOLOGY:   { color: "rgba(180,130,255,0.85)", bg: "rgba(180,130,255,0.06)", border: "rgba(180,130,255,0.2)" },
  "USE CASE":   { color: "rgba(255,160,60,0.85)",  bg: "rgba(255,160,60,0.05)",  border: "rgba(255,160,60,0.18)" },
};

const DEFAULT_STYLE = { color: "rgba(0,212,255,0.7)", bg: "rgba(0,212,255,0.04)", border: "rgba(0,212,255,0.15)" };

// Module index SVGs
function ModuleIcon({ index }: { index: number }) {
  const icons = [
    // 0: Data sovereignty — eye
    <svg key={0} width="28" height="28" viewBox="0 0 28 28" fill="none">
      <path d="M14 8C8 8 4 14 4 14C4 14 8 20 14 20C20 20 24 14 24 14C24 14 20 8 14 8Z" stroke="rgba(100,200,255,0.5)" strokeWidth="1" />
      <circle cx="14" cy="14" r="3" stroke="rgba(100,200,255,0.7)" strokeWidth="1" />
      <circle cx="14" cy="14" r="1" fill="rgba(100,200,255,0.9)" />
    </svg>,
    // 1: Architecture — layers
    <svg key={1} width="28" height="28" viewBox="0 0 28 28" fill="none">
      <rect x="4" y="6" width="20" height="4" rx="0.5" stroke="rgba(180,130,255,0.6)" strokeWidth="1" fill="rgba(180,130,255,0.05)" />
      <rect x="4" y="12" width="20" height="4" rx="0.5" stroke="rgba(180,130,255,0.5)" strokeWidth="1" fill="rgba(180,130,255,0.04)" />
      <rect x="4" y="18" width="20" height="4" rx="0.5" stroke="rgba(180,130,255,0.4)" strokeWidth="1" fill="rgba(180,130,255,0.03)" />
    </svg>,
    // 2: EU AI Act — star shield
    <svg key={2} width="28" height="28" viewBox="0 0 28 28" fill="none">
      <path d="M14 3L17 10H24.5L18.5 14L20.5 21L14 17.5L7.5 21L9.5 14L3.5 10H11L14 3Z" stroke="rgba(255,200,80,0.55)" strokeWidth="1" fill="rgba(255,200,80,0.04)" />
    </svg>,
    // 3: Twin — concentric circles
    <svg key={3} width="28" height="28" viewBox="0 0 28 28" fill="none">
      <circle cx="14" cy="14" r="11" stroke="rgba(0,212,255,0.2)" strokeWidth="0.8" />
      <circle cx="14" cy="14" r="7.5" stroke="rgba(0,212,255,0.35)" strokeWidth="0.8" />
      <circle cx="14" cy="14" r="4" stroke="rgba(0,212,255,0.55)" strokeWidth="0.8" />
      <circle cx="14" cy="14" r="1.5" fill="rgba(0,212,255,0.9)" />
    </svg>,
    // 4: AgentMemory — database
    <svg key={4} width="28" height="28" viewBox="0 0 28 28" fill="none">
      <ellipse cx="14" cy="9" rx="8" ry="3" stroke="rgba(0,255,160,0.5)" strokeWidth="1" />
      <path d="M6 9V19C6 20.7 9.6 22 14 22C18.4 22 22 20.7 22 19V9" stroke="rgba(0,255,160,0.4)" strokeWidth="1" />
      <ellipse cx="14" cy="14" rx="8" ry="2" stroke="rgba(0,255,160,0.3)" strokeWidth="0.8" strokeDasharray="2 2" />
    </svg>,
    // 5: Privacy Guardian — lock
    <svg key={5} width="28" height="28" viewBox="0 0 28 28" fill="none">
      <rect x="7" y="13" width="14" height="11" rx="1" stroke="rgba(0,255,160,0.5)" strokeWidth="1" />
      <path d="M10 13V10C10 7.8 11.8 6 14 6C16.2 6 18 7.8 18 10V13" stroke="rgba(0,255,160,0.4)" strokeWidth="1" strokeLinecap="round" />
      <circle cx="14" cy="19" r="2" stroke="rgba(0,255,160,0.6)" strokeWidth="1" />
    </svg>,
    // 6: Execution Center — play button
    <svg key={6} width="28" height="28" viewBox="0 0 28 28" fill="none">
      <circle cx="14" cy="14" r="10" stroke="rgba(0,255,160,0.4)" strokeWidth="1" />
      <path d="M11 10L20 14L11 18V10Z" stroke="rgba(0,255,160,0.6)" strokeWidth="1" fill="rgba(0,255,160,0.08)" />
    </svg>,
    // 7: Audit Trail — list with check
    <svg key={7} width="28" height="28" viewBox="0 0 28 28" fill="none">
      <rect x="5" y="5" width="18" height="18" rx="1" stroke="rgba(0,255,160,0.35)" strokeWidth="1" />
      <line x1="9" y1="10" x2="19" y2="10" stroke="rgba(0,255,160,0.3)" strokeWidth="0.8" />
      <line x1="9" y1="14" x2="19" y2="14" stroke="rgba(0,255,160,0.25)" strokeWidth="0.8" />
      <line x1="9" y1="18" x2="14" y2="18" stroke="rgba(0,255,160,0.2)" strokeWidth="0.8" />
      <path d="M16 16L18 18L22 13" stroke="rgba(0,255,160,0.7)" strokeWidth="1" strokeLinecap="round" />
    </svg>,
    // 8: Cancel contracts — X
    <svg key={8} width="28" height="28" viewBox="0 0 28 28" fill="none">
      <rect x="6" y="4" width="13" height="16" rx="1" stroke="rgba(255,160,60,0.4)" strokeWidth="1" />
      <line x1="9" y1="9" x2="16" y2="9" stroke="rgba(255,160,60,0.3)" strokeWidth="0.7" />
      <line x1="9" y1="12" x2="16" y2="12" stroke="rgba(255,160,60,0.25)" strokeWidth="0.7" />
      <circle cx="20" cy="20" r="6" fill="#080E1A" stroke="rgba(255,160,60,0.5)" strokeWidth="1" />
      <line x1="17" y1="17" x2="23" y2="23" stroke="rgba(255,160,60,0.8)" strokeWidth="1.2" strokeLinecap="round" />
      <line x1="23" y1="17" x2="17" y2="23" stroke="rgba(255,160,60,0.8)" strokeWidth="1.2" strokeLinecap="round" />
    </svg>,
    // 9: Price increase — arrow up + block
    <svg key={9} width="28" height="28" viewBox="0 0 28 28" fill="none">
      <path d="M14 22V8M8 14L14 8L20 14" stroke="rgba(255,160,60,0.6)" strokeWidth="1.2" strokeLinecap="round" />
      <line x1="5" y1="5" x2="23" y2="23" stroke="rgba(255,80,80,0.35)" strokeWidth="1" strokeLinecap="round" />
    </svg>,
    // 10: Data protection — fingerprint-ish
    <svg key={10} width="28" height="28" viewBox="0 0 28 28" fill="none">
      <path d="M14 6C9.6 6 6 9.6 6 14" stroke="rgba(255,160,60,0.3)" strokeWidth="1" strokeLinecap="round" />
      <path d="M10 14C10 11.8 11.8 10 14 10C16.2 10 18 11.8 18 14" stroke="rgba(255,160,60,0.45)" strokeWidth="1" strokeLinecap="round" />
      <path d="M12 14C12 12.9 12.9 12 14 12C15.1 12 16 12.9 16 14V18" stroke="rgba(255,160,60,0.6)" strokeWidth="1" strokeLinecap="round" />
      <path d="M10 16C10 18.2 11.8 20 14 20" stroke="rgba(255,160,60,0.4)" strokeWidth="1" strokeLinecap="round" />
      <path d="M18 14V16C18 19.3 16 22 14 22" stroke="rgba(255,160,60,0.35)" strokeWidth="1" strokeLinecap="round" />
    </svg>,
    // 11: Finances — chart
    <svg key={11} width="28" height="28" viewBox="0 0 28 28" fill="none">
      <line x1="5" y1="22" x2="23" y2="22" stroke="rgba(255,160,60,0.3)" strokeWidth="0.8" />
      <rect x="7" y="16" width="3" height="6" fill="rgba(255,160,60,0.15)" stroke="rgba(255,160,60,0.4)" strokeWidth="0.8" />
      <rect x="12" y="10" width="3" height="12" fill="rgba(255,160,60,0.2)" stroke="rgba(255,160,60,0.5)" strokeWidth="0.8" />
      <rect x="17" y="6" width="3" height="16" fill="rgba(255,160,60,0.25)" stroke="rgba(255,160,60,0.6)" strokeWidth="0.8" />
    </svg>,
  ];
  return icons[index] ?? null;
}

export default function NexusMapSection() {
  const t = useTranslations("nexus");
  const locale = useLocale();
  const [hoveredModule, setHoveredModule] = useState<number | null>(null);

  return (
    <section
      className="relative py-32 px-6"
      id="nexus"
      style={{
        background: "#0A1220",
        borderTop: "1px solid rgba(255,255,255,0.05)",
      }}
    >
      {/* Blueprint grid */}
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.022) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.022) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />

      <div className="relative z-10 max-w-6xl mx-auto">

        {/* Header */}
        <div className="mb-16">
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="lp-section-tag mb-6"
          >
            {t("tag")}
          </motion.p>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
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
              style={{ fontSize: "0.95rem", color: "rgba(255,255,255,0.4)", maxWidth: 380 }}
            >
              {t("sub")}
            </motion.p>
          </div>
        </div>

        {/* Pillar Guides — Full Width */}
        <div className="mb-3">
          <p style={{ fontFamily: "var(--font-jetbrains, monospace)", fontSize: "0.58rem", letterSpacing: "0.14em", color: "rgba(0,212,255,0.4)", textTransform: "uppercase", marginBottom: "0.75rem" }}>
            {t("categories.pillars")}
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "1px", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.06)" }}>
            {([0, 1, 2, 3] as const).map((i) => {
              const tag = t(`modules.${i}.tag`);
              const style = CATEGORY_STYLES[tag] ?? DEFAULT_STYLE;
              const isHovered = hoveredModule === i;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.05 * i }}
                  onMouseEnter={() => setHoveredModule(i)}
                  onMouseLeave={() => setHoveredModule(null)}
                  style={{ background: isHovered ? style.bg : "#0A1220", transition: "background 0.25s" }}
                >
                  <Link
                    href={`/${locale}${t(`modules.${i}.href`)}`}
                    style={{ display: "flex", flexDirection: "column", gap: "0.5rem", padding: "1.25rem", textDecoration: "none" }}
                  >
                    <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
                      <ModuleIcon index={i} />
                      <ArrowUpRight size={12} style={{ color: isHovered ? style.color : "rgba(255,255,255,0.15)", transition: "color 0.2s" }} />
                    </div>
                    <span style={{ fontFamily: "var(--font-jetbrains, monospace)", fontSize: "0.52rem", letterSpacing: "0.1em", color: style.color, marginTop: "0.5rem" }}>
                      {tag}
                    </span>
                    <span style={{ fontFamily: "var(--font-space-grotesk, sans-serif)", fontWeight: 700, fontSize: "0.9rem", color: isHovered ? "rgba(255,255,255,0.95)" : "rgba(255,255,255,0.7)", lineHeight: 1.3, transition: "color 0.25s" }}>
                      {t(`modules.${i}.title`)}
                    </span>
                    <span style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.3)", lineHeight: 1.4 }}>
                      {t(`modules.${i}.desc`)}
                    </span>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Features + Use Cases side by side */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "0.75rem" }}>

          {/* APEX Feature Modules */}
          <div>
            <p style={{ fontFamily: "var(--font-jetbrains, monospace)", fontSize: "0.58rem", letterSpacing: "0.14em", color: "rgba(0,255,160,0.4)", textTransform: "uppercase", marginBottom: "0.75rem" }}>
              {t("categories.features")}
            </p>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1px", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.06)" }}>
              {([4, 5, 6, 7] as const).map((i) => {
                const tag = t(`modules.${i}.tag`);
                const style = CATEGORY_STYLES[tag] ?? DEFAULT_STYLE;
                const isHovered = hoveredModule === i;
                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.05 * (i - 4) + 0.2 }}
                    onMouseEnter={() => setHoveredModule(i)}
                    onMouseLeave={() => setHoveredModule(null)}
                    style={{ background: isHovered ? style.bg : "#0A1220", transition: "background 0.25s" }}
                  >
                    <Link
                      href={`/${locale}${t(`modules.${i}.href`)}`}
                      style={{ display: "flex", flexDirection: "column", gap: "0.4rem", padding: "1rem", textDecoration: "none" }}
                    >
                      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
                        <ModuleIcon index={i} />
                        <ArrowUpRight size={11} style={{ color: isHovered ? style.color : "rgba(255,255,255,0.12)", transition: "color 0.2s" }} />
                      </div>
                      <span style={{ fontFamily: "var(--font-jetbrains, monospace)", fontSize: "0.5rem", letterSpacing: "0.1em", color: style.color, marginTop: "0.4rem" }}>
                        {tag}
                      </span>
                      <span style={{ fontFamily: "var(--font-space-grotesk, sans-serif)", fontWeight: 700, fontSize: "0.82rem", color: isHovered ? "rgba(255,255,255,0.95)" : "rgba(255,255,255,0.65)", lineHeight: 1.3, transition: "color 0.25s" }}>
                        {t(`modules.${i}.title`)}
                      </span>
                      <span style={{ fontSize: "0.7rem", color: "rgba(255,255,255,0.28)" }}>
                        {t(`modules.${i}.desc`)}
                      </span>
                    </Link>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Use Cases */}
          <div>
            <p style={{ fontFamily: "var(--font-jetbrains, monospace)", fontSize: "0.58rem", letterSpacing: "0.14em", color: "rgba(255,160,60,0.4)", textTransform: "uppercase", marginBottom: "0.75rem" }}>
              {t("categories.usecases")}
            </p>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1px", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.06)" }}>
              {([8, 9, 10, 11] as const).map((i) => {
                const tag = t(`modules.${i}.tag`);
                const style = CATEGORY_STYLES[tag] ?? DEFAULT_STYLE;
                const isHovered = hoveredModule === i;
                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.05 * (i - 8) + 0.3 }}
                    onMouseEnter={() => setHoveredModule(i)}
                    onMouseLeave={() => setHoveredModule(null)}
                    style={{ background: isHovered ? style.bg : "#0A1220", transition: "background 0.25s" }}
                  >
                    <Link
                      href={`/${locale}${t(`modules.${i}.href`)}`}
                      style={{ display: "flex", flexDirection: "column", gap: "0.4rem", padding: "1rem", textDecoration: "none" }}
                    >
                      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
                        <ModuleIcon index={i} />
                        <ArrowUpRight size={11} style={{ color: isHovered ? style.color : "rgba(255,255,255,0.12)", transition: "color 0.2s" }} />
                      </div>
                      <span style={{ fontFamily: "var(--font-jetbrains, monospace)", fontSize: "0.5rem", letterSpacing: "0.1em", color: style.color, marginTop: "0.4rem" }}>
                        {tag}
                      </span>
                      <span style={{ fontFamily: "var(--font-space-grotesk, sans-serif)", fontWeight: 700, fontSize: "0.82rem", color: isHovered ? "rgba(255,255,255,0.95)" : "rgba(255,255,255,0.65)", lineHeight: 1.3, transition: "color 0.25s" }}>
                        {t(`modules.${i}.title`)}
                      </span>
                      <span style={{ fontSize: "0.7rem", color: "rgba(255,255,255,0.28)" }}>
                        {t(`modules.${i}.desc`)}
                      </span>
                    </Link>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Bottom row: Blog + Book */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
          <div>
            <p style={{ fontFamily: "var(--font-jetbrains, monospace)", fontSize: "0.58rem", letterSpacing: "0.14em", color: "rgba(255,255,255,0.2)", textTransform: "uppercase", marginBottom: "0.75rem" }}>
              {t("categories.blog")}
            </p>
            <Link
              href={`/${locale}/blog`}
              style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "1rem 1.25rem", border: "1px solid rgba(255,255,255,0.06)", background: "#0A1220", textDecoration: "none", transition: "background 0.2s" }}
              onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.03)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = "#0A1220"; }}
            >
              <div>
                <span style={{ fontFamily: "var(--font-space-grotesk, sans-serif)", fontWeight: 700, fontSize: "0.88rem", color: "rgba(255,255,255,0.7)", display: "block" }}>Blog & Wissens-Hub</span>
                <span style={{ fontSize: "0.72rem", color: "rgba(255,255,255,0.3)" }}>Vertragsrecht · DSGVO · EU AI Act · Finanzen</span>
              </div>
              <ArrowRight size={14} style={{ color: "rgba(255,255,255,0.3)" }} />
            </Link>
          </div>
          <div>
            <p style={{ fontFamily: "var(--font-jetbrains, monospace)", fontSize: "0.58rem", letterSpacing: "0.14em", color: "rgba(255,255,255,0.2)", textTransform: "uppercase", marginBottom: "0.75rem" }}>
              {t("categories.book")}
            </p>
            <Link
              href={`/${locale}/buch`}
              style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "1rem 1.25rem", border: "1px solid rgba(0,212,255,0.12)", background: "rgba(0,212,255,0.02)", textDecoration: "none", transition: "background 0.2s" }}
              onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(0,212,255,0.05)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(0,212,255,0.02)"; }}
            >
              <div>
                <span style={{ fontFamily: "var(--font-space-grotesk, sans-serif)", fontWeight: 700, fontSize: "0.88rem", color: "rgba(0,212,255,0.85)", display: "block" }}>SOVEREIGN MARKETING</span>
                <span style={{ fontSize: "0.72rem", color: "rgba(255,255,255,0.3)" }}>18 Kapitel · Maximum Excellence Edition · 2026</span>
              </div>
              <ArrowRight size={14} style={{ color: "rgba(0,212,255,0.5)" }} />
            </Link>
          </div>
        </div>

        {/* Explore All CTA */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-10 flex justify-center"
        >
          <div style={{ display: "flex", alignItems: "center", gap: 6, fontFamily: "var(--font-jetbrains, monospace)", fontSize: "0.6rem", letterSpacing: "0.12em", color: "rgba(255,255,255,0.2)" }}>
            <span style={{ width: 32, height: 1, background: "rgba(255,255,255,0.1)", display: "inline-block" }} />
            12 MODULE · 6 PILLAR GUIDES · 30+ ARTIKEL · 1 BUCH
            <span style={{ width: 32, height: 1, background: "rgba(255,255,255,0.1)", display: "inline-block" }} />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
