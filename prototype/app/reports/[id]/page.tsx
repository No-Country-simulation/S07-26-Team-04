import React from "react";
import { notFound } from "next/navigation";
import ReportLayout from "@/components/ReportLayout";
import DynamicReportContent from "@/components/DynamicReportContent";
import { prisma } from "@/lib/prisma";
import { Layer, LabelTranslations } from "@/components/DiagramaCapas";

interface ReportPageProps {
  params: Promise<{ id: string }>;
}

export default async function ReportDetailPage({ params }: ReportPageProps) {
  const { id } = await params;
  const lang = "ES";

  // Buscar por ID en PostgreSQL (Neon)
  const dbReport = await prisma.report.findUnique({
    where: { id },
  });

  if (!dbReport) {
    notFound();
  }

  // Parsear campos JSON de Prisma
  const layers = (dbReport.layers as unknown as Layer[]) || [];
  const labels = (dbReport.labels as unknown as LabelTranslations) || {
    visible: "Qué se ve",
    cost: "Cuánto cuesta",
    reason: "Por qué ocurre",
  };

  // Extraer encabezados H2 para la barra lateral
  const tocItems: Array<{ id: string; label: string }> = [];
  dbReport.content.split("\n").forEach((linea: string) => {
    if (linea.startsWith("## ")) {
      const label = linea.replace("## ", "").trim();
      const sectionId = label
        .toLowerCase()
        .replace(/[^\w\s-]/g, "")
        .replace(/\s+/g, "-");
      
      tocItems.push({ id: sectionId, label });

      if (sectionId.includes("03") || sectionId.includes("taxonomia") || sectionId.includes("taxonomy")) {
        layers.forEach((layer, idx) => {
          if (layer.id && layer.title) {
            const subNum = `03.${idx + 1}`;
            tocItems.push({ id: layer.id, label: `${subNum} — ${layer.title}` });
          }
        });
      }
    }
  });

  const frontmatter = {
    title: dbReport.title,
    subtitle: dbReport.subtitle || "",
    author: dbReport.author,
    published: dbReport.publishedDate,
    doi: dbReport.doi,
    readingTime: dbReport.readingTime,
    license: dbReport.license,
    medianaGlobal: dbReport.globalMedian,
    lossFacilities: dbReport.lossFacilities,
    lossIT: dbReport.lossIT,
    lossWorkload: dbReport.lossWorkload,
    keyFinding: dbReport.keyFinding || "El 31,4% de la capacidad energizada pagada en instalaciones hiperescala no produce ningún cómputo útil en una hora determinada.",
    layers,
    labels,
  };

  return (
    <ReportLayout lang={lang} frontmatter={frontmatter} tocItems={tocItems}>
      <DynamicReportContent
        content={dbReport.content}
        lang={lang}
        frontmatter={frontmatter}
      />
    </ReportLayout>
  );
}
