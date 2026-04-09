'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { CheckCircle, XCircle, Zap, Info, ShieldAlert, ArrowLeft, ArrowRight, Fingerprint, AlertTriangle } from 'lucide-react';
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
    riskLevel: "HIGH",
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

type Approval = typeof MOCK_APPROVALS[0];

// ── WebAuthn Biometric Helper ─────────────────────────────────
async function requestBiometricAuth(challengeText: string): Promise<boolean> {
  if (!window.PublicKeyCredential) return false;

  try {
    const available = await PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable();
    if (!available) return false;

    // Challenge: encode text as ArrayBuffer
    const encoder = new TextEncoder();
    const challenge = encoder.encode(challengeText + Date.now());

    const credential = await navigator.credentials.create({
      publicKey: {
        challenge,
        rp: { name: "SOVEREIGN 2030", id: window.location.hostname },
        user: {
          id: encoder.encode("sovereign-user"),
          name: "sovereign-user",
          displayName: "Sovereign User",
        },
        pubKeyCredParams: [{ type: "public-key", alg: -7 }, { type: "public-key", alg: -257 }],
        authenticatorSelection: {
          authenticatorAttachment: "platform",
          userVerification: "required",
          requireResidentKey: false,
        },
        timeout: 60000,
        attestation: "none",
      },
    });

    return credential !== null;
  } catch {
    // AbortError or NotAllowedError = user cancelled / failed
    return false;
  }
}

// ── Biometric Gate Modal ──────────────────────────────────────
function BiometricGate({
  onConfirm,
  onCancel,
}: {
  onConfirm: (verified: boolean) => void;
  onCancel: () => void;
}) {
  const t = useTranslations('dashboard.approvals');
  const [status, setStatus] = useState<'idle' | 'pending' | 'failed' | 'unsupported'>('idle');

  const handleBiometric = async () => {
    setStatus('pending');
    const supported = typeof window !== 'undefined' && !!window.PublicKeyCredential;
    if (!supported) {
      setStatus('unsupported');
      return;
    }
    const ok = await requestBiometricAuth('sovereign-high-risk-approval');
    if (ok) {
      onConfirm(true);
    } else {
      setStatus('failed');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{
        position: 'fixed', inset: 0, zIndex: 9999,
        background: 'rgba(8,14,26,0.9)', backdropFilter: 'blur(12px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '24px',
      }}
    >
      <motion.div
        initial={{ scale: 0.92, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.92, y: 20 }}
        style={{
          background: 'var(--sovereign-deep)',
          border: '1px solid rgba(255,23,68,0.25)',
          borderRadius: '24px',
          padding: '40px 36px',
          maxWidth: '440px',
          width: '100%',
          textAlign: 'center',
          boxShadow: '0 0 60px rgba(255,23,68,0.1)',
        }}
      >
        {/* Icon */}
        <div style={{
          width: '72px', height: '72px', borderRadius: '50%',
          background: 'rgba(255,23,68,0.08)',
          border: '1px solid rgba(255,23,68,0.2)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          margin: '0 auto 24px',
          boxShadow: '0 0 30px rgba(255,23,68,0.15)',
        }}>
          <Fingerprint size={36} color="var(--sovereign-riskred)" />
        </div>

        {/* Title */}
        <h3 style={{ fontSize: '1.3rem', fontWeight: 800, marginBottom: '12px', letterSpacing: '-0.02em' }}>
          {t('biometricTitle')}
        </h3>
        <p style={{ color: 'var(--sovereign-slate)', fontSize: '0.9rem', lineHeight: 1.6, marginBottom: '28px' }}>
          {t('biometricText')}
        </p>

        {/* Status feedback */}
        {status === 'failed' && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
              background: 'rgba(255,23,68,0.08)',
              border: '1px solid rgba(255,23,68,0.2)',
              borderRadius: '12px', padding: '12px 16px',
              marginBottom: '20px', display: 'flex',
              alignItems: 'center', gap: '10px',
            }}
          >
            <AlertTriangle size={16} color="var(--sovereign-riskred)" />
            <span style={{ fontSize: '0.82rem', color: 'var(--sovereign-riskred)' }}>
              {t('biometricFailed')}
            </span>
          </motion.div>
        )}
        {status === 'unsupported' && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
              background: 'rgba(255,214,0,0.06)',
              border: '1px solid rgba(255,214,0,0.15)',
              borderRadius: '12px', padding: '12px 16px',
              marginBottom: '20px', display: 'flex',
              alignItems: 'center', gap: '10px',
            }}
          >
            <AlertTriangle size={16} color="var(--sovereign-gold)" />
            <span style={{ fontSize: '0.82rem', color: 'var(--sovereign-gold)' }}>
              {t('biometricUnsupported')}
            </span>
          </motion.div>
        )}

        {/* Actions */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <button
            onClick={handleBiometric}
            disabled={status === 'pending'}
            className="primary-aura-button"
            style={{
              width: '100%',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
              opacity: status === 'pending' ? 0.6 : 1,
              cursor: status === 'pending' ? 'wait' : 'pointer',
            }}
          >
            <Fingerprint size={18} />
            {status === 'pending' ? '...' : t('biometricConfirm')}
          </button>

          {/* Demo / Skip — allows testing without real biometric hardware */}
          <button
            onClick={() => onConfirm(false)}
            className="secondary-button"
            style={{ width: '100%', fontSize: '0.8rem', opacity: 0.6 }}
          >
            {t('biometricSkip')}
          </button>

          <button
            onClick={onCancel}
            style={{
              background: 'transparent', border: 'none',
              color: 'var(--sovereign-slate)', fontSize: '0.82rem',
              cursor: 'pointer', padding: '8px',
            }}
          >
            Abbrechen
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ── SwipeCard ─────────────────────────────────────────────────
function SwipeCard({
  approval,
  onApprove,
  onReject,
  isTop,
}: {
  approval: Approval;
  onApprove: (id: string, biometricVerified?: boolean) => void;
  onReject: (id: string) => void;
  isTop: boolean;
}) {
  const t = useTranslations('dashboard.approvals');
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 0, 200], [-8, 0, 8]);
  const approveOpacity = useTransform(x, [20, 100], [0, 1]);
  const rejectOpacity = useTransform(x, [-100, -20], [1, 0]);
  const cardOpacity = useTransform(x, [-300, 0, 300], [0, 1, 0]);
  const constraintsRef = useRef(null);

  const [showBiometric, setShowBiometric] = useState(false);
  const [pendingAction, setPendingAction] = useState<'approve' | 'reject' | null>(null);

  const riskColors: Record<string, string> = {
    HIGH: 'var(--sovereign-riskred)',
    MEDIUM: '#FFD600',
    LOW: 'var(--sovereign-cyan)',
  };
  const riskColor = riskColors[approval.riskLevel] ?? 'var(--sovereign-cyan)';

  const triggerAction = (action: 'approve' | 'reject') => {
    if (approval.riskLevel === 'HIGH') {
      setPendingAction(action);
      setShowBiometric(true);
    } else {
      if (action === 'approve') onApprove(approval.id);
      else onReject(approval.id);
    }
  };

  const handleDragEnd = (_: unknown, info: { offset: { x: number } }) => {
    if (info.offset.x > 100) triggerAction('approve');
    else if (info.offset.x < -100) triggerAction('reject');
  };

  const handleBiometricConfirm = (verified: boolean) => {
    setShowBiometric(false);
    if (pendingAction === 'approve') onApprove(approval.id, verified);
    else if (pendingAction === 'reject') onReject(approval.id);
    setPendingAction(null);
  };

  const handleBiometricCancel = () => {
    setShowBiometric(false);
    setPendingAction(null);
    x.set(0); // reset card position
  };

  return (
    <>
      {showBiometric && (
        <BiometricGate onConfirm={handleBiometricConfirm} onCancel={handleBiometricCancel} />
      )}

      <motion.div
        ref={constraintsRef}
        style={{
          x,
          rotate,
          opacity: cardOpacity,
          cursor: isTop ? 'grab' : 'default',
          position: 'relative',
          zIndex: isTop ? 2 : 1,
          userSelect: 'none',
          padding: '32px',
          overflow: 'hidden',
          borderTop: `2px solid ${riskColor}`,
        }}
        drag={isTop ? 'x' : false}
        dragConstraints={{ left: -300, right: 300 }}
        dragElastic={0.15}
        onDragEnd={handleDragEnd}
        className="glass-card-level-1"
      >
        {/* Swipe indicators */}
        <motion.div
          style={{
            opacity: approveOpacity,
            position: 'absolute', top: '50%', left: '2rem',
            transform: 'translateY(-50%)', zIndex: 10, pointerEvents: 'none',
          }}
        >
          <div style={{
            border: '2px solid #00E676', color: '#00E676',
            padding: '6px 16px',
            fontFamily: 'var(--font-jetbrains, monospace)',
            fontSize: '0.75rem', letterSpacing: '0.1em', fontWeight: 700,
            transform: 'rotate(-15deg)',
          }}>
            {t('swipeApprove')}
          </div>
        </motion.div>

        <motion.div
          style={{
            opacity: rejectOpacity,
            position: 'absolute', top: '50%', right: '2rem',
            transform: 'translateY(-50%)', zIndex: 10, pointerEvents: 'none',
          }}
        >
          <div style={{
            border: '2px solid var(--sovereign-riskred)', color: 'var(--sovereign-riskred)',
            padding: '6px 16px',
            fontFamily: 'var(--font-jetbrains, monospace)',
            fontSize: '0.75rem', letterSpacing: '0.1em', fontWeight: 700,
            transform: 'rotate(15deg)',
          }}>
            {t('swipeReject')}
          </div>
        </motion.div>

        {/* Card content */}
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
              <span className="category-chip" style={{ color: 'var(--sovereign-cyan)', borderColor: 'rgba(0,229,255,0.3)' }}>
                <Zap size={12} /> {approval.agentName}
              </span>
              <span style={{
                fontFamily: 'var(--font-jetbrains, monospace)', fontSize: '0.52rem',
                letterSpacing: '0.1em', padding: '3px 10px',
                border: `1px solid ${riskColor}40`, color: riskColor,
                display: 'flex', alignItems: 'center', gap: '4px',
              }}>
                {approval.riskLevel === 'HIGH' && <Fingerprint size={9} />}
                {t('riskLabel', { level: approval.riskLevel })}
              </span>
            </div>
            {approval.expiresAt && (
              <span className="deadline-chip deadline-chip-warning" style={{ flexShrink: 0 }}>
                {t('deadlineLabel', { date: new Date(approval.expiresAt).toLocaleDateString('de-DE') })}
              </span>
            )}
          </div>

          <h3 style={{ fontSize: '1.3rem', fontWeight: 800, marginBottom: '10px', letterSpacing: '-0.02em' }}>
            {approval.title}
          </h3>
          <p style={{ color: 'var(--sovereign-alabaster)', lineHeight: 1.65, marginBottom: '20px', fontSize: '0.9rem' }}>
            {approval.description}
          </p>

          {/* Reason box */}
          <div style={{
            background: 'var(--sovereign-glass-10)', padding: '14px 18px',
            marginBottom: '24px', display: 'flex', alignItems: 'flex-start', gap: '12px',
            border: '1px solid var(--sovereign-glass-border)',
          }}>
            <Info size={18} color="var(--sovereign-cyan)" style={{ flexShrink: 0, marginTop: 2 }} />
            <div>
              <p style={{ margin: '0 0 5px', fontSize: '0.68rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--sovereign-slate)', fontWeight: 700 }}>
                {t('reasonLabel')}
              </p>
              <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--sovereign-alabaster)', lineHeight: 1.55 }}>
                {approval.reason}
              </p>
            </div>
          </div>

          {/* Savings */}
          {approval.savings && (
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
              padding: '6px 14px',
              background: 'rgba(0,230,118,0.08)', border: '1px solid rgba(0,230,118,0.2)',
              color: '#00E676', fontSize: '0.82rem', fontWeight: 700,
              marginBottom: '20px',
            }}>
              {t('savingsLabel', { amount: approval.savings })}
            </div>
          )}

          {/* HIGH-risk biometric notice */}
          {approval.riskLevel === 'HIGH' && (
            <div style={{
              display: 'flex', alignItems: 'center', gap: '8px',
              padding: '10px 14px', marginBottom: '16px',
              background: 'rgba(255,23,68,0.05)',
              border: '1px solid rgba(255,23,68,0.15)',
              borderRadius: '10px',
            }}>
              <Fingerprint size={14} color="var(--sovereign-riskred)" />
              <span style={{ fontSize: '0.75rem', color: 'var(--sovereign-riskred)', fontFamily: 'var(--font-jetbrains, monospace)', letterSpacing: '0.04em' }}>
                BIOMETRIE ERFORDERLICH
              </span>
            </div>
          )}

          {/* Action buttons */}
          <div style={{ display: 'flex', gap: '12px' }}>
            <button
              onClick={() => triggerAction('approve')}
              className="primary-aura-button"
              style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
            >
              <CheckCircle size={16} />
              {t('approve')}
            </button>
            <button
              onClick={() => triggerAction('reject')}
              className="secondary-button"
              style={{ padding: '0 24px', border: '1px solid rgba(255,23,68,0.3)', color: 'var(--sovereign-riskred)', display: 'flex', alignItems: 'center', gap: '8px' }}
            >
              <XCircle size={16} />
              {t('reject')}
            </button>
          </div>

          {/* Swipe hint */}
          {isTop && (
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem',
              marginTop: '16px', paddingTop: '16px', borderTop: '1px solid rgba(255,255,255,0.04)',
            }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.68rem', color: 'rgba(255,23,68,0.5)', fontFamily: 'var(--font-jetbrains, monospace)' }}>
                <ArrowLeft size={11} /> {t('swipeHintLeft')}
              </span>
              <span style={{ fontSize: '0.6rem', color: 'rgba(255,255,255,0.15)', fontFamily: 'var(--font-jetbrains, monospace)' }}>
                {t('swipeHintOr')}
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.68rem', color: 'rgba(0,230,118,0.5)', fontFamily: 'var(--font-jetbrains, monospace)' }}>
                {t('swipeHintRight')} <ArrowRight size={11} />
              </span>
            </div>
          )}
        </div>
      </motion.div>
    </>
  );
}

// ═══════════════════════════════════════════════════════
// APPROVALS PAGE
// ═══════════════════════════════════════════════════════
export default function ApprovalsPage() {
  const t = useTranslations('dashboard.approvals');
  const { user, loading: authLoading } = useRequireAuth();
  const [approvals, setApprovals] = useState<Approval[]>([]);
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

  const handleApprove = async (id: string, biometricVerified = false) => {
    try {
      if (!id.startsWith('mock-')) await api.approvals.approve(id, biometricVerified);
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
          {t('title')}
        </h1>
        <p style={{ color: 'var(--sovereign-slate)', fontSize: '1.05rem', margin: 0 }}>
          {t('subtitle')}
        </p>
        {!loading && !allDone && (
          <p style={{ marginTop: '12px', fontSize: '0.78rem', color: 'var(--sovereign-slate)', fontFamily: 'var(--font-jetbrains, monospace)' }}>
            {t('openCount', { count: visible.length })}
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
            {t('allDoneTitle')}
          </h3>
          <p style={{ color: 'var(--sovereign-slate)', fontSize: '0.95rem', maxWidth: '400px', margin: '0 auto' }}>
            {t('allDoneText')}
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
