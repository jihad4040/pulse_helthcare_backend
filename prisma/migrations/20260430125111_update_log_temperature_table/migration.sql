/*
  Warnings:

  - You are about to alter the column `temperature` on the `LogTemperature` table. The data in that column could be lost. The data in that column will be cast from `Integer` to `Decimal(4,1)`.
  - Changed the type of `date` on the `LogTemperature` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "LogTemperature" ALTER COLUMN "temperature" SET DATA TYPE DECIMAL(4,1),
DROP COLUMN "date",
ADD COLUMN     "date" TIMESTAMP(3) NOT NULL;
