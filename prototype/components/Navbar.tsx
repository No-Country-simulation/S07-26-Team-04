import React from "react";

interface NavbarProps {
  lang: string;
  onChangeLanguage: (newLang: string) => void;
  onPrint: () => void;
  onDownload: () => void;
}

export default function Navbar({
  lang,
  onChangeLanguage,
  onPrint,
  onDownload,
}: NavbarProps) {
  return (
    <nav className="nav-blur sticky top-0 z-40 no-print">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10 h-16 flex items-center justify-between">
        <a href="#top" className="flex items-center gap-3 group">
          <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
            <rect x="2" y="2" width="24" height="24" rx="2" fill="#0d2818" />
            <path
              d="M8 18 L8 10 L14 18 L14 10"
              stroke="#c9a961"
              strokeWidth="1.6"
              strokeLinecap="square"
              fill="none"
            />
            <circle cx="20" cy="14" r="2.4" fill="#c9a961" />
          </svg>
          <div className="leading-tight">
            <div className="font-display font-medium text-[15px] text-[var(--forest-800)]">
              PhysaFlow
            </div>
            <div className="text-[10px] tracking-[0.16em] uppercase text-[var(--ink-soft)] font-medium">
              {lang === "ES" ? "Investigación" : "Research"}
            </div>
          </div>
        </a>

        {/* Menu Sections */}
        <div className="hidden md:flex items-center gap-7 text-[13px] text-[var(--ink-muted)]">
          <a href="#abstract" className="hover:text-[var(--forest-700)] transition">
            {lang === "ES" ? "Resumen" : "Abstract"}
          </a>
          <a href="#intro" className="hover:text-[var(--forest-700)] transition">
            {lang === "ES" ? "Introducción" : "Introduction"}
          </a>
          <a href="#taxonomy" className="hover:text-[var(--forest-700)] transition">
            {lang === "ES" ? "Taxonomía" : "Taxonomy"}
          </a>
          <a href="#methodology" className="hover:text-[var(--forest-700)] transition">
            {lang === "ES" ? "Metodología" : "Methodology"}
          </a>
          <a href="#figures" className="hover:text-[var(--forest-700)] transition">
            {lang === "ES" ? "Figuras" : "Figures"}
          </a>
          <a href="#cite" className="hover:text-[var(--forest-700)] transition">
            {lang === "ES" ? "Citar" : "Cite"}
          </a>
        </div>

        <div className="flex items-center gap-3">
          {/* Language Switcher */}
          <div className="flex items-center border border-[var(--rule)] rounded-sm overflow-hidden text-[11px]">
            <button
              onClick={() => onChangeLanguage("ES")}
              className={`px-2 py-1 cursor-pointer transition ${
                lang === "ES"
                  ? "bg-[var(--forest-700)] text-[var(--paper)]"
                  : "text-[var(--ink-muted)] hover:bg-[var(--paper-2)]"
              }`}
            >
              ES
            </button>
            <button
              onClick={() => onChangeLanguage("EN")}
              className={`px-2 py-1 cursor-pointer transition ${
                lang === "EN"
                  ? "bg-[var(--forest-700)] text-[var(--paper)]"
                  : "text-[var(--ink-muted)] hover:bg-[var(--paper-2)]"
              }`}
            >
              EN
            </button>
          </div>

          {/* Print Button */}
          <button
            onClick={onPrint}
            className="hidden sm:flex items-center gap-2 px-3 h-9 text-[12px] font-medium text-[var(--ink-muted)] hover:text-[var(--forest-700)] transition border border-[var(--rule)] rounded-sm cursor-pointer"
          >
            <svg width="13" height="13" viewBox="0 0 16 16" fill="none">
              <path d="M4 4V1h8v3M4 12H2V6h12v6h-2M5 12h6v3H5z" stroke="currentColor" strokeWidth="1.3" />
            </svg>
            PDF
          </button>

          {/* Download Button */}
          <button
            onClick={onDownload}
            className="flex items-center gap-2 px-4 h-9 text-[12px] font-semibold text-[var(--paper)] bg-[var(--forest-700)] hover:bg-[var(--forest-800)] transition rounded-sm cursor-pointer"
          >
            <svg width="13" height="13" viewBox="0 0 16 16" fill="none">
              <path
                d="M8 1v10m0 0L4 7m4 4l4-4M2 13h12"
                stroke="currentColor"
                strokeWidth="1.4"
                strokeLinecap="square"
              />
            </svg>
            {lang === "ES" ? "Descargar" : "Download"}
          </button>
        </div>
      </div>
    </nav>
  );
}
