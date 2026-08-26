'use client';

import { useState } from 'react';
import { X } from 'lucide-react';

export function AnnouncementBar() {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  return (
    <div
      className="relative w-full px-4 py-2.5 text-center"
      style={{ backgroundColor: '#00C853' }}
    >
      <p
        className="text-white text-xs font-medium tracking-widest uppercase"
        style={{ fontFamily: "'Space Mono', monospace" }}
      >
        FREE DOMESTIC SHIPPING ON ORDERS OVER $125 | MADE TO ORDER — 7 DAY PRODUCTION
      </p>
      <button
        onClick={() => setDismissed(true)}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-white/80 hover:text-white transition-colors"
        aria-label="Dismiss announcement"
      >
        <X size={16} />
      </button>
    </div>
  );
}
