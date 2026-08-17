import { ReportTable } from "@/components/dashboard/report-table";

export default function BorradoresPage() {
  return (
    <ReportTable
      statusFilter="draft"
      title="Borradores"
      description="Reportes en desarrollo que aún no han sido publicados."
    />
  );
}
