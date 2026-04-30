/*
  Warnings:

  - A unique constraint covering the columns `[phone]` on the table `users` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `phone` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "status" AS ENUM ('SUSPEND', 'INACTIVE', 'ACTIVE', 'PENDING');

-- CreateEnum
CREATE TYPE "Createntials" AS ENUM ('GOOGLE', 'CREDENTIALS', 'APPLE');

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "creadientials" TEXT,
ADD COLUMN     "credentials" "Createntials" NOT NULL DEFAULT 'CREDENTIALS',
ADD COLUMN     "isOnboarded" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "phone" TEXT NOT NULL,
ADD COLUMN     "status" "status" NOT NULL DEFAULT 'PENDING';

-- CreateIndex
CREATE UNIQUE INDEX "users_phone_key" ON "users"("phone");
