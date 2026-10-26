import { z } from 'zod';

export const checkoutSchema = z.object({
  address: z.string().trim().min(5, 'Digite um endereço válido.'),
  paymentMethod: z.enum(['pix', 'card', 'cash'], {
    errorMap: () => ({ message: 'Selecione uma forma de pagamento.' }),
  }),
  notes: z.string().max(300, 'As observações devem ter até 300 caracteres.').default(''),
});

export type CheckoutInput = z.infer<typeof checkoutSchema>;
