"use client";

import { useState, useEffect } from "react";

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

import { Highlight, HighlightItem } from "@/components/animate-ui/primitives/effects/highlight";

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
    const handleScroll = () => {
      const isAtBottom =
        window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 80;

      if (isAtBottom) {
        setActiveSection("07 - CITAR");
        return;
      }

      let currentSection = sections[0].title;
      let minDistance = Infinity;

      sections.forEach((section) => {
        const id = section.url.replace("#", "");
        const el = document.getElementById(id);
        if (el) {
          const rect = el.getBoundingClientRect();
          const distance = Math.abs(rect.top - 140);
          if (rect.top <= 380 && distance < minDistance) {
            minDistance = distance;
            currentSection = section.title;
          }
        }
      });

      setActiveSection(currentSection);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <Sidebar collapsible="none" className="report-sidebar border-r-0 no-print">
      {/* Header del Sidebar */}
      <div className="px-3 py-4">
        <p className="text-[12px] uppercase tracking-[0.18em] text-[#c6a13a]">
          Secciones del reporte
        </p>
      </div>

      {/* Contenido con microanimación Highlight de animate-ui */}
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="sr-only">Secciones</SidebarGroupLabel>

          <SidebarGroupContent>
            <Highlight
              className="bg-[#082f25] rounded-md shadow-sm border border-[#c6a13a]/20"
              hover
            >
              <SidebarMenu>
                {sections.map((section) => {
                  const Icon = section.icon;
                  const isActive = activeSection === section.title;

                  return (
                    <SidebarMenuItem key={section.title}>
                      <HighlightItem value={section.title}>
                        <SidebarMenuButton
                          className={`
                            h-auto
                            min-h-9
                            rounded-md
                            px-3
                            py-2
                            text-[7px]
                            uppercase
                            tracking-[0.04em]
                            transition-colors
                            bg-transparent
                            hover:bg-[#082f25]
                            ${
                              isActive
                                ? "text-[#c6a13a] font-bold"
                                : "text-[#a6aaa2] hover:text-[#c6a13a]"
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
                      </HighlightItem>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </Highlight>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
