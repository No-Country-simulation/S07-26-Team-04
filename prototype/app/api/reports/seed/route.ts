import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { ReportFrontmatterSchema } from "@/lib/report-schema";
import { generateAiKnowledge } from "@/lib/generate-ai-knowledge";
import { getAdminSession } from "@/lib/session";

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

export async function POST() {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }
    const templatePath = path.join(
      process.cwd(),
      "public",
      "templates",
      "plantilla-reporte-physaflow.mdx"
    );

    if (!fs.existsSync(templatePath)) {
      return NextResponse.json(
        { error: "No se encontró el archivo de plantilla MDX en el servidor" },
        { status: 404 }
      );
    }

    const fileContent = fs.readFileSync(templatePath, "utf-8");
    const { data } = matter(fileContent);

    const validated = ReportFrontmatterSchema.parse(data);
    const slug = generateSlug(validated.title, validated.publishedDate);

    const aiKnowledge = await generateAiKnowledge({
      title: validated.title,
      subtitle: validated.subtitle,
      author: validated.author,
      publishedDate: validated.publishedDate,
      doi: validated.doi,
      globalMedian: validated.globalMedian,
      lossFacilities: validated.lossFacilities,
      lossIT: validated.lossIT,
      lossWorkload: validated.lossWorkload,
      keyFinding: validated.keyFinding,
      layers: validated.layers,
      content: fileContent,
    });

    const report = await prisma.report.create({
      data: {
        slug,
        isPublished: true,
        title: validated.title,
        subtitle: validated.subtitle || null,
        author: validated.author,
        publishedDate: validated.publishedDate,
        doi: validated.doi,
        readingTime: validated.readingTime,
        license: validated.license,
        globalMedian: validated.globalMedian,
        lossFacilities: validated.lossFacilities,
        lossIT: validated.lossIT,
        lossWorkload: validated.lossWorkload,
        keyFinding: validated.keyFinding,
        layers: (validated.layers ?? []) as Prisma.InputJsonValue,
        aiKnowledge: aiKnowledge as unknown as Prisma.InputJsonValue,
        content: fileContent,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Base de datos sembrada con éxito desde la plantilla oficial.",
      report,
    });
  } catch (error: unknown) {
    const err = error as { message?: string };
    return NextResponse.json(
      { error: err.message || "Error al sembrar la base de datos" },
      { status: 500 }
    );
  }
}
