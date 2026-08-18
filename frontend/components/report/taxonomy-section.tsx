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

  const infoTaxonomy = taxonomy?.sections.find(
    (section) =>
      section.id.includes("taxonomia") ||
      section.title.toLowerCase().includes("taxonomía") ||
      section.title.toLowerCase().includes("taxonomia") ||
      section.id.includes("hallazgos")
  );

  return (
    <section id="taxonomy" className="report-section">
      <div className="report-section-header">
        <span className="section-number">03</span>

        <div>
          <h2 className="section-title">
            {infoTaxonomy?.title ? infoTaxonomy.title.replace(/^\d+\s+[—-]\s*/i, "") : "Descripción general de la taxonomía"}
          </h2>

          <SectionContent
            content={
              infoTaxonomy?.content ??
              "No se encontró la descripción de la taxonomía."
            }
          />
        </div>
      </div>
    </section>
  );
}
