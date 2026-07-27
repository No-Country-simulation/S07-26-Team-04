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

4. **Asistente Académico de IA (Gemini):**
   - Incorpora un chat flotante y discreto en la interfaz que permite al usuario interactuar y hacer preguntas personalizadas sobre el contenido del reporte.
   - Utiliza el modelo **`gemini-3.5-flash`** alimentado dinámicamente con el contexto del archivo `.mdx` activo (en ES o EN según la selección de idioma actual del usuario).

## Tecnologías y Librerías Utilizadas

* **Framework Core:** [Next.js 16 (App Router)](https://nextjs.org/) con compilador de Turbopack.
* **Maquetación e Interactividad:** [React 19](https://react.dev/) y [TypeScript](https://www.typescriptlang.org/).
* **Compilación de Contenido:** [@next/mdx](https://github.com/vercel/next.js/tree/canary/packages/next-mdx) y [@mdx-js/react](https://mdxjs.com/).
* **SDK de IA:** [@google/genai](https://github.com/google/generative-ai-js) (SDK Oficial de Google Gen AI).
* **Renderizador Markdown:** [marked](https://github.com/markedjs/marked).
* **Visualización de Datos:** [Recharts 3](https://recharts.org/) (Gráficos interactivos de barra y área).
* **Diseño y Estilos:** [Tailwind CSS v4](https://tailwindcss.com/) (con variables y tokens CSS nativos).

---

## Cómo Configurar y Correr el Proyecto

### 1. Clave de API de Gemini
Para usar el asistente inteligente, necesitas una clave de API de Gemini:
1. Dirígete a [Google AI Studio](https://aistudio.google.com/api-keys).
2. Crea una API Key nueva o utiliza una existente.
3. Lee la documentación para comprender sus límites de uso.

### 2. Configurar Variables de Entorno
Crea un archivo `.env` en la raíz de la carpeta `prototype/` (puedes tomar como base `.env.example`):
```bash
GEMINI_API_KEY=tu_clave_de_api_aqui
```

### 3. Iniciar en Desarrollo
1. Instala las dependencias del proyecto:
   ```bash
   pnpm install
   ```

2. Ejecuta el servidor de desarrollo local:
   ```bash
   pnpm dev
   ```

3. Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

---

## Compatibilidad y Despliegue en Vercel
La lectura dinámica de archivos de texto (`fs.readFileSync`) dentro de funciones Serverless en Vercel suele presentar problemas porque el empaquetador automático no detecta archivos locales leídos de forma dinámica.

Para solucionar esto de manera definitiva y transparente en tu despliegue de Vercel:
* Implementamos un bloque estático especial de pre-empaquetado (*Node File Trace helper*) dentro del endpoint `/api/chat`.
* Este bloque de código le indica de manera explícita y literal al compilador de Vercel qué archivos (`content/reporte-ES.mdx` y `content/reporte-EN.mdx`) debe empacar dentro del contenedor de la función serverless al compilar el proyecto en la nube.
* **El despliegue en Vercel funcionará al 100% de manera nativa sin requerir configuraciones adicionales.**
