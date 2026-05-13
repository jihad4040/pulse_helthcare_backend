-- AlterTable
ALTER TABLE "group_categories" ADD COLUMN     "isDeleted" BOOLEAN NOT NULL DEFAULT false;

-- CreateIndex
CREATE INDEX "group_categories_isDeleted_idx" ON "group_categories"("isDeleted");
