'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import {
  Power, PowerOff, Lock, ChevronRight, Info, Shield,
  AlertTriangle, Zap, Settings2
} from 'lucide-react';
import { api } from '@/lib/api';
import { useAuth } from '@/hooks/useAuth';

type MessageRole = 'system' | 'user' | 'error';

interface Message {
  role: MessageRole;
  content: string;
  confidence?: number;
  disclaimer?: string;
}

// ─── Kill-Switch Banner ───────────────────────────────────
function KillSwitchBanner({
  active,
  onReset,
  t,
}: {
  active: boolean;
  onReset: () => void;
  t: ReturnType<typeof useTranslations>;
}) {
  if (active) {
    return (
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '12px 20px', marginBottom: '20px',
          background: 'rgba(255,23,68,0.06)', border: '1px solid rgba(255,23,68,0.25)',
          borderRadius: '12px', flexWrap: 'wrap', gap: '12px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <PowerOff size={16} color="var(--sovereign-riskred)" />
          <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--sovereign-riskred)', fontFamily: 'var(--font-jetbrains, monospace)', letterSpacing: '0.04em' }}>
            {t('killSwitchActive')}
          </span>
        </div>
        <button
          onClick={onReset}
          className="secondary-button"
          style={{ fontSize: '0.78rem', padding: '6px 16px', border: '1px solid rgba(0,229,255,0.3)', color: 'var(--sovereign-cyan)' }}
        >
          {t('killSwitchReset')}
        </button>
      </motion.div>
    );
  }

  return null;
}

// ─── Confidence Indicator ─────────────────────────────────
function ConfidencePip({ confidence }: { confidence: number }) {
  const color = confidence >= 0.8 ? 'var(--sovereign-success)' : confidence >= 0.5 ? '#FFD600' : 'var(--sovereign-riskred)';
  return (
    <span style={{
      fontSize: '0.58rem', fontFamily: 'var(--font-jetbrains, monospace)',
      letterSpacing: '0.06em', color, padding: '2px 6px',
      background: `${color}10`, border: `1px solid ${color}25`,
      flexShrink: 0,
    }}>
      {Math.round(confidence * 100)}%
    </span>
  );
}

// ─── Message Bubble ───────────────────────────────────────
function MessageBubble({ msg }: { msg: Message }) {
  const [showDisclaimer, setShowDisclaimer] = useState(false);
  const roleColor = msg.role === 'user' ? 'var(--sovereign-cyan)' : msg.role === 'error' ? 'var(--sovereign-pink)' : 'var(--sovereign-purple)';

  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.25 }}
      style={{
        padding: '12px 16px', borderRadius: '14px',
        background: msg.role === 'user' ? 'rgba(0,229,255,0.04)' : msg.role === 'error' ? 'rgba(255,64,129,0.08)' : 'rgba(255,255,255,0.02)',
        border: msg.role === 'user' ? '1px solid rgba(0,229,255,0.1)' : msg.role === 'error' ? '1px solid rgba(255,64,129,0.2)' : '1px solid rgba(255,255,255,0.04)',
        alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
        maxWidth: '88%',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
        <strong style={{ fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.06em', color: roleColor }}>
          {msg.role === 'system' ? 'Senate' : msg.role === 'error' ? 'System Error' : 'Du'}
        </strong>
        {msg.confidence != null && <ConfidencePip confidence={msg.confidence} />}
        {msg.disclaimer && (
          <button
            onClick={() => setShowDisclaimer(v => !v)}
            style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: 0, display: 'flex' }}
            title="AI-Act Disclaimer"
          >
            <Info size={11} color="rgba(187,134,252,0.4)" />
          </button>
        )}
      </div>
      <span style={{ fontSize: '0.9rem', color: msg.role === 'error' ? '#ff8a80' : 'var(--sovereign-alabaster)', lineHeight: 1.55 }}>
        {msg.content}
      </span>
      <AnimatePresence>
        {showDisclaimer && msg.disclaimer && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            style={{ overflow: 'hidden', marginTop: '8px', paddingTop: '8px', borderTop: '1px solid rgba(187,134,252,0.1)' }}
          >
            <p style={{ fontSize: '0.7rem', color: 'rgba(187,134,252,0.5)', margin: 0, lineHeight: 1.5 }}>
              {msg.disclaimer}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ═══════════════════════════════════════════════════════
// AI PAGE
// ═══════════════════════════════════════════════════════
export default function AI_DashboardPage() {
  const t = useTranslations('dashboard.ai');
  const { user, loading: authLoading } = useAuth();
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    { role: 'system', content: t('welcomeMessage') },
  ]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [killSwitchActive, setKillSwitchActive] = useState(false);
  const [showBoundaries, setShowBoundaries] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const activateKillSwitch = useCallback(() => {
    if (window.confirm(t('killSwitchConfirm'))) {
      setKillSwitchActive(true);
      setIsProcessing(false);
      setMessages(prev => [...prev, {
        role: 'system',
        content: `⛔ ${t('killSwitchActive')} — alle autonomen Agenten wurden gestoppt.`,
      }]);
    }
  }, [t]);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isProcessing || !user || killSwitchActive) return;

    const userText = input.trim();
    setMessages(prev => [...prev, { role: 'user', content: userText }]);
    setInput('');
    setIsProcessing(true);

    try {
      const data = await api.ai.brainstorm(userText);

      const learnedPoints = data.memories_created?.length
        ? data.memories_created
            .map((m: { key: string; value: string }) => `[Erfasst]: ${m.key} → ${m.value}`)
            .join(' | ')
        : 'Kontext erfolgreich aufgenommen.';

      const newMsg: Message = {
        role: 'system',
        content: learnedPoints,
        confidence: data.confidence,
        disclaimer: data.ai_disclaimer,
      };

      if (data.uncertainty_label) {
        newMsg.content = `${data.uncertainty_label}\n\n${newMsg.content}`;
      }

      setMessages(prev => [...prev, newMsg]);
    } catch (error: unknown) {
      const err = error as { message?: string; status?: number };
      const isAuth = err?.message?.includes('401') || err?.status === 401;
      setMessages(prev => [...prev, {
        role: 'error',
        content: isAuth ? t('sessionError') : t('connectionError'),
      }]);
    } finally {
      setIsProcessing(false);
    }
  }, [input, isProcessing, user, killSwitchActive, t]);

  if (authLoading) return null;

  // ── Not logged in ─────────────────────────────────────
  if (!user) {
    return (
      <div style={{ maxWidth: '1280px' }}>
        <header style={{ marginBottom: '40px' }}>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '8px', fontFamily: 'var(--font-space-grotesk, sans-serif)', letterSpacing: '-0.03em' }}>
            {t('title')}
          </h1>
          <p style={{ color: 'var(--sovereign-slate)', fontSize: '1.05rem', margin: 0 }}>{t('subtitle')}</p>
        </header>
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="glass-card-level-1"
          style={{ padding: '64px 48px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '24px', textAlign: 'center' }}
        >
          <div style={{ width: '64px', height: '64px', borderRadius: '20px', background: 'rgba(0,229,255,0.08)', border: '1px solid rgba(0,229,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Lock size={28} color="var(--sovereign-cyan)" />
          </div>
          <div>
            <h3 style={{ fontSize: '1.6rem', fontWeight: 800, marginBottom: '12px', letterSpacing: '-0.02em' }}>{t('notLoggedIn.title')}</h3>
            <p style={{ color: 'var(--sovereign-slate)', maxWidth: '400px', lineHeight: 1.6 }}>{t('notLoggedIn.text')}</p>
          </div>
          <Link href="/dashboard/login" className="primary-aura-button" style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none' }}>
            {t('notLoggedIn.cta')} <ChevronRight size={16} />
          </Link>
        </motion.div>
      </div>
    );
  }

  // ── Authenticated: full terminal ──────────────────────
  return (
    <div style={{ maxWidth: '1280px' }}>
      <header style={{ marginBottom: '32px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '8px', fontFamily: 'var(--font-space-grotesk, sans-serif)', letterSpacing: '-0.03em' }}>
            {t('title')}
          </h1>
          <p style={{ color: 'var(--sovereign-slate)', fontSize: '1.05rem', margin: 0 }}>{t('subtitle')}</p>
        </div>

        {/* Controls */}
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <button
            onClick={() => setShowBoundaries(v => !v)}
            className="secondary-button"
            style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', padding: '8px 14px' }}
          >
            <Settings2 size={14} />
            {t('boundaryTitle')}
          </button>

          {/* Kill-Switch — always prominent */}
          <button
            onClick={killSwitchActive ? () => { setKillSwitchActive(false); } : activateKillSwitch}
            style={{
              display: 'flex', alignItems: 'center', gap: '6px',
              padding: '8px 16px', fontSize: '0.8rem', fontWeight: 700,
              letterSpacing: '0.04em', cursor: 'pointer',
              border: killSwitchActive ? '1px solid rgba(0,229,255,0.3)' : '1px solid rgba(255,23,68,0.4)',
              background: killSwitchActive ? 'rgba(0,229,255,0.06)' : 'rgba(255,23,68,0.08)',
              color: killSwitchActive ? 'var(--sovereign-cyan)' : 'var(--sovereign-riskred)',
              borderRadius: '8px', transition: 'all 0.2s',
            }}
          >
            {killSwitchActive ? <Power size={14} /> : <PowerOff size={14} />}
            {killSwitchActive ? t('killSwitchReset') : t('killSwitch')}
          </button>
        </div>
      </header>

      {/* Boundary Conditions Panel */}
      <AnimatePresence>
        {showBoundaries && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            style={{ overflow: 'hidden', marginBottom: '20px' }}
          >
            <div className="glass-card-level-1" style={{ padding: '20px 24px', border: '1px solid rgba(187,134,252,0.15)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
                <Shield size={16} color="var(--sovereign-purple)" />
                <h4 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 700, color: 'var(--sovereign-purple)' }}>
                  {t('boundaryTitle')}
                </h4>
                <span style={{ fontSize: '0.7rem', color: 'var(--sovereign-slate)' }}>— {t('boundaryDesc')}</span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '10px' }}>
                {[
                  { label: 'Max. Ausgabe pro Aktion', value: '€500', editable: true },
                  { label: 'Biometrie bei HIGH-Risk', value: 'Aktiv', editable: false },
                  { label: 'Automatische Kündigung', value: 'Nur mit Bestätigung', editable: false },
                  { label: 'KI-Modell', value: 'Gemini 2.5 Flash', editable: false },
                ].map(b => (
                  <div key={b.label} style={{ padding: '10px 14px', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--sovereign-glass-border)', borderRadius: '10px' }}>
                    <p style={{ fontSize: '0.65rem', color: 'var(--sovereign-slate)', margin: '0 0 4px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{b.label}</p>
                    <p style={{ fontSize: '0.88rem', fontWeight: 700, margin: 0, color: 'var(--sovereign-alabaster)' }}>{b.value}</p>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Kill-Switch Banner */}
      <KillSwitchBanner active={killSwitchActive} onReset={() => setKillSwitchActive(false)} t={t} />

      {/* Terminal */}
      <motion.div
        initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
        className="glass-card-level-1"
        style={{ padding: '24px' }}
      >
        {/* Terminal header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', paddingBottom: '12px', borderBottom: '1px solid var(--sovereign-silver)' }}>
          <span style={{ fontFamily: 'var(--font-jetbrains, monospace)', color: 'var(--sovereign-cyan)', fontSize: '0.8rem' }}>
            {t('terminalLabel')}
          </span>
          <span style={{
            padding: '3px 10px', fontSize: '0.65rem', letterSpacing: '0.06em',
            fontFamily: 'var(--font-jetbrains, monospace)',
            color: isProcessing ? 'var(--sovereign-cyan)' : killSwitchActive ? 'var(--sovereign-riskred)' : 'var(--sovereign-slate)',
            border: `1px solid ${isProcessing ? 'rgba(0,229,255,0.3)' : killSwitchActive ? 'rgba(255,23,68,0.3)' : 'var(--sovereign-silver)'}`,
          }}>
            {isProcessing ? t('statusProcessing') : killSwitchActive ? '⛔ KILL-SWITCH AKTIV' : t('statusReady')}
          </span>
        </div>

        {/* Messages */}
        <div style={{ maxHeight: '420px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '20px', paddingRight: '4px' }}>
          <AnimatePresence initial={false}>
            {messages.map((msg, i) => (
              <MessageBubble key={i} msg={msg} />
            ))}
          </AnimatePresence>
          {isProcessing && (
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              style={{ alignSelf: 'flex-start', padding: '10px 16px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.04)', borderRadius: '14px' }}
            >
              <span style={{ fontSize: '0.85rem', color: 'var(--sovereign-slate)', fontFamily: 'var(--font-jetbrains, monospace)' }}>
                ▋▋▋
              </span>
            </motion.div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '10px' }}>
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder={killSwitchActive ? '⛔ Kill-Switch aktiv — Eingabe deaktiviert' : t('inputPlaceholder')}
            disabled={isProcessing || killSwitchActive}
            className="sovereign-input"
            aria-label="Nachricht an den Senate"
            style={{ opacity: killSwitchActive ? 0.4 : 1 }}
          />
          <button
            type="submit"
            className="primary-aura-button"
            disabled={isProcessing || killSwitchActive || !input.trim()}
            style={{ display: 'flex', alignItems: 'center', gap: '6px', whiteSpace: 'nowrap' }}
          >
            <Zap size={14} />
            {isProcessing ? t('processing') : t('send')}
          </button>
        </form>

        {/* EU AI Act disclaimer — always visible */}
        <div style={{ marginTop: '14px', display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
          <AlertTriangle size={11} color="rgba(187,134,252,0.35)" style={{ flexShrink: 0, marginTop: 2 }} />
          <p style={{ fontSize: '0.68rem', color: 'rgba(255,255,255,0.22)', margin: 0, lineHeight: 1.5 }}>
            {t('disclaimer')}
          </p>
        </div>
      </motion.div>
    </div>
  );
}
