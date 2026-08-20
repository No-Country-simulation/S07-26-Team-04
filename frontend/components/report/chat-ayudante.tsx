"use client";

import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport, type UIMessage } from "ai";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { getReportData } from "@/services/report.service";
import {
  Bot,
  Send,
  X,
  Sparkles,
  Trash2,
  Minimize2,
  Maximize2,
  User,
  Loader2,
  RefreshCw,
  AlertCircle,
} from "lucide-react";

interface ChatAyudanteProps {
  reportId?: string;
}

type ModelProvider = "gemini" | "deepseek";

/** Datos del reporte que la página ya cargó y que el chat reenvía al servidor
 *  para evitar re-consultar la base de datos en cada mensaje. */
type ReportPayload = {
  sections?: unknown;
  metrics?: unknown;
  charts?: unknown;
  failureModes?: unknown;
};

const QUICK_PROMPTS = [
  "¿Qué es la capacidad varada mediana?",
  "¿Cuáles son los 9 modos de fallo?",
  "Resume los resultados principales del estudio.",
  "¿Qué indica la Figura 3 sobre la capacidad acumulada?",
];

function getMessageText(message: UIMessage): string {
  if (!message.parts) return "";
  return message.parts
    .filter((p): p is { type: "text"; text: string } => p.type === "text")
    .map((p) => p.text)
    .join("");
}

export function ChatAyudante({ reportId }: ChatAyudanteProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [inputText, setInputText] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [activeModel, setActiveModel] = useState<ModelProvider>("gemini");
  const selectedModelRef = useRef<ModelProvider>("gemini");
  const reportDataRef = useRef<ReportPayload | null>(null);

  // Transporte del chat: cambia dinámicamente el endpoint según el modelo
  // elegido y reenvía el reporte que la página ya cargó (evita re-consultar
  // la base de datos en cada mensaje).
  const chatTransport = useMemo(
    () => {
      // eslint-disable-next-line react-hooks/refs -- prepareSendMessagesRequest corre en tiempo de request (async); las refs evitan staleness entre ensureReportData() y el envío.
      return new DefaultChatTransport<UIMessage>({
        api: "/api/chat",
        prepareSendMessagesRequest: ({ body, messages, id }) => ({
          body: {
            ...(body ?? {}),
            id,
            messages,
            ...(reportId ? { reportId } : {}),
            modelProvider: selectedModelRef.current,
            reportData: reportDataRef.current ?? undefined,
          },
          api:
            selectedModelRef.current === "deepseek"
              ? "/api/chat-deepseek"
              : "/api/chat",
        }),
      });
    },
    [reportId]
  );

  const { messages, sendMessage, status, error, regenerate, setMessages } =
    useChat({ transport: chatTransport });

  const isLoading = status === "submitted" || status === "streaming";

  /** Recupera (una sola vez, cacheado en memoria) el reporte que la página ya
   *  pidió, y lo deja listo para enviarlo como contexto al servidor. */
  const ensureReportData = useCallback(async () => {
    if (reportDataRef.current) return;
    try {
      const data = (await getReportData(reportId)) as ReportPayload;
      reportDataRef.current = {
        sections: data.sections ?? null,
        metrics: data.metrics ?? null,
        charts: data.charts ?? null,
        failureModes: data.failureModes ?? null,
      };
    } catch {
      // Si falla la lectura local, el servidor usa el fallback por reportId (DB).
      // Se deja en null para que el servidor no reciba un objeto vacío.
      reportDataRef.current = null;
    }
  }, [reportId]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen, isLoading]);

  const handleSend = async (textToSend: string) => {
    if (!textToSend.trim() || isLoading) return;
    const text = textToSend.trim();
    setInputText("");
    await ensureReportData();
    await sendMessage({ text });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await handleSend(inputText);
  };

  const handleQuickPrompt = async (promptText: string) => {
    await handleSend(promptText);
  };

  const clearChat = () => {
    setMessages([]);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 no-print flex flex-col items-end">
      {/* Botón flotante para abrir el chat */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="group relative flex items-center gap-3 px-5 py-3.5 rounded-full bg-[#082f25] border border-[#c6a13a]/40 text-white shadow-2xl hover:border-[#c6a13a] hover:bg-[#0c4033] transition-all duration-300 transform hover:scale-105 active:scale-95 cursor-pointer"
          aria-label="Abrir asistente de IA"
        >
          <div className="relative flex items-center justify-center w-8 h-8 rounded-full bg-[#c6a13a]/20 text-[#c6a13a] group-hover:bg-[#c6a13a] group-hover:text-[#041d17] transition-colors duration-300">
            <Sparkles className="w-5 h-5 animate-pulse" />
          </div>
          <div className="flex flex-col text-left">
            <span className="text-xs font-semibold text-[#c6a13a] uppercase tracking-wider">
              Asistente PhysaFlow
            </span>
            <span className="text-[11px] text-emerald-100/80">
              ¿Consultas sobre el estudio?
            </span>
          </div>
          <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500 border-2 border-[#041d17]"></span>
          </span>
        </button>
      )}

      {/* Ventana flotante del Chat */}
      {isOpen && (
        <div
          className={`flex flex-col bg-[#041d17] border border-[#c6a13a]/30 rounded-2xl shadow-2xl overflow-hidden backdrop-blur-xl transition-all duration-300 ${
            isExpanded
              ? "w-[92vw] md:w-[700px] h-[85vh]"
              : "w-[92vw] sm:w-[420px] h-[600px] max-h-[85vh]"
          }`}
        >
          {/* Header del Chat */}
          <div className="flex items-center justify-between px-4 py-3.5 bg-[#082f25] border-b border-[#c6a13a]/20">
            <div className="flex items-center gap-3">
              {/* Botón interactivo con icono de robot que rota al cambiar de modelo */}
              <button
                onClick={() => {
                  if (isLoading) return;
                  const nextModel = activeModel === "gemini" ? "deepseek" : "gemini";
                  setActiveModel(nextModel);
                  selectedModelRef.current = nextModel;
                }}
                disabled={isLoading}
                title={`Modelo actual: ${activeModel === "gemini" ? "Gemini 3.6" : "DeepSeek V4"}. Haz clic para cambiar.`}
                className="group relative p-2 rounded-xl bg-[#c6a13a]/15 text-[#c6a13a] border border-[#c6a13a]/30 hover:border-[#c6a13a] hover:bg-[#c6a13a]/25 transition-all duration-300 transform active:scale-90 cursor-pointer"
              >
                <div
                  className={`transition-transform duration-500 transform ${
                    activeModel === "deepseek" ? "rotate-[360deg]" : "rotate-0"
                  }`}
                >
                  <Bot className="w-5 h-5 group-hover:rotate-12 transition-transform duration-200" />
                </div>
              </button>

              <div className="flex flex-col">
                <h3 className="text-sm font-semibold text-white tracking-wide flex items-center gap-2">
                  Asistente PhysaFlow
                </h3>
                {/* Estado del asistente y modelo activo */}
                <p className="text-[11px] text-emerald-400 font-medium flex items-center gap-1.5 mt-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  <span>
                    {activeModel === "gemini" ? "Gemini 3.6 AI" : "DeepSeek V4 AI"} • Conectado
                  </span>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1 text-slate-400">
              {messages.length > 0 && (
                <button
                  onClick={clearChat}
                  title="Limpiar conversación"
                  className="p-1.5 rounded-lg hover:bg-emerald-950/60 hover:text-rose-400 transition-colors cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                title={isExpanded ? "Reducir" : "Maximizar"}
                className="p-1.5 rounded-lg hover:bg-emerald-950/60 hover:text-[#c6a13a] transition-colors cursor-pointer"
              >
                {isExpanded ? (
                  <Minimize2 className="w-4 h-4" />
                ) : (
                  <Maximize2 className="w-4 h-4" />
                )}
              </button>
              <button
                onClick={() => setIsOpen(false)}
                title="Cerrar chat"
                className="p-1.5 rounded-lg hover:bg-emerald-950/60 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Área de Mensajes */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 text-sm scrollbar-thin scrollbar-thumb-[#082f25]">
            {messages.length === 0 && (
              <div className="flex flex-col items-center justify-center h-full text-center p-4 space-y-4">
                <div className="p-4 rounded-full bg-[#082f25] text-[#c6a13a] border border-[#c6a13a]/30">
                  <Sparkles className="w-8 h-8" />
                </div>
                <div>
                  <h4 className="text-base font-semibold text-white">
                    ¿En qué puedo ayudarte hoy?
                  </h4>
                  <p className="text-xs text-slate-300 mt-1 max-w-xs leading-relaxed">
                    Puedo consultar métricas, secciones y modos de fallo del
                    estudio de capacidad varada de PhysaFlow.
                  </p>
                </div>

                {/* Preguntas sugeridas */}
                <div className="w-full pt-2 space-y-2">
                  <p className="text-[11px] font-medium text-[#c6a13a] uppercase tracking-wider text-left">
                    Preguntas sugeridas
                  </p>
                  <div className="flex flex-col gap-2">
                    {QUICK_PROMPTS.map((prompt, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleQuickPrompt(prompt)}
                        className="text-left text-xs p-2.5 rounded-xl bg-[#082f25]/80 hover:bg-[#0d4a3b] border border-[#c6a13a]/20 hover:border-[#c6a13a]/50 text-emerald-100 transition-all duration-200 cursor-pointer"
                      >
                        {prompt}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {messages.map((m) => {
              const textContent = getMessageText(m);
              return (
                <div
                  key={m.id}
                  className={`flex items-start gap-3 ${
                    m.role === "user" ? "flex-row-reverse" : "flex-row"
                  }`}
                >
                  {/* Avatar */}
                  <div
                    className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 border ${
                      m.role === "user"
                        ? "bg-[#c6a13a]/20 border-[#c6a13a]/40 text-[#c6a13a]"
                        : "bg-[#082f25] border-emerald-500/30 text-emerald-400"
                    }`}
                  >
                    {m.role === "user" ? (
                      <User className="w-4 h-4" />
                    ) : (
                      <Bot className="w-4 h-4" />
                    )}
                  </div>

                  {/* Burbuja de contenido */}
                  <div
                    className={`max-w-[82%] rounded-2xl px-4 py-3 text-xs md:text-sm leading-relaxed shadow-md ${
                      m.role === "user"
                        ? "bg-[#c6a13a] text-slate-950 font-medium rounded-tr-none"
                        : "bg-[#082f25]/90 border border-emerald-500/20 text-slate-100 rounded-tl-none"
                    }`}
                  >
                    {m.role === "user" ? (
                      <p className="whitespace-pre-wrap">{textContent}</p>
                    ) : (
                      <div className="prose prose-invert prose-xs max-w-none prose-p:leading-relaxed prose-pre:bg-[#041d17] prose-pre:border prose-pre:border-emerald-500/30">
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                          {textContent}
                        </ReactMarkdown>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}

            {/* Estado Pensando / Cargando */}
            {isLoading && (
              <div className="flex items-start gap-3">
                <div className="w-7 h-7 rounded-lg bg-[#082f25] border border-emerald-500/30 text-emerald-400 flex items-center justify-center shrink-0">
                  <Bot className="w-4 h-4" />
                </div>
                <div className="bg-[#082f25]/90 border border-emerald-500/20 rounded-2xl rounded-tl-none px-4 py-3 text-xs text-emerald-300 flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin text-[#c6a13a]" />
                  <span>Consultando datos del estudio...</span>
                </div>
              </div>
            )}

            {/* Estado de Error */}
            {error && (
              <div className="p-3 rounded-xl bg-rose-950/50 border border-rose-500/30 text-rose-200 text-xs flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                  <span>Ocurrió un error al procesar tu consulta.</span>
                </div>
                <button
                  onClick={() => regenerate()}
                  className="px-2 py-1 rounded bg-rose-900/60 hover:bg-rose-800 text-white flex items-center gap-1 transition-colors cursor-pointer"
                >
                  <RefreshCw className="w-3 h-3" /> Reintentar
                </button>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Formulario de Input */}
          <form
            onSubmit={handleSubmit}
            className="p-3 bg-[#082f25]/90 border-t border-[#c6a13a]/20 flex items-center gap-2"
          >
            <input
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Haz una pregunta sobre el informe..."
              className="flex-1 bg-[#041d17] border border-[#c6a13a]/30 focus:border-[#c6a13a] text-white text-xs md:text-sm rounded-xl px-3.5 py-2.5 focus:outline-none transition-colors placeholder:text-slate-500"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={isLoading || !inputText.trim()}
              className="p-2.5 rounded-xl bg-[#c6a13a] text-[#041d17] hover:bg-[#d8b34c] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-semibold cursor-pointer"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
