"use client";

import type { Taxonomy } from "@/types/taxonomy";
import { useEffect, useState } from "react";
import { getTaxonomy } from "@/services/report.service";
import { TaxonomyLayer } from "./taxonomy-layer";
import SectionContent from "./SectionContent";

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
    (section) => section.id === "taxonomia-tres-capas-nueve-fallos-con-nombre",
  );

  const facilities = taxonomy?.sections.find(
    (section) =>
      section.id ===
      "capa-1-facilities-instalaciones-energia-refrigeracion-espacio",
  );

  const facilitiesItems = taxonomy?.sections.filter(
    (section) => section.level === 4 && section.id.startsWith("f-"),
  );

  if (!facilities) {
    return null;
  }

  const infrastructure = taxonomy?.sections.find(
    (section) =>
      section.id === "capa-2-it-infraestructura-racks-nodos-topologia",
  );

  const infrastructureItems = taxonomy?.sections.filter(
    (section) => section.level === 4 && section.id.startsWith("i-"),
  );

  if (!infrastructure) {
    return null;
  }

  const workload = taxonomy?.sections.find(
    (section) =>
      section.id ===
      "capa-3-workload-carga-de-trabajo-programacion-orquestacion",
  );

  const workloadItems = taxonomy?.sections.filter(
    (section) => section.level === 4 && section.id.startsWith("w-"),
  );

  if (!workload) {
    return null;
  }

  return (
    <>
      <section id="taxonomy" className="report-section">
        <div className="report-section-header">
          <span className="section-number">03</span>

          <div>
            <h2 className="section-title">{infoTaxonomy?.title}</h2>

            <SectionContent
              content={
                infoTaxonomy?.content ??
                "No se encontró la descripción de la taxonomía."
              }
            />
          </div>
        </div>
      </section>

      <section id="facilities">
        <TaxonomyLayer layer={facilities} items={facilitiesItems || []} />
      </section>
      <section id="infrastructure">
        <TaxonomyLayer
          layer={infrastructure}
          items={infrastructureItems || []}
        />
      </section>
      <section id="workload">
        <TaxonomyLayer layer={workload} items={workloadItems || []} />
      </section>
    </>
  );
}
