import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAdminSession } from "@/lib/session";

export async function GET(req: NextRequest) {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = Math.min(Math.max(parseInt(searchParams.get("limit") || "3", 10) || 3, 1), 100);
    const status = searchParams.get("status"); // "published" | "draft" | null (todos)

    const skip = (page - 1) * limit;

    const whereClause: { isPublished?: boolean } = {};
    if (status === "published") {
      whereClause.isPublished = true;
    } else if (status === "draft") {
      whereClause.isPublished = false;
    }

    const [reports, filteredTotal, published, drafts] = await Promise.all([
      prisma.report.findMany({
        where: whereClause,
        orderBy: { updatedAt: "desc" },
        skip,
        take: limit,
        select: {
          id: true,
          slug: true,
          isPublished: true,
          title: true,
          subtitle: true,
          author: true,
          publishedDate: true,
          readingTime: true,
          license: true,
          doi: true,
          globalMedian: true,
          createdAt: true,
          updatedAt: true,
        },
      }),
      prisma.report.count({ where: whereClause }),
      prisma.report.count({ where: { isPublished: true } }),
      prisma.report.count({ where: { isPublished: false } }),
    ]);

    return NextResponse.json({
      reports,
      pagination: {
        total: filteredTotal,
        page,
        limit,
        totalPages: Math.ceil(filteredTotal / limit),
      },
      summary: {
        total: published + drafts,
        published,
        drafts,
      },
    });
  } catch (error: unknown) {
    const err = error as { message?: string };
    return NextResponse.json(
      { error: err.message || "Error al obtener la lista de reportes" },
      { status: 500 }
    );
  }
}
