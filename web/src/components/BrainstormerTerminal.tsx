'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api';
import { useAuth } from '@/hooks/useAuth';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, ChevronRight } from 'lucide-react';

export default function BrainstormerTerminal() {
  const { user, loading: authLoading } = useAuth();
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<{ role: 'system' | 'user' | 'error'; content: string }[]>([
    { role: 'system', content: 'Willkommen im Algorithmic Senate. Ich lerne deine Präferenzen und briefe die Sub-Agenten im Hintergrund.' },
  ]);
  const [isScanning, setIsScanning] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isScanning || !user) return;

    const userText = input.trim();
    setMessages((prev) => [...prev, { role: 'user', content: userText }]);
    setInput('');
    setIsScanning(true);

    try {
      const data = await api.ai.brainstorm(userText);
      const learnedPoints = data.memories_created
        ? data.memories_created
            .map((m: { key: string; value: string }) => `[Erfasst]: ${m.key} -> ${m.value}`)
            .join(' | ')
        : 'Kontext erfolgreich aufgenommen.';
      setMessages((prev) => [...prev, { role: 'system', content: learnedPoints }]);
    } catch (error: unknown) {
      console.error('Brainstormer API Error:', error);
      const err = error as { message?: string; status?: number };
      const msg =
        err?.message?.includes('401') || err?.status === 401
          ? 'Sitzung abgelaufen. Bitte neu einloggen.'
          : 'Verbindung zum Senate (Backend) fehlgeschlagen. Bitte Backend prüfen.';
      setMessages((prev) => [...prev, { role: 'error', content: msg }]);
    } finally {
      setIsScanning(false);
    }
  };

  // ── Auth loading state ─────────────────────────��────────────
  if (authLoading) {
    return (
      <div className="glass-card p-8 flex items-center justify-center min-h-[200px]">
        <div className="w-6 h-6 rounded-full border-2 border-transparent border-t-cyan animate-spin" />
      </div>
    );
  }

  // ── Not logged in: show CTA instead of broken terminal ──────
  if (!user) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card p-12 flex flex-col items-center gap-8 text-center border-cyan/20"
      >
        <div className="w-16 h-16 rounded-2xl bg-cyan/10 border border-cyan/20 flex items-center justify-center">
          <Lock size={28} className="text-cyan" />
        </div>
        <div>
          <h3 className="font-space-grotesk text-2xl font-semibold text-white mb-3">
            Senate aktivieren
          </h3>
          <p className="text-white/50 max-w-md mx-auto leading-relaxed">
            Der Algorithmic Senate lernt deine Präferenzen und brieft deine Sub-Agenten.
            Melde dich an, um den Twin live zu erleben.
          </p>
        </div>
        <Link
          href="/dashboard"
          className="flex items-center gap-2 px-8 py-3 bg-white text-black font-semibold text-sm uppercase tracking-widest hover:bg-white/90 transition-colors"
        >
          Zugang freischalten
          <ChevronRight size={16} />
        </Link>
        {/* Preview of what the terminal looks like */}
        <div className="w-full border border-white/5 rounded-xl p-4 bg-white/2 text-left opacity-40 pointer-events-none">
          <div className="font-mono text-xs text-cyan mb-3">{'// THE BRAINSTORMER (ALGORITHMIC SENATE)'}</div>
          <div className="text-white/60 text-sm mb-4 p-3 rounded-lg bg-white/5 border border-transparent">
            <span className="block text-purple text-xs uppercase tracking-wider mb-1">Senate</span>
            Willkommen im Algorithmic Senate. Ich lerne deine Präferenzen...
          </div>
          <div className="flex gap-3">
            <div className="flex-1 h-10 rounded bg-white/5 border border-white/10" />
            <div className="w-20 h-10 rounded bg-cyan/20 border border-cyan/10" />
          </div>
        </div>
      </motion.div>
    );
  }

  // ── Authenticated: full terminal ─────────────────────────────
  return (
    <div
      className="glass-card"
      style={{ padding: '24px', textAlign: 'left', marginTop: '20px' }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '20px',
          borderBottom: '1px solid var(--sovereign-silver)',
          paddingBottom: '12px',
        }}
      >
        <span style={{ fontFamily: 'var(--font-jetbrains-mono)', color: 'var(--sovereign-cyan)', fontSize: '0.85rem' }}>
          {'// THE BRAINSTORMER (ALGORITHMIC SENATE)'}
        </span>
        <span
          className="deadline-chip"
          style={{
            color: isScanning ? 'var(--sovereign-cyan)' : 'var(--sovereign-slate)',
            borderColor: isScanning ? 'var(--sovereign-cyan)' : 'var(--sovereign-silver)',
          }}
        >
          {isScanning ? 'Status: Assimilating...' : 'Status: Ready'}
        </span>
      </div>

      <div
        style={{
          fontFamily: 'var(--font-inter)',
          color: 'var(--sovereign-alabaster)',
          lineHeight: 1.6,
          marginBottom: '24px',
          maxHeight: '400px',
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
          paddingRight: '8px',
        }}
      >
        <AnimatePresence initial={false}>
          {messages.map((msg, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.3 }}
              style={{
                padding: '12px 16px',
                borderRadius: '12px',
                background:
                  msg.role === 'user'
                    ? 'rgba(0, 229, 255, 0.05)'
                    : msg.role === 'error'
                    ? 'rgba(255, 64, 129, 0.1)'
                    : 'rgba(255,255,255,0.02)',
                border:
                  msg.role === 'user'
                    ? '1px solid rgba(0, 229, 255, 0.1)'
                    : msg.role === 'error'
                    ? '1px solid rgba(255, 64, 129, 0.3)'
                    : '1px solid transparent',
                alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
                maxWidth: '90%',
              }}
            >
              <strong
                style={{
                  display: 'block',
                  fontSize: '0.7rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  marginBottom: '6px',
                  color:
                    msg.role === 'user'
                      ? 'var(--sovereign-cyan)'
                      : msg.role === 'error'
                      ? 'var(--sovereign-pink)'
                      : 'var(--sovereign-purple)',
                }}
              >
                {msg.role === 'system' ? 'Senate' : msg.role === 'error' ? 'System Error' : 'You'}
              </strong>
              <span
                style={{
                  fontSize: '0.9rem',
                  color: msg.role === 'error' ? '#ff8a80' : 'var(--sovereign-alabaster)',
                }}
              >
                {msg.content}
              </span>
            </motion.div>
          ))}
        </AnimatePresence>
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '12px' }}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Kontext-Snippet eingeben (z.B. Mein Fokus ist auf Fixkosten-Senkung)..."
          disabled={isScanning}
          className="sovereign-input"
          aria-label="Nachricht an den Senate"
        />
        <button type="submit" className="primary-aura-button" disabled={isScanning}>
          {isScanning ? 'Processing...' : 'Senden'}
        </button>
      </form>
    </div>
  );
}
