"use client";

import { useEffect, useState } from "react";
import { getReportData } from "@/services/report.service";
import { FailureBarChart } from "./bar-chart";
import { AccumulatedLineChart } from "./line-chart";
import { LayerPieChart } from "./pie-chart";

type ChartType = "bar" | "pie" | "line";

export function FigurasSection() {
  const [chartOrder, setChartOrder] = useState<ChartType[]>(["bar", "pie", "line"]);

  useEffect(() => {
    async function determineOrder() {
      try {
        const report = await getReportData();
        if (report) {
          const detectedOrder: ChartType[] = [];
          if (report.mdxContent) {
            const regex = /"chartType"\s*:\s*"(bar|pie|line)"/g;
            let match;
            while ((match = regex.exec(report.mdxContent)) !== null) {
              const type = match[1] as ChartType;
              if (!detectedOrder.includes(type)) {
                detectedOrder.push(type);
              }
            }
          }

          // Asegurar inclusión en el orden de cualquier gráfico que contenga datos
          if (!detectedOrder.includes("bar") && report.metrics?.data?.length) {
            detectedOrder.push("bar");
          }
          if (!detectedOrder.includes("pie") && report.metrics?.pueContext?.data?.length) {
            detectedOrder.push("pie");
          }
          if (!detectedOrder.includes("line") && report.charts?.figure2?.data?.length) {
            detectedOrder.push("line");
          }

          if (detectedOrder.length > 0) {
            setChartOrder(detectedOrder);
          }
        }
      } catch (err) {
        console.error("Error al determinar orden de gráficos:", err);
      }
    }

    determineOrder();
  }, []);

  const renderChart = (type: ChartType) => {
    switch (type) {
      case "bar":
        return <FailureBarChart key="chart-bar" />;
      case "pie":
        return <LayerPieChart key="chart-pie" />;
      case "line":
        return <AccumulatedLineChart key="chart-line" />;
      default:
        return null;
    }
  };

  return (
    <section id="figures" className="report-section">
      <div className="report-section-header">
        <span className="section-number">05</span>

        <div>
          <h2 className="section-title">Figuras</h2>

          <p className="section-description">
            Visualización cuantitativa de los hallazgos principales del índice
            de capacidad varada.
          </p>
        </div>
      </div>

      <div className="chart-grid mt-12 space-y-10">
        {chartOrder.map((type) => renderChart(type))}
      </div>
    </section>
  );
}
