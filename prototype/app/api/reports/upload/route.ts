import { NextRequest, NextResponse } from "next/server";
import matter from "gray-matter";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { ReportFrontmatterSchema } from "@/lib/report-schema";

function generateSlug(title: string, publishedDate: string): string {
  const base = `${title} ${publishedDate}`
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
  return base || "report";
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const targetId = (formData.get("targetId") as string) || null;
    const isPublishedInput = formData.get("isPublished");
    const isPublished = isPublishedInput !== null ? isPublishedInput === "true" : true;

    if (!file) {
      return NextResponse.json({ error: "No se proporcionó ningún archivo .mdx" }, { status: 400 });
    }

    const fileContent = await file.text();
    const { data } = matter(fileContent);

    // Validación con Zod en inglés
    const validatedData = ReportFrontmatterSchema.parse(data);
    const slug = generateSlug(validatedData.title, validatedData.publishedDate);

    let report;

    if (targetId) {
      // Sobrescribir reporte existente
      report = await prisma.report.update({
        where: { id: targetId },
        data: {
          slug,
          isPublished,
          title: validatedData.title,
          subtitle: validatedData.subtitle || null,
          author: validatedData.author,
          publishedDate: validatedData.publishedDate,
          doi: validatedData.doi,
          readingTime: validatedData.readingTime,
          license: validatedData.license,
          globalMedian: validatedData.globalMedian,
          lossFacilities: validatedData.lossFacilities,
          lossIT: validatedData.lossIT,
          lossWorkload: validatedData.lossWorkload,
          keyFinding: validatedData.keyFinding,
          labels: (validatedData.labels ?? {}) as Prisma.InputJsonValue,
          layers: (validatedData.layers ?? []) as Prisma.InputJsonValue,
          content: fileContent,
        },
      });
    } else {
      // Crear nuevo reporte con ID automático cuid()
      report = await prisma.report.create({
        data: {
          slug,
          isPublished,
          title: validatedData.title,
          subtitle: validatedData.subtitle || null,
          author: validatedData.author,
          publishedDate: validatedData.publishedDate,
          doi: validatedData.doi,
          readingTime: validatedData.readingTime,
          license: validatedData.license,
          globalMedian: validatedData.globalMedian,
          lossFacilities: validatedData.lossFacilities,
          lossIT: validatedData.lossIT,
          lossWorkload: validatedData.lossWorkload,
          keyFinding: validatedData.keyFinding,
          labels: (validatedData.labels ?? {}) as Prisma.InputJsonValue,
          layers: (validatedData.layers ?? []) as Prisma.InputJsonValue,
          content: fileContent,
        },
      });
    }

    return NextResponse.json({
      success: true,
      id: report.id,
      slug: report.slug,
      title: report.title,
      isPublished: report.isPublished,
    });
  } catch (error: unknown) {
    console.error("Error en la ingesta del reporte MDX:", error);

    const err = error as { name?: string; errors?: unknown; message?: string };
    if (err.name === "ZodError") {
      return NextResponse.json(
        { error: "Error de validación en el YAML Frontmatter del archivo MDX", details: err.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: err.message || "Error procesando la ingesta del archivo" },
      { status: 500 }
    );
  }
}
