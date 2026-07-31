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
  labels?: Record<string, string | undefined>;
  onShowToast?: (msg: string) => void;
}

// Utility to wrap SVG text into lines
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

export default function GraficoBarrasDesperdicio({
  data = defaultData,
  labels = {},
  onShowToast,
}: GraficoBarrasDesperdicioProps) {
  const handleDownload = () => {
    const container = document.getElementById("fig-bar-chart-container");
    if (container) {
      const svgEl = container.querySelector("svg");
      if (svgEl) {
        // Clone the SVG element
        const clonedSvg = svgEl.cloneNode(true) as SVGElement;
        
        // 1. Get current width and height attributes
        const origWidthStr = clonedSvg.getAttribute("width") || "800";
        const origHeightStr = clonedSvg.getAttribute("height") || "320";
        const origWidth = parseInt(origWidthStr, 10);
        const origHeight = parseInt(origHeightStr, 10);

        // 2. Define paddings for top and bottom metadata info
        const topPadding = 60;
        const bottomPadding = 60; // Increased to fit wrapped caption
        const newHeight = origHeight + topPadding + bottomPadding;

        // 3. Set the new height and viewbox attributes on the root SVG
        clonedSvg.setAttribute("height", newHeight.toString());
        clonedSvg.setAttribute("viewBox", `0 0 ${origWidth} ${newHeight}`);
        clonedSvg.setAttribute("xmlns", "http://www.w3.org/2000/svg");

        // 4. Wrap the existing children in a group shifted down by the top padding
        const gWrapper = document.createElementNS("http://www.w3.org/2000/svg", "g");
        gWrapper.setAttribute("transform", `translate(0, ${topPadding})`);
        
        while (clonedSvg.firstChild) {
          gWrapper.appendChild(clonedSvg.firstChild);
        }
        clonedSvg.appendChild(gWrapper);

        // 5. Add styling elements
        const style = document.createElementNS("http://www.w3.org/2000/svg", "style");
        style.textContent = `
          text { font-family: sans-serif; font-size: 11px; fill: #8a8775; }
          .recharts-cartesian-grid-horizontal line { stroke: #e7e1cf; stroke-dasharray: 3 3; }
          .svg-eyebrow { font-family: sans-serif; font-size: 10px; font-weight: bold; fill: #8a8775; letter-spacing: 0.12em; text-transform: uppercase; }
          .svg-title { font-family: Georgia, serif; font-size: 15px; font-weight: 500; fill: #0d2818; }
          .svg-legend-text { font-family: sans-serif; font-size: 9px; font-weight: bold; fill: #2d2b25; letter-spacing: 0.08em; }
          .svg-caption { font-family: sans-serif; font-size: 9px; fill: #8a8775; }
        `;
        clonedSvg.insertBefore(style, clonedSvg.firstChild);

        // 6. Create and append the title text elements
        const textEyebrow = document.createElementNS("http://www.w3.org/2000/svg", "text");
        textEyebrow.setAttribute("x", "10");
        textEyebrow.setAttribute("y", "20");
        textEyebrow.setAttribute("class", "svg-eyebrow");
        textEyebrow.textContent = textLabels.fig2;

        const textTitle = document.createElementNS("http://www.w3.org/2000/svg", "text");
        textTitle.setAttribute("x", "10");
        textTitle.setAttribute("y", "40");
        textTitle.setAttribute("class", "svg-title");
        textTitle.textContent = textLabels.fig2Title;

        clonedSvg.appendChild(textEyebrow);
        clonedSvg.appendChild(textTitle);

        // 7. Create and append the Legend Group
        const legendGroup = document.createElementNS("http://www.w3.org/2000/svg", "g");
        legendGroup.setAttribute("transform", `translate(10, ${origHeight + topPadding + 15})`);

        // Legend Item 1: L1
        const rect1 = document.createElementNS("http://www.w3.org/2000/svg", "rect");
        rect1.setAttribute("width", "10");
        rect1.setAttribute("height", "10");
        rect1.setAttribute("rx", "2");
        rect1.setAttribute("fill", "#143a26");
        const label1 = document.createElementNS("http://www.w3.org/2000/svg", "text");
        label1.setAttribute("x", "16");
        label1.setAttribute("y", "9");
        label1.setAttribute("class", "svg-legend-text");
        label1.textContent = textLabels.fig2L1;
        legendGroup.appendChild(rect1);
        legendGroup.appendChild(label1);

        // Legend Item 2: L2
        const rect2 = document.createElementNS("http://www.w3.org/2000/svg", "rect");
        rect2.setAttribute("x", "180");
        rect2.setAttribute("width", "10");
        rect2.setAttribute("height", "10");
        rect2.setAttribute("rx", "2");
        rect2.setAttribute("fill", "#c9a961");
        const label2 = document.createElementNS("http://www.w3.org/2000/svg", "text");
        label2.setAttribute("x", "196");
        label2.setAttribute("y", "9");
        label2.setAttribute("class", "svg-legend-text");
        label2.textContent = textLabels.fig2L2;
        legendGroup.appendChild(rect2);
        legendGroup.appendChild(label2);

        // Legend Item 3: L3
        const rect3 = document.createElementNS("http://www.w3.org/2000/svg", "rect");
        rect3.setAttribute("x", "330");
        rect3.setAttribute("width", "10");
        rect3.setAttribute("height", "10");
        rect3.setAttribute("rx", "2");
        rect3.setAttribute("fill", "#2d5f47");
        const label3 = document.createElementNS("http://www.w3.org/2000/svg", "text");
        label3.setAttribute("x", "346");
        label3.setAttribute("y", "9");
        label3.setAttribute("class", "svg-legend-text");
        label3.textContent = textLabels.fig2L3;
        legendGroup.appendChild(rect3);
        legendGroup.appendChild(label3);

        clonedSvg.appendChild(legendGroup);

        // 8. Create and append the caption text element at the very bottom with line wrap
        const textCaption = document.createElementNS("http://www.w3.org/2000/svg", "text");
        textCaption.setAttribute("x", "10");
        textCaption.setAttribute("y", (origHeight + topPadding + 42).toString());
        textCaption.setAttribute("class", "svg-caption");

        const captionLines = wrapSvgText(textLabels.fig2Caption, 115);
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
          downloadLink.download = "physaflow-stranded-capacity-modes.svg";
          document.body.appendChild(downloadLink);
          downloadLink.click();
          document.body.removeChild(downloadLink);
          URL.revokeObjectURL(svgUrl);

          if (onShowToast) {
            onShowToast("Figura 2 SVG exportada con título, leyenda y pie de página multilínea.");
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

  const chartData = (data && data.length > 0) ? data : defaultData;

  return (
    <figure id="fig-bar-chart-figure" className="mb-10 bg-[var(--paper-2)] border border-[var(--rule-soft)] p-6 lg:p-8 rounded-sm">
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="eyebrow mb-1">{textLabels.fig2}</div>
          <div className="font-display text-[16px] text-[var(--forest-800)]">
            {textLabels.fig2Title}
          </div>
        </div>
        <button
          id="btn-download-fig2"
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
          <span className="w-2.5 h-2.5 bg-[#143a26] rounded-sm" style={{ backgroundColor: "#143a26" }}></span>
          {textLabels.fig2L1}
        </div>
        <div className="flex items-center gap-2 text-[#8a6f2e]">
          <span className="w-2.5 h-2.5 bg-[#c9a961] rounded-sm" style={{ backgroundColor: "#c9a961" }}></span>
          {textLabels.fig2L2}
        </div>
        <div className="flex items-center gap-2 text-[#2d5f47]">
          <span className="w-2.5 h-2.5 bg-[#2d5f47] rounded-sm" style={{ backgroundColor: "#2d5f47" }}></span>
          {textLabels.fig2L3}
        </div>
      </div>

      <figcaption className="text-xs text-[var(--ink-muted)] mt-4 pt-2 border-t border-[var(--rule-soft)]">
        {textLabels.fig2Caption}
      </figcaption>
    </figure>
  );
}
