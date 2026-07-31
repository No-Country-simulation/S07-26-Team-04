import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "No se proporcionó el ID del reporte" }, { status: 400 });
    }

    const count = await prisma.reporte.count();
    if (count <= 1) {
      return NextResponse.json(
        { error: "No se puede eliminar el único reporte existente en la base de datos." },
        { status: 400 }
      );
    }

    await prisma.reporte.delete({
      where: { id },
    });

    return NextResponse.json({ success: true, message: "Reporte eliminado con éxito." });
  } catch (error: unknown) {
    const err = error as { message?: string };
    return NextResponse.json(
      { error: err.message || "Error al eliminar el reporte" },
      { status: 500 }
    );
  }
}
