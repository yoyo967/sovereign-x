"use client";

import { motion } from "framer-motion";
import { useTranslations, useLocale } from "next-intl";

// Roadmap phases — static data (no translation needed for MVP)
const PHASES = [
  {
    phase: "PHASE I",
    period: "Q1–Q2 2025",
    status: "LIVE",
    statusColor: "#00E676",
    title: "Foundation OS",
    description:
      "Das Kern-OS ist live. Privacy Guardian, Sovereign Twin und Execution Center sind deployed. Erste 500 Sovereign Citizens im Early Access.",
    milestones: [
      "Privacy Guardian v1.0 — DSGVO-Automatisierung",
      "Sovereign Twin — Digitales Profil & Auskunft",
      "Execution Center — Contract Intelligence",
      "EU AI Act Compliance Layer",
      "Dashboard Beta — Multi-Module View",
    ],
    icon: "🛡️",
    gridCol: "1",
  },
  {
    phase: "PHASE II",
    period: "Q3–Q4 2025",
    status: "IN DEV",
    statusColor: "#00D4FF",
    title: "Intelligence Layer",
    description:
      "Der Intelligence Layer erweitert das OS um KI-gestützte Analyse, proaktive Alerts und autonome Agent-Workflows — ohne manuellen Trigger.",
    milestones: [
      "Security Senate v2.0 — EU AI Act Audit",
      "Finanzautonomie — Wealth Twin Beta",
      "KI & Recht — Legal Intelligence Engine",
      "Proaktive Alerts — Regulierungsänderungen",
      "API-Zugang für Entwickler",
    ],
    icon: "🧠",
    gridCol: "2",
  },
  {
    phase: "PHASE III",
    period: "2026",
    status: "ROADMAP",
    statusColor: "#BB86FC",
    title: "Sovereign Network",
    description:
      "Das Netzwerk-Layer verbindet Sovereign Citizens — geteilte Intelligence, kollektive Verhandlungsmacht, Gruppen-Compliance für Familien und Teams.",
    milestones: [
      "Family Intelligence — Mehrgenerationen-Profil",
      "Business Module — KMU-Souveränität",
      "Sovereign Network — P2P Intelligence",
      "Kollektive DSGVO-Anfragen",
      "Enterprise White-Label",
    ],
    icon: "🌐",
    gridCol: "3",
  },
  {
    phase: "PHASE IV",
    period: "2027–2030",
    status: "VISION",
    statusColor: "rgba(255,255,255,0.2)",
    title: "2030 Standard",
    description:
      "Das vollständige SOVEREIGN 2030 OS — selbstständig lernend, vorausschauend handelnd, europäischer Standard für digitale Souveränität.",
    milestones: [
      "Predictive Sovereignty — Proaktive Rechtsdurchsetzung",
      "European Sovereign Grid",
      "EU-Regulierung Real-time Monitoring",
      "Open Sovereign Protocol",
      "1M Sovereign Citizens",
    ],
    icon: "🚀",
    gridCol: "4",
  },
];

export default function RoadmapSection() {
  const locale = useLocale();

  return (
    <section
      className="relative py-32 px-6"
      id="roadmap"
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

      <div className="relative z-10 max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-20">
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="lp-section-tag mb-6"
          >
            System Roadmap · 2025–2030
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
              Von Foundation<br />
              <span style={{ color: "rgba(0,212,255,0.9)" }}>zum 2030 Standard</span>
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              style={{ fontSize: "0.95rem", color: "rgba(255,255,255,0.4)", maxWidth: 380 }}
            >
              Vier Phasen, ein Ziel: das vollständige OS für digitale Souveränität — deployed, documented, defended.
            </motion.p>
          </div>
        </div>

        {/* Timeline connector */}
        <div className="relative mb-12" style={{ height: 2 }}>
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              height: 1,
              background: "rgba(255,255,255,0.05)",
            }}
          />
          <motion.div
            initial={{ width: 0 }}
            whileInView={{ width: "30%" }}
            viewport={{ once: true }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              height: 1,
              background: "linear-gradient(90deg, #00D4FF, rgba(0,212,255,0.3))",
            }}
          />
        </div>

        {/* Phase cards */}
        <div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-0"
          style={{ border: "1px solid rgba(255,255,255,0.07)" }}
        >
          {PHASES.map((phase, i) => (
            <motion.div
              key={phase.phase}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.08 * i }}
              style={{
                borderRight: i < PHASES.length - 1 ? "1px solid rgba(255,255,255,0.07)" : "none",
                display: "flex",
                flexDirection: "column",
                position: "relative",
                background: phase.status === "LIVE" ? "rgba(0,230,118,0.02)" : "transparent",
              }}
            >
              {/* LIVE indicator */}
              {phase.status === "LIVE" && (
                <div
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    height: 2,
                    background: phase.statusColor,
                    boxShadow: `0 0 8px ${phase.statusColor}80`,
                  }}
                />
              )}

              <div style={{ padding: "32px 28px", flex: 1 }}>
                {/* Phase label + status */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginBottom: 20,
                  }}
                >
                  <span
                    style={{
                      fontFamily: "var(--font-jetbrains, monospace)",
                      fontSize: "0.55rem",
                      letterSpacing: "0.18em",
                      color: "rgba(255,255,255,0.2)",
                      textTransform: "uppercase",
                    }}
                  >
                    {phase.phase}
                  </span>
                  <span
                    style={{
                      fontFamily: "var(--font-jetbrains, monospace)",
                      fontSize: "0.5rem",
                      letterSpacing: "0.12em",
                      color: phase.statusColor,
                      border: `1px solid ${phase.statusColor}40`,
                      padding: "2px 8px",
                    }}
                  >
                    {phase.status}
                  </span>
                </div>

                {/* Icon + title */}
                <div style={{ marginBottom: 8 }}>
                  <span style={{ fontSize: "1.6rem", display: "block", marginBottom: 8 }}>
                    {phase.icon}
                  </span>
                  <h3
                    style={{
                      fontFamily: "var(--font-space-grotesk, sans-serif)",
                      fontWeight: 800,
                      fontSize: "1.15rem",
                      color: "#F0F4FF",
                      letterSpacing: "-0.01em",
                      lineHeight: 1.2,
                    }}
                  >
                    {phase.title}
                  </h3>
                </div>

                {/* Period */}
                <div
                  style={{
                    fontFamily: "var(--font-jetbrains, monospace)",
                    fontSize: "0.6rem",
                    letterSpacing: "0.1em",
                    color: phase.statusColor,
                    marginBottom: 16,
                  }}
                >
                  {phase.period}
                </div>

                {/* Description */}
                <p
                  style={{
                    fontSize: "0.82rem",
                    lineHeight: 1.65,
                    color: "rgba(255,255,255,0.4)",
                    marginBottom: 24,
                  }}
                >
                  {phase.description}
                </p>

                {/* Milestones */}
                <ul
                  style={{
                    listStyle: "none",
                    padding: 0,
                    margin: 0,
                    display: "flex",
                    flexDirection: "column",
                    gap: 8,
                  }}
                >
                  {phase.milestones.map((m, j) => (
                    <li
                      key={j}
                      style={{
                        display: "flex",
                        gap: 8,
                        alignItems: "flex-start",
                      }}
                    >
                      <span
                        style={{
                          color:
                            phase.status === "LIVE"
                              ? "#00E676"
                              : phase.status === "IN DEV"
                              ? "rgba(0,212,255,0.5)"
                              : "rgba(255,255,255,0.12)",
                          fontSize: "0.65rem",
                          marginTop: 2,
                          flexShrink: 0,
                        }}
                      >
                        {phase.status === "LIVE" ? "✓" : "○"}
                      </span>
                      <span
                        style={{
                          fontSize: "0.78rem",
                          lineHeight: 1.4,
                          color:
                            phase.status === "LIVE"
                              ? "rgba(255,255,255,0.6)"
                              : "rgba(255,255,255,0.3)",
                        }}
                      >
                        {m}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-12 flex justify-center"
        >
          <a
            href={`/${locale}/module`}
            style={{
              fontFamily: "var(--font-space-grotesk, sans-serif)",
              fontWeight: 700,
              fontSize: "0.8rem",
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              color: "rgba(0,212,255,0.7)",
              border: "1px solid rgba(0,212,255,0.15)",
              padding: "12px 28px",
              textDecoration: "none",
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              background: "rgba(0,212,255,0.03)",
            }}
          >
            Phase I Module jetzt aktivieren →
          </a>
        </motion.div>
      </div>
    </section>
  );
}
