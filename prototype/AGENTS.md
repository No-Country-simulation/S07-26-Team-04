<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# PhysaFlow Prototype - Agent Guidelines

Bienvenido al prototipo de **PhysaFlow**. Este documento establece los estándares de arquitectura, herramientas y diseño para cualquier asistente de IA en este proyecto.

---

## 🛠️ 1. Comandos del Entorno (Ejecutar desde `/prototype`)

- **Desarrollo:** `pnpm dev` (servidor local en `http://localhost:3000`)
- **Verificación:** `pnpm build` (SIEMPRE ejecutar antes de dar por terminada una tarea)
- **Calidad:** `pnpm lint`
- **Base de Datos (Prisma):**
  - Actualizar esquema: `pnpm prisma db push` o `npx prisma db push`
  - Cargar semillas: `npx prisma db seed`
  - Explorador GUI: `npx prisma studio`

---

## 📐 2. Convenciones de Arquitectura

1. **Next.js App Router (Next.js 16+):**
   - Rutas públicas y dinámicas: `/reports/[id]` y `/reports/[id]/[slug]`.
   - Panel de administración: `/admin`.
   - API RESTful: `/api/reports`, `/api/reports/[id]`, `/api/reports/seed`, `/api/reports/upload`.
2. **Server Components vs Client Components:**
   - Mantener las páginas como Server Components por defecto.
   - Usar `'use client'` estrictamente en componentes interactivos que utilicen hooks (`useState`, `useEffect`) o librerías dinámicas como `recharts` / `lucide-react`.
3. **Validación de Datos & Prisma:**
   - Base de datos local: SQLite (`prisma/dev.db`).
   - Esquemas de validación centralizados con Zod en `lib/report-schema.ts`.
4. **Visualizaciones & MDX:**
   - Componentes de gráficos aislados en `components/charts/` (`BarChartComponent`, `LineChartComponent`, `PieChartComponent`).
   - Editor e intérprete dinámico MDX en `components/MdxEditor.tsx` y `components/DynamicReportContent.tsx`.

---

## 🎨 3. Diseño y Estilos (Design System)

- **Styling:** Vanilla CSS (`globals.css` / CSS Modules). EVITAR instalar TailwindCSS a menos que se solicite explícitamente.
- **Estética Premium:** Priorizar paletas oscuras, vidriado (*glassmorphism*), micro-animaciones en hover y tipografías modernas (Google Fonts: Inter / Outfit).
- **Sin Placeholders:** No usar imágenes de marcador de posición estáticas.

---

## 📌 4. Estrategia de Commits y Calidad

1. **Commits Atómicos:** Respetar la Skill de Antigravity IDE ubicada en `.gemini/skills/smart-commit/SKILL.md`.
2. **Convención:** Usar `feat(db)`, `refactor(api)`, `feat(ui)`, `feat(app)` o `chore(deps)`.
3. **Cero Parches Superficiales:** Inspeccionar logs completos ante fallos de build o tipos. Nunca omitir o silenciar excepciones sin corregir la causa raíz.
