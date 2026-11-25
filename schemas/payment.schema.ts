import { z } from 'zod';

const cpfSchema = z
  .string()
  .trim()
  .transform((val) => val.replace(/\D/g, ''))
  .refine((val) => val.length === 11, {
    message: 'Informe um CPF válido com 11 dígitos.',
  });

const basePaymentFields = {
  email: z.string().trim().toLowerCase().email('E-mail inválido.'),
  quartoId: z.string().uuid('Acomodação inválida.'),
  checkIn: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Data de check-in inválida.'),
  checkOut: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Data de check-out inválida.'),
  cpf: cpfSchema,
};

export const createPixPaymentSchema = z
  .object({
    ...basePaymentFields,
    metodo: z.literal('PIX'),
  })
  .strict();

export const createCardPaymentSchema = z
  .object({
    ...basePaymentFields,
    metodo: z.literal('CARTAO_CREDITO'),
    token: z.string().trim().min(10, 'Token do cartão inválido.'),
    paymentMethodId: z.string().trim().min(2, 'Bandeira do cartão inválida.'),
    issuerId: z.string().trim().optional(),
    installments: z.number().int().min(1).max(12).default(1),
  })
  .strict();

export const createPaymentSchema = z.discriminatedUnion('metodo', [
  createPixPaymentSchema,
  createCardPaymentSchema,
]);

export type CreatePaymentDTO = z.infer<typeof createPaymentSchema>;