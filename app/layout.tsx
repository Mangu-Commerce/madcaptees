import type { Metadata, Viewport } from 'next';
import './globals.css';

export const viewport: Viewport = {
  themeColor: '#C41E3A',
};

export const metadata: Metadata = {
  title: 'Madcap Tees — Mad as Hell & Twice as Funny',
  description:
    'Original satirical graphic apparel for the mad, the bold, and the hilarious. Shop tees, hoodies & more. Free shipping on orders $125+.',
  keywords: 'graphic tees, funny t-shirts, satirical apparel, NJ shirts, mad magazine, retro tees, sarcastic shirts',
  authors: [{ name: 'Madcap Tees' }],
  openGraph: {
    type: 'website',
    url: 'https://madcaptees.com',
    title: 'Madcap Tees — Mad as Hell & Twice as Funny',
    description: 'Original satirical graphic apparel. Shop tees, hoodies & more. Free shipping on orders $125+.',
    images: ['/og-image.jpg'],
    siteName: 'Madcap Tees',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Madcap Tees — Mad as Hell & Twice as Funny',
    description: 'Original satirical graphic apparel. Shop tees, hoodies & more. Free shipping on orders $125+.',
    images: ['/og-image.jpg'],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Anton&family=DM+Sans:ital,opsz,wght@0,9..40,400;0,9..40,500;0,9..40,700;1,9..40,400&family=Space+Mono:wght@400;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
