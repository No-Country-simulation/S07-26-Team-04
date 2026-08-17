"use client";

import { useEffect, useState } from "react";

import Link from "next/link";

import {
  Info,
  Shapes,
  Compass,
  Microscope,
  ChartNoAxesCombined,
  FileText,
  Quote,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

const sections = [
  {
    title: "01 - RESUMEN",
    url: "#resumen",
    icon: Info,
  },
  {
    title: "02 - INTRODUCCIÓN",
    url: "#introduction",
    icon: Compass,
  },
  {
    title: "03 - TAXONOMÍA",
    url: "#taxonomy",
    icon: Shapes,
  },
  {
    title: "04 - METODOLOGÍA",
    url: "#methodology",
    icon: Microscope,
  },
  {
    title: "05 - FIGURAS",
    url: "#figures",
    icon: ChartNoAxesCombined,
  },
  {
    title: "06 - CONCLUSIÓN",
    url: "#conclusion",
    icon: FileText,
  },
  {
    title: "07 - CITAR",
    url: "#quote",
    icon: Quote,
  },
];

export function ReportSidebar() {
  const [activeSection, setActiveSection] = useState<string | null>(null);

  return (
    <Sidebar collapsible="none" className="report-sidebar border-r-0">
      {/* Header del Sidebar */}
      <div className="px-3 py-4">
        <p className="text-[12px] uppercase tracking-[0.18em] text-[#c6a13a]">
          Secciones del reporte
        </p>
      </div>

      {/* Contenido */}
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="sr-only">Secciones</SidebarGroupLabel>

          <SidebarGroupContent>
            <SidebarMenu>
              {sections.map((section) => {
                const Icon = section.icon;

                const isActive = activeSection === section.title;

                return (
                  <SidebarMenuItem key={section.title}>
                    <SidebarMenuButton
                      className="
                        h-auto
                        min-h-9
                        rounded-none
                        px-3
                        py-2
                        text-[7px]
                        uppercase
                        tracking-[0.04em]
                        text-[#a6aaa2]
                        hover:bg-[#082f25]
                        hover:text-[#c6a13a]
                      "
                    >
                      <Link
                        href={section.url}
                        onClick={() => setActiveSection(section.title)}
                        data-active={isActive}
                        className="flex items-center gap-2 sidebar-label"
                      >
                        <Icon size={13} strokeWidth={1.5} />

                        <span>{section.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
