import { useCart } from '@/context/CartContext';

export function useAddToCart() {
  const { items, add, updateQuantity, clear } = useCart();

  return {
    items,
    add,
    updateQuantity,
    clear,
  };
}
