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
    (section) => section.id === "evolucion-de-la-capacidad-varada",
  );

  return (
    <>
      <section id="taxonomy" className="report-section">
        <div className="report-section-header">
          <span className="section-number">03</span>

          <div>
            <h2 className="section-title">
              {infoTaxonomy?.title ?? "Taxonomía"}
            </h2>

            <SectionContent
              content={
                infoTaxonomy?.content ??
                "La sección de taxonomía no está disponible en este momento."
              }
            />
          </div>
        </div>
      </section>
    </>
  );
}
