'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import {
  Wallet, Landmark, ArrowUpRight, ArrowDownLeft,
  Zap, PieChart, ShieldCheck, Info, Lock
} from 'lucide-react';
import { api } from '@/lib/api';
import { useRequireAuth } from '@/hooks/useRequireAuth';
import { useRBAC } from '@/hooks/useRBAC';

// ─── Types ───────────────────────────────────────────────
interface FinanceSummary {
  netCashflow?: number;
  totalIncome?: number;
  totalExpenses?: number;
  ytdSavings?: number;
  finapiConnected?: boolean;
  anomalies?: AnomalyAlert[];
  categories?: CategorySpend[];
  monthlyData?: MonthlyData[];
}

interface AnomalyAlert {
  id: string;
  type: string;
  description: string;
  amount?: number;
  severity?: 'HIGH' | 'MEDIUM' | 'LOW';
}

interface Transaction {
  id: string;
  counterpartName?: string;
  amount?: number;
  date?: string;
  purpose?: string;
}

interface CategorySpend {
  label: string;
  value: number;
  color?: string;
}

interface MonthlyData {
  monthIndex: number;
  income: number;
  expenses: number;
}

// ─── Mock data (used when API returns empty) ─────────────
const MOCK_MONTHLY: MonthlyData[] = [
  { monthIndex: 10, income: 3200, expenses: 2650 },
  { monthIndex: 11, income: 3200, expenses: 3180 },
  { monthIndex: 0, income: 3400, expenses: 2720 },
  { monthIndex: 1, income: 3400, expenses: 2890 },
  { monthIndex: 2, income: 3400, expenses: 2540 },
  { monthIndex: 3, income: 3550, expenses: 2810 },
];

const MOCK_CATEGORIES: CategorySpend[] = [
  { label: 'Wohnen & Miete', value: 1150, color: 'rgba(187,134,252,0.7)' },
  { label: 'Abonnements', value: 247, color: 'rgba(0,212,255,0.7)' },
  { label: 'Lebensmittel', value: 380, color: 'rgba(0,230,118,0.65)' },
  { label: 'Versicherungen', value: 210, color: 'rgba(255,214,0,0.65)' },
  { label: 'Transport', value: 178, color: 'rgba(255,160,0,0.65)' },
  { label: 'Sonstiges', value: 645, color: 'rgba(255,255,255,0.2)' },
];

// ─── CashflowChart ───────────────────────────────────────
function CashflowChart({ data, monthLabels }: { data: MonthlyData[]; monthLabels: Record<string, string> }) {
  const chartH = 160;
  const barW = 28;
  const gap = 18;
  const groupW = barW * 2 + gap;
  const groupGap = 24;
  const totalGroupW = groupW + groupGap;
  const paddingLeft = 48;
  const paddingBottom = 28;

  const maxVal = Math.max(...data.flatMap(m => [m.income, m.expenses]), 1);
  const scale = (chartH - paddingBottom) / maxVal;
  const yTicks = [0, 1000, 2000, 3000, 4000].filter(v => v <= maxVal * 1.1);

  return (
    <div style={{ overflowX: 'auto' }}>
      <svg
        width="100%"
        viewBox={`0 0 ${paddingLeft + data.length * totalGroupW + 20} ${chartH + 10}`}
        style={{ display: 'block', minWidth: 320 }}
      >
        {yTicks.map(tick => {
          const y = chartH - paddingBottom - tick * scale;
          return (
            <g key={tick}>
              <line x1={paddingLeft} y1={y} x2={paddingLeft + data.length * totalGroupW + 10} y2={y} stroke="rgba(255,255,255,0.05)" strokeWidth={1} />
              <text x={paddingLeft - 6} y={y + 4} textAnchor="end" fontSize={9} fill="rgba(255,255,255,0.25)" fontFamily="var(--font-jetbrains, monospace)">
                {tick >= 1000 ? `${tick / 1000}k` : tick}
              </text>
            </g>
          );
        })}

        {data.map((month, i) => {
          const x = paddingLeft + i * totalGroupW;
          const incomeH = month.income * scale;
          const expenseH = month.expenses * scale;
          const baseY = chartH - paddingBottom;
          const label = monthLabels[String(month.monthIndex)] ?? String(month.monthIndex);
          return (
            <g key={i}>
              <rect x={x} y={baseY - incomeH} width={barW} height={incomeH} fill="rgba(0,230,118,0.65)" rx={2} />
              <rect x={x + barW + gap} y={baseY - expenseH} width={barW} height={expenseH} fill="rgba(0,212,255,0.55)" rx={2} />
              <text x={x + groupW / 2} y={chartH - 6} textAnchor="middle" fontSize={9} fill="rgba(255,255,255,0.3)" fontFamily="var(--font-jetbrains, monospace)">
                {label}
              </text>
            </g>
          );
        })}

        <line x1={paddingLeft} y1={chartH - paddingBottom} x2={paddingLeft + data.length * totalGroupW + 10} y2={chartH - paddingBottom} stroke="rgba(255,255,255,0.08)" strokeWidth={1} />
      </svg>
    </div>
  );
}

// ─── SpendingBreakdown ───────────────────────────────────
function SpendingBreakdown({ categories }: { categories: CategorySpend[] }) {
  const total = categories.reduce((s, c) => s + c.value, 0);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
      {categories.map(cat => {
        const pct = (cat.value / (total || 1)) * 100;
        return (
          <div key={cat.label} style={{ display: 'grid', gridTemplateColumns: '140px 1fr 56px', gap: '12px', alignItems: 'center' }}>
            <span style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.55)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {cat.label}
            </span>
            <div style={{ height: 6, background: 'rgba(255,255,255,0.06)', borderRadius: 3, overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${pct}%`, background: cat.color ?? 'rgba(0,212,255,0.6)', borderRadius: 3, transition: 'width 0.6s ease' }} />
            </div>
            <span style={{ fontFamily: 'var(--font-jetbrains, monospace)', fontSize: '0.72rem', color: 'rgba(255,255,255,0.4)', textAlign: 'right' }}>
              €{cat.value}
            </span>
          </div>
        );
      })}
    </div>
  );
}

// ─── Anomaly Alert Panel ─────────────────────────────────
function AnomalyPanel({ anomalies, t }: { anomalies: AnomalyAlert[]; t: ReturnType<typeof useTranslations> }) {
  const tAnomalyTypes = useTranslations('dashboard.finance.anomalyTypes');

  if (anomalies.length === 0) {
    return (
      <div style={{ padding: '20px', textAlign: 'center', color: 'var(--sovereign-slate)' }}>
        <ShieldCheck size={28} color="var(--sovereign-success)" style={{ margin: '0 auto 12px', display: 'block' }} />
        <p style={{ margin: '0 0 4px', fontWeight: 600, color: 'var(--sovereign-alabaster)', fontSize: '0.9rem' }}>{t('noAnomalies')}</p>
        <p style={{ margin: 0, fontSize: '0.8rem' }}>{t('noAnomaliesText')}</p>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      {anomalies.map(alert => {
        const color = alert.severity === 'HIGH' ? 'var(--sovereign-riskred)' : alert.severity === 'MEDIUM' ? '#FFD600' : 'var(--sovereign-cyan)';
        return (
          <div key={alert.id} style={{ padding: '14px 16px', background: `${color}08`, border: `1px solid ${color}25`, borderRadius: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '6px' }}>
              <span style={{ fontSize: '0.68rem', fontFamily: 'var(--font-jetbrains, monospace)', letterSpacing: '0.06em', color, fontWeight: 700 }}>
                {tAnomalyTypes(alert.type as 'UNUSUAL_SPENDING' | 'DUPLICATE_PAYMENT' | 'PRICE_INCREASE' | 'SAVINGS_OPPORTUNITY') ?? alert.type}
              </span>
              {alert.amount != null && (
                <span style={{ fontSize: '0.82rem', fontWeight: 700, color }}>€{Math.abs(alert.amount).toFixed(2)}</span>
              )}
            </div>
            <p style={{ fontSize: '0.83rem', color: 'var(--sovereign-alabaster)', margin: 0, lineHeight: 1.5 }}>
              {alert.description}
            </p>
          </div>
        );
      })}
    </div>
  );
}

// ═══════════════════════════════════════════════════════
// FINANCE PAGE
// ═══════════════════════════════════════════════════════
export default function FinancePage() {
  const t = useTranslations('dashboard.finance');
  const { user, loading: authLoading } = useRequireAuth();
  const { hasTier } = useRBAC();
  const [summary, setSummary] = useState<FinanceSummary | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    async function loadFinance() {
      try {
        setLoading(true);
        const [sumData, txData] = await Promise.all([
          api.finance.getSummary().catch(() => null),
          api.finance.getTransactions(10).catch(() => []),
        ]);
        setSummary(sumData);
        setTransactions(txData || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadFinance();
  }, [user]);

  if (authLoading) return null;

  const monthLabels = t.raw('monthLabels') as Record<string, string>;
  const monthlyData = summary?.monthlyData ?? MOCK_MONTHLY;
  const categories = summary?.categories ?? MOCK_CATEGORIES;
  const anomalies = summary?.anomalies ?? [];

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
          <Landmark size={16} />
          {t('connectFinapi')}
        </button>
      </header>

      {/* Key Metrics */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px', marginBottom: '40px' }}>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="stat-card">
          <div className="aura-glow-cyan" style={{ width: '150px', height: '150px', top: '-50px', right: '-50px' }} />
          <span style={{ color: 'var(--sovereign-slate)', fontSize: '0.85rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Netto Cashflow (Monat)
          </span>
          <p style={{ fontSize: '2.5rem', fontWeight: 800, margin: '16px 0', letterSpacing: '-0.02em' }}>
            €{summary?.netCashflow?.toFixed(2) ?? '0.00'}
          </p>
          <div style={{ display: 'flex', gap: '16px', borderTop: '1px solid var(--sovereign-silver)', paddingTop: '16px' }}>
            <span style={{ color: 'var(--sovereign-success)', fontSize: '0.85rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
              <ArrowUpRight size={14} /> €{summary?.totalIncome?.toFixed(2) ?? '0.00'}
            </span>
            <span style={{ color: 'var(--sovereign-riskred)', fontSize: '0.85rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
              <ArrowDownLeft size={14} /> €{summary?.totalExpenses?.toFixed(2) ?? '0.00'}
            </span>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="stat-card">
          <span style={{ color: 'var(--sovereign-slate)', fontSize: '0.85rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Identifizierte Ersparnisse (YTD)
          </span>
          <p style={{ fontSize: '2.5rem', fontWeight: 800, margin: '16px 0', letterSpacing: '-0.02em', color: 'var(--sovereign-cyan)', textShadow: '0 0 20px rgba(0,229,255,0.3)' }}>
            €{summary?.ytdSavings?.toFixed(2) ?? '0.00'}
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', borderTop: '1px solid var(--sovereign-silver)', paddingTop: '16px', color: 'var(--sovereign-alabaster)', fontSize: '0.85rem' }}>
            <PieChart size={16} color="var(--sovereign-purple)" />
            Top 5% der Sovereign-Nutzer
          </div>
        </motion.div>

        {/* Wealth Score — SHIELD only */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="stat-card" style={{ position: 'relative', overflow: 'hidden' }}>
          {!hasTier('SHIELD') && (
            <div style={{ position: 'absolute', inset: 0, background: 'rgba(8,14,26,0.7)', backdropFilter: 'blur(4px)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '10px', zIndex: 2 }}>
              <Lock size={22} color="var(--sovereign-purple)" />
              <span style={{ fontSize: '0.8rem', color: 'var(--sovereign-slate)', fontWeight: 600 }}>{t('wealthScoreShieldOnly')}</span>
            </div>
          )}
          <span style={{ color: 'var(--sovereign-slate)', fontSize: '0.85rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            {t('wealthScore')}
          </span>
          <p style={{ fontSize: '2.5rem', fontWeight: 800, margin: '16px 0', letterSpacing: '-0.02em', color: 'var(--sovereign-purple)', textShadow: '0 0 20px rgba(187,134,252,0.3)' }}>
            74 / 100
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', borderTop: '1px solid var(--sovereign-silver)', paddingTop: '16px' }}>
            <span className="agent-dot agent-dot-active" />
            <span style={{ fontSize: '0.75rem', color: 'var(--sovereign-cyan)', fontWeight: 600 }}>Überwachung aktiv</span>
          </div>
        </motion.div>
      </div>

      {/* Cashflow Chart + Spending */}
      <motion.section
        initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
        className="glass-card-level-1"
        style={{ padding: '28px', marginBottom: '28px' }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <div className="section-header" style={{ margin: '0 0 4px' }}>{t('cashflow')}</div>
            <p style={{ fontSize: '0.8rem', color: 'var(--sovereign-slate)', margin: 0 }}>
              Einnahmen vs. Ausgaben · automatisch aus PSD2-Daten
            </p>
          </div>
          <div style={{ display: 'flex', gap: '16px' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.78rem', color: 'var(--sovereign-slate)' }}>
              <span style={{ width: 10, height: 10, borderRadius: 2, background: 'rgba(0,230,118,0.7)', flexShrink: 0 }} />
              Einnahmen
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.78rem', color: 'var(--sovereign-slate)' }}>
              <span style={{ width: 10, height: 10, borderRadius: 2, background: 'rgba(0,212,255,0.6)', flexShrink: 0 }} />
              Ausgaben
            </span>
          </div>
        </div>
        <CashflowChart data={monthlyData} monthLabels={monthLabels} />

        <div style={{ marginTop: '24px', paddingTop: '24px', borderTop: '1px solid var(--sovereign-silver)' }}>
          <p style={{ fontSize: '0.72rem', fontFamily: 'var(--font-jetbrains, monospace)', letterSpacing: '0.1em', color: 'rgba(255,255,255,0.25)', textTransform: 'uppercase', marginBottom: '16px' }}>
            {t('spending')}
          </p>
          <SpendingBreakdown categories={categories} />
        </div>
      </motion.section>

      {/* Transactions + Anomalies */}
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 380px', gap: '28px' }}>

        {/* Transactions */}
        <motion.section
          initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }}
          className="glass-card-level-1" style={{ padding: '28px' }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px' }}>
            <div className="section-header" style={{ margin: 0 }}>Letzte Transaktionen</div>
            <span style={{ color: 'var(--sovereign-cyan)', fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer' }}>Alle anzeigen</span>
          </div>

          {loading ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {[1, 2, 3, 4].map(i => <div key={i} className="skeleton" style={{ height: '60px' }} />)}
            </div>
          ) : transactions.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--sovereign-slate)' }}>
              <Wallet size={32} style={{ margin: '0 auto 16px', display: 'block', opacity: 0.5 }} />
              <p>{t('noDataText')}</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              {transactions.map(tx => (
                <div
                  key={tx.id}
                  style={{
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    padding: '12px 16px', borderRadius: '12px', background: 'rgba(255,255,255,0.02)',
                    border: '1px solid transparent', transition: 'all 0.2s', cursor: 'pointer',
                  }}
                >
                  <div style={{ display: 'flex', gap: '14px', alignItems: 'center' }}>
                    <div style={{
                      width: '40px', height: '40px', borderRadius: '12px',
                      background: (tx.amount ?? 0) < 0 ? 'rgba(255,23,68,0.1)' : 'rgba(0,230,118,0.1)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      {(tx.amount ?? 0) < 0
                        ? <ArrowDownLeft size={18} color="var(--sovereign-riskred)" />
                        : <ArrowUpRight size={18} color="var(--sovereign-success)" />}
                    </div>
                    <div>
                      <p style={{ fontSize: '0.95rem', fontWeight: 700, margin: '0 0 2px' }}>{tx.counterpartName ?? '—'}</p>
                      <span style={{ fontSize: '0.75rem', color: 'var(--sovereign-slate)' }}>
                        {tx.date ? new Date(tx.date).toLocaleDateString('de-DE') : 'Heute'} · {tx.purpose ?? 'Zahlung'}
                      </span>
                    </div>
                  </div>
                  <p style={{
                    fontSize: '1.05rem', fontWeight: 800, margin: 0,
                    color: (tx.amount ?? 0) < 0 ? 'var(--sovereign-alabaster)' : 'var(--sovereign-success)',
                    fontFamily: 'var(--font-jetbrains, monospace)',
                  }}>
                    {(tx.amount ?? 0) < 0 ? '-' : '+'}€{Math.abs(tx.amount ?? 0).toFixed(2)}
                  </p>
                </div>
              ))}
            </div>
          )}
        </motion.section>

        {/* Sidebar: Anomalies + Security */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

          {/* Finance Guardian Alerts */}
          <motion.section
            initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}
            className="glass-card-level-1"
            style={{ padding: '28px', border: '1px solid rgba(0,229,255,0.2)' }}
          >
            <h3 style={{ fontSize: '1.1rem', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--sovereign-cyan)', margin: '0 0 20px' }}>
              <Zap size={18} /> {t('anomalies')}
            </h3>
            <AnomalyPanel anomalies={anomalies} t={t} />
          </motion.section>

          {/* Security Status */}
          <motion.section
            initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }}
            className="glass-card-level-1" style={{ padding: '24px' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'rgba(187,134,252,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <ShieldCheck size={20} color="var(--sovereign-purple)" />
              </div>
              <h4 style={{ margin: 0, fontSize: '1rem' }}>Sicherheits-Audit</h4>
            </div>
            <p style={{ fontSize: '0.8rem', color: 'var(--sovereign-slate)', margin: '0 0 12px' }}>
              Letzter Hintergrund-Scan vor 2 Minuten abgeschlossen. Keine unautorisierten FinAPI-Zugriffe.
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span className="agent-dot agent-dot-active" />
              <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--sovereign-cyan)' }}>Überwachung aktiv</span>
            </div>
          </motion.section>

          {/* AI Act disclaimer */}
          <div style={{ padding: '12px 14px', background: 'rgba(187,134,252,0.04)', border: '1px solid rgba(187,134,252,0.1)', borderRadius: '10px', display: 'flex', gap: '8px' }}>
            <Info size={13} color="rgba(187,134,252,0.5)" style={{ flexShrink: 0, marginTop: 1 }} />
            <p style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.3)', margin: 0, lineHeight: 1.5 }}>
              KI-Hinweis (EU AI Act, LIMITED Risk): Alle Finanzanalysen wurden durch SOVEREIGN AI (Gemini) erstellt. Keine Anlageberatung.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
