# Arquitectura PhysaFlow — Guía de Referencia E Inspiración

> 💡 **Nota del Prototipo:** Este documento presenta una propuesta de arquitectura desarrollada por **Hernán Casasola** a modo de garabato/propuesta visual e interactiva (`prototype/`). 
> 
> No es una guía estricta ni obligatoria de ningún tipo. Es simplemente una idea compartida entre compañeros de equipo sobre cómo se podría estructurar el proyecto, qué librerías se podrían utilizar y cómo se podría organizar la base de datos y el backlog si el equipo decide tomarlo como referencia. ¡Tienen total libertad de aportar, cambiar o rehacer cualquier parte!

---

## 1. Filosofía e Idea General

PhysaFlow se plantea como un **portal de investigación y referencia académica** sobre el fenómeno de "Stranded Capacity" (capacidad varada) en centros de datos. La idea detrás de este borrador se basa en los siguientes puntos:

* **Autoría simple en MDX:** Escribir los reportes en archivos `.mdx` utilizando **YAML Frontmatter** para los datos básicos (autor, título, métricas) y Markdown para el texto.
* **Carga de archivos en `/admin`:** Permitir que el usuario suba directamente el archivo `.mdx` sin necesidad de completar formularios gigantes.
* **Procesamiento de datos:** Extraer los datos del YAML con `gray-matter`, validarlos con **Zod** y guardarlos en una base de datos **PostgreSQL**.
* **Visualizaciones con MDX Dinámico:** Renderizar el contenido con `@mdx-js/mdx` para que los gráficos interactivos (`<Chart />`) se integren dentro del texto.
* **Asistente de IA (Opcional):** Un chatbot que lea una Ficha de Conocimiento (`aiKnowledge`) generada automáticamente al publicar el reporte, para responder preguntas de forma ultra-rápida con Gemini.

### Flujo de Datos Propuesto

```text
┌──────────────────────────────────────┐
│   1. Redacción del reporte (MDX)     │
│   (Cabecera YAML + Cuerpo MDX)       │
└──────────────────┬───────────────────┘
                   │
                   ▼
┌──────────────────────────────────────┐
│   2. Panel / Editor / Carga MDX      │
│   POST /api/reports/upload           │
└──────────────────┬───────────────────┘
                   │
                   ▼
┌──────────────────────────────────────┐
│   3. Backend (Next.js App Router)    │
│   - Validaciones con Zod             │
│   - Lectura con gray-matter          │
│   - Generación opcional aiKnowledge  │
└──────────────────┬───────────────────┘
                   │
                   ▼
┌──────────────────────────────────────┐
│   4. Base de Datos (PostgreSQL Neon) │
│   Tabla `Report` (Metadatos, JSONs   │
│   y cuerpo MDX completo)             │
└──────────────────┬───────────────────┘
                   │
                   ▼
┌──────────────────────────────────────┐
│   5. Frontend & Chatbot              │
│   - Renderizado con @mdx-js/mdx      │
│   - Chatbot opcional con Gemini      │
└──────────────────────────────────────┘
```

---

## 2. Librerías Utilizadas en el Prototipo (`prototype/`)

Si el equipo desea inspirarse en esta versión o replicarla, estas son las librerías principales que se usaron en el borrador:

* **Framework:** Next.js (App Router).
* **Base de Datos & ORM:** PostgreSQL (Neon) + Prisma ORM.
* **Parseo de MDX / YAML:** `gray-matter` (para extraer la cabecera) y `@mdx-js/mdx` (para renderizar componentes React dentro de Markdown).
* **Validación de Esquemas:** `Zod` (en `lib/report-schema.ts`).
* **Visualizaciones & Gráficos:** `Recharts` o `Shadcn Charts`.
* **Inteligencia Artificial:** SDK oficial de `@google/genai` (modelo `gemini-3.5-flash-lite`).
* **Iconos y Estilos:** `lucide-react` y Vanilla CSS / CSS Variables (estilo *Paper & Ink*).

---

## 3. Estructura de la Base de Datos (Propuesta Prisma)

Para evitar la sobre-complejidad de múltiples tablas relacionales para un reporte, la propuesta es usar una **tabla principal `Report`** apoyada en columnas `Json`:

```prisma
model Report {
  id             String   @id @default(cuid())
  slug           String   @default("")
  isPublished    Boolean  @default(true)
  
  // Metadatos Básicos
  title          String
  subtitle       String?
  author         String
  publishedDate  String   // Ej: "Octubre 2026"
  doi            String
  readingTime    String   // Ej: "~22 minutos"
  license        String   // Ej: "CC BY-SA 4.0"
  
  // Métricas Destacadas
  globalMedian   String   // Ej: "31,4%"
  lossFacilities String   // Ej: "14,8%"
  lossIT         String   // Ej: "9,7%"
  lossWorkload   String   // Ej: "6,9%"
  keyFinding     String?  
  
  // Estructuras Complejas (JSON)
  layers         Json     // Array de capas (L1, L2, L3) y sus modos de fallo
  aiKnowledge    Json?    // Ficha de conocimiento generada para la IA
  
  // Cuerpo del Texto
  content        String   // String completo en MDX para renderizado directo
  
  createdAt      DateTime @default(now())
  updatedAt      DateTime @updatedAt
}
```

---

## 4. Sugerencia de Backlog para el Equipo

Esta es una sugerencia de backlog ordenado por etapas para quien quiera organizar las tareas del proyecto:

| # | Tarea Propuesta | Descripción | Sugerencia |
|---|-----------------|-------------|------------|
| 1 | **Setup de Base de Datos** | Configurar PostgreSQL (Neon o local) e inicializar esquema Prisma. | Base |
| 2 | **Página Principal (UI)** | Maquetar la vista del reporte con fuentes, colores y estructura de lectura. | Base |
| 3 | **Visualización de Taxonomía** | Crear los componentes interactivos de las 3 capas (Facilities, IT, Workload). | Base |
| 4 | **Gráficos Interactivos** | Integrar Recharts para los gráficos de barras y líneas acumuladas. | Base |
| 5 | **Endpoint GET /api/reports** | Servir los datos del reporte desde la base de datos al frontend. | Base |
| 6 | **Ingesta de MDX (Upload)** | Endpoint POST para recibir un `.mdx`, parsear con `gray-matter` y guardar en DB. | Backend |
| 7 | **Editor Visual MDX** | Crear una pantalla en `/admin` para editar o subir borradores en tiempo real. | Frontend |
| 8 | **Integración del Chatbot** | Crear el widget flotante y conectar la API de Gemini para responder sobre el reporte. | Opcional / IA |
| 9 | **Autenticación (Login)** | Proteger la ruta `/admin` con inicio de sesión. | Opcional |