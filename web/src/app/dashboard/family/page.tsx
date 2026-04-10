'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users, UserPlus, Shield, Share2, Star, Lock,
  Clock, X, ChevronDown, ChevronUp, Fingerprint,
  FileText, RotateCcw,
} from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useRequireAuth } from '@/hooks/useRequireAuth';
import { useRBAC } from '@/hooks/useRBAC';

// ─── Types ────────────────────────────────────────────────────────────────────

type MemberRole = 'owner' | 'admin' | 'trustee' | 'member';

interface VaultMember {
  uid: string;
  displayName: string;
  email: string;
  role: MemberRole;
  joinedAt: string;
  avatarInitial: string;
}

interface SharedDoc {
  id: string;
  title: string;
  type: string;
  sharedWith: number;
  sharedAt: string;
}

interface DelegatedApproval {
  id: string;
  title: string;
  delegatedTo: string;
  delegatedAt: string;
  riskLevel: 'HIGH' | 'MEDIUM' | 'LOW';
}

// ─── Mock data (replaced by API in production) ───────────────────────────────

const MOCK_MEMBERS: VaultMember[] = [];

const MOCK_SHARED_DOCS: SharedDoc[] = [
  { id: '1', title: 'Haushaltsversicherung 2025', type: 'Versicherung', sharedWith: 2, sharedAt: '2025-03-15' },
  { id: '2', title: 'Strom-Rahmenvertrag GreenPower', type: 'Energie', sharedWith: 1, sharedAt: '2025-01-08' },
];

const MOCK_DELEGATED: DelegatedApproval[] = [
  { id: 'a1', title: 'Versicherungswechsel PKV → GKV', delegatedTo: 'Max Mustermann', delegatedAt: '2025-04-01', riskLevel: 'HIGH' },
];

// ─── Role Badge ───────────────────────────────────────────────────────────────

function RoleBadge({ role, t }: { role: MemberRole; t: ReturnType<typeof useTranslations> }) {
  const colors: Record<MemberRole, { bg: string; color: string }> = {
    owner: { bg: 'rgba(0,212,255,0.12)', color: 'var(--sovereign-cyan)' },
    admin: { bg: 'rgba(139,92,246,0.12)', color: 'var(--sovereign-purple)' },
    trustee: { bg: 'rgba(0,200,140,0.12)', color: 'var(--sovereign-success)' },
    member: { bg: 'rgba(255,255,255,0.06)', color: 'var(--sovereign-slate)' },
  };
  const { bg, color } = colors[role];
  const icons: Record<MemberRole, React.ReactNode> = {
    owner: <Star size={9} />,
    admin: <Shield size={9} />,
    trustee: <Fingerprint size={9} />,
    member: <Users size={9} />,
  };
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: '4px',
      padding: '3px 9px', background: bg, color,
      fontSize: '0.68rem', fontFamily: 'var(--font-jetbrains, monospace)',
      letterSpacing: '0.06em', textTransform: 'uppercase',
      border: `1px solid ${color}30`,
    }}>
      {icons[role]} {t(`members.${role}`)}
    </span>
  );
}

// ─── Invite Modal ─────────────────────────────────────────────────────────────

function InviteModal({ onClose, t }: { onClose: () => void; t: ReturnType<typeof useTranslations> }) {
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<Exclude<MemberRole, 'owner'>>('member');

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{
        position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', zIndex: 1000,
        display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem',
      }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <motion.div
        initial={{ scale: 0.95, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.95, y: 20 }}
        className="glass-card-level-1"
        style={{ width: '100%', maxWidth: '480px', padding: '2rem' }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700, margin: 0 }}>{t('members.inviteModal.title')}</h3>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--sovereign-slate)', padding: '4px' }}>
            <X size={18} />
          </button>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.82rem', color: 'var(--sovereign-slate)', marginBottom: '8px', fontWeight: 600 }}>
              {t('members.inviteModal.email')}
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@example.com"
              className="sovereign-input"
            />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.82rem', color: 'var(--sovereign-slate)', marginBottom: '8px', fontWeight: 600 }}>
              {t('members.inviteModal.role')}
            </label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {(['member', 'trustee', 'admin'] as const).map((r) => (
                <label key={r} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', cursor: 'pointer', padding: '10px', border: `1px solid ${role === r ? 'rgba(0,212,255,0.3)' : 'rgba(255,255,255,0.06)'}`, background: role === r ? 'rgba(0,212,255,0.04)' : 'transparent' }}>
                  <input type="radio" name="role" checked={role === r} onChange={() => setRole(r)} style={{ marginTop: '2px' }} />
                  <div>
                    <span style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--sovereign-alabaster)' }}>{t(`members.${r}`)}</span>
                    <p style={{ margin: '2px 0 0', fontSize: '0.75rem', color: 'var(--sovereign-slate)' }}>{t(`members.roles.${r}`)}</p>
                  </div>
                </label>
              ))}
            </div>
          </div>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
            <button onClick={onClose} className="secondary-button">{t('members.inviteModal.cancel')}</button>
            <button className="primary-aura-button" style={{ display: 'flex', alignItems: 'center', gap: '8px' }} disabled={!email}>
              <UserPlus size={14} /> {t('members.inviteModal.send')}
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ─── SHIELD Gate ──────────────────────────────────────────────────────────────

function ShieldGate({ t }: { t: ReturnType<typeof useTranslations> }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        minHeight: '60vh', textAlign: 'center', padding: '2rem',
      }}
    >
      <div style={{
        width: '80px', height: '80px', borderRadius: '50%',
        background: 'rgba(139,92,246,0.08)', border: '1px solid rgba(139,92,246,0.25)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem',
      }}>
        <Lock size={36} color="var(--sovereign-purple)" />
      </div>
      <h2 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: '1rem', letterSpacing: '-0.03em' }}>
        {t('shieldGate.title')}
      </h2>
      <p style={{ color: 'var(--sovereign-slate)', fontSize: '1rem', maxWidth: '420px', lineHeight: 1.6, marginBottom: '2rem' }}>
        {t('shieldGate.desc')}
      </p>
      <button className="primary-aura-button" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <Shield size={15} /> {t('shieldGate.cta')}
      </button>
    </motion.div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function FamilyVaultPage() {
  const t = useTranslations('dashboard.family');
  const { user, loading: authLoading } = useRequireAuth();
  const { hasTier } = useRBAC();
  const [showInvite, setShowInvite] = useState(false);
  const [expandedDocId, setExpandedDocId] = useState<string | null>(null);

  if (authLoading) return null;

  // SHIELD gate
  if (!hasTier('SHIELD')) return <ShieldGate t={t} />;

  const members: VaultMember[] = MOCK_MEMBERS;
  const sharedDocs: SharedDoc[] = MOCK_SHARED_DOCS;
  const delegated: DelegatedApproval[] = MOCK_DELEGATED;
  const sharedCount = sharedDocs.length;

  return (
    <>
      <AnimatePresence>
        {showInvite && <InviteModal onClose={() => setShowInvite(false)} t={t} />}
      </AnimatePresence>

      <div style={{ maxWidth: '1280px' }}>
        {/* Header */}
        <header style={{ marginBottom: '40px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: '1rem', flexWrap: 'wrap' }}>
          <div>
            <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '8px', fontFamily: 'var(--font-space-grotesk, sans-serif)', letterSpacing: '-0.03em' }}>
              {t('title')}
            </h1>
            <p style={{ color: 'var(--sovereign-slate)', fontSize: '1.05rem', margin: 0 }}>
              {t('subtitle')}
            </p>
          </div>
          <button
            className="primary-aura-button"
            style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
            onClick={() => setShowInvite(true)}
          >
            <UserPlus size={15} /> {t('invite')}
          </button>
        </header>

        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 2fr) minmax(0, 1fr)', gap: '32px', alignItems: 'start' }}>

          {/* ── Left column ── */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>

            {/* Members */}
            <motion.section
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              className="glass-card-level-1" style={{ padding: '32px' }}
            >
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '20px' }}>{t('members.title')}</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {/* Owner (current user) */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 20px', background: 'rgba(0,212,255,0.03)', border: '1px solid rgba(0,212,255,0.15)', borderRadius: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                    <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'linear-gradient(135deg, var(--sovereign-cyan), #00b8d4)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, color: 'var(--sovereign-navy)', fontSize: '1.1rem', boxShadow: '0 0 16px rgba(0,229,255,0.25)' }}>
                      {user?.displayName?.charAt(0).toUpperCase() ?? 'U'}
                    </div>
                    <div>
                      <p style={{ margin: '0 0 2px', fontWeight: 700, fontSize: '1rem', color: 'var(--sovereign-alabaster)' }}>
                        {user?.displayName || 'Du'}
                      </p>
                      <p style={{ margin: 0, fontSize: '0.78rem', color: 'var(--sovereign-slate)' }}>{user?.email}</p>
                    </div>
                  </div>
                  <RoleBadge role="owner" t={t} />
                </div>

                {/* Other members */}
                {members.map((m) => (
                  <div key={m.uid} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 20px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                      <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '1rem', color: 'var(--sovereign-alabaster)' }}>
                        {m.avatarInitial}
                      </div>
                      <div>
                        <p style={{ margin: '0 0 2px', fontWeight: 600, fontSize: '0.95rem', color: 'var(--sovereign-alabaster)' }}>{m.displayName}</p>
                        <p style={{ margin: 0, fontSize: '0.78rem', color: 'var(--sovereign-slate)' }}>{m.email}</p>
                      </div>
                    </div>
                    <RoleBadge role={m.role} t={t} />
                  </div>
                ))}

                {/* Empty state */}
                {members.length === 0 && (
                  <div style={{ textAlign: 'center', padding: '48px 24px', border: '1px dashed rgba(255,255,255,0.1)', borderRadius: '12px', background: 'rgba(255,255,255,0.01)' }}>
                    <Users size={28} color="var(--sovereign-slate)" style={{ margin: '0 auto 12px', opacity: 0.5 }} />
                    <p style={{ color: 'var(--sovereign-alabaster)', fontSize: '1rem', fontWeight: 600, margin: '0 0 6px' }}>
                      {t('members.empty')}
                    </p>
                    <p style={{ color: 'var(--sovereign-slate)', fontSize: '0.85rem', maxWidth: '300px', margin: '0 auto', lineHeight: 1.5 }}>
                      {t('members.emptyDesc')}
                    </p>
                  </div>
                )}
              </div>
            </motion.section>

            {/* Shared Documents */}
            <motion.section
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
              className="glass-card-level-1" style={{ padding: '32px' }}
            >
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <FileText size={16} color="var(--sovereign-cyan)" />
                {t('sharedDocs.title')}
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {sharedDocs.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '36px', color: 'var(--sovereign-slate)', fontSize: '0.88rem' }}>
                    <Share2 size={24} style={{ margin: '0 auto 10px', opacity: 0.4 }} />
                    <p style={{ margin: '0 0 4px', fontWeight: 600, color: 'var(--sovereign-alabaster)' }}>{t('sharedDocs.empty')}</p>
                    <p style={{ margin: 0 }}>{t('sharedDocs.emptyDesc')}</p>
                  </div>
                ) : sharedDocs.map((doc) => (
                  <div key={doc.id}>
                    <button
                      onClick={() => setExpandedDocId(expandedDocId === doc.id ? null : doc.id)}
                      style={{ width: '100%', background: 'none', border: '1px solid rgba(255,255,255,0.06)', cursor: 'pointer', padding: '14px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'inherit', textAlign: 'left' }}
                    >
                      <div>
                        <p style={{ margin: '0 0 3px', fontWeight: 600, fontSize: '0.92rem', color: 'var(--sovereign-alabaster)' }}>{doc.title}</p>
                        <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--sovereign-slate)' }}>
                          {doc.type} · {t('sharedDocs.sharedWith', { count: doc.sharedWith })}
                        </p>
                      </div>
                      {expandedDocId === doc.id ? <ChevronUp size={15} color="var(--sovereign-slate)" /> : <ChevronDown size={15} color="var(--sovereign-slate)" />}
                    </button>
                    <AnimatePresence>
                      {expandedDocId === doc.id && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          style={{ overflow: 'hidden' }}
                        >
                          <div style={{ padding: '12px 16px', background: 'rgba(255,255,255,0.02)', borderTop: '1px solid rgba(255,255,255,0.04)', display: 'flex', justifyContent: 'flex-end' }}>
                            <button className="secondary-button" style={{ fontSize: '0.78rem', padding: '5px 12px', color: 'var(--sovereign-riskred)', borderColor: 'rgba(255,23,68,0.2)' }}>
                              {t('sharedDocs.removeShare')}
                            </button>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))}
              </div>
            </motion.section>

            {/* Delegated Approvals */}
            <motion.section
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
              className="glass-card-level-1" style={{ padding: '32px' }}
            >
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Clock size={16} color="var(--sovereign-purple)" />
                {t('delegated.title')}
              </h3>
              <p style={{ fontSize: '0.83rem', color: 'var(--sovereign-slate)', margin: '0 0 20px', lineHeight: 1.5 }}>
                {t('delegated.desc')}
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {delegated.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '32px', color: 'var(--sovereign-slate)', fontSize: '0.85rem' }}>
                    <p style={{ margin: '0 0 4px', fontWeight: 600, color: 'var(--sovereign-alabaster)' }}>{t('delegated.empty')}</p>
                    <p style={{ margin: 0 }}>{t('delegated.emptyDesc')}</p>
                  </div>
                ) : delegated.map((d) => {
                  const riskColor = d.riskLevel === 'HIGH' ? 'var(--sovereign-riskred)' : d.riskLevel === 'MEDIUM' ? '#f59e0b' : 'var(--sovereign-success)';
                  return (
                    <div key={d.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', padding: '14px 16px', border: `1px solid ${riskColor}20`, background: `${riskColor}06` }}>
                      <div>
                        <p style={{ margin: '0 0 3px', fontWeight: 600, fontSize: '0.9rem', color: 'var(--sovereign-alabaster)' }}>{d.title}</p>
                        <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--sovereign-slate)' }}>
                          {t('delegated.delegatedTo')}: {d.delegatedTo} ·{' '}
                          <span style={{ color: riskColor }}>{d.riskLevel}</span>
                        </p>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
                        <span style={{ fontSize: '0.68rem', fontFamily: 'var(--font-jetbrains, monospace)', color: '#f59e0b', letterSpacing: '0.06em' }}>
                          {t('delegated.pending')}
                        </span>
                        <button className="secondary-button" style={{ fontSize: '0.75rem', padding: '4px 10px', display: 'flex', alignItems: 'center', gap: '5px' }}>
                          <RotateCcw size={11} /> {t('delegated.recall')}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.section>
          </div>

          {/* ── Right column — Shield status ── */}
          <motion.section
            initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.15 }}
            className="glass-card-level-1"
            style={{ padding: '32px', position: 'relative', overflow: 'hidden', top: 0 }}
          >
            <div style={{ position: 'absolute', top: '-30px', left: '-30px', width: '200px', height: '200px', borderRadius: '50%', background: 'var(--sovereign-cyan)', opacity: 0.04, pointerEvents: 'none' }} />
            <div style={{ textAlign: 'center', position: 'relative', zIndex: 1 }}>
              <div style={{ width: '72px', height: '72px', borderRadius: '50%', background: 'rgba(0,229,255,0.06)', border: '1px solid rgba(0,229,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
                <Shield size={36} color="var(--sovereign-cyan)" />
              </div>
              <h3 style={{ fontSize: '1.3rem', fontWeight: 800, marginBottom: '12px', letterSpacing: '-0.02em' }}>
                {t('shield.title')}
              </h3>
              <p style={{ color: 'var(--sovereign-slate)', fontSize: '0.9rem', lineHeight: 1.6, marginBottom: '28px' }}>
                {t('shield.desc')}
              </p>
              <div style={{ padding: '20px', background: 'rgba(16,230,230,0.04)', border: '1px solid rgba(16,230,230,0.1)', textAlign: 'left', marginBottom: '20px' }}>
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '10px' }}>
                  <Share2 size={18} color="var(--sovereign-cyan)" />
                  <span style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--sovereign-alabaster)' }}>
                    {t('shield.sharedAssets', { count: sharedCount })}
                  </span>
                </div>
                <p style={{ margin: 0, fontSize: '0.82rem', color: 'var(--sovereign-slate)', lineHeight: 1.5 }}>
                  {t('shield.sharedAssetsDesc')}
                </p>
              </div>

              {/* Stats */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                {[
                  { label: 'Mitglieder', value: members.length + 1 },
                  { label: 'Geteilt', value: sharedCount },
                  { label: 'Delegiert', value: delegated.length },
                  { label: 'EU AI Act', value: '✓' },
                ].map(({ label, value }) => (
                  <div key={label} style={{ padding: '14px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', textAlign: 'center' }}>
                    <p style={{ margin: '0 0 4px', fontFamily: 'var(--font-jetbrains, monospace)', fontSize: '1.3rem', fontWeight: 700, color: 'var(--sovereign-cyan)' }}>{value}</p>
                    <p style={{ margin: 0, fontSize: '0.7rem', color: 'var(--sovereign-slate)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{label}</p>
                  </div>
                ))}
              </div>
            </div>
          </motion.section>

        </div>
      </div>
    </>
  );
}
