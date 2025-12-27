import dotenv from 'dotenv';
import { defineConfig, env } from "prisma/config";

// Load environment variables from .env so prisma.config.ts can access DATABASE_URL
dotenv.config();

export default defineConfig({
  schema: './prisma',
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: env("DATABASE_URL"),
  },
});


