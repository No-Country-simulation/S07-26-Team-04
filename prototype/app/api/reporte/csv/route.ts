import { NextRequest, NextResponse } from "next/server";
import { getMdxMetadata } from "@/lib/mdxHelper";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const lang = (searchParams.get("lang") || "ES").toUpperCase();

  const metadata = getMdxMetadata(lang);

  if (!metadata) {
    return new NextResponse("Report metadata not found", { status: 404 });
  }

  try {
    const taxonomyData = metadata.taxonomyData || [];

    // Build CSV Content
    let csvContent = lang === "EN"
      ? "Code,Name,Label,Value (%),Layer\n"
      : "Código,Nombre,Etiqueta,Valor (%),Capa\n";

    for (const item of taxonomyData) {
      const label = `"${item.label.replace(/"/g, '""')}"`;
      const layer = `"${item.layer.replace(/"/g, '""')}"`;
      csvContent += `${item.code},${item.name},${label},${item.value},${layer}\n`;
    }

    const filenameDate = metadata.published ? metadata.published.replace(/\s+/g, "-").toLowerCase() : "report";

    return new NextResponse(csvContent, {
      status: 200,
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="stranded-capacity-index-${filenameDate}-${lang.toLowerCase()}.csv"`,
      },
    });
  } catch {
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
