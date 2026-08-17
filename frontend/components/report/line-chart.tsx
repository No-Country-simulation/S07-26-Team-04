"use client";

import { getLineChart } from "@/services/report.service";
import { LineChart } from "@/types/line-chart";
import { useEffect, useState } from "react";
import {
  LineChart as RechartsLineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

interface TrendData {
  year: string;
  value: number;
}

// const trendData: TrendData[] = [
//   { year: "2020", value: 3.0 },
//   { year: "2021", value: 5.0 },
//   { year: "2022", value: 9.0 },
//   { year: "2023", value: 16.0 },
//   { year: "2024", value: 26.0 },
//   { year: "2025", value: 31.4 },
//   { year: "2026", value: 38.0 },
// ];

function CustomDot(props: { cx?: number; cy?: number; payload?: TrendData }) {
  const { cx, cy } = props;
  if (cx == null || cy == null) return null;
  return (
    <g>
      <circle
        cx={cx}
        cy={cy}
        r={7}
        fill="var(--gold)"
        stroke="var(--dark-forest)"
        strokeWidth={2}
      />
    </g>
  );
}

export function AccumulatedLineChart() {
  const [lineChart, setLineChart] = useState<LineChart | null>(null);

  useEffect(() => {
    async function fetchLinechart() {
      try {
        const data = await getLineChart();
        console.log("Fetch line chart data: ", data);
        setLineChart(data);
      } catch (error) {
        console.error("Error fetching line chart data:", error);
      }
    }

    fetchLinechart();
  }, []);

  if (!lineChart) {
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

  const { charts } = lineChart;

  const { figure2 } = charts;

  const { meta, xKey, series, data } = figure2;

  const dataKey = series[0]?.dataKey ?? "value";

  const valueSuffix = series[0]?.valueSuffix ?? "";

  return (
    <div className="chart-card">
      <div className="chart-card-header">
        <div>
          <span className="chart-label">GRÁFICO DE LÍNEA</span>
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
          <RechartsLineChart
            data={data}
            margin={{ top: 8, right: 0, left: -8, bottom: 0 }}
          >
            <CartesianGrid
              vertical={false}
              strokeDasharray="4 4"
              stroke="var(--outline-variant)"
              strokeOpacity={0.5}
            />
            <XAxis
              dataKey={xKey}
              tick={{ fontSize: 11, fill: "var(--on-surface-variant)" }}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              tick={{ fontSize: 11, fill: "var(--on-surface-variant)" }}
              tickLine={false}
              axisLine={false}
              tickFormatter={(v: number) => `${v}${valueSuffix}`}
              domain={[0, 40]}
              ticks={[0, 10, 20, 30, 40]}
            />
            <Line
              type="monotone"
              dataKey={dataKey}
              stroke="var(--gold)"
              strokeWidth={2.5}
              dot={<CustomDot />}
              activeDot={false}
            />
          </RechartsLineChart>
        </ResponsiveContainer>
      </div>

      <div className="chart-caption">
        Figura 3 — Capacidad varada acumulada como porcentaje de kilovatios
        energizados, muestrada anualmente 2020–2025. Fuente: Índice de Capacidad
        Varada de PhysaFlow, 2025.
      </div>
    </div>
  );
}
