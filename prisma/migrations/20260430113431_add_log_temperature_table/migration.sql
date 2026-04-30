-- CreateTable
CREATE TABLE "LogTemperature" (
    "temperatureId" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "temperature" DECIMAL(5,2) NOT NULL,
    "isFahrenheit" BOOLEAN NOT NULL DEFAULT true,
    "timeMeasured" TEXT,
    "note" TEXT NOT NULL,
    "quickTag" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "userId" TEXT NOT NULL,
    "createAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updateAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LogTemperature_pkey" PRIMARY KEY ("temperatureId")
);

-- CreateIndex
CREATE INDEX "LogTemperature_userId_idx" ON "LogTemperature"("userId");

-- CreateIndex
CREATE INDEX "LogTemperature_temperatureId_idx" ON "LogTemperature"("temperatureId");

-- CreateIndex
CREATE INDEX "users_userId_idx" ON "users"("userId");

-- CreateIndex
CREATE INDEX "users_email_idx" ON "users"("email");

-- CreateIndex
CREATE INDEX "users_phone_idx" ON "users"("phone");

-- CreateIndex
CREATE INDEX "users_role_idx" ON "users"("role");

-- CreateIndex
CREATE INDEX "users_status_idx" ON "users"("status");

-- CreateIndex
CREATE INDEX "users_verifidStatus_idx" ON "users"("verifidStatus");

-- AddForeignKey
ALTER TABLE "LogTemperature" ADD CONSTRAINT "LogTemperature_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;
