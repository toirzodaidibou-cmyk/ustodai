import "server-only";
import { attachDatabasePool } from "@vercel/functions";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "./schema";
import { withStrictSsl } from "./ssl";

/*
 * Пайвастшавӣ ба Lakebase Postgres (Neon).
 * DATABASE_URL — пайвасти pooled (PgBouncer) барои дархостҳои барнома.
 * Миграцияҳо бо DATABASE_URL_UNPOOLED иҷро мешаванд (drizzle.config.ts).
 */
function createPool() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error("DATABASE_URL муайян нашудааст. `neon env pull`-ро иҷро кунед.");
  }
  const pool = new Pool({ connectionString: withStrictSsl(connectionString), max: 10, idleTimeoutMillis: 30_000 });
  // Дар Vercel Fluid compute пайвастҳои бекорро пеш аз таваққуфи функсия мепӯшонад
  attachDatabasePool(pool);
  return pool;
}

// Дар dev (HMR) як pool-ро такрор истифода мебарем, то пайвастҳо зиёд нашаванд
const globalForDb = globalThis as unknown as { pgPool?: Pool };
export const pool = globalForDb.pgPool ?? createPool();
if (process.env.NODE_ENV !== "production") globalForDb.pgPool = pool;

export const db = drizzle({ client: pool, schema });
