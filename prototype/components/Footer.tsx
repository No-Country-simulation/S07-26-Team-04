import React from "react";

interface FooterProps {
  license?: string;
  csvUrl?: string;
  bibtexUrl?: string;
  onDownloadAllSvgs?: () => void;
}

export default function Footer({
  license = "CC BY-SA 4.0",
  csvUrl = "/api/reporte/csv",
  bibtexUrl = "/api/reporte/bibtex",
  onDownloadAllSvgs,
}: FooterProps) {
  return (
    <footer className="bg-[var(--forest-900)] text-[var(--paper)] mt-20 no-print">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10 py-16">
        <div className="grid md:grid-cols-12 gap-10">
          <div className="md:col-span-5">
            <div className="flex items-center gap-3 mb-5">
              <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                <rect x="2" y="2" width="24" height="24" rx="2" fill="#0d2818" stroke="#c9a961" strokeWidth="1" />
                <path
                  d="M8 18 L8 10 L14 18 L14 10"
                  stroke="#c9a961"
                  strokeWidth="1.6"
                  strokeLinecap="square"
                  fill="none"
                />
                <circle cx="20" cy="14" r="2.4" fill="#c9a961" />
              </svg>
              <div>
                <div className="font-display text-[16px]">PhysaFlow</div>
                <div className="text-[10px] tracking-[0.16em] uppercase text-[var(--forest-300)]">
                  División de Investigación
                </div>
              </div>
            </div>
            <p className="font-display text-[20px] leading-[1.4] text-[var(--paper)] max-w-md">
              Construyendo el vocabulario compartido para la capa física de la inteligencia artificial.
            </p>
            <div className="mt-6 text-[12px] text-[var(--forest-300)]">
              © 2025 PhysaFlow, Inc. Este informe está licenciado bajo{" "}
              <a href="#" className="ulink text-[var(--gold-400)]">
                {license}
              </a>
              .
            </div>
          </div>

          <div className="md:col-span-3">
            <div className="eyebrow-gold mb-4">Informe</div>
            <ul className="space-y-2.5 text-[13px] text-[var(--forest-300)]">
              <li>
                <a href="#01--resumen" className="hover:text-[var(--paper)] transition">
                  Resumen
                </a>
              </li>
              <li>
                <a href="#02--introduccin" className="hover:text-[var(--paper)] transition">
                  Introducción
                </a>
              </li>
              <li>
                <a href="#03--descripcin-general-de-la-taxonoma" className="hover:text-[var(--paper)] transition">
                  Taxonomía
                </a>
              </li>
              <li>
                <a href="#04--metodologa" className="hover:text-[var(--paper)] transition">
                  Metodología
                </a>
              </li>
              <li>
                <a href="#05--figuras-y-descargas" className="hover:text-[var(--paper)] transition">
                  Figuras
                </a>
              </li>
              <li>
                <a href="#06--cmo-citar" className="hover:text-[var(--paper)] transition">
                  Cómo citar
                </a>
              </li>
            </ul>
          </div>

          <div className="md:col-span-2">
            <div className="eyebrow-gold mb-4">Recursos</div>
            <ul className="space-y-2.5 text-[13px] text-[var(--forest-300)]">
              <li>
                <a href={csvUrl} className="hover:text-[var(--paper)] transition text-left block">
                  Conjunto de datos (CSV)
                </a>
              </li>
              {onDownloadAllSvgs && (
                <li>
                  <button onClick={onDownloadAllSvgs} className="hover:text-[var(--paper)] transition text-left cursor-pointer">
                    Figuras (SVG)
                  </button>
                </li>
              )}
              <li>
                <a href={bibtexUrl} className="hover:text-[var(--paper)] transition text-left block">
                  BibTeX
                </a>
              </li>
            </ul>
          </div>

          <div className="md:col-span-2">
            <div className="eyebrow-gold mb-4">Contacto</div>
            <ul className="space-y-2.5 text-[13px] text-[var(--forest-300)]">
              <li>
                research@
                <br />
                physaflow.com
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}
