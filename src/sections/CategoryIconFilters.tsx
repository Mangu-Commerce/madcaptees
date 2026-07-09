import { Shirt, Flame, Crown, Sticker, Layers, Grid3X3 } from 'lucide-react';
import type { CategoryFilter, Product } from '@/types';
import { PRODUCT_CATEGORIES } from '@/types';

const ICON_MAP = {
  shirt: Shirt,
  hoodie: Flame,
  sleeve: Layers,
  hat: Crown,
  sticker: Sticker,
} as const;

interface CategoryIconFiltersProps {
  products: Product[];
  activeCategory: CategoryFilter;
  onSelect: (category: CategoryFilter) => void;
}

export function CategoryIconFilters({
  products,
  activeCategory,
  onSelect,
}: CategoryIconFiltersProps) {
  const counts = products.reduce<Record<string, number>>((acc, p) => {
    acc[p.category] = (acc[p.category] ?? 0) + 1;
    return acc;
  }, {});

  const items: { value: CategoryFilter; label: string; icon: typeof Shirt; count: number }[] = [
    { value: 'all', label: 'All', icon: Grid3X3, count: products.length },
    ...PRODUCT_CATEGORIES.map((cat) => ({
      value: cat.value as CategoryFilter,
      label: cat.label,
      icon: ICON_MAP[cat.icon as keyof typeof ICON_MAP] ?? Shirt,
      count: counts[cat.value] ?? 0,
    })),
  ];

  return (
    <div className="mb-8 overflow-x-auto">
      <div className="flex gap-4 sm:gap-6 min-w-max pb-2">
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = activeCategory === item.value;
          return (
            <button
              key={item.value}
              type="button"
              onClick={() => onSelect(item.value)}
              className="flex flex-col items-center gap-2 group"
            >
              <div
                className={`w-16 h-16 sm:w-[72px] sm:h-[72px] rounded-full border-2 flex items-center justify-center transition-all ${
                  isActive
                    ? 'bg-[#0A0A0A] text-white border-[#0A0A0A] shadow-[3px_3px_0px_#C41E3A]'
                    : 'bg-white text-[#0A0A0A] border-[#0A0A0A]/20 group-hover:border-[#C41E3A]'
                }`}
              >
                <Icon size={22} strokeWidth={1.75} />
              </div>
              <span
                className={`text-[10px] sm:text-[11px] uppercase tracking-wider text-center max-w-[80px] ${
                  isActive ? 'text-[#0A0A0A] font-medium' : 'text-[#64748B]'
                }`}
                style={{ fontFamily: "'Space Mono', monospace" }}
              >
                {item.label}
              </span>
              <span className="text-[10px] text-[#64748B]" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                ({item.count})
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
