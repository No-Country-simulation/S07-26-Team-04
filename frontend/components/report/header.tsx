"use client";

import Link from "next/link";

import { useState, useEffect } from "react";

import { Download, Menu, X } from "lucide-react";

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
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  return (
    <>
      <header className="site-header">
        <div className="flex h-full items-center px-7">
          {/* Logo */}
          <Link href="/" className="brand brand-header">
            PhysaFlow
          </Link>

          {/* Navigation desktop */}
          <nav className="top-nav">
            {navigation.map((item) => (
              <Link key={item.label} href={item.href} className="header-nav-link">
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Download desktop */}
          <button
            onClick={handlePrint}
            type="button"
            className="header-download-btn"
          >
            <Download size={12} strokeWidth={2} />
            <span>Descargar informe</span>
          </button>

          {/* Hamburger mobile */}
          <button
            onClick={() => setMenuOpen(true)}
            type="button"
            className="header-hamburger"
            aria-label="Abrir menú"
          >
            <Menu size={20} strokeWidth={1.5} />
          </button>
        </div>
      </header>

      {/* Mobile overlay */}
      {menuOpen && (
        <div className="mobile-menu-overlay" onClick={() => setMenuOpen(false)} />
      )}

      {/* Mobile slide-out */}
      <div className={`mobile-menu ${menuOpen ? "mobile-menu--open" : ""}`}>
        <div className="mobile-menu-header">
          <Link href="/" className="brand brand-header" onClick={() => setMenuOpen(false)}>
            PhysaFlow
          </Link>

          <button
            onClick={() => setMenuOpen(false)}
            type="button"
            className="mobile-menu-close"
            aria-label="Cerrar menú"
          >
            <X size={20} strokeWidth={1.5} />
          </button>
        </div>

        <nav className="mobile-menu-nav">
          {navigation.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="mobile-menu-link"
              onClick={() => setMenuOpen(false)}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="mobile-menu-footer">
          <button
            onClick={() => {
              setMenuOpen(false);
              handlePrint();
            }}
            type="button"
            className="header-download-btn w-full justify-center"
          >
            <Download size={12} strokeWidth={2} />
            <span>Descargar informe</span>
          </button>
        </div>
      </div>
    </>
  );
}
