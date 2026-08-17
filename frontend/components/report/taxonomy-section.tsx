"use client";

import type { Taxonomy } from "@/types/taxonomy";
import { useEffect, useState } from "react";
import { getTaxonomy } from "@/services/report.service";
import SectionContent from "./section-content";

export function TaxonomySection() {
  const [taxonomy, setTaxonomy] = useState<Taxonomy | null>(null);

  useEffect(() => {
    async function fetchTaxonomy() {
      try {
        const data = await getTaxonomy();
        setTaxonomy(data);
      } catch (error) {
        console.error("Error fetching taxonomy data:", error);
      }
    }

    fetchTaxonomy();
  }, []);

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
              {infoTaxonomy?.title ?? "Título no disponible"}
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
    </>
  );
}
