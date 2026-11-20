import { notFound } from 'next/navigation';
import { PrismaClient } from '@prisma/client';
import CheckoutClient from '@/components/checkout/CheckoutClient';

const prisma = new PrismaClient();
type Params = Promise<{ slug: string }>;

export default async function CheckoutLeadPage({ params }: { params: Params }) {
  const resolvedParams = await params;
  
  const hotel = await prisma.hotel.findUnique({
    where: { slug: resolvedParams.slug, ativo: true },
    select: {
      nome: true,
      logoUrl: true,
      corPrincipal: true,
      corSecundaria: true,
      politicaCancelamento: true,
    }
  });

  if (!hotel) {
    return notFound(); 
  }
  
  return (
    <CheckoutClient slug={resolvedParams.slug} hotelConfig={hotel} />
  );
}