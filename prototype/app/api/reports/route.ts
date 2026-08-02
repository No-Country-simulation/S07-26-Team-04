import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "3", 10);
    const status = searchParams.get("status"); // "published" | "draft" | null (todos)

    const skip = (page - 1) * limit;

    const whereClause: { isPublished?: boolean } = {};
    if (status === "published") {
      whereClause.isPublished = true;
    } else if (status === "draft") {
      whereClause.isPublished = false;
    }

    const [reports, total] = await Promise.all([
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
    ]);

    return NextResponse.json({
      reports,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
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
