import type { Product, ProductImage } from '@/types';

const bySortOrder = (a: ProductImage, b: ProductImage) => a.sort_order - b.sort_order;

/** Existing images pre-date `image_type`, so anything untyped counts as a flat mockup. */
const typeOf = (img: ProductImage) => img.image_type ?? 'flat';

/**
 * Image for the shop-grid block: the standalone design art when we have it,
 * otherwise the product's main image.
 */
export function getDesignImage(product: Product): ProductImage | undefined {
  const images = [...product.product_images].sort(bySortOrder);
  return (
    images.find((i) => typeOf(i) === 'design') ??
    images.find((i) => i.is_primary) ??
    images[0]
  );
}

/**
 * Product-page gallery order: model wearing the tee first, then the flat
 * mockup(s), then the design art on its own.
 */
export function getGalleryImages(product: Product): ProductImage[] {
  const images = [...product.product_images].sort(bySortOrder);
  const ofType = (t: ReturnType<typeof typeOf>) => images.filter((i) => typeOf(i) === t);
  return [...ofType('model'), ...ofType('flat'), ...ofType('design')];
}
