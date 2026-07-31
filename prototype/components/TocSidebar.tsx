"use client";

import React, { useEffect, useState } from "react";

export interface TocItem {
  id: string;
  label: string;
}

interface TocSidebarProps {
  items?: TocItem[];
  keyFinding?: string;
}

const defaultLinks: TocItem[] = [
  { id: "01--resumen", label: "01 — Resumen" },
  { id: "02--introduccin", label: "02 — Introducción" },
  { id: "03--descripcin-general-de-la-taxonoma", label: "03 — Descripción general" },
  { id: "facility", label: "03.1 — Capa de instalaciones" },
  { id: "it", label: "03.2 — Capa de TI" },
  { id: "workload", label: "03.3 — Capa de carga" },
  { id: "04--metodologa", label: "04 — Metodología" },
  { id: "05--figuras-y-descargas", label: "05 — Figuras y descargas" },
  { id: "06--cmo-citar", label: "06 — Cómo citar" },
];

export default function TocSidebar({ items, keyFinding }: TocSidebarProps) {
  const links = items && items.length > 0 ? items : defaultLinks;
  const [activeSection, setActiveSection] = useState<string>(links[0]?.id || "");

  const findingText =
    keyFinding ||
    "El 31,4% de la capacidad energizada pagada en instalaciones hiperescala no produce ningún cómputo útil en una hora determinada.";

  // Resaltar porcentajes dinámicamente con estilo stat-num
  const parts = findingText.split(/(\d+[,\.]?\d*\%)/g);

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
          Contenido
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
            Hallazgo clave
          </div>
          <p className="font-display text-[15px] leading-[1.4] text-[var(--ink)]">
            {parts.map((part, idx) =>
              /\d+[,\.]?\d*\%/.test(part) ? (
                <span key={idx} className="stat-num text-[var(--forest-700)] font-bold">
                  {part}
                </span>
              ) : (
                part
              )
            )}
          </p>
        </div>
      </div>
    </aside>
  );
}
