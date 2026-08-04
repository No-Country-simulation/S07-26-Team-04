import { NextResponse } from "next/server";

/**
 * Página de documentación interactiva de la API (Swagger UI).
 * Sirve HTML autocontenido que carga la spec desde /openapi.yaml.
 * Ruta: /swagger
 */
export function GET() {
  const html = `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>PhysaFlow API — Swagger UI</title>
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/swagger-ui-dist@5/swagger-ui.css" />
  <style>
    :root {
      --paper: #f7f4ec;
      --paper-2: #fbf9f3;
      --ink: #1a1814;
      --ink-muted: #5c5a4d;
      --forest-700: #143a26;
      --forest-800: #0d2818;
      --gold-500: #c9a961;
      --rule: #d8d2c0;
    }
    * { box-sizing: border-box; }
    body {
      margin: 0;
      background: var(--paper);
      color: var(--ink);
      font-family: "Inter", -apple-system, "Segoe UI", sans-serif;
    }
    .pf-header {
      background: var(--forest-800);
      color: var(--paper-2);
      padding: 18px 28px;
      display: flex;
      align-items: baseline;
      gap: 14px;
      border-bottom: 2px solid var(--gold-500);
    }
    .pf-header h1 {
      margin: 0;
      font-family: Georgia, "Times New Roman", serif;
      font-weight: 600;
      font-size: 20px;
      letter-spacing: 0.02em;
    }
    .pf-header .pf-sub {
      font-size: 12px;
      color: var(--gold-500);
      letter-spacing: 0.14em;
      text-transform: uppercase;
    }
    .pf-header a {
      margin-left: auto;
      color: var(--paper-2);
      font-size: 13px;
      text-decoration: none;
      border: 1px solid var(--gold-500);
      border-radius: 4px;
      padding: 5px 10px;
      transition: background 0.15s;
    }
    .pf-header a:hover { background: var(--forest-700); }
    #swagger-ui { max-width: 1200px; margin: 0 auto; padding: 12px 20px 60px; }
    .swagger-ui .info .title { color: var(--ink); }
    .swagger-ui .scheme-container { background: var(--paper-2); border-radius: 6px; }
    .swagger-ui .opblock-tag { color: var(--forest-800); }
    .swagger-ui .topbar { display: none; }
  </style>
</head>
<body>
  <div class="pf-header">
    <h1>PhysaFlow — API Reference</h1>
    <span class="pf-sub">Prototype v0.1.0 · OpenAPI 3.0</span>
    <a href="/openapi.yaml" download="openapi.yaml">Descargar spec (YAML)</a>
  </div>
  <div id="swagger-ui"></div>
  <script src="https://cdn.jsdelivr.net/npm/swagger-ui-dist@5/swagger-ui-bundle.js"></script>
  <script>
    window.addEventListener("DOMContentLoaded", function () {
      window.ui = SwaggerUIBundle({
        url: "/openapi.yaml",
        dom_id: "#swagger-ui",
        deepLinking: true,
        displayRequestDuration: true,
        presets: [SwaggerUIBundle.presets.apis],
        layout: "BaseLayout",
      });
    });
  </script>
</body>
</html>`;

  return new NextResponse(html, {
    headers: { "Content-Type": "text/html; charset=utf-8" },
  });
}
