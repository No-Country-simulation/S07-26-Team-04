import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET() {
  try {
    const filePath = path.resolve(process.cwd(), "public/templates/plantilla-reporte-physaflow.mdx");

    if (!fs.existsSync(filePath)) {
      return NextResponse.json({ error: "No se encontró la plantilla estática en public/templates/" }, { status: 404 });
    }

    const fileContent = fs.readFileSync(filePath, "utf-8");

    return new NextResponse(fileContent, {
      headers: {
        "Content-Type": "text/markdown; charset=utf-8",
        "Content-Disposition": 'attachment; filename="plantilla-reporte-physaflow.mdx"',
      },
    });
  } catch (error: unknown) {
    const err = error as { message?: string };
    return NextResponse.json({ error: err.message || "Error al descargar la plantilla" }, { status: 500 });
  }
}
