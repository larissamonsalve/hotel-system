import { z } from 'zod';

export const sendOtpSchema = z
  .object({
    email: z.string().trim().toLowerCase().email('Informe um e-mail válido.'),
  })
  .strict();

export const verifyOtpSchema = z
  .object({
    email: z.string().trim().toLowerCase().email('Informe um e-mail válido.'),
    codigo: z
      .string()
      .trim()
      .regex(/^\d{6}$/, 'O código deve conter exatamente 6 dígitos numéricos.'),
  })
  .strict();

export type SendOtpInput = z.infer<typeof sendOtpSchema>;
export type VerifyOtpInput = z.infer<typeof verifyOtpSchema>;