import { createContext, useContext, useMemo, useState, type ReactNode } from 'react';

import type { Product } from '@/types';
import {
  addToCart,
  canAddFromStore,
  getCartCount,
  getCartTotal,
  updateCartQuantity,
  type CartItem,
} from '@/utils/cart';

interface CartContextData {
  items: CartItem[];
  count: number;
  total: number;
  storeId: string | null;
  add: (product: Product, quantity?: number) => boolean;
  updateQuantity: (productId: string, quantity: number) => void;
  clear: () => void;
}

const CartContext = createContext<CartContextData | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  const storeId = items[0]?.product.store_id ?? null;

  function add(product: Product, quantity = 1): boolean {
    if (!canAddFromStore(storeId, product.store_id)) {
      return false;
    }

    setItems((current) => addToCart(current, product, quantity));
    return true;
  }

  function updateQuantity(productId: string, quantity: number) {
    setItems((current) => updateCartQuantity(current, productId, quantity));
  }

  function clear() {
    setItems([]);
  }

  const value = useMemo(
    () => ({
      items,
      count: getCartCount(items),
      total: getCartTotal(items),
      storeId,
      add,
      updateQuantity,
      clear,
    }),
    [items, storeId],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error('useCart deve ser usado dentro de CartProvider.');
  }

  return context;
}
