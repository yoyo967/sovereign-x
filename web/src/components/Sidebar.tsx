'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard, Terminal, FileText, Wallet, ShieldCheck,
  CheckCircle, CreditCard, Lock, Settings, Zap, Shield,
  ShieldAlert, Users, Activity, ChevronLeft, ChevronRight,
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useRBAC } from '@/hooks/useRBAC';
import { useUiStore } from '@/stores/uiStore';

// ─── Types ───────────────────────────────────────────────────────────────────

interface NavItem {
  name: string;
  href: string;
  icon: React.ElementType;
  exact?: boolean;
}

// ─── Navigation config ───────────────────────────────────────────────────────

const NAV_ITEMS: NavItem[] = [
  { name: 'Overview',          href: '/dashboard',             icon: LayoutDashboard, exact: true },
  { name: 'Twin Terminal',     href: '/dashboard/terminal',    icon: Terminal },
  { name: 'Verträge',          href: '/dashboard/contracts',   icon: FileText },
  { name: 'Finance Guardian',  href: '/dashboard/finance',     icon: Wallet },
  { name: 'Genehmigungen',     href: '/dashboard/approvals',   icon: CheckCircle },
  { name: 'Life-Cases',        href: '/dashboard/cases',       icon: ShieldCheck },
  { name: 'Family Vault',      href: '/dashboard/vault',       icon: Users },
  { name: 'Abrechnung',        href: '/dashboard/billing',     icon: CreditCard },
  { name: 'Einstellungen',     href: '/dashboard/settings',    icon: Settings },
];

const ADMIN_ITEMS: NavItem[] = [
  { name: 'Tenants',           href: '/dashboard/admin',       icon: ShieldAlert, exact: true },
  { name: 'Senate Queue',      href: '/dashboard/admin/senate',icon: Lock },
  { name: 'System Health',     href: '/dashboard/admin/health',icon: Activity },
];

// ─── Helpers ─────────────────────────────────────────────────────────────────

function isActive(href: string, pathname: string, exact?: boolean) {
  return exact ? pathname === href : pathname.startsWith(href);
}

// ─── NavLink ─────────────────────────────────────────────────────────────────

function NavLink({ item, collapsed, admin }: { item: NavItem; collapsed: boolean; admin?: boolean }) {
  const pathname = usePathname();
  const active = isActive(item.href, pathname, item.exact);
  const Icon = item.icon;
  const accent = admin ? 'var(--sovereign-riskred)' : 'var(--sovereign-cyan)';
  const activeGlow = admin ? 'rgba(255,23,68,0.08)' : 'rgba(0,212,255,0.08)';

  return (
    <Link
      href={item.href}
      title={collapsed ? item.name : undefined}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: collapsed ? 0 : '10px',
        padding: collapsed ? '10px' : '9px 12px',
        borderRadius: '10px',
        textDecoration: 'none',
        fontSize: '0.85rem',
        fontWeight: active ? 600 : 400,
        color: active ? accent : 'var(--s-text-muted)',
        background: active ? activeGlow : 'transparent',
        borderLeft: `2px solid ${active ? accent : 'transparent'}`,
        transition: 'all 0.15s',
        overflow: 'hidden',
        justifyContent: collapsed ? 'center' : 'flex-start',
        marginBottom: 2,
      }}
      onMouseEnter={(e) => { if (!active) e.currentTarget.style.background = 'rgba(255,255,255,0.03)'; }}
      onMouseLeave={(e) => { if (!active) e.currentTarget.style.background = 'transparent'; }}
    >
      <Icon size={17} style={{ flexShrink: 0 }} />
      {!collapsed && <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.name}</span>}
    </Link>
  );
}

// ─── Section label ────────────────────────────────────────────────────────────

function SectionLabel({ label, collapsed, color = 'var(--s-text-faint)' }: { label: string; collapsed: boolean; color?: string }) {
  if (collapsed) return <div style={{ height: 1, background: 'var(--s-divider)', margin: '12px 8px' }} />;
  return (
    <p style={{
      fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase',
      color, padding: '0 14px', margin: '16px 0 8px',
    }}>
      {label}
    </p>
  );
}

// ─── Main Sidebar ─────────────────────────────────────────────────────────────

export default function Sidebar() {
  const { user } = useAuth();
  const { tier, hasScope } = useRBAC();
  const { sidebarCollapsed, toggleSidebar } = useUiStore();
  const collapsed = sidebarCollapsed;

  const isPlatformAdmin = hasScope('platform:admin');
  const displayName = user?.displayName || user?.email?.split('@')[0] || 'User';
  const initial = displayName.charAt(0).toUpperCase();

  const tierColor = tier === 'SHIELD' ? 'var(--sovereign-purple)' : tier === 'PRO' ? 'var(--sovereign-cyan)' : 'var(--s-text-faint)';
  const tierBg    = tier === 'SHIELD' ? 'rgba(187,134,252,0.08)' : tier === 'PRO' ? 'rgba(0,212,255,0.08)' : 'rgba(255,255,255,0.04)';

  const sidebarWidth = collapsed ? 64 : 260;

  return (
    <aside
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        height: '100vh',
        width: sidebarWidth,
        background: 'linear-gradient(180deg, rgba(8,14,26,0.98) 0%, rgba(6,11,21,0.98) 100%)',
        borderRight: '1px solid var(--s-border)',
        backdropFilter: 'blur(20px)',
        display: 'flex',
        flexDirection: 'column',
        zIndex: 50,
        transition: 'width 0.25s cubic-bezier(0.4,0,0.2,1)',
        overflow: 'hidden',
      }}
    >
      {/* Brand */}
      <div style={{ padding: collapsed ? '20px 14px' : '20px 18px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--s-divider)', flexShrink: 0 }}>
        {!collapsed && (
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none', color: 'inherit', flex: 1, minWidth: 0 }}>
            <div style={{ width: 30, height: 30, borderRadius: '9px', background: 'linear-gradient(135deg, var(--sovereign-cyan), var(--sovereign-purple))', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 14px rgba(0,212,255,0.2)', flexShrink: 0 }}>
              <Zap size={15} color="white" />
            </div>
            <div style={{ minWidth: 0 }}>
              <p style={{ margin: 0, fontSize: '0.9rem', fontWeight: 800, letterSpacing: '-0.02em', fontFamily: 'var(--font-space-grotesk, sans-serif)' }}>SOVEREIGN</p>
              <p style={{ margin: 0, fontSize: '0.58rem', color: 'var(--s-text-faint)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Autonomous Life-OS</p>
            </div>
          </Link>
        )}
        {collapsed && (
          <div style={{ width: 30, height: 30, borderRadius: '9px', background: 'linear-gradient(135deg, var(--sovereign-cyan), var(--sovereign-purple))', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto' }}>
            <Zap size={15} color="white" />
          </div>
        )}
        <button
          onClick={toggleSidebar}
          style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid var(--s-border)', borderRadius: '7px', cursor: 'pointer', color: 'var(--s-text-muted)', padding: '4px 6px', display: 'flex', flexShrink: 0, marginLeft: collapsed ? 'auto' : '8px' }}
          title={collapsed ? 'Sidebar ausklappen' : 'Sidebar einklappen'}
        >
          {collapsed ? <ChevronRight size={13} /> : <ChevronLeft size={13} />}
        </button>
      </div>

      {/* Navigation */}
      <nav style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden', padding: '8px 8px', scrollbarWidth: 'none' }}>
        <SectionLabel label="Navigation" collapsed={collapsed} />

        {NAV_ITEMS.map((item) => (
          <NavLink key={item.href} item={item} collapsed={collapsed} />
        ))}

        {/* Platform Admin section */}
        {isPlatformAdmin && (
          <>
            <SectionLabel label="Platform" collapsed={collapsed} color="rgba(255,23,68,0.5)" />
            {ADMIN_ITEMS.map((item) => (
              <NavLink key={item.href} item={item} collapsed={collapsed} admin />
            ))}
          </>
        )}
      </nav>

      {/* User card */}
      <div style={{ padding: collapsed ? '12px 8px' : '12px 14px', borderTop: '1px solid var(--s-divider)', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: collapsed ? 0 : '10px', justifyContent: collapsed ? 'center' : 'flex-start' }}>
          <div style={{ width: 32, height: 32, borderRadius: '9px', background: 'rgba(0,212,255,0.1)', border: '1px solid rgba(0,212,255,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', fontWeight: 700, color: 'var(--sovereign-cyan)', flexShrink: 0 }}>
            {initial}
          </div>
          {!collapsed && (
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ margin: 0, fontSize: '0.8rem', fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{displayName}</p>
              <p style={{ margin: 0, fontSize: '0.65rem', color: 'var(--s-text-faint)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user?.email ?? ''}</p>
            </div>
          )}
          {!collapsed && (
            <span style={{ fontSize: '0.6rem', fontWeight: 800, letterSpacing: '0.08em', textTransform: 'uppercase', padding: '3px 7px', borderRadius: '5px', background: tierBg, color: tierColor, border: `1px solid ${tierColor}30`, flexShrink: 0 }}>
              <Shield size={9} style={{ display: 'inline', marginRight: 3, verticalAlign: 'middle' }} />
              {tier}
            </span>
          )}
        </div>
      </div>
    </aside>
  );
}
