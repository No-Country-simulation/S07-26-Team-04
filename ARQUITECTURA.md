# Arquitectura PhysaFlow — Guía de Referencia E Inspiración

> 💡 **Nota del Prototipo:** Este documento presenta una propuesta de arquitectura desarrollada por **Hernán Casasola** a modo de garabato/propuesta visual e interactiva (`prototype/`). 
> 
> No es una guía estricta ni obligatoria de ningún tipo. Es simplemente una idea compartida entre compañeros de equipo sobre cómo se podría estructurar el proyecto, qué librerías se podrían utilizar, cómo armar el editor de contenidos, las historias de usuario y cómo organizar la base de datos y el backlog si el equipo decide tomarlo como referencia. ¡Tienen total libertad de aportar, cambiar o rehacer cualquier parte!

---

## 1. Filosofía e Idea General

PhysaFlow se plantea como un **portal de investigación y referencia académica** sobre el fenómeno de "Stranded Capacity" (capacidad varada) en centros de datos. La idea detrás de este borrador se basa en 3 formas flexibles de redactar y publicar reportes:

1. **Vía Archivo `.mdx` Externo (Upload):** El investigador redacta el archivo en su propio editor (VS Code, Obsidian, etc.) y lo sube directamente en el panel sin llenar formularios extensos.
2. **Descarga de Plantilla:** El usuario puede descargar una plantilla base en MDX para editarla localmente en cualquier lugar y subirla más tarde.
3. **Editor Visual MDX Integrado en Vivo (`components/MdxEditor.tsx`):** Un editor integrado en la web `/admin` donde el usuario puede:
   - Cargar la plantilla por defecto.
   - Subir un `.mdx` existente y cargarlo directo al editor.
   - Editar el texto y ver la previsualización interactiva en tiempo real.
   - Guardar como **Borrador** (`isPublished: false`) o **Publicar** (`isPublished: true`).

---

## 2. Historias de Usuario (User Stories)

Para dar contexto a la experiencia que busca resolver el prototipo:

### 👤 HU-01: Carga y Edición Flexible de Reportes (Investigador / Autor)
> **Como** investigador o autor de reportes académicos,  
> **Quiero** poder escribir mis reportes subiendo un archivo `.mdx`, editando en línea mediante el editor visual o descargando una plantilla base,  
> **Para** trabajar cómodamente en mi entorno preferido o directamente desde el navegador sin depender de formularios rígidos.
>
> **Criterios de Aceptación:**
> - Puedo descargar la plantilla MDX oficial con un solo clic.
> - Puedo arrastrar o seleccionar un archivo `.mdx` de mi equipo y ver su contenido cargado en el editor.
> - El editor visual me permite modificar el texto en vivo y alternar con la previsualización.
> - Puedo guardar mi trabajo como **Borrador** (sin notificar a la IA) o **Publicar** inmediatamente.

---

### 👤 HU-02: Consulta Interactivas y Lectura Clara (Lector Académico)
> **Como** profesional de datacenters o estudiante universitario,  
> **Quiero** explorar las tres capas físicas (Facilities, IT, Workload) y ver gráficos estadísticos claros,  
> **Para** entender el impacto del 31,4% de capacidad varada y citar el informe en formatos APA/BibTeX.
>
> **Criterios de Aceptación:**
> - La barra lateral genera un índice de lectura dinámico según las secciones del reporte.
> - Los componentes de la taxonomía (9 modos de fallo) son interactivos y expandibles.
> - Se ofrece un botón simple para copiar la cita académica oficial.

---

### 👤 HU-03: Asistente IA Instantáneo (Lector / Investigador)
> **Como** visitante del sitio,  
> **Quiero** hacerle preguntas directas al chatbot sobre los datos y gráficos del reporte,  
> **Para** obtener aclaraciones inmediatas sin necesidad de leer las 22 páginas completas.
>
> **Criterios de Aceptación:**
> - El chatbot responde de forma instantánea usando respuestas estructuradas en negrita.
> - Si el reporte está publicado, el bot conoce las tendencias y gráficos de la investigación (`aiKnowledge`).
> - Si el reporte está en borrador, el bot responde de forma segura utilizando el fallback básico sin fallar.

---

## 3. Librerías Utilizadas en el Prototipo (`prototype/`)

Si el equipo desea inspirarse en esta versión o replicarla, estas son las librerías principales que se usaron en el borrador:

* **Framework:** Next.js (App Router).
* **Base de Datos & ORM:** PostgreSQL (Neon) + Prisma ORM.
* **Editor Visual MDX:** Componente `MdxEditor.tsx` con soporte de previsualización en vivo.
* **Parseo de MDX / YAML:** `gray-matter` (para extraer la cabecera YAML) y `@mdx-js/mdx` (para renderizar componentes React dentro de Markdown).
* **Validación de Esquemas:** `Zod` (en `lib/report-schema.ts`).
* **Visualizaciones & Gráficos:** `Recharts` (integrados en el componente `<Chart />`).
* **Inteligencia Artificial:** SDK oficial de `@google/genai` (modelo `gemini-3.5-flash-lite`).
* **Estilos:** Vanilla CSS / CSS Variables (estilo *Paper & Ink* verde bosque y oro).

---

## 4. Estructura de la Base de Datos (Propuesta Prisma)

Para evitar la sobre-complejidad de múltiples tablas relacionales para un reporte, la propuesta es usar una **tabla principal `Report`** apoyada en columnas `Json`:

```prisma
model Report {
  id             String   @id @default(cuid())
  slug           String   @default("")
  isPublished    Boolean  @default(true)
  
  // Metadatos Básicos (YAML Frontmatter)
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
  aiKnowledge    Json?    // Ficha de conocimiento auto-generada para la IA
  
  // Cuerpo del Texto
  content        String   // String completo en MDX para renderizado directo
  
  createdAt      DateTime @default(now())
  updatedAt      DateTime @updatedAt
}
```

---

## 5. Sugerencia de Backlog para el Equipo

Esta es una sugerencia de backlog ordenado por etapas para quien quiera organizar las tareas del proyecto:

| # | Tarea Propuesta | Descripción | Sugerencia |
|---|-----------------|-------------|------------|
| 1 | **Setup de Base de Datos** | Configurar PostgreSQL (Neon o local) e inicializar esquema Prisma. | Base |
| 2 | **Página Principal (UI)** | Maquetar la vista del reporte con fuentes, colores y estructura de lectura. | Base |
| 3 | **Visualización de Taxonomía** | Crear los componentes interactivos de las 3 capas (Facilities, IT, Workload). | Base |
| 4 | **Gráficos Interactivos** | Integrar Recharts para los gráficos de barras y líneas acumuladas (`<Chart />`). | Base |
| 5 | **Endpoint GET /api/reports** | Servir los datos del reporte desde la base de datos al frontend. | Base |
| 6 | **Ingesta y Parseo MDX** | Endpoint POST para recibir un `.mdx`, parsear con `gray-matter` y guardar en DB. | Backend |
| 7 | **Editor Visual MDX (`/admin`)** | Crear el editor visual en vivo con descarga de plantilla, carga `.mdx` y guardado borrador/publicado. | Frontend |
| 8 | **Auto-Generación `aiKnowledge`** | Sintetizar datos y gráficos con Gemini al publicar para el asistente de IA. | Backend / IA |
| 9 | **Integración del Chatbot** | Crear el widget flotante con `gemini-3.5-flash-lite` consumiendo `aiKnowledge`. | Frontend / IA |
| 10| **Autenticación (Login)** | Proteger la ruta `/admin` con inicio de sesión. | Opcional |