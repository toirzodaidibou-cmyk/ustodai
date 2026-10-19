import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { Emoji } from "@/components/ui/emoji";

export function Cta() {
  return (
    <section id="start" className="mx-auto w-full max-w-6xl scroll-mt-20 px-4 pb-20 sm:px-6 md:pb-28">
      <div className="relative overflow-hidden rounded-[2rem] bg-[#15132b] px-6 py-16 text-center text-white sm:px-12 md:py-20">
        <div
          aria-hidden
          className="pointer-events-none absolute -top-32 left-1/2 h-96 w-3xl -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgb(124_116_255/0.45),transparent)]"
        />
        <div className="relative">
          <div className="flex justify-center gap-3">
            <Emoji name="rocket" size={52} className="animate-float" />
            <Emoji name="graduation_cap" size={52} className="animate-float [animation-delay:1s]" />
            <Emoji name="gem_stone" size={52} className="animate-float [animation-delay:2s]" />
          </div>
          <h2 className="mx-auto mt-7 max-w-2xl text-3xl font-extrabold tracking-[-0.03em] text-balance sm:text-5xl">
            Аввалин дарси худро имрӯз оғоз кун
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-lg text-pretty text-white/70">
            Ҳисоби ройгон бисоз. Версияи бета ҳоло сохта мешавад ва имкониятҳои нав ҳар ҳафта илова мешаванд.
          </p>
          <Link
            href="/auth/sign-up"
            className="mt-9 inline-flex h-13 items-center gap-2 rounded-full bg-white px-7 font-semibold text-[#15132b] transition hover:bg-white/90 active:scale-[0.97]"
          >
            Ройгон оғоз кун
            <ArrowRight className="size-4.5" strokeWidth={2.5} />
          </Link>
        </div>
      </div>
    </section>
  );
}
