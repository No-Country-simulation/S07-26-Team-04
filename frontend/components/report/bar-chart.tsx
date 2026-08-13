"use client";

import {
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Cell,
} from "recharts";

const LAYER_COLORS = {
  "L1 - Instalaciones": "var(--dark-forest)",
  "L2 - TI": "var(--gold)",
  "L3 - Carga de trabajo": "var(--muted-green-grey)",
};

interface FailureModeData {
  name: string;
  value: number;
  layer: string;
}

const failureModeData: FailureModeData[] = [
  { name: "Deriva pasillo", value: 4.2, layer: "L1 - Instalaciones" },
  { name: "Sobresuscr. térmica", value: 6.1, layer: "L1 - Instalaciones" },
  { name: "Aprov. sombra", value: 4.5, layer: "L1 - Instalaciones" },
  { name: "Racks comatosos", value: 3.8, layer: "L2 - TI" },
  { name: "Nodos durmientes", value: 2.9, layer: "L2 - TI" },
  { name: "Bloq. topología", value: 3.0, layer: "L2 - TI" },
  { name: "Asig. huérfanas", value: 3.1, layer: "L3 - Carga de trabajo" },
  { name: "Inanición afinidad", value: 2.2, layer: "L3 - Carga de trabajo" },
  { name: "Latencia marea", value: 1.6, layer: "L3 - Carga de trabajo" },
];

export function FailureBarChart() {
  return (
    <div className="chart-card">
      <div className="chart-card-header">
        <div>
          <span className="chart-label">GRÁFICO DE BARRAS</span>
          <h3 className="chart-title">
            Capacidad varada por modo de fallo con nombre (% de kW energizados)
          </h3>
        </div>
        <button className="chart-export-btn" type="button">
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
          SVG
        </button>
      </div>

      <div className="chart-body">
        <ResponsiveContainer width="100%" height={360}>
          <RechartsBarChart
            data={failureModeData}
            margin={{ top: 8, right: 0, left: -8, bottom: 24 }}
            barCategoryGap="20%"
          >
            <CartesianGrid
              vertical={false}
              strokeDasharray="4 4"
              stroke="var(--outline-variant)"
              strokeOpacity={0.5}
            />
            <XAxis
              dataKey="name"
              tick={{ fontSize: 10, fill: "var(--on-surface-variant)" }}
              tickLine={false}
              axisLine={false}
              interval={0}
              angle={-35}
              textAnchor="end"
              height={60}
            />
            <YAxis
              tick={{ fontSize: 11, fill: "var(--on-surface-variant)" }}
              tickLine={false}
              axisLine={false}
              tickFormatter={(v: number) => `${v}%`}
              domain={[0, 8]}
              ticks={[0, 2, 4, 6, 8]}
            />
            <Bar
              dataKey="value"
              radius={[0, 0, 0, 0]}
              maxBarSize={48}
            >
              {failureModeData.map((entry) => (
                <Cell
                  key={entry.name}
                  fill={LAYER_COLORS[entry.layer as keyof typeof LAYER_COLORS]}
                />
              ))}
            </Bar>
          </RechartsBarChart>
        </ResponsiveContainer>
      </div>

      <div className="chart-caption">
        Figura 2 — Capacidad varada mediana por modo de fallo con nombre.
        Muestra n=41 sitios. Fuente: Índice de Capacidad Varada de PhysaFlow,
        2025.
      </div>
    </div>
  );
}
