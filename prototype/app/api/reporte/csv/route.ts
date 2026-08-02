import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/**
 * Extrae los datos JSON del primer <Chart type="bar" ... /> del contenido del
 * reporte (la Figura 2 / gráfico de barras de la taxonomía).
 */
function extractBarChartData(content: string): Array<Record<string, unknown>> {
  const chartTags = content.match(/<Chart[\s\S]*?\/>/g) || [];

  for (const tag of chartTags) {
    const typeMatch = tag.match(/type=["']([^"']+)["']/);
    if (typeMatch && typeMatch[1] === "bar") {
      const dataMatch = tag.match(/data=(?:'([^']+)'|"([^"]+)")/);
      if (dataMatch) {
        try {
          const parsed = JSON.parse(dataMatch[1] || dataMatch[2]);
          if (Array.isArray(parsed)) return parsed;
        } catch {
          // Si el data no es JSON válido, se ignora este gráfico.
        }
      }
    }
  }

  return [];
}

function csvEscape(value: string): string {
  return `"${value.replace(/"/g, '""')}"`;
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const isEn = searchParams.get("lang")?.toLowerCase() === "en";

    const report = await prisma.report.findFirst({
      where: { isPublished: true },
      orderBy: { updatedAt: "desc" },
    });

    if (!report) {
      return NextResponse.json(
        { error: "No se encontró ningún reporte publicado." },
        { status: 404 }
      );
    }

    const rows = extractBarChartData(report.content);

    if (rows.length === 0) {
      return NextResponse.json(
        { error: "El reporte no contiene datos de gráfico de barras." },
        { status: 404 }
      );
    }

    const headers = isEn
      ? ["Failure mode", "Layer", "Median (% of energized kW)"]
      : ["Modo de fallo", "Capa", "Mediana (% de kW energizados)"];

    const lines = [headers.map(csvEscape).join(",")];

    for (const row of rows) {
      const name = typeof row.label === "string" && row.label ? row.label : String(row.name ?? "");
      const layer = String(row.layer ?? "");
      const value = String(row.value ?? "");
      lines.push([csvEscape(name), csvEscape(layer), csvEscape(value)].join(","));
    }

    return new NextResponse(lines.join("\r\n"), {
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="physaflow-capacidad-varada.csv"`,
      },
    });
  } catch (error: unknown) {
    const err = error as { message?: string };
    return NextResponse.json(
      { error: err.message || "Error al generar el CSV" },
      { status: 500 }
    );
  }
}
