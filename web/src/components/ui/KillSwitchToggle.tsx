'use client';

import { ShieldOff, Shield } from 'lucide-react';

interface KillSwitchToggleProps {
  active: boolean;
  onToggle: (active: boolean) => void;
  disabled?: boolean;
}

export function KillSwitchToggle({ active, onToggle, disabled = false }: KillSwitchToggleProps) {
  const handleClick = () => {
    if (disabled) return;
    const msg = active
      ? 'KI-Agenten wieder aktivieren? Sie können dann wieder autonom handeln.'
      : 'ALLE KI-Agenten sofort stoppen? Keine autonomen Aktionen mehr bis zur Reaktivierung.';
    if (!window.confirm(msg)) return;
    onToggle(!active);
  };

  return (
    <button
      onClick={handleClick}
      disabled={disabled}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '10px',
        padding: '10px 20px',
        borderRadius: '10px',
        border: active
          ? '1px solid rgba(255,23,68,0.5)'
          : '1px solid rgba(0,212,255,0.3)',
        background: active
          ? 'rgba(255,23,68,0.12)'
          : 'rgba(0,212,255,0.06)',
        color: active ? 'var(--sovereign-riskred)' : 'var(--sovereign-cyan)',
        fontSize: '0.88rem',
        fontWeight: 700,
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.5 : 1,
        transition: 'all 0.2s',
        letterSpacing: '-0.01em',
      }}
    >
      {active ? <ShieldOff size={17} /> : <Shield size={17} />}
      {active ? 'KI-Agenten GESTOPPT — Reaktivieren' : 'Kill-Switch aktivieren'}
      <span style={{
        fontSize: '0.6rem',
        fontFamily: 'var(--font-mono)',
        letterSpacing: '0.1em',
        padding: '2px 7px',
        borderRadius: '4px',
        background: active ? 'rgba(255,23,68,0.15)' : 'rgba(0,212,255,0.1)',
        textTransform: 'uppercase',
      }}>
        {active ? 'INAKTIV' : 'AKTIV'}
      </span>
    </button>
  );
}
