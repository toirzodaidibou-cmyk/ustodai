import { fsrs, Rating, type Card, type Grade } from "ts-fsrs";
import type { UserCard } from "@/db/schema";
import { formatInterval } from "./format";

/*
 * Танзимоти FSRS:
 * - request_retention 0.9: ҳадаф ин аст, ки ҳангоми такрор 90% калимаҳо дар ёд бошанд
 * - learning_steps 1m, 10m: калимаи нав дар худи ҷаласа ду бор такрор мешавад
 * - enable_fuzz: фосилаҳо каме тасодуфӣ мешаванд, то калимаҳо дар як рӯз ҷамъ нашаванд
 */
export const scheduler = fsrs({
  request_retention: 0.9,
  maximum_interval: 3 * 365,
  enable_fuzz: true,
  enable_short_term: true,
  learning_steps: ["1m", "10m"],
  relearning_steps: ["10m"],
});

export const GRADES = [Rating.Again, Rating.Hard, Rating.Good, Rating.Easy] as const satisfies readonly Grade[];

export type Intervals = Record<1 | 2 | 3 | 4, string>;

export function rowToCard(row: UserCard): Card {
  return {
    due: row.due,
    stability: row.stability,
    difficulty: row.difficulty,
    elapsed_days: row.elapsedDays,
    scheduled_days: row.scheduledDays,
    learning_steps: row.learningSteps,
    reps: row.reps,
    lapses: row.lapses,
    state: row.state,
    last_review: row.lastReview ?? undefined,
  };
}

export function cardToRow(card: Card) {
  return {
    due: card.due,
    stability: card.stability,
    difficulty: card.difficulty,
    elapsedDays: card.elapsed_days,
    scheduledDays: card.scheduled_days,
    learningSteps: card.learning_steps,
    reps: card.reps,
    lapses: card.lapses,
    state: card.state,
    lastReview: card.last_review ?? null,
  };
}

/** Барои ҳар баҳо нишон медиҳад, ки калима кай боз пайдо мешавад. */
export function previewIntervals(card: Card, now: Date): Intervals {
  const preview = scheduler.repeat(card, now);
  return {
    1: formatInterval(now, preview[Rating.Again].card.due),
    2: formatInterval(now, preview[Rating.Hard].card.due),
    3: formatInterval(now, preview[Rating.Good].card.due),
    4: formatInterval(now, preview[Rating.Easy].card.due),
  };
}
