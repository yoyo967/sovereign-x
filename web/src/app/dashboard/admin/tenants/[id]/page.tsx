'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Users, Shield, Snowflake, CheckCircle2 } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useRouter, useParams } from 'next/navigation';
import { api } from '@/lib/api';

interface Member {
  uid: string;
  role: string;
  scopes: string[];
  joined_at: string;
}

interface TenantDetail {
  id: string;
  name: string;
  plan: string;
  status: string;
  primary_locale: string;
  compliance_profile: string;
  created_at: string | null;
  created_by: string;
  member_count: number;
  avv_signed: boolean;
  kms_key_id: string | null;
  security_score: number | null;
  eu_first_score: number | null;
  members: Member[];
}

function InfoRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
      <td style={{ padding: '13px 20px', fontSize: '0.82rem', color: 'var(--sovereign-slate)', fontWeight: 600, width: '200px', whiteSpace: 'nowrap' }}>{label}</td>
      <td style={{ padding: '13px 20px', fontSize: '0.88rem', color: 'var(--sovereign-alabaster)' }}>{value}</td>
    </tr>
  );
}

export default function TenantDetailPage() {
  const t = useTranslations('dashboard.admin');
  const router = useRouter();
  const params = useParams();
  const tenantId = params.id as string;

  const [tenant, setTenant] = useState<TenantDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [freezing, setFreezing] = useState(false);

  useEffect(() => {
    api.admin.getTenant(tenantId)
      .then(setTenant)
      .finally(() => setLoading(false));
  }, [tenantId]);

  const handleFreeze = async () => {
    if (!tenant) return;
    const msg = t('tenants.freezeConfirm', { name: tenant.name });
    if (!window.confirm(msg)) return;
    try {
      setFreezing(true);
      await api.admin.freezeTenant(tenantId);
      const updated = await api.admin.getTenant(tenantId);
      setTenant(updated);
    } finally {
      setFreezing(false);
    }
  };

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '50vh' }}>
      <div className="sovereign-spinner-small" />
    </div>
  );

  if (!tenant) return (
    <div style={{ textAlign: 'center', padding: '60px', color: 'var(--sovereign-slate)' }}>Tenant not found.</div>
  );

  return (
    <div style={{ maxWidth: '900px' }}>
      {/* Back + header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '28px', gap: '1rem', flexWrap: 'wrap' }}>
        <div>
          <button
            className="secondary-button"
            onClick={() => router.push('/dashboard/admin')}
            style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', marginBottom: '14px' }}
          >
            <ArrowLeft size={13} /> {t('tenants.title')}
          </button>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 800, margin: '0 0 4px', letterSpacing: '-0.02em' }}>{tenant.name}</h2>
          <p style={{ margin: 0, fontFamily: 'var(--font-jetbrains, monospace)', fontSize: '0.72rem', color: 'var(--sovereign-slate)', letterSpacing: '0.06em' }}>{tenant.id}</p>
        </div>
        {tenant.status !== 'frozen' && (
          <button
            className="secondary-button"
            onClick={handleFreeze}
            disabled={freezing}
            style={{ display: 'flex', alignItems: 'center', gap: '7px', borderColor: 'rgba(255,23,68,0.25)', color: 'var(--sovereign-riskred)' }}
          >
            {freezing ? <div className="sovereign-spinner-small" /> : <Snowflake size={14} />}
            {t('tenants.freeze')}
          </button>
        )}
      </div>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        {/* Details table */}
        <div className="glass-card-level-1" style={{ overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <tbody>
              <InfoRow label="Plan" value={<span style={{ fontFamily: 'var(--font-jetbrains, monospace)', color: 'var(--sovereign-cyan)' }}>{tenant.plan}</span>} />
              <InfoRow label="Status" value={
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: tenant.status === 'frozen' ? 'var(--sovereign-riskred)' : 'var(--sovereign-success)', fontFamily: 'var(--font-jetbrains, monospace)', fontSize: '0.85rem' }}>
                  {tenant.status === 'frozen' ? <Snowflake size={13} /> : <CheckCircle2 size={13} />}
                  {tenant.status === 'frozen' ? t('tenants.frozen') : t('tenants.active')}
                </span>
              } />
              <InfoRow label="Locale" value={tenant.primary_locale} />
              <InfoRow label="Compliance" value={<span style={{ fontFamily: 'var(--font-jetbrains, monospace)', fontSize: '0.82rem', color: 'var(--sovereign-cyan)' }}>{tenant.compliance_profile}</span>} />
              <InfoRow label="AVV signed" value={
                <span style={{ color: tenant.avv_signed ? 'var(--sovereign-success)' : 'var(--sovereign-riskred)', fontFamily: 'var(--font-jetbrains, monospace)', fontSize: '0.82rem' }}>
                  {tenant.avv_signed ? 'YES' : 'NO'}
                </span>
              } />
              <InfoRow label="KMS Key" value={<span style={{ fontFamily: 'var(--font-jetbrains, monospace)', fontSize: '0.78rem', color: 'var(--sovereign-slate)' }}>{tenant.kms_key_id ?? '—'}</span>} />
              <InfoRow label="Security Score" value={
                tenant.security_score != null
                  ? <span style={{ fontFamily: 'var(--font-jetbrains, monospace)', color: tenant.security_score >= 80 ? 'var(--sovereign-success)' : tenant.security_score >= 50 ? '#f59e0b' : 'var(--sovereign-riskred)' }}>{tenant.security_score}%</span>
                  : '—'
              } />
              <InfoRow label="EU-First Score" value={tenant.eu_first_score != null ? `${tenant.eu_first_score}%` : '—'} />
              <InfoRow label="Created" value={tenant.created_at ? new Date(tenant.created_at).toLocaleString('de-DE') : '—'} />
              <InfoRow label="Created by" value={<span style={{ fontFamily: 'var(--font-jetbrains, monospace)', fontSize: '0.78rem' }}>{tenant.created_by}</span>} />
            </tbody>
          </table>
        </div>

        {/* Members */}
        <div className="glass-card-level-1" style={{ overflow: 'hidden' }}>
          <div style={{ padding: '16px 20px', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Users size={14} color="var(--sovereign-cyan)" />
            <span style={{ fontWeight: 700, fontSize: '1rem' }}>{t('tenants.cols.members')} ({tenant.members.length})</span>
          </div>
          {tenant.members.length === 0 ? (
            <div style={{ padding: '40px', textAlign: 'center', color: 'var(--sovereign-slate)', fontSize: '0.88rem' }}>Keine Mitglieder gefunden.</div>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                  {['UID', 'Role', 'Scopes', 'Joined'].map(h => (
                    <th key={h} style={{ padding: '10px 16px', textAlign: 'left', fontSize: '0.67rem', fontFamily: 'var(--font-jetbrains, monospace)', letterSpacing: '0.08em', color: 'var(--sovereign-slate)', textTransform: 'uppercase', fontWeight: 600 }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {tenant.members.map((m) => (
                  <tr key={m.uid} style={{ borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                    <td style={{ padding: '12px 16px', fontFamily: 'var(--font-jetbrains, monospace)', fontSize: '0.75rem', color: 'var(--sovereign-slate)' }}>{m.uid.slice(0, 14)}…</td>
                    <td style={{ padding: '12px 16px' }}>
                      <span style={{ padding: '2px 8px', fontSize: '0.68rem', fontFamily: 'var(--font-jetbrains, monospace)', letterSpacing: '0.06em', background: 'rgba(0,212,255,0.08)', color: 'var(--sovereign-cyan)', border: '1px solid rgba(0,212,255,0.2)' }}>
                        {m.role}
                      </span>
                    </td>
                    <td style={{ padding: '12px 16px', fontSize: '0.72rem', color: 'var(--sovereign-slate)' }}>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                        {(m.scopes ?? []).map((s: string) => (
                          <span key={s} style={{ padding: '1px 6px', background: 'rgba(255,255,255,0.05)', fontSize: '0.65rem', fontFamily: 'var(--font-jetbrains, monospace)', color: 'var(--sovereign-slate)' }}>{s}</span>
                        ))}
                      </div>
                    </td>
                    <td style={{ padding: '12px 16px', fontSize: '0.75rem', color: 'var(--sovereign-slate)', whiteSpace: 'nowrap' }}>
                      {m.joined_at ? new Date(m.joined_at).toLocaleDateString('de-DE') : '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </motion.div>
    </div>
  );
}
