import { z } from 'zod';

export const productSchema = z.object({
  name: z.string().trim().min(2, 'O nome deve ter pelo menos 2 caracteres.'),
  description: z.string().trim().default(''),
  price: z.number().positive('O preço deve ser maior que zero.'),
  section: z.string().trim().min(1, 'Selecione uma seção.'),
  emoji: z.string().min(1, 'Selecione um ícone.'),
});

export type ProductInput = z.infer<typeof productSchema>;
