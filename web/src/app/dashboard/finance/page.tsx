'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Wallet, Landmark, ArrowUpRight, ArrowDownLeft, Zap, PieChart, Activity, AlertTriangle, ShieldCheck } from 'lucide-react';
import { api } from '@/lib/api';
import { useRequireAuth } from '@/hooks/useRequireAuth';

export default function FinancePage() {
  const { user, loading: authLoading } = useRequireAuth();
  const [summary, setSummary] = useState<any>(null);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [insights, setInsights] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    async function loadFinance() {
      try {
        setLoading(true);
        const [sumData, txData, insData] = await Promise.all([
          api.finance.getSummary().catch(() => null),
          api.finance.getTransactions(10).catch(() => []),
          api.finance.getInsights().catch(() => [])
        ]);
        setSummary(sumData);
        setTransactions(txData || []);
        setInsights(Array.isArray(insData) ? insData : []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadFinance();
  }, [user]);

  if (authLoading) return null;

  return (
    <div style={{ maxWidth: '1280px' }}>
      <header style={{ marginBottom: '40px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <h1 style={{ 
            fontSize: '2.5rem', fontWeight: 800, marginBottom: '8px',
            fontFamily: 'var(--font-space-grotesk, sans-serif)', letterSpacing: '-0.03em'
          }}>
            Finance Guardian
          </h1>
          <p style={{ color: 'var(--sovereign-slate)', fontSize: '1.05rem', margin: 0 }}>
            Autonome Cashflow-Optimierung und Echtzeit-Überwachung.
          </p>
        </div>
        <button className="primary-aura-button" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Landmark size={16} />
          Bank verknüpfen (PSD2)
        </button>
      </header>

      {/* Finance Metrics */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px', marginBottom: '40px' }}>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="stat-card">
          <div className="aura-glow-cyan" style={{ width: '150px', height: '150px', top: '-50px', right: '-50px' }} />
          <span style={{ color: 'var(--sovereign-slate)', fontSize: '0.85rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Netto Cashflow (Monat)
          </span>
          <p style={{ fontSize: '2.5rem', fontWeight: 800, margin: '16px 0', letterSpacing: '-0.02em', color: 'var(--sovereign-alabaster)' }}>
            €{summary?.netCashflow?.toFixed(2) || '0.00'}
          </p>
          <div style={{ display: 'flex', gap: '16px', borderTop: '1px solid var(--sovereign-silver)', paddingTop: '16px' }}>
            <span style={{ color: 'var(--sovereign-success)', fontSize: '0.85rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
              <ArrowUpRight size={14} /> €{summary?.totalIncome?.toFixed(2) || '0.00'}
            </span>
            <span style={{ color: 'var(--sovereign-riskred)', fontSize: '0.85rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
              <ArrowDownLeft size={14} /> €{summary?.totalExpenses?.toFixed(2) || '0.00'}
            </span>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="stat-card">
          <span style={{ color: 'var(--sovereign-slate)', fontSize: '0.85rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Identifizierte Ersparnisse (YTD)
          </span>
          <p style={{ fontSize: '2.5rem', fontWeight: 800, margin: '16px 0', letterSpacing: '-0.02em', color: 'var(--sovereign-cyan)', textShadow: '0 0 20px rgba(0,229,255,0.3)' }}>
            €{summary?.ytdSavings?.toFixed(2) || '0.00'}
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--sovereign-alabaster)', fontSize: '0.85rem', borderTop: '1px solid var(--sovereign-silver)', paddingTop: '16px' }}>
            <PieChart size={16} color="var(--sovereign-purple)" />
            Top 5% der Sovereign-Nutzer
          </div>
        </motion.div>
      </div>

      {/* Cashflow Chart */}
      <motion.section
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="glass-card-level-1"
        style={{ padding: '28px', marginBottom: '28px' }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <div className="section-header" style={{ margin: '0 0 4px' }}>Cashflow — letzte 6 Monate</div>
            <p style={{ fontSize: '0.8rem', color: 'var(--sovereign-slate)', margin: 0 }}>Einnahmen vs. Ausgaben · automatisch aus PSD2-Daten</p>
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
        <CashflowChart summary={summary} />

        {/* Category breakdown */}
        <div style={{ marginTop: '24px', paddingTop: '24px', borderTop: '1px solid var(--sovereign-silver)' }}>
          <p style={{ fontSize: '0.72rem', fontFamily: 'var(--font-jetbrains, monospace)', letterSpacing: '0.1em', color: 'rgba(255,255,255,0.25)', textTransform: 'uppercase', marginBottom: '16px' }}>
            Ausgaben nach Kategorie
          </p>
          <SpendingBreakdown summary={summary} />
        </div>
      </motion.section>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 400px', gap: '28px' }}>
        
        {/* Recent Transactions */}
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
              {[1,2,3,4].map(i => <div key={i} className="skeleton" style={{ height: '60px' }} />)}
            </div>
          ) : transactions.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--sovereign-slate)' }}>
              <Wallet size={32} style={{ margin: '0 auto 16px', opacity: 0.5 }} />
              <p>Keine Transaktionen gefunden. Verbinde deine Bank für automatische Analyse.</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              {transactions.map((tx: any) => (
                <div key={tx.id} style={{ 
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center', 
                  padding: '12px 16px', borderRadius: '12px', background: 'rgba(255,255,255,0.02)',
                  border: '1px solid transparent', transition: 'all 0.2s', cursor: 'pointer'
                }} className="hover:border-sovereign-glass-border hover:bg-sovereign-glass-10">
                  <div style={{ display: 'flex', gap: '14px', alignItems: 'center' }}>
                    <div style={{ 
                      width: '40px', height: '40px', borderRadius: '12px', 
                      background: tx.amount < 0 ? 'rgba(255, 23, 68, 0.1)' : 'rgba(0, 230, 118, 0.1)', 
                      display: 'flex', alignItems: 'center', justifyContent: 'center' 
                    }}>
                      {tx.amount < 0 
                        ? <ArrowDownLeft size={18} color="var(--sovereign-riskred)" /> 
                        : <ArrowUpRight size={18} color="var(--sovereign-success)" />}
                    </div>
                    <div>
                      <p style={{ fontSize: '0.95rem', fontWeight: 700, margin: '0 0 2px' }}>{tx.counterpartName}</p>
                      <span style={{ fontSize: '0.75rem', color: 'var(--sovereign-slate)' }}>
                        {tx.date ? new Date(tx.date).toLocaleDateString('de-DE') : 'Heute'} · {tx.purpose || 'Zahlung'}
                      </span>
                    </div>
                  </div>
                  <p style={{ 
                    fontSize: '1.05rem', fontWeight: 800, 
                    color: tx.amount < 0 ? 'var(--sovereign-alabaster)' : 'var(--sovereign-success)',
                    margin: 0, fontFamily: 'var(--font-jetbrains-mono, monospace)'
                  }}>
                    {tx.amount < 0 ? '-' : '+'}€{Math.abs(tx.amount).toFixed(2)}
                  </p>
                </div>
              ))}
            </div>
          )}
        </motion.section>

        {/* Guardian Insights Sidebar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          <motion.section 
            initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}
            className="glass-card-level-1" style={{ padding: '28px', border: '1px solid rgba(0, 229, 255, 0.3)' }}
          >
            <h3 style={{ fontSize: '1.15rem', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--sovereign-cyan)' }}>
              <Zap size={20} /> Guardian Insights
            </h3>
            
            {insights.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {insights.map((insight, i) => (
                  <div key={i} style={{ background: 'rgba(0, 229, 255, 0.05)', borderRadius: '14px', padding: '16px', border: '1px solid rgba(0, 229, 255, 0.1)' }}>
                    <p style={{ fontSize: '0.85rem', lineHeight: 1.6, color: 'var(--sovereign-alabaster)', margin: '0 0 16px' }}>
                      {insight.description}
                    </p>
                    <button className="primary-aura-button" style={{ width: '100%' }}>Aktion ausführen</button>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ background: 'rgba(0, 229, 255, 0.05)', borderRadius: '14px', padding: '16px', border: '1px solid rgba(0, 229, 255, 0.1)' }}>
                <p style={{ fontSize: '0.85rem', lineHeight: 1.6, color: 'var(--sovereign-alabaster)', margin: '0 0 16px' }}>
                  Dein Transaktionsverhalten wurde analysiert. Es wurden zwei sich überschneidende Abonnements gefunden (Spotify & Apple Music). 
                  Zusammenlegung spart dir <b>€10.99/Monat</b>.
                </p>
                <button className="primary-aura-button" style={{ width: '100%' }}>Optimierung anwenden</button>
              </div>
            )}
          </motion.section>

          <motion.section 
            initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }}
            className="glass-card-level-1" style={{ padding: '24px', background: 'rgba(20, 42, 69, 0.5)' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'rgba(187, 134, 252, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
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
        </div>
      </div>
    </div>
  );
}

// ── CashflowChart — pure SVG bar chart ────────────────────────

const MOCK_MONTHS = [
  { label: "Nov", income: 3200, expenses: 2650 },
  { label: "Dez", income: 3200, expenses: 3180 },
  { label: "Jan", income: 3400, expenses: 2720 },
  { label: "Feb", income: 3400, expenses: 2890 },
  { label: "Mär", income: 3400, expenses: 2540 },
  { label: "Apr", income: 3550, expenses: 2810 },
];

function CashflowChart({ summary }: { summary: any }) {
  const chartH = 160;
  const chartW = 560;
  const barW = 28;
  const gap = 18;
  const groupW = barW * 2 + gap;
  const groupGap = 24;
  const totalGroupW = groupW + groupGap;
  const paddingLeft = 48;
  const paddingBottom = 28;

  const maxVal = Math.max(...MOCK_MONTHS.flatMap((m) => [m.income, m.expenses]));
  const scale = (chartH - paddingBottom) / maxVal;

  const yTicks = [0, 1000, 2000, 3000, 4000].filter((v) => v <= maxVal * 1.05);

  return (
    <div style={{ overflowX: "auto" }}>
      <svg
        width="100%"
        viewBox={`0 0 ${paddingLeft + MOCK_MONTHS.length * totalGroupW + 20} ${chartH + 10}`}
        style={{ display: "block", minWidth: 320 }}
      >
        {/* Y-axis grid lines + labels */}
        {yTicks.map((tick) => {
          const y = chartH - paddingBottom - tick * scale;
          return (
            <g key={tick}>
              <line
                x1={paddingLeft}
                y1={y}
                x2={paddingLeft + MOCK_MONTHS.length * totalGroupW + 10}
                y2={y}
                stroke="rgba(255,255,255,0.05)"
                strokeWidth={1}
              />
              <text
                x={paddingLeft - 6}
                y={y + 4}
                textAnchor="end"
                fontSize={9}
                fill="rgba(255,255,255,0.25)"
                fontFamily="var(--font-jetbrains, monospace)"
              >
                {tick >= 1000 ? `${tick / 1000}k` : tick}
              </text>
            </g>
          );
        })}

        {/* Bars per month */}
        {MOCK_MONTHS.map((month, i) => {
          const x = paddingLeft + i * totalGroupW;
          const incomeH = month.income * scale;
          const expenseH = month.expenses * scale;
          const baseY = chartH - paddingBottom;

          return (
            <g key={month.label}>
              {/* Income bar */}
              <rect
                x={x}
                y={baseY - incomeH}
                width={barW}
                height={incomeH}
                fill="rgba(0,230,118,0.65)"
                rx={2}
              />
              {/* Expense bar */}
              <rect
                x={x + barW + gap}
                y={baseY - expenseH}
                width={barW}
                height={expenseH}
                fill="rgba(0,212,255,0.55)"
                rx={2}
              />
              {/* Month label */}
              <text
                x={x + groupW / 2}
                y={chartH - 6}
                textAnchor="middle"
                fontSize={9}
                fill="rgba(255,255,255,0.3)"
                fontFamily="var(--font-jetbrains, monospace)"
              >
                {month.label}
              </text>
            </g>
          );
        })}

        {/* Baseline */}
        <line
          x1={paddingLeft}
          y1={chartH - paddingBottom}
          x2={paddingLeft + MOCK_MONTHS.length * totalGroupW + 10}
          y2={chartH - paddingBottom}
          stroke="rgba(255,255,255,0.08)"
          strokeWidth={1}
        />
      </svg>
    </div>
  );
}

// ── SpendingBreakdown — horizontal bar chart ──────────────────

const MOCK_CATEGORIES = [
  { label: "Wohnen & Miete",   value: 1150, color: "rgba(187,134,252,0.7)" },
  { label: "Abonnements",      value: 247,  color: "rgba(0,212,255,0.7)" },
  { label: "Lebensmittel",     value: 380,  color: "rgba(0,230,118,0.65)" },
  { label: "Versicherungen",   value: 210,  color: "rgba(255,214,0,0.65)" },
  { label: "Transport",        value: 178,  color: "rgba(255,160,0,0.65)" },
  { label: "Sonstiges",        value: 645,  color: "rgba(255,255,255,0.2)" },
];

function SpendingBreakdown({ summary }: { summary: any }) {
  const total = MOCK_CATEGORIES.reduce((s, c) => s + c.value, 0);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
      {MOCK_CATEGORIES.map((cat) => {
        const pct = (cat.value / total) * 100;
        return (
          <div key={cat.label} style={{ display: "grid", gridTemplateColumns: "140px 1fr 56px", gap: "12px", alignItems: "center" }}>
            <span style={{ fontSize: "0.78rem", color: "rgba(255,255,255,0.55)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
              {cat.label}
            </span>
            <div style={{ height: 6, background: "rgba(255,255,255,0.06)", borderRadius: 3, overflow: "hidden" }}>
              <div
                style={{
                  height: "100%",
                  width: `${pct}%`,
                  background: cat.color,
                  borderRadius: 3,
                  transition: "width 0.6s ease",
                }}
              />
            </div>
            <span style={{ fontFamily: "var(--font-jetbrains, monospace)", fontSize: "0.72rem", color: "rgba(255,255,255,0.4)", textAlign: "right" }}>
              €{cat.value}
            </span>
          </div>
        );
      })}
    </div>
  );
}
