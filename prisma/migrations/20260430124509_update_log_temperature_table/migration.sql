/*
  Warnings:

  - Changed the type of `date` on the `LogTemperature` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "LogTemperature" DROP COLUMN "date",
ADD COLUMN     "date" DECIMAL(4,1) NOT NULL;
