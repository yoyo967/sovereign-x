"use client";

import { motion } from "framer-motion";
import { useTranslations, useLocale } from "next-intl";
import Link from "next/link";
import { ArrowRight, Clock } from "lucide-react";

const ARTICLE_KEYS = [0, 1, 2, 3, 4, 5] as const;

// Blueprint-aesthetic SVG illustrations for each article category
function ArticleIllustration({ index }: { index: number }) {
  const illos = [
    // 0: Vertrag kündigen — Document + X mark
    <svg key={0} width="64" height="64" viewBox="0 0 64 64" fill="none">
      <rect x="12" y="8" width="32" height="40" rx="2" stroke="rgba(0,212,255,0.35)" strokeWidth="1.2" />
      <line x1="18" y1="20" x2="38" y2="20" stroke="rgba(0,212,255,0.25)" strokeWidth="1" />
      <line x1="18" y1="26" x2="38" y2="26" stroke="rgba(0,212,255,0.2)" strokeWidth="1" />
      <line x1="18" y1="32" x2="30" y2="32" stroke="rgba(0,212,255,0.15)" strokeWidth="1" />
      <circle cx="42" cy="42" r="12" fill="#080E1A" stroke="rgba(0,212,255,0.4)" strokeWidth="1.5" />
      <line x1="37" y1="37" x2="47" y2="47" stroke="rgba(0,212,255,0.7)" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="47" y1="37" x2="37" y2="47" stroke="rgba(0,212,255,0.7)" strokeWidth="1.5" strokeLinecap="round" />
    </svg>,

    // 1: Preiserhöhung — Arrow up + shield
    <svg key={1} width="64" height="64" viewBox="0 0 64 64" fill="none">
      <path d="M32 52V20M20 32L32 20L44 32" stroke="rgba(0,212,255,0.6)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M22 14L10 14L10 54L54 54L54 44" stroke="rgba(0,212,255,0.2)" strokeWidth="1" strokeLinecap="round" />
      <path d="M42 8L54 8L54 20" stroke="rgba(0,212,255,0.3)" strokeWidth="1" strokeLinecap="round" />
      <line x1="40" y1="12" x2="52" y2="24" stroke="rgba(0,212,255,0.25)" strokeWidth="0.8" strokeDasharray="2 3" />
    </svg>,

    // 2: Datensouveränität — Concentric circles + data point
    <svg key={2} width="64" height="64" viewBox="0 0 64 64" fill="none">
      <circle cx="32" cy="32" r="26" stroke="rgba(0,212,255,0.15)" strokeWidth="1" />
      <circle cx="32" cy="32" r="19" stroke="rgba(0,212,255,0.22)" strokeWidth="1" />
      <circle cx="32" cy="32" r="12" stroke="rgba(0,212,255,0.32)" strokeWidth="1" />
      <circle cx="32" cy="32" r="5" stroke="rgba(0,212,255,0.5)" strokeWidth="1.2" />
      <circle cx="32" cy="32" r="2" fill="rgba(0,212,255,0.9)" />
      <line x1="32" y1="6" x2="32" y2="13" stroke="rgba(0,212,255,0.3)" strokeWidth="1" />
      <line x1="32" y1="51" x2="32" y2="58" stroke="rgba(0,212,255,0.3)" strokeWidth="1" />
      <line x1="6" y1="32" x2="13" y2="32" stroke="rgba(0,212,255,0.3)" strokeWidth="1" />
      <line x1="51" y1="32" x2="58" y2="32" stroke="rgba(0,212,255,0.3)" strokeWidth="1" />
    </svg>,

    // 3: APEX Architektur — 4 stacked layers
    <svg key={3} width="64" height="64" viewBox="0 0 64 64" fill="none">
      <rect x="8" y="10" width="48" height="10" rx="1" stroke="rgba(0,212,255,0.5)" strokeWidth="1.2" fill="rgba(0,212,255,0.05)" />
      <rect x="8" y="23" width="48" height="10" rx="1" stroke="rgba(0,212,255,0.4)" strokeWidth="1.2" fill="rgba(0,212,255,0.04)" />
      <rect x="8" y="36" width="48" height="10" rx="1" stroke="rgba(0,212,255,0.3)" strokeWidth="1.2" fill="rgba(0,212,255,0.03)" />
      <rect x="8" y="49" width="48" height="8" rx="1" stroke="rgba(0,212,255,0.2)" strokeWidth="1.2" fill="rgba(0,212,255,0.02)" />
      <text x="16" y="18" fill="rgba(0,212,255,0.55)" fontSize="5" fontFamily="monospace">DATA</text>
      <text x="16" y="31" fill="rgba(0,212,255,0.45)" fontSize="5" fontFamily="monospace">PROTECTION</text>
      <text x="16" y="44" fill="rgba(0,212,255,0.35)" fontSize="5" fontFamily="monospace">CONTROL</text>
      <text x="16" y="56" fill="rgba(0,212,255,0.25)" fontSize="5" fontFamily="monospace">TRUST</text>
    </svg>,

    // 4: Abofalle — Trap/lock icon
    <svg key={4} width="64" height="64" viewBox="0 0 64 64" fill="none">
      <rect x="16" y="28" width="32" height="24" rx="2" stroke="rgba(0,212,255,0.4)" strokeWidth="1.2" />
      <path d="M22 28V22C22 15.4 26 10 32 10C38 10 42 15.4 42 22V28" stroke="rgba(0,212,255,0.3)" strokeWidth="1.2" strokeLinecap="round" />
      <circle cx="32" cy="40" r="4" stroke="rgba(0,212,255,0.5)" strokeWidth="1.2" />
      <line x1="32" y1="44" x2="32" y2="48" stroke="rgba(0,212,255,0.5)" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="8" y1="8" x2="16" y2="16" stroke="rgba(255,80,80,0.4)" strokeWidth="1" strokeDasharray="2 2" />
      <line x1="56" y1="8" x2="48" y2="16" stroke="rgba(255,80,80,0.4)" strokeWidth="1" strokeDasharray="2 2" />
    </svg>,

    // 5: EU AI Act — EU stars + shield
    <svg key={5} width="64" height="64" viewBox="0 0 64 64" fill="none">
      <path d="M32 6L36 18H49L39 26L43 38L32 31L21 38L25 26L15 18H28L32 6Z" stroke="rgba(0,212,255,0.5)" strokeWidth="1.2" fill="rgba(0,212,255,0.04)" />
      <path d="M20 44L32 42L44 44V52C44 56 38 58 32 58C26 58 20 56 20 52V44Z" stroke="rgba(0,212,255,0.35)" strokeWidth="1.2" fill="rgba(0,212,255,0.03)" />
      <path d="M27 51L30 54L37 47" stroke="rgba(0,212,255,0.6)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>,
  ];
  return illos[index] ?? null;
}

export default function KnowledgeHubSection() {
  const t = useTranslations("hub");
  const locale = useLocale();

  return (
    <section
      className="relative py-32 px-6"
      id="wissen"
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
            "linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)",
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

        {/* Article grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-0" style={{ border: "1px solid rgba(255,255,255,0.07)" }}>
          {ARTICLE_KEYS.map((i) => {
            const href = `/${locale}${t(`articles.${i}.href`)}`;
            return (
              <motion.article
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.07 * i }}
                className="group relative flex flex-col p-8 transition-all duration-300"
                style={{
                  borderRight: i % 3 < 2 ? "1px solid rgba(255,255,255,0.07)" : "none",
                  borderBottom: i < 3 ? "1px solid rgba(255,255,255,0.07)" : "none",
                }}
                onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(0,212,255,0.025)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
              >
                {/* Category badge */}
                <div className="flex items-center justify-between mb-6">
                  <span
                    className="lp-badge"
                    style={{ fontSize: "0.55rem" }}
                  >
                    {t(`articles.${i}.tag`)}
                  </span>
                  <span
                    className="flex items-center gap-1"
                    style={{
                      fontFamily: "var(--font-jetbrains, monospace)",
                      fontSize: "0.58rem",
                      color: "rgba(255,255,255,0.2)",
                      letterSpacing: "0.08em",
                    }}
                  >
                    <Clock size={10} />
                    {t(`articles.${i}.mins`)} {t("minRead")}
                  </span>
                </div>

                {/* SVG illustration */}
                <div className="mb-6 opacity-70 group-hover:opacity-100 transition-opacity duration-300">
                  <ArticleIllustration index={i} />
                </div>

                {/* Title */}
                <h3
                  style={{
                    fontFamily: "var(--font-space-grotesk, sans-serif)",
                    fontWeight: 700,
                    fontSize: "1.05rem",
                    color: "rgba(255,255,255,0.88)",
                    lineHeight: 1.35,
                    marginBottom: "0.75rem",
                    letterSpacing: "-0.01em",
                  }}
                >
                  {t(`articles.${i}.title`)}
                </h3>

                {/* Description */}
                <p
                  style={{
                    fontSize: "0.85rem",
                    lineHeight: 1.65,
                    color: "rgba(255,255,255,0.4)",
                    flex: 1,
                    marginBottom: "1.5rem",
                  }}
                >
                  {t(`articles.${i}.desc`)}
                </p>

                {/* Read link */}
                <Link
                  href={href}
                  className="flex items-center gap-2 group/link"
                  style={{
                    fontFamily: "var(--font-space-grotesk, sans-serif)",
                    fontSize: "0.78rem",
                    fontWeight: 600,
                    letterSpacing: "0.06em",
                    textTransform: "uppercase",
                    color: "rgba(0,212,255,0.6)",
                    textDecoration: "none",
                    transition: "color 0.2s",
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.color = "#00D4FF"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.color = "rgba(0,212,255,0.6)"; }}
                >
                  {t("readMore")}
                  <ArrowRight size={14} style={{ transition: "transform 0.2s" }} className="group-hover/link:translate-x-1" />
                </Link>
              </motion.article>
            );
          })}
        </div>

        {/* Bottom link to full blog */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-10 flex justify-center"
        >
          <Link
            href={`/${locale}/blog`}
            className="lp-btn-secondary"
            style={{ gap: 8 }}
          >
            Alle Artikel im Blog
            <ArrowRight size={14} />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
