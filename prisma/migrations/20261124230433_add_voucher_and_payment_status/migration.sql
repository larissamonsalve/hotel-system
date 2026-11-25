/*
  Warnings:

  - A unique constraint covering the columns `[referenciaExt]` on the table `Pagamento` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[codigoLocalizador]` on the table `Reserva` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Pagamento" ADD COLUMN     "status" TEXT NOT NULL DEFAULT 'PENDENTE';

-- AlterTable
ALTER TABLE "Reserva" ADD COLUMN     "codigoLocalizador" TEXT,
ADD COLUMN     "cpfMascarado" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Pagamento_referenciaExt_key" ON "Pagamento"("referenciaExt");

-- CreateIndex
CREATE UNIQUE INDEX "Reserva_codigoLocalizador_key" ON "Reserva"("codigoLocalizador");
