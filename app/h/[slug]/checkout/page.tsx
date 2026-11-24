import { notFound } from 'next/navigation';
import prisma from '@/lib/prisma';
import CheckoutClient from '@/components/checkout/CheckoutClient';
import WhatsappButton from '@/components/layout/WhatsappButton';

interface CheckoutPageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ tipo?: string }>;
}

export default async function CheckoutLeadPage({ params, searchParams }: CheckoutPageProps) {
  const { slug } = await params;
  const { tipo } = await searchParams;
  
  const hotel = await prisma.hotel.findUnique({
    where: { slug, ativo: true },
    select: {
      nome: true,
      logoUrl: true,
      corPrincipal: true,
      corSecundaria: true,
      telefone: true,
      politicaCancelamento: true,
    }
  });

  if (!hotel) {
    return notFound(); 
  }

  const mensagemCheckout = tipo
    ? `Olá! Estou na tela de reserva do ${hotel.nome} (acomodação: ${tipo}) e gostaria de tirar uma dúvida antes de finalizar.`
    : `Olá! Estou na tela de reserva do ${hotel.nome} e preciso de ajuda para concluir minha hospedagem.`;
  
  return (
    <>
      <CheckoutClient slug={slug} hotelConfig={hotel} />
      <WhatsappButton 
        hotelConfig={hotel} 
        mensagemCustomizada={mensagemCheckout}
        temMenuMobile={false}
      />
    </>
  );
}