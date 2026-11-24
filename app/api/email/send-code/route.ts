import { NextResponse } from 'next/server';
import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import prisma from '@/lib/prisma';
import { sendOtpSchema } from '@/schemas/otp.schema';
import { sendOtpEmail } from '@/lib/mail';
import { checkRateLimit } from '@/lib/rate-limit';

const OTP_EXPIRATION_MINUTES = 5;

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
    if (!checkRateLimit(`otp-send:${ip}`, 5, 60000)) {
      return NextResponse.json(
        { error: 'Muitas solicitações de código. Aguarde um minuto e tente novamente.' },
        { status: 429 }
      );
    }

    const body = await request.json();
    const parsed = sendOtpSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || 'Dados inválidos.' },
        { status: 400 }
      );
    }

    const { email } = parsed.data;

    const hotel = await prisma.hotel.findUnique({
      where: { slug, ativo: true },
      select: {
        id: true,
        nome: true,
        corPrincipal: true,
        corSecundaria: true,
      },
    });

    if (!hotel) {
      return NextResponse.json(
        { error: 'Estabelecimento não encontrado.' },
        { status: 404 }
      );
    }

    const lead = await prisma.lead.findFirst({
      where: {
        hotelId: hotel.id,
        email: { equals: email, mode: 'insensitive' },
      },
      select: { id: true },
    });

    if (!lead) {
      return NextResponse.json(
        { error: 'Cadastro não encontrado para este e-mail. Volte e preencha seus dados.' },
        { status: 404 }
      );
    }

    const codigo = crypto.randomInt(100000, 1000000).toString();
    const codigoHash = await bcrypt.hash(codigo, 10);
    const expiraEm = new Date(Date.now() + OTP_EXPIRATION_MINUTES * 60 * 1000);

    await prisma.otp.upsert({
      where: { email },
      update: {
        codigoHash,
        expiraEm,
        tentativas: 0,
        utilizado: false,
      },
      create: {
        email,
        codigoHash,
        expiraEm,
        tentativas: 0,
        utilizado: false,
      },
    });

    await sendOtpEmail({
      to: email,
      codigo,
      hotelNome: hotel.nome,
      corPrincipal: hotel.corPrincipal,
      corSecundaria: hotel.corSecundaria,
    });

    return NextResponse.json(
      { message: 'Código de verificação enviado com sucesso.' },
      { status: 200 }
    );
  } catch (error) {
    console.error('[POST /api/email/send-code] Erro interno:', error);
    return NextResponse.json(
      { error: 'Não foi possível enviar o código no momento. Tente novamente.' },
      { status: 500 }
    );
  }
}