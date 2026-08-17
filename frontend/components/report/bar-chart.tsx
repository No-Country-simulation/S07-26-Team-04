"use client";

import { getBarChart } from "@/services/report.service";
import { BarChart } from "@/types/bar-chart";
import { useEffect, useState } from "react";
import {
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Cell,
} from "recharts";

export function FailureBarChart() {
  const [barChart, setBarChart] = useState<BarChart | null>(null);

  useEffect(() => {
    async function fetchBarchart() {
      try {
        const data = await getBarChart();
        setBarChart(data);
      } catch (error) {
        console.error("Error fetching bar chart data:", error);
      }
    }

    fetchBarchart();
  }, []);

  /*
   * Mientras la información está cargando
   */
  if (!barChart) {
    return (
      <div className="chart-card">
        <div className="chart-body flex items-center justify-center">
          <p className="text-body-md text-[var(--on-surface-variant)]">
            Cargando gráfico...
          </p>
        </div>
      </div>
    );
  }

  /*
   * Obtenemos la información directamente
   * desde metrics
   */
  const { metrics } = barChart;

  const { meta, xKey, series, data } = metrics;

  /*
   * La API nos dice qué propiedad usar
   * como valor de las barras.
   *
   * Actualmente:
   * dataKey = "value"
   */
  const dataKey = series[0]?.dataKey ?? "value";

  /*
   * Sufijo configurado por la API.
   *
   * Actualmente:
   * valueSuffix = "%"
   */
  const valueSuffix = series[0]?.valueSuffix ?? "";

  return (
    <div className="chart-card">
      {/* ==================================================
          HEADER
      ================================================== */}

      <div className="chart-card-header">
        <div>
          <span className="chart-label">GRÁFICO DE BARRAS</span>

          <h3 className="chart-title">
            {meta.title ?? "Título no disponible"}
          </h3>

          <p className="chart-description">
            {meta.description ?? "Descripción no disponible"}
          </p>
        </div>

        <button className="chart-export-btn" type="button">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="7 10 12 15 17 10" />
            <line x1="12" x2="12" y1="15" y2="3" />
          </svg>
          SVG
        </button>
      </div>

      <div className="chart-body">
        <ResponsiveContainer width="100%" height={360}>
          <RechartsBarChart
            data={data}
            margin={{
              top: 8,
              right: 0,
              left: -8,
              bottom: 24,
            }}
            barCategoryGap="20%"
          >
            <CartesianGrid
              vertical={false}
              strokeDasharray="4 4"
              stroke="var(--outline-variant)"
              strokeOpacity={0.5}
            />

            {/* X AXIS */}

            <XAxis
              dataKey={xKey}
              tick={{
                fontSize: 10,
                fill: "var(--on-surface-variant)",
              }}
              tickLine={false}
              axisLine={false}
              interval={0}
              angle={-35}
              textAnchor="end"
              height={60}
            />

            {/* Y AXIS */}

            <YAxis
              tick={{
                fontSize: 11,
                fill: "var(--on-surface-variant)",
              }}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value: number) => `${value}${valueSuffix}`}
              domain={[0, 8]}
              ticks={[0, 2, 4, 6, 8]}
            />

            {/* BARS */}

            <Bar dataKey={dataKey} radius={[0, 0, 0, 0]} maxBarSize={48}>
              {data.map((entry) => (
                <Cell key={entry.name} fill="var(--gold)" />
              ))}
            </Bar>
          </RechartsBarChart>
        </ResponsiveContainer>
      </div>

      <div className="chart-caption">
        Figura 2 — {meta.title}. {meta.description}
      </div>
    </div>
  );
}
