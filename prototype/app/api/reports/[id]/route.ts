import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { generateAiKnowledge } from "@/lib/generate-ai-knowledge";
import { getAdminSession } from "@/lib/session";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(req: NextRequest, { params }: RouteParams) {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }
    const { id } = await params;

    const report = await prisma.report.findUnique({
      where: { id },
    });

    if (!report) {
      return NextResponse.json({ error: "Reporte no encontrado" }, { status: 404 });
    }

    return NextResponse.json({ report });
  } catch (error: unknown) {
    const err = error as { message?: string };
    return NextResponse.json(
      { error: err.message || "Error al obtener el reporte" },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest, { params }: RouteParams) {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }
    const { id } = await params;
    const body = await req.json();

    const existingReport = await prisma.report.findUnique({
      where: { id },
    });

    if (!existingReport) {
      return NextResponse.json({ error: "Reporte no encontrado" }, { status: 404 });
    }

    const newIsPublished = typeof body.isPublished === "boolean" ? body.isPublished : existingReport.isPublished;
    const newContent = body.content || existingReport.content;

    let aiKnowledge = existingReport.aiKnowledge;

    // Si pasa a estar publicado o si se editó el contenido de un reporte publicado, regenerar aiKnowledge
    if (newIsPublished && (body.isPublished === true || body.content)) {
      aiKnowledge = await generateAiKnowledge({
        title: body.title || existingReport.title,
        subtitle: existingReport.subtitle,
        author: existingReport.author,
        publishedDate: existingReport.publishedDate,
        doi: existingReport.doi,
        globalMedian: existingReport.globalMedian,
        lossFacilities: existingReport.lossFacilities,
        lossIT: existingReport.lossIT,
        lossWorkload: existingReport.lossWorkload,
        keyFinding: existingReport.keyFinding,
        layers: existingReport.layers,
        content: newContent,
      }) as unknown as Prisma.JsonValue;
    }

    const report = await prisma.report.update({
      where: { id },
      data: {
        ...(typeof body.isPublished === "boolean" ? { isPublished: body.isPublished } : {}),
        ...(body.title ? { title: body.title } : {}),
        ...(body.content ? { content: body.content } : {}),
        ...(aiKnowledge ? { aiKnowledge: aiKnowledge as Prisma.InputJsonValue } : {}),
      },
    });

    return NextResponse.json({ success: true, report });
  } catch (error: unknown) {
    const err = error as { message?: string };
    return NextResponse.json(
      { error: err.message || "Error al actualizar el reporte" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest, { params }: RouteParams) {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }
    const { id } = await params;

    await prisma.report.delete({
      where: { id },
    });

    return NextResponse.json({ success: true, message: "Reporte eliminado correctamente" });
  } catch (error: unknown) {
    const err = error as { message?: string };
    return NextResponse.json(
      { error: err.message || "Error al eliminar el reporte" },
      { status: 500 }
    );
  }
}
