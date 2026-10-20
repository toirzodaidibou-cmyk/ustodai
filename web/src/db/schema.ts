import {
  boolean,
  bigint,
  doublePrecision,
  index,
  integer,
  pgTable,
  primaryKey,
  smallint,
  text,
  timestamp,
  uniqueIndex,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

/*
 * Схемаи пойгоҳи додаҳо (Drizzle ORM).
 * Корбарон дар схемаи neon_auth (Neon Auth) нигоҳ дошта мешаванд. user_id ба neon_auth."user".id ишора мекунад.
 * Калиди хориҷӣ ба он дар миграцияи алоҳида (custom SQL) илова шудааст, чунки drizzle-kit схемаи neon_auth-ро идора намекунад.
 */

/** Луғат: калимаҳои забони хориҷӣ бо тарҷумаи тоҷикӣ. */
export const words = pgTable(
  "words",
  {
    id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
    lang: varchar("lang", { length: 8 }).notNull().default("en"),
    term: text("term").notNull(),
    ipa: text("ipa"),
    partOfSpeech: varchar("part_of_speech", { length: 16 }),
    translation: text("translation").notNull(),
    example: text("example"),
    exampleTranslation: text("example_translation"),
    mnemonic: text("mnemonic"),
    level: varchar("level", { length: 4 }).notNull(),
    topic: varchar("topic", { length: 32 }).notNull(),
    /** Тартиби калима дар курс (аз осон ба душвор) */
    position: integer("position").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [uniqueIndex("words_lang_term_key").on(t.lang, t.term), index("words_lang_position_idx").on(t.lang, t.position)],
);

/** Ҳолати FSRS-и ҳар калима барои ҳар корбар. */
export const userCards = pgTable(
  "user_cards",
  {
    userId: uuid("user_id").notNull(),
    wordId: integer("word_id")
      .notNull()
      .references(() => words.id, { onDelete: "cascade" }),
    due: timestamp("due", { withTimezone: true }).notNull(),
    stability: doublePrecision("stability").notNull(),
    difficulty: doublePrecision("difficulty").notNull(),
    elapsedDays: integer("elapsed_days").notNull(),
    scheduledDays: integer("scheduled_days").notNull(),
    learningSteps: integer("learning_steps").notNull(),
    reps: integer("reps").notNull(),
    lapses: integer("lapses").notNull(),
    /** 0 New, 1 Learning, 2 Review, 3 Relearning */
    state: smallint("state").notNull(),
    lastReview: timestamp("last_review", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [primaryKey({ columns: [t.userId, t.wordId] }), index("user_cards_user_due_idx").on(t.userId, t.due)],
);

/** Ҳар баҳодиҳӣ сабт мешавад: барои таҳлили пешрафт ва санҷиши илмии натиҷаҳо. */
export const reviewLogs = pgTable(
  "review_logs",
  {
    id: bigint("id", { mode: "number" }).primaryKey().generatedAlwaysAsIdentity(),
    userId: uuid("user_id").notNull(),
    wordId: integer("word_id")
      .notNull()
      .references(() => words.id, { onDelete: "cascade" }),
    /** 1 Again, 2 Hard, 3 Good, 4 Easy */
    rating: smallint("rating").notNull(),
    state: smallint("state").notNull(),
    due: timestamp("due", { withTimezone: true }).notNull(),
    stability: doublePrecision("stability").notNull(),
    difficulty: doublePrecision("difficulty").notNull(),
    elapsedDays: integer("elapsed_days").notNull(),
    lastElapsedDays: integer("last_elapsed_days").notNull(),
    scheduledDays: integer("scheduled_days").notNull(),
    learningSteps: integer("learning_steps").notNull(),
    review: timestamp("review", { withTimezone: true }).notNull(),
    /** Вақте ки корбар барои ҷавоб сарф кард */
    durationMs: integer("duration_ms"),
  },
  (t) => [index("review_logs_user_review_idx").on(t.userId, t.review)],
);

/** Профили омӯзишӣ: кӣ будани корбар (хонанда, донишҷӯ, худомӯз) ва синф ё курс. */
export const userProfiles = pgTable("user_profiles", {
  userId: uuid("user_id").primaryKey(),
  /** Ҳадафи пешина (exam | school | self) — барои мутобиқат бо профилҳои кӯҳна нигоҳ дошта шудааст */
  goal: varchar("goal", { length: 16 }),
  /** school | student | self. Агар null бошад, корбар бояд қадами «Шумо кистед?»-ро гузарад */
  role: varchar("role", { length: 16 }),
  /** Синфи хонанда (5–11) */
  grade: smallint("grade"),
  /** college | university — барои донишҷӯ */
  institution: varchar("institution", { length: 16 }),
  /** Курси донишҷӯ (1–5) */
  course: smallint("course"),
  onboardedAt: timestamp("onboarded_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

/** Фанҳое, ки корбар интихоб кардааст. */
export const userSubjects = pgTable(
  "user_subjects",
  {
    userId: uuid("user_id").notNull(),
    subject: varchar("subject", { length: 32 }).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [primaryKey({ columns: [t.userId, t.subject] })],
);

/** Озмунҳое, ки корбар барои омодагӣ интихоб кардааст. */
export const userCompetitions = pgTable(
  "user_competitions",
  {
    userId: uuid("user_id").notNull(),
    competition: varchar("competition", { length: 48 }).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [primaryKey({ columns: [t.userId, t.competition] })],
);

/** Саволҳои тестӣ (интихобӣ, 4 ҷавоб). Ҷавоби дуруст ҳеҷ гоҳ ба браузер то анҷоми тест фиристода намешавад. */
export const questions = pgTable(
  "questions",
  {
    id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
    subject: varchar("subject", { length: 32 }).notNull(),
    topic: varchar("topic", { length: 64 }).notNull(),
    gradeMin: smallint("grade_min"),
    gradeMax: smallint("grade_max"),
    /** 1 осон, 2 миёна, 3 душвор */
    difficulty: smallint("difficulty").notNull().default(2),
    stem: text("stem").notNull(),
    options: text("options").array().notNull(),
    correctIndex: smallint("correct_index").notNull(),
    explanation: text("explanation").notNull(),
    /** ustodai — саволи асили намунавӣ, ки UstodAI навиштааст */
    source: varchar("source", { length: 32 }).notNull().default("ustodai"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [uniqueIndex("questions_subject_stem_key").on(t.subject, t.stem), index("questions_subject_idx").on(t.subject)],
);

/** Як кӯшиши супоридани тест. */
export const testAttempts = pgTable(
  "test_attempts",
  {
    id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
    userId: uuid("user_id").notNull(),
    subject: varchar("subject", { length: 32 }).notNull(),
    competition: varchar("competition", { length: 48 }),
    total: smallint("total").notNull(),
    timeLimitSec: integer("time_limit_sec").notNull(),
    startedAt: timestamp("started_at", { withTimezone: true }).notNull().defaultNow(),
    finishedAt: timestamp("finished_at", { withTimezone: true }),
    correct: smallint("correct"),
    scorePercent: smallint("score_percent"),
  },
  (t) => [index("test_attempts_user_idx").on(t.userId, t.startedAt)],
);

/** Саволҳои кӯшиш ва ҷавобҳои корбар. Ҳангоми сохтани кӯшиш ҳамаи саволҳо бо chosen = null илова мешаванд. */
export const attemptAnswers = pgTable(
  "attempt_answers",
  {
    attemptId: integer("attempt_id")
      .notNull()
      .references(() => testAttempts.id, { onDelete: "cascade" }),
    position: smallint("position").notNull(),
    questionId: integer("question_id")
      .notNull()
      .references(() => questions.id, { onDelete: "cascade" }),
    chosenIndex: smallint("chosen_index"),
    isCorrect: boolean("is_correct"),
    answeredAt: timestamp("answered_at", { withTimezone: true }),
  },
  (t) => [primaryKey({ columns: [t.attemptId, t.position] })],
);

export type Question = typeof questions.$inferSelect;
export type Word = typeof words.$inferSelect;
export type UserCard = typeof userCards.$inferSelect;
