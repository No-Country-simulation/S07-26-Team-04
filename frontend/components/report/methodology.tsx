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

  return (
    <section id="methodology" className="report-section">
      {/* Encabezado */}
      <div className="report-section-header">
        <span className="section-number">04</span>

        <div>
          <h2 className="section-title">
            {infoMethodology?.title.replace(/^\d+\s+[—-]\s*/i, "") ?? "Metodología"}
          </h2>

          <SectionContent
            content={
              infoMethodology?.content ??
              "La sección de metodología no está disponible en este momento."
            }
          />
        </div>
      </div>

      {/* ================================================
          PROGRESIÓN
      ================================================ */}

      <div className="report-sub-card">
        <div className="report-sub-card-label">
          PROGRESIÓN DE ESTADOS DE CAPACIDAD
        </div>

        <h3 className="report-sub-card-title">
          De capacidad instalada a capacidad productiva
        </h3>

        <p className="report-sub-card-description">
          Cada transición representa una condición necesaria para que la
          capacidad física de un centro de datos pueda convertirse finalmente en
          trabajo útil.
        </p>

        <CapacityProgression />
      </div>
    </section>
  );
}
