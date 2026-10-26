export type StoreCategory =
  'Mercado' | 'Padaria' | 'Farmácia' | 'Restaurante' | 'Hortifrúti';

export interface Store {
  id: string;
  name: string;
  category: StoreCategory;
  emoji: string;
  description: string;
  rating: number;
  delivery_fee: number;
  eta_min: number;
  eta_max: number;
  min_order: number;
  is_open: boolean;
}

export interface Product {
  id: string;
  store_id: string;
  section: string;
  name: string;
  description: string;
  price: number;
  emoji: string;
  is_active: boolean;
}

export type PaymentMethod = 'pix' | 'card' | 'cash';

export type OrderStatus =
  'received' | 'preparing' | 'out_for_delivery' | 'delivered' | 'cancelled';

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string | null;
  name: string;
  emoji: string;
  unit_price: number;
  quantity: number;
  total_price: number;
}
