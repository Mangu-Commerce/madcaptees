import { Providers } from '../providers';
import { CheckoutClient } from '@components/CheckoutClient';

export const metadata = {
  title: 'Checkout — Madcap Tees',
};

export default function CheckoutPage() {
  return (
    <Providers>
      <CheckoutClient />
    </Providers>
  );
}
