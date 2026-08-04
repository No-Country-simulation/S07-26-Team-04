import { Header } from "@/components/report/header";

interface ReportShellProps {
  children: React.ReactNode;
}

export function ReportShell({ children }: ReportShellProps) {
  return (
    <div className="report-site">
      <Header />

      {children}
    </div>
  );
}
