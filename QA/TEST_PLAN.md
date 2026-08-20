# PhysaFlow — Test Plan

**Proyecto:** Reporte público de Stranded Capacity — No Country Simulación S07-26 · Equipo 04
**QA Engineer:** Andrés Adrian Estrada Uzeda
**Fecha:** Agosto 2026 · **Versión:** 1.0
**Ambiente de pruebas:** [demo-s07-26-team-04.vercel.app](https://demo-s07-26-team-04.vercel.app/) · [/dashboard](https://demo-s07-26-team-04.vercel.app/dashboard)
**Repositorio:** [github.com/No-Country-simulation/S07-26-Team-04](https://github.com/No-Country-simulation/S07-26-Team-04)

---

## 1. Descripción del producto

PhysaFlow es una empresa de infraestructura de IA enfocada en la "stranded capacity": capacidad de datacenter pagada y encendida que no produce nada porque las capas física y operativa del facility no se coordinan entre sí.

El producto bajo prueba es el **sitio web del reporte público** de PhysaFlow: una experiencia de lectura tipo documento de referencia de la industria (no un blog ni landing comercial), que presenta una taxonomía de la stranded capacity en tres capas — **facility** (energía/refrigeración), **IT** (infraestructura) y **workload** (scheduling).

El contenido (Resumen, Introducción, Taxonomía, Metodología, Figuras, Conclusión y Citas) se gestiona dinámicamente vía archivos `.mdx` con YAML Frontmatter, cargados desde un panel de administración hacia PostgreSQL. El sitio incluye además un asistente conversacional ("Asistente PhysaFlow") y descarga del informe completo.

### Stack tecnológico

| Capa | Tecnología |
|---|---|
| Frontend | Next.js (App Router), React, TypeScript, Tailwind CSS |
| Base de datos y ORM | PostgreSQL + Prisma (esquema unificado con campos JSON nativos) |
| Parser de contenido | gray-matter (YAML Frontmatter sobre `.mdx`) |
| Despliegue | Vercel |

### Equipo del proyecto

| Nombre | Rol |
|---|---|
| Hernán Guido Gustavo Casasola | Tech Lead |
| Sergio Zuñiga Fraga | Frontend Developer |
| Elias Milano | Frontend Developer |
| Erika Helfenstern | Frontend Developer |
| Alexis Albarenga | Backend Developer |
| Orlando Cárdenas | Backend Developer |
| Andrés Adrian Estrada Uzeda | QA Engineer |

---

## 2. Entregables esperados (según brief)

- Sitio web navegable con estructura completa del reporte: introducción, taxonomía por capas, metodología y sección de citas.
- Cada sección de la taxonomía con nombre distintivo y descripción en lenguaje de operador (qué se ve, qué cuesta, por qué ocurre).
- Gráficos y visualizaciones descargables con atribución "Source: PhysaFlow Stranded Capacity Index".
- Bloque "cómo citar este reporte" con formato académico y periodístico.
- Diseño responsivo con paleta forest-green y gold de PhysaFlow.
- Contenido placeholder estructurado — no se requiere investigación real, sí estructura y jerarquía visual correcta.

**Criterio de éxito:** un stakeholder de PhysaFlow puede abrir el sitio, navegar el reporte completo y entender la taxonomía de stranded capacity sin necesitar explicación adicional. El diseño debe transmitir autoridad.

---

## 3. Funcionalidades identificadas para el alcance de las pruebas

- Navegación por secciones del reporte: Resumen, Introducción, Taxonomía, Metodología, Figuras, Conclusión y Citar.
- Renderizado dinámico de contenido `.mdx` (YAML Frontmatter) proveniente de PostgreSQL.
- Visualización de figuras y gráficos cuantitativos de los hallazgos.
- Descarga del informe completo en el formato publicado.
- Panel de administración para carga y edición de contenido del reporte.
- Asistente conversacional ("Asistente PhysaFlow") para consultas sobre el estudio.
- Metadatos del reporte: autor, DOI, fecha de publicación, licencia (CC BY-SA 4.0) y versión.
- Responsividad del sitio en distintos dispositivos y navegadores.

---

## 4. Estrategia de pruebas

Enfoque exploratorio inicial (relevar comportamiento real y estados de carga/error) combinado con documentación y ejecución de casos funcionales, de contenido, UI/UX y compatibilidad, priorizando los módulos de mayor visibilidad pública (navegación del reporte, figuras y descarga del informe).

**Tipos de prueba aplicados:**

- Funcionales: navegación, carga de contenido dinámico, descarga del informe.
- Contenido: verificación de que los `.mdx` publicados se rendericen sin placeholders crudos ("Título no disponible", etc.).
- UI/UX y responsive design (desktop, tablet, mobile).
- Compatibilidad entre navegadores (Chrome, Opera GX).
- Smoke en cada despliegue a Vercel antes de validar el resto del alcance.
- Exploratorias sobre el Asistente PhysaFlow y el panel de administración.

---

## 5. Criterios de aceptación

Derivados directamente del brief del proyecto; son la base contra la que se valida cada caso de prueba de contenido y UI.

| Criterio del brief | Cómo se valida |
|---|---|
| Contenido placeholder estructurado (no textos de error crudos) | Ninguna sección debe mostrar mensajes como "Título no disponible", "Descripción no disponible" o "No se encontró el contenido". Ante datos vacíos, el frontend debe mostrar un estado vacío diseñado o contenido placeholder con jerarquía visual. |
| Taxonomía con nombre distintivo y lenguaje de operador | Cada capa (facility, IT, workload) debe tener nombre propio y descripción que explique qué se ve, qué cuesta y por qué ocurre — no queda vacía. |
| Gráficos descargables con atribución | Los gráficos deben renderizar e incluir el texto "Source: PhysaFlow Stranded Capacity Index". |
| Bloque "cómo citar este reporte" | La sección Citar debe mostrar formato de cita académico y periodístico completo. |
| Paleta forest-green y gold | Verificar que la paleta de color aplicada en todo el sitio corresponda a verde bosque y dorado, no a los grises/naranjas genéricos observados en la build actual. |
| Autoridad visual ("no parece proyecto universitario") | Revisión de UI/UX: tipografía, espaciado y ausencia de mensajes de error visibles para el usuario final. |

### Estado de cumplimiento (validación Sprint 1)

Tras la corrección del contenido dinámico en el ambiente demo, se validaron los 9 criterios de aceptación:

| Criterio del brief | Estado |
|---|---|
| Contenido placeholder estructurado | ✅ Cumple |
| Metadatos (Autor, DOI, Publicado) | ✅ Cumple |
| Taxonomía con nombre distintivo y lenguaje de operador | ✅ Cumple |
| Gráficos que renderizan correctamente | ✅ Cumple |
| Gráficos descargables | ✅ Cumple (exportación SVG) |
| Atribución "Source: PhysaFlow Stranded Capacity Index" en gráficos | ✅ Cumple |
| Bloque "cómo citar este reporte" | ✅ Cumple |
| Paleta forest-green y gold | ✅ Cumple |
| Autoridad visual (no parece proyecto universitario) | ✅ Cumple |

> Los 9 criterios de aceptación quedan validados como cumplidos en el ambiente demo actual. No quedan hallazgos abiertos de este relevamiento.

---

## 6. Alcance y limitaciones

**Dentro del alcance:** el sitio público (demo-s07-26-team-04.vercel.app), sus secciones de contenido, la descarga del informe, las figuras/gráficos y la carga de contenido vía panel de administración, validados contra los criterios de aceptación del brief.

**Fuera del alcance:** pruebas de carga/performance a gran escala, pruebas de seguridad exhaustivas (pentesting) y validación de infraestructura de despliegue en Vercel, dado el tiempo acotado de la simulación.

**Limitaciones:** al tratarse de un proyecto de simulación laboral con entregas por sprint, el contenido del reporte y el panel de administración pueden estar en construcción durante parte del ciclo, lo que condiciona qué casos se pueden ejecutar en cada sprint.

---

## 7. Plan por sprint

### Sprint 1 — Estructura base
Objetivo: validar la estructura base del sitio, la navegación entre secciones y la disponibilidad del ambiente de pruebas.
- Elaboración del Test Plan y diseño de casos de prueba iniciales.
- Smoke sobre el ambiente demo (carga inicial, header, navegación por anclas).
- Exploratorias sobre las secciones del reporte (Resumen, Introducción, Taxonomía, Metodología).
- Validación de la paleta forest-green / gold.
- Validación de los 9 criterios de aceptación tras corrección del contenido dinámico.

### Sprint 2 — Funcionalidades dinámicas y administración
Objetivo: profundizar en funcionalidades dinámicas y de administración, y consolidar la cobertura de pruebas.
- Casos sobre Figuras/gráficos, sección Conclusión y Citar.
- Validación de la descarga del informe.
- Pruebas sobre el panel de administración (carga de `.mdx`, persistencia en PostgreSQL).
- Pruebas del Asistente PhysaFlow.
- Regresión de Figuras y Citar en cada despliegue.
- Cierre del reporte final de QA.

---

## 8. Herramientas

| Categoría | Herramienta |
|---|---|
| Gestión de casos y bugs | Jira |
| Documentación | Word |
| Pruebas exploratorias y manuales | Navegador (Chrome, Opera GX) + checklist de casos |
| Control de versiones | Git / GitHub |
| Comunicación de equipo | Discord |
| Automatización (a futuro) | Playwright |

---

## 9. Cronograma

| Actividad | Sprint | Duración estimada |
|---|---|---|
| Elaboración del Test Plan y diseño de casos | 1 | 3 días |
| Pruebas de humo y exploratorias sobre el sitio público | 1 | 4 días |
| Reporte de bugs y seguimiento | 1 | Continuo |
| Pruebas funcionales y de contenido dinámico | 2 | 4 días |
| Pruebas de panel de administración y Asistente PhysaFlow | 2 | 3 días |
| Regresión y reporte final de QA | 2 | 3 días |

---

## 10. Recursos

- **QA Engineer:** Andrés Adrian Estrada Uzeda — diseño y ejecución de casos de prueba.
- **Equipo de Frontend:** Sergio Zuñiga Fraga, Elias Milano, Erika Helfenstern.
- **Equipo de Backend:** Gabriela Celeste Garcia Retamar, Alexis Albarenga, Orlando Cárdenas.
- **Tech Lead:** Hernán Guido Gustavo Casasola — coordinación técnica general.
- **Ambiente de pruebas:** https://demo-s07-26-team-04.vercel.app/
- **Repositorio del proyecto:** github.com/No-Country-simulation/S07-26-Team-04

---
