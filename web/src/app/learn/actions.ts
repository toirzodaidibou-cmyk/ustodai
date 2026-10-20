"use server";

import { and, eq } from "drizzle-orm";
import { createEmptyCard, type Grade } from "ts-fsrs";
import { db } from "@/db";
import { reviewLogs, userCards, words } from "@/db/schema";
import { getCurrentUser } from "@/lib/auth/server";
import { cardToRow, previewIntervals, rowToCard, scheduler, type Intervals } from "@/lib/learning/fsrs";

/** Агар калима дар ин муддат боз лозим шавад, дар худи ҷаласа такрор мешавад */
const REQUEUE_WITHIN_MS = 30 * 60_000;

export type ReviewResult =
  | { ok: true; requeue: boolean; intervals: Intervals }
  | { ok: false; error: string };

export async function submitReview(input: { wordId: number; rating: number; durationMs?: number }): Promise<ReviewResult> {
  const user = await getCurrentUser();
  if (!user) return { ok: false, error: "Аввал ворид шавед." };

  const wordId = Number(input.wordId);
  const rating = Number(input.rating);
  if (!Number.isInteger(wordId) || wordId <= 0) return { ok: false, error: "Калима ёфт нашуд." };
  if (![1, 2, 3, 4].includes(rating)) return { ok: false, error: "Баҳо нодуруст аст." };
  const durationMs =
    typeof input.durationMs === "number" && Number.isFinite(input.durationMs)
      ? Math.min(Math.max(Math.round(input.durationMs), 0), 10 * 60_000)
      : null;

  const now = new Date();

  try {
    return await db.transaction(async (tx) => {
      const [existing] = await tx
        .select()
        .from(userCards)
        .where(and(eq(userCards.userId, user.id), eq(userCards.wordId, wordId)))
        .for("update");

      if (!existing) {
        const [word] = await tx.select({ id: words.id }).from(words).where(eq(words.id, wordId));
        if (!word) return { ok: false as const, error: "Калима ёфт нашуд." };
      }

      const card = existing ? rowToCard(existing) : createEmptyCard(now);
      const { card: next, log } = scheduler.next(card, now, rating as Grade);
      const row = cardToRow(next);

      await tx
        .insert(userCards)
        .values({ userId: user.id, wordId, ...row })
        .onConflictDoUpdate({ target: [userCards.userId, userCards.wordId], set: row });

      await tx.insert(reviewLogs).values({
        userId: user.id,
        wordId,
        rating: log.rating,
        state: log.state,
        due: log.due,
        stability: log.stability,
        difficulty: log.difficulty,
        elapsedDays: log.elapsed_days,
        lastElapsedDays: log.last_elapsed_days,
        scheduledDays: log.scheduled_days,
        learningSteps: log.learning_steps,
        review: log.review,
        durationMs,
      });

      return {
        ok: true as const,
        requeue: next.due.getTime() - now.getTime() <= REQUEUE_WITHIN_MS,
        intervals: previewIntervals(next, next.due),
      };
    });
  } catch (error) {
    console.error("[learn] submitReview failed", error);
    return { ok: false, error: "Захира нашуд. Интернетро санҷед ва боз кӯшиш кунед." };
  }
}
