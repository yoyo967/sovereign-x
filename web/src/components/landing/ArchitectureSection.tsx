"use client";

import { motion } from "framer-motion";
import { FileText, TrendingUp, Brain, Vote } from "lucide-react";
import { useTranslations } from "next-intl";

const icons = [
  <FileText size={20} strokeWidth={1.5} key="ft" />,
  <TrendingUp size={20} strokeWidth={1.5} key="ti" />,
  <Brain size={20} strokeWidth={1.5} key="br" />,
  <Vote size={20} strokeWidth={1.5} key="vt" />,
];

export default function ArchitectureSection() {
  const t = useTranslations("twin");
  const caps = [0, 1, 2, 3] as const;

  return (
    <section
      className="relative py-32 px-6 overflow-hidden"
      id="architecture"
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
            "linear-gradient(rgba(0,212,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(0,212,255,0.025) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />

      {/* Ambient glow */}
      <div
        className="absolute z-0 pointer-events-none"
        style={{
          top: "50%",
          right: "-10%",
          transform: "translateY(-50%)",
          width: 500,
          height: 500,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(0,212,255,0.05) 0%, transparent 70%)",
          filter: "blur(60px)",
        }}
      />

      <div className="relative z-10 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">

          {/* Left: headline */}
          <div>
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
              style={{ fontSize: "clamp(2.2rem, 5vw, 3.5rem)" }}
            >
              {t("headline1")}<br />
              <span style={{ color: "rgba(0,212,255,0.85)" }}>{t("headline2")}</span>
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              style={{ fontSize: "1.05rem", lineHeight: 1.75, color: "rgba(255,255,255,0.45)", maxWidth: 480 }}
            >
              {t("sub")}
            </motion.p>

            {/* Technical diagram: concentric rings */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="mt-12 flex items-center justify-center"
              style={{ height: 200 }}
            >
              <div className="relative flex items-center justify-center" style={{ width: 180, height: 180 }}>
                {[180, 130, 86, 44].map((size, i) => (
                  <div
                    key={i}
                    className="absolute"
                    style={{
                      width: size,
                      height: size,
                      borderRadius: "50%",
                      border: `1px solid rgba(0,212,255,${0.08 + i * 0.06})`,
                    }}
                  />
                ))}
                {/* Center */}
                <div
                  style={{
                    width: 20,
                    height: 20,
                    borderRadius: "50%",
                    background: "#00D4FF",
                    boxShadow: "0 0 20px rgba(0,212,255,0.6)",
                    position: "relative",
                    zIndex: 10,
                  }}
                />
                {/* Labels */}
                {["DATEN", "SCHUTZ", "STEUERUNG", "BEWEIS"].map((label, i) => {
                  const angle = (-90 + i * 90) * (Math.PI / 180);
                  const r = [90, 65, 43, 22][i];
                  return (
                    <span
                      key={i}
                      style={{
                        position: "absolute",
                        fontFamily: "var(--font-jetbrains, monospace)",
                        fontSize: "0.45rem",
                        letterSpacing: "0.1em",
                        color: `rgba(0,212,255,${0.3 + i * 0.15})`,
                        left: `calc(50% + ${r * Math.cos(angle)}px)`,
                        top: `calc(50% + ${r * Math.sin(angle)}px)`,
                        transform: "translate(-50%, -50%)",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {label}
                    </span>
                  );
                })}
              </div>
            </motion.div>
          </div>

          {/* Right: capability cards */}
          <div className="flex flex-col gap-0" style={{ border: "1px solid rgba(255,255,255,0.07)" }}>
            {caps.map((i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 * i }}
                className="flex items-start gap-5 p-8 transition-all duration-300"
                style={{
                  borderBottom: i < 3 ? "1px solid rgba(255,255,255,0.07)" : "none",
                  cursor: "default",
                }}
                onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(0,212,255,0.03)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
              >
                <div
                  style={{
                    padding: "8px",
                    border: "1px solid rgba(0,212,255,0.15)",
                    background: "rgba(0,212,255,0.04)",
                    color: "rgba(0,212,255,0.6)",
                    flexShrink: 0,
                  }}
                >
                  {icons[i]}
                </div>
                <div>
                  <h3
                    style={{
                      fontFamily: "var(--font-space-grotesk, sans-serif)",
                      fontWeight: 700,
                      fontSize: "0.95rem",
                      color: "rgba(255,255,255,0.9)",
                      marginBottom: 6,
                    }}
                  >
                    {t(`capabilities.${i}.title`)}
                  </h3>
                  <p
                    style={{
                      fontSize: "0.85rem",
                      lineHeight: 1.65,
                      color: "rgba(255,255,255,0.4)",
                    }}
                  >
                    {t(`capabilities.${i}.description`)}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
