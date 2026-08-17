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
    <section className="report-hero relative overflow-hidden w-full">
      {/* Full-width Background Organic Wave SVG */}
      <div className="absolute inset-0 pointer-events-none z-0 opacity-30 w-full h-full">
        <svg
          className="w-full h-full object-cover"
          viewBox="0 0 1440 800"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="waveGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#2d5f47" stopOpacity="0.8" />
              <stop offset="50%" stopColor="#1a4d3a" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#0b3d2e" stopOpacity="0.1" />
            </linearGradient>
            <linearGradient id="waveGrad2" x1="0%" y1="100%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#7ba78c" stopOpacity="0.5" />
              <stop offset="70%" stopColor="#2d5f47" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#c9a227" stopOpacity="0.15" />
            </linearGradient>
            <linearGradient id="waveGrad3" x1="100%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#1a4d3a" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#062a20" stopOpacity="0.9" />
            </linearGradient>
          </defs>

          {/* Top organic wave layer */}
          <path
            d="M0,0 C320,120 480,180 720,100 C960,20 1200,80 1440,0 L1440,0 L0,0 Z"
            fill="url(#waveGrad1)"
          />

          {/* Middle flowing curve */}
          <path
            d="M-100,250 C200,100 500,380 900,220 C1250,80 1400,300 1540,200 L1540,800 L-100,800 Z"
            fill="url(#waveGrad2)"
          />

          {/* Bottom smooth wave sweep */}
          <path
            d="M0,450 C350,300 650,550 1050,400 C1300,300 1400,480 1440,520 L1440,800 L0,800 Z"
            fill="url(#waveGrad3)"
          />

          {/* Elegant accent line wave */}
          <path
            d="M0,320 C400,180 700,420 1100,280 C1300,200 1400,340 1440,320"
            stroke="#ecc246"
            strokeWidth="1.5"
            strokeOpacity="0.25"
            fill="none"
          />
        </svg>
      </div>

      {/* Hero Text Content Container */}
      <div className="mx-auto max-w-[1400px] lg:px-40 relative z-10 w-full">
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
      </div>
    </section>
  );
}
