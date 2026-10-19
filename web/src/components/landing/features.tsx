import type { ReactNode } from "react";
import { Emoji, type EmojiName } from "@/components/ui/emoji";
import { cn } from "@/lib/cn";
import { SectionHeading } from "./section-heading";

function Card({
  emoji,
  title,
  text,
  badge,
  className,
  children,
}: {
  emoji: EmojiName;
  title: string;
  text: string;
  badge?: string;
  className?: string;
  children?: ReactNode;
}) {
  return (
    <article
      className={cn(
        "flex flex-col overflow-hidden rounded-3xl border border-border bg-bg-elevated p-7 shadow-sm transition-shadow hover:shadow-md",
        className,
      )}
    >
      <div className="flex items-center gap-3">
        <Emoji name={emoji} size={36} />
        <h3 className="text-lg font-bold tracking-tight">{title}</h3>
        {badge && (
          <span className="ml-auto rounded-full bg-bg-muted px-2.5 py-1 text-xs font-semibold text-fg-muted">{badge}</span>
        )}
      </div>
      <p className="mt-3 leading-relaxed text-fg-muted">{text}</p>
      {children && <div className="mt-6 flex flex-1 flex-col justify-end">{children}</div>}
    </article>
  );
}

export function Features() {
  return (
    <section id="features" className="mx-auto max-w-6xl scroll-mt-20 px-4 py-20 sm:px-6 md:py-28">
      <SectionHeading
        eyebrow="Имконот"
        title="Ҳама чиз барои омӯзиш дар як ҷо"
        description="Ҳар функсия як мақсад дорад: ту бояд зудтар омӯзӣ ва дертар фаромӯш кунӣ."
      />

      <div className="mt-14 grid gap-4 md:grid-cols-6">
        <Card
          emoji="brain"
          title="Такрори фосилавӣ (FSRS)"
          text="Ҳар калима ҷадвали такрори худро дорад. Агар калима осон бошад, фосилаи такрор дароз мешавад. Агар душвор бошад, зудтар бармегардад."
          className="md:col-span-4"
        >
          <div className="rounded-2xl bg-bg-muted p-5">
            <div className="mb-4 flex items-center justify-between text-xs font-semibold text-fg-muted">
              <span>Ҷадвали такрори калимаи «door»</span>
              <span className="text-fg-subtle">намуна</span>
            </div>
            <div className="relative flex items-center justify-between">
              <div className="absolute inset-x-3 top-1/2 h-0.5 -translate-y-1/2 bg-border-strong" />
              {["Имрӯз", "1 рӯз", "4 рӯз", "11 рӯз", "1 моҳ", "3 моҳ"].map((d, i) => (
                <div key={d} className="relative flex flex-col items-center gap-2">
                  <span
                    className={cn(
                      "size-4 rounded-full border-[3px] border-bg-muted",
                      i < 3 ? "bg-success" : "bg-border-strong",
                    )}
                  />
                  <span className="absolute top-6 text-[11px] font-semibold whitespace-nowrap text-fg-muted">{d}</span>
                </div>
              ))}
            </div>
            <div className="h-6" />
          </div>
        </Card>

        <Card
          emoji="speech_balloon"
          title="Омӯзгори AI"
          text="Ҳар саволро бо забони тоҷикӣ пурс. AI хатогиатро бо мисол мефаҳмонад."
          className="md:col-span-2"
        >
          <div className="space-y-2 text-[13px] leading-snug">
            <div className="ml-auto w-fit max-w-[85%] rounded-2xl rounded-br-md bg-brand px-3.5 py-2 text-brand-fg">
              Чаро «went», на «goed»?
            </div>
            <div className="w-fit max-w-[90%] rounded-2xl rounded-bl-md bg-bg-muted px-3.5 py-2">
              «Go» феъли нодуруст аст. Шакли гузаштаи он аз қоида пайравӣ намекунад, бинобар ин онро бояд дар ёд гирифт.
            </div>
          </div>
        </Card>

        <Card
          emoji="speaker_high_volume"
          title="Талаффуз"
          text="Ҳар калима ва ҷумларо гӯш кун. Баъдтар AI талаффузи туро низ месанҷад."
          className="md:col-span-2"
        >
          <div className="flex h-14 items-center gap-[3px]" aria-hidden>
            {[30, 55, 40, 80, 60, 95, 70, 45, 85, 50, 65, 35, 75, 55, 40, 60, 30, 50, 25].map((h, i) => (
              <span key={i} className="flex-1 rounded-full bg-brand/70" style={{ height: `${h}%` }} />
            ))}
          </div>
        </Card>

        <Card
          emoji="puzzle_piece"
          title="Мантиқи ҳаррӯза"
          text="Ҳар рӯз як масъалаи нав: қатори рақамҳо, шаклҳо ва хулосабарорӣ."
          className="md:col-span-2"
        >
          <div className="flex items-center justify-between gap-1.5 font-mono text-lg font-bold">
            {["2", "6", "12", "20", "?"].map((n) => (
              <span
                key={n}
                className={cn(
                  "flex h-12 flex-1 items-center justify-center rounded-xl",
                  n === "?" ? "bg-brand-soft text-brand ring-2 ring-brand/30" : "bg-bg-muted",
                )}
              >
                {n}
              </span>
            ))}
          </div>
        </Card>

        <Card
          emoji="chart_increasing"
          title="Харитаи пешрафт"
          text="Мебинӣ, ки чанд калима омӯхтӣ, кадомашро фаромӯш мекунӣ ва дар кадом самт пешрафт кардӣ."
          className="md:col-span-2"
        >
          <div className="space-y-3">
            {[
              { k: "Луғат", v: 72, c: "bg-brand" },
              { k: "Грамматика", v: 48, c: "bg-success" },
              { k: "Мантиқ", v: 60, c: "bg-warning" },
            ].map((r) => (
              <div key={r.k}>
                <div className="mb-1 flex justify-between text-xs font-semibold text-fg-muted">
                  <span>{r.k}</span>
                  <span>{r.v}%</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-bg-muted">
                  <div className={cn("h-full rounded-full", r.c)} style={{ width: `${r.v}%` }} />
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div className="mt-4 flex flex-col items-center gap-5 rounded-3xl border border-dashed border-border-strong p-7 text-center sm:flex-row sm:text-left">
        <Emoji name="trophy" size={48} />
        <div className="flex-1">
          <h3 className="text-lg font-bold tracking-tight">UstodAI Arena</h3>
          <p className="mt-1 text-fg-muted">
            Мусобиқаҳои ҳафтаина, рейтинги донишҷӯён ва мусобиқа байни донишгоҳҳо.
          </p>
        </div>
        <span className="rounded-full bg-brand-soft px-3.5 py-1.5 text-sm font-semibold text-brand">Ба зудӣ</span>
      </div>
    </section>
  );
}
