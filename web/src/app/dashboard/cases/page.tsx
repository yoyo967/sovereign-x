'use client';

import { useEffect, useCallback, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, X, AlertTriangle, ChevronRight, FileText, Scale, Clock, TrendingUp } from 'lucide-react';
import { api } from '@/lib/api';
import { useRBAC } from '@/hooks/useRBAC';
import { useCaseStore, type Case, type CaseStatus } from '@/stores/caseStore';
import { SovereignCard } from '@/components/ui/SovereignCard';
import { SkeletonLoader } from '@/components/ui/SkeletonLoader';
import { EmptyState } from '@/components/ui/EmptyState';
import { ErrorState } from '@/components/ui/ErrorState';
import { RiskBadge } from '@/components/ui/RiskBadge';
import { ConfidenceBadge } from '@/components/ui/ConfidenceBadge';
import { PlanGateBadge } from '@/components/ui/PlanGateBadge';
import { SwipeToApprove } from '@/components/ui/SwipeToApprove';
import { AuditLogEntry } from '@/components/ui/AuditLogEntry';

// ─── Constants ────────────────────────────────────────────────────────────────

const PIPELINE_STAGES: CaseStatus[] = ['OPEN', 'IN_PROGRESS', 'WAITING', 'ESCALATED', 'LEGAL', 'NEGOTIATING', 'RESOLVED'];

const STAGE_LABELS: Record<CaseStatus, string> = {
  OPEN: 'Offen',
  IN_PROGRESS: 'In Bearbeitung',
  WAITING: 'Wartend',
  ESCALATED: 'Eskaliert',
  LEGAL: 'Rechtlich',
  NEGOTIATING: 'Verhandlung',
  RESOLVED: 'Gelöst',
};

const STAGE_COLORS: Record<CaseStatus, string> = {
  OPEN: '#BB86FC',
  IN_PROGRESS: '#03DAC6',
  WAITING: '#FFD600',
  ESCALATED: '#FF6D00',
  LEGAL: '#FF1744',
  NEGOTIATING: '#40C4FF',
  RESOLVED: '#00E676',
};

const MAHNSTUFEN = ['Erinnerung', '1. Mahnung', '2. Mahnung', 'Letzte Mahnung', 'Inkasso / Klage'];

const CASE_CATEGORIES = ['Vertragsverletzung', 'Erstattung', 'Garantie', 'Schadenersatz', 'Miete/Nebenkosten', 'Sonstiges'];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function stageIndex(status: CaseStatus): number {
  return PIPELINE_STAGES.indexOf(status);
}

function categoryRisk(status: CaseStatus) {
  if (status === 'LEGAL' || status === 'ESCALATED') return 'high' as const;
  if (status === 'NEGOTIATING') return 'medium' as const;
  return 'low' as const;
}

// ─── Pipeline Visual ──────────────────────────────────────────────────────────

function PipelineVisual({ activeStatus }: { activeStatus?: CaseStatus }) {
  return (
    <SovereignCard variant="glass" animate={false}>
      <p style={{ margin: '0 0 12px', fontSize: '0.7rem', fontFamily: 'var(--font-mono)', color: 'var(--s-text-faint)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>Case Pipeline</p>
      <div style={{ display: 'flex', alignItems: 'center', gap: 0, overflowX: 'auto', paddingBottom: '4px' }}>
        {PIPELINE_STAGES.map((stage, i) => {
          const isActive = stage === activeStatus;
          const isPast = activeStatus ? stageIndex(stage) < stageIndex(activeStatus) : false;
          return (
            <div key={stage} style={{ display: 'flex', alignItems: 'center', flexShrink: 0 }}>
              <div style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px',
              }}>
                <motion.div
                  animate={{ scale: isActive ? 1.2 : 1 }}
                  style={{
                    width: 28, height: 28, borderRadius: '50%',
                    background: isActive ? STAGE_COLORS[stage] : isPast ? 'rgba(0,230,118,0.3)' : 'rgba(255,255,255,0.06)',
                    border: `2px solid ${isActive ? STAGE_COLORS[stage] : isPast ? '#00E676' : 'rgba(255,255,255,0.12)'}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '0.65rem', fontWeight: 700, color: isActive ? '#000' : isPast ? '#00E676' : 'var(--s-text-faint)',
                  }}
                >
                  {isPast ? '✓' : i + 1}
                </motion.div>
                <span style={{ fontSize: '0.6rem', color: isActive ? STAGE_COLORS[stage] : 'var(--s-text-faint)', fontFamily: 'var(--font-mono)', whiteSpace: 'nowrap', maxWidth: 60, textAlign: 'center', lineHeight: 1.2 }}>
                  {STAGE_LABELS[stage]}
                </span>
              </div>
              {i < PIPELINE_STAGES.length - 1 && (
                <div style={{ width: 24, height: 2, background: isPast ? '#00E676' : 'rgba(255,255,255,0.08)', margin: '0 2px', marginBottom: 16 }} />
              )}
            </div>
          );
        })}
      </div>
    </SovereignCard>
  );
}

// ─── Case Card ────────────────────────────────────────────────────────────────

function CaseCard({ c, onClick }: { c: Case; onClick: () => void }) {
  return (
    <SovereignCard variant={c.status === 'LEGAL' || c.status === 'ESCALATED' ? 'danger' : 'default'} onClick={onClick} animate={false}>
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <span style={{ fontSize: '0.65rem', fontFamily: 'var(--font-mono)', color: 'var(--s-text-faint)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>{c.category}</span>
            <RiskBadge level={categoryRisk(c.status)} size="sm" />
          </div>
          <h3 style={{ margin: '0 0 4px', fontSize: '0.95rem', fontWeight: 700 }}>{c.title}</h3>
          <p style={{ margin: '0 0 10px', fontSize: '0.8rem', color: 'var(--s-text-muted)', lineHeight: 1.4 }}>{c.description.slice(0, 100)}{c.description.length > 100 ? '…' : ''}</p>
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
            <span style={{
              padding: '2px 8px', borderRadius: '20px', fontSize: '0.65rem', fontWeight: 600, fontFamily: 'var(--font-mono)',
              background: `${STAGE_COLORS[c.status]}18`, color: STAGE_COLORS[c.status], border: `1px solid ${STAGE_COLORS[c.status]}40`,
            }}>{STAGE_LABELS[c.status]}</span>
            {c.claimAmountEur != null && (
              <span style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: '#FFD600' }}>€{c.claimAmountEur.toFixed(2)}</span>
            )}
            {c.aiConfidence != null && <ConfidenceBadge score={c.aiConfidence} size="sm" />}
          </div>
        </div>
        <ChevronRight size={16} style={{ color: 'var(--s-text-faint)', flexShrink: 0, marginTop: 4 }} />
      </div>
      {c.nextStep && (
        <div style={{ marginTop: '10px', paddingTop: '10px', borderTop: '1px solid var(--s-divider)' }}>
          <p style={{ margin: 0, fontSize: '0.73rem', color: 'var(--s-text-muted)' }}>
            <span style={{ color: '#03DAC6', fontWeight: 600 }}>Nächster Schritt:</span> {c.nextStep}
          </p>
        </div>
      )}
    </SovereignCard>
  );
}

// ─── Detail Modal ─────────────────────────────────────────────────────────────

function CaseDetailModal({ c, onClose, onEscalate }: { c: Case; onClose: () => void; onEscalate: () => Promise<void> }) {
  const [mahnstufe, setMahnstufe] = useState(0);
  const needsBiometric = c.status === 'ESCALATED' || c.status === 'LEGAL';

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', zIndex: 1000, display: 'flex', alignItems: 'flex-end', justifyContent: 'center', padding: '0 0 0 0' }}
      onClick={onClose}
    >
      <motion.div
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ type: 'spring', damping: 30, stiffness: 300 }}
        onClick={(e) => e.stopPropagation()}
        style={{
          background: 'var(--sovereign-surface, #0F1724)', borderRadius: '20px 20px 0 0',
          padding: '24px', width: '100%', maxWidth: 680, maxHeight: '85vh', overflowY: 'auto',
          border: '1px solid var(--s-divider)', borderBottom: 'none',
        }}
      >
        {/* Handle */}
        <div style={{ width: 40, height: 4, borderRadius: 2, background: 'rgba(255,255,255,0.15)', margin: '0 auto 20px' }} />

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', marginBottom: '20px' }}>
          <div style={{ flex: 1 }}>
            <p style={{ margin: '0 0 2px', fontSize: '0.65rem', fontFamily: 'var(--font-mono)', color: 'var(--s-text-faint)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{c.category}</p>
            <h2 style={{ margin: '0 0 6px', fontSize: '1.2rem', fontWeight: 800 }}>{c.title}</h2>
            <p style={{ margin: 0, fontSize: '0.82rem', color: 'var(--s-text-muted)', lineHeight: 1.5 }}>{c.description}</p>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--s-text-faint)', cursor: 'pointer', padding: 4 }}>
            <X size={20} />
          </button>
        </div>

        {/* Pipeline */}
        <div style={{ marginBottom: '20px' }}>
          <PipelineVisual activeStatus={c.status} />
        </div>

        {/* Metrics */}
        <div style={{ display: 'flex', gap: '12px', marginBottom: '20px', flexWrap: 'wrap' }}>
          {c.claimAmountEur != null && (
            <SovereignCard variant="glass" animate={false} padding="12px 16px">
              <p style={{ margin: '0 0 2px', fontSize: '0.6rem', color: 'var(--s-text-faint)', fontFamily: 'var(--font-mono)', textTransform: 'uppercase' }}>Forderung</p>
              <p style={{ margin: 0, fontSize: '1.1rem', fontWeight: 700, fontFamily: 'var(--font-mono)', color: '#FFD600' }}>€{c.claimAmountEur.toFixed(2)}</p>
            </SovereignCard>
          )}
          {c.compensationEur != null && (
            <SovereignCard variant="glass" animate={false} padding="12px 16px">
              <p style={{ margin: '0 0 2px', fontSize: '0.6rem', color: 'var(--s-text-faint)', fontFamily: 'var(--font-mono)', textTransform: 'uppercase' }}>Erstattet</p>
              <p style={{ margin: 0, fontSize: '1.1rem', fontWeight: 700, fontFamily: 'var(--font-mono)', color: '#00E676' }}>€{c.compensationEur.toFixed(2)}</p>
            </SovereignCard>
          )}
          {c.aiConfidence != null && (
            <SovereignCard variant="glass" animate={false} padding="12px 16px">
              <p style={{ margin: '0 0 4px', fontSize: '0.6rem', color: 'var(--s-text-faint)', fontFamily: 'var(--font-mono)', textTransform: 'uppercase' }}>KI-Konfidenz</p>
              <ConfidenceBadge score={c.aiConfidence} />
            </SovereignCard>
          )}
        </div>

        {/* AI Strategy */}
        {c.aiStrategy && (
          <SovereignCard variant="glass" animate={false}>
            <p style={{ margin: '0 0 8px', fontSize: '0.65rem', fontFamily: 'var(--font-mono)', color: '#BB86FC', textTransform: 'uppercase', letterSpacing: '0.08em' }}>KI-Strategie</p>
            <p style={{ margin: '0 0 4px', fontSize: '0.82rem', color: 'var(--s-text-muted)', lineHeight: 1.6 }}>{c.aiStrategy}</p>
            {c.legalBasis && (
              <p style={{ margin: '8px 0 0', fontSize: '0.73rem', color: '#03DAC6' }}>
                <span style={{ fontWeight: 600 }}>Rechtliche Grundlage: </span>{c.legalBasis}
              </p>
            )}
          </SovereignCard>
        )}

        {/* Mahnstufen-Eskalation */}
        {(c.status === 'OPEN' || c.status === 'IN_PROGRESS' || c.status === 'WAITING') && (
          <div style={{ marginTop: '20px' }}>
            <p style={{ margin: '0 0 12px', fontSize: '0.7rem', fontFamily: 'var(--font-mono)', color: 'var(--s-text-faint)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Mahnwesen</p>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '12px' }}>
              {MAHNSTUFEN.map((m, i) => (
                <button
                  key={m}
                  onClick={() => setMahnstufe(i)}
                  style={{
                    padding: '4px 12px', borderRadius: 20, fontSize: '0.72rem', fontWeight: 600,
                    background: mahnstufe === i ? 'rgba(187,134,252,0.15)' : 'rgba(255,255,255,0.04)',
                    border: `1px solid ${mahnstufe === i ? 'rgba(187,134,252,0.4)' : 'rgba(255,255,255,0.1)'}`,
                    color: mahnstufe === i ? '#BB86FC' : 'var(--s-text-muted)',
                    cursor: 'pointer',
                  }}
                >{m}</button>
              ))}
            </div>
            <SwipeToApprove onApprove={onEscalate} onReject={onClose} requireBiometric={needsBiometric}>
              <div style={{ padding: '10px 14px', borderRadius: 10, background: 'rgba(255,214,0,0.06)', border: '1px solid rgba(255,214,0,0.2)', fontSize: '0.8rem', color: 'var(--s-text-muted)' }}>
                Sende <strong style={{ color: '#FFD600' }}>{MAHNSTUFEN[mahnstufe]}</strong> — wische zum Bestätigen
              </div>
            </SwipeToApprove>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}

// ─── Create Modal ─────────────────────────────────────────────────────────────

function CreateCaseModal({ onClose, onCreated }: { onClose: () => void; onCreated: () => void }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState(CASE_CATEGORIES[0]);
  const [amount, setAmount] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) { setError('Titel und Beschreibung erforderlich.'); return; }
    setSubmitting(true);
    setError('');
    try {
      await api.claims.create({ title, description, category, ...(amount ? { claimAmountEur: parseFloat(amount) } : {}) });
      onCreated();
      onClose();
    } catch {
      setError('Fehler beim Erstellen des Falls.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        style={{ background: 'var(--sovereign-surface, #0F1724)', borderRadius: 16, padding: '28px', width: '100%', maxWidth: 500, border: '1px solid var(--s-divider)' }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
          <h2 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 800 }}>Neuer Fall</h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--s-text-faint)', cursor: 'pointer' }}><X size={20} /></button>
        </div>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.72rem', color: 'var(--s-text-faint)', marginBottom: '6px', fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Titel *</label>
            <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="z.B. Rückerstattung Vodafone" style={{ width: '100%', padding: '10px 14px', borderRadius: 8, background: 'rgba(255,255,255,0.04)', border: '1px solid var(--s-divider)', color: 'var(--s-text)', fontSize: '0.9rem', outline: 'none', boxSizing: 'border-box' }} />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.72rem', color: 'var(--s-text-faint)', marginBottom: '6px', fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Kategorie</label>
            <select value={category} onChange={(e) => setCategory(e.target.value)} style={{ width: '100%', padding: '10px 14px', borderRadius: 8, background: 'rgba(255,255,255,0.04)', border: '1px solid var(--s-divider)', color: 'var(--s-text)', fontSize: '0.9rem', outline: 'none', boxSizing: 'border-box' }}>
              {CASE_CATEGORIES.map((cat) => <option key={cat} value={cat}>{cat}</option>)}
            </select>
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.72rem', color: 'var(--s-text-faint)', marginBottom: '6px', fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Beschreibung *</label>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={3} placeholder="Was ist passiert?" style={{ width: '100%', padding: '10px 14px', borderRadius: 8, background: 'rgba(255,255,255,0.04)', border: '1px solid var(--s-divider)', color: 'var(--s-text)', fontSize: '0.9rem', outline: 'none', resize: 'vertical', fontFamily: 'inherit', boxSizing: 'border-box' }} />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.72rem', color: 'var(--s-text-faint)', marginBottom: '6px', fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Forderungsbetrag (€)</label>
            <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="0.00" min="0" step="0.01" style={{ width: '100%', padding: '10px 14px', borderRadius: 8, background: 'rgba(255,255,255,0.04)', border: '1px solid var(--s-divider)', color: 'var(--s-text)', fontSize: '0.9rem', outline: 'none', boxSizing: 'border-box' }} />
          </div>
          {error && <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--sovereign-riskred)' }}>{error}</p>}
          <button type="submit" disabled={submitting} style={{ padding: '12px', borderRadius: 10, background: 'var(--sovereign-purple)', border: 'none', color: '#fff', fontSize: '0.9rem', fontWeight: 700, cursor: submitting ? 'not-allowed' : 'pointer', opacity: submitting ? 0.7 : 1 }}>
            {submitting ? 'Erstellen…' : 'Fall erstellen'}
          </button>
        </form>
      </motion.div>
    </motion.div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function CasesPage() {
  const { hasTier } = useRBAC();
  const { cases, statusFilter, isLoading, error, setCases, setLoading, setError, setStatusFilter, setActiveCase, activeCase } = useCaseStore();
  const [showCreate, setShowCreate] = useState(false);
  const [detailCase, setDetailCase] = useState<Case | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.claims.list();
      setCases(Array.isArray(data) ? data : (data?.cases ?? []));
    } catch {
      setError('Fälle konnten nicht geladen werden.');
    } finally {
      setLoading(false);
    }
  }, [setCases, setLoading, setError]);

  useEffect(() => { void load(); }, [load]);

  const filtered = statusFilter ? cases.filter((c) => c.status === statusFilter) : cases;
  const canCreate = hasTier('PRO') || cases.length < 1;

  const handleEscalate = async () => {
    if (detailCase) {
      void load();
      setDetailCase(null);
    }
  };

  if (isLoading) return <SkeletonLoader variant="card" count={3} />;
  if (error) return <ErrorState message={error} onRetry={load} />;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', maxWidth: 720, margin: '0 auto' }}>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '12px' }}>
        <div>
          <h1 style={{ margin: '0 0 4px', fontSize: '1.6rem', fontWeight: 800, letterSpacing: '-0.03em' }}>Life-Cases</h1>
          <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--s-text-muted)' }}>{cases.length} Fall{cases.length !== 1 ? '&#39;e' : ''} — {cases.filter((c) => c.status !== 'RESOLVED').length} aktiv</p>
        </div>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexShrink: 0 }}>
          {!canCreate && <PlanGateBadge required="PRO"><span /></PlanGateBadge>}
          <button
            onClick={() => canCreate && setShowCreate(true)}
            disabled={!canCreate}
            style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 16px', borderRadius: 10, background: canCreate ? 'var(--sovereign-purple)' : 'rgba(255,255,255,0.06)', border: 'none', color: canCreate ? '#fff' : 'var(--s-text-faint)', fontSize: '0.85rem', fontWeight: 700, cursor: canCreate ? 'pointer' : 'not-allowed' }}
          >
            <Plus size={16} /> Neuer Fall
          </button>
        </div>
      </div>

      {/* Pipeline Overview */}
      <PipelineVisual />

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '12px' }}>
        {[
          { label: 'Gesamt', value: cases.length, icon: <FileText size={16} />, color: '#BB86FC' },
          { label: 'Aktiv', value: cases.filter((c) => c.status !== 'RESOLVED').length, icon: <Clock size={16} />, color: '#FFD600' },
          { label: 'Rechtlich', value: cases.filter((c) => c.status === 'LEGAL').length, icon: <Scale size={16} />, color: '#FF1744' },
          { label: 'Gelöst', value: cases.filter((c) => c.status === 'RESOLVED').length, icon: <TrendingUp size={16} />, color: '#00E676' },
        ].map(({ label, value, icon, color }) => (
          <SovereignCard key={label} variant="glass" animate={false} padding="14px 16px">
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px', color }}>
              {icon}
              <span style={{ fontSize: '0.65rem', fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{label}</span>
            </div>
            <p style={{ margin: 0, fontSize: '1.5rem', fontWeight: 800, fontFamily: 'var(--font-mono)', color }}>{value}</p>
          </SovereignCard>
        ))}
      </div>

      {/* Filter */}
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
        {(['', ...PIPELINE_STAGES] as (CaseStatus | '')[]).map((s) => (
          <button
            key={s || 'all'}
            onClick={() => setStatusFilter(s)}
            style={{
              padding: '4px 12px', borderRadius: 20, fontSize: '0.72rem', fontWeight: 600,
              background: statusFilter === s ? 'rgba(187,134,252,0.15)' : 'rgba(255,255,255,0.04)',
              border: `1px solid ${statusFilter === s ? 'rgba(187,134,252,0.4)' : 'rgba(255,255,255,0.1)'}`,
              color: statusFilter === s ? '#BB86FC' : 'var(--s-text-muted)',
              cursor: 'pointer',
            }}
          >{s ? STAGE_LABELS[s] : 'Alle'}</button>
        ))}
      </div>

      {/* Cases List */}
      {filtered.length === 0 ? (
        <EmptyState
          icon={<AlertTriangle size={24} />}
          title="Keine Fälle"
          description="Erstelle deinen ersten Fall — wir kümmern uns darum."
          cta={{ label: 'Neuer Fall', onClick: () => { if (canCreate) setShowCreate(true); } }}
        />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {filtered.map((c, i) => (
            <motion.div key={c.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
              <CaseCard c={c} onClick={() => { setActiveCase(c); setDetailCase(c); }} />
            </motion.div>
          ))}
        </div>
      )}

      {/* Modals */}
      <AnimatePresence>
        {showCreate && <CreateCaseModal onClose={() => setShowCreate(false)} onCreated={load} />}
        {detailCase && (
          <CaseDetailModal
            c={detailCase}
            onClose={() => { setDetailCase(null); setActiveCase(null); }}
            onEscalate={handleEscalate}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
