'use client';

import { useRouter } from 'next/navigation';
import { Lock } from 'lucide-react';
import { useRBAC, type Tier } from '@/hooks/useRBAC';
import type { ReactNode } from 'react';

interface PlanGateBadgeProps {
  required: Tier;
  children: ReactNode;
  fullPage?: boolean;
  featureName?: string;
}

const TIER_LABELS: Record<Tier, string> = {
  FREE: 'Free',
  PRO: 'Pro',
  SHIELD: 'Shield',
};

const TIER_COLORS: Record<Tier, string> = {
  FREE: 'var(--sovereign-slate)',
  PRO: 'var(--sovereign-cyan)',
  SHIELD: 'var(--sovereign-purple)',
};

export function PlanGateBadge({ required, children, fullPage = false, featureName }: PlanGateBadgeProps) {
  const { hasTier, isLoading } = useRBAC();
  const router = useRouter();

  if (isLoading) return <>{children}</>;
  if (hasTier(required)) return <>{children}</>;

  const color = TIER_COLORS[required];
  const label = TIER_LABELS[required];

  if (fullPage) {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '50vh',
        textAlign: 'center',
        padding: '2rem',
        gap: '1.5rem',
      }}>
        <div style={{
          width: 64,
          height: 64,
          borderRadius: '50%',
          background: `${color}10`,
          border: `1px solid ${color}30`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <Lock size={28} color={color} />
        </div>
        <div>
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', letterSpacing: '0.14em', color, textTransform: 'uppercase', marginBottom: '0.75rem' }}>
            {label}-Funktion
          </p>
          <h3 style={{ fontSize: '1.5rem', fontWeight: 800, margin: '0 0 0.5rem', letterSpacing: '-0.02em' }}>
            {featureName ?? 'Diese Funktion'} erfordert {label}
          </h3>
          <p style={{ color: 'var(--s-text-muted)', fontSize: '0.9rem', maxWidth: 400, margin: '0 auto 1.5rem' }}>
            Upgrade auf {label}, um auf dieses Feature zugreifen zu können.
          </p>
        </div>
        <button
          className="primary-aura-button"
          onClick={() => router.push('/dashboard/billing')}
          style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
        >
          <Lock size={14} />
          Auf {label} upgraden
        </button>
      </div>
    );
  }

  return (
    <div style={{ position: 'relative', pointerEvents: 'none', userSelect: 'none', opacity: 0.45 }}>
      {children}
      <div style={{
        position: 'absolute',
        inset: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        pointerEvents: 'all',
        zIndex: 2,
      }}>
        <button
          onClick={() => router.push('/dashboard/billing')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '6px 14px',
            borderRadius: '8px',
            background: `${color}15`,
            border: `1px solid ${color}40`,
            color,
            fontSize: '0.75rem',
            fontFamily: 'var(--font-mono)',
            fontWeight: 700,
            cursor: 'pointer',
            letterSpacing: '0.06em',
          }}
        >
          <Lock size={12} />
          {label} erforderlich
        </button>
      </div>
    </div>
  );
}
