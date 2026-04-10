'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, Plus, Snowflake, X, ChevronRight } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';

// ─── Types ────────────────────────────────────────────────────────────────────

interface Tenant {
  id: string;
  name: string;
  plan: string;
  status: string;
  primary_locale: string;
  compliance_profile: string;
  created_at: string | null;
  member_count: number;
  security_score: number | null;
  eu_first_score: number | null;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function PlanBadge({ plan }: { plan: string }) {
  const colors: Record<string, { bg: string; color: string }> = {
    FREE: { bg: 'rgba(255,255,255,0.06)', color: 'var(--sovereign-slate)' },
    PRO: { bg: 'rgba(0,212,255,0.1)', color: 'var(--sovereign-cyan)' },
    SHIELD: { bg: 'rgba(139,92,246,0.12)', color: 'var(--sovereign-purple)' },
    ENTERPRISE: { bg: 'rgba(0,200,140,0.1)', color: 'var(--sovereign-success)' },
  };
  const c = colors[plan] ?? colors.FREE;
  return (
    <span style={{ padding: '3px 9px', fontSize: '0.68rem', fontFamily: 'var(--font-jetbrains, monospace)', letterSpacing: '0.06em', background: c.bg, color: c.color, border: `1px solid ${c.color}30` }}>
      {plan}
    </span>
  );
}

function StatusBadge({ status, frozenLabel, activeLabel }: { status: string; frozenLabel: string; activeLabel: string }) {
  const frozen = status === 'frozen';
  return (
    <span style={{ padding: '3px 9px', fontSize: '0.68rem', fontFamily: 'var(--font-jetbrains, monospace)', letterSpacing: '0.06em', display: 'inline-flex', alignItems: 'center', gap: '4px', background: frozen ? 'rgba(255,23,68,0.1)' : 'rgba(0,200,140,0.1)', color: frozen ? 'var(--sovereign-riskred)' : 'var(--sovereign-success)', border: `1px solid ${frozen ? 'rgba(255,23,68,0.25)' : 'rgba(0,200,140,0.25)'}` }}>
      {frozen ? <Snowflake size={9} /> : null}
      {frozen ? frozenLabel : activeLabel}
    </span>
  );
}

// ─── Create Tenant Modal ──────────────────────────────────────────────────────

interface CreateModalProps {
  onClose: () => void;
  onCreated: () => void;
  t: ReturnType<typeof useTranslations>;
}

function CreateTenantModal({ onClose, onCreated, t }: CreateModalProps) {
  const [form, setForm] = useState({
    name: '', plan: 'FREE', domain: '',
    primary_locale: 'de', compliance_profile: 'EU_STANDARD', admin_uid: '',
  });
  const [creating, setCreating] = useState(false);

  const handleCreate = async () => {
    try {
      setCreating(true);
      await api.admin.createTenant(form);
      onCreated();
      onClose();
    } finally {
      setCreating(false);
    }
  };

  const field = (key: keyof typeof form, label: string, type = 'text', placeholder = '') => (
    <div>
      <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--sovereign-slate)', marginBottom: '7px', fontWeight: 600 }}>{label}</label>
      <input
        type={type}
        value={form[key]}
        placeholder={placeholder}
        onChange={(e) => setForm({ ...form, [key]: e.target.value })}
        className="sovereign-input"
      />
    </div>
  );

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <motion.div
        initial={{ scale: 0.95, y: 16 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95 }}
        className="glass-card-level-1" style={{ width: '100%', maxWidth: '520px', padding: '2rem' }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700, margin: 0 }}>{t('tenants.createModal.title')}</h3>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--sovereign-slate)', padding: '4px' }}><X size={18} /></button>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          {field('name', t('tenants.createModal.name'), 'text', 'Acme Corp')}
          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--sovereign-slate)', marginBottom: '7px', fontWeight: 600 }}>{t('tenants.createModal.plan')}</label>
            <select className="sovereign-input" value={form.plan} onChange={(e) => setForm({ ...form, plan: e.target.value })} style={{ appearance: 'none' }}>
              {['FREE', 'PRO', 'SHIELD', 'ENTERPRISE'].map(p => <option key={p}>{p}</option>)}
            </select>
          </div>
          {field('domain', t('tenants.createModal.domain'), 'text', 'acme.example.com')}
          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--sovereign-slate)', marginBottom: '7px', fontWeight: 600 }}>{t('tenants.createModal.locale')}</label>
            <select className="sovereign-input" value={form.primary_locale} onChange={(e) => setForm({ ...form, primary_locale: e.target.value })} style={{ appearance: 'none' }}>
              <option value="de">de</option>
              <option value="en">en</option>
              <option value="fr">fr</option>
            </select>
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--sovereign-slate)', marginBottom: '7px', fontWeight: 600 }}>{t('tenants.createModal.compliance')}</label>
            <select className="sovereign-input" value={form.compliance_profile} onChange={(e) => setForm({ ...form, compliance_profile: e.target.value })} style={{ appearance: 'none' }}>
              {['EU_STANDARD', 'EU_HIGH', 'ENTERPRISE'].map(c => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div style={{ gridColumn: '1 / -1' }}>
            {field('admin_uid', t('tenants.createModal.adminUid'), 'text', 'firebase_uid_...')}
          </div>
        </div>
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
          <button onClick={onClose} className="secondary-button">{t('tenants.createModal.cancel')}</button>
          <button
            className="primary-aura-button"
            onClick={handleCreate}
            disabled={creating || !form.name || !form.admin_uid}
            style={{ display: 'flex', alignItems: 'center', gap: '7px' }}
          >
            {creating ? <div className="sovereign-spinner-small" /> : <Plus size={14} />}
            {t('tenants.createModal.create')}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function AdminTenantsPage() {
  const t = useTranslations('dashboard.admin');
  const router = useRouter();

  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterPlan, setFilterPlan] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [showCreate, setShowCreate] = useState(false);
  const [freezing, setFreezing] = useState<string | null>(null);

  const loadTenants = useCallback(async () => {
    try {
      setLoading(true);
      const data = await api.admin.listTenants({ plan: filterPlan || undefined, status: filterStatus || undefined });
      setTenants(data.tenants ?? []);
    } catch {
      setTenants([]);
    } finally {
      setLoading(false);
    }
  }, [filterPlan, filterStatus]);

  useEffect(() => { loadTenants(); }, [loadTenants]);

  const handleFreeze = async (tenant: Tenant) => {
    const msg = t('tenants.freezeConfirm', { name: tenant.name });
    if (!window.confirm(msg)) return;
    try {
      setFreezing(tenant.id);
      await api.admin.freezeTenant(tenant.id);
      await loadTenants();
    } finally {
      setFreezing(null);
    }
  };

  return (
    <>
      <AnimatePresence>
        {showCreate && (
          <CreateTenantModal onClose={() => setShowCreate(false)} onCreated={loadTenants} t={t} />
        )}
      </AnimatePresence>

      <div>
        {/* Page header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '24px', gap: '1rem', flexWrap: 'wrap' }}>
          <div>
            <h2 style={{ fontSize: '1.8rem', fontWeight: 800, margin: '0 0 6px', letterSpacing: '-0.02em' }}>{t('tenants.title')}</h2>
            <p style={{ color: 'var(--sovereign-slate)', margin: 0, fontSize: '0.9rem' }}>{t('tenants.subtitle')}</p>
          </div>
          <button className="primary-aura-button" style={{ display: 'flex', alignItems: 'center', gap: '7px' }} onClick={() => setShowCreate(true)}>
            <Plus size={14} /> {t('tenants.createTenant')}
          </button>
        </div>

        {/* Filters */}
        <div style={{ display: 'flex', gap: '12px', marginBottom: '20px', flexWrap: 'wrap' }}>
          <select
            className="sovereign-input"
            style={{ width: 'auto', appearance: 'none', minWidth: '140px' }}
            value={filterPlan}
            onChange={(e) => setFilterPlan(e.target.value)}
          >
            <option value="">{t('tenants.allPlans')}</option>
            {['FREE', 'PRO', 'SHIELD', 'ENTERPRISE'].map(p => <option key={p} value={p}>{p}</option>)}
          </select>
          <select
            className="sovereign-input"
            style={{ width: 'auto', appearance: 'none', minWidth: '150px' }}
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="">{t('tenants.allStatuses')}</option>
            <option value="active">{t('tenants.active')}</option>
            <option value="frozen">{t('tenants.frozen')}</option>
          </select>
          {!loading && (
            <span style={{ display: 'flex', alignItems: 'center', fontSize: '0.82rem', color: 'var(--sovereign-slate)' }}>
              <Users size={13} style={{ marginRight: '5px' }} />
              {t('tenants.count', { count: tenants.length })}
            </span>
          )}
        </div>

        {/* Table */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-card-level-1" style={{ overflow: 'hidden' }}>
          {loading ? (
            <div style={{ padding: '60px', textAlign: 'center' }}>
              <div className="sovereign-spinner-small" style={{ margin: '0 auto' }} />
            </div>
          ) : tenants.length === 0 ? (
            <div style={{ padding: '60px', textAlign: 'center', color: 'var(--sovereign-slate)', fontSize: '0.9rem' }}>
              Keine Tenants gefunden.
            </div>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                  {(['name', 'plan', 'status', 'members', 'security', 'created', 'actions'] as const).map(col => (
                    <th key={col} style={{ padding: '12px 16px', textAlign: 'left', fontSize: '0.72rem', fontFamily: 'var(--font-jetbrains, monospace)', letterSpacing: '0.08em', color: 'var(--sovereign-slate)', textTransform: 'uppercase', fontWeight: 600, whiteSpace: 'nowrap' }}>
                      {t(`tenants.cols.${col}`)}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {tenants.map((tenant, i) => (
                  <motion.tr
                    key={tenant.id}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.03 }}
                    style={{ borderBottom: '1px solid rgba(255,255,255,0.04)', cursor: 'pointer' }}
                    onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.02)')}
                    onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                  >
                    <td style={{ padding: '14px 16px' }}>
                      <p style={{ margin: 0, fontWeight: 600, fontSize: '0.9rem', color: 'var(--sovereign-alabaster)' }}>{tenant.name}</p>
                      <p style={{ margin: 0, fontSize: '0.72rem', color: 'var(--sovereign-slate)', fontFamily: 'var(--font-jetbrains, monospace)' }}>{tenant.id.slice(0, 8)}…</p>
                    </td>
                    <td style={{ padding: '14px 16px' }}><PlanBadge plan={tenant.plan} /></td>
                    <td style={{ padding: '14px 16px' }}>
                      <StatusBadge status={tenant.status} frozenLabel={t('tenants.frozen')} activeLabel={t('tenants.active')} />
                    </td>
                    <td style={{ padding: '14px 16px', fontFamily: 'var(--font-jetbrains, monospace)', fontSize: '0.88rem', color: 'var(--sovereign-alabaster)' }}>
                      {tenant.member_count}
                    </td>
                    <td style={{ padding: '14px 16px' }}>
                      {tenant.security_score != null ? (
                        <span style={{ fontFamily: 'var(--font-jetbrains, monospace)', fontSize: '0.88rem', color: tenant.security_score >= 80 ? 'var(--sovereign-success)' : tenant.security_score >= 50 ? '#f59e0b' : 'var(--sovereign-riskred)' }}>
                          {tenant.security_score}%
                        </span>
                      ) : <span style={{ color: 'var(--sovereign-slate)', fontSize: '0.8rem' }}>—</span>}
                    </td>
                    <td style={{ padding: '14px 16px', fontSize: '0.8rem', color: 'var(--sovereign-slate)', whiteSpace: 'nowrap' }}>
                      {tenant.created_at ? new Date(tenant.created_at).toLocaleDateString('de-DE') : '—'}
                    </td>
                    <td style={{ padding: '14px 16px' }}>
                      <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                        <button
                          className="secondary-button"
                          style={{ padding: '4px 10px', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '4px' }}
                          onClick={() => router.push(`/dashboard/admin/tenants/${tenant.id}`)}
                        >
                          <ChevronRight size={12} />
                        </button>
                        {tenant.status !== 'frozen' && (
                          <button
                            className="secondary-button"
                            style={{ padding: '4px 10px', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '4px', borderColor: 'rgba(255,23,68,0.2)', color: 'var(--sovereign-riskred)' }}
                            onClick={() => handleFreeze(tenant)}
                            disabled={freezing === tenant.id}
                          >
                            {freezing === tenant.id ? <div className="sovereign-spinner-small" /> : <Snowflake size={11} />}
                            {t('tenants.freeze')}
                          </button>
                        )}
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          )}
        </motion.div>
      </div>
    </>
  );
}
