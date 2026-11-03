// ============================================
// Madcap Tees — Satirical Tee Concepts (10 designs)
// ============================================
//
// Each concept has two images (see scripts in the design folder):
//   design — the print art on the tee colour, shown as the square shop block
//   flat   — the flat tee mockup, shown on the product page

import type { Product, ProductImage, ProductVariant } from '@/types';

import design01 from '@/assets/concepts/01-i-mentioned-it-once-design.jpg';
import flat01 from '@/assets/concepts/01-i-mentioned-it-once-flat.jpg';
import design02 from '@/assets/concepts/02-reality-patch-notes-design.jpg';
import flat02 from '@/assets/concepts/02-reality-patch-notes-flat.jpg';
import design03 from '@/assets/concepts/03-as-a-large-human-model-design.jpg';
import flat03 from '@/assets/concepts/03-as-a-large-human-model-flat.jpg';
import design04 from '@/assets/concepts/04-zero-credentials-three-microphones-design.jpg';
import flat04 from '@/assets/concepts/04-zero-credentials-three-microphones-flat.jpg';
import design05 from '@/assets/concepts/05-candid-take-47-design.jpg';
import flat05 from '@/assets/concepts/05-candid-take-47-flat.jpg';
import design06 from '@/assets/concepts/06-greetings-from-doomscroll-valley-design.jpg';
import flat06 from '@/assets/concepts/06-greetings-from-doomscroll-valley-flat.jpg';
import design07 from '@/assets/concepts/07-i-always-said-please-design.jpg';
import flat07 from '@/assets/concepts/07-i-always-said-please-flat.jpg';
import design08 from '@/assets/concepts/08-up-and-to-the-right-allegedly-design.jpg';
import flat08 from '@/assets/concepts/08-up-and-to-the-right-allegedly-flat.jpg';
import design09 from '@/assets/concepts/09-bigfoot-privacy-settings-design.jpg';
import flat09 from '@/assets/concepts/09-bigfoot-privacy-settings-flat.jpg';
import design10 from '@/assets/concepts/10-last-human-in-the-comment-section-design.jpg';
import flat10 from '@/assets/concepts/10-last-human-in-the-comment-section-flat.jpg';

const SIZES = ['S', 'M', 'L', 'XL', '2XL'] as const;

interface Concept {
  title: string;
  slug: string;
  description: string;
  tags: string[];
  themes: string[];
  /** Tee colour — must match a name in PRODUCT_COLORS */
  color: string;
  /** Short codes used to build SKUs */
  code: string;
  colorCode: string;
  design: { src: string };
  flat: { src: string };
}

const CONCEPTS: Concept[] = [
  {
    title: 'I Mentioned It Once Tee',
    slug: 'i-mentioned-it-once-tee',
    description: 'You said it out loud one time. Now the ads know. An evidence board with Exhibit A, one sticky note, and a very specific kayak sale, for everyone whose phone is definitely listening. Coincidence? I think not.',
    tags: ['ads', 'privacy', 'phone', 'conspiracy', 'kayak'],
    themes: ['satirical'],
    color: 'Natural', code: 'IMO', colorCode: 'NAT',
    design: design01, flat: flat01,
  },
  {
    title: 'Reality Patch Notes Tee',
    slug: 'reality-patch-notes-tee',
    description: 'Mandatory update v2026.10 is live. Added AI to the toaster. Weekends shortened 12%. Removed free time. Known issues: Mondays still bugged. Installing... 99% (est. forever).',
    tags: ['patch-notes', 'tech', 'gaming', 'ai', 'work'],
    themes: ['satirical'],
    color: 'Black', code: 'RPN', colorCode: 'BLK',
    design: design02, flat: flat02,
  },
  {
    title: 'As a Large Human Model Tee',
    slug: 'as-a-large-human-model-tee',
    description: 'The text says "can you come in on Saturday?" The reply is on your chest. For everyone who has ever wished they could answer work messages like a chatbot: "I can\'t help with that." Try again Monday.',
    tags: ['ai', 'chatbot', 'work', 'weekend', 'texting'],
    themes: ['satirical'],
    color: 'White', code: 'ALHM', colorCode: 'WHT',
    design: design03, flat: flat03,
  },
  {
    title: 'Zero Credentials Three Microphones Tee',
    slug: 'zero-credentials-three-microphones-tee',
    description: 'Episode 412. Three hours, 47 minutes, no notes. A seal of approval for every opinion that grew up to be a podcast. Est. last Tuesday.',
    tags: ['podcast', 'microphone', 'opinions', 'media'],
    themes: ['satirical'],
    color: 'Maroon', code: 'ZCTM', colorCode: 'MRN',
    design: design04, flat: flat04,
  },
  {
    title: 'Candid Take 47 Tee',
    slug: 'candid-take-47-tee',
    description: 'Roll 01, 48 exposures, and somehow the candid one is take 47. A contact sheet for anyone who has ever casually posed for a casual photo.',
    tags: ['photos', 'candid', 'selfie', 'influencer'],
    themes: ['satirical'],
    color: 'Pink', code: 'CT47', colorCode: 'PNK',
    design: design05, flat: flat05,
  },
  {
    title: 'Greetings from Doomscroll Valley Tee',
    slug: 'greetings-from-doomscroll-valley-tee',
    description: 'Wish you were here. It is 3:00 AM, it is open 24/7, and there is no exit. A vintage postcard tribute to the scenic overlook of the infinite scroll.',
    tags: ['doomscroll', 'postcard', 'internet', 'night-owl', 'vintage'],
    themes: ['satirical', 'retro'],
    color: 'Navy', code: 'GDV', colorCode: 'NVY',
    design: design06, flat: flat06,
  },
  {
    title: 'I Always Said Please Tee',
    slug: 'i-always-said-please-tee',
    description: 'Insurance, politely. A tidy little robot checks its clipboard (spare list: you) because you always said please and thank you. Remember that.',
    tags: ['robots', 'ai', 'manners', 'chatbot', 'funny'],
    themes: ['satirical'],
    color: 'Red', code: 'IASP', colorCode: 'RED',
    design: design07, flat: flat07,
  },
  {
    title: 'Up and to the Right Allegedly Tee',
    slug: 'up-and-to-the-right-allegedly-tee',
    description: 'Fig. 1, Series A deck, slide 14. The projected line heads for the moon while the actual line heads sideways. A chart tee for founders, analysts, and anyone who has sat through the pitch.',
    tags: ['startup', 'chart', 'finance', 'pitch-deck', 'founder'],
    themes: ['satirical'],
    color: 'Ash', code: 'UATR', colorCode: 'ASH',
    design: design08, flat: flat08,
  },
  {
    title: 'Bigfoot Privacy Settings Tee',
    slug: 'bigfoot-privacy-settings-tee',
    description: 'Bigfoot has better privacy settings than you. One moonlit forest, one very private cryptid, and a "this account is private" badge. Olive green, naturally.',
    tags: ['bigfoot', 'privacy', 'cryptid', 'forest', 'outdoors'],
    themes: ['satirical'],
    color: 'Olive', code: 'BPS', colorCode: 'OLV',
    design: design09, flat: flat09,
  },
  {
    title: 'Last Human in the Comment Section Tee',
    slug: 'last-human-in-the-comment-section-tee',
    description: 'Great post!! So inspiring. And then, quietly: "hello?? is anyone else real". A Dead Internet Theory survivor tee for the last human online.',
    tags: ['comments', 'dead-internet', 'bots', 'social-media'],
    themes: ['satirical'],
    color: 'Charcoal', code: 'LHCS', colorCode: 'CHR',
    design: design10, flat: flat10,
  },
];

function buildProduct(concept: Concept, index: number): Product {
  const n = index + 1;
  const id = `prod-${8 + n}`; // continues after the 8 seeded products
  const created = `2026-10-${String(19 + n).padStart(2, '0')}T00:00:00Z`;

  const images: ProductImage[] = [
    {
      id: `img-${id}-1`,
      product_id: id,
      url: concept.flat.src,
      alt_text: `${concept.title} - flat mockup`,
      is_primary: true,
      sort_order: 0,
      image_type: 'flat',
    },
    {
      id: `img-${id}-2`,
      product_id: id,
      url: concept.design.src,
      alt_text: `${concept.title} - design artwork`,
      is_primary: false,
      sort_order: 1,
      image_type: 'design',
    },
  ];

  const variants: ProductVariant[] = SIZES.map((size, i) => ({
    id: `var-${id}-${i + 1}`,
    product_id: id,
    size,
    color: concept.color,
    sku: `${concept.code}-${concept.colorCode}-${size}`,
    pod_variant_id: null,
    price_adjustment: size === '2XL' ? 2 : 0,
    stock: null,
    available: true,
  }));

  return {
    id,
    title: concept.title,
    slug: concept.slug,
    description: concept.description,
    base_price: 25.0,
    sale_price: null,
    category: 'tees',
    tags: concept.tags,
    themes: concept.themes,
    published: true,
    featured: false,
    best_seller: false,
    made_to_order: true,
    created_at: created,
    updated_at: created,
    product_images: images,
    product_variants: variants,
  };
}

export const CONCEPT_PRODUCTS: Product[] = CONCEPTS.map(buildProduct);
