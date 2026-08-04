import { ReportSidebar } from "@/components/report/sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";

interface ReportContentProps {
  children: React.ReactNode;
}

export function ReportContent({ children }: ReportContentProps) {
  return (
    <SidebarProvider>
      <section className="report-content-section">
        <div className="report-content-layout">
          <aside className="report-content-sidebar">
            <ReportSidebar />
          </aside>

          <main className="report-content-main">{children}</main>
        </div>
      </section>
    </SidebarProvider>
  );
}
