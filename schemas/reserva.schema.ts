import { z } from 'zod';

export const criarReservaOnlineSchema = z.object({
  leadId: z.string().uuid('ID de Lead inválido.'),
  quartoId: z.string().uuid('ID de Quarto inválido.'),
  dataCheckIn: z.string().datetime({ message: 'Formato de data inválido (ISO 8601).' }),
  dataCheckOut: z.string().datetime({ message: 'Formato de data inválido (ISO 8601).' }),
}).strict().refine((data) => new Date(data.dataCheckIn) < new Date(data.dataCheckOut), {
  message: 'A data de check-out deve ser posterior ao check-in.',
  path: ['dataCheckOut'],
});

export type CriarReservaOnlineDTO = z.infer<typeof criarReservaOnlineSchema>;