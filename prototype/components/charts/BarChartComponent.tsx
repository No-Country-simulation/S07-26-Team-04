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

export interface BarChartItem {
  name: string;
  label?: string;
  value: number;
  layer?: string;
  color?: string;
}

interface BarChartComponentProps {
  title?: string;
  caption?: string;
  data?: BarChartItem[];
  labels?: Record<string, string | undefined>;
  onShowToast?: (msg: string) => void;
}

const defaultData: BarChartItem[] = [
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

function wrapSvgText(text: string, maxCharsPerLine: number = 115): string[] {
  const words = text.split(" ");
  const lines: string[] = [];
  let currentLine = "";

  words.forEach((word) => {
    if ((currentLine + " " + word).trim().length <= maxCharsPerLine) {
      currentLine = (currentLine + " " + word).trim();
    } else {
      if (currentLine) lines.push(currentLine);
      currentLine = word;
    }
  });
  if (currentLine) {
    lines.push(currentLine);
  }
  return lines;
}

export default function BarChartComponent({
  title = "Capacidad varada por modo de fallo con nombre (% de kW energizados)",
  caption = "Figura 2 — Capacidad varada mediana por modo de fallo con nombre. Muestra n=41 sitios. Fuente: Índice de Capacidad Varada de PhysaFlow, 2025.",
  data = defaultData,
  onShowToast,
}: BarChartComponentProps) {
  const chartData = data && data.length > 0 ? data : defaultData;

  const handleDownload = () => {
    const container = document.getElementById("fig-bar-chart-container");
    if (container) {
      const svgEl = container.querySelector("svg");
      if (svgEl) {
        const clonedSvg = svgEl.cloneNode(true) as SVGElement;
        
        const origWidthStr = clonedSvg.getAttribute("width") || "800";
        const origHeightStr = clonedSvg.getAttribute("height") || "320";
        const origWidth = parseInt(origWidthStr, 10);
        const origHeight = parseInt(origHeightStr, 10);

        const topPadding = 60;
        const bottomPadding = 60;
        const newHeight = origHeight + topPadding + bottomPadding;

        clonedSvg.setAttribute("height", newHeight.toString());
        clonedSvg.setAttribute("viewBox", `0 0 ${origWidth} ${newHeight}`);
        clonedSvg.setAttribute("xmlns", "http://www.w3.org/2000/svg");

        const gWrapper = document.createElementNS("http://www.w3.org/2000/svg", "g");
        gWrapper.setAttribute("transform", `translate(0, ${topPadding})`);
        
        while (clonedSvg.firstChild) {
          gWrapper.appendChild(clonedSvg.firstChild);
        }
        clonedSvg.appendChild(gWrapper);

        const style = document.createElementNS("http://www.w3.org/2000/svg", "style");
        style.textContent = `
          text { font-family: sans-serif; font-size: 11px; fill: #8a8775; }
          .recharts-cartesian-grid-horizontal line { stroke: #e7e1cf; stroke-dasharray: 3 3; }
          .svg-eyebrow { font-family: sans-serif; font-size: 10px; font-weight: bold; fill: #8a8775; letter-spacing: 0.12em; text-transform: uppercase; }
          .svg-title { font-family: Georgia, serif; font-size: 15px; font-weight: 500; fill: #0d2818; }
          .svg-caption { font-family: sans-serif; font-size: 9px; fill: #8a8775; }
        `;
        clonedSvg.insertBefore(style, clonedSvg.firstChild);

        const textEyebrow = document.createElementNS("http://www.w3.org/2000/svg", "text");
        textEyebrow.setAttribute("x", "10");
        textEyebrow.setAttribute("y", "20");
        textEyebrow.setAttribute("class", "svg-eyebrow");
        textEyebrow.textContent = "GRÁFICO DE BARRAS";

        const textTitle = document.createElementNS("http://www.w3.org/2000/svg", "text");
        textTitle.setAttribute("x", "10");
        textTitle.setAttribute("y", "40");
        textTitle.setAttribute("class", "svg-title");
        textTitle.textContent = title;

        clonedSvg.appendChild(textEyebrow);
        clonedSvg.appendChild(textTitle);

        const textCaption = document.createElementNS("http://www.w3.org/2000/svg", "text");
        textCaption.setAttribute("x", "10");
        textCaption.setAttribute("y", (origHeight + topPadding + 30).toString());
        textCaption.setAttribute("class", "svg-caption");

        const captionLines = wrapSvgText(caption, 115);
        captionLines.forEach((line, index) => {
          const tspan = document.createElementNS("http://www.w3.org/2000/svg", "tspan");
          tspan.setAttribute("x", "10");
          tspan.setAttribute("dy", index === 0 ? "0" : "13");
          tspan.textContent = line;
          textCaption.appendChild(tspan);
        });

        clonedSvg.appendChild(textCaption);

        try {
          const serializer = new XMLSerializer();
          const svgString = serializer.serializeToString(clonedSvg);
          const svgBlob = new Blob([svgString], { type: "image/svg+xml;charset=utf-8" });
          const svgUrl = URL.createObjectURL(svgBlob);
          
          const downloadLink = document.createElement("a");
          downloadLink.href = svgUrl;
          downloadLink.download = "chart-bar-export.svg";
          document.body.appendChild(downloadLink);
          downloadLink.click();
          document.body.removeChild(downloadLink);
          URL.revokeObjectURL(svgUrl);

          if (onShowToast) {
            onShowToast("Gráfico SVG exportado exitosamente.");
          }
        } catch (err) {
          console.error("Failed to generate SVG download", err);
        }
      }
    }
  };

  return (
    <figure className="mb-10 bg-[var(--paper-2)] border border-[var(--rule-soft)] p-6 lg:p-8 rounded-sm">
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="eyebrow mb-1">Gráfico de Barras</div>
          <div className="font-display text-[16px] text-[var(--forest-800)]">
            {title}
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
          <BarChart data={chartData} margin={{ top: 20, right: 10, left: -20, bottom: 5 }}>
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
              tickFormatter={(val) => `${val}%`}
            />
            <Tooltip
              cursor={{ fill: "rgba(201, 169, 97, 0.05)" }}
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const item = payload[0].payload as BarChartItem;
                  return (
                    <div className="bg-[var(--paper)] border border-[var(--rule)] p-3 rounded-sm shadow-md text-[12px] leading-relaxed">
                      <div className="font-semibold text-[var(--forest-800)]">{item.label || item.name}</div>
                      {item.layer && <div className="text-[var(--ink-soft)] font-mono text-[10px] uppercase tracking-wider">{item.layer}</div>}
                      <div className="mt-1 text-[var(--ink)]">
                        Valor: <strong className="text-[var(--forest-700)]">{item.value}%</strong>
                      </div>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Bar dataKey="value" radius={[2, 2, 0, 0]}>
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color || "#143a26"} />
              ))}
            </Bar>
          </BarChart>
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
