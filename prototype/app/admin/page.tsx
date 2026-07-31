"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useSession, signOut } from "@/lib/auth-client";
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
  FileCode,
  BookOpen,
  CheckCircle,
  AlertCircle,
  Database,
  ShieldCheck,
  TrendingUp,
  Activity,
  ArrowUpRight,
  Command,
} from "lucide-react";

interface ReporteItem {
  id: string;
  titulo: string;
  subtitulo?: string;
  autor: string;
  published: string;
  readingTime: string;
  license: string;
  doi: string;
  medianaGlobal: string;
  createdAt: string;
  updatedAt: string;
}

export default function AdminPage() {
  const router = useRouter();
  const { data: session, isPending } = useSession();

  const [activeTab, setActiveTab] = useState<"dashboard" | "reportes" | "upload" | "templates" | "editor">("dashboard");
  const [reportes, setReportes] = useState<ReporteItem[]>([]);
  const [loadingReportes, setLoadingReportes] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const [selectedReportId, setSelectedReportId] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [status, setStatus] = useState<{ success?: boolean; message?: string } | null>(null);

  // Proteger la ruta /admin: Redirigir a /login si no hay sesión activa
  useEffect(() => {
    if (!isPending && !session) {
      router.push("/login");
    }
  }, [session, isPending, router]);

  // Cargar lista de reportes desde Neon PostgreSQL
  const fetchReportes = useCallback(async () => {
    setLoadingReportes(true);
    try {
      const res = await fetch("/api/reportes");
      const data = await res.json();
      if (res.ok) {
        setReportes(data.reportes || []);
      }
    } catch (err) {
      console.error("Error al obtener reportes:", err);
    } finally {
      setLoadingReportes(false);
    }
  }, []);

  useEffect(() => {
    if (!session) return;
    let isMounted = true;
    const loadReportes = async () => {
      try {
        const res = await fetch("/api/reportes");
        const data = await res.json();
        if (res.ok && isMounted) {
          setReportes(data.reportes || []);
        }
      } catch (err) {
        console.error("Error al obtener reportes:", err);
      } finally {
        if (isMounted) {
          setLoadingReportes(false);
        }
      }
    };
    void loadReportes();
    return () => {
      isMounted = false;
    };
  }, [session]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setStatus(null);
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    setUploading(true);
    setStatus(null);

    const formData = new FormData();
    formData.append("file", file);
    if (selectedReportId) {
      formData.append("targetId", selectedReportId);
    }

    try {
      const res = await fetch("/api/reporte/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (res.ok) {
        setStatus({
          success: true,
          message: `¡Reporte "${data.title}" ${selectedReportId ? "actualizado" : "creado"} con éxito en PostgreSQL!`,
        });
        setFile(null);
        setSelectedReportId(null);
        void fetchReportes();
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

  const handleDeleteReport = async (id: string, titulo: string) => {
    if (!confirm(`¿Estás seguro de que deseas eliminar el reporte "${titulo}"?`)) {
      return;
    }

    try {
      const res = await fetch(`/api/reporte/delete?id=${encodeURIComponent(id)}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (res.ok) {
        setStatus({
          success: true,
          message: `El reporte "${titulo}" fue eliminado correctamente.`,
        });
        fetchReportes();
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

  // Buscador inteligente por Título, Autor, ID o Fecha de Publicación (ej. "2025" u "Octubre 2025")
  const filteredReportes = reportes.filter((r) => {
    const query = searchQuery.toLowerCase().trim();
    if (!query) return true;
    return (
      r.titulo.toLowerCase().includes(query) ||
      r.autor.toLowerCase().includes(query) ||
      r.id.toLowerCase().includes(query) ||
      r.published.toLowerCase().includes(query)
    );
  });

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

        {/* Buscador Rápido del Topbar */}
        <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-[var(--paper)] border border-[var(--rule-soft)] rounded-md w-72 text-xs text-[var(--ink-muted)]">
          <Search className="w-3.5 h-3.5 text-[var(--ink-soft)]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar reportes, autores o fecha..."
            className="w-full bg-transparent outline-none text-[12px] text-[var(--ink)] placeholder-[var(--ink-soft)]"
          />
          <kbd className="hidden lg:inline-flex items-center gap-0.5 text-[10px] bg-[var(--paper-2)] px-1.5 py-0.5 rounded border border-[var(--rule-soft)] font-mono text-[var(--ink-soft)]">
            <Command className="w-2.5 h-2.5" /> K
          </kbd>
        </div>

        {/* Acciones Topbar & Perfil */}
        <div className="flex items-center gap-3">
          <a
            href="/"
            target="_blank"
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-[12px] font-medium text-[var(--forest-700)] hover:text-[var(--forest-800)] bg-[var(--paper)] hover:bg-white border border-[var(--rule)] rounded-md transition shadow-sm"
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
                onClick={() => setActiveTab("dashboard")}
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
                onClick={() => setActiveTab("reportes")}
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
                    activeTab === "reportes" ? "bg-white/20 text-white" : "bg-[var(--rule-soft)] text-[var(--ink-muted)]"
                  }`}
                >
                  {reportes.length}
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
                <span>Ingestar / Subir MDX</span>
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
                className={`w-full flex items-center justify-between px-3 py-2 rounded-md text-[13px] font-medium transition cursor-pointer ${
                  activeTab === "editor"
                    ? "bg-[var(--forest-700)] text-[var(--paper)] shadow-sm font-semibold"
                    : "text-[var(--ink-muted)] hover:text-[var(--forest-800)] hover:bg-[var(--paper)]"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Sparkles className="w-4 h-4 text-[var(--gold-500)]" />
                  <span>Editor MDX</span>
                </div>
                <span className="text-[9px] uppercase font-bold tracking-wider px-1.5 py-0.5 bg-[var(--gold-500)]/20 text-[var(--gold-600)] rounded">
                  Próximamente
                </span>
              </button>
            </div>
          </div>

          {/* Tarjeta Inferior de Estado de Base de Datos */}
          <div className="mt-8 p-3.5 bg-[var(--paper)] border border-[var(--rule-soft)] rounded-md space-y-2 text-[11px]">
            <div className="flex items-center justify-between font-semibold text-[var(--forest-800)]">
              <div className="flex items-center gap-1.5">
                <Database className="w-3.5 h-3.5 text-emerald-600" />
                <span>Neon PostgreSQL</span>
              </div>
              <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-bold bg-emerald-100 text-emerald-800">
                Conectado
              </span>
            </div>
            <p className="text-[10px] text-[var(--ink-soft)] leading-relaxed">
              Auth Server: Better Auth v1.1 <br />
              Motor: Prisma 7 PgAdapter
            </p>
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

                <a
                  href="/api/reporte/template"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-[var(--paper-2)] hover:bg-white text-[var(--forest-800)] text-[12px] font-semibold rounded-md border border-[var(--rule)] transition shadow-sm self-start sm:self-auto"
                >
                  <Download className="w-3.5 h-3.5 text-[var(--forest-700)]" />
                  <span>Descargar Plantilla MDX</span>
                </a>
              </div>

              {/* Fila de Tarjetas de Métricas (Stat Cards) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-[var(--paper-2)] border border-[var(--rule-soft)] p-5 rounded-md shadow-sm space-y-2">
                  <div className="flex items-center justify-between text-[11px] font-semibold text-[var(--ink-soft)] uppercase tracking-wider">
                    <span>Reportes Publicados</span>
                    <FolderOpen className="w-4 h-4 text-[var(--forest-700)]" />
                  </div>
                  <div className="flex items-baseline justify-between">
                    <span className="font-display font-bold text-3xl text-[var(--forest-800)]">
                      {reportes.length}
                    </span>
                    <span className="text-[11px] text-emerald-700 font-semibold bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">
                      En Línea
                    </span>
                  </div>
                  <p className="text-[11px] text-[var(--ink-muted)]">
                    {latestReport ? `Último: ${latestReport.published}` : "Sin reportes"}
                  </p>
                </div>

                <div className="bg-[var(--paper-2)] border border-[var(--rule-soft)] p-5 rounded-md shadow-sm space-y-2">
                  <div className="flex items-center justify-between text-[11px] font-semibold text-[var(--ink-soft)] uppercase tracking-wider">
                    <span>Mediana Capacidad Varada</span>
                    <TrendingUp className="w-4 h-4 text-[var(--gold-600)]" />
                  </div>
                  <div className="flex items-baseline justify-between">
                    <span className="font-display font-bold text-3xl text-[var(--forest-800)]">
                      {latestReport ? latestReport.medianaGlobal : "31,4%"}
                    </span>
                    <span className="text-[11px] text-[var(--forest-700)] font-semibold bg-[var(--forest-50)] border border-[var(--forest-200)] px-2 py-0.5 rounded">
                      SCI Metric
                    </span>
                  </div>
                  <p className="text-[11px] text-[var(--ink-muted)]">
                    Basado en n=41 sitios medidos
                  </p>
                </div>

                <div className="bg-[var(--paper-2)] border border-[var(--rule-soft)] p-5 rounded-md shadow-sm space-y-2">
                  <div className="flex items-center justify-between text-[11px] font-semibold text-[var(--ink-soft)] uppercase tracking-wider">
                    <span>Estado del Motor DB</span>
                    <Activity className="w-4 h-4 text-emerald-600" />
                  </div>
                  <div className="flex items-baseline justify-between">
                    <span className="font-display font-bold text-xl text-[var(--forest-800)]">
                      Neon PG
                    </span>
                    <span className="text-[11px] text-emerald-700 font-semibold bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">
                      Saludable
                    </span>
                  </div>
                  <p className="text-[11px] text-[var(--ink-muted)]">
                    Prisma 7 PgPool Conectado
                  </p>
                </div>

                <div className="bg-[var(--paper-2)] border border-[var(--rule-soft)] p-5 rounded-md shadow-sm space-y-2">
                  <div className="flex items-center justify-between text-[11px] font-semibold text-[var(--ink-soft)] uppercase tracking-wider">
                    <span>Autenticación</span>
                    <ShieldCheck className="w-4 h-4 text-[var(--forest-700)]" />
                  </div>
                  <div className="flex items-baseline justify-between">
                    <span className="font-display font-bold text-xl text-[var(--forest-800)]">
                      Better Auth
                    </span>
                    <span className="text-[11px] text-[var(--forest-700)] font-semibold bg-[var(--forest-50)] border border-[var(--forest-200)] px-2 py-0.5 rounded">
                      Protegido
                    </span>
                  </div>
                  <p className="text-[11px] text-[var(--ink-muted)] truncate">
                    {session?.user?.email}
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
                      onClick={() => setActiveTab("reportes")}
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
                          {latestReport.titulo}
                        </h3>
                        <span className="px-2.5 py-0.5 text-[11px] font-bold bg-[var(--forest-50)] text-[var(--forest-700)] border border-[var(--forest-200)] rounded">
                          {latestReport.published}
                        </span>
                      </div>
                      <p className="text-[13px] text-[var(--ink-muted)]">
                        {latestReport.subtitulo || "Reporte técnico sobre capacidad varada e infraestructura de datos."}
                      </p>
                      <div className="flex flex-wrap items-center gap-4 text-[12px] text-[var(--ink-soft)] pt-2 border-t border-[var(--rule-soft)]">
                        <span>Autor: <strong>{latestReport.autor}</strong></span>
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
                      onClick={() => setActiveTab("upload")}
                      className="w-full flex items-center justify-between p-3 bg-[var(--paper)] hover:bg-white border border-[var(--rule-soft)] rounded-md text-[13px] font-semibold text-[var(--forest-800)] transition shadow-sm cursor-pointer group"
                    >
                      <div className="flex items-center gap-2.5">
                        <UploadCloud className="w-4 h-4 text-[var(--forest-700)] group-hover:scale-110 transition" />
                        <span>Subir Nuevo .MDX</span>
                      </div>
                      <ArrowUpRight className="w-4 h-4 text-[var(--ink-soft)]" />
                    </button>

                    <a
                      href="/api/reporte/template"
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

          {/* PESTAÑA 2: REPORTES PUBLICADOS */}
          {activeTab === "reportes" && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[var(--rule-soft)] pb-6 gap-4">
                <div>
                  <div className="eyebrow mb-1">Biblioteca General</div>
                  <h1 className="font-display text-[28px] font-bold text-[var(--forest-800)]">
                    Reportes Almacenados ({reportes.length})
                  </h1>
                  <p className="text-[13px] text-[var(--ink-muted)] mt-1">
                    Filtra reportes por título, autor o fecha de publicación (ej. &quot;2025&quot; u &quot;Octubre 2025&quot;).
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setActiveTab("upload")}
                    className="flex items-center gap-2 px-4 py-2 bg-[var(--forest-700)] hover:bg-[var(--forest-800)] text-[var(--paper)] text-[12px] font-semibold rounded-md shadow-sm transition cursor-pointer"
                  >
                    <UploadCloud className="w-3.5 h-3.5" />
                    <span>Subir Nuevo MDX</span>
                  </button>

                  <button
                    onClick={fetchReportes}
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
                ) : filteredReportes.length === 0 ? (
                  <div className="py-16 text-center text-[13px] text-[var(--ink-muted)]">
                    No se encontraron reportes que coincidan con &quot;{searchQuery}&quot;.
                  </div>
                ) : (
                  filteredReportes.map((rep) => (
                    <div
                      key={rep.id}
                      className="p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4 hover:bg-[var(--paper)]/60 transition"
                    >
                      <div className="space-y-1.5 max-w-2xl">
                        <div className="flex flex-wrap items-center gap-2.5">
                          <h3 className="font-display font-bold text-[18px] text-[var(--forest-800)]">
                            {rep.titulo}
                          </h3>
                          <span className="px-2.5 py-0.5 text-[10px] uppercase font-bold bg-[var(--forest-50)] text-[var(--forest-700)] rounded border border-[var(--forest-200)] font-mono">
                            {rep.published}
                          </span>
                        </div>
                        <p className="text-[13px] text-[var(--ink-muted)] line-clamp-1">
                          {rep.subtitulo || "Reporte técnico sobre capacidad varada e infraestructura de datos."}
                        </p>
                        <div className="text-[11px] text-[var(--ink-soft)] flex flex-wrap items-center gap-3 pt-1">
                          <span>Autor: <strong>{rep.autor}</strong></span>
                          <span>•</span>
                          <span>DOI: {rep.doi}</span>
                          <span>•</span>
                          <span>Mediana: <strong className="text-[var(--forest-700)]">{rep.medianaGlobal}</strong></span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <a
                          href="/"
                          target="_blank"
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-[var(--paper)] hover:bg-white text-[12px] font-medium text-[var(--forest-700)] border border-[var(--rule)] rounded-md transition shadow-sm"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                          <span>Ver Sitio</span>
                        </a>

                        <button
                          onClick={() => {
                            setSelectedReportId(rep.id);
                            setActiveTab("upload");
                          }}
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-[var(--forest-700)] hover:bg-[var(--forest-800)] text-[var(--paper)] text-[12px] font-semibold rounded-md transition cursor-pointer shadow-sm"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                          <span>Reemplazar MDX</span>
                        </button>

                        <button
                          onClick={() => handleDeleteReport(rep.id, rep.titulo)}
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
            </div>
          )}

          {/* PESTAÑA 3: INGESTAR / SUBIR MDX */}
          {activeTab === "upload" && (
            <div className="space-y-8 max-w-4xl">
              <div className="border-b border-[var(--rule-soft)] pb-6">
                <div className="eyebrow mb-1">
                  {selectedReportId ? `Actualizando Registro (${selectedReportId})` : "Nuevo Informe"}
                </div>
                <h1 className="font-display text-[28px] font-bold text-[var(--forest-800)]">
                  {selectedReportId ? "Sobrescribir Reporte con nuevo MDX" : "Ingestar Nuevo Reporte (.mdx)"}
                </h1>
                <p className="text-[13px] text-[var(--ink-muted)] mt-1">
                  Sube el archivo .mdx con el Frontmatter YAML. Se procesará con gray-matter y Zod para actualizar PostgreSQL inmediatamente.
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
                <div className="border-2 border-dashed border-[var(--rule)] rounded-md p-10 text-center hover:border-[var(--forest-600)] transition-colors cursor-pointer bg-[var(--paper-2)]">
                  <input
                    type="file"
                    accept=".mdx,.md"
                    onChange={handleFileChange}
                    className="hidden"
                    id="file-upload"
                  />
                  <label htmlFor="file-upload" className="cursor-pointer flex flex-col items-center">
                    <UploadCloud className="w-12 h-12 text-[var(--forest-700)] mb-3" />
                    <span className="text-[15px] font-semibold text-[var(--forest-800)]">
                      {file ? file.name : "Haz clic o arrastra tu archivo .mdx aquí"}
                    </span>
                    <span className="text-[12px] text-[var(--ink-soft)] mt-1">
                      Archivos soportados: .mdx con métricas y frontmatter YAML
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
                        <a
                          href="/"
                          target="_blank"
                          className="mt-1.5 inline-block text-emerald-800 underline font-medium hover:text-emerald-950"
                        >
                          Ver cambios en el sitio público →
                        </a>
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
                    : "Subir e Ingestar Reporte"}
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
                    href="/api/reporte/template"
                    className="flex items-center gap-2 px-4 py-2.5 bg-[var(--forest-700)] hover:bg-[var(--forest-800)] text-[var(--paper)] text-[13px] font-semibold rounded-md transition shadow-sm self-start sm:self-auto"
                  >
                    <Download className="w-4 h-4" />
                    <span>Descargar Plantilla MDX</span>
                  </a>
                </div>

                <div className="space-y-4">
                  <h4 className="font-display font-semibold text-[15px] text-[var(--forest-800)]">
                    Campos clave del YAML Frontmatter:
                  </h4>
                  <ul className="text-[13px] space-y-2 text-[var(--ink-muted)] list-disc pl-5">
                    <li><strong className="text-[var(--forest-700)]">title & author:</strong> Título oficial del reporte e investigador a cargo.</li>
                    <li><strong className="text-[var(--forest-700)]">published:</strong> Fecha o año de publicación (Ej: <em>&quot;Octubre 2025&quot;</em> o <em>&quot;2025&quot;</em>).</li>
                    <li><strong className="text-[var(--forest-700)]">medianaGlobal & lossWorkload:</strong> Porcentajes que alimentan los contadores globales.</li>
                    <li><strong className="text-[var(--forest-700)]">keyFinding:</strong> Frase dinámica que se resalta automáticamente en la barra lateral.</li>
                    <li><strong className="text-[var(--forest-700)]">layers:</strong> Array estructurado de las 3 capas físicas (Instalaciones, TI, Carga) con sus tarjetas.</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* PESTAÑA 5: ROADMAP EDITOR MDX */}
          {activeTab === "editor" && (
            <div className="space-y-8 max-w-4xl">
              <div className="border-b border-[var(--rule-soft)] pb-6">
                <div className="eyebrow mb-1">Próxima Fase de Desarrollo</div>
                <h1 className="font-display text-[28px] font-bold text-[var(--forest-800)] flex items-center gap-3">
                  Editor MDX Visual e Interactivo
                  <Sparkles className="w-6 h-6 text-[var(--gold-500)]" />
                </h1>
                <p className="text-[13px] text-[var(--ink-muted)] mt-1">
                  Proyección para la edición directa desde el navegador web.
                </p>
              </div>

              <div className="bg-[var(--forest-50)]/50 border border-[var(--forest-200)] p-8 rounded-md space-y-4 shadow-sm">
                <h3 className="font-display text-[20px] font-bold text-[var(--forest-800)]">
                  Editor Dual en Tiempo Real
                </h3>
                <p className="text-[13px] leading-relaxed text-[var(--ink-muted)]">
                  En la siguiente iteración se integrará un editor de texto enriquecido con resaltado de sintaxis YAML/Markdown y previsualización del diseño editorial a pantalla dividida. Los autores podrán redactar el reporte, realizar cambios y guardar en Neon PostgreSQL sin necesidad de editores locales.
                </p>
                <div className="pt-2 flex items-center gap-2 text-[12px] font-semibold text-[var(--forest-700)]">
                  <FileCode className="w-4 h-4" />
                  <span>Cargado automático de la plantilla estática al crear nuevos borradores.</span>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      <footer className="bg-[var(--paper-2)] border-t border-[var(--rule-soft)] py-4 px-6 lg:px-10 text-[12px] text-[var(--ink-muted)] flex flex-col sm:flex-row items-center justify-between gap-2 mt-auto no-print">
        <div>
          PhysaFlow Admin Suite © 2025 · Panel de Administración de Infraestructura
        </div>
        <div className="flex items-center gap-4 text-[11px] font-medium text-[var(--ink-soft)]">
          <span>Neon PostgreSQL Conectado</span>
          <span>•</span>
          <span>Prisma 7 PgAdapter</span>
        </div>
      </footer>
    </div>
  );
}
