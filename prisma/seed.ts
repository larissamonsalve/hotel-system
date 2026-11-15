import { PrismaClient, CargoFuncionario, StatusQuarto } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('Iniciando o Seed do Banco de Dados...');

  const senhaAdmin = await bcrypt.hash('admin123', 12);

  const hotel = await prisma.hotel.upsert({
    where: { slug: 'hotel-serpa' },
    update: {
      nome: 'Hotel Serpa',
      telefone: '+55 (92) 3011-7217', 
      endereco: 'R. Floriano Peixoto, 80 (ou 223), Colônia, Itacoatiara - AM, CEP 69100-000', // Dado oficial do PDF
    },
    create: {
      nome: 'Hotel Serpa',
      slug: 'hotel-serpa',
      cnpj: '00000000000100', 
      telefone: '+55 (92) 3011-7217',
      endereco: 'R. Floriano Peixoto, 80 (ou 223), Colônia, Itacoatiara - AM, CEP 69100-000',
    },
  });

  console.log(`✅ Hotel [${hotel.nome}] verificado/atualizado com sucesso!`);

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

  console.log(`✅ Administrador [${admin.email}] verificado!`);

  // Dividindo os 20 quartos perfeitamente em 5 de cada uma das 4 categorias
  const tiposDeQuartos = [
    { tipo: 'Quarto Padrão', capacidade: 1, valorDiaria: 189.00, andar: 100 }, // Quartos 101 a 105
    { tipo: 'Quarto Duplo', capacidade: 2, valorDiaria: 249.00, andar: 200 },  // Quartos 201 a 205
    { tipo: 'Quarto Casal', capacidade: 2, valorDiaria: 289.00, andar: 300 },  // Quartos 301 a 305
    { tipo: 'Quarto Triplo', capacidade: 3, valorDiaria: 359.00, andar: 400 }, // Quartos 401 a 405
  ];

  let quartosCriados = 0;

  for (const config of tiposDeQuartos) {
    // Cria 5 quartos para cada categoria
    for (let i = 1; i <= 5; i++) {
      const numero = `${config.andar + i}`; // Gera numeração lógica como 101, 102, 201, 202...
      
      await prisma.quarto.upsert({
        where: {
          hotelId_numero: {
            hotelId: hotel.id,
            numero: numero,
          },
        },
        update: {
          tipo: config.tipo,
          capacidade: config.capacidade,
          valorDiaria: config.valorDiaria,
        },
        create: {
          hotelId: hotel.id,
          numero: numero,
          tipo: config.tipo,
          capacidade: config.capacidade,
          valorDiaria: config.valorDiaria,
          status: StatusQuarto.DISPONIVEL,
        },
      });
      quartosCriados++;
    }
  }

  console.log(`✅ ${quartosCriados} quartos cadastrados e categorizados para o Hotel Serpa!`);
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