"use client";

import { Copy, Check } from "lucide-react";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import type { Citation } from "@/types/citation";
import { getCitation } from "@/services/report.service";
import SectionContent from "./section-content";

// const citationText =
//   "Cortez, H. (2026). El Índice de Capacidad Varada (SCI): Una taxonomía nominal de infraestructura pagada, energizada y no productiva en las tres capas físicas del centro de datos moderno. PhysaFlow. DOI: physaflow/sci-2025-001";

export function Citation() {
  const [copied, setCopied] = useState(false);
  const [citation, setCitation] = useState<Citation | null>(null);

  useEffect(() => {
    async function fetchCitation() {
      try {
        const data = await getCitation();
        console.log("Fetch citation data: ", data);
        setCitation(data);
      } catch (error) {
        console.error("Error fetching citation data:", error);
      }
    }

    fetchCitation();
  }, []);

  const infoCitation = citation?.sections.find(
    (section) => section.id === "06-como-citar",
  );

  if (!infoCitation) {
    return null;
  }

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(
        infoCitation?.content ?? "No disponible la cita",
      );

      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (error) {
      console.error("No se pudo copiar la citación:", error);
    }
  }

  return (
    <section id="quote" className="report-section">
      {/* ==================================================
          HEADER
      ================================================== */}

      <div className="report-section-header">
        <div className="section-number">07</div>

        <div>
          <div className="text-label-caps text-[var(--gold)] mb-2">
            REFERENCIA BIBLIOGRÁFICA
          </div>

          <h2 className="section-title">
            {infoCitation.title.replace(/^\d+\s+[—-]\s*/i, "") ??
              "Título no disponible"}
          </h2>

          <p className="section-description">
            Si utilizas este reporte, puedes citarlo utilizando la siguiente
            referencia.
          </p>
        </div>
      </div>

      {/* ==================================================
          CITATION CARD
      ================================================== */}

      <Card className="citation-card">
        <CardHeader className="citation-card-header">
          <div>
            <span className="citation-eyebrow">CITACIÓN RECOMENDADA</span>

            <h3 className="citation-title">
              El Índice de Capacidad Varada (SCI)
            </h3>
          </div>

          <span className="citation-badge">2026</span>
        </CardHeader>

        <Separator className="citation-separator" />

        <CardContent className="citation-card-content">
          {/* Texto de citación */}

          <div className="citation-text-wrapper">
            <SectionContent
              content={infoCitation.content ?? "Cita no disponible"}
            />
          </div>

          {/* Acción */}

          <div className="citation-actions">
            <Button
              type="button"
              onClick={handleCopy}
              variant="outline"
              className="citation-copy-button"
            >
              {copied ? (
                <>
                  <Check size={14} />
                  COPIADO
                </>
              ) : (
                <>
                  <Copy size={14} />
                  COPIAR CITACIÓN
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* ==================================================
          DOI / LICENSE
      ================================================== */}

      <div className="citation-meta">
        <div className="citation-meta-item">
          <span>DOI</span>

          <strong>physaflow/sci-2025-001</strong>
        </div>

        <div className="citation-meta-divider" />

        <div className="citation-meta-item">
          <span>LICENCIA</span>

          <strong>CC BY-SA 4.0</strong>
        </div>
      </div>
    </section>
  );
}
