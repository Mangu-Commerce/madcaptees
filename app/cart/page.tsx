import { Providers } from '../providers';
import { CartClient } from '@components/CartClient';

export const metadata = {
  title: 'Cart — Madcap Tees',
};

export default function CartPage() {
  return (
    <Providers>
      <CartClient />
    </Providers>
  );
}
