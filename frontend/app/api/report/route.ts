import { NextRequest, NextResponse } from 'next/server';

import { prisma } from '@/lib/prisma';
import type { ReportSection } from '@/lib/report-parser';

export const maxDuration = 30;

function safeParse<T>(raw: string | null | undefined, fallback: T): T {
  if (!raw) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

/**
 * Devuelve los datos estructurados del reporte para el frontend.
 *
 * GET /api/report            -> reporte publicado más reciente
 * GET /api/report?slug=<x>  -> reporte por slug
 * GET /api/report?id=<id>   -> reporte por id
 */
export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const slug = searchParams.get('slug');
  const id = searchParams.get('id');

  const report = await prisma.report.findFirst({
    where: {
      status: 'published',
      ...(slug ? { slug } : {}),
      ...(id ? { id } : {}),
    },
    orderBy: { publishedAt: 'desc' },
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
    description: report.description,
    tags: report.tags,
    publishedAt: report.publishedAt,
    sections,
    metrics,
    charts,
    failureModes,
  });
}