import prisma from '@/lib/prisma';

export class HotelRepository {
  async buscarPorSlug(slug: string) {
    return prisma.hotel.findUnique({
      where: { slug },
      select: { id: true, ativo: true },
    });
  }
}