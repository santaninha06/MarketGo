import {
  addToCart,
  canAddFromStore,
  clearCart,
  getCartCount,
  getCartTotal,
  updateCartQuantity,
  type CartItem,
} from '@/utils/cart';
import type { Product } from '@/types';

const arroz: Product = {
  id: '1',
  store_id: 'loja-1',
  section: 'Mercearia',
  name: 'Arroz',
  description: 'Arroz tipo 1',
  price: 25,
  emoji: '🍚',
  is_active: true,
};

const feijao: Product = {
  ...arroz,
  id: '2',
  name: 'Feijão',
  price: 8,
  emoji: '🫘',
};

describe('Regras do carrinho', () => {
  it('adiciona um produto ao carrinho', () => {
    const cart = addToCart([], arroz);

    expect(cart).toHaveLength(1);
    expect(cart[0].quantity).toBe(1);
  });

  it('soma a quantidade quando o produto já existe', () => {
    const cart = addToCart([{ product: arroz, quantity: 1 }], arroz);

    expect(cart[0].quantity).toBe(2);
  });

  it('calcula a quantidade total de itens', () => {
    const cart: CartItem[] = [
      { product: arroz, quantity: 2 },
      { product: feijao, quantity: 3 },
    ];

    expect(getCartCount(cart)).toBe(5);
  });

  it('calcula o valor total do carrinho', () => {
    const cart: CartItem[] = [
      { product: arroz, quantity: 2 },
      { product: feijao, quantity: 3 },
    ];

    expect(getCartTotal(cart)).toBe(74);
  });

  it('remove um produto quando a quantidade chega a zero', () => {
    const cart = updateCartQuantity([{ product: arroz, quantity: 1 }], arroz.id, 0);

    expect(cart).toHaveLength(0);
  });

  it('permite apenas produtos da mesma loja', () => {
    expect(canAddFromStore('loja-1', 'loja-1')).toBe(true);
    expect(canAddFromStore('loja-1', 'loja-2')).toBe(false);
    expect(canAddFromStore(null, 'loja-1')).toBe(true);
  });

  it('limpa o carrinho', () => {
    expect(clearCart()).toEqual([]);
  });
});
