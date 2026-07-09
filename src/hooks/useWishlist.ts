// ============================================
// Madcap Tees — Wishlist Hook
// localStorage fallback when logged out; syncs to Supabase when authenticated
// ============================================

import { useState, useEffect, useCallback } from 'react';
import { supabase, hasSupabaseConfig } from '@/lib/supabase';
import { useAuth } from '@/hooks/useAuth';

const WISHLIST_STORAGE_KEY = 'madcap-wishlist';

function loadLocalWishlist(): string[] {
  try {
    const stored = localStorage.getItem(WISHLIST_STORAGE_KEY);
    return stored ? (JSON.parse(stored) as string[]) : [];
  } catch {
    return [];
  }
}

function saveLocalWishlist(productIds: string[]) {
  try {
    localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(productIds));
  } catch {
    // Silently fail
  }
}

export function useWishlist() {
  const { user } = useAuth();
  const [productIds, setProductIds] = useState<string[]>(loadLocalWishlist);
  const [loading, setLoading] = useState(false);

  // Load from Supabase when logged in; merge local items into remote
  useEffect(() => {
    if (!hasSupabaseConfig || !user) {
      setProductIds(loadLocalWishlist());
      return;
    }

    let mounted = true;

    async function syncWishlist() {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('wishlists')
          .select('product_id')
          .eq('user_id', user!.id);

        if (error) {
          console.error('wishlist load error:', error);
          return;
        }

        const remoteIds = (data ?? []).map((row) => row.product_id as string);
        const localIds = loadLocalWishlist();
        const toInsert = localIds.filter((id) => !remoteIds.includes(id));

        if (toInsert.length > 0) {
          await supabase.from('wishlists').upsert(
            toInsert.map((product_id) => ({
              user_id: user!.id,
              product_id,
            })),
            { onConflict: 'user_id,product_id', ignoreDuplicates: true }
          );
        }

        const merged = [...new Set([...remoteIds, ...localIds])];
        if (mounted) {
          setProductIds(merged);
          saveLocalWishlist(merged);
        }
      } finally {
        if (mounted) setLoading(false);
      }
    }

    syncWishlist();
    return () => {
      mounted = false;
    };
  }, [user]);

  useEffect(() => {
    if (user) return;
    saveLocalWishlist(productIds);
  }, [productIds, user]);

  const isWishlisted = useCallback(
    (productId: string) => productIds.includes(productId),
    [productIds]
  );

  const add = useCallback(
    async (productId: string) => {
      setProductIds((prev) => (prev.includes(productId) ? prev : [...prev, productId]));

      if (hasSupabaseConfig && user) {
        const { error } = await supabase.from('wishlists').upsert(
          { user_id: user.id, product_id: productId },
          { onConflict: 'user_id,product_id', ignoreDuplicates: true }
        );
        if (error) console.error('wishlist add error:', error);
      } else {
        const next = loadLocalWishlist();
        if (!next.includes(productId)) {
          saveLocalWishlist([...next, productId]);
        }
      }
    },
    [user]
  );

  const remove = useCallback(
    async (productId: string) => {
      setProductIds((prev) => prev.filter((id) => id !== productId));

      if (hasSupabaseConfig && user) {
        const { error } = await supabase
          .from('wishlists')
          .delete()
          .eq('user_id', user.id)
          .eq('product_id', productId);
        if (error) console.error('wishlist remove error:', error);
      } else {
        saveLocalWishlist(loadLocalWishlist().filter((id) => id !== productId));
      }
    },
    [user]
  );

  const toggle = useCallback(
    async (productId: string) => {
      if (productIds.includes(productId)) {
        await remove(productId);
        return false;
      }
      await add(productId);
      return true;
    },
    [productIds, add, remove]
  );

  return {
    productIds,
    loading,
    isWishlisted,
    add,
    remove,
    toggle,
  };
}
