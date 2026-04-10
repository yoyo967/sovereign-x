'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslations } from 'next-intl';
import {
  ShieldCheck, Plus, Clock, CheckCircle, Scale,
  Euro, ChevronDown, ChevronUp, Info, Fingerprint, ExternalLink
} from 'lucide-react';
import { api } from '@/lib/api';
import { useRequireAuth } from '@/hooks/useRequireAuth';
import { useRBAC } from '@/hooks/useRBAC';

// ─── Types ───────────────────────────────────────────────
interface Claim {
  id: string;
  title: string;
  description?: string;
  status: string;
  potentialCompensationEur?: number;
  nextStep?: string;
  legalBasis?: string;
  aiStrategy?: string;
  claimValueEur?: number;
}

// ─── 7-Stage Pipeline ─────────────────────────────────────
const PIPELINE_STAGES = [
  'OPEN', 'IN_PROGRESS', 'WAITING', 'ESCALATED',
  'LEGAL', 'NEGOTIATING', 'RESOLVED',
] as const;

type PipelineStage = typeof PIPELINE_STAGES[number];

function PipelineTracker({ status }: { status: string }) {
  const tStatus = useTranslations('dashboard.claims.status');
  const currentIdx = PIPELINE_STAGES.indexOf(status as PipelineStage);

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 0, overflowX: 'auto', padding: '4px 0' }}>
      {PIPELINE_STAGES.map((stage, idx) => {
        const isPast = idx < currentIdx;
        const isCurrent = idx === currentIdx;
        const isResolved = stage === 'RESOLVED';
        const color = isCurrent
          ? (isResolved ? 'var(--sovereign-success)' : 'var(--sovereign-cyan)')
          : isPast ? 'rgba(0,229,255,0.35)' : 'rgba(255,255,255,0.1)';

        return (
          <div key={stage} style={{ display: 'flex', alignItems: 'center' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
              <div style={{
                width: '28px', height: '28px', borderRadius: '50%',
                background: isCurrent ? `${color}20` : isPast ? 'rgba(0,229,255,0.06)' : 'rgba(255,255,255,0.03)',
                border: `2px solid ${color}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'all 0.3s', flexShrink: 0,
              }}>
                {isPast || isCurrent
                  ? <CheckCircle size={12} color={color} />
                  : <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: color }} />
                }
              </div>
              <span style={{
                fontSize: '0.52rem', fontFamily: 'var(--font-jetbrains, monospace)',
                letterSpacing: '0.04em', color, whiteSpace: 'nowrap',
                textTransform: 'uppercase', fontWeight: isCurrent ? 700 : 400,
              }}>
                {tStatus(stage as 'OPEN' | 'IN_PROGRESS' | 'WAITING' | 'ESCALATED' | 'LEGAL' | 'NEGOTIATING' | 'RESOLVED' | 'CLOSED')}
              </span>
            </div>
            {idx < PIPELINE_STAGES.length - 1 && (
              <div style={{
                width: '28px', height: '2px', flexShrink: 0,
                background: isPast ? 'rgba(0,229,255,0.25)' : 'rgba(255,255,255,0.06)',
                margin: '0 2px', marginBottom: '16px',
              }} />
            )}
          </div>
        );
      })}
    </div>
  );
}

// ─── Claim Card ──────────────────────────────────────────
function ClaimCard({ claim }: { claim: Claim }) {
  const t = useTranslations('dashboard.claims');
  const tStatus = useTranslations('dashboard.claims.status');
  const { hasTier } = useRBAC();
  const [expanded, setExpanded] = useState(false);

  const isResolved = claim.status === 'RESOLVED' || claim.status === 'CLOSED';
  const requiresBiometric = (claim.claimValueEur ?? claim.potentialCompensationEur ?? 0) > 500;
  const statusColor = isResolved ? 'var(--sovereign-success)' : 'var(--sovereign-cyan)';

  return (
    <motion.div
      layout
      className="stat-card"
      style={{ display: 'flex', flexDirection: 'column', cursor: 'default' }}
    >
      {/* Header row */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '14px' }}>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
          <span style={{
            fontFamily: 'var(--font-jetbrains, monospace)', fontSize: '0.58rem',
            letterSpacing: '0.08em', padding: '3px 8px',
            border: '1px solid rgba(0,229,255,0.2)', color: 'rgba(0,229,255,0.6)',
          }}>
            {t('claimIdPrefix')}{claim.id.slice(0, 8).toUpperCase()}
          </span>
          {requiresBiometric && (
            <span style={{
              display: 'flex', alignItems: 'center', gap: '4px',
              fontSize: '0.58rem', fontFamily: 'var(--font-jetbrains, monospace)',
              color: 'var(--sovereign-riskred)', letterSpacing: '0.06em',
            }}>
              <Fingerprint size={9} /> BIO
            </span>
          )}
        </div>
        <span style={{
          display: 'flex', alignItems: 'center', gap: '5px',
          padding: '4px 10px', fontSize: '0.68rem', fontWeight: 700,
          letterSpacing: '0.04em', borderRadius: '20px',
          background: isResolved ? 'rgba(0,230,118,0.08)' : 'rgba(0,229,255,0.06)',
          border: `1px solid ${statusColor}30`, color: statusColor,
        }}>
          {isResolved ? <CheckCircle size={11} /> : <Clock size={11} />}
          {tStatus(claim.status as PipelineStage | 'CLOSED')}
        </span>
      </div>

      {/* Title + description */}
      <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '6px', letterSpacing: '-0.01em' }}>
        {claim.title}
      </h3>
      <p style={{ fontSize: '0.85rem', color: 'var(--sovereign-slate)', marginBottom: '16px', lineHeight: 1.55, flex: 1 }}>
        {claim.description ?? t('descriptionDefault')}
      </p>

      {/* Pipeline tracker */}
      <div style={{ marginBottom: '16px' }}>
        <PipelineTracker status={claim.status} />
      </div>

      {/* Compensation + next step */}
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end',
        background: 'var(--sovereign-glass-10)', padding: '14px 16px',
        border: '1px solid var(--sovereign-glass-border)', marginBottom: '12px',
      }}>
        <div>
          <p style={{ fontSize: '0.68rem', color: 'var(--sovereign-slate)', margin: '0 0 3px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            {t('expectedCompensation')}
          </p>
          <p style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0, color: 'var(--sovereign-success)' }}>
            €{(claim.potentialCompensationEur ?? 0).toFixed(2)}
          </p>
          {hasTier('SHIELD') && (
            <p style={{ fontSize: '0.62rem', color: 'rgba(187,134,252,0.5)', margin: '2px 0 0', fontFamily: 'var(--font-jetbrains, monospace)' }}>
              {t('successFeeNote')}
            </p>
          )}
        </div>
        <div style={{ textAlign: 'right' }}>
          <p style={{ fontSize: '0.68rem', color: 'var(--sovereign-slate)', margin: '0 0 3px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            {t('nextStep')}
          </p>
          <p style={{ fontSize: '0.88rem', fontWeight: 600, margin: 0, maxWidth: '160px', textAlign: 'right' }}>
            {claim.nextStep ?? t('nextStepDefault')}
          </p>
        </div>
      </div>

      {/* Expand: Legal basis + AI Strategy */}
      {(claim.legalBasis || claim.aiStrategy) && (
        <>
          <button
            onClick={() => setExpanded(v => !v)}
            style={{
              background: 'transparent', border: 'none', cursor: 'pointer',
              display: 'flex', alignItems: 'center', gap: '6px',
              color: 'var(--sovereign-slate)', fontSize: '0.78rem', fontWeight: 600,
              padding: '6px 0',
            }}
          >
            {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            {expanded ? 'Weniger anzeigen' : `${t('legalBasis')} & ${t('aiStrategy')}`}
          </button>
          <AnimatePresence>
            {expanded && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                style={{ overflow: 'hidden' }}
              >
                <div style={{ paddingTop: '10px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {claim.legalBasis && (
                    <div style={{ padding: '12px 14px', background: 'rgba(187,134,252,0.05)', border: '1px solid rgba(187,134,252,0.12)', borderRadius: '10px' }}>
                      <p style={{ fontSize: '0.65rem', color: 'rgba(187,134,252,0.6)', fontFamily: 'var(--font-jetbrains, monospace)', letterSpacing: '0.06em', textTransform: 'uppercase', margin: '0 0 5px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <ExternalLink size={9} /> {t('legalBasis')}
                      </p>
                      <p style={{ fontSize: '0.82rem', color: 'var(--sovereign-alabaster)', margin: 0, lineHeight: 1.5 }}>{claim.legalBasis}</p>
                    </div>
                  )}
                  {claim.aiStrategy && (
                    <div style={{ padding: '12px 14px', background: 'rgba(0,229,255,0.03)', border: '1px solid rgba(0,229,255,0.1)', borderRadius: '10px' }}>
                      <p style={{ fontSize: '0.65rem', color: 'rgba(0,229,255,0.5)', fontFamily: 'var(--font-jetbrains, monospace)', letterSpacing: '0.06em', textTransform: 'uppercase', margin: '0 0 5px' }}>
                        {t('aiStrategy')}
                      </p>
                      <p style={{ fontSize: '0.82rem', color: 'var(--sovereign-alabaster)', margin: '0 0 8px', lineHeight: 1.5 }}>{claim.aiStrategy}</p>
                      <div style={{ display: 'flex', gap: '6px', alignItems: 'flex-start' }}>
                        <Info size={11} color="rgba(187,134,252,0.4)" style={{ flexShrink: 0, marginTop: 1 }} />
                        <p style={{ fontSize: '0.68rem', color: 'rgba(255,255,255,0.25)', margin: 0, lineHeight: 1.4 }}>{t('aiDisclaimer')}</p>
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </>
      )}
    </motion.div>
  );
}

// ═══════════════════════════════════════════════════════
// CLAIMS PAGE
// ═══════════════════════════════════════════════════════
export default function ClaimsCenter() {
  const t = useTranslations('dashboard.claims');
  const { user, loading: authLoading } = useRequireAuth();
  const [claims, setClaims] = useState<Claim[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    async function loadClaims() {
      try {
        setLoading(true);
        const data = await api.claims.list();
        setClaims(data?.claims || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadClaims();
  }, [user]);

  if (authLoading) return null;

  const active = claims.filter(c => c.status !== 'RESOLVED' && c.status !== 'CLOSED');
  const resolved = claims.filter(c => c.status === 'RESOLVED');
  const openValue = claims.filter(c => c.status !== 'RESOLVED').reduce((a, c) => a + (c.potentialCompensationEur ?? 0), 0);

  return (
    <div style={{ maxWidth: '1280px' }}>
      {/* Header */}
      <header style={{ marginBottom: '40px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '8px', fontFamily: 'var(--font-space-grotesk, sans-serif)', letterSpacing: '-0.03em' }}>
            {t('title')}
          </h1>
          <p style={{ color: 'var(--sovereign-slate)', fontSize: '1.05rem', margin: 0 }}>
            {t('subtitle')}
          </p>
        </div>
        <button className="primary-aura-button" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Plus size={16} />
          {t('addNew')}
        </button>
      </header>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginBottom: '32px' }}>
        {[
          { icon: Scale, color: 'var(--sovereign-cyan)', bg: 'rgba(0,229,255,0.1)', label: t('activeClaims'), value: String(active.length) },
          { icon: Euro, color: 'var(--sovereign-purple)', bg: 'rgba(187,134,252,0.1)', label: t('openDemands'), value: `€${openValue.toFixed(2)}` },
          { icon: CheckCircle, color: 'var(--sovereign-success)', bg: 'rgba(0,230,118,0.1)', label: t('resolved'), value: String(resolved.length) },
        ].map(({ icon: Icon, color, bg, label, value }) => (
          <motion.div
            key={label}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card-level-1"
            style={{ padding: '24px', display: 'flex', alignItems: 'center', gap: '20px' }}
          >
            <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Icon size={24} color={color} />
            </div>
            <div>
              <p style={{ margin: '0 0 4px', fontSize: '0.78rem', color: 'var(--sovereign-slate)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</p>
              <p style={{ margin: 0, fontSize: '1.7rem', fontWeight: 800, letterSpacing: '-0.02em' }}>{value}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Claims List */}
      {loading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {[1, 2, 3].map(i => <div key={i} className="skeleton skeleton-card" style={{ height: '200px' }} />)}
        </div>
      ) : claims.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
          className="glass-card-level-1" style={{ padding: '64px', textAlign: 'center' }}
        >
          <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'var(--sovereign-glass-10)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
            <ShieldCheck size={32} color="var(--sovereign-cyan)" />
          </div>
          <h3 style={{ fontSize: '1.5rem', marginBottom: '8px', color: 'var(--sovereign-alabaster)' }}>{t('empty.title')}</h3>
          <p style={{ color: 'var(--sovereign-slate)', maxWidth: '400px', margin: '0 auto' }}>{t('empty.text')}</p>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(440px, 1fr))', gap: '24px' }}
        >
          <AnimatePresence>
            {claims.map(claim => (
              <ClaimCard key={claim.id} claim={claim} />
            ))}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  );
}
