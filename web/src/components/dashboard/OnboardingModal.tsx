"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

const STEPS = [
  {
    id: "welcome",
    title: "Willkommen, Sovereign.",
    subtitle: "Dein autonomes Life-OS ist aktiviert.",
    content: "SOVEREIGN 2030 schützt dich jetzt vor den Systemen, die bisher gegen dich gearbeitet haben. Lass uns in 3 Schritten einrichten, was für dich am wichtigsten ist.",
    cta: "Los geht's →",
    icon: (
      <div style={{ position: "relative", width: 80, height: 80, margin: "0 auto 32px" }}>
        <div style={{
          width: 80, height: 80, border: "1.5px solid rgba(0,212,255,0.4)", borderRadius: "50%",
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <div style={{
            width: 28, height: 28, border: "1px solid rgba(0,212,255,0.3)", borderRadius: "50%",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <div style={{ width: 10, height: 10, background: "#00D4FF", borderRadius: "50%", boxShadow: "0 0 14px rgba(0,212,255,0.9)" }} />
          </div>
        </div>
        <div style={{ position: "absolute", top: 4, left: 4, right: 4, bottom: 4, border: "1px solid rgba(0,212,255,0.1)", borderRadius: "50%", animation: "lp-pulse-dot 3s ease-in-out infinite" }} />
      </div>
    ),
  },
  {
    id: "focus",
    title: "Was ist dein Hauptziel?",
    subtitle: "Wähle deinen Schutz-Fokus.",
    content: null,
    cta: "Weiter →",
    icon: null,
  },
  {
    id: "modules",
    title: "Deine Module sind bereit.",
    subtitle: "3 Kernmodule sofort verfügbar.",
    content: null,
    cta: "Dashboard öffnen →",
    icon: null,
  },
];

const FOCUS_OPTIONS = [
  { id: "contracts", icon: "📄", label: "Verträge & Abos", desc: "Kündigen, analysieren, Fristen managen", module: "/dashboard/contracts", color: "#00D4FF" },
  { id: "privacy", icon: "🛡️", label: "Datenschutz", desc: "DSGVO-Anfragen, Datenauskunft, PII-Schutz", module: "/dashboard", color: "#00E676" },
  { id: "finance", icon: "💶", label: "Finanzen & Preise", desc: "Preiserhöhungen widersprechen, Wealth-Analyse", module: "/dashboard/finance", color: "#BB86FC" },
  { id: "legal", icon: "⚖️", label: "Rechtliche Absicherung", desc: "EU AI Act, Verbraucherrechte, Beschwerden", module: "/dashboard", color: "#FFA726" },
];

const READY_MODULES = [
  { icon: "🧬", name: "Sovereign Twin", desc: "Digitales Profil aktiviert", status: "LIVE", color: "#00D4FF" },
  { icon: "🛡️", name: "Privacy Guardian", desc: "Datenschutz-Monitoring aktiv", status: "LIVE", color: "#00E676" },
  { icon: "⚡", name: "Execution Center", desc: "Bereit für erste Anfrage", status: "READY", color: "#BB86FC" },
];

const STORAGE_KEY = "sovereign_onboarding_done";

export default function OnboardingModal() {
  const [visible, setVisible] = useState(false);
  const [step, setStep] = useState(0);
  const [selectedFocus, setSelectedFocus] = useState<string | null>(null);
  const [destination, setDestination] = useState("/dashboard");

  useEffect(() => {
    const done = localStorage.getItem(STORAGE_KEY);
    if (!done) {
      // Small delay so dashboard renders first
      const t = setTimeout(() => setVisible(true), 800);
      return () => clearTimeout(t);
    }
  }, []);

  function handleNext() {
    if (step < STEPS.length - 1) {
      setStep(step + 1);
    } else {
      finish();
    }
  }

  function finish() {
    localStorage.setItem(STORAGE_KEY, "1");
    setVisible(false);
  }

  function selectFocus(id: string, module: string) {
    setSelectedFocus(id);
    setDestination(module);
  }

  if (!visible) return null;

  const current = STEPS[step];

  return (
    <AnimatePresence>
      {visible && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={finish}
            style={{
              position: "fixed",
              inset: 0,
              background: "rgba(0,0,0,0.75)",
              backdropFilter: "blur(8px)",
              zIndex: 1000,
            }}
          />

          {/* Modal */}
          <motion.div
            key="modal"
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            style={{
              position: "fixed",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: "min(560px, 94vw)",
              background: "#0A1220",
              border: "1px solid rgba(0,212,255,0.15)",
              boxShadow: "0 40px 100px rgba(0,0,0,0.7), 0 0 60px rgba(0,212,255,0.05)",
              zIndex: 1001,
              overflow: "hidden",
            }}
          >
            {/* Top accent line */}
            <div style={{ height: 2, background: "linear-gradient(90deg, #00D4FF, #BB86FC)", width: "100%" }} />

            {/* Progress dots */}
            <div style={{ display: "flex", gap: 6, padding: "16px 28px 0", justifyContent: "flex-end" }}>
              {STEPS.map((_, i) => (
                <div
                  key={i}
                  style={{
                    width: i === step ? 20 : 6,
                    height: 6,
                    borderRadius: 3,
                    background: i <= step ? "#00D4FF" : "rgba(255,255,255,0.1)",
                    transition: "all 0.3s ease",
                  }}
                />
              ))}
            </div>

            <div style={{ padding: "28px 36px 36px" }}>

              {/* Step 0 — Welcome */}
              {step === 0 && (
                <motion.div
                  key="step0"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3 }}
                  style={{ textAlign: "center" }}
                >
                  {current.icon}
                  <div
                    style={{
                      fontFamily: "var(--font-jetbrains, monospace)",
                      fontSize: "0.55rem",
                      letterSpacing: "0.2em",
                      color: "rgba(0,212,255,0.6)",
                      textTransform: "uppercase",
                      marginBottom: 12,
                    }}
                  >
                    {current.subtitle}
                  </div>
                  <h2
                    style={{
                      fontFamily: "var(--font-space-grotesk, sans-serif)",
                      fontWeight: 900,
                      fontSize: "1.9rem",
                      letterSpacing: "-0.025em",
                      color: "#F0F4FF",
                      marginBottom: 16,
                    }}
                  >
                    {current.title}
                  </h2>
                  <p
                    style={{
                      fontSize: "0.95rem",
                      lineHeight: 1.7,
                      color: "rgba(255,255,255,0.5)",
                      maxWidth: 380,
                      margin: "0 auto 32px",
                    }}
                  >
                    {current.content}
                  </p>
                  <button
                    onClick={handleNext}
                    style={{
                      fontFamily: "var(--font-space-grotesk, sans-serif)",
                      fontWeight: 700,
                      fontSize: "0.85rem",
                      letterSpacing: "0.08em",
                      textTransform: "uppercase",
                      color: "#080E1A",
                      background: "#00D4FF",
                      border: "none",
                      padding: "13px 36px",
                      cursor: "pointer",
                      width: "100%",
                    }}
                  >
                    {current.cta}
                  </button>
                  <button
                    onClick={finish}
                    style={{
                      marginTop: 12,
                      background: "none",
                      border: "none",
                      fontFamily: "var(--font-jetbrains, monospace)",
                      fontSize: "0.58rem",
                      letterSpacing: "0.1em",
                      color: "rgba(255,255,255,0.2)",
                      cursor: "pointer",
                      textTransform: "uppercase",
                    }}
                  >
                    Überspringen
                  </button>
                </motion.div>
              )}

              {/* Step 1 — Focus Selection */}
              {step === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div
                    style={{
                      fontFamily: "var(--font-jetbrains, monospace)",
                      fontSize: "0.55rem",
                      letterSpacing: "0.2em",
                      color: "rgba(0,212,255,0.6)",
                      textTransform: "uppercase",
                      marginBottom: 8,
                    }}
                  >
                    {current.subtitle}
                  </div>
                  <h2
                    style={{
                      fontFamily: "var(--font-space-grotesk, sans-serif)",
                      fontWeight: 900,
                      fontSize: "1.6rem",
                      letterSpacing: "-0.02em",
                      color: "#F0F4FF",
                      marginBottom: 24,
                    }}
                  >
                    {current.title}
                  </h2>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 28 }}>
                    {FOCUS_OPTIONS.map((opt) => (
                      <button
                        key={opt.id}
                        onClick={() => selectFocus(opt.id, opt.module)}
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          gap: 6,
                          padding: "14px 16px",
                          background: selectedFocus === opt.id ? `${opt.color}10` : "rgba(255,255,255,0.02)",
                          border: `1px solid ${selectedFocus === opt.id ? opt.color + "50" : "rgba(255,255,255,0.07)"}`,
                          cursor: "pointer",
                          textAlign: "left",
                          transition: "all 0.15s ease",
                        }}
                      >
                        <span style={{ fontSize: "1.2rem" }}>{opt.icon}</span>
                        <span
                          style={{
                            fontFamily: "var(--font-space-grotesk, sans-serif)",
                            fontWeight: 700,
                            fontSize: "0.85rem",
                            color: selectedFocus === opt.id ? opt.color : "rgba(255,255,255,0.8)",
                          }}
                        >
                          {opt.label}
                        </span>
                        <span style={{ fontSize: "0.72rem", color: "rgba(255,255,255,0.35)", lineHeight: 1.4 }}>
                          {opt.desc}
                        </span>
                      </button>
                    ))}
                  </div>

                  <button
                    onClick={handleNext}
                    disabled={!selectedFocus}
                    style={{
                      fontFamily: "var(--font-space-grotesk, sans-serif)",
                      fontWeight: 700,
                      fontSize: "0.85rem",
                      letterSpacing: "0.08em",
                      textTransform: "uppercase",
                      color: selectedFocus ? "#080E1A" : "rgba(255,255,255,0.2)",
                      background: selectedFocus ? "#00D4FF" : "rgba(255,255,255,0.05)",
                      border: "none",
                      padding: "13px 36px",
                      cursor: selectedFocus ? "pointer" : "not-allowed",
                      width: "100%",
                      transition: "all 0.2s ease",
                    }}
                  >
                    {current.cta}
                  </button>
                </motion.div>
              )}

              {/* Step 2 — Modules Ready */}
              {step === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div
                    style={{
                      fontFamily: "var(--font-jetbrains, monospace)",
                      fontSize: "0.55rem",
                      letterSpacing: "0.2em",
                      color: "rgba(0,212,255,0.6)",
                      textTransform: "uppercase",
                      marginBottom: 8,
                    }}
                  >
                    {current.subtitle}
                  </div>
                  <h2
                    style={{
                      fontFamily: "var(--font-space-grotesk, sans-serif)",
                      fontWeight: 900,
                      fontSize: "1.6rem",
                      letterSpacing: "-0.02em",
                      color: "#F0F4FF",
                      marginBottom: 24,
                    }}
                  >
                    {current.title}
                  </h2>

                  <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 28 }}>
                    {READY_MODULES.map((mod, i) => (
                      <motion.div
                        key={mod.name}
                        initial={{ opacity: 0, x: -12 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.1 }}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 14,
                          padding: "14px 16px",
                          border: `1px solid ${mod.color}25`,
                          background: `${mod.color}06`,
                        }}
                      >
                        <span style={{ fontSize: "1.2rem" }}>{mod.icon}</span>
                        <div style={{ flex: 1 }}>
                          <div
                            style={{
                              fontFamily: "var(--font-space-grotesk, sans-serif)",
                              fontWeight: 700,
                              fontSize: "0.88rem",
                              color: "rgba(255,255,255,0.85)",
                            }}
                          >
                            {mod.name}
                          </div>
                          <div style={{ fontSize: "0.72rem", color: "rgba(255,255,255,0.35)" }}>{mod.desc}</div>
                        </div>
                        <span
                          style={{
                            fontFamily: "var(--font-jetbrains, monospace)",
                            fontSize: "0.5rem",
                            letterSpacing: "0.12em",
                            color: mod.color,
                            border: `1px solid ${mod.color}40`,
                            padding: "3px 8px",
                          }}
                        >
                          {mod.status}
                        </span>
                      </motion.div>
                    ))}
                  </div>

                  <Link
                    href={destination}
                    onClick={finish}
                    style={{
                      display: "block",
                      fontFamily: "var(--font-space-grotesk, sans-serif)",
                      fontWeight: 700,
                      fontSize: "0.85rem",
                      letterSpacing: "0.08em",
                      textTransform: "uppercase",
                      color: "#080E1A",
                      background: "#00D4FF",
                      padding: "13px 36px",
                      textDecoration: "none",
                      textAlign: "center",
                      width: "100%",
                      boxSizing: "border-box",
                    }}
                  >
                    {current.cta}
                  </Link>
                </motion.div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
