'use client';

import { useState, type PointerEvent } from 'react';
import { ZoomIn } from 'lucide-react';
import type { Product, ImageType } from '@/types';
import { productImageUrl } from '@/lib/placeholders';
import { getGalleryImages } from '@/lib/productImages';

const VIEW_LABELS: Record<ImageType, string> = {
  model: 'On model',
  flat: 'Flat mockup',
  design: 'Design',
};

/**
 * Product-page gallery. The model wearing the tee leads, followed by the flat
 * mockup and the design on its own; thumbnails switch the main view and the
 * main view zooms on hover (mouse only).
 */
export function ProductGallery({ product }: { product: Product }) {
  const images = getGalleryImages(product);
  const [activeIndex, setActiveIndex] = useState(0);
  const [zoomOrigin, setZoomOrigin] = useState<string | null>(null);

  const active = images[activeIndex] ?? images[0];

  const handlePointerMove = (e: PointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== 'mouse') return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setZoomOrigin(`${x}% ${y}%`);
  };

  return (
    <div>
      <div
        className="relative bg-[#F5F0E8] aspect-[3/4] overflow-hidden lg:cursor-zoom-in"
        onPointerMove={handlePointerMove}
        onPointerLeave={() => setZoomOrigin(null)}
      >
        <img
          src={productImageUrl(active?.url, product.title)}
          alt={active?.alt_text || product.title}
          className="w-full h-full object-cover transition-transform duration-200 ease-out"
          style={zoomOrigin ? { transform: 'scale(2)', transformOrigin: zoomOrigin } : undefined}
          draggable={false}
        />
        <span
          className={`pointer-events-none absolute bottom-3 right-3 hidden lg:flex items-center gap-1.5 px-3 py-1.5 bg-[#0A0A0A]/75 text-white text-[11px] transition-opacity ${
            zoomOrigin ? 'opacity-0' : 'opacity-100'
          }`}
          style={{ fontFamily: "'Space Mono', monospace" }}
        >
          <ZoomIn size={12} />
          Hover to zoom
        </span>
      </div>

      {images.length > 1 && (
        <div className="grid grid-cols-4 gap-2 mt-2">
          {images.map((img, i) => {
            const label = VIEW_LABELS[img.image_type ?? 'flat'];
            return (
              <button
                key={img.id}
                onClick={() => setActiveIndex(i)}
                aria-label={`Show ${label} view`}
                aria-pressed={i === activeIndex}
                className={`aspect-square overflow-hidden bg-[#F5F0E8] border-2 transition-colors ${
                  i === activeIndex ? 'border-[#C41E3A]' : 'border-transparent hover:border-[#0A0A0A]/30'
                }`}
              >
                <img
                  src={productImageUrl(img.url, product.title)}
                  alt=""
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
