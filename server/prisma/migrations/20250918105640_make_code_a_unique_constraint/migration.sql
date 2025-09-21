/*
  Warnings:

  - A unique constraint covering the columns `[code]` on the table `Certificate` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Certificate_code_key" ON "public"."Certificate"("code");
