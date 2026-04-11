'use client';

import { useRBAC } from '@/hooks/useRBAC';
import { useRequireAuth } from '@/hooks/useRequireAuth';
import { useTranslations } from 'next-intl';
import { usePathname, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ShieldAlert, Users, Lock, FileSearch, Activity, ArrowLeft, Gavel, HeartPulse } from 'lucide-react';

// ─── Access Denied ────────────────────────────────────────────────────────────

function AccessDenied({ t }: { t: ReturnType<typeof useTranslations> }) {
  const router = useRouter();
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', textAlign: 'center', padding: '2rem' }}
    >
      <div style={{ width: '72px', height: '72px', borderRadius: '50%', background: 'rgba(255,23,68,0.08)', border: '1px solid rgba(255,23,68,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
        <Lock size={32} color="var(--sovereign-riskred)" />
      </div>
      <h2 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: '1rem', letterSpacing: '-0.03em' }}>
        {t('accessDenied.title')}
      </h2>
      <p style={{ color: 'var(--sovereign-slate)', fontSize: '1rem', maxWidth: '400px', lineHeight: 1.6, marginBottom: '2rem' }}>
        {t('accessDenied.desc')}
      </p>
      <button
        className="secondary-button"
        style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
        onClick={() => router.push('/dashboard')}
      >
        <ArrowLeft size={14} /> {t('accessDenied.back')}
      </button>
    </motion.div>
  );
}

// ─── Admin Nav ────────────────────────────────────────────────────────────────

const NAV_ITEMS: Array<{ key: string; href: string; icon: React.ElementType; exact?: boolean }> = [
  { key: 'tenants', href: '/dashboard/admin', icon: Users, exact: true },
  { key: 'senate', href: '/dashboard/admin/senate', icon: Gavel },
  { key: 'health', href: '/dashboard/admin/health', icon: HeartPulse },
  { key: 'security', href: '/dashboard/admin/security', icon: ShieldAlert },
  { key: 'aiAudit', href: '/dashboard/admin/ai-audit', icon: FileSearch },
  { key: 'slo', href: '/dashboard/admin/slo', icon: Activity },
];

function AdminNav({ t }: { t: ReturnType<typeof useTranslations> }) {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <nav style={{ display: 'flex', gap: '4px', marginBottom: '32px', flexWrap: 'wrap' }}>
      {NAV_ITEMS.map(({ key, href, icon: Icon, exact }) => {
        const active = exact ? pathname === href : pathname.startsWith(href);
        return (
          <button
            key={key}
            onClick={() => router.push(href)}
            style={{
              display: 'flex', alignItems: 'center', gap: '7px',
              padding: '8px 16px', border: 'none', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 600,
              background: active ? 'rgba(255,23,68,0.12)' : 'rgba(255,255,255,0.04)',
              color: active ? 'var(--sovereign-riskred)' : 'var(--sovereign-slate)',
              borderBottom: active ? '2px solid var(--sovereign-riskred)' : '2px solid transparent',
              transition: 'all 0.15s',
            }}
          >
            <Icon size={14} />
            {t(`nav.${key}`)}
          </button>
        );
      })}
    </nav>
  );
}

// ─── Layout ───────────────────────────────────────────────────────────────────

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const t = useTranslations('dashboard.admin');
  const { hasScope, isLoading } = useRBAC();
  const { loading: authLoading } = useRequireAuth();

  if (isLoading || authLoading) return null;

  if (!hasScope('platform:admin')) return <AccessDenied t={t} />;

  return (
    <div style={{ maxWidth: '1400px' }}>
      {/* Admin header bar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px', padding: '10px 16px', background: 'rgba(255,23,68,0.04)', border: '1px solid rgba(255,23,68,0.15)' }}>
        <ShieldAlert size={18} color="var(--sovereign-riskred)" />
        <div>
          <span style={{ fontFamily: 'var(--font-jetbrains, monospace)', fontSize: '0.58rem', letterSpacing: '0.14em', color: 'var(--sovereign-riskred)', textTransform: 'uppercase' }}>
            {t('title')}
          </span>
          <p style={{ margin: 0, fontSize: '0.78rem', color: 'var(--sovereign-slate)' }}>{t('subtitle')}</p>
        </div>
      </div>

      <AdminNav t={t} />

      {children}
    </div>
  );
}
