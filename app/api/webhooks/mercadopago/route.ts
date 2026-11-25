import { NextResponse } from 'next/server';
import { verifyMercadoPagoWebhookSignature } from '@/lib/mercadopago';
import { PaymentService } from '@/services/payment.service';

const paymentService = new PaymentService();

export async function POST(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const body = (await request.json().catch(() => ({}))) as {
      type?: string;
      topic?: string;
      action?: string;
      data?: { id?: string | number };
    };

    const topic = body.type || body.topic || searchParams.get('type') || searchParams.get('topic');
    const dataId = String(
      body.data?.id || searchParams.get('data.id') || searchParams.get('id') || ''
    ).trim();

    if (!dataId) {
      return NextResponse.json({ received: true, ignored: true }, { status: 200 });
    }

    // Processa somente eventos de pagamento
    if (topic && topic !== 'payment') {
      return NextResponse.json({ received: true, ignored: true }, { status: 200 });
    }

    const isValidSignature = verifyMercadoPagoWebhookSignature({
      xSignature: request.headers.get('x-signature'),
      xRequestId: request.headers.get('x-request-id'),
      dataId,
    });

    if (!isValidSignature) {
      console.warn('[Webhook MercadoPago] Assinatura inválida rejeitada.');
      return NextResponse.json({ error: 'Assinatura inválida.' }, { status: 401 });
    }

    const result = await paymentService.sincronizarPagamentoComMercadoPago(dataId);

    return NextResponse.json({ received: true, status: result.status }, { status: 200 });
  } catch (error) {
    console.error('[POST /api/webhooks/mercadopago] Erro ao processar webhook:', error);
    return NextResponse.json({ error: 'Erro ao processar notificação.' }, { status: 500 });
  }
}