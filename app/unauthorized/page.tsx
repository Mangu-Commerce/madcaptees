import Link from 'next/link';

export const metadata = {
  title: 'Unauthorized — Madcap Tees',
};

export default function UnauthorizedPage() {
  return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{ backgroundColor: '#F5F0E8' }}
    >
      <div className="text-center max-w-md px-4">
        <h1
          className="text-6xl text-[#C41E3A] mb-4"
          style={{ fontFamily: "'Anton', sans-serif" }}
        >
          403
        </h1>
        <p
          className="text-xl font-medium mb-2"
          style={{ fontFamily: "'Anton', sans-serif" }}
        >
          ACCESS DENIED
        </p>
        <p className="text-[#64748B] mb-8" style={{ fontFamily: "'DM Sans', sans-serif" }}>
          You don&apos;t have permission to view this page. Admin access required.
        </p>
        <Link
          href="/"
          className="px-6 py-3 text-white text-sm uppercase tracking-wider inline-block"
          style={{ backgroundColor: '#C41E3A', fontFamily: "'Space Mono', monospace" }}
        >
          Back to Shop
        </Link>
      </div>
    </div>
  );
}
