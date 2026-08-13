import 'dotenv/config';
import { defineConfig } from 'prisma/config';

export default defineConfig({
  schema: './prisma/schema.prisma',
  datasource: {
    url: process.env.DIRECT_URL || 'postgresql://placeholder:placeholder@localhost:5432/placeholder',
  },
});