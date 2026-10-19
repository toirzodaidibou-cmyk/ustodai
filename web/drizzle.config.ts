import { defineConfig } from "drizzle-kit";
import { withStrictSsl } from "./src/db/ssl";

process.loadEnvFile?.(".env.local");

// Миграцияҳо бояд бо пайвасти мустақим (unpooled) иҷро шаванд
const url = process.env.DATABASE_URL_UNPOOLED ?? process.env.DATABASE_URL;
if (!url) throw new Error("DATABASE_URL_UNPOOLED дар .env.local нест");

export default defineConfig({
  schema: "./src/db/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: { url: withStrictSsl(url) },
  strict: true,
});
