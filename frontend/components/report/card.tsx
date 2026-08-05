export interface CardProps {
  badge: string;
  code: string;
  mediana: string;
  title: string;
  queSeVe: string;
  cuantoCuesta: string;
  porQueOcurre: string;
  labels?: {
    visible: string;
    cost: string;
    reason: string;
  };
}

export function Card({
  badge,
  code,
  mediana,
  title,
  queSeVe,
  cuantoCuesta,
  porQueOcurre,
  labels = {
    visible: "Qué se ve",
    cost: "Cuánto cuesta",
    reason: "Por qué ocurre",
  },
}: CardProps) {
  return (
    <article className="report-card p-6">
      <div className="flex items-start justify-between gap-4 mb-3">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <span className="report-chip">
              {badge} · {code}
            </span>
            <span className="text-metadata text-[var(--muted-green-grey)]">
              ~{mediana} mediana
            </span>
          </div>
          <h4 className="text-headline-md text-[var(--warm-white)]">{title}</h4>
        </div>
        <div className="text-display-lg-mobile text-[var(--gold)] hidden sm:block">
          {mediana}
        </div>
      </div>
      <div className="grid md:grid-cols-3 gap-4 mt-4">
        <div>
          <div className="text-label-caps text-[var(--gold)] mb-1.5">
            {labels.visible}
          </div>
          <p className="text-body-md text-[var(--on-surface-variant)]">
            {queSeVe}
          </p>
        </div>
        <div>
          <div className="text-label-caps text-[var(--gold)] mb-1.5">
            {labels.cost}
          </div>
          <p className="text-body-md text-[var(--on-surface-variant)]">
            {cuantoCuesta}
          </p>
        </div>
        <div>
          <div className="text-label-caps text-[var(--gold)] mb-1.5">
            {labels.reason}
          </div>
          <p className="text-body-md text-[var(--on-surface-variant)]">
            {porQueOcurre}
          </p>
        </div>
      </div>
    </article>
  );
}
