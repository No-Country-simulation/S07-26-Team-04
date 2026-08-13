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

// No funciona porque da un looping infinito
// export async function getAuthorContent() {
//     const data = await getHero();
//     const author =
//         getMarkdownField(data.sections[0]?.content || "", "Autor") ||
//         "Desconocido";

//     return author;
// };