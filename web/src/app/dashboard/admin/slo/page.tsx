'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Activity, RefreshCw, TrendingUp } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { api } from '@/lib/api';

interface SloService {
  name: string;
  uptime_pct: number | null;
  error_budget_remaining_pct: number | null;
  p95_latency_ms: number | null;
}

interface SloData {
  services: SloService[];
  note?: string;
}

function Gauge({ value, unit = '%' }: { value: number | null; unit?: string }) {
  if (value === null || value === undefined) {
    return <span style={{ fontFamily: 'var(--font-jetbrains, monospace)', color: 'var(--sovereign-slate)', fontSize: '1.4rem' }}>—</span>;
  }
  const isGood = unit === 'ms' ? value <= 200 : value >= 95;
  const isWarn = unit === 'ms' ? value <= 500 : value >= 80;
  const color = isGood ? 'var(--sovereign-success)' : isWarn ? '#f59e0b' : 'var(--sovereign-riskred)';
  return (
    <span style={{ fontFamily: 'var(--font-jetbrains, monospace)', color, fontSize: '1.4rem', fontWeight: 700 }}>
      {value.toFixed(unit === 'ms' ? 0 : 2)}{unit}
    </span>
  );
}

function BudgetBar({ value }: { value: number | null }) {
  if (value === null || value === undefined) return <div style={{ height: '6px', background: 'rgba(255,255,255,0.06)', borderRadius: '3px', width: '100%' }} />;
  const color = value >= 50 ? 'var(--sovereign-success)' : value >= 20 ? '#f59e0b' : 'var(--sovereign-riskred)';
  return (
    <div style={{ height: '6px', background: 'rgba(255,255,255,0.06)', borderRadius: '3px', width: '100%', overflow: 'hidden' }}>
      <div style={{ height: '100%', width: `${Math.min(100, Math.max(0, value))}%`, background: color, borderRadius: '3px', transition: 'width 0.8s ease' }} />
    </div>
  );
}

export default function SloPage() {
  const t = useTranslations('dashboard.admin');
  const [data, setData] = useState<SloData | null>(null);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    try {
      setLoading(true);
      const result = await api.admin.getSlo();
      setData(result);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  return (
    <div style={{ maxWidth: '1000px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '24px', gap: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 800, margin: '0 0 6px', letterSpacing: '-0.02em' }}>{t('slo.title')}</h2>
          <p style={{ color: 'var(--sovereign-slate)', margin: 0, fontSize: '0.9rem' }}>{t('slo.subtitle')}</p>
        </div>
        <button className="secondary-button" style={{ display: 'flex', alignItems: 'center', gap: '7px', fontSize: '0.82rem' }} onClick={load} disabled={loading}>
          <RefreshCw size={13} /> Refresh
        </button>
      </div>

      {loading ? (
        <div className="glass-card-level-1" style={{ padding: '60px', textAlign: 'center' }}>
          <div className="sovereign-spinner-small" style={{ margin: '0 auto' }} />
        </div>
      ) : !data ? null : (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          {data.note && (
            <div style={{ padding: '10px 16px', background: 'rgba(255,193,7,0.06)', border: '1px solid rgba(255,193,7,0.15)', marginBottom: '20px', fontSize: '0.8rem', color: '#f59e0b' }}>
              {data.note}
            </div>
          )}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
            {data.services.map((svc, i) => (
              <motion.div
                key={svc.name}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06 }}
                className="glass-card-level-1"
                style={{ padding: '24px' }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
                  <Activity size={14} color="var(--sovereign-cyan)" />
                  <span style={{ fontFamily: 'var(--font-jetbrains, monospace)', fontSize: '0.78rem', color: 'var(--sovereign-cyan)', letterSpacing: '0.04em' }}>{svc.name}</span>
                </div>

                <div style={{ display: 'flex', gap: '16px', marginBottom: '20px' }}>
                  <div style={{ flex: 1 }}>
                    <p style={{ margin: '0 0 4px', fontSize: '0.68rem', color: 'var(--sovereign-slate)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{t('slo.uptime')}</p>
                    <Gauge value={svc.uptime_pct} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <p style={{ margin: '0 0 4px', fontSize: '0.68rem', color: 'var(--sovereign-slate)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{t('slo.latency')}</p>
                    <Gauge value={svc.p95_latency_ms} unit="ms" />
                  </div>
                </div>

                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span style={{ fontSize: '0.7rem', color: 'var(--sovereign-slate)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{t('slo.budget')}</span>
                    <span style={{ fontFamily: 'var(--font-jetbrains, monospace)', fontSize: '0.82rem', color: 'var(--sovereign-alabaster)' }}>
                      {svc.error_budget_remaining_pct !== null ? `${svc.error_budget_remaining_pct?.toFixed(1)}%` : '—'}
                    </span>
                  </div>
                  <BudgetBar value={svc.error_budget_remaining_pct} />
                </div>
              </motion.div>
            ))}
          </div>

          {data.services.every(s => s.uptime_pct === null) && (
            <div style={{ marginTop: '20px', padding: '16px', border: '1px solid rgba(255,255,255,0.06)', fontSize: '0.85rem', color: 'var(--sovereign-slate)', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <TrendingUp size={14} /> {t('slo.noData')}
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
}
