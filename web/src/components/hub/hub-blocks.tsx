import Link from "next/link";
import type { ReactNode } from "react";
import { ArrowRight, CalendarClock, Play } from "lucide-react";
import { Stagger, StaggerItem } from "@/components/motion/reveal";
import { Badge } from "@/components/ui/badge";
import { COMPETITIONS, formatDate, nextStage, type Role } from "@/lib/competitions";
import { SUBJECTS } from "@/lib/subjects";
import { SECONDS_PER_QUESTION, TEST_SIZE, countQuestions } from "@/lib/tests";

export function HubHeader({ title, description, children }: { title: string; description: string; children?: ReactNode }) {
  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">{title}</h1>
      <p className="mt-2 max-w-2xl text-muted-foreground">{description}</p>
      {children}
    </div>
  );
}

export function HubSection({ title, action, children }: { title: string; action?: ReactNode; children: ReactNode }) {
  return (
    <section className="min-w-0">
      <div className="mb-3 flex items-center justify-between gap-3">
        <h2 className="font-medium">{title}</h2>
        {action}
      </div>
      {children}
    </section>
  );
}

/** Озмунҳо барои нақш, бо марҳилаи навбатӣ ва ҳисоби рӯзҳо. */
export function CompetitionsBlock({ role, now }: { role: Role; now: Date }) {
  const list = COMPETITIONS.filter((c) => c.roles.includes(role));
  return (
    <Stagger className="grid gap-3">
      {list.map((c) => {
        const next = nextStage(c, now);
        return (
          <StaggerItem key={c.id}>
            <Link
              href={`/app/competitions/${c.id}`}
              className="group flex items-center gap-4 rounded-xl border bg-card p-4 transition-colors hover:border-foreground/30"
            >
              <div className="flex w-14 shrink-0 flex-col items-center rounded-lg border bg-muted/40 py-2">
                {next ? (
                  <>
                    <span className="text-lg font-semibold tabular-nums">{next.days}</span>
                    <span className="text-[10px] text-muted-foreground">рӯз</span>
                  </>
                ) : (
                  <CalendarClock className="my-1 size-5 text-muted-foreground" />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate font-medium">{c.title}</p>
                <p className="mt-0.5 truncate text-sm text-muted-foreground">
                  {next
                    ? `${next.stage.label} — ${formatDate(next.stage.date!)}${next.stage.status === "estimated" ? " (тахминӣ)" : ""}`
                    : "Санаи навбатӣ ҳанӯз эълон нашудааст"}
                </p>
              </div>
              <ArrowRight className="size-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
            </Link>
          </StaggerItem>
        );
      })}
    </Stagger>
  );
}

/** Тестҳои машқӣ аз рӯи фанҳое, ки дар пойгоҳ савол доранд; фанҳои дигар «дар таҳия». */
export async function PracticeBlock({ grade }: { grade: number | null }) {
  const testSubjects = SUBJECTS.filter((s) => s.mode === "tests");
  const counts = await countQuestions(
    testSubjects.map((s) => s.id),
    grade,
  );
  const ready = testSubjects.filter((s) => (counts[s.id] ?? 0) > 0);
  const soon = testSubjects.filter((s) => !(counts[s.id] ?? 0));

  return (
    <div className="grid gap-3">
      {ready.length > 0 && (
        <div className="grid gap-2 sm:grid-cols-2">
          {ready.map((s) => {
            const n = Math.min(TEST_SIZE, counts[s.id] ?? 0);
            return (
              <Link
                key={s.id}
                href={`/app/subjects/${s.id}`}
                className="group flex min-w-0 items-center gap-3 rounded-xl border bg-card p-3 text-left transition-colors hover:border-foreground/30"
              >
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-lg border border-foreground bg-foreground text-sm font-semibold text-background">
                    {s.glyph}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block font-medium">{s.title}</span>
                    <span className="block text-xs text-muted-foreground">
                      {n} савол · {Math.round((n * SECONDS_PER_QUESTION) / 60)} дақиқа
                    </span>
                  </span>
                  <Play className="size-4 text-muted-foreground transition-transform group-hover:scale-110" />
              </Link>
            );
          })}
        </div>
      )}
      {soon.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {soon.map((s) => (
            <Badge key={s.id} variant="secondary" className="gap-1.5">
              {s.title}
              <span className="text-muted-foreground">· дар таҳия</span>
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
}

/** Рӯйхати модулҳои банақшагирифта (барои бахшҳое, ки ҳанӯз мундариҷа надоранд). */
export function PlannedList({ items }: { items: { title: string; text: string }[] }) {
  return (
    <Stagger className="grid gap-px overflow-hidden rounded-xl border bg-border sm:grid-cols-2">
      {items.map((it) => (
        <StaggerItem key={it.title} className="bg-card p-4">
          <div className="flex items-center gap-2">
            <p className="font-medium">{it.title}</p>
            <Badge variant="secondary" className="ml-auto">
              дар таҳия
            </Badge>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">{it.text}</p>
        </StaggerItem>
      ))}
    </Stagger>
  );
}
