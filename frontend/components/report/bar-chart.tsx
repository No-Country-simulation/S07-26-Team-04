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

export function FailureBarChart({ reportId }: { reportId?: string } = {}) {
  const [barChart, setBarChart] = useState<BarChart | null>(null);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  useEffect(() => {
    async function fetchBarchart() {
      try {
        const data = await getBarChart(reportId);
        setBarChart(data);
      } catch (error) {
        console.error("Error fetching bar chart data:", error);
      }
    }

    fetchBarchart();
  }, [reportId]);

  if (!barChart) {
    return (
      <div className="chart-card border border-[#c9a227]/30 bg-[var(--forest-green-content)] p-6 rounded-sm min-h-[250px] flex items-center justify-center">
        <p className="text-sm text-[#a8b5ae]">
          Cargando gráfico...
        </p>
      </div>
    );
  }

  const { metrics } = barChart;
  if (!metrics || !metrics.data || !Array.isArray(metrics.data) || metrics.data.length === 0) {
    return null;
  }

  const { meta, xKey, series, data } = metrics;
  const dataKey = series?.[0]?.dataKey ?? "value";
  const valueSuffix = series?.[0]?.valueSuffix ?? "%";
  const handleDownload = () => {
    const container = document.getElementById("fig-bar-chart-container");
    if (container) {
      const svgs = Array.from(container.querySelectorAll("svg"));
      const svgEl =
        svgs.find((s) => s.getBoundingClientRect().width > 100) || svgs[0];

      if (svgEl) {
        const bbox = svgEl.getBoundingClientRect();
        const origWidth = Math.round(bbox.width) || 800;
        const origHeight = Math.round(bbox.height) || 360;

        const topPadding = 75;
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
          .svg-desc { font-size: 11px; fill: #e5e2da; opacity: 0.85; }
          .svg-caption { font-size: 10px; fill: #c0c8c3 !important; }
        `;
        clonedSvg.appendChild(style);

        // 3. Header Titles & Description
        const textEyebrow = document.createElementNS(
          "http://www.w3.org/2000/svg",
          "text"
        );
        textEyebrow.setAttribute("x", "20");
        textEyebrow.setAttribute("y", "22");
        textEyebrow.setAttribute("class", "svg-eyebrow");
        textEyebrow.textContent = "GRÁFICO DE BARRAS";
        clonedSvg.appendChild(textEyebrow);

        const textTitle = document.createElementNS(
          "http://www.w3.org/2000/svg",
          "text"
        );
        textTitle.setAttribute("x", "20");
        textTitle.setAttribute("y", "42");
        textTitle.setAttribute("class", "svg-title");
        textTitle.textContent = meta.title || "Gráfico de Barras";
        clonedSvg.appendChild(textTitle);

        if (meta.description) {
          const textDesc = document.createElementNS(
            "http://www.w3.org/2000/svg",
            "text"
          );
          textDesc.setAttribute("x", "20");
          textDesc.setAttribute("y", "58");
          textDesc.setAttribute("class", "svg-desc");
          textDesc.textContent = meta.description;
          clonedSvg.appendChild(textDesc);
        }

        // 4. Append transformed graphic wrapper
        clonedSvg.appendChild(gWrapper);

        // 5. Divider Line & Footer Caption
        const dividerY = origHeight + topPadding + 10;
        const dividerLine = document.createElementNS(
          "http://www.w3.org/2000/svg",
          "line"
        );
        dividerLine.setAttribute("x1", "20");
        dividerLine.setAttribute("y1", dividerY.toString());
        dividerLine.setAttribute("x2", (origWidth - 20).toString());
        dividerLine.setAttribute("y2", dividerY.toString());
        dividerLine.setAttribute("stroke", "#c9a227");
        dividerLine.setAttribute("stroke-opacity", "0.3");
        dividerLine.setAttribute("stroke-width", "1");
        clonedSvg.appendChild(dividerLine);

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

        const captionStr = `Figura 2 — ${meta.title}. ${meta.description} - Source: PhysaFlow.`;
        const captionLines = wrapSvgText(captionStr, 110);
        captionLines.forEach((line, index) => {
          if (line.includes("PhysaFlow.")) {
            const parts = line.split("PhysaFlow.");
            const tspan1 = document.createElementNS(
              "http://www.w3.org/2000/svg",
              "tspan"
            );
            tspan1.setAttribute("x", "20");
            tspan1.setAttribute("dy", index === 0 ? "0" : "14");
            tspan1.textContent = parts[0];
            textCaption.appendChild(tspan1);

            const tspanBrand = document.createElementNS(
              "http://www.w3.org/2000/svg",
              "tspan"
            );
            tspanBrand.setAttribute("fill", "#ecc246");
            tspanBrand.setAttribute("font-weight", "bold");
            tspanBrand.textContent = "PhysaFlow.";
            textCaption.appendChild(tspanBrand);

            if (parts[1]) {
              const tspanRest = document.createElementNS(
                "http://www.w3.org/2000/svg",
                "tspan"
              );
              tspanRest.textContent = parts[1];
              textCaption.appendChild(tspanRest);
            }
          } else {
            const tspan = document.createElementNS(
              "http://www.w3.org/2000/svg",
              "tspan"
            );
            tspan.setAttribute("x", "20");
            tspan.setAttribute("dy", index === 0 ? "0" : "14");
            tspan.textContent = line;
            textCaption.appendChild(tspan);
          }
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
        Figura 2 — {meta.title}. {meta.description} - Source: <span className="text-[#c9a227]">PhysaFlow.</span>
      </div>
    </div>
  );
}
