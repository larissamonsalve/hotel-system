import prisma from '@/lib/prisma';
import { notFound } from 'next/navigation';
import SimuladorCliente from '@/components/hotel/SimuladorCliente'; 

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function TenantLandingPage({ params }: PageProps) {
  const { slug } = await params;

  const hotel = await prisma.hotel.findUnique({
    where: { slug },
    include: {
      quartos: {
        where: { status: 'DISPONIVEL' }
      }
    }
  });

  if (!hotel || !hotel.ativo) {
    notFound();
  }

  const quartosMapeados = hotel.quartos.map(q => ({
    id: q.id,
    tipo: q.tipo,
    capacidade: q.capacidade,
    valorDiaria: Number(q.valorDiaria)
  }));

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="bg-blue-900 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4">{hotel.nome}</h1>
          <p className="text-lg md:text-xl text-blue-200 max-w-2xl mx-auto">
            Reserve sua estadia com conforto e segurança. Pague apenas 30% agora para garantir sua reserva.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <SimuladorCliente hotelSlug={hotel.slug} quartos={quartosMapeados} />
        </div>
      </div>
    </main>
  );
}