'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import { AdminLogin } from '@/sections/AdminLogin';
import { useAuth } from '@/hooks/useAuth';

function LoginInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, isAdmin, loading } = useAuth();

  useEffect(() => {
    if (!loading && user && isAdmin) {
      const redirect = searchParams.get('redirect') || '/admin';
      router.push(redirect);
    }
  }, [user, isAdmin, loading, router, searchParams]);

  return <AdminLogin />;
}

export function LoginClient() {
  return (
    <Suspense>
      <LoginInner />
    </Suspense>
  );
}
