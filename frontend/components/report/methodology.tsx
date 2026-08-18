"use client";

import type { Methodology } from "@/types/methodology";
import { CapacityProgression } from "./capacity-progression";
import { useEffect, useState } from "react";
import { getMethodology } from "@/services/report.service";
import SectionContent from "./section-content";

export function Methodology({ reportId }: { reportId?: string } = {}) {
  const [methodology, setMethodology] = useState<Methodology | null>(null);

  useEffect(() => {
    async function fetchMethodology() {
      try {
        const data = await getMethodology(reportId);
        setMethodology(data);
      } catch (error) {
        console.error("Error fetching methodology data:", error);
      }
    }

    fetchMethodology();
  }, [reportId]);

  const infoMethodology = methodology?.sections.find(
    (section) =>
      section.id.includes("metodologia") ||
      section.title.toLowerCase().includes("metodología") ||
      section.title.toLowerCase().includes("metodologia")
  );

  if (!infoMethodology) {
    return null;
  }

  return (
    <section id="methodology" className="report-section">
      {/* Encabezado */}
      <div className="report-section-header">
        <div className="section-number">04</div>

        <div>
          <h2 className="section-title">
            {infoMethodology?.title.replace(/^\d+\s+[—-]\s*/i, "")}
          </h2>

          <SectionContent
            content={
              infoMethodology?.content ??
              "No se encontró el contenido de la metodología"
            }
          />
        </div>
      </div>

      {/* ================================================
          PROGRESIÓN
      ================================================ */}

      <div className="border border-[#c9a227]/30 p-6 lg:p-8  mt-10">
        <div className="text-label-caps text-[var(--gold)] mb-2 mt-4">
          PROGRESIÓN DE ESTADOS DE CAPACIDAD
        </div>

        <h3 className="text-headline-md text-[var(--warm-white)]">
          De capacidad instalada a capacidad productiva
        </h3>

        <p className="text-body-md text-[var(--on-surface-variant)] mt-3 max-w-3xl">
          Cada transición representa una condición necesaria para que la
          capacidad física de un centro de datos pueda convertirse finalmente en
          trabajo útil.
        </p>

        <CapacityProgression />
      </div>
    </section>
  );
}
