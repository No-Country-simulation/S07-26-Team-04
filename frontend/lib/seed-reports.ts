import 'dotenv/config';
import { PrismaNeon } from '@prisma/adapter-neon';
import { PrismaClient } from '@prisma/client';

import { REPORTE_MOCK } from '@/data/reporte-mock';
import { parseReport } from './report-parser';

const adapter = new PrismaNeon({
  connectionString: process.env.DATABASE_URL!,
});
const prisma = new PrismaClient({ adapter });

async function main() {
  const slug = 'stranded-capacity-index';
  const parsed = parseReport(REPORTE_MOCK);
  const report = await prisma.report.upsert({
    where: { slug },
    update: {
      mdxContent: REPORTE_MOCK,
      sectionsJson: JSON.stringify(parsed.sections),
      metricsJson: parsed.metricsJson,
      chartsJson: parsed.chartsJson,
      failureModesJson: parsed.failureModesJson,
      status: 'published',
      publishedAt: new Date(),
    },
    create: {
      title: 'El Índice de Capacidad Varada (SCI)',
      slug,
      version: '1.0.0',
      language: 'es',
      status: 'published',
      description:
        'Una taxonomía nominal de infraestructura pagada, energizada y no productiva en las tres capas físicas del centro de datos moderno.',
      mdxContent: REPORTE_MOCK,
      sectionsJson: JSON.stringify(parsed.sections),
      metricsJson: parsed.metricsJson,
      chartsJson: parsed.chartsJson,
      failureModesJson: parsed.failureModesJson,
      publishedAt: new Date(),
    },
  });

  console.log(`Report "${report.title}" (${report.slug}) lista en DB.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });