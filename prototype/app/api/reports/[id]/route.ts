import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(req: NextRequest, { params }: RouteParams) {
  try {
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
    const { id } = await params;
    const body = await req.json();

    const report = await prisma.report.update({
      where: { id },
      data: {
        ...(typeof body.isPublished === "boolean" ? { isPublished: body.isPublished } : {}),
        ...(body.title ? { title: body.title } : {}),
        ...(body.content ? { content: body.content } : {}),
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
