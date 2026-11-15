import prisma from '@/lib/prisma';
import { notFound } from 'next/navigation';
import { cookies } from 'next/headers';

// Componentes Layout (Menus e Rodapés)
import TenantNavbar from '@/components/layout/TenantNavbar';
import TenantFooter from '@/components/layout/TenantFooter';

// Componentes das Seções
import HeroSection from '@/components/hotel/HeroSection';
import AcomodacoesSection from '@/components/hotel/AcomodacoesSection';
import DetalhesSection from '@/components/hotel/DetalhesSection';
import GaleriaSection from '@/components/hotel/GaleriaSection';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function TenantLandingPage({ params }: PageProps) {
  const { slug } = await params;
  const cookieStore = await cookies();
  const isLoggedIn = cookieStore.has('auth_token'); 

  // 1. Busca os dados essenciais do Banco de Dados no Servidor
  const hotel = await prisma.hotel.findUnique({
    where: { slug },
    include: { quartos: { where: { status: 'DISPONIVEL' } } }
  });

  if (!hotel || !hotel.ativo) notFound();

  // 2. Prepara os dados de quartos para os componentes
  const quartosMapeados = hotel.quartos.map(q => ({
    id: q.id,
    tipo: q.tipo,
    capacidade: q.capacidade,
    valorDiaria: Number(q.valorDiaria)
  }));
  const tiposUnicos = Array.from(new Map(quartosMapeados.map(q => [q.tipo, q])).values());

  // 3. Renderiza a interface unindo os módulos (Clean Architecture)
  return (
    <main className="bg-gray-50 font-sans text-gray-800 pb-20 md:pb-0 scroll-smooth overflow-x-hidden">
      <TenantNavbar hotelNome={hotel.nome} isLoggedIn={isLoggedIn} />
      
      <HeroSection />
      <AcomodacoesSection quartos={tiposUnicos} />
      <DetalhesSection />
      <GaleriaSection />
      
      <TenantFooter hotelNome={hotel.nome} />
    </main>
  );
}