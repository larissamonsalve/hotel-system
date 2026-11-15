import prisma from '@/lib/prisma';
import { CriarReservaOnlineDTO } from '@/schemas/reserva.schema';
import { OrigemReserva, StatusReserva } from '@prisma/client';

export class ReservaRepository {
  async buscarPorId(hotelId: string, id: string) {
    return prisma.reserva.findFirst({
      where: {
        id,
        hotelId,
      },
    });
  }

  async atualizarStatus(hotelId: string, id: string, status: StatusReserva) {
    const reserva = await this.buscarPorId(hotelId, id);
    
    if (!reserva) throw new Error('Reserva não encontrada no tenant ativo.');

    return prisma.reserva.update({
      where: { id },
      data: { status },
    });
  }

  async verificarDisponibilidade(hotelId: string, quartoId: string, checkIn: Date, checkOut: Date): Promise<boolean> {
    const conflitos = await prisma.reserva.count({
      where: {
        hotelId,
        quartoId,
        status: {
          in: ['TAXA_RESERVA', 'CONFIRMADA_BALCAO', 'EM_ANDAMENTO'],
        },
        OR: [
          {
            checkInPrevisto: { lt: checkOut },
            checkOutPrevisto: { gt: checkIn },
          },
        ],
      },
    });
    return conflitos === 0;
  }

  async criarReservaOnline(hotelId: string, dados: CriarReservaOnlineDTO, valorTotalDiarias: number) {
    return prisma.reserva.create({
      data: {
        hotelId,
        origem: OrigemReserva.ONLINE,
        status: StatusReserva.PENDENTE,
        leadId: dados.leadId,
        quartoId: dados.quartoId,
        checkInPrevisto: new Date(dados.dataCheckIn),
        checkOutPrevisto: new Date(dados.dataCheckOut),
        valorTotal: valorTotalDiarias,
        valorPago: 0.00,
      },
    });
  }
}