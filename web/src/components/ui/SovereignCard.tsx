'use client';

import { motion } from 'framer-motion';
import type { ReactNode, CSSProperties } from 'react';

export type CardVariant = 'default' | 'elevated' | 'glass' | 'danger';

interface SovereignCardProps {
  children: ReactNode;
  variant?: CardVariant;
  glow?: boolean;
  onClick?: () => void;
  className?: string;
  style?: CSSProperties;
  animate?: boolean;
  padding?: string;
}

const variantStyles: Record<CardVariant, CSSProperties> = {
  default: {
    background: 'var(--s-surface)',
    border: '1px solid var(--s-border)',
    boxShadow: 'var(--s-shadow)',
  },
  elevated: {
    background: 'var(--sovereign-surface-elevated, #0F1E35)',
    border: '1px solid var(--s-border-strong)',
    boxShadow: '0 4px 24px rgba(0,0,0,0.5)',
  },
  glass: {
    background: 'rgba(10,22,40,0.72)',
    backdropFilter: 'blur(20px) saturate(180%)',
    border: '1px solid rgba(255,255,255,0.08)',
    boxShadow: 'var(--s-shadow)',
  },
  danger: {
    background: 'rgba(255,23,68,0.04)',
    border: '1px solid rgba(255,23,68,0.18)',
    boxShadow: '0 0 24px rgba(255,23,68,0.06)',
  },
};

export function SovereignCard({
  children,
  variant = 'default',
  glow = false,
  onClick,
  className,
  style,
  animate = true,
  padding = '24px',
}: SovereignCardProps) {
  const base: CSSProperties = {
    borderRadius: 'var(--s-radius-md, 16px)',
    padding,
    position: 'relative',
    overflow: 'hidden',
    transition: 'border-color 0.2s, box-shadow 0.2s',
    cursor: onClick ? 'pointer' : undefined,
    ...variantStyles[variant],
    ...(glow ? { boxShadow: `${variantStyles[variant].boxShadow ?? ''}, var(--s-glow)` } : {}),
    ...style,
  };

  const content = (
    <div style={base} className={className} onClick={onClick}>
      {children}
    </div>
  );

  if (!animate) return content;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      style={base}
      className={className}
      onClick={onClick}
      whileHover={onClick ? { scale: 1.005 } : undefined}
    >
      {children}
    </motion.div>
  );
}
