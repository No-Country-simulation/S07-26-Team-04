import { api } from "@/lib/axios";
import { BarChart } from "@/types/bar-chart";
import { Citation } from "@/types/citation";
import { Conclusion } from "@/types/conclusion";
import { ExecutiveSummary } from "@/types/executive-summary";
import { Figure } from "@/types/figure";

import type { Hero } from "@/types/hero";
import { Introduction } from "@/types/introduction";
import { LineChart } from "@/types/line-chart";
import { MainFindings } from "@/types/main-findings";
import { Methodology } from "@/types/methodology";
import { Taxonomy } from "@/types/taxonomy";

const reportCache = new Map<string, Promise<unknown>>();

export async function fetchReportCached<T = Record<string, unknown>>(id?: string): Promise<T> {
  const cacheKey = id || "current";
  if (!reportCache.has(cacheKey)) {
    const url = id ? `/report/${id}` : "/report";
    const promise = api
      .get(url)
      .then((res) => res.data)
      .catch((err) => {
        reportCache.delete(cacheKey);
        throw err;
      });
    reportCache.set(cacheKey, promise);
  }
  return reportCache.get(cacheKey) as Promise<T>;
}

export function clearReportCache(id?: string) {
  if (id) {
    reportCache.delete(id);
  } else {
    reportCache.clear();
  }
}

export async function getHero(id?: string): Promise<Hero> {
    return fetchReportCached<Hero>(id);
}

export async function getMainFindings(id?: string): Promise<MainFindings> {
    return fetchReportCached<MainFindings>(id);
}

export async function getIntroduction(id?: string): Promise<Introduction> {
    return fetchReportCached<Introduction>(id);
}

export async function getExecutiveSummary(id?: string): Promise<ExecutiveSummary> {
    return fetchReportCached<ExecutiveSummary>(id);
}

export async function getTaxonomy(id?: string): Promise<Taxonomy> {
    return fetchReportCached<Taxonomy>(id);
}

export async function getMethodology(id?: string): Promise<Methodology> {
    return fetchReportCached<Methodology>(id);
}

export async function getFigures(id?: string): Promise<Figure> {
    return fetchReportCached<Figure>(id);
}

export async function getBarChart(id?: string): Promise<BarChart> {
    return fetchReportCached<BarChart>(id);
}

export async function getLineChart(id?: string): Promise<LineChart> {
    return fetchReportCached<LineChart>(id);
}

export async function getConclusion(id?: string): Promise<Conclusion> {
    return fetchReportCached<Conclusion>(id);
}

export async function getCitation(id?: string): Promise<Citation> {
    return fetchReportCached<Citation>(id);
}

export async function getReportData(id?: string): Promise<Record<string, unknown>> {
    return fetchReportCached<Record<string, unknown>>(id);
}
