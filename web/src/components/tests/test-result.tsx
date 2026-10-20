import Link from "next/link";
import { ArrowLeft, Check, RotateCcw, X } from "lucide-react";
import { startTestAction } from "@/app/app/tests/actions";
import { NumberTicker } from "@/components/motion/number-ticker";
import { Stagger, StaggerItem } from "@/components/motion/reveal";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ilmPlace } from "@/lib/tests";
import { cn } from "@/lib/utils";

const LETTERS = ["А", "Б", "В", "Г"];

type Item = {
  position: number;
  chosenIndex: number | null;
  isCorrect: boolean | null;
  stem: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  topic: string;
};

type Props = {
  attempt: {
    id: number;
    subject: string;
    competition: string | null;
    total: number;
    correct: number | null;
    scorePercent: number | null;
    startedAt: Date;
    finishedAt: Date | null;
  };
  items: Item[];
  title: string;
};

function duration(a: Date, b: Date) {
  const s = Math.max(0, Math.round((b.getTime() - a.getTime()) / 1000));
  return `${Math.floor(s / 60)} дақ ${s % 60} сон`;
}

export function TestResult({ attempt, items, title }: Props) {
  const percent = attempt.scorePercent ?? 0;
  const correct = attempt.correct ?? 0;
  const isIlm = attempt.competition === "ilm-furugi-marifat";
  const place = isIlm ? ilmPlace(percent) : null;

  // Мавзӯъҳо: чанд дуруст аз чанд
  const byTopic = new Map<string, { ok: number; all: number }>();
  for (const it of items) {
    const t = byTopic.get(it.topic) ?? { ok: 0, all: 0 };
    t.all++;
    if (it.isCorrect) t.ok++;
    byTopic.set(it.topic, t);
  }

  return (
    <Stagger className="mx-auto grid w-full max-w-2xl gap-6">
      <StaggerItem>
        <Card>
          <CardHeader>
            <CardDescription>{title}</CardDescription>
            <CardTitle className="text-xl">Натиҷаи тест</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-5">
            <div className="flex items-end gap-6">
              <div>
                <div className="text-5xl font-semibold tracking-tight tabular-nums">
                  <NumberTicker value={percent} suffix="%" />
                </div>
                <p className="mt-1 text-sm text-muted-foreground tabular-nums">
                  {correct} аз {attempt.total} дуруст · {attempt.finishedAt && duration(attempt.startedAt, attempt.finishedAt)}
                </p>
              </div>
            </div>
            <Progress value={percent} aria-label="Хол" />
            {isIlm && (
              <div className="rounded-lg border p-3 text-sm">
                {place ? (
                  <>
                    <span className="font-medium">Ин натиҷа ба ҷойи {place} мувофиқ аст</span>
                    <span className="text-muted-foreground"> — аз рӯи қоидаҳои «Илм — фурӯғи маърифат» (75–100: 1, 60–75: 2, 50–60: 3).</span>
                  </>
                ) : (
                  <>
                    <span className="font-medium">Аз 50% кам</span>
                    <span className="text-muted-foreground">
                      {" "}
                      — дар даври ҷумҳуриявӣ бо ин натиҷа ба қисми дуюм роҳ дода намешавад. Хатоҳоро аз назар гузаронед ва боз кӯшиш кунед.
                    </span>
                  </>
                )}
                <p className="mt-1 text-xs text-muted-foreground">Ин тести машқӣ аст; саволҳо намунавӣ мебошанд, на саволҳои расмии озмун.</p>
              </div>
            )}
            {byTopic.size > 1 && (
              <div className="grid gap-2">
                <p className="text-sm font-medium">Аз рӯи мавзӯъҳо</p>
                {[...byTopic.entries()].map(([topic, t]) => (
                  <div key={topic} className="flex items-center gap-3 text-sm">
                    <span className="w-28 shrink-0 text-muted-foreground">{topic}</span>
                    <Progress value={(t.ok / t.all) * 100} className="h-1.5" aria-label={topic} />
                    <span className="w-10 shrink-0 text-right tabular-nums">
                      {t.ok}/{t.all}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
          <CardFooter className="gap-2">
            <form action={startTestAction}>
              <input type="hidden" name="subject" value={attempt.subject} />
              {attempt.competition && <input type="hidden" name="competition" value={attempt.competition} />}
              <Button type="submit" className="h-9">
                <RotateCcw />
                Боз як тест
              </Button>
            </form>
            <Button asChild variant="outline" className="h-9">
              <Link href={attempt.competition ? `/app/competitions/${attempt.competition}` : "/app"}>
                <ArrowLeft />
                {attempt.competition ? "Ба саҳифаи озмун" : "Ба саҳифаи асосӣ"}
              </Link>
            </Button>
          </CardFooter>
        </Card>
      </StaggerItem>

      <StaggerItem>
        <h2 className="mb-3 font-medium">Таҳлили ҷавобҳо</h2>
        <div className="grid gap-3">
          {items.map((it, i) => (
            <Card key={it.position} size="sm">
              <CardHeader>
                <div className="flex items-start gap-3">
                  <span
                    className={cn(
                      "mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full",
                      it.isCorrect ? "bg-success/15 text-success" : "bg-destructive/10 text-destructive",
                    )}
                    aria-label={it.isCorrect ? "Дуруст" : "Нодуруст"}
                  >
                    {it.isCorrect ? <Check className="size-3.5" strokeWidth={3} /> : <X className="size-3.5" strokeWidth={3} />}
                  </span>
                  <div className="min-w-0 flex-1">
                    <CardTitle className="text-sm leading-relaxed font-medium">
                      {i + 1}. {it.stem}
                    </CardTitle>
                    <Badge variant="secondary" className="mt-1.5">
                      {it.topic}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="grid gap-1.5 pl-12 text-sm">
                {it.options.map((opt, j) => {
                  const isRight = j === it.correctIndex;
                  const isChosen = j === it.chosenIndex;
                  return (
                    <div
                      key={j}
                      className={cn(
                        "flex items-center gap-2 rounded-md px-2 py-1",
                        isRight && "bg-success/10 font-medium",
                        isChosen && !isRight && "bg-destructive/10 line-through decoration-destructive/60",
                      )}
                    >
                      <span className="w-4 text-muted-foreground">{LETTERS[j]}</span>
                      <span className="flex-1">{opt}</span>
                      {isRight && <Check className="size-3.5 text-success" />}
                      {isChosen && !isRight && <span className="text-xs text-destructive">ҷавоби шумо</span>}
                    </div>
                  );
                })}
                {it.chosenIndex === null && <p className="text-xs text-destructive">Ба ин савол ҷавоб дода нашуд.</p>}
                <p className="mt-2 rounded-md bg-muted/50 p-2.5 text-[13px] leading-relaxed text-muted-foreground">
                  <span className="font-medium text-foreground">Шарҳ: </span>
                  {it.explanation}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </StaggerItem>
    </Stagger>
  );
}
