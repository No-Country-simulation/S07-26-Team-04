"use client";

import { useEffect, useState } from "react";
import type { ExecutiveSummary } from "@/types/executive-summary";
import { getExecutiveSummary } from "@/services/report.service";
import SectionContent from "./SectionContent";

export function ExecutiveSummary() {
  const [summary, setSummary] = useState<ExecutiveSummary | null>(null);

  useEffect(() => {
    async function fetchExecutiveSummary() {
      try {
        const data = await getExecutiveSummary();
        setSummary(data);
      } catch (error) {
        console.error("Error fetching executive summary data:", error);
      }
    }

    fetchExecutiveSummary();
  }, []);

  const infoSummary = summary?.sections.find(
    (section) => section.id === "el-impuesto-oculto-del-computo-moderno",
  );

  if (!infoSummary) {
    return null;
  }

  return (
    <section id="resumen" className="report-section">
      <div className="report-section-header">
        <span className="section-number">01</span>

        <div>
          <h2 className="section-title">{infoSummary?.title}</h2>

          <SectionContent
            content={
              infoSummary?.content ?? "No se encontró el contenido del resumen."
            }
          />
        </div>
      </div>
    </section>
  );
}
