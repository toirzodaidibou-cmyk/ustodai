import { Emoji, type EmojiName } from "@/components/ui/emoji";
import { SectionHeading } from "./section-heading";

const steps: { emoji: EmojiName; title: string; text: string; meta: string }[] = [
  {
    emoji: "bullseye",
    title: "Тести сатҳ",
    text: "Дар 3 дақиқа сатҳи туро аз A0 то B2 муайян мекунем, то вақтро барои чизҳои маълум сарф накунӣ.",
    meta: "3 дақиқа",
  },
  {
    emoji: "stopwatch",
    title: "Ҷаласаи ҳаррӯза",
    text: "Ҳар рӯз калимаҳои нав, такрори калимаҳои кӯҳна ва як масъалаи мантиқӣ. Ҳамааш дар як ҷаласаи кӯтоҳ.",
    meta: "15 дақиқа",
  },
  {
    emoji: "light_bulb",
    title: "Мнемоникаи AI",
    text: "Барои ҳар калимаи душвор AI ассотсиатсияи тоҷикӣ ва ҷумлаи мисол месозад. Калима ба хотира пайваст мешавад.",
    meta: "барои ҳар калима",
  },
  {
    emoji: "brain",
    title: "Такрор дар вақти дуруст",
    text: "Алгоритми FSRS ҳисоб мекунад, ки кай калимаро фаромӯш мекунӣ ва онро маҳз пеш аз он такрор мекунонад.",
    meta: "автоматӣ",
  },
];

export function HowItWorks() {
  return (
    <section id="how" className="scroll-mt-20 border-y border-border bg-bg-elevated">
      <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 md:py-28">
        <SectionHeading
          eyebrow="Чӣ тавр кор мекунад"
          title="Чор қадам то забони нав"
          description="Ту танҳо ҷаласаи имрӯзаро иҷро мекунӣ. Банақшагирии такрорҳоро UstodAI ба зимма мегирад."
        />
        <ol className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((s, i) => (
            <li key={s.title} className="relative rounded-3xl border border-border bg-bg p-6">
              <div className="flex items-center justify-between">
                <Emoji name={s.emoji} size={44} />
                <span className="font-mono text-sm font-semibold text-fg-subtle">0{i + 1}</span>
              </div>
              <h3 className="mt-6 text-lg font-bold tracking-tight">{s.title}</h3>
              <p className="mt-2 text-[15px] leading-relaxed text-fg-muted">{s.text}</p>
              <span className="mt-5 inline-block rounded-full bg-brand-soft px-3 py-1 text-xs font-semibold text-brand">
                {s.meta}
              </span>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
