import { google } from '@ai-sdk/google';
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

  const { data, notFound } = await loadReportData({ reportId, reportData });
  if (notFound) {
    return NextResponse.json({ error: 'Reporte no encontrado' }, { status: 404 });
  }

  const system = buildSystemPrompt(data);

  const result = streamText({
    model: google('gemini-3.6-flash'),
    system,
    messages: await convertToModelMessages(messages),
  });

  return createUIMessageStreamResponse({
    stream: toUIMessageStream({
      stream: result.stream,
    }),
  });
}
