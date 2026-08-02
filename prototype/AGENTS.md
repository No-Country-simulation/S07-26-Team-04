<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# PhysaFlow Prototype - Agent Guidelines

Bienvenido al prototipo de **PhysaFlow**. Este documento guiará a los asistentes de IA en la arquitectura, comandos y estándares del proyecto.

## 🛠️ Comandos Principales (Ejecutar desde `prototype/`)

- **Desarrollo:** `pnpm dev`
- **Compilación / Validación:** `pnpm build`
- **Linter:** `pnpm lint`
- **Base de datos (Prisma):** 
  - `npx prisma db push`
  - `npx prisma db seed`
  - `npx prisma studio`

---

## 📐 Convenciones de Arquitectura y Código

1. **Next.js App Router:**
   - Rutas dinámicas en `app/reports/[id]/` y `app/reports/[id]/[slug]/`.
   - API RESTful bajo `app/api/reports/`.
2. **MDX & Gráficos:**
   - Renderizado dinámico de reportes mediante componentes modulares en `components/charts/` (`BarChartComponent`, `LineChartComponent`, `PieChartComponent`).
   - Los componentes de visualización deben exportar interfaces de datos tipadas.
3. **Base de Datos:**
   - Prisma ORM con SQLite (`prisma/dev.db`).
   - Validaciones con Zod en `lib/report-schema.ts`.

---

## 📌 Reglas de Commits
Para cualquier modificación, seguir la Skill en `.gemini/skills/smart-commit/SKILL.md` ejecutando commits atómicos según la capa modificada (`feat(db)`, `refactor(api)`, `feat(ui)`, `feat(app)`, `chore(deps)`).
