import prisma from '@/lib/prisma';
import { notFound } from 'next/navigation';
import { cookies } from 'next/headers';

import TenantNavbar from '@/components/layout/TenantNavbar';
import TenantFooter from '@/components/layout/TenantFooter';
import HeroSection from '@/components/hotel/HeroSection';
import AcomodacoesSection from '@/components/hotel/AcomodacoesSection';
import DetalhesSection from '@/components/hotel/DetalhesSection';
import GaleriaSection from '@/components/hotel/GaleriaSection';

import ScrollReveal from '@/components/ui/ScrollReveal';

interface PageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ checkin?: string; checkout?: string; hospedes?: string }>;
}

export default async function TenantLandingPage({ params, searchParams }: PageProps) {
  const { slug } = await params;
  
  const search = await searchParams;
  const quantidadeHospedes = search.hospedes ? parseInt(search.hospedes) : 0;

  const cookieStore = await cookies();
  const isLoggedIn = cookieStore.has('auth_token'); 

  const hotel = await prisma.hotel.findUnique({
    where: { slug },
    include: { quartos: true } 
  });

  if (!hotel || !hotel.ativo) notFound();

  const quartosMapeados = hotel.quartos.map(q => ({
    id: q.id,
    tipo: q.tipo,
    capacidade: q.capacidade,
    valorDiaria: Number(q.valorDiaria),
    esgotado: quantidadeHospedes > q.capacidade || q.status !== 'DISPONIVEL'
  }));
  
  const tiposUnicos = Array.from(new Map(quartosMapeados.map(q => [q.tipo, q])).values());

  return (
    <main className="bg-white font-sans text-gray-800 pb-20 md:pb-0 scroll-smooth overflow-x-hidden">
      <TenantNavbar hotelNome={hotel.nome} isLoggedIn={isLoggedIn} />
      
      <HeroSection />
      
      <ScrollReveal delay={100}>
        <AcomodacoesSection quartos={tiposUnicos} />
      </ScrollReveal>
      
      <ScrollReveal delay={200}>
        <DetalhesSection />
      </ScrollReveal>

      <ScrollReveal delay={300}>
        <GaleriaSection />
      </ScrollReveal>
      
      <TenantFooter hotelNome={hotel.nome} />
    </main>
  );
}