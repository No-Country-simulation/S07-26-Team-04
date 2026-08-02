import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || "",
});

export interface AiKnowledgeStructure {
  metadata: {
    title: string;
    subtitle?: string;
    author: string;
    publishedDate: string;
    doi: string;
  };
  globalImpact: {
    globalMedian: string;
    lossFacilities: string;
    lossIT: string;
    lossWorkload: string;
    keyFinding: string;
  };
  layersSummary: Array<{
    level: string;
    title: string;
    subtitle?: string;
    failures: Array<{
      code: string;
      title: string;
      median: string;
      observed: string;
      cost: string;
      reason: string;
    }>;
  }>;
  visualCharts: Array<{
    type: "bar" | "line" | "pie" | string;
    title: string;
    caption?: string;
    data: unknown;
    aiInterpretation: string;
  }>;
  executiveSummary: string;
}

/**
 * Función servidora para extraer y generar la ficha de conocimiento JSON optimizada para la IA
 * a partir del contenido MDX y metadatos del reporte.
 */
export async function generateAiKnowledge(reportData: {
  title: string;
  subtitle?: string | null;
  author: string;
  publishedDate: string;
  doi: string;
  globalMedian: string;
  lossFacilities: string;
  lossIT: string;
  lossWorkload: string;
  keyFinding?: string | null;
  layers: unknown;
  content: string;
}): Promise<AiKnowledgeStructure> {
  // 1. Extraer componentes <Chart /> del contenido MDX
  const chartMatches = reportData.content.match(/<Chart[\s\S]*?\/>/g) || [];
  const extractedCharts: Array<{ type: string; title: string; caption?: string; data: unknown }> = [];

  chartMatches.forEach((chartTag) => {
    try {
      const typeMatch = chartTag.match(/type=["']([^"']+)["']/);
      const titleMatch = chartTag.match(/title=["']([^"']+)["']/);
      const captionMatch = chartTag.match(/caption=["']([^"']+)["']/);
      const dataMatch = chartTag.match(/data=(?:'([^']+)'|"([^"]+)")/);

      const type = typeMatch ? typeMatch[1] : "unknown";
      const title = titleMatch ? titleMatch[1] : "Gráfico";
      const caption = captionMatch ? captionMatch[1] : "";
      let data = [];

      if (dataMatch) {
        const rawJson = dataMatch[1] || dataMatch[2];
        data = JSON.parse(rawJson);
      }

      extractedCharts.push({ type, title, caption, data });
    } catch (e) {
      console.warn("No se pudo parsear un componente <Chart />:", e);
    }
  });

  // 2. Formatear la estructura inicial conocida
  const layersArray = Array.isArray(reportData.layers) ? reportData.layers : [];

  const rawStructure = {
    metadata: {
      title: reportData.title,
      subtitle: reportData.subtitle || "",
      author: reportData.author,
      publishedDate: reportData.publishedDate,
      doi: reportData.doi,
    },
    globalImpact: {
      globalMedian: reportData.globalMedian,
      lossFacilities: reportData.lossFacilities,
      lossIT: reportData.lossIT,
      lossWorkload: reportData.lossWorkload,
      keyFinding: reportData.keyFinding || "",
    },
    layersSummary: layersArray,
    extractedCharts,
  };

  // 3. Solicitar a Gemini una síntesis experta sobre los gráficos y resumen ejecutivo
  const prompt = `Analiza la siguiente información estructurada de un reporte de investigación sobre el Índice de Capacidad Varada en datacenters:

${JSON.stringify(rawStructure, null, 2)}

Tu tarea es actuar como un generador de fichas de conocimiento para una IA. Genera un JSON estrictamente estructurado en el siguiente formato:
{
  "executiveSummary": "Un resumen ejecutivo conciso (max 3 oraciones) de todo el estudio.",
  "chartsAnalysis": [
    {
      "chartTitle": "Título del gráfico",
      "aiInterpretation": "Interpretación analítica clara de lo que demuestra este gráfico (ej: tendencia ascendente 2020-2026, fallo con mayor pérdida, etc.)"
    }
  ]
}

Responde ÚNICAMENTE con el objeto JSON válido, sin bloques de código ni markdown envolvente.`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash-lite",
      contents: prompt,
    });

    const responseText = response.text?.replace(/```json/g, "").replace(/```/g, "").trim() || "{}";
    const aiParsed = JSON.parse(responseText);

    const visualCharts = extractedCharts.map((c) => {
      const match = aiParsed.chartsAnalysis?.find(
        (a: { chartTitle?: string; aiInterpretation?: string }) => a.chartTitle === c.title
      );
      return {
        ...c,
        aiInterpretation: match?.aiInterpretation || "Gráfico representativo de datos estadísticos.",
      };
    });

    return {
      metadata: rawStructure.metadata,
      globalImpact: rawStructure.globalImpact,
      layersSummary: rawStructure.layersSummary,
      visualCharts,
      executiveSummary: aiParsed.executiveSummary || "Reporte de investigación sobre capacidad varada.",
    };
  } catch (error) {
    console.error("Error generando AI Knowledge síntesis:", error);
    // Fallback en caso de error de la API
    return {
      metadata: rawStructure.metadata,
      globalImpact: rawStructure.globalImpact,
      layersSummary: rawStructure.layersSummary,
      visualCharts: extractedCharts.map((c) => ({
        ...c,
        aiInterpretation: "Gráfico de datos estadísticos del reporte.",
      })),
      executiveSummary: `${reportData.title} por ${reportData.author}. Mediana global de pérdidas: ${reportData.globalMedian}.`,
    };
  }
}
