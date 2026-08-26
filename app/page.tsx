import { Providers } from './providers';
import { HomeClient } from '@components/HomeClient';

export default function HomePage() {
  return (
    <Providers>
      <HomeClient />
    </Providers>
  );
}
