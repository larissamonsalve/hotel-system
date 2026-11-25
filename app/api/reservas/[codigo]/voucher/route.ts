import { NextResponse } from 'next/server';
import { MetodoPagamento, StatusReserva } from '@prisma/client';
import prisma from '@/lib/prisma';
import { generateVoucherPdf } from '@/lib/pdf-voucher';

interface RouteContext {
  params: Promise<{ codigo: string }>;
}

export async function GET(request: Request, context: RouteContext) {
  try {
    const { codigo } = await context.params;
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email')?.trim().toLowerCase();

    if (!codigo || !email) {
      return NextResponse.json({ error: 'Dados obrigatórios ausentes.' }, { status: 400 });
    }

    const reserva = await prisma.reserva.findFirst({
      where: {
        codigoLocalizador: codigo.toUpperCase(),
        lead: { email: { equals: email, mode: 'insensitive' } },
        status: {
          in: [
            StatusReserva.TAXA_RESERVA,
            StatusReserva.CONFIRMADA_BALCAO,
            StatusReserva.EM_ANDAMENTO,
            StatusReserva.FINALIZADA,
          ],
        },
      },
      include: {
        hotel: true,
        lead: true,
        quarto: true,
        pagamentos: {
          where: { status: 'APROVADO' },
          orderBy: { criadoEm: 'desc' },
          take: 1,
        },
      },
    });

    if (!reserva) {
      return NextResponse.json(
        { error: 'Comprovante não encontrado ou pagamento ainda não confirmado.' },
        { status: 404 }
      );
    }

    const valorTotal = Number(reserva.valorTotal);
    const valorPago = Number(reserva.valorPago);
    const saldoRestante = Math.max(0, Math.round((valorTotal - valorPago) * 100) / 100);
    const diffMs = reserva.checkOutPrevisto.getTime() - reserva.checkInPrevisto.getTime();
    const qtdDiarias = Math.max(1, Math.ceil(diffMs / (1000 * 60 * 60 * 24)));
    const metodo =
      reserva.pagamentos[0]?.metodo === MetodoPagamento.PIX ? 'Pix' : 'Cartão de Crédito';

    const pdfBuffer = await generateVoucherPdf({
      codigoLocalizador: reserva.codigoLocalizador || codigo.toUpperCase(),
      hotelNome: reserva.hotel.nome,
      hotelEndereco: reserva.hotel.endereco,
      hotelTelefone: reserva.hotel.telefone,
      corPrincipal: reserva.hotel.corPrincipal,
      corSecundaria: reserva.hotel.corSecundaria,
      hospedeNome: reserva.lead.nome,
      hospedeEmail: reserva.lead.email,
      cpfMascarado: reserva.cpfMascarado,
      quartoTipo: reserva.quarto.tipo,
      capacidade: reserva.quarto.capacidade,
      checkIn: reserva.checkInPrevisto,
      checkOut: reserva.checkOutPrevisto,
      qtdDiarias,
      valorTotal,
      valorPago,
      saldoRestante,
      metodoPagamento: metodo,
      dataConfirmacao: reserva.atualizadoEm,
    });

    return new NextResponse(new Uint8Array(pdfBuffer), {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="voucher-${reserva.codigoLocalizador}.pdf"`,
        'Cache-Control': 'no-store',
      },
    });
  } catch (error) {
    console.error('[GET /api/reservas/[codigo]/voucher] Erro ao gerar PDF:', error);
    return NextResponse.json(
      { error: 'Erro ao gerar comprovante em PDF.' },
      { status: 500 }
    );
  }
}