<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# PhysaFlow Prototype - Agent Guidelines

Bienvenido al prototipo de **PhysaFlow**. Este documento establece la arquitectura, diseño e instrucciones técnicas requeridas para cualquier asistente de IA que trabaje en este repositorio.

---

## 1. Comandos del Entorno (Ejecutar desde `/prototype`)

- **Desarrollo:** `pnpm dev` (servidor local en `http://localhost:3000`)
- **Verificación:** `pnpm build` (SIEMPRE ejecutar antes de confirmar cualquier trabajo)
- **Calidad:** `pnpm lint`
- **Base de Datos (Prisma):**
  - Actualizar esquema: `pnpm prisma db push` o `npx prisma db push`
  - Cargar semillas: `npx prisma db seed`
  - Explorador GUI: `npx prisma studio`

---

## 2. Sistema de Diseño e Identidad Visual (PhysaFlow Design System)

PhysaFlow debe verse como un **documento de referencia e investigación científica de alta gama**, con estética editorial refinada (estilo *Paper & Ink* con detalles en verde bosque y oro).

### A. Paleta de Colores Oficial (CSS Variables / Tailwind)
- **Fondo Táctil (Paper):** `var(--paper)` (`#f7f4ec`), `var(--paper-2)` (`#fbf9f3`)
- **Tinta / Texto (Ink):** `var(--ink)` (`#1a1814`), `var(--ink-muted)` (`#5c5a4d`), `var(--ink-soft)` (`#8a8775`)
- **Verde Bosque (Forest):** `var(--forest-900)` (`#0a1f15`), `var(--forest-800)` (`#0d2818`), `var(--forest-700)` (`#143a26`)
- **Detalles Dorados (Gold):** `var(--gold-500)` (`#c9a961`), `var(--gold-400)` (`#d9bc7a`), `var(--gold-700)` (`#8a6f2e`)
- **Reglas / Separadores:** `var(--rule)` (`#d8d2c0`), `var(--rule-soft)` (`#e7e1cf`)

### B. Tipografías Oficiales (Google Fonts)
- **Títulos y Capitulares (`font-display`):** `'Fraunces'`, serif.
- **Cuerpo Principal:** `'Inter'`, sans-serif.
- **Telemetría y Badges (`font-mono`):** `'JetBrains Mono'`, monospace.

### C. Componentes UI Específicos
- **Tarjetas de Taxonomía:** Usar la clase `.tax-card` con hover border `var(--gold-500)`.
- **Badges de Capa:** `.layer-badge` (`.layer-facility`, `.layer-it`, `.layer-workload`).
- **Números de Sección y Métricas:** Usar `.sec-num` y `.stat-num` con fuente `Fraunces`.
- **Etiquetas de Encabezado:** Usar `.eyebrow` y `.eyebrow-gold` con uppercase y tracking amplio.

---

## 3. Convenciones de Arquitectura y Código

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

## 4. Estrategia de Commits y Calidad

1. **Commits Atómicos:** Respetar la Skill de Antigravity IDE ubicada en `.gemini/skills/smart-commit/SKILL.md`.
2. **Convención:** Usar `feat(db)`, `refactor(api)`, `feat(ui)`, `feat(app)` o `chore(deps)`.
3. **Cero Parches Superficiales:** Inspeccionar logs completos ante fallos de build o tipos. Nunca omitir o silenciar excepciones sin corregir la causa raíz.
4. **Instrucción de Commits:** No realizar commits automáticos sin la solicitud explícita del usuario.
