"use client";

import React, { useState, useEffect, useTransition, useCallback } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { markdown } from "@codemirror/lang-markdown";
import { yamlFrontmatter } from "@codemirror/lang-yaml";
import { vscodeLight } from "@uiw/codemirror-theme-vscode";
import { HighlightStyle, syntaxHighlighting } from "@codemirror/language";
import { tags as t } from "@lezer/highlight";

const mdxHighlightStyle = HighlightStyle.define([
  { tag: t.propertyName, color: "#0d2818", fontWeight: "bold" }, // Claves YAML (ej. title:, author:)
  { tag: t.attributeName, color: "#143a26", fontWeight: "bold" },
  { tag: t.string, color: "#8B6914" },                           // Strings entre comillas en dorado
  { tag: t.number, color: "#b45309" },                           // Numeros y porcentajes
  { tag: t.comment, color: "#6b7280", fontStyle: "italic" },      // Comentarios #
  { tag: t.heading, color: "#0d2818", fontWeight: "bold" },      // Encabezados # y ##
  { tag: t.keyword, color: "#2d5f47", fontWeight: "bold" },
  { tag: t.tagName, color: "#143a26", fontWeight: "bold" },      // Etiquetas JSX <Chart />
]);
import matter from "gray-matter";
import DynamicReportContent from "./DynamicReportContent";
import { ReportFrontmatterSchema } from "@/lib/report-schema";
import {
  Save,
  Globe,
  Eye,
  Code,
  CheckCircle,
  AlertCircle,
  FileText,
  PlusCircle,
} from "lucide-react";

interface MdxEditorProps {
  initialReportId?: string | null;
  onSaved?: () => void;
}

export default function MdxEditor({ initialReportId, onSaved }: MdxEditorProps) {
  const [content, setContent] = useState<string>("");
  const [reportId, setReportId] = useState<string | null>(initialReportId || null);
  const [isPublished, setIsPublished] = useState<boolean>(false);
  const [activeView, setActiveView] = useState<"split" | "editor" | "preview">("split");
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [statusMsg, setStatusMsg] = useState<{ success?: boolean; text?: string } | null>(null);
  const [, startTransition] = useTransition();

  // Cargar plantilla por defecto para un nuevo reporte
  const handleCreateNew = useCallback(async () => {
    setLoading(true);
    setReportId(null);
    setIsPublished(false);
    setStatusMsg(null);
    try {
      const res = await fetch("/templates/plantilla-reporte-physaflow.mdx");
      if (res.ok) {
        const templateText = await res.text();
        setContent(templateText);
        setStatusMsg({
          success: true,
          text: "Plantilla oficial cargada. Lista para editar.",
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
          const res = await fetch(`/api/reports/${initialReportId}`);
          const data = await res.json();
          if (res.ok && data.report && isMounted) {
            const rep = data.report;
            if (rep.content && rep.content.trim().startsWith("---")) {
              setContent(rep.content);
            } else {
              const frontmatterObj: Record<string, unknown> = {
                title: rep.title || "",
                subtitle: rep.subtitle || "",
                author: rep.author || "",
                publishedDate: rep.publishedDate || "",
                doi: rep.doi || "",
                readingTime: rep.readingTime || "",
                license: rep.license || "",
                globalMedian: rep.globalMedian || "0,0%",
                lossFacilities: rep.lossFacilities || "0,0%",
                lossIT: rep.lossIT || "0,0%",
                lossWorkload: rep.lossWorkload || "0,0%",
                keyFinding: rep.keyFinding || "",
              };

              if (rep.layers && Array.isArray(rep.layers) && rep.layers.length > 0) {
                frontmatterObj.layers = rep.layers;
              }

              const yamlHeader = matter.stringify(rep.content || "", frontmatterObj);
              setContent(yamlHeader);
            }
            setReportId(rep.id);
            setIsPublished(rep.isPublished);
            setStatusMsg({
              success: true,
              text: `Reporte cargado correctamente.`,
            });
            setLoading(false);
          }
        } catch (e) {
          console.error(e);
          if (isMounted) setLoading(false);
        }
      } else {
        try {
          const res = await fetch("/templates/plantilla-reporte-physaflow.mdx");
          if (res.ok && isMounted) {
            const templateText = await res.text();
            setContent(templateText);
            setStatusMsg({
              success: true,
              text: "Plantilla oficial cargada. Lista para editar.",
            });
            setLoading(false);
          }
        } catch (e) {
          console.error(e);
          if (isMounted) setLoading(false);
        }
      }
    };
    void init();
    return () => {
      isMounted = false;
    };
  }, [initialReportId]);

  // Parsear Frontmatter en vivo para la vista previa
  const parsed = React.useMemo(() => {
    try {
      const { data, content: bodyContent } = matter(content);
      const validated = ReportFrontmatterSchema.safeParse(data);
      if (validated.success) {
        return {
          valid: true,
          frontmatter: {
            title: validated.data.title,
            subtitle: validated.data.subtitle || "",
            author: validated.data.author,
            published: validated.data.publishedDate,
            doi: validated.data.doi,
            readingTime: validated.data.readingTime,
            license: validated.data.license,
            medianaGlobal: validated.data.globalMedian,
            lossFacilities: validated.data.lossFacilities,
            lossIT: validated.data.lossIT,
            lossWorkload: validated.data.lossWorkload,
            keyFinding: validated.data.keyFinding || "",
            layers: validated.data.layers || [],
            labels: validated.data.labels || {},
          },
          bodyContent,
        };
      }
    } catch {
      // Ignorar errores parciales de sintaxis mientras el usuario escribe
    }
    return { valid: false, frontmatter: null, bodyContent: content };
  }, [content]);

  // Inspector de Sintaxis en Vivo (Detecta comas sobrantes en props data='[...]')
  const syntaxCheck = React.useMemo(() => {
    if (!content) return { hasTrailingComma: false, errors: [] };
    const chartRegex = /<Chart[\s\S]*?data=(?:'([\s\S]*?)'|"([\s\S]*?)")/g;
    let match;
    const errors: string[] = [];
    let hasTrailingComma = false;

    while ((match = chartRegex.exec(content)) !== null) {
      const jsonStr = match[1] || match[2];
      if (jsonStr) {
        if (/,\s*([\]}])/.test(jsonStr)) {
          hasTrailingComma = true;
          errors.push("Se detectó una coma sobrante al final de un objeto/matriz en prop data de <Chart />.");
        }
      }
    }
    return { hasTrailingComma, errors };
  }, [content]);

  // Estado para el modal de error de sintaxis al intentar publicar
  const [showSyntaxModal, setShowSyntaxModal] = useState(false);

  // Guardar Borrador (isPublished = false) o Publicar (isPublished = true)
  const handleSave = async (publishStatus: boolean) => {
    // Si intenta publicar pero hay comas o sintaxis inválida, mostramos modal informativo
    if (publishStatus && syntaxCheck.hasTrailingComma) {
      setShowSyntaxModal(true);
      return;
    }

    setSaving(true);
    setStatusMsg(null);

    const contentToSend = content;
    try {
      const blob = new Blob([contentToSend], { type: "text/markdown" });
      const file = new File([blob], "reporte.mdx", { type: "text/markdown" });

      const formData = new FormData();
      formData.append("file", file);
      if (reportId) {
        formData.append("targetId", reportId);
      }
      formData.append("isPublished", String(publishStatus));

      const res = await fetch("/api/reports/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (res.ok) {
        setReportId(data.id);
        setIsPublished(data.isPublished);
        setStatusMsg({
          success: true,
          text: `¡Reporte ${publishStatus ? "publicado" : "guardado como borrador"} exitosamente! Código ID: ${data.id}`,
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
        text: errorObj.message || "Error al conectar con el servidor.",
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="py-20 flex flex-col items-center justify-center text-xs text-[var(--forest-700)]">
        <div className="w-8 h-8 border-2 border-[var(--forest-700)] border-t-transparent rounded-full animate-spin mb-3"></div>
        <span>Cargando Editor MDX...</span>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Unified Action Toolbar */}
      <div className="bg-[var(--paper-2)] border border-[var(--rule-soft)] p-3 rounded-md flex flex-wrap items-center justify-between gap-3 shadow-sm">
        {/* Izquierda: Modos de Vista y Crear Nuevo */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Selector de Modos de Vista */}
          <div className="flex items-center gap-1 bg-[var(--paper)] p-1 rounded-md border border-[var(--rule-soft)] text-[11px]">
            <button
              onClick={() => setActiveView("split")}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded transition ${
                activeView === "split"
                  ? "bg-[var(--forest-700)] text-white font-semibold shadow-sm"
                  : "text-[var(--ink-muted)] hover:text-[var(--forest-800)]"
              }`}
            >
              <Code className="w-3.5 h-3.5" />
              <span>Doble Panel</span>
            </button>
            <button
              onClick={() => setActiveView("editor")}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded transition ${
                activeView === "editor"
                  ? "bg-[var(--forest-700)] text-white font-semibold shadow-sm"
                  : "text-[var(--ink-muted)] hover:text-[var(--forest-800)]"
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Solo Código</span>
            </button>
            <button
              onClick={() => setActiveView("preview")}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded transition ${
                activeView === "preview"
                  ? "bg-[var(--forest-700)] text-white font-semibold shadow-sm"
                  : "text-[var(--ink-muted)] hover:text-[var(--forest-800)]"
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Vista Previa</span>
            </button>
          </div>

          <div className="h-5 w-px bg-[var(--rule-soft)] hidden sm:block"></div>

          <button
            onClick={handleCreateNew}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-md text-[12px] font-semibold transition cursor-pointer shadow-sm"
          >
            <PlusCircle className="w-3.5 h-3.5 text-emerald-200" />
            <span>Crear Nuevo</span>
          </button>
        </div>

        {/* Derecha: Código & Estado + Acciones de Guardado */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 text-[11px]">
            <span className="text-[var(--ink-soft)] font-medium">Código:</span>
            <span className="font-mono font-bold text-[var(--forest-800)] bg-[var(--paper)] px-2 py-0.5 rounded border border-[var(--rule-soft)] shadow-inner">
              {reportId ? `#${reportId.slice(-8)}` : "Nuevo"}
            </span>

            <span className="text-[var(--ink-soft)] font-medium ml-1">Estado:</span>
            <span
              className={`px-2 py-0.5 text-[10px] uppercase font-bold rounded border ${
                !reportId
                  ? "bg-blue-50 text-blue-700 border-blue-200"
                  : isPublished
                  ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                  : "bg-amber-50 text-amber-700 border-amber-200"
              }`}
            >
              {!reportId ? "Plantilla" : isPublished ? "Publicado" : "Borrador"}
            </span>
          </div>

          <div className="h-5 w-px bg-[var(--rule-soft)] hidden sm:block"></div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => handleSave(false)}
              disabled={saving}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-[var(--paper)] hover:bg-white text-[var(--forest-800)] border border-[var(--rule)] rounded-md text-[12px] font-semibold shadow-sm transition disabled:opacity-50 cursor-pointer"
            >
              <Save className="w-3.5 h-3.5 text-[var(--forest-700)]" />
              <span>{saving ? "Guardando..." : "Guardar Borrador"}</span>
            </button>

            <button
              onClick={() => handleSave(true)}
              disabled={saving}
              className={`flex items-center gap-2 px-3.5 py-1.5 text-white rounded-md text-[12px] font-semibold shadow-sm transition cursor-pointer ${
                syntaxCheck.hasTrailingComma
                  ? "bg-amber-700 hover:bg-amber-800 opacity-90"
                  : "bg-[var(--forest-700)] hover:bg-[var(--forest-800)]"
              }`}
            >
              <Globe className="w-3.5 h-3.5 text-[var(--gold-400)]" />
              <span>{saving ? "Publicando..." : "Publicar Reporte"}</span>
            </button>
          </div>
        </div>
      </div>

      {statusMsg && (
        <div
          className={`px-3 py-1.5 rounded-md text-[11px] font-medium flex items-center justify-between gap-2 border shadow-xs transition-all ${
            !reportId
              ? "bg-blue-50/90 text-blue-900 border-blue-200"
              : isPublished
              ? "bg-emerald-50/90 text-emerald-900 border-emerald-200"
              : "bg-amber-50/90 text-amber-900 border-amber-200"
          }`}
        >
          <div className="flex items-center gap-2">
            {!reportId ? (
              <FileText className="w-3.5 h-3.5 text-blue-600 shrink-0" />
            ) : statusMsg.success ? (
              <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            ) : (
              <AlertCircle className="w-3.5 h-3.5 text-red-600 shrink-0" />
            )}
            <span>{statusMsg.text}</span>
          </div>

          {!reportId && (
            <span className="text-[10px] text-blue-700 font-semibold bg-blue-100/60 px-2 py-0.5 rounded">
              Tip: Presiona &quot;Guardar Borrador&quot; para registrar tu avance en la base de datos
            </span>
          )}
        </div>
      )}

      {/* Main Workspace: Split View */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 min-h-[650px]">
        {/* Editor CodeMirror Column */}
        {(activeView === "split" || activeView === "editor") && (
          <div className={`${activeView === "editor" ? "lg:col-span-2" : ""} bg-[var(--paper-2)] border border-[var(--rule-soft)] rounded-md p-4 flex flex-col`}>
            <div className="text-[11px] font-semibold uppercase tracking-wider text-[var(--ink-soft)] mb-2 flex items-center justify-between">
              <span>Código MDX / Frontmatter YAML</span>
              <span className="font-mono text-[10px]">Syntax: Markdown + JSX</span>
            </div>
            <div className="flex-1 border border-[var(--rule-soft)] rounded-sm overflow-hidden text-sm bg-white">
              <CodeMirror
                value={content}
                height="620px"
                theme={vscodeLight}
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

        {/* Live Preview Column */}
        {(activeView === "split" || activeView === "preview") && (
          <div className={`${activeView === "preview" ? "lg:col-span-2" : ""} bg-[var(--paper)] border border-[var(--rule-soft)] rounded-md p-6 overflow-y-auto max-h-[700px]`}>
            <div className="text-[11px] font-semibold uppercase tracking-wider text-[var(--ink-soft)] mb-4 flex items-center justify-between border-b border-[var(--rule-soft)] pb-2">
              <span>Vista Previa en Vivo (Live Render)</span>
              <span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                {parsed.valid ? "Frontmatter Válido" : "Parseando..."}
              </span>
            </div>

            {parsed.valid && parsed.frontmatter ? (
              <DynamicReportContent
                content={parsed.bodyContent}
                lang="ES"
                frontmatter={parsed.frontmatter as unknown as React.ComponentProps<typeof DynamicReportContent>["frontmatter"]}
              />
            ) : (
              <div className="py-12 text-center text-xs text-[var(--ink-muted)]">
                Escribe o edita el YAML Frontmatter para previsualizar el reporte renderizado...
              </div>
            )}
          </div>
        )}
      </div>

      {/* Cartel / Barra Informativa de Sintaxis al pie del editor */}
      {syntaxCheck.hasTrailingComma && (
        <div className="bg-amber-50 border border-amber-200 rounded-md p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-[12px] shadow-sm">
          <div className="flex items-start gap-2.5 text-amber-900">
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-[13px]">Aviso de Sintaxis en Grafico (&lt;Chart /&gt;)</p>
              <p className="text-[12px] text-amber-800 mt-0.5">
                Hay una coma sobrante al final del JSON en la propiedad <code>data</code>. Puedes seguir editando o <strong>Guardar como Borrador</strong>, pero para publicar públicamente debes removerla.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* MODAL INFORMATIVO SI INTENTA PUBLICAR CON ERROR DE SINTAXIS */}
      {showSyntaxModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[var(--paper-2)] border border-[var(--rule-soft)] rounded-lg p-6 max-w-md w-full shadow-2xl space-y-4 animate-scale-up">
            <div className="flex items-center gap-3 border-b border-[var(--rule-soft)] pb-3">
              <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center shrink-0">
                <AlertCircle className="w-5 h-5 text-amber-700" />
              </div>
              <div>
                <h3 className="font-display font-bold text-[16px] text-[var(--forest-800)]">
                  Error de Sintaxis al Publicar
                </h3>
                <p className="text-[11px] text-[var(--ink-soft)]">
                  Revisión previa a la publicación en el sitio web público.
                </p>
              </div>
            </div>

            <p className="text-[13px] text-[var(--ink)] leading-relaxed">
              Detectamos una coma sobrante o un formato JSON incompleto en un componente <code>&lt;Chart /&gt;</code>. Para garantizar la integridad del sitio público no es posible publicar así.
            </p>

            <div className="bg-[var(--paper)] p-3 rounded border border-[var(--rule-soft)] text-[12px] space-y-1.5">
              <p className="font-semibold text-[var(--forest-800)]">¿Qué deseas hacer?</p>
              <ul className="list-disc pl-4 space-y-1 text-[var(--ink-muted)] text-[11px]">
                <li>Puedes <strong>Guardar como Borrador</strong> para no perder tu avance.</li>
                <li>O puedes revisar nuestra guía rápida de formato.</li>
              </ul>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-end gap-2.5 pt-2">
              <a
                href="/templates/plantilla-reporte-physaflow.mdx"
                target="_blank"
                className="w-full sm:w-auto text-center px-3.5 py-2 text-[12px] font-semibold text-[var(--forest-700)] hover:underline"
              >
                Ver Guía de Plantillas →
              </a>

              <button
                onClick={() => {
                  setShowSyntaxModal(false);
                  void handleSave(false); // Guardar borrador inmediatamente
                }}
                className="w-full sm:w-auto px-4 py-2 bg-amber-700 hover:bg-amber-800 text-white rounded text-[12px] font-semibold transition cursor-pointer shadow-sm"
              >
                Guardar como Borrador
              </button>

              <button
                onClick={() => setShowSyntaxModal(false)}
                className="w-full sm:w-auto px-3.5 py-2 bg-[var(--paper)] hover:bg-white text-[var(--ink-muted)] border border-[var(--rule)] rounded text-[12px] font-semibold transition cursor-pointer"
              >
                Seguir Editando
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
