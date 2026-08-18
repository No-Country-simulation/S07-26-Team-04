"use client";

import Link from "next/link";

import { Download } from "lucide-react";

const navigation = [
  {
    label: "Resumen",
    href: "#resumen",
  },
  {
    label: "Introducción",
    href: "#introduction",
  },
  {
    label: "Taxonomía",
    href: "#taxonomy",
  },
  {
    label: "Metodología",
    href: "#methodology",
  },
  {
    label: "Figuras",
    href: "#figures",
  },
  {
    label: "Conclusión",
    href: "#conclusion",
  },
  {
    label: "Citar",
    href: "#quote",
  },
];

const handlePrint = () => {
  window.print();
};

export function Header() {
  return (
    <header className="site-header">
      <div className="flex h-full items-center px-7">
        {/* Logo */}
        <Link href="/" className="brand brand-header">
          PhysaFlow
        </Link>

        {/* Navigation */}
        <nav className="top-nav">
          {navigation.map((item) => (
            <Link key={item.label} href={item.href} className="header-nav-link">
              {item.label}
            </Link>
          ))}
        </nav>

        {/* PDF */}
        <button
          onClick={handlePrint}
          type="button"
          className="header-download-btn"
        >
          <Download size={12} strokeWidth={2} />
          <span>Descargar informe</span>
        </button>
      </div>
    </header>
  );
}
