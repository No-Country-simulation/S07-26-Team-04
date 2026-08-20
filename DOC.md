# PhysaFlow — Stranded Capacity Report

> Plataforma interactiva de referencia industrial sobre **Stranded Capacity** en Data Centers.

[![Deploy](https://img.shields.io/badge/Deploy-Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://demo-s07-26-team-04.vercel.app/)

[![Repo](https://img.shields.io/badge/Repositorio-GitHub-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/No-Country-simulation/S07-26-Team-04)

[![Next.js](https://img.shields.io/badge/Next.js_16-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)](https://nextjs.org/)

[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)

[![Prisma](https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge&logo=prisma&logoColor=white)](https://www.prisma.io/)


---

## 🔗 Enlaces


 **Deploy**: [https://demo-s07-26-team-04.vercel.app/](https://demo-s07-26-team-04.vercel.app/) 

 **Repositorio**:  [https://github.com/No-Country-simulation/S07-26-Team-04](https://github.com/No-Country-simulation/S07-26-Team-04) 

---

##  Descripción del Proyecto

**PhysaFlow** es un documento de referencia de la industria sobre *Stranded Capacity* — el desperdicio de capacidad que ocurre en los Data Centers cuando las capas físicas y operativas no se coordinan entre sí.



### Funcionalidades Principales

- **Reporte Interactivo** — Contenido estructurado con gráficos dinámicos descargables en formato PNG.
- **Asistente IA** — Chat en tiempo real para consultar el reporte con modelos Google Gemini y DeepSeek.
- **Dashboard de Administración** — Editor MDX con soporte YAML Frontmatter para actualizar el reporte sin tocar el código fuente.
- **Diseño Premium** — Interfaz 100% responsiva, con animaciones fluidas y splash loader animado.
- **Gestión de Contenido** — Reportes gestionados dinámicamente en base de datos PostgreSQL (Neon).

---

##  Stack Tecnológico

### Frontend


- [Next.js](https://nextjs.org/) | 16.3.0 | Framework React con App Router |
- [React](https://react.dev/) | 19.2.4 | UI Library |
- [TypeScript](https://www.typescriptlang.org/) | ^5.9 | Tipado estático |
-  [Tailwind CSS](https://tailwindcss.com/) | ^4.3 | Estilos utilitarios |
- [Motion](https://motion.dev/) | ^13.1 | Animaciones |
 - [Recharts](https://recharts.org/) | ^3.10 | Gráficos interactivos |
 - [shadcn/ui](https://ui.shadcn.com/) | ^4.16 | Componentes accesibles |
- [CodeMirror](https://codemirror.net/) | ^6 | Editor MDX/YAML en dashboard |

### Backend & Datos


- [Prisma ORM](https://www.prisma.io/) | ORM y migraciones de esquema 
 - [PostgreSQL (Neon)](https://neon.tech/) | Base de datos serverless 
 - [Vercel AI SDK](https://sdk.vercel.ai/) | Integración de modelos LLM 
 - [gray-matter](https://github.com/jonschlinkert/gray-matter) | Parser de YAML Frontmatter en MDX 

### Infraestructura

- [Vercel](https://vercel.com/) | Deploy y hosting |
- [Neon](https://neon.tech/) | PostgreSQL serverless |

---

##  Equipo

- Hernán Guido Gustavo Casasola | Tech Lead | [LinkedIn](https://www.linkedin.com/in/hernan-casasola/) 
- Sergio Zuñiga Fraga | Frontend Developer | [LinkedIn](https://www.linkedin.com/in/sergio-zuniga-fraga/) 
- Erika Helfenstern | Frontend Developer | [LinkedIn](https://www.linkedin.com/in/hevieri/)
- Alexis Albarenga | Backend Developer | [LinkedIn](https://www.linkedin.com/in/alexisalbarenga/) 
- Andrés Adrian Estrada Uzeda | QA Engineer | [LinkedIn](https://www.linkedin.com/in/estrada-uzeda-andres-adrian-9b53013a5/) 

---

## 📁 Estructura del Proyecto

```
S07-26-Team-04/
├── frontend/               # Aplicación Next.js principal
│   ├── app/
│   │   ├── api/            # API Routes (chat IA, reportes)
│   │   ├── dashboard/      # Panel de administración con editor MDX
│   │   └── report/         # Vista pública del reporte
│   ├── components/         # Componentes React reutilizables
│   ├── lib/                # Utilidades, seed, helpers
│   ├── prisma/             # Esquema y migraciones de la base de datos
│   ├── services/           # Servicios de acceso a datos
│   └── types/              # Tipos TypeScript globales
├── QA/                     # Documentación de testing y QA
└── prototype/              # Prototipo inicial de referencia
```




---

*Proyecto desarrollado en el marco del programa de simulación laboral **No Country** — Cohorte S07.*