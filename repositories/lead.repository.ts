import prisma from '@/lib/prisma';
import { CreateLeadDTO } from '@/schemas/lead.schema';

export class LeadRepository {
  async findByEmail(hotelId: string, email: string) {
    return prisma.lead.findUnique({
      where: {
        hotelId_email: {
          hotelId,
          email,
        },
      },
    });
  }

  async upsertLead(hotelId: string, data: CreateLeadDTO) {
    return prisma.lead.upsert({
      where: {
        hotelId_email: {
          hotelId,
          email: data.email,
        },
      },
      update: {
        nome: data.nome,
        whatsapp: data.whatsapp,
      },
      create: {
        hotelId,
        nome: data.nome,
        email: data.email,
        whatsapp: data.whatsapp,
      },
    });
  }
}