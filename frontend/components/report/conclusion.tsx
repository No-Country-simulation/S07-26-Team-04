"use client";

import { useEffect, useState } from "react";
import { motion } from "motion/react";
import SectionContent from "./section-content";
import type { Conclusion } from "@/types/conclusion";
import { getConclusion } from "@/services/report.service";

export function Conclusion({ reportId }: { reportId?: string } = {}) {
  const [conclusion, setConclusion] = useState<Conclusion | null>(null);

  useEffect(() => {
    async function fetchConclusion() {
      try {
        const data = await getConclusion(reportId);
        setConclusion(data);
      } catch (error) {
        console.error("Error fetching conclusion data:", error);
      }
    }

    fetchConclusion();
  }, [reportId]);

  const infoconclusion = conclusion?.sections.find(
    (section) =>
      section.id.includes("conclusion") ||
      section.title.toLowerCase().includes("conclusión") ||
      section.title.toLowerCase().includes("conclusion")
  );

  return (
    <motion.section
      id="conclusion"
      className="report-section"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <div className="report-section-header">
        <span className="section-number">06</span>

        <div>
          <h2 className="section-title">
            {infoconclusion?.title.replace(/^\d+\s+[—-]\s*/i, "") ?? "Conclusión"}
          </h2>

          <SectionContent
            content={
              infoconclusion?.content ??
              "La sección de conclusión no está disponible en este momento."
            }
          />
        </div>
      </div>
    </motion.section>
  );
}
