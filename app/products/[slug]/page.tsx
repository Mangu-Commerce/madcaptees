import { Providers } from '../../providers';
import { ProductDetailClient } from '@components/ProductDetailClient';

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  return (
    <Providers>
      <ProductDetailClient slug={slug} />
    </Providers>
  );
}
