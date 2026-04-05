'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  FileText,
  Wallet,
  ShieldCheck,
  CheckCircle,
  CreditCard,
  Users,
  Settings,
  Zap,
  Shield
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { api } from '@/lib/api';

function cn(...classes: (string | false | undefined)[]) {
  return classes.filter(Boolean).join(' ');
}

const navItems = [
  { name: 'Overview', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Brainstormer AI', href: '/dashboard/ai', icon: Zap },
  { name: 'Verträge', href: '/dashboard/contracts', icon: FileText },
  { name: 'Finanzen', href: '/dashboard/finance', icon: Wallet },
  { name: 'Genehmigungen', href: '/dashboard/approvals', icon: CheckCircle },
  { name: 'Forderungen', href: '/dashboard/claims', icon: ShieldCheck },
  { name: 'Family Vault', href: '/dashboard/family', icon: Users },
  { name: 'Abrechnung', href: '/dashboard/billing', icon: CreditCard },
  { name: 'Einstellungen', href: '/dashboard/settings', icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { user } = useAuth();
  const [tier, setTier] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      api.user.getProfile().then(res => setTier(res.tier)).catch(() => setTier('FREE'));
    }
  }, [user]);

  const displayName = user?.displayName || user?.email?.split('@')[0] || 'Executive User';
  const email = user?.email || '';
  
  const tierLabel = tier === 'SHIELD' ? 'Shield' : tier === 'PRO' ? 'Pro' : tier === 'FREE' ? 'Free' : '...';
  const tierColor = tier === 'SHIELD' ? 'var(--sovereign-purple)' : tier === 'PRO' ? 'var(--sovereign-cyan)' : 'var(--sovereign-slate)';

  return (
    <aside className="sidebar">
      {/* ─── Brand ─── */}
      <div style={{ marginBottom: '36px', padding: '0 12px' }}>
        <Link href="/" style={{ textDecoration: 'none', color: 'inherit' }}>
          <h2 style={{
            fontSize: '1.15rem', fontWeight: 800,
            letterSpacing: '-0.02em', color: 'white',
            display: 'flex', alignItems: 'center', gap: '10px',
            fontFamily: 'var(--font-space-grotesk, sans-serif)',
            margin: 0
          }}>
            <div style={{
              width: '32px', height: '32px', borderRadius: '10px',
              background: 'linear-gradient(135deg, var(--sovereign-cyan), var(--sovereign-purple))',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 0 16px rgba(0, 229, 255, 0.25)'
            }}>
              <Zap size={16} color="white" />
            </div>
            SOVEREIGN
          </h2>
        </Link>
        <p style={{
          fontSize: '0.65rem', color: 'var(--sovereign-slate)',
          margin: '6px 0 0 42px',
          letterSpacing: '0.1em', textTransform: 'uppercase'
        }}>
          Autonomous Life-OS
        </p>
      </div>

      {/* ─── Navigation ─── */}
      <nav style={{ flex: 1 }}>
        <div style={{
          fontSize: '0.65rem', fontWeight: 700, color: 'var(--sovereign-slate)',
          letterSpacing: '0.1em', textTransform: 'uppercase',
          padding: '0 16px', marginBottom: '12px'
        }}>
          Navigation
        </div>
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn('nav-link', isActive && 'active')}
            >
              <Icon size={17} />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* ─── User Info ─── */}
      <div style={{
        marginTop: 'auto', padding: '16px',
        borderTop: '1px solid var(--sovereign-silver)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '36px', height: '36px', borderRadius: '10px',
            background: 'linear-gradient(135deg, rgba(0, 229, 255, 0.15), rgba(187, 134, 252, 0.15))',
            border: '1px solid rgba(0, 229, 255, 0.1)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '0.85rem', fontWeight: 700,
            color: 'var(--sovereign-cyan)'
          }}>
            {displayName.charAt(0).toUpperCase()}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{
              fontSize: '0.82rem', fontWeight: 600, margin: 0,
              whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'
            }}>
              {displayName}
            </p>
            <p style={{
              fontSize: '0.7rem', color: 'var(--sovereign-slate)', margin: '2px 0 0',
              whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'
            }}>
              {email}
            </p>
          </div>
          
          {/* Tier Badge */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: '4px',
            padding: '4px 8px', borderRadius: '6px',
            background: tier === 'SHIELD' ? 'rgba(187, 134, 252, 0.1)' : tier === 'PRO' ? 'rgba(0, 229, 255, 0.1)' : 'rgba(255,255,255,0.05)',
            border: `1px solid ${tier === 'SHIELD' ? 'rgba(187, 134, 252, 0.2)' : tier === 'PRO' ? 'rgba(0, 229, 255, 0.2)' : 'transparent'}`
          }}>
            <Shield size={10} color={tierColor} />
            <span style={{ fontSize: '0.65rem', fontWeight: 800, color: tierColor, textTransform: 'uppercase' }}>
              {tierLabel}
            </span>
          </div>

        </div>
      </div>
    </aside>
  );
}
