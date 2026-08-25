'use client';

import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import { StoreShell } from './StoreShell';
import { CheckoutPage } from '@/sections/CheckoutPage';

function CheckoutInner() {
  const searchParams = useSearchParams();
  const initialSuccess = searchParams.get('success') === '1';

  return (
    <StoreShell>
      {({ cart, onNavigate }) => (
        <CheckoutPage
          items={cart.items}
          subtotal={cart.subtotal}
          shipping={cart.shipping}
          total={cart.total}
          onNavigate={onNavigate}
          onClearCart={cart.clearCart}
          initialSuccess={initialSuccess}
        />
      )}
    </StoreShell>
  );
}

export function CheckoutClient() {
  return (
    <Suspense>
      <CheckoutInner />
    </Suspense>
  );
}
