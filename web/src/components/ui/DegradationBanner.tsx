'use client';

import { useState } from 'react';
import { AlertTriangle, WifiOff, Eye, X } from 'lucide-react';

export type DegradationMode = 'normal' | 'partial' | 'read-only' | 'offline';

interface DegradationBannerProps {
  mode: DegradationMode;
}

const config: Record<Exclude<DegradationMode, 'normal'>, {
  icon: React.ElementType;
  color: string;
  bg: string;
  border: string;
  title: string;
  description: string;
}> = {
  partial: {
    icon: AlertTriangle,
    color: '#FFD600',
    bg: 'rgba(255,214,0,0.05)',
    border: 'rgba(255,214,0,0.2)',
    title: 'Eingeschränkter Betrieb',
    description: 'Einige KI-Funktionen sind vorübergehend nicht verfügbar. Autonome Aktionen werden pausiert.',
  },
  'read-only': {
    icon: Eye,
    color: 'var(--sovereign-cyan)',
    bg: 'rgba(0,212,255,0.04)',
    border: 'rgba(0,212,255,0.2)',
    title: 'Nur-Lesen-Modus',
    description: 'Das System befindet sich im Nur-Lesen-Modus. Keine Schreiboperationen möglich.',
  },
  offline: {
    icon: WifiOff,
    color: 'var(--sovereign-riskred)',
    bg: 'rgba(255,23,68,0.06)',
    border: 'rgba(255,23,68,0.25)',
    title: 'Verbindung unterbrochen',
    description: 'Keine Verbindung zum Sovereign-Backend. Daten könnten veraltet sein.',
  },
};

export function DegradationBanner({ mode }: DegradationBannerProps) {
  const [dismissed, setDismissed] = useState(false);

  if (mode === 'normal' || dismissed) return null;

  const c = config[mode];
  const Icon = c.icon;

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      padding: '10px 16px',
      background: c.bg,
      borderBottom: `1px solid ${c.border}`,
      color: c.color,
      fontSize: '0.82rem',
    }}>
      <Icon size={15} style={{ flexShrink: 0 }} />
      <span style={{ fontWeight: 700 }}>{c.title}:</span>
      <span style={{ color: 'var(--s-text-muted)', flex: 1 }}>{c.description}</span>
      <button
        onClick={() => setDismissed(true)}
        style={{ background: 'none', border: 'none', color: 'var(--s-text-faint)', cursor: 'pointer', padding: '2px', display: 'flex' }}
      >
        <X size={14} />
      </button>
    </div>
  );
}
