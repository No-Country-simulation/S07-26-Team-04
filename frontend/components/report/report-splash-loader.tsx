"use client";

import { useEffect, useState } from "react";
import { SlidingNumber } from "@/components/animate-ui/primitives/texts/sliding-number";

interface SplashLoaderProps {
  isLoading: boolean;
}

export function ReportSplashLoader({ isLoading }: SplashLoaderProps) {
  const [shouldRender, setShouldRender] = useState(true);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Animate progress to 90% while loading
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 90) {
          clearInterval(interval);
          return 90;
        }
        return prev + 15;
      });
    }, 150);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!isLoading) {
      const timerProgress = setTimeout(() => {
        setProgress(100);
      }, 0);

      const timerExit = setTimeout(() => {
        setIsTransitioning(true);
      }, 300);

      const timerUnmount = setTimeout(() => {
        setShouldRender(false);
      }, 1000);

      return () => {
        clearTimeout(timerProgress);
        clearTimeout(timerExit);
        clearTimeout(timerUnmount);
      };
    }
  }, [isLoading]);

  if (!shouldRender) return null;

  return (
    <div
      className={`fixed inset-0 z-[100] bg-[#0d0e0b] flex flex-col items-center justify-center transition-all duration-700 ease-in-out ${
        isTransitioning
          ? "opacity-0 pointer-events-none backdrop-blur-none scale-105"
          : "opacity-100 backdrop-blur-xl scale-100"
      }`}
    >
      {/* Background ambient forest green aura */}
      <div className="absolute w-[500px] h-[500px] bg-[#2d5f47]/30 rounded-full blur-3xl animate-pulse pointer-events-none" />

      {/* Center animated logo emblem */}
      <div
        className={`flex flex-col items-center transition-all duration-700 ease-out transform ${
          isTransitioning
            ? "-translate-y-12 scale-90 opacity-0"
            : "translate-y-0 scale-100 opacity-100"
        }`}
      >
        {/* Brand Title */}
        <h2 className="text-3xl lg:text-4xl font-bold tracking-tight text-[#e5e2da] mb-1 font-sans">
          PhysaFlow
        </h2>

        <p className="text-xs font-mono font-semibold uppercase tracking-[0.25em] text-[#c6a13a] mb-6">
          Investigación de Infraestructura
        </p>

        {/* Sliding Number Indicator from Animate UI */}
        <div className="flex items-center gap-1 font-mono font-bold text-lg text-[#ecc246] mb-4">
          <SlidingNumber number={progress} />
          <span>%</span>
        </div>

        {/* Golden Progress Line */}
        <div className="w-48 h-1 bg-[#1a382a] rounded-full overflow-hidden relative border border-[#c9a227]/20 shadow-inner">
          <div
            className="h-full bg-gradient-to-r from-[#c9a227] via-[#ecc246] to-[#ffffff] transition-all duration-300 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  );
}
