import { useState, useRef, useCallback } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { productImageUrl } from '@/lib/placeholders';

interface GalleryImage {
  id: string;
  url: string;
  alt: string;
}

interface ProductGalleryProps {
  images: GalleryImage[];
  title: string;
}

export function ProductGallery({ images, title }: ProductGalleryProps) {
  const displayImages: GalleryImage[] =
    images.length > 0
      ? images
      : [{ id: 'placeholder', url: productImageUrl(null, title), alt: title }];

  const [activeIndex, setActiveIndex] = useState(0);
  const [zooming, setZooming] = useState(false);
  const touchStartX = useRef<number | null>(null);

  const active = displayImages[activeIndex];

  const go = useCallback(
    (dir: -1 | 1) => {
      setActiveIndex((i) => (i + dir + displayImages.length) % displayImages.length);
    },
    [displayImages.length]
  );

  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const delta = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(delta) > 40) {
      go(delta < 0 ? 1 : -1);
    }
    touchStartX.current = null;
  };

  return (
    <div className="space-y-3">
      <div
        className="relative bg-[#F5F0E8] aspect-[3/4] overflow-hidden group"
        onMouseEnter={() => setZooming(true)}
        onMouseLeave={() => setZooming(false)}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        <img
          src={active.url}
          alt={active.alt}
          className={`w-full h-full object-cover transition-transform duration-300 origin-center ${
            zooming ? 'scale-[2] cursor-zoom-in' : 'scale-100'
          }`}
          style={zooming ? { transformOrigin: 'center center' } : undefined}
        />

        {displayImages.length > 1 && (
          <>
            <button
              type="button"
              onClick={() => go(-1)}
              className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              aria-label="Previous image"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              type="button"
              onClick={() => go(1)}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              aria-label="Next image"
            >
              <ChevronRight size={18} />
            </button>
          </>
        )}
      </div>

      {displayImages.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {displayImages.map((img, i) => (
            <button
              key={img.id}
              type="button"
              onClick={() => setActiveIndex(i)}
              className={`flex-shrink-0 w-16 h-20 border-2 overflow-hidden transition-all ${
                i === activeIndex ? 'border-[#0A0A0A]' : 'border-[#0A0A0A]/15 opacity-70 hover:opacity-100'
              }`}
            >
              <img src={img.url} alt="" className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
