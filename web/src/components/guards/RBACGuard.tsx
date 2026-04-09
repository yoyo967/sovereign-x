'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ShieldOff, Lock } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useRBAC, type Scope, type Tier } from '@/hooks/useRBAC';

interface RBACGuardProps {
  children: React.ReactNode;
  /** Require a specific permission scope */
  requiredScope?: Scope;
  /** Require a minimum tier level */
  requiredTier?: Tier;
  /** Custom fallback UI (overrides default "no access" panel) */
  fallback?: React.ReactNode;
  /** If true, render nothing instead of the fallback panel */
  silent?: boolean;
}

/**
 * RBACGuard — UI-only access control.
 * IMPORTANT: Never rely on this for security. Server-side must enforce RBAC.
 * This component only hides UI elements from users who lack permissions.
 */
export function RBACGuard({
  children,
  requiredScope,
  requiredTier,
  fallback,
  silent = false,
}: RBACGuardProps) {
  const t = useTranslations('dashboard.rbac');
  const { hasScope, hasTier, isLoading } = useRBAC();

  if (isLoading) return null;

  const scopeOk = requiredScope ? hasScope(requiredScope) : true;
  const tierOk = requiredTier ? hasTier(requiredTier) : true;
  const allowed = scopeOk && tierOk;

  if (allowed) return <>{children}</>;

  if (silent) return null;

  if (fallback) return <>{fallback}</>;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '48px 32px',
        gap: '16px',
        background: 'rgba(255,255,255,0.02)',
        border: '1px solid rgba(255,255,255,0.06)',
        borderRadius: '20px',
        textAlign: 'center',
      }}
    >
      <div style={{
        width: '56px', height: '56px', borderRadius: '50%',
        background: 'rgba(255,23,68,0.08)',
        border: '1px solid rgba(255,23,68,0.2)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        {requiredTier ? <Lock size={24} color="var(--sovereign-riskred)" /> : <ShieldOff size={24} color="var(--sovereign-riskred)" />}
      </div>
      <div>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 700, margin: '0 0 6px', color: 'var(--sovereign-alabaster)' }}>
          {requiredTier ? t('upgradeRequired') : t('noAccess')}
        </h3>
        <p style={{ fontSize: '0.85rem', color: 'var(--sovereign-slate)', margin: 0, maxWidth: '320px' }}>
          {t('noAccessText')}
        </p>
        {requiredScope && (
          <p style={{ fontSize: '0.75rem', color: 'rgba(255,23,68,0.6)', margin: '8px 0 0', fontFamily: 'var(--font-jetbrains, monospace)' }}>
            {t('requiredScope', { scope: requiredScope })}
          </p>
        )}
      </div>
    </motion.div>
  );
}

export default RBACGuard;
