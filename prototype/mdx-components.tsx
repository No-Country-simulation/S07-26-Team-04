import type { MDXComponents } from "mdx/types";
import React from "react";

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    h1: ({ children }) => (
      <h1 className="font-display font-light text-[var(--forest-800)] text-3xl sm:text-4xl lg:text-5xl mt-12 mb-6 leading-tight">
        {children}
      </h1>
    ),
    h2: ({ children }) => {
      // If header is like "01 — Resumen" or "02 — Introducción", split to show numbering
      const text = children?.toString() || "";
      const match = text.match(/^(\d+(\.\d+)?)\s*—\s*(.*)$/);
      if (match) {
        const num = match[1];
        const headingId = 
          num === "01" ? "abstract" :
          num === "02" ? "intro" :
          num === "03" ? "taxonomy" :
          num === "03.1" ? "facility" :
          num === "03.2" ? "it" :
          num === "03.3" ? "workload" :
          num === "04" ? "methodology" :
          num === "05" ? "figures" :
          num === "06" ? "cite" : undefined;

        return (
          <div className="flex items-baseline gap-4 mt-16 mb-4 reveal scroll-mt-24" id={headingId}>
            <span className="sec-num text-[22px] font-display font-light text-[var(--gold-500)]">{match[1]}</span>
            <span className="eyebrow">{match[3]}</span>
          </div>
        );
      }
      return (
        <h2 className="font-display font-light text-[var(--forest-800)] text-2xl sm:text-3xl mt-12 mb-4 leading-tight">
          {children}
        </h2>
      );
    },
    h3: ({ children }) => (
      <h3 className="font-display text-[26px] lg:text-[34px] leading-[1.1] tracking-[-0.01em] text-[var(--forest-800)] mb-6">
        {children}
      </h3>
    ),
    h4: ({ children }) => (
      <h4 className="font-display text-[22px] text-[var(--forest-800)] font-medium mb-2">
        {children}
      </h4>
    ),
    p: ({ children }) => (
      <p className="text-[15px] leading-[1.75] text-[var(--ink)] mb-6 font-normal">
        {children}
      </p>
    ),
    ul: ({ children }) => (
      <ul className="list-disc list-inside space-y-2 mb-6 pl-4 text-[15px] leading-[1.75] text-[var(--ink)]">
        {children}
      </ul>
    ),
    ol: ({ children }) => (
      <ol className="list-decimal list-inside space-y-2 mb-6 pl-4 text-[15px] leading-[1.75] text-[var(--ink)]">
        {children}
      </ol>
    ),
    li: ({ children }) => (
      <li className="text-[15px] leading-[1.75] text-[var(--ink)]">
        {children}
      </li>
    ),
    strong: ({ children }) => (
      <strong className="font-semibold text-[var(--forest-800)]">
        {children}
      </strong>
    ),
    em: ({ children }) => (
      <em className="italic text-[var(--ink)]">
        {children}
      </em>
    ),
    hr: () => <hr className="my-12 border-t border-[var(--rule-soft)]" />,
    ...components,
  };
}
