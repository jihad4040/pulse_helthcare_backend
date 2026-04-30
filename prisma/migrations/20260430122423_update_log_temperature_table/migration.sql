/*
  Warnings:

  - You are about to alter the column `temperature` on the `LogTemperature` table. The data in that column could be lost. The data in that column will be cast from `Decimal(5,2)` to `Integer`.

*/
-- AlterTable
ALTER TABLE "LogTemperature" ALTER COLUMN "temperature" SET DATA TYPE INTEGER,
ALTER COLUMN "note" DROP NOT NULL;
