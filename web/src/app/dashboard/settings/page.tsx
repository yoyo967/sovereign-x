'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User, Sliders, LogOut, CheckCircle2, AlertTriangle, Save, CreditCard, Trash2, Shield, ChevronRight, Zap } from 'lucide-react';
import { api } from '@/lib/api';
import { useRequireAuth } from '@/hooks/useRequireAuth';
import { auth } from '@/lib/firebase';
import { signOut } from 'firebase/auth';
import { useRouter } from 'next/navigation';

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

export default function SettingsPage() {
  const { user, loading: authLoading } = useRequireAuth();
  const router = useRouter();
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  
  const [profile, setProfile] = useState<UserProfile>({ displayName: '', email: '' });
  const [boundary, setBoundary] = useState<BoundaryConditions>({ 
    maxMonthlyFee: 0,
    strictPrivacyFilter: true,
    requireBiometricsForHighRisk: true,
    autoApproveSavingsBelowEur: 50
  });

  useEffect(() => {
    if (!user) return;
    async function loadData() {
      try {
        setLoading(true);
        const [profileData, settingsData] = await Promise.all([
          api.user.getProfile().catch(() => ({ displayName: user?.displayName, email: user?.email })),
          api.user.getSettings().catch(() => null)
        ]);
        
        setProfile(profileData);
        if (settingsData && settingsData.boundaryConditions) {
          setBoundary(settingsData.boundaryConditions);
        }
      } catch (err) {
        console.error('Failed to load settings:', err);
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
        api.user.updateSettings({ boundaryConditions: boundary })
      ]);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    try {
      if (auth) {
        await signOut(auth);
        router.push('/');
      }
    } catch (err) {
      console.error('Failed to log out', err);
    }
  };

  if (authLoading) return null;

  return (
    <div style={{ maxWidth: '900px' }}>
      <header style={{ marginBottom: '40px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <h1 style={{ 
            fontSize: '2.5rem', fontWeight: 800, marginBottom: '8px',
            fontFamily: 'var(--font-space-grotesk, sans-serif)', letterSpacing: '-0.03em'
          }}>
            System Settings
          </h1>
          <p style={{ color: 'var(--sovereign-slate)', fontSize: '1.05rem', margin: 0 }}>
            Konfiguration des Life-OS und Steuerung der autonomen Boundary Conditions.
          </p>
        </div>
        <button 
          onClick={handleSave} 
          disabled={saving || loading}
          className="primary-aura-button" 
          style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
        >
          {saving ? <div className="sovereign-spinner-small" /> : saveSuccess ? <CheckCircle2 size={16} /> : <Save size={16} />}
          {saving ? 'Speichern...' : saveSuccess ? 'Gespeichert' : 'Änderungen speichern'}
        </button>
      </header>

      {loading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {[1,2,3].map(i => <div key={i} className="skeleton skeleton-card" style={{ height: '300px' }} />)}
        </div>
      ) : (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
          
          {/* Profile Section */}
          <section className="glass-card-level-1" style={{ padding: '36px' }}>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '28px', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ padding: '8px', background: 'rgba(0, 229, 255, 0.1)', borderRadius: '8px' }}>
                <User size={18} color="var(--sovereign-cyan)" />
              </div>
              Personal Profile
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--sovereign-slate)', marginBottom: '10px', fontWeight: 600 }}>
                  Display Name
                </label>
                <input 
                  type="text" 
                  value={profile?.displayName || ''}
                  onChange={(e) => setProfile({ ...profile, displayName: e.target.value })}
                  className="sovereign-input"
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--sovereign-slate)', marginBottom: '10px', fontWeight: 600 }}>
                  Email Address
                </label>
                <input 
                  type="email" 
                  value={profile?.email || user?.email || ''} 
                  disabled 
                  className="sovereign-input"
                  style={{ opacity: 0.6, cursor: 'not-allowed' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--sovereign-slate)', marginBottom: '10px', fontWeight: 600 }}>
                  Bevorzugte Sprache
                </label>
                <select 
                  className="sovereign-input" 
                  value={profile?.preferredLanguage || 'de'}
                  onChange={(e) => setProfile({ ...profile, preferredLanguage: e.target.value })}
                  style={{ appearance: 'none' }}
                >
                  <option value="de">Deutsch (DE)</option>
                  <option value="en">English (EN)</option>
                </select>
              </div>
            </div>
          </section>

          {/* Abonnement */}
          <section className="glass-card-level-1" style={{ padding: '36px' }}>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '28px', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ padding: '8px', background: 'rgba(0, 229, 255, 0.1)', borderRadius: '8px' }}>
                <CreditCard size={18} color="var(--sovereign-cyan)" />
              </div>
              Abonnement
            </h3>

            {/* Current plan */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '1.5rem', alignItems: 'center', padding: '1.25rem', background: 'rgba(0,212,255,0.04)', border: '1px solid rgba(0,212,255,0.15)', marginBottom: '1.5rem' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.4rem' }}>
                  <Zap size={14} color="var(--sovereign-cyan)" />
                  <span style={{ fontFamily: 'var(--font-jetbrains, monospace)', fontSize: '0.6rem', letterSpacing: '0.12em', color: 'rgba(0,212,255,0.7)', textTransform: 'uppercase' }}>
                    Aktueller Plan
                  </span>
                </div>
                <p style={{ fontFamily: 'var(--font-space-grotesk, sans-serif)', fontWeight: 800, fontSize: '1.3rem', color: 'var(--sovereign-alabaster)', margin: '0 0 0.3rem', letterSpacing: '-0.02em' }}>
                  SOVEREIGN Citizen
                </p>
                <p style={{ fontSize: '0.82rem', color: 'var(--sovereign-slate)', margin: 0 }}>
                  €14,90 / Monat · Nächste Abbuchung: <strong style={{ color: 'var(--sovereign-alabaster)' }}>01.05.2026</strong>
                </p>
              </div>
              <button className="secondary-button" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', whiteSpace: 'nowrap' }}>
                Upgrade auf Nexus
                <ChevronRight size={14} />
              </button>
            </div>

            {/* Plan comparison */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.06)', marginBottom: '1.5rem' }}>
              {[
                { name: 'Citizen', price: '€14,90', features: ['5 Module', 'Basis-Analyse', 'E-Mail-Support'], current: true },
                { name: 'Nexus', price: '€29,90', features: ['Alle Module', 'Autonome Agents', 'Priority Support'], current: false },
                { name: 'Sovereign OS', price: '€79,90', features: ['White-Label', 'API-Zugang', 'Dedicated Manager'], current: false },
              ].map((plan) => (
                <div key={plan.name} style={{ padding: '1.25rem', background: plan.current ? 'rgba(0,212,255,0.04)' : '#0D1929', position: 'relative' }}>
                  {plan.current && (
                    <span style={{ position: 'absolute', top: '0.75rem', right: '0.75rem', fontFamily: 'var(--font-jetbrains, monospace)', fontSize: '0.48rem', letterSpacing: '0.08em', color: 'rgba(0,212,255,0.7)', border: '1px solid rgba(0,212,255,0.25)', padding: '2px 6px' }}>
                      AKTIV
                    </span>
                  )}
                  <p style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--sovereign-alabaster)', margin: '0 0 0.25rem' }}>{plan.name}</p>
                  <p style={{ fontFamily: 'var(--font-jetbrains, monospace)', fontSize: '0.85rem', color: 'rgba(0,212,255,0.8)', margin: '0 0 0.75rem' }}>{plan.price}/mo</p>
                  <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                    {plan.features.map((f) => (
                      <li key={f} style={{ fontSize: '0.75rem', color: 'var(--sovereign-slate)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        <Shield size={10} color="rgba(0,212,255,0.4)" /> {f}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            <p style={{ fontSize: '0.78rem', color: 'var(--sovereign-slate)', margin: 0, lineHeight: 1.55 }}>
              Alle Pläne beinhalten EU AI Act-Konformität, DSGVO-Automatisierung und Zero-Tracking. Kündigung jederzeit monatlich möglich.
            </p>
          </section>

          {/* Boundary Conditions (God Mode Logic) */}
          <section className="glass-card-level-1" style={{ padding: '36px', border: '1px solid rgba(0, 229, 255, 0.25)' }}>
            <div className="floating-aura" style={{ position: 'absolute', top: 0, right: 0, width: '200px', height: '200px', opacity: 0.05 }} />
            
            <h3 style={{ fontSize: '1.25rem', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ padding: '8px', background: 'rgba(0, 229, 255, 0.1)', borderRadius: '8px' }}>
                <Sliders size={18} color="var(--sovereign-cyan)" />
              </div>
              Boundary Conditions
            </h3>
            <p style={{ fontSize: '0.95rem', color: 'var(--sovereign-slate)', marginBottom: '32px', maxWidth: '600px', lineHeight: 1.5 }}>
              Diese Parameter definieren die Leitplanken der autonomen Sub-Agenten. Alles innerhalb dieser Grenzen kann ohne manuelle Freigabe ausgeführt werden.
            </p>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '28px', position: 'relative', zIndex: 1 }}>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '24px', borderBottom: '1px solid var(--sovereign-silver)' }}>
                <div>
                  <p style={{ fontWeight: 600, margin: '0 0 6px 0', fontSize: '1.05rem', color: 'var(--sovereign-alabaster)' }}>Auto-Approve Savings</p>
                  <p style={{ fontSize: '0.85rem', color: 'var(--sovereign-slate)', margin: 0, maxWidth: '400px', lineHeight: 1.5 }}>
                    Erlaubt es dem System, Vertragswechsel und Optimierungen unterhalb dieses Schwellenwerts automatisch ohne Nachfrage durchzuführen.
                  </p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{ fontWeight: 700, fontSize: '1.1rem' }}>€</span>
                  <input 
                    type="number" 
                    value={boundary.autoApproveSavingsBelowEur} 
                    onChange={(e) => setBoundary({ ...boundary, autoApproveSavingsBelowEur: Number(e.target.value) })}
                    className="sovereign-input"
                    style={{ width: '100px', textAlign: 'center' }}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '24px', borderBottom: '1px solid var(--sovereign-silver)' }}>
                <div>
                  <p style={{ fontWeight: 600, margin: '0 0 6px 0', fontSize: '1.05rem', color: 'var(--sovereign-alabaster)' }}>Strict Privacy Filter</p>
                  <p style={{ fontSize: '0.85rem', color: 'var(--sovereign-slate)', margin: 0, maxWidth: '400px', lineHeight: 1.5 }}>
                    Anonymisiert sensible Finanzdaten, bevor Kontext an LLM-Provider gesendet wird (PII Redaction).
                  </p>
                </div>
                <div 
                  className={`sovereign-toggle ${boundary.strictPrivacyFilter ? 'active' : ''}`}
                  onClick={() => setBoundary({ ...boundary, strictPrivacyFilter: !boundary.strictPrivacyFilter })}
                >
                  <div className="toggle-knob" />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <p style={{ fontWeight: 600, margin: '0 0 6px 0', fontSize: '1.05rem', color: 'var(--sovereign-alabaster)' }}>Biometrie für Hochrisiko-Aktionen</p>
                  <p style={{ fontSize: '0.85rem', color: 'var(--sovereign-slate)', margin: 0, maxWidth: '400px', lineHeight: 1.5 }}>
                    Erfordert Passkey/FaceID für Kündigungen oder Transaktionen überhalb deines Standard-Limits.
                  </p>
                </div>
                <div 
                  className={`sovereign-toggle ${boundary.requireBiometricsForHighRisk ? 'active' : ''}`}
                  onClick={() => setBoundary({ ...boundary, requireBiometricsForHighRisk: !boundary.requireBiometricsForHighRisk })}
                >
                  <div className="toggle-knob" />
                </div>
              </div>

            </div>
          </section>

          {/* Datenlöschung */}
          <section className="glass-card-level-1" style={{ padding: '36px', border: '1px solid rgba(255,23,68,0.12)' }}>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ padding: '8px', background: 'rgba(255,23,68,0.08)', borderRadius: '8px' }}>
                <Trash2 size={18} color="var(--sovereign-riskred)" />
              </div>
              Datenverwaltung & Löschung
            </h3>
            <p style={{ fontSize: '0.88rem', color: 'var(--sovereign-slate)', marginBottom: '1.5rem', lineHeight: 1.6, maxWidth: 560 }}>
              Du hast das Recht auf Vergessenwerden (Art. 17 DSGVO). Alle Löschvorgänge sind unwiderruflich und werden innerhalb von 30 Tagen vollständig ausgeführt.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {[
                {
                  title: 'Analysehistorie löschen',
                  desc: 'Alle gespeicherten KI-Analysen, Chat-Verläufe und Empfehlungen unwiderruflich entfernen.',
                  label: 'Verlauf löschen',
                  danger: false,
                },
                {
                  title: 'Alle Vertragsdaten löschen',
                  desc: 'Alle hochgeladenen Verträge, erkannten Konditionen und Fristen-Erinnerungen entfernen.',
                  label: 'Verträge löschen',
                  danger: false,
                },
                {
                  title: 'Konto vollständig löschen',
                  desc: 'Löscht dein Sovereign-Konto, alle persönlichen Daten, Dokumente und Zahlungsdaten permanent. Dieser Vorgang kann nicht rückgängig gemacht werden.',
                  label: 'Konto löschen',
                  danger: true,
                },
              ].map((item) => (
                <div key={item.title} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', padding: '1rem 1.25rem', border: `1px solid ${item.danger ? 'rgba(255,23,68,0.15)' : 'rgba(255,255,255,0.06)'}`, background: item.danger ? 'rgba(255,23,68,0.03)' : 'transparent' }}>
                  <div>
                    <p style={{ fontWeight: 600, fontSize: '0.92rem', color: item.danger ? 'rgba(255,100,100,0.9)' : 'var(--sovereign-alabaster)', margin: '0 0 0.25rem' }}>
                      {item.title}
                    </p>
                    <p style={{ fontSize: '0.78rem', color: 'var(--sovereign-slate)', margin: 0, lineHeight: 1.5, maxWidth: 440 }}>
                      {item.desc}
                    </p>
                  </div>
                  <button
                    className="secondary-button"
                    style={{
                      whiteSpace: 'nowrap',
                      flexShrink: 0,
                      ...(item.danger ? { borderColor: 'rgba(255,23,68,0.3)', color: 'var(--sovereign-riskred)' } : {}),
                    }}
                  >
                    {item.label}
                  </button>
                </div>
              ))}
            </div>
          </section>

          {/* Kill Switch */}
          <section className="kill-switch engaged" style={{ marginTop: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'rgba(255, 23, 68, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <AlertTriangle size={24} color="var(--sovereign-riskred)" />
              </div>
              <div>
                <h4 style={{ margin: '0 0 4px', fontSize: '1.1rem', color: 'var(--sovereign-riskred)' }}>Sovereign Kill Switch</h4>
                <p style={{ fontSize: '0.85rem', color: 'var(--sovereign-slabaster)', margin: 0, opacity: 0.8 }}>
                  Friert sofort alle autonomen Agenten ein. Keine weiteren API-Calls oder Verhandlungen.
                </p>
              </div>
            </div>
            <button className="primary-aura-button" style={{ background: 'var(--sovereign-riskred)', boxShadow: '0 0 20px rgba(255,23,68,0.4)', color: 'white' }}>
              Agenten Einfrieren
            </button>
          </section>

          {/* Logout */}
          <button 
            onClick={handleLogout}
            className="secondary-button" 
            style={{ width: 'fit-content', alignSelf: 'center', marginTop: '20px', display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 32px' }}
          >
            <LogOut size={16} /> Session Beenden
          </button>
        </motion.div>
      )}
    </div>
  );
}
