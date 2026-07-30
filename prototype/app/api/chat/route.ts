import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";
import fs from "fs";
import path from "path";

// Initialize Google Gen AI client with the API Key
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || "",
});

export async function POST(req: NextRequest) {
  try {
    const { messages, lang = "ES" } = await req.json();

    // Vercel deployment helper: Explicitly reference mdx files statically to force
    // Vercel Node File Trace to package them inside the serverless function container.
    if (process.env.VERCEL_DUMMY_TRACE === "force") {
      fs.readFileSync(path.join(process.cwd(), "content", "reporte-ES.mdx"), "utf-8");
      fs.readFileSync(path.join(process.cwd(), "content", "reporte-EN.mdx"), "utf-8");
    }

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json(
        { error: "Messages array is required" },
        { status: 400 }
      );
    }

    // 1. Read the corresponding MDX report file content for context
    const normalizedLang = lang.toUpperCase() === "EN" ? "EN" : "ES";
    const contentPath = path.join(
      process.cwd(),
      "content",
      `reporte-${normalizedLang}.mdx`
    );

    let mdxContent = "";
    if (fs.existsSync(contentPath)) {
      mdxContent = fs.readFileSync(contentPath, "utf-8");
    } else {
      console.warn(`Report context file not found at: ${contentPath}`);
    }

    // 2. Build the system prompt instruction
    const systemPrompt = normalizedLang === "EN"
      ? `You are an academic research assistant for the PhysaFlow paper.
Your goal is to answer questions about the report accurately and professionally.
You must base your answers on the following report content:
---
${mdxContent}
---
Ensure your answers are concise, clear, and match the academic tone of the paper.
Respond in English. Format your answers in Markdown (bold text, lists, code blocks where appropriate).`
      : `Eres un asistente de investigación académica para el artículo científico PhysaFlow.
Tu objetivo es responder preguntas sobre el reporte de manera precisa y profesional.
Debes basar tus respuestas en el siguiente contenido del reporte:
---
${mdxContent}
---
Asegúrate de que tus respuestas sean concisas, claras y mantengan el tono académico.
Responde en Español. Da formato a tus respuestas usando Markdown (negritas, listas, bloques de código cuando sea apropiado).`;

    // 3. Compile the chat conversation history
    // Get the latest query
    const lastUserMessage = messages[messages.length - 1].content;
    
    // Get the past messages for conversation history
    const history = messages.slice(0, messages.length - 1);

    // 3. Build the structured messages history for the contents parameter
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

    // 4. Call the Gemini API using generateContentStream with config.systemInstruction
    // This allows Gemini to cache the large system prompt (MDX context) automatically.
    const responseStream = await ai.models.generateContentStream({
      model: "gemini-3.5-flash",
      contents: contents,
      config: {
        systemInstruction: systemPrompt,
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
