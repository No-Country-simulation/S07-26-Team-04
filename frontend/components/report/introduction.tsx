"use client";

import { getIntroduction } from "@/services/report.service";
import type { Introduction } from "@/types/introduction";
import { useEffect, useState } from "react";
import SectionContent from "./SectionContent";

export function Introduction() {
  const [introduction, setIntroduction] = useState<Introduction | null>(null);

  useEffect(() => {
    async function fetchIntroduction() {
      try {
        const data = await getIntroduction();
        console.log("Fetched introduction data:", data);
        setIntroduction(data);
      } catch (error) {
        console.error("Error fetching introduction data:", error);
      }
    }

    fetchIntroduction();
  }, []);

  const infoIntroduction = introduction?.sections.find(
    (section) => section.id === "por-que-existe-este-informe",
  );

  return (
    <section id="resumen" className="report-section">
      <div className="report-section-header">
        <span className="section-number">02</span>

        <div>
          <h2 className="section-title">{infoIntroduction?.title}</h2>

          <SectionContent
            content={
              infoIntroduction?.content ??
              "No se encontró el contenido de la introducción."
            }
          />
        </div>
      </div>
    </section>
  );
}
