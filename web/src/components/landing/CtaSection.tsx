"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

export default function CtaSection() {
  const t = useTranslations("manifest");

  const lines = [0, 1, 2, 3, 4] as const;

  return (
    <section
      className="relative py-40 px-6 overflow-hidden"
      style={{
        background: "#080E1A",
        borderTop: "1px solid rgba(255,255,255,0.05)",
      }}
    >
      {/* Blueprint grid — fine */}
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }}
      />

      {/* Radial glow */}
      <div
        className="absolute z-0 pointer-events-none"
        style={{
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 800,
          height: 600,
          borderRadius: "50%",
          background: "radial-gradient(ellipse, rgba(0,212,255,0.07) 0%, transparent 65%)",
          filter: "blur(80px)",
        }}
      />

      <div className="relative z-10 max-w-5xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">

          {/* Left: headline */}
          <div>
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="lp-section-tag mb-8"
            >
              {t("tag")}
            </motion.p>
            <motion.h2
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="lp-headline mb-12"
              style={{ fontSize: "clamp(3rem, 7vw, 5.5rem)", lineHeight: 0.95 }}
            >
              {t("headline1")}<br />
              <span style={{ color: "rgba(0,212,255,0.9)" }}>{t("headline2")}</span>
            </motion.h2>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.25 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <Link href="/dashboard" className="lp-btn-primary">
                {t("cta.primary")}
                <ChevronRight size={16} />
              </Link>
              <Link href="mailto:hello@sovereign.de" className="lp-btn-secondary">
                {t("cta.secondary")}
              </Link>
            </motion.div>
          </div>

          {/* Right: declaration lines */}
          <div
            style={{
              border: "1px solid rgba(255,255,255,0.07)",
              padding: "2.5rem",
            }}
          >
            {/* Header of the declaration block */}
            <div
              className="lp-badge mb-8"
              style={{ display: "inline-flex" }}
            >
              THE 2030 DECLARATION
            </div>

            <div className="flex flex-col gap-0">
              {lines.map((i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: 16 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.08 * i }}
                  className="flex items-center gap-4 py-4"
                  style={{
                    borderBottom: i < 4 ? "1px solid rgba(255,255,255,0.05)" : "none",
                  }}
                >
                  <span
                    style={{
                      fontFamily: "var(--font-jetbrains, monospace)",
                      fontSize: "0.62rem",
                      color: "rgba(0,212,255,0.4)",
                      letterSpacing: "0.1em",
                      minWidth: 24,
                    }}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span
                    style={{
                      fontFamily: "var(--font-space-grotesk, sans-serif)",
                      fontSize: "1.05rem",
                      fontWeight: 600,
                      color: i === 4 ? "rgba(0,212,255,0.9)" : "rgba(255,255,255,0.75)",
                      letterSpacing: "-0.01em",
                    }}
                  >
                    {t(`lines.${i}`)}
                  </span>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
