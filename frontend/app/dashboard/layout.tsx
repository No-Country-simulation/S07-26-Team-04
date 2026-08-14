import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="font-sans antialiased text-[#DAD7CD] bg-[#344E41] min-h-screen selection:bg-[#c9a227] selection:text-[#273a2f]">
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset className="bg-[#344E41] text-[#DAD7CD]">
          <div className="p-4 sm:p-8 relative min-h-screen">
            <div className="mb-4">
              <SidebarTrigger className="text-[#ecc246] hover:bg-[#273a2f] hover:text-[#ecc246] border border-[#c9a227]/30 shadow-sm" />
            </div>
            {children}
          </div>
        </SidebarInset>
      </SidebarProvider>
    </div>
  );
}








