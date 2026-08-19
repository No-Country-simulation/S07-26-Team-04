"use client";

import React, {
  useState,
  useEffect,
  useTransition,
  useCallback,
  useMemo,
} from "react";
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
  ArrowLeft,
  Columns,
} from "lucide-react";
import { Highlight } from "@/components/animate-ui/primitives/effects/highlight";
import { clearReportCache } from "@/services/report.service";
import { useRouter } from "next/navigation";
import {
  BarChart as RechartsBarChart,
  Bar,
  LineChart as RechartsLineChart,
  Line,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

import { CapacityProgression } from "@/components/report/capacity-progression";
import { Card } from "@/components/report/card";
import SectionContent from "@/components/report/section-content";
import {
  parseSubsectionCards,
  parseTaxonomyContent,
} from "@/components/report/taxonomy-parse";

const PIE_COLORS = ["#c9a227", "#ecc246", "#4E6F57", "#2d5f47", "#e0a96d"];

function ChartPreviewCard({
  title,
  description,
  typeLabel,
  figNumber,
  itemCount,
  children,
}: {
  title?: string;
  description?: string;
  typeLabel: string;
  figNumber?: string;
  itemCount: number;
  children: React.ReactNode;
}) {
  return (
    <div className="my-8 p-6 lg:p-8 border border-[#c9a227]/30 bg-[#124132] rounded-sm shadow-xl relative">
      {/* HEADER */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <span className="text-xs font-mono font-semibold text-[#ecc246] uppercase tracking-wider block">
            {typeLabel}
          </span>
          {title && (
            <h3 className="font-serif text-lg font-bold text-white mt-1">
              {title}
            </h3>
          )}
          {description && (
            <p className="text-xs text-[#e5e2da]/80 mt-1 max-w-2xl font-sans">
              {description}
            </p>
          )}
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[10px] font-mono text-[#e5e2da]/80 bg-[#0b3d2e] px-2 py-1 rounded border border-[#c9a227]/30">
            {itemCount} Datos
          </span>
          <button
            className="text-xs font-mono font-medium text-[#ecc246] border border-[#c9a227]/40 px-3 py-1 rounded-sm flex items-center gap-1.5 bg-[#0b3d2e] pointer-events-none opacity-90"
            type="button"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" x2="12" y1="15" y2="3" />
            </svg>
            SVG
          </button>
        </div>
      </div>

      {/* CHART BODY */}
      <div className="w-full h-[280px] mt-2">{children}</div>

      {/* FOOTER CAPTION (Identical to Home Page charts) */}
      <div className="chart-caption text-xs text-[#e5e2da]/80 mt-4 pt-3 border-t border-[#c9a227]/20 font-sans">
        {figNumber ? `${figNumber} — ` : ""}
        {title ?? "Gráfico"}. {description ?? ""}
      </div>
    </div>
  );
}

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
  const [reportId, setReportId] = useState<string | null>(
    initialReportId || null,
  );
  const [reportStatus, setReportStatus] = useState<
    "draft" | "published" | "archived"
  >("draft");
  const [activeView, setActiveView] = useState<"split" | "editor" | "preview">(
    "split",
  );
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [statusMsg, setStatusMsg] = useState<{
    success?: boolean;
    text?: string;
  } | null>(null);
  const [, startTransition] = useTransition();

  // Función helper para remover `status:` y `publishedAt:` del texto MDX
  const cleanMdxFrontmatter = (mdxText: string) => {
    return mdxText
      .replace(/^\s*publishedAt:\s*.*(?:\r?\n)?/gm, "")
      .replace(/^\s*status:\s*.*(?:\r?\n)?/gm, "");
  };

  // Cargar plantilla por defecto
  const handleLoadTemplate = useCallback(async () => {
    setLoading(true);
    setStatusMsg(null);
    try {
      const res = await fetch("/templates/plantilla-reporte-physaflow.mdx");
      if (res.ok) {
        const templateText = await res.text();
        setContent(cleanMdxFrontmatter(templateText));
        setReportStatus("draft");
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
          if (res.ok && data && isMounted) {
            const rep = data.report || data;
            if (rep.status) {
              setReportStatus(rep.status);
            }

            if (
              rep.mdxContent &&
              typeof rep.mdxContent === "string" &&
              rep.mdxContent.trim()
            ) {
              setContent(cleanMdxFrontmatter(rep.mdxContent));
            } else {
              const frontmatterObj: Record<string, unknown> = {
                title: rep.title || "",
                slug: rep.slug || "",
                version: rep.version || "1.0.0",
                language: rep.language || "es",
                description: rep.description || "",
              };

              let bodyMarkdown = "";
              if (rep.sections && Array.isArray(rep.sections)) {
                bodyMarkdown = rep.sections
                  .map((sec: { title: string; content: string }) => {
                    let text = `# ${sec.title}\n\n${sec.content}`;
                    if (
                      sec.title.toLowerCase().includes("hallazgos") ||
                      sec.title.toLowerCase().includes("evolución") ||
                      sec.title.toLowerCase().includes("capacidad")
                    ) {
                      if (rep.metrics && Object.keys(rep.metrics).length > 0) {
                        text += `\n\n\`\`\`json\n${JSON.stringify(rep.metrics, null, 2)}\n\`\`\``;
                      }
                      if (
                        rep.charts?.figure2 &&
                        Object.keys(rep.charts.figure2).length > 0
                      ) {
                        text += `\n\n\`\`\`json\n${JSON.stringify(rep.charts.figure2, null, 2)}\n\`\`\``;
                      }
                    }
                    return text;
                  })
                  .join("\n\n---\n\n");
              } else if (typeof rep.content === "string") {
                bodyMarkdown = rep.content;
              }

              const yamlHeader = matter.stringify(bodyMarkdown, frontmatterObj);
              setContent(cleanMdxFrontmatter(yamlHeader));
            }

            setReportId(rep.id);
            setStatusMsg({
              success: true,
              text: `Reporte "${rep.title || "Cargado"}" cargado exitosamente desde la base de datos.`,
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

    if (!content || typeof content !== "string" || !content.trim()) {
      setStatusMsg({
        success: false,
        text: "El contenido del editor está vacío. Carga la plantilla oficial o escribe en el editor.",
      });
      setSaving(false);
      return;
    }

    try {
      const { data: frontmatter } = matter(content);
      // El estado se determina EXCLUSIVAMENTE por el botón presionado (Guardar Borrador vs Publicar)
      const targetStatus = statusOverride || "draft";

      // Extraer título si no viene en frontmatter
      let extractedTitle = frontmatter.title;
      if (!extractedTitle) {
        const titleMatch = content.match(/^#\s+(.+)$/m);
        if (titleMatch) {
          extractedTitle = titleMatch[1].trim();
        }
      }

      // Extraer slug o generar a partir del título
      let extractedSlug = frontmatter.slug;
      if (!extractedSlug && extractedTitle) {
        extractedSlug = extractedTitle
          .toLowerCase()
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "")
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/^-+|-+$/g, "");
      }

      const payload = {
        title: extractedTitle || "Índice de Capacidad Varada (SCI)",
        slug: extractedSlug || `reporte-${Date.now()}`,
        mdxContent: content,
        version: frontmatter.version || "1.0.0",
        language: frontmatter.language || "es",
        status: targetStatus,
        description: frontmatter.description || null,
      };

      const url = reportId ? `/api/report/${reportId}` : "/api/report";
      const method = reportId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (res.ok) {
        setReportId(data.id || reportId);
        setReportStatus(targetStatus);
        clearReportCache(data.id);
        clearReportCache();
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
        <div className="flex flex-wrap items-center gap-1.5">
          <button
            onClick={() => router.back()}
            className="p-1 rounded hover:bg-[#344E41] text-[#A3B18A] hover:text-[#ecc246] transition-colors"
            title="Volver"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
          </button>

          <Highlight
            mode="parent"
            value={activeView}
            onValueChange={(val) =>
              val && setActiveView(val as "split" | "editor" | "preview")
            }
            className="rounded bg-[#273a2f] border border-[#c9a227]/40 shadow-sm"
            containerClassName="flex items-center gap-0.5 bg-[#344E41] p-0.5 rounded-md border border-[#3a5345]"
            transition={{ type: "spring", stiffness: 350, damping: 25 }}
          >
            <button
              data-value="split"
              onClick={() => setActiveView("split")}
              style={{ fontSize: "9px", lineHeight: "12px" }}
              className={`relative z-10 flex items-center gap-1 px-1.5 py-0.5 rounded font-semibold tracking-tight cursor-pointer transition-colors ${
                activeView === "split"
                  ? "text-[#ecc246]"
                  : "text-[#DAD7CD]/70 hover:text-[#DAD7CD]"
              }`}
            >
              <Columns className="w-2.5 h-2.5" />
              <span style={{ fontSize: "10px" }}>Pantalla Dividida</span>
            </button>
            <button
              data-value="editor"
              onClick={() => setActiveView("editor")}
              style={{ fontSize: "10px", lineHeight: "12px" }}
              className={`relative z-10 flex items-center gap-1 px-1.5 py-0.5 rounded font-semibold tracking-tight cursor-pointer transition-colors ${
                activeView === "editor"
                  ? "text-[#ecc246]"
                  : "text-[#DAD7CD]/70 hover:text-[#DAD7CD]"
              }`}
            >
              <Code className="w-2.5 h-2.5" />
              <span style={{ fontSize: "10px" }}>Solo Código</span>
            </button>
            <button
              data-value="preview"
              onClick={() => setActiveView("preview")}
              style={{ fontSize: "10px", lineHeight: "12px" }}
              className={`relative z-10 flex items-center gap-1 px-1.5 py-0.5 rounded font-semibold tracking-tight cursor-pointer transition-colors ${
                activeView === "preview"
                  ? "text-[#ecc246]"
                  : "text-[#DAD7CD]/70 hover:text-[#DAD7CD]"
              }`}
            >
              <Eye className="w-2.5 h-2.5" />
              <span style={{ fontSize: "10px" }}>Vista Previa</span>
            </button>
          </Highlight>

          {/* Badge del Estado Actual en Base de Datos */}
          <div className="ml-1">
            {!reportId ? (
              <span className="px-2 py-0.5 text-[10px] font-bold tracking-wider font-mono rounded bg-cyan-950/90 text-cyan-400 border border-cyan-500/50 uppercase shadow-sm flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                PLANTILLA
              </span>
            ) : reportStatus === "published" ? (
              <span className="px-2 py-0.5 text-[10px] font-bold tracking-wider font-mono rounded bg-emerald-950/90 text-emerald-400 border border-emerald-500/50 uppercase shadow-sm flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                PUBLICADO
              </span>
            ) : reportStatus === "archived" ? (
              <span className="px-2 py-0.5 text-[10px] font-bold tracking-wider font-mono rounded bg-slate-900/90 text-slate-400 border border-slate-500/50 uppercase shadow-sm flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                ARCHIVADO
              </span>
            ) : (
              <span className="px-2 py-0.5 text-[10px] font-bold tracking-wider font-mono rounded bg-amber-950/90 text-amber-400 border border-amber-500/50 uppercase shadow-sm flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                BORRADOR
              </span>
            )}
          </div>
        </div>

        {/* Derecha: Botones Guardar y Publicar */}
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            disabled={saving}
            onClick={() => handleSave("draft")}
            className="btn-gold-primary !px-2.5 !py-0.5 !text-[10px] !rounded"
          >
            <Save className="h-3 w-3" />
            {saving ? "Guardando..." : "Guardar Borrador"}
          </button>
          <button
            type="button"
            disabled={saving}
            onClick={() => handleSave("published")}
            className="btn-gold-primary !px-2.5 !py-0.5 !text-[10px] !rounded"
          >
            <Send className="h-3 w-3" />
            {saving ? "Publicando..." : "Publicar"}
          </button>
        </div>
      </div>

      {statusMsg && (
        <div
          className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center justify-between gap-2 border shadow-sm transition-all ${
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

            <div className="flex-1 border border-[#3a5345] rounded-lg overflow-y-auto p-0 bg-[#0b3d2e]">
              {/* Dynamic Metadata Extraction with robust regex */}
              {(() => {
                const getField = (key: string, fallback: string) => {
                  const reg = new RegExp(
                    `(?:\\*\\*${key}:\\*\\*|${key}:)\\s*(.+)`,
                    "i",
                  );
                  const m = parsed.bodyContent.match(reg);
                  if (m && m[1]) return m[1].replace(/[*_]/g, "").trim();
                  return fallback;
                };

                const author = getField("Autor", "Dr. Hernan Cortez");
                const doi = getField("DOI", "physaflow/sci-2026-001");
                const date = getField("Fecha", "Octubre 2026");
                const version = String(parsed.frontmatter.version || "1.0.0");

                // Remove duplicate "# Metadatos del Reporte" block from preview body
                const cleanBodyContent = parsed.bodyContent
                  .replace(/# Metadatos del Reporte[\s\S]*?(?=^# |\Z)/m, "")
                  // La taxonomía se renderiza como Cards, no como markdown crudo
                  .replace(
                    /(^#\s*[^\n]*taxonom[^\n]*\n)[\s\S]*?(?=^#\s)/im,
                    "$1",
                  )
                  .trim();

                // Taxonomía: extraer la sección cruda del MDX para parsear las Cards
                const taxonomySectionMatch = parsed.bodyContent.match(
                  /^#\s*[^\n]*taxonom[^\n]*\n[\s\S]*?(?=^#\s)/im,
                );
                const taxonomyBody = taxonomySectionMatch
                  ? taxonomySectionMatch[0].replace(/^#\s*[^\n]*\n/, "").trim()
                  : "";
                const { mainIntro, layers } =
                  parseTaxonomyContent(taxonomyBody);

                return (
                  <div className="min-h-full bg-[#0b3d2e] text-[#f4f1e8]">
                    {/* HERO (Identical to Home Page hero.tsx) */}
                    <section className="report-hero relative overflow-hidden w-full p-6 lg:p-8 bg-[#0b3d2e] border-b border-[#c9a227]/30 shadow-2xl">
                      <div className="relative z-10 w-full">
                        <p className="eyebrow text-xs font-mono font-semibold text-[#c9a227] tracking-[0.12em] uppercase mb-3">
                          INVESTIGACIÓN DE PhysaFlow
                        </p>
                        <h1 className="font-serif text-2xl lg:text-3xl font-bold text-[#f4f1e8] leading-tight mb-3">
                          {String(
                            parsed.frontmatter.title ||
                              "Índice de Capacidad Varada (SCI)",
                          )}
                        </h1>
                        {parsed.frontmatter.description && (
                          <p className="hero-copy font-serif text-sm text-[#c0c8c3] leading-relaxed mb-6 max-w-3xl">
                            {String(parsed.frontmatter.description)}
                          </p>
                        )}

                        {/* HERO META GRID */}
                        <div className="hero-meta grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-[#c9a227]/30 text-xs">
                          <div>
                            <span className="text-[11px] font-mono text-[#c6a13a] uppercase tracking-wider block mb-0.5">
                              Autor
                            </span>
                            <strong className="text-sm font-sans font-medium text-[#e5e2da] block">
                              {author}
                            </strong>
                          </div>
                          <div>
                            <span className="text-[11px] font-mono text-[#c6a13a] uppercase tracking-wider block mb-0.5">
                              DOI
                            </span>
                            <strong className="text-xs font-mono text-[#e5e2da] block">
                              {doi}
                            </strong>
                          </div>
                          <div>
                            <span className="text-[11px] font-mono text-[#c6a13a] uppercase tracking-wider block mb-0.5">
                              Publicado
                            </span>
                            <strong className="text-sm font-sans font-medium text-[#e5e2da] block">
                              {date}
                            </strong>
                          </div>
                          <div>
                            <span className="text-[11px] font-mono text-[#c6a13a] uppercase tracking-wider block mb-0.5">
                              Versión
                            </span>
                            <strong className="text-xs font-mono text-[#e5e2da] block">
                              {version}
                            </strong>
                          </div>
                        </div>
                      </div>
                    </section>

                    {/* REPORT CONTENT (Identical to Home Page #124132 background) */}
                    <div className="p-6 lg:p-8 bg-[#124132] border-t border-[#c9a227]/30">
                      <article className="prose prose-invert max-w-none prose-p:font-serif prose-p:text-sm prose-p:text-[#e5e2da]/90 prose-p:leading-relaxed prose-li:text-sm prose-strong:text-[#ecc246] prose-hr:border-[#c9a227]/20">
                        <ReactMarkdown
                          remarkPlugins={[remarkGfm]}
                          components={{
                            h1: ({ children }) => {
                              const titleStr = String(children);
                              const numMatch =
                                titleStr.match(/^(\d{2})\s*—\s*(.*)$/);
                              const isTaxonomy = titleStr
                                .toLowerCase()
                                .includes("taxonom");

                              const isMethodology = titleStr
                                .toLowerCase()
                                .includes("metodología");
                              const isCitation = titleStr
                                .toLowerCase()
                                .includes("citar");

                              return (
                                <div className="mb-6">
                                  <div className="report-section-header mt-10 mb-4 border-b border-[#c9a227]/20 pb-4 flex items-baseline gap-3">
                                    {numMatch ? (
                                      <>
                                        <span className="section-number text-2xl font-serif font-bold text-[#c9a227]">
                                          {numMatch[1]}
                                        </span>
                                        <h2 className="section-title font-serif text-xl font-bold text-[#f4f1e8]">
                                          {numMatch[2]}
                                        </h2>
                                      </>
                                    ) : (
                                      <h2 className="font-serif text-xl font-bold text-[#ecc246]">
                                        {children}
                                      </h2>
                                    )}
                                  </div>

                                  {isTaxonomy && (
                                    <div className="mt-6 mb-8 space-y-10">
                                      {mainIntro && (
                                        <SectionContent content={mainIntro} />
                                      )}

                                      {layers.map((layer, index) => {
                                        const defaultBadge =
                                          index === 0
                                            ? "F"
                                            : index === 1
                                              ? "I"
                                              : "W";
                                        const { intro, cards } =
                                          parseSubsectionCards(
                                            layer.body,
                                            defaultBadge,
                                          );

                                        return (
                                          <div
                                            key={index}
                                            className="space-y-4 pt-4 border-t border-[#c9a227]/20"
                                          >
                                            <div>
                                              <h3 className="font-serif text-lg font-bold text-[#f4f1e8] mb-2">
                                                {layer.title}
                                              </h3>
                                              {intro && (
                                                <SectionContent
                                                  content={intro}
                                                />
                                              )}
                                            </div>

                                            <div className="space-y-4">
                                              {cards.map((card) => (
                                                <Card
                                                  key={card.id}
                                                  badge={card.badge}
                                                  code={card.code}
                                                  mediana={card.mediana}
                                                  title={card.title}
                                                  queSeVe={card.queSeVe}
                                                  cuantoCuesta={
                                                    card.cuantoCuesta
                                                  }
                                                  porQueOcurre={
                                                    card.porQueOcurre
                                                  }
                                                  labels={card.labels}
                                                />
                                              ))}
                                            </div>
                                          </div>
                                        );
                                      })}
                                    </div>
                                  )}

                                  {isMethodology && (
                                    <div className="border border-[#c9a227]/30 p-6 rounded-sm mt-6 mb-8 bg-[#0b3d2e]/80 shadow-lg">
                                      <div className="text-[11px] font-mono text-[#c9a227] tracking-wider uppercase font-semibold mb-2">
                                        PROGRESIÓN DE ESTADOS DE CAPACIDAD
                                      </div>
                                      <h3 className="font-serif text-lg font-bold text-[#f4f1e8] mb-2">
                                        De capacidad instalada a capacidad
                                        productiva
                                      </h3>
                                      <p className="text-xs text-[#c0c8c3] mb-6 max-w-2xl font-serif">
                                        Cada transición representa una condición
                                        necesaria para que la capacidad física
                                        de un centro de datos pueda convertirse
                                        finalmente en trabajo útil.
                                      </p>
                                      <CapacityProgression />
                                    </div>
                                  )}

                                  {isCitation && (
                                    <div className="mt-6 mb-8">
                                      <div className="border border-[#c9a227]/30 bg-[#0b3d2e] rounded-sm p-6 shadow-xl relative">
                                        <div className="flex items-center justify-between border-b border-[#c9a227]/20 pb-4 mb-4">
                                          <div>
                                            <span className="text-[10px] font-mono text-[#c6a13a] uppercase tracking-wider block font-semibold mb-1">
                                              CITACIÓN RECOMENDADA
                                            </span>
                                            <h3 className="font-serif text-lg font-bold text-white">
                                              {String(
                                                parsed.frontmatter.title ||
                                                  "El Índice de Capacidad Varada (SCI)",
                                              )}
                                            </h3>
                                          </div>
                                          <span className="text-xs font-mono text-[#ecc246] bg-[#0d2818] px-3 py-1 border border-[#c9a227]/30 rounded">
                                            2026
                                          </span>
                                        </div>

                                        <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
                                          <p className="text-xs text-[#e5e2da]/90 font-serif leading-relaxed italic max-w-xl">
                                            Fuente: PhysaFlow Stranded Capacity
                                            Index — Licencia: CC BY-SA 4.0.
                                          </p>
                                          <button
                                            type="button"
                                            className="text-xs font-mono text-[#ecc246] border border-[#c9a227]/40 bg-[#0b3d2e] px-4 py-2 rounded-sm flex items-center gap-2 font-semibold hover:bg-[#0d2818] transition-colors"
                                            onClick={() => {
                                              navigator.clipboard.writeText(
                                                `Cortez, H. (2026). ${String(parsed.frontmatter.title || "El Índice de Capacidad Varada (SCI)")}. PhysaFlow. DOI: ${doi}`,
                                              );
                                            }}
                                          >
                                            <svg
                                              xmlns="http://www.w3.org/2000/svg"
                                              width="14"
                                              height="14"
                                              viewBox="0 0 24 24"
                                              fill="none"
                                              stroke="currentColor"
                                              strokeWidth="2"
                                              strokeLinecap="round"
                                              strokeLinejoin="round"
                                            >
                                              <rect
                                                width="14"
                                                height="14"
                                                x="8"
                                                y="8"
                                                rx="2"
                                                ry="2"
                                              />
                                              <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
                                            </svg>
                                            COPIAR CITACIÓN
                                          </button>
                                        </div>
                                      </div>

                                      <div className="flex flex-wrap items-center gap-8 mt-6 text-xs border-t border-[#c9a227]/20 pt-4">
                                        <div>
                                          <span className="text-[10px] font-mono text-[#c6a13a] uppercase block mb-0.5">
                                            DOI
                                          </span>
                                          <strong className="text-white font-mono text-xs">
                                            {doi}
                                          </strong>
                                        </div>
                                        <div className="w-[1px] h-6 bg-[#c9a227]/20" />
                                        <div>
                                          <span className="text-[10px] font-mono text-[#c6a13a] uppercase block mb-0.5">
                                            LICENCIA
                                          </span>
                                          <strong className="text-white font-sans text-xs">
                                            CC BY-SA 4.0
                                          </strong>
                                        </div>
                                      </div>
                                    </div>
                                  )}
                                </div>
                              );
                            },
                            h3: ({ children }) => (
                              <h3 className="font-serif text-base font-bold text-[#e5e2da] mt-6 mb-3">
                                {children}
                              </h3>
                            ),
                            blockquote: ({ children }) => (
                              <blockquote className="my-4 border-l-2 border-[#c9a227] bg-[#0b3d2e]/60 p-4 text-xs italic text-[#e5e2da]/90 rounded-r">
                                {children}
                              </blockquote>
                            ),
                            img: ({ src, alt }) => (
                              <figure className="my-4 rounded-lg overflow-hidden border border-[#3a5345] bg-[#0b3d2e]/80 p-3 shadow-lg">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                  src={src}
                                  alt={alt || "Vista previa de imagen"}
                                  className="w-full h-auto max-h-[360px] object-contain rounded bg-[#062a20]"
                                  onError={(e) => {
                                    const target = e.currentTarget;
                                    target.onerror = null;
                                    target.src =
                                      "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='100%' height='160' fill='%230b3d2e'><rect width='100%' height='100%' fill='%23062a20'/><text x='50%' y='50%' fill='%23ecc246' font-size='14' font-family='sans-serif' text-anchor='middle'>[Vista previa de imagen: " +
                                      encodeURIComponent(
                                        alt || "Grafico/Imagen",
                                      ) +
                                      "]</text></svg>";
                                  }}
                                />
                                {alt && (
                                  <figcaption className="text-center text-xs text-[#ecc246] mt-2 font-serif italic">
                                    {alt}
                                  </figcaption>
                                )}
                              </figure>
                            ),
                            code: ({ className, children }) => {
                              const match = /language-(\w+)/.exec(
                                className || "",
                              );
                              const codeStr = String(children).replace(
                                /\n$/,
                                "",
                              );
                              const lang = match ? match[1].toLowerCase() : "";
                              const isChartOrJson =
                                lang === "chart" ||
                                lang === "json" ||
                                lang === "js" ||
                                codeStr.includes("chartType") ||
                                codeStr.includes('"data"');

                              if (isChartOrJson) {
                                try {
                                  // Limpiar comas finales (trailing commas) comunes al editar JSON manualmente
                                  const cleanCodeStr = codeStr.replace(
                                    /,\s*([}\]])/g,
                                    "$1",
                                  );
                                  const parsedObj = JSON.parse(cleanCodeStr);
                                  if (
                                    parsedObj &&
                                    typeof parsedObj === "object"
                                  ) {
                                    // Extract chart data array
                                    const rawData = Array.isArray(parsedObj)
                                      ? parsedObj
                                      : Array.isArray(parsedObj.data)
                                        ? parsedObj.data
                                        : null;

                                    if (rawData && rawData.length > 0) {
                                      const chartType =
                                        parsedObj.chartType ||
                                        (rawData[0] && "year" in rawData[0]
                                          ? "line"
                                          : rawData[0] && "layer" in rawData[0]
                                            ? "pie"
                                            : "bar");

                                      const title =
                                        parsedObj.meta?.title ||
                                        parsedObj.title ||
                                        undefined;
                                      const description =
                                        parsedObj.meta?.description ||
                                        parsedObj.description ||
                                        undefined;

                                      // 1. BAR CHART
                                      if (chartType === "bar") {
                                        const xKey = parsedObj.xKey || "name";
                                        return (
                                          <ChartPreviewCard
                                            title={title}
                                            description={description}
                                            typeLabel="GRÁFICO DE BARRAS"
                                            figNumber="Figura 2"
                                            itemCount={rawData.length}
                                          >
                                            <ResponsiveContainer
                                              width="100%"
                                              height="100%"
                                            >
                                              <RechartsBarChart data={rawData}>
                                                <CartesianGrid
                                                  strokeDasharray="3 3"
                                                  stroke="rgba(168, 181, 174, 0.2)"
                                                />
                                                <XAxis
                                                  dataKey={xKey}
                                                  stroke="#a8b5ae"
                                                  tick={{
                                                    fontSize: 9,
                                                    fill: "#a8b5ae",
                                                  }}
                                                  angle={-25}
                                                  textAnchor="end"
                                                  height={55}
                                                />
                                                <YAxis
                                                  stroke="#a8b5ae"
                                                  tick={{
                                                    fontSize: 10,
                                                    fill: "#a8b5ae",
                                                  }}
                                                />
                                                <RechartsTooltip
                                                  contentStyle={{
                                                    backgroundColor: "#062a20",
                                                    borderColor: "#c9a227",
                                                    color: "#fff",
                                                    borderRadius: "4px",
                                                    fontSize: "12px",
                                                  }}
                                                />
                                                <Bar
                                                  dataKey="value"
                                                  fill="#c9a227"
                                                  radius={[2, 2, 0, 0]}
                                                />
                                              </RechartsBarChart>
                                            </ResponsiveContainer>
                                          </ChartPreviewCard>
                                        );
                                      }

                                      // 2. LINE CHART
                                      if (chartType === "line") {
                                        const xKey = parsedObj.xKey || "year";
                                        return (
                                          <ChartPreviewCard
                                            title={title}
                                            description={description}
                                            typeLabel="GRÁFICO DE LÍNEAS"
                                            figNumber="Figura 3"
                                            itemCount={rawData.length}
                                          >
                                            <ResponsiveContainer
                                              width="100%"
                                              height="100%"
                                            >
                                              <RechartsLineChart data={rawData}>
                                                <CartesianGrid
                                                  strokeDasharray="3 3"
                                                  stroke="rgba(168, 181, 174, 0.2)"
                                                />
                                                <XAxis
                                                  dataKey={xKey}
                                                  stroke="#a8b5ae"
                                                  tick={{
                                                    fontSize: 10,
                                                    fill: "#a8b5ae",
                                                  }}
                                                />
                                                <YAxis
                                                  stroke="#a8b5ae"
                                                  tick={{
                                                    fontSize: 10,
                                                    fill: "#a8b5ae",
                                                  }}
                                                />
                                                <RechartsTooltip
                                                  contentStyle={{
                                                    backgroundColor: "#062a20",
                                                    borderColor: "#c9a227",
                                                    color: "#fff",
                                                    borderRadius: "4px",
                                                    fontSize: "12px",
                                                  }}
                                                />
                                                <Line
                                                  type="monotone"
                                                  dataKey="value"
                                                  stroke="#c9a227"
                                                  strokeWidth={2.5}
                                                  dot={{
                                                    fill: "#062a20",
                                                    stroke: "#ecc246",
                                                    r: 4,
                                                  }}
                                                />
                                              </RechartsLineChart>
                                            </ResponsiveContainer>
                                          </ChartPreviewCard>
                                        );
                                      }

                                      // 3. PIE / CIRCULAR CHART
                                      if (chartType === "pie") {
                                        const nameKey =
                                          parsedObj.nameKey || "layer";
                                        const valueKey =
                                          parsedObj.valueKey || "value";
                                        return (
                                          <ChartPreviewCard
                                            title={title}
                                            description={description}
                                            typeLabel="GRÁFICO CIRCULAR"
                                            figNumber="Figura 1"
                                            itemCount={rawData.length}
                                          >
                                            <ResponsiveContainer
                                              width="100%"
                                              height="100%"
                                            >
                                              <RechartsPieChart>
                                                <Pie
                                                  data={rawData}
                                                  dataKey={valueKey}
                                                  nameKey={nameKey}
                                                  cx="50%"
                                                  cy="50%"
                                                  outerRadius={75}
                                                  label={({
                                                    percent,
                                                  }: {
                                                    percent?: number;
                                                  }) =>
                                                    `${((percent ?? 0) * 100).toFixed(0)}%`
                                                  }
                                                >
                                                  {rawData.map(
                                                    (
                                                      _: Record<
                                                        string,
                                                        unknown
                                                      >,
                                                      index: number,
                                                    ) => (
                                                      <Cell
                                                        key={`cell-${index}`}
                                                        fill={
                                                          PIE_COLORS[
                                                            index %
                                                              PIE_COLORS.length
                                                          ]
                                                        }
                                                      />
                                                    ),
                                                  )}
                                                </Pie>
                                                <RechartsTooltip
                                                  contentStyle={{
                                                    backgroundColor: "#062a20",
                                                    borderColor: "#c9a227",
                                                    color: "#fff",
                                                    borderRadius: "4px",
                                                    fontSize: "12px",
                                                  }}
                                                />
                                                <Legend
                                                  wrapperStyle={{
                                                    fontSize: "11px",
                                                    color: "#e5e2da",
                                                  }}
                                                />
                                              </RechartsPieChart>
                                            </ResponsiveContainer>
                                          </ChartPreviewCard>
                                        );
                                      }
                                    }
                                  }
                                } catch {
                                  // Si no es JSON de gráfico válido, renderiza como bloque de código estándar
                                }
                              }

                              return (
                                <pre className="bg-[#1e2d25] border border-[#3a5345] p-3 rounded-lg text-xs font-mono overflow-x-auto my-3 text-[#ecc246]">
                                  <code>{codeStr}</code>
                                </pre>
                              );
                            },
                          }}
                        >
                          {cleanBodyContent}
                        </ReactMarkdown>
                      </article>
                    </div>
                  </div>
                );
              })()}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
