import React from "react";
import ReportLayout from "@/components/ReportLayout";
import DynamicReportContent from "@/components/DynamicReportContent";
import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/utils";
import { Layer, LabelTranslations } from "@/components/DiagramaCapas";
import { Sparkles, ArrowRight, ShieldCheck } from "lucide-react";

// Renderizar por request: la portada debe reflejar siempre el último reporte
// publicado desde el panel de administración, sin necesidad de re-deploy.
export const dynamic = "force-dynamic";

export default async function Home() {
  const lang = "ES";

  // Consultar el reporte activo más recientemente actualizado y publicado desde PostgreSQL (Neon)
  const dbReport = await prisma.report.findFirst({
    where: { isPublished: true },
    orderBy: { updatedAt: "desc" },
  });

  // Estado Vacío Elegante (Empty State) cuando la DB está limpia
  if (!dbReport) {
    return (
      <div className="min-h-screen bg-[var(--paper)] paper-texture flex flex-col items-center justify-center p-6 antialiased text-[var(--ink)]">
        <div className="max-w-md w-full bg-[var(--paper-2)] border border-[var(--rule-soft)] p-8 rounded-md shadow-sm text-center space-y-6">
          <div className="mx-auto w-14 h-14 bg-[var(--forest-700)] text-[var(--gold-400)] rounded-full flex items-center justify-center shadow-sm">
            <Sparkles className="w-7 h-7" />
          </div>

          <div className="space-y-2">
            <h1 className="font-display text-[24px] font-bold text-[var(--forest-800)]">
              PhysaFlow — Sistema de Publicaciones
            </h1>
            <p className="text-[13px] text-[var(--ink-muted)] leading-relaxed">
              Aún no se ha publicado ningún reporte técnico en PostgreSQL. El equipo editorial está preparando las métricas del Índice de Capacidad Varada.
            </p>
          </div>

          <div className="pt-2 border-t border-[var(--rule-soft)] flex flex-col gap-3">
            <a
              href="/admin"
              className="flex items-center justify-center gap-2 px-5 py-3 bg-[var(--forest-700)] hover:bg-[var(--forest-800)] text-white text-[13px] font-semibold rounded-md transition shadow-sm"
            >
              <span>Acceder al Panel de Administración</span>
              <ArrowRight className="w-4 h-4" />
            </a>

            <div className="flex items-center justify-center gap-1.5 text-[11px] text-[var(--ink-soft)] pt-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Base de Datos Neon PostgreSQL Conectada</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Parsear campos JSON de Prisma
  const layers = (dbReport.layers as unknown as Layer[]) || [];
  const labels: LabelTranslations = {
    visible: "Qué se ve",
    cost: "Cuánto cuesta",
    reason: "Por qué ocurre",
  };

  // 🪄 Extraer dinámicamente los encabezados H2 (##) para la barra lateral (TOC Sidebar)
  const tocItems: Array<{ id: string; label: string }> = [];
  dbReport.content.split("\n").forEach((linea: string) => {
    if (linea.startsWith("## ")) {
      const label = linea.replace("## ", "").trim();
      const id = slugify(label);
      
      tocItems.push({ id, label });

      // Inyectar subcapas interactivas leyendo los títulos reales de las capas en el idioma del informe (con numeración 03.X —)
      if (id.includes("03") || id.includes("taxonomia") || id.includes("taxonomy")) {
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
    keyFinding: dbReport.keyFinding || "",
    layers,
    labels,
  };

  return (
    <ReportLayout lang={lang} reportId={dbReport.id} frontmatter={frontmatter} tocItems={tocItems}>
      <DynamicReportContent
        content={dbReport.content}
        lang={lang}
        frontmatter={frontmatter}
      />
    </ReportLayout>
  );
}
