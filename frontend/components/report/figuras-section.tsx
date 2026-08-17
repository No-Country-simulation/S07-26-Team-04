import { FailureBarChart } from "./bar-chart";
import { AccumulatedLineChart } from "./line-chart";

export function FigurasSection() {
  return (
    <section id="figures" className="report-section">
      <div className="report-section-header">
        <span className="section-number">05</span>

        <div>
          <h2 className="section-title">Figuras</h2>

          <p className="section-description">
            Visualización cuantitativa de los hallazgos principales del índice
            de capacidad varada.
          </p>
        </div>
      </div>

      <div className="chart-grid">
        <FailureBarChart />
        <br />
        <AccumulatedLineChart />
      </div>
    </section>
  );
}
