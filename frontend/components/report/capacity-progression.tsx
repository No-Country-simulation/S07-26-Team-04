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
    <div className="w-full mt-8">
      {/* SPACIOUS CARDS GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {states.map((state) => (
          <article
            key={state.code}
            className="bg-[#0b3d2e]/90 border border-[#c9a227]/20 hover:border-[#c9a227] p-5 rounded-sm flex flex-col justify-between transition-all duration-300 hover:shadow-[0_0_15px_rgba(201,162,39,0.2)] group"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="font-serif text-2xl font-bold text-[#c9a227]">
                  {state.number}
                </span>
                <span className="text-[10px] font-mono text-[#ecc246] px-2 py-0.5 border border-[#c9a227]/30 bg-[#0d2818] rounded uppercase tracking-wider">
                  {state.code}
                </span>
              </div>

              <h3 className="font-serif text-lg font-bold text-white mb-2 group-hover:text-[#ecc246] transition-colors">
                {state.title}
              </h3>

              <p className="text-xs text-[#a8b5ae] leading-relaxed">
                {state.description}
              </p>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
