import { PrismaClient, CargoFuncionario, StatusQuarto } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('Iniciando o Seed do Banco de Dados...');

  const senhaAdmin = await bcrypt.hash('admin123', 12);

  // 1. Criar o Hotel (Tenant)
  const hotel = await prisma.hotel.upsert({
    where: { slug: 'hotel-serpa' },
    update: {},
    create: {
      nome: 'Hotel Serpa',
      slug: 'hotel-serpa',
      cnpj: '00000000000100', // Substitua pelo CNPJ real posteriormente
    },
  });

  console.log(`✅ Hotel [${hotel.nome}] criado com sucesso!`);

  // 2. Criar o Usuário Administrador
  const admin = await prisma.funcionario.upsert({
    where: {
      hotelId_email: {
        hotelId: hotel.id,
        email: 'admin@hotelserpa.com.br',
      },
    },
    update: {},
    create: {
      hotelId: hotel.id,
      nome: 'Admin Serpa',
      email: 'admin@hotelserpa.com.br',
      senhaHash: senhaAdmin,
      cargo: CargoFuncionario.ADMIN,
    },
  });

  console.log(`✅ Administrador [${admin.email}] criado!`);

  // 3. Criar os 20 Quartos (Baseado no PDF)
  // Dividindo em 10 Quartos de Casal e 10 Quartos Duplos para o exemplo
  const totalQuartos = 20;
  let quartosCriados = 0;

  for (let i = 1; i <= totalQuartos; i++) {
    const numero = i <= 10 ? `1${i.toString().padStart(2, '0')}` : `2${(i - 10).toString().padStart(2, '0')}`;
    const tipo = i <= 10 ? 'Casal Standard' : 'Duplo Solteiro';
    const capacidade = 2;
    const valorDiaria = i <= 10 ? 150.00 : 180.00; // Valores fictícios, você pode ajustar

    await prisma.quarto.upsert({
      where: {
        hotelId_numero: {
          hotelId: hotel.id,
          numero: numero,
        },
      },
      update: {},
      create: {
        hotelId: hotel.id,
        numero: numero,
        tipo: tipo,
        capacidade: capacidade,
        valorDiaria: valorDiaria,
        status: StatusQuarto.DISPONIVEL,
      },
    });
    quartosCriados++;
  }

  console.log(`✅ ${quartosCriados} quartos cadastrados para o Hotel Serpa!`);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });