-- CreateTable
CREATE TABLE "Onbording" (
    "onbordingId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "lifeStage" TEXT NOT NULL,
    "helthData" JSONB NOT NULL,

    CONSTRAINT "Onbording_pkey" PRIMARY KEY ("onbordingId")
);

-- CreateIndex
CREATE UNIQUE INDEX "Onbording_userId_key" ON "Onbording"("userId");

-- CreateIndex
CREATE INDEX "Onbording_userId_idx" ON "Onbording"("userId");

-- CreateIndex
CREATE INDEX "Onbording_onbordingId_idx" ON "Onbording"("onbordingId");

-- CreateIndex
CREATE INDEX "Onbording_email_idx" ON "Onbording"("email");

-- CreateIndex
CREATE INDEX "Onbording_name_idx" ON "Onbording"("name");

-- AddForeignKey
ALTER TABLE "Onbording" ADD CONSTRAINT "Onbording_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;
