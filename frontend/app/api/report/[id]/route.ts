import { NextRequest, NextResponse } from 'next/server';

import { prisma } from '@/lib/prisma';
import { parseReport, type ReportSection } from '@/lib/report-parser';

export const maxDuration = 30;

const VALID_STATUSES = new Set(['draft', 'published', 'archived']);

function safeParse<T>(raw: string | null | undefined, fallback: T): T {
  if (!raw) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

/**
 * GET /api/report/[id]
 * Devuelve un reporte específico por ID (cualquiera sea su status).
 */
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const report = await prisma.report.findUnique({
    where: { id },
  });

  if (!report) {
    return NextResponse.json({ error: 'Reporte no encontrado' }, { status: 404 });
  }

  const sections = safeParse<ReportSection[]>(report.sectionsJson, []);
  const metrics = safeParse<Record<string, unknown>>(report.metricsJson, {});
  const charts = safeParse<Record<string, unknown>>(report.chartsJson, {});
  const failureModes = safeParse<unknown[]>(report.failureModesJson, []);

  return NextResponse.json({
    id: report.id,
    title: report.title,
    slug: report.slug,
    version: report.version,
    language: report.language,
    status: report.status,
    description: report.description,
    tags: report.tags,
    publishedAt: report.publishedAt,
    createdAt: report.createdAt,
    updatedAt: report.updatedAt,
    sections,
    metrics,
    charts,
    failureModes,
  });
}

/**
 * PUT /api/report/[id]
 * Reemplazo completo de los datos de un reporte.
 */
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const existingReport = await prisma.report.findUnique({
    where: { id },
  });

  if (!existingReport) {
    return NextResponse.json({ error: 'Reporte no encontrado' }, { status: 404 });
  }

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'JSON inválido' }, { status: 400 });
  }

  const {
    title,
    slug,
    mdxContent,
    version = '1.0.0',
    language = 'es',
    status = 'draft',
    description,
    tags = [],
    publishedAt,
  } = body;

  if (!title || typeof title !== 'string' || !title.trim()) {
    return NextResponse.json({ error: 'El campo "title" es requerido' }, { status: 400 });
  }
  if (!slug || typeof slug !== 'string' || !slug.trim()) {
    return NextResponse.json({ error: 'El campo "slug" es requerido' }, { status: 400 });
  }
  if (!mdxContent || typeof mdxContent !== 'string' || !mdxContent.trim()) {
    return NextResponse.json({ error: 'El campo "mdxContent" es requerido' }, { status: 400 });
  }

  const statusStr = String(status);
  if (!VALID_STATUSES.has(statusStr)) {
    return NextResponse.json(
      { error: 'El campo "status" debe ser: draft, published o archived' },
      { status: 400 }
    );
  }

  const newSlug = slug.trim();
  if (newSlug !== existingReport.slug) {
    const slugConflict = await prisma.report.findUnique({
      where: { slug: newSlug },
    });
    if (slugConflict) {
      return NextResponse.json(
        { error: 'Ya existe otro reporte con ese slug' },
        { status: 409 }
      );
    }
  }

  const parsed = parseReport(mdxContent);

  let finalPublishedAt: Date | null = existingReport.publishedAt;
  if (publishedAt) {
    finalPublishedAt = new Date(String(publishedAt));
  } else if (statusStr === 'published' && !existingReport.publishedAt) {
    finalPublishedAt = new Date();
  }

  const updatedReport = await prisma.report.update({
    where: { id },
    data: {
      title: title.trim(),
      slug: newSlug,
      version: String(version),
      language: String(language),
      status: statusStr,
      description: typeof description === 'string' ? description : null,
      tags: Array.isArray(tags) ? tags.map(String) : [],
      mdxContent,
      sectionsJson: JSON.stringify(parsed.sections),
      metricsJson: parsed.metricsJson,
      chartsJson: parsed.chartsJson,
      failureModesJson: parsed.failureModesJson,
      publishedAt: finalPublishedAt,
    },
  });

  const sections = safeParse<ReportSection[]>(updatedReport.sectionsJson, []);
  const metrics = safeParse<Record<string, unknown>>(updatedReport.metricsJson, {});
  const charts = safeParse<Record<string, unknown>>(updatedReport.chartsJson, {});
  const failureModes = safeParse<unknown[]>(updatedReport.failureModesJson, []);

  return NextResponse.json({
    id: updatedReport.id,
    title: updatedReport.title,
    slug: updatedReport.slug,
    version: updatedReport.version,
    language: updatedReport.language,
    status: updatedReport.status,
    description: updatedReport.description,
    tags: updatedReport.tags,
    publishedAt: updatedReport.publishedAt,
    createdAt: updatedReport.createdAt,
    updatedAt: updatedReport.updatedAt,
    sections,
    metrics,
    charts,
    failureModes,
  });
}

/**
 * PATCH /api/report/[id]
 * Actualización parcial de un reporte.
 */
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const existingReport = await prisma.report.findUnique({
    where: { id },
  });

  if (!existingReport) {
    return NextResponse.json({ error: 'Reporte no encontrado' }, { status: 404 });
  }

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'JSON inválido' }, { status: 400 });
  }

  const dataToUpdate: Record<string, unknown> = {};

  if (typeof body.title === 'string') {
    if (!body.title.trim()) {
      return NextResponse.json({ error: 'El campo "title" no puede estar vacío' }, { status: 400 });
    }
    dataToUpdate.title = body.title.trim();
  }

  if (typeof body.slug === 'string') {
    const newSlug = body.slug.trim();
    if (!newSlug) {
      return NextResponse.json({ error: 'El campo "slug" no puede estar vacío' }, { status: 400 });
    }
    if (newSlug !== existingReport.slug) {
      const slugConflict = await prisma.report.findUnique({
        where: { slug: newSlug },
      });
      if (slugConflict) {
        return NextResponse.json(
          { error: 'Ya existe otro reporte con ese slug' },
          { status: 409 }
        );
      }
      dataToUpdate.slug = newSlug;
    }
  }

  if (typeof body.version === 'string') {
    dataToUpdate.version = body.version;
  }

  if (typeof body.language === 'string') {
    dataToUpdate.language = body.language;
  }

  if (body.status !== undefined) {
    const statusStr = String(body.status);
    if (!VALID_STATUSES.has(statusStr)) {
      return NextResponse.json(
        { error: 'El campo "status" debe ser: draft, published o archived' },
        { status: 400 }
      );
    }
    dataToUpdate.status = statusStr;

    if (statusStr === 'published' && !existingReport.publishedAt && !body.publishedAt) {
      dataToUpdate.publishedAt = new Date();
    }
  }

  if (body.description !== undefined) {
    dataToUpdate.description = typeof body.description === 'string' ? body.description : null;
  }

  if (Array.isArray(body.tags)) {
    dataToUpdate.tags = body.tags.map(String);
  }

  if (body.publishedAt !== undefined) {
    dataToUpdate.publishedAt = body.publishedAt ? new Date(String(body.publishedAt)) : null;
  }

  if (typeof body.mdxContent === 'string') {
    if (!body.mdxContent.trim()) {
      return NextResponse.json({ error: 'El campo "mdxContent" no puede estar vacío' }, { status: 400 });
    }
    dataToUpdate.mdxContent = body.mdxContent;
    const parsed = parseReport(body.mdxContent);
    dataToUpdate.sectionsJson = JSON.stringify(parsed.sections);
    dataToUpdate.metricsJson = parsed.metricsJson;
    dataToUpdate.chartsJson = parsed.chartsJson;
    dataToUpdate.failureModesJson = parsed.failureModesJson;
  }

  if (Object.keys(dataToUpdate).length === 0) {
    return NextResponse.json(
      { error: 'No se enviaron campos válidos para actualizar' },
      { status: 400 }
    );
  }

  const updatedReport = await prisma.report.update({
    where: { id },
    data: dataToUpdate,
  });

  const sections = safeParse<ReportSection[]>(updatedReport.sectionsJson, []);
  const metrics = safeParse<Record<string, unknown>>(updatedReport.metricsJson, {});
  const charts = safeParse<Record<string, unknown>>(updatedReport.chartsJson, {});
  const failureModes = safeParse<unknown[]>(updatedReport.failureModesJson, []);

  return NextResponse.json({
    id: updatedReport.id,
    title: updatedReport.title,
    slug: updatedReport.slug,
    version: updatedReport.version,
    language: updatedReport.language,
    status: updatedReport.status,
    description: updatedReport.description,
    tags: updatedReport.tags,
    publishedAt: updatedReport.publishedAt,
    createdAt: updatedReport.createdAt,
    updatedAt: updatedReport.updatedAt,
    sections,
    metrics,
    charts,
    failureModes,
  });
}

/**
 * DELETE /api/report/[id]
 * Elimina un reporte por ID.
 */
export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const existingReport = await prisma.report.findUnique({
    where: { id },
  });

  if (!existingReport) {
    return NextResponse.json({ error: 'Reporte no encontrado' }, { status: 404 });
  }

  await prisma.report.delete({
    where: { id },
  });

  return NextResponse.json({
    message: 'Reporte eliminado correctamente',
    id,
  });
}
