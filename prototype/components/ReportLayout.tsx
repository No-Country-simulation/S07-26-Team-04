"use client";

import React, { useState } from "react";
import TocSidebar from "./TocSidebar";
import ChatAyudante from "./ChatAyudante";
import Navbar from "./Navbar";
import Hero from "./Hero";
import Footer from "./Footer";

interface ReportLayoutProps {
  lang: string;
  reportId?: string;
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
    keyFinding?: string;
  };
  tocItems?: Array<{ id: string; label: string }>;
  children: React.ReactNode;
}

export default function ReportLayout({
  lang,
  reportId,
  frontmatter,
  tocItems,
  children,
}: ReportLayoutProps) {
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

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadAllSvgs = () => {
    showToast("Descargando figuras SVG...");
    // Introduce small sequential delays to bypass browser multi-download blocks
    setTimeout(() => {
      document.getElementById("btn-download-fig2")?.click();
    }, 50);
    setTimeout(() => {
      document.getElementById("btn-download-fig3")?.click();
    }, 350);
  };

  const handleDownloadReport = () => {
    window.print();
  };

  const csvUrl = `/api/reporte/csv`;
  const bibtexUrl = `/api/reporte/bibtex`;

  return (
    <div className="flex flex-col min-h-screen">
      {/* ============ NAVEGACIÓN SUPERIOR ============ */}
      <Navbar
        onPrint={handlePrint}
        onDownload={handleDownloadReport}
      />

      {/* ============ HERO ============ */}
      <Hero frontmatter={frontmatter} />

      {/* ============ DISEÑO PRINCIPAL ============ */}
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10 w-full flex-grow">
        <div className="grid grid-cols-12 gap-8 lg:gap-14 py-12 lg:py-20">
          <TocSidebar items={tocItems} keyFinding={frontmatter.keyFinding} />

          <main className="col-span-12 lg:col-span-9 max-w-[720px] w-full">
            {children}
          </main>
        </div>
      </div>

      {/* ============ PIE DE PÁGINA ============ */}
      <Footer
        license={frontmatter.license}
        csvUrl={csvUrl}
        bibtexUrl={bibtexUrl}
        onDownloadAllSvgs={handleDownloadAllSvgs}
        tocItems={tocItems}
      />

      {/* ============ TOAST NOTIFICATION ============ */}
      {toastMessage && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-[var(--forest-800)] text-[var(--paper)] px-5 py-3 rounded-sm text-[13px] tracking-wide border-l-2 border-[var(--gold-500)] shadow-lg transition-all animate-in fade-in slide-in-from-bottom-5 duration-300 z-50">
          {toastMessage}
        </div>
      )}

      {/* ============ CHATBOT FLOAT ============ */}
      <ChatAyudante lang={lang} reportId={reportId} />
    </div>
  );
}
