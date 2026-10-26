import { productSchema } from '@/schemas/product';

describe('Validação de produtos', () => {
  it('aceita um produto válido', () => {
    expect(
      productSchema.safeParse({
        name: 'Arroz',
        description: 'Arroz tipo 1',
        price: 25.9,
        section: 'Mercearia',
        emoji: '🍚',
      }).success,
    ).toBe(true);
  });

  it('rejeita preço igual a zero', () => {
    expect(
      productSchema.safeParse({
        name: 'Arroz',
        description: '',
        price: 0,
        section: 'Mercearia',
        emoji: '🍚',
      }).success,
    ).toBe(false);
  });
});
