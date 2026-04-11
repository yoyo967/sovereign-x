'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  FileText, TrendingUp, ShieldCheck, Zap, AlertTriangle,
  Activity, ChevronRight, Clock, CheckCircle2,
} from 'lucide-react';
import { useRBAC } from '@/hooks/useRBAC';
import { api } from '@/lib/api';
import { SovereignCard } from '@/components/ui/SovereignCard';
import { RiskBadge } from '@/components/ui/RiskBadge';
import { ConfidenceBadge } from '@/components/ui/ConfidenceBadge';
import { SkeletonLoader } from '@/components/ui/SkeletonLoader';
import { ErrorState } from '@/components/ui/ErrorState';

// ─── Types ────────────────────────────────────────────────────────────────────

interface DashboardData {
  tier: string;
  totalContracts: number;
  activeContracts: number;
  totalMonthlyCostEur: number;
  totalSavingsEur: number;
  pendingApprovals: number;
  activeClaims: number;
  recentInsights: Array<{
    id?: string;
    type?: string;
    merchantName?: string;
    amount?: number;
    description?: string;
    confidence?: number;
  }>;
}

// ─── Sovereignty Score Ring ───────────────────────────────────────────────────

function SovereigntyRing({ score }: { score: number }) {
  const r = 40;
  const circumference = 2 * Math.PI * r;
  const offset = circumference - (score / 100) * circumference;
  const color = score >= 75 ? 'var(--sovereign-success, #00E676)' : score >= 50 ? 'var(--sovereign-cyan)' : '#FFD600';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <div style={{ position: 'relative', width: 100, height: 100 }}>
        <svg width={100} height={100} style={{ transform: 'rotate(-90deg)' }}>
          <circle cx={50} cy={50} r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={8} />
          <motion.circle
            cx={50} cy={50} r={r}
            fill="none" stroke={color} strokeWidth={8}
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 1.2, ease: 'easeOut' }}
          />
        </svg>
        <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <span style={{ fontSize: '1.6rem', fontWeight: 800, color, lineHeight: 1 }}>{score}</span>
          <span style={{ fontSize: '0.55rem', color: 'var(--s-text-faint)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>SCORE</span>
        </div>
      </div>
    </div>
  );
}

// ─── KPI Card ─────────────────────────────────────────────────────────────────

function KpiCard({ icon: Icon, label, value, sub, color, onClick }: {
  icon: React.ElementType; label: string; value: string | number; sub?: string; color: string; onClick?: () => void;
}) {
  return (
    <SovereignCard variant="default" onClick={onClick}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 12 }}>
        <div style={{ width: 36, height: 36, borderRadius: '10px', background: `${color}12`, border: `1px solid ${color}25`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Icon size={17} color={color} />
        </div>
        {onClick && <ChevronRight size={14} color="var(--s-text-faint)" />}
      </div>
      <p style={{ margin: '0 0 4px', fontSize: '0.72rem', color: 'var(--s-text-muted)', letterSpacing: '0.06em', textTransform: 'uppercase', fontFamily: 'var(--font-mono)' }}>{label}</p>
      <p style={{ margin: '0 0 4px', fontSize: '1.8rem', fontWeight: 800, letterSpacing: '-0.03em', lineHeight: 1 }}>{value}</p>
      {sub && <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--s-text-muted)' }}>{sub}</p>}
    </SovereignCard>
  );
}

// ─── Agents ───────────────────────────────────────────────────────────────────

const AGENTS: Array<{ id: string; name: string; status: 'active' | 'working' | 'ready' | 'alert' }> = [
  { id: 'A01', name: 'Contract Analyzer', status: 'active' },
  { id: 'A02', name: 'Finance Guardian',  status: 'active' },
  { id: 'A03', name: 'Claim Agent',       status: 'ready' },
  { id: 'A04', name: 'Negotiation AI',    status: 'ready' },
  { id: 'A05', name: 'PSD2 Connector',    status: 'ready' },
  { id: 'A06', name: 'Senate Reviewer',   status: 'active' },
  { id: 'A07', name: 'Audit Recorder',    status: 'active' },
  { id: 'A08', name: 'Notification Hub',  status: 'ready' },
];

function AgentDot({ status }: { status: 'active' | 'working' | 'ready' | 'alert' }) {
  const colors = { active: 'var(--sovereign-success, #00E676)', working: 'var(--sovereign-cyan)', ready: 'var(--s-text-faint)', alert: 'var(--sovereign-riskred)' };
  const c = colors[status];
  return (
    <motion.span
      animate={status === 'active' || status === 'working' ? { opacity: [1, 0.4, 1] } : {}}
      transition={{ repeat: Infinity, duration: 2 }}
      style={{ width: 7, height: 7, borderRadius: '50%', background: c, display: 'inline-block', boxShadow: status === 'active' ? `0 0 6px ${c}` : 'none', flexShrink: 0 }}
    />
  );
}

// ─── Insight config ───────────────────────────────────────────────────────────

const INSIGHT_CONFIG: Record<string, { label: string; icon: React.ElementType; color: string }> = {
  PRICE_INCREASE:      { label: 'Preiserhöhung',          icon: TrendingUp,   color: '#FFD600' },
  NEW_SUBSCRIPTION:    { label: 'Neues Abo',               icon: FileText,     color: 'var(--sovereign-cyan)' },
  SAVINGS_OPPORTUNITY: { label: 'Einsparpotenzial',        icon: TrendingUp,   color: 'var(--sovereign-success, #00E676)' },
  UNUSUAL_ACTIVITY:    { label: 'Ungewöhnl. Aktivität',    icon: AlertTriangle, color: 'var(--sovereign-riskred)' },
  DUPLICATE_PAYMENT:   { label: 'Doppelzahlung',           icon: AlertTriangle, color: 'var(--sovereign-riskred)' },
  CONTRACT_DETECTED:   { label: 'Vertrag erkannt',         icon: FileText,     color: 'var(--sovereign-purple)' },
};

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function DashboardPage() {
  const router = useRouter();
  const { tier } = useRBAC();
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const d = await api.user.getDashboard();
      setData(d);
    } catch {
      setError('Dashboard-Daten konnten nicht geladen werden.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { void load(); }, [load]);

  const score = data ? Math.min(100, Math.round(
    (data.activeContracts > 0 ? 20 : 0) +
    (data.totalSavingsEur > 0 ? 25 : 0) +
    (data.pendingApprovals === 0 ? 15 : Math.max(0, 15 - data.pendingApprovals * 3)) +
    (tier === 'SHIELD' ? 30 : tier === 'PRO' ? 20 : 10) +
    (data.activeClaims === 0 ? 10 : 5)
  )) : 0;

  if (loading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        <SkeletonLoader variant="kpi" count={4} />
        <SkeletonLoader variant="card" count={2} />
      </div>
    );
  }

  if (error) return <ErrorState message={error} onRetry={load} />;

  const d = data ?? {
    tier: 'FREE', totalContracts: 0, activeContracts: 0,
    totalMonthlyCostEur: 0, totalSavingsEur: 0,
    pendingApprovals: 0, activeClaims: 0, recentInsights: [],
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>

      {/* Title */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h1 style={{ margin: '0 0 4px', fontSize: '1.6rem', fontWeight: 800, letterSpacing: '-0.03em' }}>Overview</h1>
          <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--s-text-muted)' }}>
            {new Date().toLocaleDateString('de-DE', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
          </p>
        </div>
        {d.pendingApprovals > 0 && (
          <button className="primary-aura-button" onClick={() => router.push('/dashboard/approvals')} style={{ display: 'flex', alignItems: 'center', gap: '7px', fontSize: '0.82rem' }}>
            <CheckCircle2 size={14} />
            {d.pendingApprovals} ausstehend
          </button>
        )}
      </div>

      {/* KPI row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '16px' }}>
        <KpiCard icon={TrendingUp}   label="Monat. Kosten"  value={`€${d.totalMonthlyCostEur.toFixed(0)}`}  sub={`${d.totalContracts} Verträge gesamt`}         color="var(--sovereign-cyan)"             onClick={() => router.push('/dashboard/contracts')} />
        <KpiCard icon={FileText}     label="Aktive Verträge" value={d.activeContracts}                       sub="Laufende Abos & Dienste"                       color="var(--sovereign-purple)"           onClick={() => router.push('/dashboard/contracts')} />
        <KpiCard icon={TrendingUp}   label="Eingespart"      value={`€${d.totalSavingsEur.toFixed(0)}`}      sub="Durch KI-Optimierung"                          color="var(--sovereign-success, #00E676)" onClick={() => router.push('/dashboard/finance')} />
        <KpiCard icon={AlertTriangle} label="Alerts"          value={d.pendingApprovals + d.activeClaims}     sub={`${d.pendingApprovals} Genehm. · ${d.activeClaims} Cases`} color="#FFD600"          onClick={() => router.push('/dashboard/approvals')} />
      </div>

      {/* Main grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '20px', alignItems: 'start' }}>

        {/* Left */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

          {/* Senate feed */}
          <SovereignCard variant="default">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <h2 style={{ margin: 0, fontSize: '1rem', fontWeight: 700 }}>Senate Feed</h2>
              <span style={{ fontSize: '0.62rem', fontFamily: 'var(--font-mono)', color: 'var(--s-text-faint)', letterSpacing: '0.1em' }}>LIVE · KI-ANALYSE</span>
            </div>
            {d.recentInsights.length === 0 ? (
              <p style={{ textAlign: 'center', color: 'var(--s-text-faint)', fontSize: '0.85rem', padding: '20px 0' }}>
                Keine aktuellen Insights — KI analysiert im Hintergrund.
              </p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {d.recentInsights.slice(0, 6).map((ins, i) => {
                  const cfg = INSIGHT_CONFIG[ins.type ?? ''] ?? { label: ins.type ?? 'Info', icon: Activity, color: 'var(--s-text-muted)' };
                  const Icon = cfg.icon;
                  return (
                    <motion.div
                      key={ins.id ?? i}
                      initial={{ opacity: 0, x: -6 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.04 }}
                      style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 12px', borderRadius: '10px', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--s-divider)' }}
                    >
                      <div style={{ width: 30, height: 30, borderRadius: '8px', background: `${cfg.color}10`, border: `1px solid ${cfg.color}20`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <Icon size={14} color={cfg.color} />
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={{ margin: 0, fontSize: '0.82rem', fontWeight: 600 }}>{ins.merchantName ?? cfg.label}</p>
                        <p style={{ margin: '2px 0 0', fontSize: '0.73rem', color: 'var(--s-text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{ins.description ?? ''}</p>
                      </div>
                      {ins.amount != null && (
                        <span style={{ fontSize: '0.8rem', fontWeight: 700, color: cfg.color, whiteSpace: 'nowrap', fontFamily: 'var(--font-mono)' }}>
                          {ins.amount >= 0 ? `+€${ins.amount.toFixed(2)}` : `€${ins.amount.toFixed(2)}`}
                        </span>
                      )}
                      {ins.confidence != null && <ConfidenceBadge score={ins.confidence} size="sm" />}
                    </motion.div>
                  );
                })}
              </div>
            )}
          </SovereignCard>

          {/* Agent status */}
          <SovereignCard variant="default">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <h2 style={{ margin: 0, fontSize: '1rem', fontWeight: 700 }}>Agenten-Status</h2>
              <span style={{ fontSize: '0.62rem', fontFamily: 'var(--font-mono)', color: 'var(--sovereign-success, #00E676)', letterSpacing: '0.1em' }}>A01–A08 ONLINE</span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
              {AGENTS.map((agent) => (
                <div key={agent.id} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 10px', borderRadius: '8px', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--s-divider)' }}>
                  <AgentDot status={agent.status} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ margin: 0, fontSize: '0.65rem', fontFamily: 'var(--font-mono)', color: 'var(--s-text-faint)', letterSpacing: '0.06em' }}>{agent.id}</p>
                    <p style={{ margin: 0, fontSize: '0.78rem', fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{agent.name}</p>
                  </div>
                </div>
              ))}
            </div>
          </SovereignCard>
        </div>

        {/* Right */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

          {/* Sovereignty score */}
          <SovereignCard variant="elevated" style={{ textAlign: 'center', padding: '24px 20px' }}>
            <p style={{ margin: '0 0 16px', fontSize: '0.65rem', color: 'var(--s-text-muted)', letterSpacing: '0.12em', textTransform: 'uppercase', fontFamily: 'var(--font-mono)' }}>SOVEREIGNTY SCORE</p>
            <SovereigntyRing score={score} />
            <p style={{ margin: '14px 0 0', fontSize: '0.78rem', color: 'var(--s-text-muted)', lineHeight: 1.5 }}>
              {score >= 75 ? 'Exzellente Datensouveränität' : score >= 50 ? 'Guter Schutz — ausbaufähig' : 'Optimierungsbedarf erkannt'}
            </p>
          </SovereignCard>

          {/* Quick actions */}
          <SovereignCard variant="default" padding="16px">
            <p style={{ margin: '0 0 12px', fontSize: '0.65rem', color: 'var(--s-text-muted)', letterSpacing: '0.12em', textTransform: 'uppercase', fontFamily: 'var(--font-mono)' }}>SCHNELLZUGRIFF</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
              {[
                { label: 'Vertrag hochladen',    href: '/dashboard/contracts', icon: FileText,       color: 'var(--sovereign-cyan)' },
                { label: 'Finance Guardian',     href: '/dashboard/finance',   icon: TrendingUp,     color: 'var(--sovereign-success, #00E676)' },
                { label: 'Neuen Case erstellen', href: '/dashboard/cases',     icon: ShieldCheck,    color: 'var(--sovereign-purple)' },
                { label: 'KI konsultieren',      href: '/dashboard/terminal',  icon: Zap,            color: '#FFD600' },
              ].map(({ label, href, icon: Icon, color }) => (
                <button
                  key={href}
                  onClick={() => router.push(href)}
                  style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '9px 10px', borderRadius: '8px', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--s-divider)', cursor: 'pointer', color: 'var(--s-text)', textAlign: 'left', transition: 'background 0.15s' }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(255,255,255,0.05)')}
                  onMouseLeave={(e) => (e.currentTarget.style.background = 'rgba(255,255,255,0.02)')}
                >
                  <Icon size={14} color={color} />
                  <span style={{ fontSize: '0.82rem', fontWeight: 500, flex: 1 }}>{label}</span>
                  <ChevronRight size={12} color="var(--s-text-faint)" />
                </button>
              ))}
            </div>
          </SovereignCard>

          {/* Alerts */}
          {d.pendingApprovals > 0 && (
            <SovereignCard variant="danger" onClick={() => router.push('/dashboard/approvals')} padding="16px">
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Clock size={17} color="var(--sovereign-riskred)" />
                <div>
                  <p style={{ margin: 0, fontSize: '0.84rem', fontWeight: 700, color: 'var(--sovereign-riskred)' }}>{d.pendingApprovals} ausstehend</p>
                  <p style={{ margin: '2px 0 0', fontSize: '0.73rem', color: 'var(--s-text-muted)' }}>Jetzt prüfen →</p>
                </div>
              </div>
            </SovereignCard>
          )}

          {d.activeClaims > 0 && (
            <SovereignCard variant="default" onClick={() => router.push('/dashboard/cases')} padding="16px">
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <ShieldCheck size={17} color="var(--sovereign-purple)" />
                <div style={{ flex: 1 }}>
                  <p style={{ margin: 0, fontSize: '0.84rem', fontWeight: 700 }}>{d.activeClaims} aktive Cases</p>
                  <p style={{ margin: '2px 0 0', fontSize: '0.73rem', color: 'var(--s-text-muted)' }}>Status prüfen →</p>
                </div>
                <RiskBadge level="medium" size="sm" />
              </div>
            </SovereignCard>
          )}
        </div>
      </div>
    </div>
  );
}
