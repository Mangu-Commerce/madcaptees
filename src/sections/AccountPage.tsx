import { useState, useEffect } from 'react';
import { Loader2, Heart, Package, LogOut } from 'lucide-react';
import type { AppView, Order, Product } from '@/types';
import { useAuth } from '@/hooks/useAuth';
import { useWishlist } from '@/hooks/useWishlist';
import { useCatalog } from '@/contexts/CatalogContext';
import { supabase, hasSupabaseConfig } from '@/lib/supabase';
import { formatPrice } from '@/lib/data';
import { productImageUrl } from '@/lib/placeholders';

interface AccountPageProps {
  onNavigate: (view: AppView, slug?: string) => void;
}

type AuthTab = 'signin' | 'signup';

export function AccountPage({ onNavigate }: AccountPageProps) {
  const { user, profile, loading: authLoading, signIn, signUp, signOut } = useAuth();
  const wishlist = useWishlist();
  const { publishedProducts } = useCatalog();

  const [tab, setTab] = useState<AuthTab>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [formLoading, setFormLoading] = useState(false);
  const [signUpMessage, setSignUpMessage] = useState<string | null>(null);

  const [orders, setOrders] = useState<Order[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(false);

  useEffect(() => {
    if (!user || !hasSupabaseConfig) {
      setOrders([]);
      return;
    }

    let mounted = true;

    async function loadOrders() {
      setOrdersLoading(true);
      try {
        const userEmail = user!.email ?? '';
        const filter = userEmail
          ? `user_id.eq.${user!.id},email.eq."${userEmail}"`
          : `user_id.eq.${user!.id}`;
        const { data, error: fetchError } = await supabase
          .from('orders')
          .select('*, order_items(*)')
          .or(filter)
          .order('created_at', { ascending: false });

        if (fetchError) {
          console.error('account orders error:', fetchError);
          if (mounted) setOrders([]);
          return;
        }

        if (mounted) {
          setOrders((data ?? []) as Order[]);
        }
      } finally {
        if (mounted) setOrdersLoading(false);
      }
    }

    loadOrders();
    return () => {
      mounted = false;
    };
  }, [user]);

  const wishlistProducts: Product[] = wishlist.productIds
    .map((id) => publishedProducts.find((p) => p.id === id))
    .filter((p): p is Product => Boolean(p));

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setFormLoading(true);
    try {
      await signIn(email, password);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Sign in failed');
    } finally {
      setFormLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSignUpMessage(null);
    setFormLoading(true);
    try {
      await signUp(email, password, fullName.trim() || undefined);
      setSignUpMessage('Account created. Check your email to confirm, then sign in.');
      setTab('signin');
      setPassword('');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Sign up failed');
    } finally {
      setFormLoading(false);
    }
  };

  const handleSignOut = async () => {
    await signOut();
  };

  if (authLoading) {
    return (
      <div className="max-w-[1400px] mx-auto px-4 py-24 flex justify-center">
        <Loader2 size={28} className="animate-spin text-[#C41E3A]" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="max-w-md mx-auto px-4 py-12 lg:py-16">
        <h1
          className="text-3xl lg:text-4xl text-[#0A0A0A] mb-2"
          style={{ fontFamily: "'Anton', sans-serif" }}
        >
          YOUR ACCOUNT
        </h1>
        <p className="text-sm text-[#64748B] mb-8" style={{ fontFamily: "'DM Sans', sans-serif" }}>
          Sign in to view orders and sync your wishlist.
        </p>

        {!hasSupabaseConfig && (
          <p className="text-sm text-[#C41E3A] mb-6" role="alert">
            Supabase is not configured. Add keys to .env.local to enable accounts.
          </p>
        )}

        <div className="flex border-b border-[#0A0A0A]/15 mb-6">
          {(['signin', 'signup'] as AuthTab[]).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => {
                setTab(t);
                setError(null);
                setSignUpMessage(null);
              }}
              className={`flex-1 py-3 text-xs uppercase tracking-wider transition-colors ${
                tab === t ? 'text-[#C41E3A] border-b-2 border-[#C41E3A]' : 'text-[#64748B]'
              }`}
              style={{ fontFamily: "'Space Mono', monospace" }}
            >
              {t === 'signin' ? 'Sign In' : 'Sign Up'}
            </button>
          ))}
        </div>

        {signUpMessage && (
          <p className="text-sm text-[#00C853] mb-4" role="status">
            {signUpMessage}
          </p>
        )}

        {tab === 'signin' ? (
          <form onSubmit={handleSignIn} className="space-y-4">
            <div>
              <label
                className="block text-xs uppercase tracking-wider text-[#64748B] mb-2"
                style={{ fontFamily: "'Space Mono', monospace" }}
              >
                Email
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-[#0A0A0A]/30 focus:border-[#0A0A0A] focus:outline-none bg-white"
                style={{ fontFamily: "'DM Sans', sans-serif" }}
              />
            </div>
            <div>
              <label
                className="block text-xs uppercase tracking-wider text-[#64748B] mb-2"
                style={{ fontFamily: "'Space Mono', monospace" }}
              >
                Password
              </label>
              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-[#0A0A0A]/30 focus:border-[#0A0A0A] focus:outline-none bg-white"
                style={{ fontFamily: "'DM Sans', sans-serif" }}
              />
            </div>
            {error && (
              <p className="text-sm text-[#C41E3A]" role="alert">
                {error}
              </p>
            )}
            <button
              type="submit"
              disabled={formLoading || !hasSupabaseConfig}
              className="w-full py-4 text-white text-sm uppercase tracking-wider disabled:opacity-60 flex items-center justify-center gap-2"
              style={{ backgroundColor: '#C41E3A', fontFamily: "'Space Mono', monospace" }}
            >
              {formLoading && <Loader2 size={16} className="animate-spin" />}
              Sign In
            </button>
          </form>
        ) : (
          <form onSubmit={handleSignUp} className="space-y-4">
            <div>
              <label
                className="block text-xs uppercase tracking-wider text-[#64748B] mb-2"
                style={{ fontFamily: "'Space Mono', monospace" }}
              >
                Full Name
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full px-4 py-3 border border-[#0A0A0A]/30 focus:border-[#0A0A0A] focus:outline-none bg-white"
                style={{ fontFamily: "'DM Sans', sans-serif" }}
              />
            </div>
            <div>
              <label
                className="block text-xs uppercase tracking-wider text-[#64748B] mb-2"
                style={{ fontFamily: "'Space Mono', monospace" }}
              >
                Email
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-[#0A0A0A]/30 focus:border-[#0A0A0A] focus:outline-none bg-white"
                style={{ fontFamily: "'DM Sans', sans-serif" }}
              />
            </div>
            <div>
              <label
                className="block text-xs uppercase tracking-wider text-[#64748B] mb-2"
                style={{ fontFamily: "'Space Mono', monospace" }}
              >
                Password
              </label>
              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-[#0A0A0A]/30 focus:border-[#0A0A0A] focus:outline-none bg-white"
                style={{ fontFamily: "'DM Sans', sans-serif" }}
              />
            </div>
            {error && (
              <p className="text-sm text-[#C41E3A]" role="alert">
                {error}
              </p>
            )}
            <button
              type="submit"
              disabled={formLoading || !hasSupabaseConfig}
              className="w-full py-4 text-white text-sm uppercase tracking-wider disabled:opacity-60 flex items-center justify-center gap-2"
              style={{ backgroundColor: '#C41E3A', fontFamily: "'Space Mono', monospace" }}
            >
              {formLoading && <Loader2 size={16} className="animate-spin" />}
              Create Account
            </button>
          </form>
        )}
      </div>
    );
  }

  return (
    <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-10">
        <div>
          <h1
            className="text-3xl lg:text-4xl text-[#0A0A0A] mb-2"
            style={{ fontFamily: "'Anton', sans-serif" }}
          >
            YOUR ACCOUNT
          </h1>
          <p className="text-sm text-[#64748B]" style={{ fontFamily: "'DM Sans', sans-serif" }}>
            {profile?.full_name ? `${profile.full_name} · ` : ''}
            {user.email}
          </p>
        </div>
        <button
          type="button"
          onClick={handleSignOut}
          className="inline-flex items-center gap-2 px-4 py-2 text-sm border border-[#0A0A0A]/20 hover:border-[#0A0A0A] transition-colors"
          style={{ fontFamily: "'Space Mono', monospace" }}
        >
          <LogOut size={14} />
          Sign Out
        </button>
      </div>

      <section className="mb-12">
        <h2
          className="flex items-center gap-2 text-xl text-[#0A0A0A] mb-6"
          style={{ fontFamily: "'Anton', sans-serif" }}
        >
          <Package size={20} />
          ORDER HISTORY
        </h2>
        {ordersLoading ? (
          <div className="flex justify-center py-8">
            <Loader2 size={24} className="animate-spin text-[#C41E3A]" />
          </div>
        ) : orders.length === 0 ? (
          <p className="text-sm text-[#64748B]" style={{ fontFamily: "'DM Sans', sans-serif" }}>
            No orders yet.{' '}
            <button
              type="button"
              onClick={() => onNavigate('shop')}
              className="text-[#C41E3A] hover:underline"
            >
              Start shopping
            </button>
          </p>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div key={order.id} className="bg-white border border-[#0A0A0A]/10 p-4 sm:p-5">
                <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                  <div>
                    <p
                      className="text-xs uppercase tracking-wider text-[#64748B]"
                      style={{ fontFamily: "'Space Mono', monospace" }}
                    >
                      {new Date(order.created_at).toLocaleDateString()}
                    </p>
                    <p className="text-sm font-medium" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                      Order {order.id.slice(0, 8).toUpperCase()}
                    </p>
                  </div>
                  <div className="text-right">
                    <span
                      className="inline-block px-2 py-1 text-[10px] uppercase tracking-wider border"
                      style={{ fontFamily: "'Space Mono', monospace" }}
                    >
                      {order.status}
                    </span>
                    <p className="text-sm font-bold mt-1">{formatPrice(order.total_amount)}</p>
                  </div>
                </div>
                {order.order_items?.length > 0 && (
                  <ul className="space-y-1 border-t border-[#0A0A0A]/10 pt-3">
                    {order.order_items.map((item) => (
                      <li
                        key={item.id}
                        className="text-sm text-[#64748B] flex justify-between gap-4"
                        style={{ fontFamily: "'DM Sans', sans-serif" }}
                      >
                        <span>
                          {item.title_at_time} · {item.size_at_time} / {item.color_at_time} ×{' '}
                          {item.quantity}
                        </span>
                        <span className="text-[#0A0A0A] font-medium shrink-0">
                          {formatPrice(item.total_price)}
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        )}
      </section>

      <section>
        <h2
          className="flex items-center gap-2 text-xl text-[#0A0A0A] mb-6"
          style={{ fontFamily: "'Anton', sans-serif" }}
        >
          <Heart size={20} />
          WISHLIST
        </h2>
        {wishlist.loading ? (
          <div className="flex justify-center py-8">
            <Loader2 size={24} className="animate-spin text-[#C41E3A]" />
          </div>
        ) : wishlistProducts.length === 0 ? (
          <p className="text-sm text-[#64748B]" style={{ fontFamily: "'DM Sans', sans-serif" }}>
            Your wishlist is empty. Tap the heart on any product to save it.
          </p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 lg:gap-6">
            {wishlistProducts.map((product) => {
              const img = product.product_images.find((i) => i.is_primary) || product.product_images[0];
              return (
                <div key={product.id} className="group relative text-left">
                  <button
                    type="button"
                    onClick={() => onNavigate('product', product.slug)}
                    className="w-full text-left"
                  >
                    <div className="aspect-[3/4] overflow-hidden border border-[#0A0A0A]/15 mb-3">
                      <img
                        src={productImageUrl(img?.url, product.title)}
                        alt={product.title}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    </div>
                    <h4
                      className="text-sm font-medium text-[#0A0A0A] group-hover:opacity-70 transition-opacity"
                      style={{ fontFamily: "'DM Sans', sans-serif" }}
                    >
                      {product.title}
                    </h4>
                    <p
                      className="text-sm font-bold text-[#0A0A0A]"
                      style={{ fontFamily: "'DM Sans', sans-serif" }}
                    >
                      {formatPrice(product.sale_price || product.base_price)}
                    </p>
                  </button>
                  <button
                    type="button"
                    onClick={() => wishlist.remove(product.id)}
                    className="absolute top-2 right-2 p-2 bg-white/90 border border-[#0A0A0A]/10 hover:text-[#C41E3A] transition-colors"
                    aria-label={`Remove ${product.title} from wishlist`}
                  >
                    <Heart size={14} fill="#C41E3A" color="#C41E3A" />
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
