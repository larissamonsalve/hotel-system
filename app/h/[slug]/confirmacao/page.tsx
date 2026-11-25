import { notFound, redirect } from 'next/navigation';
import { MetodoPagamento, StatusReserva } from '@prisma/client';
import prisma from '@/lib/prisma';
import CheckoutHeader from '@/components/checkout/ui/CheckoutHeader';
import ConfirmacaoVoucherCard from '@/components/checkout/ui/ConfirmacaoVoucherCard';
import WhatsappButton from '@/components/layout/WhatsappButton';

interface ConfirmacaoPageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{
    codigo?: string;
    email?: string;
  }>;
}

export default async function ConfirmacaoPage({
  params,
  searchParams,
}: ConfirmacaoPageProps) {
  const { slug } = await params;
  const { codigo, email } = await searchParams;

  const hotel = await prisma.hotel.findUnique({
    where: { slug, ativo: true },
    select: {
      id: true,
      nome: true,
      endereco: true,
      telefone: true,
      logoUrl: true,
      corPrincipal: true,
      corSecundaria: true,
      politicaCancelamento: true,
    },
  });

  if (!hotel) {
    return notFound();
  }

  if (!codigo || !email) {
    redirect(`/h/${slug}`);
  }

  const reserva = await prisma.reserva.findFirst({
    where: {
      hotelId: hotel.id,
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
    redirect(`/h/${slug}`);
  }

  const valorTotal = Number(reserva.valorTotal);
  const valorPago = Number(reserva.valorPago);
  const saldoRestante = Math.max(0, Math.round((valorTotal - valorPago) * 100) / 100);
  const diffMs = reserva.checkOutPrevisto.getTime() - reserva.checkInPrevisto.getTime();
  const qtdDiarias = Math.max(1, Math.ceil(diffMs / (1000 * 60 * 60 * 24)));
  const metodoLabel =
    reserva.pagamentos[0]?.metodo === MetodoPagamento.PIX ? 'Pix' : 'Cartão de Crédito';

  const hotelConfig = {
    nome: hotel.nome,
    logoUrl: hotel.logoUrl,
    corPrincipal: hotel.corPrincipal,
    corSecundaria: hotel.corSecundaria,
    telefone: hotel.telefone,
    politicaCancelamento: hotel.politicaCancelamento,
  };

  const mensagemAjuda = `Olá! Acabei de confirmar minha reserva #${reserva.codigoLocalizador} no ${hotel.nome} e gostaria de tirar uma dúvida.`;

  return (
    <div className="min-h-screen bg-[#f8fafc] font-sans">
      <CheckoutHeader hotelConfig={hotelConfig} />

      <ConfirmacaoVoucherCard
        slug={slug}
        codigoLocalizador={reserva.codigoLocalizador || codigo.toUpperCase()}
        hospedeNome={reserva.lead.nome}
        hospedeEmail={reserva.lead.email}
        cpfMascarado={reserva.cpfMascarado}
        hotelNome={hotel.nome}
        hotelEndereco={hotel.endereco}
        hotelLogoUrl={hotel.logoUrl}
        corPrincipal={hotel.corPrincipal}
        corSecundaria={hotel.corSecundaria}
        quartoTipo={reserva.quarto.tipo}
        quartoImagemUrl={reserva.quarto.imagemUrl}
        capacidade={reserva.quarto.capacidade}
        checkInISO={reserva.checkInPrevisto.toISOString()}
        checkOutISO={reserva.checkOutPrevisto.toISOString()}
        qtdDiarias={qtdDiarias}
        valorPago={valorPago}
        saldoRestante={saldoRestante}
        metodoLabel={metodoLabel}
      />

      <WhatsappButton
        hotelConfig={hotelConfig}
        mensagemCustomizada={mensagemAjuda}
        temMenuMobile={false}
      />
    </div>
  );
}