import { supabase } from '@/lib/supabase';
import type { Product } from '@/types';

export async function getProductsByStore(storeId: string): Promise<Product[]> {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('store_id', storeId)
    .eq('is_active', true)
    .order('section')
    .order('name');

  if (error) {
    throw error;
  }

  return (data ?? []) as Product[];
}

export async function getProductById(id: string): Promise<Product> {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    throw error;
  }

  return data as Product;
}
