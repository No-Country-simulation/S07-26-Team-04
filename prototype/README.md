# PhysaFlow — Stranded Capacity Index

> Plataforma de publicación interactiva del reporte científico **PhysaFlow**: una taxonomía nominal de *capacidad varada* (stranded capacity) en centros de datos modernos, organizada en tres capas físicas — instalaciones (facilities), TI y carga de trabajo (workload).

Este prototipo fusiona la autoridad de una publicación académica con el dinamismo de la web moderna: el contenido se gestiona como **MDX con YAML Frontmatter**, se valida y persiste en **PostgreSQL** (Neon) mediante **Prisma**, se publica desde un **panel de administración** protegido con **Better Auth**, y se enriquece con un **asistente de IA (Gemini)** que responde en streaming sobre el conocimiento del reporte.

---

## Tabla de Contenidos

- [Visión General](#visión-general)
- [Características](#características)
- [Arquitectura](#arquitectura)
- [Stack Tecnológico](#stack-tecnológico)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [Sistema de Diseño](#sistema-de-diseño)
- [Requisitos Previos](#requisitos-previos)
- [Configuración](#configuración)
- [Ejecución](#ejecución)
- [Base de Datos](#base-de-datos)
- [Autoría de Contenido (MDX)](#autoría-de-contenido-mdx)
- [Referencia de API](#referencia-de-api)
- [Seguridad y Autenticación](#seguridad-y-autenticación)
- [Despliegue en Vercel](#despliegue-en-vercel)
- [Consideraciones Técnicas](#consideraciones-técnicas)

---

## Visión General

El sitio público presenta **el reporte más recientemente actualizado** entre los publicados. Cada edición es un documento de referencia de la industria: portada editorial, índice de contenidos (TOC), diagrama interactivo de las tres capas, gráficos de datos (barras, líneas y torta), citas formales y descargas académicas.

Detrás de la escena, un **CMS de administración** permite al equipo editorial:

- Crear, editar, publicar y despublicar reportes.
- Escribir el reporte en **MDX** con resaltado de sintaxis y **vista previa en vivo**.
- Subir archivos `.mdx`/`.md` por *drag & drop* o selección.
- Descargar la plantilla oficial del reporte.
- Gestionar publicados y borradores con **búsqueda** y **paginación servidor** de 3 registros por página.

## Características

### Sitio Público

| Característica | Detalle |
|---|---|
| **Render dinámico** | El reporte activo se lee desde PostgreSQL y se renderiza como Server Component. |
| **Índice de contenidos (TOC)** | Extraído de los encabezados `##` del cuerpo MDX; incluye las subcapas interactivas de la taxonomía. |
| **Diagrama de capas** | Componente interactivo `<DiagramaCapas />` con las 3 capas y sus modos de fallo. |
| **Gráficos interactivos** | `<Chart type="bar|line|pie" />` basado en **Recharts**; descarga de figuras SVG. |
| **Citas formales** | Bloque `<CitationBlock />` con DOI, BibTeX y texto de cita copiable. |
| **Descargas** | CSV de la taxonomía (`/api/reporte/csv`) y cita BibTeX (`/api/reporte/bibtex`). |
| **Impresión** | Vista optimizada para imprimir/PDF desde el navbar. |
| **Asistente de IA** | Chat flotante con respuestas **streaming** y contexto por reporte. |

### Panel de Administración (`/admin`)

| Área | Descripción |
|---|---|
| **Dashboard** | Métricas de publicación, reporte activo y acciones rápidas. |
| **Reportes / Borradores** | Listado paginado (servidor, 3 por página) con buscador, toggle de publicación y borrado. |
| **Subir MDX** | Ingesta por archivo con selección de estado (publicar o borrador) y modo sobrescritura. |
| **Plantillas & Guías** | Descarga de la plantilla oficial y documentación de campos YAML y componentes. |
| **Editor MDX** | Editor CodeMirror con modo doble panel/código/preview, detección de errores de sintaxis en `data` de `<Chart />` y guardado/publicación. |

### Motor de IA

- **Ficha de conocimiento (`aiKnowledge`)**: al publicar un reporte se genera una estructura JSON con metadatos, impacto global, resumen de capas, interpretación de cada gráfico y resumen ejecutivo (`lib/generate-ai-knowledge.ts`).
- **Asistente en streaming**: `/api/chat` consume la ficha `aiKnowledge` (con *fallback* a los datos del reporte) e instrucciones de sistema para respuestas breves, académicas y formateadas en negritas. Modelo: `gemini-3.5-flash-lite`.

## Arquitectura

### Flujo de Contenido

```
Plantilla / Archivo .mdx  →  gray-matter (parsea YAML Frontmatter)
        ↓
Esquema Zod (lib/report-schema.ts) — validación en runtime
        ↓
Prisma Report (PostgreSQL / Neon) — columnas tipadas + campos JSON nativos
        ↓
Server Components (/ y /reports/[id]) — renderizado público
        ↓
/ api/chat — ficha aiKnowledge + Gemini en streaming
```

### Modelo de Datos

Un modelo único `Report` (`prisma/schema.prisma`) almacena metadatos tipados (título, autor, DOI, métricas), estructuras complejas como **JSON nativo** (`layers`, `aiKnowledge`) y el cuerpo completo en `content` (String Markdown/MDX). Los modelos `User`, `Session`, `Account` y `Verification` provienen de **Better Auth**.

### Server vs Client Components

- **Páginas por defecto** son Server Components y consultan la base directamente con Prisma.
- `'use client'` se limita a los componentes interactivos: editor MDX, gráficos, chat, panel de admin y maquetación del reporte.

### Autenticación

- **Better Auth** con `emailAndPassword` (server-side, `lib/auth.ts`).
- `lib/session.ts` (`getAdminSession`) valida la cookie de sesión en **cada** ruta de administración; el redirect de `/admin` es solo UX.
- `ADMIN_EMAIL` / `ADMIN_PASSWORD` se referencian en el seed para el superusuario inicial.

## Stack Tecnológico

| Capa | Tecnología |
|---|---|
| **Framework** | [Next.js 16](https://nextjs.org/) (App Router, Turbopack) |
| **UI** | [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/) |
| **Estilos** | [Tailwind CSS v4](https://tailwindcss.com/) con tokens CSS nativos |
| **Tipografía** | Fraunces, Inter y JetBrains Mono (Google Fonts, `next/font`) |
| **Base de Datos** | PostgreSQL (Neon) con [Prisma 7](https://www.prisma.io/) + `@prisma/adapter-pg` |
| **Auth** | [Better Auth](https://www.better-auth.com/) 1.x |
| **IA** | [@google/genai](https://github.com/google/genai) — Gemini en streaming |
| **Gráficos** | [Recharts 3](https://recharts.org/) |
| **Markdown/MDX** | `react-markdown` + `remark-gfm` + `rehype-raw`; `@next/mdx` para extensión de páginas |
| **Frontmatter** | `gray-matter` + `js-yaml` |
| **Validación** | [Zod 4](https://zod.dev/) |
| **Editor** | CodeMirror (`@uiw/react-codemirror`, lang-markdown/yaml) |
| **Iconos** | `lucide-react` |

## Estructura del Proyecto

```
prototype/
├── app/
│   ├── layout.tsx                 # Root layout: fuentes + metadata global
│   ├── page.tsx                   # Home: reporte publicado más reciente
│   ├── globals.css                # Tokens del sistema de diseño
│   ├── login/page.tsx             # Login superusuario
│   ├── admin/page.tsx             # Panel de administración (dashboard/upload/editor)
│   ├── reports/[id]/page.tsx      # Vista por ID (+ alias /reports/[id]/[slug])
│   └── api/
│       ├── auth/[...all]/route.ts # Better Auth
│       ├── chat/route.ts          # Asistente Gemini (streaming)
│       ├── health/route.ts        # Health check
│       ├── reporte/csv/route.ts   # Descarga CSV de la taxonomía
│       ├── reporte/bibtex/route.ts# Cita BibTeX del reporte activo
│       └── reports/               # CRUD + paginación + seed + upload (protegidos)
├── components/
│   ├── charts/                    # Bar/Line/Pie (Recharts) — aislados
│   ├── Chart.tsx                  # Dispatcher MDX <Chart />
│   ├── DynamicReportContent.tsx   # Renderizador Markdown/MDX + componentes custom
│   ├── MdxEditor.tsx              # Editor CodeMirror + preview + guardado
│   ├── DiagramaCapas.tsx          # Diagrama interactivo de capas
│   ├── CitationBlock.tsx          # Bloque de cita formal (DOI/BibTeX)
│   ├── ChatAyudante.tsx           # Chat flotante
│   └── ...                        # Hero, Footer, Navbar, TOC, ReportLayout
├── lib/
│   ├── auth.ts / auth-client.ts   # Better Auth server + cliente
│   ├── session.ts                 # getAdminSession (protección de rutas)
│   ├── prisma.ts                  # Cliente Prisma singleton (pg adapter)
│   ├── report-schema.ts           # Esquema Zod del frontmatter
│   ├── generate-ai-knowledge.ts   # Generación de ficha aiKnowledge
│   └── utils.ts                   # cn() + slugify()
├── prisma/
│   ├── schema.prisma              # Modelo Report + modelos Better Auth
│   ├── seed.ts                    # Superusuario + reporte inicial
│   └── dev.db                     # (SQLite local de respaldo/legado)
└── public/templates/plantilla-reporte-physaflow.mdx
```

## Sistema de Diseño

Estética **Paper & Ink** con acentos en verde bosque y dorado, definida como variables CSS en `app/globals.css`.

| Token | Valor | Uso |
|---|---|---|
| `--paper` / `--paper-2` | `#f7f4ec` / `#fbf9f3` | Fondo editorial |
| `--ink` / `--ink-muted` / `--ink-soft` | `#1a1814` / `#5c5a4d` / `#8a8775` | Jerarquía de texto |
| `--forest-900…600` | `#0a1f15`…`#1a4d3a` | Verde bosque (primario) |
| `--gold-700…200` | `#8a6f2e`…`#ecdcb8` | Detalles dorados |
| `--rule` / `--rule-soft` | `#d8d2c0` / `#e7e1cf` | Separadores |

**Tipografías** (vía `next/font`): `Fraunces` (títulos/capítulares), `Inter` (cuerpo), `JetBrains Mono` (telemetría/badges). Clases utilitarias: `.eyebrow`, `.sec-num`, `.stat-num`, `.tax-card`, `.layer-badge`.

## Requisitos Previos

- Node.js ≥ 20
- [pnpm](https://pnpm.io/) (`corepack enable pnpm` si no lo tienes)
- Una base **PostgreSQL** (recomendado [Neon](https://neon.tech)) o SQLite local
- (Opcional) una **API Key de Gemini** desde [Google AI Studio](https://aistudio.google.com/api-keys)

## Configuración

1. Instala dependencias:

   ```bash
   pnpm install
   ```

2. Crea tu archivo `.env` a partir de `.env.example`:

   ```bash
   cp .env.example .env
   ```

   ```dotenv
   # Neon PostgreSQL
   DATABASE_URL="postgresql://user:password@host/neondb?sslmode=require"

   # Better Auth
   BETTER_AUTH_SECRET="clave_secreta_segura"
   BETTER_AUTH_URL="http://localhost:3000"

   # Superusuario inicial (seed)
   ADMIN_EMAIL="admin@physaflow.org"
   ADMIN_PASSWORD="TuContraseñaSegura123"

   # IA
   GEMINI_API_KEY="tu_api_key_de_gemini"
   ```

3. Sincroniza el esquema y carga los datos iniciales:

   ```bash
   pnpm prisma db push
   pnpm prisma db seed
   ```

   > El seed crea el superusuario (si no existe) e ingesta la **plantilla oficial** como primer reporte publicado, generando además su ficha `aiKnowledge`.

## Ejecución

| Comando | Descripción |
|---|---|
| `pnpm dev` | Servidor de desarrollo en `http://localhost:3000` |
| `pnpm build` | Build de producción (compilación + verificación de tipos) |
| `pnpm lint` | Análisis estático con ESLint |
| `pnpm start` | Sirve el build de producción |
| `pnpm db:studio` | Explorer visual de Prisma Studio |

Flujo de inicio rápido: accede a `/login` con el superusuario y entra al panel en `/admin`.

## Base de Datos

| Comando | Descripción |
|---|---|
| `pnpm prisma db push` | Aplica el esquema a la base (sin migraciones versionadas) |
| `npx prisma db seed` | Ejecuta `prisma/seed.ts` |
| `npx prisma studio` | Navegador gráfico de datos |
| `npx prisma generate` | Regenera el cliente (se ejecuta en `postinstall`) |

## Autoría de Contenido (MDX)

Cada reporte es un archivo Markdown con **YAML Frontmatter** entre líneas `---`. El frontmatter se valida con `ReportFrontmatterSchema` (`lib/report-schema.ts`). La plantilla oficial se encuentra en `public/templates/plantilla-reporte-physaflow.mdx`.

### Campos del Frontmatter

```yaml
---
title: "El Índice de Capacidad Varada"
subtitle: "Subtítulo descriptivo del informe"
author: "Dr. Autor"
publishedDate: "Octubre 2026"
doi: "physaflow/sci-2025-001"
readingTime: "~22 minutos"
license: "CC BY-SA 4.0"

# Métricas de impacto global
globalMedian: "31,4%"
lossFacilities: "14,8%"
lossIT: "9,7%"
lossWorkload: "6,9%"
keyFinding: "Hallazgo clave mostrado en la barra lateral"

# Capas y modos de fallo (para <DiagramaCapas />)
layers:
  - id: "facility"
    level: "L1"
    title: "Capa de instalaciones"
    badgeClass: "layer-facility"
    cards:
      - code: "F-01"
        median: "4,2%"
        title: "Deriva del pasillo frío"
        observed: "..."
        cost: "..."
        reason: "..."
---
```

### Componentes MDX disponibles en el cuerpo

```mdx
<!-- Gráfico interactivo: type bar | line | pie -->
<Chart type="bar" title="Pérdidas por capa" data='[{"name":"Facilities","value":14.8}]' />

<!-- Diagrama de capas (se inyecta automáticamente) -->
<DiagramaCapas />

<!-- Tarjetas de metodología -->
<StepCard num="01" title="Paso 1">Descripción del procedimiento.</StepCard>

<!-- Bloque de cita formal -->
<CitationBlock />
```

Los componentes se registran en `DynamicReportContent.tsx`; `rehype-raw` permite los tags JSX dentro del Markdown.

### Editor MDX

El editor del panel ofrece:
- **Tres modos**: Doble Panel, Solo Código y Vista Previa.
- **Validación en vivo** del frontmatter (Zod) y del estado del reporte.
- **Detección de comas sobrantes** en `data='[...]'` de `<Chart />`: impide publicar con JSON inválido y muestra un modal informativo.
- **Guardar Borrador** vs **Publicar Reporte** (regenera `aiKnowledge` al publicar).

## Referencia de API

| Método | Ruta | Protegida | Descripción |
|---|---|---|---|
| `GET` | `/api/reports` | ✅ | Lista paginada (`page`, `limit`, `status=published\|draft`) + `pagination` + `summary` |
| `GET` | `/api/reports/[id]` | ✅ | Detalle de un reporte |
| `PATCH` | `/api/reports/[id]` | ✅ | Actualiza publicación/contenido (regenera `aiKnowledge`) |
| `DELETE` | `/api/reports/[id]` | ✅ | Elimina un reporte |
| `POST` | `/api/reports/upload` | ✅ | Ingesta `.mdx`/`.md` (multipart `file`, `targetId`, `isPublished`) |
| `POST` | `/api/reports/seed` | ✅ | Re-ingesta la plantilla oficial |
| `POST` | `/api/chat` | — | Asistente Gemini (streaming; contexto por `reportId`) |
| `GET` | `/api/reporte/csv` | — | CSV de la taxonomía (`?lang=en`) |
| `GET` | `/api/reporte/bibtex` | — | Cita BibTeX del reporte publicado |
| `GET` | `/api/health` | — | Health check |
| `*` | `/api/auth/*` | — | Better Auth |

> La API de `/api/reports*` está **protegida**: responde `401` sin sesión válida. Las rutas públicas (chat, csv, bibtex) permanecen abiertas porque son consumidas por visitantes.

## Seguridad y Autenticación

- **Autenticación server-side**: cada handler administrativo valida la sesión con `getAdminSession()` antes de operar.
- **Cifrado de contraseñas** gestionado por Better Auth (`emailAndPassword`).
- **Variables sensibles** únicamente en `.env` (nunca en el código). `BETTER_AUTH_SECRET` y `DATABASE_URL` son obligatorias en producción.
- El chat público consume la API de Gemini sin auth; considera rate-limiting si el tráfico lo exige.

## Despliegue en Vercel

1. Conecta el repositorio en Vercel (package manager: **pnpm** — se especifica en `package.json`).
2. Configura las variables de entorno (`DATABASE_URL`, `BETTER_AUTH_SECRET`, `BETTER_AUTH_URL`, `GEMINI_API_KEY`, `ADMIN_EMAIL`, `ADMIN_PASSWORD`).
3. `BETTER_AUTH_URL` debe apuntar al dominio de producción para que las cookies funcionen.
4. Después del primer deploy, ejecuta `pnpm prisma db push` y `pnpm prisma db seed` (o el endpoint `POST /api/reports/seed` con sesión) para cargar el reporte inicial.

> No hay dependencia de lectura dinámica de archivos en producción: el contenido vive en PostgreSQL y se sirve desde ahí. La plantilla es estática (`public/templates/`).

## Consideraciones Técnicas

- **Paginación servidor en el admin**: la lista trae **3 reportes por request** (`page` + `limit`); los contadores de sidebar/dashboard provienen del `summary` de la API. Ideal para un catálogo que crece lentamente (≈1 reporte/año) sin degradar la carga inicial.
- **Buscador**: opera sobre la página actual cargada (no sobre todo el catálogo) para no descargar el conjunto completo.
- **`aiKnowledge` como JSON**: la ficha se almacena en el campo `aiKnowledge` y el chat la usa como contexto estructurado, evitando enviar el MDX completo en cada llamada.
- **Escritura de gráficos**: `Chart.tsx` sanitiza *trailing commas* del JSON en `data` y devuelve array vacío ante JSON incompleto para no romper el render mientras se edita.
- **Convención de IDs**: el TOC, las anclas de sección y el footer comparten `slugify()` (`lib/utils.ts`) como única fuente de verdad.


---

© PhysaFlow — Prototipo v0.1.0. Licencia del contenido: CC BY-SA 4.0 (definida por reporte).
