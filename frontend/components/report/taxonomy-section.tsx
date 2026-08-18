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

function parseTaxonomyContent(content: string) {
  const parts = content.split(/^###\s+/m);
  const mainIntro = parts[0] || "";

  const layers = parts.slice(1).map((part) => {
    const firstLineEnd = part.indexOf("\n");
    const title = firstLineEnd >= 0 ? part.substring(0, firstLineEnd).trim() : part.trim();
    const body = firstLineEnd >= 0 ? part.substring(firstLineEnd + 1).trim() : "";
    return { title, body };
  });

  return { mainIntro, layers };
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
