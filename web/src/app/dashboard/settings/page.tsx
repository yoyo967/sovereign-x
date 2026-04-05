'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User, Sliders, LogOut, CheckCircle2, AlertTriangle, Save } from 'lucide-react';
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
