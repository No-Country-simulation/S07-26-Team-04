# Arquitectura PhysaFlow — Documento de Referencia del Equipo

> **Propósito:** Este documento describe cómo está organizado el proyecto en la carpeta `frontend/`, cómo se comunican frontend y backend (Next.js App Router fullstack), y cómo los datos de un archivo MDX se vuelcan automáticamente en una base de datos PostgreSQL.
>
> ⚠️ **El prototipo en `prototype/` es un ejemplo a grandes rasgos de cómo podría verse la UI. No es una guía de código a seguir.** El equipo de frontend y backend tiene libertad para definir la estética, la estructura de componentes y el flujo exacto del código.

---

## 1. Filosofía General

El proyecto PhysaFlow es un **sitio de referencia académica** sobre "Stranded Capacity" (capacidad varada) en centros de datos. 
* El contenido principal y sus métricas asociadas se redactan en archivos **MDX** con cabecera **YAML Frontmatter**.
* Un usuario administrador puede subir el archivo `.mdx` directamente a la base de datos a través del panel de administración (Dashboard).
* El backend parsea el archivo `.mdx`, extrae la información del Frontmatter y el cuerpo de texto, y puebla la base de datos.
* El sitio web es **exclusivamente en Español** (simplifica la lógica de traducción y bases de datos).

### Flujo de datos simplificado

```
┌──────────────────────────────────────┐
│   Editor escribe reporte en MDX      │
│   (cabecera --- YAML + cuerpo texto) │
└──────────────────┬───────────────────┘
                   │
                   ▼
┌──────────────────────────────────────┐
│   Dashboard (Subir Archivo .mdx)     │
│   POST /api/reporte/upload           │
└──────────────────┬───────────────────┘
                   │
                   ▼
┌──────────────────────────────────────┐
│   Backend (Next.js API route)        │
│   1. Lee el archivo cargado          │
│   2. Parsea frontmatter con gray-matter│
│   3. Guarda en PostgreSQL            │
└──────────────────┬───────────────────┘
                   │
                   ▼
┌──────────────────────────────────────┐
│   Base de Datos (PostgreSQL)         │
│   Un solo registro por reporte       │
│   (Metadatos, JSONs y cuerpo MDX)    │
└──────────────────┬───────────────────┘
                   │
                   ▼
┌──────────────────────────────────────┐
│   Frontend (Server Components)       │
│   Consume Prisma y renderiza la UI    │
│   con ReactMarkdown o MDX            │
└──────────────────────────────────────┘
```

---

## 2. Estructura del Proyecto

Todo el código de la aplicación vive en la carpeta `frontend/`.

```
/
├── frontend/                   ← TODO EL CÓDIGO VIVE ACÁ (Next.js fullstack)
│   ├── app/
│   │   ├── page.tsx            ← Página principal del reporte (consume la DB)
│   │   ├── layout.tsx          ← Layout global
│   │   ├── admin/
│   │   │   └── page.tsx        ← Panel/Dashboard para subir archivos MDX
│   │   └── api/                ← API Routes
│   │       ├── reporte/
│   │       │   ├── route.ts            ← GET: datos generales del reporte
│   │       │   ├── upload/route.ts     ← POST: subir MDX, parsear y guardar en DB
│   │       │   └── citacion/route.ts   ← GET: descarga de BibTeX / APA
│   │       └── health/route.ts         ← GET: health check
│   ├── components/
│   │   ├── ui/                 ← Componentes base (shadcn / base-ui)
│   │   ├── DiagramaCapas.tsx   ← Taxonomía visual
│   │   ├── GraficoBarras.tsx   ← Gráfico de barras de modos de fallo
│   │   ├── GraficoLinea.tsx    ← Gráfico acumulado
│   │   └── StepCard.tsx        ← Componente para las tarjetas de metodología
│   ├── lib/
│   │   ├── prisma.ts           ← Cliente Prisma singleton
│   │   └── utils.ts            ← Utilidades
│   ├── prisma/
│   │   └── schema.prisma       ← Esquema simplificado de la base de datos
│   ├── package.json
│   └── next.config.ts
│
├── prototype/                  ← Prototipo interactivo de referencia visual
├── ejemplo-reporte.mdx         ← Plantilla de reporte con YAML Frontmatter
└── ARQUITECTURA.md             ← Este archivo
```

---

## 3. Base de Datos Simplificada — Schema Prisma

Para evitar que el esquema de la base de datos se vuelva demasiado grande y complejo (con relaciones cruzadas complejas, claves foráneas, etc.), **simplificamos la estructura a una única tabla principal utilizando campos JSON nativos de PostgreSQL**. Esto hace que poblar la base de datos desde un archivo MDX sea directo y libre de errores transaccionales.

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
  
  // Metadatos Básicos (YAML)
  titulo         String
  subtitulo      String?
  autor          String
  published      String   // "Octubre 2025"
  doi            String
  readingTime    String   // "~22 minutos"
  license        String   // "CC BY-SA 4.0"
  
  // Métricas de Impacto Global
  medianaGlobal  String   // "31,4%"
  lossFacilities String  // "14,8%"
  lossIT         String   // "9,7%"
  lossWorkload   String   // "6,9%"
  
  // Estructuras Complejas (Almacenadas como JSON)
  // Guarda el array de capas y sus cards de modos de fallo
  layers         Json     
  
  // Guarda los puntos de datos para el gráfico de barras
  taxonomyData   Json     
  
  // Guarda los puntos de datos para el gráfico de línea acumulado
  cumulativeData Json     
  
  // Cuerpo del Reporte
  // Guarda el contenido completo en Markdown/MDX para renderizado directo
  contenido      String   
  
  createdAt      DateTime @default(now())
  updatedAt      DateTime @updatedAt
}
```

---

## 4. Endpoints de API

### `POST /api/reporte/upload`
* **Acción:** Sube un archivo `.mdx` y puebla la base de datos.
* **Procesamiento en Backend:**
  1. Recibe el archivo `.mdx` mediante `FormData`.
  2. Lee el contenido como string de texto.
  3. Ejecuta `gray-matter` para separar la metadata del cuerpo de texto:
     ```javascript
     const { data, content } = matter(fileContent);
     ```
  4. Inserta o actualiza en la tabla `Reporte` mapeando directamente los campos:
     ```javascript
     await prisma.reporte.create({
       data: {
         titulo: data.title,
         subtitulo: data.subtitle,
         autor: data.author,
         published: data.published,
         doi: data.doi,
         readingTime: data.readingTime,
         license: data.license,
         medianaGlobal: data.medianaGlobal,
         lossFacilities: data.lossFacilities,
         lossIT: data.lossIT,
         lossWorkload: data.lossWorkload,
         layers: data.layers,                 // Guardado directo como JSON
         taxonomyData: data.taxonomyData,     // Guardado directo como JSON
         cumulativeData: data.cumulativeData, // Guardado directo como JSON
         contenido: content,                  // El cuerpo markdown del archivo
       }
     });
     ```
  5. Retorna `{ success: true }`.

### `GET /api/reporte`
* **Acción:** Devuelve el reporte activo (por ejemplo, el último publicado por fecha).
* **Respuesta:** Objeto JSON completo con los metadatos, los JSONs de datos y el `contenido` (markdown).

---

## 5. Responsabilidades por Rol

### Tech Lead (Hernán)
1. Definir el esquema final y revisar los Pull Requests del equipo.
2. Coordinar el desarrollo en paralelo de frontend y backend.
3. Configurar el entorno de despliegue en Vercel.

### Backend (Alexis, Orlando)
1. Configurar base de datos en PostgreSQL e inicializar el esquema de Prisma simplificado (una sola tabla `Reporte`).
2. Programar el endpoint `GET /api/reporte` para retornar el reporte consultando a la base de datos (con datos iniciales precargados).
3. Programar el endpoint `POST /api/reporte/upload` (utilizando `gray-matter`) para permitir la actualización del reporte subiendo un archivo `.mdx`.

### Frontend (Elias, Erika, Sergio)
1. **Página Principal del Reporte (Prioridad Máxima):** Diseñar la estructura visual, tipografía, paleta de colores y la maquetación premium del reporte interactivo (`app/page.tsx`).
2. **Componentes de Visualización:** Diseñar y animar los gráficos interactivos (`GraficoBarras`, `GraficoLinea`) y la taxonomía interactiva (`DiagramaCapas` y `<StepCard />`).
3. **Renderizado del Contenido:** Consumir los datos desde la API y renderizar el cuerpo de texto largo (`contenido`) utilizando `react-markdown` o MDX dinámico.
4. **Dashboard de Administración (Prioridad Secundaria):** Diseñar una pantalla simple en el panel de administración (`app/admin/page.tsx`) con un formulario básico para subir el archivo `.mdx` y actualizar el reporte.

### QA (Andrés)
1. Validar la fidelidad del diseño visual, la interactividad de los gráficos, y el correcto funcionamiento en dispositivos móviles y de escritorio.
2. Probar el flujo de actualización: subir un archivo `.mdx` de prueba en el panel de administración y verificar que la página principal cambie y muestre el nuevo reporte de inmediato.
