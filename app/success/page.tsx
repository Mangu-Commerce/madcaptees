import Link from 'next/link';

export const metadata = {
  title: 'Order Confirmed — Madcap Tees',
};

export default function SuccessPage() {
  return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{ backgroundColor: '#F5F0E8' }}
    >
      <div className="text-center max-w-lg px-4">
        <div className="text-6xl mb-4">🎉</div>
        <h1
          className="text-4xl text-[#0A0A0A] mb-3"
          style={{ fontFamily: "'Anton', sans-serif" }}
        >
          ORDER CONFIRMED!
        </h1>
        <p className="text-[#64748B] mb-2" style={{ fontFamily: "'DM Sans', sans-serif" }}>
          Thanks for your order! You&apos;ll receive a confirmation email shortly.
        </p>
        <p className="text-sm text-[#64748B] mb-8" style={{ fontFamily: "'DM Sans', sans-serif" }}>
          Your mad gear is being prepared. Expect shipping within 3–5 business days.
        </p>
        <Link
          href="/shop"
          className="px-8 py-4 text-white text-sm uppercase tracking-wider inline-block hover:-translate-y-0.5 transition-transform"
          style={{ backgroundColor: '#C41E3A', fontFamily: "'Space Mono', monospace" }}
        >
          Continue Shopping
        </Link>
      </div>
    </div>
  );
}
