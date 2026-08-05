import { Card } from "./card";

export function TaxonomySection() {
  return (
    <section id="taxonomia" className="report-section">
      <div className="report-section-header">
        <span className="section-number">02</span>

        <div>
          <h2 className="section-title">La Taxonomía</h2>

          <p className="section-description">
            Taxonomía de las diferentes formas de capacidad varada dentro de la
            infraestructura de cómputo.
          </p>
        </div>
      </div>

      <Card
        badge="TAXONOMÍA"
        code="02"
        mediana="9,1%"
        title="Consectetur adipiscing elit"
        queSeVe="Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
        cuantoCuesta="Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium."
        porQueOcurre="Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit."
      />
    </section>
  );
}
