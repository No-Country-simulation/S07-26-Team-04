"use client";

import type { Taxonomy } from "@/types/taxonomy";
import { useEffect, useState } from "react";
import { getTaxonomy } from "@/services/report.service";
import SectionContent from "./section-content";
import { Card } from "./card";

interface ParsedCardItem {
  id: string;
  badge: string;
  code: string;
  mediana: string;
  title: string;
  queSeVe: string;
  cuantoCuesta: string;
  porQueOcurre: string;
  labels: {
    visible: string;
    cost: string;
    reason: string;
  };
}

function parseSubsectionCards(content: string, layerBadge: string): { intro: string; cards: ParsedCardItem[] } {
  const cards: ParsedCardItem[] = [];
  const lines = content.split("\n");
  const introLines: string[] = [];

  let currentCard: Partial<ParsedCardItem> | null = null;

  for (const rawLine of lines) {
    const line = rawLine.trim();

    // Revisa si es inicio de una tarjeta (ej. - **F-01 (4,2%) — Deriva del pasillo frío**)
    const headerMatch = line.match(/^-\s*\*\*([A-Z]+-\d+)\s*(?:\(([^)]+)\))?\s*[—-]?\s*(.*?)\*\*/i);
    if (headerMatch) {
      if (currentCard && currentCard.code) {
        cards.push({
          id: currentCard.code,
          badge: currentCard.badge || layerBadge,
          code: currentCard.code,
          mediana: currentCard.mediana || "—",
          title: currentCard.title || "Sin título",
          queSeVe: currentCard.queSeVe || "No disponible",
          cuantoCuesta: currentCard.cuantoCuesta || "No disponible",
          porQueOcurre: currentCard.porQueOcurre || "No disponible",
          labels: currentCard.labels || {
            visible: "Qué se ve",
            cost: "Cuánto cuesta",
            reason: "Causa raíz",
          },
        });
      }

      const code = headerMatch[1].toUpperCase();
      const mediana = headerMatch[2] || "—";
      const title = headerMatch[3].trim();
      const badge = code.split("-")[0] || layerBadge;

      currentCard = {
        code,
        mediana,
        title,
        badge,
        queSeVe: "",
        cuantoCuesta: "",
        porQueOcurre: "",
        labels: {
          visible: "",
          cost: "",
          reason: "",
        },
      };
      continue;
    }

    if (currentCard) {
      const subBulletMatch = line.match(/^-\s*\*\*(.*?):\*\*\s*(.*)/);
      if (subBulletMatch) {
        const labelText = subBulletMatch[1].trim();
        const detailText = subBulletMatch[2].trim();

        if (!currentCard.queSeVe) {
          currentCard.queSeVe = detailText;
          currentCard.labels!.visible = labelText;
        } else if (!currentCard.cuantoCuesta) {
          currentCard.cuantoCuesta = detailText;
          currentCard.labels!.cost = labelText;
        } else {
          currentCard.porQueOcurre = detailText;
          currentCard.labels!.reason = labelText;
        }
        continue;
      }
    } else {
      introLines.push(rawLine);
    }
  }

  if (currentCard && currentCard.code) {
    cards.push({
      id: currentCard.code,
      badge: currentCard.badge || layerBadge,
      code: currentCard.code,
      mediana: currentCard.mediana || "—",
      title: currentCard.title || "Sin título",
      queSeVe: currentCard.queSeVe || "No disponible",
      cuantoCuesta: currentCard.cuantoCuesta || "No disponible",
      porQueOcurre: currentCard.porQueOcurre || "No disponible",
      labels: currentCard.labels || {
        visible: "Qué se ve",
        cost: "Cuánto cuesta",
        reason: "Causa raíz",
      },
    });
  }

  return {
    intro: introLines.join("\n").trim(),
    cards,
  };
}

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
  const section03Index = sectionsList.findIndex(
    (section) =>
      section.id.includes("taxonomia") ||
      section.title.toLowerCase().includes("taxonomía") ||
      section.title.toLowerCase().includes("taxonomia")
  );

  const mainTaxonomy = section03Index >= 0 ? sectionsList[section03Index] : null;

  // Subsecciones pertenecientes a la taxonomía (L1, L2, L3)
  const taxonomySubsections = sectionsList.filter((s, idx) => {
    if (section03Index < 0) return false;
    return idx > section03Index && !/^(04|05|06|07)\s*/.test(s.title) && !s.id.includes("04") && !s.id.includes("metodologia");
  });

  return (
    <section id="taxonomy" className="report-section space-y-12">
      {/* Encabezado Principal de la Sección 03 */}
      <div className="report-section-header">
        <span className="section-number">03</span>
        <div>
          <h2 className="section-title">
            {mainTaxonomy?.title ? mainTaxonomy.title.replace(/^\d+\s+[—-]\s*/i, "") : "Descripción general de la taxonomía"}
          </h2>
          <SectionContent content={mainTaxonomy?.content || "No se encontró la descripción de la taxonomía."} />
        </div>
      </div>

      {/* Renderizado Estilizado por Capas (L1, L2, L3) usando las Cards de Erika */}
      {taxonomySubsections.map((sub, index) => {
        const defaultBadge = index === 0 ? "F" : index === 1 ? "I" : "W";
        const { intro, cards } = parseSubsectionCards(sub.content, defaultBadge);

        return (
          <div key={sub.id} className="report-layer-block space-y-6 pt-6 border-t border-[var(--gold)]/20">
            <div>
              <h3 className="text-xl font-serif text-[var(--warm-white)] font-bold mb-2">
                {sub.title}
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
