import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/** Escapa caracteres especiales de LaTeX/BibTeX en valores de texto. */
function escapeTex(value: string): string {
  return value.replace(/[{}&%$#_~^\\]/g, "\\$&");
}

export async function GET() {
  try {
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

    const yearMatch = report.publishedDate.match(/\d{4}/);
    const year = yearMatch ? yearMatch[0] : new Date().getFullYear().toString();
    const citeKey = `physaflow${year}`;

    const bibtex = `@techreport{${citeKey},
  author      = {${escapeTex(report.author)}},
  title       = {${escapeTex(report.title)}},
  year        = {${year}},
  institution = {PhysaFlow},
  type        = {Stranded Capacity Index},
  doi         = {${report.doi}},
  note        = {Licencia ${escapeTex(report.license)}}
}
`;

    return new NextResponse(bibtex, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Content-Disposition": `attachment; filename="physaflow-${year}.bib"`,
      },
    });
  } catch (error: unknown) {
    const err = error as { message?: string };
    return NextResponse.json(
      { error: err.message || "Error al generar el BibTeX" },
      { status: 500 }
    );
  }
}
