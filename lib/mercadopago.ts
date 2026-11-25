import crypto from 'crypto';
import { MercadoPagoConfig, Payment } from 'mercadopago';

export function getMercadoPagoPaymentClient(): Payment {
  const accessToken = process.env.MERCADOPAGO_ACCESS_TOKEN;

  if (!accessToken) {
    throw new Error('MERCADOPAGO_ACCESS_TOKEN não configurado nas variáveis de ambiente.');
  }

  const client = new MercadoPagoConfig({
    accessToken,
    options: { timeout: 10000 },
  });

  return new Payment(client);
}

export function verifyMercadoPagoWebhookSignature(params: {
  xSignature: string | null;
  xRequestId: string | null;
  dataId: string;
}): boolean {
  const secret = process.env.MERCADOPAGO_WEBHOOK_SECRET?.trim();
  if (!secret) {
    return true;
  }

  if (!params.xSignature || !params.xRequestId) {
    return false;
  }

  const parts = params.xSignature.split(',');
  let ts = '';
  let v1 = '';

  for (const part of parts) {
    const [key, value] = part.split('=').map((item) => item.trim());
    if (key === 'ts') ts = value;
    if (key === 'v1') v1 = value;
  }

  if (!ts || !v1) {
    return false;
  }

  const manifest = `id:${params.dataId.toLowerCase()};request-id:${params.xRequestId};ts:${ts};`;
  const expectedHash = crypto.createHmac('sha256', secret).update(manifest).digest('hex');

  const expectedBuffer = Buffer.from(expectedHash, 'hex');
  const receivedBuffer = Buffer.from(v1, 'hex');

  if (expectedBuffer.length !== receivedBuffer.length) {
    return false;
  }

  return crypto.timingSafeEqual(expectedBuffer, receivedBuffer);
}