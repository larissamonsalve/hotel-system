import crypto from 'crypto';
import { MetodoPagamento, OrigemReserva, StatusReserva, TipoPagamento } from '@prisma/client';
import prisma from '@/lib/prisma';
import { getMercadoPagoPaymentClient } from '@/lib/mercadopago';
import { generateVoucherPdf } from '@/lib/pdf-voucher';
import { sendReservationConfirmationEmail } from '@/lib/mail';
import { CreatePaymentDTO } from '@/schemas/payment.schema';

export class PaymentDomainError extends Error {
  statusCode: number;

  constructor(message: string, statusCode = 400) {
    super(message);
    this.statusCode = statusCode;
  }
}

function generateLocalizerCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = 'HS';
  for (let i = 0; i < 4; i++) {
    code += chars[crypto.randomInt(0, chars.length)];
  }
  return code;
}

function maskCpf(cpfDigits: string): string {
  const lastTwo = cpfDigits.slice(-2);
  return `•••.•••.•••-${lastTwo}`;
}

function roundCurrency(value: number): number {
  return Math.round(value * 100) / 100;
}

function parseIsoDateNoonUTC(dateStr: string): Date {
  return new Date(`${dateStr}T12:00:00.000Z`);
}

function formatBRL(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
}

function formatDateBR(date: Date): string {
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(date);
}

export class PaymentService {
  async criarPagamentoSinal(slug: string, dto: CreatePaymentDTO) {
    const hotel = await prisma.hotel.findUnique({
      where: { slug, ativo: true },
      select: { id: true, slug: true, nome: true },
    });

    if (!hotel) {
      throw new PaymentDomainError('Estabelecimento não encontrado.', 404);
    }

    const lead = await prisma.lead.findFirst({
      where: {
        hotelId: hotel.id,
        email: { equals: dto.email, mode: 'insensitive' },
      },
    });

    if (!lead) {
      throw new PaymentDomainError('Cadastro do hóspede não encontrado.', 404);
    }

    if (!lead.emailValidado) {
      throw new PaymentDomainError(
        'É obrigatório verificar seu e-mail antes de prosseguir para o pagamento.',
        403
      );
    }

    // 3. Valida quarto pertencente ao tenant
    const quarto = await prisma.quarto.findFirst({
      where: { id: dto.quartoId, hotelId: hotel.id },
    });

    if (!quarto) {
      throw new PaymentDomainError('Acomodação não encontrada para este hotel.', 404);
    }

    const checkInDate = parseIsoDateNoonUTC(dto.checkIn);
    const checkOutDate = parseIsoDateNoonUTC(dto.checkOut);
    const diffMs = checkOutDate.getTime() - checkInDate.getTime();
    const qtdDiarias = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

    if (qtdDiarias <= 0 || qtdDiarias > 60) {
      throw new PaymentDomainError('Período de hospedagem inválido.', 400);
    }

    // Anti-overbooking: impede reserva confirmada sobreposta no mesmo quarto
    const conflito = await prisma.reserva.findFirst({
      where: {
        hotelId: hotel.id,
        quartoId: quarto.id,
        status: {
          in: [
            StatusReserva.TAXA_RESERVA,
            StatusReserva.CONFIRMADA_BALCAO,
            StatusReserva.EM_ANDAMENTO,
          ],
        },
        checkInPrevisto: { lt: checkOutDate },
        checkOutPrevisto: { gt: checkInDate },
      },
      select: { id: true },
    });

    if (conflito) {
      throw new PaymentDomainError(
        'Esta acomodação não está mais disponível para as datas selecionadas.',
        409
      );
    }

    const valorDiaria = Number(quarto.valorDiaria);
    const valorTotal = roundCurrency(valorDiaria * qtdDiarias);
    const valorTaxaReserva = roundCurrency(valorTotal * 0.3);

    let codigoLocalizador = generateLocalizerCode();
    const existente = await prisma.reserva.findUnique({
      where: { codigoLocalizador },
      select: { id: true },
    });
    if (existente) {
      codigoLocalizador = `${generateLocalizerCode()}${crypto.randomInt(10, 99)}`;
    }

    const reserva = await prisma.reserva.create({
      data: {
        hotelId: hotel.id,
        codigoLocalizador,
        cpfMascarado: maskCpf(dto.cpf),
        origem: OrigemReserva.ONLINE,
        status: StatusReserva.PENDENTE,
        leadId: lead.id,
        quartoId: quarto.id,
        checkInPrevisto: checkInDate,
        checkOutPrevisto: checkOutDate,
        valorTotal,
        valorPago: 0,
      },
    });

    const paymentClient = getMercadoPagoPaymentClient();
    const appUrl = process.env.NEXT_PUBLIC_APP_URL?.trim();
    const notificationUrl =
      appUrl && appUrl.startsWith('https://') && !appUrl.includes('localhost')
        ? `${appUrl.replace(/\/$/, '')}/api/webhooks/mercadopago`
        : undefined;

    const nomePartes = lead.nome.trim().split(/\s+/);
    const firstName = nomePartes[0] || 'Hospede';
    const lastName = nomePartes.slice(1).join(' ') || 'Reserva';

    const mpBaseBody = {
      transaction_amount: valorTaxaReserva,
      description: `Taxa de reserva 30% - ${quarto.tipo} (${hotel.nome}) #${codigoLocalizador}`,
      external_reference: reserva.id,
      ...(notificationUrl ? { notification_url: notificationUrl } : {}),
      payer: {
        email: lead.email,
        first_name: firstName,
        last_name: lastName,
        identification: {
          type: 'CPF',
          number: dto.cpf,
        },
      },
    };

    try {
      const mpBody =
        dto.metodo === 'PIX'
          ? {
              ...mpBaseBody,
              payment_method_id: 'pix',
              date_of_expiration: new Date(Date.now() + 15 * 60 * 1000).toISOString(),
            }
          : {
              ...mpBaseBody,
              token: dto.token,
              payment_method_id: dto.paymentMethodId,
              installments: dto.installments,
              ...(dto.issuerId ? { issuer_id: Number(dto.issuerId) } : {}),
            };

      const mpResponse = await paymentClient.create({
        body: mpBody,
        requestOptions: {
          idempotencyKey: `reserva-${reserva.id}`,
        },
      });

      const mpId = mpResponse.id ? String(mpResponse.id) : null;
      if (!mpId) {
        throw new Error('Resposta do gateway sem identificador da transação.');
      }

      // Salva registro inicial do pagamento como PENDENTE
      await prisma.pagamento.create({
        data: {
          hotelId: hotel.id,
          reservaId: reserva.id,
          valor: valorTaxaReserva,
          tipo: TipoPagamento.SINAL_30,
          metodo:
            dto.metodo === 'PIX' ? MetodoPagamento.PIX : MetodoPagamento.CARTAO_CREDITO,
          status: 'PENDENTE',
          referenciaExt: mpId,
        },
      });

      if (dto.metodo === 'PIX') {
        const txData = mpResponse.point_of_interaction?.transaction_data;

        return {
          reservaId: reserva.id,
          codigoLocalizador,
          status: 'PENDENTE' as const,
          metodo: 'PIX' as const,
          valorTaxaReserva,
          pix: {
            qrCode: txData?.qr_code || '',
            qrCodeBase64: txData?.qr_code_base64 || '',
            expiresAt: mpResponse.date_of_expiration || null,
          },
        };
      }

      // Para Cartão de Crédito: confirma consultando/validando via método idempotente do backend
      const resultado = await this.sincronizarPagamentoComMercadoPago(mpId);

      if (resultado.status === 'REJEITADO' || resultado.status === 'CANCELADO') {
        throw new PaymentDomainError(
          'Pagamento recusado pela operadora do cartão. Verifique os dados ou tente outro método.',
          402
        );
      }

      return {
        reservaId: reserva.id,
        codigoLocalizador,
        status: resultado.status,
        metodo: 'CARTAO_CREDITO' as const,
        valorTaxaReserva,
      };
    } catch (error) {
      if (error instanceof PaymentDomainError) {
        throw error;
      }

      // Cancela reserva pendente se houve falha ao criar cobrança no gateway
      await prisma.reserva.update({
        where: { id: reserva.id },
        data: { status: StatusReserva.CANCELADA },
      });

      console.error('[PaymentService.criarPagamentoSinal] Erro no gateway de pagamento:', error);

      const mpStatus =
        typeof error === 'object' && error !== null && 'status' in error
          ? Number((error as { status?: number }).status)
          : 500;

      if (mpStatus === 400) {
        throw new PaymentDomainError(
          'Dados de pagamento inválidos ou recusados. Verifique o cartão, CPF e e-mail informados.',
          400
        );
      }

      throw new PaymentDomainError(
        'Não foi possível processar o pagamento no momento. Tente novamente em instantes.',
        502
      );
    }
  }

  /**
   * Consulta a transação real na API de pagamentos, aplica transição de estado
   * de forma estritamente idempotente e dispara o e-mail + PDF apenas uma única vez.
   */
  async sincronizarPagamentoComMercadoPago(mpPaymentId: string) {
    const paymentClient = getMercadoPagoPaymentClient();
    const mpPayment = await paymentClient.get({ id: mpPaymentId });

    const mpStatus = mpPayment.status;
    const externalRef = mpPayment.external_reference;

    const pagamento = await prisma.pagamento.findFirst({
      where: {
        OR: [
          { referenciaExt: String(mpPaymentId) },
          ...(externalRef ? [{ reservaId: externalRef }] : []),
        ],
      },
      include: {
        reserva: {
          include: {
            hotel: true,
            lead: true,
            quarto: true,
          },
        },
      },
    });

    if (!pagamento) {
      return { found: false, status: 'NAO_ENCONTRADO' as const };
    }

    // 1. Aprovado
    if (mpStatus === 'approved') {
      // Idempotência: só transita se ainda NÃO estiver APROVADO
      const shouldSendEmail = await prisma.$transaction(async (tx) => {
        const updated = await tx.pagamento.updateMany({
          where: {
            id: pagamento.id,
            status: { not: 'APROVADO' },
          },
          data: {
            status: 'APROVADO',
            referenciaExt: String(mpPaymentId),
          },
        });

        if (updated.count === 0) {
          return false; // Já processado anteriormente (webhook repetido)
        }

        await tx.reserva.update({
          where: { id: pagamento.reservaId },
          data: {
            status: StatusReserva.TAXA_RESERVA,
            valorPago: pagamento.valor,
          },
        });

        return true;
      });

      // Dispara e-mail de confirmação com PDF apenas na primeira confirmação válida
      if (shouldSendEmail) {
        await this.enviarEmailConfirmacaoComVoucher(pagamento);
      }

      return {
        found: true,
        status: 'APROVADO' as const,
        codigoLocalizador: pagamento.reserva.codigoLocalizador,
      };
    }

    // 2. Recusado ou Cancelado
    if (mpStatus === 'rejected' || mpStatus === 'cancelled' || mpStatus === 'refunded') {
      const novoStatusPagamento = mpStatus === 'rejected' ? 'REJEITADO' : 'CANCELADO';

      await prisma.$transaction(async (tx) => {
        await tx.pagamento.updateMany({
          where: {
            id: pagamento.id,
            status: 'PENDENTE',
          },
          data: { status: novoStatusPagamento },
        });

        await tx.reserva.updateMany({
          where: {
            id: pagamento.reservaId,
            status: StatusReserva.PENDENTE,
          },
          data: { status: StatusReserva.CANCELADA },
        });
      });

      return {
        found: true,
        status: novoStatusPagamento as 'REJEITADO' | 'CANCELADO',
        codigoLocalizador: pagamento.reserva.codigoLocalizador,
      };
    }

    return {
      found: true,
      status: 'PENDENTE' as const,
      codigoLocalizador: pagamento.reserva.codigoLocalizador,
    };
  }

  private async enviarEmailConfirmacaoComVoucher(pagamento: {
    valor: unknown;
    metodo: MetodoPagamento;
    reserva: {
      codigoLocalizador: string | null;
      cpfMascarado: string | null;
      checkInPrevisto: Date;
      checkOutPrevisto: Date;
      valorTotal: unknown;
      hotel: {
        slug: string;
        nome: string;
        endereco: string | null;
        telefone: string | null;
        corPrincipal: string;
        corSecundaria: string;
      };
      lead: {
        nome: string;
        email: string;
      };
      quarto: {
        tipo: string;
        capacidade: number;
      };
    };
  }) {
    try {
      const { reserva } = pagamento;
      const codigoLocalizador = reserva.codigoLocalizador || 'RESERVA';
      const valorTotal = Number(reserva.valorTotal);
      const valorPago = Number(pagamento.valor);
      const saldoRestante = Math.max(0, roundCurrency(valorTotal - valorPago));

      const diffMs =
        reserva.checkOutPrevisto.getTime() - reserva.checkInPrevisto.getTime();
      const qtdDiarias = Math.max(1, Math.ceil(diffMs / (1000 * 60 * 60 * 24)));
      const metodoLabel =
        pagamento.metodo === MetodoPagamento.PIX ? 'Pix' : 'Cartão de Crédito';

      const pdfBuffer = await generateVoucherPdf({
        codigoLocalizador,
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
        metodoPagamento: metodoLabel,
        dataConfirmacao: new Date(),
      });

      const baseUrl = (process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000').replace(
        /\/$/,
        ''
      );
      const voucherUrl = `${baseUrl}/h/${reserva.hotel.slug}/confirmacao?codigo=${encodeURIComponent(codigoLocalizador)}&email=${encodeURIComponent(reserva.lead.email)}`;

      await sendReservationConfirmationEmail({
        to: reserva.lead.email,
        hospedeNome: reserva.lead.nome,
        codigoLocalizador,
        hotelNome: reserva.hotel.nome,
        hotelEndereco: reserva.hotel.endereco,
        corPrincipal: reserva.hotel.corPrincipal,
        corSecundaria: reserva.hotel.corSecundaria,
        quartoTipo: reserva.quarto.tipo,
        checkInLabel: formatDateBR(reserva.checkInPrevisto),
        checkOutLabel: formatDateBR(reserva.checkOutPrevisto),
        valorPagoLabel: formatBRL(valorPago),
        saldoRestanteLabel: formatBRL(saldoRestante),
        metodoLabel,
        voucherUrl,
        pdfBuffer,
      });
    } catch (emailError) {
      // Não reverte a aprovação do pagamento caso o SMTP oscile momentaneamente
      console.error('[PaymentService] Falha ao enviar e-mail de confirmação:', emailError);
    }
  }
}