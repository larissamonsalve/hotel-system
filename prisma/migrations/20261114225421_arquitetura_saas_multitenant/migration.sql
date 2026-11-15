/*
  Warnings:

  - A unique constraint covering the columns `[hotelId,email]` on the table `Funcionario` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[hotelId,email]` on the table `Lead` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[hotelId,numero]` on the table `Quarto` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `hotelId` to the `Consumo` table without a default value. This is not possible if the table is not empty.
  - Added the required column `hotelId` to the `Funcionario` table without a default value. This is not possible if the table is not empty.
  - Added the required column `hotelId` to the `Lead` table without a default value. This is not possible if the table is not empty.
  - Added the required column `hotelId` to the `Pagamento` table without a default value. This is not possible if the table is not empty.
  - Added the required column `hotelId` to the `Quarto` table without a default value. This is not possible if the table is not empty.
  - Added the required column `hotelId` to the `Reserva` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Funcionario_email_key";

-- DropIndex
DROP INDEX "Lead_email_key";

-- DropIndex
DROP INDEX "Quarto_numero_key";

-- AlterTable
ALTER TABLE "Consumo" ADD COLUMN     "hotelId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Funcionario" ADD COLUMN     "hotelId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Lead" ADD COLUMN     "hotelId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Pagamento" ADD COLUMN     "hotelId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Quarto" ADD COLUMN     "hotelId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Reserva" ADD COLUMN     "hotelId" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "Hotel" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "cnpj" TEXT NOT NULL,
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Hotel_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Hotel_slug_key" ON "Hotel"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Hotel_cnpj_key" ON "Hotel"("cnpj");

-- CreateIndex
CREATE UNIQUE INDEX "Funcionario_hotelId_email_key" ON "Funcionario"("hotelId", "email");

-- CreateIndex
CREATE UNIQUE INDEX "Lead_hotelId_email_key" ON "Lead"("hotelId", "email");

-- CreateIndex
CREATE UNIQUE INDEX "Quarto_hotelId_numero_key" ON "Quarto"("hotelId", "numero");

-- AddForeignKey
ALTER TABLE "Funcionario" ADD CONSTRAINT "Funcionario_hotelId_fkey" FOREIGN KEY ("hotelId") REFERENCES "Hotel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Lead" ADD CONSTRAINT "Lead_hotelId_fkey" FOREIGN KEY ("hotelId") REFERENCES "Hotel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Quarto" ADD CONSTRAINT "Quarto_hotelId_fkey" FOREIGN KEY ("hotelId") REFERENCES "Hotel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reserva" ADD CONSTRAINT "Reserva_hotelId_fkey" FOREIGN KEY ("hotelId") REFERENCES "Hotel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Pagamento" ADD CONSTRAINT "Pagamento_hotelId_fkey" FOREIGN KEY ("hotelId") REFERENCES "Hotel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Consumo" ADD CONSTRAINT "Consumo_hotelId_fkey" FOREIGN KEY ("hotelId") REFERENCES "Hotel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
