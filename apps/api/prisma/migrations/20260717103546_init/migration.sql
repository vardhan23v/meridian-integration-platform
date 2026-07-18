-- CreateEnum
CREATE TYPE "JobStatus" AS ENUM ('PENDING', 'RUNNING', 'COMPLETED', 'FAILED', 'PARTIAL');

-- CreateEnum
CREATE TYPE "SyncStatus" AS ENUM ('SUCCESS', 'ERROR', 'RETRYING');

-- CreateEnum
CREATE TYPE "Role" AS ENUM ('SUPER_ADMIN', 'SYSTEM_ADMIN', 'SAP_ADMIN', 'FINANCE_MANAGER', 'FINANCE_ANALYST', 'OPS_ENGINEER', 'PLATFORM_ENGINEER', 'AUDITOR', 'COMPLIANCE_OFFICER', 'READ_ONLY');

-- CreateTable
CREATE TABLE "users" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "email" VARCHAR(100) NOT NULL,
    "passwordHash" VARCHAR(255) NOT NULL,
    "firstName" VARCHAR(50) NOT NULL,
    "lastName" VARCHAR(50) NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'READ_ONLY',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "lastLoginAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "companies" (
    "id" VARCHAR(10) NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "country" VARCHAR(2) NOT NULL,

    CONSTRAINT "companies_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "plants" (
    "id" VARCHAR(10) NOT NULL,
    "companyId" VARCHAR(10) NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "state" VARCHAR(50) NOT NULL,

    CONSTRAINT "plants_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "integration_jobs" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "companyId" VARCHAR(10) NOT NULL,
    "jobType" VARCHAR(20) NOT NULL,
    "status" "JobStatus" NOT NULL DEFAULT 'PENDING',
    "totalRecords" INTEGER NOT NULL DEFAULT 0,
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completedAt" TIMESTAMP(3),

    CONSTRAINT "integration_jobs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "audit_entries" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "jobId" UUID NOT NULL,
    "sapDocNo" VARCHAR(50) NOT NULL,
    "fiscalYear" VARCHAR(4) NOT NULL,
    "finsightId" VARCHAR(100),
    "status" "SyncStatus" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "audit_entries_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "dead_letter_queue" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "jobId" UUID NOT NULL,
    "payload" JSONB NOT NULL,
    "errorCode" VARCHAR(50) NOT NULL,
    "errorReason" TEXT NOT NULL,
    "retryCount" INTEGER NOT NULL DEFAULT 0,
    "resolved" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "dead_letter_queue_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "general_ledgers" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "companyId" VARCHAR(10) NOT NULL,
    "sapDocNo" VARCHAR(50) NOT NULL,
    "account" VARCHAR(20) NOT NULL,
    "amount" DECIMAL(23,4) NOT NULL,
    "currency" VARCHAR(5) NOT NULL,
    "cgstAmount" DECIMAL(23,4),
    "sgstAmount" DECIMAL(23,4),
    "igstAmount" DECIMAL(23,4),
    "postingDate" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "general_ledgers_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE INDEX "integration_jobs_startedAt_idx" ON "integration_jobs"("startedAt");

-- CreateIndex
CREATE INDEX "audit_entries_status_createdAt_idx" ON "audit_entries"("status", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "audit_entries_jobId_sapDocNo_fiscalYear_key" ON "audit_entries"("jobId", "sapDocNo", "fiscalYear");

-- CreateIndex
CREATE INDEX "dead_letter_queue_resolved_createdAt_idx" ON "dead_letter_queue"("resolved", "createdAt");

-- CreateIndex
CREATE INDEX "general_ledgers_postingDate_idx" ON "general_ledgers"("postingDate");

-- AddForeignKey
ALTER TABLE "plants" ADD CONSTRAINT "plants_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "companies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "integration_jobs" ADD CONSTRAINT "integration_jobs_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "companies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "audit_entries" ADD CONSTRAINT "audit_entries_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES "integration_jobs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "dead_letter_queue" ADD CONSTRAINT "dead_letter_queue_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES "integration_jobs"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "general_ledgers" ADD CONSTRAINT "general_ledgers_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "companies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
