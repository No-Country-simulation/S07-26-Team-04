# Arquitectura PhysaFlow — Documento de Referencia del Equipo

> **Propósito:** Este documento describe la arquitectura técnica del proyecto, detallando cómo se estructura el código en la carpeta `frontend/`, la comunicación fullstack mediante Next.js App Router, y el flujo de ingesta de datos mediante el cual un archivo MDX se parsea y almacena automáticamente en una base de datos PostgreSQL.
>
> ⚠️ **Nota sobre el diseño:** El prototipo ubicado en `prototype/` es una referencia visual a grandes rasgos. No es una guía estricta de código. El equipo de frontend y backend tiene total libertad para definir la estética final, la estructura de componentes y el flujo óptimo del código, manteniendo como objetivo principal la "autoridad académica".

---

## 1. Filosofía General

PhysaFlow es un **portal de referencia académica** enfocado en el fenómeno de "Stranded Capacity" (capacidad varada) en centros de datos modernos. La arquitectura del proyecto se basa en los siguientes pilares:

* **Autoría basada en MDX:** El contenido principal, las métricas y las estructuras de datos del reporte se redactan en un archivo `.mdx` utilizando **YAML Frontmatter** para los metadatos y Markdown estándar para el cuerpo del texto.
* **Ingesta sin fricción:** Un administrador (el autor del reporte) sube el archivo `.mdx` directamente a través de un panel de administración (Dashboard), evitando el uso de formularios web complejos.
* **Procesamiento Backend:** El backend recibe el archivo, utiliza `gray-matter` para separar el frontmatter del cuerpo de texto, y vuelca estos datos de forma estructurada en PostgreSQL.
* **Alcance idiomático:** El sitio web está exclusivamente en Español, lo que simplifica la lógica de traducción y el modelado de la base de datos.

### Flujo de Datos Arquitectónico

```text
┌──────────────────────────────────────┐
│   1. Autor redacta el reporte (MDX)  │
│   (Cabecera YAML + Cuerpo Markdown)  │
└──────────────────┬───────────────────┘
                   │
                   ▼
┌──────────────────────────────────────┐
│   2. Dashboard (Subir Archivo .mdx)  │
│   POST /api/reporte/upload           │
└──────────────────┬───────────────────┘
                   │
                   ▼
┌──────────────────────────────────────┐
│   3. Backend (Next.js API Route)     │
│   - Lee el archivo cargado           │
│   - Parsea con `gray-matter`         │
│   - Mapea a esquema Prisma           │
└──────────────────┬───────────────────┘
                   │
                   ▼
┌──────────────────────────────────────┐
│   4. Base de Datos (PostgreSQL)      │
│   Tabla `Reporte` (Metadatos, JSONs, │
│   y cuerpo de texto como String)     │
└──────────────────┬───────────────────┘
                   │
                   ▼
┌──────────────────────────────────────┐
│   5. Frontend (React Server Comp.)   │
│   Consulta la DB y renderiza la UI   │
│   con `react-markdown` y Recharts    │
└──────────────────────────────────────┘
```

---

## 2. Estructura del Proyecto

Toda la aplicación fullstack reside en la carpeta `frontend/`.

```text
/
├── frontend/                   ← Aplicación Fullstack (Next.js)
│   ├── app/
│   │   ├── page.tsx            ← Página principal del reporte (consume la DB)
│   │   ├── layout.tsx          ← Layout global
│   │   ├── login/
│   │   │   └── page.tsx        ← (Opcional) Pantalla de login
│   │   ├── admin/
│   │   │   └── page.tsx        ← Dashboard para subir archivos MDX (Protegido)
│   │   └── api/                ← API Routes (Route Handlers)
│   │       ├── reporte/
│   │       │   ├── route.ts            ← GET: Devuelve el reporte activo
│   │       │   ├── upload/route.ts     ← POST: Ingesta de MDX y guardado en DB
│   │       │   └── citacion/route.ts   ← GET: Generación de formatos BibTeX / APA
│   │       └── health/route.ts         ← GET: Health check del servicio
│   ├── components/
│   │   ├── ui/                 ← Componentes base (shadcn/ui)
│   │   ├── DiagramaCapas.tsx   ← Taxonomía visual interactiva
│   │   ├── GraficoBarras.tsx   ← Gráfico de barras (Recharts)
│   │   ├── GraficoLinea.tsx    ← Gráfico acumulado (Recharts)
│   │   └── StepCard.tsx        ← Tarjetas de metodología
│   ├── lib/
│   │   ├── prisma.ts           ← Cliente Prisma singleton
│   │   └── utils.ts            ← Utilidades generales
│   ├── prisma/
│   │   └── schema.prisma       ← Esquema de la base de datos
│   ├── package.json
│   └── next.config.ts
│
├── prototype/                  ← Prototipo interactivo (referencia visual)
├── ejemplo-reporte.mdx         ← Plantilla guía para el autor
└── ARQUITECTURA.md             ← Este documento
```

---

## 3. Base de Datos — Schema Prisma

Para mantener la agilidad y evitar la complejidad de un modelo relacional tradicional (múltiples tablas, claves foráneas y migraciones frágiles), **se ha diseñado un esquema de tabla única apoyándose en campos `Json` nativos de PostgreSQL**. 

Esto permite que la ingesta de datos desde el YAML sea una operación atómica, directa y libre de transacciones complejas.

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model Reporte {
  id             String   @id @default(cuid())
  
  // Metadatos Básicos (Extraídos del Frontmatter)
  titulo         String
  subtitulo      String?
  autor          String
  published      String   // Ej: "Octubre 2025"
  doi            String
  readingTime    String   // Ej: "~22 minutos"
  license        String   // Ej: "CC BY-SA 4.0"
  
  // Métricas de Impacto Global
  medianaGlobal  String   // Ej: "31,4%"
  lossFacilities String   // Ej: "14,8%"
  lossIT         String   // Ej: "9,7%"
  lossWorkload   String   // Ej: "6,9%"
  
  // Estructuras Complejas y UI Labels (Almacenadas como JSON nativo)
  labels         Json?    // Textos y captions configurables de UI
  layers         Json     // Array de capas y sus modos de fallo (tarjetas)
  methodologySteps Json?  // Pasos de metodología (StepCards)
  taxonomyData   Json     // Puntos de datos para el gráfico de barras
  cumulativeData Json     // Puntos de datos para el gráfico acumulado
  
  // Cuerpo del Reporte
  contenido      String   // String completo en Markdown para renderizado directo
  
  createdAt      DateTime @default(now())
  updatedAt      DateTime @updatedAt
}
```

---

## 4. Endpoints de API

### `POST /api/reporte/upload`
* **Acción:** Recibe un archivo `.mdx`, lo parsea, valida con Zod y actualiza o crea el reporte en la base de datos.
* **Procesamiento en Backend:**
  1. Recepción del archivo mediante `FormData`.
  2. Lectura del contenido como `String`.
  3. Parseo con `gray-matter` para separar metadatos (`data`) y texto (`content`):
     ```javascript
     const { data, content } = matter(fileContent);
     ```
  4. **Validación con Zod:** Verificar que `data` cumpla con los campos obligatorios y tipos requeridos antes de la inserción para prevenir errores en la UI.
  5. Inserción o actualización en la tabla `Reporte` mediante `upsert`:
     ```javascript
     await prisma.reporte.upsert({
       where: { id: "global-report" }, // O lógica de año
       update: {
         titulo: data.title,
         autor: data.author,
         published: data.published,
         doi: data.doi,
         readingTime: data.readingTime,
         license: data.license,
         medianaGlobal: data.medianaGlobal,
         lossFacilities: data.lossFacilities,
         lossIT: data.lossIT,
         lossWorkload: data.lossWorkload,
         labels: data.labels,
         layers: data.layers,
         methodologySteps: data.methodologySteps,
         taxonomyData: data.taxonomyData,
         cumulativeData: data.cumulativeData,
         contenido: content,
       },
       create: {
         titulo: data.title,
         autor: data.author,
         published: data.published,
         doi: data.doi,
         readingTime: data.readingTime,
         license: data.license,
         medianaGlobal: data.medianaGlobal,
         lossFacilities: data.lossFacilities,
         lossIT: data.lossIT,
         lossWorkload: data.lossWorkload,
         labels: data.labels,
         layers: data.layers,
         methodologySteps: data.methodologySteps,
         taxonomyData: data.taxonomyData,
         cumulativeData: data.cumulativeData,
         contenido: content,
       }
     });
     ```
  6. Respuesta exitosa: `{ success: true }`.

### `GET /api/reporte`
* **Acción:** Devuelve el reporte activo (idealmente el más reciente según `createdAt` o un identificador estático).
* **Respuesta:** Objeto JSON estructurado con metadatos, los arrays JSON para gráficos y el campo `contenido` (texto Markdown).

---

## 5. Responsabilidades por Rol

### Tech Lead (Hernán)
1. Definir y aprobar el esquema final de base de datos y estructura de carpetas.
2. Revisar y aprobar Pull Requests, asegurando buenas prácticas.
3. Coordinar la integración entre los equipos de frontend y backend.

### Backend (Alexis, Orlando, Gabriela)
1. Configurar la instancia de PostgreSQL e inicializar el esquema Prisma (tabla única `Reporte`).
2. Desarrollar el endpoint `GET /api/reporte` para retornar el reporte activo.
3. Implementar la lógica del endpoint `POST /api/reporte/upload` utilizando `gray-matter` para la ingesta de archivos `.mdx` y **Zod** para la validación de la estructura del YAML.
4. **(Opcional):** Desarrollar el endpoint `POST /api/chat` utilizando el SDK `@google/genai` (modelo `gemini-3.5-flash`) para un asistente académico con streaming y *Context Caching*.
5. **(Opcional):** Implementar autenticación básica (NextAuth o middleware) para proteger el panel `/admin`.

### Frontend (Elias, Erika, Sergio)
1. **Página Principal (Prioridad Máxima):** Diseñar la maquetación premium, tipografía y UI del reporte (`app/page.tsx`), incluyendo un Hero Header y una barra lateral de navegación (Sidebar) que se genere dinámicamente a partir de los títulos (`##`) del Markdown.
2. **Visualización de Datos:** Implementar gráficos interactivos con Recharts (`GraficoBarras`, `GraficoLinea`) alimentados por los JSON de la DB. Desarrollar la taxonomía interactiva (`DiagramaCapas` y `StepCard`).
3. **Renderizado de Contenido:** Consumir la API y renderizar el campo `contenido` (String Markdown) utilizando la librería `react-markdown` configurada con soporte para etiquetas JSX directas (`<DiagramaCapas />`, `<StepCards />`, `<GraficosDesperdicio />`, `<CitationBlock />`).
4. **Dashboard (Prioridad Secundaria):** Construir una interfaz simple en `/admin` con un formulario de arrastrar y soltar (drag & drop) para la carga del archivo `.mdx`.
5. **(Opcional):** Desarrollar la interfaz flotante del `ChatAyudante` con manejo de respuestas en streaming.
6. **(Opcional):** Implementar la pantalla de Inicio de Sesión y protección de rutas.

### QA (Andrés)
1. Validar la fidelidad visual, la interactividad de los componentes y el diseño responsive (móvil/escritorio).
2. Ejecutar pruebas E2E del flujo de actualización: subir un `.mdx` de prueba y verificar el reflejo inmediato en la página principal.
3. *(Opcional)* Probar la latencia y coherencia del asistente de IA.

---

## 6. Backlog Priorizado

| # | Tarea | Responsable | Estimación | Prioridad |
|---|-------|-------------|------------|-----------|
| 1 | Setup Prisma + PostgreSQL (Esquema de tabla única) | Backend | 1 día | Alta |
| 2 | Maquetación y diseño visual de la Página Principal con datos mock | Frontend | 2 días | Alta |
| 3 | Desarrollo de Sidebar dinámica y componentes de tarjetas (`DiagramaCapas`, `StepCard`) | Frontend | 2 días | Alta |
| 4 | Implementación de gráficos interactivos con Recharts | Frontend | 2 días | Alta |
| 5 | Endpoint `GET /api/reporte` (Servir datos desde DB) | Backend | 1 día | Alta |
| 6 | Integración Frontend-API y renderizado con `react-markdown` | Frontend | 1 día | Alta |
| 7 | Endpoint `POST /api/reporte/upload` (Parseo con `gray-matter`) | Backend | 2 días | Media |
| 8 | UI del Dashboard para carga de archivos `.mdx` | Frontend | 1 día | Media |
| 9 | Pruebas de compatibilidad responsive y accesibilidad | QA | 1 día | Media |
| 10 | Pruebas del flujo completo de carga y actualización | QA | 1 día | Media |
| 11 | **(Opcional)** API del Asistente de IA (`POST /api/chat`) | Backend | 1 día | Baja |
| 12 | **(Opcional)** Interfaz flotante de Chat en streaming | Frontend | 1 día | Baja |
| 13 | **(Opcional)** Pantalla de Login y protección de rutas | Fullstack | 1 día | Baja |
```