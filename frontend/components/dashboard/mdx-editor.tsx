"use client";

import React, { useState, useEffect, useTransition, useCallback, useMemo } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { markdown } from "@codemirror/lang-markdown";
import { yamlFrontmatter } from "@codemirror/lang-yaml";
import { vscodeDark } from "@uiw/codemirror-theme-vscode";

import { HighlightStyle, syntaxHighlighting } from "@codemirror/language";
import { tags as t } from "@lezer/highlight";
import matter from "gray-matter";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {
  Save,
  Send,
  Eye,
  Code,
  CheckCircle,
  AlertCircle,
  FileText,
  PlusCircle,
  ArrowLeft,
  Columns
} from "lucide-react";
import { useRouter } from "next/navigation";

const mdxHighlightStyle = HighlightStyle.define([
  { tag: t.propertyName, color: "#c9a227", fontWeight: "bold" },
  { tag: t.attributeName, color: "#A3B18A", fontWeight: "bold" },
  { tag: t.string, color: "#ecc246" },
  { tag: t.number, color: "#e0a96d" },
  { tag: t.comment, color: "#6b7280", fontStyle: "italic" },
  { tag: t.heading, color: "#DAD7CD", fontWeight: "bold" },
  { tag: t.keyword, color: "#588157", fontWeight: "bold" },
  { tag: t.tagName, color: "#ecc246", fontWeight: "bold" },
]);

interface MdxEditorProps {
  initialReportId?: string | null;
  onSaved?: () => void;
}

export function MdxEditor({ initialReportId, onSaved }: MdxEditorProps) {
  const router = useRouter();
  const [content, setContent] = useState<string>("");
  const [reportId, setReportId] = useState<string | null>(initialReportId || null);
  const [activeView, setActiveView] = useState<"split" | "editor" | "preview">("split");
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [statusMsg, setStatusMsg] = useState<{ success?: boolean; text?: string } | null>(null);
  const [, startTransition] = useTransition();

  // Cargar plantilla por defecto
  const handleLoadTemplate = useCallback(async () => {
    setLoading(true);
    setStatusMsg(null);
    try {
      const res = await fetch("/templates/plantilla-reporte-physaflow.mdx");
      if (res.ok) {
        const templateText = await res.text();
        setContent(templateText);
        setStatusMsg({
          success: true,
          text: "Plantilla oficial MDX cargada correctamente.",
        });
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let isMounted = true;
    const init = async () => {
      if (initialReportId) {
        try {
          const res = await fetch(`/api/report/${initialReportId}`);
          const data = await res.json();
          if (res.ok && data.report && isMounted) {
            const rep = data.report;
            // Si el objeto report ya viene formateado desde la API, construir MDX con frontmatter
            const frontmatterObj: Record<string, unknown> = {
              title: rep.title || "",
              slug: rep.slug || "",
              version: rep.version || "1.0.0",
              language: rep.language || "es",
              status: rep.status || "draft",
              description: rep.description || "",
              publishedAt: rep.publishedAt || null,
            };

            let bodyMarkdown = "";
            if (rep.sections && Array.isArray(rep.sections)) {
              bodyMarkdown = rep.sections
                .map((sec: { title: string; content: string }) => `# ${sec.title}\n\n${sec.content}`)
                .join("\n\n---\n\n");
            } else if (typeof rep.content === "string") {
              bodyMarkdown = rep.content;
            }

            const yamlHeader = matter.stringify(bodyMarkdown, frontmatterObj);
            setContent(yamlHeader);
            setReportId(rep.id);
            setStatusMsg({
              success: true,
              text: `Reporte "${rep.title}" cargado.`,
            });
            setLoading(false);
          }
        } catch (e) {
          console.error(e);
          if (isMounted) setLoading(false);
        }
      } else {
        await handleLoadTemplate();
      }
    };
    void init();
    return () => {
      isMounted = false;
    };
  }, [initialReportId, handleLoadTemplate]);


  // Parsear Frontmatter y cuerpo Markdown en tiempo real
  const parsed = useMemo(() => {
    try {
      const { data, content: bodyContent } = matter(content);
      return {
        valid: true,
        frontmatter: data,
        bodyContent,
      };
    } catch {
      return { valid: false, frontmatter: {}, bodyContent: content };
    }
  }, [content]);

  // Guardar reporte hacia el backend (/api/report)
  const handleSave = async (statusOverride?: "draft" | "published") => {
    setSaving(true);
    setStatusMsg(null);

    try {
      const { data: frontmatter, content: bodyContent } = matter(content);
      const targetStatus = statusOverride || frontmatter.status || "draft";

      // Extraer secciones básicas del markdown divididas por H1 (# )
      const sectionBlocks = bodyContent.split(/^# /m).filter(Boolean);
      const sections = sectionBlocks.map((block, idx) => {
        const lines = block.trim().split("\n");
        const title = lines[0].trim();
        const secContent = lines.slice(1).join("\n").trim();
        return {
          id: title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "") || `sec-${idx + 1}`,
          level: 1,
          title,
          content: secContent,
        };
      });

      const payload = {
        title: frontmatter.title || "Reporte sin título",
        slug: frontmatter.slug || `reporte-${Date.now()}`,
        version: frontmatter.version || "1.0.0",
        language: frontmatter.language || "es",
        status: targetStatus,
        description: frontmatter.description || null,
        sections: sections.length > 0 ? sections : [
          {
            id: "principal",
            level: 1,
            title: frontmatter.title || "Contenido Principal",
            content: bodyContent,
          }
        ],
      };

      const res = await fetch("/api/report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (res.ok) {
        setReportId(data.id || reportId);
        setStatusMsg({
          success: true,
          text: `¡Reporte ${targetStatus === "published" ? "publicado" : "guardado como borrador"} exitosamente!`,
        });
        if (onSaved) onSaved();
      } else {
        setStatusMsg({
          success: false,
          text: data.error || "Error al guardar el reporte.",
        });
      }
    } catch (err: unknown) {
      const errorObj = err as { message?: string };
      setStatusMsg({
        success: false,
        text: errorObj.message || "Error de conexión con el backend.",
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="py-20 flex flex-col items-center justify-center text-sm text-[#A3B18A]">
        <div className="w-8 h-8 border-2 border-[#ecc246] border-t-transparent rounded-full animate-spin mb-3"></div>
        <span>Cargando Editor MDX...</span>
      </div>
    );
  }

  return (
    <div className="space-y-4 font-sans text-[#DAD7CD]">
      {/* Barra de Acciones y Vistas */}
      <div className="sticky top-4 z-20 bg-[#273a2f]/95 backdrop-blur-md border border-[#3a5345] p-3.5 rounded-xl flex flex-wrap items-center justify-between gap-3 shadow-xl">

        {/* Izquierda: Regresar y Selector de Vista */}
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => router.back()}
            className="p-1.5 rounded-md hover:bg-[#344E41] text-[#A3B18A] hover:text-[#ecc246] transition-colors"
            title="Volver"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>

          <div className="flex items-center gap-1 bg-[#344E41] p-1 rounded-lg border border-[#3a5345] text-xs">
            <button
              onClick={() => setActiveView("split")}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-md transition ${
                activeView === "split"
                  ? "bg-[#273a2f] text-[#ecc246] font-semibold shadow-sm"
                  : "text-[#DAD7CD]/70 hover:text-[#DAD7CD]"
              }`}
            >
              <Columns className="w-3.5 h-3.5" />
              <span>Pantalla Dividida</span>
            </button>
            <button
              onClick={() => setActiveView("editor")}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-md transition ${
                activeView === "editor"
                  ? "bg-[#273a2f] text-[#ecc246] font-semibold shadow-sm"
                  : "text-[#DAD7CD]/70 hover:text-[#DAD7CD]"
              }`}
            >
              <Code className="w-3.5 h-3.5" />
              <span>Solo Código</span>
            </button>
            <button
              onClick={() => setActiveView("preview")}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-md transition ${
                activeView === "preview"
                  ? "bg-[#273a2f] text-[#ecc246] font-semibold shadow-sm"
                  : "text-[#DAD7CD]/70 hover:text-[#DAD7CD]"
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Vista Previa</span>
            </button>
          </div>

          <button
            onClick={handleLoadTemplate}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#344E41] hover:bg-[#3a5345] text-[#DAD7CD] rounded-md text-xs font-semibold border border-[#3a5345] transition shadow-sm"
          >
            <PlusCircle className="w-3.5 h-3.5 text-[#ecc246]" />
            <span>Cargar Plantilla MDX</span>
          </button>
        </div>

        {/* Derecha: Botones Guardar y Publicar */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            disabled={saving}
            onClick={() => handleSave("draft")}
            className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold uppercase tracking-wider border border-[#3a5345] bg-[#344E41] hover:bg-[#3a5345] text-[#DAD7CD] rounded-md transition-colors"
          >
            <Save className="h-4 w-4 text-[#ecc246]" />
            {saving ? "Guardando..." : "Guardar Borrador"}
          </button>
          <button
            type="button"
            disabled={saving}
            onClick={() => handleSave("published")}
            className="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold uppercase tracking-wider bg-[#c9a227] text-[#062a20] hover:bg-[#ecc246] rounded-md transition-colors shadow-md"
          >
            <Send className="h-4 w-4" />
            {saving ? "Publicando..." : "Publicar"}
          </button>
        </div>
      </div>

      {statusMsg && (
        <div
          className={`px-4 py-2.5 rounded-lg text-xs font-medium flex items-center justify-between gap-2 border shadow-sm transition-all ${
            statusMsg.success
              ? "bg-[#273a2f] text-emerald-300 border-emerald-500/30"
              : "bg-red-950/20 text-red-300 border-red-500/30"
          }`}
        >
          <div className="flex items-center gap-2">
            {statusMsg.success ? (
              <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
            )}
            <span>{statusMsg.text}</span>
          </div>
        </div>
      )}

      {/* Editor y Vista Previa en Pantalla Dividida */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        {/* Columna Editor CodeMirror */}
        {(activeView === "split" || activeView === "editor") && (
          <div
            className={`${
              activeView === "editor" ? "lg:col-span-2" : ""
            } bg-[#273a2f] border border-[#3a5345] rounded-xl p-4 flex flex-col shadow-lg h-[560px]`}
          >
            <div className="text-xs font-semibold uppercase tracking-wider text-[#A3B18A] mb-3 flex items-center justify-between">
              <span className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-[#ecc246]" />
                Editor de Código
              </span>
            </div>
            <div className="flex-1 border border-[#3a5345] rounded-lg overflow-hidden text-sm bg-[#1e2d25]">
              <CodeMirror
                value={content}
                height="500px"
                theme={vscodeDark}
                extensions={[
                  yamlFrontmatter({
                    content: markdown(),
                  }),
                  syntaxHighlighting(mdxHighlightStyle),
                ]}
                onChange={(val) => {
                  startTransition(() => {
                    setContent(val);
                  });
                }}
                className="text-sm font-mono"
              />
            </div>
          </div>
        )}

        {/* Columna Live Preview Markdown */}
        {(activeView === "split" || activeView === "preview") && (
          <div
            className={`${
              activeView === "preview" ? "lg:col-span-2" : ""
            } bg-[#273a2f] border border-[#3a5345] rounded-xl p-4 flex flex-col shadow-lg h-[560px]`}
          >
            <div className="text-xs font-semibold uppercase tracking-wider text-[#A3B18A] mb-3 flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Eye className="w-4 h-4 text-[#ecc246]" />
                Vista Previa
              </span>
              {!parsed.valid && (
                <span className="text-xs text-red-400 font-bold bg-red-950/40 px-2.5 py-0.5 rounded border border-red-500/30">
                  Error de Sintaxis
                </span>
              )}
            </div>

            <div className="flex-1 border border-[#3a5345] rounded-lg overflow-y-auto p-4 bg-[#1e2d25]">
              {/* Frontmatter Preview Header */}
              {parsed.frontmatter && Object.keys(parsed.frontmatter).length > 0 && (
                <div className="mb-6 p-4 rounded-lg bg-[#344E41] border border-[#3a5345] space-y-2 text-xs">
                  <h3 className="font-bold text-sm text-[#ecc246]">
                    {String(parsed.frontmatter.title || "Sin título")}
                  </h3>
                  {parsed.frontmatter.description && (
                    <p className="text-[#DAD7CD]/80">{String(parsed.frontmatter.description)}</p>
                  )}
                  <div className="flex flex-wrap items-center gap-3 text-[11px] text-[#A3B18A] pt-1 border-t border-[#3a5345]">
                    <span>Slug: <strong className="font-mono text-[#DAD7CD]">{String(parsed.frontmatter.slug || "—")}</strong></span>
                    <span>Versión: <strong className="font-mono text-[#DAD7CD]">{String(parsed.frontmatter.version || "1.0.0")}</strong></span>
                    <span>Estado: <strong className="text-[#ecc246] uppercase">{String(parsed.frontmatter.status || "draft")}</strong></span>
                  </div>
                </div>
              )}

              {/* Markdown Render Body */}
              <article className="prose prose-invert max-w-none prose-headings:text-[#DAD7CD] prose-h1:text-xl prose-h2:text-lg prose-p:text-sm prose-p:text-[#DAD7CD]/90 prose-p:leading-relaxed prose-li:text-sm prose-strong:text-[#ecc246] prose-hr:border-[#3a5345]">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {parsed.bodyContent}
                </ReactMarkdown>
              </article>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
