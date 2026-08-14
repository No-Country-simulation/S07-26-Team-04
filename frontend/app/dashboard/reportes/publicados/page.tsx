import { ReportTable } from "@/components/dashboard/report-table";

export default function PublicadosPage() {
  return (
    <ReportTable
      statusFilter="published"
      title="Reportes Publicados"
      description="Listado de reportes activos y accesibles públicamente en la plataforma."
    />
  );
}
