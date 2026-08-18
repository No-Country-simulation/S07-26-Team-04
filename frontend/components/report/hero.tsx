"use client";

import { getMarkdownField } from "@/lib/content-parser";
import { getHero } from "@/services/report.service";
import type { Hero } from "@/types/hero";
import { useEffect, useState } from "react";
import { ReportSplashLoader } from "./report-splash-loader";

export function Hero({ reportId }: { reportId?: string } = {}) {
  const [heroes, setHeroes] = useState<Hero | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchHero() {
      try {
        setLoading(true);
        const data = await getHero(reportId);
        setHeroes(data);
      } catch (error) {
        console.error("Error fetching hero data:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchHero();
  }, [reportId]);

  const author =
    getMarkdownField(heroes?.sections[0]?.content || "", "Autor");

  const doi =
    getMarkdownField(heroes?.sections[0]?.content || "", "DOI");

  const publishedAt =
    getMarkdownField(heroes?.sections[0]?.content || "", "Fecha");

  const readTime =
    getMarkdownField(heroes?.sections[0]?.content || "", "Tiempo de lectura") || "8 min";

  const license =
    getMarkdownField(heroes?.sections[0]?.content || "", "Licencia") || "CC BY-SA 4.0";

  return (
    <>
      <ReportSplashLoader isLoading={loading} />
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
        <div className="mx-auto max-w-[1000px] lg:px-8 relative z-10 w-full text-center">
          {/* Eyebrow */}
          <div className="flex justify-center items-center gap-2 mb-4">
            <p className="eyebrow !mb-0">INVESTIGACIÓN DE PhysaFlow</p>
          </div>

          {/* Título */}
          <h1>{heroes?.title ?? "Título no disponible"}</h1>

          {/* Descripción */}
          <p className="hero-copy">
            {heroes?.description ?? "Descripción no disponible"}
          </p>

          {/* Metadata */}
          <div className="hero-meta pt-10 mt-4">
            <div className="hero-meta-grid">
              <div className="hero-meta-item">
                <p className="hero-meta-label">Autor</p>
                <strong className="hero-meta-value">{author || "Autor no disponible"}</strong>
              </div>

              <div className="hero-meta-item">
                <p className="hero-meta-label">DOI</p>
                <strong className="hero-meta-value hero-meta-value--mono">{doi || "DOI no disponible"}</strong>
              </div>

              <div className="hero-meta-item">
                <p className="hero-meta-label">Publicado</p>
                <strong className="hero-meta-value">{publishedAt || "Fecha no disponible"}</strong>
              </div>

              <div className="hero-meta-item">
                <p className="hero-meta-label">Lectura</p>
                <strong className="hero-meta-value hero-meta-value--mono">{readTime}</strong>
              </div>

              <div className="hero-meta-item">
                <p className="hero-meta-label">Licencia</p>
                <strong className="hero-meta-value hero-meta-value--mono">{license}</strong>
              </div>

              <div className="hero-meta-item">
                <p className="hero-meta-label">Versión</p>
                <strong className="hero-meta-value hero-meta-value--version">v{heroes?.version ?? "1.0.0"}</strong>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
