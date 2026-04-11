'use client';

interface ConfidenceBadgeProps {
  score: number; // 0.0 – 1.0
  showPercent?: boolean;
  size?: 'sm' | 'md';
}

function getConfig(score: number) {
  if (score >= 0.7) return { color: 'var(--sovereign-success, #00E676)', label: 'SICHER',  bg: 'rgba(0,230,118,0.08)' };
  if (score >= 0.5) return { color: 'var(--sovereign-cyan)',              label: 'GUT',     bg: 'rgba(0,212,255,0.08)' };
  if (score >= 0.3) return { color: '#FFD600',                            label: 'UNSICHER', bg: 'rgba(255,214,0,0.08)' };
  return              { color: 'var(--sovereign-riskred)',              label: 'NIEDRIG', bg: 'rgba(255,23,68,0.10)' };
}

export function ConfidenceBadge({ score, showPercent = true, size = 'md' }: ConfidenceBadgeProps) {
  const { color, label, bg } = getConfig(score);
  const fontSize = size === 'sm' ? '0.6rem' : '0.68rem';
  const padding = size === 'sm' ? '2px 6px' : '3px 9px';

  return (
    <span style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: '4px',
      padding,
      borderRadius: '4px',
      background: bg,
      border: `1px solid ${color}30`,
      color,
      fontSize,
      fontFamily: 'var(--font-mono, monospace)',
      letterSpacing: '0.06em',
      fontWeight: 700,
      textTransform: 'uppercase',
      whiteSpace: 'nowrap',
    }}>
      {showPercent ? `${Math.round(score * 100)}%` : label}
    </span>
  );
}
