# Requisitos del Proyecto: Reporte Público de PhysaFlow

Este documento contiene las especificaciones y objetivos del cliente para el sitio web del reporte público sobre la **"Stranded Capacity"** (Capacidad Varada) en centros de datos modernos, así como la arquitectura técnica de referencia y el estado de la implementación.

---

## 1. Visión General
**PhysaFlow** busca posicionarse como la voz más autorizada en la industria sobre el problema de la *stranded capacity* (energía contratada y encendida en data centers que no produce cómputo útil debido a la falta de coordinación entre sus capas físicas y operativas). 

El sitio no debe verse como una landing page comercial ordinaria ni como un blog genérico; debe presentarse como un **documento de referencia y publicación académica** de alto nivel científico y diseño moderno.

---

## 2. Requisitos del Cliente y Entregables

### A. Estructura del Reporte
- [x] **Sitio web navegable:** Debe incluir las siguientes secciones fijas:
  - **Resumen (Abstract):** Introducción al impacto financiero y de coordinación.
  - **Introducción:** Justificación histórica del índice y limitaciones de métricas tradicionales como el PUE.
  - **Taxonomía:** Modelo detallado estructurado en 3 capas de infraestructura.
  - **Metodología:** Descripción de las 4 etapas de recolección de datos y limitaciones del estudio.
  - **Figuras y Descargas:** Gráficos estadísticos del índice.
  - **Cómo citar:** Bloque formal para referencias académicas y periodísticas.

### B. Taxonomía de Tres Capas
Cada uno de los 9 modos de fallo debe documentarse en lenguaje de operador con 3 columnas informativas:
- **Capa 1: Facilities (Instalaciones - Energía, Cooling, Espacio)**
  - *F-01: Deriva del pasillo frío* (4,2%)
  - *F-02: Sobresuscripción térmica* (6,1%)
  - *F-03: Aprovisionamiento en sombra* (4,5%)
- **Capa 2: IT (Infraestructura - Racks, Nodos, Topología)**
  - *I-01: Racks comatosos* (3,8%)
  - *I-02: Nodos durmientes* (2,9%)
  - *I-03: Bloqueo de topología* (3,0%)
- **Capa 3: Workload (Scheduling - Programación y SLAs)**
  - *W-01: Asignaciones huérfanas* (3,1%)
  - *W-02: Inanición por afinidad* (2,2%)
  - *W-03: Latencia de marea* (1,6%)
  
*Cada una debe responder claramente a:* **Qué se ve**, **Cuánto cuesta** y **Por qué ocurre**.

### C. Descargas y Atribuciones
- [x] Los gráficos interactivos deben incluir opciones de descarga para formato SVG/PNG.
- [x] Atribución obligatoria marcada: `"Source: PhysaFlow Stranded Capacity Index"`.
- [x] Botón para copiar citación con formatos predefinidos:
  - APA 7 (Académico)
  - Periodístico (Texto descriptivo)
  - BibTeX (Para investigadores)

### D. Identidad Visual y Estética Premium
- **Paleta de Colores:** Forest-Green (Verdes oscuros de alta gama) y Gold (Detalles dorados refinados).
- **Tipografía:** Combinación editorial elegante (Serifas para títulos/capitulares y Sans-serif/Monospace para datos de telemetría).
- **Texturas:** Fondo con grano/textura de papel táctil de baja opacidad.
- **Responsividad:** Diseño completamente fluido para móviles, tabletas y escritorio, optimizado para impresión (PDF/Print).

---

## 3. Stack Tecnológico Implementado
- **Framework:** Next.js (App Router).
- **Estilos:** Tailwind CSS v4.
- **Motor de Contenido:** MDX (`@next/mdx`) para separar el contenido técnico del reporte de la lógica de renderizado.
- **Gráficos:** Shadcn Charts / Recharts para visualización dinámica y tooltips interactivos.
- **UI:** Componentes estilizados de Shadcn.

---

## 4. Estado de Avance Actual (Fase 1)
El prototipo inicial se encuentra completado y verificado en la carpeta `prototype/`:
- [x] Contenido del reporte migrado a [reporte-ES.mdx](file:///c:/Users/Hernan/Documents/GitHub/PhysaFlow-S07-26-Team-04/prototype/content/reporte-ES.mdx).
- [x] Gráficos de barra y área interactivos implementados en [components/GraficoBarrasDesperdicio.tsx](file:///c:/Users/Hernan/Documents/GitHub/PhysaFlow-S07-26-Team-04/prototype/components/GraficoBarrasDesperdicio.tsx) y [components/GraficoLineaAcumulado.tsx](file:///c:/Users/Hernan/Documents/GitHub/PhysaFlow-S07-26-Team-04/prototype/components/GraficoLineaAcumulado.tsx).
- [x] Sidebar interactivo (Scrollspy) programado en [components/TocSidebar.tsx](file:///c:/Users/Hernan/Documents/GitHub/PhysaFlow-S07-26-Team-04/prototype/components/TocSidebar.tsx).
- [x] Módulo de copiado e interacción de citas creado en [components/CitationBlock.tsx](file:///c:/Users/Hernan/Documents/GitHub/PhysaFlow-S07-26-Team-04/prototype/components/CitationBlock.tsx).
- [x] Limpieza de hidratación y errores de SVG finalizada.
