"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";

export default function TrustBanner() {
  const t = useTranslations("problem");

  const stats = [
    { stat: t("items.0.stat"), label: t("items.0.label") },
    { stat: t("items.1.stat"), label: t("items.1.label") },
    { stat: t("items.2.stat"), label: t("items.2.label") },
  ];

  return (
    <section
      className="relative py-32 px-6 overflow-hidden"
      id="problem"
      style={{ background: "#0A1220", borderTop: "1px solid rgba(255,255,255,0.05)" }}
    >
      {/* Blueprint grid */}
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }}
      />

      <div className="relative z-10 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

          {/* Left: copy */}
          <div>
            <motion.p
              initial={{ opacity: 0, y: 16 }}
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
              style={{ fontSize: "clamp(2.2rem, 5vw, 3.5rem)" }}
            >
              {t("headline1")}<br />
              <span style={{ color: "rgba(0,212,255,0.85)" }}>{t("headline2")}</span>
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              style={{ fontSize: "1.05rem", lineHeight: 1.75, color: "rgba(255,255,255,0.5)", marginBottom: "2rem", maxWidth: 480 }}
            >
              {t("sub")}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="lp-badge lp-badge-active"
              style={{ display: "inline-flex" }}
            >
              <span className="lp-badge-dot" />
              {t("solution")}
            </motion.div>
          </div>

          {/* Right: stats */}
          <div className="flex flex-col gap-0" style={{ borderLeft: "1px solid rgba(255,255,255,0.06)" }}>
            {stats.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 * i }}
                className="flex items-center gap-8 px-10 py-8"
                style={{
                  borderBottom: i < 2 ? "1px solid rgba(255,255,255,0.05)" : "none",
                }}
              >
                <div
                  className="lp-stat-number"
                  style={{ fontSize: "3rem", color: i === 2 ? "rgba(255,255,255,0.95)" : "rgba(0,212,255,0.9)", minWidth: 120, textAlign: "right" }}
                >
                  {item.stat}
                </div>
                <p
                  style={{
                    fontFamily: "var(--font-space-grotesk, sans-serif)",
                    fontSize: "0.9rem",
                    color: "rgba(255,255,255,0.5)",
                    lineHeight: 1.5,
                  }}
                >
                  {item.label}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
