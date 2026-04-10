'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard, FileText, Wallet, ShieldCheck, CheckCircle,
  CreditCard, Users, Settings, Zap, Shield, ShieldAlert,
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useRBAC } from '@/hooks/useRBAC';

function cn(...classes: (string | false | undefined)[]) {
  return classes.filter(Boolean).join(' ');
}

const NAV_ITEMS = [
  { name: 'Overview', href: '/dashboard', icon: LayoutDashboard, exact: true },
  { name: 'Brainstormer AI', href: '/dashboard/ai', icon: Zap },
  { name: 'Verträge', href: '/dashboard/contracts', icon: FileText },
  { name: 'Finanzen', href: '/dashboard/finance', icon: Wallet },
  { name: 'Genehmigungen', href: '/dashboard/approvals', icon: CheckCircle },
  { name: 'Forderungen', href: '/dashboard/claims', icon: ShieldCheck },
  { name: 'Family Vault', href: '/dashboard/family', icon: Users },
  { name: 'Abrechnung', href: '/dashboard/billing', icon: CreditCard },
  { name: 'Einstellungen', href: '/dashboard/settings', icon: Settings },
];

const ADMIN_ITEM = { name: 'Platform Admin', href: '/dashboard/admin', icon: ShieldAlert };

export default function Sidebar() {
  const pathname = usePathname();
  const { user } = useAuth();
  const { tier, hasScope } = useRBAC();

  const displayName = user?.displayName || user?.email?.split('@')[0] || 'Executive User';
  const email = user?.email || '';

  const tierLabel = tier === 'SHIELD' ? 'Shield' : tier === 'PRO' ? 'Pro' : tier === 'FREE' ? 'Free' : '…';
  const tierColor = tier === 'SHIELD' ? 'var(--sovereign-purple)' : tier === 'PRO' ? 'var(--sovereign-cyan)' : 'var(--sovereign-slate)';
  const isPlatformAdmin = hasScope('platform:admin');

  return (
    <aside className="sidebar">
      {/* ─── Brand ─── */}
      <div style={{ marginBottom: '36px', padding: '0 12px' }}>
        <Link href="/" style={{ textDecoration: 'none', color: 'inherit' }}>
          <h2 style={{
            fontSize: '1.15rem', fontWeight: 800,
            letterSpacing: '-0.02em', color: 'white',
            display: 'flex', alignItems: 'center', gap: '10px',
            fontFamily: 'var(--font-space-grotesk, sans-serif)', margin: 0,
          }}>
            <div style={{
              width: '32px', height: '32px', borderRadius: '10px',
              background: 'linear-gradient(135deg, var(--sovereign-cyan), var(--sovereign-purple))',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 0 16px rgba(0, 229, 255, 0.25)',
            }}>
              <Zap size={16} color="white" />
            </div>
            SOVEREIGN
          </h2>
        </Link>
        <p style={{
          fontSize: '0.65rem', color: 'var(--sovereign-slate)',
          margin: '6px 0 0 42px', letterSpacing: '0.1em', textTransform: 'uppercase',
        }}>
          Autonomous Life-OS
        </p>
      </div>

      {/* ─── Main Navigation ─── */}
      <nav style={{ flex: 1 }}>
        <div style={{
          fontSize: '0.65rem', fontWeight: 700, color: 'var(--sovereign-slate)',
          letterSpacing: '0.1em', textTransform: 'uppercase',
          padding: '0 16px', marginBottom: '12px',
        }}>
          Navigation
        </div>
        {NAV_ITEMS.map((item) => {
          const isActive = item.exact ? pathname === item.href : pathname.startsWith(item.href);
          const Icon = item.icon;
          return (
            <Link key={item.href} href={item.href} className={cn('nav-link', isActive && 'active')}>
              <Icon size={17} />
              <span>{item.name}</span>
            </Link>
          );
        })}

        {/* ─── Platform Admin section (platform:admin only) ─── */}
        {isPlatformAdmin && (
          <>
            <div style={{
              fontSize: '0.65rem', fontWeight: 700, color: 'rgba(255,23,68,0.5)',
              letterSpacing: '0.1em', textTransform: 'uppercase',
              padding: '0 16px', margin: '20px 0 10px',
            }}>
              Platform
            </div>
            <Link
              href={ADMIN_ITEM.href}
              className={cn('nav-link', pathname.startsWith(ADMIN_ITEM.href) && 'active')}
              style={{
                color: pathname.startsWith(ADMIN_ITEM.href) ? 'var(--sovereign-riskred)' : undefined,
                borderLeft: pathname.startsWith(ADMIN_ITEM.href) ? '2px solid var(--sovereign-riskred)' : '2px solid transparent',
              }}
            >
              <ADMIN_ITEM.icon size={17} />
              <span>{ADMIN_ITEM.name}</span>
            </Link>
          </>
        )}
      </nav>

      {/* ─── User Info ─── */}
      <div style={{ marginTop: 'auto', padding: '16px', borderTop: '1px solid var(--sovereign-silver)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '36px', height: '36px', borderRadius: '10px',
            background: 'linear-gradient(135deg, rgba(0,229,255,0.15), rgba(187,134,252,0.15))',
            border: '1px solid rgba(0,229,255,0.1)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '0.85rem', fontWeight: 700, color: 'var(--sovereign-cyan)',
          }}>
            {displayName.charAt(0).toUpperCase()}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{ fontSize: '0.82rem', fontWeight: 600, margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {displayName}
            </p>
            <p style={{ fontSize: '0.7rem', color: 'var(--sovereign-slate)', margin: '2px 0 0', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {email}
            </p>
          </div>
          <div style={{
            display: 'flex', alignItems: 'center', gap: '4px',
            padding: '4px 8px', borderRadius: '6px',
            background: tier === 'SHIELD' ? 'rgba(187,134,252,0.1)' : tier === 'PRO' ? 'rgba(0,229,255,0.1)' : 'rgba(255,255,255,0.05)',
            border: `1px solid ${tier === 'SHIELD' ? 'rgba(187,134,252,0.2)' : tier === 'PRO' ? 'rgba(0,229,255,0.2)' : 'transparent'}`,
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
