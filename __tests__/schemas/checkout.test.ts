import { checkoutSchema } from '@/schemas/checkout';

describe('Validação do checkout', () => {
  it('aceita endereço e forma de pagamento válidos', () => {
    expect(
      checkoutSchema.safeParse({
        address: 'Rua das Flores, 123',
        paymentMethod: 'pix',
        notes: '',
      }).success,
    ).toBe(true);
  });

  it('rejeita uma forma de pagamento inválida', () => {
    expect(
      checkoutSchema.safeParse({
        address: 'Rua das Flores, 123',
        paymentMethod: 'bitcoin',
        notes: '',
      }).success,
    ).toBe(false);
  });
});
