"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

const linksES = [
  { id: "abstract", label: "01 — Resumen" },
  { id: "intro", label: "02 — Introducción" },
  { id: "taxonomy", label: "03 — Descripción general" },
  { id: "facility", label: "03.1 — Capa de instalaciones" },
  { id: "it", label: "03.2 — Capa de TI" },
  { id: "workload", label: "03.3 — Capa de carga" },
  { id: "methodology", label: "04 — Metodología" },
  { id: "figures", label: "05 — Figuras y descargas" },
  { id: "cite", label: "06 — Cómo citar" },
];

const linksEN = [
  { id: "abstract", label: "01 — Abstract" },
  { id: "intro", label: "02 — Introduction" },
  { id: "taxonomy", label: "03 — Taxonomy overview" },
  { id: "facility", label: "03.1 — Facilities layer" },
  { id: "it", label: "03.2 — IT layer" },
  { id: "workload", label: "03.3 — Workload layer" },
  { id: "methodology", label: "04 — Methodology" },
  { id: "figures", label: "05 — Figures & downloads" },
  { id: "cite", label: "06 — How to cite" },
];

export default function TocSidebar() {
  const searchParams = useSearchParams();
  const lang = (searchParams.get("lang") || "es").toUpperCase();
  const links = lang === "EN" ? linksEN : linksES;

  const [activeSection, setActiveSection] = useState<string>("abstract");

  useEffect(() => {
    const sectionIds = links.map((l) => l.id);
    const elements = sectionIds
      .map((id) => document.getElementById(id))
      .filter((el) => el !== null) as HTMLElement[];

    const observerOptions = {
      rootMargin: "-20% 0px -60% 0px",
      threshold: 0,
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    }, observerOptions);

    elements.forEach((el) => observer.observe(el));

    return () => {
      elements.forEach((el) => observer.unobserve(el));
    };
  }, [links]);

  return (
    <aside className="hidden lg:block col-span-3 no-print">
      <div className="sticky top-24">
        <div className="eyebrow mb-4">
          {lang === "EN" ? "Contents" : "Contenido"}
        </div>
        <nav className="space-y-1.5 text-[13px] border-l border-[var(--rule-soft)] pl-4">
          {links.map((link) => (
            <a
              key={link.id}
              href={`#${link.id}`}
              className={`toc-link block pl-3 py-1 border-l transition-all ${
                activeSection === link.id
                  ? "active text-[var(--forest-700)] border-[var(--forest-700)] font-medium"
                  : "text-[var(--ink-muted)] border-transparent hover:text-[var(--forest-700)] hover:border-[var(--gold-500)]"
              }`}
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="mt-10 pt-6 border-t border-[var(--rule-soft)]">
          <div className="eyebrow-gold mb-3">
            {lang === "EN" ? "Key finding" : "Hallazgo clave"}
          </div>
          <p className="font-display text-[15px] leading-[1.4] text-[var(--ink)]">
            {lang === "EN" ? (
              <>
                <span className="stat-num text-[var(--forest-700)]">31.4%</span> of paid, energized capacity in hyperscale facilities does not produce useful compute in any given hour.
              </>
            ) : (
              <>
                El <span className="stat-num text-[var(--forest-700)]">31,4%</span> de la capacidad energizada pagada en instalaciones hiperescala no produce ningún cómputo útil en una hora determinada.
              </>
            )}
          </p>
        </div>
      </div>
    </aside>
  );
}
