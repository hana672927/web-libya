import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';

export interface Order {
  id: string;
  name: string | null;
  whatsapp: string;
  store_link: string | null;
  details: string | null;
  status: string;
  created_at: string;
}

const TABLE = 'orders';

export function useOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOrders = useCallback(async () => {
    const { data, error } = await supabase
      .from(TABLE)
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }
    setOrders((data as Order[]) || []);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchOrders();

    const channel = supabase
      .channel('orders_changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: TABLE },
        () => fetchOrders()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchOrders]);

  const updateOrderStatus = useCallback(async (id: string, status: string) => {
    const { error } = await supabase
      .from(TABLE)
      .update({ status })
      .eq('id', id);
    if (error) console.error('Failed to update order:', error.message);
  }, []);

  const deleteOrder = useCallback(async (id: string) => {
    const { error } = await supabase
      .from(TABLE)
      .delete()
      .eq('id', id);
    if (error) console.error('Failed to delete order:', error.message);
  }, []);

  return { orders, loading, error, updateOrderStatus, deleteOrder, refetch: fetchOrders };
}
