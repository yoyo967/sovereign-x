'use client';

import { useEffect, useCallback, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { UserPlus, Crown, Eye, Users, X, Lock, Shield, ChevronRight } from 'lucide-react';
import { useRBAC } from '@/hooks/useRBAC';
import { useVaultStore, type VaultRole, type VaultMember } from '@/stores/vaultStore';
import { SovereignCard } from '@/components/ui/SovereignCard';
import { SkeletonLoader } from '@/components/ui/SkeletonLoader';
import { EmptyState } from '@/components/ui/EmptyState';
import { PlanGateBadge } from '@/components/ui/PlanGateBadge';
import { AuditLogEntry, type AuditEvent } from '@/components/ui/AuditLogEntry';

// ─── Role helpers ─────────────────────────────────────────────────────────────

const ROLE_LABELS: Record<VaultRole, string> = { ADMIN: 'Admin', MEMBER: 'Mitglied', VIEWER: 'Zuschauer' };
const ROLE_COLORS: Record<VaultRole, string> = { ADMIN: '#BB86FC', MEMBER: '#03DAC6', VIEWER: '#FFD600' };
const ROLE_ICONS: Record<VaultRole, React.ReactNode> = {
  ADMIN: <Crown size={12} />,
  MEMBER: <Users size={12} />,
  VIEWER: <Eye size={12} />,
};

function RoleBadge({ role }: { role: VaultRole }) {
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: '4px',
      padding: '2px 8px', borderRadius: 20, fontSize: '0.65rem', fontWeight: 700,
      fontFamily: 'var(--font-mono)', letterSpacing: '0.06em',
      background: `${ROLE_COLORS[role]}15`, color: ROLE_COLORS[role],
      border: `1px solid ${ROLE_COLORS[role]}35`,
    }}>
      {ROLE_ICONS[role]} {ROLE_LABELS[role]}
    </span>
  );
}

// ─── Member Card ──────────────────────────────────────────────────────────────

function MemberCard({ member }: { member: VaultMember }) {
  const initials = (member.displayName ?? member.email).slice(0, 2).toUpperCase();
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 0', borderBottom: '1px solid var(--s-divider)' }}>
      <div style={{
        width: 40, height: 40, borderRadius: '50%', flexShrink: 0,
        background: `${ROLE_COLORS[member.role]}20`, border: `1px solid ${ROLE_COLORS[member.role]}40`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: '0.8rem', fontWeight: 700, color: ROLE_COLORS[member.role],
      }}>{initials}</div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ margin: '0 0 2px', fontSize: '0.88rem', fontWeight: 600 }}>{member.displayName ?? member.email}</p>
        <p style={{ margin: 0, fontSize: '0.72rem', color: 'var(--s-text-faint)' }}>{member.email}</p>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '4px' }}>
        <RoleBadge role={member.role} />
        <span style={{ fontSize: '0.6rem', color: 'var(--s-text-faint)', fontFamily: 'var(--font-mono)' }}>
          Seit {new Date(member.joinedAt).toLocaleDateString('de-DE')}
        </span>
      </div>
    </div>
  );
}

// ─── Invite Modal ─────────────────────────────────────────────────────────────

function InviteModal({ onClose }: { onClose: () => void }) {
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<VaultRole>('MEMBER');
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !/^[^@]+@[^@]+\.[^@]+$/.test(email)) { setError('Gültige E-Mail erforderlich.'); return; }
    setSubmitting(true);
    setError('');
    try {
      // API endpoint not yet available — optimistic UI
      await new Promise((r) => setTimeout(r, 800));
      setDone(true);
    } catch {
      setError('Einladung fehlgeschlagen.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        style={{ background: 'var(--sovereign-surface, #0F1724)', borderRadius: 16, padding: '28px', width: '100%', maxWidth: 440, border: '1px solid var(--s-divider)' }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
          <h2 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 800 }}>Mitglied einladen</h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--s-text-faint)', cursor: 'pointer' }}><X size={20} /></button>
        </div>

        {done ? (
          <div style={{ textAlign: 'center', padding: '20px 0' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '12px' }}>✉️</div>
            <p style={{ margin: '0 0 8px', fontSize: '1rem', fontWeight: 700 }}>Einladung gesendet!</p>
            <p style={{ margin: '0 0 16px', fontSize: '0.82rem', color: 'var(--s-text-muted)' }}>
              <strong>{email}</strong> erhält einen Link, der 7 Tage gültig ist.
            </p>
            <button onClick={onClose} style={{ padding: '8px 20px', borderRadius: 8, background: 'var(--sovereign-purple)', border: 'none', color: '#fff', fontWeight: 700, cursor: 'pointer' }}>Schließen</button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.72rem', color: 'var(--s-text-faint)', marginBottom: '6px', fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>E-Mail *</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="name@beispiel.de"
                style={{ width: '100%', padding: '10px 14px', borderRadius: 8, background: 'rgba(255,255,255,0.04)', border: '1px solid var(--s-divider)', color: 'var(--s-text)', fontSize: '0.9rem', outline: 'none', boxSizing: 'border-box' }} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.72rem', color: 'var(--s-text-faint)', marginBottom: '6px', fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Rolle</label>
              <div style={{ display: 'flex', gap: '8px' }}>
                {(['ADMIN', 'MEMBER', 'VIEWER'] as VaultRole[]).map((r) => (
                  <button key={r} type="button" onClick={() => setRole(r)} style={{
                    flex: 1, padding: '8px', borderRadius: 8, fontSize: '0.75rem', fontWeight: 600,
                    background: role === r ? `${ROLE_COLORS[r]}15` : 'rgba(255,255,255,0.04)',
                    border: `1px solid ${role === r ? ROLE_COLORS[r] + '60' : 'var(--s-divider)'}`,
                    color: role === r ? ROLE_COLORS[r] : 'var(--s-text-muted)',
                    cursor: 'pointer',
                  }}>{ROLE_LABELS[r]}</button>
                ))}
              </div>
            </div>
            <div style={{ padding: '8px 12px', borderRadius: 8, background: 'rgba(255,214,0,0.05)', border: '1px solid rgba(255,214,0,0.15)', fontSize: '0.72rem', color: 'var(--s-text-faint)' }}>
              ⏳ Einladungslink läuft nach <strong style={{ color: '#FFD600' }}>7 Tagen</strong> ab.
            </div>
            {error && <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--sovereign-riskred)' }}>{error}</p>}
            <button type="submit" disabled={submitting} style={{ padding: '12px', borderRadius: 10, background: 'var(--sovereign-purple)', border: 'none', color: '#fff', fontSize: '0.9rem', fontWeight: 700, cursor: submitting ? 'not-allowed' : 'pointer', opacity: submitting ? 0.7 : 1 }}>
              {submitting ? 'Sende…' : 'Einladen'}
            </button>
          </form>
        )}
      </motion.div>
    </motion.div>
  );
}

// ─── Shared Contracts Split View ──────────────────────────────────────────────

function ContractsSplitView() {
  const { sharedContracts } = useVaultStore();
  const [view, setView] = useState<'private' | 'shared'>('private');

  return (
    <div>
      <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
        {(['private', 'shared'] as const).map((v) => (
          <button key={v} onClick={() => setView(v)} style={{
            padding: '6px 14px', borderRadius: 20, fontSize: '0.72rem', fontWeight: 600,
            background: view === v ? 'rgba(187,134,252,0.15)' : 'rgba(255,255,255,0.04)',
            border: `1px solid ${view === v ? 'rgba(187,134,252,0.4)' : 'rgba(255,255,255,0.1)'}`,
            color: view === v ? '#BB86FC' : 'var(--s-text-muted)', cursor: 'pointer',
          }}>{v === 'private' ? 'Meine Verträge' : 'Geteilt'}</button>
        ))}
      </div>
      {view === 'shared' && sharedContracts.length === 0 ? (
        <p style={{ fontSize: '0.82rem', color: 'var(--s-text-faint)', textAlign: 'center', padding: '24px 0' }}>Keine geteilten Verträge</p>
      ) : view === 'private' ? (
        <p style={{ fontSize: '0.82rem', color: 'var(--s-text-faint)', textAlign: 'center', padding: '24px 0' }}>Lade Verträge aus dem Vertragsbereich…</p>
      ) : (
        sharedContracts.map((sc) => (
          <SovereignCard key={sc.id} variant="glass" animate={false} style={{ marginBottom: '10px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ flex: 1 }}>
                <p style={{ margin: '0 0 2px', fontWeight: 600, fontSize: '0.9rem' }}>{sc.name}</p>
                <p style={{ margin: 0, fontSize: '0.72rem', color: 'var(--s-text-faint)' }}>{sc.provider} · geteilt von {sc.sharedBy}</p>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--s-text-faint)', fontSize: '0.72rem', fontFamily: 'var(--font-mono)' }}>
                <Users size={12} /> {sc.sharedCount}
                <ChevronRight size={14} />
              </div>
            </div>
          </SovereignCard>
        ))
      )}
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

const MOCK_AUDIT: AuditEvent[] = [
  { id: '1', action: 'MEMBER_INVITED', actor: 'admin@family.de', timestamp: new Date(Date.now() - 3600000).toISOString(), metadata: { email: 'son@family.de', role: 'MEMBER' } },
  { id: '2', action: 'CONTRACT_SHARED', actor: 'admin@family.de', timestamp: new Date(Date.now() - 86400000).toISOString(), metadata: { contract: 'Netflix Jahresabo' } },
  { id: '3', action: 'VAULT_CREATED', actor: 'admin@family.de', timestamp: new Date(Date.now() - 172800000).toISOString() },
];

export default function VaultPage() {
  const { hasTier } = useRBAC();
  const { vault, members, pendingInvites, isLoading, setVault, setMembers, setPendingInvites, setLoading } = useVaultStore();
  const [showInvite, setShowInvite] = useState(false);
  const [activeTab, setActiveTab] = useState<'members' | 'contracts' | 'audit'>('members');

  const load = useCallback(async () => {
    if (!hasTier('SHIELD')) return;
    setLoading(true);
    try {
      // Vault API not yet implemented — use mock data for UI
      setVault({ id: 'vault-1', name: 'Familien-Vault', createdAt: new Date(Date.now() - 172800000).toISOString(), memberCount: 3 });
      setMembers([]);
      setPendingInvites([]);
    } finally {
      setLoading(false);
    }
  }, [hasTier, setVault, setMembers, setPendingInvites, setLoading]);

  useEffect(() => { void load(); }, [load]);

  // SHIELD Gate
  if (!hasTier('SHIELD')) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', maxWidth: 560, margin: '0 auto' }}>
        <div>
          <h1 style={{ margin: '0 0 4px', fontSize: '1.6rem', fontWeight: 800, letterSpacing: '-0.03em' }}>Family Vault</h1>
          <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--s-text-muted)' }}>Gemeinsame Finanzverwaltung für die Familie</p>
        </div>
        <PlanGateBadge required="SHIELD" fullPage featureName="Family Vault"><span /></PlanGateBadge>
      </div>
    );
  }

  if (isLoading) return <SkeletonLoader variant="card" count={3} />;

  const tabs = [
    { key: 'members' as const, label: `Mitglieder (${members.length})` },
    { key: 'contracts' as const, label: 'Verträge' },
    { key: 'audit' as const, label: 'Audit-Log' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', maxWidth: 720, margin: '0 auto' }}>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '12px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
            <h1 style={{ margin: 0, fontSize: '1.6rem', fontWeight: 800, letterSpacing: '-0.03em' }}>Family Vault</h1>
            <span style={{ padding: '2px 8px', borderRadius: 20, background: 'rgba(3,218,198,0.12)', border: '1px solid rgba(3,218,198,0.3)', fontSize: '0.65rem', fontWeight: 700, color: '#03DAC6', fontFamily: 'var(--font-mono)' }}>SHIELD</span>
          </div>
          <p style={{ margin: 0, fontSize: '0.82rem', color: 'var(--s-text-muted)' }}>
            {vault?.name ?? 'Familien-Vault'} · {members.length} Mitglieder
          </p>
        </div>
        <button
          onClick={() => setShowInvite(true)}
          style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 16px', borderRadius: 10, background: 'var(--sovereign-purple)', border: 'none', color: '#fff', fontSize: '0.85rem', fontWeight: 700, cursor: 'pointer', flexShrink: 0 }}
        >
          <UserPlus size={16} /> Einladen
        </button>
      </div>

      {/* Vault Info Card */}
      {vault && (
        <SovereignCard variant="elevated" glow animate={false}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ width: 48, height: 48, borderRadius: 12, background: 'linear-gradient(135deg, rgba(187,134,252,0.2), rgba(3,218,198,0.15))', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Shield size={24} style={{ color: '#BB86FC' }} />
            </div>
            <div style={{ flex: 1 }}>
              <h3 style={{ margin: '0 0 2px', fontSize: '1rem', fontWeight: 700 }}>{vault.name}</h3>
              <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--s-text-faint)' }}>Erstellt am {new Date(vault.createdAt).toLocaleDateString('de-DE')}</p>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, auto)', gap: '20px', textAlign: 'center' }}>
              {[
                { label: 'Mitglieder', value: vault.memberCount },
                { label: 'Ausstehend', value: pendingInvites.length },
                { label: 'Verträge', value: '—' },
              ].map(({ label, value }) => (
                <div key={label}>
                  <p style={{ margin: '0 0 2px', fontSize: '0.6rem', color: 'var(--s-text-faint)', fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{label}</p>
                  <p style={{ margin: 0, fontSize: '1.1rem', fontWeight: 800, fontFamily: 'var(--font-mono)', color: '#BB86FC' }}>{value}</p>
                </div>
              ))}
            </div>
          </div>
        </SovereignCard>
      )}

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '8px', borderBottom: '1px solid var(--s-divider)', paddingBottom: '0' }}>
        {tabs.map(({ key, label }) => (
          <button key={key} onClick={() => setActiveTab(key)} style={{
            padding: '8px 16px', background: 'none', border: 'none',
            borderBottom: `2px solid ${activeTab === key ? 'var(--sovereign-purple)' : 'transparent'}`,
            color: activeTab === key ? '#BB86FC' : 'var(--s-text-muted)',
            fontSize: '0.85rem', fontWeight: activeTab === key ? 700 : 400,
            cursor: 'pointer', transition: 'all 0.15s',
          }}>{label}</button>
        ))}
      </div>

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        <motion.div key={activeTab} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
          {activeTab === 'members' && (
            <SovereignCard variant="default" animate={false}>
              {members.length === 0 ? (
                <EmptyState
                  icon={<Users size={24} />}
                  title="Noch keine Mitglieder"
                  description="Lade Familienmitglieder ein, um gemeinsam Finanzen zu verwalten."
                  cta={{ label: 'Einladen', onClick: () => setShowInvite(true) }}
                />
              ) : (
                <>
                  {members.map((m) => <MemberCard key={m.uid} member={m} />)}
                  {pendingInvites.length > 0 && (
                    <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid var(--s-divider)' }}>
                      <p style={{ margin: '0 0 10px', fontSize: '0.7rem', fontFamily: 'var(--font-mono)', color: 'var(--s-text-faint)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Ausstehende Einladungen</p>
                      {pendingInvites.map((inv) => (
                        <div key={inv.id} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '8px 0', opacity: 0.7 }}>
                          <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'rgba(255,255,255,0.04)', border: '1px dashed rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Lock size={14} style={{ color: 'var(--s-text-faint)' }} />
                          </div>
                          <div style={{ flex: 1 }}>
                            <p style={{ margin: '0 0 2px', fontSize: '0.85rem' }}>{inv.email}</p>
                            <p style={{ margin: 0, fontSize: '0.68rem', color: 'var(--s-text-faint)' }}>Läuft ab: {new Date(inv.expiresAt).toLocaleDateString('de-DE')}</p>
                          </div>
                          <RoleBadge role={inv.role} />
                        </div>
                      ))}
                    </div>
                  )}
                </>
              )}
            </SovereignCard>
          )}

          {activeTab === 'contracts' && (
            <SovereignCard variant="default" animate={false}>
              <ContractsSplitView />
            </SovereignCard>
          )}

          {activeTab === 'audit' && (
            <SovereignCard variant="default" animate={false}>
              <p style={{ margin: '0 0 16px', fontSize: '0.7rem', fontFamily: 'var(--font-mono)', color: 'var(--s-text-faint)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Vault-Aktivitäten</p>
              {MOCK_AUDIT.map((ev) => <AuditLogEntry key={ev.id} event={ev} />)}
            </SovereignCard>
          )}
        </motion.div>
      </AnimatePresence>

      <AnimatePresence>
        {showInvite && <InviteModal onClose={() => setShowInvite(false)} />}
      </AnimatePresence>
    </div>
  );
}
