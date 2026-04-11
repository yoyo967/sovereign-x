'use client';

import { useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, AlertTriangle, Link2, ArrowUpRight, ArrowDownLeft } from 'lucide-react';
import { api } from '@/lib/api';
import { useRBAC } from '@/hooks/useRBAC';
import { SovereignCard } from '@/components/ui/SovereignCard';
import { ConfidenceBadge } from '@/components/ui/ConfidenceBadge';
import { PlanGateBadge } from '@/components/ui/PlanGateBadge';
import { SkeletonLoader } from '@/components/ui/SkeletonLoader';
import { ErrorState } from '@/components/ui/ErrorState';
import { useFinanceStore } from '@/stores/financeStore';

// ─── Cashflow Chart ────────────────────────────────────────────────────────────

function CashflowChart({ data }: { data: { month: string; income: number; expenses: number }[] }) {
  if (!data.length) return null;
  const maxVal = Math.max(...data.flatMap((d) => [d.income, d.expenses]), 1);
  const BAR_W = 18;
  const H = 80;

  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: '12px', height: H + 24, paddingBottom: 20, position: 'relative' }}>
      {data.map((d, i) => (
        <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px', flex: 1 }}>
          <div style={{ display: 'flex', gap: '3px', alignItems: 'flex-end', height: H }}>
            <motion.div
              initial={{ height: 0 }}
              animate={{ height: Math.round((d.income / maxVal) * H) }}
              transition={{ delay: i * 0.04, duration: 0.5 }}
              style={{ width: BAR_W, background: 'var(--sovereign-success, #00E676)', borderRadius: '4px 4px 0 0', opacity: 0.7 }}
            />
            <motion.div
              initial={{ height: 0 }}
              animate={{ height: Math.round((d.expenses / maxVal) * H) }}
              transition={{ delay: i * 0.04 + 0.05, duration: 0.5 }}
              style={{ width: BAR_W, background: 'var(--sovereign-riskred)', borderRadius: '4px 4px 0 0', opacity: 0.6 }}
            />
          </div>
          <span style={{ fontSize: '0.6rem', color: 'var(--s-text-faint)', fontFamily: 'var(--font-mono)', whiteSpace: 'nowrap', marginTop: '4px' }}>
            {d.month}
          </span>
        </div>
      ))}
      {/* Legend */}
      <div style={{ position: 'absolute', bottom: 0, right: 0, display: 'flex', gap: '12px' }}>
        {[{ color: 'var(--sovereign-success, #00E676)', label: 'Einnahmen' }, { color: 'var(--sovereign-riskred)', label: 'Ausgaben' }].map(({ color, label }) => (
          <div key={label} style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.65rem', color: 'var(--s-text-faint)' }}>
            <div style={{ width: 8, height: 8, borderRadius: 2, background: color, opacity: 0.8 }} />
            {label}
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Alert type config ────────────────────────────────────────────────────────

const ALERT_CONFIG: Record<string, { icon: React.ElementType; color: string; label: string }> = {
  UNUSUAL_ACTIVITY:    { icon: AlertTriangle, color: 'var(--sovereign-riskred)', label: 'Ungewöhnlich' },
  DUPLICATE_PAYMENT:   { icon: AlertTriangle, color: '#FFD600',                  label: 'Duplikat' },
  PRICE_INCREASE:      { icon: TrendingUp,    color: '#FFD600',                  label: 'Preiserhöhung' },
  SAVINGS_OPPORTUNITY: { icon: TrendingDown,  color: 'var(--sovereign-success, #00E676)', label: 'Einsparpotenzial' },
  NEW_SUBSCRIPTION:    { icon: Link2,         color: 'var(--sovereign-cyan)',    label: 'Neues Abo' },
};

// ─── Page ─────────────────────────────────────────────────────────────────────

const PAGE_SIZE = 20;

export default function FinancePage() {
  const { tier } = useRBAC();
  const { summary, transactions, alerts, page, isLoading, error, setSummary, setTransactions, setAlerts, setPage, setLoading, setError } = useFinanceStore();

  const load = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const [sumData, txData, insightData] = await Promise.allSettled([
        api.finance.getSummary(),
        api.finance.getTransactions(100),
        tier !== 'FREE' ? api.finance.getInsights() : Promise.resolve({ insights: [] }),
      ]);
      if (sumData.status === 'fulfilled') setSummary(sumData.value);
      if (txData.status === 'fulfilled') setTransactions(Array.isArray(txData.value) ? txData.value : (txData.value?.transactions ?? []));
      if (insightData.status === 'fulfilled') setAlerts(insightData.value?.insights ?? insightData.value ?? []);
    } catch {
      setError('Finanzdaten konnten nicht geladen werden.');
    } finally {
      setLoading(false);
    }
  }, [tier, setSummary, setTransactions, setAlerts, setLoading, setError]);

  useEffect(() => { void load(); }, [load]);

  const paginatedTx = transactions.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const totalPages = Math.ceil(transactions.length / PAGE_SIZE);

  if (isLoading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        <SkeletonLoader variant="kpi" count={3} />
        <SkeletonLoader variant="card" count={2} />
      </div>
    );
  }
  if (error) return <ErrorState message={error} onRetry={load} />;

  const net = summary?.netCashflowEur ?? 0;
  const savings = summary?.savingsYtdEur ?? 0;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>

      {/* Title */}
      <div>
        <h1 style={{ margin: '0 0 4px', fontSize: '1.6rem', fontWeight: 800, letterSpacing: '-0.03em' }}>Finance Guardian</h1>
        <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--s-text-muted)' }}>KI-Überwachung deiner Finanzen in Echtzeit</p>
      </div>

      {/* KPI row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '16px' }}>
        {[
          { label: 'Netto Cashflow',   value: `${net >= 0 ? '+' : ''}€${net.toFixed(0)}`,   color: net >= 0 ? 'var(--sovereign-success, #00E676)' : 'var(--sovereign-riskred)', icon: net >= 0 ? TrendingUp : TrendingDown, sub: 'Dieser Monat' },
          { label: 'YTD Einsparungen', value: `€${savings.toFixed(0)}`,                       color: 'var(--sovereign-cyan)',                                                   icon: TrendingDown, sub: 'Durch Finance Guardian' },
        ].map(({ label, value, color, icon: Icon, sub }) => (
          <SovereignCard key={label} variant="default">
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: 10 }}>
              <div style={{ width: 34, height: 34, borderRadius: '9px', background: `${color}10`, border: `1px solid ${color}20`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Icon size={16} color={color} />
              </div>
            </div>
            <p style={{ margin: '0 0 3px', fontSize: '0.7rem', color: 'var(--s-text-muted)', letterSpacing: '0.08em', textTransform: 'uppercase', fontFamily: 'var(--font-mono)' }}>{label}</p>
            <p style={{ margin: '0 0 3px', fontSize: '1.7rem', fontWeight: 800, letterSpacing: '-0.03em', color, lineHeight: 1 }}>{value}</p>
            <p style={{ margin: 0, fontSize: '0.73rem', color: 'var(--s-text-muted)' }}>{sub}</p>
          </SovereignCard>
        ))}
        {/* Wealth score — SHIELD gate */}
        <PlanGateBadge required="SHIELD" featureName="Wealth-Score">
          <SovereignCard variant="default">
            <p style={{ margin: '0 0 3px', fontSize: '0.7rem', color: 'var(--s-text-muted)', letterSpacing: '0.08em', textTransform: 'uppercase', fontFamily: 'var(--font-mono)' }}>Wealth-Score</p>
            <p style={{ margin: '0 0 3px', fontSize: '1.7rem', fontWeight: 800, letterSpacing: '-0.03em', color: 'var(--sovereign-purple)', lineHeight: 1 }}>{summary?.wealthScore != null ? `${summary.wealthScore}` : '—'}</p>
            <p style={{ margin: 0, fontSize: '0.73rem', color: 'var(--s-text-muted)' }}>Ganzheitliche Finanzstärke</p>
          </SovereignCard>
        </PlanGateBadge>
      </div>

      {/* Main grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '20px', alignItems: 'start' }}>

        {/* Left */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

          {/* Cashflow chart */}
          {(summary?.monthlyData?.length ?? 0) > 0 && (
            <SovereignCard variant="default">
              <p style={{ margin: '0 0 16px', fontSize: '0.9rem', fontWeight: 700 }}>Cashflow — 6 Monate</p>
              <CashflowChart data={summary!.monthlyData} />
            </SovereignCard>
          )}

          {/* Transaction table */}
          <SovereignCard variant="default" padding="0">
            <div style={{ padding: '20px 20px 12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <p style={{ margin: 0, fontSize: '0.9rem', fontWeight: 700 }}>Transaktionen</p>
              <PlanGateBadge required="PRO" featureName="CSV-Import">
                <button className="secondary-button" style={{ fontSize: '0.75rem', padding: '5px 12px' }}>CSV importieren</button>
              </PlanGateBadge>
            </div>
            {paginatedTx.length === 0 ? (
              <p style={{ textAlign: 'center', color: 'var(--s-text-faint)', fontSize: '0.85rem', padding: '24px' }}>Keine Transaktionen vorhanden.</p>
            ) : (
              <>
                <div>
                  {paginatedTx.map((tx, i) => (
                    <div key={tx.id ?? i} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 20px', borderTop: '1px solid var(--s-divider)' }}>
                      <div style={{ width: 30, height: 30, borderRadius: '8px', background: tx.direction === 'in' ? 'rgba(0,230,118,0.08)' : 'rgba(255,23,68,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        {tx.direction === 'in' ? <ArrowDownLeft size={14} color="var(--sovereign-success, #00E676)" /> : <ArrowUpRight size={14} color="var(--sovereign-riskred)" />}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={{ margin: 0, fontSize: '0.84rem', fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{tx.merchant}</p>
                        <p style={{ margin: '2px 0 0', fontSize: '0.72rem', color: 'var(--s-text-faint)', fontFamily: 'var(--font-mono)' }}>{tx.date}</p>
                      </div>
                      <span style={{ fontSize: '0.88rem', fontWeight: 700, fontFamily: 'var(--font-mono)', color: tx.direction === 'in' ? 'var(--sovereign-success, #00E676)' : 'var(--sovereign-riskred)', whiteSpace: 'nowrap' }}>
                        {tx.direction === 'in' ? '+' : '−'}€{Math.abs(tx.amount).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>
                {totalPages > 1 && (
                  <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', padding: '12px 20px' }}>
                    <button className="secondary-button" disabled={page <= 1} onClick={() => setPage(page - 1)} style={{ padding: '5px 12px', fontSize: '0.78rem' }}>←</button>
                    <span style={{ fontSize: '0.78rem', color: 'var(--s-text-muted)', display: 'flex', alignItems: 'center' }}>{page} / {totalPages}</span>
                    <button className="secondary-button" disabled={page >= totalPages} onClick={() => setPage(page + 1)} style={{ padding: '5px 12px', fontSize: '0.78rem' }}>→</button>
                  </div>
                )}
              </>
            )}
          </SovereignCard>
        </div>

        {/* Right */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

          {/* Anomalie panel */}
          <SovereignCard variant="default">
            <p style={{ margin: '0 0 14px', fontSize: '0.9rem', fontWeight: 700 }}>Anomalie-Alerts</p>
            {alerts.length === 0 ? (
              <p style={{ textAlign: 'center', color: 'var(--s-text-faint)', fontSize: '0.82rem', padding: '12px 0' }}>Keine Anomalien erkannt.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {alerts.slice(0, 6).map((alert, i) => {
                  const cfg = ALERT_CONFIG[alert.type] ?? { icon: AlertTriangle, color: '#FFD600', label: alert.type };
                  const Icon = cfg.icon;
                  return (
                    <motion.div key={alert.id ?? i} initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.04 }}
                      style={{ padding: '10px 12px', borderRadius: '10px', background: `${cfg.color}06`, border: `1px solid ${cfg.color}20`, display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                      <Icon size={14} color={cfg.color} style={{ flexShrink: 0, marginTop: 2 }} />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={{ margin: '0 0 2px', fontSize: '0.82rem', fontWeight: 600 }}>{alert.title}</p>
                        <p style={{ margin: '0 0 6px', fontSize: '0.75rem', color: 'var(--s-text-muted)', lineHeight: 1.5 }}>{alert.description}</p>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <ConfidenceBadge score={alert.confidence ?? 0.5} size="sm" />
                          {alert.amount != null && <span style={{ fontSize: '0.73rem', fontFamily: 'var(--font-mono)', color: cfg.color }}>€{Math.abs(alert.amount).toFixed(2)}</span>}
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </SovereignCard>

          {/* finAPI connect */}
          <PlanGateBadge required="SHIELD" featureName="PSD2-Bankverbindung">
            <SovereignCard variant="elevated">
              <p style={{ margin: '0 0 8px', fontSize: '0.9rem', fontWeight: 700 }}>Bankkonto verbinden</p>
              <p style={{ margin: '0 0 14px', fontSize: '0.8rem', color: 'var(--s-text-muted)', lineHeight: 1.5 }}>PSD2-konforme Echtzeit-Verbindung via finAPI. Alle Transaktionen automatisch importiert.</p>
              <button className="primary-aura-button" style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '7px' }}>
                <Link2 size={14} /> Mit Bank verbinden
              </button>
            </SovereignCard>
          </PlanGateBadge>
        </div>
      </div>
    </div>
  );
}
