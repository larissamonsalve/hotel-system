-- AlterTable
ALTER TABLE "Hotel" ADD COLUMN     "corPrincipal" TEXT NOT NULL DEFAULT '#1B2A41',
ADD COLUMN     "corSecundaria" TEXT NOT NULL DEFAULT '#8B1E32',
ADD COLUMN     "endereco" TEXT,
ADD COLUMN     "logoUrl" TEXT,
ADD COLUMN     "politicaCancelamento" TEXT DEFAULT 'Até 7 dias antes do check-in',
ADD COLUMN     "telefone" TEXT;

-- AlterTable
ALTER TABLE "Quarto" ADD COLUMN     "descricao" TEXT,
ADD COLUMN     "imagemUrl" TEXT;
