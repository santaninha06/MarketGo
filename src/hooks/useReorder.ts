import type { Product } from '@/types';
import type { CartItem } from '@/utils/cart';

export interface PreviousOrderItem {
  product_id: string | null;
  quantity: number;
}

export function buildReorderItems(
  previousItems: PreviousOrderItem[],
  products: Product[],
): CartItem[] {
  const items: CartItem[] = [];

  for (const previousItem of previousItems) {
    if (!previousItem.product_id || previousItem.quantity <= 0) {
      continue;
    }

    const product = products.find(
      (item) => item.id === previousItem.product_id && item.is_active,
    );

    if (!product) {
      continue;
    }

    const existing = items.find((item) => item.product.id === product.id);

    if (existing) {
      existing.quantity += previousItem.quantity;
    } else {
      items.push({
        product,
        quantity: previousItem.quantity,
      });
    }
  }

  return items;
}
