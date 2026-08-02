"use client";

import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

export interface PieChartItem {
  name: string;
  value: number;
  color?: string;
}

interface PieChartComponentProps {
  title?: string;
  caption?: string;
  data?: PieChartItem[];
  labels?: Record<string, string | undefined>;
  onShowToast?: (msg: string) => void;
}

const defaultData: PieChartItem[] = [
  { name: "Pérdida en Instalaciones", value: 14.8, color: "#143a26" },
  { name: "Pérdida en TI", value: 9.7, color: "#c9a961" },
  { name: "Pérdida en Carga de Trabajo", value: 6.9, color: "#2d5f47" },
];

const DEFAULT_COLORS = ["#143a26", "#c9a961", "#2d5f47", "#8a8775", "#0d2818"];

export default function PieChartComponent({
  title = "Distribución de pérdidas por capas físicas",
  caption = "Figura 4 — Proporción relativa de la capacidad varada por capa física del centro de datos.",
  data = defaultData,
}: PieChartComponentProps) {
  const chartData = data && data.length > 0 ? data : defaultData;

  return (
    <figure className="mb-10 bg-[var(--paper-2)] border border-[var(--rule-soft)] p-6 lg:p-8 rounded-sm">
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="eyebrow mb-1">Gráfico Circular</div>
          <div className="font-display text-[16px] text-[var(--forest-800)]">
            {title}
          </div>
        </div>
      </div>

      <div className="w-full h-[320px] text-[11px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={100}
              paddingAngle={5}
              dataKey="value"
            >
              {chartData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={entry.color || DEFAULT_COLORS[index % DEFAULT_COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const item = payload[0].payload as PieChartItem;
                  return (
                    <div className="bg-[var(--paper)] border border-[var(--rule)] p-3 rounded-sm shadow-md text-[12px]">
                      <div className="font-semibold text-[var(--forest-800)]">{item.name}</div>
                      <div className="mt-1 text-[var(--ink)]">
                        Proporción: <strong className="text-[var(--forest-700)]">{item.value}%</strong>
                      </div>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Legend verticalAlign="bottom" height={36} />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {caption && (
        <figcaption className="text-xs text-[var(--ink-muted)] mt-4 pt-2 border-t border-[var(--rule-soft)]">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}
