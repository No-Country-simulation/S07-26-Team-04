import React from "react";

interface HeroProps {
  lang: string;
  frontmatter: {
    title: string;
    subtitle: string;
    author: string;
    published: string;
    doi: string;
    readingTime: string;
    license: string;
  };
}

export default function Hero({ lang, frontmatter }: HeroProps) {
  const publishedYear = frontmatter.published.match(/\d{4}/)?.[0] || "2025";
  
  return (
    <header id="top" className="hero-forest relative overflow-hidden">
      <div className="hero-grain"></div>
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10 pt-16 pb-20 lg:pt-24 lg:pb-32 relative">
        <div className="flex items-center gap-3 mb-10">
          <span className="text-[10px] tracking-[0.22em] uppercase text-[var(--gold-400)] font-semibold">
            {lang === "ES" ? "Volumen I · Edición" : "Volume I · Edition"} {publishedYear}
          </span>
          <span className="w-8 h-px bg-[var(--gold-500)] opacity-50"></span>
          <span className="text-[10px] tracking-[0.22em] uppercase text-[var(--forest-300)] font-medium">
            {lang === "ES" ? "Informe Público" : "Public Report"}
          </span>
        </div>

        <h1 className="font-display font-light text-[var(--paper)] leading-[0.95] tracking-[-0.02em] text-[44px] sm:text-[64px] lg:text-[88px] max-w-[16ch]">
          {frontmatter.title}{" "}
          <span className="italic font-normal text-[var(--gold-400)]">
            {lang === "ES" ? "Varada" : "Stranded"}
          </span>
        </h1>

        <p className="font-display text-[var(--forest-300)] text-[18px] lg:text-[22px] leading-[1.5] mt-8 max-w-[58ch] font-light">
          {lang === "ES"
            ? "Una taxonomía nominal de infraestructura pagada, energizada y no productiva en las tres capas físicas del centro de datos moderno: instalaciones, TI y carga de trabajo."
            : "A named taxonomy of paid, energized, and unproductive infrastructure across the three physical layers of the modern data center: facilities, IT, and workload."}
        </p>

        <div className="mt-12 lg:mt-16 flex flex-wrap items-end gap-x-12 gap-y-6 pt-8 border-t border-[var(--forest-600)]/40">
          <div>
            <div className="text-[10px] tracking-[0.18em] uppercase text-[var(--forest-300)] font-medium mb-2">
              {lang === "ES" ? "Autor" : "Author"}
            </div>
            <div className="font-display text-[var(--paper)] text-[18px]">
              {frontmatter.author}
            </div>
            <div className="text-[12px] text-[var(--forest-300)] mt-0.5">
              PhysaFlow Founder
            </div>
          </div>
          <div>
            <div className="text-[10px] tracking-[0.18em] uppercase text-[var(--forest-300)] font-medium mb-2">
              {lang === "ES" ? "Publicado" : "Published"}
            </div>
            <div className="font-display text-[var(--paper)] text-[18px]">
              {frontmatter.published}
            </div>
            <div className="text-[12px] text-[var(--forest-300)] mt-0.5">
              Rev. 1.0 · DOI: {frontmatter.doi}
            </div>
          </div>
          <div>
            <div className="text-[10px] tracking-[0.18em] uppercase text-[var(--forest-300)] font-medium mb-2">
              {lang === "ES" ? "Tiempo de lectura" : "Reading Time"}
            </div>
            <div className="font-display text-[var(--paper)] text-[18px]">
              {frontmatter.readingTime}
            </div>
            <div className="text-[12px] text-[var(--forest-300)] mt-0.5">
              9 sections
            </div>
          </div>
          <div className="ml-auto hidden lg:block">
            <div className="text-[10px] tracking-[0.18em] uppercase text-[var(--gold-400)] font-semibold mb-2">
              {lang === "ES" ? "Acceso abierto" : "Open Access"}
            </div>
            <div className="flex items-center gap-2 text-[12px] text-[var(--forest-300)]">
              <span className="w-1.5 h-1.5 bg-[var(--gold-400)] rounded-full"></span>
              {frontmatter.license}
            </div>
          </div>
        </div>
      </div>

      {/* Golden bottom rule */}
      <div className="h-1 bg-gradient-to-r from-[var(--gold-500)] via-[var(--gold-400)] to-[var(--gold-500)]"></div>
    </header>
  );
}
