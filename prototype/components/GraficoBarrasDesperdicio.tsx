"use client";

import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

const defaultData = [
  { name: "Deriva pasillo", label: "Deriva del pasillo frío", value: 4.2, layer: "L1 - Instalaciones", color: "#143a26" },
  { name: "Sobresusc. térmica", label: "Sobresuscripción térmica", value: 6.1, layer: "L1 - Instalaciones", color: "#143a26" },
  { name: "Aprov. sombra", label: "Aprovisionamiento en sombra", value: 4.5, layer: "L1 - Instalaciones", color: "#143a26" },
  { name: "Racks comatosos", label: "Racks comatosos", value: 3.8, layer: "L2 - TI", color: "#c9a961" },
  { name: "Nodos durmientes", label: "Nodos durmientes", value: 2.9, layer: "L2 - TI", color: "#c9a961" },
  { name: "Bloqueo topo.", label: "Bloqueo de topología", value: 3.0, layer: "L2 - TI", color: "#c9a961" },
  { name: "Asig. huérfanas", label: "Asignaciones huérfanas", value: 3.1, layer: "L3 - Carga de trabajo", color: "#2d5f47" },
  { name: "Inanición afin.", label: "Inanición por afinidad", value: 2.2, layer: "L3 - Carga de trabajo", color: "#2d5f47" },
  { name: "Latencia marea", label: "Latencia de marea", value: 1.6, layer: "L3 - Carga de trabajo", color: "#2d5f47" },
];

export interface DesperdicioItem {
  name: string;
  label: string;
  value: number;
  layer: string;
  color: string;
}

interface GraficoBarrasDesperdicioProps {
  data?: DesperdicioItem[];
  lang?: string;
  labels?: Record<string, string | undefined>;
  onShowToast?: (msg: string) => void;
}

export default function GraficoBarrasDesperdicio({
  data = defaultData,
  lang = "ES",
  labels = {},
  onShowToast,
}: GraficoBarrasDesperdicioProps) {
  const handleDownload = () => {
    const container = document.getElementById("fig-bar-chart-container");
    if (container) {
      const svgEl = container.querySelector("svg");
      if (svgEl) {
        // Clone the SVG element to avoid modifying the active DOM representation
        const clonedSvg = svgEl.cloneNode(true) as SVGElement;
        
        // Ensure XML schema is present
        clonedSvg.setAttribute("xmlns", "http://www.w3.org/2000/svg");
        
        // Add styling elements so styles compile in raw format
        const style = document.createElement("style");
        style.textContent = `
          text { font-family: sans-serif; font-size: 11px; fill: #8a8775; }
          .recharts-cartesian-grid-horizontal line { stroke: #e7e1cf; stroke-dasharray: 3 3; }
        `;
        clonedSvg.insertBefore(style, clonedSvg.firstChild);

        try {
          const serializer = new XMLSerializer();
          const svgString = serializer.serializeToString(clonedSvg);
          const svgBlob = new Blob([svgString], { type: "image/svg+xml;charset=utf-8" });
          const svgUrl = URL.createObjectURL(svgBlob);
          
          const downloadLink = document.createElement("a");
          downloadLink.href = svgUrl;
          downloadLink.download = `physaflow-stranded-capacity-modes-${lang.toLowerCase()}.svg`;
          document.body.appendChild(downloadLink);
          downloadLink.click();
          document.body.removeChild(downloadLink);
          URL.revokeObjectURL(svgUrl);

          if (onShowToast) {
            onShowToast(
              lang === "EN"
                ? "Figure 2 SVG exported. Attribution required: 'Source: PhysaFlow Stranded Capacity Index'."
                : "Figura 2 SVG exportada. Requiere atribución: 'Fuente: Índice de Capacidad Varada de PhysaFlow'."
            );
          }
        } catch (err) {
          console.error("Failed to generate SVG download", err);
        }
      }
    }
  };

  const textLabels = {
    fig2: labels.fig2 || "Figura 2",
    fig2Title: labels.fig2Title || "Capacidad varada por modo de fallo con nombre (% de kW energizados)",
    fig2Caption: labels.fig2Caption || "Figura 2 — Capacidad varada mediana por modo de fallo con nombre. Muestra n=41 sitios. Fuente: Índice de Capacidad Varada de PhysaFlow, 2025.",
    fig2L1: labels.fig2L1 || "INSTALACIONES (L1)",
    fig2L2: labels.fig2L2 || "TI (L2)",
    fig2L3: labels.fig2L3 || "CARGA DE TRABAJO (L3)",
    fig2Waste: labels.fig2Waste || "Desperdicio:",
  };

  return (
    <figure className="mb-10 bg-[var(--paper-2)] border border-[var(--rule-soft)] p-6 lg:p-8 rounded-sm">
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="eyebrow mb-1">{textLabels.fig2}</div>
          <div className="font-display text-[16px] text-[var(--forest-800)]">
            {textLabels.fig2Title}
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

      <div id="fig-bar-chart-container" className="w-full h-[320px] text-[11px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 20, right: 10, left: -20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e7e1cf" vertical={false} />
            <XAxis
              dataKey="name"
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
              cursor={{ fill: "rgba(201, 169, 97, 0.05)" }}
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const item = payload[0].payload;
                  return (
                    <div className="bg-[var(--paper)] border border-[var(--rule)] p-3 rounded-sm shadow-md text-[12px] leading-relaxed">
                      <div className="font-semibold text-[var(--forest-800)]">{item.label}</div>
                      <div className="text-[var(--ink-soft)] font-mono text-[10px] uppercase tracking-wider">{item.layer}</div>
                      <div className="mt-1 text-[var(--ink)]">
                        {textLabels.fig2Waste} <strong className="text-[var(--forest-700)]">{item.value}%</strong>
                      </div>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Bar dataKey="value" radius={[2, 2, 0, 0]}>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Layer Labels */}
      <div className="mt-4 flex flex-wrap justify-center gap-x-8 gap-y-2 pt-4 border-t border-[var(--rule-soft)] text-[10px] font-semibold tracking-wider">
        <div className="flex items-center gap-2 text-[#143a26]">
          <span className="w-2.5 h-2.5 bg-[#143a26] rounded-sm"></span>
          {textLabels.fig2L1}
        </div>
        <div className="flex items-center gap-2 text-[#8a6f2e]">
          <span className="w-2.5 h-2.5 bg-[#c9a961] rounded-sm"></span>
          {textLabels.fig2L2}
        </div>
        <div className="flex items-center gap-2 text-[#2d5f47]">
          <span className="w-2.5 h-2.5 bg-[#2d5f47] rounded-sm"></span>
          {textLabels.fig2L3}
        </div>
      </div>

      <figcaption className="text-xs text-[var(--ink-muted)] mt-4 pt-2 border-t border-[var(--rule-soft)]">
        {textLabels.fig2Caption}
      </figcaption>
    </figure>
  );
}
