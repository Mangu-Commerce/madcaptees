'use client';

import { COLLECTIONS } from '@/lib/data';
import type { AppView, FilterState } from '@/types';

interface CollectionCardsProps {
  onNavigate: (view: AppView) => void;
  onFilterChange: (filter: Partial<FilterState>) => void;
}

export function CollectionCards({ onNavigate, onFilterChange }: CollectionCardsProps) {
  const handleClick = (collectionSlug: string) => {
    onFilterChange({ theme: collectionSlug as any, category: 'all', search: '', sort: 'featured' });
    onNavigate('shop');
  };

  return (
    <section className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {COLLECTIONS.map((collection) => (
          <button
            key={collection.id}
            onClick={() => handleClick(collection.slug)}
            className="group relative aspect-[4/5] overflow-hidden border border-[#0A0A0A]/15 text-left transition-all duration-400 hover:shadow-[4px_4px_0px_rgba(10,10,10,0.2)]"
          >
            <img
              src={collection.image_url || ''}
              alt={collection.name}
              className="w-full h-full object-cover transition-transform duration-400 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A]/80 via-[#0A0A0A]/30 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-4">
              <h3
                className="text-white text-xl lg:text-2xl mb-2"
                style={{ fontFamily: "'Anton', sans-serif" }}
              >
                {collection.name}
              </h3>
              <span
                className="inline-block px-4 py-1.5 border border-white text-white text-xs uppercase tracking-wider transition-all duration-200 group-hover:bg-white group-hover:text-[#0A0A0A]"
                style={{ fontFamily: "'Space Mono', monospace" }}
              >
                Shop Now
              </span>
            </div>
          </button>
        ))}
      </div>
    </section>
  );
}
