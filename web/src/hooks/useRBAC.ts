'use client';

import { useEffect, useState } from 'react';
import { useAuth } from './useAuth';

export type Tier = 'FREE' | 'PRO' | 'SHIELD';

// Scope hierarchy:
//   platform:*   — platform-wide admin (internal only)
//   tenant:*     — tenant-level roles (admin, marketing, viewer)
//   user:*       — per-user capabilities (read, write, export, ai)
export type Scope =
  | 'platform:admin'
  | 'tenant:admin'
  | 'tenant:marketing'
  | 'tenant:viewer'
  | 'user:read'
  | 'user:write'
  | 'user:export'
  | 'user:ai'
  | 'user:biometric';

interface RBACState {
  tier: Tier;
  scopes: Scope[];
  isLoading: boolean;
  hasScope: (scope: Scope) => boolean;
  hasTier: (required: Tier) => boolean;
}

const TIER_RANK: Record<Tier, number> = { FREE: 0, PRO: 1, SHIELD: 2 };

// Default scopes granted per tier (server is authoritative — this is UI-only)
const TIER_SCOPES: Record<Tier, Scope[]> = {
  FREE: ['user:read', 'user:write'],
  PRO: ['user:read', 'user:write', 'user:export', 'user:ai'],
  SHIELD: ['user:read', 'user:write', 'user:export', 'user:ai', 'user:biometric'],
};

export function useRBAC(): RBACState {
  const { user, loading } = useAuth();
  const [tier, setTier] = useState<Tier>('FREE');
  const [extraScopes, setExtraScopes] = useState<Scope[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (loading) return;
    if (!user) {
      setTier('FREE');
      setExtraScopes([]);
      setIsLoading(false);
      return;
    }

    // Read tier from Firebase custom claims (token) — never from localStorage
    user.getIdTokenResult(false).then((result) => {
      const claimTier = (result.claims?.tier as Tier) ?? 'FREE';
      const claimScopes = (result.claims?.scopes as Scope[]) ?? [];
      setTier(claimTier);
      setExtraScopes(claimScopes);
    }).catch(() => {
      setTier('FREE');
    }).finally(() => {
      setIsLoading(false);
    });
  }, [user, loading]);

  const scopes: Scope[] = [...(TIER_SCOPES[tier] ?? []), ...extraScopes];

  const hasScope = (scope: Scope): boolean => {
    // platform:admin has all scopes
    if (scopes.includes('platform:admin')) return true;
    // tenant:admin has all tenant + user scopes
    if (scopes.includes('tenant:admin') && !scope.startsWith('platform:')) return true;
    return scopes.includes(scope);
  };

  const hasTier = (required: Tier): boolean => {
    return TIER_RANK[tier] >= TIER_RANK[required];
  };

  return { tier, scopes, isLoading, hasScope, hasTier };
}
