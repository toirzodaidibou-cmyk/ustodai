import { ArrowRight, Volume2 } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";
import { Emoji } from "@/components/ui/emoji";

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      {/* Нури пасзамина */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 -top-40 -z-10 mx-auto h-140 max-w-5xl rounded-full bg-[radial-gradient(closest-side,var(--brand-soft),transparent)] opacity-90"
      />
      <div className="mx-auto grid max-w-6xl items-center gap-14 px-4 pt-14 pb-20 sm:px-6 md:pt-20 lg:grid-cols-[1.2fr_0.8fr] lg:gap-10 lg:pb-28">
        <div className="animate-fade-up text-center lg:text-left">
          <span className="inline-flex items-center gap-2 rounded-full border border-border bg-bg-elevated py-1 pr-3.5 pl-1.5 text-[13px] font-medium text-fg-muted shadow-sm">
            <span className="flex size-6 items-center justify-center rounded-full bg-brand-soft">
              <Emoji name="sparkles" size={16} />
            </span>
            Омӯзгори AI, ки бо забони тоҷикӣ мефаҳмонад
          </span>

          <h1 className="mt-6 text-[2.6rem] leading-[1.05] font-extrabold tracking-[-0.035em] text-balance sm:text-6xl lg:text-[3.3rem]">
            Забонҳоро зудтар омӯз.
            <br />
            <span className="bg-linear-to-r from-brand to-[#c026d3] bg-clip-text text-transparent">
              Дар хотира нигоҳ дор.
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-pretty text-fg-muted lg:mx-0">
            UstodAI калимаҳоро маҳз ҳамон вақте такрор мекунонад, ки онҳоро фаромӯш карданӣ ҳастӣ. Барои ҳар калима
            ассотсиатсия месозад ва грамматикаро бо забони модариат мефаҳмонад. Дар як рӯз танҳо 15 дақиқа.
          </p>

          <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row lg:justify-start">
            <ButtonLink href="#start" size="lg" className="w-full sm:w-auto">
              Ройгон оғоз кун
              <ArrowRight className="size-4.5" strokeWidth={2.5} />
            </ButtonLink>
            <ButtonLink href="#how" variant="secondary" size="lg" className="w-full sm:w-auto">
              Чӣ тавр кор мекунад
            </ButtonLink>
          </div>

          <ul className="mt-9 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-fg-muted lg:justify-start">
            {["Бе реклама", "Дар телефон ва компютер", "Аз сатҳи сифр"].map((t) => (
              <li key={t} className="flex items-center gap-1.5">
                <Emoji name="check_mark_button" size={18} />
                {t}
              </li>
            ))}
          </ul>
        </div>

        <PhoneMockup />
      </div>
    </section>
  );
}

/** Намоиши экрани дарс: як корти калима бо мнемоникаи AI ва баҳодиҳии FSRS */
function PhoneMockup() {
  return (
    <div className="relative mx-auto w-full max-w-85 animate-fade-up [animation-delay:150ms]">
      {/* Чипҳои шинокунанда */}
      <div className="absolute top-16 -left-6 z-10 hidden animate-float items-center gap-2 rounded-2xl border border-border bg-bg-elevated px-3.5 py-2.5 shadow-lg sm:flex">
        <Emoji name="fire" size={28} />
        <div className="leading-tight">
          <div className="text-sm font-bold">12 рӯз</div>
          <div className="text-xs text-fg-muted">пай дар пай</div>
        </div>
      </div>
      <div className="absolute -right-6 -bottom-6 z-10 hidden animate-float items-center gap-2 rounded-2xl border border-border bg-bg-elevated px-3.5 py-2.5 shadow-lg [animation-delay:1.5s] sm:flex">
        <Emoji name="brain" size={28} />
        <div className="leading-tight">
          <div className="text-sm font-bold">Такрор пас аз 4 рӯз</div>
          <div className="text-xs text-fg-muted">алгоритми FSRS</div>
        </div>
      </div>

      {/* Телефон */}
      <div className="relative rounded-[3rem] border border-border-strong bg-bg-elevated p-2.5 shadow-lg">
        <div className="overflow-hidden rounded-[2.5rem] bg-bg">
          {/* Status bar */}
          <div className="relative flex h-11 items-center justify-between px-7 text-[13px] font-semibold">
            <span>9:41</span>
            <span className="absolute left-1/2 h-6 w-24 -translate-x-1/2 rounded-full bg-fg" />
            <span className="flex gap-1">
              <span className="h-2.5 w-4 rounded-sm bg-fg" />
            </span>
          </div>

          <div className="px-5 pt-3 pb-6">
            {/* Пешрафти дарс */}
            <div className="flex items-center gap-3">
              <div className="h-2 flex-1 overflow-hidden rounded-full bg-bg-muted">
                <div className="h-full w-[62%] rounded-full bg-success" />
              </div>
              <span className="text-xs font-semibold text-fg-muted">8/13</span>
            </div>

            {/* Корти калима */}
            <div className="mt-5 rounded-3xl border border-border bg-bg-elevated p-5 shadow-md">
              <div className="flex items-center justify-between">
                <span className="rounded-full bg-brand-soft px-2.5 py-1 text-[11px] font-bold tracking-wide text-brand uppercase">
                  English · A1
                </span>
                <span className="flex size-9 items-center justify-center rounded-full bg-bg-muted" aria-hidden>
                  <Volume2 className="size-4.5 text-fg-muted" />
                </span>
              </div>
              <div className="mt-5 text-center">
                <div className="text-[2rem] font-extrabold tracking-tight">door</div>
                <div className="mt-1 text-sm text-fg-subtle">/dɔːr/</div>
                <div className="mt-3 text-lg font-semibold text-fg-muted">дар</div>
              </div>

              <div className="mt-5 rounded-2xl bg-warning-soft p-3.5">
                <div className="flex items-center gap-1.5 text-xs font-bold text-warning">
                  <Emoji name="light_bulb" size={16} />
                  Мнемоникаи AI
                </div>
                <p className="mt-1.5 text-[13px] leading-snug text-fg">
                  <b>«Door»</b> мисли <b>«дур»</b> садо медиҳад: <i>дари хона дур аст.</i> Ҷолиб он аст, ки <b>door</b> ва{" "}
                  <b>дар</b> аз як решаи қадимӣ омадаанд.
                </p>
              </div>

              <div className="mt-3 rounded-2xl bg-bg-muted p-3.5 text-[13px] leading-snug">
                Close the <span className="font-semibold">door</span>, please.
                <div className="text-fg-muted">Лутфан, дарро пӯш.</div>
              </div>
            </div>

            {/* Баҳодиҳӣ (Again / Hard / Good / Easy) */}
            <div className="mt-5 grid grid-cols-4 gap-2 text-center text-[11px] font-semibold">
              {[
                { label: "Боз", sub: "1 дақ", cls: "bg-danger-soft text-danger" },
                { label: "Душвор", sub: "1 рӯз", cls: "bg-warning-soft text-warning" },
                { label: "Хуб", sub: "4 рӯз", cls: "bg-success-soft text-success ring-2 ring-success/40" },
                { label: "Осон", sub: "9 рӯз", cls: "bg-brand-soft text-brand" },
              ].map((b) => (
                <div key={b.label} className={`rounded-2xl px-1 py-2.5 ${b.cls}`}>
                  <div>{b.label}</div>
                  <div className="mt-0.5 font-medium opacity-75">{b.sub}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
