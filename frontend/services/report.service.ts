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

export async function getHero(): Promise<Hero> {
    const response = await api.get<Hero>("/report");
    return response.data;
};

export async function getMainFindings(): Promise<MainFindings> {
    const response = await api.get<MainFindings>("/report");
    return response.data;
};

export async function getIntroduction(): Promise<Introduction> {
    const response = await api.get<Introduction>("/report");
    return response.data;
};

export async function getExecutiveSummary(): Promise<ExecutiveSummary> {
    const response = await api.get<ExecutiveSummary>("/report");
    return response.data;
};

export async function getTaxonomy(): Promise<Taxonomy> {
    const response = await api.get<Taxonomy>("/report");
    return response.data;
};

export async function getMethodology(): Promise<Methodology> {
    const response = await api.get<Methodology>("/report");
    return response.data;
};

export async function getFigures(): Promise<Figure> {
    const response = await api.get<Figure>("/report");
    return response.data;
};

export async function getBarChart(): Promise<BarChart> {
    const response = await api.get<BarChart>("/report");
    return response.data;
};

export async function getLineChart(): Promise<LineChart> {
    const response = await api.get<LineChart>("/report");
    return response.data;
};

export async function getConclusion(): Promise<Conclusion> {
    const response = await api.get<Conclusion>("/report");
    return response.data;
};

export async function getCitation(): Promise<Citation> {
    const response = await api.get<Citation>("/report");
    return response.data;
};

export async function getReportData() {
    const response = await api.get("/report");
    return response.data;
}
