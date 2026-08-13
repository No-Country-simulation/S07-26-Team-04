# PhysaFlow — Stranded Capacity Report

## Equipo

| Nombre | Rol | LinkedIn |
|--------|-----|----------|
| Hernán Guido Gustavo Casasola | Tech Lead | [LinkedIn](https://www.linkedin.com/in/hernan-casasola/) |
| Sergio Zuñiga Fraga | Frontend Developer | [LinkedIn](https://www.linkedin.com/in/sergio-zuniga-fraga/) |
| Elias Milano | Frontend Developer | [LinkedIn](https://www.linkedin.com/in/elias-milano/) |
| Erika Helfenstern | Frontend Developer | [LinkedIn](https://www.linkedin.com/in/hevieri/) |
| Gabriela Celeste Garcia Retamar | Backend Developer | — |
| Alexis Albarenga | Backend Developer | [LinkedIn](https://www.linkedin.com/in/alexisalbarenga/) |
| Orlando Cárdenas | Backend Developer | [LinkedIn](https://www.linkedin.com/in/orlandocardenasvillegas/) |
| Andrés Adrian Estrada Uzeda | QA Engineer | [LinkedIn](https://www.linkedin.com/in/estrada-uzeda-andres-adrian-9b53013a5/) |

## Descripción del Proyecto

Sitio web del reporte público de PhysaFlow sobre **stranded capacity** — el desperdicio de capacidad en data centers que ocurre cuando las capas físicas y operativas no se coordinan entre sí.

PhysaFlow busca posicionarse como la voz más autorizada del mundo sobre este problema. Este reporte presenta una taxonomía de las formas que toma la stranded capacity en tres capas: facility (energía y cooling), IT (infraestructura) y workload (scheduling).

No es un blog ni una landing page — es un documento de referencia de la industria con diseño moderno y autoridad académica. El contenido del reporte se gestiona dinámicamente cargando archivos `.mdx` con formato YAML Frontmatter desde un panel de administración directamente a la base de datos PostgreSQL.

## Tecnologías

* **Frontend:** Next.js (App Router), React, TypeScript y Tailwind CSS.
* **Base de Datos & ORM:** PostgreSQL y Prisma (esquema unificado usando campos JSON nativos).
* **Parser de Contenido:** gray-matter.

## Instalación y Ejecución

Las instrucciones para correr el servidor de desarrollo y configurar las variables de entorno están descritas en el archivo [README.md del prototipo](file:///c:/Users/Hernan/Documents/GitHub/PhysaFlow-S07-26-Team-04/prototype/README.md).
