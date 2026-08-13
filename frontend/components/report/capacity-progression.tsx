const states = [
  {
    number: "01",
    code: "INST",
    title: "Instala",
    description: "Capacidad física incorporada a la infraestructura.",
  },
  {
    number: "02",
    code: "DISP",
    title: "Disponible",
    description: "Capacidad lista para ser asignada.",
  },
  {
    number: "03",
    code: "PROG",
    title: "Programable",
    description: "Capacidad que puede recibir una carga.",
  },
  {
    number: "04",
    code: "ACT",
    title: "Activa",
    description: "Capacidad ejecutando una carga de trabajo.",
  },
  {
    number: "05",
    code: "PROD",
    title: "Productiva",
    description: "Capacidad que genera trabajo útil.",
  },
];

export function CapacityProgression() {
  return (
    <div className="capacity-progression">
      {states.map((state, index) => (
        <div key={state.code} className="capacity-state-wrapper">
          <article className="capacity-state">
            {/* Número */}
            <span className="capacity-state-number">{state.number}</span>

            {/* Código */}
            <span className="capacity-state-code">{state.code}</span>

            {/* Título */}
            <h3 className="capacity-state-title">{state.title}</h3>

            {/* Descripción */}
            <p className="capacity-state-description">{state.description}</p>
          </article>

          {/* Conector */}
          {index < states.length - 1 && (
            <div className="capacity-state-connector" aria-hidden="true">
              <span />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
