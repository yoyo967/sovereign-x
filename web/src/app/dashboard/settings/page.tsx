'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  User, Sliders, LogOut, CheckCircle2, AlertTriangle, Save,
  CreditCard, Trash2, Shield, ChevronRight, Zap, Bell, Lock,
  Fingerprint, MapPin, Monitor, KeyRound,
} from 'lucide-react';
import { useTranslations } from 'next-intl';
import { api } from '@/lib/api';
import { useRequireAuth } from '@/hooks/useRequireAuth';
import { useRBAC } from '@/hooks/useRBAC';
import { auth } from '@/lib/firebase';
import { signOut } from 'firebase/auth';
import { useRouter } from 'next/navigation';

// ─── Types ────────────────────────────────────────────────────────────────────

interface UserProfile {
  displayName?: string;
  email?: string;
  preferredLanguage?: string;
}

interface BoundaryConditions {
  maxMonthlyFee: number;
  strictPrivacyFilter: boolean;
  requireBiometricsForHighRisk: boolean;
  autoApproveSavingsBelowEur: number;
}

interface NotificationPrefs {
  email: boolean;
  push: boolean;
  digest: boolean;
}

// ─── Toggle Component ─────────────────────────────────────────────────────────

function Toggle({ value, onChange }: { value: boolean; onChange: () => void }) {
  return (
    <button
      role="switch"
      aria-checked={value}
      onClick={onChange}
      style={{
        width: '44px', height: '24px', borderRadius: '12px', border: 'none', cursor: 'pointer',
        background: value ? 'var(--sovereign-cyan)' : 'rgba(255,255,255,0.12)',
        position: 'relative', transition: 'background 0.2s', flexShrink: 0,
      }}
    >
      <div style={{
        width: '18px', height: '18px', borderRadius: '50%',
        background: value ? 'var(--sovereign-obsidian)' : 'rgba(255,255,255,0.5)',
        position: 'absolute', top: '3px',
        left: value ? '23px' : '3px', transition: 'left 0.2s',
      }} />
    </button>
  );
}

// ─── Section Row ─────────────────────────────────────────────────────────────

function SettingRow({
  label, desc, divider = true,
  children,
}: {
  label: string; desc: string; divider?: boolean; children: React.ReactNode;
}) {
  return (
    <div style={{
      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      gap: '1.5rem', paddingBottom: divider ? '24px' : 0,
      borderBottom: divider ? '1px solid rgba(255,255,255,0.06)' : 'none',
    }}>
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ fontWeight: 600, margin: '0 0 5px', fontSize: '1rem', color: 'var(--sovereign-alabaster)' }}>{label}</p>
        <p style={{ fontSize: '0.83rem', color: 'var(--sovereign-slate)', margin: 0, lineHeight: 1.5, maxWidth: '440px' }}>{desc}</p>
      </div>
      <div style={{ flexShrink: 0 }}>{children}</div>
    </div>
  );
}

// ─── Section Header ───────────────────────────────────────────────────────────

function SectionHeader({ icon: Icon, title, color = 'var(--sovereign-cyan)' }: {
  icon: React.ElementType; title: string; color?: string;
}) {
  return (
    <h3 style={{ fontSize: '1.2rem', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '12px', fontWeight: 700 }}>
      <div style={{ padding: '8px', background: `${color}18`, borderRadius: '8px' }}>
        <Icon size={18} color={color} />
      </div>
      {title}
    </h3>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function SettingsPage() {
  const t = useTranslations('dashboard.settings');
  const { user, loading: authLoading } = useRequireAuth();
  const { tier } = useRBAC();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [passkeyRegistered, setPasskeyRegistered] = useState(false);

  const [profile, setProfile] = useState<UserProfile>({ displayName: '', email: '' });
  const [boundary, setBoundary] = useState<BoundaryConditions>({
    maxMonthlyFee: 100,
    strictPrivacyFilter: true,
    requireBiometricsForHighRisk: true,
    autoApproveSavingsBelowEur: 50,
  });
  const [notifs, setNotifs] = useState<NotificationPrefs>({ email: true, push: true, digest: true });

  useEffect(() => {
    if (!user) return;
    async function loadData() {
      try {
        setLoading(true);
        const [profileData, settingsData] = await Promise.all([
          api.user.getProfile().catch(() => ({ displayName: user?.displayName, email: user?.email })),
          api.user.getSettings().catch(() => null),
        ]);
        setProfile(profileData);
        if (settingsData?.boundaryConditions) setBoundary(settingsData.boundaryConditions);
        if (settingsData?.notifications) setNotifs(settingsData.notifications);
        if (settingsData?.passkeyRegistered) setPasskeyRegistered(settingsData.passkeyRegistered);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [user]);

  const handleSave = async () => {
    try {
      setSaving(true);
      await Promise.all([
        api.user.updateProfile({ displayName: profile.displayName || '', preferredLanguage: profile.preferredLanguage || 'de' }),
        api.user.updateSettings({ boundaryConditions: boundary, notifications: notifs }),
      ]);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    if (auth) {
      await signOut(auth);
      router.push('/');
    }
  };

  const handleRegisterPasskey = async () => {
    if (!window.PublicKeyCredential) return;
    try {
      const available = await PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable();
      if (!available) return;
      const cred = await navigator.credentials.create({
        publicKey: {
          challenge: crypto.getRandomValues(new Uint8Array(32)),
          rp: { name: 'Sovereign 2030', id: window.location.hostname },
          user: {
            id: new TextEncoder().encode(user?.uid ?? 'unknown'),
            name: user?.email ?? 'user',
            displayName: user?.displayName ?? 'Sovereign User',
          },
          pubKeyCredParams: [{ type: 'public-key', alg: -7 }],
          authenticatorSelection: { userVerification: 'required', authenticatorAttachment: 'platform' },
          timeout: 60000,
        },
      });
      if (cred) setPasskeyRegistered(true);
    } catch {
      // user cancelled or not available
    }
  };

  if (authLoading) return null;

  const planKey = tier === 'FREE' ? 'citizen' : tier === 'PRO' ? 'nexus' : 'os';
  const planPrice = t(`plan.${planKey}.price`);

  return (
    <div style={{ maxWidth: '900px' }}>
      {/* Header */}
      <header style={{ marginBottom: '40px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: '1rem', flexWrap: 'wrap' }}>
        <div>
          <h1 style={{
            fontSize: '2.5rem', fontWeight: 800, marginBottom: '8px',
            fontFamily: 'var(--font-space-grotesk, sans-serif)', letterSpacing: '-0.03em',
          }}>
            {t('title')}
          </h1>
          <p style={{ color: 'var(--sovereign-slate)', fontSize: '1.05rem', margin: 0 }}>
            {t('subtitle')}
          </p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving || loading}
          className="primary-aura-button"
          style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
        >
          {saving
            ? <div className="sovereign-spinner-small" />
            : saveSuccess
              ? <CheckCircle2 size={16} />
              : <Save size={16} />}
          {saving ? t('saving') : saveSuccess ? t('saved') : t('save')}
        </button>
      </header>

      {loading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="skeleton skeleton-card" style={{ height: '280px' }} />
          ))}
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}
        >
          {/* ── Profile ── */}
          <section className="glass-card-level-1" style={{ padding: '36px' }}>
            <SectionHeader icon={User} title={t('profile.title')} />
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.83rem', color: 'var(--sovereign-slate)', marginBottom: '8px', fontWeight: 600 }}>
                  {t('profile.displayName')}
                </label>
                <input
                  type="text"
                  value={profile?.displayName || ''}
                  onChange={(e) => setProfile({ ...profile, displayName: e.target.value })}
                  className="sovereign-input"
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.83rem', color: 'var(--sovereign-slate)', marginBottom: '8px', fontWeight: 600 }}>
                  {t('profile.email')}
                </label>
                <input
                  type="email"
                  value={profile?.email || user?.email || ''}
                  disabled
                  className="sovereign-input"
                  style={{ opacity: 0.5, cursor: 'not-allowed' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.83rem', color: 'var(--sovereign-slate)', marginBottom: '8px', fontWeight: 600 }}>
                  {t('profile.language')}
                </label>
                <select
                  className="sovereign-input"
                  value={profile?.preferredLanguage || 'de'}
                  onChange={(e) => setProfile({ ...profile, preferredLanguage: e.target.value })}
                  style={{ appearance: 'none' }}
                >
                  <option value="de">{t('profile.langDe')}</option>
                  <option value="en">{t('profile.langEn')}</option>
                </select>
              </div>
            </div>
          </section>

          {/* ── Subscription ── */}
          <section className="glass-card-level-1" style={{ padding: '36px' }}>
            <SectionHeader icon={CreditCard} title={t('plan.title')} />

            {/* Current Plan Banner */}
            <div style={{
              display: 'grid', gridTemplateColumns: '1fr auto', gap: '1.5rem',
              alignItems: 'center', padding: '1.25rem',
              background: 'rgba(0,212,255,0.04)', border: '1px solid rgba(0,212,255,0.15)',
              marginBottom: '1.5rem',
            }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.4rem' }}>
                  <Zap size={13} color="var(--sovereign-cyan)" />
                  <span style={{
                    fontFamily: 'var(--font-jetbrains, monospace)', fontSize: '0.6rem',
                    letterSpacing: '0.12em', color: 'rgba(0,212,255,0.7)', textTransform: 'uppercase',
                  }}>
                    {t('plan.current')}
                  </span>
                </div>
                <p style={{ fontFamily: 'var(--font-space-grotesk, sans-serif)', fontWeight: 800, fontSize: '1.25rem', color: 'var(--sovereign-alabaster)', margin: '0 0 0.3rem', letterSpacing: '-0.02em' }}>
                  SOVEREIGN {t(`plan.${planKey}.name`)}
                </p>
                <p style={{ fontSize: '0.82rem', color: 'var(--sovereign-slate)', margin: 0 }}>
                  {planPrice} / Monat · {t('plan.nextBilling', { date: '01.05.2026' })}
                </p>
              </div>
              <button className="secondary-button" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', whiteSpace: 'nowrap' }}>
                {t('plan.upgrade')} <ChevronRight size={14} />
              </button>
            </div>

            {/* Plan Comparison Grid */}
            <div style={{
              display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1px',
              background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.06)',
              marginBottom: '1.5rem',
            }}>
              {(['citizen', 'nexus', 'os'] as const).map((key) => {
                const isCurrent = planKey === key;
                return (
                  <div key={key} style={{ padding: '1.25rem', background: isCurrent ? 'rgba(0,212,255,0.04)' : '#0D1929', position: 'relative' }}>
                    {isCurrent && (
                      <span style={{
                        position: 'absolute', top: '0.75rem', right: '0.75rem',
                        fontFamily: 'var(--font-jetbrains, monospace)', fontSize: '0.5rem',
                        letterSpacing: '0.08em', color: 'rgba(0,212,255,0.7)',
                        border: '1px solid rgba(0,212,255,0.25)', padding: '2px 6px',
                      }}>
                        {t('plan.active')}
                      </span>
                    )}
                    <p style={{ fontWeight: 700, fontSize: '0.92rem', color: 'var(--sovereign-alabaster)', margin: '0 0 0.2rem' }}>
                      {t(`plan.${key}.name`)}
                    </p>
                    <p style={{ fontFamily: 'var(--font-jetbrains, monospace)', fontSize: '0.82rem', color: 'rgba(0,212,255,0.8)', margin: '0 0 0.75rem' }}>
                      {t(`plan.${key}.price`)}/mo
                    </p>
                    <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                      {(['f1', 'f2', 'f3'] as const).map((f) => (
                        <li key={f} style={{ fontSize: '0.75rem', color: 'var(--sovereign-slate)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                          <Shield size={9} color="rgba(0,212,255,0.4)" /> {t(`plan.${key}.${f}`)}
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              })}
            </div>
            <p style={{ fontSize: '0.78rem', color: 'var(--sovereign-slate)', margin: 0, lineHeight: 1.55 }}>
              {t('plan.note')}
            </p>
          </section>

          {/* ── Boundary Conditions ── */}
          <section className="glass-card-level-1" style={{ padding: '36px', border: '1px solid rgba(0,229,255,0.2)', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: '-40px', right: '-40px', width: '200px', height: '200px', borderRadius: '50%', background: 'var(--sovereign-cyan)', opacity: 0.03, pointerEvents: 'none' }} />
            <SectionHeader icon={Sliders} title={t('boundary.title')} />
            <p style={{ fontSize: '0.93rem', color: 'var(--sovereign-slate)', marginBottom: '32px', maxWidth: '600px', lineHeight: 1.55 }}>
              {t('boundary.desc')}
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '28px', position: 'relative', zIndex: 1 }}>
              <SettingRow label={t('boundary.autoApproveLabel')} desc={t('boundary.autoApproveDesc')}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontWeight: 700 }}>€</span>
                  <input
                    type="number"
                    value={boundary.autoApproveSavingsBelowEur}
                    onChange={(e) => setBoundary({ ...boundary, autoApproveSavingsBelowEur: Number(e.target.value) })}
                    className="sovereign-input"
                    style={{ width: '90px', textAlign: 'center' }}
                  />
                </div>
              </SettingRow>
              <SettingRow label={t('boundary.maxFeeLabel')} desc={t('boundary.maxFeeDesc')}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontWeight: 700 }}>€</span>
                  <input
                    type="number"
                    value={boundary.maxMonthlyFee}
                    onChange={(e) => setBoundary({ ...boundary, maxMonthlyFee: Number(e.target.value) })}
                    className="sovereign-input"
                    style={{ width: '90px', textAlign: 'center' }}
                  />
                </div>
              </SettingRow>
              <SettingRow label={t('boundary.privacyLabel')} desc={t('boundary.privacyDesc')}>
                <Toggle value={boundary.strictPrivacyFilter} onChange={() => setBoundary({ ...boundary, strictPrivacyFilter: !boundary.strictPrivacyFilter })} />
              </SettingRow>
              <SettingRow label={t('boundary.biometricLabel')} desc={t('boundary.biometricDesc')} divider={false}>
                <Toggle value={boundary.requireBiometricsForHighRisk} onChange={() => setBoundary({ ...boundary, requireBiometricsForHighRisk: !boundary.requireBiometricsForHighRisk })} />
              </SettingRow>
            </div>
          </section>

          {/* ── Notifications ── */}
          <section className="glass-card-level-1" style={{ padding: '36px' }}>
            <SectionHeader icon={Bell} title={t('notifications.title')} />
            <p style={{ fontSize: '0.93rem', color: 'var(--sovereign-slate)', marginBottom: '28px', lineHeight: 1.5 }}>
              {t('notifications.desc')}
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <SettingRow label={t('notifications.emailLabel')} desc={t('notifications.emailDesc')}>
                <Toggle value={notifs.email} onChange={() => setNotifs({ ...notifs, email: !notifs.email })} />
              </SettingRow>
              <SettingRow label={t('notifications.pushLabel')} desc={t('notifications.pushDesc')}>
                <Toggle value={notifs.push} onChange={() => setNotifs({ ...notifs, push: !notifs.push })} />
              </SettingRow>
              <SettingRow label={t('notifications.digestLabel')} desc={t('notifications.digestDesc')} divider={false}>
                <Toggle value={notifs.digest} onChange={() => setNotifs({ ...notifs, digest: !notifs.digest })} />
              </SettingRow>
            </div>
          </section>

          {/* ── Security & Passkeys ── */}
          <section className="glass-card-level-1" style={{ padding: '36px' }}>
            <SectionHeader icon={Lock} title={t('security.title')} />
            <p style={{ fontSize: '0.93rem', color: 'var(--sovereign-slate)', marginBottom: '28px', lineHeight: 1.5 }}>
              {t('security.desc')}
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              {/* Passkey row */}
              <SettingRow label={t('security.passkeyLabel')} desc={t('security.passkeyDesc')}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{
                    fontSize: '0.72rem', fontFamily: 'var(--font-jetbrains, monospace)',
                    letterSpacing: '0.06em', padding: '3px 8px',
                    background: passkeyRegistered ? 'rgba(0,212,255,0.1)' : 'rgba(255,255,255,0.06)',
                    color: passkeyRegistered ? 'var(--sovereign-cyan)' : 'var(--sovereign-slate)',
                    border: `1px solid ${passkeyRegistered ? 'rgba(0,212,255,0.25)' : 'rgba(255,255,255,0.08)'}`,
                  }}>
                    {passkeyRegistered ? t('security.passkeyRegistered') : t('security.passkeyNotRegistered')}
                  </span>
                  {passkeyRegistered ? (
                    <button className="secondary-button" style={{ padding: '5px 12px', fontSize: '0.78rem' }} onClick={() => setPasskeyRegistered(false)}>
                      {t('security.passkeyRemove')}
                    </button>
                  ) : (
                    <button className="secondary-button" style={{ padding: '5px 12px', fontSize: '0.78rem', display: 'flex', alignItems: 'center', gap: '6px' }} onClick={handleRegisterPasskey}>
                      <Fingerprint size={13} /> {t('security.passkeyRegister')}
                    </button>
                  )}
                </div>
              </SettingRow>

              {/* Data Residency row */}
              <SettingRow label={t('security.residencyLabel')} desc={t('security.residencyDesc')}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <MapPin size={14} color="var(--sovereign-cyan)" />
                  <span style={{
                    fontSize: '0.78rem', fontFamily: 'var(--font-jetbrains, monospace)',
                    color: 'var(--sovereign-cyan)', letterSpacing: '0.06em',
                    padding: '3px 10px', border: '1px solid rgba(0,212,255,0.25)',
                    background: 'rgba(0,212,255,0.06)',
                  }}>
                    {t('security.residencyBadge')}
                  </span>
                </div>
              </SettingRow>

              {/* Active Sessions row */}
              <SettingRow label={t('security.sessionsLabel')} desc={t('security.sessionsDesc')} divider={false}>
                <button className="secondary-button" style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '6px 14px', fontSize: '0.82rem' }}>
                  <Monitor size={13} /> {t('security.sessionsAction')}
                </button>
              </SettingRow>
            </div>
          </section>

          {/* ── Danger Zone ── */}
          <section className="glass-card-level-1" style={{ padding: '36px', border: '1px solid rgba(255,23,68,0.12)' }}>
            <SectionHeader icon={Trash2} title={t('danger.title')} color="var(--sovereign-riskred)" />
            <p style={{ fontSize: '0.87rem', color: 'var(--sovereign-slate)', marginBottom: '1.5rem', lineHeight: 1.6, maxWidth: 560 }}>
              {t('danger.desc')}
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {(
                [
                  { titleKey: 'historyTitle', descKey: 'historyDesc', actionKey: 'historyAction', danger: false },
                  { titleKey: 'contractsTitle', descKey: 'contractsDesc', actionKey: 'contractsAction', danger: false },
                  { titleKey: 'accountTitle', descKey: 'accountDesc', actionKey: 'accountAction', danger: true },
                ] as const
              ).map(({ titleKey, descKey, actionKey, danger }) => (
                <div
                  key={titleKey}
                  style={{
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    gap: '1rem', padding: '1rem 1.25rem',
                    border: `1px solid ${danger ? 'rgba(255,23,68,0.15)' : 'rgba(255,255,255,0.06)'}`,
                    background: danger ? 'rgba(255,23,68,0.03)' : 'transparent',
                  }}
                >
                  <div>
                    <p style={{ fontWeight: 600, fontSize: '0.9rem', color: danger ? 'rgba(255,100,100,0.9)' : 'var(--sovereign-alabaster)', margin: '0 0 0.25rem' }}>
                      {t(`danger.${titleKey}`)}
                    </p>
                    <p style={{ fontSize: '0.77rem', color: 'var(--sovereign-slate)', margin: 0, lineHeight: 1.5, maxWidth: 440 }}>
                      {t(`danger.${descKey}`)}
                    </p>
                  </div>
                  <button
                    className="secondary-button"
                    style={{
                      whiteSpace: 'nowrap', flexShrink: 0,
                      ...(danger ? { borderColor: 'rgba(255,23,68,0.3)', color: 'var(--sovereign-riskred)' } : {}),
                    }}
                  >
                    {t(`danger.${actionKey}`)}
                  </button>
                </div>
              ))}
            </div>
          </section>

          {/* ── Kill Switch ── */}
          <section style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            gap: '1.5rem', padding: '1.5rem 2rem',
            background: 'rgba(255,23,68,0.04)', border: '1px solid rgba(255,23,68,0.2)',
            flexWrap: 'wrap',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{
                width: '46px', height: '46px', borderRadius: '50%',
                background: 'rgba(255,23,68,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <AlertTriangle size={22} color="var(--sovereign-riskred)" />
              </div>
              <div>
                <h4 style={{ margin: '0 0 4px', fontSize: '1.05rem', color: 'var(--sovereign-riskred)', fontWeight: 700 }}>
                  {t('killSwitch.title')}
                </h4>
                <p style={{ fontSize: '0.83rem', color: 'var(--sovereign-slate)', margin: 0 }}>
                  {t('killSwitch.desc')}
                </p>
              </div>
            </div>
            <button
              className="primary-aura-button"
              style={{ background: 'var(--sovereign-riskred)', boxShadow: '0 0 20px rgba(255,23,68,0.35)', color: 'white', display: 'flex', alignItems: 'center', gap: '8px' }}
              onClick={() => {
                if (window.confirm(t('killSwitch.title') + ' — ' + t('killSwitch.desc'))) {
                  // handled by AI page kill-switch state; here just confirmation
                }
              }}
            >
              <KeyRound size={15} /> {t('killSwitch.action')}
            </button>
          </section>

          {/* ── Logout ── */}
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: '8px' }}>
            <button
              onClick={handleLogout}
              className="secondary-button"
              style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 36px' }}
            >
              <LogOut size={15} /> {t('logout')}
            </button>
          </div>

        </motion.div>
      )}
    </div>
  );
}
