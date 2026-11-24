import { PrismaClient, CargoFuncionario, StatusQuarto } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('Iniciando o Seed do Banco de Dados...');

  const senhaAdmin = await bcrypt.hash('admin123', 12);

  const hotel = await prisma.hotel.upsert({
    where: { slug: 'hotel-serpa' },
    update: {
      nome: 'Serpa Hotel',
      telefone: '+55 (92) 99473-7897', 
      endereco: 'R. Floriano Peixoto, 80 (ou 223), Colônia, Itacoatiara - AM, CEP 69100-000',
      logoUrl: '/logo-serpa.jpg',
      corPrincipal: '#1B2A41',
      corSecundaria: '#8B1E32',
      politicaCancelamento: 'Cancelamento gratuito até 7 dias antes do check-in.',
    },
    create: {
      nome: 'Serpa Hotel',
      slug: 'hotel-serpa',
      cnpj: '26.649.508/0001-09', 
      telefone: '+55 (92) 99473-7897',
      endereco: 'R. Floriano Peixoto, 80 (ou 223), Colônia, Itacoatiara - AM, CEP 69100-000',
      logoUrl: '/logo-serpa.jpg',
      corPrincipal: '#1B2A41',
      corSecundaria: '#8B1E32',
      politicaCancelamento: 'Cancelamento gratuito até 7 dias antes do check-in.',
    },
  });

  console.log(`✅ Hotel [${hotel.nome}] verificado/atualizado com sucesso!`);

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

  const tiposDeQuartos = [
    { tipo: 'Quarto Padrão', capacidade: 1, valorDiaria: 189.00, andar: 100, offset: 0, imagemUrl: '/quarto-padrao.jpg', descricao: 'Possui 1 cama de solteiro. Acomoda 1 pessoa.' }, // 101 a 105
    { tipo: 'Quarto Duplo', capacidade: 2, valorDiaria: 249.00, andar: 100, offset: 5, imagemUrl: '/quarto-casal.jpg', descricao: 'Possui 2 camas de solteiro separadas no mesmo ambiente. Acomoda 2 hóspedes.' }, // 106 a 110
    
    { tipo: 'Quarto Casal', capacidade: 2, valorDiaria: 289.00, andar: 200, offset: 0, imagemUrl: '/quarto-casal.jpg', descricao: 'Possui 1 cama de casal (king-size), acomoda 2 hóspedes.' }, // 201 a 205
    
    { tipo: 'Quarto Triplo', capacidade: 3, valorDiaria: 359.00, andar: 300, offset: 0, imagemUrl: '/quarto-triplo.jpg', descricao: 'Acomoda até 3 hóspedes, configurado com uma cama de casal e uma cama de solteiro.' }, // 301 a 305
  ];

  let quartosCriados = 0;

  for (const config of tiposDeQuartos) {
    for (let i = 1; i <= 5; i++) {
      const numSequencial = config.offset + i; 
      const numero = `${config.andar + numSequencial}`; 
      
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
          imagemUrl: config.imagemUrl,
          descricao: config.descricao,
        },
        create: {
          hotelId: hotel.id,
          numero: numero,
          tipo: config.tipo,
          capacidade: config.capacidade,
          valorDiaria: config.valorDiaria,
          imagemUrl: config.imagemUrl,
          descricao: config.descricao,
          status: StatusQuarto.DISPONIVEL,
        },
      });
      quartosCriados++;
    }
  }

  console.log(`✅ ${quartosCriados} quartos cadastrados e categorizados nos 3 andares!`);
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