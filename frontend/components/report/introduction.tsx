"use client";

import { getIntroduction, getMainFindings } from "@/services/report.service";
import type { Introduction } from "@/types/introduction";
import { useEffect, useState } from "react";
import SectionContent from "./section-content";
import { MainFindings } from "@/types/main-findings";

export function Introduction() {
  const [introduction, setIntroduction] = useState<Introduction | null>(null);
  const [mainFinding, setMainFinding] = useState<MainFindings | null>(null);

  useEffect(() => {
    async function fetchIntroduction() {
      try {
        const data = await getIntroduction();
        setIntroduction(data);
      } catch (error) {
        console.error("Error fetching introduction data:", error);
      }
    }

    async function fetchMainFinding() {
      try {
        const data = await getMainFindings();
        setMainFinding(data);
      } catch (error) {
        console.error("Error fetching main finding data:", error);
      }
    }

    fetchIntroduction();
    fetchMainFinding();
  }, []);

  const infoIntroduction = introduction?.sections.find(
    (section) => section.id === "02-introduccion",
  );

  if (!infoIntroduction) {
    return null;
  }

  const infoMainFinding = mainFinding?.sections.find(
    (section) => section.id === "03-hallazgos-principales",
  );

  if (!infoMainFinding) {
    return null;
  }

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

          <br />

          <h3 className="section-title">
            {infoMainFinding.title.replace(/^\d+\s+[—-]\s*/i, "")}
          </h3>

          <SectionContent
            content={
              infoMainFinding.content ??
              "No se encontró el contenido de la introducción."
            }
          />
        </div>
      </div>
    </section>
  );
}
