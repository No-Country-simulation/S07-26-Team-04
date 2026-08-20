# QA Documentation & Test Reports

Bienvenido a la sección de **Quality Assurance (QA)** del proyecto **PhysaFlow**.

Este directorio está reservado para almacenar toda la documentación, evidencias y reportes del proceso de **QA Manual**.

---

## Estructura del Directorio

El trabajo de QA está organizado principalmente para pruebas manuales, manteniendo una estructura clara y limpia:

```text
QA/
├── README.md                 # Guía general e instrucciones de QA
├── TEST_PLAN.md               # Plan de pruebas del proyecto
├── casos-de-prueba/           # Casos de prueba manuales (escenarios, criterios de aceptación)
├── reportes-de-bugs/          # Reportes detallados de errores/bugs encontrados
├── listas-de-chequeo/         # Checklists de regresión previa a lanzamientos
└── evidencias/                # Capturas de pantalla, videos y logs de respaldo
```

---

## Proceso de QA Manual

El QA responsable llevará a cabo las pruebas de manera manual sobre los flujos del sistema:

### 1. Casos de Prueba (`casos-de-prueba/`)
- Documentar los escenarios a probar (p. ej. creación de reportes, autenticación, edición en MDX).
- Incluir pasos a reproducir, datos de entrada y **resultado esperado**.

### 2. Reportes de Bugs (`reportes-de-bugs/`)
Cuando se detecte una falla durante la prueba manual, registrar un reporte con:
- **Título breve del bug**
- **Pasos para reproducir**
- **Comportamiento observado vs. Comportamiento esperado**
- **Prioridad / Severidad** (Baja, Media, Alta, Crítica)
- Enlace a la evidencia en `evidencias/`

### 3. Listas de Chequeo / Regresión (`listas-de-chequeo/`)
- Verificaciones rápidas de humo (Smoke Tests) antes de realizar merges a la rama `main` o desplegar a producción.

---

## Buenas Prácticas de Entrega

1. **Uso de Markdown (`.md`)**: Redactar todos los documentos en formato Markdown para su correcta lectura en GitHub.
2. **Evidencias claras**: Almacenar imágenes o videos en la carpeta `evidencias/` y enlazarlos en el reporte correspondiente.
3. **Nombres de archivos descriptivos**: Usar formato `YYYY-MM-DD-nombre-del-reporte.md` (ejemplo: `2026-08-19-bug-editor-mdx.md`).

---

## Estado actual de QA

| Total de casos | Aprobados | Fallaron | Bloqueados |
|---|---|---|---|
| 51 | 50 | 1 | 0 |

**Bugs abiertos:**
- [`2026-08-19-bug-boton-descargar-informe.md`](./reportes-de-bugs/2026-08-19-bug-boton-descargar-informe.md) — Botón 'Descargar informe' dispara Imprimir en lugar de descargar (TC-44, Prioridad Alta).