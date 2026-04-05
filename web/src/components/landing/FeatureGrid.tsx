"use client";

import { motion } from "framer-motion";
import { Database, ShieldAlert, Cpu, ScrollText } from "lucide-react";
import { useTranslations } from "next-intl";

const icons = [
  <Database size={20} strokeWidth={1.5} key="db" />,
  <ShieldAlert size={20} strokeWidth={1.5} key="shield" />,
  <Cpu size={20} strokeWidth={1.5} key="cpu" />,
  <ScrollText size={20} strokeWidth={1.5} key="scroll" />,
];

export default function FeatureGrid() {
  const t = useTranslations("features");
  const items = [0, 1, 2, 3] as const;

  return (
    <section
      className="relative py-32 px-6"
      id="features"
      style={{
        background: "#0D1526",
        borderTop: "1px solid rgba(255,255,255,0.05)",
      }}
    >
      {/* Grid bg */}
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />

      <div className="relative z-10 max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-20 max-w-2xl">
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
            className="lp-headline mb-6"
            style={{ fontSize: "clamp(2.2rem, 5vw, 3.8rem)" }}
          >
            {t("headline1")}<br />{t("headline2")}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            style={{ fontSize: "1.05rem", lineHeight: 1.75, color: "rgba(255,255,255,0.45)" }}
          >
            {t("sub")}
          </motion.p>
        </div>

        {/* Architecture layers — full width stacked */}
        <div className="flex flex-col gap-0" style={{ border: "1px solid rgba(255,255,255,0.07)" }}>
          {items.map((i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="group relative flex flex-col md:flex-row items-start gap-8 p-10 transition-all duration-300"
              style={{
                borderBottom: i < 3 ? "1px solid rgba(255,255,255,0.07)" : "none",
                background: "transparent",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(0,212,255,0.03)";
                e.currentTarget.style.borderLeftColor = "rgba(0,212,255,0.5)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "transparent";
              }}
            >
              {/* Left: index */}
              <div
                style={{
                  minWidth: 80,
                  fontFamily: "var(--font-jetbrains, monospace)",
                  fontSize: "2.5rem",
                  fontWeight: 500,
                  color: "rgba(255,255,255,0.08)",
                  lineHeight: 1,
                  transition: "color 0.3s",
                }}
                className="group-hover:text-[rgba(0,212,255,0.2)]"
              >
                {t(`items.${i}.index`)}
              </div>

              {/* Center: icon + titles */}
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <div
                    style={{
                      color: "rgba(0,212,255,0.6)",
                      padding: "8px",
                      border: "1px solid rgba(0,212,255,0.15)",
                      background: "rgba(0,212,255,0.04)",
                    }}
                  >
                    {icons[i]}
                  </div>
                  <div>
                    <h3
                      style={{
                        fontFamily: "var(--font-space-grotesk, sans-serif)",
                        fontWeight: 700,
                        fontSize: "1.1rem",
                        color: "rgba(255,255,255,0.95)",
                        letterSpacing: "-0.01em",
                      }}
                    >
                      {t(`items.${i}.title`)}
                    </h3>
                    <p
                      style={{
                        fontFamily: "var(--font-space-grotesk, sans-serif)",
                        fontSize: "0.78rem",
                        color: "rgba(255,255,255,0.35)",
                        fontWeight: 500,
                      }}
                    >
                      {t(`items.${i}.subtitle`)}
                    </p>
                  </div>
                </div>
                <p
                  style={{
                    fontSize: "0.9rem",
                    lineHeight: 1.7,
                    color: "rgba(255,255,255,0.45)",
                    maxWidth: 560,
                  }}
                >
                  {t(`items.${i}.description`)}
                </p>
              </div>

              {/* Right: tag */}
              <div
                className="lp-badge"
                style={{
                  alignSelf: "flex-start",
                  marginTop: 4,
                  whiteSpace: "nowrap",
                }}
              >
                {t(`items.${i}.tag`)}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
