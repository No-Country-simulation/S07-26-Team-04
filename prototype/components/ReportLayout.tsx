"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import TocSidebar from "./TocSidebar";

interface ReportLayoutProps {
  lang: string;
  frontmatter: {
    title: string;
    subtitle: string;
    author: string;
    published: string;
    doi: string;
    readingTime: string;
    license: string;
    medianaGlobal: string;
    lossFacilities: string;
    lossIT: string;
    lossWorkload: string;
  };
  children: React.ReactNode;
}

export default function ReportLayout({
  lang,
  frontmatter,
  children,
}: ReportLayoutProps) {
  const router = useRouter();
  
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [toastTimeout, setToastTimeout] = useState<NodeJS.Timeout | null>(null);

  const showToast = (message: string) => {
    if (toastTimeout) {
      clearTimeout(toastTimeout);
    }
    setToastMessage(message);
    const timeout = setTimeout(() => {
      setToastMessage(null);
    }, 2800);
    setToastTimeout(timeout);
  };

  const changeLanguage = (newLang: string) => {
    router.push(`/?lang=${newLang.toLowerCase()}`);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadReport = () => {
    showToast(
      lang === "ES"
        ? "Descargando informe completo en PDF..."
        : "Downloading complete PDF report..."
    );
  };

  const csvUrl = `/api/reporte/csv?lang=${lang}`;
  const bibtexUrl = `/api/reporte/bibtex?lang=${lang}`;

  return (
    <div className="flex flex-col min-h-screen">
      {/* ============ NAVEGACIÓN SUPERIOR ============ */}
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
                onClick={() => changeLanguage("ES")}
                className={`px-2 py-1 cursor-pointer transition ${
                  lang === "ES"
                    ? "bg-[var(--forest-700)] text-[var(--paper)]"
                    : "text-[var(--ink-muted)] hover:bg-[var(--paper-2)]"
                }`}
              >
                ES
              </button>
              <button
                onClick={() => changeLanguage("EN")}
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
              onClick={handlePrint}
              className="hidden sm:flex items-center gap-2 px-3 h-9 text-[12px] font-medium text-[var(--ink-muted)] hover:text-[var(--forest-700)] transition border border-[var(--rule)] rounded-sm cursor-pointer"
            >
              <svg width="13" height="13" viewBox="0 0 16 16" fill="none">
                <path d="M4 4V1h8v3M4 12H2V6h12v6h-2M5 12h6v3H5z" stroke="currentColor" strokeWidth="1.3" />
              </svg>
              PDF
            </button>

            {/* Download Button */}
            <button
              onClick={handleDownloadReport}
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

      {/* ============ HERO ============ */}
      <header id="top" className="hero-forest relative overflow-hidden">
        <div className="hero-grain"></div>
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10 pt-16 pb-20 lg:pt-24 lg:pb-32 relative">
          <div className="flex items-center gap-3 mb-10">
            <span className="text-[10px] tracking-[0.22em] uppercase text-[var(--gold-400)] font-semibold">
              {lang === "ES" ? "Volumen I · Edición" : "Volume I · Edition"} {frontmatter.published.match(/\d{4}/)?.[0] || "2025"}
            </span>
            <span className="w-8 h-px bg-[var(--gold-500)] opacity-50"></span>
            <span className="text-[10px] tracking-[0.22em] uppercase text-[var(--forest-300)] font-medium">
              {lang === "ES" ? "Informe Público" : "Public Report"}
            </span>
          </div>

          <h1 className="font-display font-light text-[var(--paper)] leading-[0.95] tracking-[-0.02em] text-[44px] sm:text-[64px] lg:text-[88px] max-w-[16ch]">
            {frontmatter.title}{" "}
            <span className="italic font-normal text-[var(--gold-400)]">
              {lang === "ES" ? "Varada" : "Stranded"}
            </span>
          </h1>

          <p className="font-display text-[var(--forest-300)] text-[18px] lg:text-[22px] leading-[1.5] mt-8 max-w-[58ch] font-light">
            {lang === "ES"
              ? "Una taxonomía nominal de infraestructura pagada, energizada y no productiva en las tres capas físicas del centro de datos moderno: instalaciones, TI y carga de trabajo."
              : "A named taxonomy of paid, energized, and unproductive infrastructure across the three physical layers of the modern data center: facilities, IT, and workload."}
          </p>

          <div className="mt-12 lg:mt-16 flex flex-wrap items-end gap-x-12 gap-y-6 pt-8 border-t border-[var(--forest-600)]/40">
            <div>
              <div className="text-[10px] tracking-[0.18em] uppercase text-[var(--forest-300)] font-medium mb-2">
                {lang === "ES" ? "Autor" : "Author"}
              </div>
              <div className="font-display text-[var(--paper)] text-[18px]">{frontmatter.author}</div>
              <div className="text-[12px] text-[var(--forest-300)] mt-0.5">PhysaFlow Founder</div>
            </div>
            <div>
              <div className="text-[10px] tracking-[0.18em] uppercase text-[var(--forest-300)] font-medium mb-2">
                {lang === "ES" ? "Publicado" : "Published"}
              </div>
              <div className="font-display text-[var(--paper)] text-[18px]">{frontmatter.published}</div>
              <div className="text-[12px] text-[var(--forest-300)] mt-0.5">
                Rev. 1.0 · DOI: {frontmatter.doi}
              </div>
            </div>
            <div>
              <div className="text-[10px] tracking-[0.18em] uppercase text-[var(--forest-300)] font-medium mb-2">
                {lang === "ES" ? "Tiempo de lectura" : "Reading Time"}
              </div>
              <div className="font-display text-[var(--paper)] text-[18px]">{frontmatter.readingTime}</div>
              <div className="text-[12px] text-[var(--forest-300)] mt-0.5">9 sections</div>
            </div>
            <div className="ml-auto hidden lg:block">
              <div className="text-[10px] tracking-[0.18em] uppercase text-[var(--gold-400)] font-semibold mb-2">
                {lang === "ES" ? "Acceso abierto" : "Open Access"}
              </div>
              <div className="flex items-center gap-2 text-[12px] text-[var(--forest-300)]">
                <span className="w-1.5 h-1.5 bg-[var(--gold-400)] rounded-full"></span>
                {frontmatter.license}
              </div>
            </div>
          </div>
        </div>

        {/* Golden bottom rule */}
        <div className="h-1 bg-gradient-to-r from-[var(--gold-500)] via-[var(--gold-400)] to-[var(--gold-500)]"></div>
      </header>

      {/* ============ DISEÑO PRINCIPAL ============ */}
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10 w-full flex-grow">
        <div className="grid grid-cols-12 gap-8 lg:gap-14 py-12 lg:py-20">
          <TocSidebar />

          <main className="col-span-12 lg:col-span-9 max-w-[720px] w-full">
            {children}
          </main>
        </div>
      </div>

      {/* ============ PIE DE PÁGINA ============ */}
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
                    {lang === "ES" ? "División de Investigación" : "Research Division"}
                  </div>
                </div>
              </div>
              <p className="font-display text-[20px] leading-[1.4] text-[var(--paper)] max-w-md">
                {lang === "ES"
                  ? "Construyendo el vocabulario compartido para la capa física de la inteligencia artificial."
                  : "Building the shared vocabulary for the physical layer of artificial intelligence."}
              </p>
              <div className="mt-6 text-[12px] text-[var(--forest-300)]">
                © 2025 PhysaFlow, Inc. {lang === "ES" ? "Este informe está licenciado bajo" : "This report is licensed under"}{" "}
                <a href="#" className="ulink text-[var(--gold-400)]">
                  {frontmatter.license}
                </a>
                .
              </div>
            </div>

            <div className="md:col-span-3">
              <div className="eyebrow-gold mb-4">{lang === "ES" ? "Informe" : "Report"}</div>
              <ul className="space-y-2.5 text-[13px] text-[var(--forest-300)]">
                <li>
                  <a href="#abstract" className="hover:text-[var(--paper)] transition">
                    {lang === "ES" ? "Resumen" : "Abstract"}
                  </a>
                </li>
                <li>
                  <a href="#taxonomy" className="hover:text-[var(--paper)] transition">
                    {lang === "ES" ? "Taxonomía" : "Taxonomy"}
                  </a>
                </li>
                <li>
                  <a href="#methodology" className="hover:text-[var(--paper)] transition">
                    {lang === "ES" ? "Metodología" : "Methodology"}
                  </a>
                </li>
                <li>
                  <a href="#figures" className="hover:text-[var(--paper)] transition">
                    {lang === "ES" ? "Figuras" : "Figures"}
                  </a>
                </li>
                <li>
                  <a href="#cite" className="hover:text-[var(--paper)] transition">
                    {lang === "ES" ? "Cómo citar" : "How to cite"}
                  </a>
                </li>
              </ul>
            </div>

            <div className="md:col-span-2">
              <div className="eyebrow-gold mb-4">{lang === "ES" ? "Recursos" : "Resources"}</div>
              <ul className="space-y-2.5 text-[13px] text-[var(--forest-300)]">
                <li>
                  <a href={csvUrl} className="hover:text-[var(--paper)] transition text-left block">
                    {lang === "ES" ? "Conjunto de datos (CSV)" : "Dataset (CSV)"}
                  </a>
                </li>
                <li>
                  <button onClick={() => showToast(lang === "ES" ? "Descargando figuras SVG..." : "Downloading SVG figures...")} className="hover:text-[var(--paper)] transition text-left cursor-pointer">
                    {lang === "ES" ? "Figuras (SVG)" : "Figures (SVG)"}
                  </button>
                </li>
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

      {/* ============ TOAST NOTIFICATION ============ */}
      {toastMessage && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-[var(--forest-800)] text-[var(--paper)] px-5 py-3 rounded-sm text-[13px] tracking-wide border-l-2 border-[var(--gold-500)] shadow-lg transition-all animate-in fade-in slide-in-from-bottom-5 duration-300 z-50">
          {toastMessage}
        </div>
      )}
    </div>
  );
}
