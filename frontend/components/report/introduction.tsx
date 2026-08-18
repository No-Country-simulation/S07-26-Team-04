"use client";

import { getIntroduction, getMainFindings } from "@/services/report.service";
import type { Introduction } from "@/types/introduction";
import { useEffect, useState } from "react";
import SectionContent from "./section-content";
import { MainFindings } from "@/types/main-findings";

export function Introduction({ reportId }: { reportId?: string } = {}) {
  const [introduction, setIntroduction] = useState<Introduction | null>(null);
  const [mainFinding, setMainFinding] = useState<MainFindings | null>(null);

  useEffect(() => {
    async function fetchIntroduction() {
      try {
        const data = await getIntroduction(reportId);
        setIntroduction(data);
      } catch (error) {
        console.error("Error fetching introduction data:", error);
      }
    }

    async function fetchMainFinding() {
      try {
        const data = await getMainFindings(reportId);
        setMainFinding(data);
      } catch (error) {
        console.error("Error fetching main finding data:", error);
      }
    }

    fetchIntroduction();
    fetchMainFinding();
  }, [reportId]);

  const infoIntroduction = introduction?.sections.find(
    (section) =>
      section.id.includes("introduccion") ||
      section.title.toLowerCase().includes("introducción") ||
      section.title.toLowerCase().includes("introduccion")
  );

  const infoMainFinding = mainFinding?.sections.find(
    (section) =>
      section.id.includes("hallazgos") ||
      section.title.toLowerCase().includes("hallazgos")
  );

  return (
    <section id="introduction" className="report-section">
      <div className="report-section-header">
        <span className="section-number">02</span>

        <div>
          <h2 className="section-title">
            {infoIntroduction?.title.replace(/^\d+\s+[—-]\s*/i, "")}
          </h2>

          <SectionContent
            content={
              infoIntroduction?.content ??
              "No se encontró el contenido de la introducción."
            }
          />

          {infoMainFinding && (
            <>
              <br />
              <h3 className="section-title">
                {infoMainFinding.title.replace(/^\d+\s+[—-]\s*/i, "")}
              </h3>
              <SectionContent
                content={
                  infoMainFinding.content ??
                  "No se encontró el contenido de los hallazgos principales."
                }
              />
            </>
          )}
        </div>
      </div>
    </section>
  );
}
