"use client";

import React, { useState, useRef, useEffect } from "react";
import { marked } from "marked";

interface Message {
  role: "user" | "model";
  content: string;
}

interface ChatAyudanteProps {
  lang?: string;
}

export default function ChatAyudante({ lang = "ES" }: ChatAyudanteProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [hasUnread, setHasUnread] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const isEn = lang.toUpperCase() === "EN";

  // Setup initial greetings
  useEffect(() => {
    const greeting = isEn
      ? "Hello! I am your PhysaFlow AI assistant. Ask me anything about this research report, stranded capacity, or the datacenter layers."
      : "¡Hola! Soy tu asistente de IA para PhysaFlow. Pregúntame lo que quieras sobre este reporte de investigación, la capacidad varada o las capas del datacenter.";
    
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMessages([{ role: "model", content: greeting }]);
  }, [isEn]);

  // Scroll to bottom on new messages
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isLoading]);

  const toggleChat = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      setHasUnread(false);
    }
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userText = input.trim();
    setInput("");
    
    const updatedMessages = [...messages, { role: "user", content: userText } as Message];
    setMessages(updatedMessages);
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: updatedMessages,
          lang,
        }),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      const replyText = data.reply || (isEn ? "Sorry, I couldn't get a response." : "Lo siento, no pude obtener una respuesta.");

      setMessages((prev) => [...prev, { role: "model", content: replyText }]);
      
      if (!isOpen) {
        setHasUnread(true);
      }
    } catch (error) {
      console.error("Error communicating with chat API:", error);
      setMessages((prev) => [
        ...prev,
        {
          role: "model",
          content: isEn
            ? "Error: Unable to connect to assistant API."
            : "Error: No se pudo conectar con el servidor del asistente.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  // Helper to safely parse markdown to HTML string
  const renderMarkdown = (text: string) => {
    try {
      return { __html: marked.parse(text) };
    } catch {
      return { __html: text };
    }
  };

  return (
    <div className="no-print font-sans">
      {/* Chat Window Panel */}
      {isOpen && (
        <div className="fixed bottom-20 right-6 z-50 w-[360px] sm:w-[400px] h-[500px] bg-[var(--paper-2)] border border-[var(--rule)] rounded-md shadow-2xl flex flex-col overflow-hidden transition-all duration-300">
          
          {/* Header */}
          <div className="bg-[var(--forest-800)] text-[var(--paper)] p-4 flex items-center justify-between border-b border-[var(--forest-900)]">
            <div className="flex items-center gap-2.5">
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div>
              <span className="font-serif font-medium text-[15px] tracking-wide">
                {isEn ? "PhysaFlow AI Assistant" : "Asistente IA PhysaFlow"}
              </span>
            </div>
            {/* Redundant minimize button removed from here */}
          </div>

          {/* Messages area */}
          <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-[var(--paper)]">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex flex-col ${
                  msg.role === "user" ? "items-end" : "items-start"
                }`}
              >
                {/* Bubble */}
                <div
                  className={`max-w-[85%] rounded px-3.5 py-2.5 text-[13px] leading-relaxed shadow-sm ${
                    msg.role === "user"
                      ? "bg-[var(--forest-700)] text-[var(--paper)]"
                      : "bg-[var(--paper-2)] border border-[var(--rule-soft)] text-[var(--ink)]"
                  }`}
                >
                  <div 
                    className="prose-chat"
                    dangerouslySetInnerHTML={renderMarkdown(msg.content)}
                  />
                </div>
              </div>
            ))}
            
            {/* Loading Indicator */}
            {isLoading && (
              <div className="flex items-start">
                <div className="bg-[var(--paper-2)] border border-[var(--rule-soft)] text-[var(--ink-muted)] rounded px-3.5 py-2.5 text-[12px] flex items-center gap-1.5 shadow-sm">
                  <span>{isEn ? "Thinking" : "Pensando"}</span>
                  <span className="flex gap-0.5">
                    <span className="w-1 h-1 rounded-full bg-[var(--ink-muted)] animate-bounce" style={{ animationDelay: "0ms" }}></span>
                    <span className="w-1 h-1 rounded-full bg-[var(--ink-muted)] animate-bounce" style={{ animationDelay: "150ms" }}></span>
                    <span className="w-1 h-1 rounded-full bg-[var(--ink-muted)] animate-bounce" style={{ animationDelay: "300ms" }}></span>
                  </span>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Form Input */}
          <form onSubmit={handleSend} className="p-3 border-t border-[var(--rule)] bg-[var(--paper-2)] flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={isEn ? "Ask about the paper..." : "Pregunta sobre el reporte..."}
              className="flex-1 bg-[var(--paper)] border border-[var(--rule-soft)] px-3 py-2 rounded-sm text-[13px] placeholder-[var(--ink-muted)] focus:outline-none focus:border-[var(--forest-700)] transition text-[var(--ink)]"
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="bg-[var(--forest-800)] text-[var(--paper)] px-4 py-2 rounded-sm text-[12px] font-semibold tracking-wider hover:bg-[var(--forest-700)] disabled:opacity-50 transition uppercase flex items-center justify-center cursor-pointer"
            >
              {isEn ? "Send" : "Enviar"}
            </button>
          </form>
        </div>
      )}

      {/* Trigger Button - Remains fixed at the bottom right */}
      <button
        onClick={toggleChat}
        className={`fixed bottom-6 right-6 z-50 w-12 h-12 rounded-full shadow-lg flex items-center justify-center cursor-pointer transition-all duration-300 transform hover:scale-105 ${
          isOpen
            ? "bg-[var(--paper-2)] border border-[var(--rule)] text-[var(--ink)]"
            : "bg-[var(--forest-800)] text-[var(--paper)] hover:bg-[var(--forest-700)]"
        }`}
        title={isEn ? "PhysaFlow AI Assistant" : "Asistente IA PhysaFlow"}
      >
        {isOpen ? (
          /* Minimize icon */
          <svg width="18" height="18" viewBox="0 0 16 16" fill="none">
            <path d="M12 4L4 12M4 4l8 8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
          </svg>
        ) : (
          /* Speech Bubble icon */
          <div className="relative">
            <svg width="20" height="20" viewBox="0 0 16 16" fill="none">
              <path
                d="M14 8c0 3.31-2.69 6-6 6-1.04 0-2.02-.27-2.89-.74L2 14l.74-3.11C2.27 10.02 2 9.04 2 8c0-3.31 2.69-6 6-6s6 2.69 6 6z"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            {hasUnread && (
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-amber-400 border-2 border-[var(--forest-800)] rounded-full animate-bounce"></span>
            )}
          </div>
        )}
      </button>
    </div>
  );
}
