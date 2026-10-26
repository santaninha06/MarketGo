import type { Product } from '@/types';

export interface CartItem {
  product: Product;
  quantity: number;
}

export function getCartCount(items: CartItem[]): number {
  return items.reduce((total, item) => total + item.quantity, 0);
}

export function getCartTotal(items: CartItem[]): number {
  return items.reduce((total, item) => total + item.product.price * item.quantity, 0);
}

export function addToCart(items: CartItem[], product: Product, quantity = 1): CartItem[] {
  if (quantity <= 0) return items;

  const existing = items.find((item) => item.product.id === product.id);

  if (existing) {
    return items.map((item) =>
      item.product.id === product.id
        ? { ...item, quantity: item.quantity + quantity }
        : item,
    );
  }

  return [...items, { product, quantity }];
}

export function updateCartQuantity(
  items: CartItem[],
  productId: string,
  quantity: number,
): CartItem[] {
  if (quantity <= 0) {
    return items.filter((item) => item.product.id !== productId);
  }

  return items.map((item) =>
    item.product.id === productId ? { ...item, quantity } : item,
  );
}

export function clearCart(): CartItem[] {
  return [];
}

export function canAddFromStore(
  currentStoreId: string | null,
  productStoreId: string,
): boolean {
  return currentStoreId === null || currentStoreId === productStoreId;
}
