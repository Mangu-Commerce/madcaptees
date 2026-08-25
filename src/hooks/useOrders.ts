'use client';

// ============================================
// Madcap Tees — useOrders Hook
// ============================================

import { useState, useEffect, useCallback } from 'react';
import type { Order } from '@/types';
import { fetchOrders } from '@/lib/api';

export function useOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchOrders();
      setOrders(data);
    } catch (err: any) {
      setError(err?.message || 'Failed to load orders');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return { orders, loading, error, refresh: load };
}
