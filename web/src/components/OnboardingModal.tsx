'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Zap, Globe, CheckCircle, ArrowRight, User, Sparkles, FileText, Lock, TrendingUp, Scale } from 'lucide-react';
import { api } from '@/lib/api';

interface OnboardingModalProps {
  userEmail: string;
  onComplete: () => void;
}

const STEPS = ['welcome', 'goals', 'profile', 'tour', 'done'] as const;
type Step = typeof STEPS[number];

const PROTECTION_GOALS = [
  {
    id: 'vertraege',
    icon: FileText,
    color: '#00D4FF',
    title: 'Verträge & Abos',
    desc: 'Kündigen, Preiserhöhungen widersprechen, Fallen vermeiden.',
    module: 'Execution Center',
  },
  {
    id: 'datenschutz',
    icon: Lock,
    color: '#BB86FC',
    title: 'Datenschutz & DSGVO',
    desc: 'Daten zurückfordern, Auskunftsanträge stellen, PII schützen.',
    module: 'Privacy Guardian',
  },
  {
    id: 'finanzen',
    icon: TrendingUp,
    color: '#00E676',
    title: 'Finanzen & Vermögen',
    desc: 'Ausgaben analysieren, Abos erkennen, Wealth Twin aufbauen.',
    module: 'Finance Guardian',
  },
  {
    id: 'ki-recht',
    icon: Scale,
    color: '#FFD600',
    title: 'KI-Rechte & EU-Gesetz',
    desc: 'EU AI Act verstehen, KI-Entscheidungen anfechten, Compliance.',
    module: 'Security Senate',
  },
  {
    id: 'alles',
    icon: Shield,
    color: '#FF5252',
    title: 'Vollständige Souveränität',
    desc: 'Alle Module aktiv. Maximaler Schutz in allen Lebensbereichen.',
    module: 'Alle 8 Module',
  },
];

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
  { icon: Zap,         color: 'var(--sovereign-cyan)',    title: 'Brainstormer AI',    desc: 'Sprich mit deinem autonomen Assistenten — er lernt deine Präferenzen.' },
  { icon: Shield,      color: 'var(--sovereign-purple)',  title: 'Vertrags-Tresor',    desc: 'Alle Verträge. Optimiert, überwacht, verhandelt — automatisch.' },
  { icon: CheckCircle, color: 'var(--sovereign-success)', title: 'Algorithmic Senate', desc: 'Jede autonome Aktion braucht deine Freigabe. Du behältst die Kontrolle.' },
  { icon: Globe,       color: 'var(--sovereign-gold)',    title: 'Finance Guardian',   desc: 'Bank-Verbindung via PSD2. Echtzeit-Überwachung deiner Finanzen.' },
];

export default function OnboardingModal({ userEmail, onComplete }: OnboardingModalProps) {
  const [step, setStep] = useState<Step>('welcome');
  const [selectedGoals, setSelectedGoals] = useState<string[]>([]);
  const [displayName, setDisplayName] = useState(userEmail.split('@')[0]);
  const [language, setLanguage] = useState('de');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const stepIndex = STEPS.indexOf(step);

  const toggleGoal = (id: string) => {
    if (id === 'alles') {
      setSelectedGoals(prev => prev.includes('alles') ? [] : ['alles']);
      return;
    }
    setSelectedGoals(prev => {
      const without = prev.filter(g => g !== 'alles');
      return without.includes(id) ? without.filter(g => g !== id) : [...without, id];
    });
  };

  const handleSaveProfile = async () => {
    setSaving(true);
    setError(null);
    try {
      await api.user.onboard({ displayName, preferredLanguage: language });
      setStep('tour');
    } catch {
      setError('Speichern fehlgeschlagen. Bitte versuche es erneut.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 9999,
      background: 'rgba(8,14,26,0.95)',
      backdropFilter: 'blur(16px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '24px',
    }}>
      {/* Progress bar */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: '2px',
        background: 'rgba(255,255,255,0.05)',
      }}>
        <motion.div
          style={{ height: '100%', background: 'linear-gradient(90deg, #00D4FF, #BB86FC)' }}
          initial={{ width: '0%' }}
          animate={{ width: `${((stepIndex + 1) / STEPS.length) * 100}%` }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        />
      </div>

      {/* Step counter */}
      <div style={{
        position: 'absolute', top: '20px', right: '24px',
        fontFamily: 'var(--font-jetbrains, monospace)',
        fontSize: '0.58rem', letterSpacing: '0.1em',
        color: 'rgba(255,255,255,0.2)',
      }}>
        {stepIndex + 1} / {STEPS.length}
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
              background: 'linear-gradient(135deg, rgba(0,212,255,0.12), rgba(187,134,252,0.12))',
              border: '1px solid rgba(0,212,255,0.2)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 28px',
              boxShadow: '0 0 60px rgba(0,212,255,0.1)',
            }}>
              <Shield size={44} color="#00D4FF" />
            </div>

            <div style={{
              fontFamily: 'var(--font-jetbrains, monospace)',
              fontSize: '0.6rem', letterSpacing: '0.15em',
              color: 'rgba(0,212,255,0.5)', textTransform: 'uppercase',
              marginBottom: '12px',
            }}>
              SOVEREIGN OS — AKTIVIERT
            </div>

            <h1 style={{
              fontSize: '2.4rem', fontWeight: 900, marginBottom: '12px',
              fontFamily: 'var(--font-space-grotesk, sans-serif)',
              letterSpacing: '-0.04em', color: '#F0F4FF',
            }}>
              Willkommen, Sovereign.
            </h1>
            <p style={{ fontSize: '1rem', color: 'rgba(255,255,255,0.45)', marginBottom: '36px', lineHeight: 1.65, maxWidth: '400px', margin: '0 auto 36px' }}>
              Dein autonomes Life-OS ist bereit. In 3 Schritten richten wir deinen persönlichen Sovereign ein.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '32px', textAlign: 'left' }}>
              {[
                { text: 'Deine Daten verlassen nie deine Kontrolle', color: '#00D4FF' },
                { text: 'Jede autonome Aktion braucht deine Freigabe', color: '#BB86FC' },
                { text: 'Du kannst jederzeit alles widerrufen', color: '#00E676' },
              ].map(item => (
                <div key={item.text} style={{
                  padding: '12px 18px',
                  background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)',
                  fontSize: '0.88rem', color: 'rgba(255,255,255,0.7)',
                  display: 'flex', alignItems: 'center', gap: '12px',
                }}>
                  <span style={{ width: 6, height: 6, borderRadius: '50%', background: item.color, boxShadow: `0 0 8px ${item.color}`, flexShrink: 0 }} />
                  {item.text}
                </div>
              ))}
            </div>

            <button
              className="primary-aura-button"
              style={{ width: '100%', padding: '16px', fontSize: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}
              onClick={() => setStep('goals')}
            >
              Jetzt einrichten <ArrowRight size={18} />
            </button>
          </motion.div>
        )}

        {/* ── STEP: GOALS — "Was möchtest du schützen?" ── */}
        {step === 'goals' && (
          <motion.div
            key="goals"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            style={{ maxWidth: '620px', width: '100%' }}
          >
            <div style={{ marginBottom: '28px' }}>
              <div style={{
                fontFamily: 'var(--font-jetbrains, monospace)',
                fontSize: '0.6rem', letterSpacing: '0.15em',
                color: 'rgba(0,212,255,0.5)', textTransform: 'uppercase', marginBottom: '8px',
              }}>
                Schritt 1 von 3 — Prioritäten
              </div>
              <h2 style={{
                fontSize: '1.8rem', fontWeight: 900, margin: 0,
                fontFamily: 'var(--font-space-grotesk, sans-serif)', letterSpacing: '-0.03em',
                color: '#F0F4FF',
              }}>
                Was möchtest du schützen?
              </h2>
              <p style={{ color: 'rgba(255,255,255,0.4)', margin: '8px 0 0', fontSize: '0.9rem' }}>
                Wähle deine wichtigsten Schutzfelder. Mehrfachauswahl möglich.
              </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '28px' }}>
              {PROTECTION_GOALS.map((goal) => {
                const isSelected = selectedGoals.includes(goal.id);
                return (
                  <button
                    key={goal.id}
                    onClick={() => toggleGoal(goal.id)}
                    style={{
                      display: 'flex', alignItems: 'center', gap: '16px',
                      padding: '16px 20px',
                      background: isSelected ? `${goal.color}08` : 'rgba(255,255,255,0.02)',
                      border: `1px solid ${isSelected ? `${goal.color}40` : 'rgba(255,255,255,0.07)'}`,
                      cursor: 'pointer', textAlign: 'left',
                      transition: 'all 0.2s',
                    }}
                  >
                    <div style={{
                      width: '44px', height: '44px', flexShrink: 0,
                      background: isSelected ? `${goal.color}15` : 'rgba(255,255,255,0.04)',
                      border: `1px solid ${isSelected ? `${goal.color}30` : 'rgba(255,255,255,0.08)'}`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      transition: 'all 0.2s',
                    }}>
                      <goal.icon size={20} color={isSelected ? goal.color : 'rgba(255,255,255,0.3)'} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{
                        fontFamily: 'var(--font-space-grotesk, sans-serif)',
                        fontWeight: 700, fontSize: '0.95rem',
                        color: isSelected ? '#F0F4FF' : 'rgba(255,255,255,0.65)',
                        marginBottom: '2px',
                      }}>
                        {goal.title}
                      </div>
                      <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.35)', lineHeight: 1.5 }}>
                        {goal.desc}
                      </div>
                    </div>
                    <div style={{
                      fontFamily: 'var(--font-jetbrains, monospace)',
                      fontSize: '0.5rem', letterSpacing: '0.08em',
                      color: isSelected ? goal.color : 'rgba(255,255,255,0.2)',
                      textTransform: 'uppercase', flexShrink: 0,
                      border: `1px solid ${isSelected ? `${goal.color}30` : 'rgba(255,255,255,0.08)'}`,
                      padding: '3px 8px',
                      transition: 'all 0.2s',
                    }}>
                      {isSelected ? '✓ AKTIV' : goal.module}
                    </div>
                  </button>
                );
              })}
            </div>

            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                className="secondary-button"
                onClick={() => setStep('welcome')}
                style={{ padding: '14px 24px' }}
              >
                Zurück
              </button>
              <button
                className="primary-aura-button"
                style={{ flex: 1, padding: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}
                onClick={() => setStep('profile')}
                disabled={selectedGoals.length === 0}
              >
                Weiter <ArrowRight size={16} />
              </button>
            </div>
            {selectedGoals.length === 0 && (
              <p style={{ textAlign: 'center', marginTop: '10px', fontSize: '0.78rem', color: 'rgba(255,255,255,0.25)' }}>
                Wähle mindestens ein Schutzfeld
              </p>
            )}
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
            <div style={{ marginBottom: '28px' }}>
              <div style={{
                fontFamily: 'var(--font-jetbrains, monospace)',
                fontSize: '0.6rem', letterSpacing: '0.15em',
                color: 'rgba(0,212,255,0.5)', textTransform: 'uppercase', marginBottom: '8px',
              }}>
                Schritt 2 von 3 — Dein Profil
              </div>
              <h2 style={{
                fontSize: '1.8rem', fontWeight: 900, margin: 0,
                fontFamily: 'var(--font-space-grotesk, sans-serif)', letterSpacing: '-0.03em',
                color: '#F0F4FF',
              }}>
                Wie soll Sovereign dich ansprechen?
              </h2>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.72rem', color: 'rgba(255,255,255,0.35)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.08em', fontFamily: 'var(--font-jetbrains, monospace)' }}>
                <User size={12} /> Dein Name
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

            <div style={{ marginBottom: '28px' }}>
              <label style={{ display: 'block', fontSize: '0.72rem', color: 'rgba(255,255,255,0.35)', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.08em', fontFamily: 'var(--font-jetbrains, monospace)' }}>
                Bevorzugte Sprache
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px' }}>
                {LANGUAGES.map(lang => (
                  <button
                    key={lang.code}
                    onClick={() => setLanguage(lang.code)}
                    style={{
                      padding: '12px 8px', border: '1px solid',
                      borderColor: language === lang.code ? 'rgba(0,212,255,0.4)' : 'rgba(255,255,255,0.08)',
                      background: language === lang.code ? 'rgba(0,212,255,0.08)' : 'rgba(255,255,255,0.02)',
                      color: language === lang.code ? '#00D4FF' : 'rgba(255,255,255,0.4)',
                      cursor: 'pointer', fontSize: '0.78rem', fontWeight: 600,
                      display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px',
                      transition: 'all 0.2s',
                    }}
                  >
                    <span style={{ fontSize: '1.2rem' }}>{lang.flag}</span>
                    <span>{lang.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {error && (
              <p style={{ color: 'var(--sovereign-riskred)', fontSize: '0.85rem', marginBottom: '16px' }}>{error}</p>
            )}

            <div style={{ display: 'flex', gap: '12px' }}>
              <button className="secondary-button" onClick={() => setStep('goals')} style={{ padding: '14px 24px' }}>
                Zurück
              </button>
              <button
                className="primary-aura-button"
                style={{ flex: 1, padding: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}
                onClick={handleSaveProfile}
                disabled={saving || !displayName.trim()}
              >
                {saving ? 'Wird gespeichert...' : <><span>Weiter</span> <ArrowRight size={16} /></>}
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
            <div style={{ marginBottom: '24px' }}>
              <div style={{
                fontFamily: 'var(--font-jetbrains, monospace)',
                fontSize: '0.6rem', letterSpacing: '0.15em',
                color: 'rgba(187,134,252,0.5)', textTransform: 'uppercase', marginBottom: '8px',
              }}>
                Schritt 3 von 3 — Dein Arsenal
              </div>
              <h2 style={{
                fontSize: '1.8rem', fontWeight: 900, margin: 0,
                fontFamily: 'var(--font-space-grotesk, sans-serif)', letterSpacing: '-0.03em',
                color: '#F0F4FF',
              }}>
                Deine Werkzeuge.
              </h2>
              <p style={{ color: 'rgba(255,255,255,0.4)', margin: '6px 0 0', fontSize: '0.9rem' }}>
                Das ist dein autonomes Arsenal — aktiviert nach deinen Prioritäten.
              </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '28px' }}>
              {TOUR_ITEMS.map((item, i) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.08 }}
                  style={{
                    display: 'flex', alignItems: 'flex-start', gap: '16px',
                    padding: '18px 20px',
                    background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)',
                  }}
                >
                  <div style={{
                    width: '42px', height: '42px', flexShrink: 0,
                    background: `${item.color}10`, border: `1px solid ${item.color}25`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <item.icon size={20} color={item.color} />
                  </div>
                  <div>
                    <p style={{ fontWeight: 700, fontSize: '0.95rem', margin: '0 0 3px', color: 'rgba(255,255,255,0.85)' }}>
                      {item.title}
                    </p>
                    <p style={{ fontSize: '0.83rem', color: 'rgba(255,255,255,0.4)', margin: 0, lineHeight: 1.5 }}>
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
              Verstanden — Dashboard öffnen <ArrowRight size={18} />
            </button>
          </motion.div>
        )}

        {/* ── STEP: DONE ── */}
        {step === 'done' && (
          <motion.div
            key="done"
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            style={{ maxWidth: '480px', width: '100%', textAlign: 'center' }}
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 280, damping: 20, delay: 0.1 }}
              style={{
                width: '88px', height: '88px',
                background: 'linear-gradient(135deg, #00D4FF, #00E676)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                margin: '0 auto 28px',
                boxShadow: '0 0 60px rgba(0,230,118,0.2)',
              }}
            >
              <CheckCircle size={44} color="white" />
            </motion.div>

            <div style={{
              fontFamily: 'var(--font-jetbrains, monospace)',
              fontSize: '0.6rem', letterSpacing: '0.15em',
              color: 'rgba(0,230,118,0.6)', textTransform: 'uppercase', marginBottom: '12px',
            }}>
              SYSTEM BEREIT
            </div>

            <h2 style={{
              fontSize: '2.2rem', fontWeight: 900, marginBottom: '10px',
              fontFamily: 'var(--font-space-grotesk, sans-serif)', letterSpacing: '-0.04em',
              color: '#F0F4FF',
            }}>
              Sovereign ist aktiv.
            </h2>
            <p style={{ fontSize: '0.95rem', color: 'rgba(255,255,255,0.4)', marginBottom: '12px', lineHeight: 1.65 }}>
              Deine Schutzfelder sind konfiguriert. Dein autonomes Life-OS überwacht ab jetzt die Bereiche, die dir wichtig sind.
            </p>

            {/* Selected goals summary */}
            {selectedGoals.length > 0 && (
              <div style={{
                display: 'flex', flexWrap: 'wrap', gap: '8px',
                justifyContent: 'center', marginBottom: '32px',
              }}>
                {PROTECTION_GOALS
                  .filter(g => selectedGoals.includes(g.id))
                  .map(g => (
                    <span key={g.id} style={{
                      fontFamily: 'var(--font-jetbrains, monospace)',
                      fontSize: '0.55rem', letterSpacing: '0.08em',
                      color: g.color, border: `1px solid ${g.color}40`,
                      padding: '4px 10px', textTransform: 'uppercase',
                    }}>
                      ✓ {g.title}
                    </span>
                  ))}
              </div>
            )}

            <motion.button
              className="primary-aura-button"
              style={{ width: '100%', padding: '18px', fontSize: '1.05rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px' }}
              onClick={onComplete}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
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
