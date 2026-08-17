import { Card } from "@/components/report/card";
import { getMarkdownField } from "@/lib/content-parser";
import { TaxonomyLayerProps } from "@/types/taxonomy";
import SectionContent from "./section-content";

function extractMedian(title: string): string {
  const match = title.match(/mediana\s+([\d.,]+%?)/i);

  if (!match) {
    return "—";
  }

  return match[1];
}

function extractCode(title: string): string {
  const match = title.match(/^([A-Z]+-\d+)/);

  if (!match) {
    return "";
  }

  return match[1];
}

function extractBadge(code: string): string {
  const match = code.match(/^([A-Z]+)/);

  if (!match) {
    return "SCI";
  }

  return match[1];
}

export function TaxonomyLayer({ layer, items }: TaxonomyLayerProps) {
  return (
    <section className="report-section">
      {/* ==================================================
          ENCABEZADO DE LA CAPA
      ================================================== */}

      <div className="report-section-header">
        <span className="section-number">
          {layer.title.match(/Capa\s+(\d+)/i)?.[1] ?? ""}
        </span>

        <div>
          <h3 className="section-title">
            {layer.title.replace(/^\s+\d+\s+[—-]\s*/i, "")}
          </h3>

          <SectionContent content={layer.content} />
        </div>
      </div>

      {/* ==================================================
          TAXONOMÍA
      ================================================== */}

      <div className="space-y-4">
        {items.map((item) => {
          const code = extractCode(item.title);

          const badge = extractBadge(code);

          const mediana = extractMedian(item.title);

          const title = item.title
            .replace(/^([A-Z]+-\d+):\s*/i, "")
            .replace(/\s+—\s+mediana\s+[\d.,]+%?/i, "");

          const queSeVe =
            getMarkdownField(item.content || "", "Qué se ve") || "Desconocido";

          const cuantoCuesta =
            getMarkdownField(item.content || "", "Cuánto cuesta") ||
            "Desconocido";

          const porQueOcurre =
            getMarkdownField(item.content || "", "Por qué ocurre") ||
            "Desconocido";

          return (
            <Card
              key={item.id}
              badge={badge}
              code={code}
              mediana={mediana}
              title={title}
              queSeVe={queSeVe}
              cuantoCuesta={cuantoCuesta}
              porQueOcurre={porQueOcurre}
            />
          );
        })}
      </div>
    </section>
  );
}
