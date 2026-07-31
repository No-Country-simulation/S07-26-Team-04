import React from "react";
import { notFound } from "next/navigation";
import ReportLayout from "@/components/ReportLayout";
import DynamicReportContent from "@/components/DynamicReportContent";
import { prisma } from "@/lib/prisma";
import { Layer, LabelTranslations } from "@/components/DiagramaCapas";

export default async function Home() {
  const lang = "ES";

  // Consultar el reporte activo más recientemente actualizado desde PostgreSQL (Neon)
  const dbReporte = await prisma.reporte.findFirst({
    orderBy: { updatedAt: "desc" },
  });

  if (!dbReporte) {
    notFound();
  }

  // Parsear campos JSON de Prisma
  const layers = (dbReporte.layers as unknown as Layer[]) || [];
  const labels = (dbReporte.labels as unknown as LabelTranslations) || {
    visible: "Qué se ve",
    cost: "Cuánto cuesta",
    reason: "Por qué ocurre",
  };
  const methodologySteps = (dbReporte.methodologySteps as unknown as Array<{ num: string; title: string; borderColor: string; text: string }>) || [];
  const taxonomyData = (dbReporte.taxonomyData as unknown as Array<{ name: string; label: string; value: number; layer: string; color: string }>) || [];
  const cumulativeData = (dbReporte.cumulativeData as unknown as Array<{ year: string; value: number }>) || [];

  // 🪄 Extraer dinámicamente los encabezados H2 (##) para la barra lateral (TOC Sidebar)
  const tocItems: Array<{ id: string; label: string }> = [];
  dbReporte.contenido.split("\n").forEach((linea) => {
    if (linea.startsWith("## ")) {
      const label = linea.replace("## ", "").trim();
      const id = label
        .toLowerCase()
        .replace(/[^\w\s-]/g, "")
        .replace(/\s+/g, "-");
      
      tocItems.push({ id, label });

      // Inyectar subcapas interactivas si corresponde a la taxonomía
      if (label.includes("03")) {
        tocItems.push({ id: "facility", label: "03.1 — Capa de instalaciones" });
        tocItems.push({ id: "it", label: "03.2 — Capa de TI" });
        tocItems.push({ id: "workload", label: "03.3 — Capa de carga" });
      }
    }
  });

  const frontmatter = {
    title: dbReporte.titulo,
    subtitle: dbReporte.subtitulo || "",
    author: dbReporte.autor,
    published: dbReporte.published,
    doi: dbReporte.doi,
    readingTime: dbReporte.readingTime,
    license: dbReporte.license,
    medianaGlobal: dbReporte.medianaGlobal,
    lossFacilities: dbReporte.lossFacilities,
    lossIT: dbReporte.lossIT,
    lossWorkload: dbReporte.lossWorkload,
    keyFinding: dbReporte.keyFinding || "El 31,4% de la capacidad energizada pagada en instalaciones hiperescala no produce ningún cómputo útil en una hora determinada.",
    layers,
    labels,
    methodologySteps,
    taxonomyData,
    cumulativeData,
  };

  return (
    <ReportLayout lang={lang} frontmatter={frontmatter} tocItems={tocItems}>
      <DynamicReportContent
        content={dbReporte.contenido}
        lang={lang}
        frontmatter={frontmatter}
      />
    </ReportLayout>
  );
}
