-- CreateTable
CREATE TABLE "Report" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "version" TEXT NOT NULL DEFAULT '1.0.0',
    "language" TEXT NOT NULL DEFAULT 'es',
    "status" TEXT NOT NULL DEFAULT 'draft',
    "description" TEXT,
    "tags" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "mdxContent" TEXT NOT NULL,
    "tocJson" TEXT,
    "frontmatter" TEXT,
    "metricsJson" TEXT,
    "chartsJson" TEXT,
    "failureModesJson" TEXT,
    "searchText" TEXT,
    "publishedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Report_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Report_slug_key" ON "Report"("slug");

-- CreateIndex
CREATE INDEX "Report_status_idx" ON "Report"("status");

-- CreateIndex
CREATE INDEX "Report_slug_idx" ON "Report"("slug");

-- CreateIndex
CREATE INDEX "Report_publishedAt_idx" ON "Report"("publishedAt");
