import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import prisma from '@/lib/prisma';
import { verifyOtpSchema } from '@/schemas/otp.schema';
import { checkRateLimit } from '@/lib/rate-limit';

const MAX_TENTATIVAS = 5;

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
    if (!checkRateLimit(`otp-verify:${ip}`, 10, 60000)) {
      return NextResponse.json(
        { error: 'Muitas tentativas detectadas. Aguarde um instante.' },
        { status: 429 }
      );
    }

    const body = await request.json();
    const parsed = verifyOtpSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || 'Código inválido.' },
        { status: 400 }
      );
    }

    const { email, codigo } = parsed.data;

    const hotel = await prisma.hotel.findUnique({
      where: { slug, ativo: true },
      select: { id: true },
    });

    if (!hotel) {
      return NextResponse.json(
        { error: 'Estabelecimento não encontrado.' },
        { status: 404 }
      );
    }

    const otpRegistro = await prisma.otp.findUnique({
      where: { email },
    });

    if (!otpRegistro) {
      return NextResponse.json(
        { error: 'Nenhum código ativo encontrado. Solicite um novo código.' },
        { status: 400 }
      );
    }

    if (otpRegistro.tentativas >= MAX_TENTATIVAS) {
      return NextResponse.json(
        { error: 'Limite de tentativas atingido. Solicite um novo código.' },
        { status: 429 }
      );
    }

    if (new Date() > otpRegistro.expiraEm) {
      return NextResponse.json(
        { error: 'Este código expirou. Solicite um novo código para continuar.' },
        { status: 400 }
      );
    }

    if (otpRegistro.utilizado) {
      return NextResponse.json(
        { error: 'Este código já foi utilizado. Solicite um novo código.' },
        { status: 400 }
      );
    }

    const codigoValido = await bcrypt.compare(codigo, otpRegistro.codigoHash);

    if (!codigoValido) {
      const novasTentativas = otpRegistro.tentativas + 1;
      const excedeuLimite = novasTentativas >= MAX_TENTATIVAS;

      await prisma.otp.update({
        where: { id: otpRegistro.id },
        data: {
          tentativas: novasTentativas,
          utilizado: excedeuLimite,
        },
      });

      const restantes = MAX_TENTATIVAS - novasTentativas;
      return NextResponse.json(
        {
          error: excedeuLimite
            ? 'Limite de tentativas atingido. Solicite um novo código.'
            : `Código incorreto. Você ainda tem ${restantes} tentativa(s).`,
        },
        { status: excedeuLimite ? 429 : 400 }
      );
    }

    await prisma.$transaction([
      prisma.otp.update({
        where: { id: otpRegistro.id },
        data: { utilizado: true },
      }),
      prisma.lead.updateMany({
        where: {
          hotelId: hotel.id,
          email: { equals: email, mode: 'insensitive' },
        },
        data: { emailValidado: true },
      }),
    ]);

    return NextResponse.json(
      { verified: true, message: 'E-mail verificado com sucesso!' },
      { status: 200 }
    );
  } catch (error) {
    console.error('[POST /api/email/verify] Erro interno:', error);
    return NextResponse.json(
      { error: 'Erro ao validar o código. Tente novamente.' },
      { status: 500 }
    );
  }
}