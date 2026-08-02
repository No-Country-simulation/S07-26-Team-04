"use client";

import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export interface LineChartItem {
  year?: string;
  name?: string;
  value: number;
}

interface LineChartComponentProps {
  title?: string;
  caption?: string;
  data?: LineChartItem[];
  labels?: Record<string, string | undefined>;
  onShowToast?: (msg: string) => void;
}

const defaultData: LineChartItem[] = [
  { year: "2020", value: 3.0 },
  { year: "2021", value: 5.0 },
  { year: "2022", value: 9.0 },
  { year: "2023", value: 16.0 },
  { year: "2024", value: 26.0 },
  { year: "2025", value: 31.4 },
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

export default function LineChartComponent({
  title = "Capacidad varada acumulada, 2020 – 2025 (% de kW energizados)",
  caption = "Figura 3 — Capacidad varada acumulada como porcentaje de kilovatios energizados, muestreada anualmente 2020–2025. Fuente: Índice de Capacidad Varada de PhysaFlow, 2025.",
  data = defaultData,
  onShowToast,
}: LineChartComponentProps) {
  const chartData = data && data.length > 0 ? data : defaultData;

  const handleDownload = () => {
    const container = document.getElementById("fig-line-chart-container");
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
        textEyebrow.textContent = "GRÁFICO DE LÍNEA";

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
          downloadLink.download = "chart-line-export.svg";
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
          <div className="eyebrow mb-1">Gráfico de Línea</div>
          <div className="font-display text-[16px] text-[var(--forest-800)]">
            {title}
          </div>
        </div>
        <button
          id="btn-download-fig3"
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

      <div id="fig-line-chart-container" className="w-full h-[320px] text-[11px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 20, right: 10, left: -20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e7e1cf" vertical={false} />
            <XAxis
              dataKey={(item) => item.year || item.name || ""}
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
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const item = payload[0].payload as LineChartItem;
                  return (
                    <div className="bg-[var(--paper)] border border-[var(--rule)] p-3 rounded-sm shadow-md text-[12px] leading-relaxed">
                      <div className="font-semibold text-[var(--forest-800)]">{item.year || item.name}</div>
                      <div className="mt-1 text-[var(--ink)]">
                        Valor: <strong className="text-[var(--forest-700)]">{item.value}%</strong>
                      </div>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Line
              type="monotone"
              dataKey="value"
              stroke="#c9a961"
              strokeWidth={3}
              dot={{ fill: "#0d2818", r: 5, strokeWidth: 2, stroke: "#c9a961" }}
              activeDot={{ r: 7, fill: "#c9a961", stroke: "#0d2818", strokeWidth: 2 }}
            />
          </LineChart>
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
