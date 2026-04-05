'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';

export function useRequireAuth() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // If auth is loaded and there is no user, redirect to home page
    // (In the future, this could redirect to a dedicated /login page)
    if (!loading && !user) {
      router.push('/de');
    }
  }, [user, loading, router]);

  return { user, loading };
}
