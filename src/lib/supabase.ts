// ============================================
// Madcap Tees — Supabase Client
// ============================================

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const hasSupabaseConfig = supabaseUrl.length > 0 && supabaseAnonKey.length > 0;

// When Supabase env vars are missing, `createClient` would throw ("supabaseUrl
// is required") and crash the app before the local-data fallback in `api.ts`
// (which is gated on `hasSupabaseConfig`) can run. Passing harmless placeholder
// values keeps dev working offline; the client is never actually called because
// every request path checks `hasSupabaseConfig` first.
export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder-anon-key',
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
    },
  }
);
