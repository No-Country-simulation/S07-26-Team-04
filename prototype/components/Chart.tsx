"use client";

import React from "react";
import BarChartComponent, { BarChartItem } from "./charts/BarChartComponent";
import LineChartComponent, { LineChartItem } from "./charts/LineChartComponent";
import PieChartComponent, { PieChartItem } from "./charts/PieChartComponent";

export interface ChartProps {
  type?: "bar" | "line" | "pie";
  title?: string;
  caption?: string;
  data?: unknown[] | string;
  labels?: Record<string, string | undefined>;
  onShowToast?: (msg: string) => void;
}

export default function Chart({
  type = "bar",
  title,
  caption,
  data: rawData,
  labels,
  onShowToast,
}: ChartProps) {
  const data = React.useMemo(() => {
    if (!rawData) return undefined;
    if (typeof rawData === "string") {
      try {
        // Limpiar comas sobrantes al final de arrays/objetos si existen (trailing commas)
        const sanitized = rawData.replace(/,\s*([\]}])/g, "$1");
        return JSON.parse(sanitized);
      } catch {
        // Si el JSON aún está siendo tipeado o incompleto por el usuario, retornar arreglo vacío sin error en consola
        return [];
      }
    }
    return rawData;
  }, [rawData]);
  switch (type) {
    case "bar":
      return (
        <BarChartComponent
          title={title}
          caption={caption}
          data={data as BarChartItem[]}
          labels={labels}
          onShowToast={onShowToast}
        />
      );
    case "line":
      return (
        <LineChartComponent
          title={title}
          caption={caption}
          data={data as LineChartItem[]}
          labels={labels}
          onShowToast={onShowToast}
        />
      );
    case "pie":
      return (
        <PieChartComponent
          title={title}
          caption={caption}
          data={data as PieChartItem[]}
          labels={labels}
          onShowToast={onShowToast}
        />
      );
    default:
      return (
        <BarChartComponent
          title={title}
          caption={caption}
          data={data as BarChartItem[]}
          labels={labels}
          onShowToast={onShowToast}
        />
      );
  }
}
