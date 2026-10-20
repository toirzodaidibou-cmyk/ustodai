import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Reveal } from "@/components/motion/reveal";
import { Button } from "@/components/ui/button";

export function Cta() {
  return (
    <section className="border-t py-20 md:py-28">
      <Reveal className="mx-auto flex max-w-6xl flex-col items-start gap-6 px-4 sm:px-6 md:flex-row md:items-end md:justify-between">
        <div className="max-w-xl">
          <h2 className="text-3xl font-semibold tracking-tight text-balance md:text-4xl">Аввалин дарсро имрӯз гузар</h2>
          <p className="mt-3 text-lg text-muted-foreground">
            Ҳисоби ройгон бисоз. Дарси аввал тақрибан 4 дақиқа давом мекунад.
          </p>
        </div>
        <Button asChild size="lg" className="group h-10 px-5">
          <Link href="/auth/sign-up">
            Ройгон оғоз кардан
            <ArrowRight className="transition-transform group-hover:translate-x-0.5" />
          </Link>
        </Button>
      </Reveal>
    </section>
  );
}
