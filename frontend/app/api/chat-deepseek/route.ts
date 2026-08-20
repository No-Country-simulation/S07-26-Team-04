import { createOpenAI } from '@ai-sdk/openai';
import { NextResponse } from 'next/server';
import {
  convertToModelMessages,
  streamText,
  createUIMessageStreamResponse,
  toUIMessageStream,
  type UIMessage,
} from 'ai';

import {
  buildSystemPrompt,
  loadReportData,
  type ChatReportData,
} from '@/lib/chat-context';

export const maxDuration = 30;

/**
 * DeepSeek expone una API compatible con OpenAI
 * (https://api-docs.deepseek.com/): mismo formato de chat completions y
 * tool calls, base URL https://api.deepseek.com.
 *
 * Modelo: `deepseek-v4-flash` (DeepSeek-V4-Flash-0731) — contexto 1M tokens,
 * más barato y con mayor concurrencia que `deepseek-v4-pro`.
 */
const deepseek = createOpenAI({
  baseURL: 'https://api.deepseek.com',
  apiKey: process.env.DEEPSEEK_API_KEY || '',
  name: 'deepseek',
});

export async function POST(req: Request) {
  let body: {
    messages?: UIMessage[];
    reportId?: string;
    reportData?: ChatReportData;
  };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'JSON inválido' }, { status: 400 });
  }

  const { messages, reportId, reportData } = body;

  if (!Array.isArray(messages) || messages.length === 0) {
    return NextResponse.json({ error: 'El campo "messages" es requerido' }, { status: 400 });
  }

  if (!process.env.DEEPSEEK_API_KEY) {
    return NextResponse.json(
      { error: 'DEEPSEEK_API_KEY no está configurada' },
      { status: 500 }
    );
  }

  const { data, notFound } = await loadReportData({ reportId, reportData });
  if (notFound) {
    return NextResponse.json({ error: 'Reporte no encontrado' }, { status: 404 });
  }

  const system = buildSystemPrompt(data);

  const result = streamText({
    model: deepseek('deepseek-v4-flash'),
    system,
    messages: await convertToModelMessages(messages),
    providerOptions: {
      openai: {
        // `deepseek-v4-flash` trae el thinking mode ACTIVADO por defecto, lo que
        // retrasa la primera respuesta (emite cadena de razonamiento antes del
        // texto). `reasoningEffort: "none"` lo desactiva. Verificado contra la
        // API de DeepSeek: respuesta directa, reasoningTokens = 0.
        // Ojo: `@ai-sdk/openai` solo envía `reasoning_effort` si reconoce el
        // modelo como de razonamiento; por eso va `forceReasoning: true`, y
        // `systemMessageMode: "system"` para que DeepSeek reciba el rol system.
        reasoningEffort: 'none',
        forceReasoning: true,
        systemMessageMode: 'system',
      },
    },
  });

  return createUIMessageStreamResponse({
    stream: toUIMessageStream({
      stream: result.stream,
    }),
  });
}
