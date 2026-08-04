export function Hero() {
  return (
    <div className="mx-auto max-w-[800px] px-4 lg:px-0">
      <section className="report-hero">
        {/* Eyebrow */}
        <p className="eyebrow">INVESTIGACIÓN DE PHYSaflow</p>

        {/* Título */}
        <h1>
          El Índice de Capacidad
          <br />
          <span>Varada</span>
        </h1>

        {/* Descripción */}
        <p className="hero-copy">
          Una taxonomía de capacidad no utilizada e inaccesible en la
          infraestructura de centros de datos de IA, descubriendo las
          ineficiencias estructurales en la cadena de suministro digital de
          cómputo.
        </p>

        {/* Botones */}
        <div className="hero-actions">
          <button className="gold-button">LEER EL REPORTE</button>

          <button className="outline-button">EXPLORAR LA TAXONOMÍA</button>
        </div>

        {/* Metadata */}
        <div className="hero-meta">
          <div>
            <p className="text-[#c6a13a]">Autor</p>
            <strong>Dr. Juan Pérez</strong>
          </div>

          <div>
            <p className="text-[#c6a13a]">Clasificación</p>
            <strong>Investigación Pública</strong>
          </div>

          <div>
            <p className="text-[#c6a13a]">Publicado</p>
            <strong>Agosto 2026</strong>
          </div>

          <div>
            <p className="text-[#c6a13a]">Tiempo de lectura</p>
            <strong>~25 minutos</strong>
          </div>
        </div>
      </section>
    </div>
  );
}
