"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState, useTransition } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import confetti from "canvas-confetti";
import { AlertCircle, CheckCircle2, Loader2, Volume2, X } from "lucide-react";
import { submitReview } from "@/app/learn/actions";
import { NumberTicker } from "@/components/motion/number-ticker";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Kbd } from "@/components/ui/kbd";
import { Progress } from "@/components/ui/progress";
import type { StudyItem } from "@/lib/learning/queue";
import { duration, easeOutQuint } from "@/lib/motion";
import { useSpeech } from "@/lib/learning/use-speech";
import { cn } from "@/lib/utils";

type Phase = "intro" | "question" | "answer";
type Grade = 1 | 2 | 3 | 4;

const RATINGS: { grade: Grade; label: string; dot: string }[] = [
  { grade: 1, label: "Боз", dot: "bg-destructive" },
  { grade: 2, label: "Душвор", dot: "bg-warning" },
  { grade: 3, label: "Хуб", dot: "bg-success" },
  { grade: 4, label: "Осон", dot: "bg-primary" },
];

const POS: Record<string, string> = {
  noun: "исм",
  verb: "феъл",
  adj: "сифат",
  adv: "зарф",
  num: "шумора",
  phrase: "ибора",
  interj: "нидо",
};

export function LearnSession({ initial }: { initial: StudyItem[] }) {
  const [queue, setQueue] = useState(initial);
  const [phase, setPhase] = useState<Phase>(initial[0]?.isNew ? "intro" : "question");
  const [done, setDone] = useState({ reviews: 0, correct: 0, newWords: 0 });
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const shownAt = useRef(0);
  const { speak, supported } = useSpeech();

  const current = queue[0];
  const total = done.reviews + queue.length;

  // Вақти нишон додани савол сабт мешавад (барои омор) ва калима талаффуз мешавад
  useEffect(() => {
    if (!current) return;
    shownAt.current = performance.now();
    if (phase !== "answer") speak(current.word.term);
  }, [current, phase, speak]);

  const reveal = useCallback(() => {
    if (!current) return;
    setPhase("answer");
    if (current.word.example) speak(current.word.example, 0.85);
  }, [current, speak]);

  const startRecall = useCallback(() => setPhase("question"), []);

  const rate = useCallback(
    (grade: Grade) => {
      if (!current || isPending) return;
      const item = current;
      const durationMs = Math.round(performance.now() - shownAt.current);
      setError(null);
      startTransition(async () => {
        const res = await submitReview({ wordId: item.word.id, rating: grade, durationMs });
        if (!res.ok) {
          setError(res.error);
          return;
        }
        setDone((d) => ({
          reviews: d.reviews + 1,
          correct: d.correct + (grade > 1 ? 1 : 0),
          newWords: d.newWords + (item.isNew ? 1 : 0),
        }));
        const rest = queue.slice(1);
        const nextQueue = res.requeue ? [...rest, { ...item, isNew: false, intervals: res.intervals }] : rest;
        setQueue(nextQueue);
        setPhase(nextQueue[0]?.isNew ? "intro" : "question");
      });
    },
    [current, isPending, queue],
  );

  // Клавиатура: Space ё Enter — нишон додан / идома, 1–4 — баҳо
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.repeat || e.metaKey || e.ctrlKey || e.altKey) return;
      if (e.code === "Space" || e.key === "Enter") {
        e.preventDefault();
        if (phase === "intro") startRecall();
        else if (phase === "question") reveal();
      } else if (phase === "answer" && ["1", "2", "3", "4"].includes(e.key)) {
        rate(Number(e.key) as Grade);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [phase, reveal, startRecall, rate]);

  if (!current) return <SessionComplete {...done} />;

  const w = current.word;
  const progress = total ? (done.reviews / total) * 100 : 0;
  const showAnswer = phase !== "question";

  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-lg flex-col px-4 pt-4 pb-6 sm:pt-10">
      <div className="flex items-center gap-3">
        <Button asChild variant="ghost" size="icon" aria-label="Қатъ кардани дарс">
          <Link href="/app">
            <X />
          </Link>
        </Button>
        <Progress value={progress} className="h-1.5" aria-label="Пешрафти дарс" />
        <span className="w-12 text-right text-xs text-muted-foreground tabular-nums">
          {done.reviews}/{total}
        </span>
      </div>

      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={`${w.id}-${done.reviews}`}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: duration.base, ease: easeOutQuint }}
          className="mt-8 flex flex-1 flex-col sm:flex-none"
        >
          <Card className="gap-0 py-0">
            <CardHeader className="flex flex-row items-center justify-between border-b py-3">
              <Badge variant={current.isNew ? "secondary" : "outline"}>{current.isNew ? "Калимаи нав" : "Такрор"}</Badge>
              {supported && (
                <Button variant="ghost" size="icon" onClick={() => speak(w.term)} aria-label="Гӯш кардан">
                  <Volume2 />
                </Button>
              )}
            </CardHeader>
            <CardContent className="py-10 text-center">
              <h1 className="text-4xl font-semibold tracking-tight break-words sm:text-5xl">{w.term}</h1>
              <p className="mt-2 text-sm text-muted-foreground">
                {w.ipa}
                {w.partOfSpeech && POS[w.partOfSpeech] && ` · ${POS[w.partOfSpeech]}`}
              </p>

              {showAnswer ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: duration.base, ease: easeOutQuint }}
                  className="mt-6 grid gap-4"
                >
                  <p className="text-2xl font-medium">{w.translation}</p>
                  {w.mnemonic && (
                    <div className="rounded-lg border p-3 text-left text-sm">
                      <p className="text-xs font-medium text-muted-foreground">Барои дар ёд доштан</p>
                      <p className="mt-1 leading-relaxed">{w.mnemonic}</p>
                    </div>
                  )}
                  {w.example && (
                    <button
                      type="button"
                      onClick={() => speak(w.example!, 0.85)}
                      className="rounded-lg border bg-muted/40 p-3 text-left text-sm transition-colors hover:bg-muted"
                    >
                      <span className="block font-medium">{w.example}</span>
                      <span className="block text-muted-foreground">{w.exampleTranslation}</span>
                    </button>
                  )}
                </motion.div>
              ) : (
                <p className="mt-8 text-sm text-muted-foreground">Тарҷумаашро дар ёд оред, баъд санҷед.</p>
              )}
            </CardContent>
          </Card>

          {error && (
            <Alert variant="destructive" className="mt-4">
              <AlertCircle />
              <AlertDescription role="alert">{error}</AlertDescription>
            </Alert>
          )}

          <div className="mt-auto pt-6 sm:mt-6 sm:pt-0">
            {phase === "intro" && (
              <Button onClick={startRecall} className="h-10 w-full">
                Фаҳмидам, акнун санҷед
                <Kbd className="ml-1 hidden sm:inline-flex">Space</Kbd>
              </Button>
            )}
            {phase === "question" && (
              <Button onClick={reveal} className="h-10 w-full">
                Тарҷумаро нишон деҳ
                <Kbd className="ml-1 hidden sm:inline-flex">Space</Kbd>
              </Button>
            )}
            {phase === "answer" && (
              <div>
                <p className="mb-3 text-center text-sm text-muted-foreground">Чӣ қадар осон дар ёдатон омад?</p>
                <div className="grid grid-cols-4 gap-2">
                  {RATINGS.map((r) => (
                    <Button
                      key={r.grade}
                      variant="outline"
                      disabled={isPending}
                      onClick={() => rate(r.grade)}
                      className="h-auto flex-col gap-1 py-2.5 transition-transform active:scale-95"
                    >
                      <span className="flex items-center gap-1.5 font-medium">
                        <span className={cn("size-1.5 rounded-full", r.dot)} />
                        {r.label}
                      </span>
                      <span className="text-xs font-normal text-muted-foreground">{current.intervals[r.grade]}</span>
                      <Kbd className="hidden sm:inline-flex">{r.grade}</Kbd>
                    </Button>
                  ))}
                </div>
                <p className="mt-3 h-4 text-center text-xs text-muted-foreground">
                  {isPending && (
                    <span className="inline-flex items-center gap-1.5">
                      <Loader2 className="size-3 animate-spin" /> Захира мешавад…
                    </span>
                  )}
                </p>
              </div>
            )}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

function SessionComplete({ reviews, correct, newWords }: { reviews: number; correct: number; newWords: number }) {
  const accuracy = reviews ? Math.round((correct / reviews) * 100) : 0;
  const reduce = useReducedMotion();

  // Як лаҳзаи ҷашн: конфетти танҳо пас аз ҷаласаи воқеан гузашта
  useEffect(() => {
    if (!reviews || reduce) return;
    const colors = ["#2a44d4", "#0e9f8e", "#f2a30f", "#d2334c", "#a3a3a3"];
    const fire = (originX: number, angle: number) =>
      confetti({ particleCount: 60, spread: 70, startVelocity: 45, angle, origin: { x: originX, y: 0.75 }, colors, ticks: 220, scalar: 0.9 });
    fire(0.15, 60);
    fire(0.85, 120);
    const t = window.setTimeout(() => confetti({ particleCount: 40, spread: 100, origin: { y: 0.6 }, colors, scalar: 0.8 }), 280);
    return () => window.clearTimeout(t);
  }, [reviews, reduce]);
  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-md flex-col justify-center px-4 py-10">
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: duration.slow, ease: easeOutQuint }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl">
              <CheckCircle2 className="size-5 text-success" />
              {reviews ? "Ҷаласа анҷом ёфт" : "Барои имрӯз ҳамааш тамом"}
            </CardTitle>
            <CardDescription>
              {reviews
                ? "Калимаҳо дар вақти лозимӣ барои такрор бармегарданд."
                : "Ҳоло калимае барои такрор нест. Фардо калимаҳои нав интизори шумо ҳастанд."}
            </CardDescription>
          </CardHeader>
          {reviews > 0 && (
            <CardContent>
              <dl className="grid grid-cols-3 divide-x rounded-lg border">
                {[
                  { v: newWords, l: "калимаи нав", suffix: "" },
                  { v: reviews, l: "ҷавоб", suffix: "" },
                  { v: accuracy, l: "дуруст", suffix: "%" },
                ].map((s) => (
                  <div key={s.l} className="p-3 text-center">
                    <dt className="text-xl font-semibold tabular-nums">
                      <NumberTicker value={s.v} suffix={s.suffix} />
                    </dt>
                    <dd className="text-xs text-muted-foreground">{s.l}</dd>
                  </div>
                ))}
              </dl>
            </CardContent>
          )}
          <CardFooter>
            <Button asChild className="h-9 w-full">
              <Link href="/app">Ба саҳифаи асосӣ</Link>
            </Button>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
}
