"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  FileText,
  FilePlus,
  FolderKanban,
  LayoutDashboard,
  ChevronRight,
  FileCheck,
  FileClock,
  Archive,
  ArrowLeft,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname();

  return (
    <Sidebar collapsible="icon" className="border-r border-[#3a5345] bg-[#273a2f] text-[#DAD7CD]" {...props}>
      <SidebarHeader className="p-4 border-b border-[#3a5345] bg-[#273a2f] group-data-[collapsible=icon]:p-2">
        <div className="flex items-center gap-3 group-data-[collapsible=icon]:justify-center">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-[#f3e5ab] via-[#c9a227] to-[#8a6b05] text-[#273a2f] font-extrabold shadow-[0_0_12px_rgba(201,162,39,0.5)] ring-1 ring-[#ecc246]/60 border border-[#f3e5ab]/30">
            PF
          </div>
          <div className="flex flex-col gap-0.5 leading-none group-data-[collapsible=icon]:hidden">
            <span className="font-semibold text-sm tracking-wide text-[#ecc246]">PhysaFlow</span>
            <span className="text-[10px] uppercase tracking-widest text-[#A3B18A]">Admin Panel</span>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent className="bg-[#273a2f]">
        {/* Inicio Dashboard */}
        <SidebarGroup>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                render={<Link href="/dashboard" />}
                tooltip="Inicio Dashboard"
                isActive={pathname === "/dashboard"}
                className="hover:bg-[#344E41] hover:text-[#ecc246] data-active:bg-[#344E41] data-active:text-[#ecc246] data-active:border-l-2 data-active:border-[#c9a227]"
              >
                <LayoutDashboard className="h-4 w-4 text-[#ecc246]" />
                <span>Inicio</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>

        {/* Sección REPORTES */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-[11px] uppercase tracking-widest text-[#A3B18A] opacity-90">Gestión de Contenido</SidebarGroupLabel>
          <SidebarMenu>
            {/* Si está expandido -> Menú Colapsable */}
            <div className="group-data-[collapsible=icon]:hidden">
              <Collapsible defaultOpen className="group/collapsible">
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton tooltip="Reportes" className="hover:bg-[#344E41] hover:text-[#ecc246]">
                      <FileText className="h-4 w-4 text-[#ecc246]" />
                      <span>Reportes</span>
                      <ChevronRight className="ml-auto h-4 w-4 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarMenuSub className="border-[#3a5345]">
                      <SidebarMenuSubItem>
                        <SidebarMenuSubButton
                          render={<Link href="/dashboard/reportes/publicados" />}
                          isActive={pathname === "/dashboard/reportes/publicados"}
                          className="hover:bg-[#344E41] hover:text-[#ecc246] data-active:bg-[#344E41] data-active:text-[#ecc246] data-active:font-semibold"
                        >
                          <FileCheck className="h-3.5 w-3.5 text-emerald-400" />
                          <span>Publicados</span>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                      <SidebarMenuSubItem>
                        <SidebarMenuSubButton
                          render={<Link href="/dashboard/reportes/borradores" />}
                          isActive={pathname === "/dashboard/reportes/borradores"}
                          className="hover:bg-[#344E41] hover:text-[#ecc246] data-active:bg-[#344E41] data-active:text-[#ecc246] data-active:font-semibold"
                        >
                          <FileClock className="h-3.5 w-3.5 text-[#ecc246]" />
                          <span>Borradores</span>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                      <SidebarMenuSubItem>
                        <SidebarMenuSubButton
                          render={<Link href="/dashboard/reportes/archivados" />}
                          isActive={pathname === "/dashboard/reportes/archivados"}
                          className="hover:bg-[#344E41] hover:text-[#ecc246] data-active:bg-[#344E41] data-active:text-[#ecc246] data-active:font-semibold"
                        >
                          <Archive className="h-3.5 w-3.5 text-slate-400" />
                          <span>Archivados</span>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </SidebarMenuItem>
              </Collapsible>

              <Collapsible defaultOpen className="group/collapsible">
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton tooltip="Editor" className="hover:bg-[#344E41] hover:text-[#ecc246]">
                      <FolderKanban className="h-4 w-4 text-[#ecc246]" />
                      <span>Editor</span>
                      <ChevronRight className="ml-auto h-4 w-4 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarMenuSub className="border-[#3a5345]">
                      <SidebarMenuSubItem>
                        <SidebarMenuSubButton
                          render={<Link href="/dashboard/editor/nuevo" />}
                          isActive={pathname === "/dashboard/editor/nuevo"}
                          className="hover:bg-[#344E41] hover:text-[#ecc246] data-active:bg-[#344E41] data-active:text-[#ecc246] data-active:font-semibold"
                        >
                          <FilePlus className="h-3.5 w-3.5 text-[#ecc246]" />
                          <span>Nuevo reporte</span>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>

                    </SidebarMenuSub>
                  </CollapsibleContent>
                </SidebarMenuItem>
              </Collapsible>
            </div>

            {/* Si está colapsado (icon mode) -> Íconos Directos con Tooltip */}
            <div className="hidden group-data-[collapsible=icon]:block space-y-1">
              <SidebarMenuItem>
                <SidebarMenuButton
                  render={<Link href="/dashboard/reportes/publicados" />}
                  tooltip="Reportes Publicados"
                  isActive={pathname === "/dashboard/reportes/publicados"}
                  className="hover:bg-[#344E41] hover:text-[#ecc246]"
                >
                  <FileCheck className="h-4 w-4 text-emerald-400" />
                  <span>Publicados</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  render={<Link href="/dashboard/reportes/borradores" />}
                  tooltip="Reportes Borradores"
                  isActive={pathname === "/dashboard/reportes/borradores"}
                  className="hover:bg-[#344E41] hover:text-[#ecc246]"
                >
                  <FileClock className="h-4 w-4 text-[#ecc246]" />
                  <span>Borradores</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  render={<Link href="/dashboard/reportes/archivados" />}
                  tooltip="Reportes Archivados"
                  isActive={pathname === "/dashboard/reportes/archivados"}
                  className="hover:bg-[#344E41] hover:text-[#ecc246]"
                >
                  <Archive className="h-4 w-4 text-slate-400" />
                  <span>Archivados</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  render={<Link href="/dashboard/editor/nuevo" />}
                  tooltip="Nuevo Reporte (Editor)"
                  isActive={pathname === "/dashboard/editor/nuevo"}
                  className="hover:bg-[#344E41] hover:text-[#ecc246]"
                >
                  <FilePlus className="h-4 w-4 text-[#ecc246]" />
                  <span>Nuevo Reporte</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </div>
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4 border-t border-[#3a5345] bg-[#273a2f] space-y-2">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              render={<Link href="/" />}
              tooltip="Volver al Sitio Web Público"
              className="hover:bg-[#344E41] hover:text-[#ecc246]"
            >
              <ArrowLeft className="h-4 w-4 text-[#ecc246]" />
              <span className="text-[#DAD7CD]/90 hover:text-[#ecc246] group-data-[collapsible=icon]:hidden">Volver al Home</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}










