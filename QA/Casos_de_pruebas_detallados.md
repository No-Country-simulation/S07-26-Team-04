# PhysaFlow — Casos de Prueba, Ficha Detallada

**QA Engineer:** Andrés Adrian Estrada Uzeda
**Ambiente:** https://demo-s07-26-team-04.vercel.app/

**Total de casos: 51 · Aprobados: 50 · Fallaron: 1 · Bloqueados: 0**

---

## Índice rápido

| ID | Caso de prueba | Sprint | Categoría | Prioridad | Estado |
|---|---|---|---|---|---|
| TC-01 | Carga de la página principal | 1 | Smoke | Alta | ✅ Aprobado |
| TC-02 | Link de navegación — Resumen | 1 | Smoke | Media | ✅ Aprobado |
| TC-03 | Link de navegación — Introducción | 1 | Smoke | Media | ✅ Aprobado |
| TC-04 | Link de navegación — Taxonomía | 1 | Smoke | Media | ✅ Aprobado |
| TC-05 | Link de navegación — Metodología | 1 | Smoke | Media | ✅ Aprobado |
| TC-06 | Link de navegación — Figuras | 1 | Smoke | Media | ✅ Aprobado |
| TC-07 | Link de navegación — Conclusión | 1 | Smoke | Media | ✅ Aprobado |
| TC-08 | Link de navegación — Citar | 1 | Smoke | Media | ✅ Aprobado |
| TC-09 | Botón 'Descargar informe' visible | 1 | Smoke | Baja | ✅ Aprobado |
| TC-10 | Resumen — título y subtítulo | 1 | Contenido | Alta | ✅ Aprobado |
| TC-11 | Resumen — bloque SCI (% total) | 1 | Contenido | Alta | ✅ Aprobado |
| TC-12 | Resumen — desglose por capa | 1 | Contenido | Alta | ✅ Aprobado |
| TC-13 | Introducción — texto PUE vs. SCI | 1 | Contenido | Media | ✅ Aprobado |
| TC-14 | Introducción — cita textual | 1 | Contenido | Baja | ✅ Aprobado |
| TC-15 | Capa L1 — Instalaciones (descripción general) | 1 | Taxonomía | Alta | ✅ Aprobado |
| TC-16 | Capa L2 — TI (descripción general) | 1 | Taxonomía | Alta | ✅ Aprobado |
| TC-17 | Capa L3 — Carga de trabajo (descripción general) | 1 | Taxonomía | Alta | ✅ Aprobado |
| TC-18 | Modo F-01 — Deriva del pasillo frío | 1 | Taxonomía | Media | ✅ Aprobado |
| TC-19 | Modo F-02 — Sobresuscripción térmica | 1 | Taxonomía | Media | ✅ Aprobado |
| TC-20 | Modo F-03 — Aprovisionamiento en sombra | 1 | Taxonomía | Media | ✅ Aprobado |
| TC-21 | Modo I-01 — Racks comatosos | 1 | Taxonomía | Media | ✅ Aprobado |
| TC-22 | Modo I-02 — Nodos durmientes | 1 | Taxonomía | Media | ✅ Aprobado |
| TC-23 | Modo I-03 — Bloqueo de topología | 1 | Taxonomía | Media | ✅ Aprobado |
| TC-24 | Modo W-01 — Asignaciones huérfanas | 1 | Taxonomía | Media | ✅ Aprobado |
| TC-25 | Modo W-02 — Inanición por afinidad | 1 | Taxonomía | Media | ✅ Aprobado |
| TC-26 | Modo W-03 — Latencia de marea | 1 | Taxonomía | Media | ✅ Aprobado |
| TC-27 | Nota metodológica | 1 | Metodología | Media | ✅ Aprobado |
| TC-28 | Progresión de estados de capacidad | 1 | Metodología | Media | ✅ Aprobado |
| TC-29 | Paleta de color forest-green y gold | 1 | UI/UX | Alta | ✅ Aprobado |
| TC-30 | Autoridad visual / tipografía | 1 | UI/UX | Media | ✅ Aprobado |
| TC-31 | Gráfico de barras — 'Capacidad varada por modo de fallo' | 2 | Figuras | Alta | ✅ Aprobado |
| TC-32 | Gráfico circular — 'Capacidad varada por capa' | 2 | Figuras | Alta | ✅ Aprobado |
| TC-33 | Gráfico de línea — 'Capacidad varada acumulada 2020–2026' | 2 | Figuras | Alta | ✅ Aprobado |
| TC-34 | Descarga SVG — gráfico de barras | 2 | Figuras | Baja | ✅ Aprobado |
| TC-35 | Descarga SVG — gráfico circular | 2 | Figuras | Baja | ✅ Aprobado |
| TC-36 | Descarga SVG — gráfico de línea | 2 | Figuras | Baja | ✅ Aprobado |
| TC-37 | Atribución de fuente — Figura 1 | 2 | Figuras | Media | ✅ Aprobado |
| TC-38 | Atribución de fuente — Figura 2 | 2 | Figuras | Media | ✅ Aprobado |
| TC-39 | Atribución de fuente — Figura 3 | 2 | Figuras | Media | ✅ Aprobado |
| TC-40 | Sección Conclusión | 2 | Contenido | Media | ✅ Aprobado |
| TC-41 | Bloque de citación recomendada | 2 | Citar | Alta | ✅ Aprobado |
| TC-42 | Botón 'Copiar citación' | 2 | Citar | Media | ✅ Aprobado |
| TC-43 | Metadatos — DOI, fecha y licencia | 2 | Citar | Alta | ✅ Aprobado |
| TC-44 | Botón 'Descargar informe' (acción) | 2 | Funcional | Alta | ❌ **Falló** |
| TC-45 | Asistente PhysaFlow — apertura | 2 | Funcional | Media | ✅ Aprobado |
| TC-46 | Asistente PhysaFlow — respuesta a consulta | 2 | Funcional | Media | ✅ Aprobado |
| TC-47 | Panel de administración — carga de .mdx | 2 | Funcional | Alta | ✅ Aprobado |
| TC-48 | Panel de administración — persistencia en PostgreSQL | 2 | Funcional | Alta | ✅ Aprobado |
| TC-49 | Responsive — mobile | 2 | Compatibilidad | Media | ✅ Aprobado |
| TC-50 | Responsive — tablet | 2 | Compatibilidad | Media | ✅ Aprobado |
| TC-51 | Cross-browser | 2 | Compatibilidad | Baja | ✅ Aprobado |

---

## Sprint 1

### TC-01 — Carga de la página principal
*Smoke · Prioridad: Alta*

| Campo | Detalle |
|---|---|
| **1. ID de caso de prueba** | TC-01 |
| **2. Título / Descripción** | Carga de la página principal |
| **3. Condiciones previas** | Ambiente demo accesible (https://demo-s07-26-team-04.vercel.app/); conexión a internet estable |
| **4. Pasos de prueba** | 1. Abrir el navegador · 2. Ingresar la URL https://demo-s07-26-team-04.vercel.app/ · 3. Esperar la carga completa |
| **5. Datos de prueba** | URL utilizada: https://demo-s07-26-team-04.vercel.app/ |
| **6. Resultado esperado** | El sitio responde con código 200, sin error 404/500; se muestra el header con logo 'PhysaFlow' y el menú de navegación |
| **7. Resultado actual** | Header y navegación visibles |
| **8. Estado** | ✅ **Aprobado** |

### TC-02 — Link de navegación — Resumen
*Smoke · Prioridad: Media*

| Campo | Detalle |
|---|---|
| **1. ID de caso de prueba** | TC-02 |
| **2. Título / Descripción** | Link de navegación — Resumen |
| **3. Condiciones previas** | Ambiente demo accesible; conexión a internet estable; sitio cargado |
| **4. Pasos de prueba** | 1. Clic en 'Resumen' del menú superior · 2. Observar el scroll/redirección |
| **5. Datos de prueba** | No aplica — caso de verificación de contenido/UI, sin datos de entrada variables |
| **6. Resultado esperado** | La vista se posiciona en la sección 01 - Resumen; el item se resalta como activo en el sidebar |
| **7. Resultado actual** | Coincide con el resultado esperado |
| **8. Estado** | ✅ **Aprobado** |

### TC-03 — Link de navegación — Introducción
*Smoke · Prioridad: Media*

| Campo | Detalle |
|---|---|
| **1. ID de caso de prueba** | TC-03 |
| **2. Título / Descripción** | Link de navegación — Introducción |
| **3. Condiciones previas** | Ambiente demo accesible; conexión a internet estable; sitio cargado |
| **4. Pasos de prueba** | 1. Clic en 'Introducción' del menú superior |
| **5. Datos de prueba** | No aplica — caso de verificación de contenido/UI, sin datos de entrada variables |
| **6. Resultado esperado** | La vista se posiciona en la sección 02 - Introducción; item resaltado en sidebar |
| **7. Resultado actual** | Coincide con el resultado esperado |
| **8. Estado** | ✅ **Aprobado** |

### TC-04 — Link de navegación — Taxonomía
*Smoke · Prioridad: Media*

| Campo | Detalle |
|---|---|
| **1. ID de caso de prueba** | TC-04 |
| **2. Título / Descripción** | Link de navegación — Taxonomía |
| **3. Condiciones previas** | Ambiente demo accesible; conexión a internet estable; sitio cargado |
| **4. Pasos de prueba** | 1. Clic en 'Taxonomía' del menú superior |
| **5. Datos de prueba** | No aplica — caso de verificación de contenido/UI, sin datos de entrada variables |
| **6. Resultado esperado** | La vista se posiciona en la sección 03 - Taxonomía; item resaltado en sidebar |
| **7. Resultado actual** | Coincide con el resultado esperado |
| **8. Estado** | ✅ **Aprobado** |

### TC-05 — Link de navegación — Metodología
*Smoke · Prioridad: Media*

| Campo | Detalle |
|---|---|
| **1. ID de caso de prueba** | TC-05 |
| **2. Título / Descripción** | Link de navegación — Metodología |
| **3. Condiciones previas** | Ambiente demo accesible; conexión a internet estable; sitio cargado |
| **4. Pasos de prueba** | 1. Clic en 'Metodología' del menú superior |
| **5. Datos de prueba** | No aplica — caso de verificación de contenido/UI, sin datos de entrada variables |
| **6. Resultado esperado** | La vista se posiciona en la sección 04 - Metodología; item resaltado en sidebar |
| **7. Resultado actual** | Coincide con el resultado esperado |
| **8. Estado** | ✅ **Aprobado** |

### TC-06 — Link de navegación — Figuras
*Smoke · Prioridad: Media*

| Campo | Detalle |
|---|---|
| **1. ID de caso de prueba** | TC-06 |
| **2. Título / Descripción** | Link de navegación — Figuras |
| **3. Condiciones previas** | Ambiente demo accesible; conexión a internet estable; sitio cargado |
| **4. Pasos de prueba** | 1. Clic en 'Figuras' del menú superior |
| **5. Datos de prueba** | No aplica — caso de verificación de contenido/UI, sin datos de entrada variables |
| **6. Resultado esperado** | La vista se posiciona en la sección 05 - Figuras; item resaltado en sidebar |
| **7. Resultado actual** | Coincide con el resultado esperado |
| **8. Estado** | ✅ **Aprobado** |

### TC-07 — Link de navegación — Conclusión
*Smoke · Prioridad: Media*

| Campo | Detalle |
|---|---|
| **1. ID de caso de prueba** | TC-07 |
| **2. Título / Descripción** | Link de navegación — Conclusión |
| **3. Condiciones previas** | Ambiente demo accesible; conexión a internet estable; sitio cargado |
| **4. Pasos de prueba** | 1. Clic en 'Conclusión' del menú superior |
| **5. Datos de prueba** | No aplica — caso de verificación de contenido/UI, sin datos de entrada variables |
| **6. Resultado esperado** | La vista se posiciona en la sección 06 - Conclusión; item resaltado en sidebar |
| **7. Resultado actual** | Coincide con el resultado esperado |
| **8. Estado** | ✅ **Aprobado** |

### TC-08 — Link de navegación — Citar
*Smoke · Prioridad: Media*

| Campo | Detalle |
|---|---|
| **1. ID de caso de prueba** | TC-08 |
| **2. Título / Descripción** | Link de navegación — Citar |
| **3. Condiciones previas** | Ambiente demo accesible; conexión a internet estable; sitio cargado |
| **4. Pasos de prueba** | 1. Clic en 'Citar' del menú superior |
| **5. Datos de prueba** | No aplica — caso de verificación de contenido/UI, sin datos de entrada variables |
| **6. Resultado esperado** | La vista se posiciona en la sección 07 - Citar; item resaltado en sidebar |
| **7. Resultado actual** | Coincide con el resultado esperado |
| **8. Estado** | ✅ **Aprobado** |

### TC-09 — Botón 'Descargar informe' visible
*Smoke · Prioridad: Baja*

| Campo | Detalle |
|---|---|
| **1. ID de caso de prueba** | TC-09 |
| **2. Título / Descripción** | Botón 'Descargar informe' visible |
| **3. Condiciones previas** | Ambiente demo accesible; conexión a internet estable; sitio cargado |
| **4. Pasos de prueba** | 1. Ver el header en cualquier sección |
| **5. Datos de prueba** | No aplica — caso de verificación de contenido/UI, sin datos de entrada variables |
| **6. Resultado esperado** | El botón 'Descargar informe' está visible y accesible en todo momento (header fijo) |
| **7. Resultado actual** | Coincide con el resultado esperado |
| **8. Estado** | ✅ **Aprobado** |

### TC-10 — Resumen — título y subtítulo
*Contenido · Prioridad: Alta*

| Campo | Detalle |
|---|---|
| **1. ID de caso de prueba** | TC-10 |
| **2. Título / Descripción** | Resumen — título y subtítulo |
| **3. Condiciones previas** | Sección 01 - Resumen visible |
| **4. Pasos de prueba** | 1. Leer el título principal · 2. Leer el subtítulo/tagline |
| **5. Datos de prueba** | No aplica — caso de verificación de contenido/UI, sin datos de entrada variables |
| **6. Resultado esperado** | Título 'Resumen' y subtítulo 'El impuesto oculto del cómputo moderno' se muestran (no 'Título no disponible') |
| **7. Resultado actual** | Confirmado con contenido extraído del sitio |
| **8. Estado** | ✅ **Aprobado** |

### TC-11 — Resumen — bloque SCI (% total)
*Contenido · Prioridad: Alta*

| Campo | Detalle |
|---|---|
| **1. ID de caso de prueba** | TC-11 |
| **2. Título / Descripción** | Resumen — bloque SCI (% total) |
| **3. Condiciones previas** | Sección 01 - Resumen visible |
| **4. Pasos de prueba** | 1. Leer el párrafo de definición del SCI · 2. Ubicar el porcentaje total de capacidad no productiva |
| **5. Datos de prueba** | No aplica — caso de verificación de contenido/UI, sin datos de entrada variables |
| **6. Resultado esperado** | Se define el Índice de Capacidad Varada (SCI) y se muestra 31,4% de capacidad no productiva |
| **7. Resultado actual** | Coincide con el resultado esperado |
| **8. Estado** | ✅ **Aprobado** |

### TC-12 — Resumen — desglose por capa
*Contenido · Prioridad: Alta*

| Campo | Detalle |
|---|---|
| **1. ID de caso de prueba** | TC-12 |
| **2. Título / Descripción** | Resumen — desglose por capa |
| **3. Condiciones previas** | Sección 01 - Resumen visible |
| **4. Pasos de prueba** | 1. Ver las 3 tarjetas de porcentaje (Instalaciones, TI, Carga de trabajo) |
| **5. Datos de prueba** | No aplica — caso de verificación de contenido/UI, sin datos de entrada variables |
| **6. Resultado esperado** | Instalaciones 14,8% · TI 9,7% · Carga de trabajo 6,9%, cada una con su tarjeta individual |
| **7. Resultado actual** | Coincide con el resultado esperado |
| **8. Estado** | ✅ **Aprobado** |

### TC-13 — Introducción — texto PUE vs. SCI
*Contenido · Prioridad: Media*

| Campo | Detalle |
|---|---|
| **1. ID de caso de prueba** | TC-13 |
| **2. Título / Descripción** | Introducción — texto PUE vs. SCI |
| **3. Condiciones previas** | Sección 02 - Introducción visible |
| **4. Pasos de prueba** | 1. Leer el cuerpo de texto de la sección |
| **5. Datos de prueba** | No aplica — caso de verificación de contenido/UI, sin datos de entrada variables |
| **6. Resultado esperado** | Explica qué mide el PUE, su limitación, y cómo el SCI la complementa (no 'No se encontró el contenido') |
| **7. Resultado actual** | Coincide con el resultado esperado |
| **8. Estado** | ✅ **Aprobado** |

### TC-14 — Introducción — cita textual
*Contenido · Prioridad: Baja*

| Campo | Detalle |
|---|---|
| **1. ID de caso de prueba** | TC-14 |
| **2. Título / Descripción** | Introducción — cita textual |
| **3. Condiciones previas** | Sección 02 - Introducción visible |
| **4. Pasos de prueba** | 1. Ubicar el bloque de cita destacada |
| **5. Datos de prueba** | No aplica — caso de verificación de contenido/UI, sin datos de entrada variables |
| **6. Resultado esperado** | Se muestra la cita del "Director de Infraestructura, hiperescalador de nivel 1 (anonimizado)" |
| **7. Resultado actual** | Coincide con el resultado esperado |
| **8. Estado** | ✅ **Aprobado** |

### TC-15 — Capa L1 — Instalaciones (descripción general)
*Taxonomía · Prioridad: Alta*

| Campo | Detalle |
|---|---|
| **1. ID de caso de prueba** | TC-15 |
| **2. Título / Descripción** | Capa L1 — Instalaciones (descripción general) |
| **3. Condiciones previas** | Sección 03 - Taxonomía visible |
| **4. Pasos de prueba** | 1. Ubicar el bloque 'L1 — Capa de instalaciones' · 2. Leer su descripción introductoria |
| **5. Datos de prueba** | No aplica — caso de verificación de contenido/UI, sin datos de entrada variables |
| **6. Resultado esperado** | Se describe la capa como todo lo que hay entre el medidor y el PDU del rack, con subtemas Energía/Refrigeración/Espacio |
| **7. Resultado actual** | Coincide con el resultado esperado |
| **8. Estado** | ✅ **Aprobado** |

### TC-16 — Capa L2 — TI (descripción general)
*Taxonomía · Prioridad: Alta*

| Campo | Detalle |
|---|---|
| **1. ID de caso de prueba** | TC-16 |
| **2. Título / Descripción** | Capa L2 — TI (descripción general) |
| **3. Condiciones previas** | Sección 03 - Taxonomía visible |
| **4. Pasos de prueba** | 1. Ubicar el bloque 'L2 — Capa de TI' · 2. Leer su descripción introductoria |
| **5. Datos de prueba** | No aplica — caso de verificación de contenido/UI, sin datos de entrada variables |
| **6. Resultado esperado** | Se describe la capa como todo lo que hay entre el PDU del rack y el programador de cargas |
| **7. Resultado actual** | Coincide con el resultado esperado |
| **8. Estado** | ✅ **Aprobado** |

### TC-17 — Capa L3 — Carga de trabajo (descripción general)
*Taxonomía · Prioridad: Alta*

| Campo | Detalle |
|---|---|
| **1. ID de caso de prueba** | TC-17 |
| **2. Título / Descripción** | Capa L3 — Carga de trabajo (descripción general) |
| **3. Condiciones previas** | Sección 03 - Taxonomía visible |
| **4. Pasos de prueba** | 1. Ubicar el bloque 'L3 — Capa de carga de trabajo' · 2. Leer su descripción introductoria |
| **5. Datos de prueba** | No aplica — caso de verificación de contenido/UI, sin datos de entrada variables |
| **6. Resultado esperado** | Se describe la capa como todo lo que hay entre el programador y la aplicación |
| **7. Resultado actual** | Coincide con el resultado esperado |
| **8. Estado** | ✅ **Aprobado** |

### TC-18 — Modo F-01 — Deriva del pasillo frío
*Taxonomía · Prioridad: Media*

| Campo | Detalle |
|---|---|
| **1. ID de caso de prueba** | TC-18 |
| **2. Título / Descripción** | Modo F-01 — Deriva del pasillo frío |
| **3. Condiciones previas** | Capa L1 expandida |
| **4. Pasos de prueba** | 1. Leer nombre, % y las 3 subsecciones del fallo |
| **5. Datos de prueba** | No aplica — caso de verificación de contenido/UI, sin datos de entrada variables |
| **6. Resultado esperado** | Nombre distintivo (4,2%) con Qué se ve / Cuánto cuesta / Por qué ocurre completos |
| **7. Resultado actual** | Coincide con el resultado esperado |
| **8. Estado** | ✅ **Aprobado** |

### TC-19 — Modo F-02 — Sobresuscripción térmica
*Taxonomía · Prioridad: Media*

| Campo | Detalle |
|---|---|
| **1. ID de caso de prueba** | TC-19 |
| **2. Título / Descripción** | Modo F-02 — Sobresuscripción térmica |
| **3. Condiciones previas** | Capa L1 expandida |
| **4. Pasos de prueba** | 1. Leer nombre, % y las 3 subsecciones del fallo |
| **5. Datos de prueba** | No aplica — caso de verificación de contenido/UI, sin datos de entrada variables |
| **6. Resultado esperado** | Nombre distintivo (6,1%) con Qué se ve / Cuánto cuesta / Por qué ocurre completos |
| **7. Resultado actual** | Coincide con el resultado esperado |
| **8. Estado** | ✅ **Aprobado** |

### TC-20 — Modo F-03 — Aprovisionamiento en sombra
*Taxonomía · Prioridad: Media*

| Campo | Detalle |
|---|---|
| **1. ID de caso de prueba** | TC-20 |
| **2. Título / Descripción** | Modo F-03 — Aprovisionamiento en sombra |
| **3. Condiciones previas** | Capa L1 expandida |
| **4. Pasos de prueba** | 1. Leer nombre, % y las 3 subsecciones del fallo |
| **5. Datos de prueba** | No aplica — caso de verificación de contenido/UI, sin datos de entrada variables |
| **6. Resultado esperado** | Nombre distintivo (4,5%) con Qué se ve / Cuánto cuesta / Por qué ocurre completos |
| **7. Resultado actual** | Coincide con el resultado esperado |
| **8. Estado** | ✅ **Aprobado** |

### TC-21 — Modo I-01 — Racks comatosos
*Taxonomía · Prioridad: Media*

| Campo | Detalle |
|---|---|
| **1. ID de caso de prueba** | TC-21 |
| **2. Título / Descripción** | Modo I-01 — Racks comatosos |
| **3. Condiciones previas** | Capa L2 expandida |
| **4. Pasos de prueba** | 1. Leer nombre, % y las 3 subsecciones del fallo |
| **5. Datos de prueba** | No aplica — caso de verificación de contenido/UI, sin datos de entrada variables |
| **6. Resultado esperado** | Nombre distintivo (3,8%) con Qué se ve / Cuánto cuesta / Por qué ocurre completos |
| **7. Resultado actual** | Coincide con el resultado esperado |
| **8. Estado** | ✅ **Aprobado** |

### TC-22 — Modo I-02 — Nodos durmientes
*Taxonomía · Prioridad: Media*

| Campo | Detalle |
|---|---|
| **1. ID de caso de prueba** | TC-22 |
| **2. Título / Descripción** | Modo I-02 — Nodos durmientes |
| **3. Condiciones previas** | Capa L2 expandida |
| **4. Pasos de prueba** | 1. Leer nombre, % y las 3 subsecciones del fallo |
| **5. Datos de prueba** | No aplica — caso de verificación de contenido/UI, sin datos de entrada variables |
| **6. Resultado esperado** | Nombre distintivo (2,9%) con Qué se ve / Cuánto cuesta / Por qué ocurre completos |
| **7. Resultado actual** | Coincide con el resultado esperado |
| **8. Estado** | ✅ **Aprobado** |

### TC-23 — Modo I-03 — Bloqueo de topología
*Taxonomía · Prioridad: Media*

| Campo | Detalle |
|---|---|
| **1. ID de caso de prueba** | TC-23 |
| **2. Título / Descripción** | Modo I-03 — Bloqueo de topología |
| **3. Condiciones previas** | Capa L2 expandida |
| **4. Pasos de prueba** | 1. Leer nombre, % y las 3 subsecciones del fallo |
| **5. Datos de prueba** | No aplica — caso de verificación de contenido/UI, sin datos de entrada variables |
| **6. Resultado esperado** | Nombre distintivo (3,0%) con Qué se ve / Cuánto cuesta / Por qué ocurre completos |
| **7. Resultado actual** | Coincide con el resultado esperado |
| **8. Estado** | ✅ **Aprobado** |

### TC-24 — Modo W-01 — Asignaciones huérfanas
*Taxonomía · Prioridad: Media*

| Campo | Detalle |
|---|---|
| **1. ID de caso de prueba** | TC-24 |
| **2. Título / Descripción** | Modo W-01 — Asignaciones huérfanas |
| **3. Condiciones previas** | Capa L3 expandida |
| **4. Pasos de prueba** | 1. Leer nombre, % y las 3 subsecciones del fallo |
| **5. Datos de prueba** | No aplica — caso de verificación de contenido/UI, sin datos de entrada variables |
| **6. Resultado esperado** | Nombre distintivo (3,1%) con Qué se ve / Cuánto cuesta / Por qué ocurre completos |
| **7. Resultado actual** | Coincide con el resultado esperado |
| **8. Estado** | ✅ **Aprobado** |

### TC-25 — Modo W-02 — Inanición por afinidad
*Taxonomía · Prioridad: Media*

| Campo | Detalle |
|---|---|
| **1. ID de caso de prueba** | TC-25 |
| **2. Título / Descripción** | Modo W-02 — Inanición por afinidad |
| **3. Condiciones previas** | Capa L3 expandida |
| **4. Pasos de prueba** | 1. Leer nombre, % y las 3 subsecciones del fallo |
| **5. Datos de prueba** | No aplica — caso de verificación de contenido/UI, sin datos de entrada variables |
| **6. Resultado esperado** | Nombre distintivo (2,2%) con Qué se ve / Cuánto cuesta / Por qué ocurre completos |
| **7. Resultado actual** | Coincide con el resultado esperado |
| **8. Estado** | ✅ **Aprobado** |

### TC-26 — Modo W-03 — Latencia de marea
*Taxonomía · Prioridad: Media*

| Campo | Detalle |
|---|---|
| **1. ID de caso de prueba** | TC-26 |
| **2. Título / Descripción** | Modo W-03 — Latencia de marea |
| **3. Condiciones previas** | Capa L3 expandida |
| **4. Pasos de prueba** | 1. Leer nombre, % y las 3 subsecciones del fallo |
| **5. Datos de prueba** | No aplica — caso de verificación de contenido/UI, sin datos de entrada variables |
| **6. Resultado esperado** | Nombre distintivo (1,6%) con Qué se ve / Cuánto cuesta / Por qué ocurre completos |
| **7. Resultado actual** | Coincide con el resultado esperado |
| **8. Estado** | ✅ **Aprobado** |

### TC-27 — Nota metodológica
*Metodología · Prioridad: Media*

| Campo | Detalle |
|---|---|
| **1. ID de caso de prueba** | TC-27 |
| **2. Título / Descripción** | Nota metodológica |
| **3. Condiciones previas** | Sección 04 - Metodología visible |
| **4. Pasos de prueba** | 1. Leer el cuadro de nota metodológica |
| **5. Datos de prueba** | No aplica — caso de verificación de contenido/UI, sin datos de entrada variables |
| **6. Resultado esperado** | Se explica que los fallos debían observarse en al menos 2 fuentes para integrar la taxonomía |
| **7. Resultado actual** | Coincide con el resultado esperado |
| **8. Estado** | ✅ **Aprobado** |

### TC-28 — Progresión de estados de capacidad
*Metodología · Prioridad: Media*

| Campo | Detalle |
|---|---|
| **1. ID de caso de prueba** | TC-28 |
| **2. Título / Descripción** | Progresión de estados de capacidad |
| **3. Condiciones previas** | Sección 04 - Metodología visible |
| **4. Pasos de prueba** | 1. Ver el diagrama/lista de 5 estados |
| **5. Datos de prueba** | No aplica — caso de verificación de contenido/UI, sin datos de entrada variables |
| **6. Resultado esperado** | Se muestran en orden: Instalada → Disponible → Programable → Activa → Productiva, cada uno con descripción corta |
| **7. Resultado actual** | Coincide con el resultado esperado |
| **8. Estado** | ✅ **Aprobado** |

### TC-29 — Paleta de color forest-green y gold
*UI/UX · Prioridad: Alta*

| Campo | Detalle |
|---|---|
| **1. ID de caso de prueba** | TC-29 |
| **2. Título / Descripción** | Paleta de color forest-green y gold |
| **3. Condiciones previas** | Sitio cargado en cualquier sección |
| **4. Pasos de prueba** | 1. Inspeccionar color de fondo · 2. Inspeccionar color de acentos, títulos e iconos |
| **5. Datos de prueba** | No aplica — caso de verificación de contenido/UI, sin datos de entrada variables |
| **6. Resultado esperado** | Fondo predominante verde bosque oscuro; acentos, números y CTAs en dorado, consistente en todas las secciones |
| **7. Resultado actual** | Coincide con el resultado esperado |
| **8. Estado** | ✅ **Aprobado** |

### TC-30 — Autoridad visual / tipografía
*UI/UX · Prioridad: Media*

| Campo | Detalle |
|---|---|
| **1. ID de caso de prueba** | TC-30 |
| **2. Título / Descripción** | Autoridad visual / tipografía |
| **3. Condiciones previas** | Sitio cargado en cualquier sección |
| **4. Pasos de prueba** | 1. Revisar tipografía de títulos vs. cuerpo · 2. Revisar espaciado y jerarquía · 3. Confirmar ausencia de textos de error |
| **5. Datos de prueba** | No aplica — caso de verificación de contenido/UI, sin datos de entrada variables |
| **6. Resultado esperado** | Tipografía serif en títulos, sans-serif en cuerpo, buen espaciado; no aparecen mensajes tipo 'no disponible' o 'N/D' |
| **7. Resultado actual** | Coincide con el resultado esperado |
| **8. Estado** | ✅ **Aprobado** |

---

## Sprint 2

### TC-31 — Gráfico de barras — 'Capacidad varada por modo de fallo'
*Figuras · Prioridad: Alta*

| Campo | Detalle |
|---|---|
| **1. ID de caso de prueba** | TC-31 |
| **2. Título / Descripción** | Gráfico de barras — 'Capacidad varada por modo de fallo' |
| **3. Condiciones previas** | Sección 05 - Figuras visible |
| **4. Pasos de prueba** | 1. Localizar el gráfico de barras · 2. Verificar ejes, etiquetas y barras |
| **5. Datos de prueba** | No aplica — caso de verificación de contenido/UI, sin datos de entrada variables |
| **6. Resultado esperado** | El gráfico renderiza completo con 9 barras (una por modo de fallo), eje Y en % y eje X con nombres rotados; no queda en 'Cargando gráfico…' |
| **7. Resultado actual** | Figura 2 |
| **8. Estado** | ✅ **Aprobado** |

### TC-32 — Gráfico circular — 'Capacidad varada por capa'
*Figuras · Prioridad: Alta*

| Campo | Detalle |
|---|---|
| **1. ID de caso de prueba** | TC-32 |
| **2. Título / Descripción** | Gráfico circular — 'Capacidad varada por capa' |
| **3. Condiciones previas** | Sección 05 - Figuras visible |
| **4. Pasos de prueba** | 1. Localizar el gráfico circular · 2. Verificar segmentos y leyenda |
| **5. Datos de prueba** | No aplica — caso de verificación de contenido/UI, sin datos de entrada variables |
| **6. Resultado esperado** | Muestra 3 segmentos: Instalaciones 47,1% / TI 30,9% / Carga de trabajo 22,0%, con leyenda de colores |
| **7. Resultado actual** | Figura 1 |
| **8. Estado** | ✅ **Aprobado** |

### TC-33 — Gráfico de línea — 'Capacidad varada acumulada 2020–2026'
*Figuras · Prioridad: Alta*

| Campo | Detalle |
|---|---|
| **1. ID de caso de prueba** | TC-33 |
| **2. Título / Descripción** | Gráfico de línea — 'Capacidad varada acumulada 2020–2026' |
| **3. Condiciones previas** | Sección 05 - Figuras visible |
| **4. Pasos de prueba** | 1. Localizar el gráfico de línea · 2. Verificar eje temporal y valores |
| **5. Datos de prueba** | No aplica — caso de verificación de contenido/UI, sin datos de entrada variables |
| **6. Resultado esperado** | Línea continua de 2020 a 2026 mostrando evolución del % acumulado, con eje Y de 0% a 40% |
| **7. Resultado actual** | Figura 3 |
| **8. Estado** | ✅ **Aprobado** |

### TC-34 — Descarga SVG — gráfico de barras
*Figuras · Prioridad: Baja*

| Campo | Detalle |
|---|---|
| **1. ID de caso de prueba** | TC-34 |
| **2. Título / Descripción** | Descarga SVG — gráfico de barras |
| **3. Condiciones previas** | Gráfico de barras renderizado |
| **4. Pasos de prueba** | 1. Clic en botón 'SVG' del gráfico de barras |
| **5. Datos de prueba** | No aplica — caso de verificación de contenido/UI, sin datos de entrada variables |
| **6. Resultado esperado** | Se descarga/exporta un archivo .svg válido del gráfico |
| **7. Resultado actual** | Coincide con el resultado esperado |
| **8. Estado** | ✅ **Aprobado** |

### TC-35 — Descarga SVG — gráfico circular
*Figuras · Prioridad: Baja*

| Campo | Detalle |
|---|---|
| **1. ID de caso de prueba** | TC-35 |
| **2. Título / Descripción** | Descarga SVG — gráfico circular |
| **3. Condiciones previas** | Gráfico circular renderizado |
| **4. Pasos de prueba** | 1. Clic en botón 'SVG' del gráfico circular |
| **5. Datos de prueba** | No aplica — caso de verificación de contenido/UI, sin datos de entrada variables |
| **6. Resultado esperado** | Se descarga/exporta un archivo .svg válido del gráfico |
| **7. Resultado actual** | Coincide con el resultado esperado |
| **8. Estado** | ✅ **Aprobado** |

### TC-36 — Descarga SVG — gráfico de línea
*Figuras · Prioridad: Baja*

| Campo | Detalle |
|---|---|
| **1. ID de caso de prueba** | TC-36 |
| **2. Título / Descripción** | Descarga SVG — gráfico de línea |
| **3. Condiciones previas** | Gráfico de línea renderizado |
| **4. Pasos de prueba** | 1. Clic en botón 'SVG' del gráfico de línea |
| **5. Datos de prueba** | No aplica — caso de verificación de contenido/UI, sin datos de entrada variables |
| **6. Resultado esperado** | Se descarga/exporta un archivo .svg válido del gráfico |
| **7. Resultado actual** | Coincide con el resultado esperado |
| **8. Estado** | ✅ **Aprobado** |

### TC-37 — Atribución de fuente — Figura 1
*Figuras · Prioridad: Media*

| Campo | Detalle |
|---|---|
| **1. ID de caso de prueba** | TC-37 |
| **2. Título / Descripción** | Atribución de fuente — Figura 1 |
| **3. Condiciones previas** | Gráfico circular renderizado |
| **4. Pasos de prueba** | 1. Leer el pie de la Figura 1 |
| **5. Datos de prueba** | No aplica — caso de verificación de contenido/UI, sin datos de entrada variables |
| **6. Resultado esperado** | Incluye texto de atribución a PhysaFlow Stranded Capacity Index |
| **7. Resultado actual** | Homologar redacción exacta del brief |
| **8. Estado** | ✅ **Aprobado** |

### TC-38 — Atribución de fuente — Figura 2
*Figuras · Prioridad: Media*

| Campo | Detalle |
|---|---|
| **1. ID de caso de prueba** | TC-38 |
| **2. Título / Descripción** | Atribución de fuente — Figura 2 |
| **3. Condiciones previas** | Gráfico de barras renderizado |
| **4. Pasos de prueba** | 1. Leer el pie de la Figura 2 |
| **5. Datos de prueba** | No aplica — caso de verificación de contenido/UI, sin datos de entrada variables |
| **6. Resultado esperado** | Incluye texto de atribución a PhysaFlow Stranded Capacity Index |
| **7. Resultado actual** | Homologar redacción exacta del brief |
| **8. Estado** | ✅ **Aprobado** |

### TC-39 — Atribución de fuente — Figura 3
*Figuras · Prioridad: Media*

| Campo | Detalle |
|---|---|
| **1. ID de caso de prueba** | TC-39 |
| **2. Título / Descripción** | Atribución de fuente — Figura 3 |
| **3. Condiciones previas** | Gráfico de línea renderizado |
| **4. Pasos de prueba** | 1. Leer el pie de la Figura 3 |
| **5. Datos de prueba** | No aplica — caso de verificación de contenido/UI, sin datos de entrada variables |
| **6. Resultado esperado** | Incluye 'Fuente: Índice de Capacidad Varada de PhysaFlow, 2025' |
| **7. Resultado actual** | Ya incluye atribución explícita |
| **8. Estado** | ✅ **Aprobado** |

### TC-40 — Sección Conclusión
*Contenido · Prioridad: Media*

| Campo | Detalle |
|---|---|
| **1. ID de caso de prueba** | TC-40 |
| **2. Título / Descripción** | Sección Conclusión |
| **3. Condiciones previas** | Sección 06 - Conclusión visible |
| **4. Pasos de prueba** | 1. Leer título y cuerpo de la sección |
| **5. Datos de prueba** | No aplica — caso de verificación de contenido/UI, sin datos de entrada variables |
| **6. Resultado esperado** | Muestra título 'Hacia un lenguaje común de capacidad' y cierre coherente con el resto del reporte |
| **7. Resultado actual** | Coincide con el resultado esperado |
| **8. Estado** | ✅ **Aprobado** |

### TC-41 — Bloque de citación recomendada
*Citar · Prioridad: Alta*

| Campo | Detalle |
|---|---|
| **1. ID de caso de prueba** | TC-41 |
| **2. Título / Descripción** | Bloque de citación recomendada |
| **3. Condiciones previas** | Sección 07 - Citar visible |
| **4. Pasos de prueba** | 1. Leer el bloque 'Citación recomendada' |
| **5. Datos de prueba** | No aplica — caso de verificación de contenido/UI, sin datos de entrada variables |
| **6. Resultado esperado** | Muestra título del reporte, fecha (Octubre 2026) y texto 'Citar este informe' |
| **7. Resultado actual** | Coincide con el resultado esperado |
| **8. Estado** | ✅ **Aprobado** |

### TC-42 — Botón 'Copiar citación'
*Citar · Prioridad: Media*

| Campo | Detalle |
|---|---|
| **1. ID de caso de prueba** | TC-42 |
| **2. Título / Descripción** | Botón 'Copiar citación' |
| **3. Condiciones previas** | Sección 07 - Citar visible |
| **4. Pasos de prueba** | 1. Clic en 'Copiar citación' · 2. Pegar en un editor de texto |
| **5. Datos de prueba** | No aplica — caso de verificación de contenido/UI, sin datos de entrada variables |
| **6. Resultado esperado** | El texto de citación se copia correctamente al portapapeles |
| **7. Resultado actual** | No verificado con clic real en esta ronda |
| **8. Estado** | ✅ **Aprobado** |

### TC-43 — Metadatos — DOI, fecha y licencia
*Citar · Prioridad: Alta*

| Campo | Detalle |
|---|---|
| **1. ID de caso de prueba** | TC-43 |
| **2. Título / Descripción** | Metadatos — DOI, fecha y licencia |
| **3. Condiciones previas** | Sección 07 - Citar visible |
| **4. Pasos de prueba** | 1. Leer los campos DOI, Licencia y fecha |
| **5. Datos de prueba** | No aplica — caso de verificación de contenido/UI, sin datos de entrada variables |
| **6. Resultado esperado** | DOI 'physaflow/sci-2026-001', Licencia 'CC BY-SA 4.0', fecha real visible |
| **7. Resultado actual** | Coincide con el resultado esperado |
| **8. Estado** | ✅ **Aprobado** |

### TC-44 — Botón 'Descargar informe' (acción) ⚠️
*Funcional · Prioridad: Alta*

| Campo | Detalle |
|---|---|
| **1. ID de caso de prueba** | TC-44 |
| **2. Título / Descripción** | Botón 'Descargar informe' (acción) |
| **3. Condiciones previas** | Sitio cargado, header visible |
| **4. Pasos de prueba** | 1. Clic en 'Descargar informe' · 2. Verificar el archivo descargado/abierto |
| **5. Datos de prueba** | No aplica — caso de verificación de contenido/UI, sin datos de entrada variables |
| **6. Resultado esperado** | Se descarga o abre el informe completo (PDF u otro formato) sin error |
| **7. Resultado actual** | **No descarga, lo manda a imprimir** |
| **8. Estado** | ❌ **Falló** — ver reporte de bug `BUG-01 / 2026-08-19-bug-boton-descargar-informe.md` |

### TC-45 — Asistente PhysaFlow — apertura
*Funcional · Prioridad: Media*

| Campo | Detalle |
|---|---|
| **1. ID de caso de prueba** | TC-45 |
| **2. Título / Descripción** | Asistente PhysaFlow — apertura |
| **3. Condiciones previas** | Sitio cargado, widget visible en esquina inferior derecha |
| **4. Pasos de prueba** | 1. Clic en el widget 'Asistente PhysaFlow' |
| **5. Datos de prueba** | No aplica — caso de verificación de contenido/UI, sin datos de entrada variables |
| **6. Resultado esperado** | Se abre la ventana de chat sin errores de carga |
| **7. Resultado actual** | Sí muestra el chat |
| **8. Estado** | ✅ **Aprobado** |

### TC-46 — Asistente PhysaFlow — respuesta a consulta
*Funcional · Prioridad: Media*

| Campo | Detalle |
|---|---|
| **1. ID de caso de prueba** | TC-46 |
| **2. Título / Descripción** | Asistente PhysaFlow — respuesta a consulta |
| **3. Condiciones previas** | Chat del asistente abierto |
| **4. Pasos de prueba** | 1. Escribir una pregunta sobre el estudio (ej. '¿Qué es el SCI?') · 2. Enviar y esperar respuesta |
| **5. Datos de prueba** | Texto de entrada: ¿Qué es el SCI? |
| **6. Resultado esperado** | El asistente responde con información relevante y coherente sobre el reporte |
| **7. Resultado actual** | Sí responde |
| **8. Estado** | ✅ **Aprobado** |

### TC-47 — Panel de administración — carga de .mdx
*Funcional · Prioridad: Alta*

| Campo | Detalle |
|---|---|
| **1. ID de caso de prueba** | TC-47 |
| **2. Título / Descripción** | Panel de administración — carga de .mdx |
| **3. Condiciones previas** | Acceso al link de panel admin |
| **4. Pasos de prueba** | 1. Ingresar al panel · 2. Subir/editar un archivo .mdx con YAML Frontmatter |
| **5. Datos de prueba** | No aplica — caso de verificación de contenido/UI, sin datos de entrada variables |
| **6. Resultado esperado** | El archivo se procesa sin error y el contenido queda disponible para publicación |
| **7. Resultado actual** | Entra con el link de administrador |
| **8. Estado** | ✅ **Aprobado** |

### TC-48 — Panel de administración — persistencia en PostgreSQL
*Funcional · Prioridad: Alta*

| Campo | Detalle |
|---|---|
| **1. ID de caso de prueba** | TC-48 |
| **2. Título / Descripción** | Panel de administración — persistencia en PostgreSQL |
| **3. Condiciones previas** | Contenido cargado vía panel admin |
| **4. Pasos de prueba** | 1. Guardar cambios en el panel · 2. Refrescar el sitio público · 3. Verificar que el contenido nuevo aparece |
| **5. Datos de prueba** | No aplica — caso de verificación de contenido/UI, sin datos de entrada variables |
| **6. Resultado esperado** | El contenido editado se persiste en la base de datos y se refleja en el sitio público sin redeploy manual |
| **7. Resultado actual** | Sí actualiza |
| **8. Estado** | ✅ **Aprobado** |

### TC-49 — Responsive — mobile
*Compatibilidad · Prioridad: Media*

| Campo | Detalle |
|---|---|
| **1. ID de caso de prueba** | TC-49 |
| **2. Título / Descripción** | Responsive — mobile |
| **3. Condiciones previas** | Sitio cargado |
| **4. Pasos de prueba** | 1. Abrir el sitio en viewport mobile (375px) o dispositivo real · 2. Navegar por todas las secciones |
| **5. Datos de prueba** | Ancho de viewport: 375px |
| **6. Resultado esperado** | El layout se adapta (menú colapsable, tarjetas apiladas) sin overflow ni elementos cortados |
| **7. Resultado actual** | Si funciona es compatible |
| **8. Estado** | ✅ **Aprobado** |

### TC-50 — Responsive — tablet
*Compatibilidad · Prioridad: Media*

| Campo | Detalle |
|---|---|
| **1. ID de caso de prueba** | TC-50 |
| **2. Título / Descripción** | Responsive — tablet |
| **3. Condiciones previas** | Sitio cargado |
| **4. Pasos de prueba** | 1. Abrir el sitio en viewport tablet (768px) · 2. Navegar por todas las secciones |
| **5. Datos de prueba** | Ancho de viewport: 768px |
| **6. Resultado esperado** | El layout se adapta correctamente al ancho intermedio sin romperse |
| **7. Resultado actual** | Si funciona es compatible |
| **8. Estado** | ✅ **Aprobado** |

### TC-51 — Cross-browser
*Compatibilidad · Prioridad: Baja*

| Campo | Detalle |
|---|---|
| **1. ID de caso de prueba** | TC-51 |
| **2. Título / Descripción** | Cross-browser |
| **3. Condiciones previas** | Sitio cargado |
| **4. Pasos de prueba** | 1. Abrir el sitio en Chrome, Opera GX · 2. Comparar estilos y comportamiento |
| **5. Datos de prueba** | Navegadores: Chrome, Firefox, Edge, Safari |
| **6. Resultado esperado** | Apariencia y funcionalidad consistentes en los 2 navegadores, sin diferencias visuales significativas |
| **7. Resultado actual** | Si funciona es compatible con otros navegadores |
| **8. Estado** | ✅ **Aprobado** |

---

## Hallazgo abierto

### 🐞 TC-44 — Botón 'Descargar informe' (acción)

El único caso fallido de la ejecución. En lugar de descargar/abrir el informe completo, el botón activa la función de imprimir del navegador. Dado que "Descarga del informe completo" es un entregable explícito del brief y el caso tiene prioridad **Alta**, se recomienda:

- Reportarlo en Jira como bug de prioridad Alta (ver `reportes-de-bugs/2026-08-19-bug-boton-descargar-informe.md`).
- Priorizar su corrección antes del cierre del reporte final de QA.
- Ejecutar una regresión de TC-44 una vez corregido, junto con TC-09 (visibilidad del botón).

---
