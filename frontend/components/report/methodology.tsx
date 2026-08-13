import { Card } from "@/components/report/card";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CapacityProgression } from "./capacity-progression";

const methodologyTable = [
  {
    infrastructureLayer: "Térmica/Enfriamiento",
    primaryMetric: "Variación delta-T",
    leakThreshold: "> Diferencial de 8°K",
  },
  {
    infrastructureLayer: "Cadena de Energía",
    primaryMetric: "Equilibrio de Fase PDU",
    leakThreshold: "< 92% de Alineación",
  },
  {
    infrastructureLayer: "Interconexión",
    primaryMetric: "Latencia de Cola (P99)",
    leakThreshold: "> 450μs Jitter",
  },
  {
    infrastructureLayer: "Acelerador",
    primaryMetric: "Eficiencia de Ejecución de Kernel",
    leakThreshold: "< 68% TFLOPS/W",
  },
];

export function Methodology() {
  return (
    <section id="metodologia" className="report-section">
      {/* Encabezado */}
      <div className="report-section-header">
        <div className="section-number">03</div>

        <div>
          <h2 className="section-title">Metodología</h2>

          <p className="section-description">
            La capacidad atraviesa diferentes estados antes de convertirse en
            trabajo productivo. La metodología permite identificar en qué punto
            del recorrido aparece la capacidad varada.
          </p>
        </div>
      </div>

      {/* ================================================
          PROGRESIÓN
      ================================================ */}

      <div>
        <div className="text-label-caps text-[var(--gold)] mb-2">
          PROGRESIÓN DE ESTADOS DE CAPACIDAD
        </div>

        <h3 className="text-headline-md text-[var(--warm-white)]">
          De capacidad instalada a capacidad productiva
        </h3>

        <p className="text-body-md text-[var(--on-surface-variant)] mt-3 max-w-3xl">
          Cada transición representa una condición necesaria para que la
          capacidad física de un centro de datos pueda convertirse finalmente en
          trabajo útil.
        </p>

        <CapacityProgression />
      </div>

      {/* ================================================
          EJEMPLOS DE CAPACIDAD VARADA
      ================================================ */}

      <div className="mt-20">
        <div className="mb-8">
          <div className="text-label-caps text-[var(--gold)] mb-2">
            PUNTOS DE FRICCIÓN
          </div>

          <h3 className="text-headline-md text-[var(--warm-white)]">
            Dónde aparece la capacidad varada
          </h3>

          <p className="text-body-md text-[var(--on-surface-variant)] mt-3 max-w-3xl">
            La pérdida de capacidad puede producirse entre cualquiera de los
            estados cuando las capas de facility, infraestructura y workload
            dejan de estar coordinadas.
          </p>
        </div>

        <div className="space-y-4">
          <Card
            badge="FAC"
            code="TH-07"
            mediana="18%"
            title="Capacidad térmica disponible pero inaccesible"
            queSeVe="Sistemas de refrigeración instalados que cuentan con capacidad disponible, pero que no puede utilizarse debido a restricciones de distribución térmica."
            cuantoCuesta="Capital ya invertido en infraestructura de cooling que permanece sin generar capacidad computacional efectiva."
            porQueOcurre="La capacidad térmica no está coordinada con la distribución física de los racks y la demanda de cómputo."
          />

          <Card
            badge="IT"
            code="IT-12"
            mediana="24%"
            title="Cómputo reservado sin workload"
            queSeVe="Servidores y aceleradores asignados a proyectos o clusters que permanecen parcialmente inactivos."
            cuantoCuesta="Energía, espacio y capacidad computacional reservada que no produce trabajo útil durante el período de inactividad."
            porQueOcurre="La planificación del workload no coincide con la capacidad que ya fue provisionada."
          />

          <Card
            badge="WRK"
            code="WK-04"
            mediana="11%"
            title="Workload programable sin capacidad activa"
            queSeVe="Trabajos preparados para ejecutarse que permanecen en colas esperando recursos disponibles."
            cuantoCuesta="Tiempo de espera y capacidad computacional potencial que permanece sin utilizar."
            porQueOcurre="Existe una desconexión entre la programación de los trabajos y la capacidad operacional disponible."
          />
        </div>
      </div>

      {/* ================================================
          MATRIZ
      ================================================ */}

      <div className="mt-20">
        <div className="mb-6">
          <div className="text-label-caps text-[var(--gold)] mb-2">
            MATRIZ METODOLÓGICA
          </div>

          <h3 className="text-headline-md text-[var(--warm-white)]">
            Relación entre estados y capas
          </h3>
        </div>

        {/* Aquí iría tu Table de Shadcn */}
        {/* Tabla Shadcn */}
        <div className="report-card overflow-hidden p-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Capa de Infraestructura</TableHead>

                <TableHead>Métrica Primaria</TableHead>

                <TableHead>Umbral de Fuga</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {methodologyTable.map((row) => (
                <TableRow key={row.infrastructureLayer}>
                  <TableCell className="font-medium text-[var(--gold)]">
                    {row.infrastructureLayer}
                  </TableCell>

                  <TableCell>{row.primaryMetric}</TableCell>

                  <TableCell>{row.leakThreshold}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </section>
  );
}
