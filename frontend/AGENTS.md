<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

## Estrategia de Commits y Calidad

1. **Commits Atómicos:** Respetar la Skill de Antigravity IDE ubicada en `.gemini/skills/smart-commit/SKILL.md`.
2. **Convención:** Usar `feat(db)`, `refactor(api)`, `feat(ui)`, `feat(app)` o `chore(deps)`.
3. **Cero Parches Superficiales:** Inspeccionar logs completos ante fallos de build o tipos. Nunca omitir o silenciar excepciones sin corregir la causa raíz.
4. **Instrucción de Commits:** No realizar commits automáticos sin la solicitud explícita del usuario.