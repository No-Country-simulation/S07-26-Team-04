import { api } from "@/lib/axios";
import { ExecutiveSummary } from "@/types/executive-summary";

import type { Hero } from "@/types/hero";
import { Introduction } from "@/types/introduction";
import { Taxonomy } from "@/types/taxonomy";

export async function getHero(): Promise<Hero> {
    const response = await api.get<Hero>("/report");
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

export async function getReportData() {
    const response = await api.get("/report");
    return response.data;
}