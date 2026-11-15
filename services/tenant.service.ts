import prisma from '@/lib/prisma';
import { CriarTenantDTO } from '@/schemas/tenant.schema';
import { CargoFuncionario } from '@prisma/client';
import bcrypt from 'bcrypt';

export class TenantService {
  async onboardNovoHotel(dados: CriarTenantDTO) {
    const slugExiste = await prisma.hotel.findUnique({
      where: { slug: dados.hotelSlug },
    });

    if (slugExiste) {
      throw new Error('O slug escolhido já está em uso.');
    }

    const cnpjExiste = await prisma.hotel.findUnique({
      where: { cnpj: dados.cnpj },
    });

    if (cnpjExiste) {
      throw new Error('Já existe um hotel cadastrado com este CNPJ.');
    }

    const senhaHash = await bcrypt.hash(dados.adminSenha, 12);

    const result = await prisma.$transaction(async (tx) => {
      const hotel = await tx.hotel.create({
        data: {
          nome: dados.hotelNome,
          slug: dados.hotelSlug,
          cnpj: dados.cnpj,
        },
      });

      const admin = await tx.funcionario.create({
        data: {
          hotelId: hotel.id,
          nome: dados.adminNome,
          email: dados.adminEmail,
          senhaHash,
          cargo: CargoFuncionario.ADMIN,
        },
      });

      return { hotel, admin };
    });

    return {
      hotelId: result.hotel.id,
      slug: result.hotel.slug,
      adminId: result.admin.id,
    };
  }
}