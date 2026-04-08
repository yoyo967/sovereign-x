"use client";

import { motion } from "framer-motion";
import { useLocale } from "next-intl";
import Link from "next/link";

const QUOTES = [
  "Souveränität ist keine Eigenschaft von Systemen. Sie ist eine Entscheidung von Menschen.",
  "Es gibt keine neutrale Position. Entweder du kontrollierst deine Daten — oder jemand anderes tut es.",
  "Das KI-Zeitalter stellt eine einzige Frage: Wessen Interessen dient die KI, die dein Leben formt?",
];

const CHAPTER_PREVIEWS = [
  { num: "01", title: "Das Ende der digitalen Naivität" },
  { num: "03", title: "Souveränität ist kein Luxus" },
  { num: "07", title: "2030 — was wir aufbauen" },
  { num: "08", title: "Der Aufruf" },
];

export default function ManifestoTeaserSection() {
  const locale = useLocale();

  return (
    <section
      className="relative overflow-hidden"
      id="manifesto"
      style={{
        background: "#060C18",
        borderTop: "1px solid rgba(255,255,255,0.04)",
        padding: "120px 24px",
      }}
    >
      {/* Fine grid */}
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.018) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.018) 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />

      {/* Large background text */}
      <div
        className="absolute inset-0 z-0 flex items-center justify-center overflow-hidden select-none pointer-events-none"
        aria-hidden="true"
      >
        <span
          style={{
            fontFamily: "var(--font-space-grotesk, sans-serif)",
            fontWeight: 900,
            fontSize: "clamp(8rem, 20vw, 22rem)",
            letterSpacing: "-0.05em",
            color: "rgba(255,255,255,0.012)",
            lineHeight: 1,
            whiteSpace: "nowrap",
          }}
        >
          MANIFEST
        </span>
      </div>

      {/* Cyan accent glow */}
      <div
        className="absolute z-0"
        style={{
          right: "-10%",
          top: "20%",
          width: 600,
          height: 600,
          background: "radial-gradient(ellipse, rgba(0,212,255,0.04) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />

      <div className="relative z-10 max-w-6xl mx-auto">
        <div
          className="grid gap-16"
          style={{ gridTemplateColumns: "1fr 1fr", alignItems: "center" }}
        >
          {/* Left: Content */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="lp-section-tag mb-8"
            >
              Das Manifest · 8 Kapitel
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="lp-headline"
              style={{ fontSize: "clamp(2.4rem, 5vw, 4rem)", marginBottom: 24 }}
            >
              Digitale{" "}
              <span style={{ color: "#00D4FF" }}>Souveränität</span>
              <br />
              <span style={{ color: "rgba(255,255,255,0.3)", fontWeight: 300 }}>
                als Menschenrecht
              </span>
            </motion.h2>

            <motion.blockquote
              initial={{ opacity: 0, x: -12 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              style={{
                borderLeft: "2px solid rgba(0,212,255,0.4)",
                paddingLeft: 20,
                marginBottom: 40,
                fontStyle: "italic",
                fontSize: "1.05rem",
                lineHeight: 1.7,
                color: "rgba(255,255,255,0.5)",
              }}
            >
              {QUOTES[0]}
            </motion.blockquote>

            <motion.p
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.25 }}
              style={{
                fontSize: "0.95rem",
                lineHeight: 1.75,
                color: "rgba(255,255,255,0.4)",
                marginBottom: 40,
                maxWidth: 480,
              }}
            >
              Wir haben in den letzten zwanzig Jahren eine stille Transaktion akzeptiert: Unsere Daten gegen Bequemlichkeit. Unsere Privatsphäre gegen kostenlose Dienste. Unsere Autonomie gegen nahtlose Erfahrungen. Das Manifest erklärt, warum das endet — und wie.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              style={{ display: "flex", gap: 12, flexWrap: "wrap" }}
            >
              <Link
                href={`/${locale}/manifesto`}
                style={{
                  fontFamily: "var(--font-space-grotesk, sans-serif)",
                  fontWeight: 700,
                  fontSize: "0.82rem",
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  color: "#080E1A",
                  background: "#00D4FF",
                  padding: "13px 28px",
                  textDecoration: "none",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                }}
              >
                Manifest lesen →
              </Link>
              <Link
                href={`/${locale}/eu-regulierung`}
                style={{
                  fontFamily: "var(--font-space-grotesk, sans-serif)",
                  fontWeight: 600,
                  fontSize: "0.82rem",
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  color: "rgba(255,255,255,0.5)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  padding: "13px 28px",
                  textDecoration: "none",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                }}
              >
                EU-Regulierung verstehen
              </Link>
            </motion.div>
          </div>

          {/* Right: Chapter index + quote rotator */}
          <div>
            {/* Chapter previews */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.15 }}
              style={{
                border: "1px solid rgba(255,255,255,0.07)",
                marginBottom: 24,
              }}
            >
              <div
                style={{
                  padding: "16px 24px",
                  borderBottom: "1px solid rgba(255,255,255,0.05)",
                  fontFamily: "var(--font-jetbrains, monospace)",
                  fontSize: "0.55rem",
                  letterSpacing: "0.18em",
                  color: "rgba(255,255,255,0.2)",
                  textTransform: "uppercase",
                }}
              >
                Inhalt — Auswahl
              </div>
              {CHAPTER_PREVIEWS.map((ch, i) => (
                <Link
                  key={ch.num}
                  href={`/${locale}/manifesto#chapter-${ch.num}`}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 16,
                    padding: "16px 24px",
                    borderBottom: i < CHAPTER_PREVIEWS.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none",
                    textDecoration: "none",
                  }}
                >
                  <span
                    style={{
                      fontFamily: "var(--font-jetbrains, monospace)",
                      fontSize: "0.58rem",
                      letterSpacing: "0.08em",
                      color: "rgba(0,212,255,0.4)",
                      minWidth: 24,
                    }}
                  >
                    {ch.num}
                  </span>
                  <span
                    style={{
                      fontFamily: "var(--font-space-grotesk, sans-serif)",
                      fontSize: "0.88rem",
                      color: "rgba(255,255,255,0.5)",
                      flex: 1,
                    }}
                  >
                    {ch.title}
                  </span>
                  <span style={{ color: "rgba(255,255,255,0.15)", fontSize: "0.7rem" }}>→</span>
                </Link>
              ))}
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.25 }}
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 0,
                border: "1px solid rgba(255,255,255,0.06)",
              }}
            >
              {[
                { value: "8", label: "Kapitel" },
                { value: "~8 Min", label: "Lesezeit" },
                { value: "2025", label: "Erschienen" },
                { value: "V2.0", label: "Aktuelle Version" },
              ].map((s, i) => (
                <div
                  key={s.label}
                  style={{
                    padding: "20px 24px",
                    borderRight: i % 2 === 0 ? "1px solid rgba(255,255,255,0.06)" : "none",
                    borderBottom: i < 2 ? "1px solid rgba(255,255,255,0.06)" : "none",
                  }}
                >
                  <div
                    style={{
                      fontFamily: "var(--font-space-grotesk, sans-serif)",
                      fontWeight: 800,
                      fontSize: "1.4rem",
                      color: "#00D4FF",
                      lineHeight: 1,
                      marginBottom: 4,
                    }}
                  >
                    {s.value}
                  </div>
                  <div
                    style={{
                      fontFamily: "var(--font-jetbrains, monospace)",
                      fontSize: "0.55rem",
                      letterSpacing: "0.12em",
                      color: "rgba(255,255,255,0.25)",
                      textTransform: "uppercase",
                    }}
                  >
                    {s.label}
                  </div>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
