"use client";

import { motion } from "framer-motion";
import { Check, X } from "lucide-react";
import { useTranslations } from "next-intl";

const rowKeys = ["ownership", "ai", "audit", "infra", "autonomy", "compliance", "exit", "cost"] as const;

export default function ComparisonSection() {
  const t = useTranslations("comparison");

  return (
    <section
      className="relative py-32 px-6"
      id="security"
      style={{
        background: "#0D1526",
        borderTop: "1px solid rgba(255,255,255,0.05)",
      }}
    >
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />

      <div className="relative z-10 max-w-5xl mx-auto">

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
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="flex items-center gap-6 flex-wrap"
          >
            <h2
              className="lp-headline"
              style={{ fontSize: "clamp(2.2rem, 5vw, 3.8rem)" }}
            >
              <span style={{ color: "rgba(0,212,255,0.9)" }}>{t("headline1")}</span>
              <span style={{ color: "rgba(255,255,255,0.2)", marginInline: "0.5rem" }}>{t("vs")}</span>
              <span style={{ color: "rgba(255,255,255,0.4)" }}>{t("headline2")}</span>
            </h2>
          </motion.div>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            style={{ marginTop: "1rem", fontSize: "1rem", color: "rgba(255,255,255,0.4)", maxWidth: 480 }}
          >
            {t("sub")}
          </motion.p>
        </div>

        {/* Comparison table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.15 }}
          style={{ border: "1px solid rgba(255,255,255,0.07)" }}
        >
          {/* Column headers */}
          <div
            className="grid"
            style={{
              gridTemplateColumns: "1fr 1fr 1fr",
              borderBottom: "1px solid rgba(255,255,255,0.07)",
            }}
          >
            <div
              className="p-5"
              style={{
                fontFamily: "var(--font-jetbrains, monospace)",
                fontSize: "0.6rem",
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                color: "rgba(255,255,255,0.2)",
              }}
            />
            <div
              className="p-5"
              style={{
                borderLeft: "1px solid rgba(0,212,255,0.15)",
                background: "rgba(0,212,255,0.04)",
              }}
            >
              <span
                style={{
                  fontFamily: "var(--font-space-grotesk, sans-serif)",
                  fontWeight: 800,
                  fontSize: "0.9rem",
                  letterSpacing: "0.04em",
                  color: "rgba(0,212,255,0.9)",
                }}
              >
                {t("headline1")}
              </span>
            </div>
            <div
              className="p-5"
              style={{ borderLeft: "1px solid rgba(255,255,255,0.06)" }}
            >
              <span
                style={{
                  fontFamily: "var(--font-space-grotesk, sans-serif)",
                  fontWeight: 600,
                  fontSize: "0.9rem",
                  color: "rgba(255,255,255,0.25)",
                }}
              >
                {t("headline2")}
              </span>
            </div>
          </div>

          {/* Rows */}
          {rowKeys.map((key, i) => (
            <motion.div
              key={key}
              initial={{ opacity: 0, x: -8 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.05 * i }}
              className="grid transition-colors duration-200"
              style={{
                gridTemplateColumns: "1fr 1fr 1fr",
                borderBottom: i < rowKeys.length - 1 ? "1px solid rgba(255,255,255,0.05)" : "none",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.01)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
            >
              <div
                className="p-5 flex items-center"
                style={{
                  fontFamily: "var(--font-jetbrains, monospace)",
                  fontSize: "0.7rem",
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  color: "rgba(255,255,255,0.35)",
                }}
              >
                {t(`rows.${key}.label`)}
              </div>
              <div
                className="p-5 flex items-center gap-3"
                style={{
                  borderLeft: "1px solid rgba(0,212,255,0.12)",
                  background: "rgba(0,212,255,0.025)",
                }}
              >
                <Check size={14} style={{ color: "#00D4FF", flexShrink: 0 }} />
                <span style={{ fontSize: "0.85rem", color: "rgba(255,255,255,0.75)" }}>
                  {t(`rows.${key}.sovereign`)}
                </span>
              </div>
              <div
                className="p-5 flex items-center gap-3"
                style={{ borderLeft: "1px solid rgba(255,255,255,0.05)" }}
              >
                <X size={14} style={{ color: "rgba(255,255,255,0.2)", flexShrink: 0 }} />
                <span style={{ fontSize: "0.85rem", color: "rgba(255,255,255,0.28)" }}>
                  {t(`rows.${key}.saas`)}
                </span>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Score row */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="grid mt-0"
          style={{
            gridTemplateColumns: "1fr 1fr 1fr",
            border: "1px solid rgba(255,255,255,0.07)",
            borderTop: "none",
          }}
        >
          <div className="p-5" />
          <div
            className="p-5 flex items-center gap-3"
            style={{
              borderLeft: "1px solid rgba(0,212,255,0.15)",
              background: "rgba(0,212,255,0.06)",
            }}
          >
            <div
              style={{
                fontFamily: "var(--font-jetbrains, monospace)",
                fontSize: "0.6rem",
                letterSpacing: "0.1em",
                color: "rgba(0,212,255,0.6)",
                textTransform: "uppercase",
              }}
            >
              Score
            </div>
            <div
              style={{
                fontFamily: "var(--font-space-grotesk, sans-serif)",
                fontWeight: 900,
                fontSize: "1.4rem",
                color: "#00D4FF",
                letterSpacing: "-0.02em",
              }}
            >
              8 / 8
            </div>
          </div>
          <div
            className="p-5 flex items-center gap-3"
            style={{ borderLeft: "1px solid rgba(255,255,255,0.05)" }}
          >
            <div
              style={{
                fontFamily: "var(--font-jetbrains, monospace)",
                fontSize: "0.6rem",
                letterSpacing: "0.1em",
                color: "rgba(255,255,255,0.2)",
                textTransform: "uppercase",
              }}
            >
              Score
            </div>
            <div
              style={{
                fontFamily: "var(--font-space-grotesk, sans-serif)",
                fontWeight: 900,
                fontSize: "1.4rem",
                color: "rgba(255,255,255,0.2)",
                letterSpacing: "-0.02em",
              }}
            >
              0 / 8
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
