import { cn } from "@/lib/cn";
import { SectionHeading } from "./section-heading";

const langs = [
  { code: "EN", name: "Англисӣ", native: "English", status: "Аввал", live: true },
  { code: "RU", name: "Русӣ", native: "Русский", status: "Навбатӣ", live: false },
  { code: "中", name: "Чинӣ", native: "中文", status: "Дар нақша", live: false },
  { code: "DE", name: "Олмонӣ", native: "Deutsch", status: "Дар нақша", live: false },
];

export function Languages() {
  return (
    <section id="languages" className="mx-auto max-w-6xl scroll-mt-20 px-4 py-20 sm:px-6 md:py-28">
      <SectionHeading
        eyebrow="Забонҳо"
        title="Аз забони тоҷикӣ ба забонҳои ҷаҳон"
        description="Мо аз забони англисӣ оғоз мекунем ва онро пурра месозем. Баъд забонҳои дигар илова мешаванд."
      />
      <div className="mt-14 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {langs.map((l) => (
          <div
            key={l.code}
            className={cn(
              "rounded-3xl border bg-bg-elevated p-6 shadow-sm",
              l.live ? "border-brand/40 ring-4 ring-brand-soft" : "border-border",
            )}
          >
            <div
              className={cn(
                "flex size-12 items-center justify-center rounded-2xl text-lg font-extrabold",
                l.live ? "bg-brand text-brand-fg" : "bg-bg-muted text-fg-muted",
              )}
            >
              {l.code}
            </div>
            <div className="mt-5 text-lg font-bold tracking-tight">{l.name}</div>
            <div className="text-sm text-fg-subtle">{l.native}</div>
            <span
              className={cn(
                "mt-4 inline-block rounded-full px-2.5 py-1 text-xs font-semibold",
                l.live ? "bg-success-soft text-success" : "bg-bg-muted text-fg-muted",
              )}
            >
              {l.status}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
