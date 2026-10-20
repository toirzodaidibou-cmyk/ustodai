import type { ReactNode } from "react";
import { Reveal } from "@/components/motion/reveal";
import { cn } from "@/lib/utils";

type Props = {
  id?: string;
  title: string;
  description?: string;
  className?: string;
  children: ReactNode;
};

export function Section({ id, title, description, className, children }: Props) {
  return (
    <section id={id} className={cn("scroll-mt-16 border-t py-20 md:py-28", className)}>
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <Reveal className="max-w-2xl">
          <h2 className="text-3xl font-semibold tracking-tight text-balance md:text-4xl">{title}</h2>
          {description && <p className="mt-3 text-lg text-pretty text-muted-foreground">{description}</p>}
        </Reveal>
        <div className="mt-12">{children}</div>
      </div>
    </section>
  );
}
