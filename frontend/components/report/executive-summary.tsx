"use client";

import { useEffect, useState } from "react";
import { motion } from "motion/react";
import type { ExecutiveSummary } from "@/types/executive-summary";
import { getExecutiveSummary } from "@/services/report.service";
import SectionContent from "./section-content";

export function ExecutiveSummary({ reportId }: { reportId?: string } = {}) {
  const [summary, setSummary] = useState<ExecutiveSummary | null>(null);

  useEffect(() => {
    async function fetchExecutiveSummary() {
      try {
        const data = await getExecutiveSummary(reportId);
        setSummary(data);
      } catch (error) {
        console.error("Error fetching executive summary data:", error);
      }
    }

    fetchExecutiveSummary();
  }, [reportId]);

  const infoSummary = summary?.sections.find(
    (section) =>
      section.id.includes("resumen") ||
      section.title.toLowerCase().includes("resumen")
  );

  return (
    <motion.section
      id="resumen"
      className="report-section"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <div className="report-section-header">
        <span className="section-number">01</span>

        <div>
          <h2 className="section-title">
            {infoSummary?.title.replace(/^\d+\s+[—-]\s*/i, "") ?? "Resumen ejecutivo"}
          </h2>

          <SectionContent
            content={
              infoSummary?.content ?? "El contenido del resumen ejecutivo no está disponible en este momento."
            }
          />
        </div>
      </div>
    </motion.section>
  );
}
