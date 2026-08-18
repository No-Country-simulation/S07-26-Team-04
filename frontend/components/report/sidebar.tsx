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
  const [activeSection, setActiveSection] = useState<string>("01 - RESUMEN");

  useEffect(() => {
    const observerCallback: IntersectionObserverCallback = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const matching = sections.find((s) => s.url === `#${entry.target.id}`);
          if (matching) {
            setActiveSection(matching.title);
          }
        }
      });
    };

    const observerOptions: IntersectionObserverInit = {
      root: null,
      rootMargin: "-15% 0px -65% 0px",
      threshold: 0,
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    sections.forEach((section) => {
      const id = section.url.replace("#", "");
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <Sidebar collapsible="none" className="report-sidebar border-r-0 no-print">
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
                      className={`
                        h-auto
                        min-h-9
                        rounded-none
                        px-3
                        py-2
                        text-[7px]
                        uppercase
                        tracking-[0.04em]
                        transition-colors
                        ${
                          isActive
                            ? "bg-[#082f25] text-[#c6a13a] font-bold border-l-2 border-[#c6a13a]"
                            : "text-[#a6aaa2] hover:bg-[#082f25]/50 hover:text-[#c6a13a]"
                        }
                      `}
                    >
                      <Link
                        href={section.url}
                        onClick={() => setActiveSection(section.title)}
                        data-active={isActive}
                        className="flex items-center gap-2 sidebar-label w-full"
                      >
                        <Icon size={13} strokeWidth={isActive ? 2 : 1.5} />

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
