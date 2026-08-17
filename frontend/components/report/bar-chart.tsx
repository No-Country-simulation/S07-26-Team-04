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
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

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

export function FailureBarChart() {
  const [barChart, setBarChart] = useState<BarChart | null>(null);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

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

  if (!barChart) {
    return (
      <div className="chart-card">
        <div className="chart-body flex items-center justify-center min-h-[300px]">
          <p className="text-body-md text-[#a8b5ae]">
            Cargando gráfico...
          </p>
        </div>
      </div>
    );
  }

  const { metrics } = barChart;
  const { meta, xKey, series, data } = metrics;
  const dataKey = series[0]?.dataKey ?? "value";
  const valueSuffix = series[0]?.valueSuffix ?? "%";

  const handleDownload = () => {
    const container = document.getElementById("fig-bar-chart-container");
    if (container) {
      const svgEl = container.querySelector("svg");
      if (svgEl) {
        const clonedSvg = svgEl.cloneNode(true) as SVGElement;
        const origWidthStr = clonedSvg.getAttribute("width") || "800";
        const origHeightStr = clonedSvg.getAttribute("height") || "360";
        const origWidth = parseInt(origWidthStr, 10);
        const origHeight = parseInt(origHeightStr, 10);

        const topPadding = 60;
        const bottomPadding = 70;
        const newHeight = origHeight + topPadding + bottomPadding;

        clonedSvg.setAttribute("height", newHeight.toString());
        clonedSvg.setAttribute("viewBox", `0 0 ${origWidth} ${newHeight}`);
        clonedSvg.setAttribute("xmlns", "http://www.w3.org/2000/svg");

        const gWrapper = document.createElementNS(
          "http://www.w3.org/2000/svg",
          "g"
        );
        gWrapper.setAttribute("transform", `translate(0, ${topPadding})`);

        while (clonedSvg.firstChild) {
          gWrapper.appendChild(clonedSvg.firstChild);
        }
        clonedSvg.appendChild(gWrapper);

        const style = document.createElementNS(
          "http://www.w3.org/2000/svg",
          "style"
        );
        style.textContent = `
          text { font-family: sans-serif; font-size: 11px; fill: #e5e2da; }
          .recharts-cartesian-grid-horizontal line { stroke: rgba(168, 181, 174, 0.25); stroke-dasharray: 4 4; }
          .svg-eyebrow { font-family: sans-serif; font-size: 10px; font-weight: bold; fill: #ecc246; letter-spacing: 0.12em; text-transform: uppercase; }
          .svg-title { font-family: serif; font-size: 16px; font-weight: 600; fill: #ffffff; }
          .svg-caption { font-family: sans-serif; font-size: 10px; fill: #c0c8c3; }
        `;
        clonedSvg.insertBefore(style, clonedSvg.firstChild);

        // Add background rect to exported SVG using var(--forest-green-content)
        const bgRect = document.createElementNS(
          "http://www.w3.org/2000/svg",
          "rect"
        );
        const bgColor =
          getComputedStyle(document.documentElement)
            .getPropertyValue("--forest-green-content")
            .trim() || "#124132";

        bgRect.setAttribute("width", "100%");
        bgRect.setAttribute("height", "100%");
        bgRect.setAttribute("fill", bgColor);
        clonedSvg.insertBefore(bgRect, clonedSvg.firstChild);

        const textEyebrow = document.createElementNS(
          "http://www.w3.org/2000/svg",
          "text"
        );
        textEyebrow.setAttribute("x", "16");
        textEyebrow.setAttribute("y", "22");
        textEyebrow.setAttribute("class", "svg-eyebrow");
        textEyebrow.textContent = "GRÁFICO DE BARRAS";

        const textTitle = document.createElementNS(
          "http://www.w3.org/2000/svg",
          "text"
        );
        textTitle.setAttribute("x", "16");
        textTitle.setAttribute("y", "44");
        textTitle.setAttribute("class", "svg-title");
        textTitle.textContent = meta.title || "Gráfico de Barras";

        clonedSvg.appendChild(textEyebrow);
        clonedSvg.appendChild(textTitle);

        const textCaption = document.createElementNS(
          "http://www.w3.org/2000/svg",
          "text"
        );
        textCaption.setAttribute("x", "16");
        textCaption.setAttribute("y", (origHeight + topPadding + 32).toString());
        textCaption.setAttribute("class", "svg-caption");

        const captionStr = `Figura 2 — ${meta.title}. ${meta.description}`;
        const captionLines = wrapSvgText(captionStr, 110);
        captionLines.forEach((line, index) => {
          const tspan = document.createElementNS(
            "http://www.w3.org/2000/svg",
            "tspan"
          );
          tspan.setAttribute("x", "16");
          tspan.setAttribute("dy", index === 0 ? "0" : "14");
          tspan.textContent = line;
          textCaption.appendChild(tspan);
        });

        clonedSvg.appendChild(textCaption);

        try {
          const serializer = new XMLSerializer();
          const svgString = serializer.serializeToString(clonedSvg);
          const svgBlob = new Blob([svgString], {
            type: "image/svg+xml;charset=utf-8",
          });
          const svgUrl = URL.createObjectURL(svgBlob);

          const downloadLink = document.createElement("a");
          downloadLink.href = svgUrl;
          downloadLink.download = "physaflow-bar-chart.svg";
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
            GRÁFICO DE BARRAS
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
      <div id="fig-bar-chart-container" className="chart-body w-full">
        <ResponsiveContainer width="100%" height={400}>
          <RechartsBarChart
            data={data}
            margin={{
              top: 16,
              right: 16,
              left: 0,
              bottom: 80,
            }}
            barCategoryGap="18%"
          >
            <CartesianGrid
              vertical={false}
              strokeDasharray="4 4"
              stroke="rgba(229, 226, 218, 0.2)"
            />

            <XAxis
              dataKey={xKey}
              tick={{
                fontSize: 10,
                fill: "#e5e2da",
              }}
              tickLine={false}
              axisLine={{ stroke: "rgba(229, 226, 218, 0.25)" }}
              interval={0}
              angle={-35}
              textAnchor="end"
              height={80}
              dx={-4}
              dy={6}
            />

            <YAxis
              tick={{
                fontSize: 11,
                fill: "#e5e2da",
              }}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value: number) => `${value}${valueSuffix}`}
              domain={[0, 8]}
              ticks={[0, 2, 4, 6, 8]}
            />

            <Tooltip
              cursor={{ fill: "rgba(236, 194, 70, 0.15)" }}
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const item = payload[0].payload;
                  const val = payload[0].value;
                  return (
                    <div className="bg-[#0b3d2e] border border-[#ecc246]/50 p-3 rounded shadow-2xl text-xs font-sans text-[#f4f1e8] leading-relaxed">
                      <div className="font-semibold text-[#ecc246]">
                        {item[xKey] || item.name}
                      </div>
                      <div className="mt-1 text-[#e5e2da]">
                        Valor: <strong className="text-white">{val}{valueSuffix}</strong>
                      </div>
                    </div>
                  );
                }
                return null;
              }}
            />

            <Bar dataKey={dataKey} radius={[2, 2, 0, 0]} maxBarSize={48}>
              {data.map((entry, idx) => (
                <Cell
                  key={`bar-${idx}`}
                  fill="#c9a227"
                  className="hover:opacity-85 transition-opacity"
                />
              ))}
            </Bar>
          </RechartsBarChart>
        </ResponsiveContainer>
      </div>

      <div className="chart-caption text-xs text-[#e5e2da]/80 mt-4 pt-3 border-t border-[#c9a227]/20">
        Figura 2 — {meta.title}. {meta.description}
      </div>
    </div>
  );
}
