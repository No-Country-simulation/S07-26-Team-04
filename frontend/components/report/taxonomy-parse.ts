export interface ParsedCardItem {
  id: string;
  badge: string;
  code: string;
  mediana: string;
  title: string;
  queSeVe: string;
  cuantoCuesta: string;
  porQueOcurre: string;
  labels: {
    visible: string;
    cost: string;
    reason: string;
  };
}

export function parseSubsectionCards(
  content: string,
  layerBadge: string,
): { intro: string; cards: ParsedCardItem[] } {
  const cards: ParsedCardItem[] = [];
  const lines = content.split("\n");
  const introLines: string[] = [];

  let currentCard: Partial<ParsedCardItem> | null = null;

  for (const rawLine of lines) {
    const line = rawLine.trim();

    // Revisa si es inicio de una tarjeta (ej. - **F-01 (4,2%) — Deriva del pasillo frío**)
    const headerMatch = line.match(
      /^-\s*\*\*([A-Z]+-\d+)\s*(?:\(([^)]+)\))?\s*[—-]?\s*(.*?)\*\*/i,
    );
    if (headerMatch) {
      if (currentCard && currentCard.code) {
        cards.push({
          id: currentCard.code,
          badge: currentCard.badge || layerBadge,
          code: currentCard.code,
          mediana: currentCard.mediana || "—",
          title: currentCard.title || "Sin título",
          queSeVe: currentCard.queSeVe || "No disponible",
          cuantoCuesta: currentCard.cuantoCuesta || "No disponible",
          porQueOcurre: currentCard.porQueOcurre || "No disponible",
          labels: currentCard.labels || {
            visible: "Qué se ve",
            cost: "Cuánto cuesta",
            reason: "Causa raíz",
          },
        });
      }

      const code = headerMatch[1].toUpperCase();
      const mediana = headerMatch[2] || "—";
      const title = headerMatch[3].trim();
      const badge = code.split("-")[0] || layerBadge;

      currentCard = {
        code,
        mediana,
        title,
        badge,
        queSeVe: "",
        cuantoCuesta: "",
        porQueOcurre: "",
        labels: {
          visible: "",
          cost: "",
          reason: "",
        },
      };
      continue;
    }

    if (currentCard) {
      const subBulletMatch = line.match(/^-\s*\*\*(.*?):\*\*\s*(.*)/);
      if (subBulletMatch) {
        const labelText = subBulletMatch[1].trim();
        const detailText = subBulletMatch[2].trim();

        if (!currentCard.queSeVe) {
          currentCard.queSeVe = detailText;
          currentCard.labels!.visible = labelText;
        } else if (!currentCard.cuantoCuesta) {
          currentCard.cuantoCuesta = detailText;
          currentCard.labels!.cost = labelText;
        } else {
          currentCard.porQueOcurre = detailText;
          currentCard.labels!.reason = labelText;
        }
        continue;
      }
    } else {
      introLines.push(rawLine);
    }
  }

  if (currentCard && currentCard.code) {
    cards.push({
      id: currentCard.code,
      badge: currentCard.badge || layerBadge,
      code: currentCard.code,
      mediana: currentCard.mediana || "—",
      title: currentCard.title || "Sin título",
      queSeVe: currentCard.queSeVe || "No disponible",
      cuantoCuesta: currentCard.cuantoCuesta || "No disponible",
      porQueOcurre: currentCard.porQueOcurre || "No disponible",
      labels: currentCard.labels || {
        visible: "Qué se ve",
        cost: "Cuánto cuesta",
        reason: "Causa raíz",
      },
    });
  }

  return {
    intro: introLines.join("\n").trim(),
    cards,
  };
}

export function parseTaxonomyContent(content: string): {
  mainIntro: string;
  layers: { title: string; body: string }[];
} {
  const parts = content.split(/^###\s+/m);
  const mainIntro = parts[0] || "";

  const layers = parts.slice(1).map((part) => {
    const firstLineEnd = part.indexOf("\n");
    const title =
      firstLineEnd >= 0 ? part.substring(0, firstLineEnd).trim() : part.trim();
    const body =
      firstLineEnd >= 0 ? part.substring(firstLineEnd + 1).trim() : "";
    return { title, body };
  });

  return { mainIntro, layers };
}
