# QA Documentation & Test Reports

Bienvenido a la sección de **Quality Assurance (QA)** del proyecto **PhysaFlow**.

Este directorio está destinado a almacenar toda la documentación relativa a pruebas, reportes de bugs, planes de pruebas y evidencias del proceso de QA.

---

## 📁 Estructura del Directorio

Se sugiere organizar los archivos dentro de este directorio según el tipo de prueba:

```text
QA/
├── README.md                 # Guía general e instrucciones de QA
├── manual/                   # Documentación y reportes de pruebas manuales
│   ├── test-cases.md         # Casos de prueba manuales (Criterios de aceptación, flujos)
│   ├── bug-reports/          # Reportes detallados de bugs encontrados
│   └── execution-reports/    # Informes y matriz de resultados de ejecuciones manuales
└── automated/                # Documentación y evidencias de pruebas automatizadas
    ├── plan.md               # Estrategia y alcance de automatización (E2E, API, etc.)
    └── reports/              # Reportes o exportaciones de resultados automatizados
```

---

## 📋 Pruebas Manuales (Manual QA)

Las pruebas manuales forman una parte fundamental en el flujo de desarrollo del proyecto.

### ¿Qué registrar aquí?
1. **Casos de prueba (Test Cases)**: Matriz con pasos a reproducir, datos de entrada y resultado esperado.
2. **Reportes de Bugs**: Detalle de hallazgos con pasos para reproducir, severidad, evidencia (capturas/videos) y comportamiento observado vs. esperado.
3. **Checklists de Regresión**: Listado rápido de chequeos previos a cada release o merge a `main`.

---

## 🤖 Pruebas Automatizadas (Automated QA)

Aunque el enfoque actual incluye pruebas manuales, el proyecto está preparado para incorporar automatización.

### Cobertura sugerida para automatización:
- **API Testing**: Pruebas de integración de endpoints (e.g. con Postman, Bruno o Playwright API).
- **E2E Testing**: Flujos críticos de usuario (Navegación en dashboard, creación y edición de reportes).
- **Component & Unit Testing**: Pruebas de componentes clave de la UI.

---

## 🚀 Buenas Prácticas para Subir Documentación

1. **Formatos preferidos**: Utilizar archivos Markdown (`.md`) para documentación legible directamente en GitHub.
2. **Imágenes y Evidencias**: Guardar imágenes o capturas dentro de una subcarpeta `assets/` o adjuntarlas en los reportes de bugs.
3. **Nombres de archivos claros**: Usar nombres descriptivos en minúsculas separados por guiones (ej. `2026-08-19-reporte-regresion-dashboard.md`).
