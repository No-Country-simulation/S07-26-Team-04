import { PrismaClient, Prisma } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import matter from "gray-matter";
import fs from "fs";
import path from "path";
import { ReporteFrontmatterSchema } from "../lib/reporte-schema";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL no está configurada.");
}

const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("🌱 Iniciando la ingesta de datos iniciales en PostgreSQL...");

  // 1. Asegurar la existencia del Superusuario por defecto
  const adminEmail = process.env.ADMIN_EMAIL || "admin@physaflow.org";
  try {
    const existingUser = await prisma.user.findUnique({
      where: { email: adminEmail },
    });

    if (!existingUser) {
      console.log(`👤 Creando superusuario inicial: ${adminEmail}`);
    } else if (existingUser) {
      console.log(`ℹ️ El superusuario ${adminEmail} ya está configurado en PostgreSQL.`);
    }
  } catch (err: unknown) {
    const errorObj = err as { message?: string };
    console.log("ℹ️ Nota sobre superusuario:", errorObj.message || err);
  }

  // 2. Ingestar el reporte inicial
  const filePath = path.resolve(__dirname, "../../ejemplo-reporte.mdx");
  
  if (!fs.existsSync(filePath)) {
    console.error(`❌ No se encontró el archivo de reporte en: ${filePath}`);
    process.exit(1);
  }

  const fileContent = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(fileContent);

  const validatedData = ReporteFrontmatterSchema.parse(data);

  const reporte = await prisma.reporte.upsert({
    where: { id: "global-report" },
    update: {
      titulo: validatedData.title,
      subtitulo: validatedData.subtitle || null,
      autor: validatedData.author,
      published: validatedData.published,
      doi: validatedData.doi,
      readingTime: validatedData.readingTime,
      license: validatedData.license,
      medianaGlobal: validatedData.medianaGlobal,
      lossFacilities: validatedData.lossFacilities,
      lossIT: validatedData.lossIT,
      lossWorkload: validatedData.lossWorkload,
      keyFinding: validatedData.keyFinding || "El 31,4% de la capacidad energizada pagada en instalaciones hiperescala no produce ningún cómputo útil en una hora determinada.",
      labels: (validatedData.labels ?? {}) as Prisma.InputJsonValue,
      layers: validatedData.layers as unknown as Prisma.InputJsonValue,
      methodologySteps: (validatedData.methodologySteps ?? []) as unknown as Prisma.InputJsonValue,
      taxonomyData: validatedData.taxonomyData as unknown as Prisma.InputJsonValue,
      cumulativeData: validatedData.cumulativeData as unknown as Prisma.InputJsonValue,
      contenido: content,
    },
    create: {
      id: "global-report",
      titulo: validatedData.title,
      subtitulo: validatedData.subtitle || null,
      autor: validatedData.author,
      published: validatedData.published,
      doi: validatedData.doi,
      readingTime: validatedData.readingTime,
      license: validatedData.license,
      medianaGlobal: validatedData.medianaGlobal,
      lossFacilities: validatedData.lossFacilities,
      lossIT: validatedData.lossIT,
      lossWorkload: validatedData.lossWorkload,
      keyFinding: validatedData.keyFinding || "El 31,4% de la capacidad energizada pagada en instalaciones hiperescala no produce ningún cómputo útil en una hora determinada.",
      labels: (validatedData.labels ?? {}) as Prisma.InputJsonValue,
      layers: validatedData.layers as unknown as Prisma.InputJsonValue,
      methodologySteps: (validatedData.methodologySteps ?? []) as unknown as Prisma.InputJsonValue,
      taxonomyData: validatedData.taxonomyData as unknown as Prisma.InputJsonValue,
      cumulativeData: validatedData.cumulativeData as unknown as Prisma.InputJsonValue,
      contenido: content,
    },
  });

  console.log(`✅ Ingesta completada con éxito! Reporte ID: ${reporte.id} ("${reporte.titulo}")`);
}

main()
  .catch((e) => {
    console.error("❌ Error en la semilla inicial de Prisma:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
