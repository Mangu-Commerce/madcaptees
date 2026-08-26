import { Providers } from '../providers';
import { ShopClient } from '@components/ShopClient';

export const metadata = {
  title: 'Shop — Madcap Tees',
  description: 'Browse our full collection of satirical graphic tees, hoodies, and more.',
};

export default function ShopPage() {
  return (
    <Providers>
      <ShopClient />
    </Providers>
  );
}
