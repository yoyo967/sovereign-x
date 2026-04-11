'use client';

import { useEffect, useState } from 'react';
import { useRequireAuth } from '@/hooks/useRequireAuth';
import { useUiStore } from '@/stores/uiStore';
import Sidebar from '@/components/Sidebar';
import { Header } from '@/components/Header';
import { DegradationBanner } from '@/components/ui/DegradationBanner';
import OnboardingModal from '@/components/OnboardingModal';
import { api } from '@/lib/api';
import type { ReactNode } from 'react';

export default function DashboardClientLayout({ children }: { children: ReactNode }) {
  const { user, loading } = useRequireAuth();
  const degradationMode = useUiStore((s) => s.degradationMode);
  const sidebarCollapsed = useUiStore((s) => s.sidebarCollapsed);

  const [pendingApprovals, setPendingApprovals] = useState(0);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [onboardingChecked, setOnboardingChecked] = useState(false);

  const sidebarWidth = sidebarCollapsed ? 64 : 260;

  useEffect(() => {
    if (!user || onboardingChecked) return;
    setOnboardingChecked(true);
    api.user.getProfile().then((profile) => {
      if (profile?._needsOnboarding) setShowOnboarding(true);
    }).catch(() => {});
  }, [user, onboardingChecked]);

  useEffect(() => {
    if (!user) return;
    api.approvals.list('PENDING').then((data) => {
      setPendingApprovals(Array.isArray(data) ? data.length : (data?.total ?? 0));
    }).catch(() => {});
  }, [user]);

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', background: 'var(--sovereign-navy, #080E1A)' }}>
        <div className="sovereign-spinner" />
      </div>
    );
  }

  if (!user) return null;

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--sovereign-navy, #080E1A)' }}>
      <Sidebar />
      <div style={{
        flex: 1,
        marginLeft: sidebarWidth,
        transition: 'margin-left 0.25s cubic-bezier(0.4,0,0.2,1)',
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        minWidth: 0,
      }}>
        <DegradationBanner mode={degradationMode} />
        <Header pendingApprovals={pendingApprovals} />
        <main id="main-content" style={{ flex: 1, padding: '32px 40px', maxWidth: '1440px', width: '100%', margin: '0 auto', boxSizing: 'border-box' }}>
          {children}
        </main>
      </div>

      {showOnboarding && user && (
        <OnboardingModal
          userEmail={user.email ?? ''}
          onComplete={() => setShowOnboarding(false)}
        />
      )}
    </div>
  );
}
