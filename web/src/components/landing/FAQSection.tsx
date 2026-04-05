"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus } from "lucide-react";
import { useTranslations } from "next-intl";
import JsonLd from "@/components/SEO/JsonLd";

const ITEM_KEYS = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9] as const;

export default function FAQSection() {
  const t = useTranslations("faq");
  const [open, setOpen] = useState<number | null>(null);

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: ITEM_KEYS.map((i) => ({
      "@type": "Question",
      name: t(`items.${i}.q`),
      acceptedAnswer: {
        "@type": "Answer",
        text: t(`items.${i}.a`),
      },
    })),
  };

  return (
    <section
      className="relative py-32 px-6"
      id="faq"
      style={{
        background: "#0A1220",
        borderTop: "1px solid rgba(255,255,255,0.05)",
      }}
    >
      <JsonLd data={faqJsonLd} />

      {/* Blueprint grid */}
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />

      <div className="relative z-10 max-w-4xl mx-auto">
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
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="lp-headline mb-4"
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
            style={{ fontSize: "1rem", color: "rgba(255,255,255,0.4)", maxWidth: 560 }}
          >
            {t("sub")}
          </motion.p>
        </div>

        {/* FAQ Items */}
        <div style={{ border: "1px solid rgba(255,255,255,0.07)" }}>
          {ITEM_KEYS.map((i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.04 * i }}
              style={{
                borderBottom: i < ITEM_KEYS.length - 1 ? "1px solid rgba(255,255,255,0.05)" : "none",
              }}
            >
              {/* Question button */}
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="w-full flex items-start justify-between gap-6 p-6 text-left transition-colors duration-200"
                style={{
                  background: open === i ? "rgba(0,212,255,0.03)" : "transparent",
                  cursor: "pointer",
                  border: "none",
                }}
                aria-expanded={open === i}
              >
                <div className="flex items-start gap-4">
                  <span
                    style={{
                      fontFamily: "var(--font-jetbrains, monospace)",
                      fontSize: "0.6rem",
                      color: "rgba(0,212,255,0.4)",
                      letterSpacing: "0.1em",
                      marginTop: 4,
                      minWidth: 20,
                      flexShrink: 0,
                    }}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  {/* Question text — used as H3 for SEO */}
                  <h3
                    style={{
                      fontFamily: "var(--font-space-grotesk, sans-serif)",
                      fontSize: "1rem",
                      fontWeight: 600,
                      color: open === i ? "rgba(0,212,255,0.9)" : "rgba(255,255,255,0.85)",
                      lineHeight: 1.5,
                      margin: 0,
                      transition: "color 0.2s",
                    }}
                  >
                    {t(`items.${i}.q`)}
                  </h3>
                </div>
                <div
                  style={{
                    flexShrink: 0,
                    color: open === i ? "rgba(0,212,255,0.7)" : "rgba(255,255,255,0.3)",
                    transition: "color 0.2s",
                    marginTop: 2,
                  }}
                >
                  {open === i ? <Minus size={16} /> : <Plus size={16} />}
                </div>
              </button>

              {/* Answer */}
              <AnimatePresence>
                {open === i && (
                  <motion.div
                    key="answer"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25, ease: "easeInOut" }}
                    style={{ overflow: "hidden" }}
                  >
                    <div
                      className="pl-14 pr-6 pb-6"
                      style={{
                        fontSize: "0.92rem",
                        lineHeight: 1.8,
                        color: "rgba(255,255,255,0.55)",
                        borderTop: "1px solid rgba(255,255,255,0.04)",
                        paddingTop: "1rem",
                      }}
                    >
                      {t(`items.${i}.a`)}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-10 flex items-center gap-3"
        >
          <span
            style={{
              fontFamily: "var(--font-jetbrains, monospace)",
              fontSize: "0.7rem",
              color: "rgba(255,255,255,0.25)",
              letterSpacing: "0.08em",
            }}
          >
            Noch Fragen?
          </span>
          <a
            href="mailto:hello@sovereign.de"
            style={{
              fontFamily: "var(--font-space-grotesk, sans-serif)",
              fontSize: "0.82rem",
              fontWeight: 600,
              color: "rgba(0,212,255,0.7)",
              textDecoration: "none",
              letterSpacing: "0.04em",
              transition: "color 0.2s",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.color = "#00D4FF"; }}
            onMouseLeave={(e) => { e.currentTarget.style.color = "rgba(0,212,255,0.7)"; }}
          >
            hello@sovereign.de →
          </a>
        </motion.div>
      </div>
    </section>
  );
}
