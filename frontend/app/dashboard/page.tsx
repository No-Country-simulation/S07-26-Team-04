import { ReportTable } from "@/components/dashboard/report-table";

export default function DashboardPage() {
  return (
    <ReportTable
      statusFilter="all"
      title="Todos los Reportes"
      description="Resumen completo de reportes publicados, borradores y archivados en PhysaFlow."
    />
  );
}
