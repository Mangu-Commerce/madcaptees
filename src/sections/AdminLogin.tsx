import { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { hasSupabaseConfig } from '@/lib/supabase';

export function AdminLogin() {
  const { signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await signIn(email, password);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  if (!hasSupabaseConfig) {
    return (
      <div className="min-h-screen bg-[#F5F0E8] flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white border border-[#0A0A0A]/15 p-8 text-center">
          <h1 className="text-2xl mb-4" style={{ fontFamily: "'Anton', sans-serif" }}>
            ADMIN — LOCAL MODE
          </h1>
          <p className="text-sm text-[#64748B]" style={{ fontFamily: "'DM Sans', sans-serif" }}>
            Supabase is not configured. Admin runs on local seed data without login.
            Add <code className="text-xs">.env.local</code> to enable secure admin auth.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F0E8] flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white border border-[#0A0A0A]/15 p-8">
        <h1 className="text-3xl text-[#0A0A0A] mb-2" style={{ fontFamily: "'Anton', sans-serif" }}>
          MADCAP ADMIN
        </h1>
        <p className="text-sm text-[#64748B] mb-8" style={{ fontFamily: "'DM Sans', sans-serif" }}>
          Sign in with your admin account.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs uppercase tracking-wider text-[#64748B] mb-2" style={{ fontFamily: "'Space Mono', monospace" }}>
              Email
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border border-[#0A0A0A]/30 focus:border-[#0A0A0A] focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-xs uppercase tracking-wider text-[#64748B] mb-2" style={{ fontFamily: "'Space Mono', monospace" }}>
              Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border border-[#0A0A0A]/30 focus:border-[#0A0A0A] focus:outline-none"
            />
          </div>

          {error && (
            <p className="text-sm text-[#C41E3A]" role="alert">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 text-white text-sm uppercase tracking-wider disabled:opacity-60 flex items-center justify-center gap-2"
            style={{ backgroundColor: '#C41E3A', fontFamily: "'Space Mono', monospace" }}
          >
            {loading && <Loader2 size={16} className="animate-spin" />}
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
}
