import React from "react";
import Link from "next/link";

interface NavbarProps {
  onPrint?: () => void;
  onDownload?: () => void;
}

export default function Navbar({
  onPrint,
  onDownload,
}: NavbarProps) {
  return (
    <nav className="nav-blur sticky top-0 z-40 no-print">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 group">
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
              Investigación
            </div>
          </div>
        </Link>

        <div className="flex items-center gap-3">
          {/* Admin Panel Link */}
          <Link
            href="/admin"
            className="text-[12px] font-medium text-[var(--ink-muted)] hover:text-[var(--forest-700)] px-3 py-1.5 transition border border-transparent hover:border-[var(--rule-soft)] rounded-sm"
          >
            Admin
          </Link>

          {/* Print Button */}
          {onPrint && (
            <button
              onClick={onPrint}
              className="hidden sm:flex items-center gap-2 px-3 h-9 text-[12px] font-medium text-[var(--ink-muted)] hover:text-[var(--forest-700)] transition border border-[var(--rule)] rounded-sm cursor-pointer"
            >
              <svg width="13" height="13" viewBox="0 0 16 16" fill="none">
                <path d="M4 4V1h8v3M4 12H2V6h12v6h-2M5 12h6v3H5z" stroke="currentColor" strokeWidth="1.3" />
              </svg>
              PDF
            </button>
          )}

          {/* Download Button */}
          {onDownload && (
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
              Descargar Informe
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}
