import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const reporte = await prisma.reporte.findFirst({
      orderBy: { updatedAt: "desc" },
    });

    if (!reporte) {
      return NextResponse.json({ error: "Reporte no encontrado" }, { status: 444 });
    }

    return NextResponse.json(reporte);
  } catch (error) {
    console.error("Error al obtener el reporte:", error);
    return NextResponse.json(
      { error: "Error interno del servidor al consultar el reporte" },
      { status: 500 }
    );
  }
}
