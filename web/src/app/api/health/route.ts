import { sql } from "drizzle-orm";
import { connection } from "next/server";
import { db } from "@/db";

type DbInfo = { now: string; version: string; database: string };

// Санҷиши ҳолати сервер ва пайвастшавӣ ба пойгоҳи додаҳо
export async function GET() {
  // Ҳамеша дар вақти дархост иҷро шавад, на ҳангоми build
  await connection();

  const started = performance.now();
  try {
    const result = await db.execute<DbInfo>(
      sql`select now()::text as now, split_part(version(), ' ', 2) as version, current_database() as database`,
    );
    const row = result.rows[0];
    return Response.json({
      status: "ok",
      database: {
        connected: true,
        postgres: row.version,
        name: row.database,
        serverTime: row.now,
        latencyMs: Math.round(performance.now() - started),
      },
    });
  } catch (error) {
    console.error("[health] database check failed", error);
    return Response.json({ status: "error", database: { connected: false } }, { status: 503 });
  }
}
