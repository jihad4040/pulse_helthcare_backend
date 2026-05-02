/*
  Warnings:

  - Added the required column `whereFrom` to the `Onbording` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Onbording" ADD COLUMN     "whereFrom" TEXT NOT NULL;
