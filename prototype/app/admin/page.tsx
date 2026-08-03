"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useSession, signOut } from "@/lib/auth-client";
import MdxEditor from "@/components/MdxEditor";
import {
  FileText,
  UploadCloud,
  Download,
  Search,
  Trash2,
  Edit3,
  ExternalLink,
  RefreshCw,
  LogOut,
  Sparkles,
  LayoutDashboard,
  FolderOpen,
  BookOpen,
  CheckCircle,
  AlertCircle,
  Database,
  ArrowUpRight,
  PlusCircle,
} from "lucide-react";

interface ReportItem {
  id: string;
  slug: string;
  isPublished: boolean;
  title: string;
  subtitle?: string;
  author: string;
  publishedDate: string;
  readingTime: string;
  license: string;
  doi: string;
  globalMedian: string;
  createdAt: string;
  updatedAt: string;
}

const PAGE_SIZE = 3;

type AdminTab = "dashboard" | "reportes" | "borradores" | "upload" | "templates" | "editor";

// Estado de publicación que aplica según la pestaña activa (server-side)
function statusForTab(tab: AdminTab): "published" | "draft" | null {
  if (tab === "reportes") return "published";
  if (tab === "borradores") return "draft";
  if (tab === "dashboard") return "published"; // para el "Reporte Activo"
  return null;
}

export default function AdminPage() {
  const router = useRouter();
  const { data: session, isPending } = useSession();

  const [activeTab, setActiveTab] = useState<AdminTab>("dashboard");
  const [reportes, setReportes] = useState<ReportItem[]>([]);
  const [loadingReportes, setLoadingReportes] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState<{ total: number; page: number; limit: number; totalPages: number }>({
    total: 0,
    page: 1,
    limit: PAGE_SIZE,
    totalPages: 1,
  });
  const [summary, setSummary] = useState<{ total: number; published: number; drafts: number }>({
    total: 0,
    published: 0,
    drafts: 0,
  });

  const [selectedReportId, setSelectedReportId] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [uploadIsPublished, setUploadIsPublished] = useState<boolean>(true);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [uploading, setUploading] = useState(false);
  const [status, setStatus] = useState<{
    success?: boolean;
    message?: string;
    reportId?: string;
    slug?: string;
    isPublished?: boolean;
  } | null>(null);

  // Proteger la ruta /admin: Redirigir a /login si no hay sesión activa
  useEffect(() => {
    if (!isPending && !session) {
      router.push("/login");
    }
  }, [session, isPending, router]);

  // Cargar la página actual de reportes desde Neon PostgreSQL (paginación servidor)
  const fetchReportes = useCallback(async (page: number, status: "published" | "draft" | null) => {
    const params = new URLSearchParams({
      page: String(page),
      limit: String(PAGE_SIZE),
    });
    if (status) params.set("status", status);
    try {
      const res = await fetch(`/api/reports?${params.toString()}`);
      const data = await res.json();
      if (res.ok) {
        setReportes(data.reports || []);
        setPagination(data.pagination || {});
        setSummary(data.summary || {});
      }
    } catch (err) {
      console.error("Error al obtener reportes:", err);
    } finally {
      setLoadingReportes(false);
    }
  }, []);

  useEffect(() => {
    if (!session) return;
    const loadReportes = async () => {
      await fetchReportes(currentPage, statusForTab(activeTab));
    };
    void loadReportes();
  }, [session, currentPage, activeTab, fetchReportes]);

  // Recarga la página/estado actual tras mutaciones (upload, toggle, delete)
  const refreshReportes = useCallback((page?: number) => {
    setLoadingReportes(true);
    const targetPage = page ?? currentPage;
    if (page !== undefined && page !== currentPage) {
      setCurrentPage(page);
    }
    void fetchReportes(targetPage, statusForTab(activeTab));
  }, [currentPage, activeTab, fetchReportes]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setStatus(null);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      if (droppedFile.name.endsWith(".mdx") || droppedFile.name.endsWith(".md")) {
        setFile(droppedFile);
        setStatus(null);
      } else {
        setStatus({
          success: false,
          message: "Formato no válido. Solo se permiten archivos con extensión .mdx o .md",
        });
      }
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    setUploading(true);
    setStatus(null);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("isPublished", uploadIsPublished ? "true" : "false");
    if (selectedReportId) {
      formData.append("targetId", selectedReportId);
    }

    try {
      const res = await fetch("/api/reports/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (res.ok) {
        const isPub = data.isPublished;
        setStatus({
          success: true,
          message: `¡Reporte "${data.title}" ${selectedReportId ? "actualizado" : "creado"} con éxito! (${isPub ? "Publicado en línea" : "Guardado como borrador"})`,
          reportId: data.id,
          slug: data.slug,
          isPublished: isPub,
        });
        setFile(null);
        setSelectedReportId(null);
        refreshReportes();
      } else {
        setStatus({
          success: false,
          message: data.error || "Error al procesar la ingesta del archivo .mdx.",
        });
      }
    } catch (err: unknown) {
      const errorObj = err as { message?: string };
      setStatus({
        success: false,
        message: errorObj.message || "Error inesperado al conectar con el servidor.",
      });
    } finally {
      setUploading(false);
    }
  };

  const togglePublishStatus = async (id: string, currentStatus: boolean) => {
    try {
      const res = await fetch(`/api/reports/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isPublished: !currentStatus }),
      });
      if (res.ok) {
        refreshReportes();
      }
    } catch (err) {
      console.error("Error al cambiar estado de publicación:", err);
    }
  };

  const handleDeleteReport = async (id: string, titulo: string) => {
    if (!confirm(`¿Estás seguro de que deseas eliminar el reporte "${titulo}"?`)) {
      return;
    }

    try {
      const res = await fetch(`/api/reports/${id}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (res.ok) {
        setStatus({
          success: true,
          message: `El reporte "${titulo}" fue eliminado correctamente.`,
        });
        // Si borramos el último de la página, retrocedemos una (página servidor)
        const lastPossiblePage = Math.max(1, Math.ceil((pagination.total - 1) / PAGE_SIZE));
        refreshReportes(Math.min(currentPage, lastPossiblePage));
      } else {
        setStatus({
          success: false,
          message: data.error || "Error al eliminar el reporte.",
        });
      }
    } catch (err: unknown) {
      const errorObj = err as { message?: string };
      setStatus({
        success: false,
        message: errorObj.message || "Error al conectar con el servidor.",
      });
    }
  };

  const handleSignOut = async () => {
    await signOut();
    router.push("/login");
  };

  // Buscador: filtra solo sobre la página actual (el server ya paginó por pestaña)
  const filteredReportes = reportes.filter((r) => {
    const query = searchQuery.toLowerCase().trim();
    if (!query) return true;
    return (
      r.title.toLowerCase().includes(query) ||
      r.author.toLowerCase().includes(query) ||
      r.id.toLowerCase().includes(query) ||
      r.publishedDate.toLowerCase().includes(query)
    );
  });

  const totalPages = pagination.totalPages || 1;
  const displayReportes = filteredReportes;

  if (isPending || (!session && typeof window !== "undefined")) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--paper)] paper-texture">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-[var(--forest-700)] border-t-transparent rounded-full animate-spin"></div>
          <p className="text-xs font-medium text-[var(--forest-700)] animate-pulse">
            Autenticando superusuario en Neon PostgreSQL...
          </p>
        </div>
      </div>
    );
  }

  const latestReport = reportes[0];

  return (
    <div className="min-h-screen bg-[var(--paper)] paper-texture flex flex-col antialiased text-[var(--ink)]">
      {/* ============ TOPBAR HEADER SHADCN STYLE ============ */}
      <header className="sticky top-0 z-30 h-16 bg-[var(--paper-2)]/90 backdrop-blur-md border-b border-[var(--rule-soft)] px-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <a href="#top" className="flex items-center gap-2.5 group">
            <svg width="26" height="26" viewBox="0 0 28 28" fill="none">
              <rect x="2" y="2" width="24" height="24" rx="3" fill="#0d2818" />
              <path d="M8 18 L8 10 L14 18 L14 10" stroke="#c9a961" strokeWidth="1.6" strokeLinecap="square" fill="none" />
              <circle cx="20" cy="14" r="2.4" fill="#c9a961" />
            </svg>
            <div className="leading-none">
              <div className="font-display font-bold text-[15px] text-[var(--forest-800)] tracking-tight">
                PhysaFlow
              </div>
              <div className="text-[9px] tracking-[0.18em] uppercase text-[var(--ink-soft)] font-medium mt-0.5">
                Admin Suite
              </div>
            </div>
          </a>
        </div>

        {/* Acciones Topbar & Perfil */}
        <div className="flex items-center gap-3 ml-auto">
          <a
            href="/"
            target="_blank"
            className="flex items-center gap-1.5 px-3 py-1.5 text-[12px] font-medium text-[var(--forest-700)] hover:text-[var(--forest-800)] bg-[var(--paper)] hover:bg-white border border-[var(--rule)] rounded-md transition shadow-sm"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>Ver Sitio Público</span>
          </a>

          <div className="h-4 w-px bg-[var(--rule-soft)] hidden sm:block"></div>

          {/* Badge del Usuario */}
          <div className="flex items-center gap-2.5 pl-1">
            <div className="w-8 h-8 rounded-full bg-[var(--forest-800)] text-[var(--paper)] flex items-center justify-center font-display font-bold text-xs shadow-sm border border-[var(--gold-500)]/40">
              {session?.user?.name ? session.user.name.charAt(0) : "A"}
            </div>
            <div className="hidden lg:block text-left leading-tight">
              <div className="text-[12px] font-bold text-[var(--forest-800)]">
                {session?.user?.name || "Administrador"}
              </div>
              <div className="text-[10px] text-[var(--ink-soft)]">
                {session?.user?.email}
              </div>
            </div>
          </div>

          <button
            onClick={handleSignOut}
            className="p-2 text-red-700 hover:bg-red-50 rounded-md border border-transparent hover:border-red-200 transition cursor-pointer"
            title="Cerrar Sesión"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* ============ LAYOUT PRINCIPAL CON SIDEBAR SHADCN ============ */}
      <div className="flex-1 flex flex-col md:flex-row max-w-[1600px] w-full mx-auto">
        {/* SIDEBAR PANEL FOTANTE STYLE */}
        <aside className="w-full md:w-64 bg-[var(--paper-2)] border-b md:border-b-0 md:border-r border-[var(--rule-soft)] p-5 shrink-0 flex flex-col justify-between">
          <div className="space-y-6">
            {/* Categoría: INFRAESTRUCTURA CMS */}
            <div className="space-y-1">
              <div className="px-2 mb-2 text-[10px] font-bold tracking-[0.16em] uppercase text-[var(--ink-soft)]">
                Gestión de Contenido
              </div>

              <button
                onClick={() => {
                  setLoadingReportes(true);
                  setCurrentPage(1);
                  setActiveTab("dashboard");
                }}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-md text-[13px] font-medium transition cursor-pointer ${
                  activeTab === "dashboard"
                    ? "bg-[var(--forest-700)] text-[var(--paper)] shadow-sm font-semibold"
                    : "text-[var(--ink-muted)] hover:text-[var(--forest-800)] hover:bg-[var(--paper)]"
                }`}
              >
                <LayoutDashboard className="w-4 h-4" />
                <span>Dashboard</span>
              </button>

              <button
                onClick={() => {
                  setLoadingReportes(true);
                  setCurrentPage(1);
                  setActiveTab("reportes");
                }}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-md text-[13px] font-medium transition cursor-pointer ${
                  activeTab === "reportes"
                    ? "bg-[var(--forest-700)] text-[var(--paper)] shadow-sm font-semibold"
                    : "text-[var(--ink-muted)] hover:text-[var(--forest-800)] hover:bg-[var(--paper)]"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <FolderOpen className="w-4 h-4" />
                  <span>Reportes Publicados</span>
                </div>
                <span
                  className={`text-[10px] px-2 py-0.5 rounded-full font-mono font-bold ${
                    activeTab === "reportes" ? "bg-white/20 text-white" : "bg-emerald-100 text-emerald-800"
                  }`}
                >
                  {summary.published}
                </span>
              </button>

              <button
                onClick={() => {
                  setLoadingReportes(true);
                  setCurrentPage(1);
                  setActiveTab("borradores");
                }}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-md text-[13px] font-medium transition cursor-pointer ${
                  activeTab === "borradores"
                    ? "bg-[var(--forest-700)] text-[var(--paper)] shadow-sm font-semibold"
                    : "text-[var(--ink-muted)] hover:text-[var(--forest-800)] hover:bg-[var(--paper)]"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <FileText className="w-4 h-4 text-amber-500" />
                  <span>Borradores</span>
                </div>
                <span
                  className={`text-[10px] px-2 py-0.5 rounded-full font-mono font-bold ${
                    activeTab === "borradores" ? "bg-white/20 text-white" : "bg-amber-100 text-amber-800"
                  }`}
                >
                  {summary.drafts}
                </span>
              </button>

              <button
                onClick={() => setActiveTab("upload")}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-md text-[13px] font-medium transition cursor-pointer ${
                  activeTab === "upload"
                    ? "bg-[var(--forest-700)] text-[var(--paper)] shadow-sm font-semibold"
                    : "text-[var(--ink-muted)] hover:text-[var(--forest-800)] hover:bg-[var(--paper)]"
                }`}
              >
                <UploadCloud className="w-4 h-4" />
                <span>Subir MDX</span>
              </button>
            </div>

            {/* Categoría: RECURSOS Y HOJA DE RUTA */}
            <div className="space-y-1 pt-4 border-t border-[var(--rule-soft)]">
              <div className="px-2 mb-2 text-[10px] font-bold tracking-[0.16em] uppercase text-[var(--ink-soft)]">
                Recursos & Herramientas
              </div>

              <button
                onClick={() => setActiveTab("templates")}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-md text-[13px] font-medium transition cursor-pointer ${
                  activeTab === "templates"
                    ? "bg-[var(--forest-700)] text-[var(--paper)] shadow-sm font-semibold"
                    : "text-[var(--ink-muted)] hover:text-[var(--forest-800)] hover:bg-[var(--paper)]"
                }`}
              >
                <BookOpen className="w-4 h-4" />
                <span>Plantillas & Guías</span>
              </button>

              <button
                onClick={() => setActiveTab("editor")}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-md text-[13px] font-medium transition cursor-pointer ${
                  activeTab === "editor"
                    ? "bg-[var(--forest-700)] text-[var(--paper)] shadow-sm font-semibold"
                    : "text-[var(--ink-muted)] hover:text-[var(--forest-800)] hover:bg-[var(--paper)]"
                }`}
              >
                <Sparkles className="w-4 h-4 text-[var(--gold-500)]" />
                <span>Editor MDX</span>
              </button>
            </div>
          </div>
        </aside>

        {/* ============ WORKSPACE CONTENIDO DE PESTAÑAS ============ */}
        <main className="flex-1 p-6 lg:p-10 min-w-0">
          {/* PESTAÑA 1: DASHBOARD RESUMEN Y MÉTRICAS */}
          {activeTab === "dashboard" && (
            <div className="space-y-8">
              {/* Bienvenida */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[var(--rule-soft)] pb-6">
                <div>
                  <div className="eyebrow mb-1">Visión General</div>
                  <h1 className="font-display text-[28px] font-bold text-[var(--forest-800)]">
                    ¡Bienvenido, {session?.user?.name || "Administrador"}!
                  </h1>
                  <p className="text-[13px] text-[var(--ink-muted)] mt-1">
                    Resumen de métricas del reporte científico activo y estado del sistema.
                  </p>
                </div>
              </div>

              {/* Fila de Tarjetas de Métricas (Stat Cards) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-[var(--paper-2)] border border-[var(--rule-soft)] p-5 rounded-md shadow-sm space-y-2">
                  <div className="flex items-center justify-between text-[11px] font-semibold text-[var(--ink-soft)] uppercase tracking-wider">
                    <span>Reportes Publicados</span>
                    <FolderOpen className="w-4 h-4 text-[var(--forest-700)]" />
                  </div>
                  <div className="flex items-baseline justify-between">
                    <span className="font-display font-bold text-3xl text-[var(--forest-800)]">
                      {summary.published}
                    </span>
                    <span className="text-[11px] text-emerald-700 font-semibold bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">
                      En Línea
                    </span>
                  </div>
                  <p className="text-[11px] text-[var(--ink-muted)]">
                    {latestReport ? `Último: ${latestReport.publishedDate}` : "Sin reportes"}
                  </p>
                </div>

                <div className="bg-[var(--paper-2)] border border-[var(--rule-soft)] p-5 rounded-md shadow-sm space-y-2">
                  <div className="flex items-center justify-between text-[11px] font-semibold text-[var(--ink-soft)] uppercase tracking-wider">
                    <span>Borradores</span>
                    <FileText className="w-4 h-4 text-amber-600" />
                  </div>
                  <div className="flex items-baseline justify-between">
                    <span className="font-display font-bold text-3xl text-[var(--forest-800)]">
                      {summary.drafts}
                    </span>
                    <span className="text-[11px] text-amber-700 font-semibold bg-amber-50 border border-amber-200 px-2 py-0.5 rounded">
                      En Edición
                    </span>
                  </div>
                  <p className="text-[11px] text-[var(--ink-muted)]">
                    Reportes guardados privadamente
                  </p>
                </div>
              </div>

              {/* Acciones Rápida & Reporte Reciente */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Tabla de Reporte Reciente */}
                <div className="lg:col-span-2 bg-[var(--paper-2)] border border-[var(--rule-soft)] rounded-md p-6 shadow-sm space-y-4">
                  <div className="flex items-center justify-between border-b border-[var(--rule-soft)] pb-4">
                    <div>
                      <h2 className="font-display font-bold text-[18px] text-[var(--forest-800)]">
                        Reporte Activo en Producción
                      </h2>
                      <p className="text-[12px] text-[var(--ink-muted)]">
                        El informe visualizado por los visitantes en el dominio principal.
                      </p>
                    </div>

                    <button
                      onClick={() => {
                        setLoadingReportes(true);
                        setCurrentPage(1);
                        setActiveTab("reportes");
                      }}
                      className="text-[12px] font-semibold text-[var(--forest-700)] hover:underline flex items-center gap-1"
                    >
                      <span>Ver Todos</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {latestReport ? (
                    <div className="p-4 bg-[var(--paper)] border border-[var(--rule-soft)] rounded-md space-y-3">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <h3 className="font-display font-bold text-[18px] text-[var(--forest-800)]">
                          {latestReport.title}
                        </h3>
                        <span className="px-2.5 py-0.5 text-[11px] font-bold bg-[var(--forest-50)] text-[var(--forest-700)] border border-[var(--forest-200)] rounded">
                          {latestReport.publishedDate}
                        </span>
                      </div>
                      <p className="text-[13px] text-[var(--ink-muted)]">
                        {latestReport.subtitle || "Reporte técnico sobre capacidad varada e infraestructura de datos."}
                      </p>
                      <div className="flex flex-wrap items-center gap-4 text-[12px] text-[var(--ink-soft)] pt-2 border-t border-[var(--rule-soft)]">
                        <span>Autor: <strong>{latestReport.author}</strong></span>
                        <span>DOI: {latestReport.doi}</span>
                        <span>Lectura: {latestReport.readingTime}</span>
                      </div>
                    </div>
                  ) : (
                    <div className="py-8 text-center text-xs text-[var(--ink-muted)]">
                      No se encontró ningún reporte en PostgreSQL.
                    </div>
                  )}
                </div>

                {/* Accesos Rápidos (Quick Actions) */}
                <div className="bg-[var(--paper-2)] border border-[var(--rule-soft)] rounded-md p-6 shadow-sm space-y-4">
                  <h2 className="font-display font-bold text-[18px] text-[var(--forest-800)] border-b border-[var(--rule-soft)] pb-4">
                    Acciones Rápidas
                  </h2>

                  <div className="space-y-2.5">
                    <button
                      onClick={() => {
                        setSelectedReportId(null);
                        setActiveTab("editor");
                      }}
                      className="w-full flex items-center justify-between p-3 bg-emerald-700 hover:bg-emerald-800 text-white rounded-md text-[13px] font-semibold transition shadow-sm cursor-pointer group"
                    >
                      <div className="flex items-center gap-2.5">
                        <PlusCircle className="w-4 h-4 text-emerald-200 group-hover:scale-110 transition" />
                        <span>Crear en Editor MDX</span>
                      </div>
                      <ArrowUpRight className="w-4 h-4 text-emerald-200" />
                    </button>

                    <button
                      onClick={() => setActiveTab("upload")}
                      className="w-full flex items-center justify-between p-3 bg-[var(--paper)] hover:bg-white border border-[var(--rule-soft)] rounded-md text-[13px] font-semibold text-[var(--forest-800)] transition shadow-sm cursor-pointer group"
                    >
                      <div className="flex items-center gap-2.5">
                        <UploadCloud className="w-4 h-4 text-[var(--forest-700)] group-hover:scale-110 transition" />
                        <span>Subir Archivo .MDX</span>
                      </div>
                      <ArrowUpRight className="w-4 h-4 text-[var(--ink-soft)]" />
                    </button>

                    <a
                      href="/templates/plantilla-reporte-physaflow.mdx"
                      download="plantilla-reporte-physaflow.mdx"
                      className="w-full flex items-center justify-between p-3 bg-[var(--paper)] hover:bg-white border border-[var(--rule-soft)] rounded-md text-[13px] font-semibold text-[var(--forest-800)] transition shadow-sm cursor-pointer group"
                    >
                      <div className="flex items-center gap-2.5">
                        <Download className="w-4 h-4 text-[var(--forest-700)] group-hover:scale-110 transition" />
                        <span>Descargar Plantilla</span>
                      </div>
                      <ArrowUpRight className="w-4 h-4 text-[var(--ink-soft)]" />
                    </a>

                    <a
                      href="/"
                      target="_blank"
                      className="w-full flex items-center justify-between p-3 bg-[var(--paper)] hover:bg-white border border-[var(--rule-soft)] rounded-md text-[13px] font-semibold text-[var(--forest-800)] transition shadow-sm cursor-pointer group"
                    >
                      <div className="flex items-center gap-2.5">
                        <ExternalLink className="w-4 h-4 text-[var(--forest-700)] group-hover:scale-110 transition" />
                        <span>Abrir Sitio Público</span>
                      </div>
                      <ArrowUpRight className="w-4 h-4 text-[var(--ink-soft)]" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* PESTAÑA 2: REPORTES PUBLICADOS Y BORRADORES */}
          {(activeTab === "reportes" || activeTab === "borradores") && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[var(--rule-soft)] pb-6 gap-4">
                <div>
                  <div className="eyebrow mb-1">
                    {activeTab === "reportes" ? "Biblioteca Pública" : "Borradores Privados"}
                  </div>
                  <h1 className="font-display text-[28px] font-bold text-[var(--forest-800)]">
                    {activeTab === "reportes" ? "Reportes Publicados" : "Borradores Sin Publicar"} ({pagination.total})
                  </h1>
                  <p className="text-[13px] text-[var(--ink-muted)] mt-1">
                    {activeTab === "reportes"
                      ? "Lista de informes visibles para los usuarios en la web pública."
                      : "Informes guardados en estado de borrador para revisión o edición futura."}
                  </p>
                </div>

                <div className="flex items-center gap-2.5">
                  <button
                    onClick={() => {
                      setSelectedReportId(null);
                      setActiveTab("editor");
                    }}
                    className="flex items-center gap-1.5 px-3.5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-[12px] font-semibold rounded-md shadow-sm transition cursor-pointer"
                  >
                    <PlusCircle className="w-3.5 h-3.5" />
                    <span>Crear en Editor MDX</span>
                  </button>

                  <button
                    onClick={() => setActiveTab("upload")}
                    className="flex items-center gap-1.5 px-3.5 py-2 bg-[var(--paper-2)] hover:bg-white text-[var(--forest-800)] border border-[var(--rule)] text-[12px] font-semibold rounded-md shadow-sm transition cursor-pointer"
                  >
                    <UploadCloud className="w-3.5 h-3.5 text-[var(--forest-700)]" />
                    <span>Subir MDX</span>
                  </button>

                  <button
                    onClick={() => refreshReportes()}
                    className="p-2 bg-[var(--paper-2)] hover:bg-white text-[var(--ink-muted)] border border-[var(--rule)] rounded-md transition cursor-pointer shadow-sm"
                    title="Refrescar Lista"
                  >
                    <RefreshCw className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Buscador Inteligente */}
              <div className="bg-[var(--paper-2)] border border-[var(--rule-soft)] p-3.5 rounded-md flex items-center gap-3">
                <Search className="w-4 h-4 text-[var(--ink-soft)] shrink-0" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Filtrar por título, autor o fecha (ej. 2025, Octubre 2025)..."
                  className="w-full text-[13px] bg-transparent text-[var(--ink)] placeholder-[var(--ink-soft)] outline-none"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="text-[11px] text-[var(--ink-soft)] hover:text-[var(--forest-800)] font-semibold"
                  >
                    Limpiar
                  </button>
                )}
              </div>

              {/* Lista / Tabla de Reportes */}
              <div className="bg-[var(--paper-2)] border border-[var(--rule-soft)] rounded-md overflow-hidden shadow-sm divide-y divide-[var(--rule-soft)]">
                {loadingReportes ? (
                  <div className="py-16 text-center text-[13px] text-[var(--ink-muted)] animate-pulse">
                    Cargando colección de reportes desde Neon PostgreSQL...
                  </div>
                ) : displayReportes.length === 0 ? (
                  <div className="py-16 px-6 text-center space-y-4">
                    <div className="w-12 h-12 bg-[var(--forest-50)] text-[var(--forest-700)] rounded-full flex items-center justify-center mx-auto">
                      <Database className="w-6 h-6 text-emerald-600" />
                    </div>
                    <div className="space-y-1 max-w-md mx-auto">
                      <h3 className="font-display font-bold text-base text-[var(--forest-800)]">
                        No hay reportes en la base de datos PostgreSQL
                      </h3>
                      <p className="text-[12px] text-[var(--ink-muted)]">
                        No se encontraron reportes registrados para el filtro o estado actual.
                      </p>
                    </div>
                  </div>
                ) : (
                  displayReportes.map((rep) => (
                    <div
                      key={rep.id}
                      className="p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4 hover:bg-[var(--paper)]/60 transition"
                    >
                      <div className="space-y-1.5 max-w-2xl">
                        <div className="flex flex-wrap items-center gap-2.5">
                          <h3 className="font-display font-bold text-[18px] text-[var(--forest-800)]">
                            {rep.title}
                          </h3>
                          <button
                            onClick={() => togglePublishStatus(rep.id, rep.isPublished)}
                            className={`px-2.5 py-0.5 text-[10px] uppercase font-bold rounded border cursor-pointer transition ${
                              rep.isPublished
                                ? "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100"
                                : "bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100"
                            }`}
                            title="Haz clic para cambiar estado (Borrador/Publicado)"
                          >
                            {rep.isPublished ? "Publicado" : "Borrador"}
                          </button>
                          <span className="px-2 py-0.5 text-[10px] uppercase font-bold bg-[var(--forest-50)] text-[var(--forest-700)] rounded border border-[var(--forest-200)] font-mono">
                            {rep.publishedDate}
                          </span>
                        </div>
                        <p className="text-[13px] text-[var(--ink-muted)] line-clamp-1">
                          {rep.subtitle || "Reporte técnico sobre capacidad varada e infraestructura de datos."}
                        </p>
                        <div className="text-[11px] text-[var(--ink-soft)] flex flex-wrap items-center gap-3 pt-1">
                          <span>Autor: <strong>{rep.author}</strong></span>
                          <span>•</span>
                          <span>DOI: {rep.doi}</span>
                          <span>•</span>
                          <span>Mediana: <strong className="text-[var(--forest-700)]">{rep.globalMedian}</strong></span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <a
                          href={`/reports/${rep.id}/${rep.slug}`}
                          target="_blank"
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-[var(--paper)] hover:bg-white text-[12px] font-medium text-[var(--forest-700)] border border-[var(--rule)] rounded-md transition shadow-sm"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                          <span>Ver Ruta Slug</span>
                        </a>

                        <button
                          onClick={() => {
                            setSelectedReportId(rep.id);
                            setActiveTab("editor");
                          }}
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-[var(--forest-700)] hover:bg-[var(--forest-800)] text-[var(--paper)] text-[12px] font-semibold rounded-md transition cursor-pointer shadow-sm"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                          <span>Editar en Editor</span>
                        </button>

                        <button
                          onClick={() => handleDeleteReport(rep.id, rep.title)}
                          className="p-1.5 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-md border border-transparent hover:border-red-200 transition cursor-pointer"
                          title="Eliminar Reporte"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Controles de Paginación (servidor, 3 por página) */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between p-4 bg-[var(--paper-2)] border border-[var(--rule-soft)] rounded-md text-[12px]">
                  <span className="text-[var(--ink-muted)]">
                    Mostrando página <strong>{currentPage}</strong> de <strong>{totalPages}</strong> ({pagination.total} reportes)
                  </span>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        setLoadingReportes(true);
                        setCurrentPage((p) => Math.max(p - 1, 1));
                      }}
                      disabled={currentPage === 1}
                      className="px-3 py-1 bg-[var(--paper)] hover:bg-white border border-[var(--rule)] rounded-md font-semibold text-[var(--forest-800)] disabled:opacity-40 transition cursor-pointer"
                    >
                      ← Anterior
                    </button>
                    <button
                      onClick={() => {
                        setLoadingReportes(true);
                        setCurrentPage((p) => Math.min(p + 1, totalPages));
                      }}
                      disabled={currentPage === totalPages}
                      className="px-3 py-1 bg-[var(--paper)] hover:bg-white border border-[var(--rule)] rounded-md font-semibold text-[var(--forest-800)] disabled:opacity-40 transition cursor-pointer"
                    >
                      Siguiente →
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* PESTAÑA 3: INGESTAR / SUBIR MDX */}
          {activeTab === "upload" && (
            <div className="space-y-8 max-w-4xl">
              <div className="border-b border-[var(--rule-soft)] pb-6">
                <div className="eyebrow mb-1">
                  Nuevo Informe
                </div>
                <h1 className="font-display text-[28px] font-bold text-[var(--forest-800)]">
                  SubirNuevo Reporte (.mdx)
                </h1>
                <p className="text-[13px] text-[var(--ink-muted)] mt-1">
                  Sube un archivo .mdx para crear un nuevo reporte en PostgreSQL.
                </p>
              </div>

              {selectedReportId && (
                <div className="p-4 bg-[var(--gold-500)]/10 border-l-2 border-[var(--gold-500)] text-[13px] flex items-center justify-between rounded-r-md">
                  <div>
                    Estás reescribiendo el reporte ID: <strong>{selectedReportId}</strong>
                  </div>
                  <button
                    onClick={() => setSelectedReportId(null)}
                    className="text-[12px] text-[var(--forest-700)] hover:underline font-semibold"
                  >
                    Cancelar Edición y Crear Nuevo
                  </button>
                </div>
              )}

              <form onSubmit={handleUpload} className="space-y-6">
                <div
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  className={`border-2 border-dashed rounded-md p-10 text-center transition-all cursor-pointer ${
                    isDragging
                      ? "border-emerald-600 bg-emerald-50/50 scale-[1.01]"
                      : "border-[var(--rule)] hover:border-[var(--forest-600)] bg-[var(--paper-2)]"
                  }`}
                >
                  <input
                    type="file"
                    accept=".mdx,.md"
                    onChange={handleFileChange}
                    className="hidden"
                    id="file-upload"
                  />
                  <label htmlFor="file-upload" className="cursor-pointer flex flex-col items-center">
                    <UploadCloud className={`w-12 h-12 mb-3 transition ${isDragging ? "text-emerald-700 scale-110" : "text-[var(--forest-700)]"}`} />
                    <span className="text-[15px] font-semibold text-[var(--forest-800)]">
                      {file ? file.name : isDragging ? "¡Suelta tu archivo .mdx aquí!" : "Haz clic o arrastra tu archivo .mdx aquí"}
                    </span>
                    <span className="text-[12px] text-[var(--ink-soft)] mt-1">
                      Archivos soportados: .mdx o .md con métricas y frontmatter YAML
                    </span>
                  </label>
                </div>

                {file && (
                  <div className="flex items-center space-x-3 p-4 bg-[var(--paper-2)] border border-[var(--rule-soft)] rounded-md text-[13px]">
                    <FileText className="w-5 h-5 text-[var(--forest-700)] shrink-0" />
                    <div className="flex-1 overflow-hidden text-ellipsis whitespace-nowrap">
                      <p className="font-semibold text-[var(--forest-800)]">{file.name}</p>
                      <p className="text-[var(--ink-soft)]">{(file.size / 1024).toFixed(2)} KB</p>
                    </div>
                  </div>
                )}

                {/* Selector de Estado de Ingesta: Publicar inmediatamente o Guardar como Borrador */}
                <div className="p-4 bg-[var(--paper-2)] border border-[var(--rule-soft)] rounded-md space-y-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[var(--ink-soft)] block">
                    Estado al Subir el Reporte
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                    <button
                      type="button"
                      onClick={() => setUploadIsPublished(true)}
                      className={`flex items-center justify-between p-3 rounded-md border text-[13px] font-medium transition cursor-pointer ${
                        uploadIsPublished
                          ? "bg-emerald-50 text-emerald-900 border-emerald-300 font-semibold"
                          : "bg-[var(--paper)] text-[var(--ink-muted)] border-[var(--rule-soft)] hover:bg-white"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
                        <span>Publicar Inmediatamente</span>
                      </div>
                      {uploadIsPublished && <CheckCircle className="w-4 h-4 text-emerald-700" />}
                    </button>

                    <button
                      type="button"
                      onClick={() => setUploadIsPublished(false)}
                      className={`flex items-center justify-between p-3 rounded-md border text-[13px] font-medium transition cursor-pointer ${
                        !uploadIsPublished
                          ? "bg-amber-50 text-amber-900 border-amber-300 font-semibold"
                          : "bg-[var(--paper)] text-[var(--ink-muted)] border-[var(--rule-soft)] hover:bg-white"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                        <span>Guardar como Borrador</span>
                      </div>
                      {!uploadIsPublished && <CheckCircle className="w-4 h-4 text-amber-700" />}
                    </button>
                  </div>
                </div>

                {status && (
                  <div
                    className={`p-4 rounded-md flex items-start space-x-3 text-[13px] ${
                      status.success
                        ? "bg-emerald-50/80 text-emerald-900 border-l-2 border-emerald-600"
                        : "bg-red-50/80 text-red-900 border-l-2 border-red-600"
                    }`}
                  >
                    {status.success ? (
                      <CheckCircle className="w-4 h-4 shrink-0 text-emerald-700 mt-0.5" />
                    ) : (
                      <AlertCircle className="w-4 h-4 shrink-0 text-red-700 mt-0.5" />
                    )}
                    <div>
                      <p className="font-semibold leading-snug">{status.message}</p>
                      {status.success && (
                        <div className="mt-2 flex items-center gap-3">
                          {status.isPublished ? (
                            <a
                              href={`/reports/${status.reportId}/${status.slug}`}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-1.5 text-emerald-800 underline font-semibold hover:text-emerald-950 text-[12px]"
                            >
                              <span>Ver reporte publicado en el sitio público →</span>
                            </a>
                          ) : (
                            <button
                              type="button"
                              onClick={() => {
                                if (status.reportId) {
                                  setSelectedReportId(status.reportId);
                                  setActiveTab("editor");
                                }
                              }}
                              className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-700 hover:bg-amber-800 text-white rounded text-[11px] font-semibold transition cursor-pointer"
                            >
                              <span>✍️ Abrir borrador en el Editor MDX</span>
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={!file || uploading}
                  className="w-full py-3.5 bg-[var(--forest-700)] hover:bg-[var(--forest-800)] text-[var(--paper)] text-[13px] font-semibold tracking-wide rounded-md shadow-sm transition-colors cursor-pointer disabled:opacity-50"
                >
                  {uploading
                    ? "Procesando ingesta en PostgreSQL..."
                    : selectedReportId
                    ? `Actualizar Reporte (${selectedReportId})`
                    : uploadIsPublished
                    ? "Subir y Publicar Reporte"
                    : "Subir como Borrador"}
                </button>
              </form>
            </div>
          )}

          {/* PESTAÑA 4: PLANTILLAS & RECURSOS */}
          {activeTab === "templates" && (
            <div className="space-y-8 max-w-4xl">
              <div className="border-b border-[var(--rule-soft)] pb-6">
                <div className="eyebrow mb-1">Guías & Recursos</div>
                <h1 className="font-display text-[28px] font-bold text-[var(--forest-800)]">
                  Plantilla Oficial PhysaFlow (.mdx)
                </h1>
                <p className="text-[13px] text-[var(--ink-muted)] mt-1">
                  Descarga la plantilla estándar para garantizar que el archivo cumpla con los esquemas de validación de Zod y PostgreSQL.
                </p>
              </div>

              <div className="bg-[var(--paper-2)] border border-[var(--rule-soft)] p-8 rounded-md space-y-6 shadow-sm">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[var(--rule-soft)] pb-6">
                  <div>
                    <h3 className="font-display font-bold text-[18px] text-[var(--forest-800)]">
                      plantilla-reporte-physaflow.mdx
                    </h3>
                    <p className="text-[12px] text-[var(--ink-muted)] mt-0.5">
                      Incluye la estructura completa de metadatos, capas, tarjetas de modo de fallo y metodología.
                    </p>
                  </div>

                  <a
                    href="/templates/plantilla-reporte-physaflow.mdx"
                    download="plantilla-reporte-physaflow.mdx"
                    className="flex items-center gap-2 px-4 py-2.5 bg-[var(--forest-700)] hover:bg-[var(--forest-800)] text-[var(--paper)] text-[13px] font-semibold rounded-md transition shadow-sm self-start sm:self-auto"
                  >
                    <Download className="w-4 h-4" />
                    <span>Descargar Plantilla MDX</span>
                  </a>
                </div>

                <div className="space-y-4">
                  <h4 className="font-display font-semibold text-[15px] text-[var(--forest-800)]">
                    1. Campos del YAML Frontmatter (Encabezado entre ---):
                  </h4>
                  <ul className="text-[13px] space-y-2 text-[var(--ink-muted)] list-disc pl-5">
                    <li><strong className="text-[var(--forest-700)]">title, subtitle, author:</strong> Título, subtítulo e investigador principal del informe.</li>
                    <li><strong className="text-[var(--forest-700)]">publishedDate & doi:</strong> Fecha/Año de publicación (Ej: <em>&quot;Octubre 2026&quot;</em>) y DOI científico.</li>
                    <li><strong className="text-[var(--forest-700)]">globalMedian & lossWorkload:</strong> Porcentajes que alimentan los contadores y métricas globales.</li>
                    <li><strong className="text-[var(--forest-700)]">layers:</strong> Lista estructurada de las 3 capas físicas (Instalaciones, TI, Carga de trabajo) y sus tarjetas de fallos.</li>
                  </ul>
                </div>

                <div className="space-y-4 pt-4 border-t border-[var(--rule-soft)]">
                  <h4 className="font-display font-semibold text-[15px] text-[var(--forest-800)]">
                    2. Componentes JSX disponibles para usar en el Cuerpo (MDX):
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-[12px]">
                    <div className="p-4 bg-[var(--paper)] border border-[var(--rule-soft)] rounded-md space-y-2">
                      <div className="font-bold text-[var(--forest-800)] flex items-center gap-2">
                        Gráficos Interactivos (Chart)
                      </div>
                      <p className="text-[var(--ink-muted)] text-[11px]">
                        Inserta gráficos de barras, líneas o torta pasando datos JSON directamente en la propiedad <code className="bg-[var(--paper-2)] px-1 rounded">data=&#39;[...]&#39;</code>:
                      </p>
                      <pre className="p-2 bg-[var(--forest-900)] text-[var(--gold-200)] rounded text-[10px] font-mono overflow-x-auto">
{`<Chart 
  type="bar|line|pie" 
  title="Título del gráfico" 
  data='[{"name":"Ejemplo","value":4.2}]' 
/>`}
                      </pre>
                    </div>

                    <div className="p-4 bg-[var(--paper)] border border-[var(--rule-soft)] rounded-md space-y-2">
                      <div className="font-bold text-[var(--forest-800)] flex items-center gap-2">
                       Pasos de Metodología (StepCard)
                      </div>
                      <p className="text-[var(--ink-muted)] text-[11px]">
                        Crea tarjetas destacadas para explicar metodologías, fases o pasos numerados:
                      </p>
                      <pre className="p-2 bg-[var(--forest-900)] text-[var(--gold-200)] rounded text-[10px] font-mono overflow-x-auto">
{`<StepCard num="01" title="Paso 1">
  Descripción detallada del procedimiento. 
</StepCard>`}
                      </pre>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* PESTAÑA 5: EDITOR MDX INTERACTIVO */}
          {activeTab === "editor" && (
            <div className="space-y-6">
              <MdxEditor
                initialReportId={selectedReportId}
                onSaved={() => {
                  refreshReportes();
                }}
              />
            </div>
          )}
        </main>
      </div>

      <footer className="bg-[var(--paper-2)] border-t border-[var(--rule-soft)] py-4 px-6 lg:px-10 text-[12px] text-[var(--ink-muted)] flex flex-col sm:flex-row items-center justify-between gap-2 mt-auto no-print">
        <div>
          PhysaFlow Admin Suite © 2025 · Panel de Administración de Infraestructura
        </div>
      </footer>
    </div>
  );
}
