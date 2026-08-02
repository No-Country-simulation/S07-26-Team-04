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
  FolderOpen,
} from "lucide-react";

interface ReportSummary {
  id: string;
  title: string;
  isPublished: boolean;
}

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
  const [availableReports, setAvailableReports] = useState<ReportSummary[]>([]);
  const [, startTransition] = useTransition();

  // Cargar lista de reportes disponibles para el selector
  const fetchAvailableReports = useCallback(async () => {
    try {
      const res = await fetch("/api/reports?limit=50");
      if (res.ok) {
        const data = await res.json();
        setAvailableReports(data.reports || []);
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  useEffect(() => {
    let isMounted = true;
    const loadReports = async () => {
      try {
        const res = await fetch("/api/reports?limit=50");
        if (res.ok && isMounted) {
          const data = await res.json();
          setAvailableReports(data.reports || []);
        }
      } catch (e) {
        console.error(e);
      }
    };
    void loadReports();
    return () => {
      isMounted = false;
    };
  }, [reportId]);

  // Cargar reporte específico por ID
  const loadReportById = useCallback(async (idToLoad: string) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/reports/${idToLoad}`);
      const data = await res.json();
      if (res.ok && data.report) {
        const rep = data.report;
        // Si el contenido ya incluye el encabezado YAML ("---"), usarlo directamente para preservar el formato original exacto
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
          text: `Reporte cargado. Código ID: ${rep.id}`,
        });
      }
    } catch (err) {
      console.error("Error al cargar reporte:", err);
    } finally {
      setLoading(false);
    }
  }, []);

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
              text: `Reporte cargado. Código ID: ${rep.id}`,
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

  // Guardar Borrador (isPublished = false) o Publicar (isPublished = true)
  const handleSave = async (publishStatus: boolean) => {
    setSaving(true);
    setStatusMsg(null);

    try {
      const blob = new Blob([content], { type: "text/markdown" });
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
        void fetchAvailableReports();
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
      {/* Top Action Toolbar: Crear Nuevo vs Editar Existente */}
      <div className="bg-[var(--paper-2)] border border-[var(--rule-soft)] p-4 rounded-md flex flex-wrap items-center justify-between gap-4 shadow-sm">
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={handleCreateNew}
            className="flex items-center gap-2 px-3.5 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-md text-[12px] font-semibold transition cursor-pointer shadow-sm"
          >
            <PlusCircle className="w-4 h-4 text-emerald-200" />
            <span>Crear Nuevo Reporte</span>
          </button>

          {/* Selector para Abrir y Editar Reporte Existente */}
          {availableReports.length > 0 && (
            <div className="flex items-center gap-2 bg-[var(--paper)] px-3 py-1 rounded-md border border-[var(--rule-soft)] text-[12px]">
              <FolderOpen className="w-4 h-4 text-[var(--forest-700)] shrink-0" />
              <span className="font-semibold text-[var(--forest-800)] hidden sm:inline">Editar Existente:</span>
              <select
                value={reportId || ""}
                onChange={(e) => {
                  if (e.target.value) {
                    void loadReportById(e.target.value);
                  }
                }}
                className="bg-transparent text-[var(--ink)] font-medium outline-none cursor-pointer max-w-[240px] truncate"
              >
                <option value="" disabled>-- Selecciona un reporte --</option>
                {availableReports.map((r) => (
                  <option key={r.id} value={r.id}>
                    [{r.id.slice(-6)}] {r.title} ({r.isPublished ? "Publicado" : "Borrador"})
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        {/* Indicador de Código ID Activo */}
        <div className="flex items-center gap-3">
          <div className="text-right">
            <div className="flex items-center gap-2">
              <span className="font-mono text-[11px] font-bold text-[var(--forest-800)] bg-[var(--paper)] px-2.5 py-0.5 rounded border border-[var(--rule-soft)] shadow-inner">
                {reportId ? `Código / ID: ${reportId}` : "Nuevo Borrador (ID se asignará al guardar)"}
              </span>
              <span
                className={`px-2 py-0.5 text-[10px] uppercase font-bold rounded border ${
                  isPublished
                    ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                    : "bg-amber-50 text-amber-700 border-amber-200"
                }`}
              >
                {isPublished ? "Publicado" : "Borrador"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Editor & Preview Header Controls */}
      <div className="bg-[var(--paper-2)] border border-[var(--rule-soft)] p-3.5 rounded-md flex flex-wrap items-center justify-between gap-4 shadow-sm">
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

        {/* Acciones de Guardado */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleSave(false)}
            disabled={saving}
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-[var(--paper)] hover:bg-white text-[var(--forest-800)] border border-[var(--rule)] rounded-md text-[12px] font-semibold shadow-sm transition disabled:opacity-50 cursor-pointer"
          >
            <Save className="w-3.5 h-3.5 text-[var(--forest-700)]" />
            <span>{saving ? "Guardando..." : "Guardar Borrador"}</span>
          </button>

          <button
            onClick={() => handleSave(true)}
            disabled={saving}
            className="flex items-center gap-4 px-4 py-1.5 bg-[var(--forest-700)] hover:bg-[var(--forest-800)] text-white rounded-md text-[12px] font-semibold shadow-sm transition disabled:opacity-50 cursor-pointer"
          >
            <Globe className="w-3.5 h-3.5 text-[var(--gold-400)]" />
            <span>{saving ? "Publicando..." : "Publicar Reporte"}</span>
          </button>
        </div>
      </div>

      {statusMsg && (
        <div
          className={`p-3 rounded-md text-[12px] flex items-center gap-2 ${
            statusMsg.success
              ? "bg-emerald-50 text-emerald-900 border border-emerald-200"
              : "bg-red-50 text-red-900 border border-red-200"
          }`}
        >
          {statusMsg.success ? <CheckCircle className="w-4 h-4 text-emerald-600" /> : <AlertCircle className="w-4 h-4 text-red-600" />}
          <span>{statusMsg.text}</span>
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
    </div>
  );
}
