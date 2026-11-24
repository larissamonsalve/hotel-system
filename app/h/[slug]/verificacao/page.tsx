import { notFound, redirect } from 'next/navigation';
import prisma from '@/lib/prisma';
import VerificacaoClient from '@/components/checkout/VerificacaoClient';
import WhatsappButton from '@/components/layout/WhatsappButton';

interface VerificacaoPageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{
    email?: string;
    quartoId?: string;
    checkIn?: string;
    checkOut?: string;
  }>;
}

export default async function VerificacaoPage({
  params,
  searchParams,
}: VerificacaoPageProps) {
  const { slug } = await params;
  const { email, quartoId, checkIn, checkOut } = await searchParams;

  const hotel = await prisma.hotel.findUnique({
    where: { slug, ativo: true },
    select: {
      id: true,
      nome: true,
      logoUrl: true,
      corPrincipal: true,
      corSecundaria: true,
      telefone: true,
      politicaCancelamento: true,
    },
  });

  if (!hotel) {
    return notFound();
  }

  if (!email || !quartoId || !checkIn || !checkOut) {
    redirect(`/h/${slug}`);
  }

  const [quarto, lead] = await Promise.all([
    prisma.quarto.findFirst({
      where: { id: quartoId, hotelId: hotel.id },
      select: {
        id: true,
        tipo: true,
        capacidade: true,
        valorDiaria: true,
        imagemUrl: true,
      },
    }),
    prisma.lead.findFirst({
      where: {
        hotelId: hotel.id,
        email: { equals: email, mode: 'insensitive' },
      },
      select: { id: true },
    }),
  ]);

  if (!quarto || !lead) {
    redirect(`/h/${slug}`);
  }

  const hotelConfig = {
    nome: hotel.nome,
    logoUrl: hotel.logoUrl,
    corPrincipal: hotel.corPrincipal,
    corSecundaria: hotel.corSecundaria,
    telefone: hotel.telefone,
    politicaCancelamento: hotel.politicaCancelamento,
  };

  const quartoInfo = {
    id: quarto.id,
    tipo: quarto.tipo,
    capacidade: quarto.capacidade,
    valorDiaria: Number(quarto.valorDiaria),
    imagemUrl: quarto.imagemUrl || '/quarto-padrao.jpg',
  };

  const mensagemAjuda = `Olá! Estou verificando meu e-mail para concluir a reserva da acomodação ${quarto.tipo} no ${hotel.nome} e preciso de ajuda.`;

  return (
    <>
      <VerificacaoClient
        slug={slug}
        email={email}
        checkIn={checkIn}
        checkOut={checkOut}
        quarto={quartoInfo}
        hotelConfig={hotelConfig}
      />
      <WhatsappButton
        hotelConfig={hotelConfig}
        mensagemCustomizada={mensagemAjuda}
        temMenuMobile={false}
      />
    </>
  );
}