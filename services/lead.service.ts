import { LeadRepository } from '@/repositories/lead.repository';
import { CreateLeadDTO } from '@/schemas/lead.schema';

export class LeadService {
  private leadRepository: LeadRepository;

  constructor() {
    this.leadRepository = new LeadRepository();
  }

  async registrarLead(hotelId: string, data: CreateLeadDTO) {
    const lead = await this.leadRepository.upsertLead(hotelId, data);

    return {
      id: lead.id,
      nome: lead.nome,
      email: lead.email,
      emailValidado: lead.emailValidado,
    };
  }
}