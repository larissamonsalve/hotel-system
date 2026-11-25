import { NextResponse } from 'next/server';
import { StatusReserva } from '@prisma/client';
import prisma from '@/lib/prisma';
import { PaymentService } from '@/services/payment.service';

const paymentService = new PaymentService();

interface RouteContext {
  params: Promise<{ reservaId: string }>;
}

export async function GET(request: Request, context: RouteContext) {
  try {
    const { reservaId } = await context.params;
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email')?.trim().toLowerCase();
    const slug = request.headers.get('x-tenant-slug')?.trim();

    if (!email || !slug) {
      return NextResponse.json({ error: 'Parâmetros obrigatórios ausentes.' }, { status: 400 });
    }

    const reserva = await prisma.reserva.findFirst({
      where: {
        id: reservaId,
        hotel: { slug, ativo: true },
        lead: { email: { equals: email, mode: 'insensitive' } },
      },
      include: {
        pagamentos: {
          orderBy: { criadoEm: 'desc' },
          take: 1,
        },
      },
    });

    if (!reserva) {
      return NextResponse.json({ error: 'Reserva não encontrada.' }, { status: 404 });
    }

    if (reserva.status === StatusReserva.TAXA_RESERVA) {
      return NextResponse.json({
        status: 'APROVADO',
        codigoLocalizador: reserva.codigoLocalizador,
      });
    }

    const ultimoPagamento = reserva.pagamentos[0];
    if (
      reserva.status === StatusReserva.PENDENTE &&
      ultimoPagamento?.referenciaExt
    ) {
      const sync = await paymentService.sincronizarPagamentoComMercadoPago(
        ultimoPagamento.referenciaExt
      );
      return NextResponse.json({
        status: sync.status,
        codigoLocalizador: reserva.codigoLocalizador,
      });
    }

    return NextResponse.json({
      status: reserva.status === StatusReserva.CANCELADA ? 'CANCELADO' : 'PENDENTE',
      codigoLocalizador: reserva.codigoLocalizador,
    });
  } catch (error) {
    console.error('[GET /api/payments/[reservaId]/status] Erro interno:', error);
    return NextResponse.json(
      { error: 'Não foi possível verificar o status do pagamento.' },
      { status: 500 }
    );
  }
}