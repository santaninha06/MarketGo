import type { StoreCategory } from '@/types';

export const STORE_CATEGORIES: StoreCategory[] = [
  'Mercado',
  'Padaria',
  'Farmácia',
  'Restaurante',
  'Hortifrúti',
];

export const DEFAULT_STORE_CATEGORY = 'Mercado' satisfies StoreCategory;
