import { PrismaClient, Prisma } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import matter from "gray-matter";
import fs from "fs";
import path from "path";
import { ReportFrontmatterSchema } from "../lib/report-schema";
import { generateAiKnowledge } from "../lib/generate-ai-knowledge";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL no está configurada.");
}

const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

function generateSlug(title: string, publishedDate: string): string {
  const base = `${title} ${publishedDate}`
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
  return base || "report";
}

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

  // 2. Ingestar el reporte inicial usando la plantilla estándar
  const filePath = path.resolve(__dirname, "../public/templates/plantilla-reporte-physaflow.mdx");
  
  if (!fs.existsSync(filePath)) {
    console.error(`❌ No se encontró la plantilla de reporte en: ${filePath}`);
    process.exit(1);
  }

  const fileContent = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(fileContent);

  const validatedData = ReportFrontmatterSchema.parse(data);
  const slug = generateSlug(validatedData.title, validatedData.publishedDate);

  // Generar la ficha aiKnowledge para la IA
  const aiKnowledge = await generateAiKnowledge({
    title: validatedData.title,
    subtitle: validatedData.subtitle,
    author: validatedData.author,
    publishedDate: validatedData.publishedDate,
    doi: validatedData.doi,
    globalMedian: validatedData.globalMedian,
    lossFacilities: validatedData.lossFacilities,
    lossIT: validatedData.lossIT,
    lossWorkload: validatedData.lossWorkload,
    keyFinding: validatedData.keyFinding,
    layers: validatedData.layers,
    content: content,
  });

  // Buscar si ya existe un reporte inicial para evitar duplicados
  const firstReport = await prisma.report.findFirst();

  if (firstReport) {
    await prisma.report.update({
      where: { id: firstReport.id },
      data: {
        slug,
        isPublished: true,
        title: validatedData.title,
        subtitle: validatedData.subtitle || null,
        author: validatedData.author,
        publishedDate: validatedData.publishedDate,
        doi: validatedData.doi,
        readingTime: validatedData.readingTime,
        license: validatedData.license,
        globalMedian: validatedData.globalMedian,
        lossFacilities: validatedData.lossFacilities,
        lossIT: validatedData.lossIT,
        lossWorkload: validatedData.lossWorkload,
        keyFinding: validatedData.keyFinding || "El 31,4% de la capacidad energizada pagada en instalaciones hiperescala no produce ningún cómputo útil en una hora determinada.",
        layers: validatedData.layers as unknown as Prisma.InputJsonValue,
        aiKnowledge: aiKnowledge as unknown as Prisma.InputJsonValue,
        content: content,
      },
    });
    console.log(`✅ Reporte inicial actualizado con exito! ID: ${firstReport.id} ("${validatedData.title}")`);
  } else {
    const createdReport = await prisma.report.create({
      data: {
        slug,
        isPublished: true,
        title: validatedData.title,
        subtitle: validatedData.subtitle || null,
        author: validatedData.author,
        publishedDate: validatedData.publishedDate,
        doi: validatedData.doi,
        readingTime: validatedData.readingTime,
        license: validatedData.license,
        globalMedian: validatedData.globalMedian,
        lossFacilities: validatedData.lossFacilities,
        lossIT: validatedData.lossIT,
        lossWorkload: validatedData.lossWorkload,
        keyFinding: validatedData.keyFinding || "El 31,4% de la capacidad energizada pagada en instalaciones hiperescala no produce ningún cómputo útil en una hora determinada.",
        layers: validatedData.layers as unknown as Prisma.InputJsonValue,
        aiKnowledge: aiKnowledge as unknown as Prisma.InputJsonValue,
        content: content,
      },
    });
    console.log(`✅ Reporte inicial creado con exito! ID: ${createdReport.id} ("${validatedData.title}")`);
  }
}

main()
  .catch((e) => {
    console.error("❌ Error en la semilla inicial de Prisma:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
