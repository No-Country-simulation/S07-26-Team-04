"use client";

import React from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const defaultData = [
  { year: "2020", value: 3.0 },
  { year: "2021", value: 5.0 },
  { year: "2022", value: 9.0 },
  { year: "2023", value: 16.0 },
  { year: "2024", value: 26.0 },
  { year: "2025", value: 31.4 },
];

export interface CumulativeItem {
  year: string;
  value: number;
}

interface GraficoLineaAcumuladoProps {
  data?: CumulativeItem[];
  labels?: Record<string, string | undefined>;
  onShowToast?: (msg: string) => void;
}

export default function GraficoLineaAcumulado({
  data = defaultData,
  labels = {},
  onShowToast,
}: GraficoLineaAcumuladoProps) {
  const handleDownload = () => {
    if (onShowToast) {
      onShowToast("Figura 3 — Archivo SVG descargado con éxito. Se requiere atribución 'Source: PhysaFlow Stranded Capacity Index'.");
    }
  };

  const textLabels = {
    fig3: labels.fig3 || "Figura 3",
    fig3Title: labels.fig3Title || "Capacidad varada acumulada, 2020 – 2025 (% de kW energizados)",
    fig3Caption: labels.fig3Caption || "Figura 3 — Capacidad varada acumulada como porcentaje de kilovatios energizados, muestreada anualmente 2020–2025. Fuente: Índice de Capacidad Varada de PhysaFlow, 2025.",
    fig3Year: labels.fig3Year || "Año",
    fig3Waste: labels.fig3Waste || "Capacidad Varada:",
  };

  return (
    <figure className="mb-10 bg-[var(--paper-2)] border border-[var(--rule-soft)] p-6 lg:p-8 rounded-sm">
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="eyebrow mb-1">{textLabels.fig3}</div>
          <div className="font-display text-[16px] text-[var(--forest-800)]">
            {textLabels.fig3Title}
          </div>
        </div>
        <button
          onClick={handleDownload}
          className="text-[11px] font-medium text-[var(--forest-700)] hover:text-[var(--forest-800)] flex items-center gap-1.5 border border-[var(--rule)] px-2.5 py-1.5 rounded-sm transition bg-transparent hover:bg-[var(--paper)]"
        >
          <svg width="11" height="11" viewBox="0 0 16 16" fill="none">
            <path
              d="M8 1v10m0 0L4 7m4 4l4-4M2 13h12"
              stroke="currentColor"
              strokeWidth="1.4"
            />
          </svg>
          SVG
        </button>
      </div>

      <div className="w-full h-[280px] text-[11px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 20, right: 20, left: -20, bottom: 5 }}>
            <defs>
              <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#143a26" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#143a26" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#e7e1cf" vertical={false} />
            <XAxis
              dataKey="year"
              stroke="#8a8775"
              tickLine={false}
              axisLine={{ stroke: "#e7e1cf" }}
            />
            <YAxis
              stroke="#8a8775"
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `${value}%`}
            />
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="bg-[var(--paper)] border border-[var(--rule)] p-3 rounded-sm shadow-md text-[12px] leading-relaxed">
                      <div className="font-semibold text-[var(--forest-800)]">{textLabels.fig3Year} {payload[0].payload.year}</div>
                      <div className="mt-1 text-[var(--ink)]">
                        {textLabels.fig3Waste} <strong className="text-[var(--forest-700)]">{payload[0].payload.value}%</strong>
                      </div>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Area
              type="monotone"
              dataKey="value"
              stroke="#143a26"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorValue)"
              dot={{ stroke: "#143a26", strokeWidth: 1.5, fill: "#c9a961", r: 4 }}
              activeDot={{ stroke: "#c9a961", strokeWidth: 2, fill: "#143a26", r: 6 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <figcaption className="text-xs text-[var(--ink-muted)] mt-4 pt-2 border-t border-[var(--rule-soft)]">
        {textLabels.fig3Caption}
      </figcaption>
    </figure>
  );
}
