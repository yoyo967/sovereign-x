'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, Upload, Search, X, AlertCircle, CheckCircle2, ChevronDown } from 'lucide-react';
import { api } from '@/lib/api';
import { useRBAC } from '@/hooks/useRBAC';
import { SovereignCard } from '@/components/ui/SovereignCard';
import { RiskBadge, type RiskLevel } from '@/components/ui/RiskBadge';
import { ConfidenceBadge } from '@/components/ui/ConfidenceBadge';
import { PlanGateBadge } from '@/components/ui/PlanGateBadge';
import { SkeletonLoader } from '@/components/ui/SkeletonLoader';
import { EmptyState } from '@/components/ui/EmptyState';
import { ErrorState } from '@/components/ui/ErrorState';
import { useContractStore } from '@/stores/contractStore';

// ─── Types ────────────────────────────────────────────────────────────────────

interface Contract {
  id: string;
  name: string;
  provider: string;
  category: string;
  status: string;
  monthlyCostEur?: number;
  nextPaymentDate?: string;
  riskLevel?: RiskLevel;
  aiConfidence?: number;
  autoRenewal?: boolean;
  noticePeriodDays?: number;
}

// ─── OCR Upload Modal ─────────────────────────────────────────────────────────

const OCR_STEPS = [
  { label: 'Datei einlesen',     progress: 15 },
  { label: 'OCR-Erkennung',      progress: 35 },
  { label: 'Typ erkennen',       progress: 55 },
  { label: 'Klauseln extrahieren', progress: 72 },
  { label: 'Fristen analysieren', progress: 88 },
  { label: 'Sonderklauseln',     progress: 94 },
  { label: 'Analyse abgeschlossen', progress: 100 },
];

function UploadModal({ onClose, onSuccess }: { onClose: () => void; onSuccess: () => void }) {
  const [step, setStep] = useState(-1);
  const [dragging, setDragging] = useState(false);

  const simulateUpload = () => {
    setStep(0);
    let i = 0;
    const interval = setInterval(() => {
      i++;
      if (i >= OCR_STEPS.length) {
        clearInterval(interval);
        setTimeout(onSuccess, 800);
      } else {
        setStep(i);
      }
    }, 600);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <motion.div
        initial={{ scale: 0.95, y: 16 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95 }}
        style={{ width: '100%', maxWidth: 480, background: '#0A1628', border: '1px solid rgba(0,212,255,0.15)', borderRadius: 20, padding: '2rem' }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 700 }}>Vertrag analysieren</h3>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--s-text-muted)', padding: 4 }}><X size={18} /></button>
        </div>

        {step === -1 ? (
          <>
            <div
              onDragEnter={() => setDragging(true)}
              onDragLeave={() => setDragging(false)}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => { e.preventDefault(); setDragging(false); simulateUpload(); }}
              onClick={simulateUpload}
              style={{
                border: `2px dashed ${dragging ? 'var(--sovereign-cyan)' : 'rgba(255,255,255,0.12)'}`,
                borderRadius: 14, padding: '40px 20px', textAlign: 'center', cursor: 'pointer',
                background: dragging ? 'rgba(0,212,255,0.04)' : 'transparent', transition: 'all 0.2s', marginBottom: '1.5rem',
              }}
            >
              <Upload size={32} color="var(--sovereign-cyan)" style={{ margin: '0 auto 12px', display: 'block' }} />
              <p style={{ margin: '0 0 6px', fontWeight: 600, fontSize: '0.9rem' }}>PDF oder Foto hier ablegen</p>
              <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--s-text-muted)' }}>oder klicken zum Auswählen</p>
            </div>
            <div style={{ padding: '10px 14px', borderRadius: 10, background: 'rgba(187,134,252,0.04)', border: '1px solid rgba(187,134,252,0.12)', marginBottom: '1rem' }}>
              <p style={{ margin: 0, fontSize: '0.73rem', color: 'var(--s-text-muted)', lineHeight: 1.6 }}>
                <span style={{ color: 'var(--sovereign-purple)', fontWeight: 600 }}>EU AI Act Art. 13:</span> Diese Analyse wird durch das Sovereign-KI-System durchgeführt. Verarbeitungsergebnisse sind als Hinweis zu verstehen — keine Rechtsberatung.
              </p>
            </div>
          </>
        ) : (
          <div>
            <div style={{ marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ fontSize: '0.82rem', fontWeight: 600 }}>{OCR_STEPS[step]?.label ?? 'Verarbeitung…'}</span>
                <span style={{ fontSize: '0.8rem', fontFamily: 'var(--font-mono)', color: 'var(--sovereign-cyan)' }}>{OCR_STEPS[step]?.progress ?? 0}%</span>
              </div>
              <div style={{ height: 6, background: 'rgba(255,255,255,0.06)', borderRadius: 3, overflow: 'hidden' }}>
                <motion.div
                  animate={{ width: `${OCR_STEPS[step]?.progress ?? 0}%` }}
                  transition={{ duration: 0.5 }}
                  style={{ height: '100%', background: 'linear-gradient(90deg, var(--sovereign-cyan), var(--sovereign-purple))', borderRadius: 3 }}
                />
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {OCR_STEPS.slice(0, step + 1).map((s, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <CheckCircle2 size={13} color="var(--sovereign-success, #00E676)" />
                  <span style={{ fontSize: '0.78rem', color: 'var(--s-text-muted)' }}>{s.label}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}

// ─── Contract Card ────────────────────────────────────────────────────────────

function ContractCard({ contract, expanded, onToggle }: { contract: Contract; expanded: boolean; onToggle: () => void }) {
  const renewalDays = contract.noticePeriodDays;
  const urgentDays = renewalDays != null && renewalDays <= 30;

  return (
    <SovereignCard variant="default" animate={false} style={{ cursor: 'pointer' }} onClick={onToggle}>
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px' }}>
        <div style={{ width: 38, height: 38, borderRadius: '10px', background: 'rgba(0,212,255,0.06)', border: '1px solid rgba(0,212,255,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <FileText size={17} color="var(--sovereign-cyan)" />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', marginBottom: '4px' }}>
            <p style={{ margin: 0, fontSize: '0.9rem', fontWeight: 700 }}>{contract.provider}</p>
            {contract.status === 'ACTIVE' && <span style={{ fontSize: '0.6rem', fontFamily: 'var(--font-mono)', padding: '2px 6px', borderRadius: '4px', background: 'rgba(0,230,118,0.1)', color: 'var(--sovereign-success, #00E676)', letterSpacing: '0.08em' }}>AKTIV</span>}
          </div>
          <p style={{ margin: 0, fontSize: '0.78rem', color: 'var(--s-text-muted)' }}>{contract.category} · {contract.name}</p>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '6px', flexShrink: 0 }}>
          {contract.monthlyCostEur != null && (
            <span style={{ fontSize: '0.9rem', fontWeight: 700, fontFamily: 'var(--font-mono)', color: 'var(--s-text)' }}>€{contract.monthlyCostEur.toFixed(2)}<span style={{ fontSize: '0.65rem', color: 'var(--s-text-muted)' }}>/mo</span></span>
          )}
          {contract.riskLevel && <RiskBadge level={contract.riskLevel} size="sm" />}
          <ChevronDown size={14} color="var(--s-text-faint)" style={{ transform: expanded ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
        </div>
      </div>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
            style={{ overflow: 'hidden' }}
          >
            <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid var(--s-divider)', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '12px' }}>
              {contract.nextPaymentDate && (
                <div>
                  <p style={{ margin: '0 0 2px', fontSize: '0.68rem', color: 'var(--s-text-faint)', textTransform: 'uppercase', letterSpacing: '0.08em', fontFamily: 'var(--font-mono)' }}>Nächste Zahlung</p>
                  <p style={{ margin: 0, fontSize: '0.82rem', fontWeight: 600 }}>{new Date(contract.nextPaymentDate).toLocaleDateString('de-DE')}</p>
                </div>
              )}
              {renewalDays != null && (
                <div>
                  <p style={{ margin: '0 0 2px', fontSize: '0.68rem', color: 'var(--s-text-faint)', textTransform: 'uppercase', letterSpacing: '0.08em', fontFamily: 'var(--font-mono)' }}>Kündigung in</p>
                  <p style={{ margin: 0, fontSize: '0.82rem', fontWeight: 600, color: urgentDays ? 'var(--sovereign-riskred)' : 'var(--s-text)' }}>{renewalDays} Tagen</p>
                </div>
              )}
              {contract.aiConfidence != null && (
                <div>
                  <p style={{ margin: '0 0 2px', fontSize: '0.68rem', color: 'var(--s-text-faint)', textTransform: 'uppercase', letterSpacing: '0.08em', fontFamily: 'var(--font-mono)' }}>KI-Konfidenz</p>
                  <ConfidenceBadge score={contract.aiConfidence} size="sm" />
                </div>
              )}
              {contract.autoRenewal !== undefined && (
                <div>
                  <p style={{ margin: '0 0 2px', fontSize: '0.68rem', color: 'var(--s-text-faint)', textTransform: 'uppercase', letterSpacing: '0.08em', fontFamily: 'var(--font-mono)' }}>Auto-Verlängerung</p>
                  <p style={{ margin: 0, fontSize: '0.82rem', fontWeight: 600, color: contract.autoRenewal ? '#FFD600' : 'var(--sovereign-success, #00E676)' }}>{contract.autoRenewal ? 'Aktiv' : 'Inaktiv'}</p>
                </div>
              )}
            </div>
            <div style={{ marginTop: '12px', display: 'flex', gap: '8px' }}>
              <button className="secondary-button" style={{ fontSize: '0.78rem', padding: '6px 14px' }}>Kündigen</button>
              <button className="secondary-button" style={{ fontSize: '0.78rem', padding: '6px 14px' }}>Details</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </SovereignCard>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

const STATUS_OPTIONS = ['', 'ACTIVE', 'CANCELLED', 'EXPIRED'];
const RISK_OPTIONS   = ['', 'low', 'medium', 'high'];

export default function ContractsPage() {
  const { tier } = useRBAC();
  const { filters, setFilters } = useContractStore();
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showUpload, setShowUpload] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const contractLimit = tier === 'FREE' ? 3 : 999;

  const load = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await api.contracts.list();
      setContracts(Array.isArray(data) ? data : (data?.contracts ?? []));
    } catch {
      setError('Verträge konnten nicht geladen werden.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { void load(); }, [load]);

  const filtered = contracts.filter((c) => {
    if (filters.search && !c.provider.toLowerCase().includes(filters.search.toLowerCase()) && !c.name.toLowerCase().includes(filters.search.toLowerCase())) return false;
    if (filters.status && c.status !== filters.status) return false;
    if (filters.risk && c.riskLevel !== filters.risk) return false;
    return true;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <AnimatePresence>{showUpload && <UploadModal onClose={() => setShowUpload(false)} onSuccess={() => { setShowUpload(false); void load(); }} />}</AnimatePresence>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h1 style={{ margin: '0 0 4px', fontSize: '1.6rem', fontWeight: 800, letterSpacing: '-0.03em' }}>Verträge</h1>
          <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--s-text-muted)' }}>{contracts.length} Verträge · {tier === 'FREE' ? `${Math.min(contracts.length, 3)}/3 (Free-Limit)` : 'Unbegrenzt'}</p>
        </div>
        <PlanGateBadge required="PRO" featureName="Unbegrenzte Verträge">
          <button className="primary-aura-button" onClick={() => setShowUpload(true)} style={{ display: 'flex', alignItems: 'center', gap: '7px' }}
            disabled={tier === 'FREE' && contracts.length >= contractLimit}>
            <Upload size={14} /> Vertrag hochladen
          </button>
        </PlanGateBadge>
      </div>

      {/* Toolbar */}
      <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
        <div style={{ position: 'relative', flex: '1 1 200px', minWidth: 0 }}>
          <Search size={14} color="var(--s-text-faint)" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)' }} />
          <input
            type="text"
            placeholder="Anbieter oder Vertragsname…"
            value={filters.search}
            onChange={(e) => setFilters({ search: e.target.value })}
            className="sovereign-input"
            style={{ paddingLeft: '36px' }}
          />
        </div>
        <select className="sovereign-input" style={{ width: 'auto', minWidth: 140, appearance: 'none' }} value={filters.status} onChange={(e) => setFilters({ status: e.target.value })}>
          <option value="">Alle Status</option>
          {STATUS_OPTIONS.slice(1).map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
        <select className="sovereign-input" style={{ width: 'auto', minWidth: 140, appearance: 'none' }} value={filters.risk} onChange={(e) => setFilters({ risk: e.target.value })}>
          <option value="">Alle Risiken</option>
          {RISK_OPTIONS.slice(1).map((r) => <option key={r} value={r}>{r.toUpperCase()}</option>)}
        </select>
        {(filters.search || filters.status || filters.risk) && (
          <button className="secondary-button" onClick={() => setFilters({ search: '', status: '', risk: '' })} style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <X size={13} /> Filter
          </button>
        )}
      </div>

      {/* Content */}
      {loading ? (
        <SkeletonLoader variant="list" count={4} />
      ) : error ? (
        <ErrorState message={error} onRetry={load} />
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={<FileText size={24} />}
          title="Keine Verträge gefunden"
          description="Lade deinen ersten Vertrag hoch — die KI analysiert ihn automatisch."
          cta={{ label: 'Ersten Vertrag hochladen', onClick: () => setShowUpload(true) }}
        />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {filtered.map((c, i) => (
            <motion.div key={c.id} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}>
              <ContractCard contract={c} expanded={expandedId === c.id} onToggle={() => setExpandedId(expandedId === c.id ? null : c.id)} />
            </motion.div>
          ))}
        </div>
      )}

      {/* EU AI Act */}
      <div style={{ padding: '10px 14px', borderRadius: 10, background: 'rgba(187,134,252,0.04)', border: '1px solid rgba(187,134,252,0.12)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <AlertCircle size={13} color="var(--sovereign-purple)" />
          <p style={{ margin: 0, fontSize: '0.72rem', color: 'var(--s-text-muted)' }}>
            <span style={{ fontWeight: 600, color: 'var(--sovereign-purple)' }}>EU AI Act Art. 13:</span> KI-Analysen sind Hinweise — keine Rechtsberatung. Dateien werden verarbeitet und nicht dauerhaft gespeichert.
          </p>
        </div>
      </div>
    </div>
  );
}
