import { Emoji, type EmojiName } from "@/components/ui/emoji";
import { SectionHeading } from "./section-heading";

const items: { emoji: EmojiName; title: string; text: string }[] = [
  {
    emoji: "globe_showing_asia-australia",
    title: "Барномаҳо тоҷикиро намедонанд",
    text: "Барномаҳои машҳури забономӯзӣ забони тоҷикиро ҳамчун забони асос дастгирӣ намекунанд. Донишҷӯ маҷбур аст забони навро тавассути забони дигар омӯзад.",
  },
  {
    emoji: "alarm_clock",
    title: "Калимаҳо зуд фаромӯш мешаванд",
    text: "Бе такрори дуруст, калимаи навомӯхта дар чанд рӯз аз хотира меравад. Рӯйхати калимаҳоро аз сар хондан вақтро бехуда сарф мекунад.",
  },
  {
    emoji: "bullseye",
    title: "Ҳама як барномаро мехонанд",
    text: "Як нафар калимаҳоро зуд дар ёд мегирад, дигаре грамматикаро. Китоби дарсӣ ба сатҳ ва хатогиҳои ҳар кас мутобиқ намешавад.",
  },
];

export function Problem() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6 md:py-28">
      <SectionHeading
        eyebrow="Мушкил"
        title="Чаро омӯхтани забон ин қадар душвор аст?"
        description="Мушкил дар қобилияти ту нест. Мушкил дар усули омӯзиш аст. UstodAI се монеаи асосиро бартараф мекунад."
      />
      <div className="mt-14 grid gap-4 md:grid-cols-3">
        {items.map((it) => (
          <article
            key={it.title}
            className="rounded-3xl border border-border bg-bg-elevated p-7 shadow-sm transition-shadow hover:shadow-md"
          >
            <div className="flex size-14 items-center justify-center rounded-2xl bg-bg-muted">
              <Emoji name={it.emoji} size={36} />
            </div>
            <h3 className="mt-5 text-lg font-bold tracking-tight">{it.title}</h3>
            <p className="mt-2 leading-relaxed text-fg-muted">{it.text}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
