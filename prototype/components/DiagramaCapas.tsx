"use client";

import React from "react";

interface TaxCardProps {
  badge: string;
  code: string;
  mediana: string;
  title: string;
  queSeVe: string;
  cuantoCuesta: string;
  porQueOcurre: string;
  badgeClass: string;
  labels: {
    visible: string;
    cost: string;
    reason: string;
  };
}

const TaxCard: React.FC<TaxCardProps> = ({
  badge,
  code,
  mediana,
  title,
  queSeVe,
  cuantoCuesta,
  porQueOcurre,
  badgeClass,
  labels,
}) => {
  return (
    <article className="tax-card p-6 lg:p-7 rounded-sm">
      <div className="flex items-start justify-between gap-4 mb-3">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <span className={`layer-badge ${badgeClass}`}>{badge} · {code}</span>
            <span className="font-mono text-[11px] text-[var(--ink-soft)]">~{mediana} mediana</span>
          </div>
          <h4 className="font-display text-[22px] text-[var(--forest-800)]">{title}</h4>
        </div>
        <div className="stat-num text-[28px] text-[var(--forest-700)] hidden sm:block">{mediana}</div>
      </div>
      <div className="grid md:grid-cols-3 gap-4 mt-4 text-[13px]">
        <div>
          <div className="eyebrow-gold mb-1.5">{labels.visible}</div>
          <p className="text-[var(--ink-muted)] leading-[1.6]">{queSeVe}</p>
        </div>
        <div>
          <div className="eyebrow-gold mb-1.5">{labels.cost}</div>
          <p className="text-[var(--ink-muted)] leading-[1.6]">{cuantoCuesta}</p>
        </div>
        <div>
          <div className="eyebrow-gold mb-1.5">{labels.reason}</div>
          <p className="text-[var(--ink-muted)] leading-[1.6]">{porQueOcurre}</p>
        </div>
      </div>
    </article>
  );
};

export interface Card {
  code: string;
  median?: string;
  mediana?: string;
  title: string;
  observed?: string;
  seVe?: string;
  cost?: string;
  cuesta?: string;
  reason?: string;
  ocurre?: string;
}

export interface Layer {
  id: string;
  level: string;
  title: string;
  subtitle: string;
  badgeClass?: string;
  intro: string;
  cards: Card[];
}

export interface LabelTranslations {
  visible: string;
  cost: string;
  reason: string;
  caption?: string;
  lossFacLabel?: string;
  lossFacSub?: string;
  lossITLabel?: string;
  lossITSub?: string;
  lossWLLabel?: string;
  lossWLSub?: string;
  [key: string]: string | undefined;
}

interface DiagramaCapasProps {
  lang?: string;
  lossFacilities?: string;
  lossIT?: string;
  lossWorkload?: string;
  layers?: Layer[];
  labels?: LabelTranslations;
}

export default function DiagramaCapas({
  lang = "ES",
  lossFacilities = "14,8%",
  lossIT = "9,7%",
  lossWorkload = "6,9%",
  layers = [],
  labels = { visible: "Qué se ve", cost: "Cuánto cuesta", reason: "Por qué ocurre" },
}: DiagramaCapasProps) {
  // Safe defaults if metadata is empty
  const hasData = layers && layers.length > 0;
  if (!hasData) {
    return null;
  }

  // Visual stack orders from L3 down to L1 (usually workload, IT, facility)
  // Let's filter or sort to ensure L3 is top, L2 is middle, L1 is bottom
  const stackOrder = [...layers].sort((a, b) => b.level.localeCompare(a.level));

  const safeLabels = {
    visible: labels.visible || "Qué se ve",
    cost: labels.cost || "Cuánto cuesta",
    reason: labels.reason || "Por qué ocurre",
  };

  return (
    <div className="space-y-12">
      {/* Visual representation of the 3 layers */}
      <figure className="mb-12 bg-[var(--paper-2)] border border-[var(--rule-soft)] p-6 lg:p-8 rounded-sm">
        <div className="flex flex-col gap-3">
          {stackOrder.map((layer, index) => (
            <React.Fragment key={layer.id}>
              <div className={`border p-5 rounded-sm ${
                layer.level === "L1" 
                  ? "border-[var(--forest-800)]/30 bg-[var(--forest-800)] text-[var(--paper)]"
                  : layer.level === "L2"
                  ? "border-[var(--gold-500)]/40 bg-[var(--gold-200)]/20"
                  : "border-[var(--forest-500)]/30 bg-[var(--forest-700)]/5"
              }`}>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <span className={`font-mono text-[11px] font-semibold ${
                      layer.level === "L1" ? "text-[var(--gold-400)]" : layer.level === "L2" ? "text-[var(--gold-700)]" : "text-[var(--forest-600)]"
                    }`}>{layer.level}</span>
                    <span className={`font-display text-[18px] ${layer.level === "L1" ? "text-[var(--paper)]" : "text-[var(--forest-800)]"}`}>
                      {layer.title}
                    </span>
                  </div>
                  <span className={`layer-badge ${
                    layer.level === "L1" ? "" : (layer.badgeClass || "")
                  }`} style={layer.level === "L1" ? { background: "rgba(201,169,97,0.18)", color: "var(--gold-400)" } : undefined}>
                    {layer.subtitle}
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-2 text-[12px]">
                  {layer.cards.map((card: Card) => (
                    <div 
                      key={card.code} 
                      className={`px-3 py-2 border-l-2 ${
                        layer.level === "L1"
                          ? "bg-[var(--forest-900)]/60 border-[var(--gold-500)] text-[var(--paper)]"
                          : layer.level === "L2"
                          ? "bg-[var(--paper)] border-[var(--gold-500)]"
                          : "bg-[var(--paper)] border-[var(--forest-500)]"
                      }`}
                    >
                      <strong>{card.title}</strong>
                    </div>
                  ))}
                </div>
              </div>
              {index < stackOrder.length - 1 && (
                <div className="flex justify-center">
                  <svg width="14" height="14" viewBox="0 0 14 14">
                    <path d="M7 0v12M3 8l4 4 4-4" stroke="#c9a961" strokeWidth="1.4" fill="none"/>
                  </svg>
                </div>
              )}
            </React.Fragment>
          ))}
        </div>
        <figcaption className="text-xs text-[var(--ink-muted)] mt-4 pt-2 border-t border-[var(--rule-soft)]">
          {labels.caption}
        </figcaption>
      </figure>

      {/* Stats indicators */}
      <div className="grid grid-cols-3 gap-4 mb-12">
        <div className="border-t-2 border-[var(--forest-700)] pt-4">
          <div className="stat-num text-[32px] sm:text-[36px] text-[var(--forest-700)]">{lossFacilities}</div>
          <div className="text-[10px] sm:text-[11px] uppercase tracking-wide text-[var(--ink-muted)] mt-1">{labels.lossFacLabel}</div>
          <div className="text-[11px] sm:text-[12px] text-[var(--ink-soft)] mt-1">{labels.lossFacSub}</div>
        </div>
        <div className="border-t-2 border-[var(--gold-500)] pt-4">
          <div className="stat-num text-[32px] sm:text-[36px] text-[var(--gold-700)]">{lossIT}</div>
          <div className="text-[10px] sm:text-[11px] uppercase tracking-wide text-[var(--ink-muted)] mt-1">{labels.lossITLabel}</div>
          <div className="text-[11px] sm:text-[12px] text-[var(--ink-soft)] mt-1">{labels.lossITSub}</div>
        </div>
        <div className="border-t-2 border-[var(--forest-500)] pt-4">
          <div className="stat-num text-[32px] sm:text-[36px] text-[var(--forest-600)]">{lossWorkload}</div>
          <div className="text-[10px] sm:text-[11px] uppercase tracking-wide text-[var(--ink-muted)] mt-1">{labels.lossWLLabel}</div>
          <div className="text-[11px] sm:text-[12px] text-[var(--ink-soft)] mt-1">{labels.lossWLSub}</div>
        </div>
      </div>

      {/* Dynamic Layer Sections (Facilities, IT, Workload) rendered in order L1 -> L2 -> L3 */}
      {[...layers].sort((a, b) => a.level.localeCompare(b.level)).map((layer: Layer) => (
        <div key={layer.id} id={layer.id} className="pt-10 border-t border-[var(--rule)] scroll-mt-24">
          <div className="flex items-baseline gap-4 mb-3">
            <span className="sec-num text-[18px]">{layer.level === "L1" ? "03.1" : layer.level === "L2" ? "03.2" : "03.3"}</span>
            <span className="eyebrow">{layer.title}</span>
          </div>
          <h3 className="font-display text-[26px] lg:text-[30px] text-[var(--forest-800)] mb-3">
            {layer.level === "L1" 
              ? (lang === "EN" ? "Where power enters the building." : "Donde la energía entra al edificio.")
              : layer.level === "L2"
              ? (lang === "EN" ? "Where racks meet the network." : "Donde los racks se encuentran con la red.")
              : (lang === "EN" ? "Where scheduler meets the user." : "Donde el programador se encuentra con el usuario.")
            }
          </h3>
          <p className="text-[14px] leading-[1.7] text-[var(--ink-muted)] mb-8">
            {layer.intro}
          </p>
          <div className="space-y-4">
            {layer.cards.map((card: Card) => (
              <TaxCard
                key={card.code}
                badge={layer.level}
                code={card.code}
                mediana={card.median || card.mediana || ""}
                title={card.title}
                queSeVe={card.observed || card.seVe || ""}
                cuantoCuesta={card.cost || card.cuesta || ""}
                porQueOcurre={card.reason || card.ocurre || ""}
                badgeClass={layer.badgeClass || ""}
                labels={safeLabels}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
