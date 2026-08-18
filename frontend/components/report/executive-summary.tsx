"use client";

import { useEffect, useState } from "react";
import type { ExecutiveSummary } from "@/types/executive-summary";
import { getExecutiveSummary } from "@/services/report.service";
import SectionContent from "./section-content";

function parseKpisFromContent(content: string): { mainText: string; kpis: { label: string; value: string }[] } {
  const kpis: { label: string; value: string }[] = [];
  const lines = content.split("\n");
  const mainTextLines: string[] = [];

  for (const line of lines) {
    const matchWithParen = line.match(/^\s*-\s*\*\*(.*?)\s*\(([^)]+)\)\*\*/);
    const matchWithColon = line.match(/^\s*-\s*\*\*(.*?):\*\*\s*(.*)/);

    if (matchWithParen) {
      kpis.push({
        label: matchWithParen[1].trim(),
        value: matchWithParen[2].trim(),
      });
    } else if (matchWithColon) {
      kpis.push({
        label: matchWithColon[1].trim(),
        value: matchWithColon[2].trim(),
      });
    } else {
      mainTextLines.push(line);
    }
  }

  return {
    mainText: mainTextLines.join("\n").trim(),
    kpis,
  };
}

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

  if (!infoSummary) {
    return null;
  }

  const { mainText, kpis } = parseKpisFromContent(infoSummary.content ?? "");

  return (
    <section id="resumen" className="report-section">
      <div className="w-full">
        <div className="flex items-baseline gap-3 mb-4 border-b border-[#c9a227]/20 pb-3">
          <span className="text-3xl sm:text-4xl font-serif font-bold text-[#c9a227]">
            01
          </span>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#f4f1e8]">
            {infoSummary?.title.replace(/^\d+\s+[—-]\s*/i, "")}
          </h2>
        </div>

        <SectionContent content={mainText || infoSummary.content} />

          {kpis.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
              {kpis.map((kpi, idx) => (
                <div
                  key={idx}
                  className="bg-[#0b3d2e]/80 border border-[#c9a227]/30 rounded-lg p-4 shadow-md flex flex-col justify-between transition-all hover:border-[#c9a227]/60"
                >
                  <span className="text-xs font-mono font-semibold uppercase tracking-wider text-[#a8b5ae]">
                    {kpi.label}
                  </span>
                  <span className="text-2xl font-serif font-bold text-[#ecc246] mt-2">
                    {kpi.value}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
    </section>
  );
}
