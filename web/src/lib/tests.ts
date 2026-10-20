import "server-only";
import { and, asc, eq, gte, inArray, isNull, lte, or, sql } from "drizzle-orm";
import { db } from "@/db";
import { attemptAnswers, questions, testAttempts } from "@/db/schema";

/** Саволҳо дар як тест */
export const TEST_SIZE = 10;
/** Вақт барои ҳар савол (сония) */
export const SECONDS_PER_QUESTION = 90;
/** Пас аз тамом шудани вақт барои таъхири шабака чанд сония иҷозат дода мешавад */
const GRACE_MS = 5_000;

function gradeFilter(grade: number | null) {
  if (!grade) return undefined;
  return and(
    or(isNull(questions.gradeMin), lte(questions.gradeMin, grade)),
    or(isNull(questions.gradeMax), gte(questions.gradeMax, grade)),
  );
}

/** Шумораи саволҳои дастрас барои ҳар фан (бо назардошти синф). */
export async function countQuestions(subjects: string[], grade: number | null) {
  if (subjects.length === 0) return {} as Record<string, number>;
  const rows = await db
    .select({ subject: questions.subject, n: sql<number>`count(*)::int` })
    .from(questions)
    .where(and(inArray(questions.subject, subjects), gradeFilter(grade)))
    .groupBy(questions.subject);
  return Object.fromEntries(rows.map((r) => [r.subject, r.n])) as Record<string, number>;
}

/** Кӯшиши нав: саволҳои тасодуфӣ интихоб мешаванд ва бо chosen = null сабт мешаванд. */
export async function createAttempt(userId: string, subject: string, competition: string | null, grade: number | null) {
  return db.transaction(async (tx) => {
    const picked = await tx
      .select({ id: questions.id })
      .from(questions)
      .where(and(eq(questions.subject, subject), gradeFilter(grade)))
      .orderBy(sql`random()`)
      .limit(TEST_SIZE);
    if (picked.length === 0) return null;

    const [attempt] = await tx
      .insert(testAttempts)
      .values({ userId, subject, competition, total: picked.length, timeLimitSec: picked.length * SECONDS_PER_QUESTION })
      .returning({ id: testAttempts.id });
    await tx
      .insert(attemptAnswers)
      .values(picked.map((q, position) => ({ attemptId: attempt.id, position, questionId: q.id })));
    return attempt.id;
  });
}

async function ownAttempt(userId: string, attemptId: number) {
  const [a] = await db
    .select()
    .from(testAttempts)
    .where(and(eq(testAttempts.id, attemptId), eq(testAttempts.userId, userId)));
  return a ?? null;
}

export function deadlineOf(a: { startedAt: Date; timeLimitSec: number }) {
  return new Date(a.startedAt.getTime() + a.timeLimitSec * 1000);
}

/** Маълумот барои экрани тест — бе ҷавобҳои дуруст ва бе шарҳ. */
export async function getRunnerData(userId: string, attemptId: number) {
  const attempt = await ownAttempt(userId, attemptId);
  if (!attempt) return null;
  const items = await db
    .select({
      position: attemptAnswers.position,
      chosenIndex: attemptAnswers.chosenIndex,
      stem: questions.stem,
      options: questions.options,
      topic: questions.topic,
    })
    .from(attemptAnswers)
    .innerJoin(questions, eq(questions.id, attemptAnswers.questionId))
    .where(eq(attemptAnswers.attemptId, attemptId))
    .orderBy(asc(attemptAnswers.position));
  return { attempt, items, deadline: deadlineOf(attempt) };
}

/** Ҷавобро сабт мекунад. Дурустӣ дар SQL муқоиса мешавад; ҷавоби дуруст ба браузер намеравад. */
export async function saveAnswer(userId: string, attemptId: number, position: number, chosen: number) {
  const attempt = await ownAttempt(userId, attemptId);
  if (!attempt) return { ok: false as const, error: "Тест ёфт нашуд." };
  if (attempt.finishedAt) return { ok: false as const, error: "Тест аллакай анҷом ёфтааст." };
  if (Date.now() > deadlineOf(attempt).getTime() + GRACE_MS) return { ok: false as const, error: "Вақти тест тамом шуд." };
  if (!Number.isInteger(position) || position < 0 || position >= attempt.total) return { ok: false as const, error: "Савол ёфт нашуд." };
  if (!Number.isInteger(chosen) || chosen < 0 || chosen > 3) return { ok: false as const, error: "Ҷавоб нодуруст аст." };

  await db
    .update(attemptAnswers)
    .set({
      chosenIndex: chosen,
      isCorrect: sql`(select ${questions.correctIndex} = ${chosen} from ${questions} where ${questions.id} = ${attemptAnswers.questionId})`,
      answeredAt: new Date(),
    })
    .where(and(eq(attemptAnswers.attemptId, attemptId), eq(attemptAnswers.position, position)));
  return { ok: true as const };
}

/** Тестро анҷом медиҳад ва холро ҳисоб мекунад. Такрор даъват кардан бехатар аст. */
export async function finishAttempt(userId: string, attemptId: number) {
  const attempt = await ownAttempt(userId, attemptId);
  if (!attempt) return null;
  if (attempt.finishedAt) return attempt;
  const [{ correct }] = await db
    .select({ correct: sql<number>`count(*) filter (where ${attemptAnswers.isCorrect})::int` })
    .from(attemptAnswers)
    .where(eq(attemptAnswers.attemptId, attemptId));
  const scorePercent = Math.round((correct * 100) / attempt.total);
  const [updated] = await db
    .update(testAttempts)
    .set({ finishedAt: new Date(), correct, scorePercent })
    .where(and(eq(testAttempts.id, attemptId), isNull(testAttempts.finishedAt)))
    .returning();
  return updated ?? (await ownAttempt(userId, attemptId));
}

/** Натиҷа бо ҷавобҳои дуруст ва шарҳҳо — танҳо барои тести анҷомёфта. */
export async function getResult(userId: string, attemptId: number) {
  const attempt = await ownAttempt(userId, attemptId);
  if (!attempt?.finishedAt) return null;
  const items = await db
    .select({
      position: attemptAnswers.position,
      chosenIndex: attemptAnswers.chosenIndex,
      isCorrect: attemptAnswers.isCorrect,
      stem: questions.stem,
      options: questions.options,
      correctIndex: questions.correctIndex,
      explanation: questions.explanation,
      topic: questions.topic,
    })
    .from(attemptAnswers)
    .innerJoin(questions, eq(questions.id, attemptAnswers.questionId))
    .where(eq(attemptAnswers.attemptId, attemptId))
    .orderBy(asc(attemptAnswers.position));
  return { attempt, items };
}

/** Агар вақт гузашта бошад, вале тест анҷом наёфта бошад — онро худкор анҷом медиҳад. */
export function isExpired(a: { startedAt: Date; timeLimitSec: number; finishedAt: Date | null }) {
  return !a.finishedAt && Date.now() > deadlineOf(a).getTime() + GRACE_MS;
}

/** Ҷой аз рӯи қоидаҳои «Илм — фурӯғи маърифат»: 75–100 — 1, 60–75 — 2, 50–60 — 3. */
export function ilmPlace(percent: number) {
  if (percent >= 75) return 1;
  if (percent >= 60) return 2;
  if (percent >= 50) return 3;
  return null;
}

/** Шумораи саволҳо аз рӯи мавзӯъ барои як фан (бо назардошти синф). */
export async function topicCounts(subject: string, grade: number | null) {
  return db
    .select({ topic: questions.topic, n: sql<number>`count(*)::int` })
    .from(questions)
    .where(and(eq(questions.subject, subject), gradeFilter(grade)))
    .groupBy(questions.topic)
    .orderBy(questions.topic);
}

/** Кӯшишҳои охирини анҷомёфтаи корбар дар як фан. */
export async function recentAttempts(userId: string, subject: string, limit = 5) {
  return db
    .select({
      id: testAttempts.id,
      scorePercent: testAttempts.scorePercent,
      correct: testAttempts.correct,
      total: testAttempts.total,
      finishedAt: testAttempts.finishedAt,
      competition: testAttempts.competition,
    })
    .from(testAttempts)
    .where(and(eq(testAttempts.userId, userId), eq(testAttempts.subject, subject), sql`${testAttempts.finishedAt} is not null`))
    .orderBy(sql`${testAttempts.finishedAt} desc`)
    .limit(limit);
}
