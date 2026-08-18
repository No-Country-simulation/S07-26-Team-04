"use client";

import { useState } from "react";

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

const mainSections = [
  {
    title: "RESUMEN",
    url: "#resumen",
    icon: Info,
    number: "01",
  },
  {
    title: "INTRODUCCIÓN",
    url: "#introduction",
    icon: Compass,
    number: "02",
  },
  {
    title: "TAXONOMÍA",
    url: "#taxonomy",
    icon: Shapes,
    number: "03",
  },
  {
    title: "METODOLOGÍA",
    url: "#methodology",
    icon: Microscope,
    number: "04",
  },
  {
    title: "FIGURAS",
    url: "#figures",
    icon: ChartNoAxesCombined,
    number: "05",
  },
  {
    title: "CONCLUSIÓN",
    url: "#conclusion",
    icon: FileText,
    number: "06",
  },
];

const referenceSections = [
  {
    title: "CITAR",
    url: "#quote",
    icon: Quote,
    number: "07",
  },
];

export function ReportSidebar() {
  const [activeSection, setActiveSection] = useState<string | null>(null);

  const renderSection = (section: (typeof mainSections)[0]) => {
    const Icon = section.icon;
    const isActive = activeSection === section.title;

    return (
      <SidebarMenuItem key={section.title}>
        <SidebarMenuButton
          className={`
            group
            relative
            h-10
            rounded-md
            px-3
            py-2
            text-[10px]
            uppercase
            tracking-[0.06em]
            transition-all
            duration-200
            ${isActive 
              ? "bg-[#0a3d2e] text-[#c6a13a] font-medium" 
              : "text-[#a6aaa2] hover:bg-[#082f25]/60 hover:text-[#c6a13a]/90"
            }
          `}
        >
          <Link
            href={section.url}
            onClick={() => setActiveSection(section.title)}
            data-active={isActive}
            className="flex items-center gap-3 w-full sidebar-label"
          >
            {/* Indicador de sección activa */}
            <span
              className={`
                absolute
                left-0
                top-1/2
                -translate-y-1/2
                w-[3px]
                h-4
                rounded-r-full
                transition-all
                duration-200
                ${isActive ? "bg-[#c6a13a]" : "bg-transparent group-hover:bg-[#c6a13a]/30"}
              `}
            />

            {/* Número de sección */}
            <span className="text-[8px] text-[#c6a13a]/50 font-mono w-4">
              {section.number}
            </span>

            <Icon 
              size={14} 
              strokeWidth={1.5} 
              className={`transition-colors duration-200 ${isActive ? "text-[#c6a13a]" : ""}`}
            />

            <span className="flex-1">{section.title}</span>
          </Link>
        </SidebarMenuButton>
      </SidebarMenuItem>
    );
  };

  return (
    <Sidebar collapsible="none" className="report-sidebar border-r-0 no-print">
      {/* Header del Sidebar */}
      <div className="px-4 py-5 border-b border-[#0a3d2e]/50">
        <p className="text-[11px] uppercase tracking-[0.2em] text-[#c6a13a] font-medium">
          Secciones del reporte
        </p>
        <p className="text-[9px] text-[#a6aaa2]/60 mt-1">
          Navegación rápida
        </p>
      </div>

      {/* Contenido */}
      <SidebarContent className="px-2 py-3">
        {/* Secciones principales */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-[8px] uppercase tracking-[0.15em] text-[#a6aaa2]/50 px-3 mb-1">
            Contenido
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-0.5">
              {mainSections.map(renderSection)}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Separador */}
        <div className="mx-3 my-3 border-t border-[#0a3d2e]/40" />

        {/* Secciones de referencia */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-[8px] uppercase tracking-[0.15em] text-[#a6aaa2]/50 px-3 mb-1">
            Referencia
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-0.5">
              {referenceSections.map(renderSection)}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
