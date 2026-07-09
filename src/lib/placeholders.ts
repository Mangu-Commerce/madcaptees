/**
 * On-brand SVG placeholder when a product has no uploaded image.
 */
export function productPlaceholderDataUrl(title: string): string {
  const safeTitle = title.slice(0, 40).replace(/[<>&"']/g, '');
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="800" viewBox="0 0 600 800">
  <rect width="600" height="800" fill="#F5F0E8"/>
  <pattern id="dots" width="12" height="12" patternUnits="userSpaceOnUse">
    <circle cx="2" cy="2" r="1.5" fill="#0A0A0A" opacity="0.08"/>
  </pattern>
  <rect width="600" height="800" fill="url(#dots)"/>
  <rect x="40" y="40" width="520" height="720" fill="none" stroke="#0A0A0A" stroke-width="3"/>
  <text x="300" y="360" text-anchor="middle" font-family="Arial Black, sans-serif" font-size="42" fill="#C41E3A">MADCAP</text>
  <text x="300" y="430" text-anchor="middle" font-family="monospace" font-size="16" fill="#0A0A0A">${safeTitle}</text>
  <text x="300" y="480" text-anchor="middle" font-family="monospace" font-size="12" fill="#64748B">IMAGE COMING SOON</text>
</svg>`;
  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}

export function productImageUrl(
  url: string | null | undefined,
  title: string
): string {
  if (url && url.length > 0) return url;
  return productPlaceholderDataUrl(title);
}
