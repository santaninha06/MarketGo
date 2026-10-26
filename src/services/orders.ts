import { supabase } from '@/lib/supabase';

export async function getOrders() {
  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    throw error;
  }

  return data ?? [];
}

export async function getOrderById(id: string) {
  const { data, error } = await supabase
    .from('orders')
    .select('*, order_items(*)')
    .eq('id', id)
    .single();

  if (error) {
    throw error;
  }

  return data;
}

export interface CreateOrderInput {
  storeId: string;
  items: { product_id: string; quantity: number }[];
  payment: 'pix' | 'card' | 'cash';
  changeFor: number | null;
  street: string;
  number: string;
  neighborhood: string;
  complement: string;
}

export async function createOrder(input: CreateOrderInput): Promise<string> {
  const { data, error } = await supabase.rpc('create_order', {
    p_store_id: input.storeId,
    p_items: input.items,
    p_payment: input.payment,
    p_change_for: input.changeFor,
    p_street: input.street.trim(),
    p_number: input.number.trim(),
    p_neighborhood: input.neighborhood.trim(),
    p_complement: input.complement.trim(),
  });

  if (error) {
    throw error;
  }

  return data as string;
}
