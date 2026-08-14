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
 * Devuelve los datos estructurados de reportes para el frontend.
 *
 * GET /api/report                          -> reporte publicado más reciente
 * GET /api/report?slug=<x>                 -> reporte específico por slug
 * GET /api/report?id=<id>                  -> reporte específico por id
 * GET /api/report?status=all               -> lista todos los reportes
 * GET /api/report?status=draft|published|archived -> lista reportes según estado
 */
export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const slug = searchParams.get('slug');
  const id = searchParams.get('id');
  const statusParam = searchParams.get('status');

  // Si se solicita por slug o por id específico
  if (slug || id) {
    const report = await prisma.report.findFirst({
      where: {
        ...(slug ? { slug } : {}),
        ...(id ? { id } : {}),
        ...(statusParam && statusParam !== 'all' ? { status: statusParam } : {}),
      },
    });

    if (!report) {
      return NextResponse.json({ error: 'Reporte no encontrado' }, { status: 404 });
    }

    return NextResponse.json(formatReport(report));
  }

  // Si se pasa statusParam (ej. status=all, status=draft, status=published, status=archived)
  if (statusParam) {
    const reports = await prisma.report.findMany({
      where: statusParam === 'all' ? {} : { status: statusParam },
      orderBy: { updatedAt: 'desc' },
    });

    return NextResponse.json(reports.map(formatReport));
  }

  // Comportamiento por defecto (compatibilidad con Home): devuelve el publicado más reciente
  const report = await prisma.report.findFirst({
    where: { status: 'published' },
    orderBy: { publishedAt: 'desc' },
  });

  if (!report) {
    return NextResponse.json({ error: 'Reporte no encontrado' }, { status: 404 });
  }

  return NextResponse.json(formatReport(report));
}

type ReportRecord = {
  id: string;
  title: string;
  slug: string;
  version: string;
  language: string;
  status: string;
  description: string | null;
  tags: string[];
  publishedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
  sectionsJson?: string | null;
  metricsJson?: string | null;
  chartsJson?: string | null;
  failureModesJson?: string | null;
};

function formatReport(report: ReportRecord) {

  const sections = safeParse<ReportSection[]>(report.sectionsJson, []);
  const metrics = safeParse<Record<string, unknown>>(report.metricsJson, {});
  const charts = safeParse<Record<string, unknown>>(report.chartsJson, {});
  const failureModes = safeParse<unknown[]>(report.failureModesJson, []);

  return {
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
  };
}


/**
 * Crea un nuevo reporte.
 *
 * POST /api/report
 * Body: { title, slug, mdxContent, version?, language?, status?, description?, tags?, publishedAt? }
 */
export async function POST(req: NextRequest) {
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

  const existing = await prisma.report.findUnique({
    where: { slug: slug.trim() },
  });
  if (existing) {
    return NextResponse.json(
      { error: 'Ya existe un reporte con ese slug' },
      { status: 409 }
    );
  }

  const parsed = parseReport(mdxContent);

  let finalPublishedAt: Date | null = null;
  if (publishedAt) {
    finalPublishedAt = new Date(String(publishedAt));
  } else if (statusStr === 'published') {
    finalPublishedAt = new Date();
  }

  const report = await prisma.report.create({
    data: {
      title: title.trim(),
      slug: slug.trim(),
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

  const sections = safeParse<ReportSection[]>(report.sectionsJson, []);
  const metrics = safeParse<Record<string, unknown>>(report.metricsJson, {});
  const charts = safeParse<Record<string, unknown>>(report.chartsJson, {});
  const failureModes = safeParse<unknown[]>(report.failureModesJson, []);

  return NextResponse.json(
    {
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
    },
    { status: 201 }
  );
}
