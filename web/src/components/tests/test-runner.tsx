"use client";

import { useCallback, useEffect, useRef, useState, useTransition } from "react";
import { AnimatePresence, motion } from "motion/react";
import { AlertCircle, ArrowLeft, ArrowRight, Check, Clock, Loader2 } from "lucide-react";
import { answerAction, finishTestAction } from "@/app/app/tests/actions";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Kbd } from "@/components/ui/kbd";
import { cn } from "@/lib/utils";

const LETTERS = ["А", "Б", "В", "Г"];
const ease = [0.22, 1, 0.36, 1] as const;

type Item = { position: number; stem: string; options: string[]; chosenIndex: number | null; topic: string };

type Props = {
  attemptId: number;
  items: Item[];
  /** Мӯҳлат ва вақти сервер (ISO) — барои ҳисоби дақиқи вақт новобаста аз соати компютер */
  deadline: string;
  serverNow: string;
  title: string;
};

function formatClock(ms: number) {
  const s = Math.max(0, Math.ceil(ms / 1000));
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
}

export function TestRunner({ attemptId, items, deadline, serverNow, title }: Props) {
  const [answers, setAnswers] = useState<(number | null)[]>(() => items.map((i) => i.chosenIndex));
  const [current, setCurrent] = useState(() => Math.max(0, items.findIndex((i) => i.chosenIndex === null)));
  const [remaining, setRemaining] = useState<number | null>(null);
  const [saving, setSaving] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [confirming, setConfirming] = useState(false);
  const [finishing, startFinishing] = useTransition();
  const finishedRef = useRef(false);

  const total = items.length;
  const answered = answers.filter((a) => a !== null).length;
  const item = items[current];

  const finish = useCallback(() => {
    if (finishedRef.current) return;
    finishedRef.current = true;
    startFinishing(async () => {
      await finishTestAction(attemptId);
    });
  }, [attemptId]);

  // Таймер: фарқи соати сервер ва браузер як бор ҳисоб мешавад
  useEffect(() => {
    const offset = Date.parse(serverNow) - Date.now();
    const end = Date.parse(deadline);
    const tick = () => {
      const left = end - (Date.now() + offset);
      setRemaining(left);
      if (left <= 0) finish();
    };
    tick();
    const id = window.setInterval(tick, 500);
    return () => window.clearInterval(id);
  }, [deadline, serverNow, finish]);

  const choose = useCallback(
    async (index: number) => {
      if (finishedRef.current) return;
      const position = items[current].position;
      setAnswers((a) => a.map((v, i) => (i === current ? index : v)));
      setError(null);
      setSaving((n) => n + 1);
      const res = await answerAction(attemptId, position, index);
      setSaving((n) => n - 1);
      if (!res.ok) setError(res.error);
    },
    [attemptId, current, items],
  );

  const go = useCallback((delta: number) => {
    setConfirming(false);
    setCurrent((c) => Math.min(total - 1, Math.max(0, c + delta)));
  }, [total]);

  const requestFinish = () => {
    if (answered < total && !confirming) setConfirming(true);
    else finish();
  };

  // Клавиатура: 1–4 — ҷавоб, ← → — саволҳо
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey || e.repeat) return;
      if (["1", "2", "3", "4"].includes(e.key)) choose(Number(e.key) - 1);
      else if (e.key === "ArrowRight") go(1);
      else if (e.key === "ArrowLeft") go(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [choose, go]);

  const low = remaining !== null && remaining < 60_000;

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col">
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate text-sm font-medium">{title}</p>
          <p className="text-xs text-muted-foreground tabular-nums">
            {answered} аз {total} ҷавоб дода шуд
          </p>
        </div>
        <div
          className={cn(
            "flex items-center gap-1.5 rounded-md border px-2.5 py-1 text-sm font-medium tabular-nums transition-colors",
            low && "border-destructive/40 bg-destructive/10 text-destructive",
          )}
          role="timer"
          aria-label="Вақти боқимонда"
        >
          <Clock className="size-3.5" />
          {remaining === null ? "–:––" : formatClock(remaining)}
        </div>
      </div>

      <nav aria-label="Саволҳо" className="mt-4 flex flex-wrap gap-1.5">
        {items.map((it, i) => (
          <button
            key={it.position}
            type="button"
            onClick={() => {
              setConfirming(false);
              setCurrent(i);
            }}
            aria-label={`Саволи ${i + 1}${answers[i] !== null ? ", ҷавоб дода шуд" : ""}`}
            aria-current={i === current ? "step" : undefined}
            className={cn(
              "flex size-8 items-center justify-center rounded-md border text-xs font-medium tabular-nums transition-colors",
              answers[i] !== null && "border-foreground bg-foreground text-background",
              i === current && "ring-2 ring-ring/50 ring-offset-2 ring-offset-background",
            )}
          >
            {i + 1}
          </button>
        ))}
      </nav>

      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={item.position}
          initial={{ opacity: 0, x: 16 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -16 }}
          transition={{ duration: 0.25, ease }}
          className="mt-6"
        >
          <Card className="gap-0 py-0">
            <CardHeader className="flex flex-row items-center justify-between border-b py-3">
              <span className="text-sm text-muted-foreground tabular-nums">
                Саволи {current + 1} аз {total}
              </span>
              <Badge variant="secondary">{item.topic}</Badge>
            </CardHeader>
            <CardContent className="py-6">
              <h1 className="text-lg leading-relaxed font-medium text-pretty sm:text-xl">{item.stem}</h1>
              <div role="radiogroup" aria-label="Ҷавобҳо" className="mt-6 grid gap-2.5">
                {item.options.map((opt, i) => {
                  const on = answers[current] === i;
                  return (
                    <motion.button
                      key={i}
                      type="button"
                      role="radio"
                      aria-checked={on}
                      onClick={() => choose(i)}
                      whileTap={{ scale: 0.99 }}
                      className={cn(
                        "flex items-center gap-3 rounded-lg border bg-card p-3 text-left transition-[border-color,background-color] hover:bg-muted/50",
                        on && "border-foreground bg-muted/60 ring-1 ring-foreground",
                      )}
                    >
                      <span
                        className={cn(
                          "flex size-7 shrink-0 items-center justify-center rounded-md border text-sm font-semibold transition-colors",
                          on && "border-foreground bg-foreground text-background",
                        )}
                      >
                        {on ? <Check className="size-3.5" strokeWidth={3} /> : LETTERS[i]}
                      </span>
                      <span className="flex-1">{opt}</span>
                      <Kbd className="hidden sm:inline-flex">{i + 1}</Kbd>
                    </motion.button>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </AnimatePresence>

      {error && (
        <Alert variant="destructive" className="mt-4">
          <AlertCircle />
          <AlertDescription role="alert">{error}</AlertDescription>
        </Alert>
      )}

      {confirming && (
        <Alert className="mt-4">
          <AlertCircle />
          <AlertDescription>
            {total - answered} савол бе ҷавоб монд. Саволҳои бе ҷавоб нодуруст ҳисоб мешаванд. Бо вуҷуди ин анҷом диҳед?
          </AlertDescription>
        </Alert>
      )}

      <div className="mt-6 flex items-center gap-2">
        <Button variant="outline" onClick={() => go(-1)} disabled={current === 0} className="h-9">
          <ArrowLeft />
          Қаблӣ
        </Button>
        <span className="flex-1 text-center text-xs text-muted-foreground">
          {saving > 0 && (
            <span className="inline-flex items-center gap-1.5">
              <Loader2 className="size-3 animate-spin" /> Захира мешавад…
            </span>
          )}
        </span>
        {current < total - 1 ? (
          <Button onClick={() => go(1)} className="h-9">
            Навбатӣ
            <ArrowRight />
          </Button>
        ) : (
          <Button onClick={requestFinish} disabled={finishing || saving > 0} className="h-9">
            {finishing && <Loader2 className="animate-spin" />}
            {confirming ? "Ҳа, анҷом додан" : "Анҷом додан"}
          </Button>
        )}
      </div>
      {current < total - 1 && (
        <Button variant="ghost" onClick={requestFinish} disabled={finishing || saving > 0} className="mt-2 h-8 self-center text-xs text-muted-foreground">
          {confirming ? "Ҳа, ҳозир анҷом додан" : "Тестро анҷом додан"}
        </Button>
      )}
    </div>
  );
}
