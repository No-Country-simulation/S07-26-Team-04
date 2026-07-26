"use client";

import React, { useState } from "react";

interface CitationBlockProps {
  author?: string;
  title?: string;
  year?: string;
  doi?: string;
  medianaGlobal?: string;
  labels?: Record<string, string | undefined>;
  onShowToast?: (msg: string) => void;
}

export default function CitationBlock({
  author = "Marín, A.",
  title = "The Stranded Capacity Index",
  year = "2025",
  doi = "physaflow/sci-2025-001",
  medianaGlobal = "31,4%",
  labels = {},
  onShowToast,
}: CitationBlockProps) {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const t = {
    citeAcademic: labels.citeAcademic || "Académico (APA 7)",
    citeJournalistic: labels.citeJournalistic || "Periodístico",
    citeBibtex: labels.citeBibtex || "BibTeX",
    citeCopy: labels.citeCopy || "Copiar",
    citeCopied: labels.citeCopied || "Copiado",
    citeToast: labels.citeToast || "Copiado al portapapeles con éxito.",
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedId(id);
      if (onShowToast) {
        onShowToast(t.citeToast);
      }
      setTimeout(() => setCopiedId(null), 1800);
    });
  };

  const citations = {
    apa: `${author} (${year}). ${title}: A named taxonomy of paid, energized, and unproductive infrastructure across the three physical layers of the modern data center. PhysaFlow Research, Vol. I. https://doi.org/${doi}`,
    journalistic: `Según el Índice de Capacidad Varada de PhysaFlow (${year}), el ${medianaGlobal} de la capacidad energizada pagada en centros de datos hiperescala no produce ningún cómputo útil en una hora determinada. El informe nombra nueve modos de fallo en las capas de instalaciones, TI y carga de trabajo.`,
    bibtex: `@techreport{marin${year}sci,\n  author      = {${author}},\n  title       = {${title}},\n  institution = {PhysaFlow Research},\n  year        = {${year}},\n  number      = {Vol. I, Rev. 1.0},\n  doi         = {${doi}},\n  license     = {CC BY-SA 4.0}\n}`
  };

  return (
    <div className="space-y-4">
      {/* Académico */}
      <div className="cite-box p-5 lg:p-6 rounded-sm">
        <div className="flex items-center justify-between mb-3">
          <span className="eyebrow">{t.citeAcademic}</span>
          <button
            onClick={() => handleCopy("apa", citations.apa)}
            className="text-[11px] font-medium text-[var(--forest-700)] hover:text-[var(--forest-800)] flex items-center gap-1.5 transition"
          >
            {copiedId === "apa" ? (
              <>
                <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
                  <path d="M3 8l3 3 7-7" stroke="currentColor" strokeWidth="1.6" />
                </svg>
                {t.citeCopied}
              </>
            ) : (
              <>
                <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
                  <rect x="4" y="4" width="9" height="9" stroke="currentColor" strokeWidth="1.3" />
                  <path d="M3 11V3h8" stroke="currentColor" strokeWidth="1.3" fill="none" />
                </svg>
                {t.citeCopy}
              </>
            )}
          </button>
        </div>
        <p className="font-mono text-[12.5px] leading-[1.7] text-[var(--ink)]">
          {citations.apa}
        </p>
      </div>

      {/* Periodístico */}
      <div className="cite-box p-5 lg:p-6 rounded-sm">
        <div className="flex items-center justify-between mb-3">
          <span className="eyebrow">{t.citeJournalistic}</span>
          <button
            onClick={() => handleCopy("journalistic", citations.journalistic)}
            className="text-[11px] font-medium text-[var(--forest-700)] hover:text-[var(--forest-800)] flex items-center gap-1.5 transition"
          >
            {copiedId === "journalistic" ? (
              <>
                <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
                  <path d="M3 8l3 3 7-7" stroke="currentColor" strokeWidth="1.6" />
                </svg>
                {t.citeCopied}
              </>
            ) : (
              <>
                <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
                  <rect x="4" y="4" width="9" height="9" stroke="currentColor" strokeWidth="1.3" />
                  <path d="M3 11V3h8" stroke="currentColor" strokeWidth="1.3" fill="none" />
                </svg>
                {t.citeCopy}
              </>
            )}
          </button>
        </div>
        <p className="font-mono text-[12.5px] leading-[1.7] text-[var(--ink)]">
          {citations.journalistic}
        </p>
      </div>

      {/* BibTeX */}
      <div className="cite-box p-5 lg:p-6 rounded-sm">
        <div className="flex items-center justify-between mb-3">
          <span className="eyebrow">{t.citeBibtex}</span>
          <button
            onClick={() => handleCopy("bibtex", citations.bibtex)}
            className="text-[11px] font-medium text-[var(--forest-700)] hover:text-[var(--forest-800)] flex items-center gap-1.5 transition"
          >
            {copiedId === "bibtex" ? (
              <>
                <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
                  <path d="M3 8l3 3 7-7" stroke="currentColor" strokeWidth="1.6" />
                </svg>
                {t.citeCopied}
              </>
            ) : (
              <>
                <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
                  <rect x="4" y="4" width="9" height="9" stroke="currentColor" strokeWidth="1.3" />
                  <path d="M3 11V3h8" stroke="currentColor" strokeWidth="1.3" fill="none" />
                </svg>
                {t.citeCopy}
              </>
            )}
          </button>
        </div>
        <pre className="font-mono text-[12px] leading-[1.6] text-[var(--ink)] bg-[var(--paper-2)] p-4 rounded-sm border border-[var(--rule-soft)] overflow-x-auto">
          <code>{citations.bibtex}</code>
        </pre>
      </div>
    </div>
  );
}
