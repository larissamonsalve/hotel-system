import prisma from '@/lib/prisma';
import { notFound } from 'next/navigation';
import { cookies } from 'next/headers';

import TenantNavbar from '@/components/layout/TenantNavbar';
import TenantFooter from '@/components/layout/TenantFooter';
import HeroSection from '@/components/hotel/HeroSection';
import AcomodacoesSection from '@/components/hotel/AcomodacoesSection';
import DetalhesSection from '@/components/hotel/DetalhesSection';
import GaleriaSection from '@/components/hotel/GaleriaSection';

interface PageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ checkin?: string; checkout?: string; hospedes?: string }>;
}

export default async function TenantLandingPage({ params, searchParams }: PageProps) {
  const { slug } = await params;
  
  // Extrai os filtros da URL (preenchidos pelo SimuladorCliente)
  const search = await searchParams;
  const quantidadeHospedes = search.hospedes ? parseInt(search.hospedes) : 0;

  const cookieStore = await cookies();
  const isLoggedIn = cookieStore.has('auth_token'); 

  // Busca o hotel e TODOS os quartos para mostrar as categorias
  const hotel = await prisma.hotel.findUnique({
    where: { slug },
    include: { quartos: true } 
  });

  if (!hotel || !hotel.ativo) notFound();

  // Agrupa e filtra logicamente
  const quartosMapeados = hotel.quartos.map(q => ({
    id: q.id,
    tipo: q.tipo,
    capacidade: q.capacidade,
    valorDiaria: Number(q.valorDiaria),
    // Lógica de Esgotado: Se o cliente pediu para 3 hóspedes e o quarto só cabe 1 ou 2, ele marca como esgotado
    esgotado: quantidadeHospedes > q.capacidade || q.status !== 'DISPONIVEL'
  }));
  
  // Extrai 1 unidade de cada categoria (Para não repetir os 20 na tela)
  const tiposUnicos = Array.from(new Map(quartosMapeados.map(q => [q.tipo, q])).values());

  return (
    <main className="bg-gray-50 font-sans text-gray-800 pb-20 md:pb-0 scroll-smooth overflow-x-hidden">
      <TenantNavbar hotelNome={hotel.nome} isLoggedIn={isLoggedIn} />
      
      <HeroSection />
      
      {/* Passa a lista de quartos (agora contendo o estado 'esgotado') */}
      <AcomodacoesSection quartos={tiposUnicos} />
      
      <DetalhesSection />
      <GaleriaSection />
      
      <TenantFooter hotelNome={hotel.nome} />
    </main>
  );
}