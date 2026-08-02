"use client";

import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import DiagramaCapas, { Layer, LabelTranslations } from "./DiagramaCapas";
import { slugify } from "@/lib/utils";
import CitationBlock from "./CitationBlock";
import StepCard from "./StepCard";
import Chart from "./Chart";

interface DynamicReportContentProps {
  content: string;
  lang: string;
  frontmatter: {
    title: string;
    subtitle?: string;
    author: string;
    published: string;
    doi: string;
    readingTime: string;
    license: string;
    medianaGlobal: string;
    lossFacilities: string;
    lossIT: string;
    lossWorkload: string;
    layers: Layer[];
    labels: LabelTranslations;
    methodologySteps?: Array<{ num: string; title: string; borderColor?: string; text: string }>;
  };
}

function extractText(node: unknown): string {
  if (typeof node === "string") return node;
  if (typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(extractText).join("");
  if (React.isValidElement(node)) {
    const typeObj = node.type as { name?: string } | string;
    const tagName = typeof typeObj === "string" ? typeObj : typeObj?.name || "";
    const propsObj = node.props as { children?: unknown };
    const childrenText = propsObj && propsObj.children ? extractText(propsObj.children) : "";
    return tagName ? `<${tagName}>${childrenText}</${tagName}>` : childrenText;
  }
  return "";
}

// Verifica si un conjunto de nodos de React contiene componentes de bloque para evitar anidarlos en <p>
function hasBlockComponent(children: unknown): boolean {
  if (!children) return false;
  const nodes = Array.isArray(children) ? children : [children];
  return nodes.some((node: unknown) => {
    if (!node) return false;
    if (React.isValidElement(node)) {
      const typeObj = node.type as { name?: string } | string;
      const typeStr = typeof typeObj === "string" ? typeObj : typeObj?.name || "";
      const lower = typeStr.toLowerCase();
      if (
        lower.includes("chart") ||
        lower.includes("diagrama") ||
        lower.includes("step") ||
        lower.includes("citation") ||
        lower.includes("div") ||
        lower.includes("figure")
      ) {
        return true;
      }
      const propsObj = node.props as { children?: unknown };
      if (propsObj && propsObj.children) {
        return hasBlockComponent(propsObj.children);
      }
    }
    return false;
  });
}

export default function DynamicReportContent({
  content,
  lang,
  frontmatter,
}: DynamicReportContentProps) {
  const {
    title,
    author,
    published,
    doi,
    medianaGlobal,
    lossFacilities,
    lossIT,
    lossWorkload,
    layers,
    labels,
    methodologySteps = [],
  } = frontmatter;

  const yearMatch = published?.match(/\d{4}/);
  const citationYear = yearMatch ? yearMatch[0] : "2025";

  const renderDiagramaCapas = () => (
    <div className="my-10">
      <DiagramaCapas
        lang={lang}
        lossFacilities={lossFacilities}
        lossIT={lossIT}
        lossWorkload={lossWorkload}
        layers={layers}
        labels={labels}
      />
    </div>
  );

  const renderStepCards = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-10">
      {methodologySteps.map((step, i) => (
        <StepCard
          key={i}
          num={step.num}
          title={step.title}
        >
          {step.text}
        </StepCard>
      ))}
    </div>
  );

  const renderCitationBlock = () => (
    <div className="my-10">
      <CitationBlock
        author={author}
        title={title}
        year={citationYear}
        doi={doi}
        medianaGlobal={medianaGlobal}
        labels={labels}
      />
    </div>
  );

  // Si el contenido trae la cabecera YAML frontmatter (empieza con ---), la removemos para renderizar solo el cuerpo MDX
  let bodyOnly = content;
  if (bodyOnly.trim().startsWith("---")) {
    const parts = bodyOnly.split("---");
    if (parts.length >= 3) {
      bodyOnly = parts.slice(2).join("---");
    }
  }

  const processedContent = bodyOnly
    .replace(/<DiagramaCapas\s*\/?>/gi, "<DiagramaCapas></DiagramaCapas>")
    .replace(/<StepCards\s*\/?>/gi, "<StepCards></StepCards>")
    .replace(/<CitationBlock\s*\/?>/gi, "<CitationBlock></CitationBlock>");

  return (
    <div className="prose prose-slate max-w-none dark:prose-invert">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw]}
        components={
          {
            diagramacapas: renderDiagramaCapas,
            DiagramaCapas: renderDiagramaCapas,
            stepcards: renderStepCards,
            StepCards: renderStepCards,
            stepcard: StepCard,
            StepCard: StepCard,
            citationblock: renderCitationBlock,
            CitationBlock: renderCitationBlock,
            chart: Chart,
            Chart: Chart,

          p: ({ children }: { children?: React.ReactNode }) => {
            const rawText = extractText(children).toLowerCase().trim();

            if (
              rawText.includes("diagramacapas") ||
              rawText.includes("diagrama interactivo de capas")
            ) {
              return renderDiagramaCapas();
            }

            if (
              rawText.includes("stepcards") ||
              rawText.includes("tarjetas de pasos")
            ) {
              return renderStepCards();
            }

            if (
              rawText.includes("citationblock") ||
              rawText.includes("bloque interactivo de citas")
            ) {
              return renderCitationBlock();
            }

            if (hasBlockComponent(children)) {
              return <>{children}</>;
            }

            const isIntroFirstParagraph = rawText.startsWith("durante la última década") || rawText.startsWith("durante la ultima decada");
            if (isIntroFirstParagraph) {
              return (
                <p className="dropcap text-[17px] leading-[1.75] text-[var(--ink)] mb-6">
                  {children}
                </p>
              );
            }

            return (
              <p className="text-[15px] leading-[1.75] text-[var(--ink)] mb-6">
                {children}
              </p>
            );
          },
          h2: ({ children }: { children?: React.ReactNode }) => {
            const rawText = extractText(children);
            const slug = slugify(rawText);

            const match = rawText.match(/^(\d{2})\s*[\u2014-]\s*(.*)$/);
            const num = match ? match[1] : null;
            const sectionTitle = match ? match[2] : rawText;

            return (
              <div id={slug} className="pt-12 mb-8 border-t border-[var(--rule)] scroll-mt-24">
                {num ? (
                  <div className="flex items-baseline gap-4">
                    <span className="sec-num text-[24px] font-display font-light text-[var(--gold-500)]">
                      {num}
                    </span>
                    <span className="eyebrow text-[12px] font-semibold tracking-[0.18em] uppercase text-[var(--forest-600)]">
                      {sectionTitle}
                    </span>
                  </div>
                ) : (
                  <h2 className="font-display text-[32px] lg:text-[38px] font-bold text-[var(--forest-900)]">
                    {children}
                  </h2>
                )}
              </div>
            );
          },
          h3: ({ children }: { children?: React.ReactNode }) => (
            <h3 className="font-display text-[28px] lg:text-[34px] leading-[1.1] tracking-[-0.01em] text-[var(--forest-800)] font-semibold mt-4 mb-6">
              {children}
            </h3>
          ),
          blockquote: ({ children }: { children?: React.ReactNode }) => (
            <blockquote className="pullquote my-8 p-6 bg-[var(--forest-50)]/30 border-l-2 border-[var(--gold-500)] rounded-r-sm italic text-[17px] text-[var(--forest-900)] leading-relaxed font-serif">
              {children}
            </blockquote>
          ),
          hr: () => <hr className="my-10 border-t border-[var(--rule-soft)]" />,
        } as Record<string, React.ComponentType<unknown>>}
      >
        {processedContent}
      </ReactMarkdown>
    </div>
  );
}
