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
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface TrendData {
  year: string;
  value: number;
}

function wrapSvgText(text: string, maxCharsPerLine: number = 110): string[] {
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

function CustomDot(props: { cx?: number; cy?: number; payload?: TrendData }) {
  const { cx, cy } = props;
  if (cx == null || cy == null) return null;
  return (
    <g>
      <circle
        cx={cx}
        cy={cy}
        r={5}
        fill="#062a20"
        stroke="#c9a227"
        strokeWidth={2.5}
        className="hover:r-7 transition-all cursor-pointer"
      />
    </g>
  );
}

export function AccumulatedLineChart({ reportId }: { reportId?: string } = {}) {
  const [lineChart, setLineChart] = useState<LineChart | null>(null);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  useEffect(() => {
    async function fetchLineChart() {
      try {
        const data = await getLineChart(reportId);
        setLineChart(data);
      } catch (error) {
        console.error("Error fetching line chart data:", error);
      }
    }

    fetchLineChart();
  }, [reportId]);

  if (!lineChart) {
    return (
      <div className="chart-card border border-[#c9a227]/30 bg-[var(--forest-green-content)] p-6 rounded-sm min-h-[250px] flex items-center justify-center">
        <p className="text-sm text-[#a8b5ae]">
          Cargando gráfico...
        </p>
      </div>
    );
  }

  const { charts } = lineChart;
  const figure2 = charts?.figure2;

  if (!figure2 || !figure2.data || !Array.isArray(figure2.data) || figure2.data.length === 0) {
    return null;
  }

  const { meta, xKey, series, data } = figure2;
  const dataKey = series?.[0]?.dataKey ?? "value";
  const valueSuffix = series?.[0]?.valueSuffix ?? "%";

  const handleDownload = () => {
    const container = document.getElementById("fig-line-chart-container");
    if (container) {
      const svgs = Array.from(container.querySelectorAll("svg"));
      const svgEl =
        svgs.find((s) => s.getBoundingClientRect().width > 100) || svgs[0];

      if (svgEl) {
        const bbox = svgEl.getBoundingClientRect();
        const origWidth = Math.round(bbox.width) || 800;
        const origHeight = Math.round(bbox.height) || 360;

        const topPadding = 60;
        const bottomPadding = 65;
        const totalHeight = origHeight + topPadding + bottomPadding;

        // Clone the Recharts SVG
        const clonedSvg = svgEl.cloneNode(true) as SVGElement;
        clonedSvg.setAttribute("width", origWidth.toString());
        clonedSvg.setAttribute("height", totalHeight.toString());
        clonedSvg.setAttribute("viewBox", `0 0 ${origWidth} ${totalHeight}`);
        clonedSvg.setAttribute("xmlns", "http://www.w3.org/2000/svg");

        // Separate <defs> from graphic children so <clipPath> is not shifted by transform
        const defs = clonedSvg.querySelector("defs");
        const childrenToWrap: Node[] = [];

        Array.from(clonedSvg.childNodes).forEach((child) => {
          if (child.nodeName.toLowerCase() !== "defs") {
            childrenToWrap.push(child);
          }
        });

        // Create graphic wrapper transformed by topPadding
        const gWrapper = document.createElementNS(
          "http://www.w3.org/2000/svg",
          "g"
        );
        gWrapper.setAttribute("transform", `translate(0, ${topPadding})`);

        childrenToWrap.forEach((child) => {
          gWrapper.appendChild(child);
        });

        // Clear clonedSvg except <defs>
        clonedSvg.innerHTML = "";
        if (defs) {
          clonedSvg.appendChild(defs);
        }

        // 1. Background Rect
        const bgRect = document.createElementNS(
          "http://www.w3.org/2000/svg",
          "rect"
        );
        bgRect.setAttribute("width", "100%");
        bgRect.setAttribute("height", "100%");
        bgRect.setAttribute("fill", "#124132");
        clonedSvg.insertBefore(bgRect, clonedSvg.firstChild);

        // 2. Embedded Styles
        const style = document.createElementNS(
          "http://www.w3.org/2000/svg",
          "style"
        );
        style.textContent = `
          text { font-family: system-ui, -apple-system, sans-serif; font-size: 11px; fill: #e5e2da !important; }
          .recharts-text { fill: #e5e2da !important; }
          .recharts-cartesian-grid-horizontal line, .recharts-cartesian-grid-vertical line { stroke: rgba(168, 181, 174, 0.25) !important; }
          .svg-eyebrow { font-size: 10px; font-weight: bold; fill: #ecc246 !important; letter-spacing: 0.12em; text-transform: uppercase; }
          .svg-title { font-family: Georgia, serif; font-size: 16px; font-weight: 600; fill: #ffffff !important; }
          .svg-caption { font-size: 10px; fill: #c0c8c3 !important; }
        `;
        clonedSvg.appendChild(style);

        // 3. Header Titles
        const textEyebrow = document.createElementNS(
          "http://www.w3.org/2000/svg",
          "text"
        );
        textEyebrow.setAttribute("x", "20");
        textEyebrow.setAttribute("y", "24");
        textEyebrow.setAttribute("class", "svg-eyebrow");
        textEyebrow.textContent = "GRÁFICO DE LÍNEA";
        clonedSvg.appendChild(textEyebrow);

        const textTitle = document.createElementNS(
          "http://www.w3.org/2000/svg",
          "text"
        );
        textTitle.setAttribute("x", "20");
        textTitle.setAttribute("y", "46");
        textTitle.setAttribute("class", "svg-title");
        textTitle.textContent = meta.title || "Gráfico de Línea";
        clonedSvg.appendChild(textTitle);

        // 4. Append transformed graphic wrapper
        clonedSvg.appendChild(gWrapper);

        // 5. Footer Caption
        const textCaption = document.createElementNS(
          "http://www.w3.org/2000/svg",
          "text"
        );
        textCaption.setAttribute("x", "20");
        textCaption.setAttribute(
          "y",
          (origHeight + topPadding + 28).toString()
        );
        textCaption.setAttribute("class", "svg-caption");

        const captionStr = `Figura 3 — ${meta.title || "Capacidad varada acumulada"}. ${meta.description || ""}`;
        const captionLines = wrapSvgText(captionStr, 110);
        captionLines.forEach((line, index) => {
          const tspan = document.createElementNS(
            "http://www.w3.org/2000/svg",
            "tspan"
          );
          tspan.setAttribute("x", "20");
          tspan.setAttribute("dy", index === 0 ? "0" : "14");
          tspan.textContent = line;
          textCaption.appendChild(tspan);
        });
        clonedSvg.appendChild(textCaption);

        try {
          const serializer = new XMLSerializer();
          let svgString = serializer.serializeToString(clonedSvg);

          // Replace residual CSS variables with explicit hex colors for standalone viewers
          svgString = svgString
            .replace(/var\(--forest-green-content[^\)]*\)/g, "#124132")
            .replace(/var\(--forest-green[^\)]*\)/g, "#0b3d2e")
            .replace(/var\(--gold[^\)]*\)/g, "#c9a227")
            .replace(/var\(--warm-white[^\)]*\)/g, "#f4f1e8")
            .replace(/var\(--on-surface-variant[^\)]*\)/g, "#a8b5ae");

          const svgBlob = new Blob([svgString], {
            type: "image/svg+xml;charset=utf-8",
          });
          const svgUrl = URL.createObjectURL(svgBlob);

          const downloadLink = document.createElement("a");
          downloadLink.href = svgUrl;
          downloadLink.download = "physaflow-line-chart.svg";
          document.body.appendChild(downloadLink);
          downloadLink.click();
          document.body.removeChild(downloadLink);
          URL.revokeObjectURL(svgUrl);

          setDownloadSuccess(true);
          setTimeout(() => setDownloadSuccess(false), 3000);
        } catch (err) {
          console.error("Failed to generate SVG download", err);
        }
      }
    }
  };

  return (
    <div className="chart-card border border-[#c9a227]/30 bg-[var(--forest-green-content)] p-6 lg:p-8 rounded-sm relative shadow-xl">
      {/* HEADER */}
      <div className="chart-card-header flex items-start justify-between mb-6">
        <div>
          <span className="chart-label text-xs font-mono text-[#ecc246] uppercase tracking-wider block font-semibold">
            GRÁFICO DE LÍNEA
          </span>
          <h3 className="chart-title font-serif text-xl font-bold text-[#ffffff] mt-1">
            {meta.title ?? "Título no disponible"}
          </h3>
          <p className="chart-description text-sm text-[#e5e2da]/80 mt-1 max-w-2xl">
            {meta.description ?? "Descripción no disponible"}
          </p>
        </div>

        <button
          onClick={handleDownload}
          className="chart-export-btn text-xs font-mono font-medium text-[#ecc246] hover:text-white border border-[#c9a227]/40 hover:border-[#ecc246] px-3 py-1.5 rounded-sm transition-all duration-200 flex items-center gap-2 bg-[#0b3d2e] hover:bg-[#c9a227]/20"
          type="button"
          title="Exportar gráfico a formato SVG"
        >
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
          {downloadSuccess ? "¡EXPORTADO!" : "SVG"}
        </button>
      </div>

      {/* CHART BODY */}
      <div id="fig-line-chart-container" className="chart-body w-full">
        <ResponsiveContainer width="100%" height={360}>
          <RechartsLineChart
            data={data}
            margin={{ top: 16, right: 16, left: 0, bottom: 10 }}
          >
            <CartesianGrid
              vertical={false}
              strokeDasharray="4 4"
              stroke="rgba(229, 226, 218, 0.2)"
            />
            <XAxis
              dataKey={xKey}
              tick={{ fontSize: 11, fill: "#e5e2da" }}
              tickLine={false}
              axisLine={{ stroke: "rgba(229, 226, 218, 0.25)" }}
            />
            <YAxis
              tick={{ fontSize: 11, fill: "#e5e2da" }}
              tickLine={false}
              axisLine={false}
              tickFormatter={(v: number) => `${v}${valueSuffix}`}
              domain={[0, 40]}
              ticks={[0, 10, 20, 30, 40]}
            />
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const item = payload[0].payload;
                  const val = payload[0].value;
                  return (
                    <div className="bg-[#0b3d2e] border border-[#ecc246]/50 p-3 rounded shadow-2xl text-xs font-sans text-[#f4f1e8] leading-relaxed">
                      <div className="font-semibold text-[#ecc246]">
                        Año: {item[xKey] || item.year || item.name}
                      </div>
                      <div className="mt-1 text-[#e5e2da]">
                        Acumulado: <strong className="text-white">{val}{valueSuffix}</strong>
                      </div>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Line
              type="monotone"
              dataKey={dataKey}
              stroke="#c9a227"
              strokeWidth={3}
              dot={<CustomDot />}
              activeDot={{ r: 8, fill: "#ecc246", stroke: "#062a20", strokeWidth: 2 }}
            />
          </RechartsLineChart>
        </ResponsiveContainer>
      </div>

      <div className="chart-caption text-xs text-[#e5e2da]/80 mt-4 pt-3 border-t border-[#c9a227]/20">
        Figura 3 — Capacidad varada acumulada como porcentaje de kilovatios
        energizados, muestreada anualmente 2020–2025. Fuente: Índice de Capacidad
        Varada de PhysaFlow, 2025.
      </div>
    </div>
  );
}
