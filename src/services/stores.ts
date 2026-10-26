import { supabase } from '@/lib/supabase';
import type { Store } from '@/types';

export async function getStores(): Promise<Store[]> {
  const { data, error } = await supabase.from('stores').select('*').order('name');

  if (error) {
    throw error;
  }

  return (data ?? []) as Store[];
}

export async function getStoreById(id: string): Promise<Store> {
  const { data, error } = await supabase.from('stores').select('*').eq('id', id).single();

  if (error) {
    throw error;
  }

  return data as Store;
}
