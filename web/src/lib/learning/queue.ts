import "server-only";
import { and, asc, eq, gte, lte, notExists, sql } from "drizzle-orm";
import { createEmptyCard } from "ts-fsrs";
import { db } from "@/db";
import { reviewLogs, userCards, words, type Word } from "@/db/schema";
import { previewIntervals, rowToCard, type Intervals } from "./fsrs";

/** Ҳар рӯз чанд калимаи нав дода мешавад */
export const DAILY_NEW_WORDS = 10;
/** «Рӯз» аз рӯи вақти Душанбе ҳисоб карда мешавад */
export const TIME_ZONE = "Asia/Dushanbe";
const COURSE_LANG = "en";

export type StudyWord = Pick<
  Word,
  "id" | "term" | "ipa" | "partOfSpeech" | "translation" | "example" | "exampleTranslation" | "mnemonic" | "topic"
>;

export type StudyItem = { word: StudyWord; isNew: boolean; intervals: Intervals };

const studyWordColumns = {
  id: words.id,
  term: words.term,
  ipa: words.ipa,
  partOfSpeech: words.partOfSpeech,
  translation: words.translation,
  example: words.example,
  exampleTranslation: words.exampleTranslation,
  mnemonic: words.mnemonic,
  topic: words.topic,
};

const startOfToday = sql`(date_trunc('day', now() at time zone ${TIME_ZONE}) at time zone ${TIME_ZONE})`;

async function newWordsLeftToday(userId: string) {
  const [{ introduced }] = await db
    .select({ introduced: sql<number>`count(*)::int` })
    .from(userCards)
    .where(and(eq(userCards.userId, userId), gte(userCards.createdAt, startOfToday)));
  return Math.max(0, DAILY_NEW_WORDS - introduced);
}

function unseenWords(userId: string) {
  return and(
    eq(words.lang, COURSE_LANG),
    notExists(
      db
        .select({ one: sql`1` })
        .from(userCards)
        .where(and(eq(userCards.userId, userId), eq(userCards.wordId, words.id))),
    ),
  );
}

/** Навбати ҷаласаи имрӯза: калимаҳое, ки вақти такрорашон расидааст, ва калимаҳои нав. */
export async function getStudyQueue(userId: string): Promise<StudyItem[]> {
  const now = new Date();
  const [dueRows, newLimit] = await Promise.all([
    db
      .select({ card: userCards, word: studyWordColumns })
      .from(userCards)
      .innerJoin(words, eq(words.id, userCards.wordId))
      .where(and(eq(userCards.userId, userId), lte(userCards.due, now)))
      .orderBy(asc(userCards.due))
      .limit(100),
    newWordsLeftToday(userId),
  ]);

  const newRows = newLimit
    ? await db.select(studyWordColumns).from(words).where(unseenWords(userId)).orderBy(asc(words.position)).limit(newLimit)
    : [];

  const reviews: StudyItem[] = dueRows.map((r) => ({
    word: r.word,
    isNew: false,
    intervals: previewIntervals(rowToCard(r.card), now),
  }));
  const emptyIntervals = previewIntervals(createEmptyCard(now), now);
  const fresh: StudyItem[] = newRows.map((word) => ({ word, isNew: true, intervals: emptyIntervals }));

  // Калимаҳои нав байни такрорҳо тақсим мешаванд: пас аз ҳар 3 такрор як калимаи нав
  const queue: StudyItem[] = [];
  let r = 0;
  let n = 0;
  while (r < reviews.length || n < fresh.length) {
    for (let i = 0; i < 3 && r < reviews.length; i++) queue.push(reviews[r++]);
    if (n < fresh.length) queue.push(fresh[n++]);
  }
  return queue;
}

export type TodayStats = {
  learned: number;
  due: number;
  newToday: number;
  reviewedToday: number;
  streak: number;
  totalWords: number;
};

/** Омори воқеии корбар барои саҳифаи «Имрӯз». */
export async function getTodayStats(userId: string): Promise<TodayStats> {
  const now = new Date();
  const [[cards], [today], [total], days, newLimit, [unseen]] = await Promise.all([
    db
      .select({
        learned: sql<number>`count(*)::int`,
        due: sql<number>`(count(*) filter (where ${userCards.due} <= ${now}))::int`,
      })
      .from(userCards)
      .where(eq(userCards.userId, userId)),
    db
      .select({ reviewed: sql<number>`count(*)::int` })
      .from(reviewLogs)
      .where(and(eq(reviewLogs.userId, userId), gte(reviewLogs.review, startOfToday))),
    db.select({ n: sql<number>`count(*)::int` }).from(words).where(eq(words.lang, COURSE_LANG)),
    db
      .selectDistinct({ day: sql<string>`((${reviewLogs.review} at time zone ${TIME_ZONE})::date)::text` })
      .from(reviewLogs)
      .where(eq(reviewLogs.userId, userId))
      .orderBy(sql`1 desc`)
      .limit(400),
    newWordsLeftToday(userId),
    db.select({ n: sql<number>`count(*)::int` }).from(words).where(unseenWords(userId)),
  ]);

  return {
    learned: cards.learned,
    due: cards.due,
    newToday: Math.min(newLimit, unseen.n),
    reviewedToday: today.reviewed,
    streak: computeStreak(days.map((d) => d.day)),
    totalWords: total.n,
  };
}

/** Рӯзҳои пай дар пай бо машқ. Агар имрӯз ҳанӯз машқ нашуда бошад, аз дирӯз ҳисоб мешавад. */
export function computeStreak(daysDesc: string[], now = new Date()) {
  if (daysDesc.length === 0) return 0;
  const todayStr = new Intl.DateTimeFormat("en-CA", { timeZone: TIME_ZONE }).format(now);
  const dayMs = 86_400_000;
  const toTime = (d: string) => Date.parse(`${d}T00:00:00Z`);
  let expected = toTime(todayStr);
  if (daysDesc[0] !== todayStr) expected -= dayMs;
  let streak = 0;
  for (const d of daysDesc) {
    if (toTime(d) !== expected) break;
    streak++;
    expected -= dayMs;
  }
  return streak;
}
