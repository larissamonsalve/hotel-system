import { NextResponse } from 'next/server';
import { createPaymentSchema } from '@/schemas/payment.schema';
import { PaymentDomainError, PaymentService } from '@/services/payment.service';
import { checkRateLimit } from '@/lib/rate-limit';

const paymentService = new PaymentService();

export async function POST(request: Request) {
  try {
    const slug = request.headers.get('x-tenant-slug')?.trim();
    if (!slug) {
      return NextResponse.json(
        { error: 'Estabelecimento não identificado.' },
        { status: 400 }
      );
    }

    const contentType = request.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      return NextResponse.json({ error: 'Formato inválido.' }, { status: 415 });
    }

    const ip = request.headers.get('x-forwarded-for') ?? '127.0.0.1';
    if (!checkRateLimit(`payments:${ip}`, 8, 60000)) {
      return NextResponse.json(
        { error: 'Muitas tentativas de pagamento. Aguarde um minuto.' },
        { status: 429 }
      );
    }

    const body = await request.json();
    const parsed = createPaymentSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || 'Dados de pagamento inválidos.' },
        { status: 400 }
      );
    }

    const resultado = await paymentService.criarPagamentoSinal(slug, parsed.data);

    return NextResponse.json(resultado, { status: 201 });
  } catch (error) {
    if (error instanceof PaymentDomainError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }

    console.error('[POST /api/payments] Erro interno:', error);
    return NextResponse.json(
      { error: 'Erro interno ao processar pagamento.' },
      { status: 500 }
    );
  }
}