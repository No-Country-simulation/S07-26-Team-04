import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";
import { prisma } from "@/lib/prisma";

// Initialize Google Gen AI client with the API Key
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || "",
});

export async function POST(req: NextRequest) {
  try {
    const { messages, reportId } = await req.json();

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json(
        { error: "Messages array is required" },
        { status: 400 }
      );
    }

    // 1. Obtener el reporte objetivo desde la base de datos (Prisma)
    let dbReport = null;

    if (reportId) {
      dbReport = await prisma.report.findUnique({
        where: { id: reportId },
      });
    }

    // Fallback: Si no viene reportId o no se encuentra el reporte, obtener el primer reporte disponible en BD
    if (!dbReport) {
      dbReport = await prisma.report.findFirst();
    }

    if (!dbReport) {
      return NextResponse.json(
        { error: "No report context found in database" },
        { status: 404 }
      );
    }

    // 2. Extraer o consumir la ficha de conocimiento para IA (aiKnowledge)
    let aiKnowledgeContext = "";

    if (dbReport.aiKnowledge) {
      aiKnowledgeContext = typeof dbReport.aiKnowledge === "string"
        ? dbReport.aiKnowledge
        : JSON.stringify(dbReport.aiKnowledge, null, 2);
    } else {
      // Fallback si el reporte aún no tiene aiKnowledge procesado
      const layersData = typeof dbReport.layers === "string" 
        ? dbReport.layers 
        : JSON.stringify(dbReport.layers, null, 2);

      aiKnowledgeContext = JSON.stringify({
        metadata: {
          title: dbReport.title,
          subtitle: dbReport.subtitle || "",
          author: dbReport.author,
          publishedDate: dbReport.publishedDate,
          doi: dbReport.doi,
        },
        globalImpact: {
          globalMedian: dbReport.globalMedian,
          lossFacilities: dbReport.lossFacilities,
          lossIT: dbReport.lossIT,
          lossWorkload: dbReport.lossWorkload,
          keyFinding: dbReport.keyFinding || "",
        },
        layersSummary: layersData,
      }, null, 2);
    }

    // 3. System Instruction enfocado en concisión y velocidad usando aiKnowledge
    const systemPrompt = `Eres el asistente oficial del reporte científico PhysaFlow.
Tu objetivo es responder de forma DIRECTA, BREVE y CONCISA únicamente a lo que el usuario pregunte.
Usa estrictamente la Ficha de Conocimiento del Reporte (AI Knowledge Base) proporcionada a continuación:
---
${aiKnowledgeContext}
---
Reglas de formato y respuesta:
- Usa **negritas** (**texto en negrita**) para destacar los nombres de los conceptos clave, modos de fallo (ej. **Sobresuscripción térmica**, **Racks comatosos**), métricas y porcentajes (ej. **31,4%**, **14,8%**), y capas (ej. **Facilities**, **TI**, **Workload**).
- Si el usuario te saluda o pregunta quién eres, preséntate brevemente en una sola frase indicando que eres el asistente de **PhysaFlow**, sin desplegar todo el informe salvo que lo soliciten.
- Responde en el mismo idioma en que te hablen.
- Mantén un tono académico, claro y estructurado con listas o viñetas cuando sea adecuado.`;

    // 4. Extraer el historial y la última pregunta del usuario
    const lastUserMessage = messages[messages.length - 1].content;
    const history = messages.slice(0, messages.length - 1);

    const contents = [
      ...history.map((m) => ({
        role: m.role === "user" ? "user" : "model",
        parts: [{ text: m.content }],
      })),
      {
        role: "user",
        parts: [{ text: lastUserMessage }],
      },
    ];

    // 5. Llamada ultrarrápida a Gemini usando el modelo gemini-3.5-flash-lite
    const responseStream = await ai.models.generateContentStream({
      model: "gemini-3.5-flash-lite",
      contents: contents,
      config: {
        systemInstruction: systemPrompt,
        maxOutputTokens: 600,
      },
    });

    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of responseStream) {
            const text = chunk.text;
            if (text) {
              controller.enqueue(encoder.encode(text));
            }
          }
        } catch (err) {
          controller.error(err);
        } finally {
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream; charset=utf-8",
        "Cache-Control": "no-cache",
        "Connection": "keep-alive",
      },
    });
  } catch (error: unknown) {
    console.error("Gemini API Chat route error:", error);
    const errMsg = error instanceof Error ? error.message : "Internal server error";
    return new Response(errMsg, { status: 500 });
  }
}
