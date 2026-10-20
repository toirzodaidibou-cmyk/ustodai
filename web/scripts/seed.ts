/*
 * Луғатро ба пойгоҳ ворид мекунад: `npm run db:seed`.
 * Такрор иҷро кардан бехатар аст. Калимаҳо аз рӯи (lang, term) навсозӣ мешаванд ва id-ҳо тағйир намеёбанд.
 */
import { sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { questions, words } from "../src/db/schema";
import { withStrictSsl } from "../src/db/ssl";
import { EN_A1 } from "../src/db/seed/en-a1";
import { MATH_QUESTIONS, type SeedQuestion } from "../src/db/seed/math-questions";
import { PHYSICS_QUESTIONS } from "../src/db/seed/physics-questions";

const QUESTION_SETS: Record<string, SeedQuestion[]> = { math: MATH_QUESTIONS, physics: PHYSICS_QUESTIONS };

process.loadEnvFile?.(".env.local");

async function main() {
  const url = process.env.DATABASE_URL_UNPOOLED ?? process.env.DATABASE_URL;
  if (!url) throw new Error("DATABASE_URL_UNPOOLED дар .env.local нест");
  const pool = new Pool({ connectionString: withStrictSsl(url), max: 1 });
  const db = drizzle({ client: pool });

  let position = 0;
  const rows = EN_A1.flatMap((topic) =>
    topic.words.map((w) => ({
      lang: "en",
      term: w.term,
      ipa: w.ipa,
      partOfSpeech: w.pos,
      translation: w.tg,
      example: w.ex,
      exampleTranslation: w.exTg,
      mnemonic: w.mnemonic ?? null,
      level: "A1",
      topic: topic.key,
      position: ++position,
    })),
  );

  const terms = new Set(rows.map((r) => r.term));
  if (terms.size !== rows.length) throw new Error("Дар луғат калимаҳои такрорӣ ҳастанд");

  await db
    .insert(words)
    .values(rows)
    .onConflictDoUpdate({
      target: [words.lang, words.term],
      set: {
        ipa: sql`excluded.ipa`,
        partOfSpeech: sql`excluded.part_of_speech`,
        translation: sql`excluded.translation`,
        example: sql`excluded.example`,
        exampleTranslation: sql`excluded.example_translation`,
        mnemonic: sql`excluded.mnemonic`,
        level: sql`excluded.level`,
        topic: sql`excluded.topic`,
        position: sql`excluded.position`,
      },
    });

  const [{ count }] = await db.select({ count: sql<number>`count(*)::int` }).from(words);
  console.log(`✓ ${rows.length} калима навсозӣ шуд. Ҳамагӣ дар пойгоҳ: ${count}`);

  // Саволҳои тестӣ: upsert аз рӯи (subject, stem)
  for (const [subject, set] of Object.entries(QUESTION_SETS)) {
    const stems = new Set<string>();
    for (const q of set) {
      if (q.options.length !== 4 || q.correct < 0 || q.correct > 3) throw new Error(`Саволи нодуруст: ${q.stem}`);
      if (new Set(q.options).size !== 4) throw new Error(`Ҷавобҳои такрорӣ: ${q.stem}`);
      if (stems.has(q.stem)) throw new Error(`Саволи такрорӣ: ${q.stem}`);
      stems.add(q.stem);
    }
    await db
      .insert(questions)
      .values(
        set.map((q) => ({
          subject,
          topic: q.topic,
          gradeMin: q.gradeMin,
          gradeMax: q.gradeMax,
          difficulty: q.difficulty,
          stem: q.stem,
          options: q.options,
          correctIndex: q.correct,
          explanation: q.explanation,
          source: "ustodai",
        })),
      )
      .onConflictDoUpdate({
        target: [questions.subject, questions.stem],
        set: {
          topic: sql`excluded.topic`,
          gradeMin: sql`excluded.grade_min`,
          gradeMax: sql`excluded.grade_max`,
          difficulty: sql`excluded.difficulty`,
          options: sql`excluded.options`,
          correctIndex: sql`excluded.correct_index`,
          explanation: sql`excluded.explanation`,
        },
      });
    console.log(`✓ ${subject}: ${set.length} савол навсозӣ шуд`);
  }
  const [{ qCount }] = await db.select({ qCount: sql<number>`count(*)::int` }).from(questions);
  console.log(`✓ Ҳамагӣ саволҳо дар пойгоҳ: ${qCount}`);
  await pool.end();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
