import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Genera un slug de ancla consistente a partir de un título o encabezado:
 * minúsculas, sin acentos, solo caracteres alfanuméricos, guiones y espacios
 * convertidos en "-". Es la única fuente de verdad para los ids de sección
 * (contenido, TOC y footer deben coincidir).
 */
export function slugify(value: string): string {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-");
}
