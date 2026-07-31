import { NextRequest, NextResponse } from "next/server";
import matter from "gray-matter";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { ReporteFrontmatterSchema } from "@/lib/reporte-schema";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const targetId = (formData.get("targetId") as string) || "global-report";

    if (!file) {
      return NextResponse.json({ error: "No se proporcionó ningún archivo .mdx" }, { status: 400 });
    }

    const fileContent = await file.text();
    const { data, content } = matter(fileContent);

    // Validación del schema de Frontmatter con Zod
    const validatedData = ReporteFrontmatterSchema.parse(data);

    const reporte = await prisma.reporte.upsert({
      where: { id: targetId },
      update: {
        titulo: validatedData.title,
        subtitulo: validatedData.subtitle || null,
        autor: validatedData.author,
        published: validatedData.published,
        doi: validatedData.doi,
        readingTime: validatedData.readingTime,
        license: validatedData.license,
        medianaGlobal: validatedData.medianaGlobal,
        lossFacilities: validatedData.lossFacilities,
        lossIT: validatedData.lossIT,
        lossWorkload: validatedData.lossWorkload,
        keyFinding: validatedData.keyFinding,
        labels: (validatedData.labels ?? {}) as Prisma.InputJsonValue,
        layers: validatedData.layers as unknown as Prisma.InputJsonValue,
        methodologySteps: (validatedData.methodologySteps ?? []) as unknown as Prisma.InputJsonValue,
        taxonomyData: validatedData.taxonomyData as unknown as Prisma.InputJsonValue,
        cumulativeData: validatedData.cumulativeData as unknown as Prisma.InputJsonValue,
        contenido: content,
      },
      create: {
        id: targetId,
        titulo: validatedData.title,
        subtitulo: validatedData.subtitle || null,
        autor: validatedData.author,
        published: validatedData.published,
        doi: validatedData.doi,
        readingTime: validatedData.readingTime,
        license: validatedData.license,
        medianaGlobal: validatedData.medianaGlobal,
        lossFacilities: validatedData.lossFacilities,
        lossIT: validatedData.lossIT,
        lossWorkload: validatedData.lossWorkload,
        keyFinding: validatedData.keyFinding,
        labels: (validatedData.labels ?? {}) as Prisma.InputJsonValue,
        layers: validatedData.layers as unknown as Prisma.InputJsonValue,
        methodologySteps: (validatedData.methodologySteps ?? []) as unknown as Prisma.InputJsonValue,
        taxonomyData: validatedData.taxonomyData as unknown as Prisma.InputJsonValue,
        cumulativeData: validatedData.cumulativeData as unknown as Prisma.InputJsonValue,
        contenido: content,
      },
    });

    return NextResponse.json({ success: true, id: reporte.id, title: reporte.titulo });
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
