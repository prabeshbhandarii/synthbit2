-- CreateTable
CREATE TABLE "public"."Certificate" (
    "id" SERIAL NOT NULL,
    "code" TEXT NOT NULL,
    "courseName" TEXT NOT NULL,
    "courseStartDate" TIMESTAMP(3) NOT NULL,
    "courseCompletionDate" TIMESTAMP(3) NOT NULL,
    "filePath" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Certificate_pkey" PRIMARY KEY ("id")
);
