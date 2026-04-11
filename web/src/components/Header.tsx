'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { Bell, ChevronDown, LogOut, Settings, User, Menu } from 'lucide-react';
import { signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useAuth } from '@/hooks/useAuth';
import { useUiStore } from '@/stores/uiStore';

// ─── Breadcrumb map ──────────────────────────────────────────────────────────

const ROUTE_LABELS: Record<string, string> = {
  '/dashboard':           'Overview',
  '/dashboard/terminal':  'Twin Terminal',
  '/dashboard/contracts': 'Verträge',
  '/dashboard/finance':   'Finance Guardian',
  '/dashboard/cases':     'Life-Cases',
  '/dashboard/vault':     'Family Vault',
  '/dashboard/approvals': 'Genehmigungen',
  '/dashboard/billing':   'Abrechnung',
  '/dashboard/settings':  'Einstellungen',
  '/dashboard/admin':     'Platform Admin',
};

function useBreadcrumb() {
  const pathname = usePathname();
  const segments = pathname.split('/').filter(Boolean);
  const crumbs: { label: string; href: string }[] = [];
  let path = '';
  for (const seg of segments) {
    path += `/${seg}`;
    const label = ROUTE_LABELS[path] ?? seg.charAt(0).toUpperCase() + seg.slice(1);
    crumbs.push({ label, href: path });
  }
  return crumbs;
}

// ─── Component ───────────────────────────────────────────────────────────────

interface HeaderProps {
  pendingApprovals?: number;
}

export function Header({ pendingApprovals = 0 }: HeaderProps) {
  const { user } = useAuth();
  const router = useRouter();
  const crumbs = useBreadcrumb();
  const toggleSidebar = useUiStore((s) => s.toggleSidebar);
  const [menuOpen, setMenuOpen] = useState(false);

  const displayName = user?.displayName || user?.email?.split('@')[0] || 'User';
  const initial = displayName.charAt(0).toUpperCase();

  const handleLogout = async () => {
    if (auth) await signOut(auth);
    router.push('/dashboard/login');
  };

  return (
    <header style={{
      display: 'flex',
      alignItems: 'center',
      gap: '16px',
      padding: '14px 32px',
      borderBottom: '1px solid var(--s-border)',
      background: 'rgba(8,14,26,0.85)',
      backdropFilter: 'blur(12px)',
      position: 'sticky',
      top: 0,
      zIndex: 40,
    }}>
      {/* Sidebar toggle (mobile) */}
      <button
        onClick={toggleSidebar}
        style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--s-text-muted)', display: 'none', padding: 4 }}
        className="header-menu-btn"
      >
        <Menu size={20} />
      </button>

      {/* Breadcrumb */}
      <nav style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '6px' }} aria-label="Breadcrumb">
        {crumbs.map((crumb, i) => (
          <span key={crumb.href} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            {i > 0 && <span style={{ color: 'var(--s-text-faint)', fontSize: '0.75rem' }}>/</span>}
            {i === crumbs.length - 1 ? (
              <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--s-text)' }}>{crumb.label}</span>
            ) : (
              <Link href={crumb.href} style={{ fontSize: '0.85rem', color: 'var(--s-text-muted)', textDecoration: 'none' }}>
                {crumb.label}
              </Link>
            )}
          </span>
        ))}
      </nav>

      {/* Notification bell */}
      <button
        onClick={() => router.push('/dashboard/approvals')}
        style={{ position: 'relative', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--s-text-muted)', padding: 6, borderRadius: 8, display: 'flex' }}
      >
        <Bell size={18} />
        {pendingApprovals > 0 && (
          <span style={{
            position: 'absolute', top: 2, right: 2,
            width: 16, height: 16, borderRadius: '50%',
            background: 'var(--sovereign-riskred)',
            fontSize: '0.6rem', fontWeight: 800,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: 'white', lineHeight: 1,
          }}>
            {pendingApprovals > 9 ? '9+' : pendingApprovals}
          </span>
        )}
      </button>

      {/* User menu */}
      <div style={{ position: 'relative' }}>
        <button
          onClick={() => setMenuOpen((o) => !o)}
          style={{
            display: 'flex', alignItems: 'center', gap: '8px',
            background: 'rgba(255,255,255,0.04)', border: '1px solid var(--s-border)',
            borderRadius: '10px', padding: '6px 10px', cursor: 'pointer', color: 'var(--s-text)',
          }}
        >
          <div style={{
            width: 28, height: 28, borderRadius: '8px',
            background: 'linear-gradient(135deg, rgba(0,212,255,0.2), rgba(187,134,252,0.2))',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '0.8rem', fontWeight: 700, color: 'var(--sovereign-cyan)',
          }}>
            {initial}
          </div>
          <span style={{ fontSize: '0.82rem', fontWeight: 600, maxWidth: 120, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {displayName}
          </span>
          <ChevronDown size={14} style={{ color: 'var(--s-text-muted)', transform: menuOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
        </button>

        {menuOpen && (
          <>
            <div style={{ position: 'fixed', inset: 0, zIndex: 49 }} onClick={() => setMenuOpen(false)} />
            <div style={{
              position: 'absolute', right: 0, top: '110%', zIndex: 50,
              background: 'var(--s-surface)', border: '1px solid var(--s-border)',
              borderRadius: '12px', padding: '6px', minWidth: 180,
              boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
            }}>
              {[
                { icon: User,     label: 'Profil',        href: '/dashboard/settings' },
                { icon: Settings, label: 'Einstellungen', href: '/dashboard/settings' },
              ].map(({ icon: Icon, label, href }) => (
                <button
                  key={label}
                  onClick={() => { router.push(href); setMenuOpen(false); }}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '10px',
                    width: '100%', padding: '9px 12px', background: 'none',
                    border: 'none', borderRadius: '8px', cursor: 'pointer',
                    color: 'var(--s-text)', fontSize: '0.85rem', textAlign: 'left',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(255,255,255,0.04)')}
                  onMouseLeave={(e) => (e.currentTarget.style.background = 'none')}
                >
                  <Icon size={15} color="var(--s-text-muted)" /> {label}
                </button>
              ))}
              <div style={{ height: 1, background: 'var(--s-divider)', margin: '4px 0' }} />
              <button
                onClick={handleLogout}
                style={{
                  display: 'flex', alignItems: 'center', gap: '10px',
                  width: '100%', padding: '9px 12px', background: 'none',
                  border: 'none', borderRadius: '8px', cursor: 'pointer',
                  color: 'var(--sovereign-riskred)', fontSize: '0.85rem', textAlign: 'left',
                }}
              >
                <LogOut size={15} /> Abmelden
              </button>
            </div>
          </>
        )}
      </div>
    </header>
  );
}
