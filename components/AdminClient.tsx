'use client';

import { useRouter } from 'next/navigation';
import { CatalogProvider } from '@/contexts/CatalogContext';
import { AdminDashboard } from '@/sections/AdminDashboard';

export function AdminClient() {
  const router = useRouter();

  const handleNavigate = (view: string) => {
    if (view === 'home') router.push('/');
    else if (view === 'shop') router.push('/shop');
    else router.push('/');
  };

  return (
    <CatalogProvider>
      <AdminDashboard onNavigate={handleNavigate as any} />
    </CatalogProvider>
  );
}
