import Link from "next/link";

import { Download } from "lucide-react";

import { Button } from "@/components/ui/button";

const navigation = [
  {
    label: "Resumen Ejecutivo",
    href: "#resumen",
  },
  {
    label: "Taxonomía",
    href: "#taxonomia",
  },
  {
    label: "Metodología",
    href: "#metodologia",
  },
  {
    label: "Figuras",
    href: "#figuras",
  },
  {
    label: "Citar",
    href: "#citar",
  },
];

export function Header() {
  return (
    <header className="fixed left-0 right-0 top-0 z-50 h-[46px] border-b border-[#c6a13a]/15 bg-[#0d0e0b]">
      <div className="flex h-full items-center px-7">
        {/* Logo */}

        <Link
          href="/"
          className="
            text-[13px]
            font-bold
            tracking-[-0.05em]
            text-[#c6a13a]
          "
        >
          PhysaFlow
        </Link>

        {/* Navigation */}

        <nav className="ml-auto mr-6 flex items-center gap-5">
          {navigation.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="
                font-sans
                text-12px]
                text-[#d7d8d1]
                transition-colors
                hover:text-[#c6a13a]
              "
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* PDF */}

        <Button
          size="sm"
          className="
            h-6
            rounded-none
            bg-[#c6a13a]
            p-4
            text-[13px]
            uppercase
            tracking-[0.12em]
            text-[#061f18]
            hover:bg-[#d6b94e]
          "
        >
          <Download size={11} />
          Descargar informe
        </Button>
      </div>
    </header>
  );
}
