import { Card } from "./card";

export function ExecutiveSummary() {
  return (
    <section id="resumen" className="report-section">
      <div className="report-section-header">
        <span className="section-number">01</span>

        <div>
          <h2 className="section-title">Resumen Ejecutivo</h2>

          <p className="section-description">
            Una visión general de los principales hallazgos del reporte sobre
            capacidad varada.
          </p>
        </div>
      </div>

      <Card
        badge="RESUMEN"
        code="01"
        mediana="31,4%"
        title="Lorem ipsum dolor sit amet"
        queSeVe="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
        cuantoCuesta="Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."
        porQueOcurre="Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur."
      />
    </section>
  );
}
