'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { useTranslations } from 'next-intl';
import {
  FileText, Plus, Search, Filter, Calendar, AlertTriangle,
  Upload, X, CheckCircle, Loader2, ChevronRight, Building2,
  Euro, Clock, AlertCircle, ChevronDown, Shield, Zap, Info
} from 'lucide-react';
import { api } from '@/lib/api';
import { useRequireAuth } from '@/hooks/useRequireAuth';

// ─── Types ──────────────────────────────────────────────
interface Contract {
  id: string;
  category: string;
  status: string;
  provider: string;
  name: string;
  monthlyCostEur?: number;
  nextPaymentDate?: string;
  riskLevel?: 'HIGH' | 'MEDIUM' | 'LOW' | 'NONE';
  aiConfidence?: number;
  autoRenewal?: boolean;
  noticePeriodDays?: number;
}

interface DetectedContract {
  provider: string;
  category: string;
  monthlyCost: string;
  noticePeriod: string;
  nextRenewal: string;
  autoRenewal: boolean;
  confidence: number;
}

const MOCK_RESULT: DetectedContract = {
  provider: "Telekom Deutschland",
  category: "TELEKOMMUNIKATION",
  monthlyCost: "39,95",
  noticePeriod: "1 Monat zum Monatsende",
  nextRenewal: "31.08.2025",
  autoRenewal: true,
  confidence: 94,
};

// ─── Risk Badge ──────────────────────────────────────────
function RiskBadge({ level }: { level?: string }) {
  const t = useTranslations('dashboard.contracts.riskBadge');
  if (!level || level === 'NONE') return null;

  const config: Record<string, { color: string; bg: string }> = {
    HIGH: { color: 'var(--sovereign-riskred)', bg: 'rgba(255,23,68,0.08)' },
    MEDIUM: { color: '#FFD600', bg: 'rgba(255,214,0,0.08)' },
    LOW: { color: 'var(--sovereign-cyan)', bg: 'rgba(0,229,255,0.06)' },
  };
  const style = config[level] ?? config.LOW;

  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: '4px',
      padding: '2px 8px', fontSize: '0.62rem', fontWeight: 700,
      letterSpacing: '0.06em', fontFamily: 'var(--font-jetbrains, monospace)',
      color: style.color, background: style.bg,
      border: `1px solid ${style.color}30`,
    }}>
      <Shield size={8} />
      {t(level as 'HIGH' | 'MEDIUM' | 'LOW' | 'NONE')}
    </span>
  );
}

// ─── AI Confidence Indicator ─────────────────────────────
function AIConfidenceChip({ confidence }: { confidence: number }) {
  const t = useTranslations('dashboard.contracts');
  const color = confidence >= 80 ? 'var(--sovereign-success)' : confidence >= 60 ? '#FFD600' : 'var(--sovereign-riskred)';
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: '4px',
      padding: '2px 8px', fontSize: '0.6rem', fontWeight: 700,
      letterSpacing: '0.04em', fontFamily: 'var(--font-jetbrains, monospace)',
      color, background: `${color}10`, border: `1px solid ${color}30`,
    }}>
      <Zap size={8} />
      {t('aiConfidence')} {confidence}%
    </span>
  );
}

// ─── Upload Modal ────────────────────────────────────────
type UploadStep = 'idle' | 'analyzing' | 'result' | 'done';

function UploadModal({ onClose }: { onClose: () => void }) {
  const t = useTranslations('dashboard.contracts.upload');
  const [step, setStep] = useState<UploadStep>('idle');
  const [fileName, setFileName] = useState('');
  const [dragOver, setDragOver] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback((file: File) => {
    setFileName(file.name);
    setStep('analyzing');
    setAnalysisProgress(0);
    const steps = [15, 35, 55, 72, 88, 94, 100];
    steps.forEach((val, i) => {
      setTimeout(() => {
        setAnalysisProgress(val);
        if (val === 100) setTimeout(() => setStep('result'), 400);
      }, i * 380);
    });
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type === 'application/pdf') handleFile(file);
  }, [handleFile]);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  }, [handleFile]);

  const ANALYSIS_STEP_KEYS = ['read', 'ocr', 'type', 'terms', 'deadlines', 'special', 'done'] as const;
  const ANALYSIS_THRESHOLDS = [15, 35, 55, 72, 88, 94, 100];

  return (
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 9999,
        background: 'rgba(8,14,26,0.85)', backdropFilter: 'blur(8px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '1.5rem',
      }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ duration: 0.2 }}
        style={{
          width: '100%', maxWidth: 560,
          background: '#0D1929',
          border: '1px solid rgba(0,212,255,0.15)',
          padding: '2rem',
          position: 'relative',
          borderRadius: '4px',
        }}
      >
        <button
          onClick={onClose}
          aria-label="Schließen"
          style={{ position: 'absolute', top: '1.25rem', right: '1.25rem', background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.35)', padding: 4 }}
        >
          <X size={18} />
        </button>

        {step === 'idle' && (
          <>
            <p style={{ fontFamily: 'var(--font-jetbrains, monospace)', fontSize: '0.58rem', letterSpacing: '0.12em', color: 'rgba(0,212,255,0.5)', marginBottom: '0.5rem', textTransform: 'uppercase' }}>
              {t('eyebrow')}
            </p>
            <h2 style={{ fontFamily: 'var(--font-space-grotesk, sans-serif)', fontWeight: 800, fontSize: '1.4rem', color: '#F0F4FF', marginBottom: '1.5rem', letterSpacing: '-0.02em' }}>
              {t('title')}
            </h2>
            <div
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
              onClick={() => inputRef.current?.click()}
              style={{
                border: `2px dashed ${dragOver ? 'rgba(0,212,255,0.5)' : 'rgba(0,212,255,0.2)'}`,
                background: dragOver ? 'rgba(0,212,255,0.04)' : 'rgba(0,212,255,0.01)',
                borderRadius: 2, padding: '3rem 2rem', textAlign: 'center',
                cursor: 'pointer', transition: 'all 0.15s', marginBottom: '1.5rem',
              }}
            >
              <Upload size={32} style={{ color: 'rgba(0,212,255,0.4)', margin: '0 auto 1rem', display: 'block' }} />
              <p style={{ fontSize: '0.92rem', color: 'rgba(255,255,255,0.6)', marginBottom: '0.4rem' }}>{t('dropHint')}</p>
              <p style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.3)' }}>{t('dropSub')}</p>
              <input ref={inputRef} type="file" accept=".pdf" style={{ display: 'none' }} onChange={handleFileInput} />
            </div>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
              {['Mobilfunk', 'Strom/Gas', 'Versicherung', 'Streaming', 'Fitnessstudio', 'Mietvertrag'].map((cat) => (
                <span key={cat} style={{ fontFamily: 'var(--font-jetbrains, monospace)', fontSize: '0.58rem', letterSpacing: '0.06em', color: 'rgba(255,255,255,0.3)', border: '1px solid rgba(255,255,255,0.07)', padding: '3px 8px' }}>
                  {cat}
                </span>
              ))}
            </div>
            <div style={{ padding: '0.75rem 1rem', background: 'rgba(0,212,255,0.04)', border: '1px solid rgba(0,212,255,0.1)', fontSize: '0.8rem', color: 'rgba(255,255,255,0.45)', lineHeight: 1.55 }}>
              <strong style={{ color: 'rgba(0,212,255,0.6)' }}>{t('privacyLabel')}</strong>{' '}{t('privacyNote')}
            </div>
            {/* EU AI Act disclaimer */}
            <div style={{ marginTop: '0.75rem', padding: '0.6rem 0.85rem', background: 'rgba(187,134,252,0.04)', border: '1px solid rgba(187,134,252,0.12)', fontSize: '0.72rem', color: 'rgba(255,255,255,0.35)', lineHeight: 1.5, display: 'flex', gap: '8px' }}>
              <Info size={12} color="rgba(187,134,252,0.5)" style={{ flexShrink: 0, marginTop: 1 }} />
              {t('disclaimer')}
            </div>
          </>
        )}

        {step === 'analyzing' && (
          <>
            <p style={{ fontFamily: 'var(--font-jetbrains, monospace)', fontSize: '0.58rem', letterSpacing: '0.12em', color: 'rgba(0,212,255,0.5)', marginBottom: '0.5rem', textTransform: 'uppercase' }}>
              {t('analyzingEyebrow')}
            </p>
            <h2 style={{ fontFamily: 'var(--font-space-grotesk, sans-serif)', fontWeight: 800, fontSize: '1.4rem', color: '#F0F4FF', marginBottom: '0.5rem', letterSpacing: '-0.02em' }}>
              {t('analyzingTitle')}
            </h2>
            <p style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.35)', marginBottom: '2rem' }}>{fileName}</p>
            <div style={{ height: 3, background: 'rgba(255,255,255,0.06)', marginBottom: '2rem', position: 'relative' }}>
              <motion.div
                animate={{ width: `${analysisProgress}%` }}
                transition={{ duration: 0.4, ease: 'easeOut' }}
                style={{ height: '100%', background: 'rgba(0,212,255,0.7)', position: 'absolute', left: 0, top: 0 }}
              />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {ANALYSIS_STEP_KEYS.map((key, idx) => {
                const threshold = ANALYSIS_THRESHOLDS[idx];
                const done = analysisProgress >= threshold;
                return (
                  <div key={key} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    {done
                      ? <CheckCircle size={15} style={{ color: 'rgba(0,212,255,0.7)', flexShrink: 0 }} />
                      : <Loader2 size={15} style={{ color: 'rgba(255,255,255,0.2)', flexShrink: 0 }} />
                    }
                    <span style={{ fontSize: '0.83rem', color: done ? 'rgba(255,255,255,0.65)' : 'rgba(255,255,255,0.25)' }}>
                      {t(`steps.${key}`)}
                    </span>
                  </div>
                );
              })}
            </div>
          </>
        )}

        {step === 'result' && (
          <>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
              <CheckCircle size={20} style={{ color: '#00E676', flexShrink: 0 }} />
              <div>
                <p style={{ fontFamily: 'var(--font-jetbrains, monospace)', fontSize: '0.58rem', letterSpacing: '0.12em', color: '#00E676', textTransform: 'uppercase', marginBottom: '0.2rem' }}>
                  {t('resultEyebrow', { confidence: MOCK_RESULT.confidence })}
                </p>
                <h2 style={{ fontFamily: 'var(--font-space-grotesk, sans-serif)', fontWeight: 800, fontSize: '1.3rem', color: '#F0F4FF', letterSpacing: '-0.02em', margin: 0 }}>
                  {t('resultTitle')}
                </h2>
              </div>
            </div>
            <div style={{ border: '1px solid rgba(255,255,255,0.07)', marginBottom: '1.5rem' }}>
              {([
                { icon: <Building2 size={14} />, labelKey: 'fields.provider', value: MOCK_RESULT.provider },
                { icon: <FileText size={14} />, labelKey: 'fields.category', value: MOCK_RESULT.category },
                { icon: <Euro size={14} />, labelKey: 'fields.cost', value: `€${MOCK_RESULT.monthlyCost}` },
                { icon: <Clock size={14} />, labelKey: 'fields.noticePeriod', value: MOCK_RESULT.noticePeriod },
                { icon: <Calendar size={14} />, labelKey: 'fields.nextRenewal', value: MOCK_RESULT.nextRenewal },
              ] as const).map(({ icon, labelKey, value }, i, arr) => (
                <div key={labelKey} style={{ display: 'grid', gridTemplateColumns: 'auto auto 1fr', gap: '0.75rem', padding: '0.75rem 1rem', borderBottom: i < arr.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none', alignItems: 'center' }}>
                  <span style={{ color: 'rgba(0,212,255,0.45)' }}>{icon}</span>
                  <span style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.35)', minWidth: 140 }}>{t(labelKey)}</span>
                  <span style={{ fontSize: '0.88rem', fontWeight: 600, color: 'rgba(255,255,255,0.85)' }}>{value}</span>
                </div>
              ))}
            </div>
            {MOCK_RESULT.autoRenewal && (
              <div style={{ display: 'flex', gap: '0.6rem', padding: '0.75rem 1rem', background: 'rgba(255,160,0,0.06)', border: '1px solid rgba(255,160,0,0.2)', marginBottom: '1.5rem' }}>
                <AlertCircle size={15} style={{ color: 'rgba(255,160,0,0.8)', flexShrink: 0, marginTop: 1 }} />
                <p style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.55)', lineHeight: 1.5, margin: 0 }}>
                  {t('autoRenewalWarning', { date: MOCK_RESULT.nextRenewal })}
                </p>
              </div>
            )}
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button onClick={() => setStep('done')} className="primary-aura-button" style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                {t('save')} <ChevronRight size={15} />
              </button>
              <button onClick={onClose} className="secondary-button" style={{ padding: '0.65rem 1rem' }}>
                {t('discard')}
              </button>
            </div>
          </>
        )}

        {step === 'done' && (
          <div style={{ textAlign: 'center', padding: '2rem 1rem' }}>
            <motion.div
              initial={{ scale: 0 }} animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              style={{ width: 64, height: 64, borderRadius: '50%', background: 'rgba(0,230,118,0.1)', border: '2px solid rgba(0,230,118,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}
            >
              <CheckCircle size={28} style={{ color: '#00E676' }} />
            </motion.div>
            <h2 style={{ fontFamily: 'var(--font-space-grotesk, sans-serif)', fontWeight: 800, fontSize: '1.4rem', color: '#F0F4FF', letterSpacing: '-0.02em', marginBottom: '0.5rem' }}>
              {t('doneTitle')}
            </h2>
            <p style={{ fontSize: '0.88rem', color: 'rgba(255,255,255,0.4)', lineHeight: 1.65, marginBottom: '2rem' }}>
              {t('doneText', { provider: MOCK_RESULT.provider, date: MOCK_RESULT.nextRenewal })}
            </p>
            <button onClick={onClose} className="primary-aura-button">{t('doneCta')}</button>
          </div>
        )}
      </motion.div>
    </div>
  );
}

// ─── Filter Bar ──────────────────────────────────────────
const STATUS_FILTERS = ['ALL', 'ACTIVE', 'CANCELLED', 'EXPIRED'] as const;
const RISK_FILTERS = ['ALL', 'HIGH', 'MEDIUM', 'LOW'] as const;
type StatusFilter = typeof STATUS_FILTERS[number];
type RiskFilter = typeof RISK_FILTERS[number];

// ═══════════════════════════════════════════════════════
// CONTRACTS PAGE
// ═══════════════════════════════════════════════════════
export default function ContractsPage() {
  const t = useTranslations('dashboard.contracts');
  const tStatus = useTranslations('dashboard.contracts.status');
  const { user, loading: authLoading } = useRequireAuth();
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [uploadOpen, setUploadOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('ALL');
  const [riskFilter, setRiskFilter] = useState<RiskFilter>('ALL');
  const [filterOpen, setFilterOpen] = useState(false);

  useEffect(() => {
    if (!user) return;
    async function loadContracts() {
      try {
        setLoading(true);
        const data = await api.contracts.list();
        setContracts(data?.contracts || []);
      } catch (err) {
        console.error(err);
        setError('Fehler beim Laden der Verträge.');
      } finally {
        setLoading(false);
      }
    }
    loadContracts();
  }, [user]);

  if (authLoading) return null;

  // Filter logic
  const filtered = contracts.filter(c => {
    const matchSearch = !search ||
      c.provider.toLowerCase().includes(search.toLowerCase()) ||
      c.category.toLowerCase().includes(search.toLowerCase()) ||
      c.name.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'ALL' || c.status === statusFilter;
    const matchRisk = riskFilter === 'ALL' || c.riskLevel === riskFilter;
    return matchSearch && matchStatus && matchRisk;
  });

  const hasActiveFilters = statusFilter !== 'ALL' || riskFilter !== 'ALL';

  const itemVariants: Variants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 300, damping: 24 } },
  };

  return (
    <div style={{ maxWidth: '1280px' }}>
      {/* Header */}
      <header style={{ marginBottom: '40px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '8px', fontFamily: 'var(--font-space-grotesk, sans-serif)', letterSpacing: '-0.03em' }}>
            {t('title')}
          </h1>
          <p style={{ color: 'var(--sovereign-slate)', fontSize: '1.05rem', margin: 0 }}>
            {t('subtitle')}
          </p>
        </div>
        <button onClick={() => setUploadOpen(true)} className="primary-aura-button" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Plus size={16} />
          {t('addNew')}
        </button>
      </header>

      {/* Control Bar */}
      <div style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', gap: '12px', marginBottom: '12px' }}>
          <div style={{ flex: 1, position: 'relative' }}>
            <Search size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--sovereign-slate)' }} />
            <input
              type="text"
              placeholder={t('searchPlaceholder')}
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="sovereign-input"
              style={{ paddingLeft: '44px' }}
            />
          </div>
          <button
            onClick={() => setFilterOpen(v => !v)}
            className={hasActiveFilters ? 'primary-aura-button' : 'secondary-button'}
            style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '0 20px' }}
          >
            <Filter size={15} />
            {t('filter')}
            {hasActiveFilters && (
              <span style={{
                width: '6px', height: '6px', borderRadius: '50%',
                background: 'var(--sovereign-cyan)', display: 'inline-block',
              }} />
            )}
            <ChevronDown size={13} style={{ transform: filterOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
          </button>
        </div>

        {/* Filter Panels */}
        <AnimatePresence>
          {filterOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              style={{ overflow: 'hidden' }}
            >
              <div style={{ display: 'flex', gap: '24px', padding: '16px', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--sovereign-silver)', borderRadius: '12px', flexWrap: 'wrap' }}>
                {/* Status filter */}
                <div>
                  <p style={{ fontSize: '0.7rem', color: 'var(--sovereign-slate)', marginBottom: '8px', fontFamily: 'var(--font-jetbrains, monospace)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>Status</p>
                  <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                    {STATUS_FILTERS.map(sf => (
                      <button
                        key={sf}
                        onClick={() => setStatusFilter(sf)}
                        style={{
                          padding: '4px 12px', fontSize: '0.78rem', fontWeight: 600,
                          borderRadius: '6px', border: '1px solid',
                          cursor: 'pointer',
                          borderColor: statusFilter === sf ? 'var(--sovereign-cyan)' : 'var(--sovereign-silver)',
                          color: statusFilter === sf ? 'var(--sovereign-cyan)' : 'var(--sovereign-slate)',
                          background: statusFilter === sf ? 'rgba(0,229,255,0.06)' : 'transparent',
                          transition: 'all 0.15s',
                        }}
                      >
                        {sf === 'ALL' ? 'Alle' : tStatus(sf as 'ACTIVE' | 'CANCELLED' | 'EXPIRED' | 'PENDING')}
                      </button>
                    ))}
                  </div>
                </div>
                {/* Risk filter */}
                <div>
                  <p style={{ fontSize: '0.7rem', color: 'var(--sovereign-slate)', marginBottom: '8px', fontFamily: 'var(--font-jetbrains, monospace)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>Risiko</p>
                  <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                    {RISK_FILTERS.map(rf => {
                      const riskColor = rf === 'HIGH' ? 'var(--sovereign-riskred)' : rf === 'MEDIUM' ? '#FFD600' : rf === 'LOW' ? 'var(--sovereign-cyan)' : 'var(--sovereign-slate)';
                      return (
                        <button
                          key={rf}
                          onClick={() => setRiskFilter(rf)}
                          style={{
                            padding: '4px 12px', fontSize: '0.78rem', fontWeight: 600,
                            borderRadius: '6px', border: '1px solid',
                            cursor: 'pointer',
                            borderColor: riskFilter === rf ? riskColor : 'var(--sovereign-silver)',
                            color: riskFilter === rf ? riskColor : 'var(--sovereign-slate)',
                            background: riskFilter === rf ? `${riskColor}10` : 'transparent',
                            transition: 'all 0.15s',
                          }}
                        >
                          {rf === 'ALL' ? 'Alle' : rf}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Content */}
      {loading ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '24px' }}>
          {[1, 2, 3].map(i => <div key={i} className="skeleton skeleton-card" style={{ height: '220px' }} />)}
        </div>
      ) : error ? (
        <div className="glass-card-level-1" style={{ padding: '32px', textAlign: 'center', color: 'var(--sovereign-riskred)' }}>
          <AlertTriangle size={32} style={{ margin: '0 auto 16px', display: 'block' }} />
          <p>{error}</p>
        </div>
      ) : filtered.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
          className="empty-state glass-card-level-1"
        >
          <div className="empty-state-icon">
            <FileText size={32} color="var(--sovereign-cyan)" />
          </div>
          <h3 style={{ fontSize: '1.5rem', marginBottom: '8px', color: 'var(--sovereign-alabaster)' }}>
            {t('empty.title')}
          </h3>
          <p style={{ color: 'var(--sovereign-slate)', marginBottom: '32px', maxWidth: '400px' }}>
            {t('empty.text')}
          </p>
          <div style={{ display: 'flex', gap: '16px' }}>
            <button className="primary-aura-button">{t('empty.connectBank')}</button>
            <button className="secondary-button" onClick={() => setUploadOpen(true)}>{t('empty.uploadDoc')}</button>
          </div>
        </motion.div>
      ) : (
        <motion.div
          initial="hidden"
          animate="visible"
          variants={{ hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.08 } } }}
          style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '24px' }}
        >
          {filtered.map(contract => (
            <motion.div
              key={contract.id}
              variants={itemVariants}
              className="stat-card"
              style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column' }}
              whileHover={{ borderColor: 'rgba(0,229,255,0.12)' }}
            >
              {/* Top row: chips */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px', flexWrap: 'wrap', gap: '6px' }}>
                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                  <span className="category-chip">{contract.category || 'GENERAL'}</span>
                  {contract.riskLevel && contract.riskLevel !== 'NONE' && (
                    <RiskBadge level={contract.riskLevel} />
                  )}
                </div>
                <span className={`deadline-chip ${contract.status === 'ACTIVE' ? 'deadline-chip-safe' : 'deadline-chip-warning'}`}>
                  {tStatus(contract.status as 'ACTIVE' | 'CANCELLED' | 'EXPIRED' | 'PENDING') ?? contract.status}
                </span>
              </div>

              {/* Provider info */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'var(--sovereign-glass-15)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <FileText size={20} color="var(--sovereign-cyan)" />
                </div>
                <div style={{ minWidth: 0 }}>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 700, margin: '0 0 2px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{contract.provider}</h3>
                  <p style={{ fontSize: '0.82rem', color: 'var(--sovereign-slate)', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{contract.name}</p>
                </div>
              </div>

              {/* AI confidence */}
              {contract.aiConfidence != null && (
                <div style={{ marginBottom: '12px' }}>
                  <AIConfidenceChip confidence={contract.aiConfidence} />
                </div>
              )}

              {/* Cost + next payment */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', borderTop: '1px solid var(--sovereign-silver)', paddingTop: '14px', marginTop: 'auto' }}>
                <div>
                  <p style={{ fontSize: '0.7rem', color: 'var(--sovereign-slate)', margin: '0 0 3px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    {t('costLabel')}
                  </p>
                  <p style={{ fontSize: '1.35rem', fontWeight: 800, margin: 0, letterSpacing: '-0.02em' }}>
                    €{contract.monthlyCostEur?.toFixed(2) ?? '0.00'}
                    <span style={{ fontSize: '0.78rem', fontWeight: 500, color: 'var(--sovereign-slate)' }}>
                      {t('costUnit')}
                    </span>
                  </p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <p style={{ fontSize: '0.7rem', color: 'var(--sovereign-slate)', margin: '0 0 3px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    {t('nextPayment')}
                  </p>
                  <p style={{ fontSize: '0.88rem', fontWeight: 600, margin: 0, display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <Calendar size={13} color="var(--sovereign-slate)" />
                    {contract.nextPaymentDate
                      ? new Date(contract.nextPaymentDate).toLocaleDateString('de-DE')
                      : t('unknown')}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* Upload Modal */}
      <AnimatePresence>
        {uploadOpen && <UploadModal onClose={() => setUploadOpen(false)} />}
      </AnimatePresence>
    </div>
  );
}
