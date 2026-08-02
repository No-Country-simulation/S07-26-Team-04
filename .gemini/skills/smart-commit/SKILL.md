---
name: smart-commit
description: Skill de Antigravity IDE para realizar commits atómicos, organizados por capas de arquitectura y siguiendo la convención Conventional Commits en repositorios TypeScript/Next.js/Prisma.
---

# Smart Commit - Estrategia de Commits Atómicos y Capas

Esta Skill define el procedimiento para auditar, clasificar y ejecutar commits atómicos y estructurados en Antigravity IDE.

## Principios Fundamentales
1. **Atomicidad:** Cada commit debe contener solo cambios relacionados con una única responsabilidad o dominio (DB, API, UI, App, Config).
2. **Conventional Commits:** Seguir estrictamente la especificación `tipo(scope): descripción`.
3. **Validación Pre-commit:** Asegurar que el código pase el linter (`pnpm lint` o `npm run lint`) y construya correctamente (`pnpm build` o `npm run build`) antes de comprometer los cambios.
4. **Prohibido `git add .` global:** Nunca agregar todo en un solo bloque si hay múltiples capas afectadas.

---

## Flujo de Trabajo en Antigravity IDE

### 1. Inspección e Diagnóstico
Ejecutar siempre en el shell del workspace:
```bash
git status
git diff --stat
```
Para entender los archivos modificados, eliminados y sin seguimiento (*untracked*).

### 2. Matriz de Clasificación por Capas y Scopes

| Capa / Dominio | Rutas típicas | Scope Recomendado | Tipo de Commit |
| :--- | :--- | :--- | :--- |
| **Base de Datos & Esquema** | `prisma/schema.prisma`, `prisma/seed.ts`, `lib/schema.ts` | `feat(db)` / `fix(db)` | `feat` / `fix` / `refactor` |
| **API & Backend** | `app/api/**`, `server/**`, `controllers/**` | `feat(api)` / `refactor(api)` | `feat` / `refactor` |
| **Componentes & UI** | `components/**`, `styles/**`, `public/**` | `feat(ui)` / `style(ui)` | `feat` / `refactor` / `style` |
| **Rutas & Vistas (App)** | `app/**/page.tsx`, `pages/**` | `feat(app)` / `fix(app)` | `feat` / `fix` |
| **Configuraciones & Deps** | `package.json`, `package-lock.json`, `.env.example` | `chore(deps)` / `chore(config)` | `chore` / `build` |

---

## Pasos de Ejecución Estándar

### Paso 1: Staging Específico por Capa
Agrega los archivos pertenecientes a un mismo dominio de forma explícita:
```bash
git add <rutas-del-dominio>
```

### Paso 2: Validación del Staging
Verifica qué archivos han quedado preparados:
```bash
git status
```

### Paso 3: Commit Formalizado
Ejecuta el commit correspondiente en modo imperativo y conciso:
```bash
git commit -m "tipo(scope): descripción concisa en minúsculas"
```

### Paso 4: Repetición
Repite los Pasos 1 a 3 para cada capa/dominio restante hasta que `git status` reporte `working tree clean`.

---

## Ejemplo Práctico de Secuencia

```bash
# 1. Base de datos
git add prototype/prisma/schema.prisma prototype/prisma/seed.ts
git commit -m "feat(db): update prisma models and seed script"

# 2. Rutas de API
git add prototype/app/api/reports/
git commit -m "refactor(api): restructure report routes into RESTful endpoints"

# 3. Componentes de UI
git add prototype/components/Chart.tsx prototype/components/charts/
git commit -m "feat(ui): add modular chart components and MDX renderer"

# 4. Páginas de la Aplicación
git add prototype/app/admin/page.tsx prototype/app/reports/
git commit -m "feat(app): add report viewer page and update admin panel"

# 5. Dependencias y Configuración
git add prototype/package.json prototype/package-lock.json
git commit -m "chore(deps): update npm packages and lockfile"
```
