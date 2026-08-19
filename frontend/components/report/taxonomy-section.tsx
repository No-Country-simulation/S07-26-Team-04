"use client";

import type { Taxonomy } from "@/types/taxonomy";
import { useEffect, useState } from "react";
import { getTaxonomy } from "@/services/report.service";
import SectionContent from "./section-content";
import { Card } from "./card";
import {
  parseSubsectionCards,
  parseTaxonomyContent,
} from "./taxonomy-parse";

export function TaxonomySection({ reportId }: { reportId?: string } = {}) {
  const [taxonomy, setTaxonomy] = useState<Taxonomy | null>(null);

  useEffect(() => {
    async function fetchTaxonomy() {
      try {
        const data = await getTaxonomy(reportId);
        setTaxonomy(data);
      } catch (error) {
        console.error("Error fetching taxonomy data:", error);
      }
    }

    fetchTaxonomy();
  }, [reportId]);

  const sectionsList = taxonomy?.sections || [];
  const mainTaxonomy = sectionsList.find(
    (section) =>
      section.id.includes("taxonomia") ||
      section.title.toLowerCase().includes("taxonomía") ||
      section.title.toLowerCase().includes("taxonomia")
  );

  const { mainIntro, layers } = parseTaxonomyContent(mainTaxonomy?.content || "");

  return (
    <section id="taxonomy" className="report-section space-y-12">
      {/* Encabezado Principal de la Sección 03 */}
      <div className="report-section-header">
        <span className="section-number">03</span>
        <div>
          <h2 className="section-title">
            {mainTaxonomy?.title ? mainTaxonomy.title.replace(/^\d+\s+[—-]\s*/i, "") : "Descripción general de la taxonomía"}
          </h2>
          <SectionContent content={mainIntro || "No se encontró la descripción de la taxonomía."} />
        </div>
      </div>

      {/* Renderizado Estilizado por Capas (L1, L2, L3) usando las Cards de Erika */}
      {layers.map((layer, index) => {
        const defaultBadge = index === 0 ? "F" : index === 1 ? "I" : "W";
        const { intro, cards } = parseSubsectionCards(layer.body, defaultBadge);

        return (
          <div key={index} className="report-layer-block space-y-6 pt-6 border-t border-[var(--gold)]/20">
            <div>
              <h3 className="text-xl font-serif text-[var(--warm-white)] font-bold mb-2">
                {layer.title}
              </h3>
              {intro && <SectionContent content={intro} />}
            </div>

            {/* Grid de Tarjetas de Operador */}
            <div className="space-y-4">
              {cards.map((card) => (
                <Card
                  key={card.id}
                  badge={card.badge}
                  code={card.code}
                  mediana={card.mediana}
                  title={card.title}
                  queSeVe={card.queSeVe}
                  cuantoCuesta={card.cuantoCuesta}
                  porQueOcurre={card.porQueOcurre}
                  labels={card.labels}
                />
              ))}
            </div>
          </div>
        );
      })}
    </section>
  );
}
