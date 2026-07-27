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
  lang?: string;
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

export default function GraficoLineaAcumulado({
  data = defaultData,
  lang = "ES",
  labels = {},
  onShowToast,
}: GraficoLineaAcumuladoProps) {
  const handleDownload = () => {
    const container = document.getElementById("fig-area-chart-container");
    if (container) {
      const svgEl = container.querySelector("svg");
      if (svgEl) {
        // Clone the SVG element
        const clonedSvg = svgEl.cloneNode(true) as SVGElement;
        
        // 1. Get current width and height attributes
        const origWidthStr = clonedSvg.getAttribute("width") || "800";
        const origHeightStr = clonedSvg.getAttribute("height") || "280";
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
          .svg-caption { font-family: sans-serif; font-size: 9px; fill: #8a8775; }
        `;
        clonedSvg.insertBefore(style, clonedSvg.firstChild);

        // 6. Create and append the title text elements
        const textEyebrow = document.createElementNS("http://www.w3.org/2000/svg", "text");
        textEyebrow.setAttribute("x", "10");
        textEyebrow.setAttribute("y", "20");
        textEyebrow.setAttribute("class", "svg-eyebrow");
        textEyebrow.textContent = textLabels.fig3;

        const textTitle = document.createElementNS("http://www.w3.org/2000/svg", "text");
        textTitle.setAttribute("x", "10");
        textTitle.setAttribute("y", "40");
        textTitle.setAttribute("class", "svg-title");
        textTitle.textContent = textLabels.fig3Title;

        clonedSvg.appendChild(textEyebrow);
        clonedSvg.appendChild(textTitle);

        // 7. Create and append the caption text element at the bottom with line wrap
        const textCaption = document.createElementNS("http://www.w3.org/2000/svg", "text");
        textCaption.setAttribute("x", "10");
        textCaption.setAttribute("y", (origHeight + topPadding + 22).toString());
        textCaption.setAttribute("class", "svg-caption");

        const captionLines = wrapSvgText(textLabels.fig3Caption, 115);
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
          downloadLink.download = `physaflow-stranded-capacity-trend-${lang.toLowerCase()}.svg`;
          document.body.appendChild(downloadLink);
          downloadLink.click();
          document.body.removeChild(downloadLink);
          URL.revokeObjectURL(svgUrl);

          if (onShowToast) {
            onShowToast(
              lang === "EN"
                ? "Figure 3 SVG exported with title and wrapped caption."
                : "Figura 3 SVG exportada con título y pie de página multilínea."
            );
          }
        } catch (err) {
          console.error("Failed to generate SVG download", err);
        }
      }
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
    <figure id="fig-area-chart-figure" className="mb-10 bg-[var(--paper-2)] border border-[var(--rule-soft)] p-6 lg:p-8 rounded-sm">
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

      <div id="fig-area-chart-container" className="w-full h-[280px] text-[11px]">
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
