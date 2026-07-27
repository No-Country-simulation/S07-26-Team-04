import React from "react";
import { notFound } from "next/navigation";
import ReportLayout from "@/components/ReportLayout";
import GraficoBarrasDesperdicio from "@/components/GraficoBarrasDesperdicio";
import GraficoLineaAcumulado from "@/components/GraficoLineaAcumulado";
import CitationBlock from "@/components/CitationBlock";
import DiagramaCapas, { Layer, LabelTranslations } from "@/components/DiagramaCapas";


// eslint-disable-next-line @typescript-eslint/no-explicit-any
const reportsRegistry: Record<string, () => Promise<any>> = {
  ES: () => import("@/content/reporte-ES.mdx"),
  EN: () => import("@/content/reporte-EN.mdx"),
};

interface PageProps {
  searchParams: Promise<{ lang?: string }>;
}

export default async function Home({ searchParams }: PageProps) {
  const sParams = await searchParams;
  const lang = (sParams.lang || "es").toUpperCase();

  // Validate language exists
  if (!reportsRegistry[lang]) {
    notFound();
  }

  let MdxComponent: React.ComponentType<{ components: Record<string, React.ComponentType<Record<string, unknown>>> }>;
  let reportMeta: {
    title: string;
    subtitle: string;
    author: string;
    published: string;
    doi: string;
    readingTime: string;
    license: string;
    medianaGlobal: string;
    lossFacilities: string;
    lossIT: string;
    lossWorkload: string;
    layers: Layer[];
    labels: LabelTranslations;
  };
  let taxonomyData: Array<{ name: string; label: string; value: number; layer: string; color: string }>;
  let cumulativeData: Array<{ year: string; value: number }>;

  try {
    const loadReportModule = reportsRegistry[lang];
    const mod = await loadReportModule();
    MdxComponent = mod.default;
    const metadata = mod.metadata;

    reportMeta = {
      title: metadata.title || "El Índice de Capacidad Varada",
      subtitle: metadata.subtitle || "",
      author: metadata.author || "Dr. Adrián Marín",
      published: metadata.published || "Octubre 2025",
      doi: metadata.doi || "physaflow/sci-latest",
      readingTime: metadata.readingTime || "~22 minutos",
      license: metadata.license || "CC BY-SA 4.0",
      medianaGlobal: metadata.medianaGlobal || "31,4%",
      lossFacilities: metadata.lossFacilities || "14,8%",
      lossIT: metadata.lossIT || "9,7%",
      lossWorkload: metadata.lossWorkload || "6,9%",
      layers: metadata.layers || [],
      labels: metadata.labels || { visible: "Qué se ve", cost: "Cuánto cuesta", reason: "Por qué ocurre" },
    };

    taxonomyData = metadata.taxonomyData || [];
    cumulativeData = metadata.cumulativeData || [];
  } catch (error) {
    console.error("Failed to load root report page metadata", error);
    notFound();
  }

  return (
    <ReportLayout lang={lang} frontmatter={reportMeta}>
      <MdxComponent
        components={{
          // Pass the dynamic datasets straight to the charts
          DiagramaCapas: (props: React.ComponentProps<typeof DiagramaCapas>) => (
            <DiagramaCapas
              {...props}
              lang={lang}
              lossFacilities={reportMeta.lossFacilities}
              lossIT={reportMeta.lossIT}
              lossWorkload={reportMeta.lossWorkload}
              layers={reportMeta.layers}
              labels={reportMeta.labels}
            />
          ),
          GraficoBarrasDesperdicio: (props: React.ComponentProps<typeof GraficoBarrasDesperdicio>) => (
            <GraficoBarrasDesperdicio
              {...props}
              data={taxonomyData}
              lang={lang}
              labels={reportMeta.labels}
            />
          ),
          GraficoLineaAcumulado: (props: React.ComponentProps<typeof GraficoLineaAcumulado>) => (
            <GraficoLineaAcumulado
              {...props}
              data={cumulativeData}
              lang={lang}
              labels={reportMeta.labels}
            />
          ),
          CitationBlock: (props: React.ComponentProps<typeof CitationBlock>) => {
            const yearMatch = reportMeta.published.match(/\d{4}/);
            const citationYear = yearMatch ? yearMatch[0] : "2025";
            return (
              <CitationBlock
                {...props}
                author={reportMeta.author}
                title={reportMeta.title}
                year={citationYear}
                doi={reportMeta.doi}
                medianaGlobal={reportMeta.medianaGlobal}
                labels={reportMeta.labels}
              />
            );
          },
        }}
      />
    </ReportLayout>
  );
}
