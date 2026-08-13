export type ReportSection = {
  id: string;
  level: number;
  title: string;
  content: string;
};

export type ParsedReport = {
  sections: ReportSection[];
  metricsJson: string;
  chartsJson: string;
  failureModesJson: string;
};

function slugify(value: string): string {
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function safeParse(fence: string | undefined): unknown {
  if (!fence) return undefined;
  try {
    return JSON.parse(fence);
  } catch {
    return undefined;
  }
}

export function parseReport(mdx: string): ParsedReport {
  const lines = mdx.split(/\r?\n/);

  const fences: string[] = [];
  let inFence = false;
  let buffer: string[] = [];

  const sections: ReportSection[] = [];
  let current: ReportSection | null = null;

  for (const rawLine of lines) {
    const line = rawLine.trimEnd();

    if (/^\s*```/.test(line)) {
      if (!inFence) {
        inFence = true;
        buffer = [];
      } else {
        inFence = false;
        fences.push(buffer.join('\n').trim());
      }
      continue;
    }

    if (inFence) {
      buffer.push(line);
      continue;
    }

    const heading = line.match(/^(#{1,6})\s+(.*)$/);
    if (!inFence && heading) {
      if (current) sections.push(current);
      current = {
        id: slugify(heading[2]),
        level: heading[1].length,
        title: heading[2].trim(),
        content: '',
      };
      continue;
    }

    if (current && !inFence) {
      current.content += current.content.length > 0 ? `\n${line}` : line;
    }
  }

  if (current) sections.push(current);

  // Discard heading-only sections (empty content) to keep the index clean.
  const nonEmpty = sections.filter((s) => s.content.trim().length > 0);

  let metricsJson = '';
  try {
    const metrics = safeParse(fences[0]);
    const pue = safeParse(fences[1]);
    if (typeof metrics === 'object' && metrics !== null) {
      const merged: Record<string, unknown> = { ...(metrics as object) };
      if (typeof pue === 'object' && pue !== null) {
        merged.pueContext = pue;
      }
      metricsJson = JSON.stringify(merged);
    } else if (fences[0]) {
      metricsJson = fences[0];
    }
  } catch {
    metricsJson = fences[0] ?? '';
  }

  let chartsJson = '';
  try {
    const figure2 = safeParse(fences[2]);
    const figure3 = safeParse(fences[3]);
    chartsJson = JSON.stringify({
      figure2,
      figure3,
    });
  } catch {
    chartsJson = '';
  }

  let failureModesJson = '';
  try {
    const figure2 = safeParse(fences[2]);
    failureModesJson = JSON.stringify(figure2);
  } catch {
    failureModesJson = '';
  }

  return {
    sections: nonEmpty,
    metricsJson,
    chartsJson,
    failureModesJson,
  };
}

