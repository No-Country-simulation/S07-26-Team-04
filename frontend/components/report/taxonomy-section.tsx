"use client";

import type { Taxonomy } from "@/types/taxonomy";
import { useEffect, useState } from "react";
import { getTaxonomy } from "@/services/report.service";
import SectionContent from "./section-content";

export function TaxonomySection({ reportId }: { reportId?: string } = {}) {
  const [taxonomy, setTaxonomy] = useState<Taxonomy | null>(null);

  useEffect(() => {
    async function fetchTaxonomy() {
      try {
        const data = await getTaxonomy(reportId);
        setTaxonomy(data);
      } catch (error) {
        console.error("Error fetching taxonomy data:", error);
      }
    }

    fetchTaxonomy();
  }, [reportId]);

  const sectionsList = taxonomy?.sections || [];
  const section03Index = sectionsList.findIndex(
    (section) =>
      section.id.includes("taxonomia") ||
      section.title.toLowerCase().includes("taxonomía") ||
      section.title.toLowerCase().includes("taxonomia")
  );

  const mainTaxonomy = section03Index >= 0 ? sectionsList[section03Index] : null;

  // Subsecciones pertenecientes a la taxonomía (L1, L2, L3)
  const taxonomySubsections = sectionsList.filter((s, idx) => {
    if (section03Index < 0) return false;
    // Captura cualquier sección subsecuente que no sea una sección principal numerada como 04, 05, etc.
    return idx > section03Index && !/^(04|05|06|07)\s*/.test(s.title) && !s.id.includes("04") && !s.id.includes("metodologia");
  });

  const fullContent = [
    mainTaxonomy?.content || "",
    ...taxonomySubsections.map((sub) => `## ${sub.title}\n\n${sub.content}`),
  ]
    .filter(Boolean)
    .join("\n\n");

  return (
    <section id="taxonomy" className="report-section">
      <div className="report-section-header">
        <span className="section-number">03</span>

        <div>
          <h2 className="section-title">
            {mainTaxonomy?.title ? mainTaxonomy.title.replace(/^\d+\s+[—-]\s*/i, "") : "Descripción general de la taxonomía"}
          </h2>

          <SectionContent
            content={
              fullContent || "No se encontró la descripción de la taxonomía."
            }
          />
        </div>
      </div>
    </section>
  );
}
