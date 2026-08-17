"use client";

import { getMarkdownField } from "@/lib/content-parser";
import { getHero } from "@/services/report.service";
import type { Hero } from "@/types/hero";
import { useEffect, useState } from "react";

export function Hero() {
  const [heroes, setHeroes] = useState<Hero | null>(null);

  useEffect(() => {
    async function fetchHero() {
      try {
        const data = await getHero();
        setHeroes(data);
      } catch (error) {
        console.error("Error fetching hero data:", error);
      }
    }

    fetchHero();
  }, []);

  const author =
    getMarkdownField(heroes?.sections[0]?.content || "", "Autor") ||
    "Desconocido";

  const doi =
    getMarkdownField(heroes?.sections[0]?.content || "", "DOI") ||
    "Desconocido";

  const publishedAt =
    getMarkdownField(heroes?.sections[0]?.content || "", "Fecha") ||
    "Desconocido";

  return (
    <div className="mx-auto max-w-[800px] px-4 lg:px-0">
      <section className="report-hero">
        {/* Eyebrow */}
        <p className="eyebrow">INVESTIGACIÓN DE PhysaFlow</p>

        {/* Título */}
        <h1>{heroes?.title ?? "Título no disponible"}</h1>

        {/* Descripción */}
        <p className="hero-copy">
          {heroes?.description ?? "Descripción no disponible"}
        </p>

        {/* Metadata */}
        <div className="hero-meta">
          <div>
            <p className="text-[#c6a13a]">Autor</p>
            <strong>{author}</strong>
          </div>

          <div>
            <p className="text-[#c6a13a]">DOI</p>
            <strong>{doi}</strong>
          </div>

          <div>
            <p className="text-[#c6a13a]">Publicado</p>
            <strong>{publishedAt}</strong>
          </div>

          <div>
            <p className="text-[#c6a13a]">Versión</p>
            <strong>{heroes?.version ?? "Desconocido"}</strong>
          </div>
        </div>
      </section>
    </div>
  );
}
