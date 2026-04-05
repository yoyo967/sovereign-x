'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Zap, Globe, CheckCircle, ArrowRight, User, Sparkles } from 'lucide-react';
import { api } from '@/lib/api';

interface OnboardingModalProps {
  userEmail: string;
  onComplete: () => void;
}

const STEPS = ['welcome', 'profile', 'tour', 'done'] as const;
type Step = typeof STEPS[number];

const LANGUAGES = [
  { code: 'de', label: 'Deutsch', flag: '🇩🇪' },
  { code: 'en', label: 'English', flag: '🇬🇧' },
  { code: 'fr', label: 'Français', flag: '🇫🇷' },
  { code: 'es', label: 'Español', flag: '🇪🇸' },
  { code: 'it', label: 'Italiano', flag: '🇮🇹' },
  { code: 'ru', label: 'Русский', flag: '🇷🇺' },
  { code: 'ar', label: 'العربية', flag: '🇸🇦' },
  { code: 'zh', label: '中文', flag: '🇨🇳' },
];

const TOUR_ITEMS = [
  { icon: Zap, color: 'var(--sovereign-cyan)', title: 'Brainstormer AI', desc: 'Sprich mit deinem autonomen Assistenten — er lernt deine Präferenzen.' },
  { icon: Shield, color: 'var(--sovereign-purple)', title: 'Vertrags-Tresor', desc: 'Alle Verträge. Optimiert, überwacht, verhandelt — automatisch.' },
  { icon: CheckCircle, color: 'var(--sovereign-success)', title: 'Algorithmic Senate', desc: 'Jede autonome Aktion braucht deine Freigabe. Du behältst die Kontrolle.' },
  { icon: Globe, color: 'var(--sovereign-gold)', title: 'Finance Guardian', desc: 'Bank-Verbindung via PSD2. Echtzeit-Überwachung deiner Finanzen.' },
];

export default function OnboardingModal({ userEmail, onComplete }: OnboardingModalProps) {
  const [step, setStep] = useState<Step>('welcome');
  const [displayName, setDisplayName] = useState(userEmail.split('@')[0]);
  const [language, setLanguage] = useState('de');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const stepIndex = STEPS.indexOf(step);

  const handleSaveProfile = async () => {
    setSaving(true);
    setError(null);
    try {
      await api.user.onboard({ displayName, preferredLanguage: language });
      setStep('tour');
    } catch (e) {
      setError('Speichern fehlgeschlagen. Bitte versuche es erneut.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 9999,
      background: 'rgba(10, 10, 15, 0.92)',
      backdropFilter: 'blur(12px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '24px',
    }}>
      {/* Progress bar */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: '3px',
        background: 'var(--sovereign-glass-15)',
      }}>
        <motion.div
          style={{ height: '100%', background: 'linear-gradient(90deg, var(--sovereign-cyan), var(--sovereign-purple))' }}
          initial={{ width: '0%' }}
          animate={{ width: `${((stepIndex + 1) / STEPS.length) * 100}%` }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        />
      </div>

      <AnimatePresence mode="wait">

        {/* ── STEP: WELCOME ── */}
        {step === 'welcome' && (
          <motion.div
            key="welcome"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            style={{ maxWidth: '520px', width: '100%', textAlign: 'center' }}
          >
            <div style={{
              width: '88px', height: '88px', borderRadius: '24px',
              background: 'linear-gradient(135deg, rgba(0,229,255,0.15), rgba(187,134,252,0.15))',
              border: '1px solid rgba(0,229,255,0.25)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 28px',
              boxShadow: '0 0 60px rgba(0,229,255,0.12)',
            }}>
              <Shield size={44} color="var(--sovereign-cyan)" />
            </div>

            <h1 style={{
              fontSize: '2.4rem', fontWeight: 900, marginBottom: '12px',
              fontFamily: 'var(--font-space-grotesk, sans-serif)',
              letterSpacing: '-0.04em',
              background: 'linear-gradient(135deg, #fff 40%, var(--sovereign-cyan))',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            }}>
              Willkommen, Sovereign.
            </h1>
            <p style={{ fontSize: '1.05rem', color: 'var(--sovereign-slate)', marginBottom: '40px', lineHeight: 1.6, maxWidth: '400px', margin: '0 auto 40px' }}>
              Dein autonomes Life-OS ist bereit. In 2 Minuten richten wir deinen persönlichen Sovereign ein.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '32px', textAlign: 'left' }}>
              {[
                '✦ Deine Daten verlassen nie deine Kontrolle',
                '✦ Jede autonome Aktion braucht deine Freigabe',
                '✦ Du kannst jederzeit alles widerrufen',
              ].map(line => (
                <div key={line} style={{
                  padding: '14px 20px', borderRadius: '14px',
                  background: 'rgba(0,229,255,0.04)', border: '1px solid rgba(0,229,255,0.1)',
                  fontSize: '0.9rem', color: 'var(--sovereign-alabaster)',
                }}>
                  {line}
                </div>
              ))}
            </div>

            <button
              className="primary-aura-button"
              style={{ width: '100%', padding: '16px', fontSize: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}
              onClick={() => setStep('profile')}
            >
              Jetzt einrichten
              <ArrowRight size={18} />
            </button>
          </motion.div>
        )}

        {/* ── STEP: PROFILE ── */}
        {step === 'profile' && (
          <motion.div
            key="profile"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            style={{ maxWidth: '520px', width: '100%' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '32px' }}>
              <div style={{
                width: '52px', height: '52px', borderRadius: '16px',
                background: 'rgba(0,229,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                border: '1px solid rgba(0,229,255,0.2)',
              }}>
                <User size={26} color="var(--sovereign-cyan)" />
              </div>
              <div>
                <h2 style={{ fontSize: '1.6rem', fontWeight: 800, margin: 0, fontFamily: 'var(--font-space-grotesk)', letterSpacing: '-0.03em' }}>
                  Dein Profil
                </h2>
                <p style={{ color: 'var(--sovereign-slate)', margin: 0, fontSize: '0.9rem' }}>
                  Wie soll Sovereign dich ansprechen?
                </p>
              </div>
            </div>

            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--sovereign-slate)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Dein Name
              </label>
              <input
                type="text"
                value={displayName}
                onChange={e => setDisplayName(e.target.value)}
                className="sovereign-input"
                placeholder="Dein Name oder Spitzname"
                style={{ width: '100%' }}
              />
            </div>

            <div style={{ marginBottom: '32px' }}>
              <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--sovereign-slate)', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Bevorzugte Sprache
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px' }}>
                {LANGUAGES.map(lang => (
                  <button
                    key={lang.code}
                    onClick={() => setLanguage(lang.code)}
                    style={{
                      padding: '12px 8px', borderRadius: '12px', border: '1px solid',
                      borderColor: language === lang.code ? 'var(--sovereign-cyan)' : 'var(--sovereign-silver)',
                      background: language === lang.code ? 'rgba(0,229,255,0.08)' : 'transparent',
                      color: language === lang.code ? 'var(--sovereign-cyan)' : 'var(--sovereign-slate)',
                      cursor: 'pointer', fontSize: '0.82rem', fontWeight: 600,
                      display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px',
                      transition: 'all 0.2s',
                    }}
                  >
                    <span style={{ fontSize: '1.3rem' }}>{lang.flag}</span>
                    <span>{lang.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {error && (
              <p style={{ color: 'var(--sovereign-riskred)', fontSize: '0.85rem', marginBottom: '16px' }}>{error}</p>
            )}

            <div style={{ display: 'flex', gap: '12px' }}>
              <button className="secondary-button" onClick={() => setStep('welcome')} style={{ padding: '14px 24px' }}>
                Zurück
              </button>
              <button
                className="primary-aura-button"
                style={{ flex: 1, padding: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}
                onClick={handleSaveProfile}
                disabled={saving || !displayName.trim()}
              >
                {saving ? 'Wird gespeichert...' : <>Weiter <ArrowRight size={16} /></>}
              </button>
            </div>
          </motion.div>
        )}

        {/* ── STEP: TOUR ── */}
        {step === 'tour' && (
          <motion.div
            key="tour"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            style={{ maxWidth: '600px', width: '100%' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '32px' }}>
              <div style={{
                width: '52px', height: '52px', borderRadius: '16px',
                background: 'rgba(187,134,252,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                border: '1px solid rgba(187,134,252,0.2)',
              }}>
                <Sparkles size={26} color="var(--sovereign-purple)" />
              </div>
              <div>
                <h2 style={{ fontSize: '1.6rem', fontWeight: 800, margin: 0, fontFamily: 'var(--font-space-grotesk)', letterSpacing: '-0.03em' }}>
                  Deine Werkzeuge
                </h2>
                <p style={{ color: 'var(--sovereign-slate)', margin: 0, fontSize: '0.9rem' }}>
                  Das ist dein autonomes Arsenal.
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '32px' }}>
              {TOUR_ITEMS.map((item, i) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  style={{
                    display: 'flex', alignItems: 'flex-start', gap: '18px',
                    padding: '20px 24px', borderRadius: '16px',
                    background: 'rgba(255,255,255,0.02)', border: '1px solid var(--sovereign-silver)',
                  }}
                >
                  <div style={{
                    width: '44px', height: '44px', flexShrink: 0, borderRadius: '14px',
                    background: `${item.color}12`, display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <item.icon size={22} color={item.color} />
                  </div>
                  <div>
                    <p style={{ fontWeight: 700, fontSize: '1rem', margin: '0 0 4px', color: 'var(--sovereign-alabaster)' }}>
                      {item.title}
                    </p>
                    <p style={{ fontSize: '0.88rem', color: 'var(--sovereign-slate)', margin: 0, lineHeight: 1.5 }}>
                      {item.desc}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>

            <button
              className="primary-aura-button"
              style={{ width: '100%', padding: '16px', fontSize: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}
              onClick={() => setStep('done')}
            >
              Verstanden — zeig mir das Dashboard
              <ArrowRight size={18} />
            </button>
          </motion.div>
        )}

        {/* ── STEP: DONE ── */}
        {step === 'done' && (
          <motion.div
            key="done"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            style={{ maxWidth: '480px', width: '100%', textAlign: 'center' }}
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20, delay: 0.1 }}
              style={{
                width: '88px', height: '88px', borderRadius: '50%',
                background: 'linear-gradient(135deg, var(--sovereign-cyan), var(--sovereign-success))',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                margin: '0 auto 28px',
                boxShadow: '0 0 60px rgba(0,230,118,0.2)',
              }}
            >
              <CheckCircle size={44} color="white" />
            </motion.div>

            <h2 style={{
              fontSize: '2.2rem', fontWeight: 900, marginBottom: '12px',
              fontFamily: 'var(--font-space-grotesk)', letterSpacing: '-0.04em',
            }}>
              Sovereign ist aktiv.
            </h2>
            <p style={{ fontSize: '1rem', color: 'var(--sovereign-slate)', marginBottom: '40px', lineHeight: 1.6 }}>
              Dein autonomes Life-OS läuft. Füge deinen ersten Vertrag hinzu oder starte mit dem Brainstormer.
            </p>

            <motion.button
              className="primary-aura-button"
              style={{ width: '100%', padding: '18px', fontSize: '1.1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px' }}
              onClick={onComplete}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Shield size={20} />
              Dashboard öffnen
            </motion.button>
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
}
