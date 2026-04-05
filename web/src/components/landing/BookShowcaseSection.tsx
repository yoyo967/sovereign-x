"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useTranslations, useLocale } from "next-intl";
import Link from "next/link";
import { ArrowRight, BookOpen } from "lucide-react";

const CHAPTER_KEYS = [0, 1, 2, 3] as const;

// Animated book cover SVG
function BookCoverSVG() {
  return (
    <svg
      width="220"
      height="300"
      viewBox="0 0 220 300"
      fill="none"
      style={{ filter: "drop-shadow(0 20px 60px rgba(0,212,255,0.12))" }}
    >
      {/* Book shadow */}
      <rect x="18" y="8" width="196" height="288" rx="3" fill="rgba(0,0,0,0.5)" />
      {/* Book body */}
      <rect x="14" y="4" width="196" height="288" rx="3" fill="#080E1A" stroke="rgba(0,212,255,0.2)" strokeWidth="1" />
      {/* Spine */}
      <rect x="14" y="4" width="18" height="288" rx="2" fill="rgba(0,212,255,0.06)" stroke="rgba(0,212,255,0.15)" strokeWidth="1" />
      {/* Spine detail lines */}
      <line x1="14" y1="60" x2="32" y2="60" stroke="rgba(0,212,255,0.12)" strokeWidth="0.5" />
      <line x1="14" y1="240" x2="32" y2="240" stroke="rgba(0,212,255,0.12)" strokeWidth="0.5" />
      {/* Grid pattern on cover */}
      <defs>
        <pattern id="bookgrid" x="0" y="0" width="16" height="16" patternUnits="userSpaceOnUse">
          <line x1="0" y1="0" x2="16" y2="0" stroke="rgba(0,212,255,0.04)" strokeWidth="0.5" />
          <line x1="0" y1="0" x2="0" y2="16" stroke="rgba(0,212,255,0.04)" strokeWidth="0.5" />
        </pattern>
      </defs>
      <rect x="32" y="4" width="178" height="288" fill="url(#bookgrid)" />
      {/* Iris logo on cover */}
      <g transform="translate(110, 80)">
        <circle cx="0" cy="0" r="32" stroke="rgba(0,212,255,0.12)" strokeWidth="0.8" />
        <circle cx="0" cy="0" r="22" stroke="rgba(0,212,255,0.18)" strokeWidth="0.8" />
        <circle cx="0" cy="0" r="13" stroke="rgba(0,212,255,0.28)" strokeWidth="0.8" />
        <circle cx="0" cy="0" r="6" stroke="rgba(0,212,255,0.45)" strokeWidth="1" />
        <circle cx="0" cy="0" r="2.5" fill="rgba(0,212,255,0.9)" />
        {/* Iris blades */}
        {Array.from({ length: 8 }).map((_, i) => {
          const angle = (i * 45 * Math.PI) / 180;
          const x1 = Math.cos(angle) * 8;
          const y1 = Math.sin(angle) * 8;
          const x2 = Math.cos(angle) * 30;
          const y2 = Math.sin(angle) * 30;
          return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="rgba(0,212,255,0.12)" strokeWidth="0.8" />;
        })}
      </g>
      {/* Title area */}
      <rect x="42" y="144" width="158" height="2" fill="rgba(0,212,255,0.15)" />
      <text x="121" y="168" textAnchor="middle" fill="rgba(255,255,255,0.9)" fontSize="11" fontFamily="monospace" letterSpacing="3" fontWeight="700">SOVEREIGN</text>
      <text x="121" y="184" textAnchor="middle" fill="rgba(255,255,255,0.9)" fontSize="11" fontFamily="monospace" letterSpacing="3" fontWeight="700">MARKETING</text>
      <rect x="42" y="192" width="158" height="1" fill="rgba(0,212,255,0.1)" />
      <text x="121" y="210" textAnchor="middle" fill="rgba(0,212,255,0.6)" fontSize="7" fontFamily="monospace" letterSpacing="2">DAS HANDBUCH</text>
      <text x="121" y="224" textAnchor="middle" fill="rgba(255,255,255,0.35)" fontSize="6" fontFamily="monospace" letterSpacing="1.5">FÜR ONLINE MARKETING MANAGER</text>
      {/* Edition badge */}
      <rect x="62" y="245" width="116" height="20" rx="1" fill="rgba(0,212,255,0.08)" stroke="rgba(0,212,255,0.2)" strokeWidth="0.8" />
      <text x="120" y="259" textAnchor="middle" fill="rgba(0,212,255,0.7)" fontSize="6.5" fontFamily="monospace" letterSpacing="1.5">MAXIMUM EXCELLENCE EDITION</text>
      {/* Bottom strip */}
      <rect x="32" y="278" width="178" height="14" fill="rgba(0,212,255,0.05)" />
      <text x="121" y="288" textAnchor="middle" fill="rgba(0,212,255,0.4)" fontSize="6" fontFamily="monospace" letterSpacing="2">EU-FIRST · BERLIN · 2025–2030</text>
    </svg>
  );
}

export default function BookShowcaseSection() {
  const t = useTranslations("book");
  const locale = useLocale();
  const [hoveredChapter, setHoveredChapter] = useState<number | null>(null);

  return (
    <section
      className="relative py-32 px-6"
      id="buch"
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
            "linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />

      {/* Subtle top glow */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 pointer-events-none z-0"
        style={{
          width: 600,
          height: 200,
          background: "radial-gradient(ellipse at center top, rgba(0,212,255,0.05) 0%, transparent 70%)",
        }}
      />

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
        </div>

        {/* Main content: Book + Info */}
        <div className="flex flex-col lg:flex-row gap-16 items-start">

          {/* Book Cover */}
          <motion.div
            initial={{ opacity: 0, x: -24, rotateY: -10 }}
            whileInView={{ opacity: 1, x: 0, rotateY: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="flex-shrink-0 flex flex-col items-center gap-6"
          >
            <BookCoverSVG />
            {/* Edition badge */}
            <div
              className="lp-badge"
              style={{
                fontSize: "0.55rem",
                color: "rgba(0,212,255,0.8)",
                borderColor: "rgba(0,212,255,0.25)",
                background: "rgba(0,212,255,0.06)",
                letterSpacing: "0.15em",
              }}
            >
              {t("badge")}
            </div>
          </motion.div>

          {/* Info */}
          <div className="flex-1">
            {/* Sub */}
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.15 }}
              style={{
                fontSize: "1.05rem",
                lineHeight: 1.75,
                color: "rgba(255,255,255,0.5)",
                marginBottom: "2.5rem",
                maxWidth: 560,
              }}
            >
              {t("sub")}
            </motion.p>

            {/* Chapter previews */}
            <div style={{ display: "flex", flexDirection: "column", gap: "1px", marginBottom: "2.5rem" }}>
              {CHAPTER_KEYS.map((i) => {
                const isHovered = hoveredChapter === i;
                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.1 * i + 0.2 }}
                    onMouseEnter={() => setHoveredChapter(i)}
                    onMouseLeave={() => setHoveredChapter(null)}
                    style={{
                      display: "flex",
                      gap: "1.5rem",
                      padding: "1.25rem 1.5rem",
                      background: isHovered ? "rgba(0,212,255,0.04)" : "rgba(255,255,255,0.02)",
                      border: `1px solid ${isHovered ? "rgba(0,212,255,0.15)" : "rgba(255,255,255,0.05)"}`,
                      transition: "background 0.25s, border-color 0.25s",
                      cursor: "default",
                    }}
                  >
                    {/* Part badge */}
                    <div style={{ display: "flex", flexDirection: "column", gap: "0.2rem", minWidth: 64 }}>
                      <span style={{ fontFamily: "var(--font-jetbrains, monospace)", fontSize: "0.52rem", letterSpacing: "0.1em", color: "rgba(0,212,255,0.5)", textTransform: "uppercase" }}>
                        {t(`chapters.${i}.part`)}
                      </span>
                      <span style={{ fontFamily: "var(--font-jetbrains, monospace)", fontSize: "0.58rem", color: "rgba(255,255,255,0.25)" }}>
                        {t(`chapters.${i}.chapters`)}
                      </span>
                    </div>

                    {/* Title + hook */}
                    <div style={{ flex: 1 }}>
                      <span style={{ fontFamily: "var(--font-space-grotesk, sans-serif)", fontWeight: 700, fontSize: "0.92rem", color: isHovered ? "rgba(255,255,255,0.95)" : "rgba(255,255,255,0.75)", display: "block", marginBottom: "0.3rem", transition: "color 0.25s" }}>
                        {t(`chapters.${i}.title`)}
                      </span>
                      <span style={{ fontSize: "0.8rem", color: isHovered ? "rgba(255,255,255,0.5)" : "rgba(255,255,255,0.3)", fontStyle: "italic", transition: "color 0.25s" }}>
                        {t(`chapters.${i}.hook`)}
                      </span>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Stats row */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(3, 1fr)",
                borderTop: "1px solid rgba(255,255,255,0.06)",
                borderBottom: "1px solid rgba(255,255,255,0.06)",
                marginBottom: "2.5rem",
              }}
            >
              {[
                { value: "18", label: "Kapitel" },
                { value: "4", label: "Teile" },
                { value: "EU-First", label: "Prüfrahmen" },
              ].map((stat, i) => (
                <div
                  key={i}
                  style={{
                    padding: "1.25rem 0",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    borderRight: i < 2 ? "1px solid rgba(255,255,255,0.06)" : "none",
                  }}
                >
                  <span
                    style={{
                      fontFamily: "var(--font-space-grotesk, sans-serif)",
                      fontWeight: 800,
                      fontSize: "1.8rem",
                      color: "rgba(0,212,255,0.85)",
                      lineHeight: 1,
                    }}
                  >
                    {stat.value}
                  </span>
                  <span
                    style={{
                      fontFamily: "var(--font-jetbrains, monospace)",
                      fontSize: "0.58rem",
                      letterSpacing: "0.1em",
                      color: "rgba(255,255,255,0.3)",
                      textTransform: "uppercase",
                      marginTop: 4,
                    }}
                  >
                    {stat.label}
                  </span>
                </div>
              ))}
            </div>

            {/* CTAs */}
            <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
              <Link href={`/${locale}/buch`} className="lp-btn-primary" style={{ gap: 8 }}>
                <BookOpen size={14} />
                {t("cta")}
              </Link>
              <Link href={`/${locale}/blog`} className="lp-btn-secondary" style={{ gap: 8 }}>
                {t("ctaSecondary")}
                <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
