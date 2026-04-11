'use client';

import { motion } from 'framer-motion';
import type { ReactNode } from 'react';

interface EmptyStateProps {
  icon: ReactNode;
  title: string;
  description?: string;
  cta?: {
    label: string;
    onClick: () => void;
  };
}

export function EmptyState({ icon, title, description, cta }: EmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '48px 24px',
        textAlign: 'center',
        gap: '16px',
      }}
    >
      <div style={{
        width: 56,
        height: 56,
        borderRadius: '50%',
        background: 'rgba(0,212,255,0.06)',
        border: '1px solid rgba(0,212,255,0.12)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'var(--sovereign-cyan)',
      }}>
        {icon}
      </div>

      <div>
        <h3 style={{ margin: '0 0 6px', fontSize: '1rem', fontWeight: 700 }}>{title}</h3>
        {description && (
          <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--s-text-muted)', lineHeight: 1.6, maxWidth: 320 }}>
            {description}
          </p>
        )}
      </div>

      {cta && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button className="primary-aura-button" onClick={cta.onClick} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {cta.label}
            <motion.span
              animate={{ x: [0, 5, 0] }}
              transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
              style={{ display: 'inline-block' }}
            >
              →
            </motion.span>
          </button>
        </div>
      )}
    </motion.div>
  );
}
