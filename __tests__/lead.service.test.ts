import { LeadService } from '@/services/lead.service';
import { LeadRepository } from '@/repositories/lead.repository';

jest.mock('@/repositories/lead.repository');

describe('LeadService - Regras de Negócio Multi-Tenant', () => {
  let leadService: LeadService;
  let mockUpsertLead: jest.Mock;

  beforeEach(() => {
    mockUpsertLead = jest.fn();
    (LeadRepository as jest.Mock).mockImplementation(() => ({
      upsertLead: mockUpsertLead,
    }));
    leadService = new LeadService();
  });

  it('deve registrar um lead e garantir o isolamento correto por tenant (hotelId)', async () => {
    const mockHotelId = 'tenant-uuid-123';
    const inputData = {
      nome: 'Maria Silva',
      email: 'maria@exemplo.com',
      whatsapp: '92991234567',
    };

    mockUpsertLead.mockResolvedValue({
      id: 'lead-uuid-456',
      hotelId: mockHotelId,
      nome: 'Maria Silva',
      email: 'maria@exemplo.com',
      whatsapp: '92991234567',
      emailValidado: false,
      criadoEm: new Date(),
    });

    const resultado = await leadService.registrarLead(mockHotelId, inputData);

    // Valida se o Service repassou o ID do tenant corretamente para o Repository
    expect(mockUpsertLead).toHaveBeenCalledWith(mockHotelId, inputData);
    
    // Valida se a saída (DTO) continua segura e sem vazar o hotelId
    expect(resultado).toEqual({
      id: 'lead-uuid-456',
      nome: 'Maria Silva',
      email: 'maria@exemplo.com',
      emailValidado: false,
    });
  });
});