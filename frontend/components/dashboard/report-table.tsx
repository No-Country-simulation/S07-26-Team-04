"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { FileEdit, Eye, FileCheck, FileClock, Archive } from "lucide-react";

interface Report {
  id: string;
  title: string;
  slug: string;
  version: string;
  status: 'draft' | 'published' | 'archived';
  publishedAt: string | null;
  updatedAt: string;
}

interface ReportTableProps {
  statusFilter: 'all' | 'published' | 'draft' | 'archived';
  title: string;
  description: string;
}

export function ReportTable({ statusFilter, title, description }: ReportTableProps) {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchReports() {
      try {
        setLoading(true);
        const res = await fetch(`/api/report?status=${statusFilter}`);
        if (!res.ok) throw new Error("Error al obtener reportes");
        const data = await res.json();
        setReports(Array.isArray(data) ? data : [data]);
      } catch (err: unknown) {
        const errorObj = err as { message?: string };
        setError(errorObj.message || "Ocurrió un error");
      } finally {

        setLoading(false);
      }
    }
    fetchReports();
  }, [statusFilter]);

  const getStatusBadge = (status: Report['status']) => {
    switch (status) {
      case 'published':
        return (
          <span className="inline-flex items-center gap-1 text-xs px-2.5 py-0.5 rounded-full font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <FileCheck className="h-3 w-3" /> Publicado
          </span>
        );
      case 'draft':
        return (
          <span className="inline-flex items-center gap-1 text-xs px-2.5 py-0.5 rounded-full font-medium bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <FileClock className="h-3 w-3" /> Borrador
          </span>
        );
      case 'archived':
        return (
          <span className="inline-flex items-center gap-1 text-xs px-2.5 py-0.5 rounded-full font-medium bg-slate-500/10 text-slate-400 border border-slate-500/20">
            <Archive className="h-3 w-3" /> Archivado
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6 font-sans text-[#DAD7CD]">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#3a5345] pb-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-[#DAD7CD]">{title}</h2>
          <p className="text-sm text-[#A3B18A]">{description}</p>
        </div>
        <Link
          href="/dashboard/editor/nuevo"
          className="inline-flex items-center justify-center text-xs font-bold uppercase tracking-wider px-4 py-2 bg-[#c9a227] text-[#062a20] rounded-md hover:bg-[#ecc246] transition-colors shadow-md"
        >
          + Crear Reporte
        </Link>
      </div>

      {loading ? (
        <div className="p-12 text-center text-[#A3B18A] border border-[#3a5345] rounded-xl bg-[#273a2f]">
          Cargando reportes...
        </div>
      ) : error ? (
        <div className="p-6 text-center text-red-300 border border-red-500/30 rounded-xl bg-red-950/20">
          {error}
        </div>
      ) : reports.length === 0 ? (
        <div className="p-12 text-center border border-[#3a5345] rounded-xl bg-[#273a2f] space-y-3">
          <p className="text-[#A3B18A]">No se encontraron reportes en esta sección.</p>
          <Link
            href="/dashboard/editor/nuevo"
            className="inline-block text-sm text-[#ecc246] underline hover:text-[#c9a227]"
          >
            Crear el primer reporte
          </Link>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-[#3a5345] bg-[#273a2f] shadow-xl">
          <table className="w-full text-sm text-left">
            <thead className="bg-[#213128] text-[11px] text-[#ecc246] uppercase tracking-wider border-b border-[#3a5345]">
              <tr>
                <th className="px-6 py-3.5 font-semibold">Título</th>
                <th className="px-6 py-3.5 font-semibold">Slug</th>
                <th className="px-6 py-3.5 font-semibold">Estado</th>
                <th className="px-6 py-3.5 font-semibold">Versión</th>
                <th className="px-6 py-3.5 font-semibold">Publicación</th>
                <th className="px-6 py-3.5 font-semibold text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#3a5345]">
              {reports.map((report) => (
                <tr key={report.id} className="hover:bg-[#344E41]/60 transition-colors">
                  <td className="px-6 py-4 font-medium text-[#DAD7CD]">{report.title}</td>
                  <td className="px-6 py-4 font-mono text-xs text-[#A3B18A]">{report.slug}</td>
                  <td className="px-6 py-4">{getStatusBadge(report.status)}</td>
                  <td className="px-6 py-4 font-mono text-xs text-[#DAD7CD]">{report.version}</td>
                  <td className="px-6 py-4 text-xs text-[#A3B18A]">
                    {report.publishedAt ? new Date(report.publishedAt).toLocaleDateString() : '—'}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/dashboard/editor/editar/${report.id}`}
                        className="p-1.5 rounded-md hover:bg-[#344E41] text-[#A3B18A] hover:text-[#ecc246] transition-colors"
                        title="Editar"
                      >
                        <FileEdit className="h-4 w-4" />
                      </Link>
                      {report.status === 'published' && (
                        <Link
                          href={`/?slug=${report.slug}`}
                          target="_blank"
                          className="p-1.5 rounded-md hover:bg-[#344E41] text-[#A3B18A] hover:text-[#ecc246] transition-colors"
                          title="Ver en Home"
                        >
                          <Eye className="h-4 w-4" />
                        </Link>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}






