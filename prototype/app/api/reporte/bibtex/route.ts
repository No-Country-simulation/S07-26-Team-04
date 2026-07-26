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
    const author = metadata.author || "Marín, Adrián";
    const title = metadata.title || "The Stranded Capacity Index";
    const doi = metadata.doi || `physaflow/sci-latest`;
    const published = metadata.published || "2025";
    const yearMatch = published.match(/\d{4}/);
    const citationYear = yearMatch ? yearMatch[0] : "2025";

    const bibtexContent = `@techreport{marin${citationYear}sci,
  author      = {${author}},
  title       = {${title}},
  institution = {PhysaFlow Research},
  year        = {${citationYear}},
  number      = {Vol. I, Rev. 1.0},
  doi         = {${doi}},
  license     = {CC BY-SA 4.0}
}`;

    return new NextResponse(bibtexContent, {
      status: 200,
      headers: {
        "Content-Type": "application/x-bibtex; charset=utf-8",
        "Content-Disposition": `attachment; filename="citation-${citationYear}-${lang.toLowerCase()}.bib"`,
      },
    });
  } catch {
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
