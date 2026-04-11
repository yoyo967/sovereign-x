'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Trash2, ChevronDown, ChevronUp, ShieldAlert, AlertCircle } from 'lucide-react';
import { api } from '@/lib/api';
import { useRBAC } from '@/hooks/useRBAC';
import { useTerminalStore } from '@/stores/terminalStore';
import { useContractStore } from '@/stores/contractStore';
import { useCaseStore } from '@/stores/caseStore';
import { SovereignCard } from '@/components/ui/SovereignCard';
import { ConfidenceBadge } from '@/components/ui/ConfidenceBadge';
import { KillSwitchToggle } from '@/components/ui/KillSwitchToggle';
import { PlanGateBadge } from '@/components/ui/PlanGateBadge';
import type { TerminalMessage } from '@/stores/terminalStore';

// ─── Risk colors ──────────────────────────────────────────────────────────────

const RISK_COLORS: Record<string, string> = {
  HIGH: '#FF1744',
  LIMITED: '#FFD600',
  MINIMAL: '#00E676',
};

// ─── Message Bubble ───────────────────────────────────────────────────────────

function MessageBubble({ msg }: { msg: TerminalMessage }) {
  const isUser = msg.role === 'user';
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      style={{ display: 'flex', justifyContent: isUser ? 'flex-end' : 'flex-start', marginBottom: '12px' }}
    >
      <div style={{
        maxWidth: '80%', borderRadius: isUser ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
        padding: '10px 14px',
        background: isUser
          ? 'linear-gradient(135deg, rgba(187,134,252,0.2), rgba(3,218,198,0.15))'
          : 'rgba(255,255,255,0.04)',
        border: `1px solid ${isUser ? 'rgba(187,134,252,0.3)' : 'rgba(255,255,255,0.08)'}`,
      }}>
        {!isUser && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
            <span style={{ fontSize: '0.6rem', fontFamily: 'var(--font-mono)', color: '#BB86FC', letterSpacing: '0.08em', textTransform: 'uppercase' }}>Senate KI</span>
            {msg.riskClass && (
              <span style={{ fontSize: '0.6rem', fontFamily: 'var(--font-mono)', padding: '1px 6px', borderRadius: 10, background: `${RISK_COLORS[msg.riskClass]}18`, color: RISK_COLORS[msg.riskClass], border: `1px solid ${RISK_COLORS[msg.riskClass]}40` }}>
                {msg.riskClass}
              </span>
            )}
            {msg.confidence != null && <ConfidenceBadge score={msg.confidence} size="sm" />}
          </div>
        )}
        <p style={{ margin: 0, fontSize: '0.88rem', lineHeight: 1.6, whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>{msg.content}</p>
        {msg.uncertainty_label && (
          <p style={{ margin: '6px 0 0', fontSize: '0.72rem', color: '#FFD600', fontStyle: 'italic' }}>{msg.uncertainty_label}</p>
        )}
        {msg.disclaimer && (
          <p style={{ margin: '6px 0 0', fontSize: '0.68rem', color: 'var(--s-text-faint)', lineHeight: 1.4, paddingTop: '6px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>{msg.disclaimer}</p>
        )}
        <p style={{ margin: '6px 0 0', fontSize: '0.6rem', color: 'var(--s-text-faint)', textAlign: isUser ? 'right' : 'left', fontFamily: 'var(--font-mono)' }}>
          {new Date(msg.timestamp).toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' })}
        </p>
      </div>
    </motion.div>
  );
}

// ─── Streaming indicator ──────────────────────────────────────────────────────

function TypingIndicator() {
  return (
    <div style={{ display: 'flex', justifyContent: 'flex-start', marginBottom: '12px' }}>
      <div style={{ padding: '10px 16px', borderRadius: '16px 16px 16px 4px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', display: 'flex', gap: '4px', alignItems: 'center' }}>
        {[0, 1, 2].map((i) => (
          <motion.div key={i} animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.2 }}
            style={{ width: 6, height: 6, borderRadius: '50%', background: '#BB86FC' }} />
        ))}
      </div>
    </div>
  );
}

// ─── Boundary Panel ───────────────────────────────────────────────────────────

function BoundaryPanel() {
  const { boundaryConditions, setBoundaryConditions, showBoundaries, setShowBoundaries } = useTerminalStore();
  const bc = boundaryConditions;

  return (
    <SovereignCard variant="glass" animate={false}>
      <button
        onClick={() => setShowBoundaries(!showBoundaries)}
        style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', background: 'none', border: 'none', color: 'var(--s-text)', cursor: 'pointer', padding: 0 }}
      >
        <span style={{ fontSize: '0.7rem', fontFamily: 'var(--font-mono)', color: 'var(--s-text-faint)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Boundary Conditions</span>
        {showBoundaries ? <ChevronUp size={16} style={{ color: 'var(--s-text-faint)' }} /> : <ChevronDown size={16} style={{ color: 'var(--s-text-faint)' }} />}
      </button>
      <AnimatePresence>
        {showBoundaries && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} style={{ overflow: 'hidden' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '14px' }}>
              {/* Max Output */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <label style={{ fontSize: '0.7rem', color: 'var(--s-text-faint)', fontFamily: 'var(--font-mono)' }}>Max. Ausgabe</label>
                  <span style={{ fontSize: '0.7rem', fontFamily: 'var(--font-mono)', color: '#BB86FC' }}>€{bc.maxOutputEur}</span>
                </div>
                <input type="range" min={0} max={5000} step={50} value={bc.maxOutputEur}
                  onChange={(e) => setBoundaryConditions({ maxOutputEur: Number(e.target.value) })}
                  style={{ width: '100%', accentColor: '#BB86FC' }} />
              </div>
              {/* Auto-Approve */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <label style={{ fontSize: '0.7rem', color: 'var(--s-text-faint)', fontFamily: 'var(--font-mono)' }}>Auto-Approve bis</label>
                  <span style={{ fontSize: '0.7rem', fontFamily: 'var(--font-mono)', color: '#03DAC6' }}>€{bc.autoApproveThresholdEur}</span>
                </div>
                <input type="range" min={0} max={500} step={10} value={bc.autoApproveThresholdEur}
                  onChange={(e) => setBoundaryConditions({ autoApproveThresholdEur: Number(e.target.value) })}
                  style={{ width: '100%', accentColor: '#03DAC6' }} />
              </div>
              {/* Confidence */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <label style={{ fontSize: '0.7rem', color: 'var(--s-text-faint)', fontFamily: 'var(--font-mono)' }}>Konfidenz-Schwelle</label>
                  <span style={{ fontSize: '0.7rem', fontFamily: 'var(--font-mono)', color: '#FFD600' }}>{(bc.confidenceThreshold * 100).toFixed(0)}%</span>
                </div>
                <input type="range" min={0} max={1} step={0.05} value={bc.confidenceThreshold}
                  onChange={(e) => setBoundaryConditions({ confidenceThreshold: Number(e.target.value) })}
                  style={{ width: '100%', accentColor: '#FFD600' }} />
              </div>
              {/* Toggles */}
              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                {[
                  { label: 'Biometrie HIGH-Risk', key: 'biometricForHighRisk' as const },
                  { label: 'Strict Privacy', key: 'strictPrivacyFilter' as const },
                ].map(({ label, key }) => (
                  <button key={key} onClick={() => setBoundaryConditions({ [key]: !bc[key] })} style={{
                    padding: '4px 12px', borderRadius: 20, fontSize: '0.7rem', fontWeight: 600,
                    background: bc[key] ? 'rgba(0,230,118,0.1)' : 'rgba(255,255,255,0.04)',
                    border: `1px solid ${bc[key] ? 'rgba(0,230,118,0.3)' : 'rgba(255,255,255,0.1)'}`,
                    color: bc[key] ? '#00E676' : 'var(--s-text-faint)',
                    cursor: 'pointer',
                  }}>{label}: {bc[key] ? 'AN' : 'AUS'}</button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </SovereignCard>
  );
}

// ─── Context Panel ────────────────────────────────────────────────────────────

function ContextPanel() {
  const { contracts } = useContractStore();
  const { cases } = useCaseStore();
  const topContracts = contracts.slice(0, 3);
  const topCases = cases.filter((c) => c.status !== 'RESOLVED').slice(0, 2);

  return (
    <SovereignCard variant="glass" animate={false}>
      <p style={{ margin: '0 0 12px', fontSize: '0.65rem', fontFamily: 'var(--font-mono)', color: 'var(--s-text-faint)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Aktiver Kontext</p>
      {topContracts.length > 0 && (
        <div style={{ marginBottom: '10px' }}>
          <p style={{ margin: '0 0 6px', fontSize: '0.65rem', color: '#BB86FC', fontFamily: 'var(--font-mono)' }}>Verträge</p>
          {topContracts.map((c) => (
            <div key={c.id} style={{ padding: '4px 8px', borderRadius: 6, background: 'rgba(187,134,252,0.06)', marginBottom: '4px' }}>
              <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--s-text-muted)' }}>{c.name ?? c.provider ?? 'Vertrag'}</p>
            </div>
          ))}
        </div>
      )}
      {topCases.length > 0 && (
        <div>
          <p style={{ margin: '0 0 6px', fontSize: '0.65rem', color: '#03DAC6', fontFamily: 'var(--font-mono)' }}>Cases</p>
          {topCases.map((c) => (
            <div key={c.id} style={{ padding: '4px 8px', borderRadius: 6, background: 'rgba(3,218,198,0.06)', marginBottom: '4px' }}>
              <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--s-text-muted)' }}>{c.title}</p>
            </div>
          ))}
        </div>
      )}
      {topContracts.length === 0 && topCases.length === 0 && (
        <p style={{ margin: 0, fontSize: '0.78rem', color: 'var(--s-text-faint)' }}>Kein Kontext geladen.</p>
      )}
    </SovereignCard>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function TerminalPage() {
  const { hasTier } = useRBAC();
  const { messages, isStreaming, killSwitchActive, addMessage, setStreaming, setKillSwitch, clearMessages } = useTerminalStore();
  const [input, setInput] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isStreaming]);

  const sendMessage = useCallback(async () => {
    const text = input.trim();
    if (!text || isStreaming || killSwitchActive) return;
    setInput('');

    const userMsg: TerminalMessage = {
      id: `u-${Date.now()}`,
      role: 'user',
      content: text,
      timestamp: new Date().toISOString(),
    };
    addMessage(userMsg);
    setStreaming(true);

    try {
      const response = await api.ai.brainstorm(text);
      const senateMsg: TerminalMessage = {
        id: `s-${Date.now()}`,
        role: 'senate',
        content: response?.response ?? response?.text ?? JSON.stringify(response),
        confidence: response?.confidence,
        riskClass: response?.risk_class,
        uncertainty_label: response?.uncertainty_label,
        disclaimer: response?.disclaimer,
        timestamp: new Date().toISOString(),
      };
      addMessage(senateMsg);
    } catch {
      addMessage({
        id: `err-${Date.now()}`,
        role: 'senate',
        content: 'Fehler beim Verarbeiten deiner Anfrage. Bitte versuche es erneut.',
        riskClass: 'MINIMAL',
        timestamp: new Date().toISOString(),
      });
    } finally {
      setStreaming(false);
    }
  }, [input, isStreaming, killSwitchActive, addMessage, setStreaming]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      void sendMessage();
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', maxWidth: 760, margin: '0 auto', height: 'calc(100vh - 140px)', minHeight: 500 }}>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h1 style={{ margin: '0 0 2px', fontSize: '1.6rem', fontWeight: 800, letterSpacing: '-0.03em' }}>Senate Terminal</h1>
          <p style={{ margin: 0, fontSize: '0.82rem', color: 'var(--s-text-muted)' }}>Direktzugang zum SOVEREIGN KI-Senat</p>
        </div>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <button onClick={clearMessages} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '6px 12px', borderRadius: 8, background: 'rgba(255,255,255,0.04)', border: '1px solid var(--s-divider)', color: 'var(--s-text-faint)', fontSize: '0.78rem', cursor: 'pointer' }}>
            <Trash2 size={14} /> Leeren
          </button>
          <KillSwitchToggle active={killSwitchActive} onToggle={setKillSwitch} />
        </div>
      </div>

      {/* Kill Switch Banner */}
      {killSwitchActive && (
        <div style={{ padding: '10px 14px', borderRadius: 10, background: 'rgba(255,23,68,0.1)', border: '1px solid rgba(255,23,68,0.3)', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <ShieldAlert size={16} style={{ color: '#FF1744', flexShrink: 0 }} />
          <p style={{ margin: 0, fontSize: '0.8rem', color: '#FF1744', fontWeight: 600 }}>KI-Aktivitäten gestoppt — Kill-Switch aktiv. Alle autonomen Aktionen sind eingefroren.</p>
        </div>
      )}

      {/* Main Layout */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 220px', gap: '16px', flex: 1, minHeight: 0 }}>

        {/* Chat Area */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', minHeight: 0 }}>
          {/* Messages */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '16px', borderRadius: 12, background: 'rgba(255,255,255,0.02)', border: '1px solid var(--s-divider)', minHeight: 0 }}>
            {messages.length === 0 && (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', gap: '12px', opacity: 0.5 }}>
                <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'linear-gradient(135deg, rgba(187,134,252,0.2), rgba(3,218,198,0.15))', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <AlertCircle size={24} style={{ color: '#BB86FC' }} />
                </div>
                <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--s-text-faint)', textAlign: 'center' }}>
                  Stelle eine Frage — z.B. "Welche Verträge kann ich kündigen?"
                </p>
              </div>
            )}
            {messages.map((msg) => <MessageBubble key={msg.id} msg={msg} />)}
            {isStreaming && <TypingIndicator />}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-end' }}>
            <textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={killSwitchActive || isStreaming}
              placeholder={killSwitchActive ? 'Kill-Switch aktiv — Eingabe gesperrt' : 'Nachricht eingeben… (Enter zum Senden)'}
              rows={2}
              style={{
                flex: 1, padding: '10px 14px', borderRadius: 10,
                background: 'rgba(255,255,255,0.04)', border: '1px solid var(--s-divider)',
                color: 'var(--s-text)', fontSize: '0.88rem', outline: 'none', resize: 'none',
                fontFamily: 'inherit', lineHeight: 1.5,
                opacity: killSwitchActive ? 0.5 : 1,
              }}
            />
            <button
              onClick={() => void sendMessage()}
              disabled={!input.trim() || isStreaming || killSwitchActive}
              style={{
                padding: '10px 16px', borderRadius: 10, border: 'none',
                background: input.trim() && !isStreaming && !killSwitchActive ? 'var(--sovereign-purple)' : 'rgba(255,255,255,0.06)',
                color: input.trim() && !isStreaming && !killSwitchActive ? '#fff' : 'var(--s-text-faint)',
                cursor: input.trim() && !isStreaming && !killSwitchActive ? 'pointer' : 'not-allowed',
                display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', fontWeight: 600,
              }}
            >
              <Send size={16} />
            </button>
          </div>

          {/* Voice / Camera — SHIELD-gated, prepared */}
          <div style={{ display: 'flex', gap: '8px' }}>
            <div style={{ flex: 1 }}>
              <PlanGateBadge required="SHIELD" featureName="Voice-Modus erfordert SHIELD">
                <button disabled style={{ width: '100%', padding: '6px', borderRadius: 8, background: 'rgba(255,255,255,0.03)', border: '1px solid var(--s-divider)', color: 'var(--s-text-faint)', fontSize: '0.72rem', cursor: 'not-allowed', opacity: 0.5 }}>
                  🎤 Voice (SHIELD)
                </button>
              </PlanGateBadge>
            </div>
            <div style={{ flex: 1 }}>
              <PlanGateBadge required="SHIELD" featureName="Kamera-Vision erfordert SHIELD">
                <button
                  onClick={() => hasTier('SHIELD') && fileInputRef.current?.click()}
                  disabled={!hasTier('SHIELD')}
                  style={{ width: '100%', padding: '6px', borderRadius: 8, background: 'rgba(255,255,255,0.03)', border: '1px solid var(--s-divider)', color: 'var(--s-text-faint)', fontSize: '0.72rem', cursor: hasTier('SHIELD') ? 'pointer' : 'not-allowed', opacity: 0.5 }}>
                  📷 {imageFile ? imageFile.name.slice(0, 20) : 'Kamera-Vision (SHIELD)'}
                </button>
              </PlanGateBadge>
              <input ref={fileInputRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={(e) => setImageFile(e.target.files?.[0] ?? null)} />
            </div>
          </div>
        </div>

        {/* Right Panel */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', overflowY: 'auto' }}>
          <ContextPanel />
          <BoundaryPanel />
        </div>
      </div>

      {/* EU AI Act Banner */}
      <div style={{ padding: '10px 14px', borderRadius: 10, background: 'rgba(255,214,0,0.04)', border: '1px solid rgba(255,214,0,0.15)' }}>
        <p style={{ margin: 0, fontSize: '0.68rem', color: 'var(--s-text-faint)', lineHeight: 1.6 }}>
          <span style={{ fontWeight: 700, color: '#FFD600' }}>EU AI Act — Art. 13 (Transparenz):</span> Dieses System ist ein KI-Assistent der Risikokategorie LIMITED. Alle Ausgaben sind maschinell generiert und müssen durch den Nutzer überprüft werden. Keine rechtliche Beratung.
        </p>
      </div>
    </div>
  );
}
