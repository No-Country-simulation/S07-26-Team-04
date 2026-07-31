import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const reportes = await prisma.reporte.findMany({
      orderBy: { updatedAt: "desc" },
      select: {
        id: true,
        titulo: true,
        subtitulo: true,
        autor: true,
        published: true,
        readingTime: true,
        license: true,
        doi: true,
        medianaGlobal: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return NextResponse.json({ reportes });
  } catch (error: unknown) {
    const err = error as { message?: string };
    return NextResponse.json(
      { error: err.message || "Error obteniendo los reportes" },
      { status: 500 }
    );
  }
}
