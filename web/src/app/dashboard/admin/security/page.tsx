'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ShieldAlert, CheckCircle2, AlertTriangle, Clock, RefreshCw } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { api } from '@/lib/api';

interface SecurityStatus {
  secrets_status: string;
  sast_last_run: string | null;
  sast_findings: number | null;
  dependency_cve_count: number | null;
  post_deploy_check: string;
  last_updated: string | null;
  note?: string;
}

function StatusChip({ value }: { value: string | number | null }) {
  if (value === null || value === undefined) return <span style={{ color: 'var(--sovereign-slate)', fontSize: '0.85rem' }}>—</span>;
  const str = String(value);
  const isOk = str === 'OK' || str === 'PASS' || str === '0';
  const isUnknown = str === 'UNKNOWN';
  const color = isOk ? 'var(--sovereign-success)' : isUnknown ? 'var(--sovereign-slate)' : 'var(--sovereign-riskred)';
  const Icon = isOk ? CheckCircle2 : AlertTriangle;
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color, fontFamily: 'var(--font-jetbrains, monospace)', fontSize: '0.88rem', fontWeight: 700 }}>
      <Icon size={14} /> {str}
    </span>
  );
}

export default function SecurityStatusPage() {
  const t = useTranslations('dashboard.admin');
  const [status, setStatus] = useState<SecurityStatus | null>(null);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    try {
      setLoading(true);
      const data = await api.admin.getSecurityStatus();
      setStatus(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const rows = status ? [
    { label: t('security.secrets'), value: status.secrets_status },
    { label: t('security.sast'), value: status.sast_last_run },
    { label: t('security.sastFindings'), value: status.sast_findings },
    { label: t('security.cve'), value: status.dependency_cve_count },
    { label: t('security.postDeploy'), value: status.post_deploy_check },
    { label: t('security.lastUpdated'), value: status.last_updated ? new Date(status.last_updated).toLocaleString('de-DE') : null },
  ] : [];

  return (
    <div style={{ maxWidth: '800px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '24px', gap: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 800, margin: '0 0 6px', letterSpacing: '-0.02em' }}>{t('security.title')}</h2>
          <p style={{ color: 'var(--sovereign-slate)', margin: 0, fontSize: '0.9rem' }}>{t('security.subtitle')}</p>
        </div>
        <button className="secondary-button" style={{ display: 'flex', alignItems: 'center', gap: '7px', fontSize: '0.82rem' }} onClick={load} disabled={loading}>
          <RefreshCw size={13} className={loading ? 'animate-spin' : ''} /> Refresh
        </button>
      </div>

      {loading ? (
        <div className="glass-card-level-1" style={{ padding: '60px', textAlign: 'center' }}>
          <div className="sovereign-spinner-small" style={{ margin: '0 auto' }} />
        </div>
      ) : (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <div className="glass-card-level-1" style={{ overflow: 'hidden' }}>
            {status?.note && (
              <div style={{ padding: '12px 20px', background: 'rgba(255,193,7,0.06)', borderBottom: '1px solid rgba(255,193,7,0.15)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Clock size={13} color="#f59e0b" />
                <span style={{ fontSize: '0.8rem', color: '#f59e0b' }}>{status.note}</span>
              </div>
            )}
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <tbody>
                {rows.map(({ label, value }, i) => (
                  <tr key={label} style={{ borderBottom: i < rows.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none' }}>
                    <td style={{ padding: '18px 20px', fontSize: '0.88rem', color: 'var(--sovereign-slate)', fontWeight: 600, width: '220px' }}>
                      {label}
                    </td>
                    <td style={{ padding: '18px 20px' }}>
                      <StatusChip value={value} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Legend */}
          <div style={{ display: 'flex', gap: '20px', marginTop: '16px', flexWrap: 'wrap' }}>
            {[
              { color: 'var(--sovereign-success)', label: t('security.ok') },
              { color: 'var(--sovereign-riskred)', label: t('security.error') },
              { color: 'var(--sovereign-slate)', label: t('security.unknown') },
            ].map(({ color, label }) => (
              <div key={label} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.78rem', color: 'var(--sovereign-slate)' }}>
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: color }} />
                {label}
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}
