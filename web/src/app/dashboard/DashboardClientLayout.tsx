'use client';

import React, { useState, useEffect } from 'react';
import Sidebar from '@/components/Sidebar';
import OnboardingModal from '@/components/OnboardingModal';
import { useRequireAuth } from '@/hooks/useRequireAuth';
import { api } from '@/lib/api';
import { motion } from 'framer-motion';

export default function DashboardClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading: authLoading } = useRequireAuth();
  const [needsOnboarding, setNeedsOnboarding] = useState(false);
  const [onboardingChecked, setOnboardingChecked] = useState(false);

  useEffect(() => {
    if (!user || authLoading) return;
    api.user.getProfile()
      .then(profile => {
        if (profile?._needsOnboarding) setNeedsOnboarding(true);
      })
      .catch(() => {})
      .finally(() => setOnboardingChecked(true));
  }, [user, authLoading]);

  if (authLoading || (user && !onboardingChecked)) {
    return (
      <div style={{ height: '100vh', width: '100vw', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--sovereign-obsidian)' }}>
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.8, 0.3] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          style={{
            width: '120px', height: '120px', borderRadius: '50%',
            background: 'linear-gradient(135deg, var(--sovereign-cyan), var(--sovereign-purple))',
            filter: 'blur(30px)'
          }}
        />
      </div>
    );
  }

  return (
    <>
      {needsOnboarding && user && (
        <OnboardingModal
          userEmail={user.email || ''}
          onComplete={() => setNeedsOnboarding(false)}
        />
      )}
      <div className="dashboard-container">
        <Sidebar />
        <main className="dashboard-main">
          <div className="floating-aura" style={{ top: '10%', right: '5%', width: '500px', height: '500px', opacity: 0.08 }} />
          <div className="floating-aura-purple" style={{ bottom: '20%', left: '10%', width: '400px', height: '400px', opacity: 0.06 }} />
          <div style={{ position: 'relative', zIndex: 1 }}>{children}</div>
        </main>
      </div>
    </>
  );
}
