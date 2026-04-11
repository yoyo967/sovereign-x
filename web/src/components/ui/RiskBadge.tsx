'use client';

export type RiskLevel = 'low' | 'medium' | 'high' | 'critical';

interface RiskBadgeProps {
  level: RiskLevel;
  label?: string;
  size?: 'sm' | 'md';
}

const config: Record<RiskLevel, { bg: string; color: string; dot: string; defaultLabel: string }> = {
  low:      { bg: 'rgba(0,212,255,0.08)',  color: 'var(--sovereign-cyan)',    dot: 'var(--sovereign-cyan)',    defaultLabel: 'NIEDRIG' },
  medium:   { bg: 'rgba(255,214,0,0.08)',  color: '#FFD600',                  dot: '#FFD600',                  defaultLabel: 'MITTEL' },
  high:     { bg: 'rgba(255,23,68,0.10)',  color: 'var(--sovereign-riskred)', dot: 'var(--sovereign-riskred)', defaultLabel: 'HOCH' },
  critical: { bg: 'rgba(255,23,68,0.18)',  color: '#FF6B8A',                  dot: '#FF6B8A',                  defaultLabel: 'KRITISCH' },
};

export function RiskBadge({ level, label, size = 'md' }: RiskBadgeProps) {
  const c = config[level];
  const fontSize = size === 'sm' ? '0.6rem' : '0.68rem';
  const dotSize = size === 'sm' ? 5 : 6;
  const padding = size === 'sm' ? '2px 6px' : '3px 9px';

  return (
    <span style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: '5px',
      padding,
      borderRadius: '4px',
      background: c.bg,
      border: `1px solid ${c.color}30`,
      color: c.color,
      fontSize,
      fontFamily: 'var(--font-mono, monospace)',
      letterSpacing: '0.08em',
      fontWeight: 700,
      textTransform: 'uppercase',
      whiteSpace: 'nowrap',
    }}>
      <span style={{
        width: dotSize,
        height: dotSize,
        borderRadius: '50%',
        background: c.dot,
        boxShadow: `0 0 6px ${c.dot}`,
        flexShrink: 0,
      }} />
      {label ?? c.defaultLabel}
    </span>
  );
}
