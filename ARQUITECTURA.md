# Arquitectura PhysaFlow — Guía de Referencia E Inspiración

> 💡 **Nota del Prototipo:** Este documento presenta una propuesta de arquitectura desarrollada por **Hernán Casasola** a modo de borrador/propuesta visual e interactiva en la carpeta `prototype/`. 
> 
> No es una guía estricta ni obligatoria. Es una idea compartida entre compañeros de equipo sobre cómo está diseñado el flujo exacto del panel de administración (`/admin`), la gestión de borradores/publicaciones, el editor visual de plantillas MDX, las etiquetas personalizadas de gráficos y la integración con el Chatbot IA. ¡Tienen total libertad de tomar estas ideas, modificarlas o proponer mejoras!

---

## 1. Flujo de Trabajo del Autor / Administrador en `/admin`

El panel de administración (`/admin`) está organizado en secciones claras (**Reportes Publicados**, **Borradores**, **Editor MDX**, **Cargar / Descargar Plantilla**, **Guía del Usuario**). 

El flujo de trabajo soporta 2 caminos principales de autoría:

### 📄 Camino A: Redacción Externa con Plantilla Oficial
1. **Descarga de Plantilla:** El usuario hace clic en "Descargar Plantilla MDX" en `/admin` y obtiene el archivo base con la estructura de etiquetas y métricas aceptada por el sistema (`plantilla-reporte-physaflow.mdx`).
2. **Edición Local:** Redacta el reporte en cualquier editor de su preferencia (VS Code, Obsidian, Typora, Notepad++, etc.).
3. **Subida (Upload):** Sube el archivo `.mdx` al sistema y **elige si guardarlo como Borrador (`isPublished: false`) o Publicarlo directamente (`isPublished: true`)**.
4. **Edición Posterior de Borradores:** Si lo subió como Borrador, este aparece en la sección **"Borradores"**. Desde allí puede abrirlo dentro de nuestro **Editor MDX Web**, retocar el contenido, volver a guardarlo como borrador o publicarlo definitivamente.

### ✍️ Camino B: Creación Directa desde el Editor MDX Web
1. **Nuevo Reporte:** Al presionar "Nuevo Reporte" en `/admin`, el sistema **NO abre un editor en blanco**.
2. **Carga Automática de Plantilla:** Se carga automáticamente la plantilla oficial estructurada en el editor web (`components/MdxEditor.tsx`) para asegurar que mantenga el formato correcto y las etiquetas requeridas por PhysaFlow.
3. **Asignación de ID y Borrador:** Al hacer el primer guardado, la base de datos le asigna un ID único (cuid) y queda guardado como **Borrador**, permitiéndole seguir trabajando más tarde hasta que decida **Publicar**.

---

## 2. Componentes Gráficos y Etiquetas Personalizadas

Para que los gráficos estadísticos se rendericen correctamente tanto en el reporte web como para la IA, PhysaFlow utiliza **etiquetas React/MDX compuestas propias**:

* **Sintaxis de Gráfico en MDX:**
  ```mdx
  <Chart 
    type="line" 
    title="Capacidad varada acumulada 2020-2026" 
    caption="Evolución histórica y proyección"
    data='[{"year":"2020","value":3.0},{"year":"2026","value":38.0}]' 
  />
  ```
* **Tipos de Gráficos Soportados (`Recharts`):**
  - `type="bar"`: Gráfico de barras por modo de fallo.
  - `type="line"`: Gráfico de línea temporal de desperdicio acumulado.
  - `type="pie"`: Gráfico circular de distribución por capas.
* **Descarga de Gráficos:** Desde la vista del reporte, los lectores pueden descargar las imágenes/datos de los gráficos para sus propias citas.
* **Asistente de IA (Chatbot):** En la página principal, el `ChatAyudante` (basado en `gemini-3.5-flash-lite`) consume directamente la ficha `aiKnowledge` que procesa estas etiquetas `<Chart />` al publicar, logrando respuestas instantáneas y precisas sobre los gráficos.

---

## 3. Historias de Usuario (User Stories)

### 👤 HU-01: Gestión Flexible de Reportes (Investigador / Autor)
> **Como** autor o investigador de reportes,  
> **Quiero** descargar la plantilla MDX oficial, editar localmente o usar el editor web con plantilla precargada,  
> **Para** publicar reportes directos o guardarlos como borradores con ID asignado sin romper el formato visual del sitio.
>
> **Criterios de Aceptación:**
> - Puedo descargar el archivo `plantilla-reporte-physaflow.mdx` desde `/admin`.
> - Al subir un `.mdx`, puedo elegir si va a **Borrador** o **Publicado**.
> - En la pestaña **Borradores**, puedo abrir cualquier reporte guardado en el Editor MDX.
> - Al presionar "Nuevo Reporte", se carga el editor preseteado con la plantilla base (no un lienzo en blanco).
> - Se asigna un ID automático al guardar un borrador por primera vez.

---

### 👤 HU-02: Lectura Interactiva y Descarga de Gráficos (Lector Académico)
> **Como** profesional de infraestructura o estudiante,  
> **Quiero** explorar las capas físicas (L1, L2, L3) y descargar los gráficos del reporte,  
> **Para** reutilizar los datos y citar el informe en formato APA o BibTeX.
>
> **Criterios de Aceptación:**
> - Puedo visualizar las 3 capas en la taxonomía interactiva.
> - Puedo interactuar y descargar los gráficos `<Chart />` directamente desde la página.
> - Puedo copiar el bloque de cita académica estandarizada.

---

### 👤 HU-03: Chatbot Conversacional sobre Métricas y Gráficos (Visitante)
> **Como** visitante del portal,  
> **Quiero** consultar al chatbot flotante de la página principal sobre tendencias y datos de los gráficos,  
> **Para** obtener explicaciones rápidas sintetizadas por la IA sin demoras.
>
> **Criterios de Aceptación:**
> - El chatbot responde de forma instantánea usando `gemini-3.5-flash-lite`.
> - Entiende las etiquetas `<Chart />` y responde en negritas destacando porcentajes y nombres de fallos.
> - Si el reporte consultado está en borrador, responde de forma segura utilizando el fallback básico sin fallar.

---

## 4. Librerías e Infraestructura del Prototipo (`prototype/`)

* **Framework:** Next.js 16 (App Router).
* **Base de Datos & ORM:** PostgreSQL en Neon + Prisma ORM.
* **Editor MDX Web:** `components/MdxEditor.tsx` (Previsualización en vivo, guardado borrador/publicado).
* **Parseo de MDX / YAML:** `gray-matter` (para el Frontmatter) y `@mdx-js/mdx` (compilación dinámica de React + MDX).
* **Validación de Esquemas:** `Zod` (`lib/report-schema.ts`).
* **Gráficos:** `Recharts` envueltos en la etiqueta `<Chart />`.
* **IA:** `@google/genai` con `gemini-3.5-flash-lite`.
* **Diseño:** Vanilla CSS / CSS Variables (*Paper & Ink* verde bosque `#0d2818` y oro `#c9a961`).

---

## 5. Esquema de Base de Datos — Model Prisma

```prisma
model Report {
  id             String   @id @default(cuid())
  slug           String   @default("")
  isPublished    Boolean  @default(true) // false = Borrador, true = Publicado
  
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
  layers         Json     // Array de capas (L1, L2, L3) y sus 9 modos de fallo
  aiKnowledge    Json?    // Ficha de conocimiento auto-generada para la IA
  
  // Cuerpo del Texto
  content        String   // String completo en MDX (con componentes <Chart />)
  
  createdAt      DateTime @default(now())
  updatedAt      DateTime @updatedAt
}
```

---

## 6. Sugerencia de Backlog para el Equipo

| # | Tarea Propuesta | Descripción | Sugerencia |
|---|-----------------|-------------|------------|
| 1 | **Setup de Base de Datos** | Configurar PostgreSQL (Neon) e inicializar esquema Prisma `Report`. | Base |
| 2 | **Página Principal (UI)** | Maquetar la vista del reporte con fuentes editoriales y estructura de lectura. | Base |
| 3 | **Visualización de Taxonomía** | Componentes interactivos para las 3 capas (Facilities, IT, Workload). | Base |
| 4 | **Etiqueta `<Chart />` & Recharts** | Implementar la etiqueta personalizada `<Chart />` y descarga de gráficos. | Base |
| 5 | **Endpoint GET /api/reports** | Servir los datos del reporte desde la base de datos al frontend. | Base |
| 6 | **Sección `/admin` & Plantilla MDX** | Crear el panel con lista de Publicados/Borradores y botón para descargar plantilla. | Frontend |
| 7 | **Editor Visual MDX** | Editor web con plantilla precargada al crear nuevo reporte y apertura de borradores. | Frontend |
| 8 | **Ingesta & Publicación MDX** | POST /api/reports/upload parseando con `gray-matter` y asignando ID en borrador/publicado. | Backend |
| 9 | **Auto-Generación `aiKnowledge`** | Sintetizar datos y gráficos `<Chart />` con Gemini al publicar para la IA. | Backend / IA |
| 10| **Chatbot Flotante con Gemini** | Widget de chat en la página principal con `gemini-3.5-flash-lite` consumiendo `aiKnowledge`. | Frontend / IA |
| 11| **Autenticación (Login)** | Proteger el acceso al panel `/admin`. | Opcional |