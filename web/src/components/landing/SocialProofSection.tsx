"use client";

import React from "react";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { Star, ShieldCheck } from "lucide-react";

const STAT_KEYS = [0, 1, 2, 3] as const;
const TESTIMONIAL_KEYS = [0, 1, 2] as const;
const BADGE_KEYS = [0, 1, 2, 3, 4, 5] as const;

// Tech stack SVG icons (inline, blueprint aesthetic)
function TechIcon({ name }: { name: string }) {
  const icons: Record<string, React.ReactElement> = {
    "Google Cloud": (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <path d="M12 6.5L16.5 9.25V14.75L12 17.5L7.5 14.75V9.25L12 6.5Z" stroke="rgba(0,212,255,0.6)" strokeWidth="1.2" />
        <circle cx="12" cy="12" r="10" stroke="rgba(0,212,255,0.25)" strokeWidth="0.8" />
      </svg>
    ),
    "Vertex AI": (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <path d="M12 3L21 8V16L12 21L3 16V8L12 3Z" stroke="rgba(0,212,255,0.6)" strokeWidth="1.2" />
        <path d="M12 8V16M8 10L16 14M16 10L8 14" stroke="rgba(0,212,255,0.4)" strokeWidth="0.8" />
      </svg>
    ),
    "Gemini 2.5 Flash": (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <polygon points="12,2 15,9 22,9 16,14 18,21 12,17 6,21 8,14 2,9 9,9" stroke="rgba(0,212,255,0.6)" strokeWidth="1.2" fill="none" />
      </svg>
    ),
    Firebase: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <path d="M5 20L8 8L12 12L16 4L19 20H5Z" stroke="rgba(0,212,255,0.6)" strokeWidth="1.2" />
      </svg>
    ),
    "finAPI PSD2": (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <rect x="3" y="6" width="18" height="13" rx="2" stroke="rgba(0,212,255,0.6)" strokeWidth="1.2" />
        <path d="M3 10H21" stroke="rgba(0,212,255,0.4)" strokeWidth="0.8" />
        <circle cx="7" cy="15" r="1.5" fill="rgba(0,212,255,0.5)" />
      </svg>
    ),
    "EU AI Act": (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <path d="M12 2L15.5 7H20.5L17 11L18.5 16.5L12 14L5.5 16.5L7 11L3.5 7H8.5L12 2Z" stroke="rgba(0,212,255,0.6)" strokeWidth="1.2" fill="none" />
      </svg>
    ),
  };
  return icons[name] ?? null;
}

export default function SocialProofSection() {
  const t = useTranslations("socialProof");

  return (
    <section
      className="relative py-32 px-6 overflow-hidden"
      id="vertrauen"
      style={{
        background: "#0D1526",
        borderTop: "1px solid rgba(255,255,255,0.05)",
      }}
    >
      {/* Blueprint grid */}
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
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
            {t("headline1")}&nbsp;
            <span style={{ color: "rgba(0,212,255,0.9)" }}>{t("headline2")}</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            style={{ marginTop: "1rem", fontSize: "1rem", color: "rgba(255,255,255,0.4)", maxWidth: 520, margin: "1rem auto 0" }}
          >
            {t("sub")}
          </motion.p>
        </div>

        {/* Stats row */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.15 }}
          className="grid grid-cols-2 md:grid-cols-4 mb-16"
          style={{ border: "1px solid rgba(255,255,255,0.07)" }}
        >
          {STAT_KEYS.map((i) => (
            <div
              key={i}
              className="flex flex-col items-center justify-center py-8 px-4"
              style={{
                borderRight: i < 3 ? "1px solid rgba(255,255,255,0.07)" : "none",
              }}
            >
              <div
                className="lp-stat-number"
                style={{ fontSize: "2.2rem", lineHeight: 1, marginBottom: 6 }}
              >
                {t(`stats.${i}.value`)}
                <span style={{ fontSize: "1rem", color: "rgba(0,212,255,0.7)" }}>
                  {t(`stats.${i}.suffix`)}
                </span>
              </div>
              <div
                style={{
                  fontFamily: "var(--font-jetbrains, monospace)",
                  fontSize: "0.6rem",
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  color: "rgba(255,255,255,0.3)",
                  textAlign: "center",
                }}
              >
                {t(`stats.${i}.label`)}
              </div>
            </div>
          ))}
        </motion.div>

        {/* Testimonials */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-0 mb-16" style={{ border: "1px solid rgba(255,255,255,0.07)" }}>
          {TESTIMONIAL_KEYS.map((i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 * i }}
              className="flex flex-col p-8 transition-all duration-300"
              style={{
                borderRight: i < 2 ? "1px solid rgba(255,255,255,0.07)" : "none",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(0,212,255,0.02)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
            >
              {/* Stars */}
              <div className="flex gap-1 mb-5">
                {[0, 1, 2, 3, 4].map((s) => (
                  <Star key={s} size={12} fill="rgba(0,212,255,0.7)" color="transparent" />
                ))}
              </div>

              {/* Quote */}
              <blockquote
                style={{
                  fontSize: "0.9rem",
                  lineHeight: 1.7,
                  color: "rgba(255,255,255,0.65)",
                  fontStyle: "italic",
                  flex: 1,
                  marginBottom: "1.5rem",
                  quotes: 'none',
                }}
              >
                „{t(`testimonials.${i}.quote`)}"
              </blockquote>

              {/* Author */}
              <div className="flex items-center justify-between">
                <div>
                  <div
                    style={{
                      fontFamily: "var(--font-space-grotesk, sans-serif)",
                      fontWeight: 700,
                      fontSize: "0.85rem",
                      color: "rgba(255,255,255,0.85)",
                    }}
                  >
                    {t(`testimonials.${i}.name`)}
                  </div>
                  <div
                    style={{
                      fontFamily: "var(--font-jetbrains, monospace)",
                      fontSize: "0.6rem",
                      color: "rgba(255,255,255,0.3)",
                      letterSpacing: "0.06em",
                      marginTop: 2,
                    }}
                  >
                    {t(`testimonials.${i}.role`)}
                  </div>
                </div>
                <span
                  className="lp-badge"
                  style={{ fontSize: "0.55rem" }}
                >
                  {t(`testimonials.${i}.tier`)}
                </span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Tech stack badges */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="flex flex-col items-center gap-6"
        >
          <span
            style={{
              fontFamily: "var(--font-jetbrains, monospace)",
              fontSize: "0.6rem",
              letterSpacing: "0.15em",
              color: "rgba(255,255,255,0.2)",
              textTransform: "uppercase",
            }}
          >
            Technology Stack
          </span>

          <div className="flex flex-wrap justify-center gap-4">
            {BADGE_KEYS.map((i) => {
              const name = t(`techBadges.${i}`);
              return (
                <div
                  key={i}
                  className="flex items-center gap-2 px-4 py-2"
                  style={{
                    border: "1px solid rgba(255,255,255,0.07)",
                    background: "rgba(255,255,255,0.02)",
                    fontFamily: "var(--font-space-grotesk, sans-serif)",
                    fontSize: "0.78rem",
                    fontWeight: 600,
                    color: "rgba(255,255,255,0.45)",
                    letterSpacing: "0.02em",
                  }}
                >
                  <TechIcon name={name} />
                  {name}
                </div>
              );
            })}
          </div>

          <div className="flex items-center gap-2">
            <ShieldCheck size={14} style={{ color: "rgba(0,212,255,0.6)" }} />
            <span
              style={{
                fontFamily: "var(--font-jetbrains, monospace)",
                fontSize: "0.62rem",
                letterSpacing: "0.1em",
                color: "rgba(0,212,255,0.5)",
              }}
            >
              {t("compliance")}
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
