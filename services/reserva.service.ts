import { ReservaRepository } from '@/repositories/reserva.repository';
import { CriarReservaOnlineDTO } from '@/schemas/reserva.schema';
import prisma from '@/lib/prisma';
import { differenceInDays, differenceInCalendarDays } from 'date-fns';

export class ReservaService {
  private reservaRepository: ReservaRepository;

  constructor() {
    this.reservaRepository = new ReservaRepository();
  }

  async processarReservaOnline(hotelId: string, dados: CriarReservaOnlineDTO) {
    const quarto = await prisma.quarto.findFirst({
      where: { id: dados.quartoId, hotelId },
    });

    if (!quarto) throw new Error('Quarto não encontrado.');

    const dataEntrada = new Date(dados.dataCheckIn);
    const dataSaida = new Date(dados.dataCheckOut);

    const disponivel = await this.reservaRepository.verificarDisponibilidade(hotelId, dados.quartoId, dataEntrada, dataSaida);
    
    if (!disponivel) throw new Error('Quarto indisponível.');

    const dias = differenceInDays(dataSaida, dataEntrada);
    
    if (dias <= 0) throw new Error('Período inválido.');

    const valorTotal = dias * Number(quarto.valorDiaria);
    const taxaReserva = valorTotal * 0.30;

    const reserva = await this.reservaRepository.criarReservaOnline(hotelId, dados, valorTotal);

    return {
      reservaId: reserva.id,
      valorTotal: valorTotal.toFixed(2),
      taxaReservaExigida: taxaReserva.toFixed(2),
      status: reserva.status,
    };
  }

  async cancelarReserva(hotelId: string, reservaId: string) {
    const reserva = await this.reservaRepository.buscarPorId(hotelId, reservaId);
    
    if (!reserva) throw new Error('Reserva não encontrada.');

    if (reserva.status === 'CANCELADA') throw new Error('Reserva já cancelada.');

    if (reserva.status === 'EM_ANDAMENTO' || reserva.status === 'FINALIZADA') {
      throw new Error('Status inválido para cancelamento.');
    }

    const diasDesdeCompra = differenceInCalendarDays(new Date(), reserva.criadoEm);

    if (diasDesdeCompra > 7) throw new Error('Prazo expirado.');
    
    const reservaCancelada = await this.reservaRepository.atualizarStatus(hotelId, reservaId, 'CANCELADA');
    
    return {
      reservaId: reservaCancelada.id,
      status: reservaCancelada.status,
    };
  }
}