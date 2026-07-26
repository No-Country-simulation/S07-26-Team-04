# Prototipo: PhysaFlow Stranded Capacity Index

Este es el prototipo interactivo para el reporte público de **PhysaFlow** sobre *Stranded Capacity* (capacidad varada) en centros de datos modernos. El objetivo principal es fusionar la autoridad de una publicación académica tradicional con el diseño dinámico y premium de la web moderna.

## Características de la Arquitectura

1. **Gestión de Contenido en MDX (Nativo & Dinámico):**
   - El texto y la estructura del informe están escritos enteramente en archivos MDX (`content/reporte-ES.mdx` y `content/reporte-EN.mdx`).
   - Toda la telemetría, métricas de pérdida globales, datos de gráficos y pie de figuras se definen al inicio del archivo MDX mediante un objeto JavaScript exportado (`export const metadata = { ... }`).
   - Evita la necesidad de bases de datos o archivos JSON acoplados.

2. **Flujo de Trabajo Simplificado con Git (Sin Código Duro):**
   - Para publicar nuevas ediciones del reporte, el autor simplemente crea una rama de Git, sobrescribe el archivo MDX correspondiente y realiza un Pull Request.
   - La web y sus APIs se actualizan dinámicamente sin necesidad de reescribir código en los componentes React o TypeScript.

3. **API de Descargas en Tiempo Real (CSV y BibTeX):**
   - Sirve descargas reales mediante endpoints dinámicos (`/api/reporte/csv` y `/api/reporte/bibtex`) que parsean la data directamente desde el MDX activo.

4. **Diseño Editorial Premium (Enfoque en Fondo Claro/Papel):**
   - Estilizado utilizando los colores *Forest Green* y *Gold* característicos de PhysaFlow sobre una textura de papel premium clara para emular la lectura de un documento de referencia físico y asegurar el máximo contraste y legibilidad.

## Tecnologías y Librerías Utilizadas

* **Framework Core:** [Next.js 16 (App Router)](https://nextjs.org/) con compilador de Turbopack.
* **Maquetación e Interactividad:** [React 19](https://react.dev/) y [TypeScript](https://www.typescriptlang.org/).
* **Compilación de Contenido:** [@next/mdx](https://github.com/vercel/next.js/tree/canary/packages/next-mdx) y [@mdx-js/react](https://mdxjs.com/).
* **Visualización de Datos:** [Recharts 3](https://recharts.org/) (Gráficos interactivos de barra y área).
* **Diseño y Estilos:** [Tailwind CSS v4](https://tailwindcss.com/) (con variables y tokens CSS nativos).

---

## Cómo Iniciar en Desarrollo

1. Instala las dependencias:
   ```bash
   pnpm install
   ```

2. Corre el servidor local:
   ```bash
   pnpm dev
   ```

3. Abre [http://localhost:3000](http://localhost:3000) en tu navegador.
