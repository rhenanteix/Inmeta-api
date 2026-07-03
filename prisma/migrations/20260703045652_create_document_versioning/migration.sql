-- CreateEnum
CREATE TYPE "DocumentVersionStatus" AS ENUM ('ACTIVE', 'INACTIVE');

-- CreateTable
CREATE TABLE "documents" (
    "id" UUID NOT NULL,
    "employeeDocumentId" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "documents_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "document_versions" (
    "id" UUID NOT NULL,
    "documentId" UUID NOT NULL,
    "version" INTEGER NOT NULL,
    "status" "DocumentVersionStatus" NOT NULL DEFAULT 'ACTIVE',
    "storageKey" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "document_versions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "documents_employeeDocumentId_key" ON "documents"("employeeDocumentId");

-- CreateIndex
CREATE INDEX "documents_deletedAt_idx" ON "documents"("deletedAt");

-- CreateIndex
CREATE INDEX "document_versions_documentId_idx" ON "document_versions"("documentId");

-- CreateIndex
CREATE INDEX "document_versions_status_idx" ON "document_versions"("status");

-- AddForeignKey
ALTER TABLE "documents" ADD CONSTRAINT "documents_employeeDocumentId_fkey" FOREIGN KEY ("employeeDocumentId") REFERENCES "employee_documents"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "document_versions" ADD CONSTRAINT "document_versions_documentId_fkey" FOREIGN KEY ("documentId") REFERENCES "documents"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
