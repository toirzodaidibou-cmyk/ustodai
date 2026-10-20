import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { NumberTicker } from "@/components/motion/number-ticker";
import { Reveal } from "@/components/motion/reveal";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { HeroIntro, HeroItem } from "./hero-intro";
import { LessonPreview } from "./lesson-preview";

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div aria-hidden className="bg-dot-grid pointer-events-none absolute inset-0 -z-10" />
      <div className="mx-auto grid max-w-6xl items-center gap-14 px-4 pt-16 pb-20 sm:px-6 md:pt-24 lg:grid-cols-2 lg:gap-12 lg:pb-28">
        <HeroIntro>
          <HeroItem>
            <Badge variant="outline" className="gap-1.5 bg-background">
              <span className="relative flex size-1.5">
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-success opacity-60 motion-reduce:animate-none" />
                <span className="relative inline-flex size-1.5 rounded-full bg-success" />
              </span>
              Версияи бета · Англисӣ A1
            </Badge>
          </HeroItem>
          <HeroItem>
            <h1 className="mt-6 text-4xl font-semibold tracking-tight text-balance sm:text-5xl lg:text-[3.25rem] lg:leading-[1.08]">
              Забони англисиро бо забони <span className="text-shine">тоҷикӣ</span> омӯз
            </h1>
          </HeroItem>
          <HeroItem>
            <p className="mt-5 max-w-xl text-lg text-pretty text-muted-foreground">
              UstodAI ҳар калимаро маҳз ҳамон вақте такрор мекунонад, ки онро фаромӯш карданӣ ҳастӣ. Ҳамаи шарҳҳо бо
              забони модарӣ. Дар як рӯз 15 дақиқа.
            </p>
          </HeroItem>
          <HeroItem className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button asChild size="lg" className="group h-10 px-5">
              <Link href="/auth/sign-up">
                Ройгон оғоз кардан
                <ArrowRight className="transition-transform group-hover:translate-x-0.5" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="h-10 bg-background px-5">
              <a href="#how">Чӣ тавр кор мекунад</a>
            </Button>
          </HeroItem>
          <HeroItem>
            <dl className="mt-12 grid max-w-md grid-cols-3 gap-6 border-t pt-6">
              <div>
                <dt className="text-xl font-semibold tracking-tight tabular-nums">
                  <NumberTicker value={150} />
                </dt>
                <dd className="mt-0.5 text-sm text-muted-foreground">калимаи A1</dd>
              </div>
              <div>
                <dt className="text-xl font-semibold tracking-tight tabular-nums">
                  <NumberTicker value={10} />
                </dt>
                <dd className="mt-0.5 text-sm text-muted-foreground">калимаи нав дар рӯз</dd>
              </div>
              <div>
                <dt className="text-xl font-semibold tracking-tight">FSRS</dt>
                <dd className="mt-0.5 text-sm text-muted-foreground">алгоритми такрор</dd>
              </div>
            </dl>
          </HeroItem>
        </HeroIntro>
        <Reveal delay={0.25}>
          <LessonPreview />
        </Reveal>
      </div>
    </section>
  );
}
