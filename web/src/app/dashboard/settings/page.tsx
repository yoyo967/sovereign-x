'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { api } from '@/lib/api';
import { useRBAC } from '@/hooks/useRBAC';
import { useTerminalStore } from '@/stores/terminalStore';
import { SovereignCard } from '@/components/ui/SovereignCard';
import { SkeletonLoader } from '@/components/ui/SkeletonLoader';
import { KillSwitchToggle } from '@/components/ui/KillSwitchToggle';

// ─── Types ────────────────────────────────────────────────────────────────────

interface Profile {
  displayName?: string;
  email?: string;
  locale?: string;
}

interface NotifSettings {
  pushEnabled: boolean;
  emailEnabled: boolean;
  digestEnabled: boolean;
  alertThresholdEur: number;
}

type Tab = 'profil' | 'plan' | 'sicherheit' | 'benachrichtigungen' | 'boundaries';

const TABS: { key: Tab; label: string }[] = [
  { key: 'profil', label: 'Profil' },
  { key: 'plan', label: 'Plan & Billing' },
  { key: 'sicherheit', label: 'Sicherheit' },
  { key: 'benachrichtigungen', label: 'Benachrichtigungen' },
  { key: 'boundaries', label: 'Boundary Conditions' },
];

const PLAN_FEATURES: Record<string, string[]> = {
  FREE: ['3 Verträge', '1 Case', '10 KI-Chats/Monat', 'Basis-Analyse'],
  PRO: ['Unbegrenzte Verträge', '10 Cases', '100 KI-Chats/Monat', 'Erweiterte Analyse', 'CSV-Export'],
  SHIELD: ['Alles aus PRO', 'Family Vault', 'Voice & Vision KI', 'finAPI PSD2', 'Priority Support'],
};

const PLAN_COLORS: Record<string, string> = { FREE: '#888', PRO: '#BB86FC', SHIELD: '#03DAC6' };

// ─── Toggle Helper ────────────────────────────────────────────────────────────

function Toggle({ label, desc, value, onChange }: { label: string; desc?: string; value: boolean; onChange: (v: boolean) => void }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid var(--s-divider)' }}>
      <div>
        <p style={{ margin: '0 0 2px', fontSize: '0.88rem', fontWeight: 600 }}>{label}</p>
        {desc && <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--s-text-faint)' }}>{desc}</p>}
      </div>
      <button onClick={() => onChange(!value)} style={{
        width: 44, height: 24, borderRadius: 12, border: 'none', cursor: 'pointer', transition: 'background 0.2s',
        background: value ? '#BB86FC' : 'rgba(255,255,255,0.1)', position: 'relative', flexShrink: 0,
      }}>
        <motion.div animate={{ x: value ? 22 : 2 }} transition={{ type: 'spring', stiffness: 400, damping: 25 }}
          style={{ position: 'absolute', top: 3, left: 0, width: 18, height: 18, borderRadius: '50%', background: '#fff' }} />
      </button>
    </div>
  );
}

// ─── Profil Tab ───────────────────────────────────────────────────────────────

function ProfilTab() {
  const [profile, setProfile] = useState<Profile>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [name, setName] = useState('');
  const [locale, setLocale] = useState('de');

  useEffect(() => {
    api.user.getProfile().then((p: Profile | null) => {
      setProfile(p ?? {});
      setName(p?.displayName ?? '');
      setLocale(p?.locale ?? 'de');
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      await api.user.updateProfile({ displayName: name, locale });
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <SkeletonLoader variant="text" count={3} />;

  const initials = (name || profile.email || '?').slice(0, 2).toUpperCase();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'linear-gradient(135deg, rgba(187,134,252,0.3), rgba(3,218,198,0.2))', border: '2px solid rgba(187,134,252,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem', fontWeight: 800, color: '#BB86FC' }}>
          {initials}
        </div>
        <div>
          <p style={{ margin: '0 0 2px', fontWeight: 700, fontSize: '1rem' }}>{name || '—'}</p>
          <p style={{ margin: 0, fontSize: '0.78rem', color: 'var(--s-text-faint)' }}>{profile.email}</p>
        </div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        <div>
          <label style={{ display: 'block', fontSize: '0.72rem', color: 'var(--s-text-faint)', marginBottom: '6px', fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Anzeigename</label>
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Dein Name"
            style={{ width: '100%', padding: '10px 14px', borderRadius: 8, background: 'rgba(255,255,255,0.04)', border: '1px solid var(--s-divider)', color: 'var(--s-text)', fontSize: '0.9rem', outline: 'none', boxSizing: 'border-box' }} />
        </div>
        <div>
          <label style={{ display: 'block', fontSize: '0.72rem', color: 'var(--s-text-faint)', marginBottom: '6px', fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>E-Mail</label>
          <input value={profile.email ?? ''} disabled
            style={{ width: '100%', padding: '10px 14px', borderRadius: 8, background: 'rgba(255,255,255,0.02)', border: '1px solid var(--s-divider)', color: 'var(--s-text-faint)', fontSize: '0.9rem', boxSizing: 'border-box', cursor: 'not-allowed' }} />
        </div>
        <div>
          <label style={{ display: 'block', fontSize: '0.72rem', color: 'var(--s-text-faint)', marginBottom: '6px', fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Sprache</label>
          <select value={locale} onChange={(e) => setLocale(e.target.value)}
            style={{ width: '100%', padding: '10px 14px', borderRadius: 8, background: 'rgba(255,255,255,0.04)', border: '1px solid var(--s-divider)', color: 'var(--s-text)', fontSize: '0.9rem', outline: 'none', boxSizing: 'border-box' }}>
            <option value="de">Deutsch</option>
            <option value="en">English</option>
          </select>
        </div>
        <button onClick={handleSave} disabled={saving}
          style={{ alignSelf: 'flex-start', padding: '10px 24px', borderRadius: 10, background: saved ? '#00E676' : 'var(--sovereign-purple)', border: 'none', color: saved ? '#000' : '#fff', fontSize: '0.88rem', fontWeight: 700, cursor: saving ? 'not-allowed' : 'pointer', transition: 'background 0.2s', opacity: saving ? 0.7 : 1 }}>
          {saved ? '✓ Gespeichert' : saving ? 'Speichern…' : 'Änderungen speichern'}
        </button>
      </div>
    </div>
  );
}

// ─── Plan Tab ─────────────────────────────────────────────────────────────────

function PlanTab() {
  const { tier } = useRBAC();
  const currentTier = (tier ?? 'FREE').toUpperCase();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px' }}>
        {(['FREE', 'PRO', 'SHIELD'] as const).map((plan) => {
          const isCurrent = currentTier === plan;
          return (
            <SovereignCard key={plan} variant={isCurrent ? 'elevated' : 'glass'} glow={isCurrent} animate={false}>
              <div style={{ marginBottom: '10px' }}>
                <span style={{ fontSize: '0.65rem', fontFamily: 'var(--font-mono)', color: PLAN_COLORS[plan], letterSpacing: '0.1em', textTransform: 'uppercase' }}>{plan}</span>
                {isCurrent && <span style={{ marginLeft: '8px', fontSize: '0.6rem', padding: '1px 6px', borderRadius: 10, background: `${PLAN_COLORS[plan]}20`, color: PLAN_COLORS[plan], border: `1px solid ${PLAN_COLORS[plan]}40` }}>Aktiv</span>}
              </div>
              <ul style={{ margin: '0 0 12px', padding: '0 0 0 14px', fontSize: '0.75rem', color: 'var(--s-text-muted)', lineHeight: 1.8 }}>
                {PLAN_FEATURES[plan].map((f) => <li key={f}>{f}</li>)}
              </ul>
              {!isCurrent && (
                <button style={{ width: '100%', padding: '7px', borderRadius: 8, background: `${PLAN_COLORS[plan]}15`, border: `1px solid ${PLAN_COLORS[plan]}40`, color: PLAN_COLORS[plan], fontSize: '0.78rem', fontWeight: 700, cursor: 'pointer' }}>
                  Upgrade auf {plan}
                </button>
              )}
            </SovereignCard>
          );
        })}
      </div>
      <SovereignCard variant="glass" animate={false}>
        <p style={{ margin: '0 0 12px', fontSize: '0.7rem', fontFamily: 'var(--font-mono)', color: 'var(--s-text-faint)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Nutzung diesen Monat</p>
        {[
          { label: 'Verträge', used: 2, max: currentTier === 'FREE' ? 3 : null, color: '#BB86FC' },
          { label: 'Cases', used: 1, max: currentTier === 'FREE' ? 1 : currentTier === 'PRO' ? 10 : null, color: '#03DAC6' },
          { label: 'KI-Chats', used: 8, max: currentTier === 'FREE' ? 10 : currentTier === 'PRO' ? 100 : null, color: '#FFD600' },
        ].map(({ label, used, max, color }) => (
          <div key={label} style={{ marginBottom: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
              <span style={{ fontSize: '0.78rem', color: 'var(--s-text-muted)' }}>{label}</span>
              <span style={{ fontSize: '0.73rem', fontFamily: 'var(--font-mono)', color }}>{used}{max != null ? ` / ${max}` : ''}</span>
            </div>
            {max != null && (
              <div style={{ height: 4, borderRadius: 2, background: 'rgba(255,255,255,0.06)', overflow: 'hidden' }}>
                <motion.div initial={{ width: 0 }} animate={{ width: `${Math.min(100, (used / max) * 100)}%` }} transition={{ duration: 0.8 }}
                  style={{ height: '100%', background: color, borderRadius: 2 }} />
              </div>
            )}
          </div>
        ))}
      </SovereignCard>
    </div>
  );
}

// ─── Sicherheit Tab ───────────────────────────────────────────────────────────

function SicherheitTab() {
  const { killSwitchActive, setKillSwitch } = useTerminalStore();
  const [passkeys, setPasskeys] = useState<string[]>([]);
  const [registeringPasskey, setRegisteringPasskey] = useState(false);

  const handleRegisterPasskey = async () => {
    setRegisteringPasskey(true);
    try {
      await new Promise((r) => setTimeout(r, 800));
      setPasskeys((prev) => [...prev, `Passkey ${new Date().toLocaleDateString('de-DE')}`]);
    } finally {
      setRegisteringPasskey(false);
    }
  };

  const handleExportData = () => {
    const data = { exportedAt: new Date().toISOString(), note: 'DSGVO Art. 20 — Datenportabilität' };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'sovereign-daten-export.json'; a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <SovereignCard variant={killSwitchActive ? 'danger' : 'default'} animate={false}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <p style={{ margin: '0 0 4px', fontWeight: 700 }}>KI Kill-Switch</p>
            <p style={{ margin: 0, fontSize: '0.78rem', color: 'var(--s-text-muted)' }}>Stoppt sofort alle autonomen KI-Aktionen</p>
          </div>
          <KillSwitchToggle active={killSwitchActive} onToggle={setKillSwitch} />
        </div>
      </SovereignCard>
      <SovereignCard variant="default" animate={false}>
        <p style={{ margin: '0 0 12px', fontSize: '0.7rem', fontFamily: 'var(--font-mono)', color: 'var(--s-text-faint)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Passkeys / FIDO2</p>
        {passkeys.length === 0 ? (
          <p style={{ fontSize: '0.82rem', color: 'var(--s-text-faint)', margin: '0 0 12px' }}>Kein Passkey registriert.</p>
        ) : (
          passkeys.map((pk, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid var(--s-divider)' }}>
              <p style={{ margin: 0, fontSize: '0.85rem' }}>🔑 {pk}</p>
              <button onClick={() => setPasskeys((prev) => prev.filter((_, j) => j !== i))}
                style={{ background: 'none', border: 'none', color: 'var(--sovereign-riskred)', cursor: 'pointer', fontSize: '0.75rem' }}>Entfernen</button>
            </div>
          ))
        )}
        <button onClick={handleRegisterPasskey} disabled={registeringPasskey}
          style={{ marginTop: '12px', padding: '8px 16px', borderRadius: 8, background: 'rgba(187,134,252,0.1)', border: '1px solid rgba(187,134,252,0.3)', color: '#BB86FC', fontSize: '0.82rem', fontWeight: 700, cursor: registeringPasskey ? 'not-allowed' : 'pointer', opacity: registeringPasskey ? 0.7 : 1 }}>
          {registeringPasskey ? 'Registriere…' : '+ Passkey registrieren'}
        </button>
      </SovereignCard>
      <SovereignCard variant="glass" animate={false}>
        <p style={{ margin: '0 0 6px', fontWeight: 700 }}>Daten-Export (DSGVO Art. 20)</p>
        <p style={{ margin: '0 0 12px', fontSize: '0.78rem', color: 'var(--s-text-muted)' }}>Exportiere alle deine gespeicherten Daten als JSON-Datei.</p>
        <button onClick={handleExportData}
          style={{ padding: '8px 16px', borderRadius: 8, background: 'rgba(3,218,198,0.1)', border: '1px solid rgba(3,218,198,0.3)', color: '#03DAC6', fontSize: '0.82rem', fontWeight: 700, cursor: 'pointer' }}>
          Daten exportieren
        </button>
      </SovereignCard>
    </div>
  );
}

// ─── Benachrichtigungen Tab ───────────────────────────────────────────────────

function BenachrichtigungenTab() {
  const [notif, setNotif] = useState<NotifSettings>({ pushEnabled: true, emailEnabled: true, digestEnabled: false, alertThresholdEur: 100 });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      await api.user.updateSettings({ notifications: notif });
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <SovereignCard variant="default" animate={false}>
        <Toggle label="Push-Benachrichtigungen" desc="Echtzeit-Alerts auf diesem Gerät" value={notif.pushEnabled} onChange={(v) => setNotif({ ...notif, pushEnabled: v })} />
        <Toggle label="E-Mail-Benachrichtigungen" desc="Wichtige Aktionen per E-Mail" value={notif.emailEnabled} onChange={(v) => setNotif({ ...notif, emailEnabled: v })} />
        <Toggle label="Wöchentlicher Digest" desc="Zusammenfassung jeden Montag" value={notif.digestEnabled} onChange={(v) => setNotif({ ...notif, digestEnabled: v })} />
        <div style={{ paddingTop: '14px', marginTop: '4px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
            <label style={{ fontSize: '0.82rem', fontWeight: 600 }}>Alert-Schwellenwert</label>
            <span style={{ fontSize: '0.78rem', fontFamily: 'var(--font-mono)', color: '#FFD600' }}>€{notif.alertThresholdEur}</span>
          </div>
          <p style={{ margin: '0 0 8px', fontSize: '0.72rem', color: 'var(--s-text-faint)' }}>Benachrichtige mich bei Ausgaben über diesem Betrag</p>
          <input type="range" min={0} max={1000} step={10} value={notif.alertThresholdEur}
            onChange={(e) => setNotif({ ...notif, alertThresholdEur: Number(e.target.value) })}
            style={{ width: '100%', accentColor: '#FFD600' }} />
        </div>
      </SovereignCard>
      <button onClick={handleSave} disabled={saving}
        style={{ alignSelf: 'flex-start', padding: '10px 24px', borderRadius: 10, background: saved ? '#00E676' : 'var(--sovereign-purple)', border: 'none', color: saved ? '#000' : '#fff', fontSize: '0.88rem', fontWeight: 700, cursor: saving ? 'not-allowed' : 'pointer', transition: 'background 0.2s' }}>
        {saved ? '✓ Gespeichert' : saving ? 'Speichern…' : 'Einstellungen speichern'}
      </button>
    </div>
  );
}

// ─── Boundaries Tab ───────────────────────────────────────────────────────────

function BoundariesTab() {
  const { boundaryConditions, setBoundaryConditions } = useTerminalStore();
  const bc = boundaryConditions;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <SovereignCard variant="glass" animate={false}>
        <p style={{ margin: '0 0 4px', fontWeight: 700 }}>KI-Grenzwerte</p>
        <p style={{ margin: '0 0 16px', fontSize: '0.78rem', color: 'var(--s-text-muted)' }}>Definiere die Grenzen für autonome KI-Aktionen. Änderungen gelten sofort im Terminal.</p>
        <div style={{ marginBottom: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
            <label style={{ fontSize: '0.82rem', fontWeight: 600 }}>Maximale Ausgabe pro Aktion</label>
            <span style={{ fontFamily: 'var(--font-mono)', color: '#BB86FC', fontSize: '0.82rem' }}>€{bc.maxOutputEur}</span>
          </div>
          <input type="range" min={0} max={5000} step={50} value={bc.maxOutputEur}
            onChange={(e) => setBoundaryConditions({ maxOutputEur: Number(e.target.value) })}
            style={{ width: '100%', accentColor: '#BB86FC' }} />
        </div>
        <div style={{ marginBottom: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
            <label style={{ fontSize: '0.82rem', fontWeight: 600 }}>Auto-Approve-Limit</label>
            <span style={{ fontFamily: 'var(--font-mono)', color: '#03DAC6', fontSize: '0.82rem' }}>€{bc.autoApproveThresholdEur}</span>
          </div>
          <p style={{ margin: '0 0 8px', fontSize: '0.72rem', color: 'var(--s-text-faint)' }}>Aktionen unter diesem Betrag werden ohne manuelle Bestätigung ausgeführt</p>
          <input type="range" min={0} max={500} step={10} value={bc.autoApproveThresholdEur}
            onChange={(e) => setBoundaryConditions({ autoApproveThresholdEur: Number(e.target.value) })}
            style={{ width: '100%', accentColor: '#03DAC6' }} />
        </div>
        <div style={{ marginBottom: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
            <label style={{ fontSize: '0.82rem', fontWeight: 600 }}>Mindestkonfidenz</label>
            <span style={{ fontFamily: 'var(--font-mono)', color: '#FFD600', fontSize: '0.82rem' }}>{(bc.confidenceThreshold * 100).toFixed(0)}%</span>
          </div>
          <p style={{ margin: '0 0 8px', fontSize: '0.72rem', color: 'var(--s-text-faint)' }}>KI-Aktionen unterhalb dieser Konfidenz erfordern manuelle Prüfung</p>
          <input type="range" min={0} max={1} step={0.05} value={bc.confidenceThreshold}
            onChange={(e) => setBoundaryConditions({ confidenceThreshold: Number(e.target.value) })}
            style={{ width: '100%', accentColor: '#FFD600' }} />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', paddingTop: '10px', borderTop: '1px solid var(--s-divider)' }}>
          {([
            { label: 'Biometrie für HIGH-Risk-Aktionen', key: 'biometricForHighRisk' as const },
            { label: 'Strikter Privacy-Filter', key: 'strictPrivacyFilter' as const },
          ]).map(({ label, key }) => (
            <div key={key} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '0.85rem' }}>{label}</span>
              <button onClick={() => setBoundaryConditions({ [key]: !bc[key] })} style={{
                width: 44, height: 24, borderRadius: 12, border: 'none', cursor: 'pointer', transition: 'background 0.2s',
                background: bc[key] ? '#00E676' : 'rgba(255,255,255,0.1)', position: 'relative', flexShrink: 0,
              }}>
                <motion.div animate={{ x: bc[key] ? 22 : 2 }} transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                  style={{ position: 'absolute', top: 3, left: 0, width: 18, height: 18, borderRadius: '50%', background: '#fff' }} />
              </button>
            </div>
          ))}
        </div>
      </SovereignCard>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<Tab>('profil');

  const TAB_CONTENT: Record<Tab, React.ReactNode> = {
    profil: <ProfilTab />,
    plan: <PlanTab />,
    sicherheit: <SicherheitTab />,
    benachrichtigungen: <BenachrichtigungenTab />,
    boundaries: <BoundariesTab />,
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', maxWidth: 720, margin: '0 auto' }}>
      <div>
        <h1 style={{ margin: '0 0 4px', fontSize: '1.6rem', fontWeight: 800, letterSpacing: '-0.03em' }}>Einstellungen</h1>
        <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--s-text-muted)' }}>Profil, Plan, Sicherheit und KI-Grenzwerte</p>
      </div>
      <div style={{ display: 'flex', gap: '4px', borderBottom: '1px solid var(--s-divider)', overflowX: 'auto' }}>
        {TABS.map(({ key, label }) => (
          <button key={key} onClick={() => setActiveTab(key)} style={{
            padding: '8px 16px', background: 'none', border: 'none', whiteSpace: 'nowrap',
            borderBottom: `2px solid ${activeTab === key ? 'var(--sovereign-purple)' : 'transparent'}`,
            color: activeTab === key ? '#BB86FC' : 'var(--s-text-muted)',
            fontSize: '0.85rem', fontWeight: activeTab === key ? 700 : 400,
            cursor: 'pointer', transition: 'all 0.15s',
          }}>{label}</button>
        ))}
      </div>
      <AnimatePresence mode="wait">
        <motion.div key={activeTab} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
          {TAB_CONTENT[activeTab]}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
