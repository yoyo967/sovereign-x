'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Download, Search } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { api } from '@/lib/api';

interface AuditRecord {
  event_id?: string;
  timestamp?: string;
  actor_uid?: string;
  action?: string;
  resource_type?: string;
  resource_id?: string;
  tenant_id?: string;
  metadata?: Record<string, unknown>;
}

function RiskChip({ risk }: { risk?: string }) {
  if (!risk) return <span style={{ color: 'var(--sovereign-slate)', fontSize: '0.75rem' }}>—</span>;
  const color = risk === 'HIGH' ? 'var(--sovereign-riskred)' : risk === 'LIMITED' ? '#f59e0b' : 'var(--sovereign-success)';
  return (
    <span style={{ padding: '2px 8px', fontSize: '0.67rem', fontFamily: 'var(--font-jetbrains, monospace)', letterSpacing: '0.06em', color, border: `1px solid ${color}30`, background: `${color}10` }}>
      {risk}
    </span>
  );
}

export default function AiAuditPage() {
  const t = useTranslations('dashboard.admin');

  const [tenantFilter, setTenantFilter] = useState('');
  const [riskFilter, setRiskFilter] = useState('');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [records, setRecords] = useState<AuditRecord[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [exporting, setExporting] = useState(false);

  const handleExport = async () => {
    try {
      setExporting(true);
      const data = await api.admin.getAiAuditExport({
        tenant_id: tenantFilter || undefined,
        risk_class: riskFilter || undefined,
        from_date: fromDate || undefined,
        to_date: toDate || undefined,
      });
      setRecords(data.records ?? []);
      setLoaded(true);
    } finally {
      setExporting(false);
    }
  };

  const handleDownloadJson = () => {
    const blob = new Blob([JSON.stringify(records, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `sovereign-ai-audit-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div>
      <div style={{ marginBottom: '24px' }}>
        <h2 style={{ fontSize: '1.8rem', fontWeight: 800, margin: '0 0 6px', letterSpacing: '-0.02em' }}>{t('aiAudit.title')}</h2>
        <p style={{ color: 'var(--sovereign-slate)', margin: 0, fontSize: '0.9rem' }}>{t('aiAudit.subtitle')}</p>
      </div>

      {/* Filter bar */}
      <div className="glass-card-level-1" style={{ padding: '20px', marginBottom: '24px', display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'flex-end' }}>
        <div style={{ flex: '1', minWidth: '160px' }}>
          <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--sovereign-slate)', marginBottom: '6px', fontWeight: 600 }}>{t('aiAudit.filterTenant')}</label>
          <input type="text" className="sovereign-input" placeholder="tenant_id…" value={tenantFilter} onChange={(e) => setTenantFilter(e.target.value)} />
        </div>
        <div style={{ minWidth: '140px' }}>
          <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--sovereign-slate)', marginBottom: '6px', fontWeight: 600 }}>{t('aiAudit.filterRisk')}</label>
          <select className="sovereign-input" value={riskFilter} onChange={(e) => setRiskFilter(e.target.value)} style={{ appearance: 'none' }}>
            <option value="">{t('aiAudit.allRisks')}</option>
            <option value="HIGH">HIGH</option>
            <option value="LIMITED">LIMITED</option>
            <option value="MINIMAL">MINIMAL</option>
          </select>
        </div>
        <div style={{ minWidth: '140px' }}>
          <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--sovereign-slate)', marginBottom: '6px', fontWeight: 600 }}>{t('aiAudit.fromDate')}</label>
          <input type="date" className="sovereign-input" value={fromDate} onChange={(e) => setFromDate(e.target.value)} />
        </div>
        <div style={{ minWidth: '140px' }}>
          <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--sovereign-slate)', marginBottom: '6px', fontWeight: 600 }}>{t('aiAudit.toDate')}</label>
          <input type="date" className="sovereign-input" value={toDate} onChange={(e) => setToDate(e.target.value)} />
        </div>
        <button
          className="primary-aura-button"
          onClick={handleExport}
          disabled={exporting}
          style={{ display: 'flex', alignItems: 'center', gap: '7px', alignSelf: 'flex-end' }}
        >
          {exporting ? <div className="sovereign-spinner-small" /> : <Search size={14} />}
          {exporting ? t('aiAudit.exporting') : t('aiAudit.export')}
        </button>
        {loaded && records.length > 0 && (
          <button className="secondary-button" onClick={handleDownloadJson} style={{ display: 'flex', alignItems: 'center', gap: '7px', alignSelf: 'flex-end' }}>
            <Download size={13} /> JSON
          </button>
        )}
      </div>

      {/* Results */}
      {loaded && (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
          <div style={{ marginBottom: '12px', fontSize: '0.83rem', color: 'var(--sovereign-slate)' }}>
            {t('aiAudit.count', { count: records.length })}
          </div>
          <div className="glass-card-level-1" style={{ overflow: 'hidden' }}>
            {records.length === 0 ? (
              <div style={{ padding: '48px', textAlign: 'center', color: 'var(--sovereign-slate)', fontSize: '0.9rem' }}>
                {t('aiAudit.noRecords')}
              </div>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '800px' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                      {(['timestamp', 'actor', 'action', 'resource', 'risk', 'tenant'] as const).map(col => (
                        <th key={col} style={{ padding: '11px 14px', textAlign: 'left', fontSize: '0.68rem', fontFamily: 'var(--font-jetbrains, monospace)', letterSpacing: '0.08em', color: 'var(--sovereign-slate)', textTransform: 'uppercase', fontWeight: 600, whiteSpace: 'nowrap' }}>
                          {t(`aiAudit.cols.${col}`)}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {records.map((r, i) => (
                      <tr key={r.event_id ?? i} style={{ borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                        <td style={{ padding: '11px 14px', fontSize: '0.75rem', color: 'var(--sovereign-slate)', fontFamily: 'var(--font-jetbrains, monospace)', whiteSpace: 'nowrap' }}>
                          {r.timestamp ? new Date(r.timestamp).toLocaleString('de-DE') : '—'}
                        </td>
                        <td style={{ padding: '11px 14px', fontSize: '0.78rem', color: 'var(--sovereign-alabaster)', fontFamily: 'var(--font-jetbrains, monospace)' }}>
                          {r.actor_uid?.slice(0, 10) ?? '—'}…
                        </td>
                        <td style={{ padding: '11px 14px', fontSize: '0.78rem', color: 'var(--sovereign-cyan)', fontFamily: 'var(--font-jetbrains, monospace)' }}>
                          {r.action ?? '—'}
                        </td>
                        <td style={{ padding: '11px 14px', fontSize: '0.78rem', color: 'var(--sovereign-alabaster)' }}>
                          {r.resource_type} / {r.resource_id?.slice(0, 8) ?? '—'}
                        </td>
                        <td style={{ padding: '11px 14px' }}>
                          <RiskChip risk={r.metadata?.risk_class as string | undefined} />
                        </td>
                        <td style={{ padding: '11px 14px', fontSize: '0.75rem', color: 'var(--sovereign-slate)', fontFamily: 'var(--font-jetbrains, monospace)' }}>
                          {r.tenant_id ?? '—'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </div>
  );
}
