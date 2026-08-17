import { ReportTable } from "@/components/dashboard/report-table";

export default function ArchivadosPage() {
  return (
    <ReportTable
      statusFilter="archived"
      title="Reportes Archivados"
      description="Histórico de reportes fuera de circulación."
    />
  );
}
