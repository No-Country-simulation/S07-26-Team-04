import { z } from "zod";

export const ReportFrontmatterSchema = z.object({
  title: z.string().min(1, "El título es requerido"),
  subtitle: z.string().optional(),
  author: z.string().min(1, "El autor es requerido"),
  publishedDate: z.string().min(1, "La fecha de publicación es requerida"),
  doi: z.string().min(1, "El DOI es requerido"),
  readingTime: z.string().min(1, "El tiempo de lectura es requerido"),
  license: z.string().min(1, "La licencia es requerida"),

  globalMedian: z.string().default("0,0%"),
  lossFacilities: z.string().default("0,0%"),
  lossIT: z.string().default("0,0%"),
  lossWorkload: z.string().default("0,0%"),
  keyFinding: z.string().optional(),

  labels: z.record(z.string(), z.any()).optional(),
  layers: z.array(z.any()).default([]),
  methodologySteps: z.array(z.any()).optional(),
  taxonomyData: z.array(z.any()).optional(),
  cumulativeData: z.array(z.any()).optional(),
});

export type ReportFrontmatter = z.infer<typeof ReportFrontmatterSchema>;
