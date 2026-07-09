import { Instagram } from 'lucide-react';
import productMadAsHell from '@/assets/product-mad-as-hell.jpg';
import productBennies from '@/assets/product-bennies.jpg';
import productDoomScroll from '@/assets/product-doom-scroll.jpg';
import productExit82 from '@/assets/product-exit-82.jpg';
import collectionSatirical from '@/assets/collection-satirical.jpg';
import collectionRetro from '@/assets/collection-retro.jpg';

const IG_URL = 'https://instagram.com/madcaptees';

const PLACEHOLDERS = [
  { src: productMadAsHell, alt: 'Mad As Hell tee' },
  { src: productBennies, alt: 'Bennies Go Home tee' },
  { src: productDoomScroll, alt: 'Doom Scroll Champion hoodie' },
  { src: productExit82, alt: 'Exit 82 No Regrets tee' },
  { src: collectionSatirical, alt: 'Satirical collection' },
  { src: collectionRetro, alt: 'Retro collection' },
];

export function InstagramFeed() {
  return (
    <section className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
      <div className="flex items-center justify-between mb-8">
        <h2
          className="text-2xl lg:text-3xl text-[#0A0A0A]"
          style={{ fontFamily: "'Anton', sans-serif", letterSpacing: '0.05em' }}
        >
          FOLLOW @MADCAPTEES
        </h2>
        <a
          href={IG_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="hidden sm:inline-flex items-center gap-2 px-4 py-2 border border-[#0A0A0A] text-xs uppercase tracking-wider text-[#0A0A0A] hover:bg-[#0A0A0A] hover:text-white transition-all"
          style={{ fontFamily: "'Space Mono', monospace" }}
        >
          <Instagram size={14} />
          Instagram
        </a>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 lg:gap-4">
        {PLACEHOLDERS.map((item) => (
          <a
            key={item.alt}
            href={IG_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative aspect-square overflow-hidden bg-[#0A0A0A]/5"
            aria-label={`View ${item.alt} on Instagram`}
          >
            <img
              src={item.src}
              alt={item.alt}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-[#0A0A0A]/0 group-hover:bg-[#0A0A0A]/35 transition-colors duration-300 flex items-center justify-center">
              <Instagram
                size={28}
                className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              />
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}
