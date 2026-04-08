'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion';
import { CheckCircle, XCircle, Zap, Info, ShieldAlert, ArrowLeft, ArrowRight } from 'lucide-react';
import { api } from '@/lib/api';
import { useRequireAuth } from '@/hooks/useRequireAuth';

// ── Mock fallback approvals ───────────────────────────────────
const MOCK_APPROVALS = [
  {
    id: "mock-1",
    agentName: "Execution Center",
    riskLevel: "LOW",
    title: "Fitnessstudio-Kündigung versenden",
    description: "SOVEREIGN hat erkannt, dass dein Fitnessstudio-Vertrag sich am 31.05.2026 automatisch um 12 Monate verlängert. Das Kündigungsschreiben ist fertig — Versand per E-Mail an vertrag@fitness-center.de.",
    reason: "Vertrag läuft in 28 Tagen ab. Kündigung muss 30 Tage vorher eingegangen sein. Frühester Versand heute garantiert rechtzeitigen Eingang.",
    savings: "€49,90/Monat",
    expiresAt: "2026-05-03",
  },
  {
    id: "mock-2",
    agentName: "Finance Guardian",
    riskLevel: "MEDIUM",
    title: "Strom-Sonderkündigung nach Preiserhöhung",
    description: "E.ON hat eine Preiserhöhung von 12,3% zum 01.06.2026 angekündigt. Sonderkündigungsrecht nach § 41 Abs. 3 EnWG aktiv. Frist: 2 Wochen nach Ankündigung (26.04.2026).",
    reason: "Preiserhöhung überschreitet Benchmark-Threshold von 5%. Marktvergleich zeigt 3 günstigere Alternativen. Empfehlung: Kündigen + Wechsel zu Anbieter X (−€28/Monat).",
    savings: "€28,00/Monat",
    expiresAt: "2026-04-26",
  },
  {
    id: "mock-3",
    agentName: "Privacy Guardian",
    riskLevel: "LOW",
    title: "DSGVO-Auskunftsantrag an Meta",
    description: "Jährlicher DSGVO-Auskunftszyklus: Meta Platforms Ireland Ltd. (Facebook, Instagram, WhatsApp) soll über alle gespeicherten Daten Auskunft geben. Antrag nach Art. 15 DSGVO fertig formuliert.",
    reason: "Letzter Auskunftsantrag an Meta vor 13 Monaten. Regelmäßige Kontrolle empfohlen. Antrag automatisch erstellt und bereit zum Versand.",
    savings: null,
    expiresAt: null,
  },
];

// ── SwipeCard component ───────────────────────────────────────
function SwipeCard({
  approval,
  onApprove,
  onReject,
  isTop,
}: {
  approval: typeof MOCK_APPROVALS[0];
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
  isTop: boolean;
}) {
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 0, 200], [-8, 0, 8]);
  const approveOpacity = useTransform(x, [20, 100], [0, 1]);
  const rejectOpacity = useTransform(x, [-100, -20], [1, 0]);
  const cardOpacity = useTransform(x, [-300, 0, 300], [0, 1, 0]);
  const constraintsRef = useRef(null);

  const riskColors: Record<string, string> = {
    HIGH: "var(--sovereign-riskred)",
    MEDIUM: "#FFD600",
    LOW: "var(--sovereign-cyan)",
  };
  const riskColor = riskColors[approval.riskLevel] ?? "var(--sovereign-cyan)";

  const handleDragEnd = (_: unknown, info: { offset: { x: number } }) => {
    if (info.offset.x > 100) onApprove(approval.id);
    else if (info.offset.x < -100) onReject(approval.id);
  };

  return (
    <motion.div
      ref={constraintsRef}
      style={{
        x,
        rotate,
        opacity: cardOpacity,
        cursor: isTop ? "grab" : "default",
        position: "relative",
        zIndex: isTop ? 2 : 1,
        userSelect: "none",
        padding: "32px",
        overflow: "hidden",
        borderTop: `2px solid ${riskColor}`,
      }}
      drag={isTop ? "x" : false}
      dragConstraints={{ left: -300, right: 300 }}
      dragElastic={0.15}
      onDragEnd={handleDragEnd}
      className="glass-card-level-1"
    >
      {/* Swipe indicators */}
      <motion.div
        style={{
          opacity: approveOpacity,
          position: "absolute",
          top: "50%",
          left: "2rem",
          transform: "translateY(-50%)",
          zIndex: 10,
          pointerEvents: "none",
        }}
      >
        <div style={{
          border: "2px solid #00E676",
          color: "#00E676",
          padding: "6px 16px",
          fontFamily: "var(--font-jetbrains, monospace)",
          fontSize: "0.75rem",
          letterSpacing: "0.1em",
          fontWeight: 700,
          transform: "rotate(-15deg)",
        }}>
          ✓ FREIGEBEN
        </div>
      </motion.div>

      <motion.div
        style={{
          opacity: rejectOpacity,
          position: "absolute",
          top: "50%",
          right: "2rem",
          transform: "translateY(-50%)",
          zIndex: 10,
          pointerEvents: "none",
        }}
      >
        <div style={{
          border: "2px solid var(--sovereign-riskred)",
          color: "var(--sovereign-riskred)",
          padding: "6px 16px",
          fontFamily: "var(--font-jetbrains, monospace)",
          fontSize: "0.75rem",
          letterSpacing: "0.1em",
          fontWeight: 700,
          transform: "rotate(15deg)",
        }}>
          ✗ ABLEHNEN
        </div>
      </motion.div>

      {/* Card content */}
      <div style={{ position: "relative", zIndex: 1 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "20px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap" }}>
            <span className="category-chip" style={{ color: "var(--sovereign-cyan)", borderColor: "rgba(0,229,255,0.3)" }}>
              <Zap size={12} /> {approval.agentName}
            </span>
            <span style={{
              fontFamily: "var(--font-jetbrains, monospace)", fontSize: "0.52rem",
              letterSpacing: "0.1em", padding: "3px 10px",
              border: `1px solid ${riskColor}40`, color: riskColor,
            }}>
              RISIKO: {approval.riskLevel}
            </span>
          </div>
          {approval.expiresAt && (
            <span className="deadline-chip deadline-chip-warning" style={{ flexShrink: 0 }}>
              Frist: {new Date(approval.expiresAt).toLocaleDateString("de-DE")}
            </span>
          )}
        </div>

        <h3 style={{ fontSize: "1.3rem", fontWeight: 800, marginBottom: "10px", letterSpacing: "-0.02em" }}>
          {approval.title}
        </h3>
        <p style={{ color: "var(--sovereign-alabaster)", lineHeight: 1.65, marginBottom: "20px", fontSize: "0.9rem" }}>
          {approval.description}
        </p>

        {/* Reason box */}
        <div style={{
          background: "var(--sovereign-glass-10)", padding: "14px 18px",
          marginBottom: "24px", display: "flex", alignItems: "flex-start", gap: "12px",
          border: "1px solid var(--sovereign-glass-border)",
        }}>
          <Info size={18} color="var(--sovereign-cyan)" style={{ flexShrink: 0, marginTop: 2 }} />
          <div>
            <p style={{ margin: "0 0 5px", fontSize: "0.68rem", textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--sovereign-slate)", fontWeight: 700 }}>
              Algorithmische Begründung
            </p>
            <p style={{ margin: 0, fontSize: "0.85rem", color: "var(--sovereign-alabaster)", lineHeight: 1.55 }}>
              {approval.reason}
            </p>
          </div>
        </div>

        {/* Savings badge */}
        {approval.savings && (
          <div style={{
            display: "inline-flex", alignItems: "center", gap: "0.5rem",
            padding: "6px 14px",
            background: "rgba(0,230,118,0.08)", border: "1px solid rgba(0,230,118,0.2)",
            color: "#00E676", fontSize: "0.82rem", fontWeight: 700,
            marginBottom: "20px",
          }}>
            Sparpotenzial: {approval.savings}
          </div>
        )}

        {/* Action buttons */}
        <div style={{ display: "flex", gap: "12px" }}>
          <button
            onClick={() => onApprove(approval.id)}
            className="primary-aura-button"
            style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}
          >
            <CheckCircle size={16} />
            Freigeben
          </button>
          <button
            onClick={() => onReject(approval.id)}
            className="secondary-button"
            style={{ padding: "0 24px", border: "1px solid rgba(255,23,68,0.3)", color: "var(--sovereign-riskred)", display: "flex", alignItems: "center", gap: "8px" }}
          >
            <XCircle size={16} />
            Ablehnen
          </button>
        </div>

        {/* Swipe hint (only on top card) */}
        {isTop && (
          <div style={{
            display: "flex", alignItems: "center", justifyContent: "center", gap: "1rem",
            marginTop: "16px", paddingTop: "16px", borderTop: "1px solid rgba(255,255,255,0.04)",
          }}>
            <span style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "0.68rem", color: "rgba(255,23,68,0.5)", fontFamily: "var(--font-jetbrains, monospace)" }}>
              <ArrowLeft size={11} /> ablehnen
            </span>
            <span style={{ fontSize: "0.6rem", color: "rgba(255,255,255,0.15)", fontFamily: "var(--font-jetbrains, monospace)" }}>
              oder wischen
            </span>
            <span style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "0.68rem", color: "rgba(0,230,118,0.5)", fontFamily: "var(--font-jetbrains, monospace)" }}>
              freigeben <ArrowRight size={11} />
            </span>
          </div>
        )}
      </div>
    </motion.div>
  );
}

export default function ApprovalsPage() {
  const { user, loading: authLoading } = useRequireAuth();
  const [approvals, setApprovals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [dismissed, setDismissed] = useState<string[]>([]);

  useEffect(() => {
    if (!user) return;
    async function loadApprovals() {
      try {
        setLoading(true);
        const data = await api.approvals.list('PENDING');
        setApprovals(data?.approvals?.length > 0 ? data.approvals : MOCK_APPROVALS);
      } catch {
        setApprovals(MOCK_APPROVALS);
      } finally {
        setLoading(false);
      }
    }
    loadApprovals();
  }, [user]);

  const handleApprove = async (id: string) => {
    try {
      if (!id.startsWith('mock-')) await api.approvals.approve(id);
    } catch { /* noop */ }
    setDismissed(prev => [...prev, id]);
  };

  const handleReject = async (id: string) => {
    try {
      if (!id.startsWith('mock-')) await api.approvals.reject(id);
    } catch { /* noop */ }
    setDismissed(prev => [...prev, id]);
  };

  if (authLoading) return null;

  const visible = approvals.filter(a => !dismissed.includes(a.id));
  const allDone = !loading && visible.length === 0;

  return (
    <div style={{ maxWidth: '680px', margin: '0 auto' }}>
      <header style={{ marginBottom: '40px', textAlign: 'center' }}>
        <div style={{
          width: '56px', height: '56px', borderRadius: '16px',
          background: 'linear-gradient(135deg, rgba(0,229,255,0.1), rgba(187,134,252,0.1))',
          border: '1px solid rgba(0,229,255,0.2)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          margin: '0 auto 20px', boxShadow: '0 0 30px rgba(0,229,255,0.15)',
        }}>
          <Zap size={28} color="var(--sovereign-cyan)" />
        </div>
        <h1 style={{
          fontSize: '2.5rem', fontWeight: 800, marginBottom: '8px',
          fontFamily: 'var(--font-space-grotesk, sans-serif)', letterSpacing: '-0.03em',
        }}>
          Algorithmic Senate
        </h1>
        <p style={{ color: 'var(--sovereign-slate)', fontSize: '1.05rem', margin: 0 }}>
          Prüfung und Autorisierung autonomer Agenten-Vorschläge.
        </p>
        {!loading && !allDone && (
          <p style={{ marginTop: '12px', fontSize: '0.78rem', color: 'var(--sovereign-slate)', fontFamily: 'var(--font-jetbrains, monospace)' }}>
            {visible.length} offene{visible.length !== 1 ? ' Vorschläge' : 'r Vorschlag'} — wischen oder Buttons nutzen
          </p>
        )}
      </header>

      {loading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {[1, 2].map(i => <div key={i} className="skeleton skeleton-card" style={{ height: '320px' }} />)}
        </div>
      ) : allDone ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass-card-level-1"
          style={{ padding: '64px 32px', textAlign: 'center' }}
        >
          <div style={{
            width: '64px', height: '64px', borderRadius: '50%',
            background: 'var(--sovereign-glass-10)', border: '1px solid var(--sovereign-glass-border)',
            margin: '0 auto 24px', display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <ShieldAlert size={32} color="var(--sovereign-slate)" />
          </div>
          <h3 style={{ fontSize: '1.5rem', marginBottom: '12px', color: 'var(--sovereign-alabaster)' }}>
            Alle Vorschläge bearbeitet
          </h3>
          <p style={{ color: 'var(--sovereign-slate)', fontSize: '0.95rem', maxWidth: '400px', margin: '0 auto' }}>
            Deine autonomen Systeme arbeiten innerhalb der festgelegten Boundary Conditions. Keine weiteren Freigaben erforderlich.
          </p>
        </motion.div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <AnimatePresence>
            {visible.map((approval, index) => (
              <motion.div
                key={approval.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: 300, transition: { duration: 0.25 } }}
                transition={{ delay: index * 0.08 }}
              >
                <SwipeCard
                  approval={approval}
                  onApprove={handleApprove}
                  onReject={handleReject}
                  isTop={index === 0}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
