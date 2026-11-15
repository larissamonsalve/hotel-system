import { z } from 'zod';

export const criarTenantSchema = z.object({
  hotelNome: z.string().trim().min(3).max(100),
  hotelSlug: z.string().trim().min(3).max(50).regex(/^[a-z0-9-]+$/),
  cnpj: z
    .string()
    .trim()
    .transform((val) => val.replace(/\D/g, ''))
    .refine((val) => val.length === 14),
  adminNome: z.string().trim().min(3).max(100),
  adminEmail: z.string().trim().toLowerCase().email(),
  adminSenha: z.string().min(8),
}).strict();

export type CriarTenantDTO = z.infer<typeof criarTenantSchema>;