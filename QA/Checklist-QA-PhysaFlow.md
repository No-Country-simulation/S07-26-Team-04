# PhysaFlow — Lista de Chequeo QA

**Ambiente:** https://demo-s07-26-team-04.vercel.app/
**QA Engineer:** Andrés Adrian Estrada Uzeda
**Uso:** marcar `[x]` cada ítem al validarlo en cada nuevo despliegue / ronda de regresión.

---

## 🔥 Smoke (Sprint 1)

- [ x] TC-01 — La página principal carga con código 200, sin error 404/500; header con logo 'PhysaFlow' y menú visibles
- [ x] TC-02 — Link 'Resumen' navega a la sección 01 y se resalta en el sidebar
- [ x] TC-03 — Link 'Introducción' navega a la sección 02 y se resalta en el sidebar
- [ x] TC-04 — Link 'Taxonomía' navega a la sección 03 y se resalta en el sidebar
- [ x] TC-05 — Link 'Metodología' navega correctamente y se resalta en el sidebar
- [ x] TC-06 — Link 'Figuras' navega correctamente y se resalta en el sidebar
- [ x] TC-07 — Link 'Conclusión' navega correctamente y se resalta en el sidebar
- [ x] TC-08 — Link 'Citar' navega correctamente y se resalta en el sidebar
- [ x] TC-09 — Botón 'Descargar informe' visible en el header

## 📝 Contenido

- [ x] TC-10 — Resumen: título y subtítulo se renderizan sin placeholders
- [ x] TC-11 — Resumen: bloque SCI (% total) muestra el dato correctamente
- [ x] TC-12 — Resumen: desglose por capa se muestra completo
- [ x] TC-13 — Introducción: texto comparativo PUE vs. SCI presente
- [ x] TC-14 — Introducción: cita textual se renderiza correctamente
- [ x] TC-40 — Sección Conclusión se muestra completa, sin placeholders

## 🗂️ Taxonomía

- [ x] TC-15 — Capa L1 (Instalaciones): nombre distintivo y descripción de operador
- [ x] TC-16 — Capa L2 (TI): nombre distintivo y descripción de operador
- [ x] TC-17 — Capa L3 (Carga de trabajo): nombre distintivo y descripción de operador
- [ x] TC-18 — Modo F-01 (Deriva del pasillo frío) completo
- [ x] TC-19 — Modo F-02 (Sobresuscripción térmica) completo
- [ x] TC-20 — Modo F-03 (Aprovisionamiento en sombra) completo
- [ x] TC-21 — Modo I-01 (Racks comatosos) completo
- [ x] TC-22 — Modo I-02 (Nodos durmientes) completo
- [ x] TC-23 — Modo I-03 (Bloqueo de topología) completo
- [ x] TC-24 — Modo W-01 (Asignaciones huérfanas) completo
- [ x] TC-25 — Modo W-02 (Inanición por afinidad) completo
- [ x] TC-26 — Modo W-03 (Latencia de marea) completo

## 📐 Metodología

- [ x] TC-27 — Nota metodológica visible y completa
- [ x] TC-28 — Progresión de estados de capacidad se muestra correctamente

## 🎨 UI/UX

- [ x] TC-29 — Paleta forest-green y gold aplicada en todo el sitio (no grises/naranjas genéricos)
- [ x] TC-30 — Tipografía, espaciado y autoridad visual correctos; sin mensajes de error visibles

## 📊 Figuras

- [ x] TC-31 — Gráfico de barras 'Capacidad varada por modo' renderiza correctamente
- [ x] TC-32 — Gráfico circular 'Capacidad varada por capa' renderiza correctamente
- [ x] TC-33 — Gráfico de línea 'Capacidad varada acumulada' renderiza correctamente
- [ x] TC-34 — Descarga SVG del gráfico de barras funciona
- [ x] TC-35 — Descarga SVG del gráfico circular funciona
- [ x] TC-36 — Descarga SVG del gráfico de línea funciona
- [ x] TC-37 — Atribución "Source: PhysaFlow Stranded Capacity Index" en Figura 1
- [ x] TC-38 — Atribución "Source: PhysaFlow Stranded Capacity Index" en Figura 2
- [ x] TC-39 — Atribución "Source: PhysaFlow Stranded Capacity Index" en Figura 3

## 📚 Citar

- [ x] TC-41 — Bloque de citación recomendada con formato académico y periodístico
- [ x] TC-42 — Botón 'Copiar citación' funciona
- [ x] TC-43 — Metadatos (DOI, fecha, licencia CC BY-SA 4.0) visibles y correctos

## ⚙️ Funcional

- [ ] TC-44 — Botón 'Descargar informe' descarga/abre el archivo sin error ⚠️ *(pendiente — falló en última ejecución: dispara imprimir en vez de descargar)*
- [ x] TC-45 — Asistente PhysaFlow abre correctamente
- [ x] TC-46 — Asistente PhysaFlow responde consultas sobre el estudio
- [ x] TC-47 — Panel de administración: carga de archivo .mdx funciona
- [ x] TC-48 — Panel de administración: los cambios persisten en PostgreSQL

## 📱 Compatibilidad

- [ x] TC-49 — Responsive correcto en mobile
- [ x] TC-50 — Responsive correcto en tablet
- [ x] TC-51 — Comportamiento consistente entre navegadores (Chrome, Opera GX)

---

## Resumen de última ejecución

| Total | Aprobados | Fallaron | Bloqueados |
|---|---|---|---|
| 51 | 50 | 1 (TC-44) | 0 |

**Pendiente de regresión:** TC-44 — verificar corrección del botón 'Descargar informe' antes de marcar como aprobado.
